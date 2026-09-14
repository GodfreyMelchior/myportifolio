# Mwongozo wa Kuweka Portfolio Online + Admin (GitHub Pages + Decap CMS)

Portfolio yako sasa inasoma content kutoka faili za `data/*.json`, na ina admin panel (`/admin`)
inayokuwezesha kuhariri taarifa bila kugusa HTML. Fuata hatua hizi mara moja tu.

---

## 0. Sukuma mabadiliko GitHub (kwanza kabisa)
```bash
git add -A
git commit -m "Make portfolio data-driven + add Decap CMS admin"
git push origin master
```

---

## 1. Washa GitHub Pages
1. Fungua repo: https://github.com/GodfreyMelchior/myportifolio
2. **Settings → Pages**
3. **Source:** `Deploy from a branch`
4. **Branch:** `master`, folder `/ (root)` → **Save**
5. Subiri dakika 1–2. Site yako itakuwa:
   **https://godfreymelchior.github.io/myportifolio/**

> Muhimu: fungua kupitia link hii (http), SI kwa kufungua `index.html` moja kwa moja
> kwenye kompyuta (file://) — kwa file:// content haitaonekana (kizuizi cha browser).

---

## 2. Tengeneza GitHub OAuth App (kwa login ya admin)
1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
2. Jaza:
   - **Application name:** `Portfolio Admin`
   - **Homepage URL:** `https://godfreymelchior.github.io/myportifolio/`
   - **Authorization callback URL:** `https://<jina-lako>.workers.dev/callback`
     (URL hii utaipata kamili baada ya hatua ya 3 — unaweza kurudi kuihariri)
3. **Register application** → nakili **Client ID**
4. Bonyeza **Generate a new client secret** → nakili **Client Secret**
   (ihifadhi mahali salama, haitaonekana tena)

> USALAMA: USIweke Client ID/Secret hapa wala popote kwenye repo. Zinakaa TU
> kama env variables kwenye Cloudflare Worker (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`).

---

## 3. Deploy Cloudflare Worker (server ndogo ya login — BURE)
Hii ndiyo inayoruhusu Decap kuku-login kwenye GitHub ukiwa kwenye GitHub Pages.

**Njia rahisi (Deploy button):**
1. Nenda: https://github.com/sveltia/sveltia-cms-auth
2. Fuata maelekezo yao ya **"Deploy to Cloudflare Workers"** (utahitaji akaunti ya Cloudflare — bure)
3. Kwenye Worker settings → **Variables**, weka:
   - `GITHUB_CLIENT_ID` = Client ID kutoka hatua 2
   - `GITHUB_CLIENT_SECRET` = Client Secret kutoka hatua 2
   - `ALLOWED_DOMAINS` = `godfreymelchior.github.io`
4. Nakili URL ya worker, mfano: `https://portfolio-oauth.jina-lako.workers.dev`
5. Rudi kwenye **GitHub OAuth App** (hatua 2) → weka **Authorization callback URL**:
   `https://portfolio-oauth.jina-lako.workers.dev/callback`

---

## 4. Unganisha admin na worker
Fungua `admin/config.yml`, badilisha mstari huu:
```yaml
  base_url: https://REPLACE-WITH-YOUR-CLOUDFLARE-WORKER-URL
```
kuwa (bila slash mwishoni):
```yaml
  base_url: https://portfolio-oauth.jina-lako.workers.dev
```
Kisha:
```bash
git add admin/config.yml
git commit -m "Set Decap OAuth base_url"
git push origin master
```

---

## 5. Tumia admin
1. Fungua: **https://godfreymelchior.github.io/myportifolio/admin/**
2. Bonyeza **Login with GitHub** → ruhusu.
3. Hariri sehemu yoyote (Profile, About, Resume, Portfolio, Blog, Contact) → **Publish**.
4. Kila "Publish" inaunda commit kwenye repo yako, na site inajisasisha ndani ya dakika 1–2.

---

## Kutest admin kwenye kompyuta yako (bila kusubiri online)
`local_backend: true` imewekwa tayari, kwa hiyo:
```bash
# Terminal 1: server ya site
python3 -m http.server 8000

# Terminal 2: server ya CMS (local)
npx decap-server
```
Kisha fungua: `http://localhost:8000/admin/` — hariri, save, kagua faili la `data/*.json` limebadilika.
(Kwa mode hii huhitaji login wala Cloudflare.)

---

## Jinsi content inavyofanya kazi
- Taarifa zote ziko `data/*.json` (`profile`, `about`, `resume`, `portfolio`, `blog`, `contact`).
- `assets/js/render.js` inasoma JSON, inajaza ukurasa, kisha inapakia `assets/js/script.js`.
- Picha mpya unazopakia kupitia admin zinahifadhiwa `assets/images/`.
- Ukibadilisha JSON kwa mkono pia inafanya kazi — admin ni njia rahisi tu.

## Dokezo
- Fomu ya "Contact" (`action="#"`) haitumii ujumbe bado — ni ya maonyesho. Ukitaka ifanye kazi,
  tunaweza kuiunganisha na huduma bure kama Formspree baadaye.
