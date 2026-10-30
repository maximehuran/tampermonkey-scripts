// ==UserScript==
// @name         Gamekyo Modern
// @namespace    https://www.gamekyo.com/
// @version      1.0.0
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
  const applyTheme = () => {
    root.classList.toggle('gk-dark', isDark());
    root.style.colorScheme = isDark() ? 'dark' : 'light';
  };
  root.classList.add('gk');
  applyTheme();
  prefersDark.addEventListener('change', () => { if (!savedTheme()) applyTheme(); });

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
#gk-topbar .gk-logo {
  font-size: 22px; font-weight: 800; letter-spacing: -.03em;
  color: var(--text) !important; white-space: nowrap; display: flex; align-items: center; gap: 8px;
}
#gk-topbar .gk-logo b { color: var(--accent); }
#gk-topbar .gk-logo-mark {
  width: 30px; height: 30px; border-radius: 9px;
  background: linear-gradient(135deg, #5aaef2, #2f6fd1);
  display: grid; place-items: center; color: #fff; font-size: 16px; font-weight: 800;
  box-shadow: 0 4px 12px rgba(47, 128, 209, .35);
}
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
html.gk #main-container-header:has(> .hidden:only-child), html.gk #main-container-header:not(:has(> :not(.hidden))) { display: none; }

html.gk .advertisement { max-width: 100%; overflow: hidden; margin: 16px auto 0; text-align: center; }
html.gk [id^="cGsas_"] { max-width: 100%; overflow: hidden; }
html.gk #column-0 iframe, html.gk #column-2 iframe { max-width: 100%; }

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
html.gk.gk-dark .details img, html.gk.gk-dark .comment-number img { filter: invert(1); }
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
html.gk .medium-title img, html.gk .element-title img, html.gk .big-title > img { height: 16px; width: auto; vertical-align: -2px; border-radius: 3px; }
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
  padding: 0; margin: 14px 0 !important; list-style: none;
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
html.gk .votes-system-frame { float: none !important; margin: 18px 0 0 !important; display: flex; align-items: center; gap: 10px; }
html.gk .votes-frame { width: auto !important; height: auto !important; margin: 0 !important; }
html.gk .votes-box {
  width: auto !important; height: auto !important; display: inline-flex !important; align-items: center; gap: 6px;
  padding: 7px 14px !important; border-radius: 999px; border: 0 !important;
  background: linear-gradient(135deg, #ff8a5c, #f0516a) !important; box-shadow: 0 4px 12px rgba(240, 81, 106, .3);
  flex-direction: row-reverse; transition: transform .15s;
}
html.gk .votes-box:hover { transform: scale(1.05); }
html.gk .votes-number { font-size: 15px !important; }
html.gk .votes-text { font-size: 15px !important; }
html.gk .voters-link a { font-size: 13px; color: var(--accent) !important; }
html.gk .voters-box-news, html.gk .voters-box {
  font-size: 13px; color: var(--muted); margin: 8px 0 0 !important; padding: 0 !important;
  background: none !important; border: 0 !important; width: auto !important; height: auto !important; float: none !important;
}
html.gk .voters-box.hidden { display: none !important; }
html.gk .voters-box-news:not(:has(a)) { display: none; }
html.gk .voters-title { font-weight: 600; color: var(--text-soft); }

/* ---------- Commentaires ---------- */
html.gk .comment-number {
  font-size: 18px !important; font-weight: 800; color: var(--text); margin: 26px 0 6px !important;
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
  html.gk .element-container.brown-background { display: none; }
  html.gk .box-frame, html.gk .box-frame-external, html.gk .box-container-external-new { margin-bottom: 16px !important; }
}
@media (prefers-reduced-motion: reduce) {
  html.gk *, html.gk *::before, html.gk *::after { transition: none !important; }
}
`;

  const style = document.createElement('style');
  style.id = 'gk-modern-style';
  style.textContent = CSS;
  (document.head || root).appendChild(style);

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
          <a class="gk-logo" href="/index.html"><span class="gk-logo-mark">G</span><span class="gk-logo-text">Game<b>kyo</b></span></a>
          <div id="gk-menu">
            <nav id="gk-nav"></nav>
            <form id="gk-search" method="post" action="/search.html" role="search">
              ${ICONS.search}
              <input type="search" name="search" placeholder="Rechercher un jeu, une news…" autocomplete="off" />
            </form>
            <div id="gk-account"></div>
          </div>
          <div class="gk-spacer"></div>
          <button id="gk-theme" class="gk-icon-btn" type="button" title="Basculer le mode sombre">${ICONS.sun}${ICONS.moon}</button>
          <button id="gk-burger" class="gk-icon-btn" type="button" title="Menu">${ICONS.menu}</button>
        </div>
      </header>`);

    const nav = $('#gk-nav', bar);
    $$('#main-menu-lign a').forEach((a) => {
      const key = navKey(a.getAttribute('href') || '');
      const link = h(`<a href="${a.getAttribute('href')}">${ICONS[key] || ''}<span></span></a>`);
      $('span', link).textContent = a.textContent.trim();
      if (key && key === section) link.classList.add('gk-active');
      nav.appendChild(link);
    });

    // On déplace (sans cloner) le menu compte pour conserver les éventuelles mises à jour dynamiques
    const sub = $('#sub-menu-lign');
    if (sub) {
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
    $('#gk-search', bar).addEventListener('submit', (e) => {
      if (!$('input', e.currentTarget).value.trim()) e.preventDefault();
    });
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

  function enhance(ctx = document) {
    enhanceImages(ctx);
    enhanceTiles(ctx);
    enhanceScores(ctx);
    enhanceSpoilers(ctx);
    enhanceLinks(ctx);
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

    document.head.appendChild(viewport);

    // Le champ de recherche de la colonne de gauche fait doublon avec la barre du haut
    const oldSearch = $('#search-form');
    if (oldSearch) oldSearch.closest('.box-frame')?.style.setProperty('display', 'none');

    buildTopbar();
    enhance();
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
