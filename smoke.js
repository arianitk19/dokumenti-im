// Pure-Node smoke test with Proxy DOM stub (no external deps)
const fs = require('fs');
const vm = require('vm');

function makeEl() {
  const t = {
    _html: '', className: '', id: '', style: {}, scrollTop: 0, children: [],
    classList: { _s: new Set() },
    appendChild(c) { t.children.push(c); return c; },
    querySelector() { return makeEl(); },
    querySelectorAll() { return []; },
    addEventListener() {}, removeEventListener() {}, remove() {}, click() {}, focus() {},
    setAttribute() {}, getAttribute() { return ''; }
  };
  t.classList.add = function (x) { t.classList._s.add(x); };
  t.classList.remove = function (x) { t.classList._s.delete(x); };
  t.classList.toggle = function (x) { t.classList._s.has(x) ? t.classList._s.delete(x) : t.classList._s.add(x); };
  t.classList.contains = function (x) { return t.classList._s.has(x); };
  Object.defineProperty(t, 'innerHTML', { get() { return t._html; }, set(v) { t._html = String(v); } });
  Object.defineProperty(t, 'value', { get() { return t._val || ''; }, set(v) { t._val = v; } });
  Object.defineProperty(t, 'textContent', { get() { return t._txt || ''; }, set(v) { t._txt = v; } });
  return new Proxy(t, {
    get(o, p) { if (p in o) return o[p]; if (typeof p === 'symbol') return o[p]; return makeEl(); },
    set(o, p, v) { o[p] = v; return true; }
  });
}

const els = {};
function qsel(sel) { if (!els[sel]) els[sel] = makeEl(); return els[sel]; }

global.document = { createElement: () => makeEl(), querySelector: qsel, querySelectorAll: () => [], getElementById: id => qsel('#' + id), body: makeEl(), addEventListener() {} };
global.window = { addEventListener() {} };
global.requestAnimationFrame = cb => cb && cb();
global.navigator = { vibrate() {}, clipboard: { writeText: () => Promise.resolve() } };
const store = {};
global.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = v; }, removeItem: k => { delete store[k]; } };
global.indexedDB = { open: () => { const r = {}; setTimeout(() => { r.result = { objectStoreNames: { contains: () => true }, transaction: () => ({ objectStore: () => ({ put() {}, get() { const g = {}; setTimeout(() => g.onsuccess && g.onsuccess(), 0); return g; }, delete() {} }), oncomplete: null, onerror: null }) }; if (r.onsuccess) r.onsuccess({ target: r }); }, 0); return r; } };
global.URL = { createObjectURL: () => 'blob:x' };
global.Blob = class { constructor() { this.type = 'application/json'; } };
global.QRCode = function () {};
global.QRCode.CorrectLevel = { M: 1 };
global.event = { target: makeEl() };

const errors = [];
function T(name, fn) {
  try { fn(); console.log('OK   ' + name); }
  catch (e) { errors.push(name + ': ' + e.message); console.log('FAIL ' + name + ' :: ' + e.message); }
}

// Concatenate all app sources so const/let share ONE lexical scope,
// then run tests inside the same direct-eval scope.
const appSrc = ['app.js', 'screens-core.js', 'screens-docs.js', 'screens-ai.js', 'screens-more.js']
  .map(f => fs.readFileSync(f, 'utf8')).join('\n;\n');

const testSrc = `
T('onboard flow', () => { obStep = 0; go('onboard'); obNext(); obNext(); });
T('signup', () => { go('signup'); });
T('setpin render', () => { go('setpin'); });
T('create user + seed + home', () => { State.user = { name: 'Arianit Krasniqi', email: 'a@b.com', city: 'Prishtine', pin: '1234', created: Date.now() }; State.saveUser(); seed(); go('home'); });
T('docs list', () => { go('docs'); renderDocList(); });
T('docs filter cat', () => { docFilter.cat = 'automjet'; renderDocList(); docFilter.cat = 'all'; renderDocList(); });
T('detail', () => { go('detail', { id: State.docs[0].id }); });
T('ai screen', () => { go('ai'); });
T('ai answers', () => { ['kur me skadon pasaporta', 'ku eshte kontrata ime e punes', 'cfare me duhet per punesim', 'sa dokumente kam', 'tung', 'ku eshte diploma'].forEach(query => { const a = aiAnswer(query); if (!a || a.length < 5) throw new Error('empty: ' + query); }); });
T('packs', () => { go('packs'); });
T('security', () => { go('security'); });
T('premium', () => { go('premium'); });
T('profile', () => { go('profile'); });
T('scores valid', () => { const a = identityScore(), b = securityScore(); if (!(a >= 35 && a <= 99 && b > 0 && b <= 100)) throw new Error('range ' + a + '/' + b); });
T('guessCategory', () => { if (guessCategory('Pasaporte e Kosoves').cat !== 'identitet') throw new Error('miscat1'); if (guessCategory('Sigurim automjeti kasko').cat !== 'automjet') throw new Error('miscat2'); });
T('packMatch', () => { const m = packMatch(PACKS[0].need); if (!Array.isArray(m) || !m.length) throw new Error('bad'); });
T('sheets', () => { openAdd(); openShare(State.docs[0].id); openQR(State.docs[0].id); openNotifs(); openSort(); });
T('toggleFav', () => { toggleFav(State.docs[2].id); });
T('toggleSetting', () => { toggleSetting('backup', makeEl()); });
T('saveNewDoc', () => { qsel('#ad_title').value = 'Test'; qsel('#ad_cat').value = 'pune'; qsel('#ad_type').value = 'CV'; qsel('#ad_inst').value = 'X'; qsel('#ad_issued').value = '2026-01-01'; qsel('#ad_exp').value = ''; const n0 = State.docs.length; saveNewDoc('testid123', ''); if (State.docs.length !== n0 + 1) throw new Error('not added'); });
T('lock render', () => { go('lock'); });
T('exportData', () => { exportData(); });

console.log('\\n=== RESULT ===');
if (errors.length) { console.log('ERRORS (' + errors.length + '):\\n' + errors.join('\\n')); process.exit(1); }
else { console.log('ALL TESTS PASS -- ' + State.docs.length + ' docs, identity ' + identityScore() + ' pct, security ' + securityScore() + ' pct'); }
`;

try {
  eval(appSrc + '\n;\n' + testSrc);
} catch (e) {
  console.log('FATAL: ' + e.message + '\n' + (e.stack || ''));
  process.exit(1);
}
