/**
 * Matsuya, at the counter and in the kitchen: what customers say, what to
 * say back, how to read an order slip, and the prep and washing-up words.
 *
 * Written for this site rather than extracted, so it lives beside data.json
 * (which `pnpm extract` regenerates) instead of inside it.
 */
export interface WorkWord {
  w: string
  r: string
  romaji: string
  tr: string
  note: string
}
export interface WordCategory {
  id: string
  title: string
  note: string
  words: WorkWord[]
}

const W = (w: string, r: string, romaji: string, tr: string, note = ''): WorkWord => ({ w, r, romaji, tr, note })

export const EXTRA_CATEGORIES: WordCategory[] = [
  {
    id: 'sekkyaku',
    title: '🙇 Müşteriye söylenenler',
    note: 'Kasada ve teslimde en çok kullanılan kibar cümleler. お〜します／ご〜です kalıpları müşteriye hizmet dilidir.',
    words: [
      W('ご飯の量はいかがなさいますか', 'ごはんのりょうはいかがなさいますか', 'gohan no ryō wa ikaga nasaimasu ka', 'Pilav miktarı nasıl olsun?', 'Kısa hâli: ご飯のサイズは？'),
      W('並盛・大盛・特盛', 'なみもり・おおもり・とくもり', 'namimori / ōmori / tokumori', 'normal / büyük / ekstra büyük porsiyon'),
      W('ご飯少なめ', 'ごはんすくなめ', 'gohan sukuname', 'az pilav'),
      W('店内でお召し上がりですか', 'てんないでおめしあがりですか', 'tennai de omeshiagari desu ka', 'Burada mı yiyeceksiniz?'),
      W('お持ち帰りですか', 'おもちかえりですか', 'omochikaeri desu ka', 'Paket mi alacaksınız?'),
      W('食券をお預かりします', 'しょっけんをおあずかりします', 'shokken o oazukari shimasu', 'Fişinizi alıyorum'),
      W('ご注文を繰り返します', 'ごちゅうもんをくりかえします', 'gochūmon o kurikaeshimasu', 'Siparişinizi tekrarlıyorum'),
      W('以上でよろしいですか', 'いじょうでよろしいですか', 'ijō de yoroshii desu ka', 'Bu kadar mı? (başka bir şey?)'),
      W('番号でお呼びします', 'ばんごうでおよびします', 'bangō de oyobi shimasu', 'Numaranızla çağıracağız'),
      W('183番のお客様', 'ひゃくはちじゅうさんばんのおきゃくさま', 'hyaku-hachijū-san ban no okyakusama', '183 numaralı müşteri'),
      W('お待たせいたしました', 'おまたせいたしました', 'omatase itashimashita', 'Beklettiğim için kusura bakmayın (siparişiniz hazır)'),
      W('お弁当のお客様', 'おべんとうのおきゃくさま', 'obentō no okyakusama', 'Paket (bento) siparişi olan müşteri'),
      W('お箸はこちらです', 'おはしはこちらです', 'ohashi wa kochira desu', 'Çubuklar burada'),
      W('お箸は何膳お付けしますか', 'おはしはなんぜんおつけしますか', 'ohashi wa nanzen otsuke shimasu ka', 'Kaç çift çubuk koyayım?', '膳 = çubuk çifti sayacı'),
      W('袋はご利用ですか', 'ふくろはごりようですか', 'fukuro wa goriyō desu ka', 'Poşet ister misiniz?'),
      W('熱いのでお気をつけください', 'あついのでおきをつけください', 'atsui node oki o tsukete kudasai', 'Sıcak, dikkat edin'),
      W('少々お時間いただきます', 'しょうしょうおじかんいただきます', 'shōshō ojikan itadakimasu', 'Biraz zaman alacak'),
      W('ただいま品切れです', 'ただいましなぎれです', 'tadaima shinagire desu', 'Şu an tükendi'),
      W('申し訳ございません', 'もうしわけございません', 'mōshiwake gozaimasen', 'Çok özür dileriz'),
      W('お下げしてもよろしいですか', 'おさげしてもよろしいですか', 'osage shite mo yoroshii desu ka', 'Tabağı alabilir miyim?'),
      W('またお越しくださいませ', 'またおこしくださいませ', 'mata okoshi kudasaimase', 'Yine bekleriz'),
    ],
  },
  {
    id: 'fuzoku',
    title: '🧂 Sos & paket ekstraları',
    note: 'Paket siparişte fişte yazanlar poşete girer. Sayaçlar: 個 (adet), 膳 (çubuk çifti), 枚 (yassı şey), 袋 (poşet).',
    words: [
      W('付属品', 'ふぞくひん', 'fuzokuhin', 'yanında verilenler (ekstralar)'),
      W('調味料', 'ちょうみりょう', 'chōmiryō', 'baharat ve soslar'),
      W('ケチャップ', 'ケチャップ', 'kechappu', 'ketçap'),
      W('マヨネーズ', 'マヨネーズ', 'mayonēzu', 'mayonez'),
      W('ドレッシング', 'ドレッシング', 'doresshingu', 'salata sosu'),
      W('ごまドレッシング', 'ごまドレッシング', 'goma doresshingu', 'susamlı salata sosu'),
      W('和風ドレッシング', 'わふうドレッシング', 'wafū doresshingu', 'Japon usulü (soya-sirkeli) salata sosu'),
      W('七味', 'しちみ', 'shichimi', 'yedi baharat (acı biber karışımı)'),
      W('一味', 'いちみ', 'ichimi', 'sadece acı biber tozu'),
      W('醤油', 'しょうゆ', 'shōyu', 'soya sosu'),
      W('ソース', 'ソース', 'sōsu', 'sos (tatlı-ekşi Japon sosu)'),
      W('胡椒', 'こしょう', 'koshō', 'karabiber'),
      W('からし', 'からし', 'karashi', 'Japon hardalı'),
      W('ゼリー', 'ゼリー', 'zerī', 'jöle'),
      W('割り箸', 'わりばし', 'waribashi', 'tek kullanımlık çubuk'),
      W('スプーン', 'スプーン', 'supūn', 'kaşık'),
      W('おしぼり', 'おしぼり', 'oshibori', 'ıslak mendil/havlu'),
      W('小袋', 'こぶくろ', 'kobukuro', 'küçük paket (sos paketi)'),
      W('〜個', '〜こ', '~ko', '~ adet'),
      W('〜膳', '〜ぜん', '~zen', '~ çift (çubuk)'),
      W('不要', 'ふよう', 'fuyō', 'gerek yok, istemiyor'),
      W('別添え', 'べつぞえ', 'betsuzoe', 'ayrı kapta (yanında ayrı)'),
    ],
  },
  {
    id: 'shikomi',
    title: '🥗 Hazırlık & bulaşık',
    note: 'Mutfakta salata, sos doldurma, bulaşık. 〜ておいて = önceden yapıver · 〜たら声をかけて = bitince haber ver.',
    words: [
      W('仕込み', 'しこみ', 'shikomi', 'ön hazırlık (servisten önce)'),
      W('サラダを作る', 'サラダをつくる', 'sarada o tsukuru', 'salata hazırlamak'),
      W('盛り付ける', 'もりつける', 'moritsukeru', 'tabağa düzgünce koymak'),
      W('補充する', 'ほじゅうする', 'hojū suru', 'eksileni tamamlamak'),
      W('詰める', 'つめる', 'tsumeru', '(kaba) doldurmak'),
      W('ソースを詰め替える', 'ソースをつめかえる', 'sōsu o tsumekaeru', 'sosu yeniden doldurmak'),
      W('足りない', 'たりない', 'tarinai', 'yetmiyor, eksik'),
      W('切らしている', 'きらしている', 'kirashite iru', 'bitmiş, kalmamış'),
      W('洗い物', 'あらいもの', 'araimono', 'bulaşık'),
      W('たまる', 'たまる', 'tamaru', 'birikmek'),
      W('食洗機', 'しょくせんき', 'shokusenki', 'bulaşık makinesi'),
      W('すすぐ', 'すすぐ', 'susugu', 'durulamak'),
      W('乾かす', 'かわかす', 'kawakasu', 'kurutmak'),
      W('ラップをかける', 'ラップをかける', 'rappu o kakeru', 'streç film kaplamak'),
      W('冷蔵庫にしまう', 'れいぞうこにしまう', 'reizōko ni shimau', 'buzdolabına kaldırmak'),
      W('賞味期限', 'しょうみきげん', 'shōmi kigen', 'tavsiye edilen tüketim tarihi'),
      W('消費期限', 'しょうひきげん', 'shōhi kigen', 'son tüketim tarihi'),
      W('消毒する', 'しょうどくする', 'shōdoku suru', 'dezenfekte etmek'),
      W('手が空いたら', 'てがあいたら', 'te ga aitara', 'elin boşalınca'),
      W('終わったら声をかけて', 'おわったらこえをかけて', 'owattara koe o kakete', 'bitince haber ver'),
      W('先にこっちお願い', 'さきにこっちおねがい', 'saki ni kocchi onegai', 'önce bunu yap lütfen'),
      W('ゴミを出す', 'ゴミをだす', 'gomi o dasu', 'çöpü çıkarmak'),
    ],
  },
]

/* ───────── Dialogues ───────── */

export interface Scene {
  title: string
  /** Where and who, in Turkish. */
  setting: string
  /** 店 = you (staff), 客 = customer, 長 = store manager. */
  lines: { who: '店' | '客' | '長'; jp: string; tr: string }[]
  tips: string[]
  /** Say it yourself: the situation in Turkish, the Japanese behind the blur. */
  say: [string, string][]
}

export const SCENES: Scene[] = [
  {
    title: '{食券|しょっけん}を{受|う}け{取|と}る · ご{飯|はん}のサイズ',
    setting: 'Müşteri fişini (食券) uzatıyor. Pilav boyutunu ve nerede yiyeceğini sorman gerekiyor.',
    lines: [
      { who: '店', jp: 'いらっしゃいませ。[[{食券|しょっけん}をお{預|あず}かりします]]。', tr: 'Hoş geldiniz. Fişinizi alıyorum.' },
      { who: '客', jp: 'お{願|ねが}いします。', tr: 'Buyurun.' },
      { who: '店', jp: '{牛|ぎゅう}めしですね。[[ご{飯|はん}の{量|りょう}はいかがなさいますか]]。', tr: 'Gyūmeshi, değil mi? Pilav miktarı nasıl olsun?' },
      { who: '客', jp: '[[{大盛|おおも}り]]で。', tr: 'Büyük porsiyon.' },
      { who: '店', jp: 'かしこまりました。[[{店内|てんない}でお{召|め}し{上|あ}がりですか]]。', tr: 'Anlaşıldı. Burada mı yiyeceksiniz?' },
      { who: '客', jp: 'いえ、{持|も}ち{帰|かえ}りで。', tr: 'Hayır, paket.' },
      { who: '店', jp: 'かしこまりました。[[{番号|ばんごう}でお{呼|よ}びします]]ので、{少々|しょうしょう}お{待|ま}ちください。', tr: 'Anlaşıldı. Numaranızla çağıracağız, biraz bekleyin lütfen.' },
    ],
    tips: [
      'Müşteri sadece <b>大盛りで</b> / <b>並で</b> / <b>少なめで</b> der. 〜で = “~ olsun”.',
      'Kısa sorman da yeterli: <b>ご飯のサイズは？</b> (gohan no saizu wa?). Kibarı: <b>ご飯の量はいかがなさいますか</b>.',
      '<b>持ち帰り</b> derse → paket: çubuk ve poşet sorusu gelecek.',
    ],
    say: [
      ['Fişinizi alıyorum.', '{食券|しょっけん}をお{預|あず}かりします。'],
      ['Pilav miktarı nasıl olsun?', 'ご{飯|はん}の{量|りょう}はいかがなさいますか。'],
      ['Burada mı yiyeceksiniz, paket mi?', '{店内|てんない}でお{召|め}し{上|あ}がりですか、お{持|も}ち{帰|かえ}りですか。'],
      ['Numaranızla çağıracağız.', '{番号|ばんごう}でお{呼|よ}びします。'],
    ],
  },
  {
    title: '{番号|ばんごう}で{呼|よ}ぶ · お{弁当|べんとう}を{渡|わた}す',
    setting: 'Paket sipariş hazır. Numarayı çağırıp siparişi teyit ederek teslim ediyorsun.',
    lines: [
      { who: '店', jp: '[[183{番|ばん}のお{客様|きゃくさま}]]、[[お{待|ま}たせいたしました]]。', tr: '183 numara, siparişiniz hazır.' },
      { who: '客', jp: 'はい。', tr: 'Evet.' },
      { who: '店', jp: '{牛|ぎゅう}めしの{大盛|おおも}りと{豚汁|とんじる}で[[よろしいですか]]。', tr: 'Büyük gyūmeshi ve tonjiru, doğru mu?' },
      { who: '客', jp: 'はい、そうです。', tr: 'Evet, öyle.' },
      { who: '店', jp: '[[お{箸|はし}はこちらです]]。{紅生姜|べにしょうが}と{七味|しちみ}もお{入|い}れしておきました。', tr: 'Çubuklar burada. Beni shōga ve shichimi’yi de koydum.' },
      { who: '店', jp: '[[{熱|あつ}いのでお{気|き}をつけください]]。ありがとうございました。', tr: 'Sıcak, dikkat edin. Teşekkürler.' },
    ],
    tips: [
      'Numara: 183 = <b>ひゃくはちじゅうさん</b>. 番 (ban) = numara. Yavaş ve net söyle.',
      '<b>お弁当のお客様</b> = paket siparişi olan müşteri — numara yerine de denir.',
      'Teslimde üç adım: numara → siparişi teyit (〜でよろしいですか) → çubuk/uyarı → teşekkür.',
    ],
    say: [
      ['57 numara, siparişiniz hazır.', '57{番|ばん}のお{客様|きゃくさま}、お{待|ま}たせいたしました。'],
      ['Paket siparişi olan müşteri!', 'お{弁当|べんとう}のお{客様|きゃくさま}。'],
      ['Çubuklar burada.', 'お{箸|はし}はこちらです。'],
      ['Sıcak, dikkat edin.', '{熱|あつ}いのでお{気|き}をつけください。'],
    ],
  },
  {
    title: 'お{箸|はし}・ソース・{袋|ふくろ}',
    setting: 'Paket müşterisi ekstra istiyor: çubuk, sos, poşet.',
    lines: [
      { who: '店', jp: '[[お{箸|はし}は{何膳|なんぜん}お{付|つ}けしますか]]。', tr: 'Kaç çift çubuk koyayım?' },
      { who: '客', jp: '3{膳|ぜん}お{願|ねが}いします。', tr: '3 çift lütfen.' },
      { who: '客', jp: 'あと、ドレッシングを2つもらえますか。', tr: 'Bir de iki salata sosu alabilir miyim?' },
      { who: '店', jp: 'ごまと{和風|わふう}、[[どちらになさいますか]]。', tr: 'Susamlı mı Japon usulü mü olsun?' },
      { who: '客', jp: 'ごまで。', tr: 'Susamlı.' },
      { who: '店', jp: 'かしこまりました。[[{袋|ふくろ}はご{利用|りよう}ですか]]。', tr: 'Anlaşıldı. Poşet ister misiniz?' },
      { who: '客', jp: 'いえ、{大丈夫|だいじょうぶ}です。', tr: 'Hayır, gerek yok.' },
    ],
    tips: [
      '<b>大丈夫です</b> burada “gerek yok” demek — “evet” değil!',
      'Seçenek sorusu: <b>A と B、どちらになさいますか</b>. Cevap genelde <b>〜で</b>.',
      'Sayaç: 1膳 いちぜん · 2膳 にぜん · 3膳 さんぜん.',
    ],
    say: [
      ['Kaç çift çubuk koyayım?', 'お{箸|はし}は{何膳|なんぜん}お{付|つ}けしますか。'],
      ['Susamlı mı Japon usulü mü?', 'ごまと{和風|わふう}、どちらになさいますか。'],
      ['Poşet ister misiniz?', '{袋|ふくろ}はご{利用|りよう}ですか。'],
    ],
  },
  {
    title: '{変更|へんこう}・{品切|しなぎ}れ',
    setting: 'Müşteri çorbayı değiştirmek istiyor; bir ürün de bitmiş.',
    lines: [
      { who: '客', jp: 'すみません、{味噌汁|みそしる}を{豚汁|とんじる}に{変|か}えられますか。', tr: 'Affedersiniz, miso çorbasını tonjiru ile değiştirebilir miyim?' },
      { who: '店', jp: 'はい、[[{豚汁変更|とんじるへんこう}]]の{食券|しょっけん}をお{買|か}い{求|もと}めいただければ、お{作|つく}りできます。', tr: 'Evet, “tonjiru değişimi” fişini alırsanız hazırlayabiliriz.' },
      { who: '客', jp: 'わかりました。あと、ハンバーグ{定食|ていしょく}も{一|ひと}つ。', tr: 'Tamam. Bir de hamburg set.' },
      { who: '店', jp: '[[{申|もう}し{訳|わけ}ございません]]。[[ただいまハンバーグが{品切|しなぎ}れでございます]]。', tr: 'Çok özür dileriz. Hamburg şu an tükendi.' },
      { who: '店', jp: 'ほかのメニューでもよろしいですか。', tr: 'Başka bir menü olur mu?' },
      { who: '客', jp: 'じゃあ、{唐揚|からあ}げ{定食|ていしょく}で。', tr: 'O zaman karaage set.' },
    ],
    tips: [
      '<b>〜に変えられますか</b> = ~ ile değiştirebilir miyim?',
      'Kötü haber hep <b>申し訳ございません</b> ile başlar, sonra durum: <b>品切れでございます</b>.',
    ],
    say: [
      ['Çok özür dileriz, şu an tükendi.', '{申|もう}し{訳|わけ}ございません。ただいま{品切|しなぎ}れでございます。'],
      ['Başka bir menü olur mu?', 'ほかのメニューでもよろしいですか。'],
    ],
  },
  {
    title: 'ミス · {作|つく}り{直|なお}し',
    setting: 'Müşteri yanlış ürün geldiğini söylüyor.',
    lines: [
      { who: '客', jp: 'すみません、これ{頼|たの}んだのと{違|ちが}うんですけど。', tr: 'Affedersiniz, bu sipariş ettiğim şey değil.' },
      { who: '店', jp: '[[{大変申|たいへんもう}し{訳|わけ}ございません]]。ご{注文|ちゅうもん}は{何|なん}でしたか。', tr: 'Çok çok özür dileriz. Siparişiniz neydi?' },
      { who: '客', jp: '{牛|ぎゅう}めしの{並|なみ}で、ネギ{抜|ぬ}きです。', tr: 'Normal gyūmeshi, soğansız.' },
      { who: '店', jp: '[[すぐにお{作|つく}り{直|なお}しいたします]]。{少々|しょうしょう}お{待|ま}ちください。', tr: 'Hemen yeniden hazırlıyorum. Biraz bekleyin lütfen.' },
    ],
    tips: [
      'Hata olunca önce özür: <b>大変申し訳ございません</b>, sonra hemen çözüm: <b>すぐにお作り直しいたします</b>.',
      '<b>〜抜き</b> = ~siz: ネギ抜き soğansız, 玉ねぎ抜き kuru soğansız.',
    ],
    say: [
      ['Çok çok özür dileriz.', '{大変申|たいへんもう}し{訳|わけ}ございません。'],
      ['Hemen yeniden hazırlıyorum.', 'すぐにお{作|つく}り{直|なお}しいたします。'],
    ],
  },
  {
    title: '{客席|きゃくせき} · {水|みず}・{下|さ}げる',
    setting: 'Salonda müşteri su istiyor; yemeğini bitiren müşterinin tepsisini alıyorsun.',
    lines: [
      { who: '客', jp: 'すみません、お{水|みず}ください。', tr: 'Affedersiniz, su alabilir miyim?' },
      { who: '店', jp: '[[お{水|みず}はあちらのセルフサービスになっております]]。', tr: 'Su şurada, self servis.' },
      { who: '店', jp: '[[お{下|さ}げしてもよろしいですか]]。', tr: 'Tepsinizi alabilir miyim?' },
      { who: '客', jp: 'はい、ごちそうさまでした。', tr: 'Evet, ellerinize sağlık.' },
      { who: '店', jp: 'ありがとうございました。[[またお{越|こ}しくださいませ]]。', tr: 'Teşekkürler. Yine bekleriz.' },
    ],
    tips: ['<b>お下げしてもよろしいですか</b>: “alabilir miyim” — müşteri hâlâ yiyorsa sormadan alma.'],
    say: [
      ['Su şurada, self servis.', 'お{水|みず}はあちらのセルフサービスになっております。'],
      ['Tepsinizi alabilir miyim?', 'お{下|さ}げしてもよろしいですか。'],
      ['Yine bekleriz.', 'またお{越|こ}しくださいませ。'],
    ],
  },
  {
    title: '{店長|てんちょう}の{指示|しじ} · サラダ・ソース・{洗|あら}い{物|もの}',
    setting: 'Müdür (長) mutfakta iş veriyor: salata, sos doldurma, bulaşık.',
    lines: [
      { who: '長', jp: 'ラマザンさん、[[{手|て}が{空|あ}いたら]]サラダを5つ{作|つく}っておいて。', tr: 'Ramazan, elin boşalınca 5 salata hazırlayıver.' },
      { who: '店', jp: 'はい、わかりました。', tr: 'Tamam, anladım.' },
      { who: '長', jp: 'それから、ドレッシングが[[{少|すく}なくなってる]]から[[{補充|ほじゅう}して]]。', tr: 'Bir de salata sosu azalmış, doldur.' },
      { who: '店', jp: 'どのドレッシングですか。', tr: 'Hangi sos?' },
      { who: '長', jp: 'ごまのほう。{終|お}わったら[[{洗|あら}い{物|もの}]]お{願|ねが}い。[[たまってる]]から。', tr: 'Susamlı olan. Bitince bulaşık lütfen, birikmiş.' },
      { who: '店', jp: '{食洗機|しょくせんき}に{入|い}れていいですか。', tr: 'Bulaşık makinesine koyabilir miyim?' },
      { who: '長', jp: 'うん、お{盆|ぼん}と{丼|どんぶり}は{食洗機|しょくせんき}で、{鍋|なべ}は{手|て}で{洗|あら}って。[[{終|お}わったら{声|こえ}かけてね]]。', tr: 'Evet, tepsi ve kâseler makinede, tencereler elde. Bitince haber ver.' },
      { who: '店', jp: 'わかりました。', tr: 'Anladım.' },
    ],
    tips: [
      'Sıra: 手が空いたら → サラダ, sonra ドレッシング補充, bitince 洗い物, en son 声をかける.',
      'Anlamadığında sor: <b>どの〜ですか</b> (hangi ~?), <b>〜に入れていいですか</b> (~ e koyabilir miyim?).',
      '<b>〜ておいて</b> = önceden/hazır olsun diye yapıver.',
    ],
    say: [
      ['Hangi sos?', 'どのドレッシングですか。'],
      ['Bulaşık makinesine koyabilir miyim?', '{食洗機|しょくせんき}に{入|い}れていいですか。'],
      ['Bitti. Başka ne yapayım?', '{終|お}わりました。ほかに{何|なに}をしましょうか。'],
      ['Sos bitmiş (kalmamış).', 'ソースを{切|き}らしています。'],
    ],
  },
]

/* ───────── Order slips ───────── */

export interface Slip {
  title: string
  setting: string
  /** The slip as printed, one line each. */
  lines: string[]
  questions: [string, string][]
}

export const SLIPS: Slip[] = [
  {
    title: '{持|も}ち{帰|かえ}り · {牛皿|ぎゅうざら}3と{定食|ていしょく}',
    setting: 'Mutfak yazıcısından çıkan paket sipariş fişi. Önce numara ve paket mi bak, sonra ürünler, en son poşete girecek ekstralar.',
    lines: [
      '【お{持|も}ち{帰|かえ}り】　{注文番号|ちゅうもんばんごう} 183',
      '{牛皿|ぎゅうざら}　{並盛|なみもり}　　　×3',
      'ハンバーグ{定食|ていしょく}　　×1',
      '　└ ご{飯|はん}{大盛|おおもり}',
      '{生野菜|なまやさい}　　　　　×1',
      '────────────',
      '〈{付属品|ふぞくひん}〉',
      'ケチャップ　　　　×1',
      'ごまドレッシング　×1',
      '{七味|しちみ}　　　　　　×4',
      '{紅生姜|べにしょうが}　　　　　×2',
      'お{箸|はし}　　　　　　×4{膳|ぜん}',
      '{袋|ふくろ}　　　　　　　{要|よう}',
    ],
    questions: [
      ['Numara ne, nerede yiyecek?', '183 · paket (お持ち帰り)'],
      ['牛皿 nedir, kaç tane?', 'Pilavsız sığır eti tabağı, normal boy, 3 tane'],
      ['Set (定食) hangisi ve özel isteği ne?', 'Hamburg set, pilavı büyük (ご飯大盛)'],
      ['Poşete hangi ekstralar girecek?', 'ketçap 1, susamlı sos 1 (salata için), shichimi 4, beni shōga 2, çubuk 4 çift'],
      ['袋 要 ne demek?', 'Poşet gerekli (要 = gerekli, 不要 = gereksiz)'],
    ],
  },
  {
    title: '{店内|てんない} · {変更|へんこう}と{抜|ぬ}き',
    setting: 'Salonda yiyecek iki kişilik sipariş. Değişiklik ve “~siz” isteklerine dikkat.',
    lines: [
      '【{店内|てんない}】　{注文番号|ちゅうもんばんごう} 57',
      '{牛|ぎゅう}めし　{大盛|おおもり}　　×2',
      '　└ うち1つ ネギ{抜|ぬ}き',
      '{豚汁変更|とんじるへんこう}　　　　×1',
      '{生卵|なまたまご}　　　　　　×2',
      'お{新香|しんこ}　　　　　×1',
    ],
    questions: [
      ['Kaç gyūmeshi, hangi boy?', '2 tane, büyük (大盛)'],
      ['Özel istek ne?', 'Birinde yeşil soğan yok (うち1つ ネギ抜き)'],
      ['豚汁変更 ne demek?', 'Bir miso çorbası tonjiru ile değiştirilecek'],
      ['Yanında başka ne var?', '2 çiğ yumurta ve 1 turşu (お新香)'],
    ],
  },
  {
    title: '{朝定食|あさていしょく} · {箸|はし}{不要|ふよう}',
    setting: 'Sabah paket siparişi. “不要” kelimesini kaçırma.',
    lines: [
      '【お{持|も}ち{帰|かえ}り】　{注文番号|ちゅうもんばんごう} 204',
      '{朝定食|あさていしょく}（{納豆|なっとう}）　×2',
      '　└ 1つ ご{飯少|はんすく}なめ',
      '{味噌汁|みそしる}→{豚汁|とんじる}　　×1',
      '〈{付属品|ふぞくひん}〉',
      '{醤油|しょうゆ}　　　　　　×2',
      'からし　　　　　　×2',
      'お{箸|はし}　　　　　　{不要|ふよう}',
      '{袋|ふくろ}　　　　　　　{要|よう}',
    ],
    questions: [
      ['Kaç set ve hangisi?', '2 kahvaltı seti (nattōlu)'],
      ['Pilav isteği?', 'Birinde az pilav (ご飯少なめ)'],
      ['Çorba değişikliği?', '1 miso çorbası → tonjiru'],
      ['Çubuk koyacak mısın?', 'Hayır! お箸 不要 = çubuk istemiyor'],
      ['Ekstralar?', 'soya sosu 2, Japon hardalı 2 (nattō için), poşet var'],
    ],
  },
  {
    title: '{食券|しょっけん}を{読|よ}む',
    setting: 'Müşterinin makineden aldığı fiş (食券). Kasada sana uzatılır.',
    lines: [
      '{松屋|まつや}　{食券|しょっけん}',
      '{牛|ぎゅう}めし　{並盛|なみもり}',
      '{店内|てんない}',
      '{生野菜|なまやさい}セット',
      '¥ 590（{税込|ぜいこみ}）',
    ],
    questions: [
      ['Ne sipariş etmiş?', 'Normal gyūmeshi + salata seti'],
      ['Nerede yiyecek?', 'Burada (店内)'],
      ['Fiyatın yanındaki 税込 ne?', 'Vergi dahil'],
      ['Fişi alırken ne dersin?', '{食券|しょっけん}をお{預|あず}かりします。'],
    ],
  },
]
