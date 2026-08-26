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
    if (!puzzleKey) return '';
    return `
    <div class="hint-bar">
      <div class="hint-toggle" onclick="App.toggleHint()">${hintOpen ? '[ 關閉 ]' : '[ 需要提示嗎？ ]'}</div>
    </div>
    ${hintOpen ? renderHintPanel(puzzleKey) : ''}`;
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
    return `
    <div class="view view-wide">
      <div class="dashboard">
        <div class="dash-sidebar">
          <div class="dash-logo">ECHO</div>
          <div class="dash-nav-title">封存庫</div>
          ${nav.map(n => `<div class="dash-nav-item ${n.key === 'cases' ? 'active' : ''}" ${n.key === 'cases' ? "onclick=\"location.hash='#/archive'\"" : (n.key === 'people' ? "onclick=\"location.hash='#/profile/yuan'\"" : '')}>${n.label}</div>`).join('')}
          ${STATE.get('final') ? `<div class="dash-nav-item" onclick="location.hash='#/grey-database'">灰資料庫</div>` : ''}
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
              <div class="cc-status">狀態：<span class="warn">進行中</span></div>
            </div>
            <div class="case-card restricted">${icon('lock', 18)}<div class="cc-id">案件 #0642</div><div class="cc-name">存取受限</div></div>
            <div class="case-card restricted">${icon('lock', 18)}<div class="cc-id">案件 #1188</div><div class="cc-name">存取受限</div></div>
            <div class="case-card restricted">${icon('lock', 18)}<div class="cc-id">案件 #0033</div><div class="cc-name">存取受限</div></div>
          </div>
        </div>
      </div>
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
      <div class="x-left-footer">© 2026 ECHO<br>Everything leaves a trace.</div>
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
  function inspectAnomaly() { STATE.set('photoAnomaly', true); render(); }
  function analyzeMetadata() { STATE.set('metadata', true); render(); }
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
  function solveTimeline() { STATE.set('timeline', true); render(); }

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
          <div class="dash-title">案件檔案 ${cf.id}${level2 ? ` <span class="dim mono" style="font-size:11px">· ARCHIVE ACCESS · LEVEL 02</span>` : ''}</div>
          <div class="overview-grid">
            <div>
              <div class="overview-field"><div class="k">關係人</div><div class="v">${cf.subject}</div></div>
              <div class="overview-field"><div class="k">年齡</div><div class="v">${cf.age}</div></div>
              <div class="overview-field"><div class="k">狀態</div><div class="v warn">${cf.status}</div></div>
              <div class="overview-field"><div class="k">最後出現</div><div class="v">${cf.lastSeenDate}<br>${cf.lastSeenTime}</div></div>
              <div class="overview-field"><div class="k">地點</div><div class="v">${cf.location}</div></div>
              ${STATE.get('audio') ? `<div class="overview-field"><div class="k">調查者</div><div class="v evidence-color" style="cursor:pointer" onclick="location.hash='#/investigator'">灰 →</div></div>`
                : `<div class="overview-field"><div class="k">調查者</div><div class="v" style="color:var(--text-dim)">身分不明</div></div>`}
              ${level2 && caseRevisitOpen ? `<div class="dim mono" style="font-size:11px;margin-top:-8px">PREVIOUS VALUE 身分不明<br>MODIFIED BY GREY-128</div>` : ''}
              ${level2 ? `<div class="overview-field clickable" style="cursor:pointer" onclick="App.toggleCaseRevisit()"><div class="k">ARCHIVE RELATION</div><div class="v evidence-color">GREY-128</div></div>` : ''}
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
            <div class="row"><span class="k">LINKED ARCHIVE</span><span class="v">GREY-128</span></div>
            <div class="row"><span class="k">FIRST LINKED</span><span class="v">${esc(rv.firstLinked)}</span></div>
            <div class="row"><span class="k">LAST MODIFIED</span><span class="v">${esc(rv.lastModified)}</span></div>
          </div>
          <div class="observation-box warn" style="margin-top:14px;max-width:420px">ARCHIVE NOTE · 1 change detected<br>「${esc(rv.note)}」</div>
          <button class="btn" style="margin-top:14px;max-width:260px" onclick="location.hash='#/grey/128/versions'">[ 查看 Archive 版本 → ]</button>` : ''}
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
          ${solved ? `<button class="btn" style="margin-top:14px;max-width:280px" onclick="location.hash='#/evidence/audio'">[ 查看錄音證據 ]</button>` : ''}
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
    if (allCorrect) STATE.set('board', true);
  }
  function resetBoard() { boardLinks = []; boardSelected = null; render(); }
  function toggleBoardHelp() { boardHelpOpen = !boardHelpOpen; render(); }

  /* ================================================================
     SCREEN 18 — Audio Evidence
     ================================================================ */
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
        ${!STATE.get('audio') ? `<button class="audio-play-btn" onclick="App.playAudio()">▶</button>` : ''}
        <div class="audio-transcript" id="audio-transcript">${STATE.get('audio') ? a.transcript.map(transcriptLineHtml).join('') : ''}</div>
        ${STATE.get('audio') ? `<div class="lock-note">錄音已轉成逐字稿<br>偵測到 1 個身分不明的關係人。</div>
        <button class="btn" style="max-width:260px;margin:16px auto 0" onclick="location.hash='#/case/0917'">[ 回到案件檔案 ]</button>` : ''}
      </div>
    </div>
    ${bottomNav('board', true)}`;
  }
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
          <button class="btn" style="margin-top:30px;max-width:240px" onclick="App.finalReveal()">[ 進入 ]</button>
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
    const msgs = DATA.finalMessages;
    let i = 0;
    function showNext() {
      if (i >= msgs.length) { setTimeout(showChapterComplete, 1000); return; }
      if (box) {
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.textContent = msgs[i];
        box.appendChild(bubble);
      }
      i++;
      setTimeout(showNext, 1700);
    }
    showNext();
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
          location.hash = '#/archive';
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
    if (greySortMode === 'created') ids = ids.slice().sort((a, b) => greyCreatedRank(a) - greyCreatedRank(b));
    const rows = ids.map(id => {
      const label = `灰-${String(id).padStart(3, '0')}`;
      const isYou = id === you;
      const clickable = id === 128 || id === 0;
      const cls = ['cf-row']; if (clickable) cls.push('clickable');
      const onclick = id === 128 ? `onclick="location.hash='#/grey/128'"` : id === 0 ? `onclick="location.hash='#/grey/000'"` : '';
      const dateTag = greySortMode === 'created' ? `<span class="dim mono" style="font-size:12px;margin-right:10px">${greyCreatedDate(id)}</span>` : '';
      return `<div class="${cls.join(' ')}" ${onclick}><span class="k">${label}</span><span>${dateTag}<span class="v ${isYou ? 'evidence-color' : ''}">${isYou ? '你' : '存取遭拒'}</span></span></div>`;
    }).join('');
    return `
    <div class="view view-wide">
      ${backLink('#/archive', '封存庫')}
      <div class="dash-title">灰資料庫</div>
      <div class="board-toolbar">
        <button class="tool-btn ${greySortMode === 'id' ? 'active' : ''}" onclick="App.setGreySort('id')">[ ID SORT ]</button>
        <button class="tool-btn ${greySortMode === 'created' ? 'active' : ''}" onclick="App.setGreySort('created')">[ ARCHIVE CREATED ]</button>
      </div>
      <div class="case-file" style="margin-top:10px;max-width:520px;max-height:520px;overflow-y:auto">${rows}</div>
    </div>
    ${bottomNav('m', true)}`;
  }
  function setGreySort(mode) {
    greySortMode = mode;
    if (mode === 'created') STATE.set('ch2Puzzle01Solved', true);
    render();
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
        <div class="cf-row"><span class="k">狀態</span><span class="v">INACTIVE</span></div>
        <div class="cf-row"><span class="k">最後活動</span><span class="v">${esc(g.lastActivity)}</span></div>
      </div>
      <button class="btn" style="margin-top:20px;max-width:220px" onclick="location.hash='#/grey/128/archive'">[ 進入 ARCHIVE ]</button>
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
      <div class="dash-title">灰-128 · ARCHIVE</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        ${g.indexEntries.map(e => `<div class="cf-row"><span class="k">${e.id} ${esc(e.label)}</span><span class="v missing">DELETED</span></div>`).join('')}
        <div class="cf-row"><span class="k">FILE SIZE</span><span class="v">12.4 MB</span></div>
        <div class="cf-row"><span class="k">ACCOUNT HASH</span><span class="v mono">${esc(g.accountHash)}</span></div>
      </div>
      ${!checksumOpen
        ? `<button class="tool-btn" style="margin-top:14px" onclick="App.toggleChecksum()">[ 查看 CHECKSUM ]</button>`
        : `<div class="metadata-panel" style="margin-top:14px;max-width:420px">
             <div class="row"><span class="k">EXPECTED HASH</span><span class="v">${g.checksumExpected}</span></div>
             <div class="row"><span class="k">ARCHIVE HASH</span><span class="v">${g.checksumArchive}</span></div>
             <div class="row"><span class="k">RESULT</span><span class="v" style="color:var(--success)">MATCH</span></div>
           </div>`}
      <button class="btn" style="margin-top:20px;max-width:220px" onclick="location.hash='#/grey/128/integrity'">[ 查看 INDEX → ]</button>
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
      return `<div class="cf-row clickable" onclick="App.openIndexEntry('${e.id}')"><span class="k">${e.id} ${esc(e.label)}</span><span class="v ${opened && e.body === 'MISSING' ? 'missing' : ''}">${opened ? `BODY: ${e.body}` : 'HEADER: PRESENT · INDEX: PRESENT'}</span></div>`;
    }).join('');
    const solved = STATE.get('ch2Puzzle02Solved');
    return `
    <div class="view view-wide">
      ${backLink('#/grey/128/archive', '灰-128 ARCHIVE')}
      <div class="dash-title">FILE INTEGRITY</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">${rows}</div>
      ${solved ? `<div class="observation-box" style="margin-top:14px">Header 完整、Index 還在，但 02、03 的 Body 都消失了——有人只清掉了內容，卻沒有清掉索引。</div>
      <button class="btn" style="margin-top:14px;max-width:260px" onclick="location.hash='#/grey/128/chen'">[ 繼續調查 → ]</button>` : ''}
    </div>
    ${bottomNav('m', true)}`;
  }
  function openIndexEntry(id) {
    openedIndexEntries[id] = true;
    if (openedIndexEntries['02'] && openedIndexEntries['03']) STATE.set('ch2Puzzle02Solved', true);
    render();
  }

  /* ================================================================
     CHAPTER 02 — SCREEN 07/08 — Chen Archive / Fragment Reconstruction（Puzzle 03）
     ================================================================ */
  function viewChenArchive() {
    if (!STATE.get('ch2Puzzle02Solved')) return ch2Locked();
    return `
    <div class="view view-wide">
      ${backLink('#/grey/128/archive', '灰-128 ARCHIVE')}
      <div class="dash-title">陳奕辰 · ARCHIVE</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        <div class="cf-row"><span class="k">姓名</span><span class="v">陳奕辰</span></div>
        <div class="cf-row"><span class="k">帳號</span><span class="v">@chen_yc</span></div>
      </div>
      <div class="observation-box" style="margin-top:14px">系統偵測到跟這個帳號有關的資料不只一份，而且彼此不完整。</div>
      <button class="btn" style="margin-top:20px;max-width:260px" onclick="location.hash='#/grey/128/fragments'">[ 查看殘缺資料 → ]</button>
    </div>
    ${bottomNav('m', true)}`;
  }

  let fragSelected = null;
  let fragConnections = { device: false, account: false };
  let fragMessage = '';
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
      ${backLink('#/grey/128/chen', '陳奕辰 ARCHIVE')}
      <div class="dash-title">IDENTITY FRAGMENT RECONSTRUCTION</div>
      <p class="dim" style="font-size:13px">點選任兩個「DEVICE HASH」欄位試著把它們對上。</p>
      ${cardHtml('a')}${cardHtml('b')}${cardHtml('c')}
      ${fragMessage ? `<div class="observation-box warn" style="max-width:420px">${esc(fragMessage)}</div>` : ''}
      ${solved ? `
      <div class="observation-box" style="max-width:420px;margin-top:14px">ARCHIVE RELATION · 1 NEW LINK DETECTED<br><span class="dim mono" style="font-size:12px">GREY-128 → CASE #0917</span></div>
      <button class="btn" style="margin-top:14px;max-width:260px" onclick="location.hash='#/case/0917'">[ 前往 CASE #0917 → ]</button>` : ''}
    </div>
    ${bottomNav('m', true)}`;
  }
  function selectFragmentChip(fragKey, idx) {
    const row = DATA.ch2.fragments[fragKey].rows[idx];
    fragMessage = '';
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
      } else {
        fragMessage = 'RELATION UNSUPPORTED / NO COMMON SOURCE';
      }
      fragSelected = null;
    }
    if (fragConnections.device && fragConnections.account) {
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
      <div class="dash-title">ARCHIVE VERSION COMPARE</div>
      <p class="dim" style="font-size:13px">找出每一版跟前一版不一樣的字。</p>
      <div class="case-file" style="margin-top:10px;max-width:420px">${rows}</div>
      ${found ? `<button class="btn" style="margin-top:20px;max-width:260px" onclick="location.hash='#/grey/128/edit-history'">[ 查看修改紀錄 → ]</button>` : ''}
    </div>
    ${bottomNav('case', true)}`;
  }
  function selectDiffChar(version) {
    versionFound[version] = true;
    const versions = DATA.ch2.archiveVersions;
    if (versions.every(v => v.diffIndex === undefined || versionFound[v.version])) {
      STATE.set('ch2VersionDiffFound', true);
    }
    render();
  }
  function viewEditHistory() {
    if (!STATE.get('ch2VersionDiffFound')) return ch2Locked();
    STATE.set('ch2Puzzle04Solved', true);
    const versions = DATA.ch2.archiveVersions;
    const author = DATA.ch2.editHistoryAuthor;
    return `
    <div class="view view-wide">
      ${backLink('#/case/0917', '案件檔案')}
      <div class="dash-title">EDIT HISTORY</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        ${versions.map(v => `<div class="cf-row"><span class="k">${v.version.toUpperCase()} AUTHOR</span><span class="v evidence-color">${esc(author)}</span></div>`).join('')}
      </div>
      <div class="observation-box" style="margin-top:14px">這三版都不是陳奕辰留下的——是灰-127。不同代灰之間，似乎會互相留言。</div>
      <button class="btn" style="margin-top:14px;max-width:260px" onclick="location.hash='#/grey/chain'">[ 繼續調查 → ]</button>
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
      ${backLink('#/grey/128/edit-history', 'EDIT HISTORY')}
      <div class="dash-title">GREY CHAIN</div>
      <p class="dim" style="font-size:13px">依 ARCHIVE CREATED 時間，由舊到新依序點選。</p>
      <div class="case-file" style="margin-top:10px;max-width:420px">${nodes}</div>
      <div class="board-toolbar" style="margin-top:14px">
        <button class="tool-btn" onclick="App.resetChain()">[ 重設 ]</button>
      </div>
      ${chainWrong ? `<div class="observation-box warn" style="max-width:420px">順序不對，再試一次。</div>` : ''}
      ${solved ? `<div class="observation-box" style="max-width:420px">灰-001 → 灰-027 → 灰-063 → 灰-091 → 灰-128——一條跨越多年的鏈。</div>
      <button class="btn" style="margin-top:14px;max-width:260px" onclick="location.hash='#/grey/000'">[ 前往灰-000 → ]</button>` : ''}
    </div>
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
        <div class="cf-row"><span class="k">狀態</span><span class="v missing">DELETED</span></div>
        <div class="cf-row"><span class="k">LAST MODIFIED</span><span class="v">UNKNOWN</span></div>
      </div>
      <button class="btn" style="margin-top:20px;max-width:240px" onclick="App.startGreyRecovery()">[ RECOVER ARCHIVE ]</button>
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
    el.innerHTML = `<div class="label">RECOVERING ARCHIVE</div><div class="big" id="recovery-pct">04%</div>`;
    const pcts = [18, 31, 52, 71, 89, 99];
    let i = 0;
    (function step() {
      const pctEl = document.getElementById('recovery-pct');
      if (i < pcts.length) {
        if (pctEl) pctEl.textContent = pcts[i] + '%';
        i++;
        setTimeout(step, 350);
      } else {
        el.innerHTML = `<div class="label" style="color:var(--warning)">RECOVERY FAILED</div><div class="id-line" style="margin-top:20px"><span class="dim" style="cursor:pointer;text-decoration:underline" onclick="App.showRecoveredFragment()">1 fragment recovered</span></div>`;
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
      <div class="dash-title">FRAGMENT_000_A</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        ${DATA.ch2.evidence.map(e => `<div class="cf-row"><span class="k">${e.label}</span><span class="v dim">未比對</span></div>`).join('')}
      </div>
      <button class="btn" style="margin-top:20px;max-width:260px" onclick="location.hash='#/grey/000/evidence'">[ 開始比對 → ]</button>
    </div>
    ${bottomNav('m', true)}`;
  }

  let evidenceRevealed = {};
  const evidenceLabel = { match: 'MATCH', partial: 'PARTIAL', unresolved: 'UNRESOLVED' };
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
      ${backLink('#/grey/000/fragment', 'FRAGMENT_000_A')}
      <div class="dash-title">IDENTITY EVIDENCE MATCHING</div>
      <p class="dim" style="font-size:13px">逐項比對灰-000 的殘留資料跟林予安的既有資料。</p>
      <div class="case-file" style="margin-top:10px;max-width:420px">${rows}</div>
      ${allRevealed ? `
      <div class="observation-box" style="margin-top:14px;max-width:420px">${counts.match} MATCH / ${counts.partial} PARTIAL / ${counts.unresolved} UNRESOLVED</div>
      <button class="btn" style="margin-top:14px;max-width:260px" onclick="App.goToArchiveConflict()">[ 繼續 → ]</button>` : ''}
    </div>
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
      { key: 'A', text: 'GREY-000 IS LIN, YU-AN' },
      { key: 'B', text: 'LIN, YU-AN IS CONNECTED TO GREY-000' },
      { key: 'C', text: 'INSUFFICIENT EVIDENCE' },
    ];
    return `
    <div class="view view-wide">
      ${backLink('#/grey/000/evidence', 'EVIDENCE MATCHING')}
      <div class="dash-title">ARCHIVE CONFLICT</div>
      <div class="case-file" style="margin-top:10px;max-width:420px">
        <div class="cf-row"><span class="k">MATCH</span><span class="v" style="color:var(--success)">${counts.match}</span></div>
        <div class="cf-row"><span class="k">PARTIAL</span><span class="v" style="color:var(--evidence)">${counts.partial}</span></div>
        <div class="cf-row"><span class="k">UNRESOLVED</span><span class="v dim">${counts.unresolved}</span></div>
        <div class="cf-row"><span class="k">IDENTITY CONFIDENCE</span><span class="v evidence-color">${conf}%</span></div>
      </div>
      <div class="dash-nav-title" style="margin-top:20px">調查判斷</div>
      <div class="case-file" style="margin-top:8px;max-width:420px">
        ${options.map(o => `<div class="cf-row clickable ${judgement === o.key ? 'active' : ''}" onclick="App.submitJudgement('${o.key}')"><span class="k">${o.key}</span><span class="v">${o.text}</span></div>`).join('')}
      </div>
      ${judgement && judgement !== 'C' ? `<div class="observation-box warn" style="margin-top:14px;max-width:420px">CONCLUSION UNSUPPORTED<br>IDENTITY MATCH ≠ IDENTITY CONFIRMED</div>` : ''}
      ${judgement === 'C' ? `<div class="observation-box" style="margin-top:14px;max-width:420px">INVESTIGATION STATUS: PROVISIONAL</div>
      <button class="btn" style="margin-top:14px;max-width:260px" onclick="App.ch2FinalReveal()">[ 繼續 → ]</button>` : ''}
    </div>
    ${bottomNav('m', true)}`;
  }
  function submitJudgement(choice) {
    STATE.set('ch2Judgement', choice);
    if (choice === 'C') STATE.set('ch2Puzzle05Solved', true);
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
    el.innerHTML = `<div class="label">GREY-130</div><div class="id-line" id="successor-status">SUCCESSOR<br>NOT FOUND</div>`;
    setTimeout(() => {
      const s = document.getElementById('successor-status');
      if (s) s.innerHTML = 'SUCCESSOR<br>FOUND';
      setTimeout(() => {
        el.innerHTML = `<div class="label">GREY-130</div><div class="id-line">INVESTIGATOR<br>UNKNOWN</div><div class="big" style="font-size:18px;margin-top:24px;letter-spacing:0.02em">Someone is already looking for you.</div>`;
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
      location.hash = '#/archive';
    }, 2400);
  }

  /* ---------------- Router ---------------- */
  const routes = {
    '': viewEntry,
    '#/': viewEntry,
    '#/archive': viewDashboard,
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
    '#/grey-database': viewGreyDatabase,
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
    playAudio, finalReveal, runMSequence,
    setGreySort, toggleChecksum, openIndexEntry, selectFragmentChip,
    selectDiffChar, selectChainNode, resetChain,
    startGreyRecovery, showRecoveredFragment, revealEvidence, goToArchiveConflict,
    submitJudgement, ch2FinalReveal,
    toggleHint, deeperHint,
    showIntro, hideIntro, maybeAutoShowIntro,
  };
})();

App.render();
if (!location.hash || location.hash === '#/') App.maybeAutoShowIntro();
