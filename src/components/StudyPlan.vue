<script setup lang="ts">
import { Target } from 'lucide-vue-next'

/** The study method for the radicals page, opened before each session. */
const { open = false } = defineProps<{ open?: boolean }>()
</script>

<template>
  <details class="surface rounded-card mb-4 p-3" :open="open">
    <summary class="cursor-pointer font-bold">
      <Target class="me-1 inline size-[1.1em] -translate-y-px align-middle" aria-hidden="true" />Nasıl çalışmalıyım? ·
      JLPT N3 planı
    </summary>
    <div class="mt-3 grid gap-3 text-[15px] leading-relaxed">
      <div>
        <p class="font-bold">Her gün (2 grup = 6 radikal)</p>
        <ol class="grid list-decimal gap-1 ps-5">
          <li>
            Radikali aç, önce <b>radikal kartını</b> oku: anlamı ve akılda tutma cümlesi.
          </li>
          <li>
            Her kanjide <b>kelimeleri sesli oku</b> (海外 かいがい). Okunuşu kelimeyle öğren, tek başına değil. Bildiğin
            kanjiyi <b>öğrendim</b> diye işaretle.
          </li>
          <li>Hepsi işaretlenince <b>çalıştım</b> kutusu açılır. Sonra o radikalin <b>testini</b> çöz.</li>
          <li><b>%75 altıysa</b> (kırmızı) hemen bir kez daha çöz. Geçtiysen sonraki radikale geç.</li>
          <li>3. radikalden sonra <b>3'lü testi</b> çöz. Bu, önceki iki radikali unutmamanı sağlar.</li>
        </ol>
      </div>
      <div>
        <p class="font-bold">Akşam (15 dk)</p>
        <p>
          <b>Test</b> sekmesinden bir <b>uzun test</b> çöz (13 test, bütün kanjiler). Sonra
          <b>İstatistik</b>'e bak: en çok hata yaptığın 10 kanjiyi kâğıda 3'er kez yaz ve kelimesini sesli söyle.
        </p>
      </div>
      <div>
        <p class="font-bold">Hatırlamak için</p>
        <ul class="grid list-disc gap-1 ps-5">
          <li>
            Cevap verince şıkların altındaki okunuş ve anlamı <b>mutlaka oku</b>. Doğru bilsen de: şans eseri doğru
            bilmek öğrenmek değildir.
          </li>
          <li>Yanlış şıkkı da oku. Sınavda tam o kanji karşına çıkar (aynı radikal, aynı okunuş).</li>
          <li>Ertesi gün işe <b>dünkü 3'lü testle</b> başla. Unutmak en çok ilk 24 saatte olur.</li>
          <li>Kırmızı ve sarı olanlar yeşile dönmeden yeni radikale çok yüklenme.</li>
        </ul>
      </div>
      <div>
        <p class="font-bold">Sınav tuzakları (漢字読み・表記)</p>
        <ul class="grid list-disc gap-1 ps-5">
          <li>゛ farkı: きゃく / ぎゃく · uzun ses: こう / こ · küçük っ: がっこう / がこう.</li>
          <li>Aynı okunan farklı kanji (表記): 性・成・正 — anlamdan seç, sesten değil.</li>
          <li>Emin değilsen radikale bak: 氵 su, 扌 el, 言 söz, 糸 iplik… doğru şıkkı çoğu zaman radikal ele verir.</li>
        </ul>
      </div>
      <p class="text-ink-soft text-sm">
        Hedef: sınava kadar bütün radikal rozetleri <b class="text-positive">yeşil</b>, uzun testler %85'in üstünde.
      </p>
    </div>
  </details>
</template>
