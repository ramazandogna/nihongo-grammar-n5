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
  /** Which home-menu folder it sits in. */
  group?: Group
  /** The menu card in English (title and description above are Turkish). */
  en: { title: string; description: string }
}

export type Group = 'school' | 'work' | 'self'

export interface MenuGroup {
  id: Group
  icon: string
  title: string
  description: string
  en: { title: string; description: string }
}

/** The home menu's folders, in order. */
export const GROUPS: readonly MenuGroup[] = [
  {
    id: 'school',
    icon: '📁',
    title: 'Okul Dersleri',
    description: 'Derste gördüğümüz kitaplar ve çalışma yerleri',
    en: { title: 'School Lessons', description: 'The books and study material from class' },
  },
  {
    id: 'work',
    icon: '💼',
    title: 'İş Yeri Japoncası',
    description: 'İşte kullandığım Japonca: müşteri, sipariş, menü',
    en: { title: 'Workplace Japanese', description: 'The Japanese I use at work: customers, orders, menu' },
  },
  {
    id: 'self',
    icon: '📚',
    title: 'Kendi Çalışmam',
    description: 'Sınav hazırlığı ve radikaller',
    en: { title: 'Self Study', description: 'Exam preparation and radicals' },
  },
]

export const HOME: SitePage = {
  path: '/',
  icon: '日',
  title: 'Nihongo',
  description: 'Kişisel Japonca çalışma sitesi: okul dersleri, iş yeri Japoncası, JLPT N5–N3 hazırlığı.',
  palette: 'nord',
  langs: ['tr', 'en'],
  en: {
    title: 'Nihongo',
    description: 'Personal Japanese study site: school lessons, workplace Japanese, JLPT N5–N3 prep.',
  },
}

export const PAGES: readonly SitePage[] = [
  {
    path: '/blue-book/',
    icon: '青',
    title: 'Blue Book',
    description: 'Okuldaki mavi kitap: okuma metinleri, gramer, kelime oyunu, alıştırma ve test — ders ders.',
    palette: 'tokyo-night',
    langs: ['tr'],
    group: 'school',
    en: {
      title: 'Blue Book',
      description:
        'The blue book from school: reading texts, grammar, word game, exercises and tests, lesson by lesson.',
    },
  },
  {
    path: '/business-nihongo/',
    icon: '商',
    title: 'Business Nihongo',
    description: 'ISI ビジネス日本語 中級Ⅰ: şirket duyurusu okuma, 敬語 ile davet, iş yazışması kalıpları.',
    palette: 'rei',
    langs: ['tr'],
    group: 'school',
    en: {
      title: 'Business Nihongo',
      description: 'ISI ビジネス日本語 中級Ⅰ: reading company notices, inviting with 敬語, business writing patterns.',
    },
  },
  {
    path: '/past-n3/',
    icon: '過',
    title: 'N3 Çıkmış Sorular',
    description: 'Çıkmış JLPT N3 sınavları: her soru çözümüyle, okuma metinleri satır satır, dinleme sesli ve metinli.',
    palette: 'solarized',
    langs: ['tr'],
    group: 'self',
    en: {
      title: 'Past N3 Papers',
      description:
        'Past JLPT N3 exams: every question explained, readings line by line, listening with audio and script.',
    },
  },
  {
    path: '/n5/',
    icon: '五',
    title: 'N5 Gramer',
    description: 'N5 dilbilgisi: fiil çekimleri, partikeller, N5 kanjileri, örnek cümleler ve quizler.',
    palette: 'rose-pine',
    langs: ['tr'],
    group: 'school',
    en: {
      title: 'N5 Grammar',
      description: 'N5 grammar: verb forms, particles, N5 kanji, example sentences and quizzes.',
    },
  },
  {
    path: '/n4/',
    icon: '四',
    title: 'N4 Gramer',
    description: 'JLPT N4 dilbilgisinin tamamı: 46 konu, romaji ve Türkçe örnekler, N4 kanji ve kelime, quizler.',
    palette: 'gruvbox',
    langs: ['tr'],
    group: 'school',
    en: {
      title: 'N4 Grammar',
      description: 'All of JLPT N4 grammar: 46 topics, romaji and examples, N4 kanji and vocabulary, quizzes.',
    },
  },
  {
    path: '/n4/13-15/',
    icon: '課',
    title: 'N4 – Gramer 13-15',
    description: '13・14・15課 gramer konuları, diyaloglar ve iki test.',
    palette: 'catppuccin',
    langs: ['tr', 'en', 'zh'],
    group: 'school',
    en: { title: 'N4 Grammar 13–15', description: 'Lessons 13・14・15: grammar points, dialogues and two tests.' },
  },
  {
    path: '/kanji-n3-book/',
    icon: '漢',
    title: 'N3 Kanji Book',
    description: 'N3 kelime/kanji soruları 1–35: okunuş, anlam, kanji parçaları, okuma metinleri ve testler.',
    palette: 'sakura',
    langs: ['tr', 'en', 'zh'],
    group: 'school',
    en: {
      title: 'N3 Kanji Book',
      description: 'N3 vocabulary/kanji questions 1–35, reading (問題4・5), listening lessons and tests.',
    },
  },
  {
    path: '/kanji-book-2/',
    icon: '字',
    title: 'Kanji Book 2',
    description: '18 ünitede 210 kanji: en bilinen kelimeler, furigana, ünite ve dört ünitelik testler.',
    palette: 'sakura',
    langs: ['tr'],
    group: 'school',
    en: {
      title: 'Kanji Book 2',
      description: '210 kanji in 18 units: common words, furigana, unit tests and four-unit tests.',
    },
  },
  {
    path: '/radikaller/',
    icon: '部',
    title: 'Radikaller',
    description: '43 radikal (部首), 347 N3 kanji ve kelimeleri: liste, arama ve radikal/kanji testleri.',
    palette: 'dracula',
    langs: ['tr', 'en'],
    group: 'self',
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
    group: 'work',
    en: {
      title: 'Matsuya Vocabulary',
      description: 'Matsuya workplace Japanese: menu, orders, slips, kitchen and instructions.',
    },
  },
]

export const sitePaths = [HOME, ...PAGES].map((p) => p.path)
