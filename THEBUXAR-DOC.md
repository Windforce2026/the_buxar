# TheBuxar.com — Site Reference

A frontend-only city portal for **Buxar, Bihar, India**: news, a business
directory, marketplace, food, local services, jobs, property, classifieds,
community and district heritage.

> Last updated: 31 October 2026. This file describes the site as shipped.
> Older notes that called it a single-page demo are obsolete.

---

## 1. What it is

- **Format:** static HTML, CSS and vanilla JavaScript. No framework, bundler,
  package manager, database or API.
- **Hosting:** any static host. Every page works over `http://` and `file://`.
- **Only external request:** the Google Fonts stack. All imagery is local.
- **Backend:** none. Accounts, submissions, cart and admin state are stored in
  `localStorage`; nothing is sent to a server.
- **Content policy:** only real, sourced records are rendered. Empty sections
  say so instead of showing invented businesses, prices, jobs or news.
- **Languages:** English and Hindi. Every visible string carries `data-en` and
  `data-hi`; the toggle sets `<html data-lang="hi">`.
- **Regions:** the region architecture is multi-region from day one
  (`js/regions.js`, 18 regions, 10 live). Buxar is the default.

---

## 2. Pages

### Core

| File | Purpose |
|---|---|
| `index.html` | Home: loader, hero, live news, quick access, directory, heritage, marketplace, trade |
| `news.html` | News and events, filtered to real records |
| `business.html` | Directory landing: 7 groups, 58 sub-categories |
| `business/list.html` | Directory search and filters |
| `business/profile.html` | Business profile (`?slug=`) |
| `business/add.html`, `business/claim.html` | Listing submission and claim forms |
| `marketplace.html` | Marketplace landing |
| `marketplace/list.html` | Product listing and filters |
| `marketplace/product.html` | Product detail (`?slug=`) |
| `marketplace/seller.html` | Seller profile |
| `food.html` | Food and restaurants vertical |
| `services.html` | Local services vertical |
| `jobs.html` | Jobs vertical |
| `property.html` | Property vertical |
| `classifieds.html` | Classifieds vertical |
| `explore.html` | Explore Buxar landing |
| `explore/<area>/index.html` | Six area pages: Buxar Town, Dumraon, Brahampur, Chausa, Itarhi, Rajpur |
| `history.html` | District history |
| `tourism.html` | Tourism and heritage |
| `trade.html` | Trade and commerce |
| `community.html` | Community posts and organisations |
| `search.html` | Unified search results |
| `login.html`, `account.html` | Local account flow |
| `admin.html` | Local moderation panel (open; a server is required to restrict it) |
| `contact.html` | Contact details and form |
| `credits.html` | Image and logo provenance registers |

Marketplace cart, checkout, wishlist and seller/product entry pages live under
`marketplace/`. News article and event templates live under `news/`.

---

## 3. Architecture

Each HTML file is a shell with mount points. Renderers build the content.

```html
<body data-vertical="F">
  <div data-listing="hero"></div>
  <div data-listing="cats"></div>
  <div data-listing="list"></div>
  <div data-listing="submit"></div>
  <script>window.TheBuxarConfig = { path: './' }</script>
  <script src="./js/listings-data.js" defer></script>
  <script src="./js/listings.js" defer></script>
</body>
```

- `window.TheBuxarConfig.path` is `'./'` at the root and `'../'` (per depth)
  elsewhere. Relative links are built from it.
- Scripts are non-module IIFEs with `defer`, so the site runs from `file://`.
- A page loads only the data modules it needs. Search works with whatever is
  present: a module that is not loaded contributes no results.

### JavaScript modules

| Module | Responsibility |
|---|---|
| `regions.js` | Region registry, phone formatting, region switcher data |
| `portal-nav.js` | Ten-item header nav, region switcher, mobile drawer |
| `loader.js` | Bihar-map loader; skips the backdrop video on phones and slow links |
| `main.js` | Theme, language toggle, shared nav behaviour |
| `sections.js` | Scroll reveal, progress bar, back-to-top |
| `business-data.js` | Directory records and helpers (`B.businesses`, `B.bySlug`, …) |
| `business-taxonomy.js` | 7 groups and 58 sub-categories (`B.categories` flat list) |
| `business.js` | Directory landing, list, profile, submission |
| `market-data.js`, `market.js` | Marketplace products, filters, cart, checkout |
| `news-data.js`, `news.js` | News and events |
| `explore-data.js`, `explore.js` | Area pages, places, galleries |
| `history.js`, `tourism.js`, `trade.js` | Heritage, tourism and trade pages |
| `listings-data.js` | Five verticals; **all record arrays are intentionally empty** |
| `listings.js` | Shared renderer for the five verticals |
| `home-live.js` | Homepage live blocks |
| `search.js` | Unified token-based search across loaded modules |
| `account.js`, `account-ui.js` | Local accounts and account pages |
| `community.js` | Community posts and organisations |
| `credits.js`, `business-logo-credits.js`, `heritage-image-credits.js`, `market-image-credits.js` | Provenance registers |

### CSS

`css/style.css` holds tokens, theme and typography. Page styles sit in their own
files (`business.css`, `market.css`, `listings.css`, …). All mobile overrides
are centralised in `css/mobile.css`, which every page loads last.

Breakpoints: hamburger at 1400px, region switcher hidden at 460px, language
toggle hidden at 360px. `prefers-reduced-motion` disables loader, reveal and
Ken Burns animation.

---

## 4. Adding a real record

- **Directory:** add an object to `B.businesses` in `js/business-data.js`.
  Required: `id`, `slug`, `name`, `category`, `area`, `address`. Optional:
  `subcategory`, `description`, `services`, `phone`, `whatsapp`, `email`,
  `website`, `socialLinks`, `logo`, `cover`, `gallery`, `rating`, `verified`.
  Logos must be organisation-supplied and registered in
  `js/business-logo-credits.js`.
- **Food / services / jobs / property / classifieds:** add to the matching
  `records` array in `js/listings-data.js`. The shared renderer and search pick
  it up automatically.
- **News:** add to `js/news-data.js`; demo records are filtered by `N.isReal()`
  and never rendered.
- **Marketplace:** add to `js/market-data.js`.
- **Images:** add a credit line to the relevant register and to `credits.html`.

Hindi fields (`name.hi`, `description.hi`) are optional in the data model but
should be supplied for every real record. Existing directory records are
English-only until a human supplies verified Hindi names.

---

## 5. SEO, accessibility and performance

- Every page has a canonical URL, Open Graph and Twitter tags, and JSON-LD.
- JSON-LD is validated JSON. Each page keeps one block per distinct entity;
  duplicate blocks are not emitted.
- `robots.txt` and `sitemap.xml` list the public pages. Account, admin, search,
  cart, checkout, wishlist, claim and add-listing pages are `noindex`.
- Favicons and the Apple touch icon live in `assets/brand/`.
- Images below the fold use `loading="lazy"`; the loader backdrop video does not
  load on screens under 900px, on Save-Data, or on 2G/3G.
- Every image has `alt` text; controls have labels; the skip link targets
  `#main`; focus states are visible.

---

## 6. Known gaps

These are deliberate, not bugs:

- No backend: accounts, submissions and the admin panel are local only.
- No private-business, jobs, property, food or classifieds source yet, so those
  record arrays are empty and show an honest empty state.
- No payment path for premium tiers; tier choice is stored locally.
- Community posts stay `pending` until a moderator exists
  (`C.MODERATION.autoPublish = false`).
- The NGO listing (`ngo-001`) is `verified: false` because its details came from
  the organisation, not the district administration.
- Hindi names for directory records await human verification.
- The client brief uses `TheBuxar.com`, `BUXER.COM` and `BUXAR.COM`; the shipped
  canonical host is `https://www.thebuxar.com`.
