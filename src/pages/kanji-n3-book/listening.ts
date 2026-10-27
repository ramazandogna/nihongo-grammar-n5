/**
 * The book's two listening parts (聴解 問題1 and 問題2), from its script
 * pages, taught step by step: the setup and the question first, then the
 * choices, then the script line by line, then how to get to the answer.
 *
 * Notation as everywhere: {漢字|かんじ}, [[the sentence that decides it]].
 * The answers were worked out from the script (the circles in the photos of
 * the book are the reader's own attempts, not the key).
 */
export type Speaker = 'M' | 'F'

export interface ListeningItem {
  no: string
  /** The narrator's first sentence: who is talking, where. */
  setup: string
  setupTr: string
  question: string
  questionTr: string
  /** Before the script: what to listen for. Never gives the answer away. */
  focus: string
  /** For 1番, whose choices are pictures. */
  pictures?: { label: string; jp: string; tr: string }[]
  options: { jp: string; tr: string }[]
  answer: number
  lines: [Speaker, string, string][]
  /** How to reach the answer: why it is right, why the others are traps. */
  solution: string[]
  words: [string, string][]
}

export interface ListeningPart {
  id: 'l1' | 'l2'
  title: string
  name: string
  /** What this question type is and how to approach it. */
  intro: string[]
  steps: string[]
  phrases: [string, string][]
  items: ListeningItem[]
}

const M = 'M' as const
const F = 'F' as const

export const LISTENING: ListeningPart[] = [
  {
    id: 'l1',
    title: 'Listening 1',
    name: '{問題|もんだい}1 · {課題理解|かだいりかい}',
    intro: [
      'Bu tipte biri bir şey yapmak zorundadır ve soru hep <b>“ne yapacak / önce ne yapacak?”</b> diye sorar. Soru konuşmadan <b>önce</b> okunur — yani neyi aradığını baştan bilirsin.',
      'Konuşmada birçok iş geçer. Tuzak şu: bazıları <b>zaten yapılmış</b>, bazıları <b>başkası yapacak</b>, bazıları <b>sonra</b> yapılacak. Sen sadece o kişinin <b>şimdi, ilk</b> yapacağı işi arıyorsun.',
    ],
    steps: [
      'Soruyu dinlerken <b>kim</b> (男の人 / 女の人) ve <b>ne</b> (まず = önce / これから = şimdiden sonra) sorulduğunu yakala.',
      'Şıklara bak: hepsi konuşmada geçecek. Hangisinin elendiğini işaretle.',
      'Şu kelimeler sırayı söyler: <b>まず</b> (önce), <b>それから</b> (sonra), <b>〜てから / 〜たら</b> (...dıktan sonra), <b>あとで / あとにして</b> (sonra yap).',
      'Şunlar eler: <b>もう〜た / さっき届いた</b> (zaten oldu), <b>それは大丈夫</b> (gerek yok), <b>自分でやっておく</b> (ben yaparım = başkası), <b>〜に頼んでおく</b> (başkasına verdim).',
    ],
    phrases: [
      ['{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。', 'Bir adam ile bir kadın konuşuyor. (Her soru böyle başlar: sadece kim konuşuyor.)'],
      ['{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Kadın bundan sonra İLK olarak ne yapacak?'],
      ['{夫|おっと}はこれから{何|なに}をしますか。', 'Koca şimdiden sonra ne yapacak?'],
      ['{何時|なんじ}までに〜', 'Saat kaça kadar ~ (en geç ne zaman)'],
      ['〜なければなりませんか', '~ yapmak zorunda?'],
      ['M：{男性|だんせい}　F：{女性|じょせい}', 'Metinde M = erkek, F = kadın konuşuyor.'],
    ],
    items: [
      {
        no: '{例|れい}',
        setup: 'ホテルで{会社員|かいしゃいん}の{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。',
        setupTr: 'Bir otelde şirket çalışanı bir adam ile bir kadın konuşuyor.',
        question: '{女|おんな}の{人|ひと}は{明日|あした}{何時|なんじ}までにホテルを{出|で}ますか。',
        questionTr: 'Kadın yarın en geç saat kaçta otelden çıkacak?',
        focus: 'Saat sorusu. Birden fazla saat geçecek: buluşma saati, yol süresi ve bir “erken çık” uyarısı. Hesap yapmaya hazır ol.',
        options: [
          { jp: '8{時|じ}45{分|ふん}', tr: '8:45' },
          { jp: '9{時|じ}', tr: '9:00' },
          { jp: '9{時|じ}15{分|ふん}', tr: '9:15' },
          { jp: '9{時|じ}30{分|ぷん}', tr: '9:30' },
        ],
        answer: 0,
        lines: [
          [M, 'では、{明日|あした}は、9{時半|じはん}に{事務所|じむしょ}にいらしてください。', 'O hâlde yarın 9 buçukta ofise gelin lütfen.'],
          [F, 'はい、ええと、このホテルから{事務所|じむしょ}まで、タクシーでどのぐらいかかりますか。', 'Tamam, şey, bu otelden ofise taksiyle ne kadar sürer?'],
          [M, 'そうですね、30{分|ぷん}もあれば{着|つ}きますね。', 'Hmm, 30 dakika olsa varırsınız.'],
          [F, 'じゃ、9{時|じ}に{出|で}ればいいですね。', 'O zaman 9’da çıksam yeter, değil mi?'],
          [M, 'あ、[[{朝|あさ}は{道|みち}が{込|こ}むかもしれません。15{分|ふん}ぐらい{早|はや}めに{出|で}られたほうがいいですね]]。', 'Ah, sabah yollar kalabalık olabilir. 15 dakika kadar erken çıksanız iyi olur.'],
          [F, 'そうですか。じゃ、そうします。', 'Öyle mi. Tamam, öyle yaparım.'],
        ],
        solution: [
          'Ofiste 9:30’da olmalı, yol 30 dakika → 9:00’da çıkmalı. Kadın da bunu söylüyor (9{時|じ}に{出|で}ればいい).',
          'Ama adam düzeltiyor: <b>15{分|ふん}ぐらい{早|はや}めに</b> = 15 dakika erken. Kadın <b>じゃ、そうします</b> diyerek kabul ediyor → 9:00 − 15 dk = <b>8:45</b>.',
          'Tuzaklar: 9:00 kadının ilk fikri (sonra değişti), 9:30 ofise varış saati (çıkış değil).',
        ],
        words: [
          ['{事務所|じむしょ}', 'ofis'],
          ['いらしてください', 'gelin (いらっしゃる’nın kibar emri)'],
          ['{込|こ}む', 'kalabalık olmak (yol, tren)'],
          ['{早|はや}めに', 'biraz erken(den)'],
          ['〜たほうがいい', '~ yapsanız iyi olur'],
        ],
      },
      {
        no: '1{番|ばん}',
        setup: '{電話|でんわ}で{妻|つま}と{夫|おっと}が{話|はな}しています。',
        setupTr: 'Telefonda bir kadın (eş) ile kocası konuşuyor.',
        question: '{夫|おっと}はこれから{何|なに}をしますか。',
        questionTr: 'Koca şimdiden sonra ne yapacak?',
        focus: 'Kadın kocasından birkaç iş isteyecek. Her isteğe kocanın cevabını dinle: kabul mü, “zaten oldu” mu, “gerek yok” mu?',
        pictures: [
          { label: 'ア', jp: '{洗濯物|せんたくもの}を{取|と}り{込|こ}む', tr: 'Çamaşırları içeri toplamak' },
          { label: 'イ', jp: '{荷物|にもつ}を{受|う}け{取|と}る', tr: 'Paketi teslim almak' },
          { label: 'ウ', jp: '{料理|りょうり}を{作|つく}る', tr: 'Yemek yapmak' },
          { label: 'エ', jp: '{庭|にわ}に{水|みず}をやる', tr: 'Bahçeyi sulamak' },
        ],
        options: [
          { jp: 'ア ウ', tr: 'çamaşır + yemek' },
          { jp: 'ア エ', tr: 'çamaşır + bahçe' },
          { jp: 'イ ウ', tr: 'paket + yemek' },
          { jp: 'イ エ', tr: 'paket + bahçe' },
        ],
        answer: 1,
        lines: [
          [F, 'もしもし、{今|いま}、{用事|ようじ}が{終|お}わったから{帰|かえ}ろうと{思|おも}って{駅|えき}に{来|き}たんだけど、{電車|でんしゃ}が{動|うご}いてなくって。', 'Alo, işim bitti, eve döneyim diye istasyona geldim ama trenler çalışmıyor.'],
          [M, 'えっ{本当|ほんとう}？', 'Ne, gerçekten mi?'],
          [F, 'うん。{少|すこ}し{帰|かえ}る{時間|じかん}が{遅|おそ}くなっちゃうと{思|おも}う。そろそろ{暗|くら}くなるし、[[{洗濯物|せんたくもの}{取|と}り{込|こ}んどいてくれる]]？', 'Evet. Biraz geç kalacağım galiba. Hava kararıyor, çamaşırları içeri toplar mısın?'],
          [M, '[[{分|わ}かった]]。', 'Tamam.'],
          [F, 'それから、もうすぐ{荷物|にもつ}が{届|とど}くことになってるから、{受|う}け{取|と}っといて。', 'Bir de birazdan bir paket gelecek, teslim alıver.'],
          [M, 'ああ、[[それさっき{届|とど}いたよ]]。{晩|ばん}ご{飯|はん}どうする？{作|つく}っておこうか。', 'Ha, o az önce geldi. Akşam yemeği ne olacak? Ben yapayım mı?'],
          [F, 'ありがとう。[[それは{大丈夫|だいじょうぶ}]]。{何|なに}かすぐ{食|た}べられるもの{買|か}って{帰|かえ}るから。それより、[[{庭|にわ}の{水|みず}やっといてもらえない]]？いろいろ{頼|たの}んで{悪|わる}いんだけど。', 'Sağ ol, ona gerek yok. Hemen yenecek bir şey alıp gelirim. Onun yerine bahçeyi sular mısın? Çok şey istiyorum, kusura bakma.'],
          [M, '{分|わ}かった。', 'Tamam.'],
        ],
        solution: [
          'ア çamaşır: kadın istedi, koca <b>{分|わ}かった</b> dedi → yapacak ✓',
          'イ paket: <b>さっき{届|とど}いた</b> = az önce geldi → zaten olmuş, yapmayacak ✗',
          'ウ yemek: koca teklif etti ama kadın <b>それは{大丈夫|だいじょうぶ}</b> = gerek yok dedi ✗',
          'エ bahçe: <b>それより</b> (onun yerine) ile istendi, koca <b>{分|わ}かった</b> → yapacak ✓ → <b>ア エ</b>',
        ],
        words: [
          ['{取|と}り{込|こ}んどいて', '取り込んでおいて: içeri toplayıver (〜ておく → 〜とく)'],
          ['{受|う}け{取|と}る', 'teslim almak'],
          ['さっき', 'az önce'],
          ['{大丈夫|だいじょうぶ}', 'burada: gerek yok, sorun değil'],
          ['それより', 'ondan ziyade, onun yerine'],
          ['{水|みず}をやる', 'sulamak (bitkiye su vermek)'],
        ],
      },
      {
        no: '2{番|ばん}',
        setup: 'クリーニング{屋|や}で{女|おんな}の{人|ひと}と{店員|てんいん}が{話|はな}しています。',
        setupTr: 'Bir kuru temizlemecide bir kadın ile çalışan konuşuyor.',
        question: '{女|おんな}の{人|ひと}はワンピースをいつ{取|と}りに{来|き}ますか。',
        questionTr: 'Kadın elbiseyi ne zaman almaya gelecek?',
        focus: 'Gün sorusu. Bugünün hangi gün olduğunu, normal teslim gününü ve araya giren “ama”ları takip et; her “ama” günü kaydırır.',
        options: [
          { jp: '{水曜日|すいようび}', tr: 'Çarşamba' },
          { jp: '{木曜日|もくようび}', tr: 'Perşembe' },
          { jp: '{金曜日|きんようび}', tr: 'Cuma' },
          { jp: '{土曜日|どようび}', tr: 'Cumartesi' },
        ],
        answer: 2,
        lines: [
          [F, 'すみません、このワンピースお{願|ねが}いします。いつできますか。', 'Affedersiniz, bu elbiseyi bırakıyorum. Ne zaman hazır olur?'],
          [M, 'ええと[[{今日|きょう}は{水曜日|すいようび}]]ですね。{土曜日|どようび}にお{渡|わた}しできます。', 'Şey, bugün çarşamba. Cumartesi teslim edebiliriz.'],
          [F, 'そうですか。その{日|ひ}に{結婚式|けっこんしき}があるんで、その{前日|ぜんじつ}までには{取|と}りに{来|き}たいんですが。', 'Öyle mi. O gün bir düğün var, bir gün öncesine kadar almak istiyorum.'],
          [M, '{急|いそ}ぐようでしたら、500{円|えん}{高|たか}くなってしまいますが、[[{預|あず}かった{翌日|よくじつ}にできる]]コースもありますので、そちらにしていただけないでしょうか。', 'Acelenizse 500 yen daha pahalı olur ama bıraktığınız günün ertesi günü hazır olan bir seçenek de var, onu seçer misiniz?'],
          [F, '{分|わ}かりました。', 'Anladım.'],
          [M, 'あ、{申|もう}し{訳|わけ}ありません。[[{明日|あした}は{定休日|ていきゅうび}]]なので。', 'Ah, özür dilerim. Yarın kapalıyız (haftalık tatil).'],
          [F, 'じゃ、[[その{次|つぎ}の{日|ひ}]]ですね。', 'O zaman ondan sonraki gün.'],
          [M, 'はい、よろしくお{願|ねが}いします。', 'Evet, teşekkürler.'],
        ],
        solution: [
          'Bugün çarşamba. Normal teslim cumartesi ama düğün cumartesi; kadın <b>{前日|ぜんじつ}</b> (bir gün önce = cuma) almak istiyor.',
          'Hızlı seçenek: <b>{翌日|よくじつ}</b> (ertesi gün) = perşembe. Ama <b>{明日|あした}は{定休日|ていきゅうび}</b> → perşembe kapalı.',
          '<b>その{次|つぎ}の{日|ひ}</b> = perşembenin ertesi günü = <b>cuma (金曜日)</b>.',
          'Tuzak: perşembe (翌日) ilk akla gelen; çarşamba bugün; cumartesi normal teslim ve düğün günü.',
        ],
        words: [
          ['{前日|ぜんじつ}', 'bir önceki gün'],
          ['{翌日|よくじつ}', 'ertesi gün'],
          ['{定休日|ていきゅうび}', 'dükkânın düzenli kapalı günü'],
          ['{預|あず}かる', 'emanet almak (dükkân müşterinin eşyasını)'],
          ['お{渡|わた}しできます', 'teslim edebiliriz (kibar)'],
        ],
      },
      {
        no: '3{番|ばん}',
        setup: '{会社|かいしゃ}で{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{歓迎会|かんげいかい}について{話|はな}しています。',
        setupTr: 'Şirkette bir adam ile bir kadın hoş geldin partisi hakkında konuşuyor.',
        question: '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。',
        questionTr: 'Kadın bundan sonra İLK olarak ne yapacak?',
        focus: 'Adam kadına birkaç işi sırayla verecek. “〜たら” (…dıktan sonra) ile bağlanan zinciri yakala: hangisi en başta?',
        options: [
          { jp: 'さんかしゃを かくにんする', tr: 'Katılımcıları netleştirmek (kim geliyor, sormak)' },
          { jp: '{店|みせ}に{電話|でんわ}する', tr: 'Restoranı aramak' },
          { jp: 'メールを かくにんする', tr: 'E-postayı kontrol etmek' },
          { jp: 'ないようを{決|き}める', tr: 'Partinin içeriğini belirlemek' },
        ],
        answer: 0,
        lines: [
          [M, '{再来週|さらいしゅう}の{新入社員|しんにゅうしゃいん}の{歓迎会|かんげいかい}、{僕|ぼく}が{準備|じゅんび}することになってたでしょう。ちょっと{手伝|てつだ}ってほしいんだけど。', 'İki hafta sonraki yeni çalışanların hoş geldin partisini ben hazırlayacaktım ya. Biraz yardım etmeni istiyorum.'],
          [F, 'うん、いいよ。', 'Olur.'],
          [M, '[[{営業課|えいぎょうか}{全員|ぜんいん}に{出|で}られるかどうかを{聞|き}いてくれる]]？もう{店|みせ}は{決|き}まってて、{大体|だいたい}の{人数|にんずう}は{伝|つた}えてあるんだけど、そろそろ{最終的|さいしゅうてき}な{人数|にんずう}をお{店|みせ}に{連絡|れんらく}しなきゃならないんだ。', 'Satış bölümündeki herkese katılıp katılamayacağını sorar mısın? Restoran belli, yaklaşık kişi sayısını söyledim ama artık kesin sayıyı bildirmem lazım.'],
          [F, '{分|わ}かった。', 'Tamam.'],
          [M, '[[{全員|ぜんいん}に{聞|き}いたら]]、{店|みせ}に{電話|でんわ}して、{人数|にんずう}を{連絡|れんらく}しておいてくれる？その{店|みせ}、{今日|きょう}は{休|やす}みだから、{明日以降|あしたいこう}でいいよ。それから、メンバーが{決|き}まったら、{僕|ぼく}にもメールで{教|おし}えて。{参加|さんか}する{人|ひと}{確認|かくにん}したいから。', 'Herkese sorduktan sonra restoranı arayıp sayıyı bildirir misin? Restoran bugün kapalı, yarından sonra olur. Bir de kişiler belli olunca bana da mail at. Katılanları kontrol etmek istiyorum.'],
          [F, 'うん。ほかに{何|なに}かない？', 'Tamam. Başka bir şey var mı?'],
          [M, '{歓迎会|かんげいかい}で{何|なに}をするか、{内容|ないよう}を{決|き}めなくちゃいけないんだけど。[[それは{自分|じぶん}でやっておくよ]]。じゃ、よろしく。', 'Partide ne yapacağımızı belirlememiz lazım ama onu ben hallederim. Hadi, kolay gelsin.'],
        ],
        solution: [
          'Sıra: ① herkese sor (katılımcıları netleştir) → <b>{全員|ぜんいん}に{聞|き}いたら</b> ② restoranı ara → <b>メンバーが{決|き}まったら</b> ③ adama mail at.',
          'Restoranı aramak ikinci adım; üstelik <b>{今日|きょう}は{休|やす}み</b>, yarından önce olmaz ✗',
          'Mail üçüncü adım ve kadın mail atacak, “kontrol etmek” değil ✗',
          'İçerik: <b>{自分|じぶん}でやっておく</b> → bunu adam yapacak ✗ → <b>1 さんかしゃをかくにんする</b>',
        ],
        words: [
          ['{歓迎会|かんげいかい}', 'hoş geldin partisi'],
          ['{営業課|えいぎょうか}', 'satış bölümü'],
          ['〜かどうか', '~ olup olmadığını'],
          ['{最終的|さいしゅうてき}な{人数|にんずう}', 'kesin kişi sayısı'],
          ['{明日以降|あしたいこう}', 'yarından itibaren'],
          ['{自分|じぶん}でやっておく', 'kendim hallederim'],
        ],
      },
      {
        no: '4{番|ばん}',
        setup: '{大学|だいがく}の{英語|えいご}セミナーの{説明会|せつめいかい}で{係|かか}りの{人|ひと}が{話|はな}しています。',
        setupTr: 'Üniversitenin İngilizce semineri tanıtımında görevli biri konuşuyor.',
        question: '{参加|さんか}したい{学生|がくせい}はまず{何|なに}をしなければなりませんか。',
        questionTr: 'Katılmak isteyen öğrenci önce ne yapmak zorunda?',
        focus: 'Tek kişi konuşuyor (duyuru). Adımlar art arda sayılacak; “〜たあと” (…dan sonra) duyduğun adımlar ilk adım olamaz.',
        options: [
          { jp: 'セミナーにもうしこむ', tr: 'Seminere başvurmak' },
          { jp: 'テストをうける', tr: 'Sınava girmek' },
          { jp: 'けいじばんを{見|み}る', tr: 'İlan panosuna bakmak' },
          { jp: 'さんかひを ふりこむ', tr: 'Katılım ücretini yatırmak' },
        ],
        answer: 1,
        lines: [
          [M, 'えー、{夏休|なつやす}みの{上級|じょうきゅう}{英語|えいご}セミナーについて{説明|せつめい}します。', 'Evet, yaz tatilindeki ileri seviye İngilizce seminerini anlatıyorum.'],
          [M, 'セミナーに{申|もう}し{込|こ}みたい{人|ひと}は、[[インターネットでテストを{受|う}けてください]]。', 'Başvurmak isteyenler internetten sınava girsin.'],
          [M, 'テストの{点数|てんすう}によって、{参加|さんか}できるかどうか{決|き}まりますから、{必|かなら}ず{今週中|こんしゅうちゅう}に{受|う}けておくようにしてください。', 'Katılıp katılamayacağınız sınav puanına göre belirlenir, mutlaka bu hafta içinde girin.'],
          [M, '{結果|けっか}は、{来週|らいしゅう}、{学生課|がくせいか}の{前|まえ}の{掲示板|けいじばん}で{発表|はっぴょう}しますので、そちらで{確認|かくにん}してください。', 'Sonuçlar gelecek hafta öğrenci işlerinin önündeki panoda açıklanacak, oradan bakın.'],
          [M, 'セミナーの{申|もう}し{込|こ}みは、[[{結果|けっか}が{出|で}たあとに]]します。{参加費|さんかひ}の{振|ふ}り{込|こ}みも{同様|どうよう}です。', 'Başvuru sonuçlar çıktıktan sonra yapılır. Ücret yatırma da aynı şekilde.'],
          [M, '{申|もう}し{込|こ}み{期間|きかん}が{短|みじか}いので、{気|き}をつけてください。', 'Başvuru süresi kısa, dikkat edin.'],
        ],
        solution: [
          'Sıra: ① internetten sınav (<b>テストを{受|う}けてください</b>) → ② gelecek hafta panoda sonuç → ③ başvuru ve ücret (<b>{結果|けっか}が{出|で}たあと</b>).',
          'Başvuru ve ücret “sonuç çıktıktan sonra” → ilk adım olamaz ✗; pano ikinci adım ✗.',
          'Sınav “bu hafta içinde” ve en başta → <b>2 テストをうける</b>.',
        ],
        words: [
          ['{申|もう}し{込|こ}む', 'başvurmak'],
          ['{点数|てんすう}', 'puan'],
          ['{今週中|こんしゅうちゅう}に', 'bu hafta içinde'],
          ['{掲示板|けいじばん}', 'ilan panosu'],
          ['{振|ふ}り{込|こ}む', '(bankaya) para yatırmak'],
          ['{同様|どうよう}', 'aynı şekilde'],
        ],
      },
      {
        no: '5{番|ばん}',
        setup: '{会社|かいしゃ}で{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。',
        setupTr: 'Şirkette bir adam ile bir kadın konuşuyor.',
        question: '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。',
        questionTr: 'Kadın bundan sonra İLK olarak ne yapacak?',
        focus: 'Kadının elinde üç iş var. Adam önceliği değiştirecek; işlerin hangisi “bekleyebilir”, hangisi başkasına gidiyor?',
        options: [
          { jp: 'ちょうさけっかを{入力|にゅうりょく}する', tr: 'Anket sonuçlarını bilgisayara girmek' },
          { jp: 'サンプルを してんに{送|おく}る', tr: 'Numuneleri şubeye göndermek' },
          { jp: 'かいぎの じゅんびをする', tr: 'Toplantı hazırlığı yapmak' },
          { jp: '{大野|おおの}さんに{仕事|しごと}をたのむ', tr: 'Ōno’ya iş vermek' },
        ],
        answer: 0,
        lines: [
          [M, '{佐藤|さとう}さん、ちょっとアンケート{調査|ちょうさ}の{結果|けっか}の{入力|にゅうりょく}をお{願|ねが}いしたいんだけど、{今|いま}{忙|いそが}しい？', 'Satō, anket sonuçlarını girmeni rica edecektim, şu an meşgul müsün?'],
          [F, 'あ、{新製品|しんせいひん}のサンプルを{支店|してん}に{送|おく}る{準備|じゅんび}をしています。', 'Ah, yeni ürün numunelerini şubeye göndermeye hazırlanıyorum.'],
          [M, 'ああ、それね。[[それはもう{少|すこ}し{先|さき}でも{大丈夫|だいじょうぶ}だよ]]。', 'Ha, o mu. O biraz sonra da olur.'],
          [F, 'そうですか。{入力|にゅうりょく}には{時間|じかん}がかかるでしょうか。{明日|あした}の{会議|かいぎ}の{準備|じゅんび}もあって。', 'Öyle mi. Giriş uzun sürer mi? Yarınki toplantının hazırlığı da var.'],
          [M, 'ああ、そっか。それもあったね。{忙|いそが}しいところ{悪|わる}いんだけど、[[こっちも{急|いそ}ぎなんだ]]。{前|まえ}にもやってもらったことがあるから、{佐藤|さとう}さんに{頼|たの}みたいんだよね。{会議|かいぎ}の{準備|じゅんび}って{何|なに}が{残|のこ}ってるの？', 'Ha, doğru, o da vardı. Meşgulken kusura bakma ama bu da acil. Daha önce de yapmıştın, sana bırakmak istiyorum. Toplantı hazırlığında ne kaldı?'],
          [F, '{資料|しりょう}の{印刷|いんさつ}と{部屋|へや}の{準備|じゅんび}とお{弁当|べんとう}の{注文|ちゅうもん}です。', 'Belgelerin çıktısı, odanın hazırlanması ve bento siparişi.'],
          [M, 'そうか。じゃ、[[そっちは{大野|おおの}さんに{頼|たの}んでおくよ]]。', 'Anladım. O zaman onları Ōno’ya veririm.'],
          [F, '{分|わ}かりました。じゃ、[[すぐします]]。', 'Anladım. O zaman hemen yapıyorum.'],
        ],
        solution: [
          'Numune: <b>もう{少|すこ}し{先|さき}でも{大丈夫|だいじょうぶ}</b> = sonra da olur ✗',
          'Toplantı hazırlığı: <b>{大野|おおの}さんに{頼|たの}んでおく</b> → başkasına gitti ✗',
          '“Ōno’ya iş vermek” adamın işi, kadının değil ✗ (soru 女の人).',
          'Kalan: anket girişi, <b>{急|いそ}ぎ</b> ve kadın <b>すぐします</b> → <b>1 ちょうさけっかを入力する</b>.',
        ],
        words: [
          ['アンケート{調査|ちょうさ}', 'anket araştırması'],
          ['{入力|にゅうりょく}', 'veri girişi'],
          ['{支店|してん}', 'şube'],
          ['もう{少|すこ}し{先|さき}でも', 'biraz ileride de (olur)'],
          ['{急|いそ}ぎ', 'acil iş'],
          ['{頼|たの}んでおく', '(birine) rica edip bırakmak'],
        ],
      },
      {
        no: '6{番|ばん}',
        setup: '{会社|かいしゃ}で{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。',
        setupTr: 'Şirkette bir adam ile bir kadın konuşuyor.',
        question: '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。',
        questionTr: 'Adam bundan sonra İLK olarak ne yapacak?',
        focus: 'Kadın omuz ağrısına birkaç çözüm önerecek. Adamın her öneriye verdiği cevabı ve “ne zaman” yapacağını dinle.',
        options: [
          { jp: 'たいそう{教室|きょうしつ}に もうしこむ', tr: 'Jimnastik kursuna yazılmak' },
          { jp: 'DVDを{買|か}う', tr: 'DVD almak' },
          { jp: 'びょういんに{行|い}く', tr: 'Hastaneye gitmek' },
          { jp: 'スポーツクラブに{行|い}く', tr: 'Spor kulübüne gitmek' },
        ],
        answer: 1,
        lines: [
          [M, 'パソコンをずっと{使|つか}ってるせいで、{最近|さいきん}、{肩|かた}が{痛|いた}いんだけど、{何|なに}かいい{方法|ほうほう}ない？', 'Sürekli bilgisayar kullandığım için son zamanlarda omzum ağrıyor, iyi bir yöntem var mı?'],
          [F, '{体操|たいそう}がいいと{思|おも}うよ。{体操教室|たいそうきょうしつ}とか{申|もう}し{込|こ}んでみたら？{私|わたし}、うちの{近|ちか}くの{体操教室|たいそうきょうしつ}に{通|かよ}ってるけど、{肩|かた}の{痛|いた}みが{取|と}れたよ。ああ、でも、{最近|さいきん}{仕事|しごと}{忙|いそが}しいよね。', 'Bence jimnastik iyi gelir. Bir jimnastik kursuna yazılsana? Ben evimin yakınındakine gidiyorum, omuz ağrım geçti. Ama sen son zamanlar çok meşgulsün, değil mi?'],
          [M, '[[うん、{行|い}きたいんだけどね]]。', 'Evet, gitmek isterdim ama…'],
          [F, 'あ、{体操教室|たいそうきょうしつ}の{先生|せんせい}が{作|つく}ったDVDがあるんだ。それ{見|み}ながら{自分|じぶん}でやるのはどう？{先生|せんせい}は{以前|いぜん}{病院|びょういん}で{患者|かんじゃ}さんに{体操|たいそう}を{教|おし}えてたりして、{人気|にんき}があるんだ。', 'Ha, kursun hocasının çektiği bir DVD var. Ona bakarak kendin yapsan? Hoca eskiden hastanede hastalara jimnastik öğretiyormuş, çok seviliyor.'],
          [M, 'ふうん。{病院|びょういん}で{教|おし}えてたんだ。それはよさそうだね。', 'Hmm, hastanede öğretiyormuş. İyiye benziyor.'],
          [F, 'うん、[[インターネットで{手|て}に{入|はい}るから{頼|たの}んでみたら]]？', 'Evet, internetten alınabiliyor, sipariş etsene?'],
          [M, '[[うん、{今日|きょう}にでも]]。', 'Tamam, hatta bugün.'],
          [F, 'あ、それから、{会社|かいしゃ}の{近|ちか}くのスポーツクラブの{無料|むりょう}チケットがあるからあげるよ。そこでも{簡単|かんたん}な{体操|たいそう}を{教|おし}えてくれるから、[[{仕事|しごと}、{落|お}ち{着|つ}いたら{行|い}ってみて]]。', 'Bir de şirketin yakınındaki spor kulübünün ücretsiz biletleri var, sana vereyim. Orada da basit egzersiz öğretiyorlar, işler sakinleşince git.'],
          [M, 'ありがとう。そうする。', 'Sağ ol, öyle yaparım.'],
        ],
        solution: [
          'Kurs: <b>{行|い}きたいんだけどね</b> = isterdim ama (işler yoğun) → şimdi değil ✗',
          'Hastane: sadece hocanın geçmişi anlatılıyor, gidilecek yer değil ✗',
          'Spor kulübü: <b>{仕事|しごと}、{落|お}ち{着|つ}いたら</b> = işler sakinleşince → sonra ✗',
          'DVD: internetten sipariş, adam <b>{今日|きょう}にでも</b> = hatta bugün → ilk iş <b>2 DVDを買う</b>.',
        ],
        words: [
          ['〜せいで', '~ yüzünden (kötü sonuç)'],
          ['{肩|かた}', 'omuz'],
          ['{通|かよ}う', '(düzenli) gidip gelmek'],
          ['{手|て}に{入|はい}る', 'elde edilebilir, bulunur'],
          ['{今日|きょう}にでも', 'hatta bugün, en kısa zamanda'],
          ['{落|お}ち{着|つ}く', 'sakinleşmek, durulmak'],
        ],
      },
    ],
  },
  {
    id: 'l2',
    title: 'Listening 2',
    name: '{問題|もんだい}2 · ポイント{理解|りかい}',
    intro: [
      'Bu tipte soru <b>“neden?” (どうして)</b> veya <b>“ne için?” (何のために)</b>, <b>“nasıl?”</b> gibi tek bir noktayı sorar. Soruyu duyduktan sonra şıkları <b>okuma süresi</b> verilir — şıkları önceden okuman büyük avantaj.',
      'Tuzak: şıkların çoğu konuşmada gerçekten <b>geçer</b>. Ama biri sorar “şu yüzden mi?” ve diğeri <b>“いや、そうじゃない”</b> der. Gerçek cevap çoğu zaman <b>でも / 実は / それより / やっぱり</b> gibi bir kelimeden sonra gelir.',
    ],
    steps: [
      'Soruyu dinle: kim (男/女) ve ne soruluyor (どうして = neden, 何のために = ne için, どうやって = nasıl, 何が問題 = sorun ne).',
      'Okuma süresinde 4 şıkkı hızlıca oku. Her şıkkın anahtar kelimesini aklına yaz.',
      'Konuşmada bir şık geçince hemen işaretleme: hemen ardından gelen <b>いや / そうじゃなくて / それはいいんだけど</b> onu eler.',
      'Asıl cevap çoğu zaman sona yakın, <b>でも、実は、やっぱり、それより</b>’den sonra gelir.',
    ],
    phrases: [
      ['どうして〜ませんか', 'Neden ~ yapmıyor?'],
      ['{何|なん}のために〜', 'Ne amaçla ~?'],
      ['どうやって〜することにしましたか', 'Nasıl ~ yapmaya karar verdi?'],
      ['{何|なに}が{問題|もんだい}だと{言|い}っていますか', 'Neyin sorun olduğunu söylüyor?'],
      ['いや、そうじゃないんだ', 'Hayır, öyle değil. (önceki tahmini eler)'],
      ['{実|じつ}は〜', 'Aslında ~ (gerçek bilgi geliyor)'],
    ],
    items: [
      {
        no: '{例|れい}',
        setup: '{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}がスーパーで{話|はな}しています。',
        setupTr: 'Bir kadın ile bir adam süpermarkette konuşuyor.',
        question: '{男|おとこ}の{人|ひと}はどうして{自分|じぶん}で{料理|りょうり}をしませんか。',
        questionTr: 'Adam neden kendisi yemek yapmıyor?',
        focus: 'Kadın sebebi tahmin edip duracak; adam her tahmini reddedecek. Son reddin ardından gelen cümle cevap.',
        options: [
          { jp: 'いそがしくて{時間|じかん}がないから', tr: 'Meşgul, vakti olmadığı için' },
          { jp: '{料理|りょうり}がにがてだから', tr: 'Yemek yapmakta kötü olduğu için' },
          { jp: 'ざいりょうが あまってしまうから', tr: 'Malzeme arttığı için' },
          { jp: 'いっしょに{食|た}べる{人|ひと}がいないから', tr: 'Birlikte yiyecek kimse olmadığı için' },
        ],
        answer: 3,
        lines: [
          [F, 'あら、{田中|たなか}くん、お{買|か}い{物|もの}？', 'Aa, Tanaka, alışveriş mi?'],
          [M, 'うん、{夕飯|ゆうはん}を{買|か}いにね。', 'Evet, akşam yemeği almaya.'],
          [F, 'お{弁当|べんとう}？{自分|じぶん}で{作|つく}らないの？{時間|じかん}ないか。', 'Bento mu? Kendin yapmıyor musun? Vaktin yok herhalde.'],
          [M, '[[いや、そうじゃないんだ]]。', 'Hayır, o değil.'],
          [F, 'じゃ、{作|つく}ればいいのに。', 'O zaman yapsana.'],
          [M, '[[{作|つく}るのは{嫌|きら}いじゃないんだ]]。でも、{一人|ひとり}だと。', 'Yapmayı sevmez değilim. Ama yalnız olunca…'],
          [F, '{材料|ざいりょう}が{余|あま}っちゃう？', 'Malzeme mi artıyor?'],
          [M, '[[それはいいんだけど]]、[[{一生懸命|いっしょうけんめい}{作|つく}っても{一人|ひとり}で{食|た}べるだけじゃ、なんか{寂|さび}しくて]]。', 'O sorun değil de, emek verip yapsam bile tek başıma yemek biraz hüzünlü.'],
          [F, 'それもそうか。', 'O da doğru.'],
        ],
        solution: [
          'Zaman: <b>いや、そうじゃない</b> ✗ · Yemek yapmak: <b>{嫌|きら}いじゃない</b> ✗ · Malzeme: <b>それはいいんだけど</b> ✗',
          'Son cümle: <b>{一人|ひとり}で{食|た}べるだけじゃ…{寂|さび}しい</b> = yalnız yemek hüzünlü → <b>4</b>.',
        ],
        words: [
          ['〜ばいいのに', '~ yapsan ya (öyle yapmalısın)'],
          ['{材料|ざいりょう}', 'malzeme'],
          ['{余|あま}る', 'artmak, fazla kalmak'],
          ['{一生懸命|いっしょうけんめい}', 'var gücüyle, emek vererek'],
          ['{寂|さび}しい', 'yalnız hissetmek, hüzünlü'],
        ],
      },
      {
        no: '1{番|ばん}',
        setup: 'うちで{夫|おっと}と{妻|つま}が{話|はな}しています。',
        setupTr: 'Evde bir koca ile karısı konuşuyor.',
        question: '{妻|つま}はどうして{昨日|きのう}{新|あたら}しい{掃除機|そうじき}を{買|か}いませんでしたか。',
        questionTr: 'Kadın dün neden yeni süpürge almadı?',
        focus: 'Koca bir sebep tahmin edecek; kadın gerçek sebebi “あのね” ile anlatacak. Fiyat ve reklam bilgisi de geçecek — dikkat.',
        options: [
          { jp: '{気|き}に{入|い}ったのがなかったから', tr: 'Beğendiği bir şey olmadığı için' },
          { jp: '{今|いま}すぐ{買|か}うひつようが なくなったから', tr: 'Hemen alması gerekmediği için' },
          { jp: 'ねだんが{高|たか}かったから', tr: 'Fiyatı pahalı olduğu için' },
          { jp: 'おっとといっしょに えらびたかったから', tr: 'Kocasıyla birlikte seçmek istediği için' },
        ],
        answer: 1,
        lines: [
          [M, '{昨日|きのう}{掃除機|そうじき}の{調子|ちょうし}が{悪|わる}いから{新|あたら}しいの{買|か}いに{行|い}くって{言|い}ってたけど、どうした？{何|なに}か{広告|こうこく}{見|み}て{気|き}に{入|い}ったのがあったんだろ？', 'Dün süpürge bozuk diye yenisini almaya gideceğim demiştin, ne oldu? Reklamda beğendiğin bir şey vardı ya?'],
          [F, 'あのね、[[{今|いま}まで{使|つか}ってたあの{掃除機|そうじき}、{壊|こわ}れたと{思|おも}ってたんだけど、また{動|うご}くようになったの]]。', 'Şöyle ki, kullandığım o süpürge bozuldu sanıyordum ama yeniden çalışmaya başladı.'],
          [M, 'えっ。', 'Ne?'],
          [F, 'あの{広告|こうこく}で{見|み}てた{掃除機|そうじき}、{値段|ねだん}もそんなに{高|たか}くなかったし、もうそれを{買|か}おうって{決|き}めてたんだけど。[[まだ{動|うご}くんだったら、{買|か}わなくてもいいと{思|おも}って、やめたんだ]]。', 'Reklamda gördüğüm süpürge pek pahalı da değildi, onu almaya karar vermiştim. Ama madem hâlâ çalışıyor, almasam da olur diye düşünüp vazgeçtim.'],
          [M, 'そっか。だけどすぐ{壊|こわ}れるんじゃない？{僕|ぼく}、{明日|あした}{休|やす}みだし、{一緒|いっしょ}に{買|か}いに{行|い}こうか。', 'Anladım. Ama yakında bozulmaz mı? Yarın izinliyim, birlikte almaya gidelim mi?'],
          [F, 'いいよ。{壊|こわ}れたら、そのときは、{一緒|いっしょ}に{新|あたら}しいの{見|み}に{行|い}こ。', 'Gerek yok. Bozulunca o zaman birlikte yenisine bakmaya gideriz.'],
        ],
        solution: [
          'Beğendiği vardı (<b>それを{買|か}おうって{決|き}めてた</b>) ✗ · Fiyat <b>{高|たか}くなかった</b> ✗',
          'Kocayla seçmek: koca teklif etti, kadın <b>いいよ</b> = gerek yok dedi ✗ (burada いいよ “hayır, gerek yok”).',
          'Sebep: eski süpürge <b>また{動|うご}くようになった</b> → <b>{買|か}わなくてもいい</b> → <b>2</b>.',
        ],
        words: [
          ['{調子|ちょうし}が{悪|わる}い', 'düzgün çalışmamak'],
          ['{広告|こうこく}', 'reklam'],
          ['{動|うご}くようになる', 'çalışır hâle gelmek'],
          ['〜なくてもいい', '~ yapmasan da olur'],
          ['いいよ', 'bağlama göre: “olur” ya da “gerek yok”'],
        ],
      },
      {
        no: '2{番|ばん}',
        setup: '{会社|かいしゃ}で{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。',
        setupTr: 'Şirkette bir adam ile bir kadın konuşuyor.',
        question: '{男|おとこ}の{人|ひと}は{何|なん}のために{貯金|ちょきん}を{始|はじ}めましたか。',
        questionTr: 'Adam ne için para biriktirmeye başladı?',
        focus: 'Önce bir gazete araştırması anlatılacak — oradaki sebepler başka insanların. Adamın KENDİ sebebini “実は僕も” sonrasında ara.',
        options: [
          { jp: '{年|とし}をとってからの{生活|せいかつ}のため', tr: 'Yaşlılık dönemi için' },
          { jp: '{家|いえ}を{買|か}うため', tr: 'Ev almak için' },
          { jp: '{海外旅行|かいがいりょこう}をするため', tr: 'Yurt dışı seyahati için' },
          { jp: 'りゅうがくするため', tr: 'Yurt dışında okumak için' },
        ],
        answer: 3,
        lines: [
          [M, '{今朝|けさ}{新聞|しんぶん}で{見|み}たんだけど、ある{調査|ちょうさ}によると{日本|にほん}では70パーセント{近|ちか}くの{人|ひと}が{毎月|まいつき}{貯金|ちょきん}をしてるんだって。', 'Bu sabah gazetede gördüm, bir araştırmaya göre Japonya’da insanların yüzde 70’e yakını her ay para biriktiriyormuş.'],
          [F, '{多|おお}いね。', 'Çokmuş.'],
          [M, '{年|とし}を{取|と}ってからの{生活|せいかつ}のためにっていうのが、いちばん{多|おお}くて、{家|いえ}とか{車|くるま}とか{高価|こうか}な{買|か}い{物|もの}のためっていうのも{多|おお}かったよ。[[{実|じつ}は{僕|ぼく}も{今年|ことし}から{貯金|ちょきん}を{始|はじ}めたんだ]]。', 'En çok “yaşlılık için” deniyormuş, ev, araba gibi pahalı alışverişler için diyen de çokmuş. Aslında ben de bu yıl biriktirmeye başladım.'],
          [F, 'あ、{確|たし}か{長|なが}い{休|やす}みを{取|と}って{海外旅行|かいがいりょこう}したいって{言|い}ってたね。', 'Ha, galiba uzun izin alıp yurt dışına gitmek istiyorum demiştin.'],
          [M, '[[そうじゃなくて、{大学院|だいがくいん}に{入|はい}って{学|まな}びたいと{思|おも}ってるんだ。{海外|かいがい}でね]]。', 'Öyle değil, yüksek lisansa girip okumak istiyorum. Yurt dışında.'],
          [F, 'そうなの？じゃ、{頑張|がんば}って{貯金|ちょきん}しないとね。ああ、{私|わたし}も{頑張|がんば}って{働|はたら}かないと。{去年|きょねん}{家|いえ}{買|か}うのに{貯金|ちょきん}{全部|ぜんぶ}{使|つか}っちゃったからな。', 'Öyle mi? O zaman sıkı biriktirmelisin. Ah, ben de sıkı çalışmalıyım. Geçen yıl ev alırken bütün birikimi harcadım.'],
          [M, '{家|いえ}{買|か}ったんだから、すごいよ。{僕|ぼく}が{家|いえ}を{買|か}えるのは、いつになるか。', 'Ev aldın ya, harika. Ben ne zaman ev alabilirim, kim bilir.'],
        ],
        solution: [
          'Yaşlılık ve ev: gazetedeki <b>diğer insanların</b> sebepleri; ev ayrıca kadının geçen yılki alışverişi ✗',
          'Seyahat: kadının tahmini, adam <b>そうじゃなくて</b> ile reddediyor ✗',
          'Gerçek sebep: <b>{大学院|だいがくいん}に{入|はい}って{学|まな}びたい、{海外|かいがい}で</b> = yurt dışında yüksek lisans = <b>4 りゅうがく</b>.',
        ],
        words: [
          ['{貯金|ちょきん}', 'para biriktirme'],
          ['〜によると', '~ e göre'],
          ['〜んだって', '~ mış (duyduğum kadarıyla)'],
          ['{高価|こうか}な', 'pahalı, değerli'],
          ['{大学院|だいがくいん}', 'yüksek lisans'],
          ['{留学|りゅうがく}', 'yurt dışında okumak'],
        ],
      },
      {
        no: '3{番|ばん}',
        setup: '{留守番電話|るすばんでんわ}のメッセージを{聞|き}いています。',
        setupTr: 'Telesekreterdeki bir mesajı dinliyoruz.',
        question: '{女|おんな}の{学生|がくせい}はどうして{食事|しょくじ}に{行|い}けないと{言|い}っていますか。',
        questionTr: 'Kız öğrenci neden yemeğe gidemeyeceğini söylüyor?',
        focus: 'İki ayrı konu geçecek: öğle yemeği ve akşamki kulüp toplantısı. Soru sadece öğle yemeğini soruyor; diğer konuyu karıştırma.',
        options: [
          { jp: 'ペットをびょういんにつれて{行|い}くから', tr: 'Evcil hayvanını veterinere götüreceği için' },
          { jp: '{母|はは}がけがをしたから', tr: 'Annesi yaralandığı için' },
          { jp: 'アルバイトに{行|い}くから', tr: 'Yarı zamanlı işe gideceği için' },
          { jp: 'クラブの{話|はな}し{合|あ}いがあるから', tr: 'Kulüp toplantısı olduğu için' },
        ],
        answer: 0,
        lines: [
          [F, '{田中|たなか}です。{今日|きょう}のランチの{約束|やくそく}なんだけど、ごめん。', 'Ben Tanaka. Bugünkü öğle yemeği sözümüz için kusura bakma.'],
          [F, '{昨日|きのう}の{夜|よる}、[[うちの{猫|ねこ}が{怪我|けが}してね]]、{今日|きょう}{母|はは}が{病院|びょういん}に{連|つ}れてく{予定|よてい}だったんだけど、{急|きゅう}な{用事|ようじ}ができたから[[{私|わたし}に{行|い}ってくれって]]。ごめんね。', 'Dün gece kedimiz yaralandı. Bugün annem hastaneye götürecekti ama acil bir işi çıktı, sen götür dedi. Kusura bakma.'],
          [F, 'あ、それと、{私|わたし}、{今日|きょう}の{夕方|ゆうがた}はアルバイトがあるからクラブの{話|はな}し{合|あ}いに{出|で}られないって{言|い}ってたけど、[[バイトの{日|ひ}が{変|か}わって、{行|い}けることになったよ]]。', 'Bir de bu akşam işim var, kulüp toplantısına gelemem demiştim ama iş günüm değişti, gelebileceğim.'],
          [F, 'じゃ、{後|あと}でね。ほんとごめんね。', 'Görüşürüz. Gerçekten kusura bakma.'],
        ],
        solution: [
          'Yaralanan <b>{猫|ねこ}</b> (kedi), anne değil ✗ — annenin sadece <b>{急|きゅう}な{用事|ようじ}</b>’ı çıktı.',
          'İş günü değişti, kulüp toplantısına <b>{行|い}ける</b> → ikisi de sebep değil ✗',
          'Kediyi hastaneye o götürecek (<b>{私|わたし}に{行|い}ってくれって</b>) → <b>1 ペットをびょういんにつれて行く</b>.',
        ],
        words: [
          ['{留守番電話|るすばんでんわ}', 'telesekreter'],
          ['{約束|やくそく}', 'söz, randevu'],
          ['{怪我|けが}をする', 'yaralanmak'],
          ['{連|つ}れてく', '連れて行く: (canlıyı) götürmek'],
          ['〜てくれって', '〜てくれと言った: ~ yapmamı istedi'],
          ['{話|はな}し{合|あ}い', 'toplantı, görüşme'],
        ],
      },
      {
        no: '4{番|ばん}',
        setup: '{会社|かいしゃ}で{男|おとこ}の{人|ひと}と{外国人|がいこくじん}の{女|おんな}の{人|ひと}が{話|はな}しています。',
        setupTr: 'Şirkette bir adam ile yabancı bir kadın konuşuyor.',
        question: '{男|おとこ}の{人|ひと}はこれからどうやって{女|おんな}の{人|ひと}の{国|くに}の{言葉|ことば}を{勉強|べんきょう}することにしましたか。',
        questionTr: 'Adam kadının ülkesinin dilini nasıl çalışmaya karar verdi?',
        focus: 'Adam denediği yöntemleri anlatacak (hepsi şıklarda var). Hangisi “denedim ama olmadı”, hangisi “karar verdim”? Sondaki “やっぱり” önemli.',
        options: [
          { jp: 'サラさんの{友人|ゆうじん}に{教|おし}えてもらう', tr: 'Sara’nın arkadaşından ders almak' },
          { jp: 'テレビを{見|み}て{自分|じぶん}で{勉強|べんきょう}する', tr: 'Televizyonla kendi kendine çalışmak' },
          { jp: 'インターネットでレッスンをうける', tr: 'İnternetten ders almak' },
          { jp: '{外国語|がいこくご}の{学校|がっこう}に{通|かよ}う', tr: 'Dil okuluna gitmek' },
        ],
        answer: 0,
        lines: [
          [M, 'サラさん、{今度|こんど}サラさんの{国|くに}に2か{月|げつ}{出張|しゅっちょう}することになったんだ。{少|すこ}し{言葉|ことば}を{習|なら}いたいんだけど、だれか{教|おし}えてくれる{人|ひと}いない？サラさんは{忙|いそが}しいよね。', 'Sara, senin ülkene 2 aylığına iş seyahatine gideceğim. Biraz dil öğrenmek istiyorum, öğretecek biri var mı? Sen meşgulsün, değil mi?'],
          [F, 'うん、{私|わたし}はちょっと。あ、{友達|ともだち}、{紹介|しょうかい}するよ。いい{人|ひと}がいる。', 'Evet, ben biraz… Ha, bir arkadaşımı tanıştırayım. İyi biri var.'],
          [M, 'よかった。テレビの{外国語学習|がいこくごがくしゅう}の{番組|ばんぐみ}{見|み}てやってみたけど、[[なんかよく{分|わ}からなくて]]。', 'Harika. Televizyondaki dil programıyla denedim ama pek anlayamadım.'],
          [F, 'その{友達|ともだち}、{日本語|にほんご}はあまりできないんだけど、{国|くに}で{外国人|がいこくじん}に{教|おし}えたこともあるよ。', 'O arkadaşım pek Japonca bilmiyor ama ülkemde yabancılara ders vermişliği var.'],
          [M, 'え、{日本語|にほんご}できないの？この{前|まえ}{一度|いちど}、「インターネットで{会話|かいわ}のレッスン」っていうの{受|う}けてみたんだけど、[[{日本語|にほんご}の{説明|せつめい}{少|すく}なくて{困|こま}ったんだよ]]。それはグループレッスンだったから、{質問|しつもん}もあまりできなくて。', 'Ne, Japonca bilmiyor mu? Geçenlerde internetten bir konuşma dersi aldım ama Japonca açıklama azdı, zorlandım. Grup dersiydi, soru da soramadım.'],
          [F, 'どこか{学校|がっこう}は{探|さが}してみた？', 'Hiç okul aradın mı?'],
          [M, 'インターネットで{探|さが}したけど、[[うちから{通|かよ}えるところにはなかったんだ]]。うーん、[[やっぱり{個人|こじん}レッスンがいいから、その{人|ひと}に{頼|たの}んでもらえる]]？', 'İnternetten aradım ama evimden gidebileceğim yerde yoktu. Hmm, yine de birebir ders iyi, o kişiye sorar mısın?'],
          [F, 'うん。{分|わ}かった。{私|わたし}も{日本語|にほんご}を{習|なら}ったとき、{日本語|にほんご}だけで{教|おし}わったからきっと{大丈夫|だいじょうぶ}。', 'Tamam. Ben de Japonca öğrenirken sadece Japonca öğrendim, kesin sorun olmaz.'],
        ],
        solution: [
          'TV: <b>よく{分|わ}からなくて</b> = anlamadım ✗ · İnternet dersi: <b>{困|こま}った</b>, soru soramadı ✗ · Okul: <b>{通|かよ}えるところにはなかった</b> ✗',
          'Karar: <b>やっぱり{個人|こじん}レッスン…その{人|ひと}に{頼|たの}んで</b> → Sara’nın arkadaşı → <b>1</b>.',
        ],
        words: [
          ['{出張|しゅっちょう}', 'iş seyahati'],
          ['{紹介|しょうかい}する', 'tanıştırmak'],
          ['{番組|ばんぐみ}', 'TV programı'],
          ['{困|こま}る', 'zorlanmak, sıkıntıya düşmek'],
          ['やっぱり', 'yine de, sonuçta'],
          ['{個人|こじん}レッスン', 'birebir ders'],
        ],
      },
      {
        no: '5{番|ばん}',
        setup: 'レストランで{店長|てんちょう}と{女|おんな}の{店員|てんいん}が{話|はな}しています。',
        setupTr: 'Bir restoranda müdür ile kadın çalışan konuşuyor.',
        question: '{女|おんな}の{店員|てんいん}は{店|みせ}について{何|なに}が{問題|もんだい}だと{言|い}っていますか。',
        questionTr: 'Kadın çalışan restoranla ilgili neyin sorun olduğunu söylüyor?',
        focus: 'Önce iyi giden bir şey anlatılacak (sorun değil!). Sorun “気になります” (aklımı kurcalıyor) ile gelecek.',
        options: [
          { jp: '{朝食|ちょうしょく}のメニューが{売|う}れていない', tr: 'Kahvaltı menüsü satmıyor' },
          { jp: '{近所|きんじょ}の{人|ひと}があまり{来|き}てくれない', tr: 'Mahalleden pek kimse gelmiyor' },
          { jp: 'こんでいても せきを{空|あ}けない きゃくがいる', tr: 'Kalabalıkken bile masayı boşaltmayan müşteriler var' },
          { jp: 'ことばづかいが よくない{店員|てんいん}がいる', tr: 'Konuşması kaba çalışanlar var' },
        ],
        answer: 2,
        lines: [
          [M, '{店|みせ}がオープンしてやっと1か{月|げつ}{経|た}ったけど、{何|なに}か{気|き}づいたことある？', 'Restoran açılalı nihayet bir ay oldu, fark ettiğin bir şey var mı?'],
          [F, 'そうですね。はじめは、{朝|あさ}6{時|じ}っていう{開店|かいてん}の{時間|じかん}はちょっと{早|はや}いと{思|おも}って、お{客様|きゃくさま}がいらっしゃるかどうか{心配|しんぱい}だったんですが、[[{近所|きんじょ}の{方|かた}がよく{朝食|ちょうしょく}を{食|た}べに{来|き}てくださる]]ので、{驚|おどろ}きました。', 'Şöyle; başta sabah 6’da açılmak biraz erken diye müşteri gelir mi diye endişelenmiştim ama mahalleden insanlar sık sık kahvaltıya geliyor, şaşırdım.'],
          [M, '{確|たし}かに{予想以上|よそういじょう}だったね。', 'Gerçekten beklentinin üstünde oldu.'],
          [F, 'はい。それと、[[{食事|しょくじ}がすんでいるのに、ずっとお{帰|かえ}りにならない{方|かた}がけっこういらっしゃるのが{気|き}になります]]。アルバイトの{森|もり}さんが{言|い}ってたんですけど、せっかく{来|き}てくださったお{客様|きゃくさま}が{席|せき}がなくて{入|はい}れないっていうことが{何回|なんかい}かあったそうです。', 'Evet. Bir de yemeğini bitirdiği hâlde bir türlü kalkmayan epey müşteri var, bu kafama takılıyor. Yarı zamanlı çalışan Mori söyledi, gelen müşterilerin yer olmadığı için giremediği birkaç kez olmuş.'],
          [M, 'そういうときは、お{客様|きゃくさま}の{気分|きぶん}を{悪|わる}くさせずに{席|せき}を{空|あ}けていただくように{頼|たの}まなきゃいけないんだけど。うちの{店|みせ}は{若|わか}い{店員|てんいん}が{多|おお}いから、{上手|じょうず}に{伝|つた}えるのは{難|むずか}しいかもしれないね。', 'Öyle durumlarda müşteriyi kırmadan masayı boşaltmasını rica etmek lazım. Bizde genç çalışan çok, bunu güzelce söylemek zor olabilir.'],
        ],
        solution: [
          'Kahvaltı ve mahalle: tam tersi, <b>よく{来|き}てくださる</b>, beklentinin üstünde ✗✗',
          'Genç çalışanlar: müdürün çözüm hakkındaki endişesi, “kaba konuşuyorlar” denmiyor ✗',
          'Sorun <b>{気|き}になります</b> ile geliyor: yemeği bitince <b>お{帰|かえ}りにならない</b> müşteriler, yeni gelen <b>{席|せき}がなくて{入|はい}れない</b> → <b>3</b>.',
        ],
        words: [
          ['{開店|かいてん}', 'dükkânın açılışı'],
          ['{近所|きんじょ}の{方|かた}', 'mahalleli (kibar)'],
          ['{予想以上|よそういじょう}', 'beklentinin üstünde'],
          ['{気|き}になる', 'kafaya takılmak, rahatsız etmek'],
          ['お{帰|かえ}りにならない', '(müşteri) gitmiyor — kibar dil'],
          ['{席|せき}を{空|あ}ける', 'masayı/yeri boşaltmak'],
        ],
      },
      {
        no: '6{番|ばん}',
        setup: '{女|おんな}の{学生|がくせい}と{男|おとこ}の{学生|がくせい}が{授業|じゅぎょう}の{発表|はっぴょう}で{使|つか}う{資料|しりょう}について{話|はな}しています。',
        setupTr: 'Bir kız ve bir erkek öğrenci derste sunumda kullanacakları belgeler hakkında konuşuyor.',
        question: '{二人|ふたり}はこのあとまず{何|なに}をしますか。',
        questionTr: 'İkisi bundan sonra İLK olarak ne yapacak?',
        focus: 'İki düzeltme önerisi gelecek (grafik ve sunum akışı). Hangisi “後にして” (sonraya bırak) diye erteleniyor?',
        options: [
          { jp: 'せんぱいに しりょうを{見|み}せる', tr: 'Belgeleri üst sınıftaki arkadaşa göstermek' },
          { jp: 'ちょうさを しなおす', tr: 'Araştırmayı yeniden yapmak' },
          { jp: 'しりょうに グラフをくわえる', tr: 'Belgelere grafik eklemek' },
          { jp: 'はっぴょうの ながれを かえる', tr: 'Sunumun akışını değiştirmek' },
        ],
        answer: 3,
        lines: [
          [F, 'ねえ、{社会学|しゃかいがく}の{授業|じゅぎょう}で{一緒|いっしょ}にやる{発表|はっぴょう}のことなんだけど。', 'Baksana, sosyoloji dersinde birlikte yapacağımız sunum hakkında…'],
          [M, 'うん。{準備|じゅんび}も{終|お}わったし、{発表|はっぴょう}を{待|ま}つだけだね。', 'Evet. Hazırlık bitti, sadece sunumu bekliyoruz.'],
          [F, '{実|じつ}はね、[[{昨日|きのう}、ゼミの{先輩|せんぱい}に{私|わたし}たちが{準備|じゅんび}した、{発表|はっぴょう}で{使|つか}う{資料|しりょう}とか{発表|はっぴょう}の{流|なが}れを{見|み}てもらったら]]、{先輩|せんぱい}が{問題点|もんだいてん}をいくつかあげてくれて。{直|なお}したほうがいいと{思|おも}うんだ。', 'Aslında dün seminerdeki üst sınıf arkadaşa hazırladığımız belgeleri ve sunum akışını gösterdim, birkaç sorun söyledi. Düzeltsek iyi olur bence.'],
          [M, 'どこ？', 'Neresi?'],
          [F, 'うん。まずね、せっかく{自分|じぶん}たちで{調査|ちょうさ}して、{面白|おもしろ}い{結果|けっか}が{出|で}てるのに、{数字|すうじ}が{並|なら}んでるだけだから、{伝|つた}わりにくいって。', 'Önce, kendimiz araştırıp ilginç sonuçlar bulduk ama sadece sayılar sıralanmış, anlaşılması zor dedi.'],
          [M, 'じゃ、グラフを{加|くわ}えようか。', 'O zaman grafik ekleyelim mi?'],
          [F, 'そうだね。それからもう{一点|いってん}、{私|わたし}たちの{主張|しゅちょう}が{発表|はっぴょう}の{最後|さいご}にしかないから、{途中|とちゅう}まで{何|なに}が{言|い}いたいのか{分|わ}からないって。ねえ、{発表|はっぴょう}の{流|なが}れ、{変|か}えてみない？', 'Evet. Bir de, savımız sadece sunumun sonunda, yarısına kadar ne demek istediğimiz anlaşılmıyormuş. Sunumun akışını değiştirsek mi?'],
          [M, 'うん、やってみよう。[[{流|なが}れを{変|か}えたら、{調査結果|ちょうさけっか}の{見|み}せ{方|かた}も{変|か}わってくるだろうから、グラフのことは{後|あと}にして、それからやろう]]。', 'Evet, deneyelim. Akışı değiştirince sonuçları gösterme şekli de değişir, grafiği sonraya bırakıp ondan sonra yapalım.'],
          [F, 'うん。', 'Tamam.'],
          [M, '{先輩|せんぱい}にお{礼|れい}{言|い}っといてね。', 'Üst sınıftaki arkadaşa teşekkür etmeyi unutma.'],
        ],
        solution: [
          'Belgeleri göstermek: <b>{昨日|きのう}…{見|み}てもらった</b> → zaten yapıldı ✗',
          'Araştırmayı yeniden yapmak hiç önerilmedi; sonuçlar iyi (<b>{面白|おもしろ}い{結果|けっか}</b>) ✗',
          'Grafik: <b>グラフのことは{後|あと}にして</b> = sonraya bırak ✗',
          'Önce akış: <b>{流|なが}れを{変|か}えたら…それからやろう</b> → <b>4 はっぴょうのながれをかえる</b>.',
        ],
        words: [
          ['{発表|はっぴょう}', 'sunum'],
          ['{資料|しりょう}', 'belge, materyal'],
          ['{先輩|せんぱい}', 'üst sınıftaki / kıdemli kişi'],
          ['{伝|つた}わりにくい', 'anlaşılması zor'],
          ['{主張|しゅちょう}', 'savunulan fikir, iddia'],
          ['〜は{後|あと}にして', '~ yi sonraya bırakıp'],
        ],
      },
    ],
  },
]
