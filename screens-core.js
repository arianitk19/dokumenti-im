/* ============================================================
   SCREENS — Onboarding · Auth · Lock · Dashboard
   ============================================================ */

/* ---------- ONBOARDING ---------- */
let obStep=0;
const OB=[
  {icon:'grid',title:'Mbaj çdo dokument të rëndësishëm në një vend.',text:'Identiteti, arsimi, puna, automjeti, shëndeti — të gjitha të organizuara, gjithmonë me ty.'},
  {icon:'sparkle',title:'Sistemi i organizon dokumentet automatikisht.',text:'Fotografo një dokument dhe sistemi njeh llojin, datën, institucionin dhe afatin brenda sekondash.'},
  {icon:'shield',title:'Identiteti yt mbrohet me sigurinë më moderne.',text:'Enkriptim AES-256, kyçje biometrike dhe QR verifikim. Dokumentet e tua nuk largohen kurrë pa lejen tënde.'},
];
Screens.onboard=(s)=>{
  s.classList.add('noscroll');
  const d=OB[obStep];
  s.innerHTML=`
  <div class="ob">
    <div class="art">
      <div class="titan" style="width:172px;height:172px;border-radius:40px;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow);color:var(--accent-3)">${svg(d.icon,66,1.6)}</div>
    </div>
    <div class="dots">${OB.map((_,i)=>`<i class="${i===obStep?'on':''}"></i>`).join('')}</div>
    <h1>${d.title}</h1>
    <p>${d.text}</p>
    <div style="margin-top:26px">
      <button class="btn primary" onclick="obNext()">${obStep<2?'Vazhdo':'Fillo tani'} ${svg('chevron',18)}</button>
      ${obStep<2?'<button class="btn ghost sm" style="margin-top:10px;width:auto;padding:10px 20px;margin-left:auto;margin-right:auto;background:none;border:none;color:var(--text-3)" onclick="obStep=2;go(\'onboard\')">Kalo</button>':''}
    </div>
  </div>`;
};
function obNext(){haptic();if(obStep<2){obStep++;go('onboard');}else{go('signup');}}

/* ---------- SIGNUP (professional, structured) ---------- */
Screens.signup=(s,data)=>{
  s.innerHTML=`
  <div class="auth">
    <div class="auth-top">
      <div class="brand-mark">${BRAND_MARK}</div>
      <div class="steps">
        <span class="stp on"><i>1</i>Llogaria</span>
        <span class="stp-line"></span>
        <span class="stp"><i>2</i>Siguria</span>
      </div>
    </div>
    <div class="auth-body">
      <h1>Krijo llogarinë</h1>
      <p class="auth-sub">Regjistrohu për të ndërtuar identitetin tënd digjital. Të dhënat ruhen të enkriptuara në pajisjen tënde.</p>

      <div class="fgroup">
        <div class="fgroup-h">Të dhënat personale</div>
        <div class="field"><label>Emri dhe mbiemri</label>
          <div class="input-wrap">${svg('user',18)}<input class="input has-ic" id="su_name" placeholder="Emri i plotë" value="${data?.name||''}" autocomplete="name"/></div></div>
        <div class="field"><label>Adresa e email-it</label>
          <div class="input-wrap">${svg('send',17)}<input class="input has-ic" id="su_email" type="email" placeholder="emri@shembull.com" autocomplete="email"/></div>
          <span class="ferr" id="err_email"></span></div>
        <div class="field"><label>Numri i telefonit <span class="opt">(opsional)</span></label>
          <div class="input-wrap">${svg('bell',17)}<input class="input has-ic" id="su_phone" type="tel" placeholder="+383 4x xxx xxx" autocomplete="tel"/></div></div>
      </div>

      <div class="fgroup">
        <div class="fgroup-h">Vendndodhja</div>
        <div class="field"><label>Qyteti / rajoni</label>
          <div class="input-wrap">${svg('cat_banimi',18)}<select class="input has-ic" id="su_city">
            <option>Prishtinë</option><option>Prizren</option><option>Pejë</option><option>Gjakovë</option><option>Mitrovicë</option><option>Ferizaj</option><option>Gjilan</option><option>Vushtrri</option><option>Podujevë</option><option>Tiranë</option><option>Shkup</option><option>Diasporë</option>
          </select></div></div>
      </div>

      <label class="consent"><input type="checkbox" id="su_terms" checked/><span>Pranoj që të dhënat ruhen të enkriptuara lokalisht dhe kushtet e përdorimit.</span></label>
    </div>
    <div class="auth-foot">
      <button class="btn primary" onclick="doSignup()">Vazhdo te siguria ${svg('chevron',18)}</button>
      <p class="foot-note">${svg('lock',13)} Enkriptim AES-256 · Asnjë e dhënë nuk del nga pajisja</p>
    </div>
  </div>`;
};
function doSignup(){
  const name=$('#su_name').value.trim();
  const email=$('#su_email').value.trim();
  const err=$('#err_email');
  if(!name||name.split(' ').filter(Boolean).length<2){toast('Shkruaj emrin dhe mbiemrin','info');return;}
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){if(err)err.textContent='Adresa e email-it nuk është e vlefshme.';toast('Email jo i vlefshëm','info');return;}
  if(!$('#su_terms').checked){toast('Prano kushtet për të vazhduar','info');return;}
  State.user={name,email,phone:$('#su_phone').value.trim(),city:$('#su_city').value,pin:null,created:Date.now()};
  State.saveUser();
  haptic();
  go('setpin');
}

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
    <h1 style="font-size:22px;font-weight:800">${_pinFirst?'Konfirmo PIN-in':'Krijo PIN-in tënd'}</h1>
    <p class="muted" style="font-size:14px;margin-top:6px;max-width:280px">${_pinFirst?'Shkruaj sërish për ta konfirmuar.':'4 shifra për të mbrojtur vault-in tënd digjital.'}</p>
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
    <h1 style="font-size:22px;font-weight:800">Aktivizo Face ID / Touch ID</h1>
    <p class="muted" style="font-size:14px;margin-top:8px;max-width:310px;line-height:1.5">Përdor identitetin biometrik të pajisjes tënde për ta hapur vault-in menjëherë dhe në mënyrë të sigurt. Verifikimi bëhet nga vetë pajisja.</p>
    <div id="bioNote" style="font-size:12.5px;margin-top:14px;color:var(--amber);min-height:16px;max-width:300px"></div>
    <div style="width:100%;max-width:330px;margin-top:26px">
      <button class="btn primary" id="bioEnableBtn" onclick="enableBioSetup()">${svg('face',18)} Aktivizo biometrikën</button>
      <button class="btn ghost mt" onclick="finishSecurity()">Jo tani — përdor vetëm PIN-in</button>
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
    <h1 style="font-size:22px;font-weight:800">Mirë se erdhe përsëri</h1>
    <p class="muted" style="font-size:14px;margin-top:6px">${State.user?.name?.split(' ')[0]||''} · ${hasBio?'Përdor Face ID ose shkruaj PIN-in':'Shkruaj PIN-in'}</p>
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
    <button class="icon-btn badge" data-badge="${expiring.filter(d=>daysUntil(d.expiry)<=30).length||''}" onclick="openNotifs()">${svg('bell',20)}</button>
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
    ${catKeys.map(k=>{const n=docs.filter(d=>d.cat===k).length;return `<button class="cat-chip" onclick="go('docs',{cat:'${k}'})"><div class="emo" style="color:${CATS[k].color}">${catIcon(k,24,1.8)}</div><b>${CATS[k].name}</b><span>${n} dokumente</span></button>`;}).join('')}
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
  const docs=State.docs.filter(d=>{const dd=daysUntil(d.expiry);return dd!=null&&dd<=120;}).sort((a,b)=>daysUntil(a.expiry)-daysUntil(b.expiry));
  sheet(`
    <h3>Njoftime & Kujtesa</h3><div class="sub">Sistem inteligjent kujtesash</div>
    ${docs.length?docs.map(d=>{const days=daysUntil(d.expiry);const cls=days<=30?'red':days<=90?'amber':'blue';
      return `<div class="exp-item" style="margin:0 0 10px" onclick="closeSheet();openDoc('${d.id}')">
        <div class="dot">${svg('bell',20)}</div>
        <div class="info"><b>${d.title}</b><span>${days<0?'Skadoi më '+fmtDate(d.expiry):CATS[d.cat].name+' skadon pas '+days+' ditësh'}</span></div>
        <span class="pill ${cls}">${days<0?'!':days+'d'}</span></div>`;}).join(''):'<p class="muted">Asnjë kujtesë aktive</p>'}
    <button class="btn ghost mt" onclick="closeSheet()">Mbyll</button>
  `);
}