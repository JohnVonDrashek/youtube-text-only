# Text-Only YouTube

A userscript that turns YouTube into a plain list of titles. Thumbnails,
channel pictures, banners and Shorts are hidden everywhere except the video
you're watching, and the home, subscriptions and channel pages show one video
per row.

## Install

1. Install [Violentmonkey](https://violentmonkey.github.io/).
2. Open
   [text-only-youtube.user.js](https://raw.githubusercontent.com/JohnVonDrashek/youtube-text-only/main/text-only-youtube.user.js)
   and click **Install** on the page Violentmonkey shows.

Share that same link to give someone else the script. Violentmonkey checks it
for updates, so raise `@version` whenever you push a change and installed
copies pick it up.

To keep editing the file in this folder, turn on **Allow access to file URLs**
for Violentmonkey in `chrome://extensions`, drag the file into a Chrome tab
and tick the option to track the local file on the install page. Violentmonkey
reinstalls it each time you save, as long as that tab stays open. Refresh the
YouTube tab to see the change.

## Switches

On a YouTube tab, open Violentmonkey's menu and choose **Settings** under
Text-Only YouTube. The panel opens in the top-right corner of the page; click
anywhere else or press Escape to close it.

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
question per video: which of the genres in `GENRES` does it belong to?
Each video then gets that genre's [Lucide](https://lucide.dev) icon where the
channel picture was, on a disc in that genre's own color (gold for Faith, red
for Film & TV, cyan for Tech and so on). Hover for the name; a ring instead of
a disc means JEV was unsure.
Click a video's genre icon to show only that genre, and click it again, or
the corner button, to show everything.

Nothing is sent until you click. Every page starts plain, and videos that
load as you scroll wait for another click (the button shows how many). Once
everything on screen is sorted, clicking the button takes the icons away.

Setup: sign in at [console.typesafe.ai](https://console.typesafe.ai), create
an API key, and paste it into the key field in the settings panel. Clicking
the corner button before you've added a key opens the panel for you.

To change the genres, edit `GENRES` near the top of the script: each has an
id, a disc color, a label, a Lucide icon name (PascalCase, as in
`lucide.icons`) and an `about` line that JEV reads when choosing. JEV reads
literally, so say plainly what belongs in each. Changing the list starts the
cache over. JEV allows up to 255 options.

JEV costs $0.042 per million input tokens and nothing for output; sorting a
page of 30 videos into 20 genres is roughly 12,000 tokens, about a twentieth
of a cent. Answers are cached per video, so a click only sends videos JEV
hasn't sorted yet. The key stays in Violentmonkey's storage for this script,
and the requests go out through Violentmonkey's `GM_xmlhttpRequest`, so
YouTube's own scripts can't read it. JEV is trained mainly on English, so
titles in other languages get less accurate answers.

## When something comes back

YouTube renames page elements a few times a year. When a thumbnail or a
Shorts shelf reappears, right-click it, choose **Inspect**, find the element's
tag name and add it to the matching group in the script's stylesheet.

The script's sections, in order:

- **Switches** lists the switches and their defaults.
- **Genres** is the genre list.
- **Stylesheet** holds every hiding rule, grouped by switch.
- **Page fixes** turns the switches into attributes on `<html>`, redirects
  `/shorts/` links, keeps theater mode from being the default and tags Shorts
  entries that only text can identify.
- **Genre sorting** adds the genre button and icons.
- **Asking JEV** makes the JEV requests.
- **Settings panel** is the panel that Violentmonkey's menu opens.

Lucide (1.52.0, ISC license) comes in through `@require` from jsDelivr.
Violentmonkey downloads it once at install, not on every page load.
