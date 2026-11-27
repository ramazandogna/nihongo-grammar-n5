/**
 * Every page of the site, in menu order.
 *
 * The one place a new page is registered: the home menu, the page's <head>
 * and the prerender list all read this. The route itself comes from the
 * folder (`src/pages/<path>/index.vue`), so the URL is the folder name — the
 * same URLs the old single-file pages had.
 *
 * Plain data with no imports, because `vite.config.ts` reads it too.
 */
export type Lang = 'tr' | 'en' | 'zh'

/** rei-kit's palettes. Each page picks one; the shared layout does the rest. */
export type Palette =
  | 'rei'
  | 'nord'
  | 'dracula'
  | 'catppuccin'
  | 'solarized'
  | 'gruvbox'
  | 'tokyo-night'
  | 'rose-pine'
  | 'sakura'
  | 'matcha'

export interface SitePage {
  path: string
  icon: string
  title: string
  description: string
  palette: Palette
  /** Languages the page's content exists in. One means no language switch. */
  langs: readonly Lang[]
  /** Which home-menu block it sits in. */
  group?: Group
  /**
   * Kept as a page (route, head, prerender, saved progress) but not listed in
   * the home menu: it is reached from another page of the same source.
   */
  hidden?: boolean
  /** The menu card in English (title and description above are Turkish). */
  en: { title: string; description: string }
}

export type Group = 'grammar' | 'jlpt' | 'reading' | 'kanji' | 'phrases'

export interface MenuGroup {
  id: Group
  /** Icon name, drawn by the home page (lucide). */
  icon: 'grammar' | 'jlpt' | 'reading' | 'kanji' | 'phrases'
  title: string
  description: string
  en: { title: string; description: string }
}

/** The home menu's blocks, in order. */
export const GROUPS: readonly MenuGroup[] = [
  {
    id: 'grammar',
    icon: 'grammar',
    title: 'Gramer',
    description: 'N5, N4 ve N3 dilbilgisi',
    en: { title: 'Grammar', description: 'N5, N4 and N3 grammar' },
  },
  {
    id: 'jlpt',
    icon: 'jlpt',
    title: 'JLPT',
    description: 'Çıkmış N3 sınavları: kelime, gramer, okuma, dinleme',
    en: { title: 'JLPT', description: 'Past N3 papers: vocabulary, grammar, reading, listening' },
  },
  {
    id: 'reading',
    icon: 'reading',
    title: 'Okuma',
    description: 'Okuma ve dinleme',
    en: { title: 'Reading', description: 'Reading and listening' },
  },
  {
    id: 'kanji',
    icon: 'kanji',
    title: 'Kanji',
    description: 'Kanji kitabı ve radikaller',
    en: { title: 'Kanji', description: 'The kanji book and radicals' },
  },
  {
    id: 'phrases',
    icon: 'phrases',
    title: 'İfadeler',
    description: 'İş yeri ve iş Japoncası: müşteri, sipariş, yazışma',
    en: { title: 'Expressions', description: 'Workplace and business Japanese: customers, orders, writing' },
  },
]

export const HOME: SitePage = {
  path: '/',
  icon: '日',
  title: 'Nihongo',
  description: 'Kişisel Japonca çalışma sitesi: gramer, okuma, kanji ve iş yeri ifadeleri, JLPT N5–N3 hazırlığı.',
  palette: 'nord',
  langs: ['tr', 'en'],
  en: {
    title: 'Nihongo',
    description: 'Personal Japanese study site: grammar, reading, kanji and workplace expressions, JLPT N5–N3 prep.',
  },
}

export const PAGES: readonly SitePage[] = [
  {
    path: '/n5/',
    icon: '五',
    title: 'N5 Gramer',
    description: 'N5 dilbilgisi: fiil çekimleri, partikeller, N5 kanjileri, örnek cümleler ve quizler.',
    palette: 'rose-pine',
    langs: ['tr'],
    group: 'grammar',
    en: {
      title: 'N5 Grammar',
      description: 'N5 grammar: verb forms, particles, N5 kanji, example sentences and quizzes.',
    },
  },
  {
    path: '/n4/',
    icon: '四',
    title: 'N4 Gramer',
    description: 'JLPT N4 dilbilgisinin tamamı: 46 konu, N4 kanji ve kelime, quizler; ayrıca 13・14・15課 dersleri ve testleri.',
    palette: 'gruvbox',
    langs: ['tr'],
    group: 'grammar',
    en: {
      title: 'N4 Grammar',
      description: 'All of JLPT N4 grammar: 46 topics, N4 kanji and vocabulary, quizzes; plus lessons 13・14・15 and their tests.',
    },
  },
  {
    path: '/n4/13-15/',
    icon: '課',
    title: 'N4 – Gramer 13-15',
    description: '13・14・15課 gramer konuları, diyaloglar ve iki test.',
    palette: 'catppuccin',
    langs: ['tr', 'en', 'zh'],
    group: 'grammar',
    hidden: true,
    en: { title: 'N4 Grammar 13–15', description: 'Lessons 13・14・15: grammar points, dialogues and two tests.' },
  },
  {
    path: '/blue-book/',
    icon: '青',
    title: 'N3 Blue Book',
    description: 'Okuldaki mavi kitap: okuma metinleri, gramer, kelime oyunu, alıştırma ve test — ders ders.',
    palette: 'tokyo-night',
    langs: ['tr'],
    group: 'grammar',
    en: {
      title: 'N3 Blue Book',
      description:
        'The blue book from school: reading texts, grammar, word game, exercises and tests, lesson by lesson.',
    },
  },
  {
    path: '/past-n3/',
    icon: '過',
    title: 'N3 Çıkmış Sorular',
    description: 'Çıkmış JLPT N3 sınavları: her soru çözümüyle, okuma metinleri satır satır, dinleme sesli ve metinli.',
    palette: 'solarized',
    langs: ['tr'],
    group: 'jlpt',
    en: {
      title: 'Past N3 Papers',
      description:
        'Past JLPT N3 exams: every question explained, readings line by line, listening with audio and script.',
    },
  },
  {
    path: '/kanji-n3-book/',
    icon: '読',
    title: 'N3 Okuma · Dinleme',
    description: 'N3 okuma (問題4・5) metinleri ve soruları, dinleme (聴解) dersleri: adım adım, nedenleriyle.',
    palette: 'sakura',
    langs: ['tr'],
    group: 'reading',
    en: {
      title: 'N3 Reading · Listening',
      description: 'N3 reading (問題4・5) passages and questions, listening (聴解) lessons, step by step.',
    },
  },
  {
    path: '/kanji-book-2/',
    icon: '字',
    title: 'Kanji Book 2',
    description: '18 ünitede 210 kanji: en bilinen kelimeler, furigana, ünite ve dört ünitelik testler.',
    palette: 'nord',
    langs: ['tr'],
    group: 'kanji',
    en: {
      title: 'Kanji Book 2',
      description: '210 kanji in 18 units: common words, furigana, unit tests and four-unit tests.',
    },
  },
  {
    path: '/radikaller/',
    icon: '部',
    title: 'Radikaller',
    description: '55 radikal (部首), 378 N3 kanji ve kelimeleri: liste, arama ve radikal/kanji testleri.',
    palette: 'rei',
    langs: ['tr'],
    group: 'kanji',
    en: {
      title: 'Radicals',
      description: '43 radicals (部首), 347 N3 kanji and their words: in-depth lessons and tests.',
    },
  },
  {
    path: '/matsuya/',
    icon: '丼',
    title: 'Matsuya Kelimeleri',
    description: 'Matsuya iş yeri kelimeleri: menü, sipariş, fiş, mutfak ve talimatlar.',
    palette: 'matcha',
    langs: ['tr'],
    group: 'phrases',
    en: {
      title: 'Matsuya Vocabulary',
      description: 'Matsuya workplace Japanese: menu, orders, slips, kitchen and instructions.',
    },
  },
  {
    path: '/business-nihongo/',
    icon: '商',
    title: 'Business Nihongo',
    description: 'ISI ビジネス日本語 中級Ⅰ: şirket duyurusu okuma, 敬語 ile davet, iş yazışması kalıpları.',
    palette: 'rei',
    langs: ['tr'],
    group: 'phrases',
    en: {
      title: 'Business Nihongo',
      description: 'ISI ビジネス日本語 中級Ⅰ: reading company notices, inviting with 敬語, business writing patterns.',
    },
  },
]

export const sitePaths = [HOME, ...PAGES].map((p) => p.path)
