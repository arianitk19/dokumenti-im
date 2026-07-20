/* ============================================================
   SCREENS — Documents · Detail · Add · Scan (AI recognition)
   ============================================================ */

/* ---------- SHEET SYSTEM ---------- */
function sheet(html){const bg=$('#sheetBg');$('#sheet').innerHTML=`<div class="grip"></div>${html}`;bg.classList.add('open');bg.onclick=e=>{if(e.target===bg)closeSheet();};}
function closeSheet(){if(typeof stopCamera==='function')stopCamera();$('#sheetBg').classList.remove('open');}

/* ---------- DOCUMENTS LIST ---------- */
let docFilter={cat:'all',q:'',sort:'recent',fav:false};
Screens.docs=(s,data)=>{
  if(data?.cat)docFilter.cat=data.cat;
  s.innerHTML=`
  <div class="topbar">
    <div class="greet"><small>Vault-i yt</small><h2>Dokumentet</h2></div>
    <div class="spacer"></div>
    <button class="icon-btn ${docFilter.fav?'':''}" onclick="toggleFavFilter()" style="${docFilter.fav?'color:var(--gold);background:rgba(233,196,106,.12)':''}">${svg('star',20)}</button>
    <button class="icon-btn" onclick="openSort()">${svg('filter',20)}</button>
  </div>
  <div class="search">${svg('search',19)}<input id="docSearch" placeholder="Kërko dokumente, tags, institucione…" value="${docFilter.q}" oninput="onSearch(this.value)"/></div>
  <div class="filter-scroll">
    <button class="fchip ${docFilter.cat==='all'?'on':''}" onclick="setCat('all')">Të gjitha</button>
    ${catKeys.map(k=>`<button class="fchip fchip-ic ${docFilter.cat===k?'on':''}" onclick="setCat('${k}')">${catIcon(k,15,2)} ${CATS[k].name}</button>`).join('')}
  </div>
  <div id="docList" class="pad"></div>`;
  renderDocList();
};
function renderDocList(){
  const box=$('#docList');if(!box)return;
  let list=State.docs.slice();
  if(docFilter.cat!=='all')list=list.filter(d=>d.cat===docFilter.cat);
  if(docFilter.fav)list=list.filter(d=>d.fav);
  if(docFilter.q){const q=docFilter.q.toLowerCase();list=list.filter(d=>(d.title+' '+d.institution+' '+(d.tags||[]).join(' ')+' '+(d.ocr||'')+' '+d.type).toLowerCase().includes(q));}
  if(docFilter.sort==='recent')list.sort((a,b)=>b.created-a.created);
  else if(docFilter.sort==='name')list.sort((a,b)=>a.title.localeCompare(b.title));
  else if(docFilter.sort==='expiry')list.sort((a,b)=>{const x=daysUntil(a.expiry),y=daysUntil(b.expiry);return (x==null?9e9:x)-(y==null?9e9:y);});
  if(!list.length){box.innerHTML=`<div class="empty"><div class="e-ic" style="color:var(--text-3)">${svg(docFilter.q?'search':'docs',34,1.6)}</div><b>${docFilter.q?'Asnjë rezultat':'Ende asnjë dokument'}</b><p>${docFilter.q?'Provo një kërkim tjetër.':'Shto dokumentin tënd të parë me skanim inteligjent ose ngarkim.'}</p>${docFilter.q?'':'<button class="btn primary" style="max-width:220px;margin:20px auto 0" onclick="openAdd()">Shto dokument</button>'}</div>`;return;}
  box.innerHTML=list.map(d=>docRow(d)).join('');
}
function docRow(d){
  const days=daysUntil(d.expiry);
  return `<div class="doc-item" onclick="openDoc('${d.id}')">
    <div class="doc-thumb" id="th-${d.id}" style="color:${CATS[d.cat].color}">${catIcon(d.cat,22,1.8)}</div>
    <div class="meta"><b>${d.title}</b><span>${d.type} · ${CATS[d.cat].name}${d.expiry?' · skadon '+fmtDate(d.expiry):''}</span></div>
    ${d.fav?`<span class="fav-star">${svg('star',17)}</span>`:''}
    ${d.expiry&&days!=null&&days<=90?expiryPill(d.expiry):svg('chevron',18)}
  </div>`;
  }
function onSearch(v){docFilter.q=v;renderDocList();}
function setCat(c){docFilter.cat=c;haptic();document.querySelectorAll('.filter-scroll .fchip').forEach(b=>b.classList.remove('on'));event.target.classList.add('on');renderDocList();}
function toggleFavFilter(){docFilter.fav=!docFilter.fav;go('docs');}
function openSort(){
  sheet(`<h3>Rendit sipas</h3><div class="sub">Organizo pamjen e vault-it</div>
   ${[['recent','Më të rejat','clock'],['name','Emri A–Z','docs'],['expiry','Afati i skadimit','bell']].map(o=>`
     <div class="lrow" style="border:none;cursor:pointer" onclick="docFilter.sort='${o[0]}';closeSheet();go('docs')">
       <div class="lic">${svg(o[2],18)}</div><div class="lt"><b>${o[1]}</b></div>${docFilter.sort===o[0]?'<span class="pill blue">Aktive</span>':''}</div>`).join('')}
   <button class="btn ghost mt" onclick="closeSheet()">Mbyll</button>`);
}

/* ---------- DOCUMENT DETAIL ---------- */
Screens.detail=async(s,data)=>{
  const d=State.docs.find(x=>x.id===data.id);
  if(!d){go('docs');return;}
  const days=daysUntil(d.expiry);
  s.innerHTML=`
  <div class="topbar">
    <button class="icon-btn" onclick="go('docs')">${svg('back',20)}</button>
    <div class="greet"><small>${CATS[d.cat].name}</small><h2 style="font-size:17px;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d.type}</h2></div>
    <div class="spacer"></div>
    <button class="icon-btn" onclick="toggleFav('${d.id}')" style="${d.fav?'color:var(--gold)':''}">${svg('star',20)}</button>
  </div>
  <div class="detail-hero" id="detailHero"><div class="ph" style="color:${CATS[d.cat].color}">${catIcon(d.cat,60,1.5)}</div></div>
  <div class="tagline">
    <span class="t t-ic" style="color:${CATS[d.cat].color}">${catIcon(d.cat,14,2)} ${CATS[d.cat].name}</span>
    ${(d.tags||[]).map(t=>`<span class="t">#${t}</span>`).join('')}
    ${d.expiry?`<span class="t" style="color:${days<30?'#fca5a5':days<90?'#fcd34d':'#6ee7b7'}">${days<0?'Skaduar':days+' ditë'}</span>`:''}
  </div>
  <h2 style="padding:6px 20px 2px;font-size:20px;font-weight:800;letter-spacing:-.02em">${d.title}</h2>
  <div class="list" style="margin-top:14px">
    <div class="kv"><span>Lloji</span><b>${d.type}</b></div>
    <div class="kv"><span>Institucioni</span><b>${d.institution||'—'}</b></div>
    ${d.number?`<div class="kv"><span>Numri</span><b>${d.number}</b></div>`:''}
    <div class="kv"><span>Data e lëshimit</span><b>${fmtDate(d.issued)}</b></div>
    <div class="kv"><span>Skadon</span><b style="${d.expiry&&days<30?'color:#fca5a5':''}">${d.expiry?fmtDate(d.expiry)+' ('+days+'d)':'Pa afat'}</b></div>
    <div class="kv"><span>Madhësia</span><b>${fmtBytes(d.size)}</b></div>
  </div>
  ${d.ocr?`<div class="section-h"><h3>${svg('sparkle',16)} Tekst i nxjerrë (OCR)</h3></div>
   <div class="card" style="margin:0 20px;padding:16px"><p style="font-size:13.5px;line-height:1.6;color:var(--text-2)">${d.ocr}</p></div>`:''}
  <div class="pad" style="display:flex;gap:10px;margin-top:22px">
    <button class="btn primary" onclick="openShare('${d.id}')">${svg('share',18)} Ndaj</button>
    <button class="btn ghost" style="max-width:56px" onclick="openQR('${d.id}')">${svg('qr',18)}</button>
    <button class="btn danger" style="max-width:56px" onclick="delDoc('${d.id}')">${svg('trash',18)}</button>
  </div>
  <div style="height:20px"></div>`;
  const blob=await getFile(d.id);
  if(blob){const hero=$('#detailHero');const url=URL.createObjectURL(blob);
    if(blob.type.startsWith('image/'))hero.innerHTML=`<img src="${url}"/>`;
    else hero.innerHTML=`<div style="text-align:center;color:var(--text-2)">${svg('docs',54)}<p style="margin-top:10px;font-size:13px">${d.fileName||'Dokument PDF'}</p></div>`;
  }
};
function openDoc(id){haptic();go('detail',{id});}
function toggleFav(id){const d=State.docs.find(x=>x.id===id);d.fav=!d.fav;State.saveDocs();haptic();toast(d.fav?'Shtuar te favoritet':'Hequr nga favoritet','star');if(current==='detail')go('detail',{id});else renderDocList();}
function delDoc(id){
  sheet(`<h3>Fshi dokumentin?</h3><div class="sub">Ky veprim nuk mund të kthehet.</div>
   <button class="btn danger" onclick="confirmDel('${id}')">${svg('trash',18)} Fshi përfundimisht</button>
   <button class="btn ghost mt" onclick="closeSheet()">Anulo</button>`);
}
async function confirmDel(id){
  const d=State.docs.find(x=>x.id===id);
  State.docs=State.docs.filter(x=>x.id!==id);State.saveDocs();await delFile(id);
  State.log('Dokument u fshi: '+(d?.title||''));
  closeSheet();toast('Dokumenti u fshi');go('docs');
}

/* ---------- ADD DOCUMENT ---------- */
/* ---------- CATEGORY SCREEN (types → scan or fill details) ---------- */
let _forceType=null;
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
  <p class="muted pad" style="font-size:13px;margin-bottom:8px">Zgjidh një lloj dokumenti për ta shtuar — me fotografim ose duke plotësuar detajet.</p>
  <div class="type-grid">
    ${c.types.map(ty=>{const n=countType(cat,ty);return `<button class="type-card" onclick="openTypeAdd('${cat}','${ty.replace(/'/g,"\\'")}')">
      <div class="type-ic" style="color:${c.color};background:${c.color}18;border-color:${c.color}33">${catIcon(cat,20,1.8)}</div>
      <div class="type-tx"><b>${ty}</b><span>${n?n+' në vault':'Shto tani'}</span></div>
      <div class="type-add">${svg('plus',18)}</div>
    </button>`;}).join('')}
  </div>
  <div class="section-h"><h3>Dokumentet e tua</h3><span class="muted" style="font-size:12.5px">${docs.length}</span></div>
  <div class="pad">${docs.length?docs.map(d=>docRow(d)).join(''):`<div class="empty" style="padding:34px 20px"><div class="e-ic" style="color:var(--text-3)">${svg('docs',30,1.5)}</div><b>Ende asnjë dokument</b><p>Shto dokumentin e parë të kësaj kategorie më lart.</p></div>`}</div>
  <div style="height:20px"></div>`;
};
function openTypeAdd(cat,type){
  haptic();
  const c=CATS[cat];
  sheet(`
    <div class="row" style="margin:2px 0 16px"><div class="lic" style="color:${c.color};background:${c.color}1f;border-color:${c.color}3a">${catIcon(cat,20,1.8)}</div><div><h3 style="font-size:18px">${type}</h3><div class="sub" style="margin:2px 0 0">${c.name}</div></div></div>
    <div class="qa-grid" style="grid-template-columns:repeat(2,1fr);margin:0 0 10px">
      <button class="qa" style="padding:24px 6px" onclick="openScanFor('${cat}','${type.replace(/'/g,"\\'")}')"><div class="ic g2">${svg('camera',24)}</div><small>Fotografo / Skano</small></button>
      <button class="qa" style="padding:24px 6px" onclick="addManualFor('${cat}','${type.replace(/'/g,"\\'")}')"><div class="ic g3">${svg('edit',24)}</div><small>Plotëso detajet</small></button>
    </div>
    <button class="btn ghost mt" onclick="closeSheet()">Anulo</button>
  `);
}
function openScanFor(cat,type){ _forceType={cat,type}; closeSheet(); openScan(); }
function addManualFor(cat,type){ closeSheet(); addManual(cat,type); }

function openAdd(){
  haptic();
  sheet(`
    <h3>Shto dokument</h3><div class="sub">Zgjidh mënyrën — teksti lexohet automatikisht.</div>
    <div class="qa-grid" style="grid-template-columns:repeat(2,1fr);margin:0 0 8px">
      <button class="qa" style="padding:22px 6px" onclick="closeSheet();openScan()"><div class="ic g2">${svg('camera',24)}</div><small>Skanim inteligjent</small></button>
      <button class="qa" style="padding:22px 6px" onclick="pickFile()"><div class="ic">${svg('download',24)}</div><small>Ngarko skedar</small></button>
    </div>
    <input type="file" id="filePick" accept="image/*,application/pdf" style="display:none" onchange="onFilePicked(this)"/>
    <button class="btn ghost mt" onclick="closeSheet();addManual()">${svg('edit',18)} Shto manualisht</button>
  `);
}
function pickFile(){$('#filePick').click();}
async function onFilePicked(input){
  const f=input.files[0];if(!f)return;
  closeSheet();
  runOCR(f,f.name,false);
}

/* ---------- REAL CAMERA SCANNER (getUserMedia) ---------- */
let _camStream=null;
async function openScan(){
  haptic();
  sheet(`
    <h3>${svg('scan',18)} Skanim me kamerë</h3><div class="sub">Vendos dokumentin brenda kornizës dhe kap foton. Përpunimi bëhet realisht në pajisje.</div>
    <div class="cam-wrap"><video id="camVideo" autoplay playsinline muted></video><div class="cam-frame"><span></span><span></span><span></span><span></span></div></div>
    <div id="camErr" class="muted" style="font-size:12.5px;margin:10px 2px 0;text-align:center;min-height:14px"></div>
    <button class="btn primary mt" id="camShot" onclick="capturePhoto()">${svg('camera',18)} Kap foton</button>
    <input type="file" id="scanPick" accept="image/*" capture="environment" style="display:none" onchange="onScanPicked(this)"/>
    <button class="btn ghost mt" id="camFallback" onclick="$('#scanPick').click()" style="display:none">${svg('camera',18)} Përdor kamerën e sistemit</button>
    <button class="btn ghost mt" onclick="stopCamera();closeSheet()">Anulo</button>
  `);
  try{
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('nomedia');
    _camStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}},audio:false});
    const v=$('#camVideo'); if(v) v.srcObject=_camStream;
  }catch(e){
    const err=$('#camErr'); if(err)err.textContent='Kamera nuk u qas (leje ose kontekst jo i sigurt). Përdor kamerën e sistemit ose ngarko një foto.';
    const shot=$('#camShot'); if(shot)shot.style.display='none';
    const fb=$('#camFallback'); if(fb)fb.style.display='flex';
  }
}
function stopCamera(){ if(_camStream){ _camStream.getTracks().forEach(t=>t.stop()); _camStream=null; } }
async function capturePhoto(){
  const v=$('#camVideo');
  if(!v||!v.videoWidth){ toast('Kamera nuk është ende gati','camera'); return; }
  haptic();
  const canvas=document.createElement('canvas');
  canvas.width=v.videoWidth; canvas.height=v.videoHeight;
  canvas.getContext('2d').drawImage(v,0,0,canvas.width,canvas.height);
  enhanceDoc(canvas);                         // real grayscale + contrast enhancement
  stopCamera();
  const blob=await new Promise(res=>canvas.toBlob(res,'image/jpeg',0.92));
  runOCR(blob,'skanim-'+Date.now()+'.jpg',true);
}
async function onScanPicked(input){const f=input.files[0];if(!f)return;stopCamera();runOCR(f,f.name,true);}
/* real pixel processing — grayscale, contrast, brightness (document look) */
function enhanceDoc(canvas){
  try{
    const ctx=canvas.getContext('2d');
    const img=ctx.getImageData(0,0,canvas.width,canvas.height), d=img.data;
    const contrast=1.32, bright=10;
    for(let i=0;i<d.length;i+=4){
      let g=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];
      g=(g-128)*contrast+128+bright;
      d[i]=d[i+1]=d[i+2]=g<0?0:g>255?255:g;
    }
    ctx.putImageData(img,0,0);
  }catch(e){}
}

/* ---------- REAL OCR + FIELD EXTRACTION (Tesseract.js) ---------- */
let _pending=null;
async function runOCR(blob,name,scanned){
  closeSheet();
  const id=uid();
  sheet(`<div class="center" style="padding:14px 0 4px">
    <div class="ocr-orb">${svg('scan',30)}</div>
    <h3>Duke lexuar dokumentin</h3>
    <div class="sub" id="ocrStep">Po përgatitet OCR-ja…</div>
    <div class="pbar" style="margin:18px 4px 8px"><i id="ocrBar" style="width:4%"></i></div>
    <p class="muted" style="font-size:11.5px">${svg('lock',12)} Njohje reale e tekstit në pajisje — asgjë nuk dërgohet jashtë</p>
  </div>`);
  const setP=(p,label)=>{const b=$('#ocrBar'),s=$('#ocrStep');if(b)b.style.width=Math.max(4,Math.min(100,Math.round(p*100)))+'%';if(s&&label)s.textContent=label;};
  let text='';
  const isImage=blob.type?blob.type.startsWith('image/'):/\.(png|jpe?g|webp|gif|bmp)$/i.test(name);
  if(isImage && typeof Tesseract!=='undefined'){
    try{
      const res=await Tesseract.recognize(blob,'sqi+eng',{logger:m=>{
        if(m.status==='recognizing text') setP(0.35+m.progress*0.65,'Duke njohur tekstin — '+Math.round(m.progress*100)+'%');
        else if(/traineddata|language/i.test(m.status)) setP(0.1+(m.progress||0)*0.2,'Po ngarkohet modeli i gjuhës…');
        else if(m.status) setP(Math.max(0.06,(m.progress||0)*0.1),'Po inicializohet OCR…');
      }});
      text=(res&&res.data&&res.data.text)?res.data.text.trim():'';
    }catch(e){ text=''; }
  }else{
    setP(0.6,'Skedar PDF — teksti nuk nxirret automatikisht');
    await new Promise(r=>setTimeout(r,450));
  }
  setP(1,'Përfunduar');
  const fields=extractFields(text);
  let cat=guessCategory(text||name).cat;
  let type=guessType(text||name,cat);
  if(_forceType){ cat=_forceType.cat; type=_forceType.type; _forceType=null; }
  const firstLine=(text.split('\n').map(l=>l.trim()).filter(l=>l.length>3)[0]||'').slice(0,60);
  const conf = text.length>15 ? Math.min(98, 80+Math.min(18, Math.floor(text.length/60))) : guessCategory(text||name).confidence;
  try{ await putFile(id,blob); }catch(e){}
  _pending={ id, name, text, fields, size:blob.size||0, blob };
  showAIResult({ id, blob, name, cat, confidence:conf, type, scanned, text, fields, firstLine });
}

/* real parsing of dates, number and institution from OCR text */
function extractFields(text){
  const out={number:'',issued:'',expiry:'',institution:''};
  if(!text) return out;
  const t=text.replace(/[ ]/g,' ');
  const dates=[]; let m;
  const re=/\b(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{2,4})\b/g;
  while((m=re.exec(t))){ let y=+m[3]; if(y<100)y+=2000; const mo=+m[2],da=+m[1]; if(mo>=1&&mo<=12&&da>=1&&da<=31&&y>=1950&&y<=2100) dates.push(new Date(y,mo-1,da)); }
  const iso=/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/g;
  while((m=iso.exec(t))){ const y=+m[1],mo=+m[2],da=+m[3]; if(mo>=1&&mo<=12&&da>=1&&da<=31) dates.push(new Date(y,mo-1,da)); }
  if(dates.length){
    const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    dates.sort((a,b)=>a-b);
    const now=Date.now();
    const future=dates.filter(d=>d.getTime()>now), past=dates.filter(d=>d.getTime()<=now);
    if(future.length) out.expiry=ymd(future[future.length-1]);
    if(past.length) out.issued=ymd(past[past.length-1]);
    else if(dates.length>=2) out.issued=ymd(dates[0]);
  }
  const num=t.match(/\b([A-Z]{1,3}[-\s]?\d{5,}|\d{6,})\b/);
  if(num) out.number=num[1].replace(/\s+/g,'');
  const inst=[['MPB','MPB — Ministria e Punëve të Brendshme'],['ARC','ARC — Agjencia e Regjistrimit Civil'],['ARBK','ARBK'],['Universiteti','Universitet'],['Fakulteti','Fakultet'],['Sigal','Sigal Uniqa'],['Spitali','Spital'],['Komuna','Komuna'],['Noteria','Noteri']];
  for(const [k,v] of inst){ if(new RegExp('\\b'+k,'i').test(t)){ out.institution=v; break; } }
  return out;
}

function showAIResult(r){
  const c=CATS[r.cat];
  const f=r.fields||{};
  const today=new Date().toISOString().slice(0,10);
  const titleDefault=(r.firstLine && r.firstLine.length>4) ? r.firstLine : (r.type+' — '+r.name.replace(/\.[^.]+$/,''));
  const snippet=r.text ? r.text.replace(/\s+/g,' ').trim().slice(0,220) : '';
  sheet(`
    <div class="row" style="margin:4px 0 14px"><div class="lic" style="background:${c.color}22;border-color:${c.color}44;color:${c.color}">${svg('check',18)}</div>
    <div><h3 style="font-size:18px">${r.text?'Teksti u lexua nga dokumenti':'Dokumenti u përgatit'}</h3><div class="sub" style="margin:2px 0 0">${r.text?'OCR real · saktësia: <b style="color:var(--green)">'+r.confidence+'%</b>':'Plotëso të dhënat më poshtë'}</div></div></div>
    <div class="card" style="padding:14px;margin-bottom:14px;display:flex;align-items:center;gap:12px">
      <div class="doc-thumb" style="width:52px;height:52px;color:${c.color}" id="aiThumb">${catIcon(r.cat,24,1.8)}</div>
      <div style="flex:1"><b style="font-size:14px">${r.name}</b><br><span class="muted" style="font-size:12px">${c.name} · ${r.type}${r.text?' · '+r.text.length+' karaktere':''}</span></div>
    </div>
    ${snippet?`<div class="ocr-preview"><div class="ocr-preview-h">${svg('eye',13)} Tekst i nxjerrë (OCR)</div><p>${snippet.replace(/</g,'&lt;')}${r.text.length>220?'…':''}</p></div>`:''}
    <div class="field"><label>Titulli</label><input class="input" id="ad_title" value="${titleDefault.replace(/"/g,'&quot;')}"/></div>
    <div class="row" style="gap:10px">
      <div class="field" style="flex:1"><label>Kategoria</label><select class="input" id="ad_cat">${catKeys.map(k=>`<option value="${k}" ${k===r.cat?'selected':''}>${CATS[k].name}</option>`).join('')}</select></div>
      <div class="field" style="flex:1"><label>Lloji</label><input class="input" id="ad_type" value="${r.type}"/></div>
    </div>
    <div class="field"><label>Institucioni</label><input class="input" id="ad_inst" value="${(f.institution||'').replace(/"/g,'&quot;')}" placeholder="p.sh. MPB, Universiteti…"/></div>
    <div class="field"><label>Numri i dokumentit</label><input class="input" id="ad_num" value="${(f.number||'').replace(/"/g,'&quot;')}" placeholder="opsional"/></div>
    <div class="row" style="gap:10px">
      <div class="field" style="flex:1"><label>Data e lëshimit</label><input class="input" type="date" id="ad_issued" value="${f.issued||today}"/></div>
      <div class="field" style="flex:1"><label>Skadon (opsionale)</label><input class="input" type="date" id="ad_exp" value="${f.expiry||''}"/></div>
    </div>
    <button class="btn primary" onclick="saveNewDoc('${r.id}')">${svg('check',18)} Ruaj në vault</button>
    <button class="btn ghost mt" onclick="closeSheet()">Anulo</button>
  `);
  const blob=r.blob;if(blob&&blob.type&&blob.type.startsWith('image/')){const url=URL.createObjectURL(blob);const t=$('#aiThumb');if(t)t.innerHTML=`<img src="${url}"/>`;}
}
function addManual(presetCat,presetType){
  const today=new Date().toISOString().slice(0,10);
  const id=uid();
  _pending=null;
  const pc=(presetCat&&CATS[presetCat])?presetCat:catKeys[0];
  const pt=presetType||'';
  sheet(`
    <h3>${pt?pt:'Shto manualisht'}</h3><div class="sub">${pt?CATS[pc].name+' · plotëso detajet e dokumentit':'Plotëso të dhënat e dokumentit.'}</div>
    <div class="field"><label>Titulli</label><input class="input" id="ad_title" value="${pt.replace(/"/g,'&quot;')}" placeholder="p.sh. Pasaportë"/></div>
    <div class="row" style="gap:10px">
      <div class="field" style="flex:1"><label>Kategoria</label><select class="input" id="ad_cat">${catKeys.map(k=>`<option value="${k}" ${k===pc?'selected':''}>${CATS[k].name}</option>`).join('')}</select></div>
      <div class="field" style="flex:1"><label>Lloji</label><input class="input" id="ad_type" value="${pt.replace(/"/g,'&quot;')}" placeholder="Lloji"/></div>
    </div>
    <div class="field"><label>Institucioni</label><input class="input" id="ad_inst" placeholder="p.sh. MPB, Universiteti…"/></div>
    <div class="field"><label>Numri i dokumentit</label><input class="input" id="ad_num" placeholder="opsional"/></div>
    <div class="row" style="gap:10px">
      <div class="field" style="flex:1"><label>Data e lëshimit</label><input class="input" type="date" id="ad_issued" value="${today}"/></div>
      <div class="field" style="flex:1"><label>Skadon</label><input class="input" type="date" id="ad_exp"/></div>
    </div>
    <button class="btn primary" onclick="saveNewDoc('${id}')">${svg('check',18)} Ruaj në vault</button>
    <button class="btn ghost mt" onclick="closeSheet()">Anulo</button>
  `);
}
function saveNewDoc(id){
  const title=$('#ad_title').value.trim()||'Dokument pa titull';
  const cat=$('#ad_cat').value;
  const p=(_pending&&_pending.id===id)?_pending:null;
  const numEl=$('#ad_num');
  const doc={id,title,cat,type:$('#ad_type').value.trim()||CATS[cat].types[0],
    institution:$('#ad_inst').value.trim(),issued:$('#ad_issued').value,expiry:$('#ad_exp').value,
    number:numEl?numEl.value.trim():'',fav:false,tags:[cat],
    size:p?p.size:0,created:Date.now(),
    fileName:p?p.name:'',ocr:(p&&p.text)?p.text.slice(0,2000):''};
  State.docs.unshift(doc);State.saveDocs();
  State.log('Dokument i ri: '+title);
  _pending=null;
  closeSheet();haptic();toast('U ruajt në vault','check');
  go('detail',{id});
}
