/* ECHO — CASE #0917 — App shell / router / views (v2, full page-flow spec) */

const App = (() => {
  const root = document.getElementById('app');

  /* ---------------- utils ---------------- */
  function normalize(str) {
    return String(str || '')
      .trim()
      .toLowerCase()
      .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFF10 + 48))
      .replace(/[\s_\-：:／/]/g, '');
  }
  function checkIn(list, input) {
    const n = normalize(input);
    return (list || []).some(a => normalize(a) === n);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function nl(s) { return esc(s).replace(/\n/g, '<br>'); }
  const IMAGES = {
    conbini: 'assets/images/evidence-conbini.jpg',
    figure: 'assets/images/evidence-figure.jpg',
    avatarYuan: 'assets/images/avatar-yuan.jpg',
    avatarChen: 'assets/images/avatar-chen.png',
    avatarM: 'assets/images/avatar-m.jpg',
    bgHome: 'assets/images/bg-home.jpg',
  };
  function img(key) { return IMAGES[key] || ''; }

  function avatarStyle(who) {
    if (who === 'm') return '';
    const map = { yuan: 'avatarYuan', chen: 'avatarChen' };
    const src = IMAGES[map[who]];
    return src ? ` style="background-image:url('${src}');background-size:cover;background-position:center"` : '';
  }

  /* ---------------- icon set (feed UI) ---------------- */
  const ICON_PATHS = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>',
    search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 21a2 2 0 0 0 4 0"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    list: '<line x1="5" y1="6" x2="19" y2="6"/><line x1="5" y1="12" x2="19" y2="12"/><line x1="5" y1="18" x2="13" y2="18"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    more: '<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>',
    sparkle: '<path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.5 2.5M16.5 16.5 19 19M19 5l-2.5 2.5M7.5 16.5 5 19"/>',
    pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    reply: '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    repost: '<path d="M17 2v6h-6"/><path d="M21 8a7 7 0 0 0-13-3.5L5 8"/><path d="M7 22v-6h6"/><path d="M3 16a7 7 0 0 0 13 3.5L19 16"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
    share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M16 6l-4-4-4 4"/><line x1="12" y1="2" x2="12" y2="15"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    lock: '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/>',
    alert: '<path d="M12 3 2 20h20L12 3Z"/><line x1="12" y1="9" x2="12" y2="14"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    zoomIn: '<circle cx="10" cy="10" r="7"/><line x1="10" y1="7" x2="10" y2="13"/><line x1="7" y1="10" x2="13" y2="10"/><line x1="21" y1="21" x2="15" y2="15"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15.4-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.4 6.4L3 16"/><path d="M3 21v-5h5"/>',
    contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none"/>',
  };
  function icon(name, size) {
    size = size || 20;
    return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name] || ''}</svg>`;
  }

  /* ---------------- bottom nav ---------------- */
  function bottomNav(active, wide) {
    const items = [
      { key: 'archive', label: '封存庫', hash: '#/archive', locked: false },
      { key: 'case', label: '案件', hash: STATE.get('access') ? '#/case/0917' : '#/case-overview', locked: false },
      { key: 'board', label: '證據板', hash: '#/evidence-board', locked: !STATE.get('access') },
      { key: 'm', label: STATE.get('final') ? '灰資料庫' : '灰', hash: STATE.get('final') ? '#/grey-database' : '#/investigator', locked: !STATE.get('audio') },
    ];
    return `<nav class="bottom-nav ${wide ? 'wide' : ''}">${items.map(it => {
      const cls = ['nav-item'];
      if (it.key === active) cls.push('active');
      if (it.locked) cls.push('locked');
      const click = it.locked ? '' : `onclick="location.hash='${it.hash}'"`;
      return `<div class="${cls.join(' ')}" ${click}>${it.label}</div>`;
    }).join('')}</nav>`;
  }

  function backLink(hash, label) {
    return `<span class="back-link" onclick="App.goBack('${hash}')">← 上一頁</span>`;
  }
  let navStack = [];
  let currentHash = null;
  let navigatingBack = false;
  function goBack(fallbackHash) {
    if (navStack.length > 0) {
      navigatingBack = true;
      location.hash = navStack.pop();
    } else {
      location.hash = fallbackHash;
    }
  }

  /* ---------------- hint system ---------------- */
  let hintOpen = false;
  let hintLevels = {};
  function hintBar(puzzleKey) {
    return '';
  }
  function renderHintPanel(puzzleKey) {
    const levels = DATA.hints[puzzleKey] || [];
    const titles = ['觀察', '關聯', '方向'];
    const lvl = Math.min(hintLevels[puzzleKey] || 0, levels.length - 1);
    return `
    <div class="hint-panel">
      <div class="h-title">${titles[lvl]}</div>
      <div class="h-level">${esc(levels[lvl] || '')}</div>
      ${lvl < levels.length - 1 ? `<button class="tool-btn" onclick="App.deeperHint('${puzzleKey}')">再想不到，給我更多提示</button>` : `<span class="dim" style="font-size:11px">已經是最後一層提示了。</span>`}
    </div>`;
  }
  function toggleHint() { hintOpen = !hintOpen; render(); }
  function deeperHint(key) { hintLevels[key] = (hintLevels[key] || 0) + 1; hintOpen = true; render(); }

  /* ---------------- sound effects ---------------- */
  const sfxCache = {};
  function playSfx(name, volume) {
    try {
      let base = sfxCache[name];
      if (!base) { base = new Audio(`assets/audio/sfx-${name}.wav`); sfxCache[name] = base; }
      const inst = base.cloneNode(true);
      inst.volume = volume !== undefined ? volume : 0.5;
      inst.play().catch(() => {});
    } catch (e) {}
  }
  function playSolveSfx() { playSfx('solve', 0.45); }
  function typeMessages(box, msgs, onAllDone) {
    let i = 0;
    (function showNext() {
      if (i >= msgs.length) { onAllDone(); return; }
      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble';
      if (box) box.appendChild(bubble);
      const text = msgs[i];
      let c = 0;
      const iv = setInterval(() => {
        c++;
        if (bubble) bubble.textContent = text.slice(0, c);
        playSfx('type', 0.22);
        if (c >= text.length) {
          clearInterval(iv);
          i++;
          setTimeout(showNext, 900);
        }
      }, 45);
    })();
  }

  /* ================================================================
     SCREEN 01 — Entry
     ================================================================ */
  function viewEntry() {
    return `
    <div class="entry-screen view-wide">
      <div class="entry-bg" style="background-image:url('${img('bgHome')}')"></div>
      <div class="entry-noise"></div>
      <div class="entry-corner tl">ECHO 封存系統<br>${DATA.version}</div>
      <div class="entry-corner tr">系統狀態<br><span class="entry-status-online"><span class="dot"></span>上線中</span></div>
      <div class="entry-plus left">+</div>
      <div class="entry-plus right">+</div>
      <div class="entry-center">
        <div class="entry-logo">ECHO</div>
        <div class="entry-tagline">${DATA.taglineZh}</div>
        <div class="entry-case-reveal">
          案件 0917<br>
          <span class="label">狀態</span><br>
          <span class="v">進行中</span>
        </div>
        <button class="entry-access-btn" onclick="location.hash='#/archive'">進入封存庫 <span class="arrow">→</span></button>
        <div class="entry-howto-link" onclick="App.showIntro()">遊戲說明</div>
      </div>
      <div class="entry-corner bl">安全連線<br><span class="entry-ok">已加密</span></div>
      <div class="entry-corner br">ECHO 封存庫<br>版權所有</div>
    </div>`;
  }

  /* ================================================================
     SCREEN 02 — Archive dashboard
     ================================================================ */
  function viewDashboard() {
    const nav = DATA.archiveNav;
    const indexedAt = STATE.get('archiveAnomalyIndexedAt');
    return `
    <div class="view view-wide">
      <div class="dashboard">
        <div class="dash-sidebar">
          <div class="dash-logo">ECHO</div>
          <div class="dash-nav-title">封存庫</div>
          ${nav.map(n => `<div class="dash-nav-item ${n.key === 'cases' ? 'active' : ''}" ${n.key === 'cases' ? "onclick=\"location.hash='#/archive'\"" : (n.key === 'people' ? "onclick=\"location.hash='#/profile/yuan'\"" : '')}>${n.label}</div>`).join('')}
          ${STATE.get('final') ? `<div class="dash-nav-item" onclick="location.hash='${STATE.get('ch2Final') ? '#/ch3-entry' : '#/ch2-entry'}'">灰資料庫</div>` : ''}
          ${(STATE.get('final') || STATE.get('ch2Final') || STATE.get('ch3Final')) ? `
          <div class="dash-nav-title" style="margin-top:20px">案件記錄</div>
          ${STATE.get('final') ? `<div class="dash-nav-item" onclick="location.hash='#/recap/1'">第一章回顧</div>` : ''}
          ${STATE.get('ch2Final') ? `<div class="dash-nav-item" onclick="location.hash='#/recap/2'">第二章回顧</div>` : ''}
          ${STATE.get('ch3Final') ? `<div class="dash-nav-item" onclick="location.hash='#/recap/3'">第三章回顧</div>` : ''}` : ''}
          <div class="dash-sys">系統<br><span class="v">上線中</span></div>
          <div class="dash-nav-item" style="margin-top:24px;color:var(--text-dim);font-size:12px" onclick="App.resetProgress()">重置進度</div>
        </div>
        <div class="dash-main">
          <div class="dash-title">近期案件</div>
          <div class="case-grid">
            <div class="case-card featured" onclick="location.hash='#/case-overview'">
              <div class="cc-thumb" style="background-image:url('${img('conbini')}')"></div>
              <div class="cc-id">案件 #0917</div>
              <div class="cc-name">林予安</div>
              <div class="cc-meta">最後出現<br>2026 / 08 / 17 · 23:17</div>
              ${STATE.get('ch3Final')
                ? `<div class="cc-status">狀態：<span class="closed">已結案</span></div>
                   <div class="cc-archive-tag">全部 03 章完成</div>`
                : `<div class="cc-status">狀態：<span class="warn">進行中</span></div>`}
            </div>
            <div class="case-card restricted${indexedAt ? ' clickable' : ''}"${indexedAt ? ` onclick="location.hash='#/case/0642'"` : ''}>${icon('lock', 18)}<div class="cc-id">案件 #0642</div><div class="cc-name">存取受限</div><div class="cc-archive-tag">僅供封存</div>${indexedAt ? `<div class="cc-archive-tag">最後索引<br>${esc(indexedAt)}</div>` : ''}</div>
            <div class="case-card restricted">${icon('lock', 18)}<div class="cc-id">案件 #1188</div><div class="cc-name">存取受限</div><div class="cc-archive-tag">僅供封存</div></div>
            <div class="case-card restricted">${icon('lock', 18)}<div class="cc-id">案件 #0033</div><div class="cc-name">存取受限</div><div class="cc-archive-tag">僅供封存</div></div>
          </div>
        </div>
      </div>
    </div>
    ${bottomNav('archive', true)}`;
  }

  function formatIndexedTimestamp() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function maybeTriggerArchiveAnomaly() {
    if (!STATE.get('ch3Final') || STATE.get('archiveAnomalySeen')) return;
    STATE.set('archiveAnomalySeen', true);
    shareToast('同步中...');
    setTimeout(() => {
      shareToast('封存已更新');
      STATE.set('archiveAnomalyIndexedAt', formatIndexedTimestamp());
      render();
    }, 1600);
  }

  function viewCase0642() {
    const indexedAt = STATE.get('archiveAnomalyIndexedAt');
    if (!indexedAt) {
      return `<div class="view view-wide">${backLink('#/archive', '封存庫')}<p class="dim mono">已鎖定。</p></div>${bottomNav('archive', true)}`;
    }
    return `
    <div class="view view-wide">
      ${backLink('#/archive', '封存庫')}
      <div class="dash-title">案件 #0642<span class="dim mono" style="font-size:11px"> · 存取受限</span></div>
      <div class="metadata-panel" style="margin-top:16px;max-width:420px">
        <div class="row"><span class="k">案件狀態</span><span class="v">已封存</span></div>
        <div class="row"><span class="k">最後索引</span><span class="v">${esc(indexedAt)}</span></div>
        <div class="row"><span class="k">索引者</span><span class="v">不明</span></div>
        ${STATE.get('ch0642Fragment01Solved') ? `<div class="row"><span class="k">封存片段</span><span class="v">01 · 已讀取</span></div>` : ''}
      </div>
      <button class="btn" style="margin-top:20px;max-width:340px" onclick="location.hash='#/case/0642/fragment'">[ 查看封存片段 → ]</button>
      <button class="btn" style="margin-top:10px;max-width:340px" onclick="location.hash='#/archive'">[ 返回封存庫 ]</button>
    </div>
    ${bottomNav('archive', true)}`;
  }

  function viewCase0642Fragment() {
    const indexedAt = STATE.get('archiveAnomalyIndexedAt');
    if (!indexedAt) return `<div class="view view-wide">${backLink('#/archive', '封存庫')}<p class="dim mono">已鎖定。</p></div>${bottomNav('archive', true)}`;
    const intro = DATA.case0642.intro;
    return `
    <div class="view view-wide">
      ${backLink('#/case/0642', '案件 #0642')}
      <div class="dash-title">封存片段 01</div>
      <div style="max-width:420px;font-size:14px;line-height:1.9;color:var(--text);margin-top:14px">${intro.map(esc).join('<br><br>')}</div>
      <button class="btn" style="margin-top:20px;max-width:340px" onclick="location.hash='#/case/0642/messages'">[ 查看訊息紀錄 → ]</button>
    </div>
    ${bottomNav('archive', true)}`;
  }

  let ch0642Revealed = {};
  let ch0642Wrong = false;
  function viewCase0642Messages() {
    const indexedAt = STATE.get('archiveAnomalyIndexedAt');
    if (!indexedAt) return `<div class="view view-wide">${backLink('#/archive', '封存庫')}<p class="dim mono">已鎖定。</p></div>${bottomNav('archive', true)}`;
    const msgs = DATA.case0642.messages;
    const rows = msgs.map(m => {
      const revealed = !!ch0642Revealed[m.id];
      return `
      <div class="cf-row clickable" onclick="App.revealCh0642Message(${m.id})"><span class="k">${m.sentTime}</span><span class="v">${esc(m.text)}</span></div>
      ${revealed ? `<div class="dim mono" style="font-size:11px;padding:2px 16px 8px">建立時間：${esc(m.createdTime)}${revealed ? ` <span class="dim" style="cursor:pointer;text-decoration:underline" onclick="App.selectCh0642Anomaly(${m.id})">標記為異常</span>` : ''}</div>` : ''}`;
    }).join('');
    return `
    <div class="view view-wide">
      ${backLink('#/case/0642/fragment', '封存片段 01')}
      <div class="dash-title">訊息紀錄</div>
      <p class="dim" style="font-size:13px">點擊每一則訊息，比對它的建立時間。找出建立時間跟顯示順序不合理的那一則，點擊「標記為異常」。</p>
      <div class="case-file" style="margin-top:10px;max-width:420px">${rows}</div>
      ${ch0642Wrong ? `<div class="observation-box warn" style="max-width:420px;margin-top:14px">這則沒有異常，再檢查一次。</div>` : ''}
    </div>
    ${hintBar('case0642')}
    ${bottomNav('archive', true)}`;
  }
  function revealCh0642Message(id) { ch0642Revealed[id] = true; ch0642Wrong = false; render(); }
  function selectCh0642Anomaly(id) {
    if (id === DATA.case0642.anomalyId) {
      playSolveSfx();
      STATE.set('ch0642Fragment01Solved', true);
      location.hash = '#/case/0642/result';
    } else {
      ch0642Wrong = true;
      render();
    }
  }
  function viewCase0642Result() {
    if (!STATE.get('ch0642Fragment01Solved')) return `<div class="view view-wide">${backLink('#/case/0642/messages', '訊息紀錄')}<p class="dim mono">尚未找到異常。</p></div>${bottomNav('archive', true)}`;
    const r = DATA.case0642.result;
    return `
    <div class="view view-wide">
      <div class="dash-title">${esc(r.title)}</div>
      <div class="case-file" style="margin-top:14px;max-width:420px">
        ${r.lines.map(l => `<div class="cf-row"><span class="v">${esc(l)}</span></div>`).join('')}
      </div>
      <p class="dim" style="font-size:13px;margin-top:20px;max-width:420px">${esc(r.closing)}</p>
      <button class="btn" style="margin-top:14px;max-width:340px" onclick="location.hash='#/archive'">[ 返回封存庫 ]</button>
    </div>
    ${bottomNav('archive', true)}`;
  }

  /* ================================================================
     SCREEN 03 — Case Overview
     ================================================================ */
  function viewCaseOverview() {
    const c = DATA.caseOverview;
    const relatedLinked = STATE.get('timeline');
    return `
    <div class="view view-wide">
      <div class="overview-header">
        ${backLink('#/archive', '封存庫')}
        <button class="overview-pill" onclick="location.hash='#/feed'">查看社群媒體 <span class="arrow">→</span></button>
      </div>
      <div class="dash-title" style="margin-top:6px">案件 ${c.id} · 失蹤人口</div>
      <div class="overview-grid">
        <div>
          <div class="overview-field"><div class="k">關係人</div><div class="v">${c.subject}</div></div>
          <div class="overview-field"><div class="k">年齡</div><div class="v">${c.age}</div></div>
          <div class="overview-field"><div class="k">狀態</div><div class="v warn">${c.status}</div></div>
        </div>
        <div>
          <div class="overview-field"><div class="k">最後出現</div><div class="v">${c.lastSeenDate}<br>${c.lastSeenTime}</div></div>
          <div class="overview-field"><div class="k">地點</div><div class="v" style="color:var(--text-dim)">${c.location}</div></div>
          <div class="overview-field"><div class="k">相關人物</div></div>
          ${c.related.map(r => `
            <div class="related-item ${relatedLinked ? 'linked' : ''}" ${relatedLinked ? `onclick="location.hash='${r.name === '陳奕辰' ? '#/profile/chen_yc' : '#/profile/hui_0917'}'"` : ''}>
              <span class="name">${esc(r.name)}</span><span class="status">${relatedLinked ? '→' : r.status}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="overview-field" style="margin-top:8px"><div class="k">最後數位活動</div></div>
      <div class="digital-activity-row">${c.digitalActivity.map(t => `<div class="da-chip mono">${esc(t)}</div>`).join('')}</div>
    </div>
    ${bottomNav('case', true)}`;
  }

  /* ================================================================
     SCREEN 04 — Social Feed
     ================================================================ */
  function xPostHtml(p) {
    if (p.unlockAfter && !STATE.get(p.unlockAfter)) return '';
    return `
    ${p.unlockAfter ? `<div class="unlock-badge">${icon('lock', 13)} 解鎖隱藏貼文</div>` : ''}
    <a class="x-post" href="#/post/${p.id}">
      <div class="x-post-row">
        <div class="x-post-avatar"${avatarStyle('yuan')}></div>
        <div class="x-post-main">
          <div class="x-post-head">
            <div class="x-post-who"><span class="name">YUAN（林予安）</span><span class="handle">@last_seen_0917</span><span class="time">· ${p.time}</span></div>
            <div class="x-post-more">${icon('more', 18)}</div>
          </div>
          <div class="x-post-body">${nl(p.text)}</div>
          ${p.image ? `<img class="x-post-img" src="${img(p.image)}" alt="">` : ''}
          ${p.isLast ? `<div class="x-post-countdown mono">23:17:42</div>` : ''}
          <div class="x-post-actions">
            <span class="x-post-action">${icon('reply', 18)} ${p.replies || 0}</span>
            <span class="x-post-action">${icon('repost', 18)} ${p.reposts || 0}</span>
            <span class="x-post-action">${icon('heart', 18)} ${p.likes || 0}</span>
            <span class="x-post-action">${icon('share', 18)}</span>
          </div>
        </div>
      </div>
    </a>`;
  }

  function resetProgress() {
    if (!confirm('確定要重置所有進度嗎？這會清空目前解開的謎題與案件紀錄，無法復原。')) return;
    STATE.reset();
    location.hash = '#/';
    location.reload();
  }

  function toggleFollow(el) {
    const following = el.classList.toggle('following');
    el.textContent = following ? '追蹤中' : '追蹤';
  }

  function newPostToast() {
    const toast = document.createElement('div');
    toast.className = 'new-message-toast';
    toast.innerHTML = '這個帳號目前是唯讀狀態。';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
  }

  function xLeftNav() {
    const links = [
      { icon: 'home', label: '首頁', hash: '#/feed' },
      { icon: 'search', label: '搜尋' },
      { icon: 'bell', label: '通知', dot: true },
      { icon: 'mail', label: '訊息' },
      { icon: 'bookmark', label: '書籤' },
      { icon: 'list', label: '清單' },
      { icon: 'user', label: '個人資料', hash: '#/profile/yuan' },
      { icon: 'more', label: '更多' },
    ];
    return `
    <div class="x-col-left">
      <div>
        <div class="x-logo">ECHO</div>
        <div class="x-nav-list">
          ${links.map(l => `<div class="x-nav-link ${l.hash ? '' : 'disabled'}" ${l.hash ? `onclick="location.hash='${l.hash}'"` : ''}>
            <span class="icon">${icon(l.icon, 24)}${l.dot ? '<span class="dot"></span>' : ''}</span>
            <span>${l.label}</span>
          </div>`).join('')}
        </div>
        <button class="x-newpost-btn" onclick="App.newPostToast()">${icon('pencil', 18)} 發布貼文</button>
      </div>
      <div class="x-left-footer">© 2026 ECHO<br>${DATA.taglineZh}</div>
    </div>`;
  }

  function xRightRail() {
    const p = DATA.yuanProfile;
    return `
    <div class="x-col-right">
      <div class="x-profile-card">
        <div class="x-profile-card-top">
          <div class="x-avatar-lg"${avatarStyle('yuan')}></div>
          <div style="display:flex; gap:8px; align-items:center">
            <button class="x-follow-btn" onclick="App.toggleFollow(this)">追蹤</button>
            <span style="color:var(--text-dim)">${icon('more', 18)}</span>
          </div>
        </div>
        <div class="name">${p.name}</div>
        <div class="handle">@${p.handle}</div>
        <div class="bio">${esc(p.bio)}</div>
        <div class="joined">${icon('calendar', 15)} ${esc(p.joined)}</div>
        <div class="stats"><span><b>${p.following}</b> 追蹤中</span><span><b>${p.followers}</b> 位粉絲</span></div>
      </div>
      <div class="x-trends-card">
        <div class="x-trends-head"><span>為你推薦的熱門話題</span>${icon('more', 18)}</div>
        ${DATA.trends.map((t, i) => `
          <div class="x-trend-item">
            <div><div class="meta">${i + 1} · 熱門話題</div><div class="tag">${esc(t.tag)}</div><div class="count">${esc(t.count)} 則貼文</div></div>
            <span style="color:var(--text-dim)">${icon('more', 16)}</span>
          </div>`).join('')}
        <div class="x-trends-more">顯示更多</div>
      </div>
      <div class="x-footer-links">
        <span>服務條款</span><span>隱私權</span><span>Cookie</span><span>關於</span><span>說明</span>
        <span>狀態</span><span>資源</span><span>職缺</span><span>廣告資訊</span><span>更多⋯</span>
        <span>© 2026 ECHO, Inc.</span>
      </div>
    </div>`;
  }

  function viewFeed() {
    return `
    <div class="view x-shell">
      ${xLeftNav()}
      <div class="x-col-center">
        <div class="x-feed-header">
          <div class="title">首頁</div>
          ${icon('sparkle', 20)}
        </div>
        <div class="x-tabs">
          <div class="x-tab active">為你推薦</div>
          <div class="x-tab">追蹤中</div>
        </div>
        ${DATA.feed.slice().reverse().map(xPostHtml).join('')}
      </div>
      ${xRightRail()}
    </div>
    ${bottomNav()}`;
  }

  /* ================================================================
     SCREEN 05 — Profile (@last_seen_0917)
     ================================================================ */
  function viewYuanProfile() {
    const p = DATA.yuanProfile;
    return `
    <div class="view view-narrow">
      ${backLink('#/feed', '動態')}
      <div class="profile-head">
        <div class="profile-avatar"${avatarStyle('yuan')}></div>
        <div class="post-name">${p.name}</div>
        <div class="post-handle">@${p.handle}</div>
        <div class="bio-hover profile-bio">${esc(p.bio)}<div class="reveal-tip">${esc(p.bioHoverReveal)}</div></div>
        <div class="profile-status">${p.posts} 篇貼文 · 追蹤中 ${p.following} · 粉絲 ${p.followers}</div>
      </div>
      <div class="evidence-data" style="margin-top:10px">
        <div class="row"><span class="k">帳號狀態</span></div>
        <div class="row"><span class="k">最後活動</span><span class="v">${p.lastActive}</span></div>
      </div>
      <button class="btn" style="margin-top:20px" onclick="location.hash='#/feed'">[ 查看貼文 ]</button>
    </div>
    ${bottomNav()}`;
  }

  /* ================================================================
     SCREEN 06/07/08 — Post #17 + Replies + Hidden reply
     ================================================================ */
  function commentHtml(c) {
    if (c.hidden) return '';
    const cls = ['comment']; if (c.suspicious) cls.push('suspicious');
    return `<div class="${cls.join(' ')}"><div class="h">@${esc(c.user)} <span class="dim">· ${esc(c.time)}</span></div><div>${nl(c.text)}</div></div>`;
  }
  function commentsForPost(p) {
    return DATA.postComments[p.id] || [];
  }
  function viewPost(id) {
    const p = DATA.feed.find(x => x.id === id);
    if (!p) return `<div class="view view-narrow">找不到這則貼文 ${backLink('#/feed','動態')}</div>`;

    let body = `
    <div class="view view-narrow">
      ${backLink('#/feed', '動態')}
      <div class="post" style="border-bottom:none;padding-top:0">
        <div class="post-head">
          <div class="avatar"${avatarStyle('yuan')}></div>
          <div><div class="post-name">YUAN（林予安）</div><div class="post-handle">@last_seen_0917</div></div>
        </div>
        <div class="post-body">${nl(p.text)}</div>
        ${p.image === 'conbini'
          ? `<img class="post-img" style="cursor:pointer" src="${img(p.image)}" alt="" onclick="location.hash='#/photo/02'">`
          : (p.image ? `<img class="post-img" src="${img(p.image)}" alt="">` : '')}
        ${p.isLast ? `<div class="post-countdown mono">23:17:42</div>` : ''}
        <div class="post-time mono">${p.time}${p.image === 'conbini' ? ` · <span class="post-edited" onclick="App.toggleEdited()">已編輯</span>` : ''}</div>
        ${p.image === 'conbini' && window.__editedOpen ? `<div class="post-edited-detail mono dim">修改時間 ${esc(DATA.evidencePhoto.modified)}</div>` : ''}
        <div class="post-meta">
          <span class="m-item">${icon('reply', 16)} ${p.isLast ? (window.__hiddenOpen ? 19 : 18) : (p.replies || 0)}</span>
          <span class="m-item">${icon('repost', 16)} ${p.reposts || 0}</span>
          <span class="m-item">${icon('heart', 16)} ${p.likes || 0}</span>
          <span class="m-item">${icon('share', 16)}</span>
        </div>
      </div>`;

    if (p.isLast) {
      const visible = DATA.comments17.filter(c => !c.hidden);
      body += `<div class="comments">${visible.map(commentHtml).join('')}</div>`;

      body += `<div style="margin-top:2px">`;
      if (window.__hiddenOpen) {
        const hidden = DATA.comments17.find(c => c.hidden);
        body += `<div class="comment hidden"><div class="h">@<span style="cursor:pointer" onclick="location.hash='#/profile/hui_0917'">${esc(hidden.user)}</span> <span class="dim">· ${esc(hidden.time)}</span></div><div>${nl(hidden.text)}</div></div>`;
      } else {
        body += `<div class="hidden-reply-toggle" onclick="App.revealHidden()">查看更多 1 則回覆</div>`;
      }
      body += `</div>`;
    } else if (p.replies > 0) {
      body += `<div class="comments">${commentsForPost(p).map(commentHtml).join('')}</div>`;
    }

    body += `</div>${bottomNav()}${hintBar(p.isLast && !window.__hiddenOpen ? 'hiddenReply' : null)}`;
    return body;
  }
  function revealHidden() { window.__hiddenOpen = true; render(); }
  function toggleEdited() { window.__editedOpen = !window.__editedOpen; render(); }

  /* ================================================================
     SCREEN 09 — hui_0917（灰）profile
     ================================================================ */
  function viewMProfile() {
    const m = DATA.mProfile;
    return `
    <div class="view view-narrow">
      ${backLink('#/post/17', '最後貼文')}
      <div class="profile-head">
        <div class="profile-avatar avatar-m-mark">灰</div>
        <div class="post-name">${m.name}</div>
        <div class="post-handle">@${m.handle}</div>
        <div class="profile-status">粉絲 ${m.followers} · 追蹤中 ${m.following} · ${m.posts} 篇貼文</div>
      </div>
      <div class="blank-post">${nl(m.post)}<div class="post-time mono" style="margin-top:16px">${m.postDate}</div></div>
      ${STATE.get('timeline') ? `
      <div class="lock-note" style="color:var(--text-dim)">系統偵測到一個關聯帳號，最後互動時間與這篇貼文相近。</div>
      <button class="btn" style="margin-top:12px" onclick="location.hash='#/profile/chen_yc'">[ 查看關聯帳號 → ]</button>`
      : `<div class="lock-note">這個帳號似乎跟其他線索有關，但目前還連不起來。</div>`}
    </div>
    ${bottomNav()}`;
  }

  /* ================================================================
     SCREEN 10/11 — Photo Viewer + Metadata
     ================================================================ */
  let fxState = { bright: false, contrast: false };
  let zoomed = false;
  function viewPhoto() {
    const e = DATA.evidencePhoto;
    const anomalyLabel = STATE.get('photoAnomaly') ? '身分不明人士' : '?';
    return `
    <div class="view view-wide">
      ${backLink('#/feed', '動態')}
      <div class="dash-title">證據 / 照片</div>
      <div class="photo-viewer-layout">
        <div class="photo-viewer-main">
          <div class="evidence-frame">
            <div class="evidence-img-wrap" id="ev-wrap" style="position:relative">
              <img class="evidence-img" id="ev-img" src="${img('conbini')}" alt="">
              <div class="anomaly-tag" style="left:46%; top:52%" onclick="App.inspectAnomaly()">${anomalyLabel}</div>
              <div class="evidence-toolbar">
                <button class="tool-icon-btn" onclick="App.zoomToggle()" title="放大">${icon('zoomIn', 16)}</button>
                <button class="tool-icon-btn" onclick="App.toggleFx('bright')" title="亮度">${icon('sun', 16)}</button>
                <button class="tool-icon-btn" onclick="App.toggleFx('contrast')" title="對比">${icon('contrast', 16)}</button>
                <button class="tool-icon-btn" onclick="App.resetFx()" title="重設">${icon('refresh', 16)}</button>
              </div>
            </div>
          </div>
          ${STATE.get('photoAnomaly') ? `<div class="observation-box">偵測到異常 — 便利商店門口站著一個身分不明的人影，臉部完全隱沒在陰影裡。案件編號正好是 <b class="evidence-color">${esc(e.doorplate)}</b>。</div>` : `<div class="observation-box">你確定你已經看完這張照片了嗎？試著點擊照片中可疑的地方。</div>`}
        </div>
        <div class="photo-viewer-side">
          <div class="metadata-panel">
            <div class="row"><span class="k">檔案</span><span class="v" style="color:var(--text)">${e.id}</span></div>
            <div class="row"><span class="k">建立時間</span><span class="v">${e.created}</span></div>
            <div class="row"><span class="k">修改時間</span><span class="v">${e.modified}</span></div>
            <div class="row"><span class="k">相機</span><span class="v" style="color:var(--text-dim)">${e.camera}</span></div>
            <div class="row"><span class="k">位置</span><span class="v" style="color:var(--text-dim)">${e.location}</span></div>
            <div class="row"><span class="k">裝置</span><span class="v" style="color:var(--text-dim)">${e.device}</span></div>
          </div>
          ${!STATE.get('metadata') ? `<button class="btn" style="margin-top:14px" onclick="App.analyzeMetadata()">[ 分析 ]</button>` : `
          <div class="conflict-banner">${icon('alert', 18)}<div><b>時間線衝突</b><br>有些地方兜不起來。</div></div>
          <button class="btn" style="margin-top:14px" onclick="location.hash='#/timeline'">[ 重建時間線 → ]</button>`}
        </div>
      </div>
    </div>
    ${bottomNav('case', true)}
    ${hintBar(!STATE.get('photoAnomaly') ? 'photo' : null)}`;
  }
  function inspectAnomaly() { STATE.set('photoAnomaly', true); playSolveSfx(); render(); }
  function analyzeMetadata() { STATE.set('metadata', true); playSolveSfx(); render(); }
  function zoomToggle() {
    zoomed = !zoomed;
    const im = document.getElementById('ev-img');
    if (im) im.style.transform = zoomed ? 'scale(1.7) translate(8%, -4%)' : 'scale(1)';
  }
  function toggleFx(type) {
    fxState[type] = !fxState[type];
    const im = document.getElementById('ev-img'); if (!im) return;
    let f = [];
    if (fxState.bright) f.push('brightness(1.6)');
    if (fxState.contrast) f.push('contrast(1.6)');
    im.style.filter = f.join(' ');
  }
  function resetFx() {
    fxState = { bright: false, contrast: false }; zoomed = false;
    const im = document.getElementById('ev-img'); if (!im) return;
    im.style.filter = ''; im.style.transform = 'scale(1)';
  }

  /* ================================================================
     SCREEN 12 — Timeline (horizontal drag track)
     ================================================================ */
  function viewTimeline() {
    if (!STATE.get('metadata')) {
      return `<div class="view view-wide">${backLink('#/photo/02','證據')}<p class="dim mono">已鎖定。請先分析照片的詮釋資料。</p></div>${bottomNav('case', true)}`;
    }
    const solved = STATE.get('timeline');
    const track = DATA.timelineTrack;
    return `
    <div class="view view-wide">
      ${backLink('#/photo/02', '證據')}
      <div class="dash-title">時間線重建</div>
      <p class="dim" style="font-size:13px">IMG_0917 出現在 8/17（週一）的貼文裡，但它實際上是什麼時候被建立的？把它拖到正確的那一天（或按下面的按鈕）。</p>
      <div class="timeline-track">
        ${track.map(day => `
          <div class="tl-day">
            <div class="tl-day-label">${day.day}${day.weekday ? `<span class="dim" style="font-size:11px"> · ${esc(day.weekday)}</span>` : ''}</div>
            ${day.events.map(ev => `<div class="tl-event">${esc(ev)}${ev === '23:17' ? `<span class="tl-event-warn">${icon('alert', 14)}</span>` : ''}</div>`).join('')}
            ${day.day === '08/19' ? `<div class="tl-slot ${solved ? '' : 'drag-over'}" id="tl-slot-0819" ondragover="event.preventDefault()" ondrop="App.dropOnSlot(event)">${solved ? '<span class="evidence-color">IMG_0917</span>' : '拖放到這裡'}</div>` : ''}
          </div>`).join('')}
        ${!solved ? `<div class="tl-day">
          <div class="tl-day-label">未歸位</div>
          <div class="tl-drag-item" id="tl-img-chip" draggable="true" ondragstart="App.dragImgStart(event)">IMG_0917</div>
          <button class="tool-btn" style="margin-top:10px" onclick="App.moveImgToSlot()">[ 移動到 08/19 → ]</button>
        </div>` : ''}
      </div>
      ${solved ? `<div class="timeline-conflict-box">${icon('alert', 20)}<div><b>時間線衝突</b><br>這張照片出現在 8/17（週一）的貼文裡，但檔案的建立時間卻是 8/19（週三）——比它被貼出來的時間還晚了兩天。<br><br><b>有人動過這個封存庫。</b></div></div>
      <div class="lock-note">有人在失蹤之後，仍然可以使用她的帳號 → <span class="evidence-color" style="cursor:pointer" onclick="location.hash='#/post/17'">回到貼文</span></div>` : ''}
    </div>
    ${bottomNav('case', true)}
    ${hintBar(!solved ? 'timeline' : null)}`;
  }
  function dragImgStart(ev) { ev.dataTransfer.setData('text/plain', 'img0917'); }
  function dropOnSlot(ev) { ev.preventDefault(); solveTimeline(); }
  function moveImgToSlot() { solveTimeline(); }
  function solveTimeline() { if (!STATE.get('timeline')) playSolveSfx(); STATE.set('timeline', true); render(); }

  /* ================================================================
     SCREEN 13/14/15 — Chen profile / Deleted Archive / Access Prompt
     ================================================================ */
  function viewChenProfile() {
    if (!STATE.get('timeline')) {
      return `<div class="view view-narrow">${backLink('#/feed','動態')}<p class="dim mono">找不到這個帳號。</p></div>${bottomNav()}`;
    }
    STATE.set('chenVisited', true);
    const c = DATA.chenProfile;
    let body = `
    <div class="view view-narrow">
      ${backLink('#/profile/hui_0917', '@hui_0917')}
      <div class="profile-head">
        <div class="profile-avatar"${avatarStyle('chen')}></div>
        <div class="post-name">${c.name}</div>
        <div class="post-handle">@${c.handle}</div>
        <div class="profile-status warn">${c.status}</div>
        <div class="profile-bio">${esc(c.bio)}</div>
        <div class="profile-status">${c.posts} 篇貼文</div>
      </div>
      <div class="blank-post" style="text-align:left">${nl(c.lastPost.text)}<div class="post-time mono" style="margin-top:10px">${c.lastPost.time}</div></div>
      <div class="label" style="margin-top:24px">已封存的貼文</div>
      <div class="deleted-list">
        ${c.archived.map(a => {
          if (a.highlight && !STATE.get('access')) {
            return `<div class="deleted-item highlight" onclick="App.openAccessPrompt()"><span>${a.title}</span><span style="display:flex;align-items:center;gap:8px">${esc(a.time)} ${icon('lock', 14)}</span></div>`;
          }
          if (a.highlight && STATE.get('access')) {
            return `<div class="deleted-item"><span>案件檔案 #0917</span><span class="evidence-color" style="cursor:pointer" onclick="location.hash='#/case/0917'">已解鎖 →</span></div>`;
          }
          return `<div class="deleted-item"><span>${a.title}</span><span>${a.id.toString().padStart(2,'0')}</span></div>`;
        }).join('')}
      </div>
      <div id="access-prompt-slot"></div>
    </div>
    ${bottomNav()}
    ${hintBar(!STATE.get('access') ? 'accessPrompt' : null)}`;
    return body;
  }
  function openAccessPrompt() {
    const slot = document.getElementById('access-prompt-slot');
    if (!slot) return;
    const ap = DATA.accessPrompt;
    slot.innerHTML = `
    <div class="access-prompt-box">
      <div class="ap-lock-icon">${icon('lock', 28)}</div>
      <div class="ap-title">封存權限受限</div>
      <div class="ap-id">內容編號 · ${esc(ap.contentId)}</div>
      <div class="ap-required">需要驗證存取權限</div>
      <div class="ap-question">${nl(ap.question)}</div>
      <div class="archive-input-row">
        <input class="archive-input mono" id="ans-access" placeholder="……" autocomplete="off">
        <button class="archive-submit" onclick="App.submitAccess()">送出</button>
      </div>
      <div class="access-msg" id="msg-access"></div>
    </div>`;
  }
  function submitAccess() {
    const el = document.getElementById('ans-access');
    const msg = document.getElementById('msg-access');
    if (checkIn(DATA.accessPrompt.answers, el.value)) {
      STATE.set('access', true);
      playSolveSfx();
      msg.className = 'access-msg granted';
      msg.innerHTML = '存取權限已授予。<br><span style="font-size:12px">案件檔案 #0917 已解鎖</span>';
      setTimeout(render, 900);
    } else {
      msg.className = 'access-msg denied';
      msg.textContent = '存取遭拒。封存系統無法辨識這個答案，再試一次。';
    }
  }

  /* ================================================================
     SCREEN 16 — Case File (full)
     ================================================================ */
  let caseRevisitOpen = false;
  function toggleCaseRevisit() { caseRevisitOpen = !caseRevisitOpen; render(); }
  function viewCaseFile() {
    if (!STATE.get('access')) {
      return `<div class="view view-wide">${backLink('#/case-overview','案件概覽')}<p class="dim mono">案件檔案已鎖定。</p></div>${bottomNav('case', true)}`;
    }
    const cf = DATA.caseFile;
    const level2 = STATE.get('case0917Level2Unlocked');
    const rv = DATA.ch2.case0917Revisit;
    const cfNav = [
      { label: '總覽', active: true },
      { label: '證據板', count: 1, hash: '#/evidence-board' },
      { label: '時間線', hash: STATE.get('metadata') ? '#/timeline' : null },
      { label: '相關人物', count: cf.related.length },
    ];
    return `
    <div class="view view-wide">
      ${backLink('#/case-overview', '案件概覽')}
      <div class="case-file-layout">
        <div class="board-sidebar">
          ${cfNav.map(n => `<div class="board-cat-item ${n.active ? 'active' : ''} ${n.hash ? '' : 'inert'}" ${n.hash ? `onclick="location.hash='${n.hash}'"` : ''}><span>${n.label}</span>${n.count !== undefined ? `<span class="count">${n.count}</span>` : ''}</div>`).join('')}
        </div>
        <div class="board-main">
          <div class="dash-title">案件檔案 ${cf.id}${level2 ? ` <span class="dim mono" style="font-size:11px">· 存取層級 02</span>` : ''}</div>
          <div class="overview-grid">
            <div>
              <div class="overview-field"><div class="k">關係人</div><div class="v">${cf.subject}</div></div>
              <div class="overview-field"><div class="k">年齡</div><div class="v">${cf.age}</div></div>
              <div class="overview-field"><div class="k">狀態</div><div class="v warn">${cf.status}</div></div>
              <div class="overview-field"><div class="k">最後出現</div><div class="v">${cf.lastSeenDate}<br>${cf.lastSeenTime}</div></div>
              <div class="overview-field"><div class="k">地點</div><div class="v">${cf.location}</div></div>
              ${STATE.get('audio') ? `<div class="overview-field"><div class="k">調查者</div><div class="v evidence-color" style="cursor:pointer" onclick="location.hash='#/investigator'">灰 →</div></div>`
                : `<div class="overview-field"><div class="k">調查者</div><div class="v" style="color:var(--text-dim)">身分不明</div></div>`}
              ${level2 && caseRevisitOpen ? `<div class="dim mono" style="font-size:11px;margin-top:-8px">原始值：身分不明<br>修改者：灰-128</div>` : ''}
              ${level2 ? `<div class="overview-field clickable" style="cursor:pointer" onclick="App.toggleCaseRevisit()"><div class="k">封存關聯</div><div class="v evidence-color">灰-128</div></div>` : ''}
            </div>
            <div>
              <div class="overview-field"><div class="k">相關人物</div></div>
              ${cf.related.map(r => `<div class="related-item"><span class="name">${esc(r.name)}</span><span class="status">${r.status}</span></div>`).join('')}
              <div class="overview-field" style="margin-top:20px"><div class="k">數位活動</div></div>
              <div class="digital-activity-row">${cf.digitalActivity.map(t => `<div class="da-chip mono">${esc(t)}</div>`).join('')}</div>
            </div>
          </div>
          ${level2 && caseRevisitOpen ? `
          <div class="metadata-panel" style="margin-top:20px;max-width:420px">
            <div class="row"><span class="k">關聯封存</span><span class="v">灰-128</span></div>
            <div class="row"><span class="k">首次關聯</span><span class="v">${esc(rv.firstLinked)}</span></div>
            <div class="row"><span class="k">最後修改</span><span class="v">${esc(rv.lastModified)}</span></div>
          </div>
          <div class="observation-box warn" style="margin-top:14px;max-width:420px">封存備註 · 偵測到 1 次修改<br>「${esc(rv.note)}」</div>
          <button class="btn" style="margin-top:14px;max-width:360px" onclick="location.hash='#/grey/128/versions'">[ 查看封存版本 → ]</button>` : ''}
          <button class="overview-pill" style="margin-top:24px" onclick="location.hash='#/evidence-board'">證據板 <span class="arrow">→</span></button>
        </div>
      </div>
    </div>
    ${bottomNav('case', true)}`;
  }

  /* ================================================================
     SCREEN 17 — Evidence Board
     ================================================================ */
  let boardLinks = []; // array of [id,id]
  let boardSelected = null;
  let boardHelpOpen = false;
  function linkKey(a, b) { return [a, b].sort().join('|'); }
  function hasLink(a, b) { return boardLinks.some(l => linkKey(l[0], l[1]) === linkKey(a, b)); }
  function isCorrectLink(a, b) { return DATA.evidenceBoardCorrectLinks.some(l => linkKey(l[0], l[1]) === linkKey(a, b)); }

  function viewBoard() {
    if (!STATE.get('access')) {
      return `<div class="view view-wide">${backLink('#/case/0917','案件檔案')}<p class="dim mono">已鎖定。</p></div>${bottomNav('board', true)}`;
    }
    const solved = STATE.get('board');
    const nodes = DATA.evidenceBoardNodes;
    const timeCount = DATA.timelineTrack.reduce((n, d) => n + d.events.length, 0);
    const categories = [
      { label: '照片', count: 1, hash: '#/photo/02' },
      { label: '貼文', count: DATA.feed.length, hash: '#/feed' },
      { label: '錄音', count: 1, hash: solved ? '#/evidence/audio' : null },
      { label: '人物', count: 3, hash: null },
      { label: '時間點', count: timeCount, hash: null },
    ];
    return `
    <div class="view view-wide">
      ${backLink('#/case/0917', '案件檔案')}
      <div class="board-layout">
        <div class="board-sidebar">
          <div class="dash-nav-title">證據分類</div>
          ${categories.map(c => `<div class="board-cat-item ${c.hash ? '' : 'inert'}" ${c.hash ? `onclick="location.hash='${c.hash}'"` : ''}><span>${c.label}</span><span class="count">${c.count}</span></div>`).join('')}
        </div>
        <div class="board-main">
          <div class="dash-title">證據板</div>
          <div class="board-toolbar">
            <button class="tool-btn" onclick="App.resetBoard()">[ 重設連線 ]</button>
            <button class="tool-btn" onclick="App.toggleBoardHelp()">${boardHelpOpen ? '[ 關閉說明 ]' : '[ 怎麼用？ ]'}</button>
          </div>
          ${boardHelpOpen ? `<div class="observation-box">依序點選任兩張卡片，它們就會連在一起；再點一次同一組可以取消連線。<br>試著找出正確的因果關係鏈，不是隨便連連看——順序跟方向都有意義。<br>紅線代表這條連線還沒被確認正確，連對的線會變成綠色。</div>` : ''}
          <div class="board-canvas" id="board-canvas">
            <svg class="board-svg">${boardLinks.map(l => {
              const a = nodes.find(n => n.id === l[0]), b = nodes.find(n => n.id === l[1]);
              if (!a || !b) return '';
              const correct = isCorrectLink(l[0], l[1]);
              return `<line x1="${a.x}%" y1="${a.y + 3}%" x2="${b.x}%" y2="${b.y + 3}%" class="${correct ? 'correct' : ''}"/>`;
            }).join('')}</svg>
            ${nodes.map(n => `
              <div class="board-node ${boardSelected === n.id ? 'selected' : ''}" style="left:${n.x}%; top:${n.y}%" onclick="App.selectBoardNode('${n.id}')">${esc(n.label)}</div>`).join('')}
          </div>
          <div class="board-status ${solved ? 'detected' : ''}" id="board-status">
            ${solved ? `${icon('check', 16)}<div>偵測到關聯模式<br>錄音證據已解鎖</div>` : ''}
          </div>
          ${solved ? `<button class="btn" style="margin-top:14px;max-width:380px" onclick="location.hash='#/evidence/audio'">[ 查看錄音證據 ]</button>` : ''}
        </div>
      </div>
    </div>
    ${bottomNav('board', true)}
    ${hintBar(!solved ? 'board' : null)}`;
  }
  function selectBoardNode(id) {
    if (boardSelected === null) { boardSelected = id; render(); return; }
    if (boardSelected === id) { boardSelected = null; render(); return; }
    const a = boardSelected, b = id;
    if (hasLink(a, b)) {
      boardLinks = boardLinks.filter(l => linkKey(l[0], l[1]) !== linkKey(a, b));
    } else {
      boardLinks.push([a, b]);
    }
    boardSelected = null;
    checkBoardSolved();
    render();
  }
  function checkBoardSolved() {
    const allCorrect = DATA.evidenceBoardCorrectLinks.every(l => hasLink(l[0], l[1]));
    if (allCorrect) {
      if (!STATE.get('board')) playSolveSfx();
      STATE.set('board', true);
    }
  }
  function resetBoard() { boardLinks = []; boardSelected = null; render(); }
  function toggleBoardHelp() { boardHelpOpen = !boardHelpOpen; render(); }

  /* ================================================================
     SCREEN 18 — Audio Evidence
     ================================================================ */
  let audioMuted = false;
  function viewAudio() {
    if (!STATE.get('board')) {
      return `<div class="view view-wide">${backLink('#/evidence-board','證據板')}<p class="dim mono">已鎖定。</p></div>${bottomNav('board', true)}`;
    }
    const a = DATA.audioEvidence;
    const bars = Array.from({ length: 40 }, (_, i) => 6 + Math.round(Math.sin(i * 0.7) * 10 + 12));
    return `
    <div class="view view-wide">
      ${backLink('#/evidence-board', '證據板')}
      <div class="audio-evidence-box">
        <div class="audio-evidence-id">${a.id} · 錄音</div>
        <div class="waveform" id="waveform">${bars.map(h => `<div class="bar" style="height:${h}px"></div>`).join('')}</div>
        <div class="audio-time-row mono"><span>00:00</span><span>${a.duration}</span></div>
        ${!STATE.get('audio') ? `<button class="audio-play-btn" onclick="App.playAudio()">▶</button>
        <div class="tool-btn" style="margin:10px auto 0;width:fit-content" onclick="App.toggleAudioMute()">${audioMuted ? '[ 取消靜音 ]' : '[ 靜音 ]'}</div>` : ''}
        <div class="audio-transcript" id="audio-transcript">${STATE.get('audio') ? a.transcript.map(transcriptLineHtml).join('') : ''}</div>
        ${STATE.get('audio') ? `<div class="lock-note">錄音已轉成逐字稿<br>偵測到 1 個身分不明的關係人。</div>
        <button class="btn" style="max-width:360px;margin:16px auto 0" onclick="location.hash='#/case/0917'">[ 回到案件檔案 ]</button>` : ''}
      </div>
    </div>
    ${bottomNav('board', true)}`;
  }
  function toggleAudioMute() { audioMuted = !audioMuted; render(); }
  function transcriptLineHtml(l) {
    return `<div class="line${l.warn ? ' warn-line' : ''}"><span>${esc(l.line)}</span><span class="t mono">${esc(l.t)}</span></div>`;
  }
  function parseTimestamp(t) {
    const [m, s] = t.split(':').map(Number);
    return m * 60 + s;
  }
  function playAudio() {
    const wf = document.getElementById('waveform');
    const box = document.getElementById('audio-transcript');
    const transcript = DATA.audioEvidence.transcript;
    if (box) box.innerHTML = '';
    if (wf) wf.classList.add('playing');
    const shown = new Set();
    const audio = new Audio(DATA.audioEvidence.src);
    audio.muted = audioMuted;
    audio.addEventListener('timeupdate', () => {
      transcript.forEach((l, i) => {
        if (!shown.has(i) && audio.currentTime >= parseTimestamp(l.t)) {
          shown.add(i);
          if (box) box.insertAdjacentHTML('beforeend', transcriptLineHtml(l));
        }
      });
    });
    audio.addEventListener('ended', () => {
      if (wf) wf.classList.remove('playing');
      STATE.set('audio', true);
      render();
    });
    audio.play();
  }

  /* ================================================================
     SCREEN 19/20/21/22/23 — Investigator → 灰-129 → Final message
     ================================================================ */
  function viewInvestigator() {
    if (!STATE.get('audio')) {
      return `<div class="view view-wide">${backLink('#/case/0917','案件檔案')}<p class="dim mono">已鎖定。</p></div>${bottomNav('m', true)}`;
    }
    if (!STATE.get('final')) {
      return `
      <div class="view view-wide">
        <div class="investigator-reveal">
          <div class="label">調查者檔案</div>
          <div class="big">灰</div>
          <div class="id-line" id="total-inv">調查者總數<br>128</div>
          <button class="btn" style="margin-top:30px;max-width:340px" onclick="App.finalReveal()">[ 進入 ]</button>
        </div>
      </div>
      ${bottomNav('m', true)}`;
    }
    return `<div class="view view-wide"><div class="investigator-reveal" id="m-sequence"></div></div>`;
  }

  function finalReveal() {
    document.getElementById('app').innerHTML = `<div class="view view-wide"><div class="investigator-reveal" id="m-sequence"></div></div>`;
    runMSequence();
  }

  function runMSequence() {
    const el = document.getElementById('m-sequence');
    if (!el) return;
    el.innerHTML = `<div class="label">調查者檔案</div><div class="big">灰</div><div class="id-line">調查者總數</div><div class="big" id="counter">128</div>`;
    setTimeout(() => {
      const counter = document.getElementById('counter');
      if (counter) counter.textContent = '129';
      setTimeout(() => {
        renderInvestigatorFinal();
        setTimeout(showFinalMessages, 1400);
      }, 900);
    }, 1000);
  }

  function renderInvestigatorFinal() {
    const el = document.getElementById('m-sequence');
    if (!el) return;
    el.className = 'investigator-final';
    el.innerHTML = `
      <div class="investigator-panel">
        <div class="label">調查者</div>
        <div class="big-id evidence-color">灰-${STATE.investigatorId()}</div>
        <div class="inv-row"><span class="k">狀態</span><span class="v warn">進行中</span></div>
        <div class="inv-row"><span class="k">調查開始於</span><span class="v mono">${formatElapsed(STATE.elapsedMs())} 前</span></div>
      </div>
      <div class="message-panel">
        <div class="mp-title">新訊息 <span class="dim">· @last_seen_0917</span></div>
        <div class="mp-body" id="mp-body"></div>
      </div>`;
  }

  function showFinalMessages() {
    const box = document.getElementById('mp-body');
    typeMessages(box, DATA.finalMessages, () => setTimeout(showChapterComplete, 1000));
  }

  function showChapterComplete() {
    const div = document.createElement('div');
    div.className = 'ending-screen';
    div.innerHTML = `<div class="label">案件 #0917</div><div style="height:6px"></div><div class="label">調查</div><div style="font-size:16px;color:var(--warning)">進行中</div>`;
    document.body.appendChild(div);
    setTimeout(() => {
      div.innerHTML = `<div class="big" style="font-size:22px;letter-spacing:0.14em">第一章</div><div class="big" style="font-size:26px;color:var(--evidence)">23:17</div><div class="label">完成</div>`;
      setTimeout(() => {
        div.innerHTML = `<div class="label">下一步指示</div><div style="margin-top:14px;font-size:15px;line-height:2">不要再找林予安了。<br><b>去找灰。</b></div>`;
        setTimeout(() => {
          div.remove();
          STATE.set('final', true);
          location.hash = '#/recap/1';
        }, 2600);
      }, 2400);
    }, 2200);
  }

  /* ================================================================
     CHAPTER 02 — SCREEN 02 — Grey Database（Puzzle 01）
     ================================================================ */
  function ch2Locked() {
    return `<div class="view view-wide">${backLink('#/archive','封存庫')}<p class="dim mono">存取遭拒。</p></div>${bottomNav('archive', true)}`;
  }

  /* ================================================================
     CHAPTER 02 — SCREEN 01 — Chapter 02 Entry
     ================================================================ */
  function viewCh2Entry() {
    if (!STATE.get('final')) return ch2Locked();
    return `
    <div class="view view-wide">
      ${backLink('#/archive', '封存庫')}
      <div class="dash-title">案件 #0917 · 調查未完</div>
      <p class="dim mono" style="margin-top:10px">灰-${esc(STATE.investigatorId())}</p>
      <p class="dim" style="margin-top:16px;max-width:420px">案件並未結案。系統裡還有一長串編號，等著被打開。</p>
      <button class="btn" style="margin-top:24px;max-width:320px" onclick="location.hash='#/grey-database'">[ 進入 ]</button>
    </div>
    ${bottomNav('m', true)}`;
  }

  function greyCreatedRank(id) { return (id * 53 + 17) % 130; }
  function greyCreatedDate(id) {
    const base = new Date(2024, 0, 1).getTime();
    const d = new Date(base + greyCreatedRank(id) * 3 * 86400000);
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
  }
  let greySortMode = 'id';
  function viewGreyDatabase() {
    if (!STATE.get('final')) return ch2Locked();
    const you = parseInt(STATE.investigatorId(), 10);
    let ids = Array.from({ length: DATA.ch2.greyTotal }, (_, i) => i);
    const youInRange = you < DATA.ch2.greyTotal;
    if (!youInRange) ids.push(you); // 你的編號可能落在標準列表範圍之外，仍要顯示
    const ch3Active = STATE.get('ch2Final');
    if (ch3Active && !ids.includes(130)) ids.push(130);
    if (greySortMode === 'created') {
      ids = ids.slice().sort((a, b) => {
        const ra = (a === you && !youInRange) ? Infinity : (a === 130 ? Infinity : greyCreatedRank(a));
        const rb = (b === you && !youInRange) ? Infinity : (b === 130 ? Infinity : greyCreatedRank(b));
        return ra - rb;
      });
    }
    const rows = ids.map(id => {
      const label = `灰-${String(id).padStart(3, '0')}`;
      const isYou = id === you;
      const isNew = id === 130;
      const clickable = id === 128 || id === 0 || isYou || isNew;
      const cls = ['cf-row']; if (clickable) cls.push('clickable');
      const onclick = id === 128 ? `onclick="location.hash='#/grey/128'"` : id === 0 ? `onclick="location.hash='#/grey/000'"` : isNew ? `onclick="location.hash='#/grey/130'"` : isYou ? `onclick="location.hash='#/grey/me'"` : '';
      const dateTag = greySortMode === 'created'
        ? `<span class="dim mono" style="font-size:12px;margin-right:10px">${(isYou || isNew) ? '剛剛建立' : greyCreatedDate(id)}</span>`
        : '';
      const irregularTag = (greySortMode === 'created' && id === 0)
        ? `<span class="irregular-tag" title="封存位置已改變">! 異常</span>`
        : '';
      const newTag = isNew ? `<span class="irregular-tag" title="新建立的封存">! 新</span>` : '';
      return `<div class="${cls.join(' ')}" ${onclick}><span class="k">${label}</span><span>${newTag}${irregularTag}${dateTag}<span class="v ${isYou ? 'evidence-color' : ''}">${isYou ? '你' : '存取遭拒'}</span></span></div>`;
    }).join('');
    return `
    <div class="view view-wide">
      ${backLink('#/archive', '封存庫')}
      <div class="dash-title">灰資料庫</div>
      <div class="dim mono" style="font-size:12px;letter-spacing:0.04em;margin-top:8px">注意<br>紀錄可能不是依照時間先後排列。</div>
      <div class="board-toolbar" style="margin-top:14px">
        <button class="tool-btn ${greySortMode === 'id' ? 'active' : ''}" onclick="App.setGreySort('id')">[ 依編號 ]</button>
        <button class="tool-btn ${greySortMode === 'created' ? 'active' : ''}" onclick="App.setGreySort('created')">[ 依建立時間 ]</button>
      </div>
      ${greySortMode === 'created' ? `<div class="dim mono" style="font-size:12px;margin-top:10px">紀錄順序已更新<br>1 筆紀錄改變了位置。</div>` : ''}
      <div class="case-file" style="margin-top:10px;max-width:520px;max-height:520px;overflow-y:auto">${rows}</div>
    </div>
    ${hintBar(!STATE.get('ch2Puzzle01Solved') ? 'ch2Puzzle01' : null)}
    ${bottomNav('m', true)}`;
  }
  function setGreySort(mode) {
    greySortMode = mode;
    if (mode === 'created') {
      if (!STATE.get('ch2Puzzle01Solved')) playSolveSfx();
      STATE.set('ch2Puzzle01Solved', true);
    }
    render();
  }

  /* ================================================================
     CHAPTER 02 — SCREEN 03 — Grey Profile（玩家自己）
     ================================================================ */
  function viewGreyProfileSelf() {
    if (!STATE.get('final')) return ch2Locked();
    const id = STATE.investigatorId();
    return `
    <div class="view view-wide">
      ${backLink('#/grey-database', '灰資料庫')}
      <div class="dash-title">灰-${esc(id)}</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        <div class="cf-row"><span class="k">狀態</span><span class="v">使用中</span></div>
        <div class="cf-row"><span class="k">建立時間</span><span class="v">剛剛建立</span></div>
        <div class="cf-row"><span class="k">連線時長</span><span class="v">${formatElapsed(STATE.elapsedMs())}</span></div>
      </div>
      <p class="dim" style="margin-top:16px;max-width:420px">你也是這串編號裡的一個。</p>
    </div>
    ${bottomNav('m', true)}`;
  }

  /* ================================================================
     CHAPTER 02 — SCREEN 04/05/06 — Grey-128（Puzzle 02）
     ================================================================ */
  function viewGrey128Overview() {
    if (!STATE.get('final')) return ch2Locked();
    const g = DATA.ch2.grey128;
    return `
    <div class="view view-wide">
      ${backLink('#/grey-database', '灰資料庫')}
      <div class="dash-title">灰-128</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        <div class="cf-row"><span class="k">狀態</span><span class="v">已停用</span></div>
        <div class="cf-row"><span class="k">最後活動</span><span class="v">${esc(g.lastActivity)}</span></div>
      </div>
      <button class="btn" style="margin-top:20px;max-width:320px" onclick="location.hash='#/grey/128/archive'">[ 進入封存 ]</button>
    </div>
    ${bottomNav('m', true)}`;
  }
  let checksumOpen = false;
  function viewGrey128Archive() {
    if (!STATE.get('final')) return ch2Locked();
    const g = DATA.ch2.grey128;
    return `
    <div class="view view-wide">
      ${backLink('#/grey/128', '灰-128')}
      <div class="dash-title">灰-128 · 封存</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        ${g.indexEntries.map(e => `<div class="cf-row"><span class="k">${e.id} ${esc(e.label)}</span><span class="v missing">已刪除</span></div>`).join('')}
        <div class="cf-row"><span class="k">檔案大小</span><span class="v">12.4 MB</span></div>
        <div class="cf-row"><span class="k">帳號雜湊</span><span class="v mono">${esc(g.accountHash)}</span></div>
      </div>
      ${!checksumOpen
        ? `<button class="tool-btn" style="margin-top:14px" onclick="App.toggleChecksum()">[ 查看校驗碼 ]</button>`
        : `<div class="metadata-panel" style="margin-top:14px;max-width:420px">
             <div class="row"><span class="k">預期雜湊</span><span class="v">${g.checksumExpected}</span></div>
             <div class="row"><span class="k">封存雜湊</span><span class="v">${g.checksumArchive}</span></div>
             <div class="row"><span class="k">比對結果</span><span class="v" style="color:var(--success)">相符</span></div>
           </div>
           <div class="dim mono" style="font-size:12px;margin-top:10px">結構完整</div>`}
      <button class="btn" style="margin-top:20px;max-width:320px" onclick="location.hash='#/grey/128/integrity'">[ 查看索引 → ]</button>
    </div>
    ${bottomNav('m', true)}`;
  }
  function toggleChecksum() { checksumOpen = !checksumOpen; render(); }

  let openedIndexEntries = {};
  function viewFileIntegrity() {
    if (!STATE.get('final')) return ch2Locked();
    const g = DATA.ch2.grey128;
    const rows = g.indexEntries.map(e => {
      const opened = !!openedIndexEntries[e.id];
      const missing = opened && e.body === 'MISSING';
      const bodyZh = e.body === 'MISSING' ? '缺失' : '存在';
      const valueText = opened
        ? `內容：${bodyZh}${missing ? ` <span class="irregular-tag" title="內容無法讀取">!</span>` : ''}`
        : '標頭：存在 · 索引：存在';
      const note = missing ? `<div class="dim mono" style="font-size:11px;padding:2px 16px 10px">內容無法讀取，索引仍存在</div>` : '';
      return `<div><div class="cf-row clickable" onclick="App.openIndexEntry('${e.id}')"><span class="k">${e.id} ${esc(e.label)}</span><span class="v ${missing ? 'missing' : ''}">${valueText}</span></div>${note}</div>`;
    }).join('');
    const solved = STATE.get('ch2Puzzle02Solved');
    return `
    <div class="view view-wide">
      ${backLink('#/grey/128/archive', '灰-128 封存')}
      <div class="dash-title">檔案完整性</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">${rows}</div>
      ${solved ? `<div class="observation-box" style="margin-top:14px">標頭完整、索引還在，但 02、03 的內容都消失了——有人只清掉了內容，卻沒有清掉索引。</div>
      <button class="btn" style="margin-top:14px;max-width:360px" onclick="location.hash='#/grey/128/chen'">[ 繼續調查 → ]</button>` : ''}
    </div>
    ${hintBar(!solved ? 'ch2Puzzle02' : null)}
    ${bottomNav('m', true)}`;
  }
  function openIndexEntry(id) {
    openedIndexEntries[id] = true;
    if (openedIndexEntries['02'] && openedIndexEntries['03']) {
      if (!STATE.get('ch2Puzzle02Solved')) playSolveSfx();
      STATE.set('ch2Puzzle02Solved', true);
    }
    render();
  }

  /* ================================================================
     CHAPTER 02 — SCREEN 07/08 — Chen Archive / Fragment Reconstruction（Puzzle 03）
     ================================================================ */
  function viewChenArchive() {
    if (!STATE.get('ch2Puzzle02Solved')) return ch2Locked();
    return `
    <div class="view view-wide">
      ${backLink('#/grey/128/archive', '灰-128 封存')}
      <div class="dash-title">陳奕辰 · 封存</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        <div class="cf-row"><span class="k">姓名</span><span class="v">陳奕辰</span></div>
        <div class="cf-row"><span class="k">帳號</span><span class="v">@chen_yc</span></div>
      </div>
      <div class="observation-box" style="margin-top:14px">系統偵測到跟這個帳號有關的資料不只一份，而且彼此不完整。</div>
      <button class="btn" style="margin-top:20px;max-width:360px" onclick="location.hash='#/grey/128/fragments'">[ 查看殘缺資料 → ]</button>
    </div>
    ${bottomNav('m', true)}`;
  }

  let fragSelected = null;
  let fragConnections = { device: false, account: false };
  let fragMessage = '';
  let fragMessageOk = false;
  function fragmentChipHtml(fragKey, idx) {
    const row = DATA.ch2.fragments[fragKey].rows[idx];
    const isSelected = fragSelected && fragSelected.fragKey === fragKey && fragSelected.idx === idx;
    const isConnected = (row.type === 'device' && fragConnections.device) || (row.type === 'account' && fragConnections.account);
    const cls = ['cf-row', 'clickable'];
    if (isSelected) cls.push('active');
    return `<div class="${cls.join(' ')}" onclick="App.selectFragmentChip('${fragKey}',${idx})"><span class="k">${esc(row.field)}</span><span class="v ${isConnected ? '' : ''}" style="${isConnected ? 'color:var(--success)' : ''}">${esc(row.value)}</span></div>`;
  }
  function viewFragmentReconstruction() {
    if (!STATE.get('ch2Puzzle02Solved')) return ch2Locked();
    const solved = STATE.get('ch2Puzzle03Solved');
    const frags = DATA.ch2.fragments;
    const cardHtml = (key) => `
      <div style="margin-bottom:16px">
        <div class="dim mono" style="font-size:12px;margin-bottom:6px">${frags[key].title}</div>
        <div class="case-file" style="max-width:420px">${frags[key].rows.map((_, i) => fragmentChipHtml(key, i)).join('')}</div>
      </div>`;
    return `
    <div class="view view-wide">
      ${backLink('#/grey/128/chen', '陳奕辰 封存')}
      <div class="dash-title">身分片段重建</div>
      <p class="dim" style="font-size:13px">點選任兩個「裝置雜湊」欄位試著把它們對上。</p>
      ${cardHtml('a')}${cardHtml('b')}${cardHtml('c')}
      ${fragMessage ? `<div class="observation-box ${fragMessageOk ? '' : 'warn'}" style="max-width:420px">${esc(fragMessage)}</div>` : ''}
      ${solved ? `
      <div class="observation-box" style="max-width:420px;margin-top:14px">已建立 1 筆封存關聯<br><span class="dim mono" style="font-size:12px">灰-128 → 案件 #0917</span></div>
      <button class="btn" style="margin-top:14px;max-width:360px" onclick="location.hash='#/case/0917'">[ 前往案件 #0917 → ]</button>` : ''}
    </div>
    ${hintBar(!solved ? 'ch2Puzzle03' : null)}
    ${bottomNav('m', true)}`;
  }
  function selectFragmentChip(fragKey, idx) {
    const row = DATA.ch2.fragments[fragKey].rows[idx];
    fragMessage = '';
    fragMessageOk = false;
    if (row.type === 'account') {
      fragConnections.account = true;
      fragSelected = null;
    } else if (fragSelected === null) {
      fragSelected = { fragKey, idx };
    } else if (fragSelected.fragKey === fragKey && fragSelected.idx === idx) {
      fragSelected = null;
    } else {
      const row2 = DATA.ch2.fragments[fragSelected.fragKey].rows[fragSelected.idx];
      if (row.type === 'device' && row2.type === 'device' && fragKey !== fragSelected.fragKey) {
        fragConnections.device = true;
        fragMessage = '裝置雜湊相同 · 可能有關聯';
        fragMessageOk = true;
      } else {
        fragMessage = '無法建立關聯 / 沒有共同來源';
      }
      fragSelected = null;
    }
    if (fragConnections.device && fragConnections.account) {
      if (!STATE.get('ch2Puzzle03Solved')) playSolveSfx();
      STATE.set('ch2Puzzle03Solved', true);
      STATE.set('case0917Level2Unlocked', true);
    }
    render();
  }

  /* ================================================================
     CHAPTER 02 — SCREEN 10/11 — Archive Version Compare / Edit History（Puzzle 04）
     ================================================================ */
  let versionFound = {};
  function viewArchiveVersionCompare() {
    if (!STATE.get('case0917Level2Unlocked')) return ch2Locked();
    const versions = DATA.ch2.archiveVersions;
    const found = versions.every(v => v.diffIndex === undefined || versionFound[v.version]);
    const totalDiffs = versions.filter(v => v.diffIndex !== undefined).length;
    const foundDiffs = versions.filter(v => v.diffIndex !== undefined && versionFound[v.version]).length;
    const rows = versions.map(v => {
      const chars = v.text.split('').map((ch, i) => {
        if (v.diffIndex === i) {
          const isFound = versionFound[v.version];
          return `<span class="clickable" style="cursor:pointer;${isFound ? 'color:var(--success)' : 'color:var(--warning-bright)'}" onclick="App.selectDiffChar('${v.version}')">${esc(ch)}</span>`;
        }
        return esc(ch);
      }).join('');
      return `<div class="cf-row"><span class="k">${v.version.toUpperCase()}</span><span class="v">${chars}</span></div>`;
    }).join('');
    return `
    <div class="view view-wide">
      ${backLink('#/case/0917', '案件檔案')}
      <div class="dash-title">封存版本比對</div>
      <p class="dim" style="font-size:13px">找出每一版跟前一版不一樣的字。</p>
      <div class="case-file" style="margin-top:10px;max-width:420px">${rows}</div>
      ${foundDiffs > 0 ? `<div class="dim mono" style="font-size:12px;margin-top:12px">偵測到 ${foundDiffs} 處修改</div>` : ''}
      ${found ? `<button class="btn" style="margin-top:20px;max-width:360px" onclick="location.hash='#/grey/128/edit-history'">[ 查看修改紀錄 → ]</button>` : ''}
    </div>
    ${hintBar(!found ? 'ch2Puzzle04' : null)}
    ${bottomNav('case', true)}`;
  }
  function selectDiffChar(version) {
    versionFound[version] = true;
    const versions = DATA.ch2.archiveVersions;
    if (versions.every(v => v.diffIndex === undefined || versionFound[v.version])) {
      if (!STATE.get('ch2VersionDiffFound')) playSolveSfx();
      STATE.set('ch2VersionDiffFound', true);
    }
    render();
  }
  function viewEditHistory() {
    if (!STATE.get('ch2VersionDiffFound')) return ch2Locked();
    if (!STATE.get('ch2Puzzle04Solved')) playSolveSfx();
    STATE.set('ch2Puzzle04Solved', true);
    const versions = DATA.ch2.archiveVersions;
    const author = DATA.ch2.editHistoryAuthor;
    return `
    <div class="view view-wide">
      ${backLink('#/case/0917', '案件檔案')}
      <div class="dash-title">修改紀錄</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        ${versions.map(v => `<div class="cf-row"><span class="k">${v.version.toUpperCase()} 修改者</span><span class="v evidence-color">${esc(author)}</span></div>`).join('')}
      </div>
      <div class="observation-box" style="margin-top:14px">這三版都不是陳奕辰留下的——是灰-127。不同代灰之間，似乎會互相留言。</div>
      <button class="btn" style="margin-top:14px;max-width:360px" onclick="location.hash='#/grey/chain'">[ 繼續調查 → ]</button>
    </div>
    ${bottomNav('case', true)}`;
  }

  /* ================================================================
     CHAPTER 02 — SCREEN 12 — Grey Chain
     ================================================================ */
  let chainSelected = [];
  let chainWrong = false;
  function viewGreyChain() {
    if (!STATE.get('ch2Puzzle04Solved')) return ch2Locked();
    const ids = DATA.ch2.greyChainIds;
    const solved = STATE.get('ch2GreyChainBuilt');
    const nodes = ids.map(id => {
      const picked = chainSelected.includes(id);
      const order = chainSelected.indexOf(id);
      return `<div class="cf-row clickable ${picked ? 'active' : ''}" onclick="App.selectChainNode(${id})">
        <span class="k">灰-${String(id).padStart(3, '0')}</span>
        <span class="v mono">${greyCreatedDate(id)}${picked ? ` · #${order + 1}` : ''}</span>
      </div>`;
    }).join('');
    return `
    <div class="view view-wide">
      ${backLink('#/grey/128/edit-history', '修改紀錄')}
      <div class="dash-title">灰之鏈</div>
      <p class="dim" style="font-size:13px">依建立時間，由舊到新依序點選。</p>
      <div class="case-file" style="margin-top:10px;max-width:420px">${nodes}</div>
      <div class="board-toolbar" style="margin-top:14px">
        <button class="tool-btn" onclick="App.resetChain()">[ 重設 ]</button>
      </div>
      ${chainWrong ? `<div class="observation-box warn" style="max-width:420px">順序不對，再試一次。</div>` : ''}
      ${solved ? `<div class="observation-box" style="max-width:420px">灰-001 → 灰-027 → 灰-063 → 灰-091 → 灰-128——一條跨越多年的鏈。</div>
      <button class="btn" style="margin-top:14px;max-width:360px" onclick="location.hash='#/grey/000'">[ 前往灰-000 → ]</button>` : ''}
    </div>
    ${hintBar(!solved ? 'ch2GreyChain' : null)}
    ${bottomNav('m', true)}`;
  }
  function selectChainNode(id) {
    if (STATE.get('ch2GreyChainBuilt')) return;
    chainWrong = false;
    if (chainSelected.includes(id)) { chainSelected = chainSelected.filter(x => x !== id); render(); return; }
    chainSelected.push(id);
    if (chainSelected.length === DATA.ch2.greyChainIds.length) {
      const correct = DATA.ch2.greyChainIds.slice().sort((a, b) => greyCreatedRank(a) - greyCreatedRank(b));
      if (chainSelected.every((id2, i) => id2 === correct[i])) {
        playSolveSfx();
        STATE.set('ch2GreyChainBuilt', true);
      } else {
        chainWrong = true;
        chainSelected = [];
      }
    }
    render();
  }
  function resetChain() { chainSelected = []; chainWrong = false; render(); }

  /* ================================================================
     CHAPTER 02 — Grey-000（locked until later puzzles are built）
     ================================================================ */
  function viewGrey000() {
    if (!STATE.get('ch2GreyChainBuilt')) return ch2Locked();
    return `
    <div class="view view-wide">
      ${backLink('#/grey-database', '灰資料庫')}
      <div class="dash-title">灰-000</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        <div class="cf-row"><span class="k">狀態</span><span class="v missing">已刪除</span></div>
        <div class="cf-row"><span class="k">最後修改</span><span class="v">不明</span></div>
      </div>
      <button class="btn" style="margin-top:20px;max-width:340px" onclick="App.startGreyRecovery()">[ 還原封存 ]</button>
    </div>
    ${bottomNav('m', true)}`;
  }

  /* ================================================================
     CHAPTER 02 — SCREEN 14/15/16/17 — Recovery → Evidence → Conflict（Puzzle 05）
     ================================================================ */
  function startGreyRecovery() {
    document.getElementById('app').innerHTML = `<div class="view view-wide"><div class="investigator-reveal" id="recovery-seq"></div></div>`;
    runGreyRecoverySequence();
  }
  function runGreyRecoverySequence() {
    const el = document.getElementById('recovery-seq');
    if (!el) return;
    el.innerHTML = `<div class="label">正在還原封存</div><div class="big" id="recovery-pct">04%</div>`;
    const pcts = [18, 31, 52, 71, 89, 99];
    let i = 0;
    (function step() {
      const pctEl = document.getElementById('recovery-pct');
      if (i < pcts.length) {
        if (pctEl) pctEl.textContent = pcts[i] + '%';
        i++;
        setTimeout(step, 350);
      } else {
        el.innerHTML = `<div class="label" style="color:var(--warning)">還原失敗</div><div class="id-line" style="margin-top:20px"><span class="dim" style="cursor:pointer;text-decoration:underline" onclick="App.showRecoveredFragment()">已還原 1 個片段</span></div>`;
      }
    })();
  }
  function showRecoveredFragment() {
    STATE.set('ch2RecoveryPlayed', true);
    location.hash = '#/grey/000/fragment';
  }
  function viewRecoveredFragment() {
    if (!STATE.get('ch2RecoveryPlayed')) return ch2Locked();
    return `
    <div class="view view-wide">
      ${backLink('#/grey/000', '灰-000')}
      <div class="dash-title">殘留片段_000_A</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        ${DATA.ch2.evidence.map(e => `<div class="cf-row"><span class="k">${e.label}</span><span class="v dim">未比對</span></div>`).join('')}
      </div>
      <button class="btn" style="margin-top:20px;max-width:360px" onclick="location.hash='#/grey/000/evidence'">[ 開始比對 → ]</button>
    </div>
    ${bottomNav('m', true)}`;
  }

  let evidenceRevealed = {};
  const evidenceLabel = { match: '相符', partial: '部分相符', unresolved: '無法判定' };
  const evidenceColor = { match: 'var(--success)', partial: 'var(--evidence)', unresolved: 'var(--text-dim)' };
  function viewIdentityEvidenceMatching() {
    if (!STATE.get('ch2RecoveryPlayed')) return ch2Locked();
    const items = DATA.ch2.evidence;
    const allRevealed = items.every(e => evidenceRevealed[e.key]);
    const counts = { match: 0, partial: 0, unresolved: 0 };
    items.forEach(e => { if (evidenceRevealed[e.key]) counts[e.result]++; });
    const rows = items.map(e => {
      const revealed = evidenceRevealed[e.key];
      return `<div class="cf-row clickable" onclick="App.revealEvidence('${e.key}')"><span class="k">${e.label}</span><span class="v" style="${revealed ? `color:${evidenceColor[e.result]}` : ''}">${revealed ? evidenceLabel[e.result] : '點擊比對'}</span></div>`;
    }).join('');
    return `
    <div class="view view-wide">
      ${backLink('#/grey/000/fragment', '殘留片段')}
      <div class="dash-title">身分證據比對</div>
      <p class="dim" style="font-size:13px">逐項比對灰-000 的殘留資料跟林予安的既有資料。</p>
      <div class="case-file" style="margin-top:10px;max-width:420px">${rows}</div>
      ${allRevealed ? `
      <div class="observation-box" style="margin-top:14px;max-width:420px">相符 ${counts.match} · 部分相符 ${counts.partial} · 無法判定 ${counts.unresolved}</div>
      <button class="btn" style="margin-top:14px;max-width:360px" onclick="App.goToArchiveConflict()">[ 繼續 → ]</button>` : ''}
    </div>
    ${hintBar(!allRevealed ? 'ch2Evidence' : null)}
    ${bottomNav('m', true)}`;
  }
  function revealEvidence(key) { evidenceRevealed[key] = true; render(); }
  function goToArchiveConflict() {
    const items = DATA.ch2.evidence;
    STATE.set('ch2Evidence', Object.fromEntries(items.map(e => [e.key, e.result])));
    STATE.set('ch2Confidence', 87);
    location.hash = '#/grey/000/conflict';
  }

  function viewArchiveConflict() {
    const ev = STATE.get('ch2Evidence');
    if (!ev) return ch2Locked();
    const conf = STATE.get('ch2Confidence');
    const judgement = STATE.get('ch2Judgement');
    const counts = { match: 0, partial: 0, unresolved: 0 };
    Object.values(ev).forEach(r => counts[r]++);
    const options = [
      { key: 'A', text: '灰-000 就是林予安' },
      { key: 'B', text: '林予安與灰-000 有關聯' },
      { key: 'C', text: '證據不足' },
    ];
    return `
    <div class="view view-wide">
      ${backLink('#/grey/000/evidence', '證據比對')}
      <div class="dash-title">封存衝突</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        <div class="cf-row"><span class="k">相符</span><span class="v" style="color:var(--success)">${counts.match}</span></div>
        <div class="cf-row"><span class="k">部分相符</span><span class="v" style="color:var(--evidence)">${counts.partial}</span></div>
        <div class="cf-row"><span class="k">無法判定</span><span class="v dim">${counts.unresolved}</span></div>
        <div class="cf-row"><span class="k">身分信心值</span><span class="v evidence-color">${conf}%</span></div>
      </div>
      <div class="dash-nav-title" style="margin-top:20px">調查判斷</div>
      <div class="case-file" style="margin-top:8px;max-width:420px">
        ${options.map(o => `<div class="cf-row clickable ${judgement === o.key ? 'active' : ''}" onclick="App.submitJudgement('${o.key}')"><span class="k">${o.key}</span><span class="v">${o.text}</span></div>`).join('')}
      </div>
      ${judgement && judgement !== 'C' ? `<div class="observation-box warn" style="margin-top:14px;max-width:420px">結論證據不足<br>身分相符 ≠ 身分確認</div>` : ''}
      ${judgement === 'C' ? `<div class="observation-box" style="margin-top:14px;max-width:420px">調查狀態：暫定</div>
      <button class="btn" style="margin-top:14px;max-width:360px" onclick="App.ch2FinalReveal()">[ 繼續 → ]</button>` : ''}
    </div>
    ${hintBar(judgement !== 'C' ? 'ch2Conflict' : null)}
    ${bottomNav('m', true)}`;
  }
  function submitJudgement(choice) {
    STATE.set('ch2Judgement', choice);
    if (choice === 'C') { playSolveSfx(); STATE.set('ch2Puzzle05Solved', true); }
    render();
  }

  /* ================================================================
     CHAPTER 02 — SCREEN 18 — Grey-130（結局）
     ================================================================ */
  function ch2FinalReveal() {
    document.getElementById('app').innerHTML = `<div class="view view-wide"><div class="investigator-reveal" id="ch2-seq"></div></div>`;
    runGrey130Sequence();
  }
  function runGrey130Sequence() {
    const el = document.getElementById('ch2-seq');
    if (!el) return;
    el.innerHTML = `<div class="label">灰-130</div><div class="id-line" id="successor-status">接班人<br>未找到</div>`;
    setTimeout(() => {
      const s = document.getElementById('successor-status');
      if (s) s.innerHTML = '接班人<br>已找到';
      setTimeout(() => {
        el.innerHTML = `<div class="label">灰-130</div><div class="id-line">調查者<br>不明</div><div class="big" style="font-size:18px;margin-top:24px;letter-spacing:0.02em">已經有人在找你了。</div>`;
        setTimeout(showCh2Complete, 2600);
      }, 1400);
    }, 1400);
  }
  function showCh2Complete() {
    const div = document.createElement('div');
    div.className = 'ending-screen';
    div.innerHTML = `<div class="label">第二章</div><div style="height:6px"></div><div style="font-size:16px;color:var(--warning)">完成</div>`;
    document.body.appendChild(div);
    setTimeout(() => {
      div.remove();
      STATE.set('ch2Final', true);
      location.hash = '#/recap/2';
    }, 2400);
  }

  /* ================================================================
     CHAPTER 03 — SCREEN 01 — Chapter 03 Entry
     ================================================================ */
  function viewCh3Entry() {
    if (!STATE.get('ch2Final')) return ch2Locked();
    return `
    <div class="view view-wide">
      ${backLink('#/archive', '封存庫')}
      <div class="dash-title">新封存偵測 · 灰-130</div>
      <p class="dim mono" style="margin-top:10px">${esc(DATA.ch3.entryTime)}</p>
      <p class="dim" style="margin-top:16px;max-width:420px">系統偵測到一筆新的封存紀錄，狀態：使用中。</p>
      <button class="btn" style="margin-top:24px;max-width:320px" onclick="location.hash='#/grey-database'">[ 進入 ]</button>
    </div>
    ${bottomNav('m', true)}`;
  }

  /* ================================================================
     CHAPTER 03 — SCREEN 03 — 灰-130 Archive（Puzzle 01）
     ================================================================ */
  function viewGrey130Archive() {
    if (!STATE.get('ch2Final')) return ch2Locked();
    const g = DATA.ch3.grey130;
    const solved = STATE.get('ch3Puzzle01Solved');
    return `
    <div class="view view-wide">
      ${backLink('#/grey-database', '灰資料庫')}
      <div class="dash-title">灰-130</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        <div class="cf-row"><span class="k">狀態</span><span class="v">${esc(g.status)}</span></div>
        <div class="cf-row"><span class="k">建立時間</span><span class="v mono">${esc(g.created)}</span></div>
        <div class="cf-row"><span class="k">調查者</span><span class="v dim">${esc(g.investigator)}</span></div>
      </div>
      ${!solved
        ? `<button class="tool-btn" style="margin-top:14px" onclick="App.compareGrey130Time()">[ 比對建立時間 ]</button>`
        : `<div class="observation-box" style="margin-top:14px;max-width:420px">灰-130 建立時間 ≈ 你開始本章調查的時間<br><span class="dim mono" style="font-size:12px">時間差：幾乎重疊</span></div>
        <button class="btn" style="margin-top:14px;max-width:360px" onclick="location.hash='#/grey/130/observer-log'">[ 查看觀察紀錄 → ]</button>`}
    </div>
    ${hintBar(!solved ? 'ch3Puzzle01' : null)}
    ${bottomNav('m', true)}`;
  }
  function compareGrey130Time() { if (!STATE.get('ch3Puzzle01Solved')) playSolveSfx(); STATE.set('ch3Puzzle01Solved', true); render(); }

  /* ================================================================
     CHAPTER 03 — SCREEN 04/05 — Observer Log（Puzzle 02）
     ================================================================ */
  let observerLogExpanded = false;
  function viewObserverLog() {
    if (!STATE.get('ch3Puzzle01Solved')) return ch2Locked();
    const log = DATA.ch3.observerLog;
    const solved = STATE.get('ch3Puzzle02Solved');
    return `
    <div class="view view-wide">
      ${backLink('#/grey/130', '灰-130')}
      <div class="dash-title">觀察紀錄</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        ${log.map(l => `<div class="cf-row"><span class="k mono">${esc(l.t)}</span><span class="v">${esc(l.action)}</span></div>`).join('')}
      </div>
      ${!observerLogExpanded
        ? `<button class="tool-btn" style="margin-top:14px" onclick="App.expandObserverLog()">[ 展開紀錄對象 ]</button>`
        : `<div class="observation-box" style="margin-top:14px;max-width:420px">紀錄對象：${esc(DATA.ch3.observerSubject)}</div>
        <button class="btn" style="margin-top:14px;max-width:360px" onclick="location.hash='#/grey/130/observer-log/detail'">[ 繼續 → ]</button>`}
    </div>
    ${hintBar(!solved ? 'ch3Puzzle02' : null)}
    ${bottomNav('m', true)}`;
  }
  function expandObserverLog() {
    observerLogExpanded = true;
    if (!STATE.get('ch3Puzzle02Solved')) playSolveSfx();
    STATE.set('ch3Puzzle02Solved', true);
    render();
  }
  function viewObserverLogDetail() {
    if (!STATE.get('ch3Puzzle02Solved')) return ch2Locked();
    return `
    <div class="view view-wide">
      ${backLink('#/grey/130/observer-log', '觀察紀錄')}
      <div class="dash-title">觀察紀錄 · 詳細</div>
      <p class="dim" style="margin-top:12px;max-width:420px">這份紀錄裡的每一項操作，都是你在這一章做過的事。灰-130 記錄的對象，是你。</p>
      <button class="btn" style="margin-top:20px;max-width:340px" onclick="location.hash='#/grey/128/revisit'">[ 繼續調查 → ]</button>
    </div>
    ${bottomNav('m', true)}`;
  }

  /* ================================================================
     CHAPTER 03 — SCREEN 06/07 — 灰-128 Revisit / 陳奕辰雙重意圖
     ================================================================ */
  function viewGrey128Revisit() {
    if (!STATE.get('ch3Puzzle02Solved')) return ch2Locked();
    const r = DATA.ch3.chenRevisit;
    return `
    <div class="view view-wide">
      ${backLink('#/grey/130/observer-log/detail', '觀察紀錄')}
      <div class="dash-title">灰-128 · 重新檢視</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        <div class="cf-row"><span class="k">前任</span><span class="v evidence-color">${esc(r.predecessor)}</span></div>
        <div class="cf-row"><span class="k">接班人</span><span class="v evidence-color">${esc(r.successor)}</span></div>
      </div>
      <p class="dim" style="margin-top:16px;max-width:420px">灰不是被指定的。它是遞補的——每一個灰，都同時記著前任和接班人。</p>
      <button class="btn" style="margin-top:20px;max-width:360px" onclick="location.hash='#/grey/128/chen-dual'">[ 查看陳奕辰留下的紀錄 → ]</button>
    </div>
    ${bottomNav('m', true)}`;
  }
  function viewChenDualArchive() {
    if (!STATE.get('ch3Puzzle02Solved')) return ch2Locked();
    STATE.set('ch3ChenRevisited', true);
    const msgs = DATA.ch3.chenDualMessages;
    return `
    <div class="view view-wide">
      ${backLink('#/grey/128/revisit', '灰-128')}
      <div class="dash-title">陳奕辰 · 封存紀錄</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        ${msgs.map(m => `<div class="cf-row"><span class="k">${esc(m.label)}</span><span class="v">${esc(m.text)}</span></div>`).join('')}
      </div>
      <div class="observation-box" style="margin-top:14px;max-width:420px">兩則紀錄都真實存在，也互相矛盾。系統沒有標記哪一則才是「真正的」陳奕辰。</div>
      <button class="btn" style="margin-top:14px;max-width:360px" onclick="location.hash='#/grey/000/revisit'">[ 繼續調查 → ]</button>
    </div>
    ${bottomNav('m', true)}`;
  }

  /* ================================================================
     CHAPTER 03 — SCREEN 08 — 灰-000／林予安封存重訪
     ================================================================ */
  function viewGrey000Revisit() {
    if (!STATE.get('ch3ChenRevisited')) return ch2Locked();
    return `
    <div class="view view-wide">
      ${backLink('#/grey/128/chen-dual', '陳奕辰 封存紀錄')}
      <div class="dash-title">灰-000 · 重新檢視</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        <div class="cf-row"><span class="k">身分比對</span><span class="v evidence-color">87%</span></div>
        <div class="cf-row"><span class="k">身分確認</span><span class="v" style="color:var(--success)">林予安</span></div>
      </div>
      <p class="dim" style="margin-top:16px;max-width:420px">確認的只是「林予安曾經是灰-000」——系統裡沒有任何紀錄顯示她創造了這套遞補機制。</p>
      <button class="btn" style="margin-top:20px;max-width:360px" onclick="location.hash='#/ch3/message-a'">[ 查看她留下的訊息 → ]</button>
    </div>
    ${bottomNav('m', true)}`;
  }

  /* ================================================================
     CHAPTER 03 — SCREEN 09/10/11 — 林予安的兩份訊息（Puzzle 03）
     ================================================================ */
  function viewMessageFragment(key) {
    if (!STATE.get('ch3ChenRevisited')) return ch2Locked();
    const m = DATA.ch3.yuanMessages.find(x => x.key === key);
    const nextHash = key === 'A' ? '#/ch3/message-b' : '#/ch3/message-timeline';
    const nextLabel = key === 'A' ? '[ 查看下一份片段 → ]' : '[ 排列這兩份訊息 → ]';
    const backHash = key === 'A' ? '#/grey/000/revisit' : '#/ch3/message-a';
    const backLabel = key === 'A' ? '灰-000' : '訊息片段 A';
    return `
    <div class="view view-wide">
      ${backLink(backHash, backLabel)}
      <div class="dash-title">${esc(m.label)}</div>
      <div class="blank-post" style="text-align:left">${nl(m.text)}</div>
      <button class="btn" style="margin-top:20px;max-width:360px" onclick="location.hash='${nextHash}'">${nextLabel}</button>
    </div>
    ${bottomNav('m', true)}`;
  }
  function viewMessageFragmentA() { return viewMessageFragment('A'); }
  function viewMessageFragmentB() { return viewMessageFragment('B'); }

  let msgOrderSelected = [];
  let msgOrderWrong = false;
  function viewMessageTimeline() {
    if (!STATE.get('ch3ChenRevisited')) return ch2Locked();
    const msgs = DATA.ch3.yuanMessages;
    const solved = STATE.get('ch3Puzzle03Solved');
    const rows = msgs.map(m => {
      const picked = msgOrderSelected.includes(m.key);
      const order = msgOrderSelected.indexOf(m.key);
      return `<div class="cf-row clickable ${picked ? 'active' : ''}" onclick="App.selectMsgOrder('${m.key}')">
        <span class="k">${esc(m.label)} <span class="dim mono" style="font-size:11px">${esc(m.created)}</span></span>
        <span class="v">${esc(m.text)}${picked ? ` <span class="dim mono" style="font-size:11px">· #${order + 1}</span>` : ''}</span>
      </div>`;
    }).join('');
    return `
    <div class="view view-wide">
      ${backLink('#/ch3/message-b', '訊息片段')}
      <div class="dash-title">訊息時間軸</div>
      <p class="dim" style="font-size:13px">依建立時間，由舊到新依序點選這兩份訊息。</p>
      <div class="case-file" style="margin-top:10px;max-width:420px">${rows}</div>
      <div class="board-toolbar" style="margin-top:14px"><button class="tool-btn" onclick="App.resetMsgOrder()">[ 重設 ]</button></div>
      ${msgOrderWrong ? `<div class="observation-box warn" style="max-width:420px">順序不對，再試一次。</div>` : ''}
      ${solved ? `<div class="observation-box" style="max-width:420px">A → B——她的立場從「想逃離」變成「已經接受」。</div>
      <button class="btn" style="margin-top:14px;max-width:360px" onclick="location.hash='#/ch3/chain-rebuild'">[ 繼續調查 → ]</button>` : ''}
    </div>
    ${hintBar(!solved ? 'ch3Puzzle03' : null)}
    ${bottomNav('m', true)}`;
  }
  function selectMsgOrder(key) {
    if (STATE.get('ch3Puzzle03Solved')) return;
    msgOrderWrong = false;
    if (msgOrderSelected.includes(key)) { msgOrderSelected = msgOrderSelected.filter(k => k !== key); render(); return; }
    msgOrderSelected.push(key);
    if (msgOrderSelected.length === DATA.ch3.yuanMessages.length) {
      const correct = DATA.ch3.yuanMessages.slice().sort((a, b) => a.sortRank - b.sortRank).map(m => m.key);
      if (msgOrderSelected.every((k, i) => k === correct[i])) {
        playSolveSfx();
        STATE.set('ch3Puzzle03Solved', true);
      } else {
        msgOrderWrong = true;
        msgOrderSelected = [];
      }
    }
    render();
  }
  function resetMsgOrder() { msgOrderSelected = []; msgOrderWrong = false; render(); }

  /* ================================================================
     CHAPTER 03 — SCREEN 12/13/14 — 灰之鏈重建（Puzzle 04）
     ================================================================ */
  let ch3ChainSelected = [];
  let ch3ChainWrong = false;
  function viewCh3ChainRebuild() {
    if (!STATE.get('ch3Puzzle03Solved')) return ch2Locked();
    const baseIds = DATA.ch2.greyChainIds;
    const appendIds = DATA.ch3.chainAppendIds;
    const solved = STATE.get('ch3ChainRebuilt');
    const baseHtml = baseIds.map(id => `<div class="cf-row"><span class="k">灰-${String(id).padStart(3, '0')}</span><span class="v mono dim">${greyCreatedDate(id)}</span></div>`).join('');
    const appendHtml = appendIds.map(id => {
      const picked = ch3ChainSelected.includes(id);
      const order = ch3ChainSelected.indexOf(id);
      return `<div class="cf-row clickable ${picked ? 'active' : ''}" onclick="App.selectCh3ChainNode(${id})">
        <span class="k">灰-${String(id).padStart(3, '0')}</span>
        <span class="v mono">${picked ? `已選 #${order + 1}` : '待接上'}</span>
      </div>`;
    }).join('');
    return `
    <div class="view view-wide">
      ${backLink('#/ch3/message-timeline', '訊息時間軸')}
      <div class="dash-title">灰之鏈重建</div>
      <p class="dim" style="font-size:13px">已知的鏈到灰-128 為止。依建立時間，把灰-129、灰-130 接到鏈尾。</p>
      <div class="case-file" style="margin-top:10px;max-width:420px">${baseHtml}${appendHtml}</div>
      <div class="board-toolbar" style="margin-top:14px"><button class="tool-btn" onclick="App.resetCh3Chain()">[ 重設 ]</button></div>
      ${ch3ChainWrong ? `<div class="observation-box warn" style="max-width:420px">順序不對，再試一次。</div>` : ''}
      ${solved ? `<div class="observation-box" style="max-width:420px">灰-001 → 灰-027 → 灰-063 → 灰-091 → 灰-128 → 灰-129 → 灰-130<br><span class="dim mono" style="font-size:12px">前一個節點：灰-129 ／ 目前觀察者：不明</span></div>
      <button class="btn" style="margin-top:14px;max-width:360px" onclick="location.hash='#/ch3/identity-evidence'">[ 繼續調查 → ]</button>` : ''}
    </div>
    ${hintBar(!solved ? 'ch3Chain' : null)}
    ${bottomNav('m', true)}`;
  }
  function selectCh3ChainNode(id) {
    if (STATE.get('ch3ChainRebuilt')) return;
    ch3ChainWrong = false;
    if (ch3ChainSelected.includes(id)) { ch3ChainSelected = ch3ChainSelected.filter(x => x !== id); render(); return; }
    ch3ChainSelected.push(id);
    if (ch3ChainSelected.length === DATA.ch3.chainAppendIds.length) {
      const correct = DATA.ch3.chainAppendIds;
      if (ch3ChainSelected.every((id2, i) => id2 === correct[i])) {
        playSolveSfx();
        STATE.set('ch3ChainRebuilt', true);
      } else {
        ch3ChainWrong = true;
        ch3ChainSelected = [];
      }
    }
    render();
  }
  function resetCh3Chain() { ch3ChainSelected = []; ch3ChainWrong = false; render(); }

  /* ================================================================
     CHAPTER 03 — SCREEN 15/16 — Identity Evidence / Judgment（Puzzle 05）
     ================================================================ */
  let ch3EvidenceRevealed = {};
  function viewCh3IdentityEvidence() {
    if (!STATE.get('ch3ChainRebuilt')) return ch2Locked();
    const items = DATA.ch3.identityEvidence;
    const allRevealed = items.every(e => ch3EvidenceRevealed[e.key]);
    const rows = items.map(e => {
      const revealed = ch3EvidenceRevealed[e.key];
      return `<div class="cf-row clickable" onclick="App.revealCh3Evidence('${e.key}')"><span class="k">${esc(e.label)}</span><span class="v" style="${revealed ? 'color:var(--success)' : ''}">${revealed ? evidenceLabel[e.result] : '點擊比對'}</span></div>`;
    }).join('');
    return `
    <div class="view view-wide">
      ${backLink('#/ch3/chain-rebuild', '灰之鏈重建')}
      <div class="dash-title">身分證據</div>
      <p class="dim" style="font-size:13px">逐項比對灰-130 的紀錄，跟你自己這一路以來的操作。</p>
      <div class="case-file" style="margin-top:10px;max-width:420px">${rows}</div>
      ${allRevealed ? `<button class="btn" style="margin-top:14px;max-width:360px" onclick="location.hash='#/ch3/judgment'">[ 做出判斷 → ]</button>` : ''}
    </div>
    ${bottomNav('m', true)}`;
  }
  function revealCh3Evidence(key) { ch3EvidenceRevealed[key] = true; render(); }

  function viewCh3Judgment() {
    if (!STATE.get('ch3ChainRebuilt')) return ch2Locked();
    const judgement = STATE.get('ch3Judgement');
    const options = [
      { key: 'A', text: '灰-130 是另一名調查者' },
      { key: 'B', text: '灰-130 是系統自動生成的編號' },
      { key: 'C', text: '灰-130 是正在調查灰-129 的人' },
    ];
    return `
    <div class="view view-wide">
      ${backLink('#/ch3/identity-evidence', '身分證據')}
      <div class="dash-title">灰-130 是誰？</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        ${options.map(o => `<div class="cf-row clickable ${judgement === o.key ? 'active' : ''}" onclick="App.submitCh3Judgement('${o.key}')"><span class="k">${o.key}</span><span class="v">${esc(o.text)}</span></div>`).join('')}
      </div>
      ${judgement && judgement !== 'C' ? `<div class="observation-box warn" style="margin-top:14px;max-width:420px">結論尚未成立<br>再檢查一次五項證據之間的關係。</div>` : ''}
      ${judgement === 'C' ? `<div class="observation-box" style="margin-top:14px;max-width:420px">結論已接受<br>對象：灰-130<br>關係：觀察者 → 調查對象</div>
      <button class="btn" style="margin-top:14px;max-width:360px" onclick="App.ch3FinalReveal()">[ 繼續 → ]</button>` : ''}
    </div>
    ${hintBar(judgement !== 'C' ? 'ch3Judgment' : null)}
    ${bottomNav('m', true)}`;
  }
  function submitCh3Judgement(choice) {
    STATE.set('ch3Judgement', choice);
    if (choice === 'C') { playSolveSfx(); STATE.set('ch3Puzzle05Solved', true); }
    render();
  }

  /* ================================================================
     CHAPTER 03 — SCREEN 17/18/19 — 最終揭露與結局序列
     ================================================================ */
  function ch3FinalReveal() {
    document.getElementById('app').innerHTML = `<div class="view view-wide"><div class="investigator-reveal" id="ch3-seq"></div></div>`;
    runCh3FinalSequence();
  }
  function runCh3FinalSequence() {
    const el = document.getElementById('ch3-seq');
    if (!el) return;
    el.innerHTML = `<div class="label">案件結案</div><div class="big">灰-130</div><div class="id-line">對象<br>你</div>`;
    setTimeout(() => {
      el.innerHTML = `<div class="label">案件結案</div><div class="big">灰-130</div><div class="id-line">調查者<br>灰-130</div>`;
      setTimeout(() => {
        el.innerHTML = `<div class="label">案件結案</div><div class="big">灰-130</div><div class="id-line">狀態<br>使用中</div>`;
        setTimeout(() => {
          el.innerHTML = `<div class="label">案件結案</div><div class="big">灰-130</div><div class="id-line">下一個觀察者<br>不明</div><button class="btn" style="margin-top:30px;max-width:340px" onclick="App.ch3ReturnToCase()">[ 返回案件 ]</button>`;
        }, 1600);
      }, 1600);
    }, 1600);
  }
  function ch3ReturnToCase() {
    const el = document.getElementById('ch3-seq');
    if (!el) return;
    el.innerHTML = `<div class="label">案件 #0917</div><div class="id-line" style="margin-top:10px">最後查看者<br>灰-131</div>`;
    setTimeout(() => {
      el.innerHTML = `<div class="message-panel"><div class="mp-body" id="ch3-mp-body"></div></div>`;
      const box = document.getElementById('ch3-mp-body');
      typeMessages(box, DATA.ch3.endingMessages, () => setTimeout(showCh3Complete, 1200));
    }, 1800);
  }
  function showCh3Complete() {
    const div = document.createElement('div');
    div.className = 'ending-screen';
    div.innerHTML = `<div class="label">灰-131</div><div style="height:6px"></div><div style="font-size:16px;color:var(--warning)">新調查已開始</div>`;
    document.body.appendChild(div);
    setTimeout(() => {
      div.remove();
      STATE.set('ch3Final', true);
      location.hash = '#/recap/3';
    }, 2200);
  }
  function renderFinalShareScreen() {
    const div = document.createElement('div');
    div.className = 'ending-screen';
    div.innerHTML = `
        <div class="label">案件結案</div>
        <div style="height:4px"></div>
        <div style="font-size:18px;letter-spacing:0.08em">案件 #0917</div>
        <div style="max-width:400px;font-size:15px;line-height:1.9;color:var(--text);margin-top:16px">「你以為你正在調查他。<br>其實你也正在成為證據。」</div>
        <div style="font-size:13px;letter-spacing:0.16em;color:var(--evidence);margin-top:18px">第 01 — 03 章</div>
        <button class="btn" style="margin-top:32px;max-width:280px" onclick="App.shareResult()">[ 分享調查結果 → ]</button>
        <button class="btn" style="margin-top:10px;max-width:280px" onclick="App.replayGame()">[ 再玩一次 ]</button>
        <div class="entry-howto-link" style="margin-top:18px" onclick="App.exitEndingToArchive()">繼續瀏覽封存庫</div>`;
    document.body.appendChild(div);
  }
  function shareToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'new-message-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
  }
  function shareResult() {
    const shareData = {
      title: '最後一則貼文 — ECHO CASE #0917',
      text: '「你以為你正在調查他。其實你也正在成為證據。」',
      url: location.origin + location.pathname,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareData.url)
        .then(() => shareToast('連結已複製'))
        .catch(() => shareToast(shareData.url));
    } else {
      shareToast(shareData.url);
    }
  }
  function replayGame() {
    STATE.reset();
    location.hash = '#/';
    location.reload();
  }
  function exitEndingToArchive() {
    const div = document.querySelector('.ending-screen');
    if (div) div.remove();
    location.hash = '#/archive';
  }

  /* ================================================================
     章節劇情摘要（結局後自動進入，封存庫側欄可重複讀取）
     ================================================================ */
  const RECAP_REQUIRES = { 1: 'final', 2: 'ch2Final', 3: 'ch3Final' };
  const RECAP_NEXT = {
    1: { hash: '#/archive', label: '[ 進入封存庫 → ]' },
    2: { hash: '#/archive', label: '[ 進入封存庫 → ]' },
    3: null,
  };
  function viewRecap(n) {
    if (!STATE.get(RECAP_REQUIRES[n])) return ch2Locked();
    const r = DATA.recaps[n];
    const next = RECAP_NEXT[n];
    return `
    <div class="view view-wide">
      ${backLink('#/archive', '封存庫')}
      <div class="recap-box">
        <div class="dash-title">${esc(r.title)}</div>
        ${r.paragraphs.map(p => `<div class="recap-p">${nl(p)}</div>`).join('')}
        <div class="recap-closing">${nl(r.closing)}</div>
        ${next
          ? `<button class="btn" style="margin-top:32px;max-width:280px" onclick="location.hash='${next.hash}'">${next.label}</button>`
          : `<button class="btn" style="margin-top:32px;max-width:280px" onclick="App.finishRecap3()">[ 繼續 → ]</button>`}
      </div>
    </div>
    ${bottomNav('m', true)}`;
  }
  function viewRecap1() { return viewRecap(1); }
  function viewRecap2() { return viewRecap(2); }
  function viewRecap3() { return viewRecap(3); }
  function finishRecap3() {
    renderFinalShareScreen();
  }

  /* ---------------- Router ---------------- */
  const routes = {
    '': viewEntry,
    '#/': viewEntry,
    '#/archive': viewDashboard,
    '#/case/0642': viewCase0642,
    '#/case/0642/fragment': viewCase0642Fragment,
    '#/case/0642/messages': viewCase0642Messages,
    '#/case/0642/result': viewCase0642Result,
    '#/case-overview': viewCaseOverview,
    '#/feed': viewFeed,
    '#/profile/yuan': viewYuanProfile,
    '#/profile/hui_0917': viewMProfile,
    '#/profile/chen_yc': viewChenProfile,
    '#/photo/02': viewPhoto,
    '#/timeline': viewTimeline,
    '#/case/0917': viewCaseFile,
    '#/evidence-board': viewBoard,
    '#/evidence/audio': viewAudio,
    '#/investigator': viewInvestigator,
    '#/ch2-entry': viewCh2Entry,
    '#/grey-database': viewGreyDatabase,
    '#/grey/me': viewGreyProfileSelf,
    '#/grey/128': viewGrey128Overview,
    '#/grey/128/archive': viewGrey128Archive,
    '#/grey/128/integrity': viewFileIntegrity,
    '#/grey/128/chen': viewChenArchive,
    '#/grey/128/fragments': viewFragmentReconstruction,
    '#/grey/128/versions': viewArchiveVersionCompare,
    '#/grey/128/edit-history': viewEditHistory,
    '#/grey/chain': viewGreyChain,
    '#/grey/000': viewGrey000,
    '#/grey/000/fragment': viewRecoveredFragment,
    '#/grey/000/evidence': viewIdentityEvidenceMatching,
    '#/grey/000/conflict': viewArchiveConflict,
    '#/ch3-entry': viewCh3Entry,
    '#/grey/130': viewGrey130Archive,
    '#/grey/130/observer-log': viewObserverLog,
    '#/grey/130/observer-log/detail': viewObserverLogDetail,
    '#/grey/128/revisit': viewGrey128Revisit,
    '#/grey/128/chen-dual': viewChenDualArchive,
    '#/grey/000/revisit': viewGrey000Revisit,
    '#/ch3/message-a': viewMessageFragmentA,
    '#/ch3/message-b': viewMessageFragmentB,
    '#/ch3/message-timeline': viewMessageTimeline,
    '#/ch3/chain-rebuild': viewCh3ChainRebuild,
    '#/ch3/identity-evidence': viewCh3IdentityEvidence,
    '#/ch3/judgment': viewCh3Judgment,
    '#/recap/1': viewRecap1,
    '#/recap/2': viewRecap2,
    '#/recap/3': viewRecap3,
  };

  function render() {
    const hash = location.hash || '#/';

    // Once the chapter is complete, the investigator reveal has already
    // played — forward straight to the M database instead of re-running it.
    if (hash === '#/investigator' && STATE.get('final')) {
      location.hash = '#/grey-database';
      return;
    }

    if (!navigatingBack && currentHash !== null && currentHash !== hash) {
      navStack.push(currentHash);
    }
    navigatingBack = false;
    currentHash = hash;

    let html;
    if (hash.startsWith('#/post/')) {
      html = viewPost(parseInt(hash.split('/')[2], 10));
    } else if (routes[hash]) {
      html = routes[hash]();
    } else {
      html = viewEntry();
    }
    root.innerHTML = html;
    window.scrollTo(0, 0);
    if (hash === '#/archive') maybeTriggerArchiveAnomaly();
  }

  window.addEventListener('hashchange', render);

  const INTRO_SEEN_KEY = 'echo_intro_seen';
  function showIntro() {
    const el = document.getElementById('intro-overlay');
    if (el) el.classList.remove('hidden');
  }
  function hideIntro() {
    const el = document.getElementById('intro-overlay');
    if (el) el.classList.add('hidden');
    try { localStorage.setItem(INTRO_SEEN_KEY, '1'); } catch (e) {}
  }
  function maybeAutoShowIntro() {
    try {
      if (!localStorage.getItem(INTRO_SEEN_KEY)) showIntro();
    } catch (e) {}
  }

  return {
    render, revealHidden, toggleEdited, goBack,
    toggleFollow, newPostToast, resetProgress,
    inspectAnomaly, analyzeMetadata, zoomToggle, toggleFx, resetFx,
    dragImgStart, dropOnSlot, moveImgToSlot,
    openAccessPrompt, submitAccess, toggleCaseRevisit,
    selectBoardNode, resetBoard, toggleBoardHelp,
    playAudio, toggleAudioMute, finalReveal, runMSequence,
    setGreySort, toggleChecksum, openIndexEntry, selectFragmentChip,
    selectDiffChar, selectChainNode, resetChain,
    startGreyRecovery, showRecoveredFragment, revealEvidence, goToArchiveConflict,
    submitJudgement, ch2FinalReveal,
    toggleHint, deeperHint,
    showIntro, hideIntro, maybeAutoShowIntro,
    compareGrey130Time, expandObserverLog,
    selectMsgOrder, resetMsgOrder,
    selectCh3ChainNode, resetCh3Chain,
    revealCh3Evidence, submitCh3Judgement,
    ch3FinalReveal, ch3ReturnToCase,
    shareResult, replayGame, exitEndingToArchive, finishRecap3,
    revealCh0642Message, selectCh0642Anomaly,
  };
})();

App.render();
if (!location.hash || location.hash === '#/') App.maybeAutoShowIntro();
