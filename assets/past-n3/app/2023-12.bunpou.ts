import type { ExamSection } from '@/pages/past-n3/types'

/** JLPT N3, Aralık 2023 — 言語知識（文法）・読解. */
export const BUNPOU: ExamSection[] = [
  {
    id: 'b1',
    part: '文法',
    title: '問題1 · 文法形式の判断',
    how: 'Boşluğa uyan dilbilgisi kalıbını seç. Önce boşluğun önündeki kelimenin biçimine bak (isim mi, fiilin hangi hâli?), sonra cümlenin genel anlamına: sebep mi, zaman mı, karşıtlık mı? Kalıbı biliyorsan şıklara bakmadan önce kendin tahmin et.',
    groups: [
      {
        items: [
          { no: 1, q: 'この{辺|あた}りは古いお{寺|てら}や{神社|じんじゃ}が多く、外国（　）{観光客|かんこうきゃく}にも人気がある。', opts: ['で', 'での', 'から', 'からの'], a: 3, why: 'İki isim (外国 ve 観光客) の ile bağlanır: 外国からの観光客 = yurt dışından gelen turist. から tek başına isme bağlanamaz.' },
          { no: 2, q: '10年前に友人と2人で会社を作った。10年間で会社は少しずつ大きくなり、{社員|しゃいん}の数は100人（　）{増|ふ}えた。', opts: ['までが', 'までで', 'にまで', 'のまで'], a: 2, why: '〜に増える = ~e çıkmak; まで “ta ki ~e kadar” vurgusu → 100人にまで増えた.' },
          { no: 3, q: '{弁当屋|べんとうや}で働いている友人が、よく売れる弁当は天気（　）{違|ちが}うと言っていた。', opts: ['について', 'によって', 'において', 'に{比|くら}べて'], a: 1, why: '〜によって違う = ~e göre değişir. Klasik kalıp.' },
          { no: 4, q: '中学生のころから{留学|りゅうがく}したいと思っていた日本に、（　）留学できることになった。', opts: ['どうか', '決して', 'ついに', '今にも'], a: 2, why: 'Yıllardır istenen şey sonunda oldu = ついに. 決して ~ない asla · 今にも her an · どうか lütfen.' },
          { no: 5, q: '{虫歯|むしば}は、ひどくなってからだと{治|なお}すのに時間がかかる。ひどくならない（　）{歯医者|はいしゃ}に{診|み}てもらうことが重要だ。', opts: ['うちに', 'ときに', 'までに', 'たびに'], a: 0, why: '〜ないうちに = ~ olmadan önce (durum değişmeden). Kötüleşmeden doktora git.' },
          { no: 6, q: '来月から大学の近くで{一人暮|ひとりぐ}らしを始める。{通学|つうがく}のしやすさを（　）、大学まで歩いて{通|かよ}える所にした。', opts: ['考えるように', '考えて', '考えたのに', '考えるのか'], a: 1, why: '〜を考えて = ~i düşünerek (sebep/gerekçe). Okula gidiş kolaylığını düşünüp yürüme mesafesini seçtim.' },
          { no: 7, q: '{実家|じっか}からみかんがたくさん送られてきた。一人では全部（　）と思ったので、友達に半分あげた。', opts: ['食べられそうにない', '食べられなくなる', '食べられるだろう', '食べられたほうがいい'], a: 0, why: '〜そうにない = ~ecek gibi değil. Tek başıma hepsini yiyebilecek gibi değilim → yarısını verdim.' },
          { no: 8, q: '{動物|どうぶつ}が好きな2{歳|さい}の{娘|むすめ}を（　）、先週{初|はじ}めて{動物園|どうぶつえん}に連れていった。', opts: ['{喜|よろこ}んだら', '喜びたくて', '喜ばせたら', '喜ばせたくて'], a: 3, why: 'Kızı sevindirmek (ettirgen 喜ばせる) istedim (〜たくて) → götürdüm. 喜ばせたら “sevindirirsem” sonuçla uymuyor.' },
          { no: 9, q: '最近、バレエを習い始めた。{上手|じょうず}に（　）何年かかるかわからないが、{頑張|がんば}りたい。', opts: ['{踊|おど}れるようにすると', '踊れるようになっても', '踊れるようにして', '踊れるようになるのに'], a: 3, why: '〜のに (amaç) + 時間がかかる: iyi dans edebilmek için kaç yıl sürer. ようになる = yapabilir hâle gelmek.' },
          { no: 10, q: 'うちの犬は{散歩|さんぽ}が大好きだが、雨の日はぬれるのが{嫌|いや}なようで、散歩に（　）。', opts: ['行かなくてはいけない', '行きたがらない', '行ってもかまわない', '行くに違いない'], a: 1, why: 'Başkasının (köpeğin) isteği: 〜たがる. Islanmayı sevmiyor → gitmek istemiyor = 行きたがらない.' },
          { no: 11, q: '（デパートで）客「すみません、子供服の売り場は{何階|なんがい}ですか。」店員「5階（　）。」', opts: ['がございます', 'がいらっしゃいます', 'でございます', 'でいらっしゃいます'], a: 2, why: '5階です’in kibar hâli = 5階でございます. がございます = “var”. いらっしゃる insanlar için.' },
          { no: 12, q: '（家で）A「{夕飯|ゆうはん}に使う{卵|たまご}が足りないから、ちょっとスーパーまで（　）ね。」B「うん、わかった。」', opts: ['買ってきておく', '買いにきている', '買いにいってくる', '買っていってしまう'], a: 2, why: '〜にいってくる = gidip (dönerim): “Markete gidip geliyorum.” Çıkarken söylenen kalıp.' },
          { no: 13, q: '（電話で）田中「もしもし、田中です。山下さん、今ちょっといいですか。」山下「あ、田中さん。私も今ちょうど田中さんに電話をしようと（　）。」', opts: ['思っていたところでした', '思っているところです', '思っていたからでした', '思っているからです'], a: 0, why: '〜ていたところだ = tam da ~yordum (o sırada). Telefon geldi, düşünme anı geçmişte kaldı.' },
        ],
      },
    ],
  },
  {
    id: 'b2',
    part: '文法',
    title: '問題2 · 文の組み立て（★）',
    how: 'Dört parçayı doğru sıraya diz ve ★ olan yere gelen parçayı seç. Strateji: önce birbirine kesin bağlanan ikiliyi bul (isim + partikel, ～ように + する), sonra boşluğun öncesi ve sonrasıyla uyanı yerleştir. Sırayı bulunca ★’ın kaçıncı boşluk olduğuna dikkat et.',
    groups: [
      {
        items: [
          { no: 14, q: '私は歌手の{石川|いしかわ}あかりが大好きだ。{彼女|かのじょ} ★＿ ＿＿ ＿＿ ＿＿ いないと思う。', opts: ['声がきれいな', 'は', '歌手', 'ほど'], a: 3, why: 'Doğru sıra: 彼女[ほど][声がきれいな][歌手][は]いない — “Onun kadar sesi güzel şarkıcı yok.” 〜ほど〜ない = ~ kadar ~ değil. ★ 1. boşluk = ほど.' },
          { no: 15, q: '最近は野菜や魚などの食料品も ＿＿ ＿＿ ★ ＿＿ ニュースで知った。', opts: ['人が', '増えてきている', 'インターネットで買う', 'ということを'], a: 1, why: 'Sıra: [インターネットで買う][人が][増えてきている][ということを] — internetten alan insanların arttığını haberden öğrendim. ★ 3. boşluk = 増えてきている.' },
          { no: 16, q: '（大学で）{中山|なかやま}「{林先輩|はやしせんぱい}、ゼミの{発表|はっぴょう}で使う{資料|しりょう}を作ったんですが、＿＿ ＿＿ ★ ＿＿ でしょうか。」林「いいですよ。」', opts: ['もらえない', 'ところがあるので', '一度チェックして', '{自信|じしん}がない'], a: 2, why: 'Sıra: [自信がない][ところがあるので][一度チェックして][もらえない]でしょうか — emin olmadığım yerler var, bir kontrol eder misiniz? ★ = 一度チェックして.' },
          { no: 17, q: '{今朝|けさ}は急いでいたから、＿＿ ＿＿ ★ ＿＿ しまった。', opts: ['{玄関|げんかん}の電気を消すのを', 'きて', '家を出て', '忘れて'], a: 2, why: 'Sıra: [玄関の電気を消すのを][忘れて][家を出て][きて]しまった — giriş ışığını kapatmayı unutup evden çıkıverdim. ★ = 家を出て.' },
          { no: 18, q: '{読書|どくしょ}が{趣味|しゅみ}の友人は、いつどんな本を読んだかを ＿＿ ＿＿ ★ ＿＿ そうだ。', opts: ['必ずノートに{記録|きろく}する', '忘れない', 'ように', 'ことにしている'], a: 0, why: 'Sıra: [忘れない][ように][必ずノートに記録する][ことにしている] — unutmamak için mutlaka deftere yazmayı alışkanlık edinmiş. ★ = 必ずノートに記録する.' },
        ],
      },
    ],
  },
  {
    id: 'b3',
    part: '文法',
    title: '問題3 · 文章の文法',
    how: 'Bir metindeki boşlukları doldur. Cevap tek cümlede değil, metnin akışındadır: boşluktan önceki ve sonraki cümleyi oku. Bağlaçlarda (ただ, そのうえ, ところが) önceki cümle ile ilişkiye bak: ekleme mi, karşıtlık mı?',
    groups: [
      {
        title: 'ガソリンスタンドのサービス',
        passage: [
          { jp: '以下は、{留学生|りゅうがくせい}の作文である。', tr: 'Aşağıdaki, yabancı bir öğrencinin kompozisyonudur.' },
          { jp: '先週、{友達|ともだち}の車でドライブに行ったとき、私は初めて日本のガソリンスタンドに行きました。', tr: 'Geçen hafta arkadaşımın arabasıyla gezmeye gittiğimizde ilk kez Japonya’da bir benzinliğe gittim.' },
          { jp: 'ガソリンスタンドで友達が車を止めると、店員が車の{窓|まど}のそばまで来ました。友達は窓を開けて、入れたいガソリンの{種類|しゅるい}と{量|りょう}を店員に伝えました。私は自分でガソリンを入れる店 [19] 知りませんでした。だから、その{様子|ようす}を見て、どうして友達は車から出ないんだろうと思いました。友達が窓を閉めると、すぐに店員がガソリンを入れ始めたので、{驚|おどろ}きました。[20]、別の店員が来て、車の窓も{丁寧|ていねい}に{拭|ふ}いてくれたのです。そのガソリンスタンドで友達は、一度も車から出ませんでした。', tr: 'Arkadaşım arabayı durdurunca görevli pencerenin yanına geldi. Arkadaşım pencereyi açıp istediği benzin türünü ve miktarını söyledi. Ben sadece kendin benzin koyduğun benzinlikleri biliyordum. Bu yüzden arkadaşım neden arabadan inmiyor diye düşündüm. Pencereyi kapatınca görevli hemen benzin koymaya başladı, şaşırdım. Üstelik başka bir görevli gelip camları da özenle sildi. Arkadaşım o benzinlikte bir kez bile arabadan inmedi.' },
          { jp: '友達によると、日本のガソリンスタンドには、{客|きゃく}が自分でガソリンを入れるところと店員が入れるところがあり、料金はそんなに変わらないそうです。私たちが [21] ガソリンスタンドでは、ガソリンを入れた車が{道路|どうろ}に出るとき、店員が左右を見て車が来ないか{確認|かくにん}して、見送りもしていました。', tr: 'Arkadaşıma göre Japonya’da müşterinin kendi koyduğu ve görevlinin koyduğu benzinlikler varmış, fiyat pek değişmiyormuş. Gittiğimiz benzinlikte araba yola çıkarken görevli sağa sola bakıp araba gelmiyor mu diye kontrol etti ve bizi uğurladı.' },
          { jp: 'ガソリンを入れたり、窓を拭いたり、見送りをしたりしてもらって、私はそのガソリンスタンドが客や車を大切にしていると感じました。とても [22]。', tr: 'Benzin koyulması, camların silinmesi, uğurlanma… O benzinliğin müşteriye ve arabaya değer verdiğini hissettim. Çok iyi bir hizmet olduğunu düşündüm.' },
        ],
        items: [
          { no: 19, q: '[19]', opts: ['は', 'も', 'だけ', 'しか'], a: 3, why: 'Arkası 知りませんでした (olumsuz) → 〜しか〜ない = sadece ~ (biliyordum). “Sadece self-servis benzinlikleri biliyordum.”' },
          { no: 20, q: '[20]', opts: ['ただ', '{例|たと}えば', 'そのうえ', 'ところが'], a: 2, why: 'Benzin koydular + üstelik camı da sildiler → ekleme: そのうえ (üstelik). ところが karşıtlık olurdu.' },
          { no: 21, q: '[21]', opts: ['行った', '行ける', '行くような', '行きたかった'], a: 0, why: 'Anlatılan, o gün gittikleri benzinlik → 私たちが行ったガソリンスタンド (geçmiş).' },
          { no: 22, q: '[22]', opts: ['いいサービスだろうと思うからです', 'いいサービスだと思いました', 'いいサービスにするつもりです', 'いいサービスにしようとしました'], a: 1, why: 'Yazarın kendi izlenimi, geçmiş anlatı: いいサービスだと思いました. つもり／しよう hizmeti veren tarafın sözü olurdu.' },
        ],
      },
    ],
  },
  {
    id: 'r4',
    part: '読解',
    title: '問題4 · 内容理解（短文）',
    how: 'Kısa metin (e-posta, not, makale) + tek soru. Önce SORUYU oku, metinde neyi arayacağını bil. Not/mesajda “お願いできますか / 〜てください” rica cümlesidir; makalede altı çizili ifadenin hemen öncesi ve sonrası cevaptır.',
    groups: [
      {
        title: '(1) 映画館からのメール',
        passage: [
          { jp: 'これは、ある{映画館|えいがかん}のインターネットチケット{予約|よやく}サービスから、{村田|むらた}さんに{届|とど}いたメールである。', tr: 'Bu, bir sinemanın internet bilet rezervasyon servisinden Murata’ya gelen e-postadır.' },
          { jp: '村田{新一|しんいち}{様|さま}　チケット{代金|だいきん}を{支払|しはら}っていただき、ありがとうございました。', tr: 'Sayın Shin’ichi Murata, bilet ücretini ödediğiniz için teşekkür ederiz.' },
          { jp: '＜予約{番号|ばんごう}＞0832　＜電話番号＞090-0911-4215　＜{日時|にちじ}＞4月11日（土）14時〜　＜合計代金＞大人2{枚|まい} 3,600円　＜映画名＞『海』　＜{席番号|せきばんごう}＞K13 K14', tr: 'Rezervasyon no: 0832 · Telefon · Tarih: 11 Nisan (cmt) 14:00 · Toplam: 2 yetişkin 3.600 yen · Film: “Deniz” · Koltuk: K13 K14' },
          { jp: '・ご予約はキャンセルできませんので、ご注意ください。', tr: '• Rezervasyon iptal edilemez, dikkat edin.' },
          { jp: '・[[{当日|とうじつ}は、映画館でチケットを{発券|はっけん}していただく必要がございます。{券売機|けんばいき}に＜予約番号＞と＜電話番号＞をご{入力|にゅうりょく}ください。]]', tr: '• O gün sinemada biletinizi bastırmanız gerekiyor. Bilet makinesine rezervasyon numaranızı ve telefon numaranızı girin.' },
          { jp: '・[[映画開始から15分を{過|す}ぎますと、券売機での発券はできなくなります。]]それ{以降|いこう}は、チケットオフィスで発券いたします。', tr: '• Film başladıktan 15 dakika sonra makineden bilet basılamaz. Ondan sonra bilet gişeden verilir.' },
        ],
        items: [
          { no: 23, q: '当日、予約したチケットを券売機で発券したい場合、どうしなければならないか。', opts: ['映画開始時間の15分前までに、券売機に必要な情報を入力する。', '映画開始時間の15分前までに、券売機でお金を払う。', '映画開始時間の15分後までに、券売機に必要な情報を入力する。', '映画開始時間の15分後までに、券売機でお金を払う。'], a: 2, why: 'Para zaten ödendi (支払っていただき) → “para öde” şıkları elenir. Makine “başlangıçtan 15 dakika GEÇİNCE” kapanır → 15 dakika sonrasına kadar bilgileri gir = 3.' },
        ],
      },
      {
        title: '(2) 春美さんのメモ',
        passage: [
          { jp: 'アリサさんが家に帰ると、テーブルの上に、{一緒|いっしょ}に住んでいる{春美|はるみ}さんが書いたメモが{置|お}いてあった。', tr: 'Arisa eve döndüğünde masada birlikte yaşadığı Harumi’nin yazdığı bir not vardı.' },
          { jp: '大学の{事務所|じむしょ}に今日中に出さなければならない{書類|しょるい}があるのを忘れていたので、ちょっと行ってきます。', tr: 'Bugün üniversite ofisine teslim etmem gereken bir belgeyi unutmuşum, gidip geliyorum.' },
          { jp: 'カレーとスープはできたんだけど、[[サラダがまだできていないので、お願いできますか]]。{冷蔵庫|れいぞうこ}にトマトやレタスがあるから、{適当|てきとう}に使ってください。', tr: 'Köri ve çorba hazır ama salata henüz yapılmadı, sen yapabilir misin? Buzdolabında domates ve marul var, istediğin gibi kullan.' },
          { jp: '今日は私が{晩|ばん}ご{飯|はん}を作ると言ったのに、ごめんなさい。帰りに何か{甘|あま}いものを買ってきますね。', tr: 'Bugün akşam yemeğini ben yapacağım demiştim, özür dilerim. Dönüşte tatlı bir şey alırım.' },
        ],
        items: [
          { no: 24, q: 'アリサさんがこのメモで{頼|たの}まれていることは何か。', opts: ['大学の事務所に行って、書類を出すこと', 'カレーとスープを作ること', 'サラダを作ること', '甘いものを買うこと'], a: 2, why: 'Rica cümlesi: サラダが…お願いできますか → salata. Ofise gitmek ve tatlı almak Harumi’nin kendi işi; köri ve çorba zaten hazır.' },
        ],
      },
      {
        title: '(3) 待ち合わせの調査',
        passage: [
          { jp: '{雑誌|ざっし}で「友達や家族と待ち合わせるとき、その場所に行く時間」についての{調査|ちょうさ}の{記事|きじ}を読んだ。[[早めに行く人は、全体の59%で最も多く]]、次に多かったのが、時間に間に合うように行く人で36%だった。一方で、{多少|たしょう}遅れても気にしないという人は、3%しかいなかった。', tr: 'Dergide “arkadaş/aileyle buluşurken oraya ne zaman gidiyorsunuz” anketiyle ilgili bir yazı okudum. Erken gidenler %59 ile en çoktu; ikinci sırada %36 ile tam zamanında gidenler vardı. Biraz geç kalmayı umursamayanlar ise sadece %3’tü.' },
          { jp: '[[私はいつも早めに行く]]が、友人たちはたいてい遅れて来る。私が{珍|めずら}しいタイプなのかと思っていたが、この結果から、そうではないとわかって、[意外だった]。', tr: 'Ben hep erken giderim ama arkadaşlarım genelde geç gelir. Nadir bir tip miyim diye düşünüyordum; bu sonuçtan öyle olmadığını anlayınca şaşırdım.' },
        ],
        items: [
          { no: 25, q: '意外だったとあるが、調査結果のどのような点からそう思ったか。', opts: ['「私」と同じタイプの人が、最も多い点', '「私」と同じタイプの人が、二番目に多い点', '「私」と同じタイプの人が、最も少ない点', '「私」と反対のタイプの人が、最も多い点'], a: 0, why: 'Yazar erken gidiyor ve kendini azınlık sanıyordu; oysa erken gidenler %59 ile EN çok → 1.' },
        ],
      },
      {
        title: '(4) 納豆の食べ方',
        passage: [
          { jp: '{納豆|なっとう}は、体にいいし、おいしいので、私は毎日食べている。そのまま食べる人も多いが、[[私は{卵|たまご}に{混|ま}ぜて{焼|や}いたり、みそ{汁|しる}に入れたり]]、いろいろな料理に使っている。', tr: 'Nattō hem sağlıklı hem lezzetli, her gün yiyorum. Çoğu kişi olduğu gibi yer ama ben yumurtayla karıştırıp pişiriyor, miso çorbasına koyuyor, çeşitli yemeklerde kullanıyorum.' },
          { jp: 'しかし、{今朝|けさ}テレビを見て{驚|おどろ}いた。納豆には、ほかの食べ物にはない種類の{酵素|こうそ}が入っている。これには{血液|けつえき}の流れをよくする{効果|こうか}があるが、[[50度以上の熱で減ってしまうそうなのだ]]。そうだとすると、私は今まで、とても[もったいない食べ方をしていた]ことになる。', tr: 'Ama bu sabah televizyonu izleyince şaşırdım. Nattōda başka yiyecekte olmayan bir enzim varmış; kan akışını iyileştiriyormuş ama 50 derecenin üstündeki ısıda azalıyormuş. Öyleyse ben şimdiye kadar çok yazık bir şekilde yiyormuşum.' },
          { jp: '（注）酵素：ここでは、食べ物に入っている{栄養|えいよう}のような物', tr: '(Not) 酵素: burada, yiyecekteki besin öğesi gibi bir şey' },
        ],
        items: [
          { no: 26, q: 'もったいない食べ方をしていたとあるが、なぜもったいないと思ったのか。', opts: ['体へのよい効果が弱くなってしまう料理のしかたで、納豆を食べていたから', '体へのよい効果が消えるような、たくさんの量の納豆を食べていたから', 'おいしさがわからなくなるような料理のしかたで、納豆を食べていたから', 'おいしくなる料理方法があるのに、それを知らないで納豆を食べていたから'], a: 0, why: 'Pişirerek (焼く, みそ汁) yiyordu; ısı enzimi azaltıyor → iyi etki zayıflıyor = 1. Miktar ya da lezzetten söz yok.' },
        ],
      },
    ],
  },
  {
    id: 'r5',
    part: '読解',
    title: '問題5 · 内容理解（中文）',
    how: 'Orta uzunlukta metin, 3 soru. Sorular genelde paragraf sırasıyla gider: 1. soru 1–2. paragrafta, son soru metnin sonunda. Altı çizili ifade (このときの私, それ) için hemen önceki cümleyi oku — gösterme kelimeleri hep geriyi gösterir.',
    groups: [
      {
        title: '(1) 漫画の授業',
        passage: [
          { jp: '私の留学している日本の大学には、{漫画|まんが}を読んで社会について考える{授業|じゅぎょう}があります。私は子供のころから日本の漫画が大好きだったので、この授業を取りました。しかし、これは{失敗|しっぱい}でした。', tr: 'Okuduğum Japon üniversitesinde manga okuyup toplum üzerine düşünülen bir ders var. Çocukluğumdan beri Japon mangasını çok sevdiğim için bu dersi aldım. Ama bu bir hataydı.' },
          { jp: 'この授業では、[[学生は毎週の授業の前に、先生が{指定|してい}した漫画を読んでいくことになっていました]]。ところが、{扱|あつか}う漫画はどれも私が知らないものばかりだったので、読むのに時間がかかって、毎回とても大変でした。', tr: 'Bu derste öğrenciler her haftaki dersten önce hocanın belirlediği mangayı okuyup gelmek zorundaydı. Ama işlenen mangaların hepsi benim bilmediklerimdi; okumak uzun sürüyor, her seferinde çok zorlanıyordum.' },
          { jp: 'いちばん困ったのは{学期末|がっきまつ}の{試験|しけん}です。試験の前に、ある漫画を読んでおくように先生に言われました。その漫画は全部で3{巻|かん}もあり、しっかり読むのにはとても時間がかかりました。[[そのために、ほかの試験の勉強ができなくなり]]、寝る時間も{削|けず}らなければならなくなりました。いつもなら、[[試験期間中は漫画を読むのを{我慢|がまん}する]]のですが、[このときの私は逆だった]のです。', tr: 'En çok dönem sonu sınavında zorlandım. Sınavdan önce hoca bir mangayı okumamızı söyledi. Tam 3 ciltti, dikkatle okumak çok vakit aldı. Bu yüzden diğer sınavlara çalışamadım, uykumdan bile kısmak zorunda kaldım. Normalde sınav döneminde manga okumaya dayanırım (okumam), ama o zamanki ben tam tersiydim.' },
          { jp: '試験はうまくいきましたが、[[今はしばらく漫画はお休みにしたい気分です]]。', tr: 'Sınav iyi geçti ama şimdi bir süre mangaya ara vermek istiyorum.' },
        ],
        items: [
          { no: 27, q: '毎回の授業の前に、学生がしなければならなかったことは何か。', opts: ['授業で先生に扱ってもらいたい漫画を見つけてくること', '社会問題がテーマになっている漫画を見つけてくること', '先生に読んでくるように言われた漫画を読んでおくこと', '自分が読んだことがない漫画を探して、読んでおくこと'], a: 2, why: '先生が指定した漫画を読んでいく = hocanın söylediği mangayı okuyup gelmek → 3.' },
          { no: 28, q: 'このときの私は、どのような{状態|じょうたい}だったか。', opts: ['ほかの試験の勉強がしたいのに、漫画を読まなければならなかった。', '漫画が読みたいのに、試験の勉強をしなければならなかった。', '好きな漫画が読みたいのに、好きではない漫画を読まなければならなかった。', '試験の勉強をしなければならないのに、漫画を読むのを我慢できなかった。'], a: 0, why: 'Normalde sınavda manga okumam; bu kez tersi: manga okumak ZORUNDA kaldım, başka sınavlara çalışamadım → 1. 4 tuzak: “dayanamadım” değil, mecburdu.' },
          { no: 29, q: '「私」は今、どんな気持ちになっているか。', opts: ['しばらくは、休みの日だけに漫画を読もう。', 'しばらくは、好きな漫画しか読みたくない。', 'しばらくは、我慢して漫画を読もう。', 'しばらくは、漫画は読みたくない。'], a: 3, why: 'お休みにしたい = ara vermek istiyorum → bir süre manga okumak istemiyor = 4.' },
        ],
      },
      {
        title: '(2) A町の朝市',
        passage: [
          { jp: 'A町は{景色|けしき}の美しい海{沿|ぞ}いの町で、毎週日曜の朝に{港|みなと}で開かれる「{朝市|あさいち}」も人気がある。朝市は、A町にある店が、魚や肉、野菜、パン、ケーキなどを売る{市場|いちば}で、近くの市や町からも客が{大勢|おおぜい}やってくる。', tr: 'A kasabası manzarası güzel bir sahil kasabası; her pazar sabahı limanda kurulan “sabah pazarı” da çok sevilir. Sabah pazarında A’daki dükkânlar balık, et, sebze, ekmek, pasta satar; yakın şehirlerden de çok müşteri gelir.' },
          { jp: '朝市を始めたのは、A町に昔からある店の主人たちである。約30年前、大きなスーパーマーケットができた。多くの人がスーパーを利用するようになってしまったため、[[店の主人たちは、自分たちの店の{商品|しょうひん}の良さをもっと知ってもらおうと、朝市を始めたのだ]]。', tr: 'Sabah pazarını A’nın eski dükkân sahipleri başlattı. Yaklaşık 30 yıl önce büyük bir süpermarket açıldı. Çok kişi süpermarkete gitmeye başlayınca dükkân sahipleri kendi ürünlerinin kalitesini daha çok tanıtmak için sabah pazarını başlattı.' },
          { jp: '朝市では、人気がある商品はすぐ売り切れてしまう。[[そんなに人気があるなら、たくさん売ればいいのだが、[それ]はしないそうだ]]。この朝市の目的は、朝市でお金を{稼|かせ}ぐことではなく、まず朝市で自分たちの店について知ってもらって、ふだんA町の店で買い物をする客を増やすことだからだ。そのため、朝市に商品が出せる人は（　）だけ、ということになっている。', tr: 'Sabah pazarında popüler ürünler hemen tükenir. Bu kadar popülerse çok satsalar olur ama bunu yapmıyorlarmış. Çünkü amaç pazarda para kazanmak değil; önce dükkânlarını tanıtıp A’daki dükkânlardan her gün alışveriş yapan müşteriyi artırmak. Bu yüzden pazara ürün koyabilenler sadece (　) olanlar.' },
        ],
        items: [
          { no: 30, q: 'A町にある店の主人たちは、何のために朝市を始めたのか。', opts: ['町の中に、安く買い物ができるところを増やすため', '町の中に、近くの市や町から来る客が楽しめる場所を作るため', '自分たちの町の景色の美しさをもっと{宣伝|せんでん}するため', '自分たちの店の商品の良さをもっと知ってもらうため'], a: 3, why: 'Metinde aynen: 自分たちの店の商品の良さをもっと知ってもらおうと → 4.' },
          { no: 31, q: 'それとあるが、何か。', opts: ['朝市で人気がある商品を、店で売るより高く売ること', '朝市で人気がある商品を、朝市でもっと売ること', '朝市でしか買えない商品の種類を増やすこと', '朝市でしか買えない商品を平日に店でも売ること'], a: 1, why: 'それ hemen öncekini gösterir: “popülerse çok satsalar olur” → popüler ürünü pazarda daha çok satmak = 2.' },
          { no: 32, q: '（　）に入れるのに最もよいものはどれか。', opts: ['A町に店がある人', 'A町以外の市や町に店がある人', 'A町で店を開きたいと思っている人', 'A町の店でふだんから買い物をしている人'], a: 0, why: 'Amaç A’daki dükkânlara müşteri çekmek → ürün koyabilen sadece A’da dükkânı olanlar = 1.' },
        ],
      },
    ],
  },
  {
    id: 'r6',
    part: '読解',
    title: '問題6 · 内容理解（長文）',
    how: 'Uzun bir hikâye, 4 soru, numaralı altı çizili yerler. Her soru kendi numarasının etrafında cevaplanır. Zaman çizgisine dikkat: “şimdi” ve “20 yıl önce” karışıyor — kim, ne zaman, ne yaptı, kâğıda yaz.',
    groups: [
      {
        title: 'オートバイと「ガロン」',
        passage: [
          { jp: '先月、新しいオートバイを買った。オートバイには[①長い間乗っていなかった]が、{久|ひさ}しぶりにまた乗りたくなったのだ。前に乗っていたのは大学生のころで、もう20年も前だ。[[卒業後はずっと仕事や子供の世話で{忙|いそが}しかった]]が、最近、少し自由に使える時間が増えた。{妻|つま}に{相談|そうだん}したら、「いいんじゃない？」と{賛成|さんせい}してくれた。', tr: 'Geçen ay yeni bir motosiklet aldım. Uzun süredir binmiyordum ama yeniden binmek istedim. En son üniversitedeyken, 20 yıl önce binmiştim. Mezuniyetten sonra hep iş ve çocuk bakımıyla meşguldüm; son zamanlarda boş vaktim arttı. Eşime danıştım, “Olur bence” diye destekledi.' },
          { jp: 'オートバイを買った店は、「ガロン」という店だ。私には、どうしてもこの店で買いたい理由があったのだ。', tr: 'Motosikleti aldığım dükkânın adı “Garon”. Mutlaka bu dükkândan almak istememin bir sebebi vardı.' },
          { jp: '[[20年前の春、私は、父にもらったオートバイで東京から京都まで旅行をしていた]]。安い{旅館|りょかん}に{泊|と}まりながら、何日もかけて進む旅だった。', tr: '20 yıl önceki bir bahar, babamdan aldığım motosikletle Tokyo’dan Kyoto’ya yolculuk ediyordum. Ucuz hanlarda kalarak günlerce ilerlediğim bir yolculuktu.' },
          { jp: '[[3日目の朝]]、道を走っているとき、オートバイの前の方で何かが{折|お}れる音がした。見ると、[②オートバイの{部品|ぶひん}が{壊|こわ}れていた]。ハンドルが少しぐらぐらしたが、オートバイは{一応|いちおう}動いた。', tr: 'Üçüncü günün sabahı yolda giderken motosikletin önünde bir şeyin kırıldığını duydum. Baktım, bir parça kırılmıştı. Gidon biraz sallanıyordu ama motosiklet yine de gidiyordu.' },
          { jp: 'しばらく進むと、オートバイの店があったので、{修理|しゅうり}を{頼|たの}んでみた。しかし、難しい修理だからできない、と{断|ことわ}られてしまった。次の店でも同じだった。そして、3{軒目|けんめ}の店が「ガロン」だった。「ガロン」の店員も「これは難しいね。」と言った。でも、「困っているんでしょう？　やってみるよ。」と言って、修理を始めてくれた。そして、2時間かけて直してくれたのだ。店員は「いつかこの店でオートバイを買ってね。」と言って笑った。本当に困っていた私は、[③何度もお{礼|れい}を言いながら]、必ずそうしようと決めた。', tr: 'Biraz ilerleyince bir motosikletçi vardı, tamir istedim. Ama zor bir tamir, yapamayız diye reddettiler. Sonraki dükkânda da aynısı oldu. Üçüncü dükkân “Garon”du. Oradaki çalışan da “Bu zor” dedi. Ama “Zor durumdasın, değil mi? Deneyeyim” deyip tamire başladı ve 2 saatte onardı. “Bir gün motosikletini bu dükkândan al” deyip güldü. Gerçekten çaresiz olan ben, defalarca teşekkür ederek mutlaka öyle yapmaya karar verdim.' },
          { jp: '今の「ガロン」には、もうあの店員はいなかった。会えなかったのは残念だったが、それでも私は[④{満足|まんぞく}している]。', tr: 'Bugünkü “Garon”da o çalışan artık yoktu. Görüşemememiz üzücüydü ama yine de memnunum.' },
        ],
        items: [
          { no: 33, q: '「私」がオートバイに①長い間乗っていなかったのは、どうしてか。', opts: ['買いたいと思うオートバイがなかったから', '仕事や子供の世話で忙しかったから', '「私」のオートバイを妻が使っていたから', '家にあるオートバイが壊れていたから'], a: 1, why: 'Hemen sonra: 卒業後はずっと仕事や子供の世話で忙しかった → 2.' },
          { no: 34, q: '②オートバイの部品が壊れていたとあるが、壊れたのはいつか。', opts: ['先月、新しいオートバイを買ってから3日目の朝', '先月、オートバイ旅行を始めてから3日目の朝', '20年前、新しいオートバイを買ってから3日目の朝', '20年前、オートバイ旅行を始めてから3日目の朝'], a: 3, why: 'Bu olay 20 yıl önceki Tokyo–Kyoto yolculuğunun 3. sabahı → 4. Yeni motosiklet değil, babasının motosikleti.' },
          { no: 35, q: '③何度もお礼を言いながらとあるが、「私」はどうして何度もお礼を言ったのか。', opts: ['店にあった新しいオートバイを安く売ってくれたから', 'オートバイを修理してくれそうな店を教えてくれたから', '壊れて動かなくなりそうなオートバイを買ってくれたから', 'ほかの店で修理を断られたオートバイを直してくれたから'], a: 3, why: 'İki dükkân reddetti, Garon’daki çalışan zor tamiri yaptı → 4.' },
          { no: 36, q: '④満足しているとあるが、なぜか。', opts: ['もう一度、オートバイに乗ることができたから', '「ガロン」でオートバイを買うことができたから', '壊れてしまったオートバイを修理してもらうことができたから', 'オートバイの修理をしてくれた店員に、お礼を伝えることができたから'], a: 1, why: '20 yıl önce verdiği söz (“bu dükkândan al”) yerine geldi; çalışanı göremese de Garon’dan aldı → 2. 4 tuzak: çalışan orada değildi.' },
        ],
      },
    ],
  },
  {
    id: 'r7',
    part: '読解',
    title: '問題7 · 情報検索',
    how: 'Bir ilan/broşür ve 2 soru. Metnin hepsini okuma! Soruda verilen koşulları (hangi kurs, öğleden sonra, kaç kişi, otelde kalıyor mu) yaz; ilanda sadece o koşulun satırını bul. ※ ile başlayan notlar (indirim, istisna) hep bir sorunun cevabıdır.',
    groups: [
      {
        title: '朝山スキー場 · 初級スキー教室のご案内',
        passage: [
          { jp: '期間：12月24日〜3月31日', tr: 'Dönem: 24 Aralık – 31 Mart' },
          { jp: '＜{普通|ふつう}コース（2時間）＞ 大人クラス（最大10名）と子どもクラス（最大8名）があります。[[午前（10時〜12時）と、午後（2時〜4時）]]のどちらかを選んでください。大人一人4,000円／子ども（小学生）一人4,500円。※朝山ホテルにお泊まりの方は、500円{割引|わりびき}します。', tr: 'Normal kurs (2 saat): yetişkin sınıfı (en çok 10) ve çocuk sınıfı (en çok 8). Sabah 10–12 ya da öğleden sonra 2–4. Yetişkin 4.000 yen, çocuk (ilkokul) 4.500 yen. ※ Asayama Otel’de kalanlara 500 yen indirim.' },
          { jp: '＜{特別|とくべつ}コース（2時間または4時間）＞ お友達やご家族だけで習いたい方のためのコースです。小学生から参加できます。[[4〜6名のグループ]]で申し込んでください。午前9時から午後7時までの間で、2時間か4時間を選べます。1グループ：[[2時間 22,000円]]／4時間 39,000円。[[※グループの中に、朝山ホテルにお泊まりの方がいれば、グループの料金から2,000円割引します。]]', tr: 'Özel kurs (2 ya da 4 saat): sadece arkadaş/aile ile öğrenmek isteyenler için. İlkokuldan itibaren. 4–6 kişilik grupla başvurulur. 9:00–19:00 arasında 2 ya da 4 saat. Grup başı: 2 saat 22.000 yen / 4 saat 39.000 yen. ※ Grupta Asayama Otel’de kalan biri varsa grup ücretinden 2.000 yen indirim.' },
          { jp: '【申し込みと料金の支払い】・普通コースは、午前に受ける場合は当日の午前9時30分まで、[[午後に受ける場合は当日の午後1時30分までに、スキー教室の{窓口|まどぐち}（朝山ホテル1階）で申し込んでください]]。料金は申し込みのときに支払ってください。', tr: '[Başvuru ve ödeme] • Normal kurs: sabah için aynı gün 9:30’a, öğleden sonra için aynı gün 13:30’a kadar kayak okulu gişesinde (Asayama Otel 1. kat) başvurun. Ücret başvuruda ödenir.' },
          { jp: '・特別コースは、午前に開始したい場合は前日の午後4時まで、午後の場合は当日の午前9時までに、電話か窓口で申し込んでください。料金はコース開始前に窓口で支払ってください。', tr: '• Özel kurs: sabah başlamak için bir önceki gün 16:00’ya, öğleden sonra için aynı gün 9:00’a kadar telefonla ya da gişeden başvurun. Ücret kurs başlamadan gişede ödenir.' },
          { jp: '【教室当日の集合】・どちらのコースも、開始時間の10分前にスキー場の入り口に集合してください。予約・お問い合わせ 013-227-1665', tr: '[Kurs günü toplanma] • Her iki kursta da başlangıçtan 10 dakika önce kayak alanı girişinde toplanın.' },
        ],
        items: [
          { no: 37, q: 'スミスさんは、2月2日の午後に普通コースを受けたいと思っている。スミスさんは、どのように申し込みをしなければならないか。', opts: ['2月2日の午前9時までに、電話か窓口で申し込む。', '2月2日の午前9時30分までに、窓口で申し込む。', '2月2日の午後1時30分までに、窓口で申し込む。', '2月2日の午後1時30分までに、電話か窓口で申し込む。'], a: 2, why: 'Normal kurs + öğleden sonra → aynı gün 13:30’a kadar, SADECE gişeden (telefon özel kurs içindir) → 3.' },
          { no: 38, q: 'グエンさんは、友達4人と特別コースを受けたいと思っている。グエンさんたちは、朝山ホテルに泊まっている。午後2時から4時まで特別コースを受ける場合、グエンさんたちはいくら支払わなければならないか。', opts: ['22,000円を支払う。', '22,000円から2,000円を引いたものを支払う。', '39,000円を支払う。', '39,000円から2,000円を引いたものを支払う。'], a: 1, why: 'Grup (Nguyen + 4 = 5 kişi), 2 saat (14–16) = 22.000; otelde kalıyorlar → −2.000 → 2. 39.000 4 saatlik ücret.' },
        ],
      },
    ],
  },
]
