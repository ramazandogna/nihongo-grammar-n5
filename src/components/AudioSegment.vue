<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { LoaderCircle, Pause, Play, RotateCcw, TriangleAlert } from 'lucide-vue-next'

import { usePageContext } from '@/lib/page'

/**
 * Plays one stretch of a long recording — a listening question from its
 * start to where the next one begins — with play/pause, a progress bar and
 * the time.
 *
 * `once`: exam conditions. The stretch can be started once and is not
 * seekable or replayable; the reader is told when it has been played.
 */
const {
  src,
  start,
  end,
  once = false,
  spent = false,
} = defineProps<{
  src: string
  start: number
  /** Where the stretch ends, in seconds; undefined = end of file. */
  end?: number
  once?: boolean
  /** Exam mode: already played on an earlier visit to this question. */
  spent?: boolean
}>()
const emit = defineEmits<{ played: [] }>()
const { lang } = usePageContext()
const L = computed(() =>
  lang.value === 'tr'
    ? {
        play: 'Dinle',
        pause: 'Duraklat',
        replay: 'Baştan dinle',
        loading: 'Ses yükleniyor…',
        error: 'Ses açılamadı. Dosya bu yapıda yok ya da tarayıcı oynatamıyor.',
        usedUp: 'Sınav koşulu: bu ses bir kez çalındı.',
        onceHint: 'Sınav koşulu: yalnızca bir kez dinleyebilirsin.',
      }
    : {
        play: 'Listen',
        pause: 'Pause',
        replay: 'Play again',
        loading: 'Loading audio…',
        error: 'The audio could not be opened. The file is not in this build or the browser cannot play it.',
        usedUp: 'Exam condition: this audio has been played once.',
        onceHint: 'Exam condition: you can listen only once.',
      },
)

const audio = ref<HTMLAudioElement | null>(null)
/** Stop exactly at `end`: timeupdate alone fires too rarely and lets the next question leak in. */
let raf = 0
function watchEnd() {
  cancelAnimationFrame(raf)
  const step = () => {
    const a = audio.value
    if (!a || a.paused) return
    if (end !== undefined && a.currentTime >= end - 0.05) {
      a.pause()
      state.value = 'ended'
      return
    }
    raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}
const state = ref<'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'>('idle')
const now = ref(start)
const total = ref<number | null>(null)
const startedOnce = ref(false)

const stop = computed(() => end ?? total.value ?? start)
const length = computed(() => Math.max(0, stop.value - start))
const elapsed = computed(() => Math.min(length.value, Math.max(0, now.value - start)))
const pct = computed(() => (length.value ? (elapsed.value / length.value) * 100 : 0))
const usedUp = computed(
  () => once && (spent ? state.value !== 'playing' : startedOnce.value && state.value === 'ended'),
)
const clock = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`

function el(): HTMLAudioElement {
  if (!audio.value) {
    const a = new Audio()
    a.preload = 'metadata'
    a.src = src
    a.addEventListener('loadedmetadata', () => (total.value = a.duration))
    a.addEventListener('timeupdate', () => {
      now.value = a.currentTime
      if (a.currentTime >= stop.value - 0.05 && end !== undefined) {
        a.pause()
        state.value = 'ended'
      }
    })
    a.addEventListener('playing', () => (state.value = 'playing'))
    // Paused by the system (a call, headphones unplugged): playable again —
    // in exam mode it continues from where it stopped, it does not restart.
    a.addEventListener('pause', () => {
      if (state.value === 'playing' || state.value === 'loading') state.value = 'paused'
    })
    a.addEventListener('waiting', () => (state.value = 'loading'))
    a.addEventListener('ended', () => (state.value = 'ended'))
    a.addEventListener('error', () => (state.value = 'error'))
    audio.value = a
  }
  return audio.value
}
async function play(fromStart = false) {
  if (usedUp.value || (once && startedOnce.value && fromStart)) return
  const a = el()
  const restart = fromStart || state.value === 'idle' || state.value === 'ended'
  state.value = 'loading'
  try {
    // Seek once metadata is there: Safari ignores a seek on a fresh element.
    if (restart) {
      if (a.readyState < 1) await new Promise((r) => a.addEventListener('loadedmetadata', r, { once: true }))
      a.currentTime = start
    }
    await a.play()
    watchEnd()
    if (!startedOnce.value) emit('played')
    startedOnce.value = true
  } catch {
    if (a.error) state.value = 'error'
    else state.value = 'paused'
  }
}
function pause() {
  if (once) return
  audio.value?.pause()
  state.value = 'paused'
}
function seek(e: MouseEvent) {
  if (once || !length.value) return
  const box = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const a = el()
  a.currentTime = start + ((e.clientX - box.left) / box.width) * length.value
  now.value = a.currentTime
}
watch(
  () => [src, start, end],
  () => {
    audio.value?.pause()
    audio.value = null
    state.value = 'idle'
    now.value = start
    startedOnce.value = false
  },
)
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  audio.value?.pause()
})
defineExpose({ pause: () => audio.value?.pause() })
</script>

<template>
  <div class="bg-muted rounded-control grid gap-2 p-3">
    <div class="flex items-center gap-3">
      <button
        v-if="state === 'playing' && !once"
        type="button"
        class="bg-primary text-on-primary focus-ring grid size-12 shrink-0 place-items-center rounded-full"
        :aria-label="L.pause"
        @click="pause"
      >
        <Pause class="size-5" aria-hidden="true" />
      </button>
      <button
        v-else
        type="button"
        class="bg-primary text-on-primary focus-ring grid size-12 shrink-0 place-items-center rounded-full disabled:opacity-40"
        :aria-label="L.play"
        :disabled="usedUp || state === 'error' || (once && state === 'playing')"
        @click="play()"
      >
        <LoaderCircle v-if="state === 'loading'" class="size-5 animate-spin" aria-hidden="true" />
        <Play v-else class="size-5" aria-hidden="true" />
      </button>
      <div class="min-w-0 flex-1">
        <div
          class="bg-hair h-2 overflow-hidden rounded-full"
          :class="once ? '' : 'cursor-pointer'"
          role="progressbar"
          :aria-valuenow="Math.round(pct)"
          aria-valuemin="0"
          aria-valuemax="100"
          @click="seek"
        >
          <div class="bg-primary h-full rounded-full" :style="{ width: `${pct}%` }" />
        </div>
        <p class="text-ink-soft mt-1 flex justify-between text-xs tabular-nums">
          <span>{{ clock(elapsed) }}</span>
          <span>{{ length ? clock(length) : '–:––' }}</span>
        </p>
      </div>
      <button
        v-if="!once && (state === 'ended' || state === 'paused')"
        type="button"
        class="focus-ring text-ink-soft hover:text-ink grid size-11 shrink-0 place-items-center rounded-full"
        :aria-label="L.replay"
        @click="play(true)"
      >
        <RotateCcw class="size-5" aria-hidden="true" />
      </button>
    </div>
    <p v-if="state === 'loading'" role="status" class="text-ink-soft text-xs">{{ L.loading }}</p>
    <p v-if="state === 'error'" role="alert" class="text-negative flex items-center gap-1 text-xs">
      <TriangleAlert class="size-3.5" aria-hidden="true" />{{ L.error }}
    </p>
    <p v-else-if="usedUp" class="text-ink-soft text-xs">{{ L.usedUp }}</p>
    <p v-else-if="once" class="text-ink-soft text-xs">{{ L.onceHint }}</p>
  </div>
</template>
