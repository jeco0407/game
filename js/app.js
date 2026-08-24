/* ECHO — CASE #0917 — App shell / router / views */

const App = (() => {
  const root = document.getElementById('app');

  /* ---------------- utils ---------------- */
  function normalize(str) {
    return String(str || '')
      .trim()
      .toLowerCase()
      .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFF10 + 48)) // 全形數字
      .replace(/[\s_\-：:／/]/g, '');
  }

  function checkAnswer(puzzleKey, input) {
    const options = DATA.answers[puzzleKey] || [];
    const n = normalize(input);
    return options.some(a => normalize(a) === n);
  }

  function nav(hash) {
    location.hash = hash;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function nl(s) {
    return esc(s).replace(/\n/g, '<br>');
  }

  /* ---------------- image placeholder (svg data-uri) ---------------- */
  function img(key) {
    const map = {
      conbini: 'assets/images/evidence-conbini.svg',
      figure: 'assets/images/evidence-figure.svg',
    };
    return map[key] || '';
  }

  /* ---------------- bottom nav ---------------- */
  function bottomNav(active) {
    const p6 = STATE.get('p6');
    const p8 = STATE.get('p8');
    const items = [
      { key: 'feed', label: 'FEED', hash: '#/feed', locked: false },
      { key: 'evidence', label: 'EVIDENCE', hash: '#/evidence/01', locked: !STATE.get('p1') },
      { key: 'case', label: 'CASE', hash: '#/case/0917', locked: !p6 },
      { key: 'archive', label: 'ARCHIVE', hash: p8 ? '#/archive' : '#/investigator', locked: !STATE.get('p7') },
    ];
    return `<nav class="bottom-nav">${items.map(it => {
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

  /* ---------------- Views ---------------- */

  function viewHome() {
    return `
    <div class="view home">
      <div>
        <div class="logo">ECHO</div>
        <div class="tagline">${DATA.tagline}<br>${DATA.taglineZh}</div>
      </div>
      <hr class="divider">
      <div class="case-status-box">
        CASE ${DATA.caseFile.id}<br>
        STATUS <span class="value active">${STATE.get('p8') ? 'CLOSED' : 'ACTIVE'}</span><br>
        LAST UPDATE <span class="value">08/18 · 03:17</span>
      </div>
      <hr class="divider">
      <button class="btn" onclick="location.hash='#/feed'">[ ENTER ARCHIVE ]</button>
    </div>`;
  }

  function feedPostHtml(p) {
    const disabled = p.unlockAfter && !STATE.get(p.unlockAfter);
    if (disabled) return '';
    const isFinal = p.isLast;
    return `
    <a class="post" href="#/post/${p.id}">
      <div class="post-head">
        <div class="avatar"></div>
        <div>
          <div class="post-name">YUAN</div>
          <div class="post-handle">@last_seen_0917</div>
        </div>
      </div>
      <div class="post-body">${nl(p.text)}</div>
      ${p.image ? `<img class="post-img" src="${img(p.image)}" alt="">` : ''}
      ${isFinal ? `<div class="post-countdown mono">23:17:42</div>` : ''}
      <div class="post-time mono">${p.time}</div>
      ${isFinal ? `<div class="post-meta"><span>♡ ${p.likes}</span><span>↻ ${p.reposts}</span><span>○ ${p.comments}</span></div>` : ''}
    </a>`;
  }

  function viewFeed() {
    const posts = DATA.feed.map(feedPostHtml).join('');
    return `
    <div class="view">
      <div class="feed-header">
        <div class="label">ARCHIVE / FEED</div>
        <div class="handle">@last_seen_0917 · YUAN · <span class="dim">inactive.</span></div>
      </div>
      ${posts}
    </div>
    ${bottomNav('feed')}`;
  }

  function commentHtml(c) {
    if (c.hidden) return '';
    const cls = ['comment'];
    if (c.suspicious) cls.push('suspicious');
    return `<div class="${cls.join(' ')}"><div class="h">@${esc(c.user)}</div><div>${nl(c.text)}</div></div>`;
  }

  function viewPost(id) {
    const p = DATA.feed.find(x => x.id === id);
    if (!p) return `<div class="view">NOT FOUND ${backLink('#/feed','FEED')}</div>`;

    let body = `
    <div class="view">
      ${backLink('#/feed', 'FEED')}
      <div class="post" style="border-bottom:none;padding-top:0">
        <div class="post-head">
          <div class="avatar"></div>
          <div><div class="post-name">YUAN</div><div class="post-handle">@last_seen_0917</div></div>
        </div>
        <div class="post-body">${nl(p.text)}</div>
        ${p.image ? `<img class="post-img" src="${img(p.image)}" alt="">` : ''}
        ${p.isLast ? `<div class="post-countdown mono">23:17:42</div>` : ''}
        <div class="post-time mono">${p.time}</div>
      </div>`;

    if (p.isLast) {
      const visible = DATA.comments17.filter(c => !c.hidden);
      body += `<div class="comments">${visible.map(commentHtml).join('')}`;

      if (STATE.get('p3')) {
        if (STATE.get('p4')) {
          const hidden = DATA.comments17.find(c => c.hidden);
          body += `<div class="comment hidden"><div class="h">@${esc(hidden.user)}</div><div>${nl(hidden.text)}</div></div>`;
        } else {
          body += `<div class="hidden-reply-toggle" onclick="App.revealHidden()">1 hidden reply</div>`;
        }
      }
      body += `</div>`;

      if (!STATE.get('p1')) {
        body += `
        <div class="archive-input-box">
          <div class="prompt">ARCHIVE ACCESS<br>輸入你認為代表案件關鍵的時間點。</div>
          <div class="archive-input-row">
            <input class="archive-input mono" id="ans-p1" placeholder="HH:MM" autocomplete="off">
            <button class="archive-submit" onclick="App.submit('p1')">ENTER</button>
          </div>
          <div class="access-msg" id="msg-p1"></div>
        </div>`;
      } else {
        body += `
        <div class="archive-input-box">
          <div class="access-msg granted">ACCESS GRANTED.<br>EVIDENCE_01 unlocked.</div>
          <button class="btn" style="margin-top:10px" onclick="location.hash='#/evidence/01'">[ VIEW EVIDENCE_01 ]</button>
        </div>`;
      }

      if (STATE.get('p4') && !STATE.get('p5')) {
        body += `<div class="lock-note">追蹤到新的帳號 → <span class="evidence-color" style="cursor:pointer" onclick="location.hash='#/profile/m_0917'">@m_0917</span></div>`;
      }
    }

    body += `</div>${bottomNav('feed')}${hintBar(p.isLast ? 'p1' : null)}`;
    return body;
  }

  function viewEvidence() {
    if (!STATE.get('p1')) {
      return `<div class="view">${backLink('#/feed','FEED')}<p class="dim mono">EVIDENCE LOCKED.</p></div>${bottomNav('evidence')}`;
    }
    const e = DATA.evidence01;
    let dataPanel = '';
    if (STATE.get('p2')) {
      dataPanel = `
      <div class="evidence-data">
        <div class="row"><span class="k">FILE</span><span class="v">${e.file}</span></div>
        <div class="row"><span class="k">CREATED</span><span class="v flag">${e.created}</span></div>
        <div class="row"><span class="k">MODIFIED</span><span class="v flag">${e.modified}</span></div>
        <div class="row"><span class="k">LOCATION</span><span class="v">${e.location}</span></div>
        <div class="row"><span class="k">UNKNOWN PERSONS</span><span class="v flag">${e.unknownPeople}</span></div>
      </div>
      <div class="observation-box">為什麼 8/19 拍攝的照片，會出現在 8/18 的貼文裡？<br>
      <span class="evidence-color" style="cursor:pointer" onclick="location.hash='#/timeline'">[ 重新排列時間線 → ]</span></div>`;
    } else {
      dataPanel = `
      <div class="archive-input-box">
        <div class="prompt">玻璃門旁邊，有一組數字。</div>
        <div class="archive-input-row">
          <input class="archive-input mono" id="ans-p2" placeholder="????" autocomplete="off">
          <button class="archive-submit" onclick="App.submit('p2')">ENTER</button>
        </div>
        <div class="access-msg" id="msg-p2"></div>
      </div>`;
    }

    return `
    <div class="view">
      ${backLink('#/post/17','LAST POST')}
      <div class="label">EVIDENCE 01 / 07</div>
      <div class="evidence-frame">
        <div class="evidence-img-wrap" id="ev-wrap" onclick="App.zoomToggle()">
          <img class="evidence-img" id="ev-img" src="${img('conbini')}" alt="">
        </div>
        <div class="evidence-toolbar">
          <button class="tool-btn" onclick="App.zoomToggle()">[ ZOOM ]</button>
          <button class="tool-btn" onclick="App.toggleFx('bright')">[ BRIGHTNESS ]</button>
          <button class="tool-btn" onclick="App.toggleFx('contrast')">[ CONTRAST ]</button>
          <button class="tool-btn" onclick="App.inspect()">[ INSPECT ]</button>
        </div>
      </div>
      <div class="observation-box">${esc(e.observation[STATE.get('p2') ? 1 : 0])}</div>
      ${dataPanel}
    </div>
    ${bottomNav('evidence')}
    ${hintBar(!STATE.get('p2') ? 'p2' : null)}`;
  }

  let tlOrder = null;
  function viewTimeline() {
    if (!STATE.get('p2')) {
      return `<div class="view">${backLink('#/evidence/01','EVIDENCE')}<p class="dim mono">LOCKED.</p></div>${bottomNav('evidence')}`;
    }
    if (!tlOrder) {
      tlOrder = [3,0,6,1,4,7,2,5]; // shuffled indices into DATA.timelineItems
    }
    const solved = STATE.get('p3');
    return `
    <div class="view">
      ${backLink('#/evidence/01','EVIDENCE')}
      <div class="label">TIMELINE RECONSTRUCTION</div>
      <p class="dim" style="font-size:13px;margin-top:8px">把下面的時間點排成正確的先後順序（拖曳，或用 ▲▼ 調整）。</p>
      <div class="timeline-list" id="tl-list">
        ${tlOrder.map((itemIdx, pos) => {
          const t = DATA.timelineItems[itemIdx];
          return `
          <div class="timeline-item ${solved && t === '8/19 ??' ? 'flagged' : ''}" draggable="true" data-t="${esc(t)}" data-idx="${itemIdx}">
            <span>${esc(t)}</span>
            <span>
              <button class="tool-btn" style="padding:4px 8px" onclick="App.moveTimelineItem(${pos},-1)">▲</button>
              <button class="tool-btn" style="padding:4px 8px" onclick="App.moveTimelineItem(${pos},1)">▼</button>
            </span>
          </div>`;
        }).join('')}
      </div>
      <button class="btn" style="margin-top:16px" onclick="App.checkTimeline()">[ CONFIRM ORDER ]</button>
      <div class="access-msg" id="msg-tl"></div>
      ${solved ? `<div class="observation-box">8/19 拍攝的照片，不應該出現在 8/18 的貼文裡。<br><b>有人在失蹤之後，仍然可以使用她的帳號。</b></div>
      <div class="lock-note">帳號出現新內容，留言區也解鎖了 → <span class="evidence-color" style="cursor:pointer" onclick="location.hash='#/post/17'">回到最後一則貼文</span></div>` : ''}
    </div>
    ${bottomNav('evidence')}
    ${hintBar(!solved ? 'p3' : null)}`;
  }

  function moveTimelineItem(pos, dir) {
    const target = pos + dir;
    if (target < 0 || target >= tlOrder.length) return;
    [tlOrder[pos], tlOrder[target]] = [tlOrder[target], tlOrder[pos]];
    render();
  }

  function viewProfileM() {
    if (!STATE.get('p4')) {
      return `<div class="view">${backLink('#/feed','FEED')}<p class="dim mono">ACCOUNT NOT FOUND.</p></div>${bottomNav('feed')}`;
    }
    const m = DATA.mProfile;
    let body = `
    <div class="view">
      ${backLink('#/post/17','LAST POST')}
      <div class="profile-head">
        <div class="profile-avatar"></div>
        <div class="post-name">@${m.handle}</div>
        <div class="profile-status">${m.status}</div>
      </div>
      <div class="blank-post">${nl(m.post)}</div>`;

    if (!STATE.get('p5')) {
      body += `
      <div class="archive-input-box">
        <div class="prompt">「他第一次發現我的時候，也是星期四。」<br>找出藏在證據檔名裡的代號。</div>
        <div class="archive-input-row">
          <input class="archive-input mono" id="ans-p5" placeholder="????_????" autocomplete="off">
          <button class="archive-submit" onclick="App.submit('p5')">ENTER</button>
        </div>
        <div class="access-msg" id="msg-p5"></div>
      </div>`;
    } else {
      body += `
      <div class="archive-input-box">
        <div class="access-msg granted">ACCESS GRANTED.<br>已定位到相關人物。</div>
        <button class="btn" style="margin-top:10px" onclick="location.hash='#/profile/chen_yc'">[ VIEW @chen_yc ]</button>
      </div>`;
    }
    body += `</div>${bottomNav('feed')}${hintBar(!STATE.get('p5') ? 'p5' : null)}`;
    return body;
  }

  function viewProfileChen() {
    if (!STATE.get('p5')) {
      return `<div class="view">${backLink('#/feed','FEED')}<p class="dim mono">ACCOUNT NOT FOUND.</p></div>${bottomNav('feed')}`;
    }
    const c = DATA.chenProfile;
    let body = `
    <div class="view">
      ${backLink('#/profile/m_0917','@m_0917')}
      <div class="profile-head">
        <div class="profile-avatar"></div>
        <div class="post-name">${c.name}</div>
        <div class="post-handle">@${c.handle}</div>
        <div class="profile-status warn">${c.status}</div>
      </div>
      <div class="blank-post" style="text-align:left">${nl(c.lastPost.text)}<div class="post-time mono" style="margin-top:10px">${c.lastPost.time}</div></div>
      <div class="label" style="margin-top:24px">ARCHIVED POSTS</div>
      <div class="comments" style="margin-top:10px">
        ${c.archived.map((a, idx) => {
          if (!a.removed) return `<div class="comment"><div class="h">${a.title}</div><div>${esc(a.preview)}</div></div>`;
          if (STATE.get('p6')) return `<div class="comment"><div class="h">${a.time}</div><div class="dim">已解鎖：CASE FILE 0917</div></div>`;
          return `<div class="comment hidden-reply-toggle" onclick="App.openArchivedPost()"><div class="h">${a.time}</div><div>${a.title}</div></div>`;
        }).join('')}
      </div>
      <div id="archive-puzzle"></div>
    </div>
    ${bottomNav('feed')}
    ${hintBar(!STATE.get('p6') ? 'p6' : null)}`;
    return body;
  }

  function viewCase() {
    if (!STATE.get('p6')) {
      return `<div class="view">${backLink('#/feed','FEED')}<p class="dim mono">CASE FILE LOCKED.</p></div>${bottomNav('case')}`;
    }
    const cf = DATA.caseFile;
    return `
    <div class="view">
      ${backLink('#/feed','FEED')}
      <div class="label">CASE FILE</div>
      <div class="case-file" style="margin-top:10px">
        <div class="cf-title">CASE ${cf.id}</div>
        <div class="cf-row"><span class="k">SUBJECT</span><span class="v">${cf.subject}</span></div>
        <div class="cf-row"><span class="k">AGE</span><span class="v">${cf.age}</span></div>
        <div class="cf-row"><span class="k">STATUS</span><span class="v missing">${cf.status}</span></div>
        <div class="cf-row"><span class="k">LAST SEEN</span><span class="v">${cf.lastSeen}</span></div>
        <div class="cf-row"><span class="k">LOCATION</span><span class="v">${cf.location}</span></div>
        ${STATE.get('p7') ? `<div class="cf-row clickable" onclick="location.hash='#/investigator'"><span class="k">INVESTIGATOR</span><span class="v evidence-color">M →</span></div>` : ''}
      </div>

      <div class="related-tree">${esc(cf.relatedTree)}</div>

      <div class="label">AUDIO_0917</div>
      <div class="audio-box" id="audio-box">
        ${STATE.get('p7')
          ? `<div class="audio-transcript">${cf.audioTranscript.map(l => `<div>${l.t} — <span class="${l.warn?'warn':''}">${esc(l.line)}</span></div>`).join('')}</div>`
          : `<button class="btn" onclick="App.playAudio()">[ ▶ PLAY RECORDING ]</button><div class="audio-transcript" id="audio-transcript"></div>`}
      </div>
    </div>
    ${bottomNav('case')}
    ${hintBar(null)}`;
  }

  function viewInvestigator() {
    if (!STATE.get('p7')) {
      return `<div class="view">${backLink('#/case/0917','CASE')}<p class="dim mono">LOCKED.</p></div>${bottomNav('case')}`;
    }
    if (!STATE.get('p8')) {
      return `
      <div class="view">
        <div class="investigator-reveal">
          <div class="label">CASE ${DATA.caseFile.id}</div>
          <div class="big">INVESTIGATOR</div>
          <div class="id-line">M</div>
          <button class="btn" style="margin-top:30px;max-width:240px" onclick="App.finalReveal()">[ ACCESS ]</button>
        </div>
      </div>
      ${bottomNav('case')}`;
    }
    return renderEndingSequence();
  }

  function renderEndingSequence() {
    const logs = ['08/17 23:17', '08/18 00:12', '08/18 03:17', '08/18 07:41'];
    return `
    <div class="view">
      <div class="investigator-reveal">
        <div class="dim mono" style="font-size:12px">INVESTIGATION LOG</div>
        <div style="margin:10px 0">
          ${logs.map((l,i) => `<div class="m-log-line" style="animation-delay:${i*0.35}s">M — ${l}</div>`).join('')}
        </div>
        <div class="mono" style="margin-top:20px;color:var(--text-dim);font-size:12px">M 不是一個人。</div>
        <div id="m-count-block" style="margin-top:10px"></div>
      </div>
    </div>
    ${bottomNav('archive')}`;
  }

  function viewArchive() {
    if (!STATE.get('p8')) {
      return `<div class="view">${backLink('#/case/0917','CASE')}<p class="dim mono">ARCHIVE LOCKED.</p></div>${bottomNav('case')}`;
    }
    const id = STATE.investigatorId();
    let rows = '';
    for (let i = 1; i <= 6; i++) rows += `<div class="cf-row"><span class="k">M-${String(i).padStart(3,'0')}</span><span class="v dim">ACCESS DENIED</span></div>`;
    rows += `<div class="cf-row"><span class="k">...</span><span class="v dim">...</span></div>`;
    rows += `<div class="cf-row"><span class="k">M-128</span><span class="v dim">ACCESS DENIED</span></div>`;
    rows += `<div class="cf-row"><span class="k">M-${id}</span><span class="v evidence-color">YOU</span></div>`;
    rows += `<div class="cf-row"><span class="k">M-000</span><span class="v missing">DELETED</span></div>`;
    return `
    <div class="view">
      ${backLink('#/case/0917','CASE')}
      <div class="label">M DATABASE</div>
      <div class="case-file" style="margin-top:10px">${rows}</div>
      <div class="lock-note" style="margin-top:24px">CHAPTER 01 COMPLETE<br><br>
      M-${id}<br><br>Next instruction:<br>Do not look for Lin.<br>Look for M.</div>
    </div>
    ${bottomNav('archive')}`;
  }

  /* ---------------- hint system ---------------- */
  let hintOpen = false;
  let hintLevels = {}; // per-puzzle current hint depth, persists across renders
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

  /* ---------------- Router ---------------- */
  const routes = {
    '': viewHome,
    '#/': viewHome,
    '#/feed': viewFeed,
    '#/evidence/01': viewEvidence,
    '#/timeline': viewTimeline,
    '#/case/0917': viewCase,
    '#/investigator': viewInvestigator,
    '#/archive': viewArchive,
  };

  let endingPlayed = false;

  function render() {
    const hash = location.hash || '#/';

    // Once the final reveal has already played this session, visiting the
    // investigator route again just forwards straight to the archive.
    if (hash === '#/investigator' && STATE.get('p8') && endingPlayed) {
      location.hash = '#/archive';
      return;
    }

    let html;
    if (hash.startsWith('#/post/')) {
      html = viewPost(parseInt(hash.split('/')[2], 10));
    } else if (hash === '#/profile/m_0917') {
      html = viewProfileM();
    } else if (hash === '#/profile/chen_yc') {
      html = viewProfileChen();
    } else if (routes[hash]) {
      html = routes[hash]();
    } else {
      html = viewHome();
    }
    root.innerHTML = html;
    window.scrollTo(0, 0);
    bindDrag();

    if (hash === '#/investigator' && STATE.get('p7') && STATE.get('p8') && !endingPlayed) {
      endingPlayed = true;
      runMSequence();
    }
  }

  window.addEventListener('hashchange', render);

  /* ---------------- Actions ---------------- */
  function submit(key) {
    const el = document.getElementById('ans-' + key);
    const msg = document.getElementById('msg-' + key);
    if (!el) return;
    if (checkAnswer(key, el.value)) {
      STATE.set(key, true);
      if (key === 'p6') {
        render();
        return;
      }
      msg.className = 'access-msg granted';
      msg.textContent = 'ACCESS GRANTED.';
      setTimeout(render, 500);
    } else {
      msg.className = 'access-msg denied';
      msg.textContent = 'ACCESS DENIED. The archive doesn\'t recognize this. Try again.';
    }
  }

  function revealHidden() {
    STATE.set('p4', true);
    render();
  }

  let zoomed = false;
  let fxState = { bright: false, contrast: false };
  function zoomToggle() {
    zoomed = !zoomed;
    const im = document.getElementById('ev-img');
    if (im) im.style.transform = zoomed ? 'scale(1.8) translate(8%, -6%)' : 'scale(1)';
  }
  function toggleFx(type) {
    fxState[type] = !fxState[type];
    const im = document.getElementById('ev-img');
    if (!im) return;
    let f = [];
    if (fxState.bright) f.push('brightness(1.6)');
    if (fxState.contrast) f.push('contrast(1.6)');
    im.style.filter = f.join(' ');
  }
  function inspect() {
    if (!STATE.get('p2')) {
      const box = document.querySelector('.observation-box');
      if (box) box.textContent = '玻璃門旁邊，隱約可以看到一組數字門牌。';
    }
  }

  function bindDrag() {
    const list = document.getElementById('tl-list');
    if (!list) return;
    let dragEl = null;
    list.querySelectorAll('.timeline-item').forEach(item => {
      item.addEventListener('dragstart', () => { dragEl = item; item.classList.add('dragging'); });
      item.addEventListener('dragend', () => { item.classList.remove('dragging'); });
      item.addEventListener('dragover', e => {
        e.preventDefault();
        const after = getDragAfter(list, e.clientY);
        if (after == null) list.appendChild(dragEl); else list.insertBefore(dragEl, after);
      });
    });
  }
  function getDragAfter(container, y) {
    const els = [...container.querySelectorAll('.timeline-item:not(.dragging)')];
    return els.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) return { offset, element: child };
      return closest;
    }, { offset: -Infinity }).element;
  }

  function checkTimeline() {
    const list = document.getElementById('tl-list');
    const order = [...list.querySelectorAll('.timeline-item')].map(el => el.dataset.t);
    const correct = DATA.timelineItems;
    const msg = document.getElementById('msg-tl');
    if (JSON.stringify(order) === JSON.stringify(correct)) {
      STATE.set('p3', true);
      msg.className = 'access-msg granted';
      msg.textContent = 'ORDER CONFIRMED.';
      setTimeout(render, 400);
    } else {
      msg.className = 'access-msg denied';
      msg.textContent = 'ACCESS DENIED. 這個順序，跟目前的線索不吻合。';
    }
  }

  function openArchivedPost() {
    const el = document.getElementById('archive-puzzle');
    if (!el) return;
    el.innerHTML = `
    <div class="archive-input-box" style="margin-top:16px">
      <div class="prompt">ERROR 0917<br>「他們第一次見面的地方。」</div>
      <div class="archive-input-row">
        <input class="archive-input mono" id="ans-p6" placeholder="……" autocomplete="off">
        <button class="archive-submit" onclick="App.submit('p6')">ENTER</button>
      </div>
      <div class="access-msg" id="msg-p6"></div>
    </div>`;
  }

  function playAudio() {
    const cf = DATA.caseFile;
    const box = document.getElementById('audio-transcript');
    if (!box) return;
    box.innerHTML = '';
    cf.audioTranscript.forEach((l, i) => {
      setTimeout(() => {
        const div = document.createElement('div');
        div.className = 'line' + (l.warn ? ' warn-line' : '');
        div.textContent = `${l.t} — ${l.line}`;
        box.appendChild(div);
      }, i * 1400);
    });
    setTimeout(() => {
      STATE.set('p7', true);
      render();
    }, cf.audioTranscript.length * 1400 + 800);
  }

  function toggleHint() {
    hintOpen = !hintOpen;
    render();
  }
  function deeperHint(key) {
    hintLevels[key] = (hintLevels[key] || 0) + 1;
    hintOpen = true;
    render();
  }

  function finalReveal() {
    STATE.set('p8', true);
    render();
  }

  function runMSequence() {
    setTimeout(() => {
      const block = document.getElementById('m-count-block');
      if (!block) return;
      const id = STATE.investigatorId();
      let html = '';
      const seq = [1,2,3,4,'…',128];
      seq.forEach((n, i) => {
        setTimeout(() => {
          block.innerHTML += `<div class="m-log-line" style="animation-delay:0s">M-${typeof n==='number'?String(n).padStart(3,'0'):n} <span class="dim">ACTIVE</span></div>`;
        }, i * 220);
      });
      setTimeout(() => {
        block.innerHTML += `<div class="m-log-line big" style="animation-delay:0s;color:var(--evidence);margin-top:14px">M-${id}</div>`;
        setTimeout(() => {
          block.innerHTML += `<div class="m-log-line" style="animation-delay:0s" id="elapsed-line"></div>`;
          const elLine = document.getElementById('elapsed-line');
          if (elLine) elLine.innerHTML = `Investigation started:<br><span class="mono">${formatElapsed(STATE.elapsedMs())} ago</span>`;
          setTimeout(showEndingScreen, 1600);
        }, 500);
      }, seq.length * 220 + 300);
    }, 300);
  }

  function showEndingScreen() {
    const div = document.createElement('div');
    div.className = 'ending-screen';
    div.innerHTML = `
      <div class="label">CASE ${DATA.caseFile.id}</div>
      <div style="height:10px"></div>
      <div class="label">INVESTIGATOR</div>
      <div style="font-size:20px;letter-spacing:0.1em;color:var(--evidence)">M-${STATE.investigatorId()}</div>
      <div style="height:10px"></div>
      <div class="label">STATUS</div>
      <div style="font-size:16px;color:var(--warning)">ACTIVE</div>
    `;
    document.body.appendChild(div);
    setTimeout(() => {
      div.remove();
      const toast = document.createElement('div');
      toast.className = 'new-message-toast';
      toast.innerHTML = `NEW MESSAGE<br><span class="dim" style="font-size:11px">@last_seen_0917</span><br>「你終於來了。」`;
      document.body.appendChild(toast);
      setTimeout(() => { toast.remove(); location.hash = '#/archive'; }, 3200);
    }, 3000);
  }

  return {
    render, submit, revealHidden, zoomToggle, toggleFx, inspect,
    checkTimeline, moveTimelineItem, openArchivedPost, playAudio, toggleHint, deeperHint,
    finalReveal, runMSequence,
  };
})();

App.render();
