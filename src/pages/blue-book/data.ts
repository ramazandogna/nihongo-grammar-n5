import type { Lesson } from '@/components/textbook/types'

/**
 * The school's blue book, unit by unit. A new unit is one more object here.
 * Source: photos in assets/ss_data/blue-book/.
 */
export const LESSONS: Lesson[] = [
  {
    id: '1-3',
    title: '1課－3 · {天気予報|てんきよほう}',
    sub: 'Hava durumu · 〜でしょう · 〜から〜にかけて · 〜と',
    goals: [
      'Hava durumu sunumunu anlayabilmek (televizyon, radyo).',
      'Tahmin bildirmek: 〜でしょう／〜だろう.',
      'Zaman ve yer aralığı söylemek: 〜から〜にかけて.',
      'Arkadaşını bir etkinliğe davet edebilmek.',
    ],
    readings: [
      {
        title: '{使|つか}ってみよう · {天気予報|てんきよほう}',
        intro: 'Televizyonda sunucu (キ = キャスター) ile meteoroloji uzmanı (気 = 気象予報士) hafta sonu havasını konuşuyor.',
        lines: [
          { who: 'キ', jp: '{明日|あした}からのお{天気|てんき}はどうですか。', tr: 'Yarından itibaren hava nasıl olacak?' },
          {
            who: '気',
            jp: 'はい、{金曜日|きんようび}は{一日中|いちにちじゅう}、いい{天気|てんき}になりそうです。{青空|あおぞら}が{広|ひろ}がる[[でしょう]]。{日中|にっちゅう}は{今日|きょう}より4{度|ど}{高|たか}く、{最高気温|さいこうきおん}は25{度|ど}の{見込|みこ}みです。{汗|あせ}ばむ{陽気|ようき}になりそうです。',
            tr: 'Evet, cuma günü bütün gün güzel bir hava olacak gibi. Gökyüzü masmavi açılacak. Gündüz bugünden 4 derece yüksek, en yüksek sıcaklığın 25 derece olması bekleniyor. Hafif terletecek kadar ılık bir hava olacak.',
          },
          { who: 'キ', jp: '{洗濯日和|せんたくびより}になりそうですね。', tr: 'Çamaşır yıkamak için tam bir gün olacak gibi.' },
          {
            who: '気',
            jp: 'そうですね。{夜|よる}もきれいな{星空|ほしぞら}が{見|み}られる[[でしょう]]。{土曜日|どようび}の{天気|てんき}は{晴|は}れのち{雨|あめ}になりそうです。{午前中|ごぜんちゅう}は{前日|ぜんじつ}の{天気|てんき}が{続|つづ}いて、{青空|あおぞら}が{見|み}られますが、{夕方|ゆうがた}[[から]]{日曜日|にちようび}の{朝|あさ}[[にかけて]]{雨|あめ}になりそうです。',
            tr: 'Evet. Gece de güzel bir yıldızlı gökyüzü görülecek. Cumartesi hava açık, sonra yağmurlu olacak gibi. Öğleden önce önceki günün havası sürüp mavi gökyüzü görülecek ama akşamüstünden pazar sabahına kadar yağmur bekleniyor.',
          },
          { who: 'キ', jp: 'お{出|で}かけの{方|かた}は{傘|かさ}があったほうがよさそうですね。', tr: 'Dışarı çıkacakların yanına şemsiye alması iyi olacak gibi.' },
          {
            who: '気',
            jp: 'はい。{折|お}りたたみ{傘|がさ}がある[[と]]{便利|べんり}でしょう。{続|つづ}いて{日曜日|にちようび}のお{天気|てんき}です。{日曜日|にちようび}の{朝|あさ}も{雨|あめ}が{続|つづ}くでしょう。{日中|にっちゅう}のお{天気|てんき}は{曇|くも}りときどき{雨|あめ}、{気温|きおん}は{平年並|へいねんな}みの{予想|よそう}ですが、{風|かぜ}が{強|つよ}くなりそうです。{夜|よる}は{肌寒|はだざむ}く{感|かん}じるかもしれません。',
            tr: 'Evet. Katlanır şemsiye olursa kullanışlı olur. Sırada pazar günün havası var. Pazar sabahı da yağmur sürecek. Gündüz bulutlu, ara ara yağmurlu; sıcaklık mevsim normallerinde bekleniyor ama rüzgâr sertleşecek gibi. Gece biraz serin hissedilebilir.',
          },
          {
            who: 'キ',
            jp: 'そうですか。お{帰|かえ}りが{遅|おそ}くなりそうな{方|かた}は{上着|うわぎ}があったほうがいいですね。',
            tr: 'Öyle mi. Eve geç dönecek olanların yanına ceket alması iyi olur.',
          },
          { who: '気', jp: 'はい、そうですね。', tr: 'Evet, öyle.' },
        ],
        questions: [
          { q: '{金曜日|きんようび}の{最高気温|さいこうきおん}は{何度|なんど}ですか。', a: '25度 (bugünden 4 derece yüksek)' },
          { q: '{土曜日|どようび}はいつ{雨|あめ}になりますか。', a: 'Akşamüstünden pazar sabahına kadar (夕方から日曜日の朝にかけて)' },
          { q: '{日曜日|にちようび}の{夜|よる}は{何|なに}があったほうがいいですか。', a: 'Ceket (上着) — gece serin olacak (肌寒い)' },
          { q: '「{洗濯日和|せんたくびより}」はどんな{日|ひ}ですか。', a: 'Çamaşırı yıkayıp kurutmak için ideal, güneşli gün' },
        ],
      },
    ],
    grammar: [
      {
        title: '〜でしょう／〜だろう',
        form: '{普通形|ふつうけい}（ナA／N：だ がつかない）＋ でしょう',
        meaning:
          '<b>“Muhtemelen ~, ~ olacak”</b> — kesin söyleyemediğin bir tahmin. Hava durumunda, haberlerde çok duyulur. だろう aynı anlamın sade (yazı/erkek konuşması) hâli.',
        note: 'Na-sıfat ve isimde だ düşer: 晴れ<b>だ</b>でしょう ✗ → 晴れでしょう ✓ · 静かでしょう ✓',
        examples: [
          ['{明日|あした}は{雨|あめ}が{降|ふ}る[[でしょう]]。', 'Yarın muhtemelen yağmur yağacak.'],
          ['{連休|れんきゅう}はどこも{混|こ}んでいる[[でしょう]]。', 'Uzun tatilde her yer muhtemelen kalabalık olur.'],
          [
            '{公園|こうえん}で{遊|あそ}んでいる{子|こ}どもを{迎|むか}えに{来|き}たのは、きっと{父親|ちちおや}[[だろう]]。',
            'Parkta oynayan çocuğu almaya gelen kişi büyük ihtimalle babasıdır.',
          ],
          ['{青空|あおぞら}が{広|ひろ}がる[[でしょう]]。', 'Gökyüzü masmavi açılacak. (metinden)'],
        ],
      },
      {
        title: '〜から〜にかけて',
        form: 'N ＋ から ＋ N ＋ にかけて',
        meaning:
          '<b>“~ den ~ e kadar (o aralıkta)”</b> — zaman ya da yer aralığı. Başı ve sonu kesin çizgiyle belli olmayan şeyler için kullanılır.',
        note: '〜から〜まで: başlangıç ve bitiş net (9:00〜17:00). 〜から〜にかけて: aralığın içinde bir yerde, yayılmış (hava, festival, yağmur).',
        examples: [
          [
            '{明日|あした}は{東北地方|とうほくちほう}[[から]]{関東地方|かんとうちほう}[[にかけて]]{天気|てんき}が{崩|くず}れるでしょう。',
            'Yarın Tohoku bölgesinden Kanto bölgesine kadar hava bozacak.',
          ],
          ['9{月|がつ}[[から]]10{月|がつ}[[にかけて]]、{各地|かくち}で{祭|まつ}りが{行|おこな}われます。', 'Eylülden ekime kadar her yerde festivaller yapılır.'],
          ['{夕方|ゆうがた}[[から]]{日曜日|にちようび}の{朝|あさ}[[にかけて]]{雨|あめ}になりそうです。', 'Akşamüstünden pazar sabahına kadar yağmur bekleniyor. (metinden)'],
        ],
      },
      {
        title: '〜と、A／V',
        form: '{普通形|ふつうけい}の{現在形|げんざいけい} ＋ と、A／V',
        meaning:
          '<b>“~ınca (her zaman) ~”</b> — bir şey olunca doğal olarak ortaya çıkan sonuç. Arkasından gelen kısımda çoğu zaman bir <b>değerlendirme ya da duygu</b> olur (便利だ, 助かる, 迷惑になる).',
        note: 'と’dan önce hep şimdiki zaman (sözlük/ない hâli): 置く<b>と</b> ✓ · 置いた<b>と</b> ✗',
        examples: [
          ['ここに{荷物|にもつ}を{置|お}く[[と]]、{迷惑|めいわく}になるから、あそこに{置|お}こう。', 'Eşyayı buraya koyarsak (başkalarına) rahatsızlık olur, şuraya koyalım.'],
          ['A：お{手伝|てつだ}いしましょうか。B：ありがとうございます。{手伝|てつだ}っていただける[[と]]、{助|たす}かります。', 'A: Yardım edeyim mi? B: Teşekkürler. Yardım ederseniz çok iyi olur.'],
          ['{折|お}りたたみ{傘|がさ}がある[[と]]{便利|べんり}でしょう。', 'Katlanır şemsiye olursa kullanışlı olur. (metinden)'],
        ],
      },
    ],
    boxes: [
      {
        title: '{天気予報|てんきよほう}でよく{聞|き}くことば・{表現|ひょうげん}',
        items: [
          ['〜のち…', '~, sonra … (晴れのち雨 = önce açık, sonra yağmur)'],
          ['ときどき…', 'ara ara … (曇りときどき雨)'],
          ['〜{一時|いちじ}…', 'bir süreliğine … (晴れ一時雨)'],
          ['{天気|てんき}が{崩|くず}れる', 'hava bozmak'],
          ['{天気|てんき}が{回復|かいふく}する', 'hava düzelmek'],
          ['（{平年|へいねん}）{並|な}み', 'mevsim normallerinde'],
          ['{汗|あせ}ばむ', 'hafif terlemek (ılık hava)'],
          ['{冷|ひ}え{込|こ}む', 'havanın iyice soğuması'],
          ['{梅雨|つゆ}', 'yağmur mevsimi (haziran–temmuz)'],
          ['{夏日|なつび}', 'en yüksek sıcaklığın 25°C’yi geçtiği gün'],
          ['{熱帯夜|ねったいや}', 'gece sıcaklığın 25°C altına inmediği gece'],
          ['{秋晴|あきば}れ', 'sonbaharın açık, berrak günü'],
          ['{蒸|む}し{暑|あつ}い', 'nemli ve sıcak, bunaltıcı'],
          ['{日差|ひざ}しが{強|つよ}い', 'güneş yakıcı'],
          ['{肌寒|はだざむ}い', 'serin, hafif üşütücü'],
          ['（お{出|で}かけ／{洗濯|せんたく}／{行楽|こうらく}…）{日和|びより}', '(gezmek / çamaşır / piknik…) için ideal gün'],
          ['ぽかぽか', 'güneşli ve içi ısıtan ılık'],
          ['じめじめ', 'nemli, rutubetli'],
          ['からっと', 'kuru ve ferah (nem yok)'],
        ],
      },
      {
        title: '{友達|ともだち}を{誘|さそ}うときに{使|つか}う{表現|ひょうげん}',
        items: [
          ['よかったら、', 'istersen, …'],
          ['{時間|じかん}があったら、', 'vaktin olursa, …'],
          ['{興味|きょうみ}があったら、', 'ilgini çekerse, …'],
          ['{一緒|いっしょ}に〜ない？', 'birlikte ~ yapmaz mıyız? (ゆっくり誘う)'],
          ['{一緒|いっしょ}に〜てみない？', 'birlikte ~ yapmayı denemez misin?'],
          ['{一緒|いっしょ}に〜たいと{思|おも}って……', 'birlikte ~ yapmak istiyorum da… (yumuşak davet)'],
          ['{一緒|いっしょ}に〜てみようよ', 'hadi birlikte ~ deneyelim!'],
          ['{例|れい}：よかったら、{一緒|いっしょ}に{花火大会|はなびたいかい}に{行|い}ってみない？', 'Örnek: İstersen birlikte havai fişek festivaline gitmeyi denemez miyiz?'],
        ],
      },
    ],
    words: [
      ['{天気予報|てんきよほう}', 'hava durumu'],
      ['{気象予報士|きしょうよほうし}', 'meteoroloji uzmanı'],
      ['キャスター', 'sunucu (haber)'],
      ['{一日中|いちにちじゅう}', 'bütün gün'],
      ['{青空|あおぞら}', 'mavi gökyüzü'],
      ['{広|ひろ}がる', 'yayılmak, açılmak'],
      ['{日中|にっちゅう}', 'gündüz vakti'],
      ['{最高気温|さいこうきおん}', 'en yüksek sıcaklık'],
      ['{見込|みこ}み', 'beklenti, tahmin'],
      ['{陽気|ようき}', 'hava (mevsimin havası)'],
      ['{星空|ほしぞら}', 'yıldızlı gökyüzü'],
      ['{晴|は}れのち{雨|あめ}', 'açık, sonra yağmurlu'],
      ['{午前中|ごぜんちゅう}', 'öğleden önce'],
      ['{前日|ぜんじつ}', 'önceki gün'],
      ['{続|つづ}く', 'sürmek, devam etmek'],
      ['{折|お}りたたみ{傘|がさ}', 'katlanır şemsiye'],
      ['{曇|くも}り', 'bulutlu'],
      ['{予想|よそう}', 'tahmin'],
      ['{上着|うわぎ}', 'ceket, üstlük'],
      ['{連休|れんきゅう}', 'art arda tatil günleri'],
      ['{迎|むか}えに{来|く}る', 'almaya gelmek'],
      ['{各地|かくち}', 'her yer, çeşitli yerler'],
      ['{天気|てんき}が{崩|くず}れる', 'hava bozmak'],
      ['{天気|てんき}が{回復|かいふく}する', 'hava düzelmek'],
      ['{平年並|へいねんな}み', 'mevsim normali'],
      ['{汗|あせ}ばむ', 'hafif terlemek'],
      ['{冷|ひ}え{込|こ}む', 'havanın iyice soğuması'],
      ['{梅雨|つゆ}', 'yağmur mevsimi'],
      ['{夏日|なつび}', '25°C üstü gün'],
      ['{熱帯夜|ねったいや}', 'sıcak gece (25°C üstü)'],
      ['{秋晴|あきば}れ', 'sonbaharın açık günü'],
      ['{蒸|む}し{暑|あつ}い', 'nemli sıcak'],
      ['{日差|ひざ}しが{強|つよ}い', 'güneş yakıcı'],
      ['{肌寒|はだざむ}い', 'serin'],
      ['{洗濯日和|せんたくびより}', 'çamaşır için ideal gün'],
      ['ぽかぽか', 'ılık ve güneşli'],
      ['じめじめ', 'rutubetli'],
      ['からっと', 'kuru ve ferah'],
      ['{迷惑|めいわく}', 'rahatsızlık, zahmet'],
      ['{助|たす}かる', 'işine yaramak, kurtarmak'],
      ['{誘|さそ}う', 'davet etmek'],
      ['{興味|きょうみ}', 'ilgi'],
    ],
    exercises: [
      {
        title: '7. 〜でしょう／〜だろう',
        items: [
          {
            q: '{気象予報士|きしょうよほうし}：{東京|とうきょう}は{明日|あした}も（{晴|は}れです→　）でしょう。',
            hint: 'Kalıba uydur.',
            a: '{晴|は}れ（でしょう）',
            note: 'İsimde だ／です düşer: 晴れでしょう.',
          },
          {
            q: 'あさってもいい{天気|てんき}になって、（{暖|あたた}かくなります→　）でしょう。',
            a: '{暖|あたた}かくなる（でしょう）',
            note: 'Fiil sade hâle: なります → なる.',
          },
          {
            q: '〈ニュース{番組|ばんぐみ}で〉{専門家|せんもんか}：これからも{日本|にほん}へ{来|く}る{留学生|りゅうがくせい}の{数|かず}は（　）。',
            hint: 'Serbest — tahmin cümlesi kur.',
            a: '{増|ふ}えていくでしょう',
            note: 'Örnek cevap. 減るでしょう／変わらないでしょう da olur.',
          },
        ],
      },
      {
        title: '8. 〜から〜にかけて',
        items: [
          {
            q: '{東京|とうきょう}は6{月|がつ}{下旬|げじゅん}から7{月|がつ}{下旬|げじゅん}にかけて（　）の{日|ひ}が{続|つづ}きます。この{時期|じき}を「{梅雨|つゆ}」と{言|い}います。',
            a: '{雨|あめ}',
            note: '梅雨 = yağmur mevsimi, yani yağmurlu günler.',
          },
          {
            q: '{明日|あした}は{夕方|ゆうがた}から{夜|よる}にかけて、（　）そうだ。',
            hint: 'Serbest — hava ile ilgili bir şey söyle.',
            a: '{雨|あめ}が{降|ふ}る',
            note: 'Örnek. 風が強くなる／雪が降る da olur. 〜そうだ = ~mış (duydum).',
          },
          {
            q: 'A：（あなたの{国|くに}・{町|まち}）に{行|い}きたいと{思|おも}っていますが、いつごろがおすすめですか。B：そうですね。（　）{月|がつ}から（　）{月|がつ}にかけてがおすすめですよ。（　）から。',
            hint: 'Kendi ülkeni anlat.',
            a: '4{月|がつ}から5{月|がつ}にかけて…{暖|あたた}かくて、{花|はな}がたくさん{咲|さ}いている',
            note: 'Örnek: Türkiye — nisandan mayısa, hava ılık ve her yer çiçekli.',
          },
        ],
      },
      {
        title: '9. 〜と、A／V',
        items: [
          {
            q: '{現代社会|げんだいしゃかい}では（　）がないと、{不便|ふべん}です。',
            hint: 'Serbest.',
            a: 'スマートフォン',
            note: 'Örnek. インターネット／クレジットカード da olur.',
          },
          {
            q: '{恋人|こいびと}の{誕生日|たんじょうび}に（　）と、{喜|よろこ}ぶと{思|おも}います。',
            hint: 'と’dan önce şimdiki zaman.',
            a: '{花|はな}をあげる',
            note: 'Örnek. 手紙を書く／おいしい店に連れて行く da olur.',
          },
        ],
      },
    ],
    quiz: [
      { q: '{明日|あした}は{雨|あめ}が（　）でしょう。', opts: ['{降|ふ}る', '{降|ふ}ります', '{降|ふ}って', '{降|ふ}れ'], a: 0, why: 'でしょう’dan önce sade hâl: 降る.' },
      { q: '{東京|とうきょう}は{明日|あした}も（　）でしょう。', opts: ['{晴|は}れ', '{晴|は}れだ', '{晴|は}れな', '{晴|は}れの'], a: 0, why: 'İsimde だ düşer: 晴れでしょう.' },
      { q: '{公園|こうえん}の{子|こ}どもを{迎|むか}えに{来|き}たのは、きっと{父親|ちちおや}（　）。', opts: ['だろう', 'だろうか', 'なら', 'ので'], a: 0, why: 'きっと + だろう = büyük ihtimalle.' },
      { q: '6{月|がつ}{下旬|げじゅん}から7{月|がつ}{下旬|げじゅん}（　）{雨|あめ}の{日|ひ}が{続|つづ}きます。', opts: ['にかけて', 'までに', 'について', 'によって'], a: 0, why: 'Net sınırı olmayan dönem: 〜から〜にかけて.' },
      { q: '{東北地方|とうほくちほう}（　）{関東地方|かんとうちほう}にかけて{天気|てんき}が{崩|くず}れるでしょう。', opts: ['から', 'まで', 'に', 'で'], a: 0, why: 'Kalıp: から … にかけて.' },
      { q: 'ここに{荷物|にもつ}を（　）と、{迷惑|めいわく}になります。', opts: ['{置|お}く', '{置|お}いた', '{置|お}いて', '{置|お}き'], a: 0, why: 'と’dan önce şimdiki zaman: 置く.' },
      { q: '{手伝|てつだ}っていただける（　）、{助|たす}かります。', opts: ['と', 'のに', 'ても', 'から'], a: 0, why: 'Sonuç + duygu (助かる): 〜と.' },
      { q: '「{晴|は}れのち{雨|あめ}」の{意味|いみ}は？', opts: ['önce açık, sonra yağmur', 'açık ve yağmurlu karışık', 'bütün gün yağmur', 'önce yağmur, sonra açık'], a: 0, why: 'のち = sonra.' },
      { q: '「{肌寒|はだざむ}い」の{意味|いみ}は？', opts: ['biraz serin', 'çok sıcak', 'çok nemli', 'rüzgârlı'], a: 0, why: '肌 (cilt) + 寒い: cilde serin gelen.' },
      { q: '「{洗濯日和|せんたくびより}」の{意味|いみ}は？', opts: ['çamaşır için ideal gün', 'çamaşır yıkanamayan gün', 'yağmurlu gün', 'çamaşır yıkama makinesi'], a: 0, why: '〜日和 = ~ için ideal hava.' },
      { q: '「{汗|あせ}ばむ{陽気|ようき}」はどんな{天気|てんき}？', opts: ['hafif terletecek kadar ılık', 'dondurucu soğuk', 'fırtınalı', 'sisli'], a: 0, why: '汗ばむ = hafif terlemek.' },
      { q: '{友達|ともだち}を{誘|さそ}う{表現|ひょうげん}はどれ？', opts: ['よかったら、{一緒|いっしょ}に{行|い}ってみない？', '{行|い}かないでください。', '{行|い}ったことがあります。', '{行|い}けばよかった。'], a: 0, why: 'よかったら + 一緒に〜てみない？ = davet.' },
    ],
  },
]
