const p="/nova",v="nova_v3_session";const m="https://dynos.dynomic.ai/api/knowledge.php",u="jarvis_PzShRhHuW0pKRWbxbwhOb0J";class f{constructor(){this.isOpen=!1,this.editMode=!1,this.permissions={},this.csrfToken=null,this.novaVersion="3.0",this.selectedEl=null,this.selectedCtx=null,this.pendingApply=null,this._loadSession()}_loadSession(){try{const e=localStorage.getItem(v);if(e){const t=JSON.parse(e);if(t.expiry>Date.now()){this.session=t;return}this._finalizeSessionInBackground(t),localStorage.removeItem(v)}}catch{}this.session={id:"nova_"+Math.random().toString(36).slice(2,10),started:Date.now(),expiry:Date.now()+432e5,messages:[],changes:[],page:window.location.pathname},this._saveSession()}_saveSession(){this.session.lastActivity=Date.now();try{localStorage.setItem(v,JSON.stringify(this.session))}catch{}}_addToSessionMessages(e,t){this.session.messages.push({type:e,text:t,ts:Date.now(),page:window.location.pathname}),this._saveSession()}_addToSessionChanges(e){this.session.changes.push({...e,ts:Date.now(),page:window.location.pathname}),this._saveSession()}async _finalizeSessionInBackground(e){var n,a;if(!((n=e==null?void 0:e.changes)!=null&&n.length)&&!((a=e==null?void 0:e.messages)!=null&&a.length))return;const t=this._buildSessionSummary(e);try{await fetch(m,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+u},body:JSON.stringify({title:"Nova CMS Session – VaTo24",content:t,category:"sessions",tags:["nova","vato24","cms"],project:"VaTo24",session_id:e.id})})}catch{}}_buildSessionSummary(e){const t=Math.round((Date.now()-e.started)/6e4),n=e.changes.map(o=>`- ${o.page}: [${o.novaId}] → "${String(o.newContent).slice(0,80)}"`).join(`
`),a=e.messages.filter(o=>o.type==="user").length;return`Nova CMS Session auf VaTo24 (Dauer: ${t} Min.)
Seiten: ${e.page}
Nachrichten: ${a}
Änderungen:
${n||"Keine"}`}_currentPage(){let e=window.location.pathname.replace(/^\/+/,"");return!e||e==="/"?"index.html":(e.endsWith(".html")||(e=e.replace(/\/+$/,"")+"/index.html"),e)}async init(){const t=new URLSearchParams(window.location.search).has("nova");let n=!1;try{const a=await fetch(p+"/permissions-api.php",{credentials:"same-origin"});if(a.ok){const o=await a.json();n=o.authenticated||!1,this.csrfToken=o.csrf_token||null,this.permissions=o.permissions||{},this.novaVersion=o.nova_version||"3.0"}}catch{}if(!n){t&&(window.location.href=p+"/login.html");return}if(this._injectStyles(),this._injectFAB(),this._injectPanel(),this._bindEvents(),this._applyPagePermissions(),this.editMode=!0,this.session.messages.length?(this.session.messages.forEach(a=>this._renderMessage(a.type,a.text)),this._renderMessage("system",`↩ Session fortgesetzt (${this.session.messages.length} frühere Nachrichten)`)):this._renderMessage("nova",`Hallo! Ich bin **Nova v${this.novaVersion}** ✨

Klicken Sie auf ein beliebiges Element auf der Seite.`),this._isPageBlocked()&&this._renderMessage("system","⚠️ Diese Seite ist schreibgeschützt."),t){const a=new URL(window.location.href);a.searchParams.delete("nova"),window.history.replaceState({},"",a)}}_isPageBlocked(){const e=this._currentPage();return(this.permissions.blocked_pages||[]).some(t=>e===t||e.endsWith("/"+t))}_isElementBlocked(e){return(this.permissions.blocked_nova_ids||[]).includes(e)}_applyPagePermissions(){document.querySelectorAll("[data-nova-id]").forEach(e=>{(this._isPageBlocked()||this._isElementBlocked(e.dataset.novaId))&&(e.dataset.novaBlocked="true")})}_injectStyles(){if(document.getElementById("nova-styles"))return;const e=document.createElement("style");e.id="nova-styles",e.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      /* ── Element-Highlighting ── */
      body.nova-active [data-nova-id]:not([data-nova-blocked]):hover {
        outline: 2px solid rgba(99,102,241,.6) !important;
        outline-offset: 4px !important;
        cursor: pointer !important;
      }
      body.nova-active [data-nova-id].nova-selected {
        outline: 2px solid #818cf8 !important;
        outline-offset: 4px !important;
        border-radius: 3px !important;
      }
      body.nova-active [data-nova-blocked="true"]:hover {
        outline: 2px dashed rgba(248,113,113,.45) !important;
        cursor: not-allowed !important;
      }
      body.nova-active #nova-panel *,
      body.nova-active #nova-fab * { outline: none !important; }

      /* ─────────────────── FAB ─────────────────── */
      #nova-fab {
        position: fixed;
        bottom: 28px; right: 28px;
        z-index: 2147483647;
        width: 52px; height: 52px;
        border-radius: 50%;
        background: #0f1117;
        border: 1.5px solid rgba(129,140,248,.35);
        box-shadow: 0 0 0 0 rgba(129,140,248,.25), 0 8px 32px rgba(0,0,0,.5);
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        animation: nova-ring 3s ease-in-out infinite;
        transition: transform .2s cubic-bezier(.34,1.56,.64,1), border-color .2s;
      }
      #nova-fab:hover {
        transform: scale(1.08);
        border-color: rgba(129,140,248,.7);
        box-shadow: 0 0 20px rgba(129,140,248,.3), 0 8px 32px rgba(0,0,0,.5);
      }
      #nova-fab.is-open {
        animation: none;
        border-color: rgba(129,140,248,.6);
        background: #1a1d2e;
      }
      #nova-fab svg { transition: transform .25s; }
      #nova-fab.is-open svg { transform: rotate(45deg); }
      #nova-fab-badge {
        position: absolute;
        top: -3px; right: -3px;
        background: #f87171;
        color: white;
        font-size: 9px; font-weight: 700;
        min-width: 16px; height: 16px;
        border-radius: 8px; padding: 0 3px;
        display: none; align-items: center; justify-content: center;
        font-family: Inter, sans-serif;
        border: 1.5px solid #0f1117;
      }
      @keyframes nova-ring {
        0%, 100% { box-shadow: 0 0 0 0 rgba(129,140,248,.25), 0 8px 32px rgba(0,0,0,.5); }
        50%       { box-shadow: 0 0 0 8px rgba(129,140,248,.0), 0 8px 32px rgba(0,0,0,.5); }
      }

      /* ─────────────────── Panel ─────────────────── */
      #nova-panel {
        position: fixed;
        bottom: 92px; right: 28px;
        width: 380px; height: 560px;
        background: rgba(10,11,18,.97);
        backdrop-filter: blur(20px) saturate(1.5);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        border: 1px solid rgba(255,255,255,.09);
        border-radius: 20px;
        z-index: 2147483646;
        display: none; flex-direction: column;
        font-family: Inter, -apple-system, sans-serif;
        box-shadow:
          0 0 0 1px rgba(129,140,248,.08),
          0 24px 64px rgba(0,0,0,.7),
          inset 0 1px 0 rgba(255,255,255,.06);
        overflow: hidden;
        user-select: none;
        animation: none;
      }
      #nova-panel.is-open { display: flex; animation: nova-slide-in .22s cubic-bezier(.16,1,.3,1); }
      @keyframes nova-slide-in {
        from { opacity: 0; transform: translateY(10px) scale(.98); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }

      /* Top accent line */
      #nova-panel::before {
        content: '';
        position: absolute;
        top: 0; left: 20px; right: 20px; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(129,140,248,.6), rgba(52,211,153,.4), transparent);
        border-radius: 1px;
      }

      /* ─────────────────── Header ─────────────────── */
      #nova-header {
        display: flex; align-items: center; gap: 10px;
        padding: 14px 16px 12px;
        cursor: grab; flex-shrink: 0;
      }
      #nova-header:active { cursor: grabbing; }
      #nova-logo {
        width: 28px; height: 28px;
        background: linear-gradient(135deg, #818cf8, #34d399);
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; pointer-events: none;
        font-size: 14px;
      }
      #nova-header-text { flex: 1; pointer-events: none; }
      #nova-header-title {
        font-size: 13px; font-weight: 600; color: #f1f5f9;
        letter-spacing: -.01em;
      }
      #nova-header-sub { font-size: 11px; color: #475569; margin-top: 1px; }
      .nova-hbtn {
        width: 26px; height: 26px;
        border: none; border-radius: 7px;
        background: rgba(255,255,255,.05);
        color: #475569; font-size: 14px; line-height: 1;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: background .15s, color .15s; flex-shrink: 0;
        font-family: inherit;
      }
      .nova-hbtn:hover { background: rgba(255,255,255,.1); color: #94a3b8; }

      /* ─────────────────── Toolbar (page nav) ─────────────────── */
      #nova-nav {
        display: flex; align-items: center; gap: 6px;
        padding: 0 12px 10px;
        flex-shrink: 0;
      }
      #nova-page-select {
        flex: 1;
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 8px;
        color: #94a3b8;
        font-size: 11px; padding: 5px 8px;
        cursor: pointer; font-family: inherit; outline: none;
      }
      #nova-page-select option { background: #0d1117; }
      #nova-page-select:focus { border-color: rgba(129,140,248,.4); color: #e2e8f0; }
      .nova-nbtn {
        width: 28px; height: 28px;
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 8px; color: #475569; font-size: 13px;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: background .15s, color .15s; font-family: inherit; flex-shrink: 0;
      }
      .nova-nbtn:hover { background: rgba(255,255,255,.1); color: #94a3b8; }

      /* ─────────────────── Tabs ─────────────────── */
      #nova-tabs {
        display: flex;
        border-bottom: 1px solid rgba(255,255,255,.06);
        flex-shrink: 0; padding: 0 12px;
        gap: 4px;
      }
      #nova-tabs button {
        padding: 8px 10px;
        background: none; border: none;
        color: #475569; font-size: 11.5px; font-weight: 500;
        cursor: pointer; font-family: inherit;
        border-bottom: 2px solid transparent;
        transition: color .15s, border-color .15s;
        white-space: nowrap; flex-shrink: 0;
        margin-bottom: -1px;
      }
      #nova-tabs button:hover { color: #94a3b8; }
      #nova-tabs button.active { color: #818cf8; border-bottom-color: #818cf8; }

      /* ─────────────────── Panes ─────────────────── */
      .nova-pane { display: none; flex: 1; flex-direction: column; overflow: hidden; }
      .nova-pane.active { display: flex; }

      /* ─────────────────── Chat ─────────────────── */
      #nova-chat {
        flex: 1; overflow-y: auto;
        padding: 16px 14px; display: flex; flex-direction: column;
        gap: 6px; scroll-behavior: smooth;
      }
      #nova-chat::-webkit-scrollbar { width: 3px; }
      #nova-chat::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); border-radius: 2px; }

      .nova-msg {
        font-size: 13.5px; line-height: 1.6;
        word-break: break-word;
        animation: nova-pop .18s cubic-bezier(.16,1,.3,1);
      }
      @keyframes nova-pop { from { opacity: 0; transform: scale(.97) translateY(3px); } }

      .nova-msg.user {
        align-self: flex-end;
        max-width: 82%;
        background: rgba(129,140,248,.15);
        border: 1px solid rgba(129,140,248,.2);
        border-radius: 16px 16px 4px 16px;
        padding: 10px 14px;
        color: #e2e8f0;
      }
      .nova-msg.nova {
        align-self: flex-start;
        max-width: 92%;
        color: #cbd5e1;
        padding: 2px 0;
      }
      .nova-msg.nova + .nova-msg.nova { margin-top: -2px; }
      .nova-msg.system {
        align-self: center; max-width: 95%;
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(255,255,255,.07);
        border-radius: 20px;
        padding: 4px 12px;
        color: #475569; font-size: 11px; text-align: center;
      }
      .nova-msg.typing {
        align-self: flex-start;
        color: #334155; font-size: 13px; padding: 2px 0;
      }
      .nova-msg strong { color: #f1f5f9; font-weight: 600; }
      .nova-msg code {
        background: rgba(255,255,255,.07);
        padding: 1px 5px; border-radius: 4px;
        font-size: 12px; font-family: 'JetBrains Mono', monospace;
        color: #a5b4fc;
      }

      /* Nova avatar dot */
      .nova-msg.nova::before {
        content: '✦';
        color: #818cf8;
        font-size: 10px;
        margin-right: 6px;
        opacity: .7;
      }

      /* Apply-Buttons */
      .nova-apply-row { display: flex; gap: 6px; margin-top: 10px; padding-left: 16px; }
      .nova-btn-yes {
        padding: 7px 16px;
        background: linear-gradient(135deg, #6366f1, #818cf8);
        border: none; border-radius: 10px;
        color: white; font-size: 12px; font-weight: 600;
        cursor: pointer; font-family: inherit;
        transition: opacity .15s;
      }
      .nova-btn-yes:hover { opacity: .88; }
      .nova-btn-no {
        padding: 7px 14px;
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.09);
        border-radius: 10px; color: #64748b;
        font-size: 12px; cursor: pointer; font-family: inherit;
        transition: color .15s, background .15s;
      }
      .nova-btn-no:hover { color: #94a3b8; background: rgba(255,255,255,.08); }

      /* ─────────────────── Input ─────────────────── */
      #nova-input-area {
        padding: 10px 12px 14px;
        flex-shrink: 0;
        display: flex; align-items: flex-end; gap: 8px;
        border-top: 1px solid rgba(255,255,255,.06);
      }
      #nova-input {
        flex: 1;
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.09);
        border-radius: 14px;
        color: #e2e8f0;
        padding: 10px 14px;
        font-size: 13px; resize: none;
        min-height: 42px; max-height: 120px;
        font-family: inherit;
        box-sizing: border-box;
        transition: border-color .15s;
        line-height: 1.5;
      }
      #nova-input:focus { outline: none; border-color: rgba(129,140,248,.4); }
      #nova-input::placeholder { color: #2d3748; }
      #nova-send {
        flex-shrink: 0;
        width: 36px; height: 36px;
        background: linear-gradient(135deg, #6366f1, #818cf8);
        border: none; border-radius: 12px;
        color: white; font-size: 16px; line-height: 1;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: opacity .15s, transform .15s;
      }
      #nova-send:hover { opacity: .88; transform: scale(1.04); }

      /* ─────────────────── Element Tab ─────────────────── */
      #nova-element-info {
        padding: 16px; font-size: 12.5px; color: #64748b;
        overflow-y: auto; flex: 1;
      }
      .nf { margin-bottom: 14px; }
      .nf-label {
        font-size: 10px; font-weight: 600; text-transform: uppercase;
        letter-spacing: .06em; color: #334155; margin-bottom: 4px;
      }
      .nf-val { color: #94a3b8; font-size: 12.5px; }
      .nf-val.highlight { color: #818cf8; font-weight: 500; }
      .nf-content {
        color: #64748b; font-size: 12px; margin-top: 4px;
        max-height: 72px; overflow: hidden;
        background: rgba(255,255,255,.03);
        border: 1px solid rgba(255,255,255,.06);
        border-radius: 8px; padding: 8px;
        font-style: italic;
      }

      /* ─────────────────── Bilder Tab ─────────────────── */
      #nova-upload-zone {
        margin: 12px;
        border: 1.5px dashed rgba(129,140,248,.25);
        border-radius: 14px; padding: 28px 16px;
        text-align: center; cursor: pointer;
        color: #334155; font-size: 13px;
        transition: border-color .2s, background .2s;
      }
      #nova-upload-zone:hover {
        border-color: rgba(129,140,248,.55);
        background: rgba(129,140,248,.04);
        color: #64748b;
      }
      #nova-upload-zone svg { margin-bottom: 8px; opacity: .4; }
      #nova-upload-input { display: none; }
      #nova-upload-result { padding: 0 12px 12px; font-size: 11.5px; color: #64748b; }
      .nova-img-row { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
      .nova-img-link {
        color: #818cf8; text-decoration: none; font-size: 11px;
        padding: 3px 9px; background: rgba(129,140,248,.1);
        border: 1px solid rgba(129,140,248,.15);
        border-radius: 6px; transition: background .15s;
      }
      .nova-img-link:hover { background: rgba(129,140,248,.2); }

      /* ─────────────────── Permissions Tab ─────────────────── */
      #nova-perms-tab {
        padding: 16px; font-size: 12px; overflow-y: auto; flex: 1;
        color: #64748b;
      }
      .perm-row {
        display: flex; justify-content: space-between; align-items: flex-start;
        padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,.04);
      }
      .perm-label { color: #475569; font-size: 11.5px; }
      .perm-ok  { color: #34d399; text-align: right; max-width: 55%; font-size: 11.5px; word-break: break-word; }
      .perm-bad { color: #f87171; text-align: right; max-width: 55%; font-size: 11.5px; word-break: break-word; }
    `,document.head.appendChild(e)}_injectFAB(){const e=document.createElement("button");e.id="nova-fab",e.setAttribute("aria-label","Nova öffnen"),e.innerHTML=`
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="url(#ng)" stroke-width="1.8" stroke-linecap="round">
        <defs><linearGradient id="ng" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#818cf8"/><stop offset="100%" stop-color="#34d399"/></linearGradient></defs>
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
      </svg>
      <span id="nova-fab-badge"></span>
    `,document.body.appendChild(e),e.addEventListener("click",()=>this._toggle())}_injectPanel(){const e=document.createElement("div");e.id="nova-panel",e.setAttribute("role","dialog"),e.setAttribute("aria-label","Nova CMS");const t=this._currentPage(),n=this.permissions.allowed_pages||{},a=Object.entries(n).map(([o,r])=>`<option value="${o}" ${o===t?"selected":""}>${r}</option>`).join("");e.innerHTML=`
      <!-- Header / Drag-Handle -->
      <div id="nova-header">
        <div id="nova-logo">✦</div>
        <div id="nova-header-text">
          <div id="nova-header-title">Nova</div>
          <div id="nova-header-sub">${n[t]||t}</div>
        </div>
        <button class="nova-hbtn" id="nova-close-btn" title="Schließen">✕</button>
      </div>

      <!-- Nav (Seite wechseln, Aktionen) -->
      <div id="nova-nav">
        <select id="nova-page-select" title="Seite wechseln">${a}</select>
        <button class="nova-nbtn" id="nova-scan-btn" title="Texte scannen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
        <button class="nova-nbtn" id="nova-reload-btn" title="Seite neu laden">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
        </button>
        <button class="nova-nbtn" id="nova-logout-btn" title="Abmelden">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>

      <!-- Tabs -->
      <div id="nova-tabs" role="tablist">
        <button class="active" data-tab="chat" role="tab">Chat</button>
        <button data-tab="element" role="tab">Element</button>
        <button data-tab="images" role="tab">Bilder</button>
        <button data-tab="permissions" role="tab">Regeln</button>
      </div>

      <!-- Chat Tab -->
      <div class="nova-pane active" id="nova-pane-chat">
        <div id="nova-chat" aria-live="polite"></div>
        <div id="nova-input-area">
          <textarea id="nova-input" placeholder="Beschreiben Sie die gewünschte Änderung…" rows="2"></textarea>
          <button id="nova-send" title="Senden (Enter)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>

      <!-- Element Tab -->
      <div class="nova-pane" id="nova-pane-element">
        <div id="nova-element-info">
          <div style="color:#334155;font-size:12px;padding:8px 0;">Kein Element ausgewählt — klicken Sie auf ein hervorgehobenes Element.</div>
        </div>
      </div>

      <!-- Bilder Tab -->
      <div class="nova-pane" id="nova-pane-images">
        <div id="nova-upload-zone" tabindex="0" role="button" aria-label="Bild hochladen">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          <div style="margin-top:10px;font-weight:500;">Bild hier ablegen oder klicken</div>
          <div style="font-size:11px;margin-top:4px;color:#1e293b;">JPEG · PNG · WebP · GIF — max. 10 MB</div>
          <div style="font-size:11px;margin-top:2px;color:#1e293b;">→ Automatisch in WebP konvertiert (4 Größen)</div>
        </div>
        <input type="file" id="nova-upload-input" accept="image/jpeg,image/png,image/webp,image/gif">
        <div id="nova-upload-result"></div>
      </div>

      <!-- Permissions Tab -->
      <div class="nova-pane" id="nova-pane-permissions">
        <div id="nova-perms-tab"></div>
      </div>
    `,document.body.appendChild(e),document.body.classList.add("nova-active"),this._makeDraggable(document.getElementById("nova-header"),e),this._renderPermissions()}_makeDraggable(e,t){let n=!1,a=0,o=0;const r=(s,g)=>{n=!0;const i=t.getBoundingClientRect();a=s-i.left,o=g-i.top,t.style.right="auto",t.style.bottom="auto",t.classList.add("is-dragging")},l=(s,g)=>{if(!n)return;const i=window.innerWidth-t.offsetWidth,d=window.innerHeight-t.offsetHeight;t.style.left=Math.max(0,Math.min(i,s-a))+"px",t.style.top=Math.max(0,Math.min(d,g-o))+"px"},c=()=>{n=!1,t.classList.remove("is-dragging")};e.addEventListener("mousedown",s=>{s.target.closest("button,select,input")||(s.preventDefault(),r(s.clientX,s.clientY))}),document.addEventListener("mousemove",s=>l(s.clientX,s.clientY)),document.addEventListener("mouseup",c),e.addEventListener("touchstart",s=>{s.target.closest("button,select,input")||r(s.touches[0].clientX,s.touches[0].clientY)},{passive:!0}),document.addEventListener("touchmove",s=>{n&&(s.preventDefault(),l(s.touches[0].clientX,s.touches[0].clientY))},{passive:!1}),document.addEventListener("touchend",c)}_toggle(){this.isOpen=!this.isOpen;const e=document.getElementById("nova-panel"),t=document.getElementById("nova-fab");e.classList.toggle("is-open",this.isOpen),t.classList.toggle("is-open",this.isOpen)}_close(){this.isOpen=!1,document.getElementById("nova-panel").classList.remove("is-open"),document.getElementById("nova-fab").classList.remove("is-open")}_bindEvents(){var n,a,o,r,l,c,s,g;document.addEventListener("click",i=>{if(!this.editMode)return;const d=i.target.closest("[data-nova-id]");if(!(!d||d.closest("#nova-panel")||d.closest("#nova-fab")||d.closest("#nova-toolbar"))){if(i.preventDefault(),i.stopPropagation(),this._isPageBlocked()){this._renderMessage("system","⚠️ Seite ist schreibgeschützt."),this._open();return}if(d.dataset.novaBlocked){this._renderMessage("system",`🔒 Element "${d.dataset.novaId}" ist gesperrt.`),this._open();return}this._selectElement(d)}},!0),(n=document.getElementById("nova-minimize"))==null||n.addEventListener("click",()=>this._close()),(a=document.getElementById("nova-close-btn"))==null||a.addEventListener("click",()=>this._close()),(o=document.getElementById("nova-reload-btn"))==null||o.addEventListener("click",()=>location.reload()),(r=document.getElementById("nova-logout-btn"))==null||r.addEventListener("click",async()=>{await this._finalizeSessionInBackground(this.session),localStorage.removeItem(v),await fetch(p+"/auth.php",{method:"POST",body:new URLSearchParams({action:"logout"}),credentials:"same-origin"}),window.location.href=p+"/login.html"}),(l=document.getElementById("nova-page-select"))==null||l.addEventListener("change",i=>{const d=i.target.value,h=d==="index.html"?"/":"/"+d.replace("/index.html","/");window.location.href=h+"?nova=1"}),(c=document.getElementById("nova-scan-btn"))==null||c.addEventListener("click",()=>this._scanElements()),document.querySelectorAll("#nova-tabs button").forEach(i=>{i.addEventListener("click",()=>{var h;document.querySelectorAll("#nova-tabs button").forEach(b=>b.classList.remove("active")),i.classList.add("active");const d=i.dataset.tab;document.querySelectorAll(".nova-pane").forEach(b=>b.classList.remove("active")),(h=document.getElementById("nova-pane-"+d))==null||h.classList.add("active")})}),(s=document.getElementById("nova-send"))==null||s.addEventListener("click",()=>this._sendMessage()),(g=document.getElementById("nova-input"))==null||g.addEventListener("keydown",i=>{i.key==="Enter"&&!i.shiftKey&&(i.preventDefault(),this._sendMessage())});const e=document.getElementById("nova-upload-zone"),t=document.getElementById("nova-upload-input");e==null||e.addEventListener("click",()=>t==null?void 0:t.click()),e==null||e.addEventListener("dragover",i=>{i.preventDefault(),e.style.borderColor="#06b6d4"}),e==null||e.addEventListener("dragleave",()=>e.style.borderColor=""),e==null||e.addEventListener("drop",i=>{i.preventDefault(),e.style.borderColor="",i.dataTransfer.files[0]&&this._uploadImage(i.dataTransfer.files[0])}),t==null||t.addEventListener("change",()=>{t.files[0]&&this._uploadImage(t.files[0])})}_open(){var e,t;this.isOpen||this._toggle(),document.querySelectorAll("#nova-tabs button").forEach(n=>n.classList.remove("active")),(e=document.querySelector('#nova-tabs button[data-tab="chat"]'))==null||e.classList.add("active"),document.querySelectorAll(".nova-pane").forEach(n=>n.classList.remove("active")),(t=document.getElementById("nova-pane-chat"))==null||t.classList.add("active")}_scanElements(){const e=["h1","h2","h3","h4","h5","h6","p","span","a","button","li","td","th","label","figcaption"];let t=0;document.querySelectorAll(e.join(",")).forEach(n=>{if(n.dataset.novaId||n.closest("#nova-panel, #nova-fab, #nova-toolbar")||n.closest("[data-nova-id]"))return;const a=n.textContent.trim();!a||a.length<3||(n.dataset.novaId="scan-"+ ++t+"-"+n.tagName.toLowerCase())}),this._renderMessage("system",`🔍 ${t} weitere Elemente erkannt und editierbar gemacht.`),this._applyPagePermissions()}_selectElement(e){var r,l;(r=this.selectedEl)==null||r.classList.remove("nova-selected"),e.classList.add("nova-selected"),this.selectedEl=e;const t=e.dataset.novaId,n=e.tagName.toLowerCase(),a=(e.textContent||e.getAttribute("src")||e.getAttribute("href")||"").trim().slice(0,300);this.selectedCtx={novaId:t,page:this._currentPage(),elementType:n,currentContent:a};const o=document.getElementById("nova-element-info");o&&(o.innerHTML=`
      <div class="nf"><div class="nf-label">Element-ID</div><div class="nf-val highlight">${t}</div></div>
      <div class="nf"><div class="nf-label">HTML-Tag</div><div class="nf-val">&lt;${n}&gt;</div></div>
      <div class="nf"><div class="nf-label">Seite</div><div class="nf-val">${this._currentPage()}</div></div>
      <div class="nf"><div class="nf-label">Aktueller Inhalt</div><div class="nf-content">${a||"—"}</div></div>
    `),this._renderMessage("system",`Element: ${t}`),this._renderMessage("nova",`Ich habe **${t}** ausgewählt — ein &lt;${n}&gt;.

Aktuell: „${a.slice(0,100)}…"

Was möchten Sie ändern?`),this._open(),(l=document.getElementById("nova-input"))==null||l.focus()}async _sendMessage(){const e=document.getElementById("nova-input"),t=e==null?void 0:e.value.trim();if(!t)return;if(e.value="",this._renderMessage("user",t),this._addToSessionMessages("user",t),this.pendingApply){const a=t.toLowerCase();if(a.match(/^(ja|yes|ok|mach|übernehm|genau|bitte)/)){await this._applyChange(this.pendingApply),this.pendingApply=null;return}if(a.match(/^(nein|no|nicht|abbruch|stop|cancel)/)){this.pendingApply=null,this._renderMessage("nova","Verstanden, die Änderung wurde nicht übernommen. Was kann ich stattdessen tun?");return}}const n=this._renderMessage("typing","Nova denkt…");try{const o=await(await fetch(p+"/chat.php",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,context:this.selectedCtx||{}})})).json();n==null||n.remove();const r=o.message||"Kein Inhalt in der Antwort.";this._renderMessage("nova",r),this._addToSessionMessages("nova",r),o.applyData&&(this.pendingApply={...o.applyData,...this.selectedCtx||{}},this._showApplyButtons())}catch{n==null||n.remove(),this._renderMessage("system","❌ Verbindungsfehler. Bitte prüfen Sie das Nova-Backend.")}}_showApplyButtons(){const e=document.getElementById("nova-chat"),t=document.createElement("div");t.className="nova-apply-row",t.innerHTML='<button class="nova-btn-yes">✅ Ja, übernehmen</button><button class="nova-btn-no">❌ Nein</button>',t.querySelector(".nova-btn-yes").addEventListener("click",async()=>{t.remove(),await this._applyChange(this.pendingApply),this.pendingApply=null}),t.querySelector(".nova-btn-no").addEventListener("click",()=>{t.remove(),this.pendingApply=null,this._renderMessage("nova","Verstanden. Was soll ich stattdessen ändern?")}),e.appendChild(t),e.scrollTop=e.scrollHeight}async _applyChange(e){this._renderMessage("system","Änderung wird gespeichert…");try{const n=await(await fetch(p+"/apply.php",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":this.csrfToken||""},body:JSON.stringify(e)})).json();n.success?(this._addToSessionChanges(e),this._renderMessage("nova",`✅ Änderung gespeichert!

Soll ich die Seite neu laden, damit Sie die Änderung sehen?`),this._showReloadButton()):this._renderMessage("system","❌ Fehler: "+(n.error||"Unbekannt"))}catch{this._renderMessage("system","❌ Verbindungsfehler beim Speichern.")}}_showReloadButton(){const e=document.getElementById("nova-chat"),t=document.createElement("div");t.className="nova-apply-row",t.innerHTML='<button class="nova-btn-yes">🔄 Jetzt neu laden</button><button class="nova-btn-no">Später</button>',t.querySelector(".nova-btn-yes").addEventListener("click",()=>location.reload()),t.querySelector(".nova-btn-no").addEventListener("click",()=>t.remove()),e.appendChild(t),e.scrollTop=e.scrollHeight}async _uploadImage(e){const t=document.getElementById("nova-upload-result");if(!t)return;t.innerHTML='<span style="color:#6b7280;">Upload läuft…</span>';const n=new FormData;n.append("image",e),n.append("csrf_token",this.csrfToken||"");try{const o=await(await fetch(p+"/image.php",{method:"POST",credentials:"same-origin",body:n})).json();if(o.success&&o.urls){const r=Object.entries(o.urls).map(([l,c])=>`<a class="nova-img-link" href="${c}" target="_blank">${l}px</a>`).join("");t.innerHTML=`<div style="color:#34d399;margin-bottom:6px;">✅ ${e.name} — ${o.urls.length||Object.keys(o.urls).length} Varianten:</div><div class="nova-img-row">${r}</div>`}else t.innerHTML='<span style="color:#f87171;">❌ '+(o.error||"Upload fehlgeschlagen")+"</span>"}catch{t.innerHTML='<span style="color:#f87171;">❌ Verbindungsfehler beim Upload.</span>'}}_renderMessage(e,t){const n=document.getElementById("nova-chat");if(!n)return null;const a=document.createElement("div");if(a.className="nova-msg "+e,a.innerHTML=this._md(t),n.appendChild(a),n.scrollTop=n.scrollHeight,!this.isOpen&&e!=="system"){const o=document.getElementById("nova-fab-badge");o&&(o.style.display="flex",o.textContent=parseInt(o.textContent||"0")+1||1)}else{const o=document.getElementById("nova-fab-badge");o&&(o.style.display="none")}return a}_md(e){return String(e).replace(/&(?!(lt|gt|amp|quot|apos);)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/&amp;lt;/g,"&lt;").replace(/&amp;gt;/g,"&gt;").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/`(.*?)`/g,"<code>$1</code>").replace(/\n/g,"<br>")}_renderPermissions(){var a;const e=document.getElementById("nova-perms-tab");if(!e)return;const t=this.permissions,n=(o,r,l=!0)=>`<div class="perm-row"><span class="perm-label">${o}</span><span class="${l?"perm-ok":"perm-bad"}">${r}</span></div>`;e.innerHTML=`
      <div style="font-weight:700;color:white;margin-bottom:10px;">Nova v${this.novaVersion} — Berechtigungen</div>
      ${n("Editierbare Seiten",Object.values(t.allowed_pages||{}).join(", ")||"—")}
      ${n("Gesperrte Seiten",(t.blocked_pages||[]).join(", ")||"—",!1)}
      ${n("Änderungs-Typen",(t.allowed_change_types||[]).join(", ")||"—")}
      ${n("Gesperrte Elemente",(t.blocked_nova_ids||[]).join(", ")||"—",!1)}
      ${n("Max. Inhalt",(t.max_content_length||2e3)+" Zeichen")}
      ${n("Bild-Upload",(a=t.image_upload)!=null&&a.enabled?"Ja, max. "+t.image_upload.max_size_mb+" MB":"Nein")}
      <div style="margin-top:10px;color:#4b5563;font-size:11px;font-weight:600;">Verbotene Themen</div>
      ${(t.blocked_topics||[]).map(o=>`<div style="padding:3px 0;color:#6b7280;font-size:11px;">• ${o}</div>`).join("")}
    `}}window._novaInstance||(window._novaInstance=new f,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>window._novaInstance.init()):window._novaInstance.init());
