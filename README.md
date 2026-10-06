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
| No Shorts | on | Shorts shelves, the sidebar entry, search filter and channel tab; Shorts links open in the normal player |
| No ads or games | on | Feed ads, sponsored search results, the Playables shelf, merch shelves |
| No home feed | off | Everything on the home page below the filter chips |
| No suggestions | off | Suggested videos beside and under the player |
| No comments | off | The comments section |

## When something comes back

YouTube renames page elements a few times a year. When a thumbnail or a
Shorts shelf reappears, right-click it, choose **Inspect**, find the element's
tag name and add it to the matching group in `content.css`.

Files:

- `content.css` holds every hiding rule, grouped by switch.
- `content.js` turns the switches into attributes on `<html>`, redirects
  `/shorts/` links and tags Shorts entries that only text can identify.
- `settings.js` lists the switches and their defaults.
- `popup.*` is the toolbar menu.
