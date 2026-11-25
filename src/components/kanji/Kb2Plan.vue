<script setup lang="ts">
import { Target } from 'lucide-vue-next'

/** The study method for Kanji Book 2, the same steps as the radicals page. */
const { open = false } = defineProps<{ open?: boolean }>()
</script>

<template>
  <details class="surface rounded-card mb-4 p-3" :open="open">
    <summary class="cursor-pointer font-bold">
      <Target class="me-1 inline size-[1.1em] -translate-y-px align-middle" aria-hidden="true" />Nasıl çalışmalıyım?
    </summary>
    <div class="mt-3 grid gap-3 text-[15px] leading-relaxed">
      <div>
        <p class="font-bold">Her gün (1–2 ünite)</p>
        <ol class="grid list-decimal gap-1 ps-5">
          <li>Üniteyi aç. Her kanjide önce <b>音 okunuşunu</b>, sonra <b>kelimeleri sesli oku</b> (病院 びょういん).</li>
          <li>Okunuşu kelimeyle öğren, tek başına değil. Bildiğin kanjiyi <b>öğrendim</b> diye işaretle.</li>
          <li>Hepsi işaretlenince <b>çalıştım</b> kutusu açılır. Sonra ünitenin <b>testini</b> çöz.</li>
          <li><b>%75 altıysa</b> (kırmızı) hemen bir kez daha çöz. Geçtiysen sonraki üniteye geç.</li>
          <li>4 ünitede bir <b>blok testini</b> çöz: önceki üniteleri unutmamanı sağlar.</li>
        </ol>
      </div>
      <div>
        <p class="font-bold">Akşam (15 dk)</p>
        <p>
          <b>Test</b> sekmesinden bir <b>karışık test</b> çöz (hepsi birlikte bütün kanjiler). Sonra
          <b>İstatistik</b>'e bak: en çok hata yaptığın 10 kanjinin kelimelerini sesli oku ve 3'er kez yaz.
        </p>
      </div>
      <p class="text-ink-soft text-sm">
        Renkler: <b class="text-negative">%75 altı kaldı</b> · <b class="text-warning">75+ geçti</b> ·
        <b class="text-positive">85+ iyi</b> · <b class="text-positive">90+ çok iyi</b>
      </p>
    </div>
  </details>
</template>
