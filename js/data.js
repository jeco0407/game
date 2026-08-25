/* ECHO — CASE #0917 — 內容資料層 (v2 / 完整逐頁規格) */

const DATA = {

  siteName: 'ECHO',
  tagline: 'Everything leaves a trace.',
  taglineZh: '所有事情，都會留下痕跡。',
  version: 'v.2.4.17',

  /* ---------------- Archive dashboard ---------------- */
  archiveNav: [
    { key: 'cases', label: '案件' },
    { key: 'evidence', label: '證據' },
    { key: 'people', label: '相關人物' },
    { key: 'search', label: '搜尋' },
  ],

  /* ---------------- @last_seen_0917 feed ---------------- */
  feed: [
    { id: 1, time: '8/17 · 21:03', text: '今天的雨下得很奇怪。', replies: 3, reposts: 7, likes: 24 },
    { id: 2, time: '8/17 · 21:48', text: '今天第一次發現，\n原來便利商店關門以後，\n看起來真的很像假的。', image: 'conbini', replies: 5, reposts: 11, likes: 38 },
    { id: 3, time: '8/17 · 22:13', text: '對面那個人還在。', replies: 2, reposts: 3, likes: 17 },
    { id: 4, time: '8/17 · 22:31', text: '明天應該就不會下雨了。', replies: 1, reposts: 0, likes: 9 },
    { id: 5, time: '8/17 · 22:41', text: '忘記帶傘。', replies: 1, reposts: 0, likes: 6 },
    { id: 6, time: '8/17 · 22:52', text: '有時候覺得晚上比白天安靜很多。', replies: 2, reposts: 1, likes: 14 },
    { id: 7, time: '8/17 · 23:00', text: '如果你一直盯著同一個地方看，\n它也會開始看你。', replies: 4, reposts: 6, likes: 29 },
    { id: 8, time: '8/17 · 23:04', text: '今天沒有看到他。', replies: 2, reposts: 2, likes: 12 },
    { id: 9, time: '8/17 · 23:10', text: '但我知道他還在。', replies: 3, reposts: 4, likes: 21 },
    { id: 10, time: '8/17 · 23:17', text: '23:17', replies: 6, reposts: 9, likes: 33 },
    { id: 11, time: '8/17 · 23:22', text: '電梯今天又壞了。', replies: 0, reposts: 0, likes: 4 },
    { id: 12, time: '8/17 · 23:31', text: '明天還是會下雨嗎？', replies: 1, reposts: 0, likes: 5 },
    { id: 13, time: '8/17 · 23:38', text: '樓下的貓今天沒有出現。', replies: 0, reposts: 0, likes: 3 },
    { id: 14, time: '8/17 · 23:44', text: '手機剩 3%。', replies: 1, reposts: 0, likes: 6 },
    { id: 15, time: '8/17 · 23:51', text: '好像有人在敲門。', replies: 5, reposts: 3, likes: 19 },
    { id: 16, time: '8/17 · 23:58', text: '算了，應該是我想太多。', replies: 2, reposts: 1, likes: 8 },
    {
      id: 17, time: '8/18 · 00:12',
      text: '如果你看到這篇，\n代表我已經死了。',
      countdown: true,
      replies: 19, reposts: 38, likes: 143,
      isLast: true
    },
    { id: 18, time: '8/18 · 03:17', text: '不要去找我。', unlockAfter: 'timeline', replies: 61, reposts: 84, likes: 312 },
    { id: 19, time: '8/18 · 07:41', text: '[附件：模糊照片]', image: 'figure', unlockAfter: 'timeline', replies: 97, reposts: 130, likes: 488 },
  ],

  /* 每篇貼文專屬的留言 — 內容對應該篇貼文文字，避免留言跟貼文文不對題，
     也避免不同貼文之間出現一模一樣的留言。key 是 feed 裡的貼文 id。 */
  postComments: {
    1: [ // 今天的雨下得很奇怪。
      { user: 'mia', text: '真的欸，今天雨滴看起來特別大顆', time: '3h' },
      { user: 'ken', text: '妳是不是又在陽台發呆了', time: '2h' },
      { user: 'quietsea', text: '早點回家喔，路滑', time: '1h' },
    ],
    2: [ // 便利商店關門以後看起來很像假的（+超商照片）
      { user: 'z_9', text: '這張真的有種說不出的違和感', time: '4h' },
      { user: 'anon_42', text: '妳是自己一個人去的嗎', time: '3h' },
      { user: 'reader_88', text: '那間我知道，晚上真的很安靜', time: '3h' },
      { user: 'k.eve', text: '拍得很有氛圍欸', time: '2h' },
      { user: 'nn_room', text: '後面站著的那個人是誰啊', time: '1h' },
    ],
    3: [ // 對面那個人還在。
      { user: 'ghostwr1ter', text: '什麼人？在等妳嗎', time: '2h' },
      { user: 'moon_9', text: '妳確定不用報警之類的嗎', time: '1h' },
    ],
    4: [ // 明天應該就不會下雨了。
      { user: 'yc_fan', text: '希望啦，好想出門', time: '50m' },
    ],
    5: [ // 忘記帶傘。
      { user: 'quietsea', text: '妳每次都忘記，記得買一把放包包', time: '40m' },
    ],
    6: [ // 有時候覺得晚上比白天安靜很多。
      { user: 'echo_lurker', text: '深夜真的容易亂想東西', time: '38m' },
      { user: 'z_9', text: '早點睡啦，別想太多', time: '30m' },
    ],
    7: [ // 如果你一直盯著同一個地方看，它也會開始看你。
      { user: 'ken', text: '這句話講得有點毛欸', time: '55m' },
      { user: 'anon_42', text: '妳最近是不是熬夜了', time: '40m' },
      { user: 'k.eve', text: '怎麼突然這麼有哲理', time: '25m' },
      { user: 'nn_room', text: '妳還好嗎，感覺怪怪的', time: '10m' },
    ],
    8: [ // 今天沒有看到他。
      { user: 'reader_88', text: '他是誰啊？', time: '50m' },
      { user: 'mia', text: '妳說的是樓下那個人嗎', time: '20m' },
    ],
    9: [ // 但我知道他還在。
      { user: 'ghostwr1ter', text: '這聽起來有點嚇人耶', time: '40m' },
      { user: 'quietsea', text: '要不要跟家人說一下比較好', time: '25m' },
      { user: 'moon_9', text: '妳是不是被跟蹤了', time: '9m' },
    ],
    10: [ // 23:17
      { user: 'k.eve', text: '這什麼意思？', time: '30m' },
      { user: 'z_9', text: '只打時間有點嚇到我', time: '25m' },
      { user: 'anon_42', text: '妳還好嗎？？', time: '20m' },
      { user: 'nn_room', text: '怎麼了嗎，發生什麼事了', time: '14m' },
      { user: 'reader_88', text: '拜託回一下，在線上嗎', time: '8m' },
      { user: 'mia', text: '在等妳說明……', time: '3m' },
    ],
    12: [ // 明天還是會下雨嗎？
      { user: 'yc_fan', text: '看預報好像還是會喔', time: '20m' },
    ],
    14: [ // 手機剩 3%。
      { user: 'echo_lurker', text: '快去充電啦', time: '12m' },
    ],
    15: [ // 好像有人在敲門。
      { user: 'ken', text: '妳有去看是誰嗎', time: '35m' },
      { user: 'ghostwr1ter', text: '這個時間有點可怕欸', time: '28m' },
      { user: 'k.eve', text: '要不要打給我', time: '20m' },
      { user: 'quietsea', text: '門鎖好了嗎', time: '12m' },
      { user: 'anon_42', text: '拜託不要自己開門', time: '5m' },
    ],
    16: [ // 算了，應該是我想太多。
      { user: 'moon_9', text: '有時候真的會這樣想太多', time: '15m' },
      { user: 'nn_room', text: '早點休息吧', time: '6m' },
    ],
    18: [ // 不要去找我。（解鎖後）
      { user: 'anon_42', text: '不要去找我是什麼意思？？', time: '6h' },
      { user: 'k.eve', text: '這真的是她本人打的嗎', time: '5h' },
      { user: 'ghostwr1ter', text: '這語氣跟平常完全不一樣', time: '3h' },
      { user: 'quietsea', text: '已經報警了，拜託聯絡我們', time: '2h' },
      { user: 'z_9', text: '帳號到底是誰在用', time: '50m' },
      { user: 'reader_88', text: '拜託不要嚇我們', time: '10m' },
    ],
    19: [ // [附件：模糊照片]（解鎖後）
      { user: 'nn_room', text: '這張照片是在哪裡拍的', time: '5h' },
      { user: 'mia', text: '背景那個人是誰', time: '4h' },
      { user: 'ghostwr1ter', text: '感覺不是她自己拍的', time: '2h' },
      { user: 'moon_9', text: '這是要我們找這個地方嗎', time: '1h' },
      { user: 'anon_42', text: '越來越不對勁了', time: '30m' },
      { user: 'k.eve', text: '有人認出這條巷子嗎', time: '8m' },
    ],
  },

  comments17: [
    { user: 'mia', text: '你還好嗎？', time: '2h' },
    { user: 'ken', text: '這是什麼意思？', time: '1h' },
    { user: 'unknown', text: '妳是不是遇到什麼事情？', time: '48m' },
    { user: 'nn_room', text: '不要嚇人好嗎……', time: '45m' },
    { user: 'ghostwr1ter', text: '這帳號是不是被盜了', time: '41m' },
    { user: 'reader_88', text: '拜託回覆一下', time: '38m' },
    { user: 'k.eve', text: '報警了嗎？', time: '35m' },
    { user: 'anon_42', text: '我朋友說她住這附近，要不要幫忙找找看', time: '30m' },
    { user: 'nn_room', text: '？？？？', time: '28m' },
    { user: 'quietsea', text: '樓上冷靜點', time: '25m' },
    { user: 'z_9', text: '倒數是什麼意思', time: '22m' },
    { user: 'reader_88', text: '希望只是惡作劇', time: '19m' },
    { user: 'ghostwr1ter', text: '我覺得不太對勁', time: '16m' },
    { user: 'anon_42', text: '有人認識她本人嗎', time: '13m' },
    { user: 'quietsea', text: '截圖存證了', time: '11m' },
    { user: 'k.eve', text: '拜託平安', time: '9m' },
    { user: 'nn_room', text: '這個帳號之前很正常啊', time: '5m' },
    { user: 'chen_yc', text: '別再發了。', suspicious: true, time: '3m' },
    { user: 'm_0917', text: '你不應該再找了。', hidden: true, time: '08/18 · 00:19' },
  ],

  /* ---------------- Evidence photo / metadata ----------------
     注意：這張照片出現在 8/17（週一）的貼文裡，但檔案的建立時間卻是
     8/19（週三）——足足晚了兩天。這個矛盾是「時間線重建」謎題的核心，
     不是資料錯誤：代表這張照片是在她「最後一次上線」之後才被生成／
     上傳的，屬於刻意設計的時間線衝突。 */
  evidencePhoto: {
    id: 'IMG_0917.JPG',
    created: '08 / 19 / 2026（週三）',
    modified: '08 / 19 / 2026（週三）',
    camera: '不明',
    location: '34.XXX',
    device: '不明',
    doorplate: '0917',
  },

  /* ---------------- Timeline ---------------- */
  timelineTrack: [
    { day: '08/17', weekday: '週一', events: ['21:03', '21:48', '22:13', '23:17'] },
    { day: '08/18', weekday: '週二', events: ['00:12', '03:17', '07:41'] },
    { day: '08/19', weekday: '週三', events: [] },
  ],

  /* ---------------- Profiles ---------------- */
  yuanProfile: {
    handle: 'last_seen_0917',
    name: 'YUAN（林予安）',
    bio: '已停用。',
    bioHoverReveal: '08/18 00:13 更新',
    posts: 17, following: 0, followers: 0,
    lastActive: '08 / 18 / 00:12',
    joined: '2026 年 8 月加入',
  },

  /* ---------------- Trending hashtags (right rail) ---------------- */
  trends: [
    { tag: '#突然好想你', count: '8,417' },
    { tag: '#下雨天', count: '6,231' },
    { tag: '#23:17', count: '5,020' },
    { tag: '#便利商店', count: '3,114' },
    { tag: '#你還好嗎', count: '2,998' },
  ],

  mProfile: {
    handle: 'm_0917',
    name: 'M',
    followers: 0, following: 0, posts: 1,
    post: '他第一次發現我的時候，\n也是星期四。',
    postDate: '08 / 20（週四）',
  },

  chenProfile: {
    handle: 'chen_yc',
    name: '陳奕辰',
    status: '帳號已停用',
    posts: 24,
    bio: "Don't ask me.",
    lastPost: { text: '如果她問起來，\n就說我不知道。', time: '08 / 20（週四）· 23:17' },
    archived: [
      { id: 1, title: '[CONTENT REMOVED]', removed: true, highlight: false },
      { id: 2, title: '[CONTENT REMOVED]', removed: true, highlight: false },
      { id: 3, title: '[CONTENT REMOVED]', removed: true, highlight: false },
      { id: 4, title: '[CONTENT REMOVED]', removed: true, highlight: true, time: '08 / 20（週四）· 23:17' },
    ]
  },

  accessPrompt: {
    contentId: '0917-0820',
    question: '他們第一次見面的地方。',
    answers: ['convenience store', 'convenience', '便利商店'],
  },

  /* ---------------- Case Overview (partial) ---------------- */
  caseOverview: {
    id: '#0917',
    subject: '林予安',
    age: 19,
    lastSeenDate: '2026 / 08 / 17',
    lastSeenTime: '23:17',
    status: '失蹤',
    lastActivity: { date: '2026 / 08 / 18', time: '00:12' },
    related: [
      { name: '陳奕辰', status: '身分不明' },
      { name: 'M', status: '身分不明' },
    ],
  },

  /* ---------------- Case File (full, unlocked later) ---------------- */
  caseFile: {
    id: '#0917',
    subject: '林予安',
    age: 19,
    status: '失蹤',
    lastSeenDate: '2026 / 08 / 17',
    lastSeenTime: '23:17',
    location: '不明',
    related: [
      { name: '陳奕辰', status: '身分不明' },
      { name: 'M', status: '身分不明' },
    ],
    digitalActivity: ['08/18 · 00:12', '08/18 · 03:17', '08/18 · 07:41'],
  },

  /* ---------------- Evidence Board ---------------- */
  evidenceBoardNodes: [
    { id: 'yuan', label: '林予安', x: 12, y: 12 },
    { id: 't2317', label: '23:17', x: 60, y: 8 },
    { id: 'm0917', label: 'M_0917', x: 60, y: 45 },
    { id: 'chen', label: '陳奕辰', x: 12, y: 62 },
  ],
  evidenceBoardCorrectLinks: [
    ['yuan', 't2317'],
    ['t2317', 'm0917'],
    ['m0917', 'chen'],
  ],

  /* ---------------- Audio ---------------- */
  audioEvidence: {
    id: 'EVIDENCE_07',
    duration: '00:27',
    transcript: [
      { t: '0:00', line: '（雨聲）', dim: true },
      { t: '0:08', line: '「如果有人找到這裡……」' },
      { t: '0:14', line: '（停頓）', dim: true },
      { t: '0:19', line: '「不要相信 M。」', warn: true },
      { t: '0:23', line: '（雜訊）', dim: true },
      { t: '0:29', line: '「他不是一個人。」', warn: true },
    ],
  },

  /* ---------------- M Database ---------------- */
  mCount: 128,

  finalMessages: [
    '你終於來了。',
    '我一直在等你。',
  ],

  hints: {
    hiddenReply: [
      '這則貼文寫著 19 則留言，但畫面上數得到的，好像不到 19 則。',
      '往留言最下面找找看，有沒有寫著「1 hidden reply」。',
      '點開它。',
    ],
    photo: [
      '這張照片乍看很普通，但便利商店已經打烊了。',
      '玻璃會反射對街的東西。試著用 INSPECT 放大玻璃的部分。',
      '玻璃門旁邊，還有一個小小的門牌號碼，也值得看清楚。',
    ],
    timeline: [
      '案件記錄的失蹤時間，跟這張照片的建立時間，兜不起來。',
      '試著把 IMG_0917 這個項目，拖到它實際被建立的那一天。',
      '08/19 —— 那是貼文出現之後才發生的事。'
    ],
    accessPrompt: [
      '「他們第一次見面的地方」——回頭看看林予安最早的幾則貼文。',
      '有一則貼文提到一個地方，關門以後看起來很像假的。',
      '答案是那個地方的名稱（中文或英文皆可）。',
    ],
    board: [
      '林予安失蹤的時間，跟帳號後續的活動，之間有沒有關聯？',
      '試著把 23:17 連到那個接管帳號的人。',
      '正確的關係鏈是：林予安 → 23:17 → M_0917 → 陳奕辰。',
    ],
  }
};
