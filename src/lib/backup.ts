import { isExamState } from '@/engine/exam'
import { isAttempt, isSavedRun, type Attempt } from './quiz-store'

/**
 * Progress backup: every `nihongo-*` key of this browser in one JSON file,
 * and a careful way back in.
 *
 * Nothing is moved or renamed — the file is a copy of the keys as they are.
 * An import is checked line by line, previewed, and written only after a
 * backup of the current state has been kept under `nihongo-backup:last`.
 */

export const BACKUP_FORMAT = 'nihongo-progress'
export const BACKUP_VERSION = 1
const MAX_BYTES = 2_000_000
/** The safety copy may be larger than an imported file. */
const MAX_SAFETY_BYTES = 6_000_000
const KEY_RE = /^nihongo-[\w./:-]{1,200}$/
/** Keys a backup never carries: the backups themselves. */
const SKIP = (k: string) => k.startsWith('nihongo-backup')
const LAST_EXPORT = 'nihongo-backup-at'
const SAFETY = 'nihongo-backup:last'
const FORBIDDEN = new Set(['__proto__', 'constructor', 'prototype'])

export interface BackupFile {
  format: typeof BACKUP_FORMAT
  v: number
  at: string
  data: Record<string, string>
}

export interface Preview {
  runs: number
  histories: number
  attempts: number
  other: number
  newest: string | null
}

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'key' | 'length'>
const ls = (): Store | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

function keys(s: Store): string[] {
  const out: string[] = []
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i)
    if (k && KEY_RE.test(k) && !SKIP(k)) out.push(k)
  }
  return out.sort()
}

/** Everything this browser has stored for the site, as a backup file. */
export function collect(s: Store | null = ls()): BackupFile {
  const data: Record<string, string> = Object.create(null)
  if (s) for (const k of keys(s)) data[k] = s.getItem(k) ?? ''
  return { format: BACKUP_FORMAT, v: BACKUP_VERSION, at: new Date().toISOString(), data }
}

export function markExported(s: Store | null = ls()) {
  try {
    s?.setItem(LAST_EXPORT, new Date().toISOString())
  } catch {
    // Not kept: the reminder will simply come back.
  }
}
/** Days since the last export, or null if never. */
export function daysSinceExport(s: Store | null = ls(), now = Date.now()): number | null {
  try {
    const v = s?.getItem(LAST_EXPORT)
    if (!v) return null
    const t = Date.parse(v)
    return Number.isFinite(t) ? Math.floor((now - t) / 86_400_000) : null
  } catch {
    return null
  }
}
/** There is progress worth keeping and no export in the last 14 days. */
export function needsBackup(s: Store | null = ls(), now = Date.now()): boolean {
  if (!s) return false
  const hasProgress = keys(s).some((k) => k.startsWith('nihongo-history:') || k.startsWith('nihongo-run:'))
  if (!hasProgress) return false
  const d = daysSinceExport(s, now)
  return d === null || d >= 14
}

const hasAngle = (x: unknown): boolean =>
  typeof x === 'string'
    ? /[<>]/.test(x)
    : Array.isArray(x)
      ? x.some(hasAngle)
      : !!x && typeof x === 'object' && Object.values(x).some(hasAngle)

/** Labels and paths that the mistakes list renders must be plain text. */
function unsafeMisses(misses: unknown[]): boolean {
  return misses.some((m) => {
    const o = (Array.isArray(m) ? m[1] : m) as { label?: unknown; path?: unknown }
    return hasAngle(o?.label) || hasAngle(o?.path)
  })
}

export type ParseResult = { ok: true; file: BackupFile; preview: Preview } | { ok: false; error: ImportError }
export type ImportError = 'size' | 'json' | 'format' | 'version' | 'key' | 'value'

/** Check a backup file, line by line. Nothing is written. */
export function parseBackup(text: string, max = MAX_BYTES): ParseResult {
  if (text.length > max) return { ok: false, error: 'size' }
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, error: 'json' }
  }
  if (!raw || typeof raw !== 'object' || (raw as BackupFile).format !== BACKUP_FORMAT)
    return { ok: false, error: 'format' }
  const f = raw as BackupFile
  if (f.v !== BACKUP_VERSION) return { ok: false, error: 'version' }
  if (!f.data || typeof f.data !== 'object' || Array.isArray(f.data)) return { ok: false, error: 'format' }
  const data: Record<string, string> = Object.create(null)
  const preview: Preview = { runs: 0, histories: 0, attempts: 0, other: 0, newest: null }
  const seen = (at: unknown) => {
    if (typeof at === 'string' && (!preview.newest || at > preview.newest)) preview.newest = at
  }
  for (const k of Object.keys(f.data)) {
    if (FORBIDDEN.has(k) || !KEY_RE.test(k) || SKIP(k)) return { ok: false, error: 'key' }
    const v = (f.data as Record<string, unknown>)[k]
    if (typeof v !== 'string') return { ok: false, error: 'value' }
    if (k.startsWith('nihongo-run:')) {
      let run: unknown
      try {
        run = JSON.parse(v)
      } catch {
        return { ok: false, error: 'value' }
      }
      if (!isSavedRun(run) || hasAngle((run as { misses: unknown[] }).misses) || unsafeMisses(run.misses))
        return { ok: false, error: 'value' }
      preview.runs++
      seen((run as { at?: unknown }).at)
    } else if (k.startsWith('nihongo-history:')) {
      let h: unknown
      try {
        h = JSON.parse(v)
      } catch {
        return { ok: false, error: 'value' }
      }
      if (!Array.isArray(h) || !h.every(isAttempt) || h.some((a) => unsafeMisses(a.misses)))
        return { ok: false, error: 'value' }
      preview.histories++
      preview.attempts += h.length
      h.forEach((a) => seen(a.at))
    } else if (k.startsWith('nihongo-exam:')) {
      let e: unknown
      try {
        e = JSON.parse(v)
      } catch {
        return { ok: false, error: 'value' }
      }
      if (!isExamState(e)) return { ok: false, error: 'value' }
      preview.other++
    } else {
      if (v.length > 10_000) return { ok: false, error: 'value' }
      preview.other++
    }
    data[k] = v
  }
  return { ok: true, file: { ...f, data }, preview }
}

/** Two histories as one: by time, no duplicates, newest 50. */
export function mergeHistory(a: Attempt[], b: Attempt[], cap = 50): Attempt[] {
  const byKey = new Map<string, Attempt>()
  for (const x of [...a, ...b]) byKey.set(`${x.at}|${x.tries}|${x.wrong}`, x)
  return [...byKey.values()].sort((x, y) => x.at.localeCompare(y.at)).slice(-cap)
}

/**
 * Write a checked backup. `replace` makes the stored keys exactly the file's;
 * `merge` keeps what is here, unions histories and keeps the newer run.
 * The current state is saved under `nihongo-backup:last` first.
 */
export function applyBackup(file: BackupFile, mode: 'merge' | 'replace', s: Store | null = ls()): boolean {
  if (!s) return false
  try {
    const before = collect(s)
    s.setItem(SAFETY, JSON.stringify(before))
    if (mode === 'replace') for (const k of keys(s)) if (!(k in file.data)) s.removeItem(k)
    for (const [k, v] of Object.entries(file.data)) {
      const cur = s.getItem(k)
      if (mode === 'merge' && cur !== null) {
        if (k.startsWith('nihongo-history:')) {
          const mine = safeJson(cur)
          const theirs = safeJson(v)
          const a = Array.isArray(mine) ? mine.filter(isAttempt) : []
          const b = Array.isArray(theirs) ? theirs.filter(isAttempt) : []
          s.setItem(k, JSON.stringify(mergeHistory(a, b)))
          continue
        }
        if (k.startsWith('nihongo-run:')) {
          const mine = safeJson(cur) as { at?: string } | null
          const theirs = safeJson(v) as { at?: string } | null
          if ((mine?.at ?? '') >= (theirs?.at ?? '')) continue
        } else continue // preferences: keep this device's
      }
      s.setItem(k, v)
    }
    return true
  } catch {
    // Half written: put back what was here before, so nothing is mixed.
    try {
      const raw = s.getItem(SAFETY)
      const r = raw ? parseBackup(raw) : null
      if (r?.ok) {
        for (const k of keys(s)) if (!(k in r.file.data)) s.removeItem(k)
        for (const [k, v] of Object.entries(r.file.data)) s.setItem(k, v)
      }
    } catch {
      // Storage unusable: the safety copy, if written, is still there.
    }
    return false
  }
}

/** Put back the state saved just before the last import. */
export function undoImport(s: Store | null = ls()): boolean {
  const raw = s?.getItem(SAFETY)
  if (!s || !raw) return false
  const r = parseBackup(raw, MAX_SAFETY_BYTES)
  return r.ok ? applyBackup(r.file, 'replace', s) : false
}

function safeJson(v: string): unknown {
  try {
    return JSON.parse(v)
  } catch {
    return null
  }
}
