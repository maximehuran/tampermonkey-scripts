// ==UserScript==
// @name         Twitch Ad Auto-Mute
// @namespace    https://github.com/maximehuran/tampermonkey-scripts
// @version      2.0.0
// @description  Coupe automatiquement le son pendant les publicités Twitch et le remet à la fin.
// @match        https://www.twitch.tv/*
// @match        https://m.twitch.tv/*
// @match        https://player.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @run-at       document-idle
// @grant        none
// @homepageURL  https://github.com/maximehuran/tampermonkey-scripts
// @updateURL    https://raw.githubusercontent.com/maximehuran/tampermonkey-scripts/main/twitch/twitch-ad-mute.user.js
// @downloadURL  https://raw.githubusercontent.com/maximehuran/tampermonkey-scripts/main/twitch/twitch-ad-mute.user.js
// ==/UserScript==

(function () {
  'use strict';

  const LOG_PREFIX = '[Twitch Ad Auto-Mute]';

  // Twitch change régulièrement son DOM : plusieurs indices possibles d'une pub en cours
  const AD_SELECTORS = [
    '[data-a-target="video-ad-label"]',
    '[data-a-target="video-ad-countdown"]',
    '[data-test-selector="ad-banner-default-text"]',
    '[aria-label="Ad"]',
    '.stream-display-ad',
  ];
  const MUTE_BUTTON = '[data-a-target="player-mute-unmute-button"]';

  // true quand c'est ce script qui a coupé le son (on ne rallume jamais un son coupé par l'utilisateur)
  let mutedByScript = false;
  let adWasPlaying = false;

  const getVideo = () =>
    // Le lecteur principal est la plus grande vidéo de la page (évite les miniatures d'aperçu)
    Array.from(document.querySelectorAll('video'))
      .filter((v) => v.offsetWidth > 0)
      .sort((a, b) => b.offsetWidth * b.offsetHeight - a.offsetWidth * a.offsetHeight)[0] || null;

  const isAdPlaying = () => AD_SELECTORS.some((sel) => document.querySelector(sel));

  // Passer par le bouton du lecteur garde l'interface Twitch synchronisée ;
  // modifier seulement video.muted fait que Twitch remet parfois le son de lui-même.
  function setMuted(video, muted) {
    if (video.muted === muted) return;
    const button = document.querySelector(MUTE_BUTTON);
    if (button) button.click();
    if (video.muted !== muted) video.muted = muted;
  }

  function showBadge(visible) {
    let badge = document.getElementById('tam-badge');
    if (!visible) {
      badge?.remove();
      return;
    }
    if (badge) return;
    badge = document.createElement('div');
    badge.id = 'tam-badge';
    badge.textContent = '🔇 Pub en cours — son coupé';
    Object.assign(badge.style, {
      position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)', zIndex: 99999,
      padding: '6px 14px', borderRadius: '999px', background: 'rgba(145, 70, 255, .92)', color: '#fff',
      font: '600 13px/1.4 Inter, system-ui, sans-serif', boxShadow: '0 4px 16px rgba(0,0,0,.35)', pointerEvents: 'none',
    });
    document.body.appendChild(badge);
  }

  function check() {
    const video = getVideo();
    const adPlaying = isAdPlaying();

    if (adPlaying && !adWasPlaying) {
      // Début de pub : on coupe seulement si le son était actif
      if (video && !video.muted) {
        setMuted(video, true);
        mutedByScript = true;
        console.log(`${LOG_PREFIX} Pub détectée : son coupé.`);
      }
    } else if (adPlaying && mutedByScript && video && !video.muted) {
      // L'utilisateur a remis le son pendant la pub : on respecte son choix
      mutedByScript = false;
    } else if (!adPlaying && adWasPlaying) {
      // Fin de pub : on ne rallume que si c'est nous qui avions coupé
      if (mutedByScript && video) {
        setMuted(video, false);
        console.log(`${LOG_PREFIX} Pub terminée : son remis.`);
      }
      mutedByScript = false;
    }

    adWasPlaying = adPlaying;
    showBadge(adPlaying && mutedByScript);
  }

  // Réaction immédiate aux changements du lecteur + filet de sécurité périodique
  let scheduled = false;
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; check(); });
  }).observe(document.body, { childList: true, subtree: true });
  setInterval(check, 1000);
  check();
})();
