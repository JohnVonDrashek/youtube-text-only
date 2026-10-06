// Runs at document_start on youtube.com. Most of the work is in content.css;
// this file sets the <html> attributes that turn each rule on, sends Shorts
// links to the normal player, and tags the few Shorts entries that can only be
// found by their text.

const root = document.documentElement;
let settings = { ...DEFAULTS };

function apply() {
  for (const s of SETTINGS) root.toggleAttribute(s.attr, !!settings[s.key]);
  redirectShorts();
}

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
document.addEventListener('yt-navigate-start', redirectShorts);
document.addEventListener('yt-navigate-finish', redirectShorts);

apply();
chrome.storage.sync.get(DEFAULTS, stored => {
  settings = stored;
  apply();
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  for (const [key, { newValue }] of Object.entries(changes)) settings[key] = newValue;
  apply();
});
