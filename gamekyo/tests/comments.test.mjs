// Tests de non-régression des commentaires de Gamekyo Modern, sur le vrai site, dans Firefox.
// Aucune écriture réelle : toutes les requêtes qui modifient le site sont simulées ou bloquées.
//
//   cd gamekyo/tests && npm install && npx playwright install firefox
//   GK_COOKIE='id_membre_cook=…; pass_membre_cook=…; PHPSESSID=…' node comments.test.mjs
//
// GK_COOKIE (session d'un membre) est nécessaire : le formulaire de commentaire n'apparaît que connecté.
// Ne jamais l'écrire dans un fichier du dépôt.
import { firefox } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const js = fs.readFileSync(process.env.GK_SCRIPT || path.join(here, '..', 'gamekyo-modern.user.js'), 'utf8');
const ARTICLE = process.env.GK_ARTICLE || 'https://www.gamekyo.com/blog_article488705.html';
const COOKIE = process.env.GK_COOKIE;
if (!COOKIE) { console.error('GK_COOKIE manquant'); process.exit(2); }

// Réponse au format exact du serveur (add_comment_action / update_comments_action)
const serverComment = (id, member, memberId, text) => `
  <div id="article_blogging-comment-${id}" class="comment-box top-border dashed-top-border" style="display:none">
    <div class="comment-avatar small-avatar"><a href="/member${memberId}.html"><img src="/images/icons/comment.gif" /></a></div>
    <div class="comment-information">
      <div class="comment-name"><a href="/member${memberId}.html" class="member">${member}</a> publié <span class="date">le 01/01/2026 à 12:00</span> <span class="comment-cross"><a href="javascript:delete_comment('article_blogging-comment-${id}','article_blogging','Êtes vous sûr de vouloir supprimer ce commentaire ?');"><img src="/images/icons/cross.gif" /></a></span>  <span class="comment-cross"><a href="javascript:wrapSelection(document.message_form.comment,'@${member} ','');"><img src="/images/icons/response.png" /></a></span></div>
      <div class="comment-text">${text}</div>
    </div>
  </div>
  <script type="text/javascript">
  if (comment_background_color == 'white-background') { comment_background_color = 'yellow-background'; Element.addClassName('article_blogging-comment-${id}',comment_background_color); }
  else if (comment_background_color == 'yellow-background') { comment_background_color = 'white-background'; Element.addClassName('article_blogging-comment-${id}',comment_background_color); }
  new Effect.Appear('article_blogging-comment-${id}');
  new Effect.Highlight('article_blogging-comment-${id}',{startcolor:'#FFFF99',duration: 15});
  </script>`;

let failures = 0;
const check = (name, ok, detail = '') => { console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); if (!ok) failures++; };

const browser = await firefox.launch();
const ctx = await browser.newContext({ viewport: { width: 1300, height: 900 } });
await ctx.addCookies(COOKIE.split(/;\s*/).filter(Boolean).map((kv) => { const [name, ...v] = kv.split('='); return { name, value: v.join('='), domain: 'www.gamekyo.com', path: '/' }; }));
// Injection au démarrage comme Tampermonkey (Firefox lance les init scripts avant <html>)
await ctx.addInitScript(`window.GM_info = { script: { version: 'test' } };
  document.addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = '#didomi-host{display:none!important} body{overflow:auto!important}'; document.head.appendChild(st); });
  if (window.top === window) { (() => { const run = () => { ${js} }; if (document.documentElement) run(); else new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); run(); } }).observe(document, { childList: true }); })(); }`);

// Blocage général d'abord : Playwright essaie les routes de la dernière déclarée à la première
await ctx.route(/gamekyo\.com\/.*(edit_in_place_action|edit_tags|delete_|vote|confirm_request|sign_out)/, (r) => r.abort());
const sent = [];
await ctx.route(/add_comment_action\.php/, (r) => { sent.push(['add', r.request().postData()]); r.fulfill({ status: 200, contentType: 'text/html', body: '﻿' + serverComment(900000001, 'minimaxx', 100611, 'Commentaire simulé') }); });
await ctx.route(/update_comments_action\.php/, (r) => r.fulfill({ status: 200, contentType: 'text/html', body: serverComment(900000002, 'quelquun', 1, 'Arrivé par auto-refresh') }));
await ctx.route(/delete_comment_action\.php/, (r) => { sent.push(['delete', r.request().postData()]); r.fulfill({ status: 200, body: '1' }); });

const page = await ctx.newPage();
const errors = []; page.on('pageerror', (e) => { if (!/SmartAdServer|\$ is not defined/.test(e.message)) errors.push(e.message); });
page.on('dialog', (d) => d.accept());
await page.goto(ARTICLE, { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(3500);

const visible = (id) => page.evaluate((id) => { const el = document.getElementById(id); if (!el) return 'absent'; const cs = getComputedStyle(el); return cs.display !== 'none' && +cs.opacity > 0.9 && el.getBoundingClientRect().height > 0 ? 'visible' : `caché (display=${cs.display}, opacity=${cs.opacity})`; }, id);

// 1. Poster un commentaire : animation du site, champ vidé
check('script actif', await page.evaluate(() => document.documentElement.classList.contains('gk')));
await page.fill('.comment-form textarea[name="comment"]', 'Commentaire simulé');
await page.click('.comment-form input[type="submit"]');
await page.waitForTimeout(2500);
check('commentaire posté : apparaît (Effect.Appear)', (await visible('article_blogging-comment-900000001')) === 'visible', await visible('article_blogging-comment-900000001'));
check('commentaire posté : champ vidé', (await page.inputValue('.comment-form textarea[name="comment"]')) === '');
check('commentaire posté : boutons d\'action', (await page.locator('#article_blogging-comment-900000001 .gk-act-delete').count()) === 1);

// 2. Auto-refresh : même appel que le PeriodicalUpdater du site (updater() dans scripts_top.js)
await page.evaluate(() => {
  const list = document.querySelector('[id^="comment-list-article-blogging-"]');
  new Ajax.Updater(list.id, '/update_comments_action.php', { method: 'post', parameters: 'element_type=article_blogging&element_id=0&frequency_action=60', evalScripts: true, insertion: Insertion.Bottom });
});
await page.waitForTimeout(2500);
check('auto-refresh : nouveau commentaire apparaît', (await visible('article_blogging-comment-900000002')) === 'visible', await visible('article_blogging-comment-900000002'));
check('auto-refresh : boutons du script', (await page.locator('#article_blogging-comment-900000002 .gk-act-reply').count()) === 1);

// 3. Supprimer un commentaire tout juste posté : bon numéro envoyé, élément retiré
await page.locator('#article_blogging-comment-900000001 .gk-act-delete').click();
await page.waitForTimeout(1500);
const del = sent.find(([k]) => k === 'delete');
check('suppression : numéro seul envoyé', !!del && /comment_id=900000001&comment_type=article_blogging/.test(del[1]), del ? del[1] : 'aucune requête');
check('suppression : élément retiré', (await visible('article_blogging-comment-900000001')) === 'absent');

// 4. Ses commentaires : clic sur le texte n'ouvre rien, « Modifier » ouvre le formulaire
const mine = page.locator('.comment-box.gk-mine:has(.comment-text .gk-editable)').first();
if (await mine.count()) {
  // Clic sur le texte lui-même (pas sur un lien @pseudo qu'il contient)
  await mine.locator('.comment-text .gk-editable').first().evaluate((e) => e.click()); await page.waitForTimeout(500);
  check('clic sur son commentaire : pas d\'éditeur', (await mine.locator('.inplaceeditor-form, .gk-cedit').count()) === 0);
  await mine.locator('.gk-act-edit').click(); await page.waitForTimeout(1500);
  check('« Modifier » : formulaire ouvert', (await mine.locator('.gk-cedit').count()) === 1);
  await mine.locator('.gk-cedit [data-action="cancel"]').click();
}

check('aucune erreur JavaScript', errors.length === 0, errors.join(' | '));
await browser.close();
console.log(failures ? `\n${failures} échec(s)` : '\nTout est OK');
process.exit(failures ? 1 : 0);
