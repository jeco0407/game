/* ECHO — 玩家進度狀態（localStorage） */

const STATE = (() => {
  const KEY = 'echo_0917_progress_v2';
  const ID_KEY = 'echo_0917_investigator_id';
  const START_KEY = 'echo_0917_start_time';

  function defaultState() {
    return {
      photoAnomaly: false, // 點開照片中的人影 → ANOMALY DETECTED
      metadata: false,     // 看過 Image Metadata → TIMELINE CONFLICT
      timeline: false,     // 拖曳解開時間衝突 → 解鎖 Chen / M 的 ARCHIVE 連結
      chenVisited: false,  // 造訪過 Chen 的頁面
      access: false,       // Access Prompt 答對「便利商店」→ 解鎖 Case File
      board: false,        // Evidence Board 三條正確連線 → 解鎖 Audio
      audio: false,        // 播放過錄音 → Case File 的 INVESTIGATOR 欄位從 UNKNOWN 變成 M
      final: false,        // 完成 M-129 最終揭露

      // ---- Chapter 02 ----
      ch2Puzzle01Solved: false,  // 灰資料庫依建立時間排序過，看過灰-000不是最早
      ch2Puzzle02Solved: false,  // File Integrity：看過灰-128 的 Index Entries 缺 Body
      ch2Puzzle03Solved: false,  // Fragment Reconstruction：Device Hash + Account Hash 都比對成功
      case0917Level2Unlocked: false, // Case #0917 是否已解鎖 ARCHIVE RELATION 新欄位
      ch2Puzzle04Solved: false, // Archive Version Compare + Edit History 都看過
      ch2GreyChainBuilt: false, // Grey Chain 依建立時間排出正確順序
      ch2RecoveryPlayed: false, // 灰-000 Recovery 動畫播放過
      ch2Evidence: null,        // { photo:'match', device:'match', ... }
      ch2Confidence: null,      // 依 ch2Evidence 算出的信心值（87）
      ch2Judgement: null,       // 'A' | 'B' | 'C'
      ch2Puzzle05Solved: false, // 只有選 C 才會是 true
      ch2Final: false,          // 完成第二章結局
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? Object.assign(defaultState(), JSON.parse(raw)) : defaultState();
    } catch (e) {
      return defaultState();
    }
  }

  let state = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function ensureStart() {
    try {
      if (!localStorage.getItem(START_KEY)) {
        localStorage.setItem(START_KEY, String(Date.now()));
      }
    } catch (e) {}
  }
  ensureStart();

  function ensureId() {
    try {
      let id = localStorage.getItem(ID_KEY);
      if (!id) {
        id = String(129 + Math.floor(Math.random() * 40));
        localStorage.setItem(ID_KEY, id);
      }
      return id;
    } catch (e) {
      return '129';
    }
  }

  return {
    get(key) { return state[key]; },
    set(key, val) { state[key] = val; save(); },
    all() { return state; },
    reset() {
      state = defaultState(); save();
      try { localStorage.removeItem(START_KEY); localStorage.removeItem(ID_KEY); } catch(e){}
      ensureStart();
    },
    investigatorId() { return ensureId(); },
    elapsedMs() {
      try {
        const t = parseInt(localStorage.getItem(START_KEY) || Date.now(), 10);
        return Date.now() - t;
      } catch (e) { return 0; }
    }
  };
})();

function formatElapsed(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}
