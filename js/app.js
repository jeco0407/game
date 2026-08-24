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
  function img(key) {
    return { conbini: 'assets/images/evidence-conbini.svg', figure: 'assets/images/evidence-figure.svg' }[key] || '';
  }

  /* ---------------- bottom nav ---------------- */
  function bottomNav(active, wide) {
    const items = [
      { key: 'archive', label: 'ARCHIVE', hash: '#/archive', locked: false },
      { key: 'case', label: 'CASE', hash: STATE.get('access') ? '#/case/0917' : '#/case-overview', locked: false },
      { key: 'board', label: 'BOARD', hash: '#/evidence-board', locked: !STATE.get('access') },
      { key: 'm', label: STATE.get('final') ? 'M-DB' : 'M', hash: STATE.get('final') ? '#/m-database' : '#/investigator', locked: !STATE.get('audio') },
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
    return `<span class="back-link" onclick="location.hash='${hash}'">← ${label}</span>`;
  }

  /* ---------------- hint system ---------------- */
  let hintOpen = false;
  let hintLevels = {};
  function hintBar(puzzleKey) {
    if (!puzzleKey) return '';
    return `
    <div class="hint-bar">
      <div class="hint-toggle" onclick="App.toggleHint()">${hintOpen ? '[ CLOSE ]' : '[ NEED A HINT? ]'}</div>
    </div>
    ${hintOpen ? renderHintPanel(puzzleKey) : ''}`;
  }
  function renderHintPanel(puzzleKey) {
    const levels = DATA.hints[puzzleKey] || [];
    const titles = ['OBSERVATION', 'CONNECTION', 'DIRECTION'];
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
      <div class="entry-logo">ECHO</div>
      <div class="entry-tagline">${DATA.tagline}<br>${DATA.taglineZh}</div>
      <div class="entry-version">ARCHIVE SYSTEM<br>${DATA.version}</div>
      <div class="entry-case-reveal">
        CASE 0917<br>
        STATUS <span class="v">ACTIVE</span>
      </div>
      <button class="entry-access-btn" onclick="location.hash='#/archive'">[ ACCESS ARCHIVE ]</button>
      <div class="entry-sysonline">SYSTEM ONLINE</div>
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
          <div class="dash-nav-title">ARCHIVE</div>
          ${nav.map(n => `<div class="dash-nav-item ${n === 'Cases' ? 'active' : ''}" ${n === 'Cases' ? "onclick=\"location.hash='#/archive'\"" : (n === 'People' ? "onclick=\"location.hash='#/profile/yuan'\"" : '')}>${n}</div>`).join('')}
          ${STATE.get('final') ? `<div class="dash-nav-item" onclick="location.hash='#/m-database'">M Database</div>` : ''}
          <div class="dash-sys">SYSTEM<br><span class="v">ONLINE</span></div>
        </div>
        <div class="dash-main">
          <div class="dash-title">ARCHIVE / RECENT CASES</div>
          <div class="case-grid">
            <div class="case-card" onclick="location.hash='#/case-overview'">
              <div class="cc-id">CASE #0917</div>
              <div class="cc-name">LIN, YU-AN</div>
              <div>LAST SEEN<br>08 / 17 / 2026 · 23:17</div>
              <div class="cc-status">STATUS: ACTIVE</div>
            </div>
            <div class="case-card restricted"><div class="cc-id">CASE #0642</div><div class="cc-name">RESTRICTED</div></div>
            <div class="case-card restricted"><div class="cc-id">CASE #1188</div><div class="cc-name">RESTRICTED</div></div>
            <div class="case-card restricted"><div class="cc-id">CASE #0033</div><div class="cc-name">RESTRICTED</div></div>
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
      ${backLink('#/archive', 'ARCHIVE')}
      <div class="dash-title">CASE ${c.id} / MISSING PERSON</div>
      <div class="overview-grid">
        <div>
          <div class="overview-field"><div class="k">SUBJECT</div><div class="v">${c.subject}</div></div>
          <div class="overview-field"><div class="k">AGE</div><div class="v">${c.age}</div></div>
          <div class="overview-field"><div class="k">LAST SEEN</div><div class="v">${c.lastSeenDate}<br>${c.lastSeenTime}</div></div>
          <div class="overview-field"><div class="k">STATUS</div><div class="v warn">${c.status}</div></div>
        </div>
        <div>
          <div class="overview-field"><div class="k">RELATED</div></div>
          ${c.related.map(r => `
            <div class="related-item ${relatedLinked ? 'linked' : ''}" ${relatedLinked ? `onclick="location.hash='${r.name.startsWith('CHEN') ? '#/profile/chen_yc' : '#/profile/m_0917'}'"` : ''}>
              <span class="name">${esc(r.name)}</span><span class="status">${relatedLinked ? '→' : r.status}</span>
            </div>`).join('')}
          <div class="overview-field" style="margin-top:20px"><div class="k">LAST DIGITAL ACTIVITY</div><div class="v">${c.lastActivity.date}<br>${c.lastActivity.time}</div></div>
        </div>
      </div>
      <div class="overview-cta" onclick="location.hash='#/feed'">VIEW DIGITAL ARCHIVE →</div>
    </div>
    ${bottomNav('case', true)}`;
  }

  /* ================================================================
     SCREEN 04 — Social Feed
     ================================================================ */
  function feedPostHtml(p) {
    if (p.unlockAfter && !STATE.get(p.unlockAfter)) return '';
    return `
    <a class="post" href="#/post/${p.id}">
      <div class="post-head">
        <div class="avatar"></div>
        <div><div class="post-name">YUAN</div><div class="post-handle">@last_seen_0917</div></div>
      </div>
      <div class="post-body">${nl(p.text)}</div>
      ${p.image ? `<img class="post-img" src="${img(p.image)}" alt="">` : ''}
      ${p.isLast ? `<div class="post-countdown mono">23:17:42</div>` : ''}
      <div class="post-time mono">${p.time}</div>
      ${p.isLast ? `<div class="post-meta"><span>♡ ${p.likes}</span><span>↻ ${p.reposts}</span><span>○ ${p.comments} replies</span></div>` : ''}
    </a>`;
  }
  function viewFeed() {
    return `
    <div class="view view-narrow">
      <div class="feed-header">
        <div class="label">ECHO SOCIAL</div>
        <div class="handle" style="cursor:pointer" onclick="location.hash='#/profile/yuan'">@last_seen_0917 · YUAN</div>
      </div>
      ${DATA.feed.map(feedPostHtml).join('')}
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
      ${backLink('#/feed', 'FEED')}
      <div class="profile-head">
        <div class="profile-avatar"></div>
        <div class="post-name">${p.name}</div>
        <div class="post-handle">@${p.handle}</div>
        <div class="bio-hover profile-bio">${esc(p.bio)}<div class="reveal-tip">${esc(p.bioHoverReveal)}</div></div>
        <div class="profile-status">${p.posts} posts · ${p.following} following · ${p.followers} followers</div>
      </div>
      <div class="evidence-data" style="margin-top:10px">
        <div class="row"><span class="k">ACCOUNT STATUS</span></div>
        <div class="row"><span class="k">LAST ACTIVE</span><span class="v">${p.lastActive}</span></div>
      </div>
      <button class="btn" style="margin-top:20px" onclick="location.hash='#/feed'">[ VIEW POSTS ]</button>
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
  function viewPost(id) {
    const p = DATA.feed.find(x => x.id === id);
    if (!p) return `<div class="view view-narrow">NOT FOUND ${backLink('#/feed','FEED')}</div>`;

    let body = `
    <div class="view view-narrow">
      ${backLink('#/feed', 'FEED')}
      <div class="post" style="border-bottom:none;padding-top:0">
        <div class="post-head">
          <div class="avatar"></div>
          <div><div class="post-name">YUAN</div><div class="post-handle">@last_seen_0917</div></div>
        </div>
        <div class="post-body">${nl(p.text)}</div>
        ${p.image ? `<img class="post-img" src="${img(p.image)}" alt="">` : ''}
        ${p.image === 'conbini' ? `<button class="btn" style="margin-top:14px" onclick="location.hash='#/photo/02'">[ INSPECT PHOTO → ]</button>` : ''}
        ${p.isLast ? `<div class="post-countdown mono">23:17:42</div>` : ''}
        <div class="post-time mono">${p.time}</div>
      </div>`;

    if (p.isLast) {
      const visible = DATA.comments17.filter(c => !c.hidden);
      body += `<div class="comments">${visible.map(commentHtml).join('')}</div>`;

      body += `<div style="margin-top:14px">`;
      if (window.__hiddenOpen) {
        const hidden = DATA.comments17.find(c => c.hidden);
        body += `<div class="comment hidden"><div class="h">@<span style="cursor:pointer" onclick="location.hash='#/profile/m_0917'">${esc(hidden.user)}</span> <span class="dim">· ${esc(hidden.time)}</span></div><div>${nl(hidden.text)}</div></div>`;
      } else {
        body += `<div class="hidden-reply-toggle" onclick="App.revealHidden()">19 replies<br>1 hidden reply</div>`;
      }
      body += `</div>`;
    }

    body += `</div>${bottomNav()}${hintBar(p.isLast && !window.__hiddenOpen ? 'hiddenReply' : null)}`;
    return body;
  }
  function revealHidden() { window.__hiddenOpen = true; render(); }

  /* ================================================================
     SCREEN 09 — M_0917 profile
     ================================================================ */
  function viewMProfile() {
    const m = DATA.mProfile;
    return `
    <div class="view view-narrow">
      ${backLink('#/post/17', 'LAST POST')}
      <div class="profile-head">
        <div class="profile-avatar"></div>
        <div class="post-name">${m.name}</div>
        <div class="post-handle">@${m.handle}</div>
        <div class="profile-status">${m.followers} followers · ${m.following} following · ${m.posts} post</div>
      </div>
      <div class="blank-post">${nl(m.post)}<div class="post-time mono" style="margin-top:16px">${m.postDate}</div></div>
      ${STATE.get('timeline') ? `<button class="btn" style="margin-top:20px" onclick="location.hash='#/profile/chen_yc'">[ ARCHIVE → ]</button>` : `<div class="lock-note">這個帳號似乎跟其他線索有關，但目前還連不起來。</div>`}
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
    const anomalyLabel = STATE.get('photoAnomaly') ? 'UNKNOWN PERSON' : '?';
    return `
    <div class="view view-wide">
      ${backLink('#/feed', 'FEED')}
      <div class="dash-title">EVIDENCE / PHOTO</div>
      <div class="photo-viewer-layout">
        <div class="photo-viewer-main">
          <div class="evidence-frame">
            <div class="evidence-img-wrap" id="ev-wrap" style="position:relative">
              <img class="evidence-img" id="ev-img" src="${img('conbini')}" alt="">
              <div class="anomaly-tag" style="left:30%; top:44%" onclick="App.inspectAnomaly()">${anomalyLabel}</div>
            </div>
            <div class="evidence-toolbar">
              <button class="tool-btn" onclick="App.zoomToggle()">[ ZOOM ]</button>
              <button class="tool-btn" onclick="App.toggleFx('bright')">[ BRIGHTNESS ]</button>
              <button class="tool-btn" onclick="App.toggleFx('contrast')">[ CONTRAST ]</button>
              <button class="tool-btn" onclick="App.resetFx()">[ RESET ]</button>
            </div>
          </div>
          ${STATE.get('photoAnomaly') ? `<div class="observation-box">ANOMALY DETECTED — 玻璃反射中有一個身分不明的人。門牌上的號碼是 <b class="evidence-color">${esc(e.doorplate)}</b>。</div>` : `<div class="observation-box">你確定你已經看完這張照片了嗎？試著點擊照片中可疑的地方。</div>`}
        </div>
        <div class="photo-viewer-side">
          <div class="metadata-panel">
            <div class="row"><span class="k">IMAGE</span><span class="v" style="color:var(--text)">${e.id}</span></div>
            <div class="row"><span class="k">CREATED</span><span class="v">${e.created}</span></div>
            <div class="row"><span class="k">MODIFIED</span><span class="v">${e.modified}</span></div>
            <div class="row"><span class="k">CAMERA</span><span class="v" style="color:var(--text-dim)">${e.camera}</span></div>
            <div class="row"><span class="k">LOCATION</span><span class="v" style="color:var(--text-dim)">${e.location}</span></div>
            <div class="row"><span class="k">DEVICE</span><span class="v" style="color:var(--text-dim)">${e.device}</span></div>
          </div>
          ${!STATE.get('metadata') ? `<button class="btn" style="margin-top:14px" onclick="App.analyzeMetadata()">[ ANALYZE ]</button>` : `
          <div class="conflict-banner">TIMELINE CONFLICT<br>Something doesn't match.</div>
          <button class="btn" style="margin-top:14px" onclick="location.hash='#/timeline'">[ REBUILD TIMELINE → ]</button>`}
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
      return `<div class="view view-wide">${backLink('#/photo/02','EVIDENCE')}<p class="dim mono">LOCKED. Analyze the photo metadata first.</p></div>${bottomNav('case', true)}`;
    }
    const solved = STATE.get('timeline');
    const track = DATA.timelineTrack;
    return `
    <div class="view view-wide">
      ${backLink('#/photo/02', 'EVIDENCE')}
      <div class="dash-title">TIMELINE RECONSTRUCTION</div>
      <p class="dim" style="font-size:13px">IMG_0917 出現在 8/18 的貼文裡，但它實際上是什麼時候被建立的？把它拖到正確的那一天（或按下面的按鈕）。</p>
      <div class="timeline-track">
        ${track.map(day => `
          <div class="tl-day">
            <div class="tl-day-label">${day.day}</div>
            ${day.events.map(ev => `<div class="tl-event">${esc(ev)}</div>`).join('')}
            ${day.day === '08/19' ? `<div class="tl-slot ${solved ? '' : 'drag-over'}" id="tl-slot-0819" ondragover="event.preventDefault()" ondrop="App.dropOnSlot(event)">${solved ? '<span class="evidence-color">IMG_0917</span>' : 'DROP HERE'}</div>` : ''}
          </div>`).join('')}
        ${!solved ? `<div class="tl-day">
          <div class="tl-day-label">UNPLACED</div>
          <div class="tl-drag-item" id="tl-img-chip" draggable="true" ondragstart="App.dragImgStart(event)">IMG_0917</div>
          <button class="tool-btn" style="margin-top:10px" onclick="App.moveImgToSlot()">[ MOVE TO 08/19 → ]</button>
        </div>` : ''}
      </div>
      ${solved ? `<div class="timeline-conflict-box">CONFLICT<br>This image appears before it was created.<br><br><b>Someone modified the archive.</b></div>
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
      return `<div class="view view-narrow">${backLink('#/feed','FEED')}<p class="dim mono">ACCOUNT NOT FOUND.</p></div>${bottomNav()}`;
    }
    STATE.set('chenVisited', true);
    const c = DATA.chenProfile;
    let body = `
    <div class="view view-narrow">
      ${backLink('#/profile/m_0917', '@m_0917')}
      <div class="profile-head">
        <div class="profile-avatar"></div>
        <div class="post-name">${c.name}</div>
        <div class="post-handle">@${c.handle}</div>
        <div class="profile-status warn">${c.status}</div>
        <div class="profile-bio">${esc(c.bio)}</div>
        <div class="profile-status">${c.posts} posts</div>
      </div>
      <div class="blank-post" style="text-align:left">${nl(c.lastPost.text)}<div class="post-time mono" style="margin-top:10px">${c.lastPost.time}</div></div>
      <div class="label" style="margin-top:24px">ARCHIVED POSTS</div>
      <div class="deleted-list">
        ${c.archived.map(a => {
          if (a.highlight && !STATE.get('access')) {
            return `<div class="deleted-item highlight" onclick="App.openAccessPrompt()"><span>${a.title}</span><span>${esc(a.time)}</span></div>`;
          }
          if (a.highlight && STATE.get('access')) {
            return `<div class="deleted-item"><span>CASE FILE #0917</span><span class="evidence-color" style="cursor:pointer" onclick="location.hash='#/case/0917'">unlocked →</span></div>`;
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
      <div class="ap-title">ARCHIVE RESTRICTED</div>
      <div class="ap-id">CONTENT ID · ${esc(ap.contentId)}</div>
      <div class="ap-question">${nl(ap.question)}</div>
      <div class="archive-input-row">
        <input class="archive-input mono" id="ans-access" placeholder="……" autocomplete="off">
        <button class="archive-submit" onclick="App.submitAccess()">ENTER</button>
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
      msg.textContent = 'ACCESS GRANTED.';
      setTimeout(render, 500);
    } else {
      msg.className = 'access-msg denied';
      msg.textContent = 'ACCESS DENIED. The archive doesn\'t recognize this. Try again.';
    }
  }

  /* ================================================================
     SCREEN 16 — Case File (full)
     ================================================================ */
  function viewCaseFile() {
    if (!STATE.get('access')) {
      return `<div class="view view-wide">${backLink('#/case-overview','CASE OVERVIEW')}<p class="dim mono">CASE FILE LOCKED.</p></div>${bottomNav('case', true)}`;
    }
    const cf = DATA.caseFile;
    return `
    <div class="view view-wide">
      ${backLink('#/case-overview', 'CASE OVERVIEW')}
      <div class="dash-title">CASE FILE ${cf.id}</div>
      <div class="overview-grid">
        <div>
          <div class="overview-field"><div class="k">SUBJECT</div><div class="v">${cf.subject}</div></div>
          <div class="overview-field"><div class="k">AGE</div><div class="v">${cf.age}</div></div>
          <div class="overview-field"><div class="k">STATUS</div><div class="v warn">${cf.status}</div></div>
          <div class="overview-field"><div class="k">LAST SEEN</div><div class="v">${cf.lastSeenDate}<br>${cf.lastSeenTime}</div></div>
          <div class="overview-field"><div class="k">LOCATION</div><div class="v">${cf.location}</div></div>
          ${STATE.get('audio') ? `<div class="overview-field"><div class="k">INVESTIGATOR</div><div class="v evidence-color" style="cursor:pointer" onclick="location.hash='#/investigator'">M →</div></div>`
            : `<div class="overview-field"><div class="k">INVESTIGATOR</div><div class="v" style="color:var(--text-dim)">UNKNOWN</div></div>`}
        </div>
        <div>
          <div class="overview-field"><div class="k">RELATED PERSONS</div></div>
          ${cf.related.map(r => `<div class="related-item"><span class="name">${esc(r.name)}</span><span class="status">${r.status}</span></div>`).join('')}
          <div class="overview-field" style="margin-top:20px"><div class="k">DIGITAL ACTIVITY</div>
            <div class="v" style="font-size:13px;line-height:2">${cf.digitalActivity.map(esc).join('<br>')}</div>
          </div>
        </div>
      </div>
      <div class="overview-cta" onclick="location.hash='#/evidence-board'">EVIDENCE BOARD →</div>
    </div>
    ${bottomNav('case', true)}`;
  }

  /* ================================================================
     SCREEN 17 — Evidence Board
     ================================================================ */
  let boardLinks = []; // array of [id,id]
  let boardSelected = null;
  function linkKey(a, b) { return [a, b].sort().join('|'); }
  function hasLink(a, b) { return boardLinks.some(l => linkKey(l[0], l[1]) === linkKey(a, b)); }
  function isCorrectLink(a, b) { return DATA.evidenceBoardCorrectLinks.some(l => linkKey(l[0], l[1]) === linkKey(a, b)); }

  function viewBoard() {
    if (!STATE.get('access')) {
      return `<div class="view view-wide">${backLink('#/case/0917','CASE FILE')}<p class="dim mono">LOCKED.</p></div>${bottomNav('board', true)}`;
    }
    const solved = STATE.get('board');
    const nodes = DATA.evidenceBoardNodes;
    return `
    <div class="view view-wide">
      ${backLink('#/case/0917', 'CASE FILE')}
      <div class="dash-title">EVIDENCE BOARD</div>
      <p class="dim" style="font-size:13px">依序點選兩張卡片，把它們連在一起。試著找出正確的關係鏈。</p>
      <div class="board-toolbar">
        <button class="tool-btn" onclick="App.resetBoard()">[ RESET LINKS ]</button>
      </div>
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
        ${solved ? 'PATTERN DETECTED<br>AUDIO EVIDENCE AVAILABLE →' : ''}
      </div>
      ${solved ? `<button class="btn" style="margin-top:14px;max-width:280px" onclick="location.hash='#/evidence/audio'">[ VIEW AUDIO EVIDENCE ]</button>` : ''}
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

  /* ================================================================
     SCREEN 18 — Audio Evidence
     ================================================================ */
  function viewAudio() {
    if (!STATE.get('board')) {
      return `<div class="view view-wide">${backLink('#/evidence-board','EVIDENCE BOARD')}<p class="dim mono">LOCKED.</p></div>${bottomNav('board', true)}`;
    }
    const a = DATA.audioEvidence;
    const bars = Array.from({ length: 40 }, (_, i) => 6 + Math.round(Math.sin(i * 0.7) * 10 + 12));
    return `
    <div class="view view-wide">
      ${backLink('#/evidence-board', 'EVIDENCE BOARD')}
      <div class="audio-evidence-box">
        <div class="audio-evidence-id">${a.id} · AUDIO RECORDING</div>
        <div class="audio-evidence-dur">${a.duration}</div>
        <div class="waveform" id="waveform">${bars.map(h => `<div class="bar" style="height:${h}px"></div>`).join('')}</div>
        ${!STATE.get('audio') ? `<button class="btn" style="max-width:260px;margin:0 auto" onclick="App.playAudio()">[ ▶ PLAY RECORDING ]</button>` : ''}
        <div class="audio-transcript" id="audio-transcript" style="margin-top:20px;text-align:left;max-width:400px;margin-left:auto;margin-right:auto"></div>
        ${STATE.get('audio') ? `<div class="lock-note">EVIDENCE TRANSCRIBED<br>1 unknown entity detected.</div>
        <button class="btn" style="max-width:260px;margin:16px auto 0" onclick="location.hash='#/case/0917'">[ RETURN TO CASE FILE ]</button>` : ''}
      </div>
    </div>
    ${bottomNav('board', true)}`;
  }
  function playAudio() {
    const wf = document.getElementById('waveform');
    if (wf) wf.classList.add('playing');
    const box = document.getElementById('audio-transcript');
    const transcript = DATA.audioEvidence.transcript;
    if (box) box.innerHTML = '';
    transcript.forEach((l, i) => {
      setTimeout(() => {
        if (!box) return;
        const div = document.createElement('div');
        div.className = 'line' + (l.warn ? ' warn-line' : '');
        div.textContent = `${l.t} — ${l.line}`;
        box.appendChild(div);
      }, i * 1400);
    });
    setTimeout(() => {
      STATE.set('audio', true);
      render();
    }, transcript.length * 1400 + 800);
  }

  /* ================================================================
     SCREEN 19/20/21/22/23 — Investigator → M-129 → Final message
     ================================================================ */
  function viewInvestigator() {
    if (!STATE.get('audio')) {
      return `<div class="view view-wide">${backLink('#/case/0917','CASE FILE')}<p class="dim mono">LOCKED.</p></div>${bottomNav('m', true)}`;
    }
    if (!STATE.get('final')) {
      return `
      <div class="view view-wide">
        <div class="investigator-reveal">
          <div class="label">INVESTIGATOR PROFILE</div>
          <div class="big">M</div>
          <div class="id-line" id="total-inv">TOTAL INVESTIGATORS<br>128</div>
          <button class="btn" style="margin-top:30px;max-width:240px" onclick="App.finalReveal()">[ ACCESS ]</button>
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
    el.innerHTML = `<div class="label">INVESTIGATOR PROFILE</div><div class="big">M</div><div class="id-line">TOTAL INVESTIGATORS</div><div class="big" id="counter">128</div>`;
    setTimeout(() => {
      const counter = document.getElementById('counter');
      if (counter) counter.textContent = '129';
      setTimeout(() => {
        el.innerHTML = `<div class="label">INVESTIGATOR</div><div class="big" style="color:var(--evidence)">M-${STATE.investigatorId()}</div><div class="id-line" style="margin-top:20px">STATUS</div><div class="big" style="color:var(--warning);font-size:18px">ACTIVE</div><div class="id-line" style="margin-top:20px">INVESTIGATION STARTED<br><span class="mono">${formatElapsed(STATE.elapsedMs())} AGO</span></div>`;
        setTimeout(showFinalMessages, 2200);
      }, 900);
    }, 1000);
  }

  function showFinalMessages() {
    const container = document.body;
    const msgs = DATA.finalMessages;
    let i = 0;
    function showNext() {
      if (i >= msgs.length) { showChapterComplete(); return; }
      const toast = document.createElement('div');
      toast.className = 'new-message-toast';
      toast.innerHTML = `NEW MESSAGE<br><span class="dim" style="font-size:11px">@last_seen_0917</span><br>「${esc(msgs[i])}」`;
      container.appendChild(toast);
      i++;
      setTimeout(() => { toast.remove(); setTimeout(showNext, 300); }, 2400);
    }
    showNext();
  }

  function showChapterComplete() {
    const div = document.createElement('div');
    div.className = 'ending-screen';
    div.innerHTML = `<div class="label">CASE #0917</div><div style="height:6px"></div><div class="label">INVESTIGATION</div><div style="font-size:16px;color:var(--warning)">ACTIVE</div>`;
    document.body.appendChild(div);
    setTimeout(() => {
      div.innerHTML = `<div class="big" style="font-size:22px;letter-spacing:0.14em">CHAPTER 01</div><div class="big" style="font-size:26px;color:var(--evidence)">23:17</div><div class="label">COMPLETE</div>`;
      setTimeout(() => {
        div.innerHTML = `<div class="label">NEXT INSTRUCTION</div><div style="margin-top:14px;font-size:15px;line-height:2">DO NOT LOOK FOR LIN.<br><b>LOOK FOR M.</b></div>`;
        setTimeout(() => {
          div.remove();
          STATE.set('final', true);
          location.hash = '#/archive';
        }, 2600);
      }, 2400);
    }, 2200);
  }

  /* ================================================================
     SCREEN 24 — M Database
     ================================================================ */
  function viewMDatabase() {
    if (!STATE.get('final')) {
      return `<div class="view view-wide">${backLink('#/archive','ARCHIVE')}<p class="dim mono">ACCESS DENIED.</p></div>${bottomNav('archive', true)}`;
    }
    const id = STATE.investigatorId();
    let rows = '';
    for (let i = 1; i <= 6; i++) rows += `<div class="cf-row"><span class="k">M-${String(i).padStart(3,'0')}</span><span class="v dim">ACCESS DENIED</span></div>`;
    rows += `<div class="cf-row"><span class="k">...</span><span class="v dim">...</span></div>`;
    rows += `<div class="cf-row"><span class="k">M-128</span><span class="v dim">ACCESS DENIED</span></div>`;
    rows += `<div class="cf-row"><span class="k">M-${id}</span><span class="v evidence-color">YOU</span></div>`;
    return `
    <div class="view view-wide">
      ${backLink('#/archive', 'ARCHIVE')}
      <div class="dash-title">M DATABASE</div>
      <div class="case-file" style="margin-top:10px;max-width:480px">${rows}
        <div class="cf-row clickable" onclick="App.openM000()"><span class="k">M-000</span><span class="v missing">DELETED</span></div>
      </div>
      <div id="m000-slot" style="margin-top:14px"></div>
    </div>
    ${bottomNav('m', true)}`;
  }
  function openM000() {
    const slot = document.getElementById('m000-slot');
    if (slot) slot.innerHTML = `<div class="observation-box warn">ACCESS DENIED<br>You are not ready.</div>`;
  }

  /* ---------------- Router ---------------- */
  const routes = {
    '': viewEntry,
    '#/': viewEntry,
    '#/archive': viewDashboard,
    '#/case-overview': viewCaseOverview,
    '#/feed': viewFeed,
    '#/profile/yuan': viewYuanProfile,
    '#/profile/m_0917': viewMProfile,
    '#/profile/chen_yc': viewChenProfile,
    '#/photo/02': viewPhoto,
    '#/timeline': viewTimeline,
    '#/case/0917': viewCaseFile,
    '#/evidence-board': viewBoard,
    '#/evidence/audio': viewAudio,
    '#/investigator': viewInvestigator,
    '#/m-database': viewMDatabase,
  };

  function render() {
    const hash = location.hash || '#/';

    // Once the chapter is complete, the investigator reveal has already
    // played — forward straight to the M database instead of re-running it.
    if (hash === '#/investigator' && STATE.get('final')) {
      location.hash = '#/m-database';
      return;
    }

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

  return {
    render, revealHidden,
    inspectAnomaly, analyzeMetadata, zoomToggle, toggleFx, resetFx,
    dragImgStart, dropOnSlot, moveImgToSlot,
    openAccessPrompt, submitAccess,
    selectBoardNode, resetBoard,
    playAudio, finalReveal, runMSequence,
    openM000,
    toggleHint, deeperHint,
  };
})();

App.render();
