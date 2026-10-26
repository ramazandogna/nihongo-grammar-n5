# 🌸 Nihongo — kişisel Japonca çalışma sitesi

N5 ve N4 gramer rehberleri, iki kanji kitabı ve iş yeri kelime seti; hepsi tek bir
tasarımla. Açıklamalar Türkçe; bazı sayfalar İngilizce ve Çince de.

Vue 3 + [rei-kit](https://github.com/ramazandogna/rei-kit) + Tailwind 4, `vite-ssg`
ile her sayfa önceden HTML'e çevrilir: sayfa JavaScript yüklenmeden içerikle açılır,
arama motorları furiganalı metnin tamamını görür.

## Sayfalar

| Adres | İçerik | Palet | Dil |
| --- | --- | --- | --- |
| `/` | Ana menü | Nord | TR · EN · 中 |
| `/n5/` | N5 gramer, kanji, sınav merkezi, 14 quiz | Rosé Pine | TR |
| `/n4/` | N4 gramerin tamamı, kanji, kelime, 15 quiz | Gruvbox | TR |
| `/n4/13-15/` | 13・14・15課 gramer, diyaloglar, 2 test | Catppuccin | TR · EN · 中 |
| `/kanji-n3-book/` | N3 kelime soruları 1–35, okuma metinleri | Sakura | TR · EN · 中 |
| `/kanji-book-2/` | 18 ünite, 210 kanji | Sakura | TR |
| `/matsuya/` | Matsuya iş yeri kelimeleri | Matcha | TR |

Her sayfada aynı üst bar: dil seçici (sayfanın birden fazla dili varsa), ふりがな
aç/kapa, cevapları bulanıklaştır, tema. Tüm testler aynı motoru kullanır: her soru
iki kez doğru bilinene kadar sorulur, yanlışlar kısa süre sonra geri gelir.

## Geliştirme

```sh
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # tip kontrolü + dist/ içine önceden çizilmiş sayfalar
pnpm preview
```

GitHub Pages gibi alt dizinde yayınlanacaksa: `VITE_BASE=/nihongo-grammar-n5/ pnpm build`.

## Yapı

```
src/
  site.ts                 her sayfanın kaydı: adres, başlık, açıklama, palet, diller
  pages/<adres>/index.vue sayfa — klasör adı = URL (pages/n4/13-15 → /n4/13-15/)
  pages/<adres>/data.json sayfanın verisi
  components/             ortak parçalar: SiteLayout, MasteryQuiz, JpText,
                          RevealText, ExampleSentence, StudyHeader, guide/*
  lib/                    tercihler, dil, furigana gösterimi
legacy/                   eski tek dosyalık HTML sayfalar (verinin kaynağı)
scripts/extract-legacy.ts legacy/ → data.json
```

### Yeni sayfa eklemek

1. `src/pages/<klasör>/index.vue` ve yanına `data.json`.
2. `src/site.ts` içindeki `PAGES` listesine bir satır (başlık, açıklama, palet, diller).

Rota, menü kartı, `<head>` ve önceden çizim bu ikisinden otomatik gelir. Sayfa
`usePage('/<klasör>/')` çağırır ve içeriğini `<SiteLayout>` içine koyar.

### Veri notasyonu

`{漢字|かんじ}` furigana, `[[vurgu]]` işaretli kısım, `[kelime]` sorulan kelime.
n5 / n4 sayfaları eski HTML'lerinden blok blok çıkarıldı (`pnpm extract`).
