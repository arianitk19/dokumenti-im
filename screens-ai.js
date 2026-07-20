/* ============================================================
   SCREENS — Dokumenti AI Assistant · Life Packs
   ============================================================ */

/* ---------- AI ENGINE (rule-based over user's docs) ---------- */
function aiAnswer(q){
  const t=q.toLowerCase();
  const docs=State.docs;
  const find=(...kw)=>docs.filter(d=>{const s=(d.title+' '+d.type+' '+(d.tags||[]).join(' ')+' '+d.cat).toLowerCase();return kw.some(k=>s.includes(k));});

  // expiry questions
  if(/(skad|afat|mbaron|vlen deri|rinovo)/.test(t)){
    let target=docs;
    if(/pasaport/.test(t))target=find('pasaport');
    else if(/letërnjoftim|leternjoftim|\bid\b|letern/.test(t))target=find('letërnjoftim','identitet');
    else if(/patent/.test(t))target=find('patent');
    else if(/sigurim/.test(t))target=find('sigurim');
    else if(/kontrat/.test(t))target=find('kontrat');
    target=target.filter(d=>d.expiry);
    if(!target.length)target=docs.filter(d=>d.expiry).sort((a,b)=>daysUntil(a.expiry)-daysUntil(b.expiry));
    if(!target.length)return 'Nuk gjeta dokumente me afat skadimi në vault-in tënd. Shto një dokument me datë skadimi që të të kujtoj automatikisht.';
    target=target.sort((a,b)=>daysUntil(a.expiry)-daysUntil(b.expiry)).slice(0,3);
    return target.map(d=>{const dd=daysUntil(d.expiry);return `${d.title}\n${dd<0?'Ka skaduar më '+fmtDate(d.expiry):'Skadon më '+fmtDate(d.expiry)+' — pas '+dd+' ditësh'+(dd<=30?'. Rekomandohet rinovim tani.':'.')}`;}).join('\n\n');
  }
  // where is X
  if(/(ku është|ku eshte|gjej|më gjej|kontrat|ku e kam|ku janë|ku jane)/.test(t)){
    let r=[];
    if(/kontrat.*pun|pun.*kontrat/.test(t))r=find('kontratë pune','pune');
    else if(/kontrat/.test(t))r=find('kontrat');
    else if(/diplom/.test(t))r=find('diplom');
    else if(/cv/.test(t))r=find('cv');
    else if(/pasaport/.test(t))r=find('pasaport');
    else if(/sigurim/.test(t))r=find('sigurim');
    else{for(const k of catKeys)if(t.includes(CATS[k].name.toLowerCase()))r=r.concat(find(k));}
    if(!r.length)return 'Nuk e gjeta atë dokument. Provo emrin e saktë, ose shfleto kategoritë te seksioni Dokumentet.';
    return 'Rezultatet:\n\n'+r.slice(0,4).map(d=>`•  ${d.title}\n   ${CATS[d.cat].name} · ${d.institution||'—'}`).join('\n\n')+'\n\nHap seksionin Dokumentet për ta parë.';
  }
  // what documents do I need for X
  if(/(çfarë|cfare|çka|cka|which|dokumente.*duhen|duhen.*dokumente|aplikim|udhëtim|udhetim|punësim|punesim)/.test(t)){
    if(/pun|cv|punësim|punesim|aplikim.*pun/.test(t))
      return 'Për aplikim pune zakonisht të duhen:\n\n•  CV e përditësuar\n•  Diplomë / certifikata\n•  Letërnjoftim ose pasaportë\n•  Referenca (opsionale)\n\nKëshillë: përdor "Paketa Punësim" te seksioni Paketa për t\'i grupuar dhe ndarë të gjitha njëherësh.';
    if(/udhëtim|udhetim|vizë|vize|aeroport|jashtë/.test(t))
      return 'Për udhëtim jashtë vendit të duhen:\n\n•  Pasaportë e vlefshme (kontrollo afatin)\n•  Sigurim shëndetësor udhëtimi\n•  Dokumente rezervimi (bileta, hotel)\n\nKëshillë: hap "Paketa Udhëtim" për qasje të shpejtë.';
    if(/makin|vetur|automjet/.test(t))
      return 'Për automjetin të duhen:\n\n•  Libreza e veturës\n•  Sigurim (TPL/Kasko)\n•  Kontroll teknik\n•  Patentë shoferi\n\nKëshillë: shiko "Paketa Automjet".';
    if(/biznes|kompani|arbk/.test(t))
      return 'Për biznes zakonisht të duhen:\n\n•  Certifikatë regjistrimi (ARBK)\n•  Numri fiskal / NIPT\n•  Licenca përkatëse\n•  Kontrata\n\nKëshillë: "Paketa Biznes" i mban të gatshme.';
  }
  // stats / overview
  if(/(sa dokument|totale|storage|hapësir|hapesir|score|identit)/.test(t))
    return `Përmbledhje e vault-it tënd:\n\n•  Dokumente: ${docs.length}\n•  Kategori aktive: ${new Set(docs.map(d=>d.cat)).size}/8\n•  Storage: ${fmtBytes(totalSize())}\n•  Digital Identity Score: ${identityScore()}%\n•  Skadojnë brenda 30 ditësh: ${docs.filter(d=>{const dd=daysUntil(d.expiry);return dd!=null&&dd<=30&&dd>=0;}).length}`;
  // categories
  for(const k of catKeys){if(t.includes(CATS[k].name.toLowerCase())){const r=find(k);return r.length?`Në kategorinë ${CATS[k].name} ke ${r.length} dokument(e):\n\n`+r.map(d=>'•  '+d.title).join('\n'):`Nuk ke ende dokumente te ${CATS[k].name}. Shtoji me skanim inteligjent.`;}}
  // greeting
  if(/(përshëndetje|pershendetje|tung|hi|hello|ç'kemi|si je)/.test(t))
    return `Përshëndetje. Jam asistenti yt personal. Mund të të ndihmoj me:\n\n•  Afatet e skadimit\n•  Gjetjen e dokumenteve\n•  Çfarë dokumentesh të duhen për një situatë\n•  Përmbledhje të vault-it`;
  return 'Mund të të ndihmoj me dokumentet e tua. Provo:\n\n• "Kur më skadon pasaporta?"\n• "Ku është kontrata ime e punës?"\n• "Çfarë dokumentesh më duhen për punësim?"\n• "Sa dokumente kam gjithsej?"';
}

let chatHistory=[];
Screens.ai=(s)=>{
  s.classList.add('noscroll');
  if(!chatHistory.length)chatHistory=[{who:'ai',text:`Përshëndetje ${State.user.name.split(' ')[0]}. Jam Dokumenti AI, asistenti yt personal. Pyetmë çdo gjë për dokumentet e tua.`}];
  s.innerHTML=`
  <div class="topbar" style="position:static">
    <div class="lic" style="background:var(--grad-brand);color:#fff;width:42px;height:42px;border:none">${svg('sparkle',22)}</div>
    <div class="greet"><small style="color:var(--green)">● Online</small><h2 style="font-size:18px">Dokumenti AI</h2></div>
    <div class="spacer"></div>
    <button class="icon-btn" onclick="chatHistory=[];go('ai')">${svg('edit',18)}</button>
  </div>
  <div class="chat" id="chat"></div>
  <div class="chips" id="chatChips">
    ${['Kur më skadon pasaporta?','Ku është kontrata ime?','Çfarë më duhet për punësim?','Sa dokumente kam?'].map(c=>`<button onclick="askAI('${c}')">${c}</button>`).join('')}
  </div>
  <div class="chat-input">
    <input id="chatBox" placeholder="Shkruaj pyetjen tënde…" onkeydown="if(event.key==='Enter')askAI()"/>
    <button onclick="askAI()">${svg('send',20)}</button>
  </div>`;
  renderChat();
};
function renderChat(){
  const c=$('#chat');if(!c)return;
  c.innerHTML=chatHistory.map(m=>m.who==='ai'
    ?`<div class="msg ai"><div class="mh">${svg('sparkle',13)} Dokumenti AI</div>${m.text}</div>`
    :`<div class="msg me">${m.text}</div>`).join('');
  c.scrollTop=c.scrollHeight;
}
function askAI(preset){
  const box=$('#chatBox');
  const q=preset||(box?box.value.trim():'');
  if(!q)return;
  if(box)box.value='';
  chatHistory.push({who:'me',text:q});
  renderChat();
  const c=$('#chat');
  const typing=el('div','msg ai','<div class="typing"><i></i><i></i><i></i></div>');
  c.appendChild(typing);c.scrollTop=c.scrollHeight;
  const chips=$('#chatChips');if(chips)chips.style.display='none';
  setTimeout(()=>{
    typing.remove();
    const a=aiAnswer(q);
    chatHistory.push({who:'ai',text:a});
    renderChat();
  },700+Math.random()*500);
}

/* ---------- LIFE PACKS ---------- */
const PACKS=[
  {id:'punesim',name:'Paketa Punësim',icon:'cat_pune',color:'#22D3EE',desc:'Gati për çdo aplikim pune',need:[['CV','pune'],['Diplomë','arsim'],['Certifikatë','arsim'],['Letërnjoftim','identitet']]},
  {id:'udhetim',name:'Paketa Udhëtim',icon:'globe',color:'#3B82F6',desc:'Dokumentet për çdo udhëtim',need:[['Pasaportë','identitet'],['Sigurim','automjet'],['Rezervim','banimi']]},
  {id:'automjet',name:'Paketa Automjet',icon:'cat_automjet',color:'#F59E0B',desc:'Të gjitha dokumentet e makinës',need:[['Libreza','automjet'],['Sigurim','automjet'],['Kontroll teknik','automjet'],['Patentë','automjet']]},
  {id:'biznes',name:'Paketa Biznes',icon:'cat_biznes',color:'#6366F1',desc:'Dokumentet profesionale',need:[['Kontratë','pune'],['Licencë','biznes'],['ARBK','biznes'],['Diplomë','arsim']]},
];
function packMatch(need){
  return need.map(([label,cat])=>{
    const has=State.docs.find(d=>d.cat===cat&&(d.type.toLowerCase().includes(label.toLowerCase())||d.title.toLowerCase().includes(label.toLowerCase())));
    return {label,has:!!has,doc:has};
  });
}
Screens.packs=(s)=>{
  s.innerHTML=`
  <div class="topbar">
    <button class="icon-btn" onclick="go('profile')">${svg('back',20)}</button>
    <div class="greet"><small>Situata reale</small><h2>Paketa</h2></div>
  </div>
  <p class="muted pad" style="font-size:13.5px;margin-bottom:8px">Grupime të zgjuara dokumentesh për momentet që kanë rëndësi. Ndaji të gjitha njëherësh.</p>
  <div style="margin-top:8px">
  ${PACKS.map(p=>{const m=packMatch(p.need);const have=m.filter(x=>x.has).length;const pct=Math.round(have/m.length*100);
    return `<div class="pack">
      <div class="hd"><div class="emo" style="background:${p.color}1f;border:1px solid ${p.color}3a;color:${p.color}">${svg(p.icon,22,1.8)}</div><div style="flex:1"><h4>${p.name}</h4><p>${p.desc}</p></div>
      <span class="pill ${pct===100?'green':pct>=50?'amber':'red'}">${have}/${m.length}</span></div>
      <div class="items">${m.map(x=>`<span class="tag ${x.has?'have':'miss'}">${x.has?svg('check',13,2.4):svg('plus',13,2.2)} ${x.label}</span>`).join('')}</div>
      <div class="pbar"><i style="width:${pct}%"></i></div>
      <button class="btn ${pct===100?'primary':'ghost'} sm mt" onclick="${pct===100?`sharePack('${p.id}')`:`toast('Të mungojnë disa dokumente për këtë paketë','package')`}">${pct===100?svg('share',16)+' Ndaj paketën':'Kompleto paketën'}</button>
    </div>`;}).join('')}
  </div>
  <div style="height:20px"></div>`;
};
function sharePack(id){
  const p=PACKS.find(x=>x.id===id);
  haptic();
  sheet(`<h3>${p.name}</h3><div class="sub">Lidhje e sigurt për të gjitha dokumentet e paketës.</div>
   <div class="card" style="padding:16px;margin-bottom:14px"><div class="row"><div class="lic">${svg('lock',18)}</div><div class="lt" style="flex:1"><b>Lidhje e mbrojtur</b><span>Skadon pas 24 orësh · fjalëkalim aktiv</span></div></div></div>
   <button class="btn primary" onclick="closeSheet();toast('Lidhja e paketës u kopjua','share')">${svg('share',18)} Kopjo lidhjen</button>
   <button class="btn ghost mt" onclick="closeSheet()">Mbyll</button>`);
}
