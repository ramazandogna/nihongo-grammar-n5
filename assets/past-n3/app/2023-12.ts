import type { Exam } from '@/pages/past-n3/types'
import { BUNPOU } from './2023-12.bunpou'
import { CHOUKAI } from './2023-12.choukai'
import { MOJI } from './2023-12.moji'

export default {
  id: '2023-12',
  title: '2023年12月 · N3',
  audio: '2023-12.mp3',
  sections: [...MOJI, ...BUNPOU, ...CHOUKAI],
} satisfies Exam
