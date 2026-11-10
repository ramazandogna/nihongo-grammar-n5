import type { ExamGroup } from '@/pages/past-n3/types'

/**
 * The book's reading section (言語知識（文法）・読解 問題4・5), from the
 * photos in assets/ss_data/kanji-n3-book/. Answers worked out from the texts;
 * the pencil marks in the photos are the reader's own.
 */
export const READING_HOW = {
  4: 'Kısa metin (e-posta, not, deneme) + tek soru. Önce SORUYU oku. E-postada “〜ません／〜てください／なお” satırları, notta rica cümlesi (〜ておいてください), denemede yazarın son cümlesi cevaptır.',
  5: 'Orta metin + 3 soru, paragraf sırasıyla. Altı çizili ①② ifadenin hemen öncesi/sonrası cevaptır; son soru yazarın görüşünü sorar — metnin son paragrafına bak.',
}

export const READING: (ExamGroup & { mondai: 4 | 5 })[] = [
  {
    mondai: 4,
    title: '(1) 大雪による休講のお知らせ',
    passage: [
      { jp: 'これは大学から学生に{届|とど}いたメールである。　件名：大雪による{休講|きゅうこう}のお知らせ　送信日時：2016年12月1日 7:00', tr: 'Bu, üniversiteden öğrencilere gelen e-posta. Konu: Yoğun kar nedeniyle ders iptali. Gönderim: 1 Aralık 2016, 07:00.' },
      { jp: '現在、大雪のため、多くの{公共交通機関|こうきょうこうつうきかん}が止まっています。そのため、[[午前の{授業|じゅぎょう}は行われません]]。', tr: 'Şu an yoğun kar yüzünden toplu taşımanın çoğu durmuş durumda. Bu nedenle öğleden önceki dersler yapılmayacak.' },
      { jp: '午後の授業は、10時までに公共交通機関が動き始めれば、いつもの通り行います。[[授業を行うかどうか10時にメールでお知らせします]]ので、必ず{確認|かくにん}してください。', tr: 'Öğleden sonraki dersler, toplu taşıma 10’a kadar çalışmaya başlarsa her zamanki gibi yapılacak. Dersin olup olmayacağını saat 10’da e-postayla bildireceğiz, mutlaka kontrol edin.' },
      { jp: 'なお、クラブ活動やサークル活動なども、[[午前中は]]中止してください。　大山大学　{事務室|じむしつ}', tr: 'Ayrıca kulüp ve topluluk faaliyetleri de öğleden önce yapılmasın. — Ōyama Üniversitesi ofisi' },
    ],
    items: [
      {
        no: 24,
        q: 'このメールからわかることは何か。',
        opts: ['今日の午前の授業は、10時から始まる。', '午前も午後も、今日はクラブ活動を中止しなければならない。', '今日の午後の授業があるかどうか、10時に事務室からメールが届く。', '10時に事務室からメールが届いたら、今日の午後の授業はある。'],
        a: 2,
        why: 'Öğleden önce ders YOK (1 ✗); kulüpler sadece öğleden önce iptal (2 ✗); 10’da gelen mail “olup olmadığını” bildirir — mail gelmesi dersin olduğu anlamına gelmez (4 ✗) → 3.',
      },
    ],
  },
  {
    mondai: 4,
    title: '(2) 携帯電話を持たない私',
    passage: [
      { jp: '「{携帯|けいたい}電話は持っていないんです。」私がそう言うと、たいていの人は{驚|おどろ}く。[[「あったら便利ですよ。」と言われるが、それは私もよくわかっている]]。', tr: '“Cep telefonum yok.” Bunu deyince çoğu kişi şaşırır. “Olsa kullanışlı olur” derler; bunu ben de çok iyi biliyorum.' },
      { jp: '実は、私も以前、携帯電話を持っていた。しかし、[[いつどこにいても電話に出なければいけない気がして、それが{嫌|いや}で持つのをやめてしまった]]のだ。すると、とても気持ちが楽になった。', tr: 'Aslında ben de eskiden telefon taşıyordum. Ama her an her yerde açmak zorundaymışım gibi hissettim, bundan hoşlanmadığım için bıraktım. Sonra içim çok rahatladı.' },
      { jp: '最近は料金が安いものもあるようだし、携帯電話がない生活には不便なこともある。[[それでも、私は今のままでいいと思っている]]。', tr: 'Son zamanlarda ucuz tarifeler de varmış, telefonsuz hayatın zorlukları da var. Yine de ben şimdiki hâlimden memnunum.' },
    ],
    items: [
      {
        no: 25,
        q: '携帯電話について、「私」はどのように考えているか。',
        opts: ['便利だと言う人もいるが、自分はそう思わないので、今は持つつもりはない。', '便利だと思うが、いつも電話を気にする生活は嫌なので、今は持つつもりはない。', '持っていると便利だし、最近は料金が安くなったので、もう一度持つつもりだ。', '持ちたくはなかったが、ないと不便なので、もう一度持つつもりだ。'],
        a: 1,
        why: 'Kullanışlı olduğunu kendisi de biliyor (1 ✗); her an telefona bağlı olmaktan hoşlanmıyor, “şimdiki hâlim iyi” → yeniden almayacak (3, 4 ✗) → 2.',
      },
    ],
  },
  {
    mondai: 4,
    title: '(3) 温かい飲み物の自動販売機',
    passage: [
      { jp: '日本には飲み物の自動{販売機|はんばいき}がたくさんある。{缶|かん}コーヒーやペットボトルのお茶などは、一台の販売機で温かい物か冷たい物かを選べるので、便利だ。しかし、[[最初のころの自動販売機は、冷たい物しか売ることができなかった]]。', tr: 'Japonya’da çok sayıda içecek otomatı var. Kutu kahve ve pet şişe çay gibi içecekler tek bir makinede sıcak ya da soğuk seçilebiliyor, çok kullanışlı. Ama ilk otomatlar sadece soğuk içecek satabiliyordu.' },
      { jp: 'ある冬の日、高速{道路|どうろ}の{駐車場|ちゅうしゃじょう}で、トラックの運転手たちが自動販売機で買ったジュースを飲んでいた。みんなとても寒そうだったので、[[それを見た飲料会社の社長が、冬には温かい物を飲んでほしいと考えた]]。それから10年近くかけて作られたのが、[今の販売機]なのだそうだ。', tr: 'Bir kış günü otoyol otoparkında kamyon şoförleri otomattan aldıkları meyve suyunu içiyordu. Hepsi çok üşümüş görünüyordu; bunu gören içecek şirketinin başkanı kışın sıcak bir şey içsinler istedi. Sonra 10 yıla yakın uğraşla yapılan şey bugünkü otomatmış.' },
    ],
    items: [
      {
        no: 26,
        q: '今の販売機が作られることになったのは、どうしてか。',
        opts: ['冬に販売機で冷たい物を買って飲んだ飲料会社の社長が、客が気の{毒|どく}だと感じたから', '冷たい物が買える販売機があれば便利だろうと、飲料会社の社長が考えたから', '温かい物が買える販売機が欲しいと、飲料会社の社長が運転手たちに言われたから', '温かい物も買える販売機があれば喜ばれるだろうと、飲料会社の社長が考えたから'],
        a: 3,
        why: 'Başkan kendisi içmedi, şoförleri gördü (1 ✗); soğuk içecek otomatı zaten vardı (2 ✗); kimse ondan istemedi (3 ✗) → kışın sıcak içsinler, sevinirler diye düşündü = 4.',
      },
    ],
  },
  {
    mondai: 4,
    title: '(4) 黒田課長のメモ',
    passage: [
      { jp: '12月2日の朝、パクさんが{出勤|しゅっきん}すると、机の上に{黒田|くろだ}課長からのメモが置いてあった。', tr: '2 Aralık sabahı Park işe gelince masasında müdür Kuroda’dan bir not buldu.' },
      { jp: '先週の新{製品|せいひん}の{企業|きぎょう}向け説明会の報告{資料|しりょう}を見ました。[[内容はわかりやすくていいと思います]]。', tr: 'Geçen haftaki yeni ürünün şirketlere yönelik tanıtımının rapor belgesine baktım. İçerik anlaşılır, iyi bence.' },
      { jp: '明日の午後、[[私が会議に出て、この資料を使って報告する]]ことになりました。[[参加企業のリストも欲しいので、準備しておいてください]]。', tr: 'Yarın öğleden sonra toplantıya ben katılıp bu belgeyle rapor vereceğim. Katılan şirketlerin listesi de lazım, hazırlayın lütfen.' },
      { jp: '明日は、モリムラ工業に寄ってから出勤するので、会社に着くのは[[11時ごろ]]になる予定です。[[それまでにお願いします]]。　12月1日（木）19:30　黒田', tr: 'Yarın Morimura Sanayi’ye uğrayıp geleceğim, şirkete 11 gibi varmayı planlıyorum. O zamana kadar lütfen. — 1 Aralık (prş) 19:30, Kuroda' },
    ],
    items: [
      {
        no: 27,
        q: 'このメモを読んで、パクさんがしなければならないことは何か。',
        opts: ['11時ごろまでに、説明会に参加した企業のリストを準備しておく。', '午後の会議までに、説明会の報告資料をわかりやすく書き直す。', '午後の会議までに報告資料を直し, 会議で説明会について報告する。', '黒田課長がモリムラ工業に行くまでに、説明会の報告資料を完成させる。'],
        a: 0,
        why: 'Rapor zaten iyi (düzeltme yok, 2–4 ✗); rapor veren müdür. Rica: katılımcı şirket listesi, müdür 11’de gelene kadar → 1. Not: “明日” notun yazıldığı 1 Aralık’a göre = 2 Aralık, yani bugün.',
      },
    ],
  },
  {
    mondai: 5,
    title: '(1) 同じ本をまた買ってしまう',
    passage: [
      { jp: '私は本が好きで、よく本を買うのですが、先日[①{失敗|しっぱい}]をしてしまいました。[[家で買ったばかりの本を読んでいたら、前に読んだことがあるような気がしてきたのです]]。もしかしたら持っている本かもしれないと思って{本棚|ほんだな}を{探|さが}してみたら、やっぱりありました。そして、その本を読んだことも思い出したのです。', tr: 'Kitap severim, sık kitap alırım ama geçenlerde bir hata yaptım. Evde yeni aldığım kitabı okurken daha önce okumuşum gibi geldi. Belki zaten bende vardır diye kitaplığa baktım, gerçekten vardı. Okuduğumu da hatırladım.' },
      { jp: '私はたまにこんな失敗をします。[[読んだことがある本なのに、買ったことも内容も忘れているのです]]。', tr: 'Arada bir böyle hata yaparım. Okuduğum bir kitap olduğu hâlde aldığımı da içeriğini de unutmuşum.' },
      { jp: 'それが面白くない本だったときは、つまらない本のために二度もお金を払ったことが{悔|くや}しくなります。でも、面白くて{感動|かんどう}した本だったときには、悔しいだけではなく[②自分が{嫌|いや}になります]。[[いいと思った本のことを忘れてしまった自分が{情|なさ}けないのです]]。', tr: 'Sıkıcı bir kitapsa, sıkıcı bir kitap için iki kez para vermeme hayıflanırım. Ama ilginç, beni duygulandırmış bir kitapsa sadece hayıflanmam, kendimden de nefret ederim. Beğendiğim kitabı unutmuş olmama üzülürüm.' },
      { jp: 'これからも同じようなことをしてしまうかもしれません。[[でも、本を読むのは楽しいので、本屋通いはやめられそうもありません]]。', tr: 'Bundan sonra da benzerini yapabilirim. Ama kitap okumak keyifli olduğundan kitapçıya gitmeyi bırakabileceğimi sanmıyorum.' },
    ],
    items: [
      {
        no: 28,
        q: '①失敗とあるが、どのようなことか。',
        opts: ['買ったばかりの本を本棚に入れたまま、読むのを忘れてしまったこと', '前に読んだことを忘れて、同じ本をまた買ってしまったこと', '持っていない本なのに、本棚にあるはずだと思って探してしまったこと', '初めて読む本なのに、前に読んだことがあると思ってしまったこと'],
        a: 1,
        why: 'Kitap kitaplıkta zaten varmış ve okumuş → aynı kitabı yeniden almış = 2.',
      },
      {
        no: 29,
        q: '②自分が嫌になりますとあるが、それはなぜか。',
        opts: ['前に読んで面白いと思った本なのに、もう一度読んだら、つまらないと感じたから', '前に読んでつまらないと思った本なのに、もう一度読んだら、面白いと感じたから', '一度読んで面白いと思った本なのに、その本のことを覚えていなかったから', '一度読んでつまらないと思った本なのに、二度もお金を払ってしまったから'],
        a: 2,
        why: 'Hemen sonraki cümle: beğendiği kitabı unutmuş olmak → 3. 4 sıkıcı kitapta duyduğu “悔しい” hissi, “自分が嫌” değil.',
      },
      {
        no: 30,
        q: '本を買うことについて、「私」はどう思っているか。',
        opts: ['これからは失敗しないように、よく調べてから本を買うようになるだろう。', '同じ失敗を繰り返さないために、なるべく本屋に通わないようにするだろう。', '本を好きになるために、これからも失敗を気にせずに本屋通いをするだろう。', '失敗することもあるかもしれないが、これからも自分は本を買い続けるだろう。'],
        a: 3,
        why: 'Son paragraf: yine yapabilirim (失敗 olabilir) ama kitapçıya gitmeyi bırakamam → 4. Kitabı zaten seviyor (3 ✗).',
      },
    ],
  },
  {
    mondai: 5,
    title: '(2) 「貸し傘」の町',
    passage: [
      { jp: '{突然|とつぜん}の雨で、{傘|かさ}がなくて困ったり、{慌|あわ}てて傘を買ったのにすぐ晴れてしまった、という経験をした人は多いだろう。[[必要な時だけ傘が借りられたら、どんなに便利だろうか]]。', tr: 'Ani yağmurda şemsiyesiz kalıp zorlanan ya da aceleyle şemsiye alıp hemen havanın açtığını yaşayan çoktur. Sadece gerektiğinde şemsiye ödünç alınabilse ne kadar kullanışlı olurdu.' },
      { jp: '実は、[それ]が可能な町がある。この町は、「{弁当|べんとう}を忘れても傘を忘れるな」という言葉があるように、とても雨が多い。そして、観光客の多い町でもある。傘がなくてもみんなが困らないように、最近、この町のあるグループが「貸し傘」活動を始めた。', tr: 'Aslında bunun mümkün olduğu bir kasaba var. “Bentonu unutsan da şemsiyeni unutma” sözü olacak kadar çok yağmur yağar; turisti de boldur. Şemsiyesi olmayanlar zorlanmasın diye yakın zamanda bir grup “ödünç şemsiye” faaliyeti başlattı.' },
      { jp: 'この傘は、[[観光客でも市民でも無料で自由に利用できる]]。現在、4,500本以上がバス停やスーパー、公共の建物などの「貸し傘」用の傘立てに置いてあって、必要な時はそれを借りることができる。[[返すのは借りたのと同じ傘立てでなくてもいい]]。', tr: 'Bu şemsiyeleri turist de yerli de ücretsiz, serbestçe kullanabilir. Şu an 4.500’den fazlası otobüs durakları, marketler, kamu binalarındaki “ödünç şemsiye” standlarında; gerektiğinde alınabilir. İade, alındığı standla aynı olmak zorunda değil.' },
      { jp: '「貸し傘」を始めたグループでは、[[借りた傘は大切に使い、きちんと返してほしい]]と言っている。また、どこかに置いたままの「貸し傘」を見つけたら[[傘立てに戻すなどの協力もしてほしい]]と呼びかけている。', tr: 'Grup, ödünç şemsiyelerin özenle kullanılıp düzgünce iade edilmesini istiyor. Ayrıca bir yerde bırakılmış ödünç şemsiye görenlerin onu standa geri koyarak yardımcı olmasını rica ediyor.' },
    ],
    items: [
      { no: 31, q: 'それとあるが、何か。', opts: ['突然雨が降った時に、すぐに傘を買うこと', '買っても使わなかった傘を、店に返すこと', '使いたい時にだけ、傘を借りて使うこと', '雨の日に、傘をささずに観光をすること'], a: 2, why: 'それ = hemen önceki cümle: sadece gerektiğinde şemsiye ödünç almak → 3.' },
      { no: 32, q: '「貸し傘」についての説明で、合っているものはどれか。', opts: ['この町に来た観光客だけが利用できる。', '「貸し傘」のグループのメンバーだけが利用できる。', '観光客なら、利用した傘を記念に持ち帰ってもいい。', '利用した後は、「貸し傘」用の傘立てのどれかに返せばいい。'], a: 3, why: 'Turist de yerli de kullanabilir (1, 2 ✗); iade isteniyor (3 ✗); aynı stand olmak zorunda değil → herhangi birine = 4.' },
      { no: 33, q: '「貸し傘」を始めたグループが、利用する人にしてほしいと言っていることは何か。', opts: ['傘を大事に扱い、「貸し傘」の活動がうまくいくように協力してほしい。', '傘をどんどん借りて、「貸し傘」の利用者が増えるように協力してほしい。', '「貸し傘」の傘が不足しないように、不要な傘を集めるのに協力してほしい。', '「貸し傘」の傘が返しやすくなるように、傘立てを増やすことに協力してほしい。'], a: 0, why: 'Özenle kullan, düzgün iade et, bırakılmışı standa koy = işleyişe yardım → 1.' },
    ],
  },
]
