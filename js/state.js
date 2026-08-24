/* ECHO — 玩家進度狀態（localStorage） */

const STATE = (() => {
  const KEY = 'echo_0917_progress';
  const ID_KEY = 'echo_0917_investigator_id';
  const START_KEY = 'echo_0917_start_time';

  function defaultState() {
    return {
      p1: false, // 23:17 → Evidence 01
      p2: false, // 0917 → Image Data
      p3: false, // timeline → hidden reply / new posts
      p4: false, // hidden reply opened → m_0917 unlocked
      p5: false, // THU_0917 → chen unlocked
      p6: false, // 便利商店 → case file unlocked
      p7: false, // audio played → investigator field unlocked
      p8: false, // final reveal complete
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
    reset() { state = defaultState(); save(); try { localStorage.removeItem(START_KEY); localStorage.removeItem(ID_KEY); } catch(e){} ensureStart(); },
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
