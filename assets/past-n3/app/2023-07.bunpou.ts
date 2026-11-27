import type { ExamSection } from '@/pages/past-n3/types'

/** JLPT N3, Temmuz 2023 — 言語知識（文法）・読解. */
export const BUNPOU: ExamSection[] = [
  {
    id: 'b1',
    part: '文法',
    title: '問題1 · 文法形式の判断',
    how: 'Boşluğun önündeki kelimenin biçimine ve cümlenin anlamına (sebep, karşıtlık, rica, tahmin) bak. Kalıbı biliyorsan şıklara bakmadan tahmin et.',
    groups: [
      {
        items: [
          { no: 1, q: '歌手の{青山|あおやま}ケイは、海外でも人気があり、アジア（　）中心にいろいろな国でコンサートを行っている。', opts: ['が', 'で', 'の', 'を'], a: 3, why: 'Kalıp: 〜を中心に = ~ merkezli/ağırlıklı olarak.' },
          { no: 2, q: '南中学校で、読書の習慣について調査が行われた。調査の結果を見ると、学年が上がる（　）生徒の読書時間が減っていることがわかる。', opts: ['ことから', 'としたら', 'にしたがって', 'のに比べて'], a: 2, why: '〜にしたがって = ~ arttıkça (birlikte değişim). Sınıf yükseldikçe okuma süresi azalıyor.' },
          { no: 3, q: '友達に{誘|さそ}われて、夏休みに二人で海外旅行に行くことになった。海外旅行は今まで家族（　）行ったことがないので、楽しみだ。', opts: ['だけで', 'だけが', 'となら', 'としか'], a: 3, why: '〜としか〜ない = sadece ~ ile. Şimdiye kadar sadece ailemle gittim.' },
          { no: 4, q: '（{不動産屋|ふどうさんや}で）店員「こちらのアパートはいかがですか。駅から歩いて15分なんですが、広くてきれいですよ。」客「ああ、部屋はよさそうなんですが、ちょっと駅から遠いですね。（　）もう少し近いところがいいんですが……。」', opts: ['できれば', '別に', 'せっかく', '確かに'], a: 0, why: 'Kibar istek: できれば = mümkünse.' },
          { no: 5, q: '{散歩|さんぽ}中、急に雨が（　）だしたので、慌てて近くの{喫茶店|きっさてん}に入った。', opts: ['降る', '降り', '降って', '降った'], a: 1, why: 'Vます(kök) + だす = aniden başlamak: 降りだす.' },
          { no: 6, q: '（病院の受付で）受付の人「お名前が（　）、{診察室|しんさつしつ}の前でお待ちください。」', opts: ['呼ぶと', '呼ぶまで', '呼ばれると', '呼ばれるまで'], a: 3, why: 'Adınız çağrılana kadar (edilgen) bekleyin = 呼ばれるまで.' },
          { no: 7, q: '今朝は電車が遅れた（　）、会社に遅刻してしまった。', opts: ['間に', '点で', 'たびに', 'せいで'], a: 3, why: 'Olumsuz sonucun sebebi: 〜せいで (yüzünden).' },
          { no: 8, q: '明日の授業までにテキストを30ページまで（　）のに、まだ全然読んでいない。', opts: ['読んでおいてはいけない', '読んでおかなければならない', '読むことにしてはいけない', '読むことにしなければならない'], a: 1, why: 'Okumuş olmam gerekiyor ama hiç okumadım: 〜ておかなければならないのに.' },
          { no: 9, q: '昨日の夜は風の音が気になって、少しも（　）。', opts: ['眠りたかった', '眠ろうとした', '眠れなかった', '眠らなくなった'], a: 2, why: '少しも + olumsuz: hiç uyuyamadım = 眠れなかった.' },
          { no: 10, q: '私の夢は、いつか自分のケーキ屋を（　）。', opts: ['開くと思う', '開きたいと思う', '開くことだ', '開きたいことだ'], a: 2, why: '私の夢は〜ことだ = hayalim ~ (yapmak)tır. 夢は ile 〜たい birlikte kullanılmaz.' },
          { no: 11, q: '妻「雨、全然（　）ね。今日は出かけるのやめようか。」夫「そうだね。」', opts: ['やまないはずがない', 'やみそうにない', 'やむに違いない', 'やんでもしかたない'], a: 1, why: 'Dinecek gibi değil = やみそうにない → o yüzden çıkmayalım.' },
          { no: 12, q: '（大学で）A「先輩に聞いたんだけど、今度、駅前に新しいカフェが（　）よ。」B「そうなんだ。楽しみだね。」', opts: ['できるらしい', 'できてほしい', 'できることがある', 'できたほうがいい'], a: 0, why: 'Duyulan bilgi (先輩に聞いた) → 〜らしい.' },
          { no: 13, q: '（{美容院|びよういん}で）店員「長さは、このぐらいでいいですか。」客「もう少し短く（　）。」店員「はい、わかりました。」', opts: ['してあげますか', 'なってあげますか', 'してもらえますか', 'なってもらえますか'], a: 2, why: 'Müşteri rica ediyor: 短くしてもらえますか = biraz daha kısaltır mısınız.' },
        ],
      },
    ],
  },
  {
    id: 'b2',
    part: '文法',
    title: '問題2 · 文の組み立て（★）',
    how: 'Parçaları sıraya diz, ★’a gelen parçayı seç. Önce kesin bağlanan ikiliyi bul (〜による + isim, の + isim, 〜のは〜のか).',
    groups: [
      {
        items: [
          { no: 14, q: 'パソコンや{携帯|けいたい}電話の ＿＿ ★ ＿＿ ＿＿ 原因で、頭が痛くなることもあるそうだ。', opts: ['が', 'による', '見すぎ', '目の疲れ'], a: 1, why: 'Sıra: [見すぎ][による][目の疲れ][が]原因で — aşırı bakmaktan kaynaklanan göz yorgunluğu yüzünden. 〜による + isim = ~den kaynaklanan. ★ = による.' },
          { no: 15, q: '私は子供の時、ピアノを習っていたが、3年でやめてしまった。何回 ＿＿ ＿＿ ★ ＿＿ 嫌になってしまったのだ。', opts: ['上手に弾けない', '練習しても', 'なかなか', '曲があって'], a: 0, why: 'Sıra: [練習しても][なかなか][上手に弾けない][曲があって] — ne kadar çalışsam da bir türlü çalamadığım parça vardı. ★ = 上手に弾けない.' },
          { no: 16, q: '失敗をすることは誰にでもある。大切な ＿＿ ＿＿ ★ ＿＿ 考えて、同じ失敗を繰り返さないようにすることだ。', opts: ['失敗をしてしまった', 'どうして', 'のか', 'のは'], a: 0, why: 'Sıra: [のは][どうして][失敗をしてしまった][のか] — önemli olan neden hata yaptığını düşünmek. ★ = 失敗をしてしまった.' },
          { no: 17, q: '（教室で）南「{西川|にしかわ}さんの誕生日に、何かプレゼントをあげない？」森「いいね。スポーツが好きだと言っていた ＿＿ ＿＿ ★ ＿＿？」', opts: ['いいんじゃない', 'から', 'とか', 'タオル'], a: 2, why: 'Sıra: [から][タオル][とか][いいんじゃない] — sporu sevdiğini söylediğine göre havlu falan iyi olmaz mı? ★ = とか.' },
          { no: 18, q: '（{講演会|こうえんかい}で）司会者「本日は、鳥の ＿＿ ＿＿ ★ ＿＿ 見ることができる様々な鳥について、お話をしていただきます。」', opts: ['専門家で', '都会で', 'いらっしゃる', '山下花子先生に'], a: 3, why: 'Sıra: [専門家で][いらっしゃる][山下花子先生に][都会で] — kuş uzmanı olan Yamashita hocadan, şehirde görülebilen kuşları dinleyeceğiz. ★ = 山下花子先生に.' },
        ],
      },
    ],
  },
  {
    id: 'b3',
    part: '文法',
    title: '問題3 · 文章の文法',
    how: 'Metindeki boşluklar. Önceki ve sonraki cümleyle ilişkiye bak: karşıtlık (でも), edilgen (書かれていた), gönderme (そこ, その).',
    groups: [
      {
        title: '仲間からのメッセージ',
        passage: [
          { jp: '日本に来てから2年間、私は大学の近くのレストランでアルバイトをしていました。店の人はみんな親切で、仕事で使う日本語がわからなくて私が困っていると、いつも優しく教えてくれました。大変なときもありましたが、みんなが助けてくれたので、続けることができました。', tr: 'Japonya’ya geldiğimden beri 2 yıl üniversitenin yakınındaki bir restoranda çalıştım. Herkes nazikti; iş Japoncasını anlamayıp zorlanınca hep yardımla öğrettiler. Zor zamanlar oldu ama herkes yardım ettiği için devam edebildim.' },
          { jp: '[19] 今学期から勉強が忙しくなって、先月アルバイトを辞めました。アルバイトの最終日に、店長から大きなカードをもらいました。店長は、店の仲間全員がメッセージを書いたと教えてくれました。カードに [20] のは、たくさんの感謝の言葉や応援の言葉でした。私はうれしくて、カードのメッセージを読みながら泣いてしまいました。', tr: 'Ama bu dönem derslerim yoğunlaşınca geçen ay işi bıraktım. Son gün müdürden büyük bir kart aldım; dükkandaki herkesin mesaj yazdığını söyledi. Kartta yazanlar bir sürü teşekkür ve destek sözüydü. Sevinçten mesajları okurken ağladım.' },
          { jp: 'もらったカードは部屋に飾って、[21] に行く前に必ず見ています。頑張って働いた2年間が目に見えるものになった感じがして、カードを見ると、元気が出ます。どんなに勉強が大変になっても、[22]。', tr: 'Kartı odama astım, okula gitmeden önce mutlaka bakıyorum. Çalıştığım 2 yıl gözle görülür bir şeye dönüşmüş gibi; karta bakınca enerji geliyor. Çünkü ders ne kadar zorlaşsa da çabalayabiliyorum.' },
        ],
        items: [
          { no: 19, q: '[19]', opts: ['でも', 'だから', 'すると', 'そのうえ'], a: 0, why: 'Önce “devam edebildim”, sonra “ama bıraktım” → karşıtlık: でも.' },
          { no: 20, q: '[20]', opts: ['書いておいた', '書きたかった', '書かれていた', '書いてほしかった'], a: 2, why: 'Kartta yazılı olanlar (başkaları yazdı) → edilgen: 書かれていた.' },
          { no: 21, q: '[21]', opts: ['そこ', '大学', 'その大学', 'そういうところ'], a: 1, why: 'Öğrenci her gün okula gidiyor: 大学に行く前に. そこ/その neyi gösterdiği belirsiz.' },
          { no: 22, q: '[22]', opts: ['頑張っているのです', '頑張ることができるからです', '頑張っているみたいです', '頑張ることができそうです'], a: 1, why: 'Karta bakınca enerji geliyor — neden? Çünkü (〜からです) ne olursa olsun çabalayabiliyorum.' },
        ],
      },
    ],
  },
  {
    id: 'r4',
    part: '読解',
    title: '問題4 · 内容理解（短文）',
    how: 'Kısa metin, tek soru. Önce soruyu oku. İlanlarda “〜の方は / ※” satırları, düşünce yazılarında son cümle cevaptır.',
    groups: [
      {
        title: '(1) 岩中村夏祭りのご案内',
        passage: [
          { jp: 'これは、あるホテルにチェックインした人が、フロントでもらったちらしである。', tr: 'Bu, bir otele giriş yapan kişinin resepsiyondan aldığı el ilanıdır.' },
          { jp: '8月11日・12日にホテル{岩中|いわなか}にお泊まりのお客様　「岩中村夏祭り」のご案内', tr: '11–12 Ağustos’ta Otel Iwanaka’da kalan misafirlerimize · “Iwanaka Köyü Yaz Festivali” duyurusu' },
          { jp: '8月11日（土）・12日（日）に、岩中公園で夏祭りが行われます。会場とホテルの間は、ホテルのバスのご利用が可能です（約5分）。', tr: '11 (cmt) ve 12 (paz) Ağustos’ta Iwanaka Parkı’nda yaz festivali var. Festival alanı ile otel arasında otel otobüsü kullanılabilir (yaklaşık 5 dk).' },
          { jp: '{浴衣|ゆかた}を着ている方は、会場内のどの店もドリンクが1杯無料になります。皆様も、浴衣を着て出かけてみてはいかがでしょうか。', tr: 'Yukata giyenlere festival alanındaki her dükkânda bir içecek bedava. Siz de yukata giyip çıkmaya ne dersiniz?' },
          { jp: '[[ホテルでは、お好きな浴衣と{帯|おび}を特別料金【1日2000円】でお貸しします]]（浴衣の着方がわからない方は、お手伝いいたします）。ご希望の方は、フロントでお申し込みください。', tr: 'Otelde istediğiniz yukata ve kuşağı özel fiyatla (günlük 2000 yen) kiralıyoruz (giymeyi bilmeyenlere yardım ediyoruz). İsteyenler resepsiyona başvursun.' },
        ],
        items: [
          { no: 23, q: '夏祭りの日にホテル岩中に泊まっている人が、ホテルから受けられるサービスとして合っているのはどれか。', opts: ['浴衣を着れば、夏祭り会場まで、ホテルのバスが利用できる', 'ホテルのレストランで、ドリンクが1杯無料で飲める', 'ホテルから、好きな浴衣と帯が特別料金で借りられる', '浴衣と帯の料金のほかに2000円払えば、ホテルの人に着るのを手伝ってもらえる'], a: 2, why: 'Otobüs herkese (yukata şartı yok) ✗; bedava içecek festival dükkânlarında, otelde değil ✗; giyim yardımı ücretsiz ✗ → 3.' },
        ],
      },
      {
        title: '(2) 子供のころの夢',
        passage: [
          { jp: '先月、留学していたアメリカから帰国した。そして、知り合いに頼まれ、4月から大学で数学を教えることになった。働き始める前に、実家の部屋を整理しようと思って掃除をしていたら、小学生のときに書いた「私の夢」という作文が出てきた。[[そこには、先生になりたいと書いてあった。そんなことはすっかり忘れていた]]が、小さいときにそう書いていたのだ。とても驚いたが、子供のころの夢が本当になったのだし、[頑張ろう]と思う。', tr: 'Geçen ay okuduğum Amerika’dan döndüm. Bir tanıdığın ricasıyla nisandan itibaren üniversitede matematik öğreteceğim. Başlamadan önce baba evindeki odamı toplarken ilkokulda yazdığım “Hayalim” kompozisyonu çıktı. Orada öğretmen olmak istediğimi yazmışım. Bunu tamamen unutmuştum ama küçükken öyle yazmışım. Çok şaşırdım; çocukluk hayalim gerçek oldu, çabalayacağım.' },
        ],
        items: [
          { no: 24, q: '頑張ろうとあるが、どうしてそう思ったのか。', opts: ['自分でも忘れていた、アメリカに留学したいという夢が本当になったから', '自分でも忘れていた、先生になりたいという夢が本当になったから', '子供のころからずっと行きたいと思い続けていたアメリカに留学できたから', '子供のころからずっとなりたいと思い続けていた先生になれたから'], a: 1, why: 'Hayal “öğretmen olmak” ve “tamamen unutmuştum” → 2. 4’teki “hep istemiştim” yanlış: unutmuştu.' },
        ],
      },
      {
        title: '(3) 日本語学校からのメール',
        passage: [
          { jp: 'これはある日本語学校から学生に届いたメールである。学校がもらった{招待券|しょうたいけん}の試合は今週末です。日時：2月27日（土）　開場：13時　試合開始：14時　場所：春山公園野球場', tr: 'Bir dil okulundan öğrencilere gelen e-posta. Okulun aldığı davetiyelerin maçı bu hafta sonu. 27 Şubat (cmt), kapılar 13:00, maç 14:00, Haruyama Parkı beyzbol sahası.' },
          { jp: '[[まだ招待券を受け取っていない人は、26日（金）までに事務室に取りに来てください。]]', tr: 'Davetiyesini almamış olanlar 26’sına (cuma) kadar ofise gelip alsın.' },
          { jp: '自分だけで行くのが不安だと言う人がいたので、{中川|なかがわ}先生が一緒に行くことになりました。一緒に行きたい人は、12時に学校に集合してください。その場合、招待券は当日、中川先生からもらってもいいです。', tr: 'Tek gitmekten çekinenler olduğu için Nakagawa hoca birlikte gidecek. Birlikte gitmek isteyenler 12’de okulda toplansın; bu durumda davetiyeyi o gün hocadan alabilirler.' },
          { jp: '[[自分で行く人は、学校にも野球場にも集合する必要はありません。]]寒いですから、暖かい服装で行きましょう。', tr: 'Kendi gidenlerin ne okulda ne sahada toplanmasına gerek yok. Hava soğuk, kalın giyinin.' },
        ],
        items: [
          { no: 25, q: 'このメールによると、自分で野球場に行こうと思っている学生が、必ずしなければならないことは何か。', opts: ['26日までに学校で招待券を受け取っておく', '26日までに学校で招待券を受け取って、当日、13時に野球場の前に集合する', '当日、12時に学校に行って、招待券を中川先生から受け取る', '当日、13時に野球場に行って、招待券を中川先生から受け取る'], a: 0, why: 'Kendi giden toplanmaz (2 ✗); hocadan almak sadece birlikte gidenlere (3, 4 ✗) → davetiyeyi 26’sına kadar al = 1.' },
        ],
      },
      {
        title: '(4) 鏡を見る魚',
        passage: [
          { jp: '面白い実験を行った研究者がいる。その実験では、ある魚の顔に汚れをつけて{鏡|かがみ}を見せた。すると、その魚は砂で汚れを落とすような動きをしてから、また鏡を見た。[[これは、自分の顔についた汚れを落とし、その後、汚れが消えたかどうかを確認する動作なのだそうだ]]。', tr: 'İlginç bir deney yapan bir araştırmacı var. Bir balığın yüzüne leke sürüp ona ayna göstermiş. Balık kumla lekeyi temizler gibi hareket edip yeniden aynaya bakmış. Bu, yüzündeki lekeyi temizleyip sonra gidip gitmediğini kontrol etme hareketiymiş.' },
          { jp: '鏡の中にいる自分を見て、それが自分自身だとわかるのは、サルなどの頭のいい動物だけだと考えられていた。しかし、魚にもそれができるものがいるのだと、この研究者は言っている。', tr: 'Aynadaki kendini görüp onun kendisi olduğunu anlayabilen yalnızca maymun gibi zeki hayvanlar sanılıyordu. Ama araştırmacı balıklarda da bunu yapabilenler olduğunu söylüyor.' },
        ],
        items: [
          { no: 26, q: 'この実験から、魚の中には、どのようなものがいることがわかったか。', opts: ['鏡を見て、自分に汚れをつけるものがいる', '鏡の中の魚が自分だとわかるものがいる', '鏡に気づくと、すぐに鏡の前に行きたがるものがいる', '鏡が汚れていたら、きれいにしようとするものがいる'], a: 1, why: 'Sonuç cümlesi: aynadakinin kendisi olduğunu anlayan balık var → 2.' },
        ],
      },
    ],
  },
  {
    id: 'r5',
    part: '読解',
    title: '問題5 · 内容理解（中文）',
    how: 'Orta metin, 3 soru. Numaralı altı çizili ifadenin hemen öncesi/sonrası cevaptır; son soru (テーマ) metnin son paragrafındadır.',
    groups: [
      {
        title: '(1) 車を売った私',
        passage: [
          { jp: '最近、私と同じ70歳の友人が、自宅の車庫の壁に車をぶつけてしまったそうだ。私は運転に自信があったが、[[その話を聞いて、安全に運転が続けられるか不安になってきた]]。それで、[①運転をやめることにして]、車を売った。', tr: 'Son zamanlarda benimle aynı yaşta (70) bir arkadaşım arabasını evinin garaj duvarına çarpmış. Sürüşüme güvenirdim ama bunu duyunca güvenle sürmeye devam edebilir miyim diye endişelendim. Bu yüzden araba sürmeyi bırakmaya karar verip arabayı sattım.' },
          { jp: 'ただ、一つ[②困ったこと]があった。私は妻と二人で丘の上の家に住んでいる。毎日の買い物はこれまでと変わらず、二人で坂の下のスーパーまで行く。初めは、運動にもなるし、スーパーまで歩けばいいと考えていた。[[しかし、車を使わず荷物を持って坂を上がって帰るのは、思ったより大変だったのだ]]。', tr: 'Ama bir sorun vardı. Eşimle tepedeki bir evde yaşıyoruz. Günlük alışverişe eskisi gibi ikimiz yokuşun altındaki markete gidiyoruz. Başta hem egzersiz olur, yürürüz diye düşünmüştüm. Ama arabasız, eşyalarla yokuşu çıkıp dönmek sandığımdan çok zordu.' },
          { jp: '引っ越そうかと話すようになったとき、近所にスーパーの車がとまっているのを見た。インターネット注文すると、店の商品は何でも届けてくれるそうだ。直接見て選べないので不安もあったが、まずは、肉と野菜を注文してみた。', tr: 'Taşınalım mı diye konuşmaya başladığımızda mahallede marketin aracını gördük. İnternetten sipariş edince her ürünü getiriyorlarmış. Görüp seçemediğim için endişelendim ama önce et ve sebze sipariş ettim.' },
          { jp: '[[翌日届いた品物はどれもとても良かった]]。配達料はかかるが、便利さのほうが重要だ。いい方法が見つかった。[[これで引っ越しをしなくてもよさそうである]]。', tr: 'Ertesi gün gelen ürünlerin hepsi çok iyiydi. Teslimat ücreti var ama kolaylık daha önemli. İyi bir yol bulduk. Artık taşınmamıza gerek yok gibi.' },
        ],
        items: [
          { no: 27, q: '①運転をやめることにしてとあるが、それはなぜか。', opts: ['運転に自信があったのに、車をぶつけてしまったから', '自分も安全に運転が続けられるか心配になったから', '若いころから自分の運転技術に不安があったから', '車の運転をやめたほうがいいと妻に言われたから'], a: 1, why: 'Çarpan arkadaşıydı, kendisi değil (1 ✗). Duyunca kendisi de endişelendi → 2.' },
          { no: 28, q: '②困ったこととあるが、どんなことか。', opts: ['毎日、妻と二人でスーパーに買い物に行かなければならなくなったこと', '今までより遠くのスーパーまで、買い物に行かなければならなくなったこと', 'スーパーに行くとき、ついでにしていた運動ができなくなり、運動不足になったこと', 'スーパーで買った物を歩いて持って帰ってくるのが、予想ほど楽ではなかったこと'], a: 3, why: 'Eşyalarla yokuşu yürüyerek çıkmak sandığından zordu → 4. Market aynı market (2 ✗).' },
          { no: 29, q: 'スーパーのサービスを利用して、「私」は今、引っ越しについてどう考えているか。', opts: ['買った商品を持って帰るのが大変なので、スーパーの近くに引っ越したほうがいいかもしれない', '買った商品を届けてもらうと配達料がかかるので、スーパーの近くに引っ越したほうがいいかもしれない', '届けてもらった商品に満足したし、今後はこのサービスを利用すれば、引っ越す必要はないだろう', '届けてもらった商品の中には満足できないものもあったが、このサービスを利用すれば、引っ越す必要はないだろう'], a: 2, why: 'Ürünlerin hepsi iyiydi + taşınmaya gerek yok → 3. 4’teki “memnun olmadıklarım da vardı” yanlış.' },
        ],
      },
      {
        title: '(2) 子供連れで楽しめる場所',
        passage: [
          { jp: '日本では、音楽を聞きに行ったり、絵や映画を見に行ったりすることが好きな人でも、子供が小さいうちは、[①行くのを我慢してしまうことがあります]。[[子供は、騒いでしまう心配があるので連れて行けないし、人に預けることも簡単ではないからです]]。', tr: 'Japonya’da konsere, sergiye ya da sinemaya gitmeyi seven insanlar bile çocukları küçükken gitmekten vazgeçebiliyor. Çünkü çocuğu gürültü yapar diye götüremiyorlar, birine bırakmak da kolay değil.' },
          { jp: 'しかし、最近は少しずつですが、子供を預かってくれる音楽会場や美術館、映画館などが増えてきました。また、[②親子が一緒に楽しめるように工夫をする]ところも出てきています。例えば、ある映画館では、[[映画の間も会場を少し明るくしておくそうです。暗いと、怖がって泣いてしまう子供がいるからです。大きな音を聞くと、びっくりする子供もいるので、音も大きすぎないようにしてあります]]。', tr: 'Ama son zamanlarda yavaş yavaş çocuğa bakan konser salonları, müzeler, sinemalar arttı. Ayrıca ebeveyn ve çocuğun birlikte keyif alabilmesi için düzenlemeler yapan yerler de çıkıyor. Örneğin bir sinema film sırasında salonu biraz aydınlık tutuyormuş; karanlıkta korkup ağlayan çocuklar olduğu için. Yüksek seste irkilen çocuklar da olduğundan sesi de çok yüksek tutmuyorlar.' },
          { jp: '[[このように、最近は、小さな子供がいる人が安心して、出かけて楽しめる場所が増えてきています]]。', tr: 'Böylece son zamanlarda küçük çocuğu olanların gönül rahatlığıyla gidip keyif alabileceği yerler artıyor.' },
        ],
        items: [
          { no: 30, q: '①行くのを我慢してしまうことがありますとあるが、どうしてか。', opts: ['音楽や絵や映画などを楽しめる場所が、近くにないことが多いから', '子供の世話をするのに忙しくて、時間がないから', '子供を連れて行くのも、親だけで出かけるのも難しいから', '大人だけでなく、子供の料金も払わなければならないから'], a: 2, why: 'Götüremiyor (gürültü) + bırakamıyor (預ける zor) → ikisi de zor = 3.' },
          { no: 31, q: '②親子が一緒に楽しめるように工夫をするとあるが、どのようなことをしている映画館があると言っているか。', opts: ['子供と親が話しながら映画が見られる特別な席を用意する', '子供が騒ぐ音が気にならないように、映画の音を大きくする', '子供にも大人にも楽しんで見てもらえるような映画を選ぶ', '子供が怖がったり驚いたりしないような明るさや音量にする'], a: 3, why: 'Salon biraz aydınlık + ses çok yüksek değil → 4. 2 tam tersi.' },
          { no: 32, q: 'この文章のテーマは何か。', opts: ['日本で、子供がいる親も音楽や映画を楽しめる環境ができてきたこと', '日本で、大人と子供が一緒に楽しめる音楽や映画が減ってきたこと', '日本で、大人だけで音楽会や映画に出かける親が増えてきたこと', '日本で、音楽や映画を楽しむ子供が増えてきたこと'], a: 0, why: 'Son paragraf: küçük çocuğu olanların keyif alabileceği yerler artıyor → 1.' },
        ],
      },
    ],
  },
  {
    id: 'r6',
    part: '読解',
    title: '問題6 · 内容理解（長文）',
    how: 'Uzun metin, 4 soru, numaralı altı çizili yerler. そんなこと／このような gibi gösterme sözcükleri hep hemen önceki cümleyi gösterir.',
    groups: [
      {
        title: 'お年寄りのための靴',
        passage: [
          { jp: '1年に2万通も感謝の手紙がくる会社がある。四国にある[①靴の会社]だ。初めはスリッパを作っていたのだが、約25年前、[[お年寄りのための介護施設の経営者から、こんな相談をされた]]。', tr: 'Yılda tam 20.000 teşekkür mektubu alan bir şirket var: Şikoku’daki bir ayakkabı şirketi. Başta terlik yapıyordu; yaklaşık 25 yıl önce yaşlı bakım evinin işletmecisi şu konuda danıştı.' },
          { jp: '「施設内でお年寄りがよく転ぶので、困っているんです。いろいろ工夫しても解決できません。靴に問題がありそうなんです。」', tr: '“Tesiste yaşlılar sık düşüyor, çok zor durumdayız. Ne yaptıysak çözemedik. Sorun ayakkabılarda gibi.”' },
          { jp: 'それで、お年寄りのための安全な靴を作ることにしたそうだ。社長はまず、約500人のお年寄りの足を観察して、歩き方を調査することにした。そうして作った靴を履いてもらい、意見を聞きながら悪いところを直していった。2年後、「お年寄りのための靴」が完成したが、初めはあまり売れなかった。', tr: 'Bunun üzerine yaşlılar için güvenli ayakkabı yapmaya karar vermişler. Başkan önce 500 kadar yaşlının ayağını gözlemleyip yürüyüşlerini incelemiş. Yaptıkları ayakkabıları giydirip görüş alarak kusurları düzeltmişler. 2 yıl sonra “yaşlılar için ayakkabı” tamamlandı ama başta pek satmadı.' },
          { jp: 'そこで、[②調査結果をもう一度確認することにした]。すると、あることがわかった。[[お年寄りの中には年をとって片方の足だけが悪くなったり、足の形が変わってしまい左右の足の大きさが違ってきたりして、困っている人が少なくない]]。左右のセットではなく、片方の靴だけが必要な人もいるのだ。そこで、「お年寄りのための靴」を片方でも買えるようにした。', tr: 'Bunun üzerine anket sonuçlarını yeniden incelediler ve bir şey fark ettiler: yaşlılar arasında yalnızca bir ayağı kötüleşen ya da ayak şekli değişip sağ-sol ayak boyu farklılaşan pek çok kişi var. Çift değil, tek ayakkabı isteyen de var. Bu yüzden ayakkabıyı tek tek de satılır yaptılar.' },
          { jp: '靴の会社を経営しているある先輩からは、[③そんなこと]をしたら経営がうまくいかなくなると反対されたが、社長はこの新しい販売方法を実行した。[[困っている人の問題を解決するためにいいものを作り]]、今までその靴の売り方とは全く違った売り方で、それが必要な人のところに届けようとしたのである。', tr: 'Ayakkabı şirketi işleten bir büyüğü “Öyle yaparsan işler bozulur” diye karşı çıktı ama başkan bu yeni satış yöntemini uyguladı. Zor durumdakilerin sorununu çözmek için iyi bir şey yaptı ve bunu, alışılmışın tamamen dışında bir satış yoluyla ihtiyacı olanlara ulaştırmaya çalıştı.' },
          { jp: '今では、この靴は1年に100万足以上も売れている。2万通も感謝の手紙がくるのは、[④このような会社]の姿勢があるからではないだろうか。', tr: 'Bugün bu ayakkabı yılda 1 milyondan fazla satıyor. 20.000 teşekkür mektubunun sebebi, böyle bir şirket anlayışı olsa gerek.' },
        ],
        items: [
          { no: 33, q: '①靴の会社は、どうしてお年寄りのための靴を作ることにしたか。', opts: ['お年寄りから、いい靴を作ってほしいという手紙がたくさんきたから', 'お年寄りが室内でスリッパを履かなくなり、靴を履くようになったから', 'お年寄りのための介護施設の経営者から、靴について相談されたから', 'お年寄りの歩き方を調査して、靴の問題点を見つけたから'], a: 2, why: 'Başlangıç: bakım evi işletmecisinin danışması → 3. Mektuplar sonradan geldi.' },
          { no: 34, q: '②調査結果をもう一度確認することにしたとあるが、その結果、例えばどんなことがわかったか。', opts: ['お年寄りには、転びやすい人がいること', 'お年寄りには、靴の値段が高いと思っている人がいること', 'お年寄りになると、靴を履く機会が減る人がいること', 'お年寄りになると、右と左で足の形が変わる人がいること'], a: 3, why: 'Sağ-sol ayak boyu/şekli farklılaşan kişiler → 4.' },
          { no: 35, q: '③そんなこととあるが、それは何か。', opts: ['調査にお金をかけること', '左右の大きさが同じ靴だけを売ること', '「お年寄りのための靴」だけを作ること', '片方ずつでも靴を売ること'], a: 3, why: 'Hemen önceki cümle: tek ayakkabı satmak → 4.' },
          { no: 36, q: '④このような会社とあるが、どのようなものか。', opts: ['困っている人のことを一生懸命に考えて、商品を作って売ること', '自分の会社の商品の良さを信じて、売れなくても商品を売り続けること', '人がしないことを探して、周りの人に反対されても実行すること', '客のことをよくわかっている社員だけで、いいものを作り続けること'], a: 0, why: 'Zor durumdakilerin sorununu çözmek için ürün yapıp ihtiyacı olana ulaştırmak → 1.' },
        ],
      },
    ],
  },
  {
    id: 'r7',
    part: '読解',
    title: '問題7 · 情報検索',
    how: 'İlanı baştan okuma: sorudaki koşulları (tatil dönemi, hafta içi, öğrenci, cumartesi) yaz ve sadece ilgili satırları bul. ※ notları hep bir sorunun anahtarıdır.',
    groups: [
      {
        title: '丸川大学 · 食堂・カフェのご案内',
        passage: [
          { jp: '①丸川食堂（300席）平日11時〜15時／土・日11時〜14時　大きくて、メニューが多い食堂です', tr: '① Marukawa Yemekhanesi (300): hafta içi 11–15, hafta sonu 11–14. Büyük, menüsü geniş.' },
          { jp: '②朝花食堂（100席）平日8時〜15時／土・日8時〜14時　大学でいちばん新しい食堂です', tr: '② Asahana Yemekhanesi (100): hafta içi 8–15, hafta sonu 8–14. Üniversitenin en yeni yemekhanesi.' },
          { jp: '③カフェ南川（60席）平日8時〜19時／土・日8時〜14時　南川カレーが人気です', tr: '③ Kafe Minamikawa (60): hafta içi 8–19, hafta sonu 8–14. Minamikawa körisi popüler.' },
          { jp: '④花丸食堂（50席）平日11時〜20時／土・日11時〜14時　[[教師や大学で働く関係者のための食堂です。学生は利用できません。]]', tr: '④ Hanamaru Yemekhanesi (50): hafta içi 11–20, hafta sonu 11–14. Öğretmenler ve çalışanlar için; öğrenciler kullanamaz.' },
          { jp: '[[※大学の休暇期間中の営業について　①と②は休み、③と④は平日の11時〜14時に営業します。]]', tr: '※ Tatil döneminde: ① ve ② kapalı; ③ ve ④ hafta içi 11–14 açık.' },
          { jp: '【パーティーについて】丸川大学の学生や関係者の皆様は、食堂・カフェの営業がない日や時間にパーティーを開くことができます。※①〜③は学生が申し込めますが、④は教師か事務所の人の申し込みが必要です。', tr: '[Parti] Öğrenciler ve çalışanlar, yemekhane/kafenin açık olmadığı gün ve saatlerde parti yapabilir. ※ ①–③’e öğrenci başvurabilir; ④ için öğretmen ya da ofis personeli başvurmalı.' },
          { jp: '料理について ◆メニューは相談して決められます。[[◆①〜③では一人2000円以上（土曜、日曜、祝日は、2500円以上）]]、④では一人4000円以上の注文で予約受付をします。', tr: 'Yemek: menü görüşülerek belirlenir. ①–③’te kişi başı 2000 yen ve üstü (cumartesi, pazar, tatil günleri 2500 ve üstü), ④’te kişi başı 4000 ve üstü siparişle rezervasyon alınır.' },
          { jp: '人数 ◆①は18人、②は40人、③④は20人から予約受付をします。◆最大の人数は、各食堂・カフェの席の数と同じです。', tr: 'Kişi sayısı: ① 18’den, ② 40’tan, ③④ 20’den itibaren rezervasyon. En fazla kişi sayısı koltuk sayısı kadar.' },
          { jp: '時間 ◆①〜③は20時まで、④は21時までに終えてください。◆営業がある日は、各営業終了時間の1時間後からパーティーに利用できます。予約・連絡先 ◆パーティー係　野中（190-234-5678）', tr: 'Saat: ①–③ 20:00’ye, ④ 21:00’e kadar bitmeli. Açık olan günlerde kapanıştan 1 saat sonra parti yapılabilir. İletişim: parti sorumlusu Nonaka.' },
        ],
        items: [
          { no: 37, q: '今日は大学の休暇期間中の平日である。テイムさんは、13時に大学の食堂かカフェで食事をしようと考えている。学生のテイムさんが行ける食堂・カフェはどれか。', opts: ['①と②と③', '①と②', '③と④', '③'], a: 3, why: 'Tatilde ① ② kapalı; ③ ④ açık (11–14, 13:00 uygun) ama ④ öğrencilere kapalı → sadece ③.' },
          { no: 38, q: '丸川大学の学生のオウさんは、10月23日（土）に②の食堂でクラスのパーティーを開きたいと考えている。10月23日に②の食堂がパーティーに利用できることは確認できたが、そのほかに気をつけなければならないこととして、合っているのはどれか。', opts: ['学生が申し込みをすることはできない', '料理は、一人2500円以上注文しなければならない', '予約できる最少の人数は、20人である', 'パーティーは、21時までに終える必要がある'], a: 1, why: 'Öğrenci ②’ye başvurabilir (1 ✗); cumartesi → kişi başı 2500+ ✓; ② için en az 40 kişi (3 ✗); ① –③ 20:00’de biter (4 ✗).' },
        ],
      },
    ],
  },
]
