# 🇽🇰 Dokumenti Im

**Identiteti yt digjital. Gjithmonë me ty.**

Aplikacion premium PWA + web për qytetarët e Kosovës që transformon mënyrën se si ruhen, organizohen dhe përdoren dokumentet personale. Jo një file manager — një *Personal Digital Identity Center*: Apple Wallet + Notion + iCloud + një AI asistent, i përshtatur për realitetin shqiptar.

---

## Si të nisësh

Aplikacioni është **plotësisht funksional** dhe nuk kërkon instalim apo backend.

**Mënyra 1 — hape direkt:** Kliko dy klik mbi `index.html` (ose `landing.html` për faqen e marketingut). Punon në çdo browser modern.

**Mënyra 2 — si PWA e instalueshme (rekomanduar):** Për shkak se PWA kërkon HTTP, nise një server lokal në dosjen e projektit:

```bash
# Python
python3 -m http.server 8080
# ose Node
npx serve .
```

Pastaj hap `http://localhost:8080`. Në Chrome/Safari do të shohësh opsionin **"Install / Shto në Home Screen"** — instalohet si aplikacion i vërtetë, punon edhe offline.

> Të dhënat ruhen lokalisht në pajisje (localStorage + IndexedDB për skedarët). Asgjë nuk dërgohet në një server. Në hapjen e parë krijohet një llogari demo me 10 dokumente shembull.

### Face ID / Touch ID — biometrikë reale (WebAuthn)

Kyçja biometrike është **e vërtetë**, e ndërtuar mbi standardin **WebAuthn** (`navigator.credentials`). Gjatë konfigurimit të sigurisë, aplikacioni regjistron një *platform authenticator* dhe në ekranin e kyçjes thërret Face ID / Touch ID / Windows Hello / gjurmën e gishtit të vetë pajisjes. Verifikimi kryhet nga sistemi operativ — aplikacioni hyn vetëm pasi biometria të konfirmohet.

Kërkesat për biometrikën:
- Duhet **kontekst i sigurt**: `https://` ose `http://localhost`. Nëse hapet si skedar (`file://`), biometria nuk aktivizohet dhe përdoret PIN-i (aplikacioni e shpjegon këtë vetë).
- Duhet një pajisje me biometrikë (Mac me Touch ID, iPhone/Android, Windows Hello). Nëse mungon, kalohet automatikisht te PIN-i.

Prandaj, për ta provuar Face ID, nise serverin lokal (më poshtë) dhe hape `http://localhost:8080`.

### Çfarë është reale (jo e simuluar)

- **Skaneri me kamerë** — kamera e vërtetë përmes `getUserMedia`: feed live, kapje e frame-it në canvas dhe **përpunim real i imazhit** (grayscale + kontrast) për pamje dokumenti. Kërkon leje kamere dhe kontekst të sigurt (https/localhost); përndryshe kalon te kamera e sistemit ose ngarkimi i një foto.
- **OCR i vërtetë** — njohja e tekstit bëhet me **Tesseract.js** (shqip + anglisht), me progres real. Teksti nxirret realisht nga imazhi, në pajisje. (Herën e parë modelet e gjuhës shkarkohen nga CDN — disa MB.)
- **Nxjerrje reale fushash** — nga teksti i OCR-së nxirren automatikisht datat (lëshim/skadim), numri i dokumentit dhe institucioni, me rregulla reale (regex + heuristika).
- **Enkriptim AES-256-GCM real** — skedarët ruhen si **ciphertext i vërtetë** në IndexedDB përmes Web Crypto (`crypto.subtle`), jo si tekst i thjeshtë. Çelësi 256-bit gjenerohet me `crypto.subtle.generateKey` dhe ruhet lokalisht (aplikacion pa server). Security Center shfaq gjurmën (fingerprint) reale të çelësit.
- **Face ID / Touch ID real** — WebAuthn (shih më lart).
- **QR real**, **orë/datë live**, **ruajtje reale** (localStorage + IndexedDB).

> Shënim: 10 dokumentet fillestare janë **përmbajtje shembull** për të treguar ndërfaqen; funksionet (skanim, OCR, enkriptim, biometrikë) janë plotësisht reale mbi çdo dokument që shton vetë.

### Shtim sipas kategorisë & llojit

Klikimi te një kategori (te ballina) hap ekranin e saj me të gjithë llojet e dokumenteve (p.sh. te *Identitet*: Letërnjoftim, Pasaportë, Patentë shoferi…). Duke prekur një lloj, zgjedh ose **Fotografo / Skano** (kamerë reale + OCR, i para-caktuar për atë lloj), ose **Plotëso detajet** (formular i plotë me kategorinë e llojin gati). Kështu shtimi është i shpejtë dhe i strukturuar.

### Sistem njoftimesh real & strikt

- **Leje reale** e sistemit (Notifications API) dhe **njoftime OS** përmes Service Worker (`registration.showNotification`), me klik që hap app-in.
- **Kujtesa strikte** në pragje të shumta: **90, 60, 30, 14, 7, 3, 1, 0 ditë** para skadimit, plus dokumentet **e skaduara** — me nivele ashpërsie (kuq/verdhë/blu).
- Rikontroll çdo minutë sa app-i është hapur dhe sa herë kthehet në plan të parë; njoftimet nuk përsëriten (gjurmohen me çelës unik).
- **Qendër njoftimesh** me status lejeje, buton *Provo* dhe *Aktivizo*, dhe distinktivi (badge) i pallexuara te zilja.

> Kufi realist: njoftimet kur app-i është **plotësisht i mbyllur** kërkojnë një server Web Push; versioni klient-only i dërgon rreptësisht sa është hapur ose në sfond. Aktivizoji te *Security Center* ose te qendra e njoftimeve, dhe përdor *Provo* për ta parë menjëherë.

---

## Ç'përfshin (të gjitha funksionale)

- **Splash cinematic** — një dokument transformohet në vault të sigurt.
- **Onboarding premium** në 3 ekrane + krijim llogarie + konfigurim PIN.
- **Kyçje biometrike (Face ID simulim) + PIN keypad** me shake-error dhe zhbllokim.
- **Dashboard — Digital Identity Center**: Identity Score dinamik (ring i animuar), dokumente totale, storage, kategori, veprime të shpejta, feed dokumentesh me afat.
- **Skanim inteligjent** (kamerë) + **ngarkim skedari** + **shtim manual**.
- **AI Document Recognition**: klasifikim automatik në kategori me besueshmëri, njohje e llojit, OCR i simuluar, plotësim automatik i fushave.
- **8 kategori** të optimizuara për Kosovën: Identitet, Arsim, Punë, Automjet, Shëndet, Banimi, Biznes, Garanci.
- **Kërkim i avancuar, filtrim, tags, favorites, renditje** (të reja / emri / afat).
- **Smart Expiration Reminders** — njoftime me ditë deri në skadim.
- **Secure Sharing** — lidhje me afat, mbrojtje me fjalëkalim, gjurmim qasjeje.
- **QR Verification** — QR unik për autenticitet, version dhe pronësi.
- **Dokumenti AI** — asistent bisedues mbi dokumentet e tua reale ("Kur më skadon pasaporta?", "Ku është kontrata ime?", "Çfarë më duhet për punësim?").
- **Life Packs** — Punësim, Udhëtim, Automjet, Biznes me përqindje kompletimi.
- **Security Center** — Security Score, ndërrues për biometrikë/enkriptim/backup, ditar aktiviteti.
- **Premium (Free vs 4.99€)** me monetizim.
- **Profil** — redaktim, eksport backup JSON, logout.
- **Landing page** e plotë marketingu (`landing.html`).

---

## Arkitektura teknike

**Ky demo:** PWA vanilla (HTML + CSS + JS), zero varësi build. QR nga një CDN i vetëm. Ruajtje: `localStorage` (metadata) + `IndexedDB` (skedarë/blob). Service Worker për offline.

| Skedar | Roli |
|---|---|
| `index.html` | Shell-i i aplikacionit + design system (CSS) |
| `app.js` | Core: state, storage, ikona, kategori, AI-categorization, router, splash |
| `screens-core.js` | Onboarding, signup, PIN, lock, dashboard |
| `screens-docs.js` | Lista, detajet, shtim/skanim, njohja me AI |
| `screens-ai.js` | Dokumenti AI (engine) + Life Packs |
| `screens-more.js` | Sharing, QR, Security Center, Premium, Profil |
| `manifest.webmanifest`, `sw.js`, `icons/` | Paketimi PWA |
| `landing.html` | Faqja e marketingut |

**Stack i rekomanduar për prodhim (roadmap):** React Native + Expo (mobile), Next.js + Tailwind (web), Supabase (Auth, Postgres, Storage, RLS). Tabelat: `users`, `profiles`, `documents`, `categories`, `ai_analysis`, `notifications`, `shared_documents`, `security_logs`, `subscriptions`.

---

## Brand Guidelines

**Personaliteti:** besueshmëri · siguri · elegancë · minimalizëm · inteligjencë · thjeshtësi premium. Ndjesia: *Apple Wallet takon një aplikacion bankar.*

**Ngjyrat**
- Sfond: `#0A0B0F` (dark elegant)
- Accent gradient: `#3B82F6 → #6366F1 → #22D3EE`
- Sukses `#34D399` · Paralajmërim `#FBBF24` · Rrezik `#F87171` · Gold `#E9C46A`
- Sipërfaqe glass: e bardhë me opacitet të ulët + `backdrop-filter: blur`

**Tipografia:** Inter, `letter-spacing` negativ (-0.01 deri -0.03em), tituj 800.

**Elementet:** glassmorphism, titanium cards, rrathë score të animuar, micro-interactions (scale në :active), transicione cubic-bezier të buta, radiuse të mëdha (18–44px).

**Slogane:** *"Identiteti yt digjital. Gjithmonë me ty."* · *"Ruaj atë që ka rëndësi."* · *"Vendi ku jeton identiteti im digjital."*

---

*Ndërtuar në Kosovë 🇽🇰 nga BuiltByNiti · Demo produkti v1.0*
