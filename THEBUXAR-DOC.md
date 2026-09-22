# TheBuxar.com — Complete Site Reference

A single-page, content + design pattern reference for **TheBuxar.com**, a
premium digital heritage destination for **Buxar, Bihar, India**.

> Last generated from the current codebase (2 commits: `home page`,
> `home page fixes`). All class names, tokens, timings and patterns below
> are taken verbatim from the shipped HTML/CSS/JS.

---

## 1. Overview

- **What it is:** A luxury branded landing page for the city of Buxar —
  history, tourism, business directory, marketplace, trade, news and gallery.
- **Format:** One static `index.html` (611 lines) + CSS + vanilla JS.
- **No build system:** No `package.json`, no bundler, no framework, no
  Image CDN. Works over `http://` **and** `file://`.
- **Only external dependency:** Google Fonts (`Cormorant Garamond`,
  `Cinzel`, `Jost`, `Poppins`, `Manrope`) loaded in `<head>` with
  `preconnect`.
- **Networking model:** Every asset is local. The only remote request is
  the font stack.
- **Git state:** Very early — most CTAs are `href="#"` placeholders.
  The site is a landing/demo shell; destination pages (directory,
  marketplace, login, news detail, gallery) do not exist yet.

---

## 2. File Map

```
index.html              Single page: loader → hero → 8 sections → CTA → footer
css/
  style.css    (793)    Design tokens, theme, luxury nav, (legacy hero block)
  loader.css   (462)    Loader overlay: Bihar map reveal, particles, title
  hero.css     (548)    Cinematic full-screen hero (photo, Ken Burns, buttons)
  sections.css (1471)   All content sections, cards, CTA, footer, utilities
js/
  main.js     (172)     Theme, i18n, nav scroll/active, search, mobile drawer
  loader.js   (151)     Outline draw, particles, pulses, reveal timing
  hero.js     (108)     Hero particles, CTA ripple, scroll fade
  sections.js (93)      Scroll reveal (IO), progress bar, back-to-top, form
assets/
  bihar-map.svg                  Standalone SVG (the inline map is used)
  hero-buxar-sunset.jpg          Hero + About + gallery            (primary photo)
  hero-buxar-morning.jpg         Tourism card, About bg texture
  hero-buxar-night.jpg           Business section bg texture
  hero-buxar-bridge.jpg          (unused in markup — reserve)
  hero-buxar-paddy.jpg           (unused in markup — reserve)
  hero-buxar.jpg                 (unused in markup — reserve)
  hero-buxar-motion.mp4          Loader video backdrop (Pixabay license)
  dest-fort.jpg                  History medal, Tourism card, History bg
  dest-temple.jpg                History medal, Tourism card, gallery
  dest-ghats.jpg                 Tourism card "Ganga", Tourism bg texture
  news-aarti.jpg                 News card, gallery, CTA bg texture
  news-loom.jpg                  News card, Trade bg texture
  news-diyas.jpg                 News card, News bg texture
  prod-fabrics.jpg               Marketplace + gallery + Marketplace bg
  prod-clay.jpg                  Marketplace + gallery
  prod-brass.jpg                 Marketplace
  prod-puppets.jpg               Marketplace
```

> Assets used only as **CSS background textures** (behind a light scrim)
> are recycled from content images — no dedicated stock dump.

---

## 3. Content Map (single scroll)

| # | Section `id` | Nav label | Content |
|---|--------------|-----------|---------|
| — | `#loader` (overlay) | — | Bihar map SVG draws → Buxar pulses → wordmark + tagline reveal → fades out (~2.5 s) |
| — | `#hero` (main) | — | Eyebrow badge, 2-line serif headline w/ shimmer gold, subtitle, 2 CTAs, mouse scroll cue |
| 01 | `#home` About | Home | Split: text left / framed photo right; "Read More →" |
| 02 | `#history` History | History | 3-node gold timeline: Ancient / Battle of Buxar 1764 / Modern |
| 03 | `#tourism` Tourism | Tourism | 4 destination `tile` cards (lead tile = Buxar Fort) |
| 04 | `#business` Business | Business | 6 category `cat` tiles with inline SVG icons |
| 05 | `#marketplace` Marketplace | Marketplace | 4 full-bleed product images w/ gradient caption |
| 06 | `#trade` Trade | Trade | Split: abstract "commerce art" left / text + bullet list right |
| 07 | `#news` News | News | 3 news cards (dated, image, headline) |
| 08 | `#explore` Gallery | Explore | 8-image CSS masonry (tall/wide spans) |
| — | `#contact` Final CTA | Contact | Navy→gold closing band, 2 buttons |
| — | `#footer` | — | Brand blurb, contact, 2 link columns, newsletter form, socials, legal |
| — | page | — | Gold scroll progress bar (top), back-to-top button |

Every section ends with a centered `section__cta` ("Explore History →",
"Browse Directory →", etc.) — **all currently `href="#"` placeholders.**

---

## 4. Design System

### 4.1 Colour tokens (`css/style.css :root`, dark by default)

```css
--ink-navy:   #081c33;   /* deep navy — the brand ground */
--ink-navy-2: #0b3c5d;   /* lighter navy for gradients   */
--gold:       #d4af37;   /* classic gold                 */
--gold-warm:  #ffd76a;   /* warm highlight gold          */
--cream:      #f4e9c8;   /* cream text on navy           */
--paper:      #f7f3ea;   /* light surface reference      */
```

**Light theme** overrides on `html[data-theme='light']`:

```css
--bg: #f6f0e1;  --bg-2: #efe5cd;  --text: #12263d;
--text-muted: rgba(18,38,61,.7);  --text-soft: rgba(18,38,61,.45);
--nav-glass: rgba(246,240,225,.78);
```

Derived tokens: `--text`, `--text-muted`, `--text-soft`, `--nav-glass`,
`--nav-hairline`, `--nav-shadow`, `--hero-bg`, `--button-text`,
`--seal-glow`, `--brand-shadow`.

> **Note:** The content sections (`sections.css`) intentionally use **hard
> navy/cream values** (`#081c33`, `#f8f6f2`, `rgba(8,28,51,…)`) rather than
> tokens. The dark/light switch affects nav + hero chrome, not the
> brochure-style sections themselves. `loader.css` defines its own
> `--loader-*` tokens.

**Palette story** — “Navy is the night sky, gold is the Ganga sunrise,
paper is the heritage brochure”:

- Navy `#081c33` — hero, nav, CTA, footer, buttons, section titles
- Gold `#d4af37` / warm `#ffd76a` — all accents, glows, hairlines, icons
- Cream `#f4e9c8` / paper `#f8f6f2` — section canvas, card backgrounds

### 4.2 Typography

| Font | Used for | Notes |
|------|----------|-------|
| **Cormorant Garamond** (`--serif`) | Headlines (`section__title`, `hero__title`, tile/news/mark product titles, CTA title) | weights 300–600 + italics |
| **Cinzel** | Wordmark "BUXAR" (`nav__wordmark-bux`, `footer__wordmark-bux`) | tracked small-caps serif |
| **Jost** (`--sans`) | Body, labels, buttons, list text, nav, footer | weights 200–600 |
| **Poppins** | Hero label, hero subtitle | light 300 / 600 |
| **Manrope** | Hero buttons | 600 semibold |

Formatting conventions:

- **Eyebrow/labels:** `font-size 11–12px; letter-spacing 0.42em;
  text-transform uppercase; font-weight 600`, colour `#9a7b24` (on paper)
  or `#ffd76a` (on navy), flanked by `::before/::after` gold rules.
- **Section titles:** `Cormorant`, `500`, `clamp(34px,5vw,54px)`,
  `line-height 1.08`, `#081c33`, margin `16px 0 18px`.
- **Section text:** `Jost 300`, `clamp(15px,1.6vw,17px)`,
  `line-height 1.85`, `rgba(8,28,51,.68)`.
- **Big hero title:** `clamp(44px,8.5vw,96px)` serif, line 1.08.

### 4.3 Spacing / rhythm

```
.shell         max-width 1200px, padding 0 24px (18px under 560px)
.section       padding clamp(76px,11vw,132px) 0
.section__head max-width 760px, bottom margin clamp(40px,6vw,60px)
.section__cta  margin-top clamp(34px,5vw,48px), text-align center
.cta           padding clamp(90px,13vw,150px) 24px
```

Visibility with `clamp()` everywhere = fluid rhythm that scales from
mobile to desktop without media-query sprints.

### 4.4 Radius, elevation, gradients

- **Radii:** pills/capsules `999px` (buttons, labels, chips, form inputs);
  cards `22–30px`; frames `30px`; gallery items `20px`; medallion 100%.
- **Elevation:** soft layered shadows, e.g.
  `0 18px 40px rgba(40,28,20,.08)`, hover →
  `0 30px 60px rgba(40,28,20,.14)`. Buttons use gold-tinted shadows
  (`rgba(212,175,55,…)`).
- **Signature gold gradient** (used 5+ places):
  `linear-gradient(120deg, #ffd76a, #d4af37)`.
- **Wordmark shimmer gradient:**
  `linear-gradient(105deg, var(--gold), #ffe9a8 24%, var(--gold-warm) 50%, #b8912c 76%, var(--gold))`,
  `background-size 200% auto`, animated `brand-shimmer` 4.5 s.
- **Section backgrounds:** one photo + `background-attachment: fixed`
  (CSS parallax) behind a translucent paper scrim:
  `linear-gradient(rgba(248,246,242,.9), rgba(248,246,242,.93)), url(…) center / cover fixed`,
  plus a `radial-gradient` gold wash in a corner.

---

## 5. Component Patterns

### 5.1 Loader (`#loader`, `loader.css` + `js/loader.js`)

State machine via classes: `is-video` (video playing) → `is-leaving`.

Layers (z-index within loader):
1. `loader__bg` — preloaded-none `<video>` (muted/loop/playsinline,
   `preload="none"`, loaded 350 ms in) + navy scrim
2. `loader__particles` — 60 gold particles, canvas, DPR-capped at 2
3. `loader__card` — inline Bihar map SVG + title + tag
4. `loader__pulse` ×2 — gold pulses at Buxar centroid (delays 1.7 s / 2.5 s)
5. `loader__label` — "BUXAR" label with dot + connector, appears ~1.95 s

SVG map anatomy (`index.html` keys):
- `#br-outline` — Bihar border; JS measures `getTotalLength()` → sets
  `stroke-dasharray`/`stroke-dashoffset` + `--olen` so CSS can "draw" it.
- `#br-districts` — faint district paths (opacity 0, fade in).
- `#br-buxar` — Buxar district path (gold, thicker stroke).
- `#br-pulse-origin` — circle at Buxar centroid; pulses positioned here.

Timeline (default; reduced-motion compresses):
`0s particles` → outline draws → districts fade → Buxar highlights + pulses
→ typography → **2 450 ms reveal**: loader fades 550 ms, hero `.is-revealed`
drives its entrance; loader `display:none` at 700 ms.

### 5.2 Navigation (`style.css` + `main.js`)

- Fixed glass bar: `backdrop-filter blur(14px) saturate(1.4)`,
  `border-bottom 1px solid rgba(212,175,55,.28)`; `.scrolled` at
  `scrollY > 24` → stronger blur/shadow.
- **Brand:** text-only wordmark (*no logo image*): "The" in tracked
  uppercase + "Buxar" in shimmering Cinzel gold with a breathing glow and
  an animated under-rule.
- **Menu:** centered uppercase 11 px links (`letter-spacing .16em`) with
  gold underline `scaleX(0→1)` on hover/`.is-active`; active link detected
  by section `getBoundingClientRect().top ≤ 35% viewport`.
- **Right actions:** search button, sun/moon theme toggle (only the visible
  icon receives clicks; the other rotates away), `EN|हिंदी` dropdown-less
  toggle (`aria-pressed`), Login pill, hamburger.
- **Search panel:** slides open below the bar (`max-height 0 → 120 px`),
  autofocuses input, closes on ✕ / Escape / outside click.
- **Mobile (≤900 px):** drawer pinned to viewport (backdrop-filter removed
  on `.nav` so the fixed drawer isn't trapped by the filter's containing
  block), `translateX(105%)→0`, staggered full-width links, Login moves
  into the drawer. Body scroll locked while open.

### 5.3 Hero (`hero.css` + `js/hero.js`)

- Width 100%, `min-height 100vh / 100svh`, centered column, `isolation:isolate`.
- **Photo treatment:** single image (not a slider) `hero-buxar-sunset.jpg`
  with a navy gradient overlay + 30 s Ken Burns drift (scale 1.02→1.12)
  + radial vignette.
- **Spotlight halo** behind the text: navy radial `::before` for legibility.
- **Eyebrow badge:** capsule with gold dot that pulses; box-shadow breathes
  (`hero-label-glow` 3.2 s).
- **Title:** line-boxed rise-on-reveal — each `.hero__title-line` has
  `overflow:hidden`, inner span `translateY(112%)→0` staggered 0.06/0.16 s;
  "Soul" is the shimmer-gold gradient word.
- **Buttons:** `999px` capsules, letter-spaced uppercase.
  - `hero__btn--gold`: gold gradient, sheen sweep on hover, JS ripple
    (span appended at click point).
  - `hero__btn--glass`: translucent, gold border, gradient sheen `::after`.
- **Scroll cue:** mouse outline with gradient mask, animated gold wheel
  (hidden on short screens / mobile).
- Scroll fade: hero `opacity` driven by `--scrollfade` (JS, rAF-throttled).
- Entrance fires only when loader adds `.is-revealed` (label→subtitle→CTA
  `hero-rise`, delays 0/0.2/0.3 s).

### 5.4 Buttons (content sections, `sections.css`)

Shared `.btn`: capsule, `12px/600/.16em` uppercase, `16px 32px`, gold
lift-on-hover (`translateY(-3px)`).

| Modifier | Look |
|----------|------|
| `.btn--ink` | navy bg, `#ffd76a` text (dark navy fill on paper) |
| `.btn--gold` | gold gradient, navy text |
| `.btn--cream` | paper bg, navy text (on navy CTA band) |
| `.btn--ghost-light` | translucent white, white/gold border (on navy) |

### 5.5 Section header

```html
<header class="section__head reveal">
  <p class="section__label" data-en="…" data-hi="…">…</p>
  <h2 class="section__title serif" data-en="…" data-hi="…">…</h2>
  <p class="section__sub" data-en="…" data-hi="…">…</p>
</header>
```
Centered, max-width 760 px; label rules grow from centre on `.is-in`
(scaleX 0→1, staggered) via sibling selector `.is-in .section__label`.

### 5.6 Split (alternating text/image)

`grid-template-columns: 1fr 1fr; gap clamp(36px,6vw,84px); align-items:center`.
Frames: `.frame` (30 px radius, gold hairline `::after`, inset gold glow,
big soft shadow). Variants: `frame--gold` (4:3 photo), `frame--navy`
(radial navy for the trade art). On mobile the grid collapses to 1 column
and media gets `order:-1` (image always leads).

### 5.7 Card vocab

- **`tile`** — Tourism destinations: white card, 26 px radius, gold hairline
  border, image zooms 1.07 on hover, `.tile--lead` marked by a 3 px gold top
  border.
- **`cat`** — Business categories: horizontal tile, 34 px inline SVG icon in
  gold w/ glow, hover lift + border glow.
- **`product`** — Marketplace: full-bleed image (`height 340px`), bottom-up
  navy gradient always-on `::after` (deepens on hover), serif caption overlay.
- **`news-card`** — white card, 16:10 media, uppercase gold date, serif
  headline, hover lift + image zoom.

Grid layouts: tourism `repeat(auto-fit,minmax(250px,1fr))`; cats/cats-news
3-col (`2 → 1` responsive); products 4-col; masonry 4-col dense grid of
`132px` rows with `.masonry__item--tall` (row span 2) and `--wide`
(col span 2).

### 5.8 Timeline (history)

3 equal columns, gold connector line via `.timeline::before`
(`top:46px; left/right 16%`), circular **medallions** (92 px, gold ring
gradient + white inner ring, photo inset). Mobile → single column vertical
line down the left (`left:50%` becomes `top/bottom` line).

### 5.9 Trade art (`trade__art`)

Pure-CSS/SVG abstract "commerce" visual inside a navy frame: radial glow,
dashed + solid concentric rings, a bezier growth polyline SVG, and three
floating glass chips ("Agri-Trade", "Logistics", "Textiles").

### 5.10 Final CTA + Footer

- **CTA band:** navy→navy gradient over `news-aarti.jpg`, gold radial top
  wash + `::before` ellipse glow, centered label/title/sub, paired
  `.btn--cream` + `.btn--ghost-light`.
- **Footer:** 4 columns `2.1fr 1fr 1fr 1.6fr`; gold hairline on top edge;
  wordmark, tag, contact, 2 link lists (gold underline grow + `translateX(3px)`
  hover), newsletter form (pill input + gold button, animated success/error
  message in EN/HI, **visual only** — no backend), social circles that fill
  gold on hover, legal row. Footer reveal children stagger 0→0.3 s.

### 5.11 Utilities

- **`.reveal`/`.is-in`** — IntersectionObserver fade-up shake-free entrance.
- **`.progress`** — fixed 3 px top bar, gold gradient fill `scaleX(scroll%)`,
  rAF-throttled.
- **`.back-top`** — fixed 48 px circular glass button, appears `>520 px`
  scroll, pulsing gold ring on hover, smooth-scrolls to top.
- **Noscript fallback** (in `<head>`): hides loader, forces hero + all
  `.reveal` visible so the page works with JS disabled.

---

## 6. Internationalisation (EN ↔ हिंदी)

**Pattern:** every translatable element carries both strings:

```html
<span data-en="Discover the " data-hi="खोजिए ">Discover the </span>
```

- `js/main.js#applyLang()` reads `data-lang` on `<html>`, then swaps
  `textContent` to `data-hi`/`data-en`. Inputs use the pipe syntax:
  `data-ph="Your email|आपका ईमेल"`.
- Language choice persisted in `localStorage['buxar-lang']` and applied
  **before paint** by a tiny inline `<script>` in `<head>` (no flash).
- The inline loader wordmark/tag also carries `data-en/data-hi` pairs.
- Hindi sports **no Devanagari font** — falls back to the system sans.

---

## 7. Theming (dark / light)

- Dark (navy) is default & authoritative; light is an enhancement layer.
- Toggle: sun/moon buttons in nav; both `localStorage['buxar-theme']` and a
  pre-paint head script (same anti-flash trick as language).
- `meta[name=theme-color]` (mobile browser chrome) is kept in sync by a
  `MutationObserver` on `data-theme` (`#081C33` dark, `#f6f0e1` light).
- Light theme swaps tokens only — components need no other changes because
  they consume tokens (nav) **except** the content sections which use fixed
  colours by design.

---

## 8. JavaScript Architecture

- Four plain IIFEs (`'use strict'`) loaded with `defer`; boot on
  `DOMContentLoaded`. No modules → runs on `file://`.
- Every init step wrapped in `try/catch` so one failure never kills the
  rest (see `boot()` in each file).
- `prefers-reduced-motion: reduce` is honoured **at load time** in all four
  files (particles disabled, timers/entrances compressed, canvas skipped).
- Canvas system (loader + hero): DPR-capped at 2, rAF loop, `unload`
  cancels the loop, particle counts 60 / 80.

---

## 9. Responsive & Accessibility

Breakpoints used: **1180** (nav/hero), **1020** (grids, footer), **900**
(nav drawer, hero), **880** (split/timeline), **760** (nav, footer,
back-top), **720** (grids), **560** (hero, masonry, shell), **520**
(footer); plus `max-height:700px` (short viewport hero).

Accessibility present: `aria-label`s on nav/buttons/forms, `aria-expanded`
toggles, `role=search`, `role=status`+`aria-live=polite` for form feedback,
`aria-hidden` on decorative canvases/videos, `alt` text on every image,
`datetime` on news dates, skippable via skip anchor (`#home`), focus-visible
styles, full `prefers-reduced-motion` support, noscript fallback.

---

## 10. Content Voice & Tone

- "Premium heritage brochure" — formal, evocative, aspirational.
- Recurring motifs: *Ganga*, *fort*, *temples/faith*, *artisans/handlooms*,
  **commerce**, *sunrise*.
- Headlines use the "X as Y" / imperative pattern:
  "A City Where History Meets the Future", "Walk Through Centuries of
  History", "Discover Local Businesses", "Moments That Define Buxar".
- Names: **Ram Rekha Ghat**, **Buxar Fort**, **Ashok Dham Temple**,
  **Ganga River**. History beats: Ramayana-era ghats → **Battle of Buxar
  1764** → modern trading town.
- Hindi is a faithful, slightly formal translation (not a transliteration).

---

## 11. Notes / Known Gaps

1. **Placeholder links:** all `Explore … →` CTAs, Login, news cards,
   gallery items, social/legal/footer "Destinations" links are `href="#"`.
2. **Legacy hero CSS:** `style.css` lines ~523–637 define an **older,
   unused hero** (`.hero__center`, `.hero__eyebrow`, `.hero__button`,
   `.hero__rule`, `.hero__foot`) that the current markup doesn't use —
   `hero.css` is the live one. Safe to delete after verification.
3. **Unused images:** `hero-buxar.jpg`, `hero-buxar-bridge.jpg`,
   `hero-buxar-paddy.jpg`, `bihar-map.svg` are not referenced by markup.
4. **Newsletter form** is visual-only (no endpoint, no validation beyond
   HTML5 `type=email` + `checkValidity`).
5. **Search input** has no behaviour wired beyond open/focus/close.
6. **Section backgrounds use `background-attachment: fixed`** — on some
   iOS/browser combos that's ignored or janky; consider a disable
   media-query fallback.
7. **Hard-coded colours** in sections.css (by design) mean light theme
   doesn't restyle content sections.

---

## 12. Quick-Start for Contributors

1. Copy every section header verbatim (label/title/sub + `data-en/data-hi`)
   for consistent rhythm.
2. Add new content in a `<section id="…" class="section …">` with a
   `.shell` + `.section__head reveal` + card grid + `.section__cta`.
3. Use tokens for anything chrome-level; hard values are fine inside paper
   sections (match `#f8f6f2`/`#081c33`/`#9a7b24`/gold).
4. Add any interactive behaviour to the matching existing IIFE or a new
   plain `.js`; new images go in `assets/`.
5. `prefers-reduced-motion` + `.reveal` fallback + alt text are mandatory.
6. Run nothing — there is no lint/test/build. Verify by opening
   `index.html` locally (loader maps need no server).