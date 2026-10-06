// 24x24 line icons, one per setting.
const ICONS = {
  text: '<path d="M4 6h16M4 10h16M4 14h10M4 18h12"/>',
  list: '<rect x="4" y="4" width="16" height="4" rx="1"/><rect x="4" y="10" width="16" height="4" rx="1"/><rect x="4" y="16" width="16" height="4" rx="1"/>',
  player: '<rect x="3" y="5" width="18" height="14" rx="2"/><rect x="6" y="8" width="7" height="5" rx="1"/>',
  shorts: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M4 4l16 16"/>',
  promos: '<path d="M4 10v4h3l6 4V6L7 10H4z"/><path d="M17 9l4 6M21 9l-4 6"/>',
  home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M4 4l16 16"/>',
  related: '<rect x="3" y="5" width="11" height="14" rx="1"/><path d="M17 6h4M17 10h4M17 14h4M17 18h4"/>',
  comments: '<path d="M4 5h16v11H9l-5 4z"/><path d="M4 4l16 16"/>',
};

const list = document.getElementById('settings');

chrome.storage.sync.get(DEFAULTS, stored => {
  for (const s of SETTINGS) {
    const li = document.createElement('li');
    li.innerHTML = `
      <label>
        <svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[s.key]}</svg>
        <span>${s.label}</span>
        <input type="checkbox">
      </label>`;
    const box = li.querySelector('input');
    box.checked = stored[s.key];
    box.addEventListener('change', () => chrome.storage.sync.set({ [s.key]: box.checked }));
    list.append(li);
  }
});
