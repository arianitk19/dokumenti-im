/* ============================================================
   DOKUMENTI IM — Notifications & Reminder engine
   Real OS notifications (Notifications API + Service Worker) and a
   strict expiry-reminder system (90/60/30/14/7/3/1/0 days + expired).
   ============================================================ */
'use strict';

const Notif = {
  supported(){ return typeof Notification !== 'undefined'; },
  permission(){ return this.supported() ? Notification.permission : 'unsupported'; },
  async request(){
    if(!this.supported()) return 'unsupported';
    try{ return await Notification.requestPermission(); }
    catch(e){ try{ return await new Promise(res=>Notification.requestPermission(res)); }catch(_){ return 'denied'; } }
  },
  async show(title, opts){
    if(!this.supported() || Notification.permission !== 'granted') return false;
    opts = Object.assign({ icon:'icons/icon-192.png', badge:'icons/icon-192.png' }, opts||{});
    try{
      if(navigator.serviceWorker){
        const reg = await navigator.serviceWorker.ready;
        if(reg && reg.showNotification){ await reg.showNotification(title, opts); return true; }
      }
      new Notification(title, opts); return true;
    }catch(e){ try{ new Notification(title, opts); return true; }catch(_){ return false; } }
  }
};

/* ---- reminder computation ---- */
function reminderLevel(days){
  if(days==null) return null;
  if(days<0)  return { k:'expired', sev:'red' };
  if(days===0) return { k:'today', sev:'red' };
  const ths=[1,3,7,14,30,60,90];
  for(const th of ths){ if(days<=th) return { k:'d'+th, sev: th<=7?'red' : th<=30?'amber' : 'blue' }; }
  return null;
}
function dueReminders(){
  const out=[];
  for(const d of State.docs){
    const days=daysUntil(d.expiry);
    const lv=reminderLevel(days);
    if(!lv) continue;
    out.push({ doc:d, days, level:lv.k, sev:lv.sev, key:d.id+':'+lv.k });
  }
  return out.sort((a,b)=>a.days-b.days);
}
function reminderText(r){
  const d=r.doc;
  if(r.days<0)  return { title:'Dokument i skaduar', body:d.title+' skadoi më '+fmtDate(d.expiry)+'. Rinovo sa më parë.' };
  if(r.days===0) return { title:'Skadon sot', body:d.title+' skadon sot. Rinovo tani.' };
  return { title:'Kujtesë skadimi', body:d.title+' skadon pas '+r.days+' ditësh ('+fmtDate(d.expiry)+').' };
}

/* ---- firing + badges ---- */
async function checkReminders(fireOS){
  const due=dueReminders();
  if(fireOS && State.settings.notifications && Notif.permission()==='granted'){
    const ack=LS.get('notifAck',{});
    for(const r of due){
      if(ack[r.key]) continue;
      const t=reminderText(r);
      const ok=await Notif.show(t.title, { body:t.body, tag:r.key, renotify:true, requireInteraction:(r.days<=3), data:{ id:r.doc.id } });
      if(ok) ack[r.key]=Date.now();
    }
    LS.set('notifAck', ack);
  }
  updateBellBadge();
  return due;
}
function notifUnreadCount(){
  const read=LS.get('notifRead',{});
  return dueReminders().filter(r=>!read[r.key]).length;
}
function markNotifRead(){
  const read={}; dueReminders().forEach(r=>{ read[r.key]=Date.now(); });
  LS.set('notifRead', read); updateBellBadge();
}
function updateBellBadge(){
  const b=document.querySelector('.icon-btn.badge');
  if(!b) return;
  const n=notifUnreadCount();
  b.setAttribute('data-badge', n>0 ? String(n) : '');
}

/* ---- lifecycle ---- */
let _remindTimer=null;
function startReminderLoop(){
  checkReminders(true);
  clearInterval(_remindTimer);
  _remindTimer=setInterval(()=>checkReminders(true), 60000);   // strict re-check every minute while open
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) checkReminders(true); });
}

async function enableNotifications(){
  if(!Notif.supported()){ toast('Njoftimet nuk mbështeten në këtë shfletues','bell'); return false; }
  const p=await Notif.request();
  if(p==='granted'){
    State.settings.notifications=true; State.saveSettings();
    State.log('Njoftimet u aktivizuan');
    await Notif.show('Dokumenti Im', { body:'Njoftimet janë aktive. Do të të kujtojmë çdo skadim me kohë.', tag:'welcome' });
    await checkReminders(true);
    toast('Njoftimet u aktivizuan','bell');
    return true;
  }
  State.settings.notifications=false; State.saveSettings();
  toast(p==='denied' ? 'Njoftimet janë të bllokuara nga shfletuesi' : 'Leja nuk u dha','bell');
  return false;
}
function disableNotifications(){
  State.settings.notifications=false; State.saveSettings();
  State.log('Njoftimet u çaktivizuan');
  toast('Njoftimet u çaktivizuan','bell');
}
async function testNotification(){
  if(Notif.permission()!=='granted'){ const ok=await enableNotifications(); if(!ok) return; }
  await Notif.show('Njoftim testues', { body:'Sistemi i njoftimeve punon si duhet.', tag:'test-'+Date.now() });
  toast('Njoftimi testues u dërgua','bell');
}
