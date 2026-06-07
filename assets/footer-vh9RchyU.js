(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function d(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(t){if(t.ep)return;t.ep=!0;const r=d(t);fetch(t.href,r)}})();function y(){const g=[{label:"Leistungen",href:"/leistungen/"},{label:"Websites",href:"/websites/"},{label:"KI & Automatisierung",href:"/ki/"},{label:"Projekte",href:"/projekte/"},{label:"Blog",href:"/blog/"},{label:"Über uns",href:"/ueber-uns/"}],a=window.location.pathname.replace(/\/+$/,"")||"/";function d(e){const i=e.replace(/\/+$/,"")||"/";return i==="/"?a==="/":a===i||a.startsWith(i)}const c=g.map(({label:e,href:i})=>{const f=d(i);return`
        <a
          href="${i}"
          class="nav-link${f?" nav-link--active":""}"
          ${f?'aria-current="page"':""}
        >${e}</a>`}).join(""),t=g.map(({label:e,href:i})=>{const f=d(i);return`
        <a
          href="${i}"
          class="mobile-nav-link${f?" mobile-nav-link--active":""}"
          ${f?'aria-current="page"':""}
        >${e}</a>`}).join(""),r=`
<header id="site-header" role="banner">
  <style>
    /* ── Base ──────────────────────────────────────────── */
    #site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--header-bg, rgba(15, 15, 15, 0.95));
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--header-border, rgba(249, 115, 22, 0.2));
      transition: box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
    }
    #site-header.scrolled {
      box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15);
      border-bottom-color: rgba(249, 115, 22, 0.35);
    }
    /* Light mode overrides */
    [data-theme="light"] #site-header.scrolled {
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    }
    [data-theme="light"] .logo-wordmark { color: #111111; }
    [data-theme="light"] .nav-link { color: #444444; }
    [data-theme="light"] .nav-link:hover { color: #ea6c00; background: rgba(234,108,0,0.07); }
    [data-theme="light"] .nav-link--active { color: #ea6c00; }
    [data-theme="light"] .hamburger-line { background: #333333; }
    [data-theme="light"] .mobile-menu-inner { background: rgba(250,250,248,0.99); }
    [data-theme="light"] .mobile-nav-link { color: #333333; }
    [data-theme="light"] .mobile-nav-link:hover { color: #ea6c00; }

    /* ── Logo ──────────────────────────────────────────── */
    .header-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      flex-shrink: 0;
    }
    .logo-mark {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: #f97316;
      border-radius: 8px;
      box-shadow: 0 0 16px rgba(249, 115, 22, 0.4);
      transition: box-shadow 0.3s ease, transform 0.2s ease;
      flex-shrink: 0;
    }
    .header-logo:hover .logo-mark {
      box-shadow: 0 0 28px rgba(249, 115, 22, 0.65);
      transform: scale(1.06);
    }
    .logo-mark-letter {
      color: #ffffff;
      font-weight: 800;
      font-size: 18px;
      line-height: 1;
      font-family: system-ui, -apple-system, sans-serif;
      letter-spacing: -0.5px;
      user-select: none;
    }
    .logo-wordmark {
      font-weight: 700;
      font-size: 20px;
      letter-spacing: -0.4px;
      color: #ffffff;
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1;
    }
    .logo-wordmark-accent {
      color: #f97316;
    }

    /* ── Desktop nav ───────────────────────────────────── */
    .header-nav {
      display: none;
      align-items: center;
      gap: 4px;
    }
    @media (min-width: 768px) {
      .header-nav { display: flex; }
    }
    .nav-link {
      position: relative;
      padding: 6px 12px;
      font-size: 14px;
      font-weight: 500;
      color: #d1d5db;
      text-decoration: none;
      border-radius: 6px;
      transition: color 0.2s ease, background 0.2s ease;
      white-space: nowrap;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 12px;
      right: 12px;
      height: 2px;
      background: #f97316;
      border-radius: 1px;
      transform: scaleX(0);
      transition: transform 0.25s ease;
      transform-origin: left center;
    }
    .nav-link:hover {
      color: #f97316;
      background: rgba(249, 115, 22, 0.07);
    }
    .nav-link:hover::after {
      transform: scaleX(1);
    }
    .nav-link--active {
      color: #f97316;
    }
    .nav-link--active::after {
      transform: scaleX(1);
    }

    /* ── CTA button ────────────────────────────────────── */
    .header-cta {
      display: none;
      align-items: center;
      gap: 6px;
      padding: 9px 18px;
      background: #f97316;
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      border-radius: 8px;
      white-space: nowrap;
      box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
      transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
    }
    @media (min-width: 640px) {
      .header-cta { display: inline-flex; }
    }
    .header-cta:hover {
      background: #ea6c0a;
      box-shadow: 0 0 32px rgba(249, 115, 22, 0.55);
      transform: translateY(-1px);
    }
    .header-cta:active {
      transform: translateY(0);
    }

    /* ── Theme Toggle ──────────────────────────────────── */
    #theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      cursor: pointer;
      color: #d1d5db;
      transition: background 0.2s ease, border-color 0.2s ease,
                  color 0.2s ease, transform 0.2s ease;
      flex-shrink: 0;
    }
    #theme-toggle:hover {
      background: rgba(249, 115, 22, 0.1);
      border-color: rgba(249, 115, 22, 0.4);
      color: #f97316;
      transform: rotate(20deg);
    }
    #theme-toggle:focus-visible {
      outline: 2px solid rgba(249, 115, 22, 0.6);
      outline-offset: 2px;
    }
    /* Light mode: adjust toggle appearance */
    [data-theme="light"] #theme-toggle {
      border-color: rgba(0, 0, 0, 0.12);
      color: #555555;
    }
    [data-theme="light"] #theme-toggle:hover {
      background: rgba(234, 108, 0, 0.08);
      border-color: rgba(234, 108, 0, 0.35);
      color: #ea6c00;
    }

    /* ── Hamburger ─────────────────────────────────────── */
    #hamburger-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      width: 40px;
      height: 40px;
      padding: 8px;
      background: transparent;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    @media (min-width: 768px) {
      #hamburger-btn { display: none; }
    }
    #hamburger-btn:hover {
      background: rgba(249, 115, 22, 0.1);
    }
    #hamburger-btn:focus-visible {
      outline: 2px solid rgba(249, 115, 22, 0.6);
      outline-offset: 2px;
    }
    .hamburger-line {
      display: block;
      width: 22px;
      height: 2px;
      background: #e5e7eb;
      border-radius: 2px;
      transition: transform 0.3s ease, opacity 0.3s ease, background 0.2s ease;
      transform-origin: center;
    }
    #hamburger-btn.active .hamburger-line {
      background: #f97316;
    }
    #hamburger-btn.active .hamburger-line:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    #hamburger-btn.active .hamburger-line:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }
    #hamburger-btn.active .hamburger-line:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    /* ── Mobile menu ───────────────────────────────────── */
    #mobile-menu {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1),
                  opacity 0.28s ease;
      border-top: 1px solid transparent;
    }
    #mobile-menu.open {
      max-height: 520px;
      opacity: 1;
      border-top-color: rgba(249, 115, 22, 0.15);
    }
    .mobile-menu-inner {
      padding: 12px 16px 20px;
      background: rgba(12, 12, 12, 0.98);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .mobile-nav-link {
      display: block;
      padding: 12px 16px;
      font-size: 15px;
      font-weight: 500;
      color: #d1d5db;
      text-decoration: none;
      border-radius: 8px;
      border: 1px solid transparent;
      transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    }
    .mobile-nav-link:hover {
      color: #f97316;
      background: rgba(249, 115, 22, 0.08);
      border-color: rgba(249, 115, 22, 0.15);
    }
    .mobile-nav-link--active {
      color: #f97316;
      background: rgba(249, 115, 22, 0.1);
      border-color: rgba(249, 115, 22, 0.25);
    }
    .mobile-cta-wrap {
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .mobile-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 13px 20px;
      background: #f97316;
      color: #ffffff;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      border-radius: 8px;
      box-shadow: 0 0 24px rgba(249, 115, 22, 0.35);
      transition: background 0.2s ease, box-shadow 0.2s ease;
    }
    .mobile-cta:hover {
      background: #ea6c0a;
      box-shadow: 0 0 36px rgba(249, 115, 22, 0.55);
    }
  </style>

  <div style="max-width:1280px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:72px;gap:16px;">

    <!-- Logo -->
    <a href="/" class="header-logo" aria-label="VaTo24 – zurück zur Startseite">
      <div class="logo-mark" aria-hidden="true">
        <span class="logo-mark-letter">V</span>
      </div>
      <span class="logo-wordmark">VaTo<span class="logo-wordmark-accent">24</span></span>
    </a>

    <!-- Desktop Navigation -->
    <nav class="header-nav" aria-label="Hauptnavigation">
      ${c}
    </nav>

    <!-- Right side: Theme Toggle + CTA + hamburger -->
    <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">

      <!-- Light/Dark Toggle -->
      <button id="theme-toggle" aria-label="Theme wechseln" title="Light/Dark Mode">
        <!-- Sun icon (shown in dark mode) -->
        <svg id="icon-sun" width="17" height="17" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <!-- Moon icon (shown in light mode, hidden by default) -->
        <svg id="icon-moon" width="17" height="17" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             style="display:none;">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </button>

      <a href="/kontakt/" class="header-cta" aria-label="Strategiegespräch vereinbaren">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
             stroke-linejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07
                   19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18
                   2 2 0 014.11 2h3a2 2 0 012 1.72
                   12.84 12.84 0 00.7 2.81
                   2 2 0 01-.45 2.11L8.09 9.91
                   a16 16 0 006 6l1.27-1.27
                   a2 2 0 012.11-.45
                   12.84 12.84 0 002.81.7
                   A2 2 0 0122 16.92z"/>
        </svg>
        Strategiegespräch
      </a>

      <button
        id="hamburger-btn"
        aria-label="Menü öffnen"
        aria-expanded="false"
        aria-controls="mobile-menu"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>
  </div>

  <!-- Mobile Menu -->
  <div id="mobile-menu" role="navigation" aria-label="Mobile Navigation" aria-hidden="true">
    <div class="mobile-menu-inner">
      ${t}
      <div class="mobile-cta-wrap">
        <a href="/kontakt/" class="mobile-cta">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
               stroke-linejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07
                     19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18
                     2 2 0 014.11 2h3a2 2 0 012 1.72
                     12.84 12.84 0 00.7 2.81
                     2 2 0 01-.45 2.11L8.09 9.91
                     a16 16 0 006 6l1.27-1.27
                     a2 2 0 012.11-.45
                     12.84 12.84 0 002.81.7
                     A2 2 0 0122 16.92z"/>
          </svg>
          Strategiegespräch vereinbaren
        </a>
      </div>
    </div>
  </div>
</header>
<!-- Spacer: keeps content from hiding under fixed header -->
<div style="height:72px;" aria-hidden="true"></div>
`;document.body.insertAdjacentHTML("afterbegin",r);const s=document.getElementById("site-header"),o=document.getElementById("hamburger-btn"),n=document.getElementById("mobile-menu");function m(){s.classList.toggle("scrolled",window.scrollY>20)}window.addEventListener("scroll",m,{passive:!0}),m();function l(){n.classList.remove("open"),n.setAttribute("aria-hidden","true"),o.setAttribute("aria-expanded","false"),o.setAttribute("aria-label","Menü öffnen"),o.classList.remove("active")}function p(){n.classList.add("open"),n.setAttribute("aria-hidden","false"),o.setAttribute("aria-expanded","true"),o.setAttribute("aria-label","Menü schließen"),o.classList.add("active")}o&&n&&(o.addEventListener("click",()=>{n.classList.contains("open")?l():p()}),n.querySelectorAll("a").forEach(e=>{e.addEventListener("click",l)}),document.addEventListener("click",e=>{n.classList.contains("open")&&!s.contains(e.target)&&l()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&n.classList.contains("open")&&(l(),o.focus())}));const h=document.getElementById("theme-toggle"),u=document.getElementById("icon-sun"),v=document.getElementById("icon-moon");function b(e){document.documentElement.setAttribute("data-theme",e),localStorage.setItem("vato24-theme",e),e==="light"?(u.style.display="none",v.style.display="block",h.setAttribute("title","Dark Mode aktivieren"),h.setAttribute("aria-label","Dark Mode aktivieren")):(u.style.display="block",v.style.display="none",h.setAttribute("title","Light Mode aktivieren"),h.setAttribute("aria-label","Light Mode aktivieren"))}const x=localStorage.getItem("vato24-theme"),k=window.matchMedia("(prefers-color-scheme: dark)").matches;b(x||(k?"dark":"light")),h.addEventListener("click",()=>{const e=document.documentElement.getAttribute("data-theme")||"dark";b(e==="dark"?"light":"dark")}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",e=>{localStorage.getItem("vato24-theme")||b(e.matches?"dark":"light")})}function L(){const g=new Date().getFullYear(),a={linkedin:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>`,instagram:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>`,phone:`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>`,whatsapp:`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>`,location:`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>`,external:`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>`,arrow:`<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>`},d=[{label:"Websites & Sichtbarkeit",href:"/websites/"},{label:"SEO & Google Business",href:"/seo/"},{label:"KI & Automatisierung",href:"/ki/"},{label:"CMS-System",href:"/cms-system/"},{label:"Projekte anfragen",href:"/kontakt/"}],c=[{label:"Über VaTo24",href:"/ueber-uns/"},{label:"Blog & Ratgeber",href:"/blog/"},{label:"Projekte",href:"/projekte/"},{label:"Kontakt",href:"/kontakt/"},{label:"Strategiegespräch buchen",href:"/kontakt/"}],t=[{label:"Impressum",href:"/impressum/"},{label:"Datenschutz",href:"/datenschutz/"},{label:"AGB",href:"/agb/"}],r=({label:l,href:p})=>`<li>
      <a href="${p}" class="vf-nav-link">
        <span class="vf-nav-arrow">${a.arrow}</span>
        ${l}
      </a>
    </li>`,s=d.map(r).join(""),o=c.map(r).join(""),n=t.map(({label:l,href:p})=>`<a href="${p}" class="vf-legal-link">${l}</a>`).join('<span class="vf-legal-sep" aria-hidden="true">|</span>'),m=`
<footer id="site-footer" role="contentinfo">
  <style>
    /* ── Root vars ── */
    #site-footer {
      --fo:  rgba(249,115,22,0.3);   /* orange 30% */
      --fo2: rgba(249,115,22,0.08);  /* orange glow tint */
      --txt:     #94a3b8;            /* muted text */
      --txt-hi:  #e2e8f0;            /* hovered text */
      --border:  rgba(255,255,255,0.06);
    }

    /* ── Shell ── */
    #site-footer {
      background: #111111;
      border-top: 1px solid var(--fo);
      /* subtle orange glow along the top edge */
      box-shadow: 0 -8px 40px -8px var(--fo2);
      margin-top: auto;
      font-family: inherit;
    }

    /* ── Inner wrapper ── */
    .vf-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 4rem 1.5rem 2.5rem;
    }

    /* ── Main grid ── */
    .vf-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
    @media (min-width: 640px) {
      .vf-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 1024px) {
      .vf-grid { grid-template-columns: repeat(4, 1fr); gap: 3rem; }
    }

    /* ── Column headings ── */
    .vf-col-title {
      color: #ffffff;
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
    }

    /* ── Brand column ── */
    .vf-logo {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      margin-bottom: 1rem;
    }
    .vf-logo-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 16px rgba(249,115,22,0.35);
    }
    .vf-logo-icon span {
      color: #fff;
      font-weight: 800;
      font-size: 1rem;
      line-height: 1;
    }
    .vf-logo-name {
      color: #ffffff;
      font-weight: 700;
      font-size: 1.25rem;
      letter-spacing: -0.01em;
    }
    .vf-logo-name em {
      font-style: normal;
      color: #f97316;
    }
    .vf-tagline {
      color: var(--txt);
      font-size: 0.875rem;
      line-height: 1.6;
      margin-bottom: 0.5rem;
    }
    .vf-location {
      color: #4b5563;
      font-size: 0.78rem;
      margin-bottom: 1.5rem;
    }

    /* ── Social icons ── */
    .vf-socials {
      display: flex;
      gap: 0.6rem;
    }
    .vf-social-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      color: var(--txt);
      text-decoration: none;
      transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.18s;
    }
    .vf-social-btn:hover {
      background: rgba(249,115,22,0.12);
      border-color: rgba(249,115,22,0.35);
      color: #f97316;
      transform: translateY(-2px);
    }

    /* ── Nav lists ── */
    .vf-nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }
    .vf-nav-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--txt);
      font-size: 0.875rem;
      text-decoration: none;
      transition: color 0.2s, gap 0.18s;
    }
    .vf-nav-link:hover {
      color: #f97316;
      gap: 0.6rem;
    }
    .vf-nav-arrow {
      opacity: 0;
      color: #f97316;
      transition: opacity 0.18s;
      line-height: 0;
    }
    .vf-nav-link:hover .vf-nav-arrow {
      opacity: 1;
    }

    /* ── Contact column ── */
    .vf-contact-list {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }
    .vf-contact-item {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      color: var(--txt);
      font-size: 0.875rem;
      line-height: 1.5;
    }
    .vf-contact-icon {
      flex-shrink: 0;
      margin-top: 2px;
      color: #f97316;
      line-height: 0;
    }
    .vf-contact-item a {
      color: inherit;
      text-decoration: none;
      transition: color 0.2s;
    }
    .vf-contact-item a:hover {
      color: var(--txt-hi);
    }

    /* ── Brand badges ── */
    .vf-badges {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1.25rem;
    }
    .vf-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.75rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px;
      color: #64748b;
      font-size: 0.8rem;
      text-decoration: none;
      transition: background 0.2s, border-color 0.2s, color 0.2s;
    }
    .vf-badge:hover {
      background: rgba(249,115,22,0.07);
      border-color: rgba(249,115,22,0.2);
      color: var(--txt);
    }
    .vf-badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .vf-badge-name {
      font-weight: 600;
      color: #cbd5e1;
    }
    .vf-badge-desc {
      margin-left: auto;
      padding-left: 0.25rem;
    }
    .vf-badge-ext {
      flex-shrink: 0;
      line-height: 0;
      opacity: 0.5;
    }

    /* ── Bottom bar ── */
    .vf-bottom {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-align: center;
    }
    @media (min-width: 640px) {
      .vf-bottom {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
    }
    .vf-copy {
      color: #4b5563;
      font-size: 0.8125rem;
    }
    .vf-copy strong {
      color: #6b7280;
      font-weight: 500;
    }
    .vf-legal {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    .vf-legal-link {
      color: #4b5563;
      font-size: 0.8125rem;
      text-decoration: none;
      transition: color 0.2s;
    }
    .vf-legal-link:hover {
      color: #f97316;
    }
    .vf-legal-sep {
      color: #2d3748;
      font-size: 0.75rem;
    }
  </style>

  <div class="vf-inner">

    <!-- ── 4-column grid ── -->
    <div class="vf-grid">

      <!-- Column 1: Brand -->
      <div>
        <a href="/" class="vf-logo" aria-label="VaTo24 Startseite">
          <div class="vf-logo-icon"><span>V</span></div>
          <span class="vf-logo-name">VaTo<em>24</em></span>
        </a>

        <p class="vf-tagline">
          Digitaler Partner für Websites, KI &amp; Automatisierung
        </p>
        <p class="vf-location">Dennis Isermann &bull; Unna / NRW</p>

        <div class="vf-socials">
          <a href="https://www.linkedin.com/company/vato24"
             class="vf-social-btn"
             aria-label="VaTo24 auf LinkedIn"
             target="_blank"
             rel="noopener noreferrer">
            ${a.linkedin}
          </a>
          <a href="https://www.instagram.com/vato24.de"
             class="vf-social-btn"
             aria-label="VaTo24 auf Instagram"
             target="_blank"
             rel="noopener noreferrer">
            ${a.instagram}
          </a>
        </div>
      </div>

      <!-- Column 2: Leistungen -->
      <div>
        <h3 class="vf-col-title">Leistungen</h3>
        <ul class="vf-nav-list">
          ${s}
        </ul>
      </div>

      <!-- Column 3: Unternehmen -->
      <div>
        <h3 class="vf-col-title">Unternehmen</h3>
        <ul class="vf-nav-list">
          ${o}
        </ul>
      </div>

      <!-- Column 4: Kontakt -->
      <div>
        <h3 class="vf-col-title">Kontakt</h3>

        <div class="vf-contact-list">
          <div class="vf-contact-item">
            <span class="vf-contact-icon">${a.phone}</span>
            <a href="tel:+4923039797329">02303&thinsp;/&thinsp;97&nbsp;97&nbsp;329</a>
          </div>
          <div class="vf-contact-item">
            <span class="vf-contact-icon">${a.whatsapp}</span>
            <a href="https://wa.me/4917661620866"
               target="_blank"
               rel="noopener noreferrer">+49&nbsp;176&nbsp;616&nbsp;20866</a>
          </div>
          <div class="vf-contact-item">
            <span class="vf-contact-icon">${a.location}</span>
            <address style="font-style:normal;">
              Zechenstr. 80<br>59425 Unna
            </address>
          </div>
        </div>

        <div class="vf-badges">
          <a href="https://dynomic.ai"
             class="vf-badge"
             target="_blank"
             rel="noopener noreferrer"
             aria-label="dynomic.ai – KI-Lösungen (öffnet in neuem Tab)">
            <span class="vf-badge-dot" style="background:#f97316;"></span>
            <span class="vf-badge-name">dynomic.ai</span>
            <span class="vf-badge-desc">– KI-Lösungen</span>
            <span class="vf-badge-ext">${a.external}</span>
          </a>
          <a href="https://jga-revolution.de"
             class="vf-badge"
             target="_blank"
             rel="noopener noreferrer"
             aria-label="jga-revolution.de – JGA Planung (öffnet in neuem Tab)">
            <span class="vf-badge-dot" style="background:#fb923c;"></span>
            <span class="vf-badge-name">jga-revolution.de</span>
            <span class="vf-badge-desc">– JGA Planung</span>
            <span class="vf-badge-ext">${a.external}</span>
          </a>
        </div>
      </div>

    </div><!-- /vf-grid -->

    <!-- ── Bottom bar ── -->
    <div class="vf-bottom">
      <p class="vf-copy">
        &copy; ${g} VaTo24 – Marketingagentur |
        <strong>Dennis Isermann</strong>
      </p>
      <nav class="vf-legal" aria-label="Rechtliche Links">
        ${n}
      </nav>
    </div>

  </div><!-- /vf-inner -->
</footer>`;document.body.insertAdjacentHTML("beforeend",m)}export{L as a,y as i};
