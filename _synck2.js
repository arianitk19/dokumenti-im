// syntax-only check for category screen + notif center blocks
const Screens={}; function svg(){return '';} function catIcon(){return '';} function haptic(){} function sheet(){} function closeSheet(){} function go(){} function openScan(){} function addManual(){} function docRow(){return '';} function fmtDate(){return '';} function openDoc(){} function toast(){}
function daysUntil(){return 5;} function dueReminders(){return [];} function markNotifRead(){}
const CATS={identitet:{name:'Identitet',color:'#3B82F6',types:['Letërnjoftim','Pasaportë']}};
const catKeys=['identitet'];
const State={docs:[],settings:{notifications:false}};
const Notif={permission:()=>'default'};
let _forceType=null;
function enableNotifications(){return Promise.resolve(true);} function disableNotifications(){} function testNotification(){}

function countType(cat,ty){return State.docs.filter(d=>d.cat===cat&&d.type===ty).length;}
Screens.category=(s,data)=>{
  const cat=(data&&data.cat&&CATS[data.cat])?data.cat:'identitet';
  const c=CATS[cat];
  const docs=State.docs.filter(d=>d.cat===cat).sort((a,b)=>b.created-a.created);
  s.innerHTML=`
  <div class="topbar">
    <button class="icon-btn" onclick="go('home')">${svg('back',20)}</button>
    <div class="greet"><small>Kategori</small><h2>${c.name}</h2></div>
    <div class="spacer"></div>
    <div class="avatar" style="background:${c.color}22;color:${c.color};border:1px solid ${c.color}55">${catIcon(cat,22,1.8)}</div>
  </div>
  <p class="muted pad" style="font-size:13px;margin-bottom:8px">Zgjidh një lloj dokumenti.</p>
  <div class="type-grid">
    ${c.types.map(ty=>{const n=countType(cat,ty);return `<button class="type-card" onclick="openTypeAdd('${cat}','${ty.replace(/'/g,"\\'")}')">
      <div class="type-ic" style="color:${c.color};background:${c.color}18;border-color:${c.color}33">${catIcon(cat,20,1.8)}</div>
      <div class="type-tx"><b>${ty}</b><span>${n?n+' në vault':'Shto tani'}</span></div>
      <div class="type-add">${svg('plus',18)}</div>
    </button>`;}).join('')}
  </div>
  <div class="section-h"><h3>Dokumentet e tua</h3><span class="muted">${docs.length}</span></div>
  <div class="pad">${docs.length?docs.map(d=>docRow(d)).join(''):`<div class="empty"><div class="e-ic">${svg('docs',30,1.5)}</div><b>Ende asnjë</b><p>Shto.</p></div>`}</div>`;
};
function openTypeAdd(cat,type){
  const c=CATS[cat];
  sheet(`
    <div class="row"><div class="lic" style="color:${c.color}">${catIcon(cat,20,1.8)}</div><div><h3>${type}</h3><div class="sub">${c.name}</div></div></div>
    <div class="qa-grid">
      <button class="qa" onclick="openScanFor('${cat}','${type.replace(/'/g,"\\'")}')"><div class="ic g2">${svg('camera',24)}</div><small>Fotografo</small></button>
      <button class="qa" onclick="addManualFor('${cat}','${type.replace(/'/g,"\\'")}')"><div class="ic g3">${svg('edit',24)}</div><small>Detajet</small></button>
    </div>`);
}
function openScanFor(cat,type){ _forceType={cat,type}; closeSheet(); openScan(); }
function addManualFor(cat,type){ closeSheet(); addManual(cat,type); }

function openNotifs(){
  const due=(typeof dueReminders==='function')?dueReminders():[];
  const perm=(typeof Notif!=='undefined')?Notif.permission():'unsupported';
  const on=State.settings.notifications && perm==='granted';
  const statusHtml = on
    ? `<div class="notif-status on">${svg('check',14)} Aktive</div>`
    : `<div class="notif-status off">${svg('bell',14)} Joaktive</div>`;
  const banner = on ? '' : `<div class="notif-banner"><div class="nb-ic">${svg('bell',20)}</div><div class="nb-t"><b>Aktivizo</b><span>x</span></div></div>`;
  const actions = on
    ? `<button class="btn ghost sm" onclick="testNotification()">${svg('bell',16)} Provo</button><button class="btn ghost sm" onclick="disableNotifications();closeSheet();openNotifs()">Çaktivizo</button>`
    : `<button class="btn primary sm" onclick="enableNotifications().then(function(){closeSheet();openNotifs();})">${svg('bell',16)} Aktivizo</button>`;
  sheet(`
    <h3>Njoftime</h3><div class="sub">x</div>
    ${statusHtml}${banner}
    <div class="row">${actions}</div>
    ${due.length?due.map(r=>`<div class="notif-item sev-${r.sev}" onclick="closeSheet();openDoc('${r.doc.id}')">
        <div class="ni-ic">${svg(r.days<0?'clock':'bell',18)}</div>
        <div class="ni-t"><b>${r.doc.title}</b><span>${r.days<0?'Skadoi':(r.days===0?'Sot':'Pas '+r.days)} · ${fmtDate(r.doc.expiry)}</span></div>
        <span class="pill ${r.sev==='red'?'red':r.sev==='amber'?'amber':'blue'}">${r.days<0?'!':r.days+'d'}</span>
      </div>`).join(''):`<div class="empty"><div class="e-ic">${svg('check',28)}</div><b>Asnjë</b><p>x</p></div>`}
    <button class="btn ghost mt" onclick="closeSheet()">Mbyll</button>`);
  if(typeof markNotifRead==='function') markNotifRead();
}
console.log('parse ok');
