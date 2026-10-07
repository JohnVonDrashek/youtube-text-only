// Lucide icon names, one per setting.
const ICONS = {
  text: 'type',
  list: 'rows-3',
  player: 'picture-in-picture-2',
  shorts: 'smartphone',
  promos: 'megaphone',
  home: 'house',
  related: 'panel-right',
  comments: 'message-square',
};

const list = document.getElementById('settings');

chrome.storage.sync.get(DEFAULTS, stored => {
  for (const s of SETTINGS) {
    const li = document.createElement('li');
    li.innerHTML = `
      <label>
        <i data-lucide="${ICONS[s.key]}"></i>
        <span>${s.label}</span>
        <input type="checkbox">
      </label>`;
    const box = li.querySelector('input');
    box.checked = stored[s.key];
    box.addEventListener('change', () => chrome.storage.sync.set({ [s.key]: box.checked }));
    list.append(li);
  }
  lucide.createIcons({ icons: lucide.icons });
});

// The JEV key for genre sorting, saved as you type.
lucide.createIcons({ icons: lucide.icons });
const form = document.getElementById('jev');
chrome.storage.local.get(JEV_DEFAULTS, stored => {
  for (const field of form.elements) {
    field.value = stored[field.name];
    field.addEventListener('input', () => {
      chrome.storage.local.set({ [field.name]: field.value.trim() || JEV_DEFAULTS[field.name] });
    });
  }
});
