// Shared by the content scripts, the popup and the background worker.
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

// "Undumb my feed" asks JEV a yes/no question per video. Its answers depend on
// these two descriptions, so they're editable in the popup. Kept in
// chrome.storage.local with the API key, which never leaves this device.
const JEV_DEFAULTS = {
  jevKey: '',
  jevYes: 'Teaches something real, builds a skill, explains news, history or ideas, or feeds the mind or soul.',
  jevNo: 'Mainly for passing time: drama, pranks, reactions, gossip, clickbait, or mindless entertainment.',
};
