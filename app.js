// All problem randomness goes through rng(), which makeProblem seeds so a missed problem can come back exactly.
let rng = Math.random;
function seeded(seed) { let t = seed >>> 0; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
const newSeed = () => Math.floor(Math.random() * 2 ** 31);
const pick = a => a[Math.floor(rng() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
// The child's name, set on the grown-ups page.
const childName = () => (state.childName || '').trim();
const N = () => childName() || 'your child';
const greet = s => childName() ? `${s}, ${childName()}!` : `${s}!`;

/* ---------- the maps ---------- */
const WORLD = MAPS.world, USMAP = MAPS.us;
// Every country's pieces (Russia is two: Europe and Asia; France has pieces on several continents), its biggest piece, and its size on the world map.
const COUNTRY = {};
for (const s of WORLD.shapes) {
  const c = COUNTRY[s[0]] = COUNTRY[s[0]] || { code: s[0], pieces: [], size: 0, big: null };
  c.pieces.push(s); c.size += s[5];
  if (!c.big || s[5] > c.big[5]) c.big = s;
}
for (const c of Object.values(COUNTRY)) Object.assign(c, { cont: c.big[1], cx: c.big[3], cy: c.big[4], name: WORLD.names[c.code] || c.code });
const STATE = Object.fromEntries(USMAP.shapes.map(s => [s[0], { code: s[0], name: s[1], d: s[2], cx: s[3], cy: s[4], size: s[5] }]));
const SEA = Object.fromEntries(Object.entries(WORLD.seas).map(([k, v]) => [k, { code: k, name: v[0], cx: v[1], cy: v[2], size: v[3], ocean: v[4] }]));
const SEA_PARENT = Object.fromEntries(Object.entries(SEA_PARTS).flatMap(([k, parts]) => parts.map(p => [p, k])));
const flagOf = code => String.fromCodePoint(...[...code].map(ch => 0x1F1E6 + ch.charCodeAt(0) - 65));
// Small countries are asked on a close-up of their part of the world.
const WORLD_VIEW_MIN = 400;
const VIEW_OF = { IL: 'ME', JM: 'CB', CU: 'CB' };
function viewFor(code) {
  const c = COUNTRY[code];
  return c.size >= WORLD_VIEW_MIN ? WORLD.views.world : WORLD.views[VIEW_OF[code] || c.cont];
}
// Seas are drawn bigger than they look (their outlines run under the land), so the bar for the whole-world view is higher.
// A small sea gets the smallest close-up that holds it.
function seaView(key) {
  const s = SEA[key];
  if (s.size >= 800) return WORLD.views.world;
  const fits = Object.entries(WORLD.views).filter(([k, v]) => k !== 'world' && k !== 'OC' && inView([v[0] + v[2] * 0.12, v[1] + v[3] * 0.12, v[2] * 0.76, v[3] * 0.76], s.cx, s.cy));
  fits.sort((a, b) => a[1][2] * a[1][3] - b[1][2] * b[1][3]);
  return fits.length ? fits[0][1] : WORLD.views.world;
}
// where a continent's name goes: the middle of its land, weighted by size
const CONT_AT = {};
for (const s of WORLD.shapes) {
  const a = CONT_AT[s[1]] = CONT_AT[s[1]] || { x: 0, y: 0, w: 0 };
  a.x += s[3] * s[5]; a.y += s[4] * s[5]; a.w += s[5];
}
for (const a of Object.values(CONT_AT)) { a.x /= a.w; a.y /= a.w; }
CONT_AT.NA = { x: 215, y: 120 }; CONT_AT.AN = { x: 500, y: 498 };

/* ---------- places: topics split into sets, one set per level ---------- */
const CONT = Object.fromEntries(CONTINENTS.map(([id, name, fact]) => [id, { wid: 'continent:' + id, kind: 'continent', id, name, fact }]));
const OCEAN = Object.fromEntries(OCEANS.map(([id, name, fact]) => [id, { wid: 'ocean:' + id, kind: 'ocean', id, name, fact }]));
const CTRY = {};
for (const set of COUNTRY_SETS) for (const [id, name, fact] of set) CTRY[id] = { wid: 'country:' + id, kind: 'country', id, name, fact };
const SEAI = {};
for (const set of SEA_SETS) for (const [id, name, fact] of set) SEAI[id] = { wid: 'sea:' + id, kind: 'sea', id, name, fact };
const ST = {};
for (const set of STATE_SETS) for (const [id, fact] of set) ST[id] = { wid: 'state:' + id, kind: 'state', id, name: STATE[id].name, fact };
const FLAG = Object.fromEntries(Object.values(CTRY).map(c => [c.id, { wid: 'flag:' + c.id, kind: 'flag', id: c.id, name: c.name, fact: `This is the flag of ${c.name}.` }]));
const HOME_ITEMS = [
  { ...ST[HOME.state], home: true, ask: 'Which state do we live in?', fact: `We live in ${HOME.town}, in ${ST[HOME.state].name}. ${HOME.townFact}`, answer: `We live in ${ST[HOME.state].name}.` },
  { ...CTRY[HOME.country], home: true, ask: 'Which country do we live in?', fact: `Our country is ${CTRY[HOME.country].name}. ${CTRY[HOME.country].fact.replace(/^[^.]*\. /, '')}`, answer: `We live in ${CTRY[HOME.country].name}.` },
  { ...CONT[HOME.continent], home: true, ask: 'Which continent do we live on?', fact: `Our continent is ${CONT[HOME.continent].name}. It's a giant piece of land with many countries.`, answer: `We live in ${CONT[HOME.continent].name}.` },
  { ...OCEAN[HOME.ocean], home: true, ask: 'Which ocean is closest to our home?', fact: `The ocean closest to our home is ${OCEAN[HOME.ocean].name}. It's the biggest ocean in the world.`, answer: `Our ocean is ${OCEAN[HOME.ocean].name}.` },
];
const TOPIC = Object.fromEntries(TOPICS.map(t => [t.id, t]));
const ORDER = TOPICS.map(t => t.id);
TOPIC.home.sets = [HOME_ITEMS];
TOPIC.continents.sets = CONTINENT_SETS.map(s => s.map(id => CONT[id]));
TOPIC.oceans.sets = OCEAN_SETS.map(s => s.map(id => OCEAN[id]));
TOPIC.seas.sets = SEA_SETS.map(s => s.map(c => SEAI[c[0]]));
TOPIC.countries.sets = COUNTRY_SETS.map(s => s.map(c => CTRY[c[0]]));
TOPIC.flags.sets = COUNTRY_SETS.map(s => s.map(c => FLAG[c[0]]));
TOPIC.states.sets = STATE_SETS.map(s => s.map(c => ST[c[0]]));
for (const t of TOPICS) t.levels = t.sets.map((s, i) => t.id === 'home' ? 'Home' : `Set ${i + 1}: ${s.slice(0, 3).map(w => w.name.replace(/^the /, '')).join(', ')}${s.length > 3 ? '…' : ''}`);
const levelsOf = k => TOPIC[k].levels;
const maxLevel = k => levelsOf(k).length;
const allItems = k => TOPIC[k].sets.flat();
const findItem = (k, wid) => allItems(k).find(w => w.wid === wid);
const label = w => w.kind === 'flag' ? `${flagOf(w.id)} ${cap(w.name)}` : cap(w.name);

/* ---------- state ---------- */
function defaultState() {
  return {
    childName: 'Tom', levels: Object.fromEntries(ORDER.map(k => [k, 1])),
    on: { home: true, continents: true, oceans: true },
    rec: {}, stretch: {}, mastered: {}, words: {}, cards: [], cleared: 0, factAt: {},
    sessions: [], log: [], done: {}, total: 0, perSession: 10, sayIt: true, funFacts: true, autoSpeak: false, speed: 'normal', updatedAt: 0,
  };
}
function normalize(s) {
  s = Object.assign(defaultState(), s || {});
  s.levels = Object.assign(defaultState().levels, s.levels);
  s.on = Object.assign({}, s.on);
  return s;
}

/* ---------- storage: this device first, Supabase sync when a sync code is set ---------- */
const LS_KEY = 'toms-atlas-v1';
const CODE_KEY = 'toms-atlas-sync-code';
const CFG = window.ATLAS_CONFIG || {};
const syncAvailable = !!(CFG.supabaseUrl && CFG.supabaseKey && window.crypto?.subtle);
function loadLocal() { try { const t = localStorage.getItem(LS_KEY); return t ? JSON.parse(t) : null; } catch (e) { return null; } }
function saveLocal() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {} }
let state = normalize(loadLocal());
const sync = { code: '', key: '', status: 'off', lastAt: 0, saving: false, dirty: false, error: '' };
try { sync.code = localStorage.getItem(CODE_KEY) || ''; } catch (e) {}

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const raw = [...bytes].map(b => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8)}`;
}
function cleanCode(c) {
  const raw = String(c).toUpperCase().replace(/[^A-Z0-9]/g, '');
  return raw.length === 12 ? `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8)}` : '';
}
// Shares the Chalkboard's Supabase table; the different prefix keeps this app's progress in its own row.
async function keyFor(code) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('toms-atlas:' + code));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function rpc(fn, body) {
  const res = await fetch(`${CFG.supabaseUrl}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    // New-style publishable keys (sb_publishable_…) go only in the apikey header; legacy anon JWTs also go in Authorization.
    headers: Object.assign({ apikey: CFG.supabaseKey, 'Content-Type': 'application/json' }, CFG.supabaseKey.startsWith('sb_') ? {} : { Authorization: `Bearer ${CFG.supabaseKey}` }),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${fn} failed (${res.status})`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
async function pushRemote() {
  if (!sync.key) return;
  if (sync.saving) { sync.dirty = true; return; }
  sync.saving = true;
  try { await rpc('chalkboard_save', { p_key: sync.key, p_data: state }); sync.status = 'ok'; sync.lastAt = Date.now(); sync.error = ''; }
  catch (e) { sync.status = 'error'; sync.error = navigator.onLine === false ? 'offline' : String(e.message || e); }
  sync.saving = false;
  if (screen === 'parent') render();
  if (sync.dirty) { sync.dirty = false; pushRemote(); }
}
// The newer copy wins: progress is saved after every answer, so the newest device has everything.
async function pullRemote() {
  if (!sync.key) return;
  try {
    const remote = await rpc('chalkboard_get', { p_key: sync.key });
    sync.status = 'ok'; sync.lastAt = Date.now(); sync.error = '';
    if (remote && (remote.updatedAt || 0) > (state.updatedAt || 0)) { state = normalize(remote); saveLocal(); }
    else if (!remote || (remote.updatedAt || 0) < (state.updatedAt || 0)) pushRemote();
  } catch (e) { sync.status = 'error'; sync.error = navigator.onLine === false ? 'offline' : String(e.message || e); }
  if (screen === 'home' || screen === 'parent') render();
}
async function startSync(code) {
  sync.code = code;
  try { localStorage.setItem(CODE_KEY, code); } catch (e) {}
  sync.key = await keyFor(code);
  sync.status = 'syncing';
  await pullRemote();
}
function stopSync() {
  sync.code = ''; sync.key = ''; sync.status = 'off';
  try { localStorage.removeItem(CODE_KEY); } catch (e) {}
}
function save() { state.updatedAt = Date.now(); saveLocal(); pushRemote(); }
function initSync() {
  if (!syncAvailable) return;
  if (sync.code) startSync(sync.code);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') pullRemote(); });
  window.addEventListener('online', () => pullRemote());
}

/* ---------- speech: questions are read aloud ---------- */
const canSpeak = 'speechSynthesis' in window;
const VOICE_KEY = 'toms-atlas-voice';
let voices = [];
function loadVoices() {
  try { voices = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang)); } catch (e) { voices = []; }
  if (screen === 'parent') render();
}
function savedVoiceName() { try { return localStorage.getItem(VOICE_KEY) || ''; } catch (e) { return ''; } }
const EN_VOICES = ['Samantha', 'Ava', 'Allison', 'Susan', 'Tom', 'Alex', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Karen', 'Daniel'];
function chosenVoice() {
  const name = savedVoiceName();
  const exact = name && voices.find(v => v.name === name);
  if (exact) return exact;
  const score = v => (/enhanced|premium|natural/i.test(v.name) ? 0 : 2) + (/en[-_]US/i.test(v.lang) ? 0 : 1);
  for (const p of EN_VOICES) {
    const hits = voices.filter(v => v.name.startsWith(p)).sort((a, b) => score(a) - score(b));
    if (hits.length) return hits[0];
  }
  return voices.slice().sort((a, b) => score(a) - score(b))[0] || null;
}
function say(text, slow) {
  if (!canSpeak || !text) return;
  try {
    speechSynthesis.cancel();
    const v = chosenVoice(), u = new SpeechSynthesisUtterance(text);
    u.lang = v ? v.lang : 'en-US';
    if (v) u.voice = v;
    u.rate = slow ? 0.6 : state.speed === 'slow' ? 0.8 : 0.95;
    speechSynthesis.speak(u);
  } catch (e) {}
}

/* ---------- what's known ---------- */
// words[wid] = { r: right on the first try, m: misses, k: marked known by a grown-up, c: asked in a quick check }
const rec = wid => state.words[wid];
const isKnown = wid => { const w = rec(wid); return !!w && (!!w.k || (w.r || 0) - (w.m || 0) >= 2); };
const isSeen = wid => !!rec(wid);
function knownCount() {
  const seen = new Set();
  for (const k of ORDER) for (const w of allItems(k)) if (isKnown(w.wid)) seen.add(w.wid);
  return seen.size;
}
// Places at or below the current level, plus any known places from later sets.
function eligible(k, L) {
  const sets = TOPIC[k].sets;
  return [...sets.slice(0, L).flat(), ...sets.slice(L).flat().filter(w => isKnown(w.wid))];
}

/* ---------- problem generators ---------- */
function weighted(pool) {
  const wt = w => isKnown(w.wid) ? 1 : isSeen(w.wid) ? 2.5 : 3;
  let total = pool.reduce((t, w) => t + wt(w), 0), x = rng() * total;
  for (const w of pool) { x -= wt(w); if (x <= 0) return w; }
  return pool[pool.length - 1];
}
// gate: once a round has its new places, only places already met (or introduced this round) can be picked
function pickTarget(k, L, kind, avoid, gate) {
  const sets = TOPIC[k].sets;
  let pool = kind === 'stretch' ? (sets[L] || []).filter(w => !isKnown(w.wid))
    : kind === 'easier' ? sets.slice(0, L - 1).flat()
    : eligible(k, L);
  if (!pool.length) pool = eligible(k, L);
  if (gate) { const met = pool.filter(w => isSeen(w.wid) || gate.has(w.wid)); if (met.length) pool = met; }
  const fresh = pool.filter(w => !avoid.has(w.wid));
  return weighted(fresh.length ? fresh : pool);
}
const inView = (v, x, y) => x >= v[0] && x <= v[0] + v[2] && y >= v[1] && y <= v[1] + v[3];
/* Three other countries (or states) to tap, all on the same map view.
   Places already met come first, and a brand-new place is easiest to find next to places already known. */
function others(t, view) {
  const isState = t.kind === 'state', isSea = t.kind === 'sea';
  const k = isState ? 'states' : isSea ? 'seas' : t.kind === 'flag' ? 'flags' : 'countries';
  const where = code => isState ? STATE[code] : isSea ? SEA[code] : COUNTRY[code];
  const fits = code => code !== t.id && where(code) && (isState ? code !== 'DC' : inView(view, where(code).cx, where(code).cy));
  const met = eligible(k, state.levels[k]).map(w => w.id).filter(fits);
  let pool = met;
  if (!isSeen(t.wid)) { const known = met.filter(id => isKnown(`${t.kind}:${id}`)); if (known.length >= 3) pool = known; }
  // then the topic's other places, then any big enough place on this view
  const minSize = isState ? 0 : (view[2] / 1000) ** 2 * 40;
  if (pool.length < 3) pool = pool.concat(shuffle(allItems(k).map(w => w.id).filter(id => fits(id) && !pool.includes(id))));
  if (pool.length < 3) pool = pool.concat(shuffle(Object.keys(isState ? STATE : isSea ? SEA : COUNTRY).filter(id => fits(id) && !pool.includes(id) && where(id).size >= minSize)));
  return shuffle(pool).slice(0, 3);
}
const nameOf = (kind, id) => kind === 'state' ? (ST[id]?.name || STATE[id].name) : kind === 'sea' ? (SEAI[id]?.name || SEA[id].name) : (CTRY[id]?.name || COUNTRY[id]?.name || id);
const PRAISE = ['Yes!', 'Right!', 'You found it!', 'Well done!', 'That\'s it!'];
// kind: 'current' (the current level), 'easier' (an earlier set), 'stretch' (a place from the next set), 'again' (spaced review), 'check' (quick check)
function genPlace(k, L, kind, wid, avoid = new Set(), gate) {
  const t = (wid && findItem(k, wid)) || pickTarget(k, L, kind, avoid, gate);
  const p = { wid: t.wid, item: t, name: t.name, fact: t.fact, place: t.kind, id: t.id, home: !!t.home };
  const mapKind = t.kind === 'state' ? 'us' : 'world';
  const view = t.kind === 'state' ? null : t.kind === 'country' || t.kind === 'flag' ? viewFor(t.id) : t.kind === 'sea' ? seaView(t.id) : WORLD.views.world;
  p.map = { kind: mapKind, view, show: t.kind === 'continent' ? 'continents' : t.kind === 'ocean' ? 'oceans' : t.kind === 'sea' ? 'seas' : 'places' };
  const ask = t.ask || pick([`Where is ${t.name}?`, `Can you find ${t.name}?`, `Show me ${t.name}!`]);
  // Say it: a known place is lit up on the map and named out loud.
  if (state.sayIt && t.kind !== 'flag' && !t.home && kind !== 'stretch' && kind !== 'check' && isKnown(t.wid) && rng() < 0.3) {
    return Object.assign(p, { mode: 'say', prompt: 'What is this place called? Say it out loud!', choices: [] });
  }
  if (t.kind === 'continent') p.choices = CONTINENTS.map(([id, name]) => ({ key: id, name, ok: id === t.id }));
  else if (t.kind === 'ocean') p.choices = OCEANS.map(([id, name]) => ({ key: id, name, ok: id === t.id }));
  else if (t.kind === 'flag' && !(isKnown('country:' + t.id) && isSeen(t.wid) && kind !== 'check' && rng() < 0.45)) {
    // which flag? four flags to tap, with the country lit on the map
    p.layout = 'flags';
    p.choices = shuffle([t.id, ...others(t, WORLD.views.world)]).map(id => ({ key: id, name: nameOf('country', id), ok: id === t.id, flag: true }));
    return Object.assign(p, { mode: 'listen', prompt: `Which flag belongs to ${t.name}?` });
  } else {
    p.choices = shuffle([t.id, ...others(t, view)]).map(id => ({ key: id, name: nameOf(t.kind === 'flag' ? 'country' : t.kind, id), ok: id === t.id }));
    if (t.kind === 'flag') { p.layout = 'flagmap'; return Object.assign(p, { mode: 'listen', prompt: 'Whose flag is this? Tap the country!' }); }
  }
  return Object.assign(p, { mode: 'listen', prompt: ask });
}
function makeProblem(k, level = state.levels[k], seed = newSeed(), kind = 'current', wid, avoid, gate) {
  level = Math.max(1, Math.min(level, maxLevel(k)));
  rng = seeded(seed);
  try {
    const p = genPlace(k, level, kind, wid, avoid, gate);
    return Object.assign(p, { topic: k, level, seed, kind, tries: 0, wrong: [], done: false, revealed: false });
  } finally { rng = Math.random; }
}

/* ---------- drawing the maps ---------- */
const starPath = (cx, cy, R) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * 0.42 : R;
    d += `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }
  return d + 'Z';
};
/* opts: { kind: 'world'|'us', view, show: 'places'|'continents'|'oceans'|'known'|'print',
           choices: [{key}], wrong: [i], okIdx, lit: key (lit up in yellow), labels: bool } */
function mapSvg(o) {
  const us = o.kind === 'us';
  const view = us ? [0, 0, USMAP.w, USMAP.h] : (o.view || WORLD.views.world);
  const u = view[2] / 1000; // one "pixel" of the full world map, so strokes and marks scale with the zoom
  const idx = new Map((o.choices || []).map((c, i) => [c.key, i]));
  const cls = key => {
    if (o.lit === key) return 'lit';
    if (!idx.has(key)) return '';
    const i = idx.get(key);
    return o.wrong?.includes(i) ? 'no' : o.okIdx === i ? 'ok' : o.okIdx != null ? '' : `opt o${i % 4}`;
  };
  const pickAttr = key => idx.has(key) && !o.wrong?.includes(idx.get(key)) && o.okIdx == null ? ` data-act="pick" data-i="${idx.get(key)}"` : '';
  let body = '', rings = '', labels = '';
  if (us) {
    for (const s of Object.values(STATE)) {
      const c = o.show === 'known' ? (isKnown('state:' + s.code) ? 'known' : '') : cls(s.code);
      body += `<path d="${s.d}" class="land ${c}"${pickAttr(s.code)}/>`;
      // small states get a ring that can be tapped too
      if ((idx.has(s.code) || o.lit === s.code) && s.size < 900) rings += `<circle cx="${s.cx}" cy="${s.cy}" r="16" class="ring ${c}"${pickAttr(s.code)}/>`;
    }
  } else {
    body += `<path d="${WORLD.sphere}" class="sea"/>`;
    if (o.show === 'oceans') {
      // rough ocean areas underneath, then the real outlines of every ocean part and sea, each tapping as its ocean
      for (const [id] of OCEANS) body += `<path d="${WORLD.oceans[id].d}" class="ocean oc-${id} ${cls(id)}"${pickAttr(id)}/>`;
      for (const [oc, , d] of WORLD.water) if (oc) body += `<path d="${d}" class="ocean oc-${oc} ${cls(oc)}"${pickAttr(oc)}/>`;
    }
    if (o.show === 'seas') {
      // a part of a bigger sea (the Aegean in the Mediterranean) goes with the bigger sea, unless it's a choice itself
      for (const [, part, d] of WORLD.water) {
        const key = idx.has(part) || o.lit === part ? part : SEA_PARENT[part];
        if (key && (idx.has(key) || o.lit === key)) body += `<path d="${d}" class="water ${cls(key) || 'plain'}"${pickAttr(key)}/>`;
      }
    }
    const zoomed = view[2] < 999;
    for (const s of WORLD.shapes) {
      const [code, cont, d, cx, cy] = s;
      if (zoomed && !inView([view[0] - view[2] * 0.5, view[1] - view[3] * 0.5, view[2] * 2, view[3] * 2], cx, cy) && COUNTRY[code].size < 3000) continue;
      let c = '', attr = '';
      if (o.show === 'continents') { c = cont === 'OC' ? '' : `ct ct-${cont} ${cls(cont)}`; attr = pickAttr(cont); }
      else if (o.show === 'oceans' || o.show === 'seas') c = 'dim';
      else if (o.show === 'known') c = isKnown('country:' + code) ? 'known' : `ct-soft ct-${cont}`;
      else if (o.show === 'print') c = '';
      else { c = cls(code); attr = pickAttr(code); }
      body += `<path d="${d}" class="land ${c}"${attr}/>`;
    }
    if (o.show === 'places' || o.show === 'seas') {
      for (const key of [...idx.keys(), o.lit].filter(Boolean)) {
        const c = o.show === 'seas' ? SEA[key] : COUNTRY[key];
        if (c && Math.sqrt(c.size) < view[2] * 0.02) rings += `<circle cx="${c.cx}" cy="${c.cy}" r="${(view[2] * 0.03).toFixed(1)}" class="ring ${cls(key)}"${pickAttr(key)}/>`;
      }
    }
  }
  if (o.labels) {
    const fs = us ? 30 : 26 * u;
    const text = (x, y, t) => `<text x="${x}" y="${y}" class="maplabel" style="font-size:${fs.toFixed(1)}px">${esc(t)}</text>`;
    for (const key of o.labels) {
      if (us && STATE[key]) labels += text(STATE[key].cx, STATE[key].cy - 18, STATE[key].name);
      else if (!us && COUNTRY[key]) labels += text(COUNTRY[key].cx, COUNTRY[key].cy - view[2] * 0.04, CTRY[key] ? cap(CTRY[key].name) : COUNTRY[key].name);
      else if (!us && SEA[key] && o.show === 'seas') labels += text(SEA[key].cx, SEA[key].cy, cap(SEAI[key]?.name || SEA[key].name));
      else if (CONT_AT[key]) labels += text(CONT_AT[key].x, CONT_AT[key].y, CONT[key].name);
      else if (WORLD.oceans[key]) labels += text(WORLD.oceans[key].at[0], WORLD.oceans[key].at[1], cap(OCEAN[key].name.replace(/^the /, '')));
    }
  }
  const home = us ? MAPS.home.us : MAPS.home.world, starR = us ? 11 : Math.max(2.2, 7 * u);
  const star = `<path d="${starPath(home[0], home[1], starR)}" class="home-star"><title>Home: ${esc(HOME.town)}</title></path>`;
  return `<svg class="map ${us ? 'us' : 'world'} show-${o.show}" viewBox="${view.join(' ')}" role="img" aria-label="${us ? 'Map of the United States' : 'Map of the world'}" style="--u:${u.toFixed(3)}">${body}${rings}${star}${labels}</svg>`;
}
// The map for a problem, in its current state. Teaching and "say it" maps light up the place; question maps offer the choices.
function problemMap(p) {
  const plain = p.mode === 'say' || p.mode === 'intro' || p.layout === 'flags';
  const o = { kind: p.map.kind, view: p.map.view, show: p.map.show, choices: [], wrong: [] };
  if (plain) o.lit = p.id;
  else { o.choices = p.choices; o.wrong = p.wrong; if (p.done) o.okIdx = p.choices.findIndex(c => c.ok); }
  if (p.done || p.mode === 'intro') o.labels = [p.id, ...(p.revealed && p.lastWrong && !p.lastWrong.flag ? [p.lastWrong.key] : [])];
  return mapSvg(o);
}

/* ---------- session ---------- */
let screen = 'home', sess = null, lastChanges = [], confirmWipe = false, wiped = false, confirmTopic = null;
/* Each round mixes four kinds of problems, like the Chalkboard:
   - spaced review of missed places, due today (up to 30% of the round)
   - the current set of places (most problems)
   - an earlier set now and then (about 1 in 7), to keep old places fresh
   - a brand-new place from the next set (about 1 in 9) once the current set is going well */
const REVIEW_DAYS = [1, 3, 7, 14, 30];
const DAY = 864e5;
const startOfDay = () => new Date().setHours(0, 0, 0, 0);
const UNLOCK_ORDER = ['home', 'continents', 'oceans', 'seas', 'countries', 'states', 'flags'];
function readyToStretch(k) {
  const r = (state.rec[k] || []).slice(-6);
  return r.length >= 4 && r.filter(Boolean).length / r.length >= 0.75;
}
function dueCards() {
  const now = Date.now();
  return state.cards.filter(c => c.due <= now && TOPIC[c.topic] && findItem(c.topic, c.wid)).sort((a, b) => a.due - b.due);
}
function onTopics() { return ORDER.filter(k => state.on[k]); }
const MAX_NEW = 4;
function buildSession() {
  let on = onTopics();
  if (!on.length) on = ['continents'];
  const n = state.perSession, plan = [];
  for (const c of dueCards().slice(0, Math.ceil(n * 0.3))) plan.push({ k: c.topic, level: c.level, seed: c.box === 0 ? c.seed : newSeed(), kind: 'again', wid: c.wid, card: c.id });
  let rotation = shuffle(on.filter(k => !state.mastered[k] || Math.random() < 0.5));
  if (!rotation.length) rotation = shuffle(on);
  for (let i = 0; plan.length < n; i++) {
    const k = rotation[i % rotation.length], L = Math.min(state.levels[k], maxLevel(k)), max = maxLevel(k), roll = Math.random();
    if (roll < 0.15 && L > 1) plan.push({ k, level: L, kind: 'easier' });
    else if (roll > 0.89 && L < max && readyToStretch(k)) plan.push({ k, level: L, kind: 'stretch' });
    else plan.push({ k, level: L, kind: 'current' });
  }
  // Anything met for the first time is taught before it is asked: an intro card now, the question a little later.
  // About MAX_NEW new places per round, and nothing asked more than twice.
  const used = new Set(), counts = new Map(), introduced = new Map(), groups = [];
  const isNew = p => !isSeen(p.wid) && !introduced.has(p.wid);
  const fits = (p, strict) => (counts.get(p.wid) || 0) < 2 && !(isNew(p) && introduced.size >= (strict ? MAX_NEW : MAX_NEW + 2));
  for (const it of shuffle(plan)) {
    let gate = introduced.size >= MAX_NEW ? new Set(introduced.keys()) : null;
    let p = makeProblem(it.k, it.level, it.seed ?? newSeed(), it.kind, it.wid, used, gate);
    for (let tries = 0; !fits(p, tries < 6) && tries < 10; tries++) {
      if (tries >= 6) gate = null;
      // a topic with nothing met yet can't give a familiar place, so borrow a topic that has one
      const k = gate && tries >= 2 ? [...introduced.values()][tries % introduced.size] : it.k;
      p = makeProblem(k, k === it.k ? it.level : Math.min(state.levels[k], maxLevel(k)), newSeed(), k === it.k ? it.kind : 'current', k === it.k ? it.wid : undefined, used, gate);
    }
    if (p.wid === it.wid) p.card = it.card;
    used.add(p.wid);
    counts.set(p.wid, (counts.get(p.wid) || 0) + 1);
    if (isNew(p)) introduced.set(p.wid, p.topic);
    groups.push(p);
  }
  groups.forEach(q => { if (introduced.has(q.wid)) q.introKey = q.wid; });
  return { probs: schedule(groups), i: 0, results: [], cleared: 0, learned: [] };
}
const makeIntro = p => Object.assign({}, p, { mode: 'intro', kind: 'intro', choices: [], done: true, card: undefined });
// Order a round: introduce new places early, ask each one only two or more slots after its intro, and never ask the same thing twice in a row.
function schedule(probs) {
  const out = [], pending = shuffle(probs), introAt = new Map();
  const last = () => out[out.length - 1];
  const ready = q => !q.introKey || (introAt.has(q.introKey) && out.length - introAt.get(q.introKey) >= 2);
  const nextTo = q => last() && last().wid === q.wid && last().mode !== 'intro';
  while (pending.length) {
    const choices = pending.filter(q => ready(q) && !nextTo(q));
    const fresh = pending.find(q => q.introKey && !introAt.has(q.introKey));
    if (fresh && choices.length < 2) { out.push(makeIntro(fresh)); introAt.set(fresh.introKey, out.length - 1); continue; }
    const q = choices[0] || pending.find(ready) || pending[0];
    out.push(pending.splice(pending.indexOf(q), 1)[0]);
  }
  return out;
}
function startSession() { sess = buildSession(); screen = 'play'; render(); autoSay(); }

/* Quick check: a placement round. Four places from each main topic, earliest unknown first, one try each.
   Right on the first try marks the place known; a miss just notes it was checked, with no review card. */
const CHECK_TOPICS = ['continents', 'oceans', 'seas', 'countries', 'states'];
function buildCheck() {
  const probs = [];
  for (const k of CHECK_TOPICS) {
    const cands = TOPIC[k].sets.flatMap((set, i) => set.map(w => ({ w, L: i + 1 }))).filter(x => !isKnown(x.w.wid));
    const fresh = cands.filter(x => !rec(x.w.wid)?.c);
    const pool = (fresh.length >= 4 ? fresh : cands).slice(0, 12);
    for (const x of shuffle(pool).slice(0, 4)) probs.push(makeProblem(k, x.L, newSeed(), 'check', x.w.wid));
  }
  return { probs: shuffle(probs), i: 0, results: [], cleared: 0, learned: [], check: true };
}
function startCheck() { sess = buildCheck(); if (!sess.probs.length) return; screen = 'play'; render(); autoSay(); }

const introLine = p => p.home ? p.fact : p.place === 'flag' ? p.fact : `This is ${p.name}. ${p.fact}`;
// Reading aloud on its own is a setting (off unless turned on); the speaker button always reads what's on the board.
function autoSay() {
  const p = sess.probs[sess.i];
  if (state.autoSpeak) say(p.mode === 'intro' ? introLine(p) : p.prompt);
}
// After a country or its flag is found, the next of its fun facts, taking turns so each visit brings a new one.
// States and seas too. A country and its flag share their facts.
function nextFact(p) {
  if (!state.funFacts || p.kind === 'check') return '';
  const [list, key] = p.place === 'country' || p.place === 'flag' ? [FUN_FACTS[p.id], p.id]
    : p.place === 'state' ? [STATE_FACTS[p.id], 'state:' + p.id]
    : p.place === 'sea' ? [SEA_FACTS[p.id], 'sea:' + p.id] : [];
  if (!list?.length) return '';
  const i = (state.factAt[key] || 0) % list.length;
  state.factAt[key] = i + 1;
  return list[i];
}
// What the board says after an answer: kept so the speaker button can read it, and spoken now only if reading aloud is on.
function tell(p, text) { p.line = text; if (state.autoSpeak) say(text); }
const didYou = p => p.funFact ? ` Did you know? ${p.funFact}` : '';
function gotIt(p) {
  p.done = true;
  p.praise = p.tries === 0 ? pick(PRAISE) : 'Yes, there it is!';
  p.funFact = nextFact(p);
  tell(p, (p.place === 'flag' ? `${p.praise} That's the flag of ${p.name}.` : p.home ? `${p.praise} ${p.item.answer}` : `${p.praise} ${cap(p.name)}.`) + didYou(p));
  record(p, p.tries === 0);
}
function answer(idx) {
  const p = sess.probs[sess.i];
  if (p.done || p.wrong.includes(idx) || !p.choices[idx]) return;
  const c = p.choices[idx];
  if (c.ok) { gotIt(p); render(); return; }
  p.wrong.push(idx);
  p.lastWrong = c;
  p.tries++;
  const over = p.tries >= (p.kind === 'check' ? 1 : 2);
  // naming the place that was tapped teaches that place too
  const named = c.flag ? `That's the flag of ${c.name}.` : `That's ${c.name}.`;
  if (over) {
    p.done = true; p.revealed = true; record(p, false);
    p.funFact = nextFact(p);
    tell(p, `${named} ${p.home ? p.item.answer : p.place === 'flag' && p.layout === 'flagmap' ? `This is the flag of ${p.name}.` : `Here is ${p.name}.`}` + didYou(p));
  } else { save(); if (state.autoSpeak) say(`${named} Try again!`); }
  render(!p.done);
}
// Say it: the child names the place, hears it, then says whether it matched.
function sayCheck(ok) {
  const p = sess.probs[sess.i];
  if (p.done) return;
  p.done = true;
  p.funFact = nextFact(p);
  if (ok) { p.praise = pick(PRAISE); tell(p, p.praise + didYou(p)); }
  else { p.revealed = true; tell(p, cap(p.name) + didYou(p)); }
  record(p, ok);
  render();
}
function record(p, first) {
  sess.results.push(first);
  p.result = first;
  const w = state.words[p.wid] = state.words[p.wid] || { r: 0, m: 0 };
  if (p.kind === 'check') {
    w.c = 1;
    if (first) { w.k = 1; sess.learned.push(p.item); }
    save();
    return;
  }
  state.total++;
  state.done[p.topic] = (state.done[p.topic] || 0) + 1;
  const before = isKnown(p.wid);
  if (first) w.r = Math.min(20, (w.r || 0) + 1); else { w.m = Math.min(20, (w.m || 0) + 1); w.k = 0; }
  w.t = Date.now();
  if (!before && isKnown(p.wid) && !sess.learned.some(x => x.wid === p.wid)) sess.learned.push(p.item);
  if (p.kind === 'current') state.rec[p.topic] = [...(state.rec[p.topic] || []), first].slice(-10);
  if (p.kind === 'stretch') state.stretch[p.topic] = [...(state.stretch[p.topic] || []), first].slice(-5);
  if (p.kind === 'again') reviewCard(p.card, first);
  else if (!first) addCard(p);
  save();
}
// A missed place comes back tomorrow, then after 3, 7, 14 and 30 days while it keeps being found.
function addCard(p) {
  const due = startOfDay() + DAY * REVIEW_DAYS[0];
  const same = state.cards.find(c => c.topic === p.topic && c.wid === p.wid);
  if (same) { Object.assign(same, { box: 0, seed: p.seed, due, misses: same.misses + 1 }); return; }
  state.cards.push({ id: newSeed().toString(36), topic: p.topic, level: p.level, wid: p.wid, seed: p.seed, box: 0, due, misses: 1, added: Date.now() });
  if (state.cards.length > 80) state.cards.sort((a, b) => a.added - b.added).shift();
}
function reviewCard(id, first) {
  const c = state.cards.find(x => x.id === id);
  if (!c) return;
  if (!first) { Object.assign(c, { box: 0, due: startOfDay() + DAY, misses: c.misses + 1 }); return; }
  c.box++;
  if (c.box >= REVIEW_DAYS.length) { state.cards = state.cards.filter(x => x !== c); state.cleared = (state.cleared || 0) + 1; sess.cleared++; return; }
  c.due = startOfDay() + DAY * REVIEW_DAYS[c.box];
}
function next() {
  const cur = sess.probs[sess.i];
  if (cur.mode === 'intro') { state.words[cur.wid] = state.words[cur.wid] || { r: 0, m: 0 }; save(); }
  if (sess.i < sess.probs.length - 1) { sess.i++; render(); autoSay(); return; }
  const used = [...new Set(sess.probs.map(p => p.topic))];
  if (sess.check) { levelFromKnown(); lastChanges = []; save(); screen = 'done'; render(); if (state.autoSpeak) say(greet('Well done')); return; }
  lastChanges = adjustLevels(used);
  state.sessions.unshift({ d: new Date().toISOString(), score: sess.results.filter(Boolean).length, n: sess.results.length, skills: used, learned: sess.learned.length });
  state.sessions = state.sessions.slice(0, 40);
  save();
  screen = 'done'; render();
  if (state.autoSpeak) say(`${document.querySelector('h1')?.textContent || ''} ${document.querySelector('.cheer')?.textContent || ''}`);
}
// Up: 5 in a row, 7 of the last 8, or 3 stretch places in a row, all right on the first try; or every place in the set known.
// Down: 4 misses in the last 6. Finishing the top level masters the topic and turns on the next one.
function adjustLevels(used) {
  const changes = [];
  for (const k of used) {
    const r = state.rec[k] || [], st = state.stretch[k] || [], max = maxLevel(k), L = state.levels[k];
    const last8 = r.slice(-8), last6 = r.slice(-6), last5 = r.slice(-5);
    const setKnown = r.length >= 3 && (TOPIC[k].sets[L - 1] || []).every(w => isKnown(w.wid));
    const up = setKnown || (last8.length >= 8 && last8.filter(Boolean).length >= 7) || (last5.length === 5 && last5.every(Boolean)) || (st.length >= 3 && st.slice(-3).every(Boolean));
    if (up && L < max) { state.levels[k]++; state.rec[k] = []; state.stretch[k] = []; changes.push([k, 'up']); }
    else if (up && !state.mastered[k]) {
      state.mastered[k] = Date.now(); changes.push([k, 'mastered']);
      const nk = UNLOCK_ORDER.find(x => !state.on[x] && !state.mastered[x]);
      if (nk) { state.on[nk] = true; changes.push([nk, 'unlocked']); }
    }
    else if (last6.length >= 6 && last6.filter(Boolean).length <= 2 && L > 1) { state.levels[k]--; state.rec[k] = []; state.stretch[k] = []; changes.push([k, 'down']); }
  }
  for (const [k, dir] of changes) state.log.unshift({ d: new Date().toISOString(), k, dir, to: state.levels[k] });
  state.log = state.log.slice(0, 30);
  return changes;
}
// Each topic's level moves past every set already known completely, and topics with known places turn on.
function levelFromKnown() {
  for (const k of ORDER) {
    const sets = TOPIC[k].sets;
    let full = 0;
    while (full < sets.length && sets[full].every(w => isKnown(w.wid))) full++;
    if (full) state.levels[k] = Math.max(state.levels[k], Math.min(full + 1, sets.length));
    if (allItems(k).some(w => isKnown(w.wid))) state.on[k] = true;
  }
}
function markKnown(wid, on) {
  const w = state.words[wid] = state.words[wid] || { r: 0, m: 0 };
  if (on) w.k = 1; else { w.k = 0; w.r = Math.min(w.r || 0, (w.m || 0) + 1); }
}

/* ---------- rendering ---------- */
const KIND_LABEL = { intro: ' · <b class="tag stretch">New place</b>', check: ' · <b class="tag easier">Quick check</b>', again: ' · <b class="tag again">Again</b>', easier: ' · <b class="tag easier">Review</b>', stretch: ' · <b class="tag stretch">★ New</b>' };
const app = document.getElementById('app');
const speakerIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19.5 5.5a9 9 0 0 1 0 13"/></svg>';
function tallySvg(filled) {
  const xs = [8, 16, 24, 32];
  const lines = xs.map((x, i) => `<line x1="${x}" y1="5" x2="${x}" y2="35" class="${i < filled ? '' : 'empty'}"/>`).join('');
  return `<svg viewBox="0 0 46 40" aria-hidden="true">${lines}<line x1="2" y1="31" x2="40" y2="9" class="slash ${filled >= 5 ? '' : 'empty'}"/></svg>`;
}
function starSvg(on) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="${on ? 'var(--yellow)' : 'none'}" stroke="${on ? 'var(--yellow)' : 'var(--chalk-dim)'}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
}
function fmtDate(iso) { try { return new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }); } catch (e) { return ''; } }
function nameForm(lbl, button) {
  return `<form class="name-form" id="name-form">
    <label for="child-name">${lbl}</label>
    <div class="row-btns"><input id="child-name" class="pick name-input" maxlength="24" placeholder="First name" autocomplete="off" value="${esc(childName())}"><button class="ghost" type="submit">${button}</button></div>
  </form>`;
}
function levelPct(k) {
  if (state.mastered[k]) return 1;
  const r = state.rec[k] || [];
  let streak = 0;
  for (let i = r.length - 1; i >= 0 && r[i]; i--) streak++;
  const set = TOPIC[k].sets[state.levels[k] - 1] || [];
  const knownShare = set.length ? set.filter(w => isKnown(w.wid)).length / set.length : 0;
  return Math.min(0.95, Math.max(streak / 5, r.slice(-8).filter(Boolean).length / 7, knownShare));
}
function levelBar(k) {
  const max = maxLevel(k), L = Math.min(state.levels[k], max), pct = levelPct(k);
  const segs = Array.from({ length: max }, (_, i) => {
    const fill = state.mastered[k] || i < L - 1 ? 1 : i === L - 1 ? pct : 0;
    return `<span class="seg-bar"><i style="width:${Math.round(fill * 100)}%"></i></span>`;
  }).join('');
  return `<span class="lvlbar ${state.mastered[k] ? 'done' : ''}" role="img" aria-label="Level ${L} of ${max}${state.mastered[k] ? ', mastered' : ''}">${segs}</span>`;
}

function renderHome() {
  const known = knownCount(), shown = Math.min(known, 100);
  let tally = '';
  for (let g = 0; g < Math.max(1, Math.ceil(shown / 5)); g++) tally += tallySvg(Math.max(0, Math.min(5, shown - g * 5)));
  const today = new Date().toDateString();
  const todayCount = state.sessions.filter(s => new Date(s.d).toDateString() === today).reduce((t, s) => t + s.n, 0);
  const statesKnown = allItems('states').filter(w => isKnown(w.wid)).length;
  return `
  <header class="top"><h1>${esc(greet('Hello'))}</h1><button class="link" data-act="parent">For grown-ups</button></header>
  ${childName() ? '' : nameForm("Who's exploring?", 'Start')}
  <section>
    <div class="goal-head"><h2>Places I know</h2><span class="count">${known}</span></div>
    <div class="tally" role="img" aria-label="${known} places known">${tally}</div>
    <div class="mymap">${mapSvg({ kind: 'world', show: 'known' })}</div>
    ${statesKnown ? `<div class="mymap us-mini">${mapSvg({ kind: 'us', show: 'known' })}</div>` : ''}
    <p class="note">Countries ${esc(childName() || 'your child')} knows are filled in. The star is home, ${esc(HOME.town)}.</p>
  </section>
  <section>
    <h2>What shall we explore?</h2>
    <div class="chips">${ORDER.map(k => `<button class="chip" data-act="chip" data-k="${k}" aria-pressed="${!!state.on[k]}"><strong>${esc(TOPIC[k].name)}</strong><small>${esc(TOPIC[k].note)} · level ${Math.min(state.levels[k], maxLevel(k))}</small>${levelBar(k)}</button>`).join('')}</div>
  </section>
  ${!state.total && !known ? `<p class="note">First time? A grown-up can start with a <button class="link inline-link" data-act="check">quick check</button> to find the places ${esc(childName() || 'your child')} already knows.</p>` : ''}
  <button class="start" data-act="start">Let's explore! <small>${state.perSession} questions</small></button>
  <p class="meta">${todayCount ? `${todayCount} questions so far today. ` : ''}${state.total} questions answered since the start.</p>`;
}

function renderPlay() {
  const p = sess.probs[sess.i];
  const ticks = sess.probs.map((q, j) => `<span class="${q.mode === 'intro' ? (j <= sess.i ? 'intro' : 'intro-later') : q.result === true ? 'done' : q.result === false ? 'miss' : j === sess.i ? 'now' : ''}"></span>`).join('');
  const title = `<span class="word">${p.place === 'flag' ? `<span class="flag-sm">${flagOf(p.id)}</span> ` : ''}${esc(cap(p.name))}</span>`;
  const fact = p.funFact ? `<button class="didyou" data-act="speak" data-t="Did you know? ${esc(p.funFact)}"><b>Did you know?</b> ${esc(p.funFact)}</button>` : `<span class="how">${esc(p.fact)}</span>`;
  let fb = '';
  if (p.mode === 'intro') fb = '';
  else if (p.done && !p.revealed) fb = `<span class="big good">${esc(p.praise)}</span>${title}${p.kind === 'check' ? '' : fact}`;
  else if (p.revealed) fb = `<span class="big try">${p.mode === 'say' ? 'Not yet. Listen:' : 'Here it is:'}</span>${title}${fact}`;
  else if (p.tries && p.lastWrong) fb = `<span class="big try">That's ${p.lastWrong.flag ? 'the flag of ' : ''}${esc(p.lastWrong.name)}.</span><span class="how">Try again!</span>`;
  const last = sess.i === sess.probs.length - 1;
  let body, controls = '';
  if (p.mode === 'intro') {
    body = `<div class="prompt"><span class="tag stretch">${p.home ? 'Our home' : 'New place!'}</span></div>
      ${p.place === 'flag' ? `<button class="bigflag" data-act="intro-again" aria-label="Hear it again">${flagOf(p.id)}</button>` : ''}
      <button class="map-btn" data-act="intro-again" aria-label="Hear it again">${problemMap(p)}</button>
      <div class="feedback">${title}${fact}</div>`;
    controls = '<p class="note center">Can you point to it? Tap the map to hear it read aloud.</p>';
  } else if (p.mode === 'say') {
    body = `<div class="map-wrap">${problemMap(p)}</div><div class="prompt">${esc(p.prompt)}</div>`;
    controls = p.done ? '' : !p.heard
      ? `<div class="row-btns center"><button class="start" data-act="hear">${speakerIcon} Listen</button></div><p class="note center">Say it out loud first, then listen.</p>`
      : `<div class="row-btns center"><button class="start" data-act="said-yes">✓ I said it!</button><button class="ghost" data-act="said-no">Not yet</button></div>
         <div class="feedback">${title}</div>`;
  } else if (p.layout === 'flags') {
    const okIdx = p.choices.findIndex(c => c.ok);
    body = `<div class="prompt">${esc(p.prompt)}</div><div class="map-wrap small">${problemMap(p)}</div>`;
    controls = `<div class="choices flags">${p.choices.map((c, j) => {
      const cl = p.wrong.includes(j) ? 'no' : (p.done && j === okIdx ? 'ok' : '');
      return `<button class="choice flagbtn ${cl}" data-act="pick" data-i="${j}" ${p.done || p.wrong.includes(j) ? 'disabled' : ''} aria-label="Flag ${j + 1}"><span class="key">${j + 1}</span><span class="flag">${flagOf(c.key)}</span></button>`;
    }).join('')}</div>`;
  } else {
    body = `<div class="prompt">${p.layout === 'flagmap' ? `<span class="bigflag">${flagOf(p.id)}</span>` : ''}${esc(p.prompt)}</div><div class="map-wrap ${p.done ? '' : 'live'}">${problemMap(p)}</div>`;
  }
  return `
  <div class="play-top">
    <div class="ticks" aria-label="Question ${sess.i + 1} of ${sess.probs.length}">${ticks}</div>
    <span class="skill-label">${esc(TOPIC[p.topic].name)} · level ${p.level}${KIND_LABEL[p.kind] || ''}</span>
    ${canSpeak ? `<span class="row-btns"><button class="say" data-act="say" aria-label="Say it again">${speakerIcon}</button><button class="say slow" data-act="slow" aria-label="Say it slowly">🐢</button></span>` : ''}
  </div>
  <div class="problem" id="problem">${body}</div>
  ${controls}
  ${p.mode === 'intro' || (p.mode === 'say' && !p.done) ? '' : `<div class="feedback">${fb}</div>`}
  ${p.done ? `<div class="next-row"><button class="start" data-act="next" id="next">${last ? 'My stars' : 'Next'}</button></div>` : ''}
  <button class="link" data-act="home" style="align-self:flex-start">Stop and go home</button>`;
}

function handsOn() {
  const counts = {};
  sess.probs.forEach(p => { counts[p.topic] = (counts[p.topic] || 0) + 1; });
  const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).filter(k => HANDS[k]).slice(0, 2);
  if (!top.length) return '';
  return `<section class="hands"><h2>Off the screen</h2><p class="note">Something to try today:</p><ul>${top.map(k => `<li><strong>${esc(TOPIC[k].name)}:</strong> ${esc(HANDS[k].replace('{name}', N()))}</li>`).join('')}</ul></section>`;
}
function roundNews() {
  const mastered = lastChanges.filter(c => c[1] === 'mastered'), unlocked = lastChanges.filter(c => c[1] === 'unlocked');
  const again = sess.probs.filter(p => p.kind === 'again'), againRight = again.filter(p => p.result).length;
  const lines = [];
  if (unlocked.length) lines.push(...unlocked.map(([k]) => `<li class="big-news">New! <strong>${esc(TOPIC[k].name)}</strong> is turned on.</li>`));
  if (mastered.length) lines.push(...mastered.map(([k]) => `<li>${esc(TOPIC[k].name)}: every set learned. They will still come back now and then.</li>`));
  if (again.length) lines.push(`<li>Places from earlier days: ${againRight} of ${again.length} found${sess.cleared ? `, and ${sess.cleared} ${sess.cleared === 1 ? 'is' : 'are'} learned for good` : ''}.</li>`);
  const learned = sess.learned.length ? `<section><h2>New places I know</h2><div class="wordchips">${sess.learned.map(w => `<button class="wchip" data-act="speak" data-t="${esc(cap(w.name))}">${esc(label(w))}</button>`).join('')}</div></section>` : '';
  return learned + (lines.length ? `<section><h2>This time</h2><ul class="ups">${lines.join('')}</ul></section>` : '');
}
let lastCheer = '';
function pickCheer(tier) {
  const pool = CHEERS[tier];
  let c;
  do { c = pool[Math.floor(Math.random() * pool.length)]; } while (pool.length > 1 && c[0] + c[1] === lastCheer);
  lastCheer = c[0] + c[1];
  return { tier, head: c[0], line: c[1] };
}
function renderCheckDone() {
  const known = sess.learned, missed = sess.probs.filter(p => !p.result).map(p => p.item);
  const chips = (list, on) => `<div class="wordchips">${list.map(w => `<button class="wchip" data-act="speak" data-t="${esc(cap(w.name))}" aria-pressed="${on}">${esc(label(w))}</button>`).join('')}</div>`;
  return `
  <div class="done-text">
    <h1>${esc(greet('Well done'))}</h1>
    <p class="cheer">Quick check done: ${known.length} of ${sess.results.length} places known.</p>
    <div class="stars">${sess.results.map(starSvg).join('')}</div>
  </div>
  ${known.length ? `<section><h2>Already knows</h2>${chips(known, true)}<p class="note">These are marked known. They skip ahead and come back as “say it” practice.</p></section>` : ''}
  ${missed.length ? `<section><h2>Not yet</h2>${chips(missed, false)}<p class="note">No harm done: these will be taught in normal rounds.</p></section>` : ''}
  <p class="note">Each check asks different places, so another one or two builds a fuller picture. Levels update on their own.</p>
  <div class="row-btns"><button class="start" data-act="check">Check more places</button><button class="ghost" data-act="home">Home</button></div>`;
}
function renderDone() {
  if (sess.check) return renderCheckDone();
  const score = sess.results.filter(Boolean).length, n = sess.results.length;
  const pct = n ? score / n : 0, tier = pct >= 0.9 ? 0 : pct >= 0.7 ? 1 : pct >= 0.4 ? 2 : 3;
  if (!sess.cheer || sess.cheer.tier !== tier) sess.cheer = pickCheer(tier);
  const ups = lastChanges.filter(c => c[1] === 'up');
  return `
  <div class="done-text">
    <h1>${esc(greet(sess.cheer.head))}</h1>
    <p class="cheer">${esc(sess.cheer.line)}</p>
    <p class="meta">${score} of ${n} right on the first try.</p>
    <div class="stars">${sess.results.map(starSvg).join('')}</div>
  </div>
  ${roundNews()}
  ${ups.length ? `<section><h2>Next level</h2><ul class="ups">${ups.map(([k]) => `<li>${esc(TOPIC[k].name)}: now level ${state.levels[k]}, ${esc(levelsOf(k)[state.levels[k] - 1])}</li>`).join('')}</ul></section>` : ''}
  ${handsOn()}
  <div class="row-btns"><button class="start" data-act="start">Again!</button><button class="ghost" data-act="home">Home</button></div>`;
}

function renderParent() {
  const lv = ORDER.map(k => {
    const max = maxLevel(k), L = Math.min(state.levels[k], max), r = state.rec[k] || [];
    return `<div class="lvl"><div><strong>${esc(TOPIC[k].name)}</strong><small>${state.mastered[k] ? '<b class="tag stretch">Mastered</b> ' : ''}${esc(levelsOf(k)[L - 1] || '')}${r.length ? ` · ${r.filter(Boolean).length} of last ${r.length} right first try` : ''}</small>
      ${confirmTopic === k ? `<span class="row-btns topic-reset"><button class="link danger-text" data-act="topic-reset-yes" data-k="${k}">Yes, reset ${esc(TOPIC[k].name)}</button><button class="link" data-act="topic-reset-no">Cancel</button></span>` : `<button class="link small-link" data-act="topic-reset" data-k="${k}">Reset</button>`}</div>
      <div class="stepper"><button data-act="lvl" data-k="${k}" data-d="-1" aria-label="Lower ${esc(TOPIC[k].name)} level" ${L <= 1 ? 'disabled' : ''}>−</button><span>${L}/${max}</span><button data-act="lvl" data-k="${k}" data-d="1" aria-label="Raise ${esc(TOPIC[k].name)} level" ${L >= max ? 'disabled' : ''}>+</button></div></div>`;
  }).join('');
  const voiceNote = !canSpeak ? '<p class="note danger-text">This browser cannot speak. Try Safari on an iPad or iPhone.</p>'
    : `<div class="row-btns"><label for="voice">Voice</label>
      <select id="voice" class="pick">${['', ...voices.map(v => v.name)].map(nm => `<option value="${esc(nm)}" ${nm === savedVoiceName() ? 'selected' : ''}>${nm ? esc(nm + ' (' + (voices.find(v => v.name === nm)?.lang || '') + ')') : `Automatic${chosenVoice() ? ` (${esc(chosenVoice().name)})` : ''}`}</option>`).join('')}</select>
      <button class="ghost" data-act="try-voice">Try it</button></div>
    <p class="note">For a more natural voice on an iPad or iPhone: Settings → Accessibility → Spoken Content → Voices → English, download an “Enhanced” or “Premium” voice, then pick it here. The choice is remembered on each device.</p>`;
  return `
  <header class="top"><h1>For grown-ups</h1><button class="ghost" data-act="home">${childName() ? `Back to ${esc(childName())}` : 'Back'}</button></header>
  <section>
    <h2>What ${esc(N())} already knows</h2>
    <p class="note">A quick check asks 20 places across the topics, one try each, no hints. Every place found is marked known.</p>
    <div class="row-btns"><button class="ghost" data-act="check">Start a quick check</button></div>
    <p class="note">Or open a topic and tap the places ${esc(N())} knows. Known places skip ahead and come back now and then.</p>
    ${renderKnownLists()}
  </section>
  <section>
    <h2>Levels</h2>
    <p class="note">Each level adds a set of places (about 6). A topic moves up when every place in the set is known, or after 5 in a row or 7 of the last 8 right on the first try. It moves back down after 4 misses in 6. Finishing every set turns on the next topic.</p>
    <div class="levels">${lv}</div>
  </section>
  <section>
    <h2>Settings</h2>
    ${nameForm("Child's name", 'Save')}
    <div class="row-btns"><span>Questions per round</span><div class="seg">${[5, 10, 15].map(n => `<button data-act="per" data-n="${n}" aria-pressed="${state.perSession === n}">${n}</button>`).join('')}</div></div>
    <div class="row-btns"><span>“Say it” turns</span><div class="seg"><button data-act="sayit" data-v="1" aria-pressed="${state.sayIt}">On</button><button data-act="sayit" data-v="0" aria-pressed="${!state.sayIt}">Off</button></div></div>
    <div class="row-btns"><span>Read aloud automatically</span><div class="seg"><button data-act="autospeak" data-v="1" aria-pressed="${state.autoSpeak}">On</button><button data-act="autospeak" data-v="0" aria-pressed="${!state.autoSpeak}">Off</button></div></div>
    <p class="note">Off: nothing is spoken until you tap the speaker button, which reads the question, or after an answer, what's on the board and the fun fact. On: every question, answer and fact is read aloud by itself, for a child reading alone.</p>
    <div class="row-btns"><span>Fun facts after answers</span><div class="seg"><button data-act="funfacts" data-v="1" aria-pressed="${state.funFacts}">On</button><button data-act="funfacts" data-v="0" aria-pressed="${!state.funFacts}">Off</button></div></div>
    <p class="note">After a country, flag, state or sea is found, the board adds “Did you know?” and one of three facts about it (history, stories, records and unusual things), a different one each time. Facts are in facts.js.</p>
    <p class="note">For places already known, about 1 in 3 questions lights up the place for ${esc(N())} to name out loud, then tap to hear it and say whether it matched.</p>
    <div class="row-btns"><span>Speaking speed</span><div class="seg"><button data-act="speed" data-v="normal" aria-pressed="${state.speed !== 'slow'}">Normal</button><button data-act="speed" data-v="slow" aria-pressed="${state.speed === 'slow'}">Slower</button></div><span class="note">The 🐢 button always says it very slowly.</span></div>
    ${voiceNote}
  </section>
  ${renderReview()}
  <section>
    <h2>Maps to color</h2>
    <p class="note">Print an outline map with the home star, and the names of the places ${esc(N())} knows to find and color.</p>
    <div class="row-btns"><button class="ghost" data-act="print" data-k="world">Print a world map</button><button class="ghost" data-act="print" data-k="us">Print a US map</button></div>
  </section>
  <section>
    <h2>Tricky places</h2>
    ${renderTricky()}
  </section>
  <section>
    <h2>Recent rounds</h2>
    ${state.sessions.length ? `<ul class="list">${state.sessions.slice(0, 8).map(s => `<li><span>${fmtDate(s.d)} · ${s.skills.map(k => TOPIC[k] ? TOPIC[k].name : k).join(', ')}${s.learned ? ` · ${s.learned} new` : ''}</span><span>${s.score}/${s.n}</span></li>`).join('')}</ul>` : '<p class="note">No rounds yet.</p>'}
    ${state.log.length ? `<p class="note">Level changes: ${state.log.slice(0, 5).map(l => `${TOPIC[l.k] ? TOPIC[l.k].name : l.k} ${{ up: '↑', down: '↓', mastered: '✓', unlocked: 'unlocked' }[l.dir] || ''}${l.dir === 'up' || l.dir === 'down' ? ' ' + l.to : ''} (${fmtDate(l.d)})`).join(' · ')}</p>` : ''}
  </section>
  <section>
    <h2>Start over</h2>
    <p class="note">Clears levels, known places, the review list and recent rounds. Keeps the name, settings and sync. ${syncAvailable && sync.code ? 'Synced devices will start over too.' : ''}</p>
    <div class="row-btns">
      ${confirmWipe ? `<button class="ghost danger" data-act="wipe-yes">Yes, erase all progress</button><button class="link" data-act="wipe-no">Cancel</button>` : `<button class="ghost danger" data-act="wipe">Reset all progress</button>`}
    </div>
    ${wiped ? '<p class="note">Progress cleared. Everything starts fresh.</p>' : ''}
  </section>
  ${renderSync()}
  <p class="note">Map data: Natural Earth (public domain).</p>`;
}
// One fold per topic with every place as a chip: tap to hear it and to mark it known or not.
function renderKnownLists() {
  return `<div class="known-lists">${ORDER.filter(k => k !== 'home').map(k => {
    const items = allItems(k), known = items.filter(w => isKnown(w.wid)).length;
    return `<details><summary><strong>${esc(TOPIC[k].name)}</strong> <span class="note">${known} of ${items.length} known</span></summary>
      <div class="wordchips">${items.map(w => `<button class="wchip" data-act="known" data-w="${esc(w.wid)}" aria-pressed="${isKnown(w.wid)}">${esc(label(w))}</button>`).join('')}</div>
      <div class="row-btns"><button class="link small-link" data-act="known-all" data-k="${k}">Mark all known</button><button class="link small-link" data-act="known-none" data-k="${k}">Clear</button></div>
    </details>`;
  }).join('')}</div>`;
}
const anyItem = wid => { for (const k of ORDER) { const w = findItem(k, wid); if (w) return w; } return null; };
function renderTricky() {
  const tricky = Object.entries(state.words).filter(([wid, w]) => (w.m || 0) > 0 && anyItem(wid)).sort((a, b) => (b[1].m - b[1].r) - (a[1].m - a[1].r)).slice(0, 10);
  if (!tricky.length) return '<p class="note">Places missed more than once will show up here, so you can look for them together at home.</p>';
  return `<div class="wordchips">${tricky.map(([wid, w]) => `<button class="wchip" data-act="speak" data-t="${esc(cap(anyItem(wid).name))}">${esc(label(anyItem(wid)))} <small>missed ${w.m}×</small></button>`).join('')}</div>`;
}
function renderReview() {
  const cards = state.cards.slice().sort((a, b) => a.due - b.due);
  const when = d => { const days = Math.round((d - startOfDay()) / DAY); return days <= 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`; };
  return `<section>
    <h2>Coming back for review</h2>
    <p class="note">A missed place comes back tomorrow, then after 3, 7, 14 and 30 days while it keeps being found. ${state.cleared ? `${state.cleared} learned for good so far.` : ''}</p>
    ${cards.length ? `<ul class="list">${cards.slice(0, 12).map(c => `<li><span>${esc(anyItem(c.wid) ? label(anyItem(c.wid)) : c.wid)}</span><span>${when(c.due)} · step ${c.box + 1} of ${REVIEW_DAYS.length}</span></li>`).join('')}</ul>${cards.length > 12 ? `<p class="note">and ${cards.length - 12} more</p>` : ''}` : '<p class="note">Nothing to review yet.</p>'}
  </section>`;
}
function renderSync() {
  if (!syncAvailable) return '<p class="note">Progress is saved on this device.</p>';
  if (!sync.code) return `
  <section>
    <h2>Sync between devices</h2>
    <p class="note">Progress is saved on this device. Turn on sync to share it with another iPad, phone or laptop. You get a private code to type in on the other device. (This is separate from the Chalkboard's code.)</p>
    <div class="row-btns"><button class="ghost" data-act="sync-new">Turn on sync</button></div>
    <div class="row-btns">
      <label for="join-code">Already have a code?</label>
      <input id="join-code" class="pick code-input" placeholder="ABCD-EFGH-JKMN" autocomplete="off" autocapitalize="characters" spellcheck="false">
      <button class="ghost" data-act="sync-join">Join</button>
    </div>
    ${sync.error === 'bad-code' ? '<p class="note danger-text">That code should be 12 letters and numbers, like ABCD-EFGH-JKMN.</p>' : ''}
  </section>`;
  const when = sync.lastAt ? new Date(sync.lastAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';
  const status = sync.status === 'ok' ? `Synced${when ? ' at ' + when : ''}.`
    : sync.status === 'syncing' ? 'Syncing…'
    : sync.error === 'offline' ? 'Offline. Progress is safe on this device and will sync when you are back online.'
    : `Could not sync (${esc(sync.error)}). Progress is safe on this device.`;
  return `
  <section>
    <h2>Sync between devices</h2>
    <p class="note">Type this code into the grown-ups page on another device to share progress. Keep it private.</p>
    <div class="row-btns"><strong class="sync-code" id="sync-code">${esc(sync.code)}</strong><button class="ghost" data-act="sync-copy">Copy</button></div>
    <p class="note">${status}</p>
    <div class="row-btns"><button class="ghost" data-act="sync-now">Sync now</button><button class="link" data-act="sync-off">Stop syncing on this device</button></div>
  </section>`;
}
/* a map to color: outlines, the home star, and the names of places to find */
function printMap(kind) {
  const us = kind === 'us';
  const names = (us ? allItems('states') : [...allItems('continents'), ...allItems('oceans'), ...allItems('seas'), ...allItems('countries')]).filter(w => isKnown(w.wid) || isSeen(w.wid)).map(w => cap(w.name));
  document.getElementById('print').innerHTML = `
    <header class="pp-head"><h1>${childName() ? `${esc(childName())}'s map` : 'My map'}</h1><span>${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span></header>
    <div class="pp-map">${mapSvg({ kind: us ? 'us' : 'world', show: 'print' })}</div>
    <p class="pp-key">★ = home, ${esc(HOME.town)}${names.length ? `. Find and color: ${names.map(esc).join(' · ')}` : ''}</p>`;
  window.print();
}

function render(shake) {
  app.innerHTML = screen === 'play' ? renderPlay() : screen === 'done' ? renderDone() : screen === 'parent' ? renderParent() : renderHome();
  if (shake) { const el = document.querySelector('.choices, .map-wrap'); el && el.classList.add('shake'); }
  if (screen === 'play' && sess.probs[sess.i].done) document.getElementById('next')?.focus({ preventScroll: true });
}
// keep open folds open across re-renders on the grown-ups page
function renderKeepingFolds() {
  const open = [...document.querySelectorAll('.known-lists details')].map(d => d.open);
  render();
  document.querySelectorAll('.known-lists details').forEach((d, i) => { if (open[i]) d.open = true; });
}

app.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const act = b.dataset.act;
  if (act === 'start') startSession();
  else if (act === 'check') startCheck();
  else if (act === 'pick') answer(+b.dataset.i);
  else if (act === 'next') next();
  else if (act === 'say' || act === 'slow') { const p = sess.probs[sess.i]; say(p.done && p.line ? p.line : p.mode === 'say' && (p.heard || p.done) ? cap(p.name) : p.mode === 'intro' ? introLine(p) : p.prompt, act === 'slow'); }
  else if (act === 'hear') { const p = sess.probs[sess.i]; p.heard = true; say(cap(p.name)); render(); }
  else if (act === 'intro-again') say(introLine(sess.probs[sess.i]));
  else if (act === 'said-yes') sayCheck(true);
  else if (act === 'said-no') sayCheck(false);
  else if (act === 'speak') say(b.dataset.t);
  else if (act === 'home') { screen = 'home'; confirmWipe = false; wiped = false; confirmTopic = null; render(); }
  else if (act === 'parent') { screen = 'parent'; render(); }
  else if (act === 'chip') { state.on[b.dataset.k] = !state.on[b.dataset.k]; save(); render(); }
  else if (act === 'lvl') { const k = b.dataset.k; state.levels[k] = Math.max(1, Math.min(maxLevel(k), state.levels[k] + +b.dataset.d)); state.rec[k] = []; save(); render(); }
  else if (act === 'per') { state.perSession = +b.dataset.n; save(); render(); }
  else if (act === 'autospeak') { state.autoSpeak = b.dataset.v === '1'; save(); render(); }
  else if (act === 'funfacts') { state.funFacts = b.dataset.v === '1'; save(); render(); }
  else if (act === 'sayit') { state.sayIt = b.dataset.v === '1'; save(); render(); }
  else if (act === 'speed') { state.speed = b.dataset.v; save(); render(); say('Where is Africa?'); }
  else if (act === 'try-voice') say('Hello! Can you find Egypt? Well done!');
  else if (act === 'print') printMap(b.dataset.k);
  else if (act === 'known') { const wid = b.dataset.w; markKnown(wid, !isKnown(wid)); levelFromKnown(); if (state.autoSpeak) say(cap(anyItem(wid).name)); save(); renderKeepingFolds(); }
  else if (act === 'known-all' || act === 'known-none') { allItems(b.dataset.k).forEach(w => markKnown(w.wid, act === 'known-all')); levelFromKnown(); save(); renderKeepingFolds(); }
  else if (act === 'sync-new') { startSync(newCode()); render(); }
  else if (act === 'sync-join') {
    const code = cleanCode(document.getElementById('join-code')?.value || '');
    if (!code) { sync.error = 'bad-code'; render(); return; }
    sync.error = ''; startSync(code); render();
  }
  else if (act === 'sync-now') { sync.status = 'syncing'; render(); pullRemote(); }
  else if (act === 'sync-off') { stopSync(); render(); }
  else if (act === 'sync-copy') {
    navigator.clipboard?.writeText(sync.code).then(() => { b.textContent = 'Copied'; }, () => {
      const r = document.createRange(); r.selectNodeContents(document.getElementById('sync-code'));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
    });
  }
  else if (act === 'topic-reset') { confirmTopic = b.dataset.k; render(); }
  else if (act === 'topic-reset-no') { confirmTopic = null; render(); }
  else if (act === 'topic-reset-yes') { resetTopic(b.dataset.k); confirmTopic = null; save(); render(); }
  else if (act === 'wipe') { confirmWipe = true; wiped = false; render(); }
  else if (act === 'wipe-no') { confirmWipe = false; render(); }
  else if (act === 'wipe-yes') {
    const keep = { childName: state.childName, perSession: state.perSession, sayIt: state.sayIt, funFacts: state.funFacts, autoSpeak: state.autoSpeak, speed: state.speed };
    state = Object.assign(defaultState(), keep);
    confirmWipe = false; wiped = true; sess = null; lastChanges = [];
    save(); render();
  }
});
// Clears one topic's progress, including which of its places are known.
function resetTopic(k) {
  state.levels[k] = 1;
  delete state.rec[k]; delete state.stretch[k]; delete state.mastered[k];
  state.done[k] = 0;
  state.cards = state.cards.filter(c => c.topic !== k);
  for (const w of allItems(k)) delete state.words[w.wid];
}
app.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.id !== 'name-form') return;
  state.childName = (document.getElementById('child-name')?.value || '').trim().slice(0, 24);
  save(); render();
});
app.addEventListener('change', e => {
  if (e.target.id !== 'voice') return;
  try { if (e.target.value) localStorage.setItem(VOICE_KEY, e.target.value); else localStorage.removeItem(VOICE_KEY); } catch (err) {}
  render();
  say('Hello! Where is Australia?');
});
document.addEventListener('keydown', e => {
  if (screen !== 'play') return;
  const p = sess.probs[sess.i];
  if (p.done) { if (e.key === 'Enter' && document.activeElement?.id !== 'next') next(); return; }
  if (p.layout === 'flags' && ['1', '2', '3', '4'].includes(e.key)) answer(+e.key - 1);
});
render();
initSync();
if (canSpeak) { loadVoices(); try { speechSynthesis.addEventListener('voiceschanged', loadVoices); } catch (e) {} }
