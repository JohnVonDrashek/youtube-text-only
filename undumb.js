// "Undumb my feed": a button on feed pages that asks JEV whether each video
// is productive and hides the ones it says aren't. Nothing happens until you
// click. Each page starts unfiltered, a click judges what's on screen, and
// videos that load as you scroll wait for another click. Answers are cached by
// video, so a click only sends the ones JEV hasn't judged under the current
// descriptions.

const UNPRODUCTIVE = 0.5; // JEV's probability that a video is productive

const verdicts = new Map(); // video id -> probability
const stale = new Set();    // ids answered under old descriptions, to re-ask
const covered = new Set();  // ids your clicks have filtered on this page
let generation = 0;         // goes up when the descriptions change
let status = '';            // '', 'busy' or an error code

const button = document.createElement('button');
button.id = 'ytt-undumb';
button.addEventListener('click', () => {
  if (status === 'busy') return;
  const fresh = unfiltered();
  if (!status && covered.size && !fresh.length) {
    covered.clear(); // everything on screen is filtered: show it all again
    render();
    return;
  }
  undumb(fresh); // also how a click retries after an error
});

// Feed pages are the ones built around a list of videos: home,
// subscriptions and a channel's videos.
function feed() {
  return document.querySelector('ytd-browse:not([hidden]) ytd-rich-grid-renderer');
}

function videoOf(item) {
  const link = item.querySelector('a[href*="/watch?v="]');
  if (!link) return null;
  const id = new URL(link.href).searchParams.get('v');
  const title = (item.querySelector('h3')?.textContent || link.textContent).replace(/\s+/g, ' ').trim();
  const channel = item.querySelector('a[href^="/@"], a[href^="/channel/"]')?.textContent.replace(/\s+/g, ' ').trim();
  return id && title ? { id, title, channel } : null;
}

// Videos on screen that no click has covered yet. Ones hidden for other
// reasons (Shorts, ads) don't count.
function unfiltered() {
  const grid = feed();
  if (!grid) return [];
  const seen = new Set();
  const out = [];
  for (const item of grid.querySelectorAll('ytd-rich-item-renderer')) {
    if (!item.getClientRects().length) continue;
    const v = videoOf(item);
    if (!v || covered.has(v.id) || seen.has(v.id)) continue;
    seen.add(v.id);
    out.push(v);
  }
  return out;
}

async function undumb(videos) {
  status = '';
  videos.forEach(v => covered.add(v.id));
  const todo = videos.filter(v => !verdicts.has(v.id) || stale.has(v.id));
  if (todo.length) {
    const gen = generation;
    status = 'busy';
    render();
    const reply = await chrome.runtime.sendMessage({ type: 'jev-judge', videos: todo })
      .catch(err => ({ error: err.message }));
    if (reply?.error) {
      status = reply.error;
      button.title = reply.detail || reply.error;
      videos.forEach(v => covered.delete(v.id));
    } else {
      status = '';
      button.removeAttribute('title');
      for (const [id, p] of Object.entries(reply.verdicts)) {
        verdicts.set(id, p);
        if (gen === generation) stale.delete(id);
        else stale.add(id); // the descriptions changed while this was out
      }
      saveCache();
    }
  }
  render();
}

function render() {
  const grid = feed();
  button.hidden = !grid;
  if (!grid) return;
  let hidden = 0;
  for (const item of grid.querySelectorAll('ytd-rich-item-renderer')) {
    const id = videoOf(item)?.id;
    const dumb = covered.has(id) && verdicts.get(id) < UNPRODUCTIVE;
    item.toggleAttribute('ytt-dumb', dumb);
    if (dumb) hidden++;
  }
  const more = covered.size ? unfiltered().length : 0;
  const label =
    status === 'busy' ? 'Undumbing…' :
    status === 'no-key' ? 'Add your JEV key in the extension menu' :
    status === 'bad-key' ? 'JEV rejected the key' :
    status ? `JEV error ${status.replace('http-', '')}, click to retry` :
    !covered.size ? 'Undumb my feed' :
    more ? `Undumb ${more} more` :
    `Undumbed · ${hidden} hidden`;
  // Only touch the text when it changes; every change is a DOM mutation, and
  // mutations are what schedule the next render.
  if (button.textContent !== label) button.textContent = label;
  button.toggleAttribute('busy', status === 'busy');
}

// Cached answers belong to one pair of descriptions. After an edit in the
// popup the old answers stay on screen; the next click re-asks.
let cacheFor = '';
function saveCache() {
  const v = Object.fromEntries([...verdicts].filter(([id]) => !stale.has(id)).slice(-3000));
  chrome.storage.local.set({ jevCache: { for: cacheFor, v } });
}

// At most one render every 400ms, however busy the page is.
let scheduled = false;
function soon() {
  if (scheduled) return;
  scheduled = true;
  setTimeout(() => {
    scheduled = false;
    render();
  }, 400);
}

new MutationObserver(soon).observe(root, { childList: true, subtree: true });

// Every page starts unfiltered.
document.addEventListener('yt-navigate-finish', () => {
  covered.clear();
  if (status !== 'busy') status = '';
  soon();
});

chrome.storage.local.get({ ...JEV_DEFAULTS, jevCache: null }, s => {
  cacheFor = s.jevYes + '\n' + s.jevNo;
  if (s.jevCache?.for === cacheFor) {
    for (const [id, p] of Object.entries(s.jevCache.v)) verdicts.set(id, p);
  }
  soon();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes.jevYes || changes.jevNo) {
    chrome.storage.local.get(JEV_DEFAULTS, s => {
      cacheFor = s.jevYes + '\n' + s.jevNo;
      generation++;
      for (const id of verdicts.keys()) stale.add(id);
    });
  }
  // A new key clears an old key error; it doesn't send anything by itself.
  if (changes.jevKey && status !== 'busy') {
    status = '';
    button.removeAttribute('title');
    soon();
  }
});

// The button goes straight into <body>, outside YouTube's app, so the app's
// re-renders can't remove it.
if (document.body) document.body.append(button);
else document.addEventListener('DOMContentLoaded', () => document.body.append(button));
