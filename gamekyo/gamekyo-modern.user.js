// ==UserScript==
// @name         Gamekyo Modern
// @namespace    https://www.gamekyo.com/
// @version      1.7.0
// @description  Refonte moderne de Gamekyo : design épuré, mode sombre, responsive, images HD, lecture confortable.
// @match        https://www.gamekyo.com/*
// @match        http://www.gamekyo.com/*
// @match        https://gamekyo.com/*
// @run-at       document-start
// @grant        none
// @homepageURL  https://github.com/maximehuran/tampermonkey-scripts
// @updateURL    https://raw.githubusercontent.com/maximehuran/tampermonkey-scripts/main/gamekyo/gamekyo-modern.user.js
// @downloadURL  https://raw.githubusercontent.com/maximehuran/tampermonkey-scripts/main/gamekyo/gamekyo-modern.user.js
// ==/UserScript==

(function () {
  'use strict';

  const THEME_KEY = 'gk-modern-theme';
  const root = document.documentElement;

  /* ------------------------------------------------------------------ */
  /* Thème (appliqué immédiatement pour éviter le flash blanc)          */
  /* ------------------------------------------------------------------ */
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = () => localStorage.getItem(THEME_KEY);
  const isDark = () => (savedTheme() ? savedTheme() === 'dark' : prefersDark.matches);
  // Quand notre mode sombre est actif, on demande à Dark Reader de ne pas assombrir une seconde fois
  const darkReaderLock = document.createElement('meta');
  darkReaderLock.name = 'darkreader-lock';
  const applyTheme = () => {
    root.classList.toggle('gk-dark', isDark());
    root.style.colorScheme = isDark() ? 'dark' : 'light';
    if (isDark()) (document.head || root).appendChild(darkReaderLock);
    else darkReaderLock.remove();
  };
  root.classList.add('gk');
  applyTheme();
  prefersDark.addEventListener('change', () => { if (!savedTheme()) applyTheme(); });

  /* ------------------------------------------------------------------ */
  /* Réglages utilisateur (panneau ⚙︎ dans la barre du haut)            */
  /* ------------------------------------------------------------------ */
  const SETTINGS_KEY = 'gk-modern-settings';
  const NAV_KEYS = ['home', 'news', 'blog', 'video', 'review'];
  const DEFAULTS = { logo: 'classic', hideLeft: false, hideRight: false, hideSlider: false, listView: 'full', hiddenNav: [], textSize: 'm', customCss: '' };
  let settings;
  try { settings = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }; } catch { settings = { ...DEFAULTS }; }
  const saveSettings = () => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

  const customStyle = document.createElement('style');
  customStyle.id = 'gk-custom-css';
  const applySettings = () => {
    root.classList.toggle('gk-hide-left', settings.hideLeft);
    root.classList.toggle('gk-hide-right', settings.hideRight);
    root.classList.toggle('gk-hide-slider', settings.hideSlider);
    root.dataset.gkList = settings.listView;
    root.dataset.gkLogo = settings.logo;
    root.dataset.gkText = settings.textSize;
    NAV_KEYS.forEach((k) => root.classList.toggle(`gk-nav-hide-${k}`, settings.hiddenNav.includes(k)));
    customStyle.textContent = settings.customCss;
  };
  applySettings();

  /* ------------------------------------------------------------------ */
  /* Styles                                                             */
  /* ------------------------------------------------------------------ */
  const CSS = String.raw`
html.gk {
  --bg: #f2f4f7;
  --surface: #ffffff;
  --surface-2: #f6f8fa;
  --surface-3: #eef1f5;
  --border: #e3e7ed;
  --text: #1c2330;
  --text-soft: #3a4352;
  --muted: #6b7484;
  --accent: #2f80d1;
  --accent-soft: rgba(47, 128, 209, .12);
  --orange: #e8791e;
  --green: #3f9b16;
  --red: #d64545;
  --yellow: #d39b00;
  --shadow: 0 1px 2px rgba(16, 24, 40, .05), 0 4px 16px rgba(16, 24, 40, .06);
  --shadow-lg: 0 10px 30px rgba(16, 24, 40, .14);
  --radius: 14px;
  --radius-sm: 10px;
  --topbar-h: 62px;
  --font: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  scroll-padding-top: calc(var(--topbar-h) + 16px);
}
html.gk.gk-dark {
  --bg: #0d1117;
  --surface: #161b22;
  --surface-2: #1c232c;
  --surface-3: #232b36;
  --border: #2a323d;
  --text: #e7ebf0;
  --text-soft: #c5ccd6;
  --muted: #8d97a5;
  --accent: #5aaef2;
  --accent-soft: rgba(90, 174, 242, .14);
  --orange: #f59a45;
  --green: #8ad640;
  --red: #f06a6a;
  --yellow: #f2c14e;
  --shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 4px 16px rgba(0, 0, 0, .25);
  --shadow-lg: 0 10px 30px rgba(0, 0, 0, .5);
}

/* ---------- Base ---------- */
html.gk body {
  background-color: var(--bg) !important;
  color: var(--text);
  font-family: var(--font);
  font-size: 15px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  padding-top: var(--topbar-h);
}
html.gk body > br { display: none; }
html.gk a:link, html.gk a:visited { color: var(--text); text-decoration: none; }
html.gk a:hover, html.gk a:focus { color: var(--accent); text-decoration: none; }
html.gk img { max-width: 100%; }
html.gk ::selection { background: var(--accent); color: #fff; }
html.gk .member { color: var(--orange) !important; text-transform: none; font-family: inherit; }
html.gk .group { color: var(--green) !important; text-transform: none; font-family: inherit; }
html.gk .blue-link, html.gk .date, html.gk .big-title a { color: var(--accent) !important; font-family: inherit; }
html.gk .date { color: var(--muted) !important; }
html.gk .white-background, html.gk .gray-background, html.gk .yellow-background,
html.gk .green-background, html.gk .brown-background, html.gk .transparent-background { background-color: transparent !important; }
html.gk .yellow-border, html.gk .white-border { border-color: var(--border) !important; }
html.gk .bold { font-weight: 600; }

/* ---------- Topbar ---------- */
html.gk #header, html.gk body > #main-menu-lign, html.gk body > #sub-menu-lign { display: none !important; }
#gk-topbar {
  position: fixed; inset: 0 0 auto 0; z-index: 9000;
  height: var(--topbar-h);
  background: color-mix(in srgb, var(--surface) 82%, transparent);
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  border-bottom: 1px solid var(--border);
  font-family: var(--font);
}
#gk-topbar .gk-inner {
  max-width: 1400px; height: 100%; margin: 0 auto; padding: 0 20px;
  display: flex; align-items: center; gap: 18px;
}
/* Logo : seul élément qui garde les couleurs historiques (jaune sur bleu) */
#gk-topbar .gk-logo { display: flex; align-items: center; flex: none; }
#gk-topbar .gk-logo > * { display: none; }
html[data-gk-logo="classic"] #gk-topbar .gk-logo-classic,
html[data-gk-logo="minimal"] #gk-topbar .gk-logo-min,
html[data-gk-logo="original"] #gk-topbar .gk-logo-img { display: flex; }
#gk-topbar .gk-logo-img { height: 38px; width: auto; border-radius: 8px; }
#gk-topbar .gk-logo-min { align-items: center; gap: 8px; font-size: 22px; font-weight: 800; letter-spacing: -.03em; color: var(--text); white-space: nowrap; }
#gk-topbar .gk-logo-min b { color: var(--accent); }
#gk-topbar .gk-logo-mark {
  width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center;
  background: linear-gradient(135deg, #5aaef2, #2f6fd1); color: #fff; font-size: 16px; font-weight: 800;
}
#gk-topbar .gk-logo-classic {
  align-items: center; height: 38px; padding: 0 16px; border-radius: 10px; white-space: nowrap;
  background: linear-gradient(180deg, #6da2d5, #2f6aa8); box-shadow: inset 0 -3px 0 #87b9eb, 0 4px 12px rgba(47, 106, 168, .3);
  font-size: 21px; font-weight: 900; font-style: italic; letter-spacing: .02em; text-transform: uppercase;
  color: #ffd319 !important; text-shadow: 0 2px 0 #1d4f80, 0 0 1px #1d4f80;
  transition: filter .15s;
}
#gk-topbar .gk-logo:hover > * { filter: brightness(1.08); }
#gk-menu { display: contents; }
#gk-topbar .gk-spacer { display: none; flex: 1; }
#gk-nav { display: flex; align-items: center; gap: 4px; }
#gk-nav a {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 12px; border-radius: 999px;
  font-size: 14.5px; font-weight: 600; color: var(--text-soft) !important;
  text-transform: capitalize; white-space: nowrap; transition: background .15s, color .15s;
}
#gk-nav a:hover { background: var(--surface-3); color: var(--text) !important; }
#gk-nav a.gk-active { background: var(--accent-soft); color: var(--accent) !important; }
#gk-nav svg { width: 16px; height: 16px; opacity: .85; }
#gk-search { flex: 1; max-width: 360px; margin-left: auto; position: relative; }
#gk-search input {
  width: 100%; height: 38px; box-sizing: border-box;
  padding: 0 14px 0 38px; border-radius: 999px;
  border: 1px solid var(--border); background: var(--surface-2); color: var(--text);
  font: inherit; font-size: 14px; outline: none; transition: border-color .15s, box-shadow .15s;
}
#gk-search input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); background: var(--surface); }
#gk-search svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--muted); pointer-events: none; }
#gk-account { display: flex; align-items: center; gap: 6px; }
#gk-account #sub-menu-lign {
  display: flex !important; align-items: center; gap: 6px; flex-wrap: nowrap;
  background: none !important; border: 0 !important; padding: 0 !important; margin: 0 !important; width: auto !important;
  font-size: 13.5px; text-transform: none; white-space: nowrap;
}
#gk-account #sub-menu-lign img { width: 16px; height: 16px; vertical-align: middle; }
#gk-account #sub-menu-lign a {
  padding: 7px 12px; border-radius: 999px; font-weight: 600; color: var(--text-soft) !important;
}
#gk-account #sub-menu-lign a:hover { background: var(--surface-3); color: var(--text) !important; }
#gk-account #sub-menu-lign a:last-of-type:not(:first-of-type) { background: var(--accent); color: #fff !important; }
.gk-icon-btn {
  width: 38px; height: 38px; flex: none; border-radius: 999px;
  display: grid; place-items: center; cursor: pointer;
  border: 1px solid var(--border); background: var(--surface-2); color: var(--text);
  transition: background .15s, transform .15s;
}
.gk-icon-btn:hover { background: var(--surface-3); }
.gk-icon-btn:active { transform: scale(.94); }
.gk-icon-btn svg { width: 18px; height: 18px; }
#gk-theme .gk-moon { display: none; }
html.gk-dark #gk-theme .gk-sun { display: none; }
html.gk-dark #gk-theme .gk-moon { display: block; }
#gk-burger { display: none; }

/* ---------- Menu utilisateur (connecté) ---------- */
#gk-user { position: relative; display: flex; align-items: center; gap: 8px; }
html.gk-logged #gk-account { display: none; }
#gk-user-btn {
  display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 10px 0 4px; cursor: pointer;
  border: 1px solid var(--border); border-radius: 999px; background: var(--surface-2); color: var(--text);
  font: 600 14px var(--font); transition: background .15s;
}
#gk-user-btn:hover, html.gk-user-open #gk-user-btn { background: var(--surface-3); }
#gk-user-btn img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; background: var(--surface-3); }
#gk-user-btn .gk-user-name { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-transform: capitalize; }
#gk-user-btn .gk-chevron { width: 16px; height: 16px; color: var(--muted); transition: transform .2s; }
html.gk-user-open #gk-user-btn .gk-chevron { transform: rotate(180deg); }
#gk-user-panel {
  position: absolute; right: 0; top: calc(100% + 10px); width: 340px; max-height: calc(100vh - var(--topbar-h) - 20px);
  overflow-y: auto; box-sizing: border-box; padding: 8px;
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg);
  opacity: 0; visibility: hidden; transform: translateY(-6px); transition: opacity .15s, transform .15s, visibility .15s;
}
html.gk-user-open #gk-user-panel { opacity: 1; visibility: visible; transform: none; }
#gk-user-panel #account {
  width: auto !important; float: none !important; margin: 0 !important; height: auto; color: var(--text) !important;
  display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 4px 12px; padding: 10px 10px 14px;
  border-bottom: 1px solid var(--border); overflow: visible;
}
#gk-user-panel #account-avatar { grid-row: span 2; float: none; }
#gk-user-panel #account-avatar img { width: 56px !important; height: 56px !important; border-radius: 50% !important; object-fit: cover; border: 0 !important; margin: 0 !important; }
#gk-user-panel #account-post-triangle { display: none !important; }
#gk-user-panel #account-information { background: none !important; padding: 0 !important; float: none !important; height: auto; overflow: visible; display: contents; }
#gk-user-panel #account-name { float: none; font-size: 17px; font-weight: 800; text-transform: capitalize; align-self: end; }
#gk-user-panel #account-name a { color: var(--text) !important; }
#gk-user-panel #account-exp {
  position: relative; height: 6px !important; max-width: none !important; border: 0 !important; border-radius: 999px; overflow: hidden;
  background: var(--surface-3) !important; margin-top: 4px; align-self: start;
}
#gk-user-panel #account-exp::before {
  content: ""; position: absolute; inset: 0 auto 0 0; width: max(var(--gk-xp, 0%), 6px); border-radius: 999px;
  background: linear-gradient(90deg, #5aaef2, #8a6cf2);
}
#gk-user-panel #account-exp-black { display: none !important; }
#gk-user-panel #account-exp-text { grid-column: 1 / -1; font-size: 12.5px; color: var(--muted); margin-top: 6px; }
#gk-user-panel #account-exp-text a { color: var(--accent) !important; }
#gk-user-panel #account-post-text, #gk-user-panel #account-post-form, #gk-user-panel .account-link, #gk-user-panel #account-location { grid-column: 1 / -1; }
#gk-user-panel #account-post-text {
  margin-top: 8px; padding: 9px 12px; height: auto !important; border-radius: var(--radius-sm); background: var(--surface-2);
  font-size: 14px; color: var(--text-soft); cursor: pointer; border: 1px dashed var(--border);
}
#gk-user-panel #account-post-text:empty::before { content: "✏️ Que faites-vous en ce moment ?"; color: var(--muted); }
#gk-user-panel #account-post-text:hover { border-color: var(--accent); }
#gk-user-panel #account-post-form { margin-top: 8px; }
#gk-user-panel #account-post-form .form-submit { display: flex; gap: 6px; justify-content: flex-end; margin-top: 8px; }
#gk-user-panel #account-post-form .submit { padding: 7px 14px; font-size: 13px; }
#gk-user-panel #account-post-form .submit[value="annuler"] { background: var(--surface-3) !important; color: var(--text) !important; box-shadow: none; }
#gk-user-panel .account-link { display: none; }
#gk-user-panel .hidden { display: none !important; }
.gk-user-links { display: flex; flex-direction: column; padding-top: 6px; }
.gk-user-links a {
  display: flex; align-items: center; gap: 12px; padding: 9px 12px; border-radius: var(--radius-sm);
  font-size: 14.5px; font-weight: 500; color: var(--text-soft) !important; text-transform: none;
}
.gk-user-links a span { display: inline-block; }
.gk-user-links a span::first-letter { text-transform: uppercase; }
.gk-user-links a:hover { background: var(--surface-2); color: var(--text) !important; }
.gk-user-links a.gk-active { background: var(--accent-soft); color: var(--accent) !important; }
.gk-user-links a svg { width: 18px; height: 18px; flex: none; color: var(--muted); }
.gk-user-links a.gk-active svg { color: var(--accent); }
.gk-user-links a.gk-logout { margin-top: 6px; border-top: 1px solid var(--border); border-radius: 0 0 var(--radius-sm) var(--radius-sm); padding-top: 12px; color: var(--red) !important; }
.gk-user-links a.gk-logout svg { color: var(--red); }
#gk-write, #gk-messages { width: 38px; height: 38px; }
#gk-write svg, #gk-messages svg { width: 18px; height: 18px; }

/* Notifications (amis, messages…) */
html.gk #notification-list:not(:empty) {
  max-width: 1400px; box-sizing: border-box; margin: 16px auto 0; padding: 0 20px; display: grid; gap: 8px;
}
html.gk .notification {
  width: auto; display: flex; align-items: center; gap: 12px; padding: 12px 12px 12px 14px !important; text-align: left;
  background: var(--surface) !important; border: 1px solid var(--border) !important; border-left: 4px solid var(--accent) !important;
  border-radius: var(--radius-sm); box-shadow: var(--shadow); font-size: 14px; color: var(--text); animation: gk-fade .25s ease-out;
}
html.gk .notification > img { display: none; }
html.gk .gk-notif-icon {
  flex: none; width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center;
  background: var(--accent-soft); color: var(--accent);
}
html.gk .gk-notif-icon svg { width: 18px; height: 18px; }
html.gk .gk-notif-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
html.gk .gk-notif-title { font-weight: 600; line-height: 1.35; color: var(--text) !important; }
html.gk .gk-notif-title::first-letter { text-transform: uppercase; }
html.gk .gk-notif-title:hover { color: var(--accent) !important; }
html.gk .gk-notif-members { display: flex; flex-wrap: wrap; gap: 6px; }
html.gk .gk-notif-members a {
  padding: 3px 10px; border-radius: 999px; font-size: 13px; background: var(--surface-2); border: 1px solid var(--border);
}
html.gk .gk-notif-members a:hover { border-color: var(--orange); }
html.gk .notification-cross { flex: none; margin-left: auto; }
html.gk .notification-cross a { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; }
html.gk .notification-cross a:hover { background: var(--surface-3); }
html.gk .notification-cross img { width: 12px; height: 12px; margin: 0; }
html.gk .notification:not(:has(.gk-notif-body)) { justify-content: center; }
#gk-messages { position: relative; }
#gk-messages.gk-has-notif::after {
  content: ""; position: absolute; top: 6px; right: 6px; width: 9px; height: 9px; border-radius: 50%;
  background: var(--red); box-shadow: 0 0 0 2px var(--surface);
}

/* ---------- Layout ---------- */
html.gk #main-container {
  width: auto !important; max-width: 1400px; box-sizing: border-box;
  margin: 24px auto 0 !important; padding: 0 20px;
  display: grid; gap: 24px; align-items: start;
  grid-template-columns: 300px minmax(0, 1fr) 320px;
}
html.gk #main-container:has(> #column-4) { grid-template-columns: 300px minmax(0, 1fr); }
html.gk #main-container:has(> #column-3):not(:has(> #column-0)) { grid-template-columns: minmax(0, 1fr); }
html.gk #main-container > div { float: none !important; width: auto !important; margin: 0 !important; min-width: 0; }
html.gk #main-container > #main-container-header { grid-column: 1 / -1; }
html.gk #main-container > #column-0 { grid-column: 1; grid-row: 2; }
html.gk #main-container > #column-1, html.gk #main-container > #column-4 { grid-column: 2; grid-row: 2; }
html.gk #main-container > #column-2 { grid-column: 3; grid-row: 2; }
html.gk #main-container > #column-3 { grid-column: 1 / -1; }
html.gk #main-container:not(:has(> #main-container-header)) > div { grid-row: 1; }
html.gk #main-container-header:not(:has(> :not(.hidden, script, style))) { display: none; }

html.gk .advertisement { max-width: 100%; overflow: hidden; margin: 16px auto 0; text-align: center; }
html.gk [id^="cGsas_"] { max-width: 100%; overflow: hidden; }
html.gk #column-0 iframe, html.gk #column-2 iframe { max-width: 100%; }
html.gk .box-frame-external:has(> iframe[src*="facebook.com/plugins"]) { display: none !important; }

/* ---------- Cards ---------- */
html.gk .box-frame,
html.gk .box-frame-external:has(> .box-title-external-blue),
html.gk .box-container-external-new:has(> .box-title-external-blue),
html.gk .box-container-external:has(> #element-list),
html.gk .box-container-external:has(> form),
html.gk .article-container {
  background: var(--surface) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  height: auto !important;
}
html.gk .box-frame, html.gk .box-frame-external, html.gk .box-container-external-new { margin: 0 0 22px !important; }
html.gk .box-frame-external > .box-container-external { border: 0 !important; }
html.gk .box-frame.no-border { background: transparent !important; border: 0 !important; box-shadow: none; overflow: visible; }
html.gk .box-frame-min-height { min-height: 0; }
html.gk .box-container, html.gk .box-container-external, html.gk .box-container-external-new { background: transparent !important; height: auto !important; }
html.gk .box-frame > .box-container { padding: 14px 16px; }
html.gk .box-frame.no-border > .box-container { padding: 0; }
html.gk .box-container-external-new .box-container-external-new { margin: 0 !important; border: 0 !important; box-shadow: none !important; }

html.gk .box-title, html.gk .box-title-external-blue {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  padding: 12px 16px; margin: 0;
  background: transparent !important; color: var(--text) !important;
  border-bottom: 1px solid var(--border);
  font-size: 13px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  cursor: default; height: auto;
}
html.gk .box-title img { margin: 0; }
html.gk .box-title-external {
  font-size: 22px; font-weight: 800; letter-spacing: -.02em; color: var(--text);
  text-transform: capitalize; margin: 0 0 12px; height: auto; cursor: default;
}
/* Onglets (blogs / groupes / top) : les séparateurs "/" sont masqués */
html.gk .box-title-external-blue { font-size: 0; gap: 6px; padding: 10px 12px; }
html.gk .box-title-external-blue a {
  font-size: 12.5px; letter-spacing: .04em; padding: 6px 12px; border-radius: 999px;
  color: var(--muted) !important; background: var(--surface-2);
}
html.gk .box-title-external-blue a:hover { color: var(--text) !important; background: var(--surface-3); }
html.gk .box-title-external-blue a.gk-tab-active,
html.gk .box-title-external-blue a:first-child:not(.gk-tab-touched) { color: #fff !important; background: var(--accent); }
html.gk .box-option-external { margin: -4px 0 14px; display: flex; gap: 6px; font-size: 0; }
html.gk .box-option-external a {
  font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 999px;
  background: var(--surface); border: 1px solid var(--border); color: var(--text-soft) !important;
}
html.gk .box-option-external a:hover { border-color: var(--accent); color: var(--accent) !important; }
html.gk .box-bottom-link { padding: 12px 16px; text-align: center; border-top: 1px solid var(--border); font-weight: 600; font-size: 13.5px; }
html.gk .box-bottom-link a { color: var(--accent) !important; }

/* ---------- Listes compactes (sidebar : blogs, news liées) ---------- */
html.gk .tip-container {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 12px 16px; margin: 0; height: auto;
  border-bottom: 1px solid var(--border); transition: background .15s;
}
html.gk .tip-container:last-of-type { border-bottom: 0; }
html.gk .tip-container:hover { background: var(--surface-2) !important; }
html.gk .tip-container .article-thumb { float: none; margin: 0; padding: 0; flex: none; border: 0 !important; background: none !important; }
html.gk .tip-container .article-thumb a { display: block; }
html.gk .tip-container .article-thumb img {
  width: 44px !important; height: 44px !important; object-fit: cover; border-radius: 50% !important;
  border: 0 !important; padding: 0 !important; margin: 0 !important; display: block; background: var(--surface-3);
}
html.gk .tip-container .article-information { flex: 1; min-width: 0; float: none; width: auto; margin: 0; padding: 0; }
html.gk .small-title { font-size: 14px; font-weight: 600; line-height: 1.35; height: auto; overflow: visible; }
html.gk .small-title a { color: var(--text) !important; }
html.gk .small-title a:hover { color: var(--accent) !important; }
html.gk .details { font-size: 12.5px; color: var(--muted); margin-top: 3px; display: flex; flex-wrap: wrap; gap: 4px 6px; align-items: center; }
html.gk .details img { width: 14px; height: 14px; opacity: .6; }
html.gk img[src*="/icons/comment.gif"], html.gk img[src*="/icons/response.png"], html.gk img[src*="/icons/cross.gif"],
html.gk img[src*="/icons/triangle_"], html.gk img[src*="/icons/tag_orange.gif"] { filter: brightness(0) opacity(.45) !important; }
html.gk.gk-dark img[src*="/icons/comment.gif"], html.gk.gk-dark img[src*="/icons/response.png"], html.gk.gk-dark img[src*="/icons/cross.gif"],
html.gk.gk-dark img[src*="/icons/triangle_"], html.gk.gk-dark img[src*="/icons/tag_orange.gif"] { filter: brightness(0) invert(.75) !important; }
html.gk .details a { color: var(--muted) !important; }
html.gk .details a.member { color: var(--orange) !important; }

/* ---------- Fil de news central (accueil) ---------- */
html.gk #column-1 #news-frame { padding: 0; }
html.gk #column-1 #news-frame .tip-container { padding: 16px 18px; gap: 18px; }
html.gk #column-1 #news-frame .article-thumb img {
  width: 220px !important; height: 124px !important; border-radius: var(--radius-sm) !important; transition: transform .3s;
}
html.gk #column-1 #news-frame .article-thumb { border-radius: var(--radius-sm); overflow: hidden; }
html.gk #column-1 #news-frame .tip-container:hover .article-thumb img { transform: scale(1.04); }
html.gk .medium-title { font-size: 18px; font-weight: 700; line-height: 1.3; letter-spacing: -.01em; color: var(--text); height: auto; }
html.gk .medium-title a { color: var(--text) !important; }
html.gk .medium-title a:hover { color: var(--accent) !important; }
html.gk .medium-title img, html.gk .element-title img, html.gk .small-title img, html.gk .big-title > img { height: 11px !important; width: auto !important; vertical-align: 1px; border-radius: 2px; margin-right: 2px; }
html.gk .big-title > img { height: 14px !important; vertical-align: 5px; }
html.gk .tip-container .medium-text { font-size: 14px; color: var(--muted); line-height: 1.5; margin-top: 6px; text-align: left; }

/* ---------- Diaporama ---------- */
html.gk #container {
  width: 100% !important; height: auto !important; aspect-ratio: 16 / 7;
  position: relative; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow);
  background: var(--surface-3);
}
html.gk #column-1 > .box-frame-external:has(#container) { background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); }
html.gk #column-1 > .box-frame-external:has(#container) > br { display: none; }
html.gk #column-1 > .box-frame-external:has(#container) #container { border-radius: 0; box-shadow: none; border-bottom: 1px solid var(--border); }
html.gk #container ul { height: 100% !important; position: relative; }
html.gk #container li { inset: 0; position: absolute; }
html.gk .slideshow-div { width: 100% !important; height: 100% !important; background-size: cover !important; background-position: center !important; position: relative; }
html.gk .slideshow-arrows { height: 100%; position: relative; background: none !important; }
html.gk .slideshow-arrows::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, transparent 45%, rgba(0, 0, 0, .78));
}
html.gk #container a.fill-div { position: absolute; inset: 0; z-index: 1; }
html.gk .slideshow-div-text { padding: 0 !important; position: absolute; left: 22px; right: 80px; bottom: 18px; z-index: 2; pointer-events: none; }
html.gk .slideshow-div-text span { display: none; }
html.gk .gk-slide-title {
  color: #fff; font-size: 24px; font-weight: 800; line-height: 1.2; letter-spacing: -.02em;
  text-shadow: 0 2px 12px rgba(0, 0, 0, .5);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
html.gk #container .button {
  position: absolute !important; top: 50%; margin: -20px 0 0 !important; z-index: 3;
  width: 40px !important; height: 40px !important; border-radius: 50%; float: none !important;
  background: rgba(0, 0, 0, .45) !important; backdrop-filter: blur(6px);
  display: grid; place-items: center; opacity: 0; transition: opacity .2s, background .2s;
}
html.gk #container:hover .button { opacity: 1; }
html.gk #container .button:hover { background: rgba(0, 0, 0, .7) !important; }
html.gk #container .prevButton { left: 14px; }
html.gk #container .nextButton { right: 14px; }
html.gk #container .button::before {
  content: ""; width: 10px; height: 10px; border: solid #fff; border-width: 0 0 2.5px 2.5px;
  transform: translateX(2px) rotate(45deg);
}
html.gk #container .nextButton::before { transform: translateX(-2px) rotate(-135deg); }

/* ---------- Tuiles image (populaires / avis) ---------- */
html.gk #column-2 #blog-list, html.gk #column-2 #opinion-list { display: grid; gap: 10px; padding: 12px; }
html.gk .tip-container-new {
  position: relative; height: 150px !important; margin: 0 !important; border-radius: var(--radius-sm);
  overflow: hidden; background-size: cover !important; background-position: center !important;
  transition: transform .2s, box-shadow .2s; opacity: 1 !important;
}
html.gk .tip-container-new:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
html.gk .tip-container-new a.fill-div {
  position: absolute; inset: 0; display: flex !important; flex-direction: column; justify-content: flex-end;
  padding: 12px 14px; box-sizing: border-box; width: auto !important; height: auto !important;
}
html.gk .tip-container-new .article-information { position: static; padding: 0; height: auto; display: block; overflow: visible; }
html.gk .tip-container-new .medium-title { font-size: 15px; line-height: 1.3; color: #fff !important; text-shadow: 0 1px 8px rgba(0, 0, 0, .6); }
html.gk .tip-container-new .medium-title font { color: #fff !important; }
html.gk .tip-container-new .details { color: rgba(255, 255, 255, .8); justify-content: flex-start; margin-top: 4px; }
html.gk .tip-container-new .details font { color: var(--orange) !important; }
html.gk .comments-popular {
  position: absolute; top: 10px; right: 10px; margin: 0 !important; float: none !important;
  width: auto !important; height: auto !important; padding: 3px 9px 3px 8px !important; border-radius: 999px;
  background: rgba(0, 0, 0, .55) !important; color: #fff !important; backdrop-filter: blur(6px);
  font-size: 12.5px !important; font-weight: 700; display: flex; align-items: center; gap: 5px;
}
html.gk .comments-popular::before { content: "💬"; font-size: 11px; }
html.gk .tip-container-new .score { position: absolute; top: 10px; right: 10px; margin: 0 !important; float: none !important; }

/* ---------- Badges de note ---------- */
html.gk .score, html.gk .average-score, html.gk .opinion-average-score {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 42px; padding: 3px 9px; border-radius: 999px; box-sizing: border-box;
  font-size: 13px !important; font-weight: 800; line-height: 1.3; color: #fff !important;
  background: var(--muted); vertical-align: middle;
}
html.gk .gk-score-high { background: #2e9e4f !important; }
html.gk .gk-score-mid { background: #d99a0b !important; }
html.gk .gk-score-low { background: #d64545 !important; }
html.gk .opinion-score { margin-top: 12px; text-align: right; }
html.gk .box-title-external .opinion-average-score { font-size: 18px !important; padding: 4px 14px; margin-left: 6px; }
html.gk .opinion-score .score { font-size: 16px !important; padding: 6px 14px; }

/* ---------- Listes (news, blogs, vidéos, tests) ---------- */
html.gk .element-container {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  padding: 12px 18px; margin: 0; height: auto; overflow: visible;
  border-bottom: 1px solid var(--border); transition: background .12s;
}
html.gk #element-list .element-container:hover, html.gk #news-list .element-container:hover { background: var(--surface-2) !important; }
html.gk #element-list .element-container:last-child { border-bottom: 0; }
html.gk .element-container.brown-background {
  background: var(--surface-2) !important; padding: 10px 18px;
}
html.gk .element-container.brown-background > div, html.gk .white-font {
  color: var(--muted) !important; font-size: 11.5px !important; font-weight: 700; letter-spacing: .07em; text-transform: uppercase;
}
html.gk .element-title { flex: 1; min-width: 0; width: auto !important; float: none !important; font-size: 15px; font-weight: 600; line-height: 1.4; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; }
html.gk .element-title > div:not(.details) { width: 100%; }
html.gk .element-title a { color: var(--text) !important; }
html.gk .element-title a:hover { color: var(--accent) !important; }
html.gk .element-title .details { width: 100%; margin: 0; }
html.gk .gk-initial {
  display: inline-grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; margin-right: 7px; vertical-align: middle;
  font-size: 12px; font-weight: 800; color: #fff; text-transform: uppercase; flex: none;
}
html.gk .element-detail a.member { display: inline-flex; align-items: center; }
html.gk .element-detail { flex: none; width: auto !important; float: none !important; font-size: 13px; color: var(--muted); text-align: right; white-space: nowrap; }

/* ---------- Article (news, vidéo, blog, avis) ---------- */
html.gk .article-container { padding: 0 !important; margin-bottom: 22px !important; }
html.gk .box-frame:not(:has(> .box-title)):has(> .box-container > .article-container) {
  background: transparent !important; border: 0 !important; box-shadow: none; overflow: visible;
}
html.gk .box-frame:not(:has(> .box-title)):has(> .box-container > .article-container) > .box-container { padding: 0; }
html.gk .article-container > .article-information { padding: 0 32px; }
html.gk .article-container > :not(.article-information) { margin-left: 32px; margin-right: 32px; }
html.gk .game-header-image { margin: 0 -32px 4px; }
html.gk .game-header-image img { width: 100%; height: auto; display: block; aspect-ratio: 16 / 7; object-fit: cover; }
html.gk .big-title {
  font-size: 30px; font-weight: 800; line-height: 1.2; letter-spacing: -.025em; color: var(--text) !important;
  margin: 26px 0 16px !important; height: auto; overflow: visible;
}
html.gk #main-container-header .big-title { margin: 0 0 14px !important; text-align: center; }
html.gk .article-container .big-title a { color: var(--text) !important; }
html.gk .article-container .big-title a:hover { color: var(--accent) !important; }
html.gk .article-container .medium-text,
html.gk .article-container .article-text {
  font-size: 17px; line-height: 1.75; color: var(--text-soft); text-align: left; overflow: visible; height: auto;
}
html.gk .article-container .medium-text a { color: var(--accent) !important; text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--accent) 40%, transparent); text-underline-offset: 3px; }
html.gk .article-container .medium-text b, html.gk .article-container .medium-text strong { color: var(--text); }
html.gk .article-container .medium-text img { height: auto; border-radius: var(--radius-sm); }
html.gk .article-container .medium-text iframe { max-width: 100%; border-radius: var(--radius-sm); border: 0; }
html.gk .article-container .medium-text iframe[src*="youtube"], html.gk .article-container .medium-text iframe[src*="dailymotion"],
html.gk .article-container .medium-text iframe#youtube {
  width: 100% !important; height: auto !important; aspect-ratio: 16 / 9; display: block; margin: 12px 0;
}
html.gk #player_hover { margin: 0 !important; }
html.gk .article-container .medium-text blockquote, html.gk #quote {
  margin: 16px 0; padding: 12px 18px !important; border: 0 !important; border-left: 4px solid var(--accent) !important;
  background: var(--surface-2) !important; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; color: var(--text-soft);
}
html.gk .article-category { color: var(--orange); font-size: 13px; text-transform: uppercase; letter-spacing: .06em; margin-top: -8px; }
html.gk .article-source { font-size: 14px; color: var(--muted); }
html.gk .article-source:not(:has(a[href]:not([href=""]))) { display: none; }
html.gk .article-details { text-align: left; font-size: 13px; color: var(--muted); margin-top: 14px !important; padding-top: 14px; border-top: 1px solid var(--border); }
html.gk .tag { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 18px !important; margin-bottom: 0; }
html.gk .tag img { width: 14px; height: 14px; }
html.gk .tag a {
  text-decoration: none !important; color: var(--accent) !important; background: var(--accent-soft);
  padding: 3px 10px; border-radius: 999px; font-size: 12.5px; font-weight: 600;
}
html.gk .spoil {
  background: var(--text) !important; color: transparent !important; border-radius: 4px; cursor: pointer;
  transition: background .2s, color .2s; padding: 0 3px;
}
html.gk .spoil.gk-revealed { background: var(--surface-3) !important; color: var(--text) !important; }
html.gk.gk-dark .medium-text font[color="#000000"], html.gk.gk-dark .medium-text font[color="black"],
html.gk.gk-dark .comment-text font[color="#000000"], html.gk.gk-dark .comment-text font[color="black"],
html.gk.gk-dark .medium-text [style*="color: #000"], html.gk.gk-dark .medium-text [style*="color:#000"],
html.gk.gk-dark .medium-text [style*="color: black"], html.gk.gk-dark .medium-text [style*="color:black"] { color: var(--text) !important; }
html.gk.gk-dark .medium-text [style*="background-color: #fff"], html.gk.gk-dark .medium-text [style*="background-color:#fff"],
html.gk.gk-dark .medium-text [style*="background: #fff"], html.gk.gk-dark .medium-text [style*="background:#fff"] { background-color: transparent !important; }

/* Galerie d'images dans un article */
html.gk .medium-thumb-collection, html.gk .special-thumb-collection, html.gk .big-thumb-collection {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;
  padding: 0; margin-top: 14px !important; margin-bottom: 14px !important; list-style: none;
}
html.gk .medium-thumb-collection:empty { display: none; }
html.gk .box-container-external > .special-thumb-collection { padding: 14px 16px; margin: 0 !important; }
html.gk .medium-thumb-collection li, html.gk .special-thumb-collection li, html.gk .big-thumb-collection li {
  float: none !important; display: block !important; margin: 0 !important; padding: 0 !important; border: 0 !important; background: none !important;
}
html.gk .medium-thumb-media img, html.gk .special-thumb-media img, html.gk .big-thumb-collection img {
  width: 100% !important; height: auto !important; aspect-ratio: 16 / 9; object-fit: cover; border: 0 !important;
  border-radius: var(--radius-sm); display: block; transition: transform .2s, box-shadow .2s;
}
html.gk .medium-thumb-media img:hover, html.gk .special-thumb-media img:hover { transform: scale(1.03); box-shadow: var(--shadow-lg); }
html.gk .box-frame-external:has(> .box-container-external > .special-thumb-collection) > .box-container-external {
  background: var(--surface) !important; border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow);
}

/* Likes */
html.gk .votes-system-frame { float: none !important; margin-top: 22px !important; margin-bottom: 0 !important; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; }
html.gk .votes-frame { width: auto !important; height: auto !important; margin: 0 !important; }
html.gk .votes-box {
  width: auto !important; height: auto !important; display: inline-flex !important; align-items: center; gap: 6px;
  padding: 7px 14px !important; border-radius: 999px; cursor: pointer;
  border: 1px solid var(--border) !important; background: var(--surface-2) !important; box-shadow: none;
  flex-direction: row-reverse; transition: transform .15s, background .2s, border-color .2s;
}
html.gk .votes-box .votes-number, html.gk .votes-box .votes-text { color: var(--text-soft) !important; }
html.gk .votes-box .votes-text { color: var(--muted) !important; }
html.gk .votes-box:hover { transform: scale(1.05); border-color: #f0516a !important; }
html.gk .votes-box:hover .votes-text { color: #f0516a !important; }
/* Aimé : cœur rouge plein */
html.gk .votes-box.voted {
  border-color: transparent !important; background: linear-gradient(135deg, #ff8a5c, #f0516a) !important;
  box-shadow: 0 4px 12px rgba(240, 81, 106, .3);
}
html.gk .votes-box.voted .votes-number, html.gk .votes-box.voted .votes-text { color: #fff !important; }
html.gk .votes-number { font-size: 15px !important; }
html.gk .votes-text { font-size: 15px !important; }
html.gk .voters-link a { font-size: 13px; color: var(--accent) !important; }
html.gk .voters-box-news, html.gk .voters-box {
  font-size: 13px; color: var(--muted); margin-top: 8px !important; margin-bottom: 0 !important; padding: 0 !important;
  background: none !important; border: 0 !important; width: auto !important; height: auto !important; float: none !important;
}
html.gk .votes-system-frame > .voters-box-news:has(a) { margin: 0 !important; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; }
html.gk .votes-system-frame > .voters-box-news > div { display: inline; }
html.gk .voters-title { white-space: nowrap; }
html.gk .voters-box.hidden { display: none !important; }
html.gk .voters-box-news:not(:has(a)) { display: none; }
html.gk .voters-title { font-weight: 600; color: var(--text-soft); }

/* ---------- Commentaires ---------- */
html.gk .comment-number {
  font-size: 18px !important; font-weight: 800; color: var(--text); margin-top: 26px !important; margin-bottom: 6px !important;
  display: flex; align-items: center; gap: 8px; text-transform: capitalize;
}
html.gk .comment-number img { width: 18px; height: 18px; }
html.gk .comment-box {
  display: flex; gap: 12px; padding: 14px 0 !important; height: auto;
  border-top: 1px solid var(--border) !important; border-bottom: 0 !important; border-left: 0 !important; border-right: 0 !important;
}
html.gk .comment-avatar { float: none; flex: none; border: 0 !important; background: none !important; padding: 0 !important; margin: 0 !important; }
html.gk .comment-avatar img {
  width: 42px !important; height: 42px !important; border-radius: 50% !important; object-fit: cover;
  border: 0 !important; padding: 0 !important; margin: 0 !important; display: block; background: var(--surface-3);
}
html.gk .comment-information { flex: 1; min-width: 0; padding: 0; }
html.gk .comment-name { font-size: 13px; color: var(--muted); display: flex; flex-wrap: wrap; align-items: center; gap: 4px; overflow: visible; }
html.gk .comment-name .member { font-size: 14px; }
html.gk .comment-cross { margin-left: auto; opacity: 0; transition: opacity .15s; }
html.gk .comment-box:hover .comment-cross { opacity: 1; }
html.gk .comment-box:has(.gk-comment-actions) .comment-cross { display: none; }
html.gk .gk-comment-actions { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-top: 6px; font-size: 12.5px; }
html.gk .gk-comment-actions button {
  border: 0; background: none; padding: 2px 0; cursor: pointer; font: 600 12.5px var(--font); color: var(--muted);
  display: inline-flex; align-items: center; gap: 4px;
}
html.gk .gk-comment-actions button:hover { color: var(--accent); }
html.gk .gk-comment-actions button.gk-act-delete:hover { color: var(--red); }
html.gk .gk-comment-actions svg { width: 13px; height: 13px; }
html.gk .comment-box.gk-mine { position: relative; }
html.gk .comment-box.gk-mine .comment-name .member::after {
  content: "vous"; margin-left: 6px; padding: 1px 7px; border-radius: 999px; font-size: 10.5px; font-weight: 700;
  background: var(--accent-soft); color: var(--accent); vertical-align: 1px;
}
html.gk .comment-box.gk-new { animation: gk-flash 2.4s ease-out; }
@keyframes gk-flash { 0%, 30% { background: var(--accent-soft); } 100% { background: transparent; } }
/* Autocomplétion des pseudos (@) */
.gk-mention-pop {
  position: absolute; z-index: 70; min-width: 200px; max-width: 280px; max-height: 240px; overflow-y: auto; padding: 4px;
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); box-shadow: var(--shadow-lg);
  font-family: var(--font);
}
.gk-mention-pop button {
  display: flex; width: 100%; align-items: center; gap: 8px; padding: 7px 10px; border: 0; border-radius: 8px; cursor: pointer;
  background: none; color: var(--text); font: 600 14px var(--font); text-align: left;
}
.gk-mention-pop button.gk-on, .gk-mention-pop button:hover { background: var(--accent-soft); color: var(--accent); }
.gk-mention-pop small { margin-left: auto; font-weight: 400; color: var(--muted); font-size: 11.5px; }
.gk-toast {
  position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 9500; padding: 9px 16px; border-radius: 999px;
  background: var(--text); color: var(--bg); font: 600 13px var(--font); box-shadow: var(--shadow-lg); animation: gk-fade .2s ease-out;
}
html.gk .comment-cross img { width: 16px; height: 16px; }
html.gk.gk-dark .comment-cross img { filter: invert(1); }
html.gk .comment-text {
  font-family: var(--font); font-size: 15px; line-height: 1.6; color: var(--text-soft); margin-top: 4px;
  overflow-wrap: anywhere; height: auto;
}
html.gk .comment-text a { color: var(--accent) !important; }
html.gk .comment-text img { max-height: 400px; height: auto; border-radius: 8px; vertical-align: middle; }
html.gk .comment-text img[src*="icon_forum"] { border-radius: 0; }
html.gk .comment-form { text-align: left; padding: 18px 0 26px !important; }
html.gk .comment-form form { display: flex; flex-direction: column; gap: 10px; }
html.gk .form-textarea-field { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
html.gk .tagSelection {
  float: none !important; margin: 0 !important; padding: 5px 12px !important; border-radius: 999px;
  border: 1px solid var(--border) !important; background: var(--surface-2) !important;
  font-family: var(--font) !important; font-size: 13px !important; color: var(--text-soft); cursor: pointer;
}
html.gk .tagSelection a { color: var(--text-soft) !important; }
html.gk .tagSelection:hover { border-color: var(--accent) !important; }
html.gk #popup { background: var(--surface) !important; border-color: var(--border) !important; box-shadow: var(--shadow-lg); z-index: 50; }
html.gk textarea, html.gk input[type="text"], html.gk input[type="password"], html.gk input[type="email"], html.gk select {
  font-family: var(--font); font-size: 15px; color: var(--text);
  background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: 10px 12px; box-sizing: border-box; outline: none; transition: border-color .15s, box-shadow .15s;
}
html.gk textarea { width: 100% !important; min-height: 130px; resize: vertical; line-height: 1.5; }
html.gk textarea:focus, html.gk input[type="text"]:focus, html.gk input[type="password"]:focus, html.gk select:focus {
  border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); background: var(--surface);
}
html.gk input[type="submit"], html.gk input[type="button"], html.gk button.submit, html.gk .submit {
  font-family: var(--font); font-size: 14.5px; font-weight: 700; cursor: pointer;
  padding: 10px 22px; border: 0; border-radius: 999px; color: #fff !important;
  background: var(--accent) !important; box-shadow: 0 4px 12px rgba(47, 128, 209, .3); transition: filter .15s, transform .15s;
}
html.gk input[type="submit"]:hover, html.gk input[type="button"]:hover { filter: brightness(1.1); }
html.gk input[type="submit"]:active, html.gk input[type="button"]:active { transform: scale(.97); }
html.gk .form-submit { text-align: right; }
html.gk .form-textarea { margin: 0 0 12px; }
html.gk .form-textarea-text { font-weight: 600; margin-bottom: 6px; color: var(--text-soft); }
html.gk .form-warning { border: 0 !important; font-size: 13.5px; color: var(--muted); background: var(--surface-2); padding: 12px 14px; border-radius: var(--radius-sm); }
html.gk .box-container-external:has(> form) { padding: 18px; }

/* ---------- Bulles de messages (inscription, murs de profil, messagerie) ---------- */
html.gk .post-list, html.gk .message-post-list { background: transparent !important; }
html.gk .post-box, html.gk .messenger-post-box, html.gk .message-post-box {
  display: flex; align-items: flex-start; gap: 12px; padding: 10px 0 !important; height: auto !important; overflow: visible;
}
html.gk .post-triangle, html.gk .messenger-post-triangle, html.gk .message-post-triangle, html.gk #account-post-triangle { display: none !important; }
html.gk .post-avatar, html.gk .messenger-post-avatar, html.gk .message-post-avatar { float: none !important; flex: none; }
html.gk .medium-avatar { width: auto !important; height: auto !important; border: 0 !important; background: none !important; }
html.gk .medium-avatar img, html.gk .post-avatar img, html.gk .messenger-post-avatar img, html.gk .message-post-avatar img {
  width: 48px !important; height: 48px !important; border-radius: 50% !important; object-fit: cover;
  border: 0 !important; margin: 0 !important; padding: 0 !important; display: block; background: var(--surface-3);
}
html.gk .post-information, html.gk .messenger-post-information, html.gk .message-post-information {
  flex: 1; min-width: 0; height: auto !important; float: none !important;
  background: var(--surface-2) !important; color: var(--text-soft) !important;
  border: 1px solid var(--border); border-radius: 4px 16px 16px 16px; padding: 12px 16px !important;
}
html.gk .post-name, html.gk .messenger-post-name, html.gk .message-post-name { font-size: 13px; margin: 0 0 4px !important; color: var(--muted); }
html.gk .post-text, html.gk .messenger-post-text, html.gk .message-post-text, html.gk .message-post-overview {
  font-family: var(--font) !important; font-size: 14.5px !important; line-height: 1.6; color: var(--text-soft) !important; height: auto !important;
}
html.gk .post-text + .post-text { margin-top: 8px; }
html.gk .message-post-subject { font-size: 15px; color: var(--text); }
html.gk .post-text a, html.gk .messenger-post-text a, html.gk .message-post-text a,
html.gk .post-link a, html.gk .message-post-link a { color: var(--accent) !important; }
html.gk .post-text input[type="checkbox"] { accent-color: var(--accent); width: 16px; height: 16px; vertical-align: -3px; }
html.gk.gk-dark .post-cross img, html.gk.gk-dark .message-post-cross img { filter: invert(1); }
html.gk .account-post-textarea {
  height: auto !important; min-height: 80px; font-size: 16px !important; color: var(--text) !important;
  background: var(--surface-2) !important; border: 1px solid var(--border) !important; border-radius: var(--radius-sm); padding: 10px 12px !important;
}
html.gk .form-textarea { padding: 10px 0 0 !important; height: auto; }
html.gk .form-textarea-field { color: var(--text-soft); }

/* Messagerie privée */
html.gk .message-post-list { padding: 0 !important; }
html.gk #message-list .message-post-box { padding: 16px 0 !important; border-top: 1px solid var(--border); margin: 0 !important; }
html.gk #message-list .message-post-box:first-child { border-top: 0; padding-top: 4px !important; }
html.gk #message-list:empty::before { content: "Aucun message pour le moment."; display: block; padding: 24px 0; text-align: center; color: var(--muted); }
html.gk .message-post-information { border-radius: 4px 14px 14px 14px; }
html.gk .message-post-information.orange-background { border-left: 3px solid var(--orange) !important; background: color-mix(in srgb, var(--orange) 7%, var(--surface-2)) !important; }
html.gk .message-post-name { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 6px; font-size: 13px !important; }
html.gk .message-post-name .member { font-size: 14.5px; }
html.gk .message-post-name img[src*="new.gif"] { display: none; }
html.gk .message-post-name:has(img[src*="new.gif"])::after {
  content: "Nouveau"; margin-left: auto; padding: 2px 9px; border-radius: 999px; background: var(--orange); color: #fff;
  font-size: 10.5px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase;
}
html.gk .message-post-overview { font-size: 15px !important; font-weight: 700; color: var(--text) !important; margin-top: 4px; }
html.gk .gk-msg-text {
  margin-top: 8px; padding: 8px 12px; border-radius: 8px; background: var(--surface); border: 1px solid var(--border);
  font-size: 14.5px; line-height: 1.6; color: var(--text-soft); overflow-wrap: anywhere;
}
html.gk .gk-msg-text img.gk-smiley { vertical-align: middle; }
html.gk .gk-mention { color: var(--accent); font-weight: 600; }
html.gk .message-post-link { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; font-size: 0 !important; text-align: left; }
html.gk .message-post-link img { display: none; }
html.gk .message-post-link a {
  font-size: 13px !important; font-weight: 600; padding: 7px 14px; border-radius: 999px;
  border: 1px solid var(--border); background: var(--surface); color: var(--text-soft) !important;
}
html.gk .message-post-link a:hover { border-color: var(--accent); color: var(--accent) !important; }
html.gk .message-post-link a.gk-msg-primary { background: var(--accent); border-color: var(--accent); color: #fff !important; }
html.gk .message-post-link a.gk-msg-primary:hover { filter: brightness(1.1); color: #fff !important; }
html.gk .message-post-link a.gk-msg-danger:hover { border-color: var(--red); color: var(--red) !important; }
html.gk .gk-title-action {
  margin-left: auto; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px;
  background: var(--accent); color: #fff !important; font-size: 12.5px; letter-spacing: 0; text-transform: none; white-space: nowrap;
}
html.gk .gk-title-action svg { width: 14px; height: 14px; }
html.gk .gk-title-action:hover { filter: brightness(1.1); }
@media (max-width: 560px) {
  html.gk .message-post-box { gap: 10px; }
  html.gk .message-post-avatar img { width: 38px !important; height: 38px !important; }
  html.gk .message-post-information { padding: 10px 12px !important; }
  html.gk .message-post-link a { flex: 1 1 auto; text-align: center; }
}

/* ---------- Avis de lecteurs ---------- */
html.gk #column-1 > .box-frame > .box-title + .box-container > .article-container { border: 0 !important; box-shadow: none; margin: 0 !important; border-radius: 0; }
html.gk #column-1 > .box-frame > .box-title + .box-container:has(> .article-container) { padding: 0; }
html.gk #column-1 > .box-frame > .box-container > .article-container > .article-information { padding: 18px 20px; }
html.gk #column-1 > .box-frame > .box-container > .article-container .medium-text { font-size: 15.5px; }
html.gk .article-information .medium-text > .votes-system-frame { float: right !important; margin: 0 0 8px 14px !important; }

/* ---------- Fiches / profils (sidebars) ---------- */
html.gk .avatar img, html.gk .big-avatar img, html.gk .thumb-media img, html.gk .small-thumb-media img,
html.gk .special-thumb-media img, html.gk .medium-thumb-media img, html.gk .comment-avatar img, html.gk .article-thumb img {
  padding: 0 !important; margin: 0 !important; background-color: var(--surface-3) !important;
}
html.gk .articles-container { border: 0 !important; background: none !important; }
html.gk .avatar img, html.gk .big-avatar img { width: 100% !important; height: auto !important; border-radius: var(--radius-sm); border: 0 !important; display: block; }
html.gk .avatar, html.gk .big-avatar, html.gk .profile-information-big-avatar, html.gk #profile-big-avatar {
  margin: 0 0 10px !important; padding: 0 !important; border: 0 !important; background: none !important; float: none !important; width: auto !important; height: auto !important;
}
html.gk .voters-link { border: 0 !important; background: none !important; width: auto !important; height: auto !important; padding: 0 !important; }
html.gk .voters-link a { padding: 6px 12px; border-radius: 999px; background: var(--surface-2); border: 1px solid var(--border); font-weight: 600; }
html.gk .profile-information-big-avatar .big-avatar img { width: 120px !important; height: 120px !important; object-fit: cover; border-radius: 50%; margin: 4px auto 6px; }
html.gk .profile-information-name { text-align: center; font-size: 18px; font-weight: 800; margin-bottom: 10px; }
html.gk .profile-information-text, html.gk .profile-text {
  font-size: 14px; line-height: 1.5; padding: 7px 0; margin: 0; border-bottom: 1px dashed var(--border); color: var(--text-soft);
}
html.gk .profile-information-text:last-child, html.gk .profile-text:last-child { border-bottom: 0; }
html.gk .profile-information-text .bold, html.gk .profile-text .bold { color: var(--muted); font-weight: 600; }
html.gk .profile-information-text img, html.gk .profile-text img { width: 14px; height: 14px; vertical-align: -2px; }
html.gk #votes-system-frame-profile-information { margin: 8px 0 !important; }
html.gk #group-bloggers-list { padding: 0; margin: 6px 0 0; list-style: none; display: flex; flex-wrap: wrap; gap: 4px 10px; }

/* Fiche jeu */
html.gk #profile-container { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 20px; padding: 0; }
html.gk #profile-column-0, html.gk #profile-column-1 { float: none; width: auto; padding: 0; }
html.gk .profile-text-paragraph { border: 0 !important; background: var(--surface-2) !important; border-radius: var(--radius-sm); padding: 6px 14px; margin: 12px 0; }
html.gk #profile-post-box { background: var(--accent-soft) !important; border: 0 !important; border-radius: var(--radius-sm); padding: 12px 14px; height: auto !important; min-height: 0 !important; }
html.gk #profile-post-information, html.gk #profile-post-information > div {
  background: none !important; border: 0 !important; height: auto !important; min-height: 0 !important;
  width: auto !important; padding: 0 !important; margin: 0 0 4px !important; float: none !important; color: var(--text-soft) !important;
}
html.gk .profile-post-text { font-size: 16px; font-weight: 600; }
html.gk #profile-post-triangle { display: none; }
html.gk #profile-post-name { font-weight: 800; font-size: 17px; color: var(--text); }
html.gk .box-frame-external:has(> .box-container > #news-list) > .box-container { border: 1px solid var(--border) !important; border-radius: var(--radius-sm); overflow: hidden; margin-top: 16px; }

/* Vignettes membres / groupes */
html.gk .small-thumb-collection, html.gk .thumb-collection {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(62px, 1fr)); gap: 12px 8px; padding: 2px 0 !important; margin: 0; list-style: none;
}
html.gk .thumb-collection { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); }
html.gk .small-thumb-collection li, html.gk .thumb-collection li {
  float: none !important; display: flex !important; flex-direction: column; align-items: center; gap: 4px;
  margin: 0 !important; padding: 0 !important; border: 0 !important; background: none !important; min-width: 0;
}
html.gk .small-thumb-media img, html.gk .thumb-media img {
  width: 54px !important; height: 54px !important; object-fit: cover; border: 0 !important; border-radius: 16px;
  display: block; transition: transform .15s, box-shadow .15s; background: var(--surface-3);
}
html.gk .thumb-media img { width: 70px !important; height: 70px !important; border-radius: 50%; }
html.gk .small-thumb-media img:hover, html.gk .thumb-media img:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
html.gk .thumb-text, html.gk .small-thumb-text { font-size: 12px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center; }

/* Header de blog / groupe */
html.gk #main-container-header {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  box-shadow: var(--shadow); padding: 22px; margin: 0 !important; overflow: hidden;
}
html.gk #header-image img { max-width: 100%; height: auto; border-radius: var(--radius-sm); display: block; margin: 0 auto; }

/* Page image plein format */
html.gk .gallery-real-size-image { text-align: center; }
html.gk .gallery-real-size-image img { border-radius: var(--radius); box-shadow: var(--shadow-lg); height: auto; }
html.gk .option-link { text-align: center; margin: 14px 0; font-weight: 600; }

/* Tooltip */
html.gk #dhtmltooltip {
  width: auto !important; max-width: 260px; background: var(--text) !important; color: var(--bg) !important;
  border: 0 !important; border-radius: 8px; padding: 6px 10px !important; font-size: 12.5px; font-weight: 600; box-shadow: var(--shadow-lg);
}
html.gk #dhtmlpointer { display: none !important; }

/* ---------- Espace membre ---------- */
/* Titres d'encadrés repliables */
html.gk .box-title > div[onclick] { display: flex; align-items: center; gap: 8px; flex: 1; cursor: pointer; flex-wrap: wrap; }
html.gk .box-triangle { margin-left: auto; display: inline-flex; opacity: .6; transition: opacity .15s; }
html.gk .box-title > div[onclick]:hover .box-triangle { opacity: 1; }
html.gk.gk-dark .box-triangle img, html.gk.gk-dark .box-title > img, html.gk.gk-dark .box-title > div > img { filter: invert(1) hue-rotate(180deg); }
html.gk .box-indication { width: 100%; font-size: 11.5px; font-weight: 500; letter-spacing: 0; color: var(--muted) !important; text-transform: none !important; }
html.gk .box-indication:has(span:empty) { display: none; }

/* Menu d'administration (colonne de gauche) */
html.gk #administration-container { padding: 8px !important; }
html.gk .administration-menu-category {
  border: 0 !important; background: none !important; padding: 10px 10px 4px !important;
  font-size: 11.5px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--muted);
}
html.gk .administration-menu-text { padding: 0 !important; font-size: 14px; }
html.gk .administration-menu-text img { display: none; }
html.gk .administration-menu-text a {
  display: block; padding: 8px 10px; border-radius: var(--radius-sm); color: var(--text-soft) !important; text-transform: none;
}
html.gk .administration-menu-text a::first-letter { text-transform: uppercase; }
html.gk .administration-menu-text a:hover { background: var(--surface-2); color: var(--text) !important; }
html.gk .administration-menu-text a.gk-active { background: var(--accent-soft); color: var(--accent) !important; font-weight: 600; }

/* Fils d'activité, demandes d'amis, gestion des amis / groupes */
html.gk .feed-member-box, html.gk .request-member-box, html.gk .management-member-box, html.gk .profile-feed-member-box {
  display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px !important; height: auto !important;
  border: 0 !important; border-top: 1px solid var(--border) !important;
}
html.gk .feed-member-box:first-child, html.gk .management-member-box:first-child { border-top: 0 !important; }
html.gk .feed-member-avatar, html.gk .request-member-avatar, html.gk .management-member-avatar { float: none !important; flex: none; }
html.gk .feed-member-avatar img, html.gk .request-member-avatar img, html.gk .management-member-avatar img {
  width: 44px !important; height: 44px !important; border-radius: 50% !important; object-fit: cover; border: 0 !important; margin: 0 !important;
}
html.gk .feed-member-information, html.gk .request-member-information, html.gk .management-member-information { flex: 1; min-width: 0; padding: 0 !important; height: auto; }
html.gk .feed-member-name, html.gk .request-member-name, html.gk .management-member-name { font-size: 13px; color: var(--muted); display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; }
html.gk .management-member-name .member { font-size: 15px; }
html.gk .management-member-cross { margin-left: auto; }
html.gk.gk-dark .management-member-cross img, html.gk.gk-dark .notification-cross img { filter: invert(1); }
html.gk .feed-member-text, html.gk .request-member-text { font-size: 14px; font-weight: 500; color: var(--text-soft); margin-top: 2px; }
html.gk .management-member-text { font-size: 13.5px; color: var(--text-soft); }
html.gk .management-member-text .bold { color: var(--muted); }
html.gk .feed-member-link { color: var(--accent) !important; font-weight: 600; }
html.gk .feed-member-information .medium-text {
  margin-top: 8px; padding: 8px 12px; border-left: 3px solid var(--border); background: var(--surface-2);
  border-radius: 0 8px 8px 0; font-size: 14px; color: var(--text-soft); font-style: italic;
}
html.gk .feed-member-options, html.gk .request-member-options { margin-top: 8px !important; display: flex; flex-wrap: wrap; gap: 6px; font-size: 0; }
html.gk .feed-member-options img, html.gk .request-member-options img { display: none; }
html.gk .feed-member-options a, html.gk .request-member-options a {
  font-size: 12.5px !important; font-weight: 600; padding: 4px 10px; border-radius: 999px;
  background: var(--surface-2); border: 1px solid var(--border); color: var(--text-soft) !important;
}
html.gk .feed-member-options a:hover, html.gk .request-member-options a:hover { border-color: var(--accent); color: var(--accent) !important; }
html.gk #request-list:empty::before, html.gk #messenger-list:empty::before {
  content: "Rien pour le moment"; display: block; padding: 6px 0; font-size: 13px; color: var(--muted); text-align: center;
}
html.gk #messenger-list { background: transparent !important; }
html.gk #friend-cloud-container { padding: 14px 16px !important; margin: 0 !important; }
html.gk .thumb-media img[width] { width: 70px !important; height: 70px !important; }

/* Édition du profil : champs modifiables au clic */
html.gk .form-textarea-field > span[id$="-text"] {
  display: inline-block; min-width: 220px; min-height: 1.4em; box-sizing: border-box; padding: 8px 12px; border-radius: var(--radius-sm);
  background: var(--surface-2); border: 1px solid var(--border); color: var(--text); font-size: 14.5px; cursor: text;
  transition: border-color .15s;
}
html.gk .form-textarea-field > span[id$="-text"]:hover { border-color: var(--accent); }
html.gk .form-textarea-field > span[id$="-text"]:empty::before { content: "—"; color: var(--muted); }
html.gk .form-textarea-field form { display: inline-flex; flex-wrap: wrap; gap: 6px; align-items: center; }
html.gk .form-textarea-field input[type="text"], html.gk .form-textarea-field input[type="password"], html.gk .form-textarea-field select { min-width: 260px; max-width: 100%; }
html.gk .form-textarea-field input.submit { padding: 8px 14px; font-size: 13px; }
html.gk .form-textarea-field input.submit[value="annuler"] { background: var(--surface-3) !important; color: var(--text) !important; box-shadow: none; }
html.gk .box-container > form > .form-textarea, html.gk .box-container > .form-textarea { padding: 6px 0 10px !important; }
html.gk .form-textarea .medium-title { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); }
html.gk .form-textarea .medium-title:hover { border-color: var(--accent); }

/* Autocomplétion (destinataire de message…) */
html.gk .autocomplete { background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: var(--radius-sm); box-shadow: var(--shadow-lg); overflow: hidden; z-index: 100; }
html.gk .autocomplete ul { font-size: 14.5px !important; }
html.gk .autocomplete ul li { padding: 8px 12px !important; color: var(--text); }
html.gk .autocomplete ul li.selected { background: var(--accent-soft) !important; color: var(--accent); }

/* Galeries / onglets de catégories */
html.gk #gallery-frame { background: transparent !important; border: 0 !important; box-shadow: none; overflow: visible; }
html.gk .gallery-options { display: flex; flex-wrap: wrap; gap: 6px; font-size: 0; margin: 0 0 12px; }
html.gk .gallery-options a {
  font-size: 13px !important; font-weight: 600; padding: 6px 12px; border-radius: 999px;
  background: var(--surface); border: 1px solid var(--border); color: var(--text-soft) !important;
}
html.gk .gallery-options a:hover { border-color: var(--accent); color: var(--accent) !important; }
html.gk .tab-fix, html.gk ul.tab > li {
  display: inline-block; float: left; padding: 6px 14px; margin: 0 6px 8px 0; border-radius: 999px; list-style: none;
  background: var(--surface-2) !important; border: 1px solid var(--border) !important; color: var(--text-soft); font-size: 13px; font-weight: 600; cursor: pointer;
}
html.gk .tab-fix { background: var(--accent) !important; border-color: var(--accent) !important; color: #fff; }
html.gk ul.tab { margin: 0; padding: 0; }
html.gk #gallery-media-container, html.gk #profile-gallery-media-container, html.gk #media-bag-droppable {
  clear: both; background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: var(--radius); padding: 14px !important;
}
html.gk #media-bag-droppable { border-style: dashed !important; color: var(--accent); text-align: center; }
html.gk #gallery-media-sortable:empty::before { content: "Aucun média pour le moment"; display: block; padding: 24px; color: var(--muted); grid-column: 1 / -1; }
html.gk.gk-dark #trashcan img { filter: invert(1); }
html.gk .page-navigation:not(:empty) { margin: 14px 0; text-align: center; font-weight: 600; }
html.gk .page-navigation a { padding: 6px 10px; border-radius: 8px; }
html.gk .page-navigation a:hover { background: var(--surface-2); }
html.gk #website-list, html.gk #email-list, html.gk #location-list, html.gk #file-list { margin: 8px 0; }

/* ---------- Rédaction : modification sur place, aperçu ---------- */
/* Le site surligne en crème (illisible en sombre) : on remplace par un survol discret */
html.gk .gk-editable, html.gk [title="click to edit"] {
  background-color: transparent !important; border-radius: 6px; cursor: pointer;
  transition: box-shadow .15s, background-color .15s;
}
html.gk .gk-editable:hover, html.gk [title="click to edit"]:hover {
  background-color: var(--accent-soft) !important; box-shadow: 0 0 0 4px var(--accent-soft), 0 0 0 5px color-mix(in srgb, var(--accent) 45%, transparent);
}
html.gk .big-title .gk-editable:hover::after { content: " ✎"; color: var(--accent); font-size: .7em; }
html.gk .inplaceeditor-form { display: block; margin: 6px 0 12px; }
html.gk .inplaceeditor-form input.editor_field { width: 100%; box-sizing: border-box; }
html.gk .big-title .inplaceeditor-form input.editor_field { font-size: 24px; font-weight: 700; padding: 10px 14px; }
html.gk .inplaceeditor-form textarea.editor_field { font-size: 15px; line-height: 1.6; }
/* Le site colore le champ d'édition en crème (#textarea-edit) : illisible en sombre */
html.gk .inplaceeditor-form .editor_field {
  background: var(--surface-2) !important; color: var(--text) !important;
  border: 1px solid var(--border) !important; border-radius: var(--radius-sm) !important; padding: 12px 14px !important;
}
html.gk .inplaceeditor-form .editor_field:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px var(--accent-soft); background: var(--surface) !important; }
html.gk .inplaceeditor-form a { margin-left: 8px; color: var(--muted) !important; font-size: 13px; }
html.gk .inplaceeditor-saving { opacity: .6; font-style: italic; background: none !important; }
html.gk .article-source .gk-editable { color: var(--muted); }

/* Liste d'articles d'un blog : liens commentaires en boutons */
html.gk .comment-number:has(> a) { font-size: 0 !important; gap: 8px; flex-wrap: wrap; text-transform: none; }
html.gk .comment-number:has(> a) > img { display: none; }
html.gk .comment-number > a {
  font-size: 13.5px; font-weight: 600; padding: 7px 14px; border-radius: 999px; text-transform: none;
  border: 1px solid var(--border); background: var(--surface-2); color: var(--text-soft) !important;
}
html.gk .comment-number > a:first-of-type { background: var(--accent); border-color: var(--accent); color: #fff !important; }
html.gk .comment-number > a:hover { border-color: var(--accent); }
html.gk .comment-number > a:first-of-type::first-letter, html.gk .comment-number > a::first-letter { text-transform: uppercase; }

/* Vue visiteur sur ses propres articles */
.gk-owner-bar {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  margin: 0 0 14px; padding: 10px 12px 10px 16px; border-radius: var(--radius);
  background: var(--surface); border: 1px dashed color-mix(in srgb, var(--accent) 50%, var(--border)); box-shadow: var(--shadow);
}
.gk-owner-label { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--text); }
.gk-owner-label small { font-weight: 400; color: var(--muted); }
.gk-owner-label svg { width: 18px; height: 18px; color: var(--accent); }
.gk-owner-bar .gk-seg { min-width: 260px; }
.gk-owner-bar .gk-seg button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
.gk-owner-bar .gk-seg svg { width: 15px; height: 15px; }
html.gk-read-mode :not(.comment-text) > .gk-editable { cursor: inherit; }
html.gk-read-mode :not(.comment-text) > .gk-editable:hover { background-color: transparent !important; box-shadow: none !important; }
html.gk-read-mode .big-title .gk-editable:hover::after { content: none; }
html.gk-read-mode .comment-box:not(.gk-mine) .comment-cross:has(a[href*="delete_"]),
html.gk-read-mode .comment-box:not(.gk-mine) .gk-act-delete { display: none; }
html.gk-read-mode .tag:has([id^="tag-list"]:empty) { display: none !important; }
html.gk-read-mode .tag span[onclick] { pointer-events: none; }
html.gk-read-mode .article-source:has(.gk-editable):not(:has(a[href^="http"])) { display: none; }

/* Barre d'outils BBCode */
html.gk .form-textarea-field:has(> .tagSelection) {
  display: flex; flex-wrap: wrap; gap: 6px; padding: 8px; margin-bottom: 8px;
  background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-sm);
}
html.gk .tagSelection { background: var(--surface) !important; color: var(--text) !important; }
html.gk .tagSelection:hover { background: var(--accent-soft) !important; }
html.gk .tagSelection:hover a, html.gk .tagSelection a:hover { color: var(--accent) !important; }
html.gk #hover { color: var(--text-soft) !important; }
html.gk .gk-smiley-btn { position: relative; }
html.gk .gk-smiley-pop {
  display: none; position: absolute; left: 0; top: calc(100% + 6px); z-index: 60; width: 248px; padding: 8px;
  grid-template-columns: repeat(7, 1fr); gap: 2px;
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); box-shadow: var(--shadow-lg);
}
html.gk .gk-smiley-btn.gk-open .gk-smiley-pop { display: grid; }
html.gk .gk-smiley-pop button { border: 0; background: none; padding: 4px; border-radius: 6px; cursor: pointer; display: grid; place-items: center; }
html.gk .gk-smiley-pop button:hover { background: var(--surface-3); }
html.gk .gk-counter { font-size: 12px; color: var(--muted); text-align: right; margin-top: 4px; }
html.gk .gk-counter.gk-warn { color: var(--orange); font-weight: 600; }
html.gk #add-article-form input[type="text"] { width: 100%; }

/* Aperçu en direct */
html.gk .gk-preview { flex: 1 1 100%; width: 100%; box-sizing: border-box; margin-top: 10px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); overflow: hidden; text-align: left; }
html.gk .gk-preview.gk-compact.gk-empty { display: none; }
html.gk .gk-preview-head {
  display: flex; justify-content: space-between; align-items: center; padding: 7px 14px;
  background: var(--surface-2); border-bottom: 1px solid var(--border);
  font-size: 11.5px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--muted);
}
html.gk .gk-preview-head small { font-weight: 500; letter-spacing: 0; text-transform: none; }
html.gk .gk-preview-body {
  padding: 16px 18px; font-size: 16px; line-height: 1.7; color: var(--text-soft);
  overflow-wrap: anywhere; max-height: 70vh; overflow-y: auto;
}
html.gk .gk-compact .gk-preview-body { font-size: 15px; padding: 12px 14px; max-height: 320px; }
html.gk .gk-preview.gk-empty .gk-preview-body::before { content: "L'aperçu de votre texte s'affichera ici."; color: var(--muted); font-style: italic; }
html.gk .gk-preview-body b { color: var(--text); }
html.gk .gk-preview-body a { color: var(--accent) !important; text-decoration: underline; text-underline-offset: 3px; }
html.gk .gk-preview-body img { max-width: 100%; height: auto; border-radius: 8px; vertical-align: middle; }
html.gk .gk-preview-body img.gk-smiley { border-radius: 0; }
html.gk .gk-preview-body iframe { width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 8px; display: block; margin: 8px 0; }
html.gk .gk-preview-body .spoil:hover { background: var(--surface-3) !important; color: var(--text) !important; }
html.gk .gk-quote {
  margin: 10px 0; padding: 10px 16px; border-left: 4px solid var(--accent); background: var(--surface-2);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
html.gk .gk-quote-author { font-size: 13px; font-weight: 700; color: var(--muted); margin-bottom: 4px; }
html.gk .box-frame:has(#add-article-form) { overflow: visible; }

/* ---------- Footer ---------- */
html.gk #footer {
  max-width: 1400px; box-sizing: border-box; margin: 40px auto 0 !important; padding: 28px 20px 10px !important;
  border-top: 1px solid var(--border); background: transparent !important; color: var(--muted);
  font-size: 13.5px; text-align: center; clear: both; width: auto !important; line-height: 2;
}
html.gk #footer a { color: var(--text-soft) !important; }
html.gk #footer a:hover { color: var(--accent) !important; }
html.gk #footer img { vertical-align: middle; height: 12px; }
html.gk #footer .language { margin: 8px 0; }
html.gk .footer-text { text-align: center; color: var(--muted); font-size: 12.5px; padding: 0 0 30px; background: transparent !important; }

/* ---------- Extras ---------- */
#gk-progress {
  position: fixed; left: 0; top: var(--topbar-h); height: 3px; width: 0; z-index: 9001;
  background: linear-gradient(90deg, #5aaef2, #f0516a); transition: width .1s linear;
}
#gk-totop {
  position: fixed; right: 22px; bottom: 22px; z-index: 8000; opacity: 0; pointer-events: none;
  transform: translateY(10px); transition: opacity .2s, transform .2s; box-shadow: var(--shadow-lg);
  width: 46px; height: 46px; background: var(--surface);
}
#gk-totop.gk-show { opacity: 1; pointer-events: auto; transform: none; }
html.gk .gk-reading-time { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); margin: -6px 0 14px; }
html.gk .gk-reading-time::before { content: "⏱"; }
html.gk img.gk-fade { opacity: 0; transition: opacity .3s; }
html.gk img.gk-fade.gk-loaded { opacity: 1; }

/* ---------- Responsive ---------- */
@media (max-width: 1240px) {
  html.gk #main-container { grid-template-columns: minmax(0, 1fr) 300px; }
  html.gk #main-container > #column-1, html.gk #main-container > #column-4 { grid-column: 1; grid-row: 2; }
  html.gk #main-container > #column-2 { grid-column: 2; grid-row: 2 / span 2; }
  html.gk #main-container > #column-0 { grid-column: 1; grid-row: 3; }
  html.gk #main-container:has(> #column-4) > #column-0 { grid-column: 2; grid-row: 2; }
  html.gk #main-container:not(:has(> #main-container-header)) > #column-1 { grid-row: 1; }
  html.gk #main-container:not(:has(> #main-container-header)) > #column-2 { grid-row: 1 / span 2; }
  html.gk #main-container:not(:has(> #main-container-header)) > #column-0 { grid-row: 2; }
  html.gk #column-0 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0 22px; align-items: start; }
  html.gk #main-container:has(> #column-4) > #column-0 { display: block; }
  #gk-search { max-width: 260px; }
}
@media (max-width: 980px) {
  #gk-nav a span { display: none; }
  #gk-nav a { padding: 9px; }
  #gk-nav svg { width: 19px; height: 19px; }
}
@media (max-width: 860px) {
  html.gk { --topbar-h: 58px; }
  html.gk #main-container, html.gk #main-container:has(> #column-4) { grid-template-columns: minmax(0, 1fr); padding: 0 12px; gap: 0; margin-top: 14px !important; }
  html.gk #main-container > div { grid-column: 1 !important; grid-row: auto !important; }
  html.gk #main-container > #main-container-header { order: 0; margin-bottom: 16px !important; }
  html.gk #main-container > #column-1, html.gk #main-container > #column-4, html.gk #main-container > #column-3 { order: 1; }
  html.gk #main-container > #column-2 { order: 2; }
  html.gk #main-container > #column-0 { order: 3; }
  html.gk #main-container:has(> #column-4) > #column-0 { order: 2; }
  html.gk #column-0 { display: block; }

  #gk-topbar .gk-inner { padding: 0 12px; gap: 10px; }
  #gk-burger { display: grid; }
  #gk-topbar .gk-spacer { display: block; }
  #gk-menu {
    display: none; position: fixed; left: 0; right: 0; top: var(--topbar-h); z-index: 8999;
    max-height: calc(100vh - var(--topbar-h)); overflow-y: auto; box-sizing: border-box;
    background: var(--surface); border-bottom: 1px solid var(--border); box-shadow: var(--shadow-lg);
    flex-direction: column; align-items: stretch; padding: 12px; gap: 10px;
  }
  html.gk-menu-open #gk-menu { display: flex; }
  #gk-search { order: -1; max-width: none; margin: 0; }
  #gk-nav { flex-direction: column; align-items: stretch; gap: 2px; }
  #gk-nav a span { display: inline; }
  #gk-nav a { padding: 12px 14px; border-radius: var(--radius-sm); font-size: 16px; }
  #gk-nav svg { width: 18px; height: 18px; }
  #gk-account { border-top: 1px solid var(--border); padding-top: 10px; }
  #gk-account #sub-menu-lign { flex-wrap: wrap; }
  #gk-user { gap: 6px; }
  #gk-user-btn { padding: 0 4px; }
  #gk-user-btn .gk-user-name, #gk-user-btn .gk-chevron { display: none; }
  #gk-user-panel { position: fixed; left: 8px; right: 8px; top: calc(var(--topbar-h) + 6px); width: auto; }

  html.gk .article-container > .article-information { padding: 0 18px; }
  html.gk .article-container > :not(.article-information) { margin-left: 18px; margin-right: 18px; }
  html.gk .game-header-image { margin: 0 -18px 4px; }
  html.gk .big-title { font-size: 24px; margin-top: 18px !important; }
  html.gk .article-container .medium-text { font-size: 16.5px; }
  html.gk #container { aspect-ratio: 16 / 9; }
  html.gk .gk-slide-title { font-size: 19px; }
  html.gk #container .button { opacity: 1; width: 34px !important; height: 34px !important; }
  html.gk #profile-container { grid-template-columns: 1fr; }
  html.gk #profile-column-0 #profile-big-avatar { max-width: 260px; }
}
@media (max-width: 560px) {
  html.gk #column-1 #news-frame .tip-container { flex-direction: column; gap: 12px; padding: 14px; }
  html.gk #column-1 #news-frame .article-thumb { width: 100%; }
  html.gk #column-1 #news-frame .article-thumb img { width: 100% !important; height: auto !important; aspect-ratio: 16 / 9; }
  html.gk .element-container { flex-direction: column; align-items: flex-start; gap: 4px; padding: 12px 14px; }
  html.gk .element-detail { text-align: left; }
  html.gk .element-detail:has(a.member) { order: -1; margin-bottom: 2px; }
  html.gk #element-list .element-container { gap: 6px; }
  html.gk .element-title { font-size: 15.5px; }
  html.gk .element-container.brown-background { display: none; }
  #gk-write { display: none !important; }
  #gk-topbar .gk-inner { gap: 6px; }
  html.gk .box-frame, html.gk .box-frame-external, html.gk .box-container-external-new { margin-bottom: 16px !important; }
}

/* ---------- Réglages ---------- */
#gk-settings-btn span { display: none; }
#gk-settings {
  position: fixed; inset: 0; z-index: 10000; display: grid; place-items: center; padding: 16px;
  background: rgba(5, 8, 12, .55); backdrop-filter: blur(4px); font-family: var(--font); animation: gk-fade .15s ease-out;
}
@keyframes gk-fade { from { opacity: 0; } }
.gk-settings-card {
  width: min(560px, 100%); max-height: calc(100vh - 32px); display: flex; flex-direction: column;
  background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: 18px; box-shadow: var(--shadow-lg); overflow: hidden;
}
.gk-settings-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
.gk-settings-head h2 { font-size: 19px; font-weight: 800; margin: 0; color: var(--text); }
.gk-settings-body { overflow-y: auto; padding: 4px 20px 12px; }
.gk-settings-body section { padding: 14px 0; border-bottom: 1px solid var(--border); }
.gk-settings-body section:last-child { border-bottom: 0; }
.gk-settings-body h3 { font-size: 11.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin: 0 0 12px; }
.gk-field { margin-bottom: 14px; }
.gk-field:last-child { margin-bottom: 0; }
.gk-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text); }
.gk-hint { font-size: 12.5px; line-height: 1.5; color: var(--muted); margin: 8px 0 0; }
.gk-seg { display: flex; padding: 3px; gap: 3px; border-radius: 12px; background: var(--surface-3); }
.gk-seg button {
  flex: 1; border: 0; padding: 8px 10px; border-radius: 9px; cursor: pointer; background: transparent;
  font: 600 13.5px var(--font); color: var(--text-soft); transition: background .15s, color .15s;
}
.gk-seg button:hover { color: var(--text); }
.gk-seg button.gk-on { background: var(--surface); color: var(--accent); box-shadow: var(--shadow); }
.gk-toggle { display: flex; align-items: center; gap: 12px; padding: 8px 0; cursor: pointer; }
.gk-toggle input { position: absolute; opacity: 0; pointer-events: none; }
.gk-switch { flex: none; width: 40px; height: 24px; border-radius: 999px; background: var(--surface-3); border: 1px solid var(--border); position: relative; transition: background .2s; }
.gk-switch::after { content: ""; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.3); transition: transform .2s; }
.gk-toggle input:checked + .gk-switch { background: var(--accent); border-color: var(--accent); }
.gk-toggle input:checked + .gk-switch::after { transform: translateX(16px); }
.gk-toggle input:focus-visible + .gk-switch { box-shadow: 0 0 0 3px var(--accent-soft); }
.gk-toggle-text { font-size: 14px; font-weight: 600; display: flex; flex-direction: column; }
.gk-toggle-text small { font-size: 12.5px; font-weight: 400; color: var(--muted); }
.gk-checks { display: flex; flex-wrap: wrap; gap: 8px; }
.gk-checks label {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; cursor: pointer;
  border: 1px solid var(--border); background: var(--surface-2); font-size: 13.5px; font-weight: 600; color: var(--text-soft); text-transform: capitalize;
}
.gk-checks label:has(input:checked) { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
.gk-checks input { accent-color: var(--accent); }
#gk-settings textarea {
  width: 100% !important; min-height: 110px; font: 13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace !important;
}
.gk-settings-foot { display: flex; justify-content: space-between; gap: 10px; padding: 14px 20px; border-top: 1px solid var(--border); background: var(--surface-2); }
.gk-btn, .gk-btn-ghost { border-radius: 999px; padding: 9px 18px; font: 700 14px var(--font); cursor: pointer; }
.gk-btn { border: 0; background: var(--accent); color: #fff; }
.gk-btn-ghost { border: 1px solid var(--border); background: var(--surface); color: var(--text-soft); }
.gk-btn-ghost:hover { color: var(--red); border-color: var(--red); }

/* Rubriques masquées */
html.gk-nav-hide-home #gk-nav a[data-key="home"], html.gk-nav-hide-news #gk-nav a[data-key="news"],
html.gk-nav-hide-blog #gk-nav a[data-key="blog"], html.gk-nav-hide-video #gk-nav a[data-key="video"],
html.gk-nav-hide-review #gk-nav a[data-key="review"] { display: none; }

/* Taille du texte des articles */
html[data-gk-text="l"] .article-container .medium-text, html[data-gk-text="l"] .gk-preview-body { font-size: 19px !important; }
html[data-gk-text="xl"] .article-container .medium-text, html[data-gk-text="xl"] .gk-preview-body { font-size: 21px !important; }
html[data-gk-text="l"] .comment-text { font-size: 16.5px !important; }
html[data-gk-text="xl"] .comment-text { font-size: 18px !important; }

/* Colonnes masquées */
html.gk.gk-hide-left #main-container > #column-0, html.gk.gk-hide-right #main-container > #column-2 { display: none !important; }
html.gk.gk-hide-right #main-container:has(> #column-2) { grid-template-columns: 300px minmax(0, 1fr); }
html.gk.gk-hide-left #main-container:has(> #column-2) { grid-template-columns: minmax(0, 1fr) 320px; }
html.gk.gk-hide-left #main-container > #column-1 { grid-column: 1; }
html.gk.gk-hide-left #main-container > #column-2 { grid-column: 2; }
html.gk.gk-hide-left #main-container:has(> #column-4) { grid-template-columns: minmax(0, 1fr); }
html.gk.gk-hide-left #main-container > #column-4 { grid-column: 1; }
html.gk.gk-hide-left.gk-hide-right #main-container:has(> #column-2) { grid-template-columns: minmax(0, 1fr); }
html.gk.gk-hide-left.gk-hide-right #main-container > #column-1 { width: 100% !important; max-width: 980px; justify-self: center; }
@media (max-width: 1240px) {
  html.gk.gk-hide-right #main-container:has(> #column-2) { grid-template-columns: minmax(0, 1fr); }
  html.gk.gk-hide-left #main-container > #column-2 { grid-row: 2; }
  html.gk.gk-hide-left #main-container:not(:has(> #main-container-header)) > #column-2 { grid-row: 1; }
}
@media (max-width: 860px) {
  #gk-settings-btn { width: auto; height: auto; border-radius: var(--radius-sm); justify-content: flex-start; display: flex; gap: 12px; padding: 12px 14px; font: 600 16px var(--font); }
  #gk-settings-btn span { display: inline; }
  html.gk #main-container, html.gk.gk-hide-left #main-container, html.gk.gk-hide-right #main-container { grid-template-columns: minmax(0, 1fr) !important; }
}

/* ---------- Densité des listes de l'accueil ---------- */
html.gk-hide-slider #column-1 #container, html.gk-hide-slider #column-1 #container + br { display: none !important; }
/* Moyenne */
html[data-gk-list="medium"] #column-1 #news-frame .tip-container { padding: 12px 16px; gap: 14px; }
html[data-gk-list="medium"] #column-1 #news-frame .article-thumb img { width: 150px !important; height: 84px !important; }
html[data-gk-list="medium"] #column-1 #news-frame .medium-title { font-size: 16px; }
html[data-gk-list="medium"] #column-1 #news-frame .tip-container .medium-text {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 13.5px; margin-top: 4px;
}
html[data-gk-list="medium"] #blog-frame .tip-container { padding: 9px 14px; gap: 10px; }
html[data-gk-list="medium"] #blog-frame .article-thumb img { width: 34px !important; height: 34px !important; }
html[data-gk-list="medium"] .tip-container-new { height: 112px !important; }
/* Condensée */
html[data-gk-list="compact"] #column-1 #news-frame .tip-container { padding: 9px 16px; gap: 0; }
html[data-gk-list="compact"] #column-1 #news-frame .article-thumb,
html[data-gk-list="compact"] #column-1 #news-frame .tip-container .medium-text,
html[data-gk-list="compact"] #blog-frame .article-thumb { display: none; }
html[data-gk-list="compact"] #column-1 #news-frame .medium-title { font-size: 15px; font-weight: 600; }
html[data-gk-list="compact"] #column-1 #news-frame .details, html[data-gk-list="compact"] #blog-frame .details { margin-top: 1px; }
html[data-gk-list="compact"] #blog-frame .tip-container { padding: 7px 14px; }
html[data-gk-list="compact"] #blog-frame .small-title { font-size: 13.5px; }
html[data-gk-list="compact"] #blog-frame .details + .details { display: inline-flex; }
html[data-gk-list="compact"] .tip-container-new { height: 66px !important; }
html[data-gk-list="compact"] .tip-container-new .medium-title {
  font-size: 13px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; padding-right: 54px;
}
html[data-gk-list="compact"] .tip-container-new a.fill-div { padding: 8px 12px; }
html[data-gk-list="compact"] .tip-container-new .comments-popular, html[data-gk-list="compact"] .tip-container-new .score { top: 50%; transform: translateY(-50%); }
html[data-gk-list="compact"] .tip-container-new .details { display: none; }
@media (max-width: 560px) {
  html[data-gk-list="medium"] #column-1 #news-frame .tip-container { flex-direction: row; gap: 12px; padding: 12px 14px; }
  html[data-gk-list="medium"] #column-1 #news-frame .article-thumb { width: auto; }
  html[data-gk-list="medium"] #column-1 #news-frame .article-thumb img { width: 112px !important; height: 63px !important; aspect-ratio: auto; }
  html[data-gk-list="medium"] #column-1 #news-frame .medium-title { font-size: 15px; }
  html[data-gk-list="medium"] #column-1 #news-frame .tip-container .medium-text { display: none; }
  html[data-gk-list="compact"] #column-1 #news-frame .tip-container { padding: 10px 14px; gap: 0; }
}

@media (prefers-reduced-motion: reduce) {
  html.gk *, html.gk *::before, html.gk *::after { transition: none !important; }
}
`;

  const style = document.createElement('style');
  style.id = 'gk-modern-style';
  style.textContent = CSS;
  (document.head || root).appendChild(style);
  (document.head || root).appendChild(customStyle);

  // Le site n'a pas de meta viewport : indispensable pour le rendu mobile
  const viewport = document.createElement('meta');
  viewport.name = 'viewport';
  viewport.content = 'width=device-width, initial-scale=1';
  (document.head || root).appendChild(viewport);

  /* ------------------------------------------------------------------ */
  /* Utilitaires                                                        */
  /* ------------------------------------------------------------------ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };

  const ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    news: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h13a1 1 0 0 1 1 1v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2z"/><path d="M18 8h2a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2"/><path d="M8 8h6M8 12h6M8 16h4"/></svg>',
    blog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="15" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3"/></svg>',
    review: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    sun: '<svg class="gk-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="gk-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15 6-6 6 6"/></svg>',
    chevron: '<svg class="gk-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 20a6.5 6.5 0 0 0-2.5-5.1"/></svg>',
    groups: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    stream: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    reply: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 6 6v5"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
    dot: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/></svg>',
  };

  // Section courante, déduite de l'URL
  const path = location.pathname;
  const section =
    /^\/(index\.html)?$/.test(path) ? 'home' :
    /^\/(newslist|news|webnews)/.test(path) ? 'news' :
    /^\/(bloglist|blog|group)/.test(path) ? 'blog' :
    /^\/video/.test(path) ? 'video' :
    /^\/(reviewlist|review|previews|press|add_review)/.test(path) ? 'review' : '';

  const navKey = (href) => {
    if (/index\.html$|^\/$/.test(href)) return 'home';
    if (/newslist/.test(href)) return 'news';
    if (/bloglist/.test(href)) return 'blog';
    if (/videolist/.test(href)) return 'video';
    if (/reviewlist/.test(href)) return 'review';
    return '';
  };

  /* ------------------------------------------------------------------ */
  /* Barre de navigation                                                */
  /* ------------------------------------------------------------------ */
  function buildTopbar() {
    if ($('#gk-topbar')) return;
    const bar = h(`
      <header id="gk-topbar">
        <div class="gk-inner">
          <a class="gk-logo" href="/index.html" title="Gamekyo">
            <span class="gk-logo-classic">Gamekyo</span>
            <span class="gk-logo-min"><span class="gk-logo-mark">G</span><span class="gk-logo-text">Game<b>kyo</b></span></span>
            <img class="gk-logo-img" src="/images/4.jpg" alt="Gamekyo" />
          </a>
          <div id="gk-menu">
            <nav id="gk-nav"></nav>
            <form id="gk-search" method="post" action="/search.html" role="search">
              ${ICONS.search}
              <input type="search" name="search" placeholder="Rechercher un jeu, une news…" autocomplete="off" />
            </form>
            <div id="gk-account"></div>
            <button id="gk-settings-btn" class="gk-icon-btn" type="button" title="Réglages Gamekyo Modern">${ICONS.settings}<span>Réglages</span></button>
          </div>
          <div class="gk-spacer"></div>
          <button id="gk-theme" class="gk-icon-btn" type="button" title="Basculer le mode sombre">${ICONS.sun}${ICONS.moon}</button>
          <button id="gk-burger" class="gk-icon-btn" type="button" title="Menu">${ICONS.menu}</button>
        </div>
      </header>`);

    const nav = $('#gk-nav', bar);
    $$('#main-menu-lign a').forEach((a) => {
      const key = navKey(a.getAttribute('href') || '');
      const link = h(`<a href="${a.getAttribute('href')}" data-key="${key}">${ICONS[key] || ''}<span></span></a>`);
      $('span', link).textContent = a.textContent.trim();
      if (key && key === section) link.classList.add('gk-active');
      nav.appendChild(link);
    });

    // On déplace (sans cloner) le menu compte pour conserver les éventuelles mises à jour dynamiques
    const sub = $('#sub-menu-lign');
    const account = $('#account');
    if (account) {
      buildUserMenu(bar, account, sub);
    } else if (sub) {
      Array.from(sub.childNodes).forEach((n) => {
        if (n.nodeType === 3 && /^[\s|]*$/.test(n.textContent)) n.remove();
        else if (n.nodeType === 3) n.textContent = n.textContent.replace(/^\s*\|\s*|\s*\|\s*$/g, ' ');
      });
      $('#gk-account', bar).appendChild(sub);
    }

    document.body.prepend(bar);

    $('#gk-theme', bar).addEventListener('click', () => {
      localStorage.setItem(THEME_KEY, isDark() ? 'light' : 'dark');
      applyTheme();
    });
    $('#gk-burger', bar).addEventListener('click', () => root.classList.toggle('gk-menu-open'));
    $('#gk-settings-btn', bar).addEventListener('click', () => { root.classList.remove('gk-menu-open'); openSettings(); });
    $('#gk-search', bar).addEventListener('submit', (e) => {
      if (!$('input', e.currentTarget).value.trim()) e.preventDefault();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Panneau de réglages                                                */
  /* ------------------------------------------------------------------ */
  function openSettings() {
    if ($('#gk-settings')) return;
    const navLabels = {};
    $$('#gk-nav a[data-key]').forEach((a) => { navLabels[a.dataset.key] = a.textContent.trim(); });
    const themeValue = savedTheme() || 'auto';

    const seg = (name, value, options) => `
      <div class="gk-seg" data-name="${name}">
        ${options.map(([v, label]) => `<button type="button" data-value="${v}" class="${v === value ? 'gk-on' : ''}">${label}</button>`).join('')}
      </div>`;
    const toggle = (name, label, checked, hint = '') => `
      <label class="gk-toggle"><input type="checkbox" data-name="${name}" ${checked ? 'checked' : ''}>
        <span class="gk-switch"></span><span class="gk-toggle-text">${label}${hint ? `<small>${hint}</small>` : ''}</span></label>`;

    const modal = h(`
      <div id="gk-settings" role="dialog" aria-modal="true" aria-labelledby="gk-settings-title">
        <div class="gk-settings-card">
          <div class="gk-settings-head">
            <h2 id="gk-settings-title">Réglages</h2>
            <button type="button" class="gk-icon-btn gk-settings-close" title="Fermer">${ICONS.close}</button>
          </div>
          <div class="gk-settings-body">
            <section>
              <h3>Apparence</h3>
              <div class="gk-field"><span class="gk-label">Thème</span>
                ${seg('theme', themeValue, [['auto', 'Automatique'], ['light', 'Clair'], ['dark', 'Sombre']])}
                <p class="gk-hint">Vous utilisez Dark Reader ? Choisissez « Clair » et laissez-le gérer le sombre. En « Sombre », le script met Dark Reader en pause sur Gamekyo pour éviter un double assombrissement.</p>
              </div>
              <div class="gk-field"><span class="gk-label">Logo</span>
                ${seg('logo', settings.logo, [['classic', 'Classique'], ['minimal', 'Minimal'], ['original', "D'origine"]])}
              </div>
              <div class="gk-field"><span class="gk-label">Taille du texte des articles</span>
                ${seg('textSize', settings.textSize, [['m', 'Normale'], ['l', 'Grande'], ['xl', 'Très grande']])}
              </div>
            </section>
            <section>
              <h3>Mise en page</h3>
              ${toggle('hideLeft', 'Masquer la colonne de gauche', settings.hideLeft, 'Blogs, news liées, profil…')}
              ${toggle('hideRight', 'Masquer la colonne de droite', settings.hideRight, 'News populaires, avis, fiche du jeu, pubs…')}
              ${toggle('hideSlider', "Masquer le diaporama de l'accueil", settings.hideSlider, 'Les news commencent directement en haut de page')}
              <div class="gk-field"><span class="gk-label">Affichage des listes de l'accueil</span>
                ${seg('listView', settings.listView, [['full', 'Complète'], ['medium', 'Moyenne'], ['compact', 'Condensée']])}
                <p class="gk-hint">Complète : grandes images et résumé. Moyenne : petites vignettes, résumé court. Condensée : titres seuls, pour tout voir d'un coup d'œil.</p>
              </div>
              <div class="gk-field"><span class="gk-label">Rubriques du menu</span>
                <div class="gk-checks">
                  ${NAV_KEYS.filter((k) => navLabels[k]).map((k) => `<label><input type="checkbox" data-nav="${k}" ${settings.hiddenNav.includes(k) ? '' : 'checked'}> ${navLabels[k]}</label>`).join('')}
                </div>
              </div>
            </section>
            <section>
              <h3>Avancé</h3>
              <div class="gk-field"><span class="gk-label">CSS personnalisé</span>
                <textarea data-name="customCss" spellcheck="false" placeholder="/* Vos propres règles, appliquées en dernier. Exemple : */\n#gk-topbar { background: #6da2d5; }"></textarea>
                <p class="gk-hint">Appliqué en direct et conservé dans ce navigateur.</p>
              </div>
            </section>
          </div>
          <div class="gk-settings-foot">
            <button type="button" class="gk-btn-ghost" data-action="reset">Réinitialiser</button>
            <button type="button" class="gk-btn" data-action="close">Terminé</button>
          </div>
        </div>
      </div>`);
    $('textarea[data-name="customCss"]', modal).value = settings.customCss;

    const update = (patch) => { Object.assign(settings, patch); saveSettings(); applySettings(); };

    $$('.gk-seg', modal).forEach((group) => {
      group.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-value]');
        if (!btn) return;
        $$('button', group).forEach((b) => b.classList.toggle('gk-on', b === btn));
        const { name } = group.dataset;
        const value = btn.dataset.value;
        if (name === 'theme') {
          if (value === 'auto') localStorage.removeItem(THEME_KEY); else localStorage.setItem(THEME_KEY, value);
          applyTheme();
        } else {
          update({ [name]: value });
        }
      });
    });
    $$('input[data-name]', modal).forEach((input) => {
      input.addEventListener('change', () => update({ [input.dataset.name]: input.checked }));
    });
    $$('input[data-nav]', modal).forEach((input) => {
      input.addEventListener('change', () => {
        update({ hiddenNav: $$('input[data-nav]', modal).filter((i) => !i.checked).map((i) => i.dataset.nav) });
      });
    });
    let cssTimer;
    $('textarea[data-name="customCss"]', modal).addEventListener('input', (e) => {
      clearTimeout(cssTimer);
      cssTimer = setTimeout(() => update({ customCss: e.target.value }), 250);
    });

    const close = () => { modal.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    $('.gk-settings-close', modal).addEventListener('click', close);
    $('[data-action="close"]', modal).addEventListener('click', close);
    $('[data-action="reset"]', modal).addEventListener('click', () => {
      if (!confirm('Revenir aux réglages par défaut ?')) return;
      settings = { ...DEFAULTS, hiddenNav: [] };
      saveSettings();
      localStorage.removeItem(THEME_KEY);
      applySettings();
      applyTheme();
      close();
      openSettings();
    });

    document.body.appendChild(modal);
    $('.gk-seg button.gk-on', modal)?.focus();
  }

  /* ------------------------------------------------------------------ */
  /* Menu utilisateur (mode connecté)                                   */
  /* ------------------------------------------------------------------ */
  const userLinkIcon = (href) => {
    if (/sign_out/.test(href)) return ICONS.logout;
    if (/my_home/.test(href)) return ICONS.home;
    if (/my_messages|new_message/.test(href)) return ICONS.mail;
    if (/stream/.test(href)) return ICONS.stream;
    if (/member_friends/.test(href)) return ICONS.users;
    if (/member_groups/.test(href)) return ICONS.groups;
    if (/gallery/.test(href)) return ICONS.image;
    if (/^\/blog\d/.test(href)) return ICONS.blog;
    if (/^\/member\d/.test(href)) return ICONS.user;
    return ICONS.dot;
  };

  function buildUserMenu(bar, account, sub) {
    const avatar = $('#account-avatar img', account);
    const nameLink = $('#account-name a', account);
    const name = nameLink ? nameLink.textContent.trim() : '';

    const wrap = h(`
      <div id="gk-user">
        <a id="gk-write" class="gk-icon-btn" href="/blog_add_type.html" title="Écrire un article">${ICONS.blog}</a>
        <a id="gk-messages" class="gk-icon-btn" href="/my_messages.html" title="Messages">${ICONS.mail}</a>
        <button id="gk-user-btn" type="button" aria-haspopup="true" aria-expanded="false">
          <img alt="" /><span class="gk-user-name"></span>${ICONS.chevron}
        </button>
        <div id="gk-user-panel" role="menu"><nav class="gk-user-links"></nav></div>
      </div>`);
    const btn = $('#gk-user-btn', wrap);
    const panel = $('#gk-user-panel', wrap);
    if (avatar) $('img', btn).src = https(avatar.getAttribute('src') || '');
    $('.gk-user-name', btn).textContent = name;

    // Carte du compte d'origine (avatar, XP, statut) : déplacée telle quelle pour garder ses formulaires
    panel.prepend(account);
    const black = $('#account-exp-black', account);
    if (black) {
      const empty = parseFloat(black.style.width) || 0;
      $('#account-exp', account)?.style.setProperty('--gk-xp', Math.max(0, 100 - empty) + '%');
    }

    const links = $('.gk-user-links', panel);
    if (sub) {
      $$('a', sub).forEach((a) => {
        const href = a.getAttribute('href') || '';
        a.innerHTML = `${userLinkIcon(href)}<span>${a.textContent.trim()}</span>`;
        if (/sign_out/.test(href)) a.classList.add('gk-logout');
        if (href === path) a.classList.add('gk-active');
        links.appendChild(a);
      });
      sub.remove();
    }

    const setOpen = (open) => {
      root.classList.toggle('gk-user-open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (open) root.classList.remove('gk-menu-open');
    };
    btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!root.classList.contains('gk-user-open')); });
    document.addEventListener('click', (e) => { if (!e.target.closest('#gk-user')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    // « Répondre » dans les défilantes ouvre le formulaire de statut, qui vit désormais dans ce panneau
    document.addEventListener('click', (e) => {
      if (e.target.closest('.post-link a')) setTimeout(() => { setOpen(true); $('#account_post')?.focus(); }, 50);
    });

    // Ordre : écrire, messages, thème, avatar (juste avant le menu burger sur mobile)
    wrap.insertBefore($('#gk-theme', bar), btn);
    $('.gk-inner', bar).insertBefore(wrap, $('#gk-burger', bar));
    root.classList.add('gk-logged');
    root.dataset.gkUser = (nameLink?.getAttribute('href') || '').replace(/^\//, '');
  }

  /* ------------------------------------------------------------------ */
  /* Améliorations du contenu (rejouées sur le contenu chargé en AJAX)  */
  /* ------------------------------------------------------------------ */
  const imageParam = (url) => {
    const m = /[?&]Image=([^&"')]+)/.exec(url || '');
    return m ? decodeURIComponent(m[1]) : null;
  };
  const https = (url) => url.replace(/^http:\/\/(www\.)?gamekyo\.com/i, 'https://www.gamekyo.com');

  function enhanceImages(ctx) {
    $$('img:not([data-gk])', ctx).forEach((img) => {
      img.dataset.gk = '1';
      const src = img.getAttribute('src') || '';
      // Vignettes redimensionnées côté serveur (80x60) → image d'origine en HD
      const raw = /magazine_creation_images/.test(src) && imageParam(src);
      if (raw) {
        img.addEventListener('error', () => { if (img.src !== src) img.src = src; }, { once: true });
        img.src = https(raw);
      } else if (/^http:\/\/(www\.)?gamekyo\.com/i.test(src)) {
        img.src = https(src);
      }
      // Avatars "small" → "medium" pour des écrans haute densité
      if (/\/avatar\/small\//.test(img.src) && img.closest('.article-thumb, .comment-avatar')) {
        const fallback = img.src;
        img.addEventListener('error', () => { if (img.src !== fallback) img.src = fallback; }, { once: true });
        img.src = img.src.replace('/avatar/small/', '/avatar/medium/');
      }
      // Bannières de blog hébergées sur des services disparus : on masque plutôt qu'afficher une image cassée
      if (img.closest('#header-image')) {
        const hide = () => { img.style.display = 'none'; };
        if (img.complete && !img.naturalWidth) hide(); else img.addEventListener('error', hide, { once: true });
      }
      if (!img.closest('#gk-topbar, #container')) img.loading = 'lazy';
      img.decoding = 'async';
    });
  }

  function enhanceTiles(ctx) {
    $$('.tip-container-new:not([data-gk])', ctx).forEach((tile) => {
      tile.dataset.gk = '1';
      const raw = imageParam(tile.getAttribute('style'));
      if (!raw) return;
      tile.style.setProperty('background',
        `linear-gradient(180deg, rgba(0,0,0,.05) 30%, rgba(0,0,0,.85)), url("${https(raw)}") center / cover no-repeat`, 'important');
      tile.removeAttribute('onmouseover');
      tile.removeAttribute('onmouseout');
    });
  }

  function enhanceScores(ctx) {
    $$('.score:not([data-gk]), .average-score:not([data-gk]), .opinion-average-score:not([data-gk])', ctx).forEach((el) => {
      el.dataset.gk = '1';
      const m = /(\d+(?:[.,]\d+)?)\s*\/\s*(\d+)/.exec(el.textContent);
      if (!m) return;
      const ratio = parseFloat(m[1].replace(',', '.')) / parseFloat(m[2]);
      el.classList.add(ratio >= 0.8 ? 'gk-score-high' : ratio >= 0.5 ? 'gk-score-mid' : 'gk-score-low');
    });
  }

  function enhanceSpoilers(ctx) {
    $$('.spoil:not([data-gk])', ctx).forEach((el) => {
      el.dataset.gk = '1';
      el.title = 'Spoiler — cliquer pour afficher';
      el.addEventListener('click', () => el.classList.toggle('gk-revealed'));
    });
  }

  function enhanceLinks(ctx) {
    // Liens externes dans le contenu : nouvel onglet + sécurité
    $$('.medium-text a[href^="http"]:not([data-gk]), .comment-text a[href^="http"]:not([data-gk])', ctx).forEach((a) => {
      a.dataset.gk = '1';
      if (!/gamekyo\.com/i.test(a.hostname)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    });
  }

  // Éléments modifiables sur place (titre, texte d'un article de son blog, profil…)
  function enhanceInPlace(ctx) {
    $$('[title="click to edit"]', ctx).forEach((el) => {
      el.classList.add('gk-editable');
      el.title = 'Cliquer pour modifier';
    });
  }

  // Notifications du site : icône, texte, membres en pastilles, bouton fermer
  function enhanceNotifications(ctx) {
    $$('.notification:not([data-gk])', ctx).forEach((n) => {
      n.dataset.gk = '1';
      const members = $$(':scope > a.member', n);
      const title = $$(':scope > a', n).find((a) => !a.classList.contains('member'));
      if (!title) return;
      const icon = h(`<span class="gk-notif-icon">${ICONS.mail}</span>`);
      const body = h('<div class="gk-notif-body"></div>');
      title.classList.add('gk-notif-title');
      title.textContent = title.textContent.trim().replace(/\s*de$/, '');
      body.appendChild(title);
      if (members.length) {
        const list = h('<div class="gk-notif-members"></div>');
        members.forEach((m) => list.appendChild(m));
        body.appendChild(list);
      }
      // Retire les séparateurs texte restants (« : », « , »)
      Array.from(n.childNodes).forEach((c) => { if (c.nodeType === 3) c.remove(); });
      n.prepend(icon, body);
    });
    updateNotifBadge();
  }

  const updateNotifBadge = () => {
    const visible = $$('#notification-list .notification').some((n) => n.isConnected && n.offsetParent !== null);
    $('#gk-messages')?.classList.toggle('gk-has-notif', visible);
  };
  // La croix du site masque la notification en différé : on remet le badge à jour ensuite
  document.addEventListener('click', (e) => {
    if (e.target.closest('.notification-cross')) setTimeout(updateNotifBadge, 800);
  });

  // Smileys et @mentions dans un texte déjà rendu (messages privés)
  function decorateText(el) {
    const re = new RegExp(`(?<![\\w.])(@[\\w-]+)|(${SMILEY_RE})`, 'g');
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (!walker.currentNode.parentElement.closest('a')) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const text = node.textContent;
      re.lastIndex = 0;
      if (!re.test(text)) return;
      re.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let last = 0;
      let m;
      while ((m = re.exec(text))) {
        frag.append(text.slice(last, m.index));
        if (m[1]) {
          const span = document.createElement('span');
          span.className = 'gk-mention';
          span.textContent = m[1];
          frag.append(span);
        } else {
          const img = document.createElement('img');
          img.src = smileyUrl(SMILEYS.find(([c]) => c === m[2])[1]);
          img.className = 'gk-smiley';
          img.alt = m[2];
          frag.append(img);
        }
        last = m.index + m[0].length;
      }
      frag.append(text.slice(last));
      node.replaceWith(frag);
    });
  }

  function enhanceMessages(ctx) {
    $$('.message-post-box:not([data-gk])', ctx).forEach((box) => {
      box.dataset.gk = '1';
      const info = $('.message-post-information', box);
      if (!info) return;
      $$(':scope > div:not([class]), :scope > .message-post-text', info).forEach((t) => { t.classList.add('gk-msg-text'); decorateText(t); });
      const links = $('.message-post-link', info);
      if (links) {
        Array.from(links.childNodes).forEach((c) => { if (c.nodeType === 3) c.remove(); });
        $$('a', links).forEach((a, i) => {
          const href = a.getAttribute('href') || '';
          if (/ignore|delete|remove/i.test(href)) a.classList.add('gk-msg-danger');
          else if (i === 0) a.classList.add('gk-msg-primary');
        });
      }
    });
    // Bouton « Nouveau message » dans l'en-tête de la boîte de réception
    const inboxTitle = $('.box-frame:has(#message-list) > .box-title', ctx);
    if (inboxTitle && !$('.gk-title-action', inboxTitle)) {
      inboxTitle.appendChild(h(`<a class="gk-title-action" href="/new_message.html">${ICONS.blog}<span>Nouveau message</span></a>`));
    }
  }

  function enhanceVotes(ctx) {
    $$('.votes-system-frame:not([data-gk])', ctx).forEach((frame) => {
      frame.dataset.gk = '1';
      const voters = frame.nextElementSibling;
      if (voters && voters.classList.contains('voters-box-news')) frame.appendChild(voters);
    });
  }

  // Listes (blogs, tests…) : pastille avec l'initiale de l'auteur
  function enhanceInitials(ctx) {
    $$('.element-detail a.member:not([data-gk-init])', ctx).forEach((a) => {
      a.dataset.gkInit = '1';
      const name = a.textContent.trim();
      let hash = 0;
      for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
      const dot = document.createElement('span');
      dot.className = 'gk-initial';
      dot.style.background = `hsl(${hash}, 55%, 45%)`;
      dot.textContent = name.charAt(0);
      a.prepend(dot);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Commentaires : actions visibles, envoi, @mentions                  */
  /* ------------------------------------------------------------------ */
  const myProfile = () => (root.dataset.gkUser ? `/${root.dataset.gkUser}` : null);
  let pendingComment = null; // { list, ta, at } après un clic sur « ajouter un commentaire »

  function focusCommentForm() {
    const ta = $('.comment-form textarea[name="comment"]');
    if (!ta) return;
    ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }, 300);
  }

  function enhanceComments(ctx) {
    $$('.comment-box:not([data-gk-c])', ctx).forEach((box) => {
      box.dataset.gkC = '1';
      const author = $('.comment-name a.member', box);
      const mine = !!myProfile() && author?.getAttribute('href') === myProfile();
      box.classList.toggle('gk-mine', mine);

      const reply = $('.comment-cross a[href*="wrapSelection"]', box);
      const del = $('.comment-cross a[href*="delete_comment"]', box);
      const editable = $('.comment-text .gk-editable, .comment-text [title="click to edit"]', box);
      const info = $('.comment-information', box);
      if (info && (reply || del || editable)) {
        const actions = h('<div class="gk-comment-actions"></div>');
        const add = (cls, icon, label, fn) => {
          const b = h(`<button type="button" class="${cls}">${icon}<span>${label}</span></button>`);
          b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); fn(); });
          actions.appendChild(b);
        };
        if (reply) add('gk-act-reply', ICONS.reply, 'Répondre', () => { reply.click(); focusCommentForm(); });
        if (editable) add('gk-act-edit', ICONS.blog, 'Modifier', () => editable.dispatchEvent(new MouseEvent('click', { bubbles: true })));
        if (del) add('gk-act-delete', ICONS.trash, 'Supprimer', () => del.click());
        info.appendChild(actions);
      }

      // Notre commentaire vient d'être ajouté : on vide le champ et on l'affiche
      if (mine && pendingComment && Date.now() - pendingComment.at < 20000 && pendingComment.list?.contains(box)) {
        const { ta } = pendingComment;
        pendingComment = null;
        ta.value = '';
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        box.classList.add('gk-new');
        setTimeout(() => box.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
      }
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.comment-form input.submit, .comment-form input[type="submit"]');
    if (!btn) return;
    const form = btn.closest('form');
    const ta = form && $('textarea[name="comment"]', form);
    if (ta && ta.value.trim()) pendingComment = { ta, at: Date.now(), list: btn.closest('[id^="comment-container"]') || document };
  }, true);

  // Autocomplétion « @pseudo » avec les membres présents dans la discussion
  function discussionMembers() {
    const names = [];
    const push = (n, tag) => { n = n.trim(); if (n && !names.some((x) => x.name.toLowerCase() === n.toLowerCase())) names.push({ name: n, tag }); };
    $$('.comment-list .comment-box').reverse().forEach((b) => { const a = $('.comment-name a.member', b); if (a) push(a.textContent, 'commentaire'); });
    $$('.article-details a.member, .big-title + .article-category a.member').forEach((a) => push(a.textContent, 'auteur'));
    $$('.comment-text a.memberresponse').forEach((a) => push(a.textContent, 'cité'));
    $$('.voters-box-news a.member').forEach((a) => push(a.textContent, 'a aimé'));
    const me = $('#account-name a')?.textContent.trim().toLowerCase();
    return names.filter((x) => x.name.toLowerCase() !== me);
  }

  function attachMentions(ta) {
    if (ta.dataset.gkMention) return;
    ta.dataset.gkMention = '1';
    let pop = null;
    let items = [];
    let sel = 0;
    let start = -1;
    const close = () => { pop?.remove(); pop = null; };
    const insert = (name) => {
      const end = ta.selectionStart;
      ta.setRangeText(`@${name} `, start, end, 'end');
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      close();
      ta.focus();
    };
    const render = () => {
      pop.innerHTML = '';
      items.forEach((it, i) => {
        const b = h(`<button type="button" class="${i === sel ? 'gk-on' : ''}"><span></span><small>${it.tag}</small></button>`);
        $('span', b).textContent = `@${it.name}`;
        b.addEventListener('mousedown', (e) => { e.preventDefault(); insert(it.name); });
        pop.appendChild(b);
      });
    };
    const check = () => {
      const before = ta.value.slice(0, ta.selectionStart);
      const m = /(^|[\s(])@([\w-]*)$/.exec(before);
      if (!m) return close();
      start = ta.selectionStart - m[2].length - 1;
      const q = m[2].toLowerCase();
      const all = discussionMembers();
      items = all.filter((x) => x.name.toLowerCase().startsWith(q))
        .concat(all.filter((x) => !x.name.toLowerCase().startsWith(q) && x.name.toLowerCase().includes(q))).slice(0, 8);
      if (!items.length) return close();
      sel = Math.min(sel, items.length - 1);
      if (!pop) { pop = h('<div class="gk-mention-pop" role="listbox"></div>'); document.body.appendChild(pop); }
      const r = ta.getBoundingClientRect();
      pop.style.left = `${r.left + window.scrollX + 8}px`;
      pop.style.top = `${r.bottom + window.scrollY + 4}px`;
      render();
    };
    ta.addEventListener('input', () => { sel = 0; check(); });
    ta.addEventListener('click', check);
    ta.addEventListener('blur', () => setTimeout(close, 150));
    ta.addEventListener('keydown', (e) => {
      if (!pop) return;
      if (e.key === 'ArrowDown') { sel = (sel + 1) % items.length; render(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { sel = (sel - 1 + items.length) % items.length; render(); e.preventDefault(); }
      else if (e.key === 'Enter' || e.key === 'Tab') { insert(items[sel].name); e.preventDefault(); }
      else if (e.key === 'Escape') { close(); e.preventDefault(); }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Émojis : Gamekyo ne les enregistre pas → conversion en smileys     */
  /* ------------------------------------------------------------------ */
  const EMOJI_TO_SMILEY = {
    ':)': '🙂😊☺😇🤗', ':D': '😀😃😄😁😺😸', ';)': '😉😏', ':p': '😛😜😝😋', ':o': '😮😯😲',
    ':(': '🙁☹😞😟😔😕', '8)': '😎', ':lol:': '😂🤣😹', ':hihi:': '😆😅🤭', ':love:': '😍🥰😘😻❤💕💖💗💘💓💞♥',
    ':cry:': '😢😭😿🥲', ']:(': '😠😡🤬', ':evil:': '😈👿', ':?:': '🤔❓❔', ':idee:': '💡', ':good:': '👍👌✅',
    ':bad:': '👎❌', ':crazy:': '🤪😵🙃', ':|': '😐😑😶', ':8o:': '😱😳🤯', ':exclamation:': '❗❕‼', ':fleche:': '➡',
    ':info:': 'ℹ', ':nerd:': '🤓', ':gun:': '🔫', ':grenade:': '💣', ':tchin:': '🍻🥂🍺', ':flame:': '🔥', ':upset:': '😤😒🙄',
    ':[]': '😬',
  };
  const EMOJI_MAP = new Map();
  // Spread plutôt qu'Array.from : prototype.js (chargé par le site) remplace Array.from et casse les émojis
  Object.entries(EMOJI_TO_SMILEY).forEach(([code, list]) => [...list].forEach((e) => EMOJI_MAP.set(e, code)));
  const EMOJI_HINT_RE = /[\u{10000}-\u{10FFFF}]|\p{Extended_Pictographic}/u;
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('fr', { granularity: 'grapheme' }) : null;

  function convertEmojis(text, stats, prev = '') {
    if (!EMOJI_HINT_RE.test(text)) return text;
    const graphemes = segmenter ? [...segmenter.segment(text)].map((x) => x.segment) : [...text];
    let out = '';
    graphemes.forEach((g) => {
      const base = g.replace(/[\uFE0F\u200D]|[\u{1F3FB}-\u{1F3FF}]/gu, '');
      const chars = [...base];
      const first = chars[0];
      if (first && EMOJI_MAP.has(first) && (chars.length === 1 || /\u200D/.test(g))) {
        stats.converted++;
        // Une espace devant le smiley, sauf en début de texte ou après une espace
        const last = (prev + out).slice(-1);
        out += (last && !/\s/.test(last) ? ' ' : '') + EMOJI_MAP.get(first);
      } else if (/[\u{10000}-\u{10FFFF}]/u.test(g)) {
        stats.removed++;
      } else {
        out += g.replace(/\uFE0F/g, '');
      }
    });
    return out;
  }

  let toastTimer;
  function toast(msg) {
    $('.gk-toast')?.remove();
    const t = h('<div class="gk-toast"></div>');
    t.textContent = msg;
    document.body.appendChild(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), 2600);
  }

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (!(el instanceof HTMLTextAreaElement || (el instanceof HTMLInputElement && /^(text|search)$/.test(el.type)))) return;
    if (el.closest('#gk-settings') || !EMOJI_HINT_RE.test(el.value)) return;
    const stats = { converted: 0, removed: 0 };
    const caret = el.selectionStart ?? el.value.length;
    const before = convertEmojis(el.value.slice(0, caret), stats);
    const after = convertEmojis(el.value.slice(caret), stats, before);
    if (!stats.converted && !stats.removed) return;
    el.value = before + after;
    el.setSelectionRange(before.length, before.length);
    if (stats.converted) toast(stats.removed ? 'Émojis convertis en smileys Gamekyo, les autres retirés' : 'Émoji converti en smiley Gamekyo');
    else toast('Émoji retiré : Gamekyo ne les prend pas en charge');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, true);

  function enhance(ctx = document) {
    enhanceNotifications(ctx);
    enhanceMessages(ctx);
    enhanceVotes(ctx);
    enhanceImages(ctx);
    enhanceTiles(ctx);
    enhanceScores(ctx);
    enhanceSpoilers(ctx);
    enhanceLinks(ctx);
    enhanceInPlace(ctx);
    enhanceComments(ctx);
    enhanceInitials(ctx);
    enhanceEditors(ctx);
  }

  /* ------------------------------------------------------------------ */
  /* Éditeur BBCode : aperçu en direct, raccourcis, smileys             */
  /* ------------------------------------------------------------------ */
  const SMILEYS = [
    [':info:', 1], [':)', 2], [':D', 3], [']:(', 4], [';)', 5], [':p', 6], [':o', 7], [':(', 8], ['8)', 9],
    [':?:', 10], [':idee:', 11], [':lol:', 12], [':hihi:', 13], [':love:', 14], [':8o:', 15], [':bad:', 16],
    [':good:', 17], [':crazy:', 18], [':|', 19], [':fleche:', 20], [':exclamation:', 21], [':[]', 22], [':?', 23],
    [':cry:', 24], [':evil:', 25], [':c', 35], [':!', 36], [':nerd:', 37], [':gun:', 29], [':grenade:', 30],
    [':chaine:', 31], [':upset:', 32], [':tchin:', 33], [':flame:', 34],
  ];
  const smileyUrl = (n) => `/images/forum/icon_forum_${n}.gif`;
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Codes les plus longs d'abord pour que ":?:" ne soit pas lu comme ":?"
  const SMILEY_RE = SMILEYS.map(([c]) => c).sort((a, b) => b.length - a.length).map(escapeRe).join('|');
  const TEXT_TOKEN_RE = new RegExp(`(https?:\\/\\/[^\\s<>"]+)|(${SMILEY_RE})`, 'g');

  const safeUrl = (u) => (/^https?:\/\//i.test(u.trim()) ? u.trim() : null);

  function videoEmbed(url) {
    const yt = /(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/.exec(url);
    if (yt) return `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}" allowfullscreen></iframe>`;
    const dm = /dailymotion\.com\/video\/([a-z0-9]+)|dai\.ly\/([a-z0-9]+)/i.exec(url);
    if (dm) return `<iframe src="https://www.dailymotion.com/embed/video/${dm[1] || dm[2]}" allowfullscreen></iframe>`;
    return `<a href="${url}">🎬 ${url}</a>`;
  }

  // Rendu approximatif du BBCode de Gamekyo (le rendu final reste celui du serveur)
  function bbcodeToHtml(src) {
    let s = src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const rules = [
      [/\[g\]([\s\S]*?)\[\/g\]/gi, '<b>$1</b>'],
      [/\[i\]([\s\S]*?)\[\/i\]/gi, '<i>$1</i>'],
      [/\[s\]([\s\S]*?)\[\/s\]/gi, '<u>$1</u>'],
      [/\[spoil\]([\s\S]*?)\[\/spoil\]/gi, '<span class="spoil">$1</span>'],
      [/\[quote=([^\]]+)\]([\s\S]*?)\[\/quote\]/gi, '<blockquote class="gk-quote"><div class="gk-quote-author">$1 a écrit :</div>$2</blockquote>'],
      [/\[quote\]([\s\S]*?)\[\/quote\]/gi, '<blockquote class="gk-quote">$1</blockquote>'],
      [/\[img(?:=(\d+)(?:px)?)?\]([\s\S]*?)\[\/img\]/gi, (m, w, u) => (safeUrl(u) ? `<img src="${safeUrl(u)}"${w ? ` width="${w}"` : ''} alt="">` : m)],
      [/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, (m, u, t) => (safeUrl(u) ? `<a href="${safeUrl(u)}">${t}</a>` : m)],
      [/\[url\]([\s\S]*?)\[\/url\]/gi, (m, u) => (safeUrl(u) ? `<a href="${safeUrl(u)}">${u}</a>` : m)],
      [/\[video\]([\s\S]*?)\[\/video\]/gi, (m, u) => (safeUrl(u) ? videoEmbed(safeUrl(u)) : m)],
    ];
    // Plusieurs passes pour gérer les balises imbriquées
    for (let pass = 0; pass < 4; pass++) {
      const before = s;
      rules.forEach(([re, rep]) => { s = s.replace(re, rep); });
      if (s === before) break;
    }
    s = s.replace(/\r?\n/g, '<br>');

    // Liens nus et smileys, uniquement dans le texte (jamais dans les attributs ni les liens)
    const box = document.createElement('div');
    box.innerHTML = s;
    const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (!walker.currentNode.parentElement.closest('a')) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const text = node.textContent;
      TEXT_TOKEN_RE.lastIndex = 0;
      if (!TEXT_TOKEN_RE.test(text)) return;
      TEXT_TOKEN_RE.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let last = 0;
      let m;
      while ((m = TEXT_TOKEN_RE.exec(text))) {
        frag.append(text.slice(last, m.index));
        if (m[1]) {
          const a = document.createElement('a');
          a.href = a.textContent = m[1];
          frag.append(a);
        } else {
          const img = document.createElement('img');
          img.src = smileyUrl(SMILEYS.find(([c]) => c === m[2])[1]);
          img.className = 'gk-smiley';
          img.alt = m[2];
          frag.append(img);
        }
        last = m.index + m[0].length;
      }
      frag.append(text.slice(last));
      node.replaceWith(frag);
    });
    $$('a', box).forEach((a) => { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
    return box.innerHTML;
  }

  // Insère des balises autour de la sélection, en gardant le texte sélectionné
  function wrapText(ta, open, close = '') {
    const { selectionStart: s, selectionEnd: e, value } = ta;
    ta.focus();
    ta.setRangeText(open + value.slice(s, e) + close, s, e);
    ta.setSelectionRange(s + open.length, e + open.length);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }

  const editors = new Set();

  function buildSmileyPicker(ta, toolbar) {
    const btn = h('<div class="tagSelection gk-smiley-btn"><a href="javascript:void(0);">Smileys</a><div class="gk-smiley-pop"></div></div>');
    const pop = $('.gk-smiley-pop', btn);
    SMILEYS.forEach(([code, n]) => {
      const b = h(`<button type="button" title="${code}"><img src="${smileyUrl(n)}" alt=""></button>`);
      b.addEventListener('mousedown', (e) => e.preventDefault()); // garde le focus dans le champ
      b.addEventListener('click', () => { wrapText(ta, ` ${code} `); btn.classList.remove('gk-open'); });
      pop.appendChild(b);
    });
    $('a', btn).addEventListener('click', () => btn.classList.toggle('gk-open'));
    document.addEventListener('click', (e) => { if (!btn.contains(e.target)) btn.classList.remove('gk-open'); });
    toolbar.appendChild(btn);
  }

  function attachEditor(ta, { compact = false, inPlace = false } = {}) {
    if (ta.dataset.gkEditor) return;
    ta.dataset.gkEditor = '1';

    const preview = h(`
      <div class="gk-preview${compact ? ' gk-compact' : ''}">
        <div class="gk-preview-head"><span>Aperçu</span><small>rendu approximatif</small></div>
        <div class="gk-preview-body"></div>
      </div>`);
    const body = $('.gk-preview-body', preview);
    ta.after(preview);

    let last = null;
    const update = () => {
      if (ta.value === last) return;
      last = ta.value;
      body.innerHTML = bbcodeToHtml(ta.value);
      preview.classList.toggle('gk-empty', !ta.value.trim());
      if (!compact) {
        // Le champ grandit avec le texte au lieu d'afficher une barre de défilement
        ta.style.height = 'auto';
        ta.style.height = Math.min(Math.max(ta.scrollHeight + 4, 260), window.innerHeight * 0.75) + 'px';
      }
    };
    ta.addEventListener('input', update);
    editors.add({ ta, update });
    update();

    ta.addEventListener('keydown', (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
      const tags = { b: 'g', g: 'g', i: 'i', u: 's' }[e.key.toLowerCase()];
      if (!tags) return;
      e.preventDefault();
      wrapText(ta, `[${tags}]`, `[/${tags}]`);
    });

    // Barre d'outils du site juste au-dessus du champ : ajout d'un sélecteur de smileys s'il n'y en a pas
    const toolbar = !inPlace && ta.closest('.form-textarea')?.querySelector('.form-textarea-field:has(> .tagSelection)');
    if (toolbar && !$('#popup, .gk-smiley-btn', toolbar)) buildSmileyPicker(ta, toolbar);
  }

  function enhanceEditors(ctx) {
    $$('#add-article-form textarea, textarea#message', ctx).forEach((ta) => attachEditor(ta));
    $$('textarea[name="comment"]', ctx).forEach((ta) => { attachEditor(ta, { compact: true }); attachMentions(ta); });
    // Modification sur place d'un texte long (corps d'un article de blog)
    $$('textarea.editor_field', ctx).forEach((ta) => { if (ta.rows > 1) attachEditor(ta, { inPlace: true }); });

    const title = $('#add-article-form #title', ctx);
    if (title && !title.dataset.gkCount) {
      title.dataset.gkCount = '1';
      const counter = h('<div class="gk-counter"></div>');
      title.after(counter);
      const max = title.maxLength > 0 ? title.maxLength : 64;
      const upd = () => { counter.textContent = `${title.value.length} / ${max}`; counter.classList.toggle('gk-warn', title.value.length > max - 8); };
      title.addEventListener('input', upd);
      upd();
    }
  }

  // Les boutons de la barre d'outils du site modifient le champ sans événement : on vérifie régulièrement
  setInterval(() => editors.forEach((ed) => { if (ed.ta.isConnected) ed.update(); else editors.delete(ed); }), 400);

  /* ------------------------------------------------------------------ */
  /* Ses propres articles : « Vue visiteur » par défaut, édition à la demande */
  /* ------------------------------------------------------------------ */
  function setupOwnerView() {
    // Seuls le titre / texte / source de l'article comptent (pas nos propres commentaires, modifiables eux aussi)
    const editables = $$('.article-container .gk-editable').filter((el) => !el.closest('.comment-box'));
    if (!editables.length || $('.gk-owner-bar')) return;

    const bar = h(`
      <div class="gk-owner-bar">
        <span class="gk-owner-label">${ICONS.user}<span>C'est votre article <small>— affiché comme le voient les autres</small></span></span>
        <div class="gk-seg">
          <button type="button" data-mode="read">👁 Vue visiteur</button>
          <button type="button" data-mode="edit">${ICONS.blog} Modifier</button>
        </div>
      </div>`);
    const label = $('.gk-owner-label small', bar);
    const titles = new Map();

    const setMode = (mode) => {
      const read = mode === 'read';
      root.classList.toggle('gk-read-mode', read);
      $$('button', bar).forEach((b) => b.classList.toggle('gk-on', b.dataset.mode === mode));
      label.textContent = read ? '— affiché comme le voient les autres' : '— le titre et la source se modifient aussi au clic';
      editables.forEach((el) => {
        if (!titles.has(el)) titles.set(el, el.title);
        el.title = read ? '' : titles.get(el);
      });
    };
    // « Modifier » ouvre directement l'éditeur du texte de l'article
    const openEditor = () => {
      const article = editables[0].closest('.article-container');
      const target = $('.medium-text .gk-editable', article) || $('.gk-editable', article);
      if (!target || target.style.display === 'none' || $('.inplaceeditor-form', article)) return;
      target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      setTimeout(() => {
        const form = $('.inplaceeditor-form', article);
        if (!form) return;
        const top = form.getBoundingClientRect().top + window.scrollY - $('#gk-topbar').offsetHeight - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 50);
    };
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-mode]');
      if (!b) return;
      setMode(b.dataset.mode);
      if (b.dataset.mode === 'edit') openEditor();
    });

    // En vue visiteur, un clic ne doit pas ouvrir l'éditeur du site (les liens restent cliquables)
    document.addEventListener('click', (e) => {
      if (!root.classList.contains('gk-read-mode') || e.target.closest('.comment-box')) return;
      if (e.target.closest('.gk-editable, .tag span[onclick]')) e.stopPropagation();
    }, true);

    const first = editables[0].closest('.article-container');
    first.parentElement.insertBefore(bar, first);
    setMode('read');
  }

  /* ------------------------------------------------------------------ */
  /* Diaporama : ajoute un titre lisible à chaque slide                 */
  /* ------------------------------------------------------------------ */
  function enhanceSlideshow() {
    $$('#container li').forEach((li) => {
      const link = $('a.fill-div', li);
      const box = $('.slideshow-div-text', li);
      if (!link || !box || $('.gk-slide-title', box)) return;
      const href = link.getAttribute('href') || '';
      const id = (/(\d+)_/.exec(href) || [])[1];
      let title = '';
      if (id) {
        const match = $$(`a[title][href*="${id}_"]`).find((a) => a !== link);
        if (match) title = match.getAttribute('title');
      }
      if (!title) {
        const slug = (/\d+_([^./]+)\.html/.exec(href) || [])[1] || '';
        title = slug.replace(/-/g, ' ');
        title = title.charAt(0).toUpperCase() + title.slice(1);
      }
      const el = document.createElement('div');
      el.className = 'gk-slide-title';
      el.textContent = title;
      box.appendChild(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Onglets des encadrés (blogs / groupes / top…)                      */
  /* ------------------------------------------------------------------ */
  function enhanceTabs() {
    $$('.box-title-external-blue').forEach((bar) => {
      const tabs = $$('a', bar);
      tabs.forEach((a) => a.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('gk-tab-active'));
        tabs.forEach((t) => t.classList.add('gk-tab-touched'));
        a.classList.add('gk-tab-active');
      }));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Lecture : barre de progression + temps de lecture                  */
  /* ------------------------------------------------------------------ */
  function enhanceReading() {
    const article = $('#column-1 > .box-frame > .box-container > .article-container, #column-4 .articles-container > .article-container:only-child');
    if (!article) return;
    const text = $('.article-information .medium-text', article);
    const title = $('.big-title', article);
    if (text && title && !$('.gk-reading-time', article)) {
      const words = text.textContent.trim().split(/\s+/).length;
      const minutes = Math.max(1, Math.round(words / 230));
      const badge = document.createElement('div');
      badge.className = 'gk-reading-time';
      badge.textContent = `${minutes} min de lecture`;
      title.after(badge);
    }
    const bar = document.createElement('div');
    bar.id = 'gk-progress';
    document.body.appendChild(bar);
    const update = () => {
      const r = article.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, -r.top / (total > 0 ? total : 1)));
      bar.style.width = (p * 100) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function addBackToTop() {
    const btn = h(`<button id="gk-totop" class="gk-icon-btn" type="button" title="Haut de page">${ICONS.up}</button>`);
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);
    const toggle = () => btn.classList.toggle('gk-show', window.scrollY > 600);
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
  }

  /* ------------------------------------------------------------------ */
  /* Initialisation                                                     */
  /* ------------------------------------------------------------------ */
  function init() {
    // Notre feuille passe après celles du site dans la cascade
    document.head.appendChild(style);
    document.head.appendChild(customStyle); // le CSS personnalisé passe en dernier
    document.head.appendChild(viewport);
    if (darkReaderLock.isConnected) document.head.appendChild(darkReaderLock);

    // Le champ de recherche de la colonne de gauche fait doublon avec la barre du haut
    const oldSearch = $('#search-form');
    if (oldSearch) oldSearch.closest('.box-frame')?.style.setProperty('display', 'none');

    buildTopbar();
    $$('.administration-menu-text a').forEach((a) => { if (a.getAttribute('href') === path) a.classList.add('gk-active'); });
    enhance();
    setupOwnerView();
    enhanceSlideshow();
    enhanceTabs();
    enhanceReading();
    addBackToTop();

    document.addEventListener('click', (e) => {
      if (root.classList.contains('gk-menu-open') && !e.target.closest('#gk-topbar')) root.classList.remove('gk-menu-open');
    });

    // Contenu ajouté dynamiquement (onglets AJAX, nouveaux commentaires…)
    let pending = new Set();
    let scheduled = false;
    new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => { if (n.nodeType === 1 && !n.closest('#gk-topbar')) pending.add(n); });
      }
      if (pending.size && !scheduled) {
        scheduled = true;
        requestAnimationFrame(() => {
          const nodes = pending; pending = new Set(); scheduled = false;
          nodes.forEach((n) => { if (n.isConnected) enhance(n.parentNode || n); });
        });
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
