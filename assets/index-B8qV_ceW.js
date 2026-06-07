import{i as g,a as u}from"./footer-BQktf09y.js";import{i as b}from"./animations-CetyjiHi.js";const c="TwR34kF30HUz0Ho8Ys8gjwQOZODLfZVUFmccE7VU6u7QlTvSrktVjBIv";async function h(s,e=1){return(await(await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(s)}&per_page=${e}&orientation=landscape`,{headers:{Authorization:c}})).json()).photos||[]}async function m(s,e=1){return(await(await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(s)}&per_page=${e}&orientation=landscape`,{headers:{Authorization:c}})).json()).videos||[]}function f(s,e="large"){var t,n;return((t=s==null?void 0:s.src)==null?void 0:t[e])||((n=s==null?void 0:s.src)==null?void 0:n.medium)||""}async function x(s,e="digital agency technology"){var n,i,d,r;const t=document.getElementById(s);if(!(!t||!c))try{const o=(await m(e,3))[0];if(o){const l=((i=(n=o.video_files)==null?void 0:n.find(p=>p.quality==="hd"&&p.width<=1920))==null?void 0:i.link)||((r=(d=o.video_files)==null?void 0:d[0])==null?void 0:r.link);l&&(t.src=l,t.load())}}catch(a){console.warn("Pexels video load failed:",a)}}async function y(s,e){const t=document.getElementById(s);if(!(!t||!c))try{const n=await h(e,5),i=n[Math.floor(Math.random()*n.length)];i&&(t.src=f(i,"large2x"),t.alt=i.alt||e)}catch(n){console.warn("Pexels image load failed:",n)}}document.addEventListener("DOMContentLoaded",()=>{g(),u(),b(),x("hero-video","digital agency technology modern"),y("about-image","business team office modern workspace")});class w{constructor(){this.selectedElement=null,this.selectedContext=null,this.editMode=!1,this.csrfToken=null,this.chatMessages=[],this.pendingApply=null,this.currentPage=this._resolvePage()}_resolvePage(){let e=window.location.pathname.replace(/^\/+/,"");return!e||e==="/"?"index.html":(e.endsWith(".html")||(e=e.replace(/\/+$/,"")+"/index.html"),e)}async init(){try{const e=await fetch("/nova/auth.php",{credentials:"same-origin"});if(!e.ok)return;const t=await e.json();if(!t.authenticated){new URLSearchParams(window.location.search).has("nova")&&(window.location.href="/nova/login.html?redirect="+encodeURIComponent(window.location.pathname));return}this.csrfToken=t.csrfToken}catch{return}this._injectStyles(),this._injectUI(),this._bindEvents(),this.editMode=!0,this._addMessage("nova","Hallo! Ich bin Nova, Ihr Website-Assistent. Klicken Sie auf ein beliebiges Element auf der Seite, und ich helfe Ihnen dabei, es zu ändern.")}_injectStyles(){const e=document.createElement("style");e.id="nova-cms-styles",e.textContent=`
      /* ── Nova CMS overlay ── */
      body.nova-active [data-nova-id] {
        position: relative;
      }
      body.nova-active [data-nova-id]:hover {
        outline: 2px dashed rgba(6, 182, 212, 0.7) !important;
        outline-offset: 3px !important;
        cursor: pointer !important;
      }
      body.nova-active [data-nova-id].nova-selected {
        outline: 2px solid #06b6d4 !important;
        outline-offset: 3px !important;
      }
      /* Exclude Nova's own UI */
      body.nova-active #nova-panel [data-nova-id]:hover,
      body.nova-active #nova-toolbar [data-nova-id]:hover {
        outline: none !important;
        cursor: default !important;
      }

      /* ── Panel ── */
      #nova-panel {
        position: fixed;
        bottom: 0;
        right: 0;
        width: 380px;
        height: 540px;
        background: #0d1117;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px 0 0 0;
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        font-family: Inter, system-ui, sans-serif;
        box-shadow: -4px -4px 40px rgba(6,182,212,0.18);
        transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        contain: layout;
      }
      #nova-panel.nova-collapsed {
        transform: translateY(calc(100% - 54px));
      }

      /* ── Header ── */
      #nova-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        height: 54px;
        background: linear-gradient(135deg, #7c3aed, #06b6d4);
        border-radius: 16px 0 0 0;
        cursor: pointer;
        flex-shrink: 0;
        user-select: none;
      }
      #nova-panel-header h3 {
        color: white;
        font-size: 13px;
        font-weight: 700;
        margin: 0;
        letter-spacing: 0.01em;
      }
      #nova-panel-header .nova-collapse-btn {
        color: rgba(255,255,255,0.8);
        font-size: 12px;
        line-height: 1;
        padding: 4px;
        background: rgba(0,0,0,0.2);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
      }

      /* ── Tabs ── */
      #nova-tabs {
        display: flex;
        background: #161b22;
        border-bottom: 1px solid rgba(255,255,255,0.07);
        flex-shrink: 0;
      }
      #nova-tabs button {
        flex: 1;
        padding: 8px 2px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        color: #6b7280;
        font-size: 11px;
        cursor: pointer;
        transition: color 0.15s, border-color 0.15s;
        font-family: inherit;
        white-space: nowrap;
      }
      #nova-tabs button:hover { color: #94a3b8; }
      #nova-tabs button.nova-tab-active {
        color: #06b6d4;
        border-bottom-color: #06b6d4;
      }

      /* ── Tab panes ── */
      .nova-tab-pane {
        display: none;
        flex: 1;
        overflow: hidden;
        flex-direction: column;
      }
      .nova-tab-pane.nova-pane-active {
        display: flex;
      }

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
      #nova-chat::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

      .nova-msg {
        padding: 9px 12px;
        border-radius: 12px;
        font-size: 12.5px;
        line-height: 1.55;
        max-width: 88%;
        word-break: break-word;
        animation: nova-msg-in 0.18s ease;
      }
      @keyframes nova-msg-in {
        from { opacity: 0; transform: translateY(4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nova-msg.nova-user {
        background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15));
        border: 1px solid rgba(124,58,237,0.3);
        align-self: flex-end;
        color: #e2e8f0;
        border-radius: 12px 12px 4px 12px;
      }
      .nova-msg.nova-ai {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.08);
        align-self: flex-start;
        color: #cbd5e1;
        border-radius: 4px 12px 12px 12px;
      }
      .nova-msg.nova-system {
        background: rgba(6,182,212,0.08);
        border: 1px solid rgba(6,182,212,0.2);
        color: #67e8f9;
        font-size: 11px;
        align-self: center;
        text-align: center;
        border-radius: 8px;
        max-width: 95%;
      }
      .nova-msg.nova-error {
        background: rgba(239,68,68,0.08);
        border: 1px solid rgba(239,68,68,0.2);
        color: #fca5a5;
        align-self: center;
        text-align: center;
        font-size: 11px;
        border-radius: 8px;
        max-width: 95%;
      }
      .nova-msg code {
        background: rgba(255,255,255,0.08);
        padding: 1px 5px;
        border-radius: 4px;
        font-size: 11px;
        font-family: 'Fira Code', monospace;
      }
      .nova-msg pre {
        background: rgba(0,0,0,0.3);
        padding: 8px 10px;
        border-radius: 6px;
        font-size: 11px;
        overflow-x: auto;
        margin: 4px 0 0;
        white-space: pre-wrap;
        word-break: break-all;
        font-family: 'Fira Code', monospace;
        color: #a5f3fc;
      }

      /* Typing indicator */
      .nova-typing {
        display: flex;
        gap: 4px;
        padding: 10px 14px;
        align-self: flex-start;
      }
      .nova-typing span {
        width: 6px;
        height: 6px;
        background: #475569;
        border-radius: 50%;
        animation: nova-bounce 1.2s ease-in-out infinite;
      }
      .nova-typing span:nth-child(2) { animation-delay: 0.2s; }
      .nova-typing span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes nova-bounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
        40% { transform: translateY(-6px); opacity: 1; }
      }

      /* ── Input area ── */
      #nova-input-area {
        padding: 10px 12px 12px;
        border-top: 1px solid rgba(255,255,255,0.07);
        flex-shrink: 0;
      }
      #nova-input {
        width: 100%;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        color: white;
        padding: 8px 10px;
        font-size: 12.5px;
        resize: none;
        height: 54px;
        font-family: inherit;
        box-sizing: border-box;
        line-height: 1.5;
      }
      #nova-input:focus {
        outline: none;
        border-color: rgba(6,182,212,0.5);
        box-shadow: 0 0 0 2px rgba(6,182,212,0.1);
      }
      #nova-input::placeholder { color: #475569; }
      .nova-input-row {
        display: flex;
        gap: 6px;
        margin-top: 6px;
      }
      #nova-send {
        flex: 1;
        padding: 7px 12px;
        background: linear-gradient(135deg, #7c3aed, #06b6d4);
        border: none;
        border-radius: 7px;
        color: white;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
        transition: opacity 0.15s;
      }
      #nova-send:hover { opacity: 0.88; }
      #nova-send:disabled { opacity: 0.4; cursor: not-allowed; }

      /* ── Element tab ── */
      #nova-element-tab {
        padding: 14px;
        overflow-y: auto;
        flex: 1;
        font-size: 12px;
        color: #94a3b8;
      }
      #nova-element-tab .nova-field {
        margin-bottom: 12px;
      }
      #nova-element-tab .nova-field-label {
        color: #64748b;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 4px;
      }
      #nova-element-tab .nova-field-value {
        color: #e2e8f0;
        font-size: 12.5px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 6px;
        padding: 7px 10px;
        word-break: break-all;
      }
      #nova-element-tab .nova-no-selection {
        text-align: center;
        color: #475569;
        padding: 32px 12px;
        font-size: 12px;
      }

      /* ── Images tab ── */
      #nova-images-tab {
        padding: 14px;
        overflow-y: auto;
        flex: 1;
        font-size: 12px;
        color: #94a3b8;
      }
      #nova-upload-zone {
        border: 2px dashed rgba(255,255,255,0.12);
        border-radius: 10px;
        padding: 28px 16px;
        text-align: center;
        cursor: pointer;
        transition: border-color 0.2s, background 0.2s;
        color: #6b7280;
        font-size: 12px;
      }
      #nova-upload-zone:hover, #nova-upload-zone.nova-drag-over {
        border-color: rgba(6,182,212,0.4);
        background: rgba(6,182,212,0.04);
        color: #94a3b8;
      }
      #nova-upload-zone svg { margin-bottom: 8px; color: #374151; }
      #nova-upload-input { display: none; }
      #nova-upload-result { margin-top: 12px; }
      .nova-image-size-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 10px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 6px;
        margin-bottom: 6px;
        font-size: 11px;
      }
      .nova-image-size-row a {
        color: #06b6d4;
        text-decoration: none;
        font-size: 10px;
      }
      .nova-image-size-row a:hover { text-decoration: underline; }
      .nova-copy-btn {
        background: rgba(6,182,212,0.1);
        border: 1px solid rgba(6,182,212,0.2);
        border-radius: 4px;
        color: #67e8f9;
        font-size: 10px;
        padding: 2px 8px;
        cursor: pointer;
        font-family: inherit;
        transition: background 0.15s;
      }
      .nova-copy-btn:hover { background: rgba(6,182,212,0.2); }

      /* ── Toolbar ── */
      #nova-toolbar {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 2147483646;
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(13, 17, 23, 0.92);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        padding: 6px 10px;
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        font-family: Inter, system-ui, sans-serif;
      }
      .nova-toolbar-btn {
        padding: 5px 10px;
        background: transparent;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        color: #94a3b8;
        font-size: 11px;
        cursor: pointer;
        font-family: inherit;
        transition: color 0.15s, border-color 0.15s, background 0.15s;
        white-space: nowrap;
      }
      .nova-toolbar-btn:hover {
        color: white;
        border-color: rgba(255,255,255,0.2);
        background: rgba(255,255,255,0.05);
      }
      .nova-toolbar-btn.nova-active {
        background: linear-gradient(135deg, #7c3aed, #06b6d4);
        border-color: transparent;
        color: white;
      }
      #nova-page-select {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        color: #94a3b8;
        font-size: 11px;
        padding: 5px 8px;
        cursor: pointer;
        font-family: inherit;
        outline: none;
        max-width: 140px;
      }
      #nova-page-select:focus { border-color: rgba(6,182,212,0.4); color: white; }
      #nova-page-select option { background: #0d1117; color: white; }

      .nova-toolbar-divider {
        width: 1px;
        height: 20px;
        background: rgba(255,255,255,0.08);
      }

      /* ── Responsive ── */
      @media (max-width: 480px) {
        #nova-panel { width: 100vw; border-radius: 16px 16px 0 0; }
        #nova-toolbar { top: auto; bottom: 560px; right: 8px; }
      }
    `,document.head.appendChild(e)}_injectUI(){document.body.classList.add("nova-active");const e=document.createElement("div");e.id="nova-toolbar",e.setAttribute("aria-label","Nova CMS Toolbar"),e.innerHTML=`
      <span style="color:#06b6d4;font-size:13px;font-weight:700;letter-spacing:-0.3px;">✨ Nova</span>
      <div class="nova-toolbar-divider"></div>
      <select id="nova-page-select" title="Seite wechseln">
        <option value="index.html">Startseite</option>
        <option value="leistungen/index.html">Leistungen</option>
        <option value="marken/index.html">Marken</option>
        <option value="prozess/index.html">Prozess</option>
        <option value="kontakt/index.html">Kontakt</option>
        <option value="projekte/index.html">Projekte</option>
      </select>
      <div class="nova-toolbar-divider"></div>
      <button class="nova-toolbar-btn nova-active" id="nova-edit-toggle" title="Bearbeitungsmodus">Bearbeiten</button>
      <button class="nova-toolbar-btn" id="nova-reload" title="Seite neu laden">Refresh</button>
      <button class="nova-toolbar-btn" id="nova-logout" title="Abmelden">Abmelden</button>
    `,document.body.appendChild(e);const t=document.createElement("div");t.id="nova-panel",t.setAttribute("role","dialog"),t.setAttribute("aria-label","Nova CMS Panel"),t.innerHTML=`
      <div id="nova-panel-header" role="button" tabindex="0" aria-label="Panel ein/ausklappen">
        <h3>✨ Nova — Website-Assistent</h3>
        <button class="nova-collapse-btn" id="nova-collapse" aria-label="Einklappen">▼</button>
      </div>

      <div id="nova-tabs" role="tablist">
        <button role="tab" class="nova-tab-active" data-tab="chat" aria-selected="true">💬 Chat</button>
        <button role="tab" data-tab="element" aria-selected="false">🎯 Element</button>
        <button role="tab" data-tab="images" aria-selected="false">🖼️ Bilder</button>
      </div>

      <!-- Chat Tab -->
      <div class="nova-tab-pane nova-pane-active" id="nova-pane-chat">
        <div id="nova-chat" aria-live="polite" aria-label="Chat-Verlauf"></div>
        <div id="nova-input-area">
          <textarea
            id="nova-input"
            placeholder="Was soll ich ändern? (Enter = Senden)"
            aria-label="Nachricht eingeben"
            rows="2"
          ></textarea>
          <div class="nova-input-row">
            <button id="nova-send" aria-label="Nachricht senden">Senden →</button>
          </div>
        </div>
      </div>

      <!-- Element Tab -->
      <div class="nova-tab-pane" id="nova-pane-element">
        <div id="nova-element-tab">
          <div class="nova-no-selection" id="nova-element-placeholder">
            Kein Element ausgewählt.<br>Klicken Sie auf ein Element auf der Seite.
          </div>
          <div id="nova-element-info" style="display:none;">
            <div class="nova-field">
              <div class="nova-field-label">Element-ID</div>
              <div class="nova-field-value" id="nel-id">—</div>
            </div>
            <div class="nova-field">
              <div class="nova-field-label">Tag</div>
              <div class="nova-field-value" id="nel-tag">—</div>
            </div>
            <div class="nova-field">
              <div class="nova-field-label">Aktueller Inhalt</div>
              <div class="nova-field-value" id="nel-content" style="max-height:80px;overflow-y:auto;">—</div>
            </div>
            <div class="nova-field">
              <div class="nova-field-label">Seite</div>
              <div class="nova-field-value" id="nel-page">—</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Images Tab -->
      <div class="nova-tab-pane" id="nova-pane-images">
        <div id="nova-images-tab">
          <p style="font-size:11px;color:#6b7280;margin:0 0 10px;">Bilder hochladen — werden automatisch in WebP konvertiert (4 Größen).</p>
          <div id="nova-upload-zone" role="button" tabindex="0" aria-label="Bild hochladen">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>Bild hier ablegen oder klicken</div>
            <div style="font-size:10px;margin-top:4px;color:#374151;">JPEG, PNG, WebP, GIF — max. 10 MB</div>
          </div>
          <input type="file" id="nova-upload-input" accept="image/jpeg,image/png,image/webp,image/gif" />
          <div id="nova-upload-result"></div>
        </div>
      </div>
    `,document.body.appendChild(t)}_bindEvents(){document.addEventListener("click",a=>{if(!this.editMode)return;const o=a.target.closest("[data-nova-id]");o&&(o.closest("#nova-panel")||o.closest("#nova-toolbar")||(a.preventDefault(),a.stopPropagation(),this._selectElement(o)))},!0);const e=document.getElementById("nova-panel-header"),t=document.getElementById("nova-collapse"),n=()=>{const o=document.getElementById("nova-panel").classList.toggle("nova-collapsed");t.textContent=o?"▲":"▼"};e.addEventListener("click",n),e.addEventListener("keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),n())}),document.querySelectorAll("#nova-tabs button").forEach(a=>{a.addEventListener("click",()=>{document.querySelectorAll("#nova-tabs button").forEach(l=>{l.classList.remove("nova-tab-active"),l.setAttribute("aria-selected","false")}),document.querySelectorAll(".nova-tab-pane").forEach(l=>l.classList.remove("nova-pane-active")),a.classList.add("nova-tab-active"),a.setAttribute("aria-selected","true");const o=document.getElementById("nova-pane-"+a.dataset.tab);o&&o.classList.add("nova-pane-active")})}),document.getElementById("nova-send").addEventListener("click",()=>this._sendMessage()),document.getElementById("nova-input").addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),this._sendMessage())}),document.getElementById("nova-reload").addEventListener("click",()=>location.reload()),document.getElementById("nova-logout").addEventListener("click",async()=>{await fetch("/nova/auth.php",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"action=logout",credentials:"same-origin"}).catch(()=>{}),window.location.href="/nova/login.html"}),document.getElementById("nova-edit-toggle").addEventListener("click",a=>{this.editMode=!this.editMode,document.body.classList.toggle("nova-active",this.editMode),a.currentTarget.classList.toggle("nova-active",this.editMode),a.currentTarget.textContent=this.editMode?"Bearbeiten":"Vorschau"}),document.getElementById("nova-page-select").addEventListener("change",a=>{const o=a.target.value,l=o==="index.html"?"/":"/"+o.replace("/index.html","/");window.location.href=l+"?nova=1"}),document.querySelectorAll("#nova-page-select option").forEach(a=>{(this.currentPage===a.value||this.currentPage.startsWith(a.value.replace("index.html","")))&&(a.selected=!0)});const d=document.getElementById("nova-upload-zone"),r=document.getElementById("nova-upload-input");d.addEventListener("click",()=>r.click()),d.addEventListener("keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),r.click())}),d.addEventListener("dragover",a=>{a.preventDefault(),d.classList.add("nova-drag-over")}),d.addEventListener("dragleave",()=>d.classList.remove("nova-drag-over")),d.addEventListener("drop",a=>{var l;a.preventDefault(),d.classList.remove("nova-drag-over");const o=(l=a.dataTransfer)==null?void 0:l.files;o!=null&&o.length&&this._uploadImage(o[0])}),r.addEventListener("change",()=>{var a;(a=r.files)!=null&&a.length&&(this._uploadImage(r.files[0]),r.value="")})}_selectElement(e){var a,o;this.selectedElement&&this.selectedElement.classList.remove("nova-selected"),e.classList.add("nova-selected"),this.selectedElement=e;const t=e.getAttribute("data-nova-id")||"",n=e.tagName.toLowerCase(),i=((a=e.textContent)==null?void 0:a.trim().slice(0,300))||e.getAttribute("src")||e.getAttribute("href")||"";this.selectedContext={novaId:t,page:this.currentPage,currentContent:i,elementType:n},document.getElementById("nova-panel").classList.remove("nova-collapsed"),document.getElementById("nova-collapse").textContent="▼",document.querySelectorAll("#nova-tabs button").forEach(l=>{l.classList.remove("nova-tab-active"),l.setAttribute("aria-selected","false")}),document.querySelectorAll(".nova-tab-pane").forEach(l=>l.classList.remove("nova-pane-active"));const d=document.querySelector('#nova-tabs button[data-tab="chat"]');d&&(d.classList.add("nova-tab-active"),d.setAttribute("aria-selected","true"));const r=document.getElementById("nova-pane-chat");r&&r.classList.add("nova-pane-active"),document.getElementById("nova-element-placeholder").style.display="none",document.getElementById("nova-element-info").style.display="block",document.getElementById("nel-id").textContent=t,document.getElementById("nel-tag").textContent=n,document.getElementById("nel-content").textContent=i,document.getElementById("nel-page").textContent=this.currentPage,this._addMessage("system",`Element ausgewählt: [${t}] — <${n}>`),this._addMessage("nova",`Ich sehe das Element **${t}** (${n}).

Aktueller Inhalt: "${i.slice(0,120)}${i.length>120?"…":""}"

Was soll ich ändern?`),(o=document.getElementById("nova-input"))==null||o.focus()}_addMessage(e,t){const n=document.getElementById("nova-chat");if(!n)return;const i=document.createElement("div"),d=e==="user"?"nova-user":e==="system"?"nova-system":e==="error"?"nova-error":"nova-ai";i.className=`nova-msg ${d}`;let r=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/```([\s\S]*?)```/g,"<pre>$1</pre>").replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>");return i.innerHTML=r,n.appendChild(i),n.scrollTop=n.scrollHeight,i}_addTyping(){const e=document.getElementById("nova-chat"),t=document.createElement("div");return t.className="nova-msg nova-ai nova-typing",t.innerHTML="<span></span><span></span><span></span>",e.appendChild(t),e.scrollTop=e.scrollHeight,t}async _sendMessage(){var d;const e=document.getElementById("nova-input"),t=document.getElementById("nova-send"),n=e.value.trim();if(!n)return;if(e.value="",e.style.height="",t.disabled=!0,this._addMessage("user",n),this.pendingApply){const r=n.toLowerCase();if(r.startsWith("ja")||r==="yes"||r==="j"){t.disabled=!1,await this._applyChange(this.pendingApply),this.pendingApply=null;return}if(r.startsWith("nein")||r==="no"||r==="n"){t.disabled=!1,this.pendingApply=null,this._addMessage("nova","Verstanden, die Änderung wurde nicht übernommen. Was soll ich stattdessen tun?");return}}const i=this._addTyping();try{const r=await fetch("/nova/chat.php",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({message:n,context:this.selectedContext||{}})});if(i.remove(),!r.ok){const o=await r.json().catch(()=>({}));this._addMessage("error","Fehler: "+(o.message||o.error||"HTTP "+r.status));return}const a=await r.json();this._addMessage("nova",a.message||"Keine Antwort erhalten."),a.applyData&&(this.pendingApply={...a.applyData,...this.selectedContext||{}},this._addMessage("system",'Tippen Sie "Ja" um die Änderung zu übernehmen, oder "Nein" um abzubrechen.'))}catch{i.remove(),this._addMessage("error","Verbindungsfehler. Ist das Nova-Backend erreichbar?")}finally{t.disabled=!1,(d=document.getElementById("nova-input"))==null||d.focus()}}async _applyChange(e){this._addMessage("system","Änderung wird gespeichert…");const t=document.getElementById("nova-send");t&&(t.disabled=!0);try{const i=await(await fetch("/nova/apply.php",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-Token":this.csrfToken||""},credentials:"same-origin",body:JSON.stringify(e)})).json();i.success?(this._addMessage("nova",`Änderung gespeichert! Vorschau: _"${i.preview||""}"_

Möchten Sie die Seite neu laden um die Änderung zu sehen? Tippen Sie "reload".`),this.pendingApply=null,this._bindOneTimeReloadConfirm()):this._addMessage("error","Fehler beim Speichern: "+(i.error||"Unbekannter Fehler"))}catch{this._addMessage("error","Verbindungsfehler beim Speichern der Änderung.")}finally{t&&(t.disabled=!1)}}_bindOneTimeReloadConfirm(){const e=document.getElementById("nova-input");if(!e)return;const t=n=>{if(n.key==="Enter"){const i=e.value.trim().toLowerCase();(i==="reload"||i==="ja"||i==="yes")&&(e.removeEventListener("keydown",t),location.reload())}};e.addEventListener("keydown",t)}async _uploadImage(e){const t=document.getElementById("nova-upload-result");if(!t)return;t.innerHTML='<div style="color:#06b6d4;font-size:11px;padding:8px 0;">Bild wird hochgeladen und verarbeitet…</div>';const n=new FormData;n.append("image",e);try{const d=await(await fetch("/nova/image.php",{method:"POST",headers:{"X-CSRF-Token":this.csrfToken||""},credentials:"same-origin",body:n})).json();if(d.success){const r=Object.entries(d.urls).map(([a,o])=>`
          <div class="nova-image-size-row">
            <span>${a}w</span>
            <a href="${o}" target="_blank" rel="noopener">${o.split("/").pop()}</a>
            <button class="nova-copy-btn" onclick="navigator.clipboard.writeText('${o}');this.textContent='Kopiert!';setTimeout(()=>this.textContent='Kopieren',1500)">Kopieren</button>
          </div>
        `).join("");t.innerHTML=`
          <div style="color:#4ade80;font-size:11px;margin-bottom:8px;">Bild erfolgreich verarbeitet!</div>
          ${r}
        `}else t.innerHTML=`<div style="color:#fca5a5;font-size:11px;padding:8px 0;">Fehler: ${d.error||"Upload fehlgeschlagen"}</div>`}catch{t.innerHTML='<div style="color:#fca5a5;font-size:11px;padding:8px 0;">Verbindungsfehler beim Upload.</div>'}}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",v):v();function v(){const s=new w;s.init().catch(console.warn),window.nova=s}
