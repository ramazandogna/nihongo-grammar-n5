import type { ExamSection } from '@/pages/past-n3/types'

/** JLPT N3, Temmuz 2023 — 言語知識（文字・語彙）. */
export const MOJI: ExamSection[] = [
  {
    id: 'm1',
    part: '文字・語彙',
    title: '問題1 · 漢字読み',
    how: 'Altı çizili kanjinin okunuşunu seç. Uzun/kısa ses (ふう ↔ ふ), ゛ ve benzer kelimelere dikkat. Kelimeyi parçalarına ayır: 復 (tekrar) = ふく, 習 = しゅう → ふくしゅう.',
    groups: [
      {
        items: [
          { no: 1, q: '毎日[復習]したので、よくできるようになった。', opts: ['ふうしゅう', 'れんしゅう', 'ふくしゅう', 'れいしゅう'], a: 2, why: '復習 ふくしゅう = tekrar çalışma. 練習 れんしゅう ile karıştırma (kanji farklı).' },
          { no: 2, q: '[小型]のラジオが欲しいです。', opts: ['こかた', 'しょうがた', 'こがた', 'しょうかた'], a: 2, why: '小型 こがた = küçük boy. 型 kelime içinde がた olur (大型 おおがた).' },
          { no: 3, q: '理由もないのに、人を[疑って]はいけない。', opts: ['きらって', 'こわがって', 'しかって', 'うたがって'], a: 3, why: '疑う うたがう = şüphelenmek. 嫌う sevmemek · 怖がる korkmak · 叱る azarlamak.' },
          { no: 4, q: 'ここから先は道が[細く]なっている。', opts: ['ひろく', 'ふとく', 'せまく', 'ほそく'], a: 3, why: '細い ほそい = ince/dar (yol). 広い geniş · 太い kalın · 狭い dar (せまい) ama kanjisi 狭.' },
          { no: 5, q: '{川井|かわい}さんは明日、[退院]するそうです。', opts: ['たいいん', 'たんいん', 'だいいん', 'だんいん'], a: 0, why: '退院 たいいん = hastaneden taburcu olmak. Karşıtı 入院 にゅういん.' },
          { no: 6, q: 'パーティーには[夫婦]で参加します。', opts: ['ふうふう', 'ふうふ', 'ふふう', 'ふふ'], a: 1, why: '夫婦 ふうふ = karı-koca: 夫 burada uzun ふう, 婦 kısa ふ.' },
          { no: 7, q: '[留守]の間に誰か来たようだ。', opts: ['るしゅ', 'るす', 'りゅうす', 'りゅうしゅ'], a: 1, why: '留守 るす = evde olmamak. 留 burada る (留学 りゅうがく’dan farklı!).' },
          { no: 8, q: 'これは、とても[高価]な{花瓶|かびん}だそうです。', opts: ['こうか', 'ごうか', 'こうが', 'ごうが'], a: 0, why: '高価 こうか = pahalı, değerli. 豪華 ごうか = lüks (başka kelime).' },
        ],
      },
    ],
  },
  {
    id: 'm2',
    part: '文字・語彙',
    title: '問題2 · 表記',
    how: 'Hiragana kelimenin doğru kanjisi. Anlamı bul, o anlamı taşıyan kanjiyi seç; aynı okunan kanjiler (心配／信配, 制服／清服) tuzaktır.',
    groups: [
      {
        items: [
          { no: 9, q: '彼は[たんき]だ。', opts: ['男気', '単気', '短気', '断気'], a: 2, why: '短気 たんき = sabırsız, çabuk sinirlenen: 短 (kısa) + 気 (sabır/ruh).' },
          { no: 10, q: '{上田|うえだ}さんは少し[しんぱい]しているようだ。', opts: ['心酔', '心配', '信配', '信酔'], a: 1, why: '心配 しんぱい = endişe.' },
          { no: 11, q: '次はこれを[やいて]ください。', opts: ['焼いて', '燃いて', '煙いて', '炊いて'], a: 0, why: '焼く やく = pişirmek/ızgara. 燃える yanmak · 煙 duman · 炊く (pirinç) pişirmek ama たく okunur.' },
          { no: 12, q: '明日、[かならず]来てください。', opts: ['確ず', '要ず', '必ず', '直ず'], a: 2, why: '必ず かならず = mutlaka.' },
          { no: 13, q: '私の学校は[せいふく]がありません。', opts: ['清衣', '制衣', '清服', '制服'], a: 3, why: '制服 せいふく = üniforma: 制 (kural) + 服 (giysi).' },
          { no: 14, q: '探していた[やっきょく]が、やっと見つかりました。', opts: ['薬局', '薬曲', '楽局', '楽曲'], a: 0, why: '薬局 やっきょく = eczane. 薬 (ilaç) ↔ 楽 (eğlence) tuzağına dikkat.' },
        ],
      },
    ],
  },
  {
    id: 'm3',
    part: '文字・語彙',
    title: '問題3 · 文脈規定',
    how: 'Boşluğa anlamca uyan kelime. Cümlenin önünü ve arkasını oku; kalıp öbekler (あくびが出る, 差が大きい, 付き合う) çok çıkar.',
    groups: [
      {
        items: [
          { no: 15, q: '雨が降ってきましたが、私の家は近いので、傘がなくても（　）です。', opts: ['{平気|へいき}', '安全', '正常', '十分'], a: 0, why: '〜なくても平気 = ~ olmasa da sorun yok. 安全 güvenli · 正常 normal · 十分 yeterli.' },
          { no: 16, q: '仕事で疲れているときは、夕飯を作るのが（　）ので、外食することが多い。', opts: ['だらしない', 'めんどうくさい', 'くわしい', 'にくらしい'], a: 1, why: 'Yorgunken yemek yapmak zahmetli = 面倒くさい. だらしない dağınık · 詳しい ayrıntılı · 憎らしい nefret edilesi.' },
          { no: 17, q: 'ゆうべはほとんど寝ていないので、今日は眠くて何度も（　）が出てしまう。', opts: ['しゃっくり', 'くしゃみ', 'せき', 'あくび'], a: 3, why: 'Uykusuzluk → esneme = あくび. しゃっくり hıçkırık · くしゃみ hapşırık · せき öksürük.' },
          { no: 18, q: '「私の国の社会問題」という（　）で、レポートを書くことになった。', opts: ['デザイン', 'テーマ', 'サイン', 'ルール'], a: 1, why: '〜というテーマで = ~ konusunda.' },
          { no: 19, q: 'この季節は、昼と夜の気温の（　）が大きい。', opts: ['台', '段', '{差|さ}', '列'], a: 2, why: '差 = fark. 気温の差が大きい = sıcaklık farkı büyük.' },
          { no: 20, q: '（　）して、{鍵|かぎ}をかけないで家を出てしまった。', opts: ['はっきり', 'しっかり', 'ぴったり', 'うっかり'], a: 3, why: 'Dalgınlıkla = うっかり. しっかり sağlam/dikkatli (tersi) · ぴったり tam oturan.' },
          { no: 21, q: 'まだ{空席|くうせき}が少しあるので、今なら予約は（　）です。', opts: ['完全', '無駄', '可能', '平等'], a: 2, why: 'Boş yer var → rezervasyon mümkün = 可能.' },
          { no: 22, q: '私のパソコンは古いので、（　）が遅いです。', opts: ['行動', '活動', '動作', '運動'], a: 2, why: 'Makinenin çalışması = 動作 (dōsa). 行動 insan davranışı · 運動 spor.' },
          { no: 23, q: '来週の説明会は、今日の12時が申し込みの（　）だ。', opts: ['{期限|きげん}', '期間', '日程', '日常'], a: 0, why: 'Son tarih/saat = 期限. 期間 süre (aralık) · 日程 program.' },
          { no: 24, q: '外国で生活するのは楽しいが、ときどき国の料理が（　）なる。', opts: ['{恋|こい}しく', '親しく', '苦しく', '貧しく'], a: 0, why: '恋しい = özlemek. Memleket yemeğini özlemek = 国の料理が恋しくなる.' },
          { no: 25, q: '夫とは、3年間（　）から結婚しました。', opts: ['取り囲んで', '引き受けて', '思いついて', '付き合って'], a: 3, why: '付き合う = çıkmak (sevgili olmak). 3 yıl çıktıktan sonra evlendik.' },
        ],
      },
    ],
  },
  {
    id: 'm4',
    part: '文字・語彙',
    title: '問題4 · 言い換え類義',
    how: 'Altı çizili kelimeye en yakın anlamı seç. Şıkkı cümleye koy: anlam değişmiyorsa doğrudur.',
    groups: [
      {
        items: [
          { no: 26, q: 'その部屋にある家具の[サイズ]を聞いてきてください。', opts: ['重さ', '数', '形', '大きさ'], a: 3, why: 'サイズ = boyut = 大きさ.' },
          { no: 27, q: 'この部分を[{暗記|あんき}して]ください。', opts: ['読んで', '書いて', '覚えて', '教えて'], a: 2, why: '暗記する = ezberlemek ≈ 覚える.' },
          { no: 28, q: '{伊藤|いとう}さんは魚を料理するのが[{得意|とくい}な]ようだ。', opts: ['あまり好きじゃない', 'あまり上手じゃない', 'とても好きな', 'とても上手な'], a: 3, why: '得意 = iyi olmak, becerikli ≈ 上手. “Sevmek” değil (好き tuzak).' },
          { no: 29, q: '誰にでも[{欠点|けってん}]はあると思う。', opts: ['つまらないところ', 'よくないところ', '間違えるところ', '忘れるところ'], a: 1, why: '欠点 = kusur, zayıf yön ≈ よくないところ.' },
          { no: 30, q: 'そんなに[どならないで]ください。', opts: ['大声で怒らないで', '強く押さないで', 'たくさん食べないで', '早く歩かないで'], a: 0, why: '怒鳴る どなる = bağırmak (öfkeyle) ≈ 大声で怒る.' },
        ],
      },
    ],
  },
  {
    id: 'm5',
    part: '文字・語彙',
    title: '問題5 · 用法',
    how: 'Kelimenin doğru kullanıldığı cümleyi seç. Her cümlede kelimenin yerine bildiğin eş anlamlıyı koy; anlamlı kalan tek cümle cevap.',
    groups: [
      {
        items: [
          {
            no: 31,
            q: '[{進歩|しんぽ}]',
            opts: ['この会社は社長が一人で始めたが、今は大きな会社に進歩した', '技術が進歩して、人々の生活は便利になった', '病気が治って、食欲もだんだん進歩してきた', 'アパートの家賃が進歩して、来年から5000円高くなるそうだ'],
            a: 1,
            why: '進歩 = (teknoloji, bilim) ilerleme. Şirket 成長, iştah 戻る, kira 上がる.',
          },
          {
            no: 32,
            q: '[話しかける]',
            opts: ['昨日、駅で観光客に英語で話しかけられた', '次の旅行の行き先は、家族と話しかけて決めようと思う', '名前を話しかけるので、呼ばれた人は手を挙げてください', '先輩にお土産をあげて、お礼を話しかけられました'],
            a: 0,
            why: '話しかける = birine laf atmak/konuşmaya başlamak. Aile ile 話し合う, isim 呼ぶ, teşekkür 言う.',
          },
          {
            no: 33,
            q: '[{交流|こうりゅう}]',
            opts: ['二つの色が交流して、きれいなピンク色になりました', 'このドレッシングは、野菜と交流するとおいしいですね', '息子の学校は、海外の人たちと交流する機会が多いようだ', 'この引き出しには、兄の物と私の物が交流している'],
            a: 2,
            why: '交流 = insanlar arası etkileşim, kültürel alışveriş. Renk 混ざる, sos 合う.',
          },
          {
            no: 34,
            q: '[{渋滞|じゅうたい}]',
            opts: ['新しい家の工事が渋滞していて、なかなか引っ越せない', '事故で道が渋滞していたので、遅刻してしまった', '最近仕事が忙しくて、ストレスが渋滞している', 'この商品はあまり売れないので、倉庫の中で渋滞している'],
            a: 1,
            why: '渋滞 = trafik sıkışıklığı. İnşaat 遅れる, stres たまる, stok 残る.',
          },
          {
            no: 35,
            q: '[にこにこ]',
            opts: ['ガソリンが少なくなって、車が途中で止まりそうでにこにこした', '大勢の前で歌ったとき、緊張して胸がにこにこした', '昨日から具合が悪くて、今朝も頭が少しにこにこしている', '遊んでいる私たちを見て、祖母はうれしそうににこにこしていた'],
            a: 3,
            why: 'にこにこ = gülümseyerek. Heyecan どきどき, baş ağrısı ずきずき, endişe はらはら／ひやひや.',
          },
        ],
      },
    ],
  },
]
