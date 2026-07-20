/* ============================================================
   SCREENS — Onboarding · Auth · Lock · Dashboard
   ============================================================ */

/* ---------- ONBOARDING ---------- */
let obStep=0;
const OB_ICONS=['grid','scan','shield'];
Screens.onboard=(s)=>{
  s.classList.add('noscroll');
  const icon=OB_ICONS[obStep];
  s.innerHTML=`
  <div class="ob">
    <div class="ob-lang">${langSwitch()}</div>
    <div class="art">
      <div class="ob-art-glow"></div>
      <div class="titan ob-art" style="color:var(--accent-3)">${svg(icon,64,1.6)}</div>
    </div>
    <div class="dots">${[0,1,2].map(i=>`<i class="${i===obStep?'on':''}"></i>`).join('')}</div>
    <h1>${tr('ob'+(obStep+1)+'_t')}</h1>
    <p>${tr('ob'+(obStep+1)+'_p')}</p>
    <div style="margin-top:26px">
      <button class="btn primary" onclick="obNext()">${obStep<2?tr('ob_next'):tr('ob_start')} ${svg('chevron',18)}</button>
      ${obStep<2?`<button class="btn ghost sm" style="margin-top:10px;width:auto;padding:10px 20px;margin-left:auto;margin-right:auto;background:none;border:none;color:var(--text-3)" onclick="obStep=2;go('onboard')">${tr('ob_skip')}</button>`:''}
    </div>
  </div>`;
};
function obNext(){haptic();if(obStep<2){obStep++;go('onboard');}else{go('signup');}}
function langSwitch(){
  return `<div class="lang-switch">
    <button class="${LANG==='sq'?'on':''}" onclick="switchLang('sq')">SQ</button>
    <button class="${LANG==='en'?'on':''}" onclick="switchLang('en')">EN</button>
  </div>`;
}
function switchLang(l){ if(l===LANG)return; setLang(l); haptic(); go(current); }

/* ---------- SIGNUP — sophisticated wizard with live identity card ---------- */
let suStep=0;
let suData={name:'',region:'Kosovë',email:'',phone:'',terms:true};
Screens.signup=(s)=>{
  s.classList.add('noscroll');
  suData.lang=LANG;
  renderSignup(s);
};
function suInitials(){
  const parts=suData.name.trim().split(/\s+/).filter(Boolean);
  if(!parts.length) return '••';
  return (parts[0][0]+(parts[1]?parts[1][0]:'')).toUpperCase();
}
function livePreview(){
  const yr=new Date().getFullYear();
  return `<div class="wiz-card" id="wizCard">
    <div class="wiz-card-mesh"></div><div class="wiz-card-sheen"></div>
    <div class="wiz-card-row">
      <div style="min-width:0">
        <div class="wiz-card-lbl">${tr('su_preview')}</div>
        <div class="wiz-card-name" id="pvName">${suData.name.trim()?escapeHtml(suData.name.trim()):tr('su_yourname')}</div>
        <div class="wiz-card-sub" id="pvRegion">${regionLabel(suData.region)} · Republika e Kosovës</div>
      </div>
      <div class="wiz-card-ava" id="pvAva">${suInitials()}</div>
    </div>
    <div class="wiz-card-foot">
      <div class="wiz-card-chip">${BRAND_MARK}</div>
      <div class="wiz-card-meta"><span>${tr('su_member')}</span><b>${yr}</b></div>
    </div>
  </div>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function renderSignup(s){
  s=s||$('#scr-signup'); if(!s) return;
  const b0=suStep===0, done0=suStep>0;
  const body = suStep===0 ? `
      <div class="float-field">
        <input class="finput" id="su_name" placeholder=" " value="${escapeHtml(suData.name)}" autocomplete="name" oninput="suLive()"/>
        <label>${tr('su_name')}</label>${svg('user',18)}
      </div>
      <div class="wiz-sec-h">${tr('su_region')}</div>
      <div class="region-grid">
        ${REGIONS.map(r=>`<button class="region-chip ${suData.region===r?'on':''}" onclick="suPickRegion('${r}')">${svg(r==='Diasporë'||r==='Tjetër'?'globe':'cat_banimi',16,1.8)}<span>${regionLabel(r)}</span></button>`).join('')}
      </div>
      <div class="wiz-sec-h">${tr('su_lang')}</div>
      <div class="lang-switch wide">
        <button class="${LANG==='sq'?'on':''}" onclick="switchLang('sq')">Shqip</button>
        <button class="${LANG==='en'?'on':''}" onclick="switchLang('en')">English</button>
      </div>
    ` : `
      <div class="float-field">
        <input class="finput" id="su_email" type="email" placeholder=" " value="${escapeHtml(suData.email)}" autocomplete="email"/>
        <label>${tr('su_email')}</label>${svg('send',17)}
      </div>
      <span class="ferr" id="err_email"></span>
      <div class="float-field">
        <input class="finput" id="su_phone" type="tel" placeholder=" " value="${escapeHtml(suData.phone)}" autocomplete="tel"/>
        <label>${tr('su_phone')} <span class="opt">(${tr('su_opt')})</span></label>${svg('bell',17)}
      </div>
      <label class="consent" style="margin-top:8px"><input type="checkbox" id="su_terms" ${suData.terms?'checked':''}/><span>${tr('su_consent')}</span></label>
    `;
  s.innerHTML=`
  <div class="wiz">
    <div class="wiz-head">
      <button class="wiz-back-btn" onclick="suBack()" style="${b0?'visibility:hidden':''}">${svg('back',20)}</button>
      <div class="wiz-rail">
        <span class="seg ${b0||done0?'on':''}"></span><span class="seg ${done0?'on':''}"></span><span class="seg"></span>
      </div>
      ${langSwitch()}
    </div>
    <div class="wiz-hero">${livePreview()}</div>
    <div class="wiz-titles">
      <h1>${tr('su_create')}</h1>
      <p>${tr('su_sub')}</p>
      <div class="wiz-stepline">${b0?tr('su_identity'):tr('su_contact')} · ${suStep+1}/3</div>
    </div>
    <div class="wiz-body" id="wizBody">${body}</div>
    <div class="wiz-foot">
      <button class="btn primary" onclick="suNext()">${b0?tr('su_continue'):tr('su_to_security')} ${svg('chevron',18)}</button>
      <p class="foot-note">${svg('lock',13)} ${tr('su_secure')}</p>
    </div>
  </div>`;
}
function suLive(){
  const n=$('#su_name'); if(n) suData.name=n.value;
  const nm=$('#pvName'); if(nm) nm.textContent=suData.name.trim()||tr('su_yourname');
  const av=$('#pvAva'); if(av) av.textContent=suInitials();
  const card=$('#wizCard'); if(card){ card.classList.remove('pulse'); void card.offsetWidth; card.classList.add('pulse'); }
}
function suPickRegion(r){
  suData.region=r; haptic();
  const pv=$('#pvRegion'); if(pv) pv.textContent=regionLabel(r)+' · Republika e Kosovës';
  document.querySelectorAll('.region-chip').forEach(c=>c.classList.remove('on'));
  if(event&&event.currentTarget) event.currentTarget.classList.add('on');
}
function suBack(){ if(suStep>0){ syncSignup(); suStep--; haptic(); go('signup'); } }
function syncSignup(){
  const n=$('#su_name'); if(n) suData.name=n.value;
  const e=$('#su_email'); if(e) suData.email=e.value;
  const p=$('#su_phone'); if(p) suData.phone=p.value;
  const t=$('#su_terms'); if(t) suData.terms=t.checked;
}
function suNext(){
  syncSignup();
  if(suStep===0){
    if(!suData.name.trim() || suData.name.trim().split(/\s+/).filter(Boolean).length<2){ toast(tr('err_name'),'user'); shakeField('su_name'); return; }
    suStep=1; haptic(); go('signup'); return;
  }
  if(suData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(suData.email)){ const err=$('#err_email'); if(err)err.textContent=tr('err_email'); toast(tr('err_email'),'info'); return; }
  if(!suData.terms){ toast(tr('err_consent'),'info'); return; }
  State.user={ name:suData.name.trim(), email:suData.email.trim(), phone:suData.phone.trim(), city:suData.region, region:suData.region, lang:LANG, pin:null, created:Date.now() };
  State.saveUser();
  haptic();
  go('setpin');
}
function shakeField(id){ const el=$('#'+id); if(el){ const w=el.closest('.float-field')||el; w.classList.add('shakex'); setTimeout(()=>w.classList.remove('shakex'),450); } }

/* ---------- SET PIN (Security Setup) ---------- */
let _pinBuf='',_pinFirst='';
Screens.setpin=(s)=>{
  _pinBuf='';_pinFirst='';
  s.classList.add('noscroll');
  renderPinSetup(s);
};
function renderPinSetup(s){
  s.innerHTML=`
  <div class="lock-wrap">
    <div class="lock-face">${svg('shield',40)}</div>
    <h1 style="font-size:22px;font-weight:800">${_pinFirst?tr('pin_confirm'):tr('pin_create')}</h1>
    <p class="muted" style="font-size:14px;margin-top:6px;max-width:280px">${_pinFirst?tr('pin_hint2'):tr('pin_hint')}</p>
    <div class="pin-dots" id="pinDots">${[0,1,2,3].map(i=>`<i class="${i<_pinBuf.length?'f':''}"></i>`).join('')}</div>
    <div class="keypad">
      ${[1,2,3,4,5,6,7,8,9].map(n=>`<button onclick="pinPress('${n}',true)">${n}</button>`).join('')}
      <button class="fn"></button>
      <button onclick="pinPress('0',true)">0</button>
      <button class="fn" onclick="pinDel(true)">${svg('back',20)}</button>
    </div>
  </div>`;
}
function pinPress(n,setup){
  haptic();
  if(_pinBuf.length>=4)return;
  _pinBuf+=n;
  const dots=$('#pinDots');if(dots)dots.children[_pinBuf.length-1]?.classList.add('f');
  if(_pinBuf.length===4){
    setTimeout(()=>setup?pinSetupDone():pinUnlock(),180);
  }
}
function pinDel(setup){haptic();_pinBuf=_pinBuf.slice(0,-1);const s=$('#scr-'+(setup?'setpin':'lock'));if(s){setup?renderPinSetup(s):renderLock(s);}}
function pinSetupDone(){
  if(!_pinFirst){_pinFirst=_pinBuf;_pinBuf='';renderPinSetup($('#scr-setpin'));return;}
  if(_pinBuf!==_pinFirst){
    toast('PIN-et nuk përputhen','lock');_pinFirst='';_pinBuf='';renderPinSetup($('#scr-setpin'));return;
  }
  State.user.pin=_pinFirst;State.saveUser();
  if(State.docs.length===0)seed();
  State.log('Konfigurim i sigurisë (PIN)');
  haptic();
  setTimeout(()=>go('biosetup'),300);
}

/* ---------- BIOMETRIC ENROLLMENT (real WebAuthn) ---------- */
Screens.biosetup=(s)=>{
  s.classList.add('noscroll');
  s.innerHTML=`
  <div class="lock-wrap">
    <div class="steps" style="margin-bottom:26px"><span class="stp"><i>${svg('check',12,3)}</i>Llogaria</span><span class="stp-line" style="background:var(--grad-brand)"></span><span class="stp on"><i>2</i>Siguria</span></div>
    <div class="lock-face" style="background:var(--grad-vault)">${svg('face',40)}</div>
    <h1 style="font-size:22px;font-weight:800">${tr('bio_title')}</h1>
    <p class="muted" style="font-size:14px;margin-top:8px;max-width:310px;line-height:1.5">${tr('bio_desc')}</p>
    <div id="bioNote" style="font-size:12.5px;margin-top:14px;color:var(--amber);min-height:16px;max-width:300px"></div>
    <div style="width:100%;max-width:330px;margin-top:26px">
      <button class="btn primary" id="bioEnableBtn" onclick="enableBioSetup()">${svg('face',18)} ${tr('bio_enable')}</button>
      <button class="btn ghost mt" onclick="finishSecurity()">${tr('bio_later')}</button>
    </div>
    <p class="foot-note" style="margin-top:20px">${svg('lock',13)} WebAuthn · Enkriptim AES-256 lokal</p>
  </div>`;
  Bio.ready().then(ok=>{
    if(ok)return;
    const btn=$('#bioEnableBtn'),note=$('#bioNote');
    if(btn){btn.disabled=true;btn.style.opacity='.45';}
    if(note)note.textContent=Bio.secureContext()
      ? 'Kjo pajisje nuk ka biometrikë të disponueshme. Do të përdoret PIN-i.'
      : 'Face ID kërkon që aplikacioni të hapet përmes https ose localhost (jo si skedar). PIN-i mbetet aktiv.';
  });
};
async function enableBioSetup(){
  const btn=$('#bioEnableBtn'),note=$('#bioNote');
  if(btn){btn.disabled=true;btn.innerHTML='Duke aktivizuar…';}
  if(note)note.textContent='';
  try{
    const rawId=await Bio.register(State.user);
    State.user.bioCred=rawId;State.settings.biometric=true;State.saveUser();State.saveSettings();
    State.log('Biometrika u aktivizua (Face ID / Touch ID)');
    haptic();toast('Biometrika u aktivizua','face');
    finishSecurity();
  }catch(e){
    State.settings.biometric=false;State.saveSettings();
    if(btn){btn.disabled=false;btn.innerHTML=svg('face',18)+' Provo përsëri';}
    if(note)note.style.color='var(--red)',note.textContent='Aktivizimi u anulua ose dështoi. Mund të vazhdosh me PIN-in.';
    if(navigator.vibrate)navigator.vibrate([20,40,20]);
  }
}
function finishSecurity(){
  toast('Vault-i u sigurua','shield');
  haptic();
  setTimeout(()=>enterApp(),350);
}

/* ---------- LOCK SCREEN ---------- */
Screens.lock=(s)=>{_pinBuf='';s.classList.add('noscroll');renderLock(s);};
function renderLock(s){
  const hasBio=!!(State.user&&State.user.bioCred&&State.settings.biometric&&Bio.supported());
  s.innerHTML=`
  <div class="lock-wrap">
    <div class="lock-face" style="background:var(--grad-vault)">${svg('lock',38)}</div>
    <h1 style="font-size:22px;font-weight:800">${tr('welcome_back')}</h1>
    <p class="muted" style="font-size:14px;margin-top:6px">${State.user?.name?.split(' ')[0]||''} · ${hasBio?tr('unlock_bio'):tr('unlock_pin')}</p>
    <div class="pin-dots" id="pinDots">${[0,1,2,3].map(i=>`<i class="${i<_pinBuf.length?'f':''}"></i>`).join('')}</div>
    <div class="keypad">
      ${[1,2,3,4,5,6,7,8,9].map(n=>`<button onclick="pinPress('${n}',false)">${n}</button>`).join('')}
      ${hasBio?`<button class="fn" onclick="bioUnlock()" style="color:var(--accent-3)">${svg('face',26)}</button>`:'<button class="fn"></button>'}
      <button onclick="pinPress('0',false)">0</button>
      <button class="fn" onclick="pinDel(false)">${svg('back',20)}</button>
    </div>
    ${hasBio?`<button class="btn ghost sm" style="width:auto;margin-top:26px;padding:11px 22px" onclick="bioUnlock()">${svg('face',18)} Zhblloko me Face ID</button>`:''}
  </div>`;
}
function pinUnlock(){
  if(_pinBuf===State.user.pin){haptic();toast('Zhbllokuar','check');setTimeout(enterApp,250);}
  else{const d=$('#pinDots');d?.classList.add('err');if(navigator.vibrate)navigator.vibrate([30,40,30]);setTimeout(()=>{_pinBuf='';renderLock($('#scr-lock'));},450);}
}
async function bioUnlock(){
  if(!(State.user&&State.user.bioCred&&Bio.supported())){
    toast(Bio.secureContext()?'Face ID nuk është konfiguruar':'Face ID kërkon https ose localhost','face');
    return;
  }
  haptic();
  const face=$('.lock-face');if(face){face.style.transition='.3s';face.style.background='var(--grad-brand)';face.style.transform='scale(1.06)';}
  try{
    await Bio.verify(State.user.bioCred);
    State.log('Zhbllokim me biometrikë');
    toast('Identiteti u verifikua','check');haptic();
    setTimeout(enterApp,250);
  }catch(e){
    if(face){face.style.background='var(--grad-vault)';face.style.transform='none';}
    if(navigator.vibrate)navigator.vibrate([30,40,30]);
    toast('Verifikimi dështoi — provo PIN-in','lock');
  }
}

/* ---------- DASHBOARD ---------- */
Screens.home=(s)=>{
  const u=State.user, docs=State.docs;
  const score=identityScore();
  const expiring=docs.filter(d=>{const dd=daysUntil(d.expiry);return dd!=null&&dd<=120;}).sort((a,b)=>daysUntil(a.expiry)-daysUntil(b.expiry)).slice(0,4);
  const R=33,C=2*Math.PI*R,off=C*(1-score/100);
  s.innerHTML=`
  <div class="topbar">
    <div class="greet"><small>${greeting()}</small><h2>${u.name.split(' ')[0]}</h2><small class="live-clock" id="liveClock" style="color:var(--text-3);font-weight:600"></small></div>
    <div class="spacer"></div>
    <button class="icon-btn badge" data-badge="${(typeof notifUnreadCount==='function'?notifUnreadCount():expiring.filter(d=>daysUntil(d.expiry)<=30).length)||''}" onclick="openNotifs()">${svg('bell',20)}</button>
    <button class="avatar" onclick="go('profile')">${u.name[0].toUpperCase()}</button>
  </div>

  <div class="id-card">
    <div class="shine"></div><div class="mesh"></div>
    <div class="id-top">
      <div>
        <div class="lbl">Digital Identity</div>
        <div class="name">${u.name}</div>
        <div class="sub">${u.city} · Republika e Kosovës</div>
      </div>
      <div class="ring">
        <svg width="74" height="74"><circle cx="37" cy="37" r="${R}" stroke="rgba(255,255,255,.1)" stroke-width="6" fill="none"/>
        <circle cx="37" cy="37" r="${R}" stroke="url(#g)" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" style="transition:stroke-dashoffset 1.3s cubic-bezier(.22,1,.36,1)" id="scoreRing"/>
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs></svg>
        <div class="val"><b>${score}%</b><span>SCORE</span></div>
      </div>
    </div>
    <div class="id-stats">
      <div class="id-stat"><b>${docs.length}</b><span>Dokumente</span></div>
      <div class="id-stat"><b>${fmtBytes(totalSize())}</b><span>Storage</span></div>
      <div class="id-stat"><b>${new Set(docs.map(d=>d.cat)).size}/8</b><span>Kategori</span></div>
    </div>
  </div>

  <div class="section-h"><h3>Veprime të shpejta</h3></div>
  <div class="qa-grid">
    <button class="qa" onclick="openAdd()"><div class="ic">${svg('plus',22)}</div><small>Shto</small></button>
    <button class="qa" onclick="openScan()"><div class="ic g2">${svg('scan',22)}</div><small>Skano</small></button>
    <button class="qa" onclick="go('ai')"><div class="ic g3">${svg('ai',22)}</div><small>Pyet AI</small></button>
    <button class="qa" onclick="go('docs')"><div class="ic g4">${svg('share',22)}</div><small>Ndaj</small></button>
  </div>

  <div class="section-h"><h3>Dokumente me afat</h3><button onclick="go('docs')">Të gjitha</button></div>
  <div id="expFeed">
    ${expiring.length?expiring.map(d=>expItem(d)).join(''):'<p class="muted pad" style="font-size:13.5px">Asnjë dokument nuk skadon së shpejti</p>'}
  </div>

  <div class="section-h"><h3>Kategoritë</h3><button onclick="go('docs')">Shiko</button></div>
  <div class="cat-scroll">
    ${catKeys.map(k=>{const n=docs.filter(d=>d.cat===k).length;return `<button class="cat-chip" onclick="go('category',{cat:'${k}'})"><div class="emo" style="color:${CATS[k].color}">${catIcon(k,24,1.8)}</div><b>${CATS[k].name}</b><span>${n} dokumente</span></button>`;}).join('')}
  </div>

  <div class="section-h"><h3>Dokumenti AI</h3></div>
  <div class="card" style="margin:0 20px;padding:18px;display:flex;gap:14px;align-items:center" onclick="go('ai')">
    <div class="qa" style="pointer-events:none;padding:0"><div class="ic g3" style="width:48px;height:48px">${svg('sparkle',24)}</div></div>
    <div style="flex:1"><b style="font-size:14.5px;font-weight:800">Pyet asistentin tënd</b><p class="muted" style="font-size:12.5px;margin-top:3px">"Kur më skadon pasaporta?" · "Ku është kontrata ime?"</p></div>
    ${svg('chevron',20)}
  </div>
  <div style="height:20px"></div>`;
  requestAnimationFrame(()=>{const r=$('#scoreRing');if(r)r.style.strokeDashoffset=off;});
  startClock();
};
function startClock(){
  const upd=()=>{const c=$('#liveClock');if(!c)return false;const now=new Date();
    c.textContent=now.toLocaleDateString('sq-AL',{weekday:'long',day:'numeric',month:'long'})+' · '+now.toLocaleTimeString('sq-AL',{hour:'2-digit',minute:'2-digit'});return true;};
  clearInterval(startClock._t);upd();startClock._t=setInterval(()=>{if(!upd())clearInterval(startClock._t);},20000);
}
function expItem(d){
  const days=daysUntil(d.expiry);
  return `<div class="exp-item" onclick="openDoc('${d.id}')">
    <div class="dot" style="color:${CATS[d.cat].color}">${catIcon(d.cat,22,1.8)}</div>
    <div class="info"><b>${d.title}</b><span>${days<0?'Ka skaduar':'Skadon pas '+days+' ditësh'} · ${fmtDate(d.expiry)}</span></div>
    ${expiryPill(d.expiry)}
  </div>`;
}
function openNotifs(){
  const due=(typeof dueReminders==='function')?dueReminders():[];
  const perm=(typeof Notif!=='undefined')?Notif.permission():'unsupported';
  const on=State.settings.notifications && perm==='granted';
  const statusHtml = on
    ? `<div class="notif-status on">${svg('check',14)} Njoftimet janë aktive · kujtesa strikte për çdo skadim</div>`
    : `<div class="notif-status off">${svg('bell',14)} Njoftimet janë joaktive</div>`;
  const banner = on ? '' : `<div class="notif-banner"><div class="nb-ic">${svg('bell',20)}</div><div class="nb-t"><b>Aktivizo njoftimet</b><span>Merr kujtesa reale kur dokumentet po skadojnë — të sakta e strikte.</span></div></div>`;
  const actions = on
    ? `<button class="btn ghost sm" onclick="testNotification()">${svg('bell',16)} Provo</button><button class="btn ghost sm" onclick="disableNotifications();closeSheet();openNotifs()">Çaktivizo</button>`
    : `<button class="btn primary sm" onclick="enableNotifications().then(function(){closeSheet();openNotifs();})">${svg('bell',16)} Aktivizo njoftimet</button>`;
  sheet(`
    <h3>Njoftime & Kujtesa</h3><div class="sub">Kujtesa strikte për skadimet</div>
    ${statusHtml}
    ${banner}
    <div class="row" style="gap:10px;margin-bottom:14px">${actions}</div>
    ${due.length?due.map(r=>`<div class="notif-item sev-${r.sev}" onclick="closeSheet();openDoc('${r.doc.id}')">
        <div class="ni-ic">${svg(r.days<0?'clock':'bell',18)}</div>
        <div class="ni-t"><b>${r.doc.title}</b><span>${r.days<0?'Skadoi më '+fmtDate(r.doc.expiry):(r.days===0?'Skadon sot':'Skadon pas '+r.days+' ditësh')} · ${fmtDate(r.doc.expiry)}</span></div>
        <span class="pill ${r.sev==='red'?'red':r.sev==='amber'?'amber':'blue'}">${r.days<0?'!':r.days+'d'}</span>
      </div>`).join(''):`<div class="empty" style="padding:24px"><div class="e-ic" style="color:var(--text-3)">${svg('check',28)}</div><b>Asnjë kujtesë aktive</b><p>Të gjitha dokumentet janë brenda afatit.</p></div>`}
    <button class="btn ghost mt" onclick="closeSheet()">Mbyll</button>
  `);
  if(typeof markNotifRead==='function') markNotifRead();
}