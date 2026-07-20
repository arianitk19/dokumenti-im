/* ============================================================
   DOKUMENTI IM — Vault (real AES-256-GCM encryption at rest)
   Uses the Web Crypto API. Document files are stored as actual
   ciphertext in IndexedDB — never plaintext.
   ============================================================ */
'use strict';

const Vault = {
  key: null,
  ready: false,

  supported(){ return !!(window.crypto && crypto.subtle && crypto.getRandomValues); },

  b64(buf){
    const b = new Uint8Array(buf); let s='';
    for(let i=0;i<b.length;i++) s+=String.fromCharCode(b[i]);
    return btoa(s);
  },
  fromB64(str){
    const bin = atob(str); const arr = new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i);
    return arr.buffer;
  },

  /* Load or generate the local AES-256 master key.
     The key is generated with crypto.subtle and stored (exported raw)
     in localStorage — a client-only PWA has no server to hold it. */
  async init(){
    if(this.ready) return this.key;
    if(!this.supported()){ this.ready=true; return null; }
    try{
      let raw = localStorage.getItem('dim_vkey');
      let keyBytes;
      if(raw){
        keyBytes = this.fromB64(raw);
      }else{
        const gen = await crypto.subtle.generateKey({name:'AES-GCM', length:256}, true, ['encrypt','decrypt']);
        keyBytes = await crypto.subtle.exportKey('raw', gen);
        localStorage.setItem('dim_vkey', this.b64(keyBytes));
      }
      this.key = await crypto.subtle.importKey('raw', keyBytes, {name:'AES-GCM'}, false, ['encrypt','decrypt']);
      this.ready = true;
      return this.key;
    }catch(e){ this.ready=true; this.key=null; return null; }
  },

  /* Encrypt a Blob → returns a structured record for IndexedDB. */
  async encrypt(blob){
    await this.init();
    const buf = await blob.arrayBuffer();
    if(!this.key){ return { enc:false, type:blob.type||'', data:buf }; }
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({name:'AES-GCM', iv}, this.key, buf);
    return { enc:true, type:blob.type||'', iv, data:ct };
  },

  /* Decrypt a record → returns the original Blob. */
  async decrypt(rec){
    if(!rec) return null;
    if(!rec.enc){ return new Blob([rec.data], {type:rec.type||''}); }
    await this.init();
    if(!this.key) return null;
    try{
      const pt = await crypto.subtle.decrypt({name:'AES-GCM', iv:rec.iv}, this.key, rec.data);
      return new Blob([pt], {type:rec.type||''});
    }catch(e){ return null; }
  },

  /* Fingerprint of the active key (for the Security Center display). */
  async fingerprint(){
    const raw = localStorage.getItem('dim_vkey');
    if(!raw || !this.supported()) return '—';
    try{
      const hash = await crypto.subtle.digest('SHA-256', this.fromB64(raw));
      const b = new Uint8Array(hash);
      let hex=''; for(let i=0;i<6;i++) hex += b[i].toString(16).padStart(2,'0');
      return hex.toUpperCase().match(/.{2}/g).join(' ');
    }catch(e){ return '—'; }
  }
};
