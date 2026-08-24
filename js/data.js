/* ECHO — CASE #0917 — 內容資料層 */

const DATA = {

  siteName: 'ECHO',
  tagline: 'Everything leaves a trace.',
  taglineZh: '所有事情，都會留下痕跡。',

  /* ---------------- @last_seen_0917 ---------------- */
  feed: [
    { id: 1, time: '08/17 21:03', text: '今天的雨下得很奇怪。' },
    { id: 2, time: '08/17 21:48', text: '今天第一次發現，原來便利商店關門以後，看起來真的很像假的。', image: 'conbini' },
    { id: 3, time: '08/17 22:13', text: '對面那個人還在。' },
    { id: 4, time: '08/17 22:30', text: '明天應該就不會下雨了。' },
    { id: 5, time: '08/17 22:41', text: '忘記帶傘。' },
    { id: 6, time: '08/17 22:52', text: '有時候覺得晚上比白天安靜很多。' },
    { id: 7, time: '08/17 23:00', text: '如果你一直盯著同一個地方看，\n它也會開始看你。' },
    { id: 8, time: '08/17 23:04', text: '今天沒有看到他。' },
    { id: 9, time: '08/17 23:10', text: '但我知道他還在。' },
    { id: 10, time: '08/17 23:17', text: '23:17' },
    { id: 11, time: '08/17 23:22', text: '電梯今天又壞了。' },
    { id: 12, time: '08/17 23:31', text: '明天還是會下雨嗎？' },
    { id: 13, time: '08/17 23:38', text: '樓下的貓今天沒有出現。' },
    { id: 14, time: '08/17 23:44', text: '手機剩 3%。' },
    { id: 15, time: '08/17 23:51', text: '好像有人在敲門。' },
    { id: 16, time: '08/17 23:58', text: '算了，應該是我想太多。' },
    {
      id: 17, time: '08/18 00:12',
      text: '如果你看到這篇，\n代表我已經死了。',
      countdown: true,
      likes: 143, reposts: 38, comments: 19,
      isLast: true
    },
    // 解鎖後才會出現的貼文（帳號被接管後的內容）
    { id: 18, time: '08/18 03:17', text: '不要去找我。', unlockAfter: 'p3' },
    { id: 19, time: '08/18 07:41', text: '[附件：模糊照片]', image: 'figure', unlockAfter: 'p3' },
  ],

  comments17: [
    { user: 'reader_88', text: '你還好嗎？' },
    { user: 'anon_42', text: '這是什麼意思？' },
    { user: 'quietsea', text: '你是不是遇到什麼事情？' },
    { user: 'nn_room', text: '不要嚇人好嗎……' },
    { user: 'ghostwr1ter', text: '這帳號是不是被盜了' },
    { user: 'reader_88', text: '拜託回覆一下' },
    { user: 'k.eve', text: '報警了嗎？' },
    { user: 'anon_42', text: '我朋友說她住這附近，要不要幫忙找找看' },
    { user: 'nn_room', text: '？？？？' },
    { user: 'quietsea', text: '樓上冷靜點' },
    { user: 'z_9', text: '倒數是什麼意思' },
    { user: 'reader_88', text: '希望只是惡作劇' },
    { user: 'ghostwr1ter', text: '我覺得不太對勁' },
    { user: 'anon_42', text: '有人認識她本人嗎' },
    { user: 'quietsea', text: '截圖存證了' },
    { user: 'k.eve', text: '拜託平安' },
    { user: 'nn_room', text: '這個帳號之前很正常啊' },
    { user: 'chen_yc', text: '別再發了。', suspicious: true },
    // 第 19 則 —— 隱藏留言
    { user: 'm_0917', text: '你不應該再找了。', hidden: true },
  ],

  /* ---------------- Evidence ---------------- */
  evidence01: {
    file: 'IMG_0917.JPG',
    created: '2026.08.19',
    modified: '2026.08.19',
    location: '34.XXX, 121.XXX',
    unknownPeople: 1,
    doorplate: '0917',
    observation: [
      '這是便利商店打烊後的街景。玻璃反射了對街的燈光。',
      '你確定你已經看完這張照片了嗎？',
    ]
  },

  /* ---------------- Timeline puzzle ---------------- */
  timelineItems: [
    '8/17 21:03', '8/17 21:48', '8/17 22:13', '8/17 23:17',
    '8/18 00:12', '8/18 03:17', '8/18 07:41', '8/19 ??'
  ],

  /* ---------------- Profiles ---------------- */
  mProfile: {
    handle: 'm_0917',
    status: 'No followers. No following. 1 post.',
    post: '他第一次發現我的時候，\n也是星期四。'
  },

  chenProfile: {
    handle: 'chen_yc',
    name: 'CHEN, YI-CHEN',
    status: 'This account is no longer active.',
    lastPost: { time: '08/20', text: '如果她問起來，\n就說我不知道。' },
    archived: [
      { title: '日常', preview: '今天天氣不錯。', removed: false },
      { title: '日常', preview: '報告寫不完。', removed: false },
      { title: '[ CONTENT REMOVED ]', time: '08/20 23:17', removed: true },
    ]
  },

  /* ---------------- Case file ---------------- */
  caseFile: {
    id: '#0917',
    subject: 'LIN, YU-AN',
    age: 19,
    status: 'MISSING',
    lastSeen: '08/17 23:17',
    location: 'UNKNOWN',
    relatedTree:
`LIN, YU-AN
     │
     │ friend
     ↓
CHEN, YI-CHEN
     │
     │ unknown
     ↓
     M`,
    audioTranscript: [
      { t: '0:00', line: '（雨聲）', dim: true },
      { t: '0:08', line: '「如果有人找到這裡……」' },
      { t: '0:14', line: '（停頓）', dim: true },
      { t: '0:19', line: '「不要相信 M。」', warn: true },
      { t: '0:23', line: '（雜訊）', dim: true },
      { t: '0:29', line: '「他不是一個人。」', warn: true },
    ]
  },

  /* ---------------- M Database (epilogue) ---------------- */
  mCount: 128,

  /* ---------------- Puzzle answers ---------------- */
  answers: {
    p1: ['2317', '23:17'],
    p2: ['0917'],
    p5: ['thu0917', 'thu_0917'],
    p6: ['便利商店', 'convenience', 'conveniencestore'],
  },

  hints: {
    p1: [
      '你有沒有注意到，這個帳號的貼文，有一個時間反覆出現？',
      '21:03、21:48、22:13、23:04……有一個時間點特別不一樣。',
      '答案的格式是 HH:MM，例如 23:17。'
    ],
    p2: [
      '你確定你已經看完這張照片了嗎？',
      '玻璃門會反射東西。便利商店已經打烊了，裡面不該有燈，也不該有人。',
      '注意玻璃門旁邊的門牌號碼。'
    ],
    p3: [
      '這些時間點，看起來不是照順序排列的。',
      '把它們拖曳成正確的時間順序，看看會發生什麼事。',
      '有一張照片的拍攝時間，晚於它出現的那則貼文。'
    ],
    p4: [
      '留言數字跟顯示出來的留言則數，對得起來嗎？',
      '這則貼文寫著 19 則留言，但你數得到 19 則嗎？',
      '找找看有沒有「1 hidden reply」。'
    ],
    p5: [
      '「他第一次發現我的時候，也是星期四。」——先確認今天是星期幾。',
      '8/17 其實不是星期四。回頭看看之前的證據照片，檔名裡有沒有藏著別的日期？',
      '找找檔名裡帶有 THU 的證據，把裡面藏著的代號輸入進去。'
    ],
    p6: [
      '陳奕辰的帳號裡，有一篇貼文顯示不出來。',
      '點開那則 [ CONTENT REMOVED ]，它會問你一個問題。',
      '「他們第一次見面的地方」——回頭看看林予安最早的幾則貼文。'
    ],
  }
};
