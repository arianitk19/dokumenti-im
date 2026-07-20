// syntax-only check of the new i18n + wizard blocks (parse, not execute)
let LANG='sq', current='', suStep=0, suData={name:'',region:'Kosovë',email:'',phone:'',terms:true};
const LS={get:(a,b)=>b,set:()=>{}}; function svg(){return '';} function tr(k){return k;} function haptic(){} function toast(){} function go(){} function setLang(){} function $(){return null;} const BRAND_MARK=''; function langSwitch(){return '';} function regionLabel(r){return r;} const State={user:null,saveUser(){}};

const REGIONS = ['Kosovë','Shqipëri','Maqedoni e Veriut','Mal i Zi','Diasporë','Tjetër'];
const REGIONS_EN = {'Kosovë':'Kosovo','Shqipëri':'Albania','Maqedoni e Veriut':'North Macedonia','Mal i Zi':'Montenegro','Diasporë':'Diaspora','Tjetër':'Other'};
const I18N = {
  sq:{
    ob_skip:'Kalo', ob_next:'Vazhdo', ob_start:'Fillo tani',
    ob1_t:'a', ob1_p:'b', ob2_t:'c', ob2_p:'d', ob3_t:'e', ob3_p:'f',
    su_create:'Krijo llogarinë', su_sub:'x', su_identity:'Identiteti', su_contact:'Kontakti', su_security:'Siguria',
    su_name:'Emri dhe mbiemri', su_name_ph:'p.sh.', su_region:'Vendi', su_lang:'Gjuha',
    su_email:'Email', su_email_ph:'y', su_phone:'Tel', su_opt:'opsional',
    su_continue:'Vazhdo', su_back:'Prapa', su_to_security:'Vazhdo te siguria',
    su_consent:'Pranoj', su_secure:'AES-256', su_preview:'Identiteti yt digjital', su_yourname:'Emri yt', su_member:'Anëtar që nga',
    err_name:'a', err_email:'b', err_consent:'c',
    pin_create:'a', pin_confirm:'b', pin_hint:'c', pin_hint2:'d',
    bio_title:'a', bio_desc:'b', bio_enable:'c', bio_later:'d',
    welcome_back:'a', unlock_bio:'b', unlock_pin:'c', lang_name:'Shqip'
  },
  en:{ ob_skip:'Skip', su_create:'Create account', su_member:'Member since', lang_name:'English' }
};
function regionLabel2(r){ return LANG==='en' ? (REGIONS_EN[r]||r) : r; }

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
  s.innerHTML=`<div class="wiz"><div class="wiz-hero">${livePreview()}</div><div class="wiz-body">${body}</div></div>`;
}
function suLive(){ const n=$('#su_name'); if(n) suData.name=n.value; }
function suPickRegion(r){ suData.region=r; }
function suBack(){ if(suStep>0){ suStep--; go('signup'); } }
function syncSignup(){ const n=$('#su_name'); if(n) suData.name=n.value; }
function suNext(){
  syncSignup();
  if(suStep===0){ if(!suData.name.trim()){ return; } suStep=1; return; }
  State.user={ name:suData.name.trim(), lang:LANG, created:Date.now() };
}
function shakeField(id){ const el=$('#'+id); if(el){} }
console.log('parse ok', Object.keys(I18N.sq).length, REGIONS.length);
