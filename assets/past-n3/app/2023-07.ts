import type { Exam } from '@/pages/past-n3/types'
import { BUNPOU } from './2023-07.bunpou'
import { CHOUKAI } from './2023-07.choukai'
import { MOJI } from './2023-07.moji'

export default {
  id: '2023-07',
  title: '2023年7月 · N3',
  audio: '2023-07.mp3',
  sections: [...MOJI, ...BUNPOU, ...CHOUKAI],
} satisfies Exam
