// Runs at document_start on youtube.com. Most of the work is in content.css;
// this file sets the <html> attributes that turn each rule on, sends Shorts
// links to the normal player, keeps theater mode from being the default, and
// tags the few Shorts entries that can only be found by their text.

const root = document.documentElement;
let settings = { ...DEFAULTS };

function apply() {
  for (const s of SETTINGS) root.toggleAttribute(s.attr, !!settings[s.key]);
  redirectShorts();
  // The player only re-measures itself on resize, so tell it the small-player
  // rule may have changed its box.
  window.dispatchEvent(new Event('resize'));
}

// Theater mode is opt-in for each video. YouTube remembers it in a "wide"
// cookie (the server lays out the next page from it) and keeps it on when you
// move to another page. So the cookie is kept at 0, and theater mode that
// YouTube turns on by itself is switched back off. Turning it on yourself
// with the button or the T key is left alone.
let userTheaterAt = 0;
document.addEventListener('click', e => {
  if (e.isTrusted && e.target.closest?.('.ytp-size-button')) userTheaterAt = Date.now();
}, true);
document.addEventListener('keydown', e => {
  if (e.isTrusted && e.key.toLowerCase() === 't') userTheaterAt = Date.now();
}, true);

function clearWideCookie() {
  if (/(^|; )wide=1(;|$)/.test(document.cookie)) {
    document.cookie = 'wide=0; domain=.youtube.com; path=/; max-age=31536000; secure';
  }
}

// After a click YouTube rewrites the attribute before the switch lands, so
// wait a moment and check again instead of clicking it straight back. Capped
// per page so a fight with YouTube can't turn into a loop.
let autoExits = 0;
let settlingUntil = 0;
function leaveTheater() {
  if (!settings.player) return;
  clearWideCookie();
  setTimeout(clearWideCookie, 1000);
  if (!document.querySelector('ytd-watch-flexy[theater]')) return;
  if (Date.now() - userTheaterAt < 1500 || autoExits >= 3) return;
  if (Date.now() < settlingUntil) return;
  autoExits++;
  settlingUntil = Date.now() + 1000;
  document.querySelector('.ytp-size-button')?.click();
  setTimeout(leaveTheater, 1100);
}

new MutationObserver(leaveTheater).observe(root, {
  attributes: true,
  attributeFilter: ['theater'],
  subtree: true,
});

// /shorts/ID -> /watch?v=ID, so a Shorts link opens in the regular player.
function redirectShorts() {
  if (!settings.shorts) return;
  const m = location.pathname.match(/^\/shorts\/([\w-]+)/);
  if (m) location.replace(`/watch?v=${m[1]}`);
}

// Sidebar entries, search filter chips and channel tabs named "Shorts" carry
// no attribute CSS can match, so they are tagged here.
const SHORTS_TEXT = /^(youtube\s+)?shorts$/i;
const TEXT_TARGETS = [
  'ytd-guide-entry-renderer',
  'ytd-mini-guide-entry-renderer',
  'yt-chip-cloud-chip-renderer',
  'yt-tab-shape',
].join(',');

function labelOf(el) {
  const text =
    el.getAttribute('tab-title') ||
    el.querySelector('a[title]')?.getAttribute('title') ||
    el.getAttribute('aria-label') ||
    el.textContent;
  return text.replace(/\s+/g, ' ').trim();
}

function tagShortsByText() {
  for (const el of document.querySelectorAll(TEXT_TARGETS)) {
    el.toggleAttribute('ytt-shorts-entry', SHORTS_TEXT.test(labelOf(el)));
  }
}

let queued = false;
new MutationObserver(() => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    tagShortsByText();
  });
}).observe(root, { childList: true, subtree: true });

// YouTube navigates without reloading the page.
document.addEventListener('yt-navigate-start', () => {
  redirectShorts();
  autoExits = 0;
  leaveTheater();
});
document.addEventListener('yt-navigate-finish', () => {
  redirectShorts();
  leaveTheater();
});

apply();
chrome.storage.sync.get(DEFAULTS, stored => {
  settings = stored;
  apply();
  // Clearing the cookie this early is only safe off video pages; on a video
  // page the player has already read it and leaveTheater() handles it.
  if (settings.player && location.pathname !== '/watch') clearWideCookie();
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  for (const [key, { newValue }] of Object.entries(changes)) settings[key] = newValue;
  apply();
});
