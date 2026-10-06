// Shared by the content script and the popup.
// Each setting turns on an attribute on <html>, and content.css keys off it.
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
