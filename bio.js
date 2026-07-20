/* ============================================================
   DOKUMENTI IM — Biometric Authentication (WebAuthn)
   Real Face ID / Touch ID / Windows Hello / fingerprint.
   Uses the platform authenticator via navigator.credentials.
   Security note: the OS biometric gate is the real protection —
   credentials.get() only resolves after successful user verification.
   ============================================================ */
'use strict';

const Bio = {
  /* WebAuthn present in this browser? */
  supported(){
    return !!(window.PublicKeyCredential && navigator.credentials &&
      typeof navigator.credentials.create === 'function' && window.crypto && crypto.getRandomValues);
  },
  /* Secure context required (https or localhost). file:// will fail. */
  secureContext(){ return typeof window.isSecureContext === 'boolean' ? window.isSecureContext : false; },
  /* Is a platform (built-in) biometric authenticator actually available? */
  async available(){
    if(!this.supported()) return false;
    try{
      if(!PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) return false;
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }catch(e){ return false; }
  },
  /* Overall gate: can we offer biometrics right now? */
  async ready(){ return this.secureContext() && await this.available(); },

  /* base64url helpers for storing credential ids */
  toB64(buf){
    const bytes = new Uint8Array(buf);
    let s=''; for(let i=0;i<bytes.length;i++) s+=String.fromCharCode(bytes[i]);
    return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  },
  fromB64(str){
    str = str.replace(/-/g,'+').replace(/_/g,'/');
    while(str.length % 4) str += '=';
    const bin = atob(str);
    const arr = new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
    return arr.buffer;
  },

  /* Enroll: create a platform credential bound to this device + user.
     Returns the base64url credential id to store locally. Throws on cancel/fail. */
  async register(user){
    if(!this.supported()) throw new Error('unsupported');
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = crypto.getRandomValues(new Uint8Array(16));
    const cred = await navigator.credentials.create({ publicKey:{
      challenge,
      rp:{ name:'Dokumenti Im', id: location.hostname || undefined },
      user:{ id: userId, name: (user && (user.email||user.name)) || 'perdorues', displayName: (user && user.name) || 'Përdorues' },
      pubKeyCredParams:[ {type:'public-key', alg:-7}, {type:'public-key', alg:-257} ],
      authenticatorSelection:{ authenticatorAttachment:'platform', userVerification:'required', residentKey:'preferred' },
      timeout: 60000,
      attestation: 'none'
    }});
    if(!cred || !cred.rawId) throw new Error('no-credential');
    return this.toB64(cred.rawId);
  },

  /* Verify: prompt the real biometric. Resolves only after success. Throws on cancel/fail. */
  async verify(rawIdB64){
    if(!this.supported()) throw new Error('unsupported');
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const publicKey = {
      challenge,
      timeout: 60000,
      userVerification: 'required',
      rpId: location.hostname || undefined
    };
    if(rawIdB64){
      publicKey.allowCredentials = [{ type:'public-key', id: this.fromB64(rawIdB64) }];
    }
    const assertion = await navigator.credentials.get({ publicKey });
    if(!assertion) throw new Error('no-assertion');
    return true;
  }
};
