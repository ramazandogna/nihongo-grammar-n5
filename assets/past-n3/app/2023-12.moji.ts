import type { ExamSection } from '@/pages/past-n3/types'

/** JLPT N3, Aralık 2023 — 言語知識（文字・語彙）. */
export const MOJI: ExamSection[] = [
  {
    id: 'm1',
    part: '文字・語彙',
    title: '問題1 · 漢字読み',
    how: 'Altı çizili kanjinin okunuşunu seç. Tuzaklar hep aynı: uzun/kısa ses (しゅ ↔ しゅう), ゛ (かん ↔ がん), っ ve benzer okunuşlu başka bir kelime. Önce kelimeyi parçalarına ayır, her kanjinin bildiğin okunuşunu birleştir.',
    groups: [
      {
        items: [
          { no: 1, q: 'すみません、[汚して]しまいました。', opts: ['こわして', 'おこして', 'よごして', 'のこして'], a: 2, why: '汚す = kirletmek (よごす). 壊す こわす kırmak · 起こす おこす uyandırmak · 残す のこす bırakmak.' },
          { no: 2, q: '{体育館|たいいくかん}に[選手]が入ってきました。', opts: ['ぜんしゅ', 'せんしゅう', 'せんしゅ', 'ぜんしゅう'], a: 2, why: '選手 = sporcu, せんしゅ (kısa しゅ). せんしゅう 先週 = geçen hafta · ぜんしゅう 全集 = külliyat.' },
          { no: 3, q: '{次|つぎ}は[月末]に来てください。', opts: ['げつもつ', 'げつまつ', 'がつまつ', 'がつもつ'], a: 1, why: '月末 げつまつ = ay sonu. 月 kelime içinde げつ (月曜日), 末 まつ (週末 しゅうまつ).' },
          { no: 4, q: '{箱|はこ}の[裏]をよく見てください。', opts: ['うら', 'おく', 'ふた', 'よこ'], a: 0, why: '裏 うら = arka yüz. 奥 おく iç/derin · 蓋 ふた kapak · 横 よこ yan.' },
          { no: 5, q: 'この町の[産業]について話を聞いた。', opts: ['じょうぎょう', 'ざんぎょう', 'しょうぎょう', 'さんぎょう'], a: 3, why: '産業 さんぎょう = sanayi. 残業 ざんぎょう mesai · 商業 しょうぎょう ticaret.' },
          { no: 6, q: 'あしたの[朝刊]は休みです。', opts: ['ちょうがん', 'ちょうかん', 'ちゅうかん', 'ちゅうがん'], a: 1, why: '朝刊 ちょうかん = sabah gazetesi. 朝 ちょう (朝食), 刊 かん. 中間 ちゅうかん = ara/orta.' },
          { no: 7, q: 'その話を聞いて、{中村|なかむら}さんは[断った]そうです。', opts: ['こわがった', 'あやまった', 'うたがった', 'ことわった'], a: 3, why: '断る ことわる = reddetmek. 怖がる korkmak · 謝る özür dilemek · 疑う şüphelenmek.' },
          { no: 8, q: 'あしたは、2時に[広場]に集まってください。', opts: ['ひろば', 'ひろじょう', 'こうば', 'こうじょう'], a: 0, why: '広場 ひろば = meydan (広い + 場). 工場 こうじょう/こうば = fabrika.' },
        ],
      },
    ],
  },
  {
    id: 'm2',
    part: '文字・語彙',
    title: '問題2 · 表記',
    how: 'Hiragana yazılan kelimenin doğru kanjisini seç. Şıklar aynı okunan ya da birbirine benzeyen kanjilerdir: anlamdan git. Kelimenin ne demek olduğunu bul, sonra o anlamı taşıyan kanjiyi seç.',
    groups: [
      {
        items: [
          { no: 9, q: '{次|つぎ}の駅で[おりましょう]。', opts: ['停りましょう', '乗りましょう', '降りましょう', '移りましょう'], a: 2, why: 'おりる (araçtan inmek) = 降りる. 乗る binmek · 移る taşınmak; 停り diye bir yazılış yok (停まる とまる).' },
          { no: 10, q: 'いつも7時には[きたく]している。', opts: ['着宅', '帰室', '帰宅', '着室'], a: 2, why: '帰宅 きたく = eve dönmek: 帰 (dönmek) + 宅 (ev). Diğerleri uydurma.' },
          { no: 11, q: '野菜を[こまかく]切ってください。', opts: ['角かく', '平かく', '丸かく', '細かく'], a: 3, why: '細かい こまかい = ufak/ince. 細 (ince) — 細い ほそい ile aynı kanji.' },
          { no: 12, q: '[ほうりつ]を{守|まも}ってください。', opts: ['法律', '法則', '規則', '規律'], a: 0, why: 'ほうりつ = 法律 (kanun). 法則 ほうそく kural (doğa yasası) · 規則 きそく kural · 規律 きりつ disiplin.' },
          { no: 13, q: '{袋|ふくろ}の中は[から]でした。', opts: ['無', '空', '欠', '穴'], a: 1, why: '空 から = boş (空 そら gökyüzü ile aynı kanji). 穴 あな delik.' },
          { no: 14, q: '今日の[かいひ]は3,000円です。', opts: ['会賃', '会費', '回費', '回賃'], a: 1, why: '会費 かいひ = katılım ücreti. 費 = masraf (交通費, 参加費). 賃 = ücret ama 会賃 yok (家賃 やちん kira).' },
        ],
      },
    ],
  },
  {
    id: 'm3',
    part: '文字・語彙',
    title: '問題3 · 文脈規定',
    how: 'Boşluğa anlamca uyan kelimeyi seç. Önce cümlenin tamamını oku; boşluğun önü ve arkası (hangi partikel, hangi fiil) çoğu şıkkı eler. Kalıp öbekleri (手を振る, 舌でなめる) ezberlemek çok kazandırır.',
    groups: [
      {
        items: [
          { no: 15, q: 'クイズの答えが分からないので、何か（　）が{欲|ほ}しい。', opts: ['ヒント', 'マナー', 'アドレス', 'チェック'], a: 0, why: 'Cevabı bilmiyorum → ipucu (ヒント) istiyorum. マナー görgü · アドレス adres · チェック kontrol.' },
          { no: 16, q: '100年後の世界がどうなっているか、（　）してみてください。', opts: ['{承知|しょうち}', '{納得|なっとく}', '{希望|きぼう}', '{想像|そうぞう}'], a: 3, why: '100 yıl sonrasını hayal etmek = 想像する. 承知 kabul · 納得 ikna olmak · 希望 umut.' },
          { no: 17, q: '{今朝|けさ}学校に行くとき、母がベランダから手を（　）見送ってくれた。', opts: ['{指|さ}して', '{扱|あつか}って', '{振|ふ}って', '{押|お}して'], a: 2, why: 'Kalıp: 手を振る = el sallamak. 指す işaret etmek · 扱う kullanmak · 押す itmek.' },
          { no: 18, q: '{田中|たなか}さんの{部屋|へや}は、本や服が（　）{整理|せいり}されていて、きれいですね。', opts: ['はっきり', 'なるべく', 'そっと', 'きちんと'], a: 3, why: 'きちんと = düzgünce, derli toplu. はっきり açıkça · なるべく mümkün olduğunca · そっと usulca.' },
          { no: 19, q: '寒さで、手の指の（　）がなくなってしまった。', opts: ['{感動|かんどう}', '{感覚|かんかく}', '{感激|かんげき}', '{感心|かんしん}'], a: 1, why: 'Parmaklarda his kalmadı = 感覚 (duyu, his). 感動 duygulanma · 感激 coşku · 感心 takdir etme.' },
          { no: 20, q: '{虫歯|むしば}を{防|ふせ}ぐためには、{食後|しょくご}に歯を{磨|みが}くことが最も（　）だと思う。', opts: ['{自動的|じどうてき}', '{効果的|こうかてき}', '{人工的|じんこうてき}', '{消極的|しょうきょくてき}'], a: 1, why: 'Diş çürümesini önlemede en etkili = 効果的. 自動的 otomatik · 人工的 yapay · 消極的 pasif.' },
          { no: 21, q: '{林|はやし}さんと{森|もり}さんは、（　）顔は知っているが、話したことはないそうだ。', opts: ['たまに', 'ついでに', 'おたがいに', 'おもに'], a: 2, why: 'İkisi birbirinin yüzünü biliyor = お互いに (karşılıklı). たまに ara sıra · ついでに fırsat bulmuşken · 主に çoğunlukla.' },
          { no: 22, q: '前の人の{発表|はっぴょう}が終わったので、次は私が発表する（　）だ。', opts: ['{線|せん}', '{運|うん}', '{段|だん}', '{番|ばん}'], a: 3, why: '〜する番だ = sıra bende. 私の番 = benim sıram.' },
          { no: 23, q: 'この{飛行機|ひこうき}に{載|の}せることができる{荷物|にもつ}は、一人20キロ{以内|いない}に（　）されている。', opts: ['{制限|せいげん}', '{禁止|きんし}', '{検査|けんさ}', '{解決|かいけつ}'], a: 0, why: '20 kg ile sınırlandırılmış = 制限されている. 禁止 tamamen yasak olurdu (20 kg “içinde” denmez).' },
          { no: 24, q: '{砂糖|さとう}か{塩|しお}か分からなかったので、{舌|した}で（　）みた。', opts: ['かじって', 'なめて', 'かんで', 'まぜて'], a: 1, why: 'Dille tatmak = なめる (yalamak). かじる kemirmek · かむ çiğnemek/ısırmak · まぜる karıştırmak.' },
          { no: 25, q: '少し{熱|ねつ}があって、体も（　）ので、今日は仕事を休もうと思う。', opts: ['だるい', 'まぶしい', 'ぬるい', 'にがい'], a: 0, why: 'Ateş + vücut halsiz = だるい. まぶしい göz kamaştırıcı · ぬるい ılık · 苦い acı (tat).' },
        ],
      },
    ],
  },
  {
    id: 'm4',
    part: '文字・語彙',
    title: '問題4 · 言い換え類義',
    how: 'Altı çizili kelimeye anlamca en yakın şıkkı seç. Kelimeyi bilmiyorsan, kanjilerinin anlamından tahmin et (避 kaçınmak + 難 felaket = tahliye). Şıkkı cümleye koyup aynı anlam kalıyor mu kontrol et.',
    groups: [
      {
        items: [
          { no: 26, q: '{皆|みな}さん、[{避難|ひなん}して]ください。', opts: ['ならんで', '入って', 'にげて', '急いで'], a: 2, why: '避難する = tehlikeden kaçıp güvenli yere gitmek ≈ にげる (kaçmak).' },
          { no: 27, q: '何かいい[{案|あん}]はありませんか。', opts: ['ルール', 'アイデア', 'メニュー', 'サービス'], a: 1, why: '案 = fikir, öneri ≈ アイデア.' },
          { no: 28, q: '私が何を言っても、{彼|かれ}はずっと[だまっていた]。', opts: ['話さなかった', '笑わなかった', '動かなかった', '怒らなかった'], a: 0, why: '黙る だまる = susmak ≈ 話さない.' },
          { no: 29, q: 'このやり方が[ベストだ]。', opts: ['最もよい', '最もよくない', '最も{難|むずか}しい', '最も難しくない'], a: 0, why: 'ベスト = en iyi = 最もよい.' },
          { no: 30, q: 'お店の人が[{配達|はいたつ}して]くれた。', opts: ['組み立てて', '手伝って', '貸して', '届けて'], a: 3, why: '配達する = (eve) teslim etmek ≈ 届ける.' },
        ],
      },
    ],
  },
  {
    id: 'm5',
    part: '文字・語彙',
    title: '問題5 · 用法',
    how: 'Kelimenin doğru kullanıldığı cümleyi seç. Her şıkta kelimenin yerine bildiğin bir eş anlamlıyı koy: anlamlı olan tek cümle doğrudur. Diğer şıklar başka bir kelimenin işini yaptırıyor.',
    groups: [
      {
        items: [
          {
            no: 31,
            q: '[{診察|しんさつ}]',
            opts: [
              '{警察|けいさつ}は事件があった場所を{注意深|ちゅういぶか}く診察した。',
              '中学時代に星の動きを診察して{記録|きろく}をつけていた。',
              '{担任|たんにん}の先生は生徒から{相談|そうだん}を受け、{丁寧|ていねい}に診察した。',
              '母は医者で、毎日たくさんの{患者|かんじゃ}を診察している。',
            ],
            a: 3,
            why: '診察 = doktorun hastayı muayene etmesi. Polis 調査/捜査 yapar, yıldızlar 観察 edilir, öğretmen 相談に乗る.',
          },
          {
            no: 32,
            q: '[行き先]',
            opts: [
              '{教師|きょうし}になるという行き先のために、毎日{頑張|がんば}っている。',
              '{実験|じっけん}の行き先が、思っていたことと{違|ちが}ってびっくりした。',
              '次の旅行の行き先を、{今夜|こんや}家族で話し合うつもりだ。',
              'この映画は見たことがあるので、{内容|ないよう}の行き先は知っている。',
            ],
            a: 2,
            why: '行き先 = gidilecek yer. Hedef 目標, deney sonucu 結果, filmin sonu 結末.',
          },
          {
            no: 33,
            q: '[{取|と}り{消|け}す]',
            opts: [
              '{床|ゆか}に落ちている大きなごみを取り消してから、{掃除機|そうじき}を使った。',
              'サッカーの後、シャワーを{浴|あ}びて{汗|あせ}を取り消した。',
              'このパンはかびが{生|は}えているので、もう取り消したほうがいい。',
              '{都合|つごう}が悪くなったので、レストランの{予約|よやく}を取り消した。',
            ],
            a: 3,
            why: '取り消す = iptal etmek (rezervasyon, karar). Çöp 拾う, ter 流す, küflü ekmek 捨てる.',
          },
          {
            no: 34,
            q: '[{共通|きょうつう}]',
            opts: [
              '父は休みの日も、いつもと共通の時間に{寝|ね}ることが多い。',
              '{娘|むすめ}と{息子|むすこ}は、共通の{趣味|しゅみ}を持っていて、とても{仲|なか}がいい。',
              '私と姉は、{周|まわ}りの人から共通の顔だとよく言われる。',
              'あしたも今日と共通の{気温|きおん}で、{暖|あたた}かいそうだ。',
            ],
            a: 1,
            why: '共通 = ortak (iki kişide/şeyde birden olan). Diğerlerinde 同じ (aynı) gerekir.',
          },
          {
            no: 35,
            q: '[{詰|つ}める]',
            opts: [
              '旅行に持っていく物をスーツケースに詰めておきます。',
              '味が{薄|うす}かったので、スープに塩とこしょうを詰めました。',
              'お{客|きゃく}さんのコップに水を詰めてください。',
              '{時々|ときどき}{窓|まど}を開けて、{部屋|へや}の中に{新鮮|しんせん}な{空気|くうき}を詰めた。',
            ],
            a: 0,
            why: '詰める = (kaba/çantaya) tıka basa doldurmak. Tuz 入れる, su 注ぐ, hava 入れる/入れ替える.',
          },
        ],
      },
    ],
  },
]
