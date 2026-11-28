<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseButton, BaseSheet } from 'rei-kit'
import { Download, Eye, EyeOff, Upload } from 'lucide-vue-next'

import { applyBackup, collect, markExported, parseBackup, undoImport, type ParseResult } from '@/lib/backup'
import { usePageContext } from '@/lib/page'
import { connect, disconnect, hasLocalProgress, MIN_CODE, probe, syncCode, syncStatus } from '@/lib/sync'

/**
 * Export every saved test and history as one JSON file, and bring one back:
 * checked, previewed, then merged or replaced — with the previous state kept
 * so the import can be undone.
 */
const open = defineModel<boolean>({ required: true })
const emit = defineEmits<{ exported: [] }>()
const { t } = usePageContext()

const note = ref('')
const pasted = ref('')
const parsed = ref<ParseResult | null>(null)
const done = ref(false)
const failed = ref(false)

function fileText() {
  return JSON.stringify(collect(), null, 1)
}
function exportFile() {
  const text = fileText()
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  const d = new Date()
  const ymd = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('-')
  a.download = `nihongo-progress-${ymd}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  markExported()
  emit('exported')
}
async function copy() {
  try {
    await navigator.clipboard.writeText(fileText())
    note.value = t.value.copied
    markExported()
    emit('exported')
  } catch {
    note.value = ''
  }
}
async function onFile(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  if (f.size > 2_000_000) {
    parsed.value = { ok: false, error: 'size' }
    return
  }
  check(await f.text())
}
function check(text: string) {
  done.value = false
  parsed.value = parseBackup(text)
}
function apply(mode: 'merge' | 'replace') {
  if (!parsed.value?.ok) return
  if (applyBackup(parsed.value.file, mode)) {
    done.value = true
    parsed.value = null
    failed.value = false
  } else failed.value = true
}
function undo() {
  if (undoImport()) location.reload()
}
const code = ref('')
const asking = ref(false)
const busy = ref(false)
const syncFailed = ref(false)
const confirmCode = ref('')
const creating = ref(false)
const reveal = ref(false)
const mismatch = computed(() => creating.value && confirmCode.value.trim() !== code.value.trim())
async function run(fn: () => Promise<void>) {
  busy.value = true
  syncFailed.value = false
  try {
    await fn()
  } catch {
    syncFailed.value = true
  } finally {
    busy.value = false
  }
}
/** First press: does this code already have a cloud copy? New code → confirm it; existing → merge question. */
function link() {
  void run(async () => {
    if (creating.value) {
      if (!mismatch.value) await connect(code.value, 'merge')
      return
    }
    if (!(await probe(code.value))) creating.value = true
    else if (hasLocalProgress()) asking.value = true
    else await connect(code.value, 'merge')
  })
}
function choose(mode: 'merge' | 'cloud') {
  asking.value = false
  void run(() => connect(code.value, mode))
}
function edited() {
  creating.value = false
  asking.value = false
  confirmCode.value = ''
}
function reload() {
  location.reload()
}
</script>

<template>
  <BaseSheet v-model="open" :title="t.backup" :close-label="t.close">
    <div class="grid gap-4 text-[15px]">
      <section class="grid gap-2">
        <h3 class="font-semibold">{{ t.sync.title }}</h3>
        <template v-if="syncCode">
          <p role="status" :class="syncStatus === 'error' ? 'text-negative' : 'text-positive'" class="text-sm">
            {{
              syncStatus === 'error'
                ? t.sync.error
                : syncStatus === 'syncing'
                  ? t.sync.syncing
                  : t.sync.on(`•••${syncCode.slice(-2)}`)
            }}
          </p>
          <BaseButton size="sm" variant="ghost" @click="disconnect">{{ t.sync.off }}</BaseButton>
        </template>
        <template v-else>
          <p class="text-ink-soft text-xs">{{ t.sync.hint }}</p>
          <div class="relative">
            <input
              v-model="code"
              :type="reveal ? 'text' : 'password'"
              autocomplete="off"
              class="control focus-ring rounded-control min-h-11 w-full ps-3 pe-11"
              :aria-label="t.sync.placeholder"
              :placeholder="t.sync.placeholder"
              @input="edited"
            />
            <button
              type="button"
              class="focus-ring rounded-control text-ink-soft absolute inset-y-0 end-0 grid w-11 place-items-center"
              :aria-label="reveal ? t.sync.hide : t.sync.show"
              :aria-pressed="reveal"
              @click="reveal = !reveal"
            >
              <EyeOff v-if="reveal" class="size-4" aria-hidden="true" /><Eye v-else class="size-4" aria-hidden="true" />
            </button>
          </div>
          <template v-if="creating">
            <p class="text-sm font-semibold">{{ t.sync.newCode }}</p>
            <input
              v-model="confirmCode"
              :type="reveal ? 'text' : 'password'"
              autocomplete="off"
              class="control focus-ring rounded-control min-h-11 w-full px-3"
              :aria-label="t.sync.confirm"
              :placeholder="t.sync.confirm"
            />
            <p v-if="confirmCode && mismatch" role="alert" class="text-negative text-sm">{{ t.sync.mismatch }}</p>
          </template>
          <div v-if="asking" class="bg-muted rounded-control grid gap-2 p-3">
            <p class="text-sm font-semibold">{{ t.sync.ask }}</p>
            <div class="flex flex-wrap gap-2">
              <BaseButton size="sm" @click="choose('merge')">{{ t.sync.merge }}</BaseButton>
              <BaseButton size="sm" variant="secondary" @click="choose('cloud')">{{ t.sync.cloud }}</BaseButton>
              <BaseButton size="sm" variant="ghost" @click="asking = false">{{ t.sync.cancel }}</BaseButton>
            </div>
          </div>
          <BaseButton v-else block :disabled="busy || code.trim().length < MIN_CODE || mismatch" @click="link">{{
            busy ? t.sync.syncing : creating ? t.sync.create : t.sync.connect
          }}</BaseButton>
          <p v-if="syncFailed" role="alert" class="text-negative text-sm">{{ t.sync.failed }}</p>
        </template>
      </section>

      <section class="border-hair grid gap-2 border-t pt-4">
        <BaseButton block @click="exportFile"
          ><Download class="size-4" aria-hidden="true" />{{ t.exportProgress }}</BaseButton
        >
        <BaseButton variant="ghost" size="sm" @click="copy">{{ t.copyInstead }}</BaseButton>
        <p v-if="note" role="status" class="text-positive text-sm">{{ note }}</p>
      </section>

      <section class="border-hair grid gap-2 border-t pt-4">
        <label
          class="control focus-ring rounded-control flex min-h-11 cursor-pointer items-center justify-center gap-2 px-3"
        >
          <Upload class="size-4" aria-hidden="true" />{{ t.importProgress }}
          <input type="file" accept="application/json,.json" class="sr-only" @change="onFile" />
        </label>
        <textarea
          v-model="pasted"
          rows="3"
          class="control focus-ring rounded-control w-full px-3 py-2 font-mono text-xs"
          :aria-label="t.pasteHere"
          :placeholder="t.pasteHere"
        />
        <BaseButton v-if="pasted.trim()" size="sm" variant="secondary" @click="check(pasted)">{{ t.check }}</BaseButton>

        <div v-if="parsed && !parsed.ok" role="alert" class="text-negative text-sm">
          {{ t.importError[parsed.error] }}
        </div>
        <div v-else-if="parsed?.ok" class="bg-muted rounded-control grid gap-2 p-3">
          <p class="font-semibold">
            {{ t.importPreview(parsed.preview.runs, parsed.preview.histories, parsed.preview.attempts) }}
          </p>
          <p v-if="parsed.preview.newest" class="text-ink-soft text-sm">
            {{ t.newest }}: {{ new Date(parsed.preview.newest).toLocaleString() }}
          </p>
          <p class="text-ink-soft text-xs">{{ t.mergeHint }}</p>
          <div class="flex gap-2">
            <BaseButton class="flex-1" @click="apply('merge')">{{ t.merge }}</BaseButton>
            <BaseButton class="flex-1" variant="secondary" @click="apply('replace')">{{ t.replace }}</BaseButton>
          </div>
        </div>
        <p v-if="failed" role="alert" class="text-negative text-sm">{{ t.storageError }}</p>
        <div v-if="done" role="status" class="text-positive grid gap-2 text-sm">
          {{ t.imported }}
          <div class="flex gap-2">
            <BaseButton size="sm" @click="reload">OK</BaseButton>
            <BaseButton size="sm" variant="ghost" @click="undo">{{ t.undo }}</BaseButton>
          </div>
        </div>
      </section>
    </div>
  </BaseSheet>
</template>
