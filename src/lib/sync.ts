import { ref } from 'vue'
import { applyBackup, collect, parseBackup, type BackupFile } from './backup'

/**
 * Code-based cloud copy, no account and no backend of our own.
 * From the learner's code (Web Crypto): slot = SHA-256 → where the copy lives,
 * key = PBKDF2 → AES-GCM. textdb.dev only ever sees ciphertext.
 * localStorage stays the primary store; sync only merges, never deletes.
 */
const ENDPOINT = 'https://textdb.dev/api/data/'
const CODE_KEY = 'nihongo-backup-sync-code' // `nihongo-backup*` keys are never carried in a backup
const AT_KEY = 'nihongo-backup-sync-at'
export const MIN_CODE = 6
const enc = new TextEncoder()

interface Keys {
  slot: string
  key: CryptoKey
}
const toHex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')
function toB64(buf: ArrayBuffer) {
  const u = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000))
  return btoa(s)
}
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))
const ls = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k)
    } catch {
      return null
    }
  },
  set: (k: string, v: string | null) => {
    try {
      if (v === null) localStorage.removeItem(k)
      else localStorage.setItem(k, v)
    } catch {
      /* blocked */
    }
  },
}

async function deriveKeys(code: string): Promise<Keys> {
  const slot = toHex(await crypto.subtle.digest('SHA-256', enc.encode(`nihongo/slot/v1:${code}`)))
  const material = await crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveKey'])
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('nihongo/sync/v1'), iterations: 210_000, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
  return { slot, key }
}

async function request(url: string, init?: RequestInit) {
  let res: Response | undefined
  for (let i = 0; i < 2 && !res; i++) {
    try {
      res = await fetch(url, { ...init, cache: 'no-store', signal: AbortSignal.timeout(20_000) })
    } catch {
      /* retry once */
    }
  }
  if (!res?.ok) throw new Error('unreachable')
  return res
}

async function pull(k: Keys): Promise<BackupFile | null> {
  const text = (await (await request(ENDPOINT + k.slot)).text()).trim()
  if (!text) return null
  const env = JSON.parse(text) as { app: string; iv: string; ct: string }
  if (env.app !== 'nihongo-sync') throw new Error('foreign')
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(env.iv) }, k.key, fromB64(env.ct))
  const r = parseBackup(new TextDecoder().decode(plain))
  if (!r.ok) throw new Error(r.error)
  return r.file
}

async function push(k: Keys, b: BackupFile) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k.key, enc.encode(JSON.stringify(b)))
  await request(ENDPOINT + k.slot, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ app: 'nihongo-sync', iv: toB64(iv.buffer), ct: toB64(ct) }),
  })
}

export const syncCode = ref<string | null>(null)
export const syncStatus = ref<'idle' | 'syncing' | 'error'>('idle')
let keys: Keys | null = null
let timer: ReturnType<typeof setTimeout> | undefined
let running: Promise<void> | null = null
let again = false
const fp = (b: BackupFile) => JSON.stringify(b.data)
let lastPushed = ''

async function syncOnce() {
  if (!keys) return
  syncStatus.value = 'syncing'
  try {
    const remote = await pull(keys)
    if (remote && remote.at !== ls.get(AT_KEY)) applyBackup(remote, 'merge')
    const local = collect()
    if (fp(local) !== lastPushed || !remote) {
      await push(keys, local)
      lastPushed = fp(local)
      ls.set(AT_KEY, local.at)
    }
    syncStatus.value = 'idle'
  } catch {
    syncStatus.value = 'error'
    clearTimeout(timer)
    timer = setTimeout(() => void syncNow(), 60_000)
  }
}

/** Serialised: overlapping calls coalesce into one follow-up run. */
export function syncNow(): Promise<void> {
  clearTimeout(timer)
  if (running) {
    again = true
    return running
  }
  running = syncOnce().finally(() => {
    running = null
    if (again) {
      again = false
      void syncNow()
    }
  })
  return running
}

/** Called after every saved answer / finished test; debounced. */
export function requestSync() {
  if (!keys) return
  clearTimeout(timer)
  timer = setTimeout(() => void syncNow(), 2500)
}

const onWake = () => {
  if (keys && document.visibilityState !== 'hidden') void syncNow()
}

/** Client-only, once at app start. */
export async function bootSync() {
  const c = ls.get(CODE_KEY)
  if (!c || keys) return
  syncCode.value = c
  keys = await deriveKeys(c)
  document.addEventListener('visibilitychange', onWake)
  window.addEventListener('online', onWake)
  await syncNow()
}

export const hasLocalProgress = () =>
  Object.keys(collect().data).some((k) => k.startsWith('nihongo-history:') || k.startsWith('nihongo-run:'))

/** Whether a cloud copy exists for this code — false means the code is being created now. */
export async function probe(raw: string): Promise<boolean> {
  const c = raw.trim()
  if (c.length < MIN_CODE) throw new Error('short')
  return (await pull(await deriveKeys(c))) !== null
}

/**
 * Connect a code. `merge` keeps this device's progress and joins it with the cloud copy;
 * `cloud` takes the cloud copy (this device's state stays in `nihongo-backup:last`).
 */
export async function connect(raw: string, mode: 'merge' | 'cloud'): Promise<void> {
  const c = raw.trim()
  if (c.length < MIN_CODE) throw new Error('short')
  const k = await deriveKeys(c)
  const remote = await pull(k)
  if (remote && !applyBackup(remote, mode === 'cloud' ? 'replace' : 'merge')) throw new Error('storage')
  await push(k, collect())
  ls.set(CODE_KEY, c)
  location.reload()
}

/** Stop syncing on this device. Local progress stays. */
export function disconnect() {
  for (const k of [CODE_KEY, AT_KEY]) ls.set(k, null)
  location.reload()
}
