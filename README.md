# Text-Only YouTube

A Chrome extension that turns YouTube into a plain list of titles. Thumbnails,
channel pictures, banners and Shorts are hidden everywhere except the video
you're watching, and the home, subscriptions and channel pages show one video
per row.

## Install

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and pick this folder.
4. Pin the extension so its switches are one click away.

After editing any file, click the reload arrow on the extension's card and
refresh the YouTube tab.

## Switches

| Switch | Default | What it hides |
| --- | --- | --- |
| Text only | on | Thumbnails, profile pictures, channel banners, hover previews, end-of-video walls and cards, the channel watermark |
| One per row | on | The multi-column grid on home, subscriptions and channel pages |
| Small player | on | The full-size video: it starts 360px wide, and theater mode (the button behind ‹ on the small player, or the T key) shows it big. Every video opens out of theater mode |
| No Shorts | on | Shorts shelves, the sidebar entry, search filter and channel tab; Shorts links open in the normal player |
| No ads or games | on | Feed ads, sponsored search results, the Playables shelf, merch shelves |
| No home feed | off | Everything on the home page below the filter chips |
| No suggestions | off | Suggested videos beside and under the player |
| No comments | off | The comments section |

## Genres

On home, subscriptions and channel video pages, a round tags button in the
bottom-right corner sends the titles and channel names on screen to
[JEV](https://docs.typesafe.ai/), TypeSafe's decision model, with one Choice
question per video: which of the genres in `genres.js` does it belong to?
Each video then gets that genre's [Lucide](https://lucide.dev) icon where the
channel picture was, on a disc colored by family: gold for faith and heritage,
blue for knowledge, pink for arts and fun, green for everyday life, gray for
other. Hover for the name; a ring instead of a disc means JEV was unsure.
Click a video's genre icon to show only that genre, and click it again, or
the corner button, to show everything.

Nothing is sent until you click. Every page starts plain, and videos that
load as you scroll wait for another click (the button shows how many). Once
everything on screen is sorted, clicking the button takes the icons away.

Setup: sign in at [console.typesafe.ai](https://console.typesafe.ai), create
an API key, and paste it into the key field in the extension's menu.

To change the genres, edit `genres.js`: each has an id, a label, a Lucide icon
name (PascalCase, as in `lucide.icons`) and an `about` line that JEV reads
when choosing. JEV reads literally, so say plainly what belongs in each.
Changing the list starts the cache over. JEV allows up to 255 options.

JEV costs $0.042 per million input tokens and nothing for output; sorting a
page of 30 videos into 20 genres is roughly 12,000 tokens, about a twentieth
of a cent. Answers are cached per video, so a click only sends videos JEV
hasn't sorted yet. The key stays in this browser's extension storage, and only
the background worker uses it. JEV is trained mainly on English, so titles in
other languages get less accurate answers.

## When something comes back

YouTube renames page elements a few times a year. When a thumbnail or a
Shorts shelf reappears, right-click it, choose **Inspect**, find the element's
tag name and add it to the matching group in `content.css`.

Files:

- `content.css` holds every hiding rule, grouped by switch.
- `content.js` turns the switches into attributes on `<html>`, redirects
  `/shorts/` links, keeps theater mode from being the default and tags Shorts
  entries that only text can identify.
- `classify.js` adds the genre button and icons; `genres.js` is the genre list.
- `background.js` makes the JEV requests, so the key never reaches the page.
- `settings.js` lists the switches and their defaults.
- `popup.*` is the toolbar menu.
- `vendor/lucide` is the Lucide icon library (1.52.0, ISC license).
