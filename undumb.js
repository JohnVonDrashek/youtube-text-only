// "Undumb my feed": a button on feed pages that asks JEV whether each video
// is productive and hides the ones it says aren't. While it's on, videos that
// load as you scroll are judged too. Answers are cached by video, so nothing
// is sent twice unless you change what counts as productive.

const UNPRODUCTIVE = 0.5; // JEV's probability that a video is productive

const verdicts = new Map(); // video id -> probability
const stale = new Set();    // ids answered under old descriptions, to re-ask
const asking = new Set();   // ids in a request right now
let generation = 0;         // goes up when the descriptions change
let undumbed = false;
let status = '';            // '', 'busy' or an error code

const button = document.createElement('button');
button.id = 'ytt-undumb';
button.addEventListener('click', () => {
  if (status === 'busy') return;
  if (status) {
    status = ''; // a click after an error retries
    soon();
    return;
  }
  chrome.storage.local.set({ undumbed: !undumbed });
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

function render() {
  const grid = feed();
  button.hidden = !grid;
  root.toggleAttribute('ytt-undumbed', undumbed);
  if (!grid) return;
  let hidden = 0;
  for (const item of grid.querySelectorAll('ytd-rich-item-renderer')) {
    const id = videoOf(item)?.id;
    const dumb = verdicts.has(id) && verdicts.get(id) < UNPRODUCTIVE;
    item.toggleAttribute('ytt-dumb', dumb);
    if (dumb) hidden++;
  }
  const label =
    status === 'no-key' ? 'Add your JEV key in the extension menu' :
    status === 'bad-key' ? 'JEV rejected the key' :
    status && status !== 'busy' ? 'JEV failed, click to retry' :
    !undumbed ? 'Undumb my feed' :
    status === 'busy' ? 'Undumbing…' :
    `Undumbed · ${hidden} hidden`;
  // Only touch the text when it changes; every change is a DOM mutation, and
  // mutations are what schedule the next pass.
  if (button.textContent !== label) button.textContent = label;
  button.toggleAttribute('busy', status === 'busy');
}

async function judgeNew() {
  const grid = feed();
  if (!undumbed || !grid || (status && status !== 'busy')) return render();
  const seen = new Set();
  const todo = [];
  for (const item of grid.querySelectorAll('ytd-rich-item-renderer')) {
    // Skip what's hidden for other reasons (Shorts, ads), not what this hid.
    if (!item.getClientRects().length && !item.hasAttribute('ytt-dumb')) continue;
    const v = videoOf(item);
    if (!v || (verdicts.has(v.id) && !stale.has(v.id)) || asking.has(v.id) || seen.has(v.id)) continue;
    seen.add(v.id);
    todo.push(v);
  }
  if (!todo.length) return render();
  todo.forEach(v => asking.add(v.id));
  const gen = generation;
  status = 'busy';
  render();
  const reply = await chrome.runtime.sendMessage({ type: 'jev-judge', videos: todo })
    .catch(err => ({ error: err.message }));
  todo.forEach(v => asking.delete(v.id));
  if (reply?.error) {
    status = reply.error;
  } else {
    status = asking.size ? 'busy' : '';
    for (const [id, p] of Object.entries(reply.verdicts)) {
      verdicts.set(id, p);
      if (gen === generation) stale.delete(id);
      else stale.add(id); // the descriptions changed while this was out
    }
    saveCache();
  }
  render();
}

// Cached answers belong to one pair of descriptions. Editing them in the popup
// re-asks about every video, and the old answers stay in effect until the new
// ones arrive so nothing flashes back into view.
let cacheFor = '';
function saveCache() {
  const v = Object.fromEntries([...verdicts].filter(([id]) => !stale.has(id)).slice(-3000));
  chrome.storage.local.set({ jevCache: { for: cacheFor, v } });
}

// At most one pass every 400ms, however busy the page is.
let scheduled = false;
function soon() {
  if (scheduled) return;
  scheduled = true;
  setTimeout(() => {
    scheduled = false;
    judgeNew();
  }, 400);
}

new MutationObserver(soon).observe(root, { childList: true, subtree: true });
document.addEventListener('yt-navigate-finish', soon);

chrome.storage.local.get({ ...JEV_DEFAULTS, undumbed: false, jevCache: null }, s => {
  cacheFor = s.jevYes + '\n' + s.jevNo;
  if (s.jevCache?.for === cacheFor) {
    for (const [id, p] of Object.entries(s.jevCache.v)) verdicts.set(id, p);
  }
  undumbed = s.undumbed;
  soon();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes.undumbed) undumbed = changes.undumbed.newValue;
  if (changes.jevYes || changes.jevNo) {
    chrome.storage.local.get(JEV_DEFAULTS, s => {
      cacheFor = s.jevYes + '\n' + s.jevNo;
      generation++;
      for (const id of verdicts.keys()) stale.add(id);
      soon();
    });
  }
  if (changes.jevKey) status = '';
  if (changes.undumbed || changes.jevKey) soon();
});

// The button lives on <html> so YouTube's own re-renders can't remove it.
root.append(button);
