# 日本語 Nihongo — kişisel Japonca çalışma sitesi

**🔗 https://ramazandogna.github.io/nihongo-grammar-n5/**

Japonya'da çalışırken N5'ten N3'e ilerlemek için kendime yaptığım çalışma sitesi:
okulda gördüğümüz kitaplar, iş yerinde kullandığım Japonca, JLPT hazırlığı.
Açıklamalar Türkçe; bazı sayfalar İngilizce ve Çince de.

- **Her kanjide furigana** — tek tuşla aç/kapa.
- **Anlamlar bulanık** — önce kendin tahmin et, dokununca açılır.
- **Bir sayfada tek konu** — uzun listeler sayfa sayfa.
- **JLPT tarzı testler** — 漢字読み (゛, uzun ses, っ tuzakları), 表記 (benzer kanjiler), anlam.
  Her soru iki kez doğru bilinene kadar sorulur; yarıda bırakılan test kaldığı yerden
  devam eder; her testin geçmişi ve en çok yanlış yapılanlar istatistiği tutulur.
- **Telefona göre** — 360px'te bile taşmaz; açık / koyu tema.

## İçerik

Ana menü üç klasör:

### 📁 Okul Dersleri

| Sayfa | İçerik | Dil |
| --- | --- | --- |
| [Blue Book](https://ramazandogna.github.io/nihongo-grammar-n5/blue-book/) | Okuma, gramer, kelime oyunu, alıştırma, test — ders ders | TR |
| [Business Nihongo](https://ramazandogna.github.io/nihongo-grammar-n5/business-nihongo/) | ISI ビジネス日本語 中級Ⅰ: duyuru okuma, 敬語, iş yazışması | TR |
| [N4 Gramer](https://ramazandogna.github.io/nihongo-grammar-n5/n4/) | N4 gramerin tamamı, kanji, kelime, quizler | TR |
| [N4 Gramer 13–15](https://ramazandogna.github.io/nihongo-grammar-n5/n4/13-15/) | 13・14・15課 gramer, diyaloglar, testler | TR · EN · 中 |
| [N3 Kanji Book](https://ramazandogna.github.io/nihongo-grammar-n5/kanji-n3-book/) | Kelime soruları 1–35, okuma (問題4・5), dinleme dersleri | TR · EN · 中 |

### 💼 İş Yeri Japoncası

| Sayfa | İçerik | Dil |
| --- | --- | --- |
| [Matsuya](https://ramazandogna.github.io/nihongo-grammar-n5/matsuya/) | Menü, müşteri diyalogları, sipariş fişleri, online siparişler | TR |

### 📚 Kendi Çalışmam

| Sayfa | İçerik | Dil |
| --- | --- | --- |
| [N3 Çıkmış Sorular](https://ramazandogna.github.io/nihongo-grammar-n5/past-n3/) | Çıkmış JLPT N3 sınavları, çözümlü; dinleme sesli | TR |
| [N5](https://ramazandogna.github.io/nihongo-grammar-n5/n5/) | N5 gramer, kanji, sınav merkezi | TR |
| [Kanji Book 2](https://ramazandogna.github.io/nihongo-grammar-n5/kanji-book-2/) | 18 ünite, 210 kanji | TR |
| [Radikaller](https://ramazandogna.github.io/nihongo-grammar-n5/radikaller/) | 43 radikal, 347 N3 kanjisi, 470 kelime; ayrıntılı anlatım ve testler | TR · EN |

> Çıkmış sınavların metinleri ve ses dosyaları telif hakkı nedeniyle repoda yok
> (`assets/past-n3/` gitignore'da); yayındaki sitede bu sayfa içeriksiz görünür.

## Teknoloji

Vue 3 · TypeScript · Tailwind 4 · [rei-kit](https://github.com/ramazandogna/rei-kit) (kendi UI kitim) ·
`vite-ssg` — her sayfa önceden HTML'e çevrilir, GitHub Actions ile GitHub Pages'e yayınlanır.

```sh
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # tip kontrolü + dist/
```

Alt dizinde yayın: `VITE_BASE=/nihongo-grammar-n5/ pnpm build`.

## Yapı

```
src/
  site.ts                  her sayfanın kaydı: adres, başlık, palet, diller, menü klasörü
  pages/<adres>/index.vue  sayfa — klasör adı = URL (pages/n4/13-15 → /n4/13-15/)
  components/              SiteLayout, MasteryQuiz, QuizHistory, ReadingLesson,
                           ListeningLesson, textbook/* (ders kitabı şablonu)
  lib/                     jlpt.ts (soru üretimi), kanji-similar.ts, quiz-store.ts, ruby.ts
```

Yeni sayfa: `src/pages/<klasör>/index.vue` + `src/site.ts` içine bir satır.
Veri notasyonu: `{漢字|かんじ}` furigana, `[[vurgu]]`, `[kelime]` sorulan kelime.

---

Ramazan Doğan · [Instagram](https://www.instagram.com/ramazandogna/)
