// Genre sorting: an icon button on feed pages that asks JEV which genre each
// video belongs to and puts that genre's Lucide icon beside it. Clicking a
// video's genre icon shows only that genre. Nothing happens until you click
// the button: each page starts plain, a click sorts what's on screen, and
// videos that load as you scroll wait for another click. Answers are cached
// by video, so a click only sends the ones JEV hasn't sorted yet.

const UNSURE = 0.5; // below this confidence the genre icon is drawn faded

const GENRE = Object.fromEntries(GENRES.map(g => [g.id, g]));
const genreOf = new Map(); // video id -> { genre, confidence }
const covered = new Set(); // ids your clicks have sorted on this page
let only = '';             // the genre the feed is narrowed to, or ''
let status = '';           // '', 'busy' or an error code

function icon(name) {
  const svg = lucide.createElement(lucide.icons[name]);
  svg.setAttribute('aria-hidden', 'true');
  return svg;
}

const button = document.createElement('button');
button.id = 'ytt-sort';
button.addEventListener('click', () => {
  if (status === 'busy') return;
  if (only) {
    only = ''; // narrowed to one genre: show them all again
    render();
    return;
  }
  const fresh = unsorted();
  if (!status && covered.size && !fresh.length) {
    covered.clear(); // everything on screen is sorted: take the icons away
    render();
    return;
  }
  sort(fresh); // also how a click retries after an error
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
function unsorted() {
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

async function sort(videos) {
  status = '';
  videos.forEach(v => covered.add(v.id));
  const todo = videos.filter(v => !genreOf.has(v.id));
  if (todo.length) {
    status = 'busy';
    render();
    const reply = await chrome.runtime.sendMessage({ type: 'jev-genres', videos: todo })
      .catch(err => ({ error: err.message }));
    if (reply?.error) {
      status = reply.error;
      button.dataset.detail = reply.detail || '';
      videos.forEach(v => covered.delete(v.id));
    } else {
      status = '';
      for (const [id, g] of Object.entries(reply.genres)) genreOf.set(id, g);
      saveCache();
    }
  }
  render();
}

// The genre icon sits in the slot where the channel picture was.
function placeTag(item, g) {
  const meta = item.querySelector('yt-lockup-metadata-view-model');
  if (!meta) return;
  let tag = meta.querySelector(':scope > .ytt-genre');
  if (!g) return tag?.remove();
  const def = GENRE[g.genre] || GENRE.other;
  const unsure = g.confidence < UNSURE;
  const key = def.id + (unsure ? '?' : '');
  if (tag?.dataset.key === key) return;
  if (!tag) {
    tag = document.createElement('button');
    tag.className = 'ytt-genre';
    tag.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      only = only === tag.dataset.genre ? '' : tag.dataset.genre;
      render();
    });
    meta.prepend(tag);
  }
  tag.dataset.key = key;
  tag.dataset.genre = def.id;
  tag.toggleAttribute('unsure', unsure);
  tag.title = def.label + (unsure ? '?' : '');
  tag.setAttribute('aria-label', `${tag.title} (show only this genre)`);
  tag.replaceChildren(icon(def.icon));
}

function render() {
  const grid = feed();
  button.hidden = !grid;
  if (!grid) return;
  for (const item of grid.querySelectorAll('ytd-rich-item-renderer')) {
    const id = videoOf(item)?.id;
    const g = covered.has(id) ? genreOf.get(id) : null;
    placeTag(item, g);
    item.toggleAttribute('ytt-off-genre', !!only && g?.genre !== only);
  }
  const more = covered.size && !only ? unsorted().length : 0;
  const detail = button.dataset.detail ? `\n${button.dataset.detail}` : '';
  if (status === 'busy') setButton('LoaderCircle', 'Sorting into genres…');
  else if (status === 'no-key') setButton('KeyRound', 'Add your JEV key in the extension menu');
  else if (status === 'bad-key') setButton('KeyRound', 'JEV rejected the key' + detail);
  else if (status) setButton('TriangleAlert', `JEV error ${status.replace('http-', '')}, click to retry` + detail);
  else if (only) setButton('FunnelX', `Showing only ${GENRE[only].label}. Click to show all`);
  else if (!covered.size) setButton('Tags', 'Sort into genres');
  else if (more) setButton('Tags', `Sort ${more} more into genres`, more);
  else setButton('Tags', 'Hide genres', '', true);
  button.toggleAttribute('busy', status === 'busy');
}

// Only touch the button when its state changes; every change is a DOM
// mutation, and mutations are what schedule the next render.
let shown = '';
function setButton(name, title, badge = '', pressed = false) {
  const key = [name, title, badge, pressed].join('|');
  if (key === shown) return;
  shown = key;
  button.replaceChildren(icon(name));
  if (badge) {
    const b = document.createElement('span');
    b.className = 'ytt-badge';
    b.textContent = badge;
    button.append(b);
  }
  button.title = title;
  button.setAttribute('aria-label', title);
  button.setAttribute('aria-pressed', pressed);
}

// Cached answers belong to one version of the genre list.
function saveCache() {
  const v = Object.fromEntries([...genreOf].slice(-3000));
  chrome.storage.local.set({ genreCache: { for: GENRES_VERSION, v } });
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

// Every page starts plain.
document.addEventListener('yt-navigate-finish', () => {
  covered.clear();
  only = '';
  if (status !== 'busy') status = '';
  soon();
});

chrome.storage.local.get({ genreCache: null }, s => {
  if (s.genreCache?.for === GENRES_VERSION) {
    for (const [id, g] of Object.entries(s.genreCache.v)) genreOf.set(id, g);
  }
  soon();
});

// A new key clears an old key error; it doesn't send anything by itself.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes.jevKey || status === 'busy') return;
  status = '';
  button.dataset.detail = '';
  soon();
});

// The button goes straight into <body>, outside YouTube's app, so the app's
// re-renders can't remove it.
if (document.body) document.body.append(button);
else document.addEventListener('DOMContentLoaded', () => document.body.append(button));
