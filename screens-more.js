/* ============================================================
   SCREENS — Secure Sharing · QR · Security Center · Premium · Profile
   ============================================================ */

/* ---------- SECURE SHARING ---------- */
function openShare(id){
  const d=State.docs.find(x=>x.id===id);
  haptic();
  sheet(`
    <h3>${svg('share',18)} Ndarje e sigurt</h3><div class="sub">${d.title}</div>
    <div class="field"><label>Kohëzgjatja e lidhjes</label>
      <select class="input" id="sh_exp"><option value="1">1 orë</option><option value="24" selected>24 orë</option><option value="168">7 ditë</option><option value="0">Pa afat</option></select></div>
    <div class="list" style="margin:0 0 16px">
      <div class="lrow"><div class="lic">${svg('key',18)}</div><div class="lt"><b>Mbrojtje me fjalëkalim</b><span>Kërko kod për qasje</span></div><div class="switch on" id="sh_pw" onclick="this.classList.toggle('on')"><i></i></div></div>
      <div class="lrow"><div class="lic">${svg('download',18)}</div><div class="lt"><b>Lejo shkarkim</b><span>Marrësi mund ta ruajë</span></div><div class="switch" id="sh_dl" onclick="this.classList.toggle('on')"><i></i></div></div>
      <div class="lrow"><div class="lic">${svg('history',18)}</div><div class="lt"><b>Gjurmim qasjeje</b><span>Shiko kush e hapi</span></div><div class="switch on" onclick="this.classList.toggle('on')"><i></i></div></div>
    </div>
    <div class="row" style="gap:10px">
      <button class="btn primary" onclick="genShareLink('${id}')">${svg('share',18)} Krijo lidhje</button>
      <button class="btn ghost" style="max-width:56px" onclick="openQR('${id}')">${svg('qr',18)}</button>
    </div>
  `);
}
function genShareLink(id){
  const exp=$('#sh_exp').value;
  const token=uid()+uid();
  const link=`https://dokumentiim.app/s/${token}`;
  State.log('Krijim i lidhjes së ndarjes');
  const pw=$('#sh_pw').classList.contains('on');
  const pwCode=pw?Math.random().toString().slice(2,8):null;
  sheet(`
    <div class="center" style="padding:6px 0"><div class="lic" style="width:56px;height:56px;background:var(--grad-brand);color:#fff;border:none;margin:0 auto 14px;border-radius:18px">${svg('check',26)}</div>
    <h3>Lidhja u krijua</h3><div class="sub">${exp==='0'?'Pa afat':'Aktive për '+exp+' orë'}${pw?' · e mbrojtur':''}</div></div>
    <div class="card" style="padding:14px;margin:8px 0;display:flex;align-items:center;gap:10px">
      <span style="flex:1;font-size:12.5px;color:var(--accent-3);word-break:break-all">${link}</span>
      ${svg('lock',16)}</div>
    ${pw?`<div class="card" style="padding:14px;margin-bottom:8px;text-align:center"><span class="muted" style="font-size:12px">Fjalëkalimi</span><br><b style="font-size:22px;letter-spacing:.3em">${pwCode}</b></div>`:''}
    <button class="btn primary mt" onclick="copyText('${link}');toast('Lidhja u kopjua','share')">${svg('download',18)} Kopjo lidhjen</button>
    <button class="btn ghost mt" onclick="closeSheet()">U krye</button>
  `);
}
function copyText(t){if(navigator.clipboard)navigator.clipboard.writeText(t).catch(()=>{});}

/* ---------- QR ---------- */
function openQR(id){
  const d=State.docs.find(x=>x.id===id);
  const payload=`https://dokumentiim.app/verify/${id}?v=1&h=${uid()}`;
  sheet(`
    <h3>${svg('qr',18)} QR Verifikim</h3><div class="sub">${d.title}</div>
    <div id="qrbox"></div>
    <div class="list" style="margin:14px 0 8px">
      <div class="lrow"><div class="lic" style="color:var(--green)">${svg('check',18)}</div><div class="lt"><b>Autenticiteti</b><span>I verifikuar · origjinal</span></div><span class="pill green">Valid</span></div>
      <div class="lrow"><div class="lic">${svg('history',18)}</div><div class="lt"><b>Versioni</b><span>v1 · ${fmtDate(new Date().toISOString())}</span></div></div>
      <div class="lrow"><div class="lic">${svg('user',18)}</div><div class="lt"><b>Pronësia</b><span>${State.user.name}</span></div></div>
    </div>
    <p class="muted center" style="font-size:12px;margin-bottom:10px">Skano këtë QR për të verifikuar autenticitetin, versionin dhe pronësinë e dokumentit.</p>
    <button class="btn ghost" onclick="closeSheet()">Mbyll</button>
  `);
  setTimeout(()=>{const box=$('#qrbox');if(!box)return;box.innerHTML='';
    try{if(window.QRCode){new QRCode(box,{text:payload,width:168,height:168,colorDark:'#0A0B0F',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});}
    else box.innerHTML='<div style="color:#333;font-size:12px;text-align:center;padding:20px">QR u gjenerua<br>('+id.slice(0,8)+')</div>';}
    catch(e){box.innerHTML='<div style="color:#333;font-size:12px">QR: '+id.slice(0,8)+'</div>';}
  },120);
}

/* ---------- SECURITY CENTER ---------- */
Screens.security=(s)=>{
  const score=securityScore();const g=State.settings;
  const R=44,C=2*Math.PI*R,off=C*(1-score/100);
  s.innerHTML=`
  <div class="topbar">
    <button class="icon-btn" onclick="go('profile')">${svg('back',20)}</button>
    <div class="greet"><small>Mbrojtja jote</small><h2>Security Center</h2></div>
  </div>
  <div class="id-card" style="text-align:center;padding:28px 22px">
    <div class="shine"></div>
    <div class="ring" style="width:120px;height:120px;margin:0 auto 6px">
      <svg width="120" height="120"><circle cx="60" cy="60" r="${R}" stroke="rgba(255,255,255,.1)" stroke-width="9" fill="none"/>
      <circle cx="60" cy="60" r="${R}" stroke="url(#sg)" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" id="secRing" style="transition:stroke-dashoffset 1.3s cubic-bezier(.22,1,.36,1)"/>
      <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34D399"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs></svg>
      <div class="val"><b style="font-size:30px">${score}%</b><span>SIGURI</span></div>
    </div>
    <p style="color:var(--text-2);font-size:13.5px;margin-top:6px">${score>=95?'Vault-i yt është shumë i sigurt':score>=80?'Siguri e mirë — përmirëso disa cilësime':'Aktivizo më shumë mbrojtje'}</p>
  </div>
  <div class="section-h"><h3>Mbrojtja aktive</h3></div>
  <div class="list">
    ${secRow('face','Biometrikë (Face ID / Fingerprint)','Kyçje me identitet biermetrik','biometric')}
    ${secRow('lock','Enkriptim AES-256','Të dhënat ruhen të enkriptuara','encryption')}
    ${secRow('cloud','Backup i sigurt','Kopje rezervë e enkriptuar','backup')}
    ${secRow('clock','Kyçje automatike','Kyç pas mbylljes së app-it','autoLock')}
    ${secRow('bell','Njoftime sigurie','Alarm për qasje të pazakonta','notifications')}
  </div>
  <div class="card" style="margin:12px 20px 0;padding:14px 16px;display:flex;align-items:center;gap:12px">
    <div class="lic" style="color:var(--green)">${svg('key',18)}</div>
    <div style="flex:1"><b style="font-size:13.5px;font-weight:700">Çelësi i enkriptimit (AES-256-GCM)</b><br><span class="muted" style="font-size:11.5px;font-family:ui-monospace,monospace" id="encFp">po llogaritet…</span></div>
    <span class="pill green">Aktiv</span>
  </div>
  <div class="section-h"><h3>${svg('history',16)} Ditari i aktivitetit</h3></div>
  <div class="list">
    ${State.logs.slice(0,8).map(l=>`<div class="lrow"><div class="lic">${svg('history',16)}</div><div class="lt"><b style="font-size:13.5px">${l.action}</b><span>${timeAgo(l.ts)}</span></div></div>`).join('')||'<div class="lrow"><div class="lt"><span class="muted">Asnjë aktivitet ende</span></div></div>'}
  </div>
  <div class="pad mt2"><button class="btn ghost" onclick="changePin()">${svg('key',18)} Ndrysho PIN-in</button></div>
  <div style="height:20px"></div>`;
  requestAnimationFrame(()=>{const r=$('#secRing');if(r)r.style.strokeDashoffset=off;});
  if(typeof Vault!=='undefined')Vault.fingerprint().then(fp=>{const e=$('#encFp');if(e)e.textContent=fp;}).catch(()=>{});
};
function secRow(icon,title,sub,key){
  const on=State.settings[key];
  return `<div class="lrow"><div class="lic" style="${on?'color:var(--green)':''}">${svg(icon,18)}</div>
    <div class="lt"><b>${title}</b><span>${sub}</span></div>
    <div class="switch ${on?'on':''}" onclick="toggleSetting('${key}',this)"><i></i></div></div>`;
}
async function toggleSetting(key,elm){
  if(key==='biometric'){
    if(!State.settings.biometric){
      // enabling — enroll a real platform credential
      if(!(await Bio.ready())){
        toast(Bio.secureContext()?'Biometrika nuk disponohet në këtë pajisje':'Kërkon https ose localhost','lock');
        return;
      }
      try{
        const rawId=await Bio.register(State.user);
        State.user.bioCred=rawId;State.saveUser();
      }catch(e){ toast('Aktivizimi u anulua ose dështoi','lock'); return; }
    }else{
      // disabling — forget the credential locally
      State.user.bioCred=null;State.saveUser();
    }
  }
  if(key==='notifications'){
    if(!State.settings.notifications){ await enableNotifications(); }
    else{ disableNotifications(); }
    elm.classList.toggle('on', State.settings.notifications); haptic();
    const ring2=$('#secRing');if(ring2){const sc=securityScore();const R=44,C=2*Math.PI*R;ring2.style.strokeDashoffset=C*(1-sc/100);const v=$('.id-card .val b');if(v)v.textContent=sc+'%';}
    return;
  }
  State.settings[key]=!State.settings[key];State.saveSettings();elm.classList.toggle('on');haptic();
  State.log((State.settings[key]?'Aktivizuar':'Çaktivizuar')+': '+key);
  if(key==='biometric')toast(State.settings.biometric?'Biometrika u aktivizua':'Biometrika u çaktivizua','face');
  const ring=$('#secRing');if(ring){const score=securityScore();const R=44,C=2*Math.PI*R;ring.style.strokeDashoffset=C*(1-score/100);const v=$('.id-card .val b');if(v)v.textContent=score+'%';}
}
function changePin(){_pinBuf='';_pinFirst='';const host=$('#screens');host.innerHTML='';const sc=el('div','screen active');sc.id='scr-setpin';host.appendChild(sc);current='setpin';renderPinSetup(sc);}
function timeAgo(ts){const s=Math.floor((Date.now()-ts)/1000);if(s<60)return 'tani';if(s<3600)return Math.floor(s/60)+' min më parë';if(s<86400)return Math.floor(s/3600)+' orë më parë';return Math.floor(s/86400)+' ditë më parë';}

/* ---------- PREMIUM ---------- */
Screens.premium=(s)=>{
  const pro=State.settings.plan==='pro';
  s.innerHTML=`
  <div class="topbar">
    <button class="icon-btn" onclick="go('profile')">${svg('back',20)}</button>
    <div class="greet"><small>Zhblloko gjithçka</small><h2>Dokumenti Premium</h2></div>
  </div>
  <div class="center pad" style="margin:10px 0"><div class="titan" style="width:72px;height:72px;border-radius:22px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:var(--gold)">${svg('crown',34)}</div>
    <h1 style="font-size:24px;font-weight:800;letter-spacing:-.03em">Fuqia e plotë e identitetit tënd</h1>
    <p class="muted" style="font-size:14px;margin-top:8px">Pa limite. Me AI. I mbrojtur në cloud.</p></div>
  <div class="plan free">
    <h4>Free</h4><div class="price">0€ <small>/muaj</small></div>
    <ul>${['Deri në 15 dokumente','Skanim bazik','Kategori & kërkim','1 lidhje ndarjeje aktive'].map(f=>`<li>${svg('check',18)} ${f}</li>`).join('')}</ul>
    <button class="btn ghost sm" ${!pro?'disabled style="opacity:.6"':`onclick="setPlan('free')"`}>${!pro?'Plani aktual':'Kalo në Free'}</button>
  </div>
  <div class="plan pro"><span class="rec">Rekomanduar</span>
    <h4 style="color:var(--gold)">Premium</h4><div class="price">4.99€ <small>/muaj</small></div>
    <ul>${['Dokumente pa limit','AI Scanner + OCR i plotë','Backup automatik në cloud','Family Vault (deri 5 anëtarë)','Ndarje e avancuar & QR','100 GB storage'].map(f=>`<li>${svg('check',18)} ${f}</li>`).join('')}</ul>
    <button class="btn primary sm" onclick="setPlan('pro')">${pro?svg('check',16)+' Plani aktual':svg('crown',16)+' Bëhu Premium'}</button>
  </div>
  <p class="muted center" style="font-size:11.5px;padding:0 30px 20px">Anulo në çdo kohë. Të dhënat mbeten të tuat. Ky është demo — pa pagesë reale.</p>`;
};
function setPlan(p){State.settings.plan=p;State.saveSettings();haptic();toast(p==='pro'?'Mirë se erdhe në Premium':'Plani u ndryshua',p==='pro'?'crown':'check');go('premium');}

/* ---------- PROFILE ---------- */
Screens.profile=(s)=>{
  const u=State.user;const pro=State.settings.plan==='pro';
  s.innerHTML=`
  <div class="topbar"><div class="greet"><small>Llogaria jote</small><h2>Profili</h2></div></div>
  <div class="id-card" style="display:flex;align-items:center;gap:16px;padding:22px">
    <div class="shine"></div>
    <div class="avatar" style="width:64px;height:64px;border-radius:20px;font-size:26px">${u.name[0].toUpperCase()}</div>
    <div style="flex:1"><b style="font-size:19px;font-weight:800">${u.name}</b><br><span class="muted" style="font-size:13px">${u.email||u.city}</span><br>
    <span class="pill ${pro?'green':'blue'}" style="margin-top:8px;display:inline-flex;align-items:center;gap:5px">${pro?svg('crown',12,2.2)+' Premium':'Free'}</span></div>
  </div>
  <div class="hstat mt2">
    <div class="b"><b class="grad-txt">${State.docs.length}</b><span>Dokumente</span></div>
    <div class="b"><b class="grad-txt">${identityScore()}%</b><span>Identity Score</span></div>
  </div>
  <div class="section-h"><h3>Menaxho</h3></div>
  <div class="list">
    ${profRow('shield','Security Center','Siguria: '+securityScore()+'%',`go('security')`)}
    ${profRow('package','Paketa (Life Packs)','Grupime të zgjuara',`go('packs')`)}
    ${profRow('crown','Dokumenti Premium',pro?'Aktiv':'Zhblloko gjithçka',`go('premium')`)}
    ${profRow('bell','Njoftime & kujtesa','Menaxho alarmet',`openNotifs()`)}
    ${profRow('download','Eksporto të dhënat','Backup lokal JSON',`exportData()`)}
  </div>
  <div class="section-h"><h3>Rreth</h3></div>
  <div class="list">
    ${profRow('info','Dokumenti Im','v1.0 · BuiltByNiti',`toast('Ndërtuar në Kosovë','info')`)}
    ${profRow('user','Redakto profilin','Emri, qyteti, email',`editProfile()`)}
  </div>
  <div class="pad mt2"><button class="btn danger" onclick="logout()">${svg('logout',18)} Dil nga llogaria</button></div>
  <p class="muted center" style="font-size:11.5px;margin-top:16px">Dokumenti Im · Identiteti yt digjital<br>Ndërtuar nga BuiltByNiti</p>
  <div style="height:20px"></div>`;
};
function profRow(icon,title,sub,action){
  return `<div class="lrow" style="cursor:pointer" onclick="${action}"><div class="lic">${svg(icon,18)}</div>
    <div class="lt"><b>${title}</b><span>${sub}</span></div>${svg('chevron',18)}</div>`;
}
function editProfile(){
  const u=State.user;
  sheet(`<h3>Redakto profilin</h3><div class="sub">Përditëso të dhënat e tua.</div>
    <div class="field"><label>Emri</label><input class="input" id="ep_name" value="${u.name}"/></div>
    <div class="field"><label>Email</label><input class="input" id="ep_email" value="${u.email||''}"/></div>
    <div class="field"><label>Qyteti</label><input class="input" id="ep_city" value="${u.city||''}"/></div>
    <button class="btn primary" onclick="saveProfile()">Ruaj</button>
    <button class="btn ghost mt" onclick="closeSheet()">Anulo</button>`);
}
function saveProfile(){State.user.name=$('#ep_name').value.trim()||State.user.name;State.user.email=$('#ep_email').value.trim();State.user.city=$('#ep_city').value.trim();State.saveUser();closeSheet();toast('Profili u përditësua');go('profile');}
function exportData(){
  const data={user:{name:State.user.name,city:State.user.city},docs:State.docs,exported:new Date().toISOString()};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='dokumenti-im-backup.json';a.click();
  State.log('Eksport i të dhënave');toast('Backup u shkarkua','download');
}
function logout(){
  sheet(`<h3>Dil nga llogaria?</h3><div class="sub">Do të kyçesh sërish me PIN ose biometrikë.</div>
    <button class="btn danger" onclick="closeSheet();$('#nav').style.display='none';go('lock')">${svg('logout',18)} Dil</button>
    <button class="btn ghost mt" onclick="closeSheet()">Anulo</button>`);
}