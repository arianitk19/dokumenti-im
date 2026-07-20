/* ============================================================
   DOKUMENTI IM — Application Core
   PWA-first · Vanilla JS · IndexedDB + localStorage
   ============================================================ */
'use strict';

/* ---------- ICONS ---------- */
const I = {
  home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
  docs:'<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  ai:'<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><rect x="7" y="7" width="10" height="10" rx="3"/><circle cx="10" cy="11" r="1" fill="currentColor"/><circle cx="14" cy="11" r="1" fill="currentColor"/>',
  shield:'<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9.5 12l1.8 1.8L15 10"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  bell:'<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
  scan:'<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><path d="M4 12h16"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>',
  chevron:'<path d="m9 6 6 6-6 6"/>',
  back:'<path d="m15 6-6 6 6 6"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  star:'<path d="M12 3l2.6 5.7 6.2.7-4.6 4.2 1.3 6.1L12 16.9 6.5 19.7l1.3-6.1L3.2 9.4l6.2-.7z"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  send:'<path d="M4 12 20 4l-6 16-3-7-7-1z"/>',
  face:'<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/><path d="M9 14.5s1.2 1.5 3 1.5 3-1.5 3-1.5"/>',
  lock:'<rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  qr:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h3v3M20 14v.01M14 20h.01M20 17v3"/>',
  cloud:'<path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1A3.5 3.5 0 0 1 18 18H7z"/>',
  clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  edit:'<path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  crown:'<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z"/>',
  key:'<circle cx="8" cy="12" r="4"/><path d="M11 12h9l-2 2M18 12v3"/>',
  history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 4v4h4"/><path d="M12 8v4l3 2"/>',
  download:'<path d="M12 4v11M8 12l4 4 4-4M5 20h14"/>',
  package:'<path d="M12 3l8 4v10l-8 4-8-4V7l8-4z"/><path d="M4 7l8 4 8-4M12 11v10"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  camera:'<rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>',
  filter:'<path d="M4 5h16l-6 8v5l-4 2v-7z"/>',
  sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.3 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.3-3.6-8.5S9.6 5.8 12 3.5z"/>',
  building2:'<rect x="4" y="9" width="7" height="12" rx="1"/><path d="M11 21h9V6a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v3"/><path d="M14 9h2M14 13h2M14 17h2M7 13H8M7 17H8"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/>',
  eye:'<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/>',
  // category glyphs
  cat_identitet:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="8.5" cy="11" r="2.1"/><path d="M13 9.5h5M13 13h5M5.4 15.6c.5-1.3 1.6-2.1 3.1-2.1s2.6.8 3.1 2.1"/>',
  cat_arsim:'<path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4z"/><path d="M6 10.5V15c0 1.2 2.7 2.6 6 2.6s6-1.4 6-2.6v-4.5"/><path d="M21.5 8.5v5"/>',
  cat_pune:'<rect x="3" y="7.5" width="18" height="12.5" rx="2.5"/><path d="M8.5 7.5V6A1.5 1.5 0 0 1 10 4.5h4A1.5 1.5 0 0 1 15.5 6v1.5M3 13h18"/>',
  cat_automjet:'<path d="M5 11.5l1.6-4.4A2 2 0 0 1 8.5 5.8h7a2 2 0 0 1 1.9 1.3l1.6 4.4"/><path d="M4 11.5h16a1 1 0 0 1 1 1V17H3v-4.5a1 1 0 0 1 1-1z"/><circle cx="7.5" cy="17" r="1.6"/><circle cx="16.5" cy="17" r="1.6"/>',
  cat_shendet:'<rect x="4" y="4" width="16" height="16" rx="4.5"/><path d="M12 8.5v7M8.5 12h7"/>',
  cat_banimi:'<path d="M4 11.5 12 5l8 6.5"/><path d="M6 10.5V19h12v-8.5"/><path d="M10 19v-4.5h4V19"/>',
  cat_biznes:'<rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M9 7.5h2M13 7.5h2M9 11h2M13 11h2M9 14.5h2M13 14.5h2M10 20.5v-3h4v3"/>',
  cat_garanci:'<path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-3.2-1.7-3.3 1.7-3.3-1.7L6.5 20.5V4.5a1 1 0 0 1 1-1z"/><path d="M9.5 8.5h5M9.5 12h5"/>',
};
function svg(name,size=24,sw=2){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${I[name]||''}</svg>`;}
function catIcon(key,size=22,sw=2){return svg('cat_'+key,size,sw);}
// brand mark (document + shield) — replaces flag emoji
const BRAND_MARK='<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3.5h7l4 4V17a3.5 3.5 0 0 1-3.5 3.5H7A3.5 3.5 0 0 1 3.5 17V7A3.5 3.5 0 0 1 7 3.5z"/><path d="M13.5 3.5V7.5H17.5"/><path d="M8.5 12.5l2 2 4-4.5"/></svg>';

/* ---------- CATEGORIES ---------- */
const CATS = {
  identitet:{name:'Identitet',color:'#3B82F6',types:['Letërnjoftim','Pasaportë','Patentë shoferi','Certifikatë lindjeje','Certifikatë familjare']},
  arsim:{name:'Arsim',color:'#8B5CF6',types:['Diplomë','Certifikatë','Trajnim','Kurs']},
  pune:{name:'Punë',color:'#22D3EE',types:['CV','Kontratë pune','Referencë','Certifikim profesional']},
  automjet:{name:'Automjet',color:'#F59E0B',types:['Libreza','Sigurim','Kontroll teknik','Dokument veture']},
  shendet:{name:'Shëndet',color:'#EF4444',types:['Analizë','Raport','Recetë','Termin']},
  banimi:{name:'Banimi',color:'#10B981',types:['Kontratë qiraje','Dokument prone','Faturë']},
  biznes:{name:'Biznes',color:'#6366F1',types:['Dokument kompanie','Licencë','Kontratë','Dokument ARBK']},
  garanci:{name:'Garanci',color:'#E9C46A',types:['Faturë','Produkt','Garanci']},
};
const catKeys = Object.keys(CATS);

/* keyword map for AI auto-categorization */
const KW = {
  identitet:['leternjoftim','letërnjoftim','id','pasaport','pasaportë','patent','patentë','leje','lindje','familjare','identitet','nacional'],
  arsim:['diplom','diplomë','certifik','universitet','fakultet','shkoll','trajnim','kurs','provim','notë','master','bachelor'],
  pune:['cv','kontrat','pune','punës','referenc','pagë','punësim','punëdhënës','profesional','portofol'],
  automjet:['libreza','vetur','makin','sigurim','kasko','targ','kontroll teknik','regjistrim','veture','automjet','patentë'],
  shendet:['analiz','raport mjekësor','recet','mjek','spital','termin','shëndet','laborator','vaksin','sigurim shëndetësor'],
  banimi:['qira','qiraje','pron','banes','apartament','shtëpi','faturë','rrymë','ujë','ngrohje','kontratë qiraje'],
  biznes:['arbk','biznes','kompani','licenc','tvsh','fiskal','nipt','regjistrim biznesi','ortakëri','sh.p.k'],
  garanci:['garanci','faturë','blerje','produkt','pajisje','elektronik','warranty'],
};
function guessCategory(text){
  const t=(text||'').toLowerCase();
  let best='identitet',score=0;
  for(const k of catKeys){
    let s=0; for(const w of KW[k]){ if(t.includes(w)) s+=w.length>4?2:1; }
    if(s>score){score=s;best=k;}
  }
  return {cat:best,confidence:score?Math.min(99,72+score*4):68};
}
function guessType(text,cat){
  const t=(text||'').toLowerCase();
  for(const ty of CATS[cat].types){ if(t.includes(ty.toLowerCase().split(' ')[0])) return ty; }
  return CATS[cat].types[0];
}

/* ---------- STORAGE ---------- */
const LS = {
  get(k,d){try{const v=localStorage.getItem('dim_'+k);return v?JSON.parse(v):d;}catch(e){return d;}},
  set(k,v){localStorage.setItem('dim_'+k,JSON.stringify(v));},
  del(k){localStorage.removeItem('dim_'+k);}
};
/* IndexedDB for file blobs */
let _db=null;
function db(){
  return new Promise((res,rej)=>{
    if(_db)return res(_db);
    const r=indexedDB.open('dokumenti_im',1);
    r.onupgradeneeded=e=>{const d=e.target.result;if(!d.objectStoreNames.contains('files'))d.createObjectStore('files');};
    r.onsuccess=e=>{_db=e.target.result;res(_db);};
    r.onerror=e=>rej(e);
  });
}
async function putFile(id,blob){
  const rec = (typeof Vault!=='undefined') ? await Vault.encrypt(blob) : blob;
  const d=await db();return new Promise((res,rej)=>{const t=d.transaction('files','readwrite');t.objectStore('files').put(rec,id);t.oncomplete=()=>res();t.onerror=rej;});
}
async function getFile(id){
  const d=await db();
  const rec = await new Promise((res,rej)=>{const t=d.transaction('files','readonly');const rq=t.objectStore('files').get(id);rq.onsuccess=()=>res(rq.result);rq.onerror=rej;});
  if(!rec) return null;
  if(rec instanceof Blob) return rec;                 // legacy plaintext
  if(typeof Vault!=='undefined') return await Vault.decrypt(rec);
  return rec.data ? new Blob([rec.data],{type:rec.type||''}) : null;
}
async function delFile(id){const d=await db();return new Promise((res)=>{const t=d.transaction('files','readwrite');t.objectStore('files').delete(id);t.oncomplete=()=>res();});}

/* ---------- STATE ---------- */
const State = {
  user:LS.get('user',null),
  docs:LS.get('docs',[]),
  settings:LS.get('settings',{biometric:false,backup:true,encryption:true,autoLock:true,notifications:true,plan:'free'}),
  logs:LS.get('logs',[]),
  saveDocs(){LS.set('docs',this.docs);},
  saveUser(){LS.set('user',this.user);},
  saveSettings(){LS.set('settings',this.settings);},
  log(action){this.logs.unshift({action,ts:Date.now()});this.logs=this.logs.slice(0,40);LS.set('logs',this.logs);}
};

/* ---------- HELPERS ---------- */
const $=(s,r=document)=>r.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
function daysUntil(dateStr){if(!dateStr)return null;const d=new Date(dateStr),n=new Date();n.setHours(0,0,0,0);return Math.round((d-n)/864e5);}
function fmtDate(d){if(!d)return '—';const x=new Date(d);return x.toLocaleDateString('sq-AL',{day:'2-digit',month:'2-digit',year:'numeric'});}
function fmtBytes(b){if(!b)return '0 KB';const u=['B','KB','MB','GB'];let i=Math.floor(Math.log(b)/Math.log(1024));return (b/Math.pow(1024,i)).toFixed(i?1:0)+' '+u[i];}
function toast(msg,icon='check'){const t=$('#toast');t.innerHTML=svg(icon,18)+`<span>${msg}</span>`;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2600);}
function haptic(){if(navigator.vibrate)navigator.vibrate(8);}
function greeting(){const h=new Date().getHours();return h<5?'Natë të mbarë':h<12?'Mirëmëngjes':h<18?'Mirëdita':'Mirëmbrëma';}
function expiryPill(d){const days=daysUntil(d);if(days==null)return '';if(days<0)return `<span class="pill red">Skaduar</span>`;if(days<=30)return `<span class="pill red">${days}d</span>`;if(days<=90)return `<span class="pill amber">${days}d</span>`;return `<span class="pill green">${days}d</span>`;}

/* ---------- SEED DEMO DATA ---------- */
function seed(){
  const today=new Date();
  const plus=n=>{const d=new Date(today);d.setDate(d.getDate()+n);return d.toISOString().slice(0,10);};
  const minus=n=>{const d=new Date(today);d.setDate(d.getDate()-n);return d.toISOString().slice(0,10);};
  State.docs=[
    {id:uid(),title:'Pasaportë e Republikës së Kosovës',cat:'identitet',type:'Pasaportë',institution:'MPB — Departamenti i Pasaportave',issued:minus(900),expiry:plus(88),number:'P0384512',fav:true,tags:['identitet','udhëtim'],size:284000,created:Date.now()-8e8,ocr:'Republika e Kosovës · Pasaportë · Arianit Krasniqi · Nr. P0384512'},
    {id:uid(),title:'Letërnjoftim (ID)',cat:'identitet',type:'Letërnjoftim',institution:'ARC — Agjencia e Regjistrimit Civil',issued:minus(500),expiry:plus(20),number:'1198234567',fav:true,tags:['identitet'],size:198000,created:Date.now()-7e8,ocr:'Letërnjoftim · Arianit Krasniqi · Komuna Prishtinë'},
    {id:uid(),title:'Patentë shoferi — Kategoria B',cat:'automjet',type:'Patentë shoferi',institution:'MPB — Qendra e Patentave',issued:minus(1200),expiry:plus(45),number:'KS-DL-88213',fav:false,tags:['automjet','identitet'],size:156000,created:Date.now()-6e8,ocr:'Patentë shoferi · Kategoria B · Vlen deri'},
    {id:uid(),title:'Sigurimi i automjetit (TPL)',cat:'automjet',type:'Sigurim',institution:'Sigal Uniqa Group',issued:minus(345),expiry:plus(20),number:'INS-2025-4471',fav:false,tags:['automjet','sigurim'],size:120000,created:Date.now()-5e8,ocr:'Policë sigurimi · TPL · Vetura AA-123-BC'},
    {id:uid(),title:'Diplomë Bachelor — Shkenca Kompjuterike',cat:'arsim',type:'Diplomë',institution:'Universiteti i Prishtinës',issued:minus(400),expiry:'',number:'UP-CS-2024-0912',fav:true,tags:['arsim','punësim'],size:340000,created:Date.now()-4e8,ocr:'Universiteti i Prishtinës · Diplomë · Bachelor · Shkenca Kompjuterike'},
    {id:uid(),title:'CV — Arianit Krasniqi',cat:'pune',type:'CV',institution:'Personal',issued:minus(30),expiry:'',number:'',fav:false,tags:['punësim'],size:88000,created:Date.now()-3e8,ocr:'Curriculum Vitae · Software Engineer · Prishtinë'},
    {id:uid(),title:'Kontratë pune — BuiltByNiti',cat:'pune',type:'Kontratë pune',institution:'BuiltByNiti Sh.p.k.',issued:minus(120),expiry:plus(245),number:'CTR-2025-018',fav:false,tags:['punësim','biznes'],size:210000,created:Date.now()-2e8,ocr:'Kontratë pune · BuiltByNiti · Pozita: Full Stack Engineer'},
    {id:uid(),title:'Kontratë qiraje — Banesa Prishtinë',cat:'banimi',type:'Kontratë qiraje',institution:'Noteria Prishtinë',issued:minus(180),expiry:plus(185),number:'QRJ-4412',fav:false,tags:['banim'],size:175000,created:Date.now()-15e7,ocr:'Kontratë qiraje · Rr. Nëna Terezë · Prishtinë'},
    {id:uid(),title:'Analiza gjaku — Laboratori',cat:'shendet',type:'Analizë',institution:'Spitali Amerikan Prishtinë',issued:minus(15),expiry:'',number:'LAB-99823',fav:false,tags:['shëndet'],size:96000,created:Date.now()-9e7,ocr:'Analizë gjaku · Hemogram · Rezultate normale'},
    {id:uid(),title:'Faturë & Garanci — Laptop',cat:'garanci',type:'Garanci',institution:'Gjirafa Mall',issued:minus(60),expiry:plus(670),number:'INV-778812',fav:false,tags:['garanci'],size:64000,created:Date.now()-7e7,ocr:'Faturë tatimore · Laptop · Garanci 24 muaj'},
  ];
  State.saveDocs();
  State.log('Krijim i llogarisë');
  State.log('10 dokumente të shtuara automatikisht');
}

/* ---------- IDENTITY SCORE ---------- */
function identityScore(){
  const docs=State.docs;if(!docs.length)return 40;
  let s=45;
  const cats=new Set(docs.map(d=>d.cat));
  s+=Math.min(24,cats.size*3);
  s+=Math.min(12,docs.length);
  if(docs.some(d=>d.cat==='identitet'))s+=6;
  const expiring=docs.filter(d=>{const dd=daysUntil(d.expiry);return dd!=null&&dd<30;}).length;
  s-=expiring*3;
  if(State.settings.biometric)s+=4;
  if(State.settings.backup)s+=3;
  return Math.max(35,Math.min(99,Math.round(s)));
}
function securityScore(){let s=40;const g=State.settings;if(g.biometric)s+=20;if(g.encryption)s+=20;if(g.backup)s+=12;if(g.autoLock)s+=6;if(State.user&&State.user.pin)s+=2;return Math.min(100,s);}
function totalSize(){return State.docs.reduce((a,d)=>a+(d.size||0),0);}

/* ============================================================
   ROUTER
   ============================================================ */
const Screens={};
let current='home';
function go(name,data){
  const host=$('#screens');
  if(Screens[name]){
    host.innerHTML='';
    const s=el('div','screen active');
    s.id='scr-'+name;
    host.appendChild(s);
    Screens[name](s,data);
    current=name;
    updateNav();
    s.scrollTop=0;
  }
}
function updateNav(){
  const nav=$('#nav');
  const items=[['home','Ballina'],['docs','Dokumentet'],['fab'],['ai','AI'],['profile','Profili']];
  nav.innerHTML=items.map(it=>{
    if(it[0]==='fab')return `<div class="fab-wrap"><button class="fab" onclick="openAdd()">${svg('plus',26)}</button></div>`;
    const on=(current===it[0]||(it[0]==='docs'&&current==='detail'))?'on':'';
    return `<button class="${on}" onclick="go('${it[0]}')">${svg(it[0],23)}<span>${it[1]}</span></button>`;
  }).join('');
}

/* ============================================================
   SPLASH + BOOT
   ============================================================ */
window.addEventListener('load',()=>{
  setTimeout(()=>{
    const sp=$('#splash');sp.style.opacity='0';
    setTimeout(()=>{sp.remove();boot();},700);
  },2500);
});
function boot(){
  if(typeof Vault!=='undefined') Vault.init();
  if(!State.user){ go('onboard'); }
  else if(State.user.pin && State.settings.autoLock){ go('lock'); }
  else { enterApp(); }
}
function enterApp(){
  $('#nav').style.display='flex';
  State.log('Hyrje në aplikacion');
  go('home');
}
/* build: v1.2 professional · real features */

/* premium 3D tilt on the active identity card */
document.addEventListener('pointermove',(e)=>{
  const card=document.querySelector('.screen.active .id-card');
  if(!card)return;
  const r=card.getBoundingClientRect();
  if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){card.style.transform='';return;}
  const px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5;
  card.style.transition='transform .08s ease-out';
  card.style.transform='perspective(1000px) rotateY('+(px*6.5).toFixed(2)+'deg) rotateX('+(-py*6.5).toFixed(2)+'deg)';
},{passive:true});
document.addEventListener('pointerup',()=>{const c=document.querySelector('.id-card');if(c){c.style.transition='transform .55s cubic-bezier(.16,1,.3,1)';c.style.transform='';}});
