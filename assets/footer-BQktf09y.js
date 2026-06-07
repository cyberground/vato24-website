(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function d(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=d(e);fetch(e.href,t)}})();function g(){const h=[{label:"Startseite",href:"/"},{label:"Leistungen",href:"/leistungen/"},{label:"Marken & Projekte",href:"/marken/"},{label:"Prozess",href:"/prozess/"},{label:"Kontakt",href:"/kontakt/"}],o=window.location.pathname.replace(/\/+$/,"")||"/";function d(r){const l=r.replace(/\/+$/,"")||"/";return l==="/"?o==="/":o===l||o.startsWith(l)}const n=h.map(({label:r,href:l})=>{const p=d(l);return`
        <a
          href="${l}"
          class="nav-link text-sm font-medium transition-colors duration-200
                 ${p?"text-primary":"text-slate-300 hover:text-white"}"
          ${p?'aria-current="page"':""}
        >
          ${r}
          ${p?'<span class="nav-active-dot"></span>':""}
        </a>`}).join(""),e=h.map(({label:r,href:l})=>{const p=d(l);return`
        <a
          href="${l}"
          class="mobile-nav-link block py-3 px-4 text-base font-medium rounded-lg transition-all duration-200
                 ${p?"text-primary bg-cyan-500/10 border border-cyan-500/20":"text-slate-300 hover:text-white hover:bg-white/5"}"
          ${p?'aria-current="page"':""}
        >
          ${r}
        </a>`}).join(""),t=`
<header id="site-header" role="banner">
  <!-- Inline styles for header (critical path) -->
  <style>
    #site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      border-bottom: 1px solid transparent;
    }
    #site-header.scrolled {
      background: rgba(8, 9, 15, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom-color: rgba(255, 255, 255, 0.07);
      box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);
    }
    .nav-link {
      position: relative;
      padding-bottom: 4px;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #06b6d4, #8b5cf6);
      border-radius: 1px;
      transition: width 0.25s ease;
    }
    .nav-link:hover::after,
    .nav-link[aria-current="page"]::after {
      width: 100%;
    }
    .nav-active-dot {
      display: none;
    }
    /* Mobile menu */
    #mobile-menu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s ease, opacity 0.3s ease;
      opacity: 0;
    }
    #mobile-menu.open {
      max-height: 500px;
      opacity: 1;
    }
    /* Hamburger */
    .hamburger-line {
      display: block;
      width: 22px;
      height: 2px;
      background: #e2e8f0;
      border-radius: 1px;
      transition: transform 0.3s ease, opacity 0.3s ease;
      transform-origin: center;
    }
    #hamburger-btn.active .hamburger-line:nth-child(1) {
      transform: translateY(6px) rotate(45deg);
    }
    #hamburger-btn.active .hamburger-line:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }
    #hamburger-btn.active .hamburger-line:nth-child(3) {
      transform: translateY(-6px) rotate(-45deg);
    }
  </style>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-[72px]">

      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 group" aria-label="VaTo24 Startseite">
        <div class="relative w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center
                    bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg
                    group-hover:shadow-cyan-500/30 transition-shadow duration-300">
          <span class="text-white font-bold text-base leading-none select-none">V</span>
        </div>
        <span class="text-white font-bold text-xl tracking-tight">
          VaTo<span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">24</span>
        </span>
      </a>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Hauptnavigation">
        ${n}
      </nav>

      <!-- CTA + Hamburger -->
      <div class="flex items-center gap-3">
        <a
          href="#termin"
          class="hidden sm:inline-flex btn-primary text-sm py-2.5 px-5"
          aria-label="Termin buchen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Termin buchen
        </a>

        <!-- Hamburger (mobile) -->
        <button
          id="hamburger-btn"
          class="md:hidden flex flex-col gap-[5px] p-2 rounded-md hover:bg-white/5
                 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
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
  </div>

  <!-- Mobile Menu -->
  <div
    id="mobile-menu"
    class="md:hidden border-t border-white/5"
    aria-hidden="true"
  >
    <div class="max-w-7xl mx-auto px-4 py-4 space-y-1
                bg-[#08090f]/95 backdrop-blur-xl">
      ${e}
      <div class="pt-3 border-t border-white/10">
        <a
          href="#termin"
          class="btn-primary w-full justify-center text-sm py-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Termin buchen
        </a>
      </div>
    </div>
  </div>
</header>
<!-- Spacer so page content doesn't hide under fixed header -->
<div style="height:72px;"></div>
`;document.body.insertAdjacentHTML("afterbegin",t);const i=document.getElementById("site-header");function c(){window.scrollY>20?i.classList.add("scrolled"):i.classList.remove("scrolled")}window.addEventListener("scroll",c,{passive:!0}),c();const a=document.getElementById("hamburger-btn"),s=document.getElementById("mobile-menu");a&&s&&(a.addEventListener("click",()=>{const r=s.classList.contains("open");s.classList.toggle("open",!r),s.setAttribute("aria-hidden",String(r)),a.setAttribute("aria-expanded",String(!r)),a.setAttribute("aria-label",r?"Menü öffnen":"Menü schließen"),a.classList.toggle("active",!r)}),s.querySelectorAll("a").forEach(r=>{r.addEventListener("click",()=>{s.classList.remove("open"),s.setAttribute("aria-hidden","true"),a.setAttribute("aria-expanded","false"),a.setAttribute("aria-label","Menü öffnen"),a.classList.remove("active")})}),document.addEventListener("click",r=>{s.classList.contains("open")&&!i.contains(r.target)&&(s.classList.remove("open"),s.setAttribute("aria-hidden","true"),a.setAttribute("aria-expanded","false"),a.setAttribute("aria-label","Menü öffnen"),a.classList.remove("active"))}))}function b(){const h=new Date().getFullYear(),o=[{label:"Startseite",href:"/"},{label:"Leistungen",href:"/leistungen/"},{label:"Marken & Projekte",href:"/marken/"},{label:"Prozess",href:"/prozess/"},{label:"Kontakt",href:"/kontakt/"}],d=[{label:"Impressum",href:"/impressum/"},{label:"Datenschutz",href:"/datenschutz/"},{label:"AGB",href:"/agb/"}],n={linkedin:`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>`,instagram:`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>`,facebook:`<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>`,phone:`<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>`,mail:`<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>`,location:`<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>`,external:`<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>`},e=o.map(({label:c,href:a})=>`
    <li>
      <a href="${a}"
         class="text-slate-400 hover:text-white text-sm transition-colors duration-200
                hover:translate-x-1 inline-block transition-transform">
        ${c}
      </a>
    </li>`).join(""),t=d.map(({label:c,href:a})=>`
    <a href="${a}" class="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200">
      ${c}
    </a>`).join(""),i=`
<footer id="site-footer" role="contentinfo">
  <style>
    #site-footer {
      background: #08090f;
      border-top: 1px solid transparent;
      border-image: linear-gradient(90deg, transparent, rgba(6,182,212,0.3), rgba(139,92,246,0.3), transparent) 1;
      margin-top: auto;
    }
    .footer-social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      color: #94a3b8;
      transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
    }
    .footer-social-link:hover {
      background: rgba(6,182,212,0.12);
      border-color: rgba(6,182,212,0.3);
      color: #06b6d4;
      transform: translateY(-2px);
    }
    .footer-brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px;
      color: #64748b;
      font-size: 0.8125rem;
      text-decoration: none;
      transition: background 0.2s, border-color 0.2s, color 0.2s;
    }
    .footer-brand-badge:hover {
      background: rgba(6,182,212,0.07);
      border-color: rgba(6,182,212,0.2);
      color: #94a3b8;
    }
    .footer-contact-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      color: #94a3b8;
      font-size: 0.875rem;
      line-height: 1.5;
    }
    .footer-contact-item a {
      color: inherit;
      transition: color 0.2s;
    }
    .footer-contact-item a:hover {
      color: #e2e8f0;
    }
  </style>

  <!-- Gradient top accent line is handled by border-image above -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">

    <!-- Main grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

      <!-- Column 1: Logo & About -->
      <div class="lg:col-span-1">
        <a href="/" class="flex items-center gap-2 mb-5" aria-label="VaTo24 Startseite">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center
                      bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg">
            <span class="text-white font-bold text-base leading-none select-none">V</span>
          </div>
          <span class="text-white font-bold text-xl tracking-tight">
            VaTo<span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">24</span>
          </span>
        </a>

        <p class="text-slate-400 text-sm leading-relaxed mb-4">
          Deine Marketingagentur aus Unna, NRW. Wir vereinen kreatives Design,
          strategisches Marketing und modernste KI-Technologie – für deinen digitalen Erfolg.
        </p>
        <p class="text-slate-600 text-xs">
          Zechenstr. 80 &bull; 59425 Unna &bull; NRW
        </p>

        <!-- Social Icons -->
        <div class="flex items-center gap-3 mt-6">
          <a href="#" class="footer-social-link" aria-label="LinkedIn" rel="noopener noreferrer" target="_blank">
            ${n.linkedin}
          </a>
          <a href="#" class="footer-social-link" aria-label="Instagram" rel="noopener noreferrer" target="_blank">
            ${n.instagram}
          </a>
          <a href="#" class="footer-social-link" aria-label="Facebook" rel="noopener noreferrer" target="_blank">
            ${n.facebook}
          </a>
        </div>
      </div>

      <!-- Column 2: Navigation -->
      <div>
        <h3 class="text-white text-sm font-semibold uppercase tracking-widest mb-5">
          Navigation
        </h3>
        <ul class="space-y-3">
          ${e}
        </ul>
      </div>

      <!-- Column 3: Kontakt -->
      <div>
        <h3 class="text-white text-sm font-semibold uppercase tracking-widest mb-5">
          Kontakt
        </h3>
        <div class="space-y-4">
          <div class="footer-contact-item">
            ${n.phone}
            <a href="tel:+492303979729">02303 / 97 97 329</a>
          </div>
          <div class="footer-contact-item">
            ${n.mail}
            <a href="mailto:info@vato24.de">info@vato24.de</a>
          </div>
          <div class="footer-contact-item">
            ${n.location}
            <address style="font-style:normal;">
              Zechenstr. 80<br>
              59425 Unna<br>
              Nordrhein-Westfalen
            </address>
          </div>
        </div>

        <div class="mt-6">
          <a href="/kontakt/" class="btn-secondary text-sm py-2.5 px-5 inline-flex">
            Kontakt aufnehmen
          </a>
        </div>
      </div>

      <!-- Column 4: Unsere Marken -->
      <div>
        <h3 class="text-white text-sm font-semibold uppercase tracking-widest mb-5">
          Unsere Marken
        </h3>
        <p class="text-slate-500 text-xs mb-4 leading-relaxed">
          VaTo24 betreibt spezialisierte Tochtermarken für verschiedene Nischen.
        </p>

        <div class="space-y-2">
          <a
            href="https://dynomic.ai"
            class="footer-brand-badge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="dynomic.ai – KI-Lösungen (öffnet in neuem Tab)"
          >
            <span class="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></span>
            <span class="font-medium text-slate-300">dynomic.ai</span>
            <span class="ml-auto">– KI-Lösungen</span>
            ${n.external}
          </a>

          <a
            href="https://jga-revolution.de"
            class="footer-brand-badge"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="jga-revolution.de – JGA Planung (öffnet in neuem Tab)"
          >
            <span class="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0"></span>
            <span class="font-medium text-slate-300">jga-revolution.de</span>
            <span class="ml-auto">– JGA Planung</span>
            ${n.external}
          </a>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="mt-12 pt-8 border-t border-white/[0.06]">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">

        <!-- Copyright -->
        <p class="text-slate-600 text-sm text-center sm:text-left">
          &copy; ${h} VaTo24 – Marketingagentur |
          <span class="text-slate-500">Dennis Isermann</span>
        </p>

        <!-- Legal links -->
        <div class="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          ${t}
        </div>
      </div>
    </div>
  </div>
</footer>
`;document.body.insertAdjacentHTML("beforeend",i)}export{b as a,g as i};
