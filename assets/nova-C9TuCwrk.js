function f(){if(typeof window>"u"||!("IntersectionObserver"in window)){document.querySelectorAll("[data-animate]").forEach(e=>{e.classList.add("animate-in")});return}const g=new IntersectionObserver(e=>{e.forEach(t=>{if(t.isIntersecting){const n=t.target,a=parseInt(n.dataset.delay||"0",10);a>0?setTimeout(()=>n.classList.add("animate-in"),a):n.classList.add("animate-in"),g.unobserve(n)}})},{threshold:.12,rootMargin:"0px 0px -40px 0px"});document.querySelectorAll("[data-animate]").forEach(e=>{g.observe(e)})}function x(){if(!("IntersectionObserver"in window))return;function g(n){return 1-Math.pow(1-n,4)}function e(n){const a=parseFloat(n.dataset.counter||"0"),o=parseInt(n.dataset.duration||"2000",10),s=n.dataset.suffix||"",d=n.dataset.prefix||"",c=parseInt(n.dataset.decimals||"0",10),r=performance.now();function p(i){const l=i-r,u=Math.min(l/o,1),m=g(u)*a;n.textContent=d+m.toFixed(c)+s,u<1?requestAnimationFrame(p):n.textContent=d+a.toFixed(c)+s}requestAnimationFrame(p)}const t=new IntersectionObserver(n=>{n.forEach(a=>{a.isIntersecting&&(e(a.target),t.unobserve(a.target))})},{threshold:.5});document.querySelectorAll("[data-counter]").forEach(n=>{t.observe(n)})}function y(g="particles-container",e=30){const t=document.getElementById(g);if(!t||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const a=["rgba(6, 182, 212, 0.6)","rgba(139, 92, 246, 0.5)","rgba(6, 182, 212, 0.3)","rgba(255, 255, 255, 0.3)","rgba(139, 92, 246, 0.3)"];for(let o=0;o<e;o++){const s=document.createElement("div");s.className="particle";const d=Math.random()*4+1,c=Math.random()*100,r=Math.random()*8,p=Math.random()*8+6,i=a[Math.floor(Math.random()*a.length)];Object.assign(s.style,{width:`${d}px`,height:`${d}px`,left:`${c}%`,bottom:`${Math.random()*-20}%`,backgroundColor:i,animationDelay:`${r}s`,animationDuration:`${p}s`}),t.appendChild(s)}}function w(){window.matchMedia("(prefers-reduced-motion: reduce)").matches||document.querySelectorAll("[data-tilt]").forEach(e=>{function t(o){const s=e.getBoundingClientRect(),d=o.clientX-s.left,c=o.clientY-s.top,r=s.width/2,p=s.height/2,i=(c-p)/p*-6,l=(d-r)/r*6;e.style.transform=`perspective(800px) rotateX(${i}deg) rotateY(${l}deg) translateZ(4px)`}function n(){e.style.transform="perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)",e.style.transition="transform 0.4s ease"}function a(){e.style.transition="transform 0.1s ease"}e.addEventListener("mousemove",t),e.addEventListener("mouseleave",n),e.addEventListener("mouseenter",a)})}function _(){document.querySelectorAll("[data-stagger]").forEach(g=>{const e=parseInt(g.dataset.staggerDelay||"100",10);g.querySelectorAll("[data-animate]").forEach((n,a)=>{n.dataset.delay=String(a*e)})})}function M({particles:g=!0,counters:e=!0,scroll:t=!0,tilt:n=!1,stagger:a=!0,particlesId:o="particles-container",particlesCount:s=25}={}){a&&_(),t&&f(),e&&x(),n&&w(),g&&y(o,s)}const h="/nova",b="nova_v3_session",k=12*60*60*1e3,E="https://dynos.dynomic.ai/api/knowledge.php",S="jarvis_PzShRhHuW0pKRWbxbwhOb0J";class I{constructor(){this.isOpen=!1,this.editMode=!1,this.permissions={},this.csrfToken=null,this.novaVersion="3.0",this.selectedEl=null,this.selectedCtx=null,this.pendingApply=null,this._loadSession()}_loadSession(){try{const e=localStorage.getItem(b);if(e){const t=JSON.parse(e);if(t.expiry>Date.now()){this.session=t;return}this._finalizeSessionInBackground(t),localStorage.removeItem(b)}}catch{}this.session={id:"nova_"+Math.random().toString(36).slice(2,10),started:Date.now(),expiry:Date.now()+k,messages:[],changes:[],page:window.location.pathname},this._saveSession()}_saveSession(){this.session.lastActivity=Date.now();try{localStorage.setItem(b,JSON.stringify(this.session))}catch{}}_addToSessionMessages(e,t){this.session.messages.push({type:e,text:t,ts:Date.now(),page:window.location.pathname}),this._saveSession()}_addToSessionChanges(e){this.session.changes.push({...e,ts:Date.now(),page:window.location.pathname}),this._saveSession()}async _finalizeSessionInBackground(e){var n,a;if(!((n=e==null?void 0:e.changes)!=null&&n.length)&&!((a=e==null?void 0:e.messages)!=null&&a.length))return;const t=this._buildSessionSummary(e);try{await fetch(E,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+S},body:JSON.stringify({title:"Nova CMS Session – VaTo24",content:t,category:"sessions",tags:["nova","vato24","cms"],project:"VaTo24",session_id:e.id})})}catch{}}_buildSessionSummary(e){const t=Math.round((Date.now()-e.started)/6e4),n=e.changes.map(o=>`- ${o.page}: [${o.novaId}] → "${String(o.newContent).slice(0,80)}"`).join(`
`),a=e.messages.filter(o=>o.type==="user").length;return`Nova CMS Session auf VaTo24 (Dauer: ${t} Min.)
Seiten: ${e.page}
Nachrichten: ${a}
Änderungen:
${n||"Keine"}`}_currentPage(){let e=window.location.pathname.replace(/^\/+/,"");return!e||e==="/"?"index.html":(e.endsWith(".html")||(e=e.replace(/\/+$/,"")+"/index.html"),e)}async init(){const t=new URLSearchParams(window.location.search).has("nova");let n=!1;try{const a=await fetch(h+"/permissions-api.php",{credentials:"same-origin"});if(a.ok){const o=await a.json();n=o.authenticated||!1,this.csrfToken=o.csrf_token||null,this.permissions=o.permissions||{},this.novaVersion=o.nova_version||"3.0"}}catch{}if(!n){t&&(window.location.href=h+"/login.html");return}if(this._injectStyles(),this._injectFAB(),this._injectPanel(),this._bindEvents(),this._applyPagePermissions(),this.editMode=!0,this.session.messages.length?(this.session.messages.forEach(a=>this._renderMessage(a.type,a.text)),this._renderMessage("system",`↩ Session fortgesetzt (${this.session.messages.length} frühere Nachrichten)`)):this._renderMessage("nova",`Hallo! Ich bin **Nova v${this.novaVersion}** ✨

Klicken Sie auf ein beliebiges Element auf der Seite.`),this._isPageBlocked()&&this._renderMessage("system","⚠️ Diese Seite ist schreibgeschützt."),t){const a=new URL(window.location.href);a.searchParams.delete("nova"),window.history.replaceState({},"",a)}}_isPageBlocked(){const e=this._currentPage();return(this.permissions.blocked_pages||[]).some(t=>e===t||e.endsWith("/"+t))}_isElementBlocked(e){return(this.permissions.blocked_nova_ids||[]).includes(e)}_applyPagePermissions(){document.querySelectorAll("[data-nova-id]").forEach(e=>{(this._isPageBlocked()||this._isElementBlocked(e.dataset.novaId))&&(e.dataset.novaBlocked="true")})}_injectStyles(){if(document.getElementById("nova-styles"))return;const e=document.createElement("style");e.id="nova-styles",e.textContent=`
      /* ── Hover-Highlights ── */
      body.nova-active [data-nova-id]:not([data-nova-blocked]):hover {
        outline: 2px dashed rgba(6,182,212,.75) !important;
        outline-offset: 3px !important;
        cursor: pointer !important;
      }
      body.nova-active [data-nova-id].nova-selected {
        outline: 2px solid #06b6d4 !important;
        outline-offset: 3px !important;
      }
      body.nova-active [data-nova-blocked="true"]:hover {
        outline: 2px dashed rgba(239,68,68,.5) !important;
        cursor: not-allowed !important;
      }
      body.nova-active #nova-panel *,
      body.nova-active #nova-fab * { outline: none !important; cursor: initial; }

      /* ── FAB (runder Floating-Button) ── */
      #nova-fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483647;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, #7c3aed, #06b6d4);
        box-shadow: 0 4px 24px rgba(6,182,212,.45), 0 0 0 0 rgba(6,182,212,.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        border: none;
        animation: nova-pulse 2.5s infinite;
        transition: transform .2s, box-shadow .2s;
        user-select: none;
      }
      #nova-fab:hover { transform: scale(1.1); box-shadow: 0 6px 32px rgba(6,182,212,.6); }
      #nova-fab.is-open { animation: none; transform: rotate(45deg); }
      #nova-fab-badge {
        position: absolute;
        top: -4px; right: -4px;
        background: #f87171;
        color: white;
        font-size: 10px;
        font-weight: 700;
        width: 18px; height: 18px;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        font-family: Inter, sans-serif;
      }
      @keyframes nova-pulse {
        0%,100% { box-shadow: 0 4px 24px rgba(6,182,212,.45), 0 0 0 0 rgba(6,182,212,.3); }
        50%      { box-shadow: 0 4px 24px rgba(6,182,212,.45), 0 0 0 10px rgba(6,182,212,.0); }
      }

      /* ── Panel (draggable) ── */
      #nova-panel {
        position: fixed;
        bottom: 90px;
        right: 24px;
        width: 370px;
        height: 520px;
        background: #0d1117;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 16px;
        z-index: 2147483646;
        display: none;
        flex-direction: column;
        font-family: Inter, system-ui, sans-serif;
        box-shadow: 0 8px 48px rgba(0,0,0,.6), 0 0 0 1px rgba(6,182,212,.1);
        overflow: hidden;
        user-select: none;
      }
      #nova-panel.is-open { display: flex; }
      #nova-panel.is-dragging { opacity: .95; }

      /* ── Panel Header (Drag Handle) ── */
      #nova-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        background: linear-gradient(135deg, #7c3aed22, #06b6d422);
        border-bottom: 1px solid rgba(255,255,255,.07);
        cursor: grab;
        flex-shrink: 0;
      }
      #nova-header:active { cursor: grabbing; }
      #nova-header-title { flex: 1; font-size: 13px; font-weight: 700; color: white; pointer-events: none; }
      #nova-header-sub { font-size: 10px; color: #6b7280; margin-top: 1px; pointer-events: none; }
      .nova-icon-btn {
        width: 28px; height: 28px;
        background: rgba(255,255,255,.06);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 6px;
        color: #9ca3af;
        font-size: 13px;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        transition: background .15s;
        font-family: inherit;
      }
      .nova-icon-btn:hover { background: rgba(255,255,255,.12); color: white; }

      /* ── Tabs ── */
      #nova-tabs {
        display: flex;
        background: #0a0f16;
        border-bottom: 1px solid rgba(255,255,255,.06);
        flex-shrink: 0;
        overflow-x: auto;
        scrollbar-width: none;
      }
      #nova-tabs::-webkit-scrollbar { display: none; }
      #nova-tabs button {
        flex-shrink: 0;
        padding: 8px 12px;
        background: none;
        border: none;
        color: #6b7280;
        font-size: 11px;
        cursor: pointer;
        font-family: inherit;
        border-bottom: 2px solid transparent;
        transition: color .15s;
        white-space: nowrap;
      }
      #nova-tabs button:hover { color: #9ca3af; }
      #nova-tabs button.active { color: #06b6d4; border-bottom-color: #06b6d4; }

      /* ── Tab Panes ── */
      .nova-pane { display: none; flex: 1; flex-direction: column; overflow: hidden; }
      .nova-pane.active { display: flex; }

      /* ── Chat ── */
      #nova-chat {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        scroll-behavior: smooth;
      }
      #nova-chat::-webkit-scrollbar { width: 4px; }
      #nova-chat::-webkit-scrollbar-track { background: transparent; }
      #nova-chat::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 2px; }
      .nova-msg {
        padding: 9px 12px;
        border-radius: 12px;
        font-size: 13px;
        line-height: 1.55;
        max-width: 88%;
        word-break: break-word;
        animation: nova-fadein .2s ease;
      }
      @keyframes nova-fadein { from { opacity: 0; transform: translateY(4px); } }
      .nova-msg.user   { background: rgba(124,58,237,.2); border: 1px solid rgba(124,58,237,.3); align-self: flex-end; color: #e2e8f0; }
      .nova-msg.nova   { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); align-self: flex-start; color: #cbd5e1; }
      .nova-msg.system { background: rgba(6,182,212,.08); border: 1px solid rgba(6,182,212,.15); color: #67e8f9; font-size: 11px; align-self: center; text-align: center; max-width: 95%; }
      .nova-msg.typing { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.06); align-self: flex-start; color: #4b5563; font-style: italic; }
      .nova-msg strong { color: #e2e8f0; }

      /* Apply-Buttons */
      .nova-apply-row { display: flex; gap: 6px; margin-top: 8px; }
      .nova-btn-yes { padding: 5px 14px; background: linear-gradient(135deg, #7c3aed, #06b6d4); border: none; border-radius: 6px; color: white; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
      .nova-btn-no  { padding: 5px 14px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 6px; color: #9ca3af; font-size: 12px; cursor: pointer; font-family: inherit; }
      .nova-btn-yes:hover { opacity: .9; }
      .nova-btn-no:hover { color: white; }

      /* ── Input ── */
      #nova-input-area {
        padding: 10px;
        border-top: 1px solid rgba(255,255,255,.06);
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      #nova-input {
        width: 100%;
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 8px;
        color: white;
        padding: 8px 10px;
        font-size: 13px;
        resize: none;
        height: 54px;
        font-family: inherit;
        box-sizing: border-box;
        transition: border-color .15s;
      }
      #nova-input:focus { outline: none; border-color: rgba(6,182,212,.5); }
      #nova-input::placeholder { color: #374151; }
      #nova-send {
        align-self: flex-end;
        padding: 6px 16px;
        background: linear-gradient(135deg, #7c3aed, #06b6d4);
        border: none;
        border-radius: 7px;
        color: white;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
      }
      #nova-send:hover { opacity: .9; }

      /* ── Element-Tab ── */
      #nova-element-info { padding: 12px; font-size: 12px; color: #94a3b8; }
      .nova-field { margin-bottom: 10px; }
      .nova-field-label { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #4b5563; margin-bottom: 3px; }
      .nova-field-value { color: #e2e8f0; word-break: break-all; }
      .nova-field-content { color: #9ca3af; font-size: 11px; margin-top: 3px; max-height: 60px; overflow: hidden; text-overflow: ellipsis; }

      /* ── Bilder-Tab ── */
      #nova-upload-zone {
        margin: 12px;
        border: 2px dashed rgba(6,182,212,.3);
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        color: #6b7280;
        font-size: 12px;
        transition: border-color .2s, background .2s;
      }
      #nova-upload-zone:hover { border-color: rgba(6,182,212,.6); background: rgba(6,182,212,.04); }
      #nova-upload-input { display: none; }
      #nova-upload-result { padding: 0 12px 12px; font-size: 11px; }
      .nova-img-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
      .nova-img-link { color: #67e8f9; text-decoration: none; font-size: 10px; padding: 3px 8px; background: rgba(6,182,212,.1); border-radius: 4px; }

      /* ── Permissions-Tab ── */
      #nova-perms-tab { padding: 12px; font-size: 12px; overflow-y: auto; flex: 1; }
      .perm-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,.04); }
      .perm-label { color: #6b7280; }
      .perm-val-ok  { color: #34d399; text-align: right; max-width: 55%; word-break: break-word; }
      .perm-val-bad { color: #f87171; text-align: right; max-width: 55%; word-break: break-word; }

      /* ── Toolbar ── */
      #nova-toolbar {
        position: fixed;
        top: 16px; right: 16px;
        z-index: 2147483646;
        display: flex; align-items: center; gap: 6px;
        background: rgba(13,17,23,.92);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 10px;
        padding: 6px 10px;
        backdrop-filter: blur(12px);
        font-family: Inter, sans-serif;
        font-size: 11px;
      }
      #nova-toolbar select, #nova-toolbar button {
        background: rgba(255,255,255,.06);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 6px;
        color: #94a3b8;
        font-size: 11px;
        padding: 4px 8px;
        cursor: pointer;
        font-family: inherit;
      }
      #nova-toolbar select option { background: #0d1117; }
      #nova-toolbar button:hover, #nova-toolbar select:focus { color: white; }
    `,document.head.appendChild(e)}_injectFAB(){const e=document.createElement("button");e.id="nova-fab",e.setAttribute("aria-label","Nova CMS öffnen"),e.innerHTML='✨<span id="nova-fab-badge"></span>',document.body.appendChild(e),e.addEventListener("click",()=>this._toggle())}_injectPanel(){const e=document.createElement("div");e.id="nova-panel",e.setAttribute("role","dialog"),e.setAttribute("aria-label","Nova CMS");const t=this._currentPage(),n=this.permissions.allowed_pages||{},a=Object.entries(n).map(([o,s])=>`<option value="${o}" ${o===t?"selected":""}>${s}</option>`).join("");e.innerHTML=`
      <!-- Header / Drag-Handle -->
      <div id="nova-header">
        <div>
          <div id="nova-header-title">✨ Nova v${this.novaVersion}</div>
          <div id="nova-header-sub">Bearbeite: ${n[t]||t}</div>
        </div>
        <button class="nova-icon-btn" id="nova-minimize" title="Minimieren" aria-label="Minimieren">–</button>
        <button class="nova-icon-btn" id="nova-close-btn" title="Schließen" aria-label="Schließen">×</button>
      </div>

      <!-- Toolbar (Seite wechseln, Reload, Logout) -->
      <div id="nova-toolbar" style="position:static;border-radius:0;backdrop-filter:none;border:none;border-bottom:1px solid rgba(255,255,255,.06);">
        <select id="nova-page-select" title="Seite wechseln">${a}</select>
        <button id="nova-reload-btn" title="Seite neu laden">🔄</button>
        <button id="nova-scan-btn" title="Alle Textelemente scannen">🔍</button>
        <button id="nova-logout-btn" title="Abmelden">⏻</button>
      </div>

      <!-- Tabs -->
      <div id="nova-tabs" role="tablist">
        <button class="active" data-tab="chat" role="tab">💬 Chat</button>
        <button data-tab="element" role="tab">🎯 Element</button>
        <button data-tab="images" role="tab">🖼️ Bilder</button>
        <button data-tab="permissions" role="tab">🔐</button>
      </div>

      <!-- Chat Tab -->
      <div class="nova-pane active" id="nova-pane-chat">
        <div id="nova-chat" aria-live="polite"></div>
        <div id="nova-input-area">
          <textarea id="nova-input" placeholder="Was soll geändert werden? (Enter = Senden)" rows="2"></textarea>
          <button id="nova-send">Senden →</button>
        </div>
      </div>

      <!-- Element Tab -->
      <div class="nova-pane" id="nova-pane-element">
        <div id="nova-element-info">
          <div style="color:#4b5563;font-size:12px;">Kein Element ausgewählt.<br>Klicken Sie auf ein Element auf der Seite.</div>
        </div>
      </div>

      <!-- Bilder Tab -->
      <div class="nova-pane" id="nova-pane-images">
        <div id="nova-upload-zone" tabindex="0" role="button" aria-label="Bild hochladen">
          📁 Bild hier ablegen oder klicken<br>
          <small style="color:#374151;">JPEG, PNG, WebP, GIF — max. 10 MB → wird in WebP konvertiert</small>
        </div>
        <input type="file" id="nova-upload-input" accept="image/jpeg,image/png,image/webp,image/gif">
        <div id="nova-upload-result"></div>
      </div>

      <!-- Permissions Tab -->
      <div class="nova-pane" id="nova-pane-permissions">
        <div id="nova-perms-tab"></div>
      </div>
    `,document.body.appendChild(e),document.body.classList.add("nova-active"),this._makeDraggable(document.getElementById("nova-header"),e),this._renderPermissions()}_makeDraggable(e,t){let n=!1,a=0,o=0;const s=(r,p)=>{n=!0;const i=t.getBoundingClientRect();a=r-i.left,o=p-i.top,t.style.right="auto",t.style.bottom="auto",t.classList.add("is-dragging")},d=(r,p)=>{if(!n)return;const i=window.innerWidth-t.offsetWidth,l=window.innerHeight-t.offsetHeight;t.style.left=Math.max(0,Math.min(i,r-a))+"px",t.style.top=Math.max(0,Math.min(l,p-o))+"px"},c=()=>{n=!1,t.classList.remove("is-dragging")};e.addEventListener("mousedown",r=>{r.target.closest("button,select,input")||(r.preventDefault(),s(r.clientX,r.clientY))}),document.addEventListener("mousemove",r=>d(r.clientX,r.clientY)),document.addEventListener("mouseup",c),e.addEventListener("touchstart",r=>{r.target.closest("button,select,input")||s(r.touches[0].clientX,r.touches[0].clientY)},{passive:!0}),document.addEventListener("touchmove",r=>{n&&(r.preventDefault(),d(r.touches[0].clientX,r.touches[0].clientY))},{passive:!1}),document.addEventListener("touchend",c)}_toggle(){this.isOpen=!this.isOpen;const e=document.getElementById("nova-panel"),t=document.getElementById("nova-fab");e.classList.toggle("is-open",this.isOpen),t.classList.toggle("is-open",this.isOpen)}_close(){this.isOpen=!1,document.getElementById("nova-panel").classList.remove("is-open"),document.getElementById("nova-fab").classList.remove("is-open")}_bindEvents(){var n,a,o,s,d,c,r,p;document.addEventListener("click",i=>{if(!this.editMode)return;const l=i.target.closest("[data-nova-id]");if(!(!l||l.closest("#nova-panel")||l.closest("#nova-fab")||l.closest("#nova-toolbar"))){if(i.preventDefault(),i.stopPropagation(),this._isPageBlocked()){this._renderMessage("system","⚠️ Seite ist schreibgeschützt."),this._open();return}if(l.dataset.novaBlocked){this._renderMessage("system",`🔒 Element "${l.dataset.novaId}" ist gesperrt.`),this._open();return}this._selectElement(l)}},!0),(n=document.getElementById("nova-minimize"))==null||n.addEventListener("click",()=>this._close()),(a=document.getElementById("nova-close-btn"))==null||a.addEventListener("click",()=>this._close()),(o=document.getElementById("nova-reload-btn"))==null||o.addEventListener("click",()=>location.reload()),(s=document.getElementById("nova-logout-btn"))==null||s.addEventListener("click",async()=>{await this._finalizeSessionInBackground(this.session),localStorage.removeItem(b),await fetch(h+"/auth.php",{method:"POST",body:new URLSearchParams({action:"logout"}),credentials:"same-origin"}),window.location.href=h+"/login.html"}),(d=document.getElementById("nova-page-select"))==null||d.addEventListener("change",i=>{const l=i.target.value,u=l==="index.html"?"/":"/"+l.replace("/index.html","/");window.location.href=u+"?nova=1"}),(c=document.getElementById("nova-scan-btn"))==null||c.addEventListener("click",()=>this._scanElements()),document.querySelectorAll("#nova-tabs button").forEach(i=>{i.addEventListener("click",()=>{var u;document.querySelectorAll("#nova-tabs button").forEach(v=>v.classList.remove("active")),i.classList.add("active");const l=i.dataset.tab;document.querySelectorAll(".nova-pane").forEach(v=>v.classList.remove("active")),(u=document.getElementById("nova-pane-"+l))==null||u.classList.add("active")})}),(r=document.getElementById("nova-send"))==null||r.addEventListener("click",()=>this._sendMessage()),(p=document.getElementById("nova-input"))==null||p.addEventListener("keydown",i=>{i.key==="Enter"&&!i.shiftKey&&(i.preventDefault(),this._sendMessage())});const e=document.getElementById("nova-upload-zone"),t=document.getElementById("nova-upload-input");e==null||e.addEventListener("click",()=>t==null?void 0:t.click()),e==null||e.addEventListener("dragover",i=>{i.preventDefault(),e.style.borderColor="#06b6d4"}),e==null||e.addEventListener("dragleave",()=>e.style.borderColor=""),e==null||e.addEventListener("drop",i=>{i.preventDefault(),e.style.borderColor="",i.dataTransfer.files[0]&&this._uploadImage(i.dataTransfer.files[0])}),t==null||t.addEventListener("change",()=>{t.files[0]&&this._uploadImage(t.files[0])})}_open(){var e,t;this.isOpen||this._toggle(),document.querySelectorAll("#nova-tabs button").forEach(n=>n.classList.remove("active")),(e=document.querySelector('#nova-tabs button[data-tab="chat"]'))==null||e.classList.add("active"),document.querySelectorAll(".nova-pane").forEach(n=>n.classList.remove("active")),(t=document.getElementById("nova-pane-chat"))==null||t.classList.add("active")}_scanElements(){const e=["h1","h2","h3","h4","h5","h6","p","span","a","button","li","td","th","label","figcaption"];let t=0;document.querySelectorAll(e.join(",")).forEach(n=>{if(n.dataset.novaId||n.closest("#nova-panel, #nova-fab, #nova-toolbar")||n.closest("[data-nova-id]"))return;const a=n.textContent.trim();!a||a.length<3||(n.dataset.novaId="scan-"+ ++t+"-"+n.tagName.toLowerCase())}),this._renderMessage("system",`🔍 ${t} weitere Elemente erkannt und editierbar gemacht.`),this._applyPagePermissions()}_selectElement(e){var s,d;(s=this.selectedEl)==null||s.classList.remove("nova-selected"),e.classList.add("nova-selected"),this.selectedEl=e;const t=e.dataset.novaId,n=e.tagName.toLowerCase(),a=(e.textContent||e.getAttribute("src")||e.getAttribute("href")||"").trim().slice(0,300);this.selectedCtx={novaId:t,page:this._currentPage(),elementType:n,currentContent:a};const o=document.getElementById("nova-element-info");o&&(o.innerHTML=`
      <div class="nova-field"><div class="nova-field-label">Element-ID</div><div class="nova-field-value">${t}</div></div>
      <div class="nova-field"><div class="nova-field-label">Typ</div><div class="nova-field-value">&lt;${n}&gt;</div></div>
      <div class="nova-field"><div class="nova-field-label">Seite</div><div class="nova-field-value">${this._currentPage()}</div></div>
      <div class="nova-field"><div class="nova-field-label">Inhalt</div><div class="nova-field-content">${a||"—"}</div></div>
    `),this._renderMessage("system",`✔ Element ausgewählt: [${t}] (${n})`),this._renderMessage("nova",`Ich sehe **${t}** — ein &lt;${n}&gt; Element.

Aktuell: „${a.slice(0,80)}"

Was soll ich ändern?`),this._open(),(d=document.getElementById("nova-input"))==null||d.focus()}async _sendMessage(){const e=document.getElementById("nova-input"),t=e==null?void 0:e.value.trim();if(!t)return;if(e.value="",this._renderMessage("user",t),this._addToSessionMessages("user",t),this.pendingApply){const a=t.toLowerCase();if(a.match(/^(ja|yes|ok|mach|übernehm|genau|bitte)/)){await this._applyChange(this.pendingApply),this.pendingApply=null;return}if(a.match(/^(nein|no|nicht|abbruch|stop|cancel)/)){this.pendingApply=null,this._renderMessage("nova","Verstanden, die Änderung wurde nicht übernommen. Was kann ich stattdessen tun?");return}}const n=this._renderMessage("typing","Nova denkt…");try{const o=await(await fetch(h+"/chat.php",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,context:this.selectedCtx||{}})})).json();n==null||n.remove();const s=o.message||"Kein Inhalt in der Antwort.";this._renderMessage("nova",s),this._addToSessionMessages("nova",s),o.applyData&&(this.pendingApply={...o.applyData,...this.selectedCtx||{}},this._showApplyButtons())}catch{n==null||n.remove(),this._renderMessage("system","❌ Verbindungsfehler. Bitte prüfen Sie das Nova-Backend.")}}_showApplyButtons(){const e=document.getElementById("nova-chat"),t=document.createElement("div");t.className="nova-apply-row",t.innerHTML='<button class="nova-btn-yes">✅ Ja, übernehmen</button><button class="nova-btn-no">❌ Nein</button>',t.querySelector(".nova-btn-yes").addEventListener("click",async()=>{t.remove(),await this._applyChange(this.pendingApply),this.pendingApply=null}),t.querySelector(".nova-btn-no").addEventListener("click",()=>{t.remove(),this.pendingApply=null,this._renderMessage("nova","Verstanden. Was soll ich stattdessen ändern?")}),e.appendChild(t),e.scrollTop=e.scrollHeight}async _applyChange(e){this._renderMessage("system","Änderung wird gespeichert…");try{const n=await(await fetch(h+"/apply.php",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":this.csrfToken||""},body:JSON.stringify(e)})).json();n.success?(this._addToSessionChanges(e),this._renderMessage("nova",`✅ Änderung gespeichert!

Soll ich die Seite neu laden, damit Sie die Änderung sehen?`),this._showReloadButton()):this._renderMessage("system","❌ Fehler: "+(n.error||"Unbekannt"))}catch{this._renderMessage("system","❌ Verbindungsfehler beim Speichern.")}}_showReloadButton(){const e=document.getElementById("nova-chat"),t=document.createElement("div");t.className="nova-apply-row",t.innerHTML='<button class="nova-btn-yes">🔄 Jetzt neu laden</button><button class="nova-btn-no">Später</button>',t.querySelector(".nova-btn-yes").addEventListener("click",()=>location.reload()),t.querySelector(".nova-btn-no").addEventListener("click",()=>t.remove()),e.appendChild(t),e.scrollTop=e.scrollHeight}async _uploadImage(e){const t=document.getElementById("nova-upload-result");if(!t)return;t.innerHTML='<span style="color:#6b7280;">Upload läuft…</span>';const n=new FormData;n.append("image",e),n.append("csrf_token",this.csrfToken||"");try{const o=await(await fetch(h+"/image.php",{method:"POST",credentials:"same-origin",body:n})).json();if(o.success&&o.urls){const s=Object.entries(o.urls).map(([d,c])=>`<a class="nova-img-link" href="${c}" target="_blank">${d}px</a>`).join("");t.innerHTML=`<div style="color:#34d399;margin-bottom:6px;">✅ ${e.name} — ${o.urls.length||Object.keys(o.urls).length} Varianten:</div><div class="nova-img-row">${s}</div>`}else t.innerHTML='<span style="color:#f87171;">❌ '+(o.error||"Upload fehlgeschlagen")+"</span>"}catch{t.innerHTML='<span style="color:#f87171;">❌ Verbindungsfehler beim Upload.</span>'}}_renderMessage(e,t){const n=document.getElementById("nova-chat");if(!n)return null;const a=document.createElement("div");if(a.className="nova-msg "+e,a.innerHTML=this._md(t),n.appendChild(a),n.scrollTop=n.scrollHeight,!this.isOpen&&e!=="system"){const o=document.getElementById("nova-fab-badge");o&&(o.style.display="flex",o.textContent=parseInt(o.textContent||"0")+1||1)}else{const o=document.getElementById("nova-fab-badge");o&&(o.style.display="none")}return a}_md(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/`(.*?)`/g,'<code style="background:rgba(255,255,255,.08);padding:1px 4px;border-radius:3px;font-size:11px;">$1</code>').replace(/\n/g,"<br>")}_renderPermissions(){var a;const e=document.getElementById("nova-perms-tab");if(!e)return;const t=this.permissions,n=(o,s,d=!0)=>`<div class="perm-row"><span class="perm-label">${o}</span><span class="${d?"perm-val-ok":"perm-val-bad"}">${s}</span></div>`;e.innerHTML=`
      <div style="font-weight:700;color:white;margin-bottom:10px;">Nova v${this.novaVersion} — Berechtigungen</div>
      ${n("Editierbare Seiten",Object.values(t.allowed_pages||{}).join(", ")||"—")}
      ${n("Gesperrte Seiten",(t.blocked_pages||[]).join(", ")||"—",!1)}
      ${n("Änderungs-Typen",(t.allowed_change_types||[]).join(", ")||"—")}
      ${n("Gesperrte Elemente",(t.blocked_nova_ids||[]).join(", ")||"—",!1)}
      ${n("Max. Inhalt",(t.max_content_length||2e3)+" Zeichen")}
      ${n("Bild-Upload",(a=t.image_upload)!=null&&a.enabled?"Ja, max. "+t.image_upload.max_size_mb+" MB":"Nein")}
      <div style="margin-top:10px;color:#4b5563;font-size:11px;font-weight:600;">Verbotene Themen</div>
      ${(t.blocked_topics||[]).map(o=>`<div style="padding:3px 0;color:#6b7280;font-size:11px;">• ${o}</div>`).join("")}
    `}}window._novaInstance||(window._novaInstance=new I,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>window._novaInstance.init()):window._novaInstance.init());export{M as i};
