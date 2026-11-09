/**
 * What each radical is, beyond its one-word meaning: where it sits in a kanji,
 * what the shape was a picture of, what it lends to the kanji built on it, a
 * way to remember it, and the radicals it is mistaken for — the last is what
 * the JLPT 表記 questions are built from.
 *
 * Keyed by the radical as it appears in data.json.
 */
export type Position = 'へん' | 'つくり' | 'かんむり' | 'あし' | 'たれ' | 'にょう' | 'かまえ' | 'tek başına'

export interface RadicalGuide {
  pos: Position
  /** Where it sits, in plain Turkish. */
  where: string
  /** What the shape was drawn from. */
  origin: string
  /** What it lends to the kanji that carry it. */
  lends: string
  /** A memory hook. */
  hook: string
  /** Radicals it is confused with, and how to tell them apart. */
  confuse?: string
}

export const POSITION_TR: Record<Position, string> = {
  へん: 'へん · solda',
  つくり: 'つくり · sağda',
  かんむり: 'かんむり · üstte (taç)',
  あし: 'あし · altta',
  たれ: 'たれ · üstten sola sarkar',
  にょう: 'にょう · soldan alta dolanır',
  かまえ: 'かまえ · çerçeve gibi sarar',
  'tek başına': 'yer değiştirir (sol/üst/alt)',
}

export const GUIDE: Record<string, RadicalGuide> = {
  氵: { pos: 'へん', where: 'Kanjinin solunda, üç kısa çizgi.', origin: '水 (su) kanjisinin sıkıştırılmış hâli: üç damla.', lends: 'Su, sıvı, akış, deniz, yıkamak, sıcaklık (sıcak su).', hook: 'Üç damla = üç çizgi. Kanjide görürsen anlamında mutlaka bir “ıslaklık” vardır.', confuse: '冫 (にすい, iki çizgi) = buz/soğuk. Üç çizgi su, iki çizgi buz: 冷 ≠ 洗.' },
  亻: { pos: 'へん', where: 'Solda, dik duran ince bir insan.', origin: '人 (insan) yan durmuş hâli.', lends: 'İnsanın yaptığı şeyler, durumlar, ilişkiler: dinlenmek, yaşamak, çalışmak.', hook: 'Kanjinin yanında biri ayakta duruyor: 休 = insan + ağaç → ağaca yaslanıp dinlenen insan.', confuse: '彳 (ぎょうにんべん) iki çizgilidir ve “yol/gitmek” anlamı verir: 住 ≠ 往.' },
  言: { pos: 'へん', where: 'Solda; tek başına da kanjidir.', origin: 'Ağızdan (口) çıkan sözler.', lends: 'Konuşmak, söylemek, dil, sınamak, kayıt, tartışma.', hook: 'Soldaki 言 = “ağzı açık” kanji. 話・語・説・読 hepsi konuşma/okuma.', confuse: '食 (しょくへん) da benzer üst kısımlıdır ama “yemek”tir: 飲 ≠ 話. 言 altında 口 vardır.' },
  木: { pos: 'tek başına', where: 'Çoğunlukla solda (きへん), bazen altta (案).', origin: 'Kökleri ve dallarıyla bir ağaç.', lends: 'Ağaç, odun, tahta, ve tahtadan yapılan şeyler; ayrıca 様・機 gibi soyut kelimeler.', hook: 'Ortadaki çizgi gövde, iki yan kol dallar, alttaki eğri çizgiler kök.', confuse: '禾 (のぎへん, tahıl) üstünde fazladan bir eğik çizgi vardır: 税 ≠ 校.' },
  心: { pos: 'tek başına', where: 'Altta 心 (思・感), solda 忄 (情・性・慣).', origin: 'Kalbin resmi.', lends: 'Duygu, düşünce, akıl, karakter.', hook: 'Altta yatan kalp: 思 = tarla (beyin) + kalp → düşünmek.', confuse: 'Solda 忄 iki nokta + dik çizgidir; 小 ile karıştırma.' },
  辶: { pos: 'にょう', where: 'Soldan başlayıp kanjinin altına dolanır.', origin: 'Yolda yürüyen ayak.', lends: 'Hareket, yol, gitmek-gelmek, ilerlemek, geç kalmak.', hook: '辶 gördüğün kanji “yolda bir şey oluyor” der: 進 ilerle, 返 geri ver, 送 gönder, 遅 geç kal.', confuse: '廴 (えんにょう, 建) daha düzdür, noktası yoktur.' },
  口: { pos: 'tek başına', where: 'Solda (くちへん: 味), içte ya da altta (品・告).', origin: 'Açık bir ağız.', lends: 'Ağız, söylemek, yemek, delik, sayılan şey.', hook: '品 = üç ağız → çok şey = ürün. 味 = ağız + 未 → tat.', confuse: '囗 (くにがまえ) büyük kutudur ve dışarıyı çevreler (国・図).' },
  日: { pos: 'tek başına', where: 'Solda (晴・暗), üstte (景・最) ya da altta (昔・暑).', origin: 'Güneş.', lends: 'Güneş, gün, zaman, ışık, aydınlık.', hook: '晴 = güneş + 青 → açık hava. 暗 = güneş + 音 → karanlık (güneş yok, sadece ses).', confuse: '目 (göz) içinde iki çizgi vardır, 日 bir. 曰 daha basık ve genişti.' },
  月: { pos: 'tek başına', where: 'Sağda (期・服) = ay; solda ya da altta (脳・腹・育) = にくづき, vücut.', origin: 'Hilal ay; solda ise 肉 (et) kanjisinin kısaltması.', lends: 'Ay, ay (takvim) — ya da vücut organları (göğüs, beyin, karın, omuz).', hook: 'Solda 月 gördün mü vücut: 胸 göğüs, 腹 karın, 脳 beyin, 肩 omuz.', confuse: '日 ve 目 ile şekil olarak karışır; 月’nın sol çizgisi kıvrılır.' },
  女: { pos: 'へん', where: 'Genelde solda (始・婚), bazen altta (委・妻).', origin: 'Diz çökmüş bir kadın.', lends: 'Kadın, aile ilişkileri (evlilik, kız çocuğu), bazen duygu (嫌).', hook: '娘 = kadın + 良 (iyi) → kız evlat. 婚 = kadın + 昏 → evlilik.', confuse: '女 solda daralır; 安 gibi kelimelerde altta.' },
  扌: { pos: 'へん', where: 'Solda, üç çizgi: yatay, dik (kancalı), eğik.', origin: '手 (el) sıkıştırılmış.', lends: 'Elle yapılan her iş: tutmak, vurmak, atmak, ödemek, aramak.', hook: '扌 = el → 持 tut, 打 vur, 投 at, 払 öde, 拾 al, 捨 at.', confuse: '才 ile çok benzer ama kanji içinde hep 扌. 木 değil — 扌’de üst yatay kısa.' },
  艹: { pos: 'かんむり', where: 'Üstte, iki küçük çatal.', origin: 'Yerden çıkan iki ot filizi.', lends: 'Ot, bitki, yaprak, çiçek, ilaç (bitkiden yapılır).', hook: 'Üstte çimen: 葉 yaprak, 菜 sebze, 薬 ilaç, 落 düşmek (yaprak düşer).', confuse: '⺮ (たけかんむり) bambu yaprağıdır, iki küçük “ヶ” gibi: 笑 ≠ 若.' },
  糸: { pos: 'へん', where: 'Solda, altında üç nokta.', origin: 'Bükülmüş iplik demeti.', lends: 'İplik, bağlamak, sürdürmek, çizgi, ince; ilişki (紹, 絡).', hook: 'İplik bağlar ve uzar: 結 bağla, 続 sürdür, 線 çizgi, 細 ince, 終 son (ipliğin ucu).', confuse: '幺 (yarım iplik) altında nokta yoktur.' },
  金: { pos: 'へん', where: 'Solda daralmış 釒.', origin: 'Toprağın içindeki metal parçaları.', lends: 'Metal, para, alet: gümüş, demir, iğne, ayna.', hook: '鏡 = metal + 竟 → eskiden aynalar metaldi. 録 kayıt (metal levhaya kazımak).', confuse: '食 ile soldaki şekil benzer: 飯 ≠ 鈑. 金’ın altında 土 + iki nokta var.' },
  食: { pos: 'へん', where: 'Solda daralmış 飠.', origin: 'Kapaklı yemek kabı.', lends: 'Yemek, içmek, beslemek; ayrıca 館 (bina — misafir ağırlanan yer).', hook: '飲 = yemek + 欠 (ağız açmak) → içmek. 飼 = beslemek (hayvan).', confuse: '言 ile karıştırma (yukarı bak).' },
  火: { pos: 'tek başına', where: 'Solda 火 (焼・燃・煙) ya da altta dört nokta 灬 (れっか: 熱・点・無・照).', origin: 'Alev.', lends: 'Ateş, ısı, yanmak, ışık.', hook: 'Alttaki dört nokta = altta yanan ateş: 熱 sıcak, 照 aydınlatmak.', confuse: '灬 bazen anlam vermez (無, 然) — o kanjileri ayrıca ezberle.' },
  阝: { pos: 'tek başına', where: 'SOLDA (こざとへん) = tepe/merdiven; SAĞDA (おおざと) = yerleşim yeri.', origin: 'Solda: 阜 (tepe); sağda: 邑 (köy, şehir).', lends: 'Solda: yükseklik, sınır, engel (階・限・防・険). Sağda: yer, bölge (都・部).', hook: 'Aynı şekil, iki anlam! Sol = tepe (階 basamak), sağ = şehir (都 başkent).', confuse: 'Konuma bak: 院 (sol) ≠ 部 (sağ).' },
  宀: { pos: 'かんむり', where: 'Üstte, noktalı çatı.', origin: 'Evin çatısı.', lends: 'Ev, içeride olmak, korumak, yerleşmek.', hook: 'Çatının altında: 家 ev, 安 güvenli (evde kadın), 客 misafir, 宿 konak, 寝 uyumak.', confuse: '冖 (わかんむり) noktasızdır (写). 穴 içinde ハ vardır.' },
  門: { pos: 'かまえ', where: 'Dışarıyı çerçeve gibi sarar.', origin: 'İki kanatlı kapı.', lends: 'Kapı, açmak-kapamak, arada olmak, ilgili olmak.', hook: '開 açmak, 閉 kapamak, 間 ara (kapının arasından güneş), 関 ilgi/geçit.', confuse: '問 ve 聞 de 門 içerir ama anlamı ağız (sormak) ve kulak (duymak) belirler.' },
  土: { pos: 'tek başına', where: 'Solda (地・場・境) ya da altta (基・型・在).', origin: 'Yerden yükselen toprak yığını.', lends: 'Toprak, yer, alan, temel.', hook: '地 yer, 場 alan, 基 temel. Toprağın üstünde dur.', confuse: '士 (asker) üst çizgisi uzundur; 土’da alt çizgi uzun.' },
  竹: { pos: 'かんむり', where: 'Üstte ⺮.', origin: 'Bambu yaprakları.', lends: 'Bambu ve bambudan yapılanlar: kalem, kâğıt, cetvel; sıra, sayı (算, 第).', hook: 'Eskiden yazılar bambu şeritlere yazılırdı: 答 cevap, 算 hesap, 簡 basit, 第 sıra.', confuse: '艹 ile karıştırma: 艹 düz çatal, ⺮ iki küçük ケ.' },
  雨: { pos: 'かんむり', where: 'Üstte ⻗.', origin: 'Gökten düşen damlalar.', lends: 'Hava olayları: kar, bulut, şimşek (elektrik), deprem.', hook: '雪 kar, 雲 bulut, 電 elektrik (şimşek), 震 sarsılmak.', confuse: 'Üstte gördüğün “dört noktalı kutu” hep hava olayı.' },
  目: { pos: 'tek başına', where: 'Solda (眠・眼) ya da altta/içte (県・真・着).', origin: 'Göz (dik durmuş).', lends: 'Göz, bakmak, görmek; doğru, gerçek.', hook: '眠 = göz + 民 → uyumak (göz kapanır). 直 = dümdüz bakmak.', confuse: '日 bir iç çizgi, 目 iki iç çizgi.' },
  力: { pos: 'tek başına', where: 'Sağda (助・動) ya da altta (努・労).', origin: 'Kas / saban.', lends: 'Güç, emek, çaba, çalışmak, işe yaramak.', hook: '動 = ağır + güç → hareket ettirmek. 努 = çaba. 勝 = kazanmak.', confuse: '刀 (bıçak) üstte uç vermez: 力 ≠ 刀.' },
  '⻊': { pos: 'へん', where: 'Solda daralmış 足.', origin: 'Ayak (dizden aşağısı).', lends: 'Yürümek, adım, mesafe, zıplamak.', hook: '路 yol, 踊 dans, 距 mesafe, 踏 basmak — hepsi ayakla.', confuse: '口 + 止 gibi görünür; 足’ın alt kısmı kıvrıktır.' },
  田: { pos: 'tek başına', where: 'Solda, üstte ya da ortada.', origin: 'Bölmelere ayrılmış pirinç tarlası.', lends: 'Tarla, alan, sınır, bölge.', hook: '男 = tarla + güç → tarlada çalışan erkek. 界 = sınır (tarlanın kenarı).', confuse: '由・申 田’nın üstüne/altına çizgi uzatılmış hâlidir.' },
  衤: { pos: 'へん', where: 'Solda; altta ya da içte 衣.', origin: '衣 (giysi) — yaka ve etek.', lends: 'Giysi, kumaş, sarmak, arka yüz.', hook: '衤 iki noktalıdır! 裏 = arka (giysinin iç yüzü), 補 = yamamak.', confuse: '礻 (しめすへん) TEK noktalı: 祝 (tanrı) ≠ 被 (giysi). En çok karışan ikili!' },
  疒: { pos: 'たれ', where: 'Üstten sola sarkar, iki nokta.', origin: 'Hasta yatağı.', lends: 'Hastalık, ağrı, yorgunluk, tedavi.', hook: '病 hastalık, 痛 ağrı, 疲 yorgun, 療 tedavi.', confuse: '广 (まだれ) noktasızdır ve bina anlamındadır: 店 ≠ 病.' },
  貝: { pos: 'tek başına', where: 'Solda (財・貯) ya da altta (買・費・貸).', origin: 'Deniz kabuğu — eskiden para olarak kullanılırdı.', lends: 'Para, değer, alım-satım, borç, ücret.', hook: 'Kabuk = para: 買 almak, 費 masraf, 貸 ödünç vermek, 賃 ücret, 貯 biriktirmek.', confuse: '見 altında 儿 vardır (görmek): 見 ≠ 貝.' },
  彳: { pos: 'へん', where: 'Solda, iki eğik çizgi + dik.', origin: 'Kavşak/yolun yarısı.', lends: 'Gitmek, yol, eylem.', hook: '亻’den bir çizgi fazla = iki kişilik yol: 待 beklemek, 後 sonra, 復 geri dönmek.', confuse: '亻 (insan) tek eğik çizgidir.' },
  車: { pos: 'tek başına', where: 'Solda (軽・転) ya da içte (軍).', origin: 'Yukarıdan görülen at arabası: tekerlek ve dingil.', lends: 'Araç, dönmek, taşımak, karşılaştırmak.', hook: '転 dönmek, 輸 taşımak, 輪 tekerlek.', confuse: '東 ve 申 ile karışabilir; 車’ın alt çizgisi tamdır.' },
  石: { pos: 'tek başına', where: 'Solda daralır.', origin: 'Uçurum (厂) altında bir taş (口).', lends: 'Taş, sertlik, bilemek, kum, kesinlik.', hook: '研 bilemek (araştırma), 砂 kum, 破 kırmak, 確 sağlam/kesin.', confuse: '右 ile çok benzer: 右’de üst çizgiler kısa ve iç içe.' },
  礻: { pos: 'へん', where: 'Solda, TEK nokta.', origin: '示 (göstermek, sunak).', lends: 'Tanrı, tapınak, kutlama, ritüel, yasak.', hook: 'Sunağa bir nokta düşer: 神 tanrı, 社 tapınak/şirket, 祝 kutlamak, 祭 festival.', confuse: '衤 (iki nokta) = giysi. 礻 tek nokta = tanrı.' },
  刂: { pos: 'つくり', where: 'Sağda, iki dik çizgi.', origin: '刀 (bıçak) sağa sıkıştırılmış.', lends: 'Kesmek, ayırmak, bölmek, karar vermek.', hook: '別 ayırmak, 割 bölmek, 判 karar (ikiye ayırıp bakmak), 刻 kazımak.', confuse: '川 ile karıştırma; 刂 hep sağdadır.' },
  頁: { pos: 'つくり', where: 'Sağda.', origin: 'Büyük bir baş (sayfa anlamı sonradan).', lends: 'Baş, yüz, başlık, rica (baş eğmek), sıra.', hook: '顔 yüz, 頭 baş, 題 başlık, 願 dilek, 頼 rica.', confuse: '貝 ile benzer ama üstünde 一 + 丿 var.' },
  攵: { pos: 'つくり', where: 'Sağda.', origin: 'Sopayla vuran el.', lends: 'Eylem, zorlamak, öğretmek, değiştirmek.', hook: 'Sopa ile harekete geçirmek: 教 öğretmek, 改 düzeltmek, 放 bırakmak, 救 kurtarmak.', confuse: '夂 (fuyugashira) üstte, daha kısa.' },
  广: { pos: 'たれ', where: 'Üstten sola sarkar, tek nokta.', origin: 'Tek duvarlı çatı.', lends: 'Bina, ev, geniş alan.', hook: '店 dükkân, 庭 bahçe, 座 oturmak (salon), 府 resmî kurum, 底 dip.', confuse: '疒 iki noktalı = hastalık. 厂 noktasız = uçurum.' },
  犭: { pos: 'へん', where: 'Solda.', origin: '犬 (köpek) sıkıştırılmış.', lends: 'Hayvan, vahşi davranış.', hook: '猫 kedi, 独 tek başına (köpek gibi yalnız), 犯 suç (vahşi iş).', confuse: '彳 ile şekil benzer, kanca sağa kıvrılır.' },
  冫: { pos: 'へん', where: 'Solda, iki çizgi.', origin: 'Buz kristali.', lends: 'Buz, soğuk.', hook: 'İki çizgi = donmuş su: 冷 soğuk, 凍 donmak, 冬 kış (altta).', confuse: '氵 (üç çizgi) su.' },
  尸: { pos: 'たれ', where: 'Üstten sola sarkar.', origin: 'Eğilmiş beden.', lends: 'Ev, bina, kalmak.', hook: '屋 ev/dükkân, 局 büro, 居 bulunmak, 届 ulaşmak.', confuse: '戸 üstünde ayrı bir çizgi vardır (kapı).' },
  欠: { pos: 'つくり', where: 'Sağda.', origin: 'Ağzını açıp esneyen insan.', lends: 'Ağzı açmak: şarkı, istek, eksiklik.', hook: '歌 şarkı, 欲 istemek, 次 sıradaki, 欠 eksik.', confuse: '攵 ile karıştırma: 欠’ın üstü ⺈ şeklinde.' },
  耳: { pos: 'tek başına', where: 'Solda (職) ya da içte (聞).', origin: 'Kulak.', lends: 'Duymak, dinlemek, iş (職 — dinleyip öğrenilen meslek).', hook: '聞 = kapı + kulak → kapıdan duymak. 聴 dikkatle dinlemek.', confuse: '目 ile benzer ama alt çizgi uzar.' },
  山: { pos: 'tek başına', where: 'Solda, üstte (岩・岸) ya da altta (島).', origin: 'Üç tepeli dağ.', lends: 'Dağ, kaya, kıyı, ada.', hook: '岩 kaya (dağ + taş), 島 ada, 岸 kıyı, 峠 geçit (dağ + yukarı + aşağı).', confuse: '出 iki 山 üst üste gibi görünür ama dağ değildir.' },
}
