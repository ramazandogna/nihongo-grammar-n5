import { describe, expect, it } from 'vitest'
import { indexOkuma, okumaGlosses, okumaPrompt, segments, shownTarget, type OkumaQuestion } from './okuma'

const base = { word: '海外', reading: 'かいがい', meaning_tr: 'yurt dışı', explain_tr: '', n: 1 }
const yomi: OkumaQuestion = { ...base, type: 'yomi', sentence: '[[海外]]へ行く。', options: ['かいがい', 'かいかい', 'がいがい', 'かいがえ'] }
const hyouki: OkumaQuestion = { ...base, n: 6, type: 'hyouki', sentence: '[[かいがい]]へ行く。', options: ['海外', '毎外', '海外い', '侮外'] }
const bun: OkumaQuestion = { ...base, n: 11, type: 'bunmyaku', sentence: '（　　）へ行く。', options: ['海外', '海岸', '海水', '海辺'] }

describe('okuma', () => {
  it('splits targets', () => {
    expect(segments('a[[1|海外]]b[[12|水]]')).toEqual([{ text: 'a' }, { n: 1, word: '海外' }, { text: 'b' }, { n: 12, word: '水' }])
  })
  it('builds prompts in notation', () => {
    expect(okumaPrompt(yomi)).toBe('[海外]へ行く。')
    expect(okumaPrompt(hyouki)).toBe('[かいがい]へ行く。')
    expect(okumaPrompt({ ...hyouki, sentence: '[[海外]]へ行く。' })).toBe('[かいがい]へ行く。')
    expect(okumaPrompt(bun)).toBe('（　　）へ行く。')
  })
  it('masks other hyouki/bunmyaku targets in a sentence', () => {
    const h2: OkumaQuestion = { ...hyouki, n: 8, word: '洗濯', reading: 'せんたく' }
    const b2: OkumaQuestion = { ...bun, n: 12, word: '海岸' }
    const q: OkumaQuestion = { ...yomi, sentence: '洗濯して[[海外]]の海岸へ。' }
    expect(okumaPrompt(q, [q, h2, b2])).toBe('せんたくして[海外]の（　　）へ。')
  })
  it('glosses only the target', () => {
    expect(okumaGlosses(yomi)).toEqual(['海外 · yurt dışı', '', '', ''])
    expect(okumaGlosses(bun)).toEqual(['かいがい · yurt dışı', '', '', ''])
  })
  it('hides answers in the passage', () => {
    expect(shownTarget(yomi, '海外', false)).toBe('海外')
    expect(shownTarget(hyouki, '海外', false)).toBe('かいがい')
    expect(shownTarget(bun, '海外', false)).toBe('（　　）')
    expect(shownTarget(bun, '海外', true)).toBe('海外')
  })
  it('indexes files by radical, skipping samples and bad files', () => {
    const o = { radicalId: 3, title: '', title_tr: '', text: 'x', text_tr: '', questions: [yomi] }
    const m = indexOkuma({ './okuma/3.json': { default: o }, './okuma/_sample.json': { default: { ...o, radicalId: 4 } }, './okuma/x.json': {} })
    expect([...m.keys()]).toEqual([3])
  })
})
