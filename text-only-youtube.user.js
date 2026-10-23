// ==UserScript==
// @name         Text-Only YouTube
// @namespace    youtube-text-only
// @version      0.2.0
// @description  YouTube as a plain text list: no thumbnails, no profile pictures, no Shorts.
// @match        https://www.youtube.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFiUlEQVR4nNWaS2xUVRzGf/9zb2emnTY8iqUYKEqRR4TUqjUIQtyxMzEkJSG4KktCMEYSNKZ1QwOJcYEFFg0uYANscOmKjQbBqpAArQa0YAbUtFXoYzpz7z3HxbnTl/OinRnql9zFzLlz7ved//PcM5ADBuQKuLnGK4Ur4HaCyjWeleBFcAQCwL8BcaBVYLMHjWXiOQVlryEH+lPw0+vwOMOp3XKaBclGvh2Cb6EhDocE3nOgKZrt5jLBAJ69Hhm4MAqf74QH2UTInB86AsE1eLcGvojB8xNAGrSArhD/DBdVBSoOTMLfSfjgDfhyrgiZ8QNHIPgeDtbCybQl7mO/r9Tiz4KxxghccOPAY/i0DbrMtIvb4Mj4/HV4pxZOJiEIV919VuQBBETA9UGPgr8MOr+DDoHgIjgA0gmqC0w/LE/CgAv1aTCSJ/KfEbRrLZIGXm6BQUDU26AEzBi8vwRWpCFYhOQBlAcmDtU+fCxWjAjA1xBfDncjsNKzA4tRAAaMA2iYcGHdK/CXAqiH1hpoTC9i8mBjIgBdB/E0vAUhWQNbItbvK5oq5wOxVjAKtkJYiQWeK5htpMLJyJjcQyAGGqCYXkcpO1meCcsCCZOozu8UBQVorRHAqa6unAgRgmQSYwxKJO9zcwtQCq011Zs3s/b0aaLr1k1NXlaEZL2HD3lw6BBj16/jKIXJYYm8FhCleKG3l9rt20tPtAAia9bw4rlz3G5pwaRSduGyWCK7gND3VCRCtLkZ43kQBDYeKgFjQCkiTU24NTV4k5NIDstnF2AM4jj46TRDZ86wqrMTqqrKSTkrhnp7SY+MzM+FTBDgiJDo6mLixg1iGzfagQrFQPr+fUYuXECJYOYVxOFkIsLw5ctUOInazFfEfUXted1oNKcPlgvGGEw6XTB1FxZgDH4q9T+0QLjixhhW7N1LbNOm8OvyWiLj7+nBQYbPn5+uxDkskVOAKIUfBDQdO0bj0aOlZ1oEanfu5LcDB2wWeioBIpggwI1EqO/osL6odWXrgAjL9+8nceQI3siItXzRhSwsJIHvkxoYoGrXrnJTzopUfz/++Hhet80fxFoz2NFBU08P0ebm6Q6xnAg7Xy+R4MHhw+hUCqVUzq40twCtUUDy7l1+3r0bx63gW0YRtOdNbw/ztNQFWanQ743vl4hdcRAR6zoL3Q8IYLQuSR0QbHbL1xpMochNVH4BIgRa40QiRBoaMGFr8bTIEPYSCYLQNUuFvHUg0Jq6HTt44exZIqtXzz+IQzdI3r7Nr/v2MXnvnt1pFXCPYpC7Gw1b6rWnThHbsGHBDzLGEG9rY83x4/yyZ491pQXPmm9DYwxKKZz6etDaBvECCpnxfSQWw21osJ/nPdNsZGeU2dB4Hn90d4NSSCSCuO68LxWLoScnedTdDZTujXHBDc2fPT2MX7tGbP36BQdx8uZNJgYGcMJWpRTICMjOKnSjsb4+Rvv6FvwwgbxV9SnnEggFaBg2udxSa5RSSAkaOaN1qcgbDcMQClBwx7Ov61RWU2idc1NdaRgQbVf/FoRB7MMP4zBcZQcWB9PsMArUE0hVwTcA6gq42+CJgnNxa4XFLCCosxwvt0LCgCPGWsH8CKsUDAjEPWCxndKEhxvaBeNDSyv0XwKlBPQlUK/BQx8Oxm250rp0tWbBMPbswl8KzgR89CrcuQSq3R6HTd2UOWbtWgqdo0CwSI5ZBZxlICPQ0wYHZx6zThUygSAc6OqDRBQ+q4W6MSskkApbxIAocGrBTUH6H/ikDU7M+BtEhvdsZE7Cr8JLcfhQQ3s1LHGonIJMKkzCuMBXE3BiG9wM07yee+9/MPM4/xY0evCmwJYAVuoyu5Njg3VI4I7A1a3w+1xORcGAMsW9HCsrLoJj8mTEfwEzCDEAGj90CQAAAABJRU5ErkJggg==
// @run-at       document-start
// @inject-into  content
// @require      https://cdn.jsdelivr.net/npm/lucide@1.52.0/dist/umd/lucide.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.typesafe.ai
// ==/UserScript==

// Runs at document-start on youtube.com, in the userscript manager's sandbox
// rather than the page's. Sections, in order: the switches, the genres, the
// stylesheet, the page fixes, genre sorting, the call to JEV and the settings
// panel. Lucide (https://lucide.dev, ISC license) comes in through @require.

// ---------- Switches ----------
// Each setting turns on an attribute on <html>, and the stylesheet keys off
// it. They're saved together under "settings" in the manager's storage for
// this script.

const SETTINGS = [
  { key: 'text', attr: 'ytt-text', on: true, label: 'Text only' },
  { key: 'list', attr: 'ytt-list', on: true, label: 'One per row' },
  { key: 'player', attr: 'ytt-small-player', on: true, label: 'Small player' },
  { key: 'shorts', attr: 'ytt-shorts', on: true, label: 'No Shorts' },
  { key: 'promos', attr: 'ytt-promos', on: true, label: 'No ads or games' },
  { key: 'home', attr: 'ytt-home', on: false, label: 'No home feed' },
  { key: 'related', attr: 'ytt-related', on: false, label: 'No suggestions' },
  { key: 'comments', attr: 'ytt-comments', on: false, label: 'No comments' },
];

const DEFAULTS = Object.fromEntries(SETTINGS.map(s => [s.key, s.on]));

// ---------- Genres ----------
// The genres JEV picks from, one per video, with the Lucide icon shown for
// each. `about` is what JEV reads when choosing, and it reads literally, so
// each one says plainly what belongs there. JEV allows up to 255 options.
//
// `color` is the disc behind each icon (the icon is drawn in white or
// near-black, whichever reads better on it). The 20 colors started from an
// obvious color for each genre and were nudged apart until every pair differs
// by at least 13.7 in OKLab (x100), near the 15 where two colors read as
// clearly different. Twenty is past what red-green color blindness can tell
// apart, so the icon shape still carries the genre too.
const GENRES = [
  { id: 'faith', color: '#ffd339', label: 'Faith', icon: 'Church', about: 'Religion and spiritual life: theology, prayer, liturgy, saints, scripture, church teaching, apologetics.' },
  { id: 'history', color: '#645000', label: 'History', icon: 'Landmark', about: 'Past events, eras, empires, wars and historical figures, including archaeology.' },
  { id: 'music', color: '#c63fb1', label: 'Music', icon: 'Music', about: 'Songs, albums, covers, mixes, chant, live performances and music playlists.' },
  { id: 'gaming', color: '#7458de', label: 'Gaming', icon: 'Gamepad2', about: 'Video games: playthroughs, reviews, speedruns, game lore and gaming news.' },
  { id: 'tech', color: '#3dd0fe', label: 'Tech & AI', icon: 'Cpu', about: 'Computers, software, programming, gadgets, the internet and artificial intelligence.' },
  { id: 'science', color: '#24b6a1', label: 'Science', icon: 'FlaskConical', about: 'Physics, chemistry, biology, space, medicine, math and how nature works.' },
  { id: 'language', color: '#4c99fb', label: 'Languages', icon: 'Languages', about: 'Learning languages, linguistics, alphabets, words and how languages work.' },
  { id: 'ideas', color: '#caa1fd', label: 'Ideas', icon: 'Brain', about: 'Philosophy, ethics, arguments, debates, psychology and big ideas.' },
  { id: 'news', color: '#0050a2', label: 'News & politics', icon: 'Newspaper', about: 'Current events, politics, government, law and social issues.' },
  { id: 'howto', color: '#f27700', label: 'How-to', icon: 'Wrench', about: 'Practical tutorials: fixing, making, building, DIY and life skills.' },
  { id: 'comedy', color: '#fdc9c4', label: 'Comedy', icon: 'Laugh', about: 'Jokes, memes, sketches, parody, pranks and funny compilations.' },
  { id: 'film', color: '#d33b36', label: 'Film & TV', icon: 'Clapperboard', about: 'Movies, TV shows, anime and cartoons, trailers, scenes and reviews of them.' },
  { id: 'books', color: '#843868', label: 'Books', icon: 'BookOpen', about: 'Books, literature, poetry, authors and reading.' },
  { id: 'art', color: '#f573a0', label: 'Art & design', icon: 'Palette', about: 'Drawing, painting, animation craft, architecture, design and crafts.' },
  { id: 'sports', color: '#86df53', label: 'Sports & fitness', icon: 'Dumbbell', about: 'Sports, athletes, exercise, workouts and outdoor activities.' },
  { id: 'food', color: '#c5af7a', label: 'Food', icon: 'ChefHat', about: 'Cooking, recipes, restaurants, food reviews and drinks.' },
  { id: 'travel', color: '#66a70c', label: 'Travel & places', icon: 'Map', about: 'Travel, cities, countries, geography and maps.' },
  { id: 'money', color: '#348144', label: 'Business & money', icon: 'Briefcase', about: 'Business, companies, careers, investing, economics and personal finance.' },
  { id: 'life', color: '#44f7d4', label: 'Vlogs & life', icon: 'UserRound', about: "Someone's daily life, personal stories, vlogs, family and relationships." },
  { id: 'other', color: '#8a8a8a', label: 'Other', icon: 'CircleHelp', about: 'Fits none of the other genres.' },
];

// Cached answers belong to one version of this list.
const GENRES_VERSION = GENRES.map(g => g.id + ':' + g.about).join('|');

// ---------- Stylesheet ----------

GM_addStyle(`
/* Every rule is gated on an attribute that apply() sets on <html>,
   so the settings panel can turn each group on and off. */

/* ---------- Text only: thumbnails ---------- */

html[ytt-text] ytd-thumbnail,
html[ytt-text] ytd-playlist-thumbnail,
html[ytt-text] ytd-playlist-video-thumbnail-renderer,
html[ytt-text] ytd-playlist-panel-video-renderer #thumbnail-container,
html[ytt-text] yt-thumbnail-view-model,
html[ytt-text] yt-collection-thumbnail-view-model,
html[ytt-text] .ytLockupViewModelContentImage,
html[ytt-text] [class*="lockup-view-model__content-image"],
html[ytt-text] ytd-video-preview,
html[ytt-text] #video-preview,
html[ytt-text] ytd-backstage-image-renderer,
html[ytt-text] ytd-post-multi-image-renderer,
html[ytt-text] ytd-hero-playlist-thumbnail-renderer,
/* Inside the player: the wall of videos at the end, the creator's end cards,
   the fullscreen "more videos" grid, the up-next picture, the channel
   watermark and product photos. */
html[ytt-text] .html5-endscreen,
html[ytt-text] .ytp-ce-element,
html[ytt-text] .ytp-ce-shadow,
html[ytt-text] .ytp-fullscreen-grid,
html[ytt-text] .ytp-pause-overlay,
html[ytt-text] .ytp-autonav-endscreen-upnext-thumbnail,
html[ytt-text] .branding-img-container,
html[ytt-text] .iv-branding,
html[ytt-text] .ytp-suggested-action-product-thumbnail {
  display: none !important;
}

/* ---------- Text only: profile pictures and banners ---------- */

html[ytt-text] yt-img-shadow:not(ytd-masthead *, ytd-guide-entry-renderer *),
html[ytt-text] yt-avatar-shape:not(ytd-masthead *),
html[ytt-text] yt-decorated-avatar-view-model,
html[ytt-text] .ytLockupMetadataViewModelAvatar,
html[ytt-text] [class*="lockup-metadata-view-model__avatar"],
html[ytt-text] #channel-thumbnail,
html[ytt-text] #author-thumbnail,
html[ytt-text] #avatar-stack,
html[ytt-text] ytd-video-owner-renderer > a,
html[ytt-text] ytd-channel-renderer #avatar-section,
html[ytt-text] yt-image-banner-view-model,
html[ytt-text] #page-header-banner,
html[ytt-text] ytd-c4-tabbed-header-renderer #banner {
  display: none !important;
}

/* Your own picture in the top bar becomes a plain ring, so the menu stays
   easy to find. */
html[ytt-text] ytd-masthead #avatar-btn img {
  visibility: hidden !important;
}
html[ytt-text] ytd-masthead #avatar-btn yt-img-shadow {
  box-sizing: border-box;
  border: 2px solid var(--yt-spec-text-secondary, #888);
  border-radius: 50%;
  background: transparent !important;
}

/* Sidebar subscriptions keep an empty slot where the picture was, so their
   names line up with the icon rows above and below. */
html[ytt-text] ytd-guide-entry-renderer yt-img-shadow {
  visibility: hidden !important;
}

/* ---------- One video per row ---------- */

html[ytt-list] ytd-rich-grid-renderer {
  --ytd-rich-grid-items-per-row: 1 !important;
  --ytd-rich-grid-posts-per-row: 1 !important;
  --ytd-rich-grid-item-max-width: 820px !important;
}

/* Left-aligned under the filter chips instead of centered. */
html[ytt-list] ytd-rich-grid-renderer > #contents {
  max-width: none !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* YouTube still gives the "first column" items a different margin, which
   makes every few rows jump sideways. The loading spinner at the bottom gets
   the same width so it sits under the list. */
html[ytt-list] ytd-rich-grid-renderer > #contents > ytd-rich-item-renderer,
html[ytt-list] ytd-rich-grid-renderer > #contents > ytd-continuation-item-renderer {
  width: 100% !important;
  max-width: 820px !important;
  margin-left: 8px !important;
  margin-right: 8px !important;
}

/* Shelves inside the feed (the "most relevant" row on Subscriptions, news
   and so on) line up with the list and stack their videos too. */
html[ytt-list] ytd-rich-grid-renderer > #contents > ytd-rich-section-renderer {
  max-width: 836px !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
html[ytt-list] ytd-rich-shelf-renderer #rich-shelf-header {
  margin-left: 0 !important;
}
html[ytt-list] ytd-rich-shelf-renderer #contents-container > #contents {
  display: block !important;
  margin: 0 !important;
}
html[ytt-list] ytd-rich-shelf-renderer #contents-container > #contents > ytd-rich-item-renderer {
  display: block !important;
  width: auto !important;
  max-width: none !important;
  margin: 0 !important;
}

/* Tighter rows with a divider once the pictures are gone. */
html[ytt-list][ytt-text] ytd-rich-grid-renderer > #contents > ytd-rich-item-renderer,
html[ytt-list][ytt-text] ytd-rich-shelf-renderer #contents-container > #contents > ytd-rich-item-renderer {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding: 12px 0;
  border-bottom: 1px solid var(--yt-spec-10-percent-layer, rgba(128, 128, 128, 0.25));
}

/* Suggestions beside or under the player stay a single column too. */
html[ytt-list] ytd-watch-next-secondary-results-renderer #contents {
  display: block !important;
}
html[ytt-list] ytd-watch-next-secondary-results-renderer yt-lockup-view-model {
  width: auto !important;
}
html[ytt-list][ytt-text] ytd-watch-next-secondary-results-renderer yt-lockup-view-model {
  padding: 8px 0;
  border-bottom: 1px solid var(--yt-spec-10-percent-layer, rgba(128, 128, 128, 0.25));
}

/* ---------- Small player ---------- */
/* The video starts thumbnail-sized. Theater mode and full screen are the
   ways to see it big; leaveTheater() makes sure neither is the default. */

html[ytt-small-player] ytd-watch-flexy:not([theater]):not([fullscreen]) #player-container-outer {
  max-width: 360px !important;
  min-width: 0 !important;
  margin-left: 0 !important;
}

/* Before the page is built, YouTube shows a stand-in player with the video's
   thumbnail as its background. It gets the same size, theater or not, since
   theater mode at page load is never one you picked. */
html[ytt-small-player] #player.skeleton {
  height: auto !important;
  min-height: 0 !important;
}
html[ytt-small-player] #player.skeleton #player-wrap,
html[ytt-small-player] #player.skeleton #player-api,
html[ytt-small-player] #player.skeleton #player-placeholder {
  width: 360px !important;
  height: 203px !important;
  margin: 0 !important;
}

/* ---------- Loading placeholders ---------- */
/* The grey shapes YouTube draws while a page loads, reshaped to match. There
   are two kinds: a static copy written into the page (#home-page-skeleton,
   .watch-skeleton) and the app's own ghost cards, which signed-in pages use
   on first load and while scrolling (ytd-ghost-grid-renderer). */

html[ytt-text] #home-page-skeleton .rich-thumbnail,
html[ytt-text] #home-page-skeleton .channel-avatar,
html[ytt-text] ytd-ghost-grid-renderer .rich-thumbnail,
html[ytt-text] ytd-ghost-grid-renderer .channel-avatar,
html[ytt-text] .watch-skeleton #channel-icon,
html[ytt-text] .watch-skeleton .video-skeleton .thumbnail,
html[ytt-text] .ytGhostCommentsAvatar {
  display: none !important;
}

/* One column. */
html[ytt-list] #home-container-media,
html[ytt-list] ytd-ghost-grid-renderer .ghost-grid {
  display: block !important;
}
html[ytt-list] #home-container-media {
  margin: 18px 0 0 !important;
  padding: 0 24px !important;
}
html[ytt-list] #home-page-skeleton .rich-grid-media-skeleton,
html[ytt-list] ytd-ghost-grid-renderer .ghost-card {
  width: auto !important;
  min-width: 0 !important;
  max-width: 820px !important;
  margin: 0 !important;
}

/* Each row is two short bars, sized like a title and its byline. */
html[ytt-list][ytt-text] #home-page-skeleton .video-details,
html[ytt-list][ytt-text] ytd-ghost-grid-renderer .ghost-card {
  padding: 12px 0 !important;
  border-bottom: 1px solid var(--yt-spec-10-percent-layer, rgba(128, 128, 128, 0.25));
}
html[ytt-text] #home-page-skeleton .rich-video-title,
html[ytt-text] ytd-ghost-grid-renderer .rich-video-title {
  width: 56% !important;
  height: 16px !important;
  margin: 3px 0 10px !important;
  padding: 0 !important;
}
html[ytt-text] #home-page-skeleton .rich-grid-media-skeleton:nth-child(3n + 2) .rich-video-title,
html[ytt-text] ytd-ghost-grid-renderer .ghost-card:nth-child(3n + 2) .rich-video-title {
  width: 44% !important;
}
html[ytt-text] #home-page-skeleton .rich-grid-media-skeleton:nth-child(3n) .rich-video-title,
html[ytt-text] ytd-ghost-grid-renderer .ghost-card:nth-child(3n) .rich-video-title {
  width: 68% !important;
}
html[ytt-text] #home-page-skeleton .rich-video-meta,
html[ytt-text] ytd-ghost-grid-renderer .rich-video-meta {
  width: 26% !important;
  height: 12px !important;
  margin: 0 0 3px !important;
  padding: 0 !important;
}

/* ---------- No Shorts ---------- */

html[ytt-shorts] ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
html[ytt-shorts] ytd-rich-shelf-renderer[is-shorts],
html[ytt-shorts] ytd-reel-shelf-renderer,
html[ytt-shorts] grid-shelf-view-model:has(ytm-shorts-lockup-view-model),
html[ytt-shorts] grid-shelf-view-model:has(ytm-shorts-lockup-view-model-v2),
html[ytt-shorts] ytd-rich-item-renderer:has(ytm-shorts-lockup-view-model),
html[ytt-shorts] ytd-rich-item-renderer:has(ytm-shorts-lockup-view-model-v2),
html[ytt-shorts] ytd-rich-item-renderer:has(a[href^="/shorts/"]),
html[ytt-shorts] ytd-video-renderer:has(a[href^="/shorts/"]),
html[ytt-shorts] ytd-grid-video-renderer:has(a[href^="/shorts/"]),
html[ytt-shorts] ytd-compact-video-renderer:has(a[href^="/shorts/"]),
html[ytt-shorts] yt-lockup-view-model:has(a[href^="/shorts/"]),
html[ytt-shorts] ytd-guide-entry-renderer:has(a[title="Shorts"]),
html[ytt-shorts] ytd-guide-entry-renderer:has(a[title="YouTube Shorts"]),
html[ytt-shorts] ytd-mini-guide-entry-renderer[aria-label="Shorts"],
html[ytt-shorts] ytd-mini-guide-entry-renderer[aria-label="YouTube Shorts"],
html[ytt-shorts] yt-tab-shape[tab-title="Shorts"],
html[ytt-shorts] [ytt-shorts-entry] {
  display: none !important;
}

/* ---------- No ads or games ---------- */

html[ytt-promos] ytd-rich-section-renderer:has(ytd-mini-game-card-view-model),
html[ytt-promos] ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
html[ytt-promos] ytd-ad-slot-renderer,
html[ytt-promos] ytd-in-feed-ad-layout-renderer,
html[ytt-promos] ytd-search-pyv-renderer,
html[ytt-promos] ytd-banner-promo-renderer,
html[ytt-promos] ytd-statement-banner-renderer,
html[ytt-promos] ytd-brand-video-singleton-renderer,
html[ytt-promos] ytd-merch-shelf-renderer,
html[ytt-promos] #masthead-ad,
html[ytt-promos] #player-ads,
html[ytt-promos] .ytp-suggested-action {
  display: none !important;
}

/* ---------- Optional ---------- */

html[ytt-home] ytd-browse[page-subtype="home"] ytd-rich-grid-renderer {
  display: none !important;
}

html[ytt-related] ytd-watch-next-secondary-results-renderer {
  display: none !important;
}

html[ytt-comments] ytd-comments#comments {
  display: none !important;
}

/* ---------- Genres ---------- */
/* Genre sorting: the sort button on feed pages, the genre icon beside each
   sorted video, and narrowing the feed to one genre. */

ytd-rich-item-renderer[ytt-off-genre] {
  display: none !important;
}

/* Each genre icon sits on a disc in that genre's color (set by placeTag()
   from GENRES), with a hairline edge so pale discs hold their shape on a
   white page. */
.ytt-genre {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin: -1px 10px 0 -2px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--chip);
  color: var(--ink);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}
html[dark] .ytt-genre {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
}
/* The hover and unsure rules below start with "html" so they outrank the
   dark-mode edge above. */
html .ytt-genre:hover {
  box-shadow: 0 0 0 2px var(--yt-spec-base-background, #fff), 0 0 0 4px var(--chip);
}
/* JEV wasn't sure: a ring in the genre's color instead of a filled disc. */
html .ytt-genre[unsure] {
  background: none;
  box-shadow: inset 0 0 0 1.5px var(--chip);
  color: var(--yt-spec-text-secondary, #606060);
}
.ytt-genre svg {
  width: 15px;
  height: 15px;
}

#ytt-sort {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: #0f0f0f;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
/* The button sits outside YouTube's app, where its theme colors don't reach,
   so dark mode is matched by hand. */
html[dark] #ytt-sort {
  background: #f1f1f1;
  color: #0f0f0f;
}
#ytt-sort[aria-pressed="true"] {
  box-shadow: 0 0 0 3px #3ea6ff, 0 2px 8px rgba(0, 0, 0, 0.25);
}
#ytt-sort svg {
  width: 22px;
  height: 22px;
}
#ytt-sort[busy] {
  cursor: progress;
}
#ytt-sort[busy] svg {
  animation: ytt-spin 1s linear infinite;
}
@keyframes ytt-spin {
  to {
    transform: rotate(360deg);
  }
}
#ytt-sort[hidden] {
  display: none;
}
.ytt-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  box-sizing: border-box;
  border-radius: 9px;
  background: #cc0000;
  color: #fff;
  font: 600 11px/18px Roboto, Arial, sans-serif;
  text-align: center;
}
`);

// ---------- Page fixes ----------
// Sets the <html> attributes that turn each rule on, sends Shorts links to
// the normal player, keeps theater mode from being the default, and tags the
// few Shorts entries that can only be found by their text.

const root = document.documentElement;
let settings = { ...DEFAULTS, ...GM_getValue('settings', {}) };

function apply() {
  for (const s of SETTINGS) root.toggleAttribute(s.attr, !!settings[s.key]);
  redirectShorts();
  // The player only re-measures itself on resize, so tell it the small-player
  // rule may have changed its box.
  window.dispatchEvent(new Event('resize'));
}

function saveSetting(key, on) {
  settings = { ...settings, [key]: on };
  GM_setValue('settings', settings);
  apply();
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
// Clearing the cookie this early is only safe off video pages; on a video
// page the player has already read it and leaveTheater() handles it.
if (settings.player && location.pathname !== '/watch') clearWideCookie();

// A switch flipped in another YouTube tab.
GM_addValueChangeListener('settings', (name, old, value, remote) => {
  if (!remote) return;
  settings = { ...DEFAULTS, ...value };
  apply();
});

// ---------- Genre sorting ----------
// An icon button on feed pages that asks JEV which genre each video belongs
// to and puts that genre's Lucide icon beside it. Clicking a video's genre
// icon shows only that genre. Nothing happens until you click the button:
// each page starts plain, a click sorts what's on screen, and videos that
// load as you scroll wait for another click. Answers are cached by video, so
// a click only sends the ones JEV hasn't sorted yet.

const UNSURE = 0.5; // below this confidence the genre icon is drawn as a ring

const GENRE = Object.fromEntries(GENRES.map(g => [g.id, g]));
const genreOf = new Map(); // video id -> { genre, confidence }
const covered = new Set(); // ids your clicks have sorted on this page
let only = '';             // the genre the feed is narrowed to, or ''
let status = '';           // '', 'busy' or an error code

// White or near-black, whichever has more contrast on the given color.
function inkFor(hex) {
  const lin = i => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const y = 0.2126 * lin(1) + 0.7152 * lin(3) + 0.0722 * lin(5);
  return 1.05 / (y + 0.05) >= (y + 0.05) / 0.0549 ? '#fff' : '#0f0f0f';
}

function icon(name) {
  const svg = lucide.createElement(lucide.icons[name]);
  svg.setAttribute('aria-hidden', 'true');
  return svg;
}

const button = document.createElement('button');
button.id = 'ytt-sort';
button.addEventListener('click', () => {
  if (status === 'busy') return;
  if (status === 'bad-key' || !GM_getValue('jevKey', '').trim()) {
    openSettings(true);
    return;
  }
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
    const reply = await classify(todo).catch(err => ({ error: err.message, detail: err.detail }));
    if (reply.error) {
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
  tag.style.setProperty('--chip', def.color);
  tag.style.setProperty('--ink', inkFor(def.color));
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
  else if (status === 'no-key') setButton('KeyRound', 'Click to add your JEV key');
  else if (status === 'bad-key') setButton('KeyRound', 'JEV rejected the key. Click to change it' + detail);
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
  GM_setValue('genreCache', { for: GENRES_VERSION, v });
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

const cache = GM_getValue('genreCache', null);
if (cache?.for === GENRES_VERSION) {
  for (const [id, g] of Object.entries(cache.v)) genreOf.set(id, g);
}
soon();

// A new key clears an old key error; it doesn't send anything by itself.
function keyChanged() {
  if (status === 'busy') return;
  status = '';
  button.dataset.detail = '';
  soon();
}
GM_addValueChangeListener('jevKey', (name, old, value, remote) => {
  if (remote) keyChanged();
});

// The button goes straight into <body>, outside YouTube's app, so the app's
// re-renders can't remove it.
if (document.body) document.body.append(button);
else document.addEventListener('DOMContentLoaded', () => document.body.append(button));

// ---------- Asking JEV ----------
// Asks JEV, TypeSafe's decision model, which genre each video belongs to.
// GM_xmlhttpRequest sends the request from the userscript manager rather
// than from youtube.com, so the API key never touches the page and the
// request isn't blocked by the page's cross-origin rules.
// API reference: https://docs.typesafe.ai/api

const ENDPOINT = 'https://api.typesafe.ai/v1/systemone';
const BATCH = 40;

// videos: [{ id, title, channel }] -> { genres: { id: { genre, confidence } } }
async function classify(videos) {
  const jevKey = GM_getValue('jevKey', '').trim();
  if (!jevKey) throw new Error('no-key');
  const genres = {};
  for (let i = 0; i < videos.length; i += BATCH) {
    const batch = videos.slice(i, i + BATCH);
    const answers = await ask(batch, jevKey);
    batch.forEach((v, j) => {
      const a = answers[`v${j}`];
      if (a?.choice) genres[v.id] = { genre: a.choice, confidence: a.confidence ?? 1 };
    });
  }
  return { genres };
}

// One request per batch: the videos are the state, and each gets its own
// Choice question pointing at it by index, the pattern TypeSafe recommends
// for judging items in a list. All questions are answered in parallel.
const CRITERIA = Object.fromEntries(GENRES.map(g => [g.id, g.about]));

async function ask(batch, key) {
  const body = JSON.stringify({
    model: 'jev-latest',
    state: { videos: batch.map(({ title, channel }) => (channel ? { title, channel } : { title })) },
    questions: Object.fromEntries(batch.map((_, j) => [`v${j}`, {
      type: 'choice',
      instructions: `Which genre does \`videos[${j}]\` belong to?`,
      criteria: CRITERIA,
    }])),
  });
  for (let attempt = 0; ; attempt++) {
    const res = await post(ENDPOINT, { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body);
    if (res.status >= 200 && res.status < 300) return JSON.parse(res.responseText).answers;
    // Rate limited (429) or overloaded (529 and other 5xx): back off and retry.
    if ((res.status === 429 || res.status >= 500) && attempt < 2) {
      const wait = Number(/^retry-after:\s*(\S+)/im.exec(res.responseHeaders)?.[1]) || attempt + 1;
      await new Promise(r => setTimeout(r, wait * 1000));
      continue;
    }
    // Pass TypeSafe's own explanation along so the button can show it.
    const err = new Error(res.status === 401 ? 'bad-key' : `http-${res.status}`);
    const text = res.responseText;
    try {
      const d = JSON.parse(text).detail;
      err.detail = `${res.status}: ${typeof d === 'string' ? d : d?.message || text}`;
    } catch {
      err.detail = `${res.status}: ${text.slice(0, 300)}`;
    }
    throw err;
  }
}

// GM_xmlhttpRequest as a promise of the response.
function post(url, headers, data) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'POST',
      url,
      headers,
      data,
      onload: resolve,
      onerror: () => reject(new Error('unreachable')),
      ontimeout: () => reject(new Error('unreachable')),
    });
  });
}

// ---------- Settings panel ----------
// The switches and the JEV key. "Settings" in the userscript manager's menu
// opens it, and so does the sort button when JEV has no key or rejects it.
// It sits in a closed shadow root, so YouTube's styles can't reach it and
// YouTube's scripts can't read the key field.

const SWITCH_ICONS = {
  text: 'Type',
  list: 'Rows3',
  player: 'PictureInPicture2',
  shorts: 'Smartphone',
  promos: 'Megaphone',
  home: 'House',
  related: 'PanelRight',
  comments: 'MessageSquare',
};

const PANEL_CSS = `
:host {
  all: initial;
  --bg: #ffffff;
  --fg: #0f0f0f;
  --muted: #606060;
  --track: #c9c9c9;
  --on: #0f0f0f;
  --knob: #ffffff;
  --hover: #f2f2f2;
}

/* YouTube's own theme, copied onto the panel when it opens. */
:host([dark]) {
  --bg: #212121;
  --fg: #f1f1f1;
  --muted: #aaaaaa;
  --track: #555555;
  --on: #f1f1f1;
  --knob: #212121;
  --hover: #2e2e2e;
}

.panel {
  position: fixed;
  top: 56px;
  right: 16px;
  z-index: 3000;
  width: 260px;
  padding: 6px;
  box-sizing: border-box;
  border-radius: 12px;
  background: var(--bg);
  color: var(--fg);
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.25);
  font: 14px/1.2 Roboto, Arial, sans-serif;
}

header {
  display: flex;
  align-items: center;
  padding: 2px 2px 4px 8px;
  color: var(--muted);
  font-size: 12px;
}

header button {
  display: flex;
  padding: 4px;
  border: none;
  border-radius: 50%;
  background: none;
  cursor: pointer;
}

header button:hover {
  background: var(--hover);
}

header svg {
  width: 16px;
  height: 16px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
}

label:hover {
  background: var(--hover);
}

svg {
  flex: none;
  width: 20px;
  height: 20px;
  stroke: var(--muted);
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

span {
  flex: 1;
}

input {
  appearance: none;
  flex: none;
  position: relative;
  width: 32px;
  height: 18px;
  margin: 0;
  border-radius: 9px;
  background: var(--track);
  cursor: pointer;
  transition: background 0.15s;
}

input::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--knob);
  transition: transform 0.15s;
}

input:checked {
  background: var(--on);
}

input:checked::after {
  transform: translateX(14px);
}

input:focus-visible {
  outline: 2px solid var(--muted);
  outline-offset: 2px;
}

form {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--track);
}

form label {
  cursor: default;
}

form label:hover {
  background: none;
}

form input {
  appearance: none;
  flex: 1;
  width: auto;
  height: auto;
  min-width: 0;
  margin: 0;
  padding: 6px 8px;
  border: 1px solid var(--track);
  border-radius: 6px;
  background: var(--bg);
  color: var(--fg);
  font: 13px/1.35 Roboto, Arial, sans-serif;
  cursor: text;
}

form input::after {
  content: none;
}

form input:focus {
  outline: none;
  border-color: var(--muted);
}
`;

let panel = null; // the panel's host element while it's open

function openSettings(focusKey = false) {
  if (panel) return;
  panel = document.createElement('div');
  panel.toggleAttribute('dark', root.hasAttribute('dark'));
  const shadow = panel.attachShadow({ mode: 'closed' });
  const style = document.createElement('style');
  style.textContent = PANEL_CSS;

  const name = document.createElement('span');
  name.textContent = 'Text-Only YouTube';
  const close = document.createElement('button');
  close.title = 'Close';
  close.setAttribute('aria-label', 'Close');
  close.append(icon('X'));
  close.addEventListener('click', closeSettings);
  const header = document.createElement('header');
  header.append(name, close);

  const list = document.createElement('ul');
  for (const s of SETTINGS) {
    const label = document.createElement('label');
    const text = document.createElement('span');
    text.textContent = s.label;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = !!settings[s.key];
    box.addEventListener('change', () => saveSetting(s.key, box.checked));
    label.append(icon(SWITCH_ICONS[s.key]), text, box);
    const li = document.createElement('li');
    li.append(label);
    list.append(li);
  }

  // The JEV key for genre sorting, saved as you type.
  const key = document.createElement('input');
  key.type = 'password';
  key.placeholder = 'JEV API key';
  key.spellcheck = false;
  key.value = GM_getValue('jevKey', '');
  key.addEventListener('input', () => {
    GM_setValue('jevKey', key.value.trim());
    keyChanged();
  });
  const keyLabel = document.createElement('label');
  keyLabel.title = 'JEV API key';
  keyLabel.append(icon('KeyRound'), key);
  const form = document.createElement('form');
  form.autocomplete = 'off';
  form.addEventListener('submit', e => e.preventDefault());
  form.append(keyLabel);

  const card = document.createElement('div');
  card.className = 'panel';
  card.append(header, list, form);
  shadow.append(style, card);
  document.body.append(panel);
  if (focusKey) key.focus();
}

function closeSettings() {
  panel?.remove();
  panel = null;
}

// A click anywhere else on the page closes the panel.
document.addEventListener('pointerdown', e => {
  if (panel && !e.composedPath().includes(panel)) closeSettings();
}, true);

// Keys pressed in the panel stop here, so typing the key doesn't set off
// YouTube's shortcuts (k pauses, f goes full screen). The script runs before
// YouTube's, so these listeners come first.
for (const type of ['keydown', 'keypress', 'keyup']) {
  window.addEventListener(type, e => {
    if (!panel || !e.composedPath().includes(panel)) return;
    e.stopImmediatePropagation();
    if (type === 'keydown' && e.key === 'Escape') closeSettings();
  }, true);
}

GM_registerMenuCommand('Settings', () => (panel ? closeSettings() : openSettings()));
