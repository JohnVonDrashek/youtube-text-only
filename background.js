// Asks JEV, TypeSafe's yes/no decision model, whether each video is
// productive. This runs in the extension's background worker rather than on
// youtube.com, so the API key never touches the page and the request isn't
// blocked by the page's cross-origin rules.
// API reference: https://docs.typesafe.ai/api

importScripts('settings.js');

const ENDPOINT = 'https://api.typesafe.ai/v1/systemone';
const BATCH = 50;

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg.type !== 'jev-judge') return;
  judge(msg.videos).then(reply, err => reply({ error: err.message, detail: err.detail }));
  return true; // reply comes later
});

// videos: [{ id, title, channel }] -> { verdicts: { id: probability it's productive } }
async function judge(videos) {
  const { jevKey, jevYes, jevNo } = await chrome.storage.local.get(JEV_DEFAULTS);
  if (!jevKey.trim()) throw new Error('no-key');
  const verdicts = {};
  for (let i = 0; i < videos.length; i += BATCH) {
    const batch = videos.slice(i, i + BATCH);
    const answers = await ask(batch, jevKey.trim(), jevYes, jevNo);
    batch.forEach((v, j) => {
      const p = answers[`v${j}`]?.noul;
      if (typeof p === 'number') verdicts[v.id] = p;
    });
  }
  return { verdicts };
}

// One request per batch: the videos are the state, and each gets its own
// yes/no question pointing at it by index, the pattern TypeSafe recommends for
// judging items in a list. All questions are answered in parallel.
async function ask(batch, key, yes, no) {
  const body = JSON.stringify({
    model: 'jev-latest',
    state: { videos: batch.map(({ title, channel }) => (channel ? { title, channel } : { title })) },
    questions: Object.fromEntries(batch.map((_, j) => [`v${j}`, {
      type: 'noul',
      instructions: `Is watching \`videos[${j}]\` a productive use of time?`,
      criteria: { true: yes, false: no },
    }])),
  });
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body,
    });
    if (res.ok) return (await res.json()).answers;
    // Rate limited (429) or overloaded (529 and other 5xx): back off and retry.
    if ((res.status === 429 || res.status >= 500) && attempt < 2) {
      const wait = Number(res.headers.get('retry-after')) || attempt + 1;
      await new Promise(r => setTimeout(r, wait * 1000));
      continue;
    }
    // Pass TypeSafe's own explanation along so the button can show it.
    const err = new Error(res.status === 401 ? 'bad-key' : `http-${res.status}`);
    const text = await res.text();
    try {
      const d = JSON.parse(text).detail;
      err.detail = `${res.status}: ${typeof d === 'string' ? d : d?.message || text}`;
    } catch {
      err.detail = `${res.status}: ${text.slice(0, 300)}`;
    }
    throw err;
  }
}
