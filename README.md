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

## Undumb my feed

On home, subscriptions and channel video pages, a button in the bottom-right
corner sends the titles and channel names in the feed to
[JEV](https://docs.typesafe.ai/), TypeSafe's yes/no decision model, with one
question per video: is watching this a productive use of time? Videos it
gives under a 50% chance are hidden.

Nothing is sent until you click. Every page starts unfiltered, and videos that
load as you scroll wait for another click (the button changes to "Undumb 12
more"). Once everything on screen is filtered, clicking shows it all again.

Setup: sign in at [console.typesafe.ai](https://console.typesafe.ai), create
an API key, and paste it into the key field in the extension's menu. The two
boxes under it describe what counts as productive (✓) and what doesn't (✗);
JEV reads them literally, so be specific. After editing them, the next click
re-asks about every video.

JEV costs $0.042 per million input tokens and nothing for output, so a feed of
30 titles costs a small fraction of a cent. Answers are cached per video, so a
click only sends videos JEV hasn't judged yet. The key stays in this
browser's extension storage, and only the background worker uses it. JEV is
trained mainly on English, so titles in other languages get less accurate
answers.

## When something comes back

YouTube renames page elements a few times a year. When a thumbnail or a
Shorts shelf reappears, right-click it, choose **Inspect**, find the element's
tag name and add it to the matching group in `content.css`.

Files:

- `content.css` holds every hiding rule, grouped by switch.
- `content.js` turns the switches into attributes on `<html>`, redirects
  `/shorts/` links, keeps theater mode from being the default and tags Shorts
  entries that only text can identify.
- `undumb.js` adds the Undumb button and hides what JEV calls unproductive.
- `background.js` makes the JEV requests, so the key never reaches the page.
- `settings.js` lists the switches and their defaults.
- `popup.*` is the toolbar menu.
