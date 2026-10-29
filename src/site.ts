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
  | 'rei' | 'nord' | 'dracula' | 'catppuccin' | 'solarized'
  | 'gruvbox' | 'tokyo-night' | 'rose-pine' | 'sakura' | 'matcha'

export interface SitePage {
  path: string
  icon: string
  title: string
  description: string
  palette: Palette
  /** Languages the page's content exists in. One means no language switch. */
  langs: readonly Lang[]
}

export const HOME: SitePage = {
  path: '/',
  icon: '日',
  title: 'Nihongo',
  description: 'Kişisel Japonca çalışma sitesi: N5 ve N4 gramer, kanji kitapları ve kelime setleri.',
  palette: 'nord',
  langs: ['tr', 'en', 'zh'],
}

export const PAGES: readonly SitePage[] = [
  {
    path: '/blue-book/',
    icon: '青',
    title: 'Blue Book',
    description: 'Okuldaki mavi kitap: okuma metinleri, gramer, kelime oyunu, alıştırma ve test — ders ders.',
    palette: 'tokyo-night',
    langs: ['tr'],
  },
  {
    path: '/business-nihongo/',
    icon: '商',
    title: 'Business Nihongo',
    description: 'ISI ビジネス日本語 中級Ⅰ: şirket duyurusu okuma, 敬語 ile davet, iş yazışması kalıpları.',
    palette: 'rei',
    langs: ['tr'],
  },
  {
    path: '/n5/',
    icon: '五',
    title: 'N5 Gramer',
    description: 'N5 dilbilgisi: fiil çekimleri, partikeller, N5 kanjileri, örnek cümleler ve quizler.',
    palette: 'rose-pine',
    langs: ['tr'],
  },
  {
    path: '/n4/',
    icon: '四',
    title: 'N4 Gramer',
    description: 'JLPT N4 dilbilgisinin tamamı: 46 konu, romaji ve Türkçe örnekler, N4 kanji ve kelime, quizler.',
    palette: 'gruvbox',
    langs: ['tr'],
  },
  {
    path: '/n4/13-15/',
    icon: '課',
    title: 'N4 – Gramer 13-15',
    description: '13・14・15課 gramer konuları, diyaloglar ve iki test.',
    palette: 'catppuccin',
    langs: ['tr', 'en', 'zh'],
  },
  {
    path: '/kanji-n3-book/',
    icon: '漢',
    title: 'N3 Kanji Book',
    description: 'N3 kelime/kanji soruları 1–35: okunuş, anlam, kanji parçaları, okuma metinleri ve testler.',
    palette: 'sakura',
    langs: ['tr', 'en', 'zh'],
  },
  {
    path: '/kanji-book-2/',
    icon: '字',
    title: 'Kanji Book 2',
    description: '18 ünitede 210 kanji: en bilinen kelimeler, furigana, ünite ve dört ünitelik testler.',
    palette: 'sakura',
    langs: ['tr'],
  },
  {
    path: '/matsuya/',
    icon: '丼',
    title: 'Matsuya Kelimeleri',
    description: 'Matsuya iş yeri kelimeleri: menü, sipariş, fiş, mutfak ve talimatlar.',
    palette: 'matcha',
    langs: ['tr'],
  },
]

export const sitePaths = [HOME, ...PAGES].map((p) => p.path)
