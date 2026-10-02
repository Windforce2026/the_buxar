/* ------------------------------------------------------------------ */
/* TheBuxar.com — Marketplace behaviours (pure vanilla, no deps)       */
/*                                                                     */
/* Load after js/market-data.js, the single source of truth for        */
/* products, sellers, categories and areas. This file renders every      */
/* part of the module from that dataset and wires the interactions.     */
/*                                                                     */
/* Page wiring (inline in each page, before this script):              */
/*   <script>window.TheBuxarConfig = { path: './' }</script>           */
/* At the site root path is './'; inside marketplace/ it is '../' so    */
/* links and image URLs resolve from the nested folder.                 */
/*                                                                     */
/* Rendering: section content mounts through the generic [data-mk]     */
/* hook, so a page only declares where content goes, never what it     */
/* contains. Pages:                                                    */
/*   marketplace.html              landing                              */
/*   marketplace/list.html         results + filters (?q ?cat ?loc …)  */
/*   marketplace/product.html      one product   (?slug)                */
/*   marketplace/seller.html       one seller    (?slug)                */
/*   marketplace/cart.html         cart + summary                       */
/*   marketplace/wishlist.html     saved products                       */
/*   marketplace/checkout.html     checkout structure, coming soon      */
/*   marketplace/sell.html         seller onboarding form               */
/*   marketplace/sell-product.html product submission form              */
/*                                                                     */
/* Data honesty: a field is only drawn when the record carries it.     */
/* No price, discount, rating, stock figure, specification, cultural    */
/* story or contact detail is ever synthesised — the matching honest   */
/* empty state is shown instead. Cart actions write to this browser's  */
/* localStorage only; no order is placed and no payment is taken.       */
/*                                                                     */
/* Language: content is chosen via M.get() at render time and the     */
/* <html data-lang> change is observed so the module re-renders.        */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var M = window.TheBuxarMarket
  if (!M) return

  var doc = document
  var PAGE_SIZE = 8

  /* Set by initLightbox so a language re-render can tear the previous
     dialog and its document-level keydown handler down instead of
     leaking a new one each time. */
  var lbTeardown = null

  var CONFIG = window.TheBuxarConfig || {}
  M.path = typeof CONFIG.path === 'string' ? CONFIG.path : ''

  var reduceMotion = (function () {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) { return false }
  })()

  /* ------------------------------------------------------------------ */
  /* Small helpers                                                      */
  /* ------------------------------------------------------------------ */

  function esc (s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }

  function t (key) { return M.get(M.ui[key]) }

  function icon (name) { return M.icons[name] || M.icons.box }

  function catName (slug) { var c = M.catBySlug(slug); return c ? M.get(c.name) : '' }
  function areaName (slug) { var a = M.areaBySlug(slug); return a ? M.get(a.name) : '' }
  function sellerRec (slug) { return M.sellerBySlug(slug) }
  function sellerName (p) {
    if (p.sellerSlug && sellerRec(p.sellerSlug)) return M.get(sellerRec(p.sellerSlug).name)
    return p.sellerName ? M.get(p.sellerName) : ''
  }

  /* Price block. Both the current price and the struck-through original
     are drawn only when the record carries the number, and the discount
     badge only when the original is genuinely higher. A record with no
     price says so instead of showing a number nobody published. */
  function priceBlock (p, cls) {
    var now = M.formatPrice(p.price)
    var was = M.formatPrice(p.compareAtPrice)
    var pct = M.discountPct(p.price, p.compareAtPrice)
    if (now === null) {
      return '<p class="' + cls + '-pending">' + esc(t('pricePending')) + '</p>'
    }
    return '<p class="' + cls + '">' +
      '<span class="' + cls + '-now">' + esc(now) + '</span>' +
      (was !== null ? '<span class="' + cls + '-old">' + esc(was) + '</span>' : '') +
      (pct !== null ? '<span class="mk-card__disc">' + pct + '% off</span>' : '') +
    '</p>'
  }

  function demoChip (rec) {
    return rec.demo === true ? '<span class="mk-chip mk-chip--demo">' + esc(t('demoBadge')) + '</span>' : ''
  }

  /* Verified badges are driven purely by the record's own flag, so an
     unverified placeholder can never imply an authenticity claim. */
  function verifiedChip (rec) {
    return M.isVerified(rec)
      ? '<span class="mk-chip mk-chip--verified">' + icon('check') + esc(t('verifiedSeller')) + '</span>'
      : ''
  }

  function stars (p) {
    if (p.rating === null || p.rating === undefined) return ''
    var full = Math.round(Number(p.rating))
    var out = '<span class="mk-stars" aria-label="' + esc(String(p.rating)) + '">'
    for (var i = 1; i <= 5; i++) out += '<span class="mk-star' + (i <= full ? ' is-on' : '') + '">' + icon('star') + '</span>'
    return out + '</span>'
  }

  function countLabel (n) {
    return n + ' ' + (n === 1 ? t('product') : t('products'))
  }

  /* ------------------------------------------------------------------ */
  /* Media + placeholders                                               */
  /* ------------------------------------------------------------------ */

  /* A product photo is only rendered when the seller actually supplied
     one. No record carries an image yet, so cards show a typographic
     monogram tile and an honest "photo pending" note instead of a stock
     photograph that would misrepresent the product. */
  function media (p, cls, eager) {
    var img = p.images && p.images.length ? p.images[0] : null
    if (img) {
      var src = img.src || img
      return '<img class="' + cls + '__img" src="' + M.path + esc(src) + '" alt="' + esc(M.get(p.name)) + '"' +
        (eager ? '' : ' loading="lazy" decoding="async"') + ' />'
    }
    return '<span class="' + cls + '__ph" aria-hidden="true">' +
      '<span class="mk-card__mono">' + esc(M.monogram(p.name)) + '</span>' +
      '<span class="mk-card__photo-note">' + esc(t('photoPending')) + '</span>' +
    '</span>'
  }

  /* ------------------------------------------------------------------ */
  /* Product card                                                       */
  /* ------------------------------------------------------------------ */

  function productCard (p, opts) {
    opts = opts || {}
    var url = M.productUrl(p)
    var cat = catName(p.category)
    var sub = p.subcategory ? M.get(p.subcategory.name) : ''
    var area = areaName(p.location)
    var wished = M.store.inWishlist(p.slug)

    return '' +
      '<article class="mk-card reveal" data-slug="' + esc(p.slug) + '">' +
        '<a class="mk-card__media" href="' + esc(url) + '" tabindex="-1" aria-hidden="true">' + media(p, 'mk-card') + '</a>' +
        '<button type="button" class="mk-card__wish' + (wished ? ' is-active' : '') + '" data-mk-wish="' + esc(p.slug) + '"' +
          ' aria-pressed="' + (wished ? 'true' : 'false') + '" title="' + esc(t('wishlist')) + '">' + icon('heart') + '</button>' +
        '<div class="mk-card__body">' +
          '<p class="mk-card__cat">' + esc(cat) + (sub ? ' <span class="mk-dot">·</span> ' + esc(sub) : '') + '</p>' +
          '<h3 class="mk-card__name"><a href="' + esc(url) + '">' + esc(M.get(p.name)) + '</a></h3>' +
          '<p class="mk-card__seller">' + esc(sellerName(p)) + '</p>' +
          (area ? '<p class="mk-card__loc">' + icon('pin') + '<span>' + esc(area) + '</span></p>' : '') +
          priceBlock(p, 'mk-card__price') +
          '<div class="mk-card__meta">' + demoChip(p) + verifiedChip(p) + stars(p) + '</div>' +
          '<div class="mk-card__foot">' +
            '<a class="mk-card__cta" href="' + esc(url) + '">' + esc(t('viewProduct')) + '</a>' +
            '<button type="button" class="mk-card__cart" data-mk-add="' + esc(p.slug) + '">' +
              icon('cart') + '<span>' + esc(t('addToCart')) + '</span></button>' +
          '</div>' +
        '</div>' +
      '</article>'
  }

  /* ------------------------------------------------------------------ */
  /* Seller card                                                        */
  /* ------------------------------------------------------------------ */

  function sellerCard (s) {
    var n = M.productsBySeller(s.slug).length
    var logo = s.logo
      ? '<img src="' + M.path + esc(s.logo) + '" alt="' + esc(M.get(s.name)) + ' logo" loading="lazy" decoding="async" />'
      : '<span class="mk-seller__mono">' + esc(M.monogram(s.name)) + '</span>'

    return '' +
      '<article class="mk-seller reveal">' +
        '<a class="mk-seller__logo" href="' + esc(M.sellerUrl(s)) + '" tabindex="-1" aria-hidden="true">' + logo + '</a>' +
        '<div class="mk-seller__body">' +
          '<h3 class="mk-seller__name"><a href="' + esc(M.sellerUrl(s)) + '">' + esc(M.get(s.name)) + '</a></h3>' +
          '<p class="mk-card__loc">' + icon('pin') + '<span>' + esc(areaName(s.areaSlug)) + '</span></p>' +
          (s.description ? '<p class="mk-seller__desc">' + esc(M.get(s.description)) + '</p>' : '') +
          '<div class="mk-card__meta">' +
            demoChip(s) + verifiedChip(s) +
            '<span class="mk-chip">' + esc(countLabel(n)) + '</span>' +
          '</div>' +
        '</div>' +
        '<a class="mk-seller__cta" href="' + esc(M.sellerUrl(s)) + '">' + esc(t('viewStore')) + '</a>' +
      '</article>'
  }

  /* ------------------------------------------------------------------ */
  /* Skeletons + empty states                                           */
  /* ------------------------------------------------------------------ */

  function skeletonCards (n) {
    var out = ''
    for (var i = 0; i < n; i++) {
      out += '<div class="mk-card mk-card--skel" aria-hidden="true">' +
        '<span class="mk-skel mk-card__media"></span>' +
        '<div class="mk-card__body">' +
          '<span class="mk-skel mk-skel--line" style="width:38%"></span>' +
          '<span class="mk-skel mk-skel--line" style="width:74%;height:22px"></span>' +
          '<span class="mk-skel mk-skel--line" style="width:52%"></span>' +
          '<span class="mk-skel mk-skel--line" style="width:100%;height:44px"></span>' +
        '</div></div>'
    }
    return out
  }

  function skeletonList (n) {
    var out = ''
    for (var i = 0; i < n; i++) {
      out += '<div class="mk-cart__item mk-cart__item--skel" aria-hidden="true">' +
        '<span class="mk-skel" style="width:88px;height:88px"></span>' +
        '<div><span class="mk-skel mk-skel--line" style="width:60%"></span>' +
        '<span class="mk-skel mk-skel--line" style="width:40%"></span></div>' +
        '<span class="mk-skel" style="width:64px;height:24px"></span></div>'
    }
    return out
  }

  function skeletonDetail () {
    return '<div class="mk-detail" aria-hidden="true">' +
      '<div><span class="mk-skel" style="aspect-ratio:1/1;display:block"></span></div>' +
      '<div class="mk-buy"><span class="mk-skel" style="width:70%;height:38px"></span>' +
      '<span class="mk-skel" style="width:40%"></span>' +
      '<span class="mk-skel" style="width:100%;height:54px"></span>' +
      '<span class="mk-skel" style="width:100%;height:54px"></span></div></div>'
  }

  /* Empty states are designed states, not blank pages. Every one of them
     says what is missing and offers the next honest action. */
  function emptyState (mark, title, sub, action) {
    return '<div class="mk-empty" role="status">' +
      '<span class="mk-empty__mark" aria-hidden="true">' + icon(mark || 'search') + '</span>' +
      '<h3 class="mk-empty__title">' + esc(title) + '</h3>' +
      '<p class="mk-empty__sub">' + esc(sub) + '</p>' +
      (action || '') +
    '</div>'
  }

  /* ------------------------------------------------------------------ */
  /* Section shells                                                     */
  /* ------------------------------------------------------------------ */

  function section (opts, inner) {
    return '<section class="mk-section' + (opts.tight ? ' mk-section--tight' : '') + (opts.id ? ' id="' + esc(opts.id) + '"' : '') + '">' +
      '<div class="mk-shell">' +
        (opts.title
          ? '<header class="mk-head reveal">' +
              (opts.label ? '<p class="mk-label">' + esc(opts.label) + '</p>' : '') +
              '<h2 class="mk-title serif">' + esc(opts.title) + '</h2>' +
              (opts.sub ? '<p class="mk-sub">' + esc(opts.sub) + '</p>' : '') +
            '</header>'
          : '') +
        inner +
        (opts.cta ? '<div class="mk-cta"><a class="btn btn--ink" href="' + esc(opts.cta) + '">' + esc(opts.ctaText || t('browseAll')) + '</a></div>' : '') +
      '</div></section>'
  }

  function grid (list, limit) {
    var items = limit ? list.slice(0, limit) : list
    return '<div class="mk-grid">' + items.map(function (p) { return productCard(p) }).join('') + '</div>'
  }

  /* ------------------------------------------------------------------ */
  /* Mounts                                                             */
  /* ------------------------------------------------------------------ */

  var MOUNT = {}

  /* Featured products, newest first. data-limit keeps the homepage
     preview to four cards while the landing page shows the full set. */
  MOUNT.featured = function (host) {
    var n = parseInt(host.getAttribute('data-limit'), 10) || 0
    var list = M.products.slice().sort(function (a, b) {
      return String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    })
    var featured = list.filter(function (p) { return p.featured === true })
    var use = featured.length ? featured : list
    host.innerHTML = grid(use, n || 6)
    if (n && list.length > n) {
      host.insertAdjacentHTML('afterend',
        '<p class="mk-hint">' + esc(t('moreProductsNote')) + '</p>')
    }
  }

  /* "Just Arrived" — ordered by each product's own createdAt. */
  MOUNT.newArrivals = function (host) {
    var n = parseInt(host.getAttribute('data-limit'), 10) || 8
    var list = M.products.slice().sort(function (a, b) {
      return String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    })
    host.innerHTML = grid(list, n)
  }

  /* Only categories a product actually uses reach the grid, so no empty
     category is ever advertised. */
  MOUNT.categories = function (host) {
    var all = M.activeCategories()
    var lim = parseInt(host.getAttribute('data-limit'), 10)
    var cats = lim > 0 ? all.slice(0, lim) : all
    host.innerHTML = '<div class="mk-catgrid">' + cats.map(function (c) {
      return '<a class="mk-catgrid__item reveal" href="' + esc(M.categoryUrl(c.slug)) + '">' +
        '<span class="mk-catgrid__icon">' + icon(c.icon) + '</span>' +
        '<span class="mk-catgrid__name">' + esc(M.get(c.name)) + '</span>' +
        '<span class="mk-catgrid__blurb">' + esc(M.get(c.blurb)) + '</span>' +
        '<span class="mk-card__cat">' + M.countIn(c.slug) + ' · ' + esc(t('products')) + '</span>' +
      '</a>'
    }).join('') + '</div>' +
    (all.length < M.categories.length ? '<p class="mk-hint">' + esc(t('moreCatsNote')) + '</p>' : '')
  }

  /* Local sellers, human-first. */
  MOUNT.sellers = function (host) {
    var sellers = M.activeSellers()
    host.innerHTML = sellers.length
      ? sellers.map(sellerCard).join('')
      : emptyState('store', t('noSellers'), t('noSellersSub'))
  }

  /* "Shop by Interest" — each tile is a saved query, and it only appears
     when at least one product satisfies it. */
  MOUNT.interests = function (host) {
    var tiles = M.activeInterests()
    host.innerHTML = tiles.length
      ? '<div class="mk-interest">' + tiles.map(function (x) {
          return '<a class="mk-interest__item reveal" href="' + esc(M.interestUrl(x.interest)) + '">' +
            '<span class="mk-catgrid__icon">' + icon(x.interest.icon) + '</span>' +
            '<span class="mk-catgrid__name">' + esc(M.get(x.interest.name)) + '</span>' +
            '<span class="mk-card__cat">' + x.count + ' · ' + esc(t('products')) + '</span>' +
          '</a>'
        }).join('') + '</div>'
      : emptyState('search', t('noProducts'), t('noProductsSub'))
  }

  /* Shop Local — the six Explore Buxar areas, with real product counts.
     An area with no listings is still named (Buxar has six areas), but it
     is not a link: sending someone to a listing page that can only say
     "nothing here" is a dead end, not a feature. */
  MOUNT.areas = function (host) {
    host.innerHTML = '<div class="mk-area">' + M.areas.map(function (a) {
      var n = M.countIn(null, a.slug)
      var body = '<span><span class="mk-area__name">' + esc(M.get(a.name)) + '</span><br />' +
        '<span class="mk-card__cat">' + (n
          ? n + ' · ' + esc(t('products'))
          : '<span class="mk-area__none">' + esc(t('noListings')) + '</span>') + '</span></span>'
      if (!n) {
        return '<span class="mk-area__item mk-area__item--none reveal" aria-disabled="true">' +
          body + '</span>'
      }
      return '<a class="mk-area__item reveal" href="' + esc(M.areaUrl(a.slug)) + '">' + body +
        '<span class="mk-seller__cta">' + esc(t('viewAll')) + ' →</span></a>'
    }).join('') + '</div>'
  }

  /* Bestsellers. Every record has salesCount 0, so no product is ranked
     or called popular — the section says it is waiting for order data. */
  MOUNT.bestsellers = function (host) {
    var list = M.products.filter(function (p) { return p.salesCount > 0 })
      .sort(function (a, b) { return b.salesCount - a.salesCount })
    if (!list.length) {
      host.innerHTML = emptyState('star', t('bestTitle') + ' — ' + t('comingSoon'), t('bestSub'))
      return
    }
    host.innerHTML = grid(list, 8)
  }

  /* A future curated collection. It claims no certification and lists no
     curation, because none has happened. */
  MOUNT.collection = function (host) {
    host.innerHTML = '<div class="mk-collection reveal">' +
      '<p class="mk-label">' + esc(t('collectionLabel')) + '</p>' +
      '<h2 class="mk-title serif" style="color:#fff;margin:14px 0 12px">' + esc(t('collectionTitle')) + '</h2>' +
      '<p class="mk-sub" style="color:rgba(255,255,255,.8)">' + esc(t('collectionSub')) + '</p>' +
      '<div class="mk-cta" style="justify-content:flex-start">' +
        '<a class="btn btn--gold" href="' + esc(M.listUrl()) + '">' + esc(t('exploreCollection')) + '</a>' +
      '</div></div>'
  }

  /* Seller onboarding call to action. */
  MOUNT.sellCta = function (host) {
    host.innerHTML = '<div class="mk-cta-strip reveal">' +
      '<p class="mk-label">' + esc(t('sellLabel')) + '</p>' +
      '<h2 class="mk-title serif">' + esc(t('sellTitle')) + '</h2>' +
      '<p class="mk-sub">' + esc(t('sellSub')) + '</p>' +
      '<div class="mk-cta-strip__acts">' +
        '<a class="btn btn--ink" href="' + esc(M.sellUrl()) + '">' + esc(t('startSelling')) + '</a>' +
        '<a class="btn btn--gold" href="' + esc(M.sellProductUrl()) + '">' + esc(t('submitProduct')) + '</a>' +
      '</div></div>'
  }

  /* Tourism cross-link: LOCAL PRODUCTS TO TAKE HOME. Only products that
     a seller has actually listed are shown. */
  MOUNT.takeHome = function (host) {
    var n = parseInt(host.getAttribute('data-limit'), 10) || 4
    var list = M.products.slice().sort(function (a, b) {
      return String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    }).slice(0, n)
    if (!list.length) {
      host.innerHTML = emptyState('box', t('takeHomeTitle'), t('takeHomeSub'))
      return
    }
    host.innerHTML = '<div class="mk-grid">' + list.map(function (p) { return productCard(p) }).join('') + '</div>' +
      '<div class="mk-cta"><a class="btn btn--ink" href="' + esc(M.marketUrl()) + '">' + esc(t('ctaAll')) + '</a></div>'
  }

  /* Business Directory cross-link: PRODUCTS FROM THIS BUSINESS. Sellers
     opt in through their businessSlug field, so the section stays empty
     (with an explanation) until a seller is actually linked. */
  MOUNT.fromBusiness = function (host) {
    var bizSlug = host.getAttribute('data-slug')
    var sellers = M.sellers.filter(function (s) { return s.businessSlug === bizSlug })
    var products = []
    sellers.forEach(function (s) {
      products = products.concat(M.productsBySeller(s.slug))
    })
    if (!products.length) {
      host.innerHTML = emptyState('store', t('fromBizTitle'), t('noFromBiz'))
      return
    }
    host.innerHTML = grid(products, 8)
  }

  /* Cart + wishlist counts rendered into the header. The nav is shared
     markup, so the badge is injected by this module rather than edited
     into every page. */
  MOUNT.cartCount = function (host) {
    host.textContent = String(M.store.cart().length)
    var wl = doc.querySelector('[data-mk="wishCount"]')
    if (wl) wl.textContent = String(M.store.wishlist().length)
  }

  /* ------------------------------------------------------------------ */
  /* Listing page: query state, filter rail, sort, load more            */
  /* ------------------------------------------------------------------ */

  var state = {
    q: '',
    cat: [],
    sub: [],
    seller: [],
    loc: [],
    priceMin: '',
    priceMax: '',
    avail: '',
    rating: '',
    sort: 'newest',
    shown: PAGE_SIZE
  }

  function params () {
    var p = {}
    try {
      var sp = new URLSearchParams(doc.defaultView.location.search)
      sp.forEach(function (v, k) { p[k] = v })
    } catch (e) { /* file:// with no query is fine */ }
    return p
  }

  function readState () {
    var p = params()
    state.q = (p.q || '').trim()
    state.cat = p.cat ? p.cat.split(',').filter(Boolean) : []
    state.sub = p.sub ? p.sub.split(',').filter(Boolean) : []
    state.seller = p.seller ? p.seller.split(',').filter(Boolean) : []
    state.loc = p.loc ? p.loc.split(',').filter(Boolean) : []
    state.priceMin = p.pmin || ''
    state.priceMax = p.pmax || ''
    state.avail = p.avail || ''
    state.rating = p.rating || ''
    state.sort = p.sort || (state.q ? 'relevance' : 'newest')
    if (state.sort === 'relevance' && !state.q) state.sort = 'newest'
    state.shown = PAGE_SIZE
  }

  function syncUrl () {
    var sp = []
    if (state.q) sp.push('q=' + encodeURIComponent(state.q))
    if (state.cat.length) sp.push('cat=' + state.cat.join(','))
    if (state.sub.length) sp.push('sub=' + state.sub.join(','))
    if (state.seller.length) sp.push('seller=' + state.seller.join(','))
    if (state.loc.length) sp.push('loc=' + state.loc.join(','))
    if (state.priceMin) sp.push('pmin=' + encodeURIComponent(state.priceMin))
    if (state.priceMax) sp.push('pmax=' + encodeURIComponent(state.priceMax))
    if (state.avail) sp.push('avail=' + state.avail)
    if (state.rating) sp.push('rating=' + state.rating)
    if (state.sort !== 'newest') sp.push('sort=' + state.sort)
    var qs = sp.join('&')
    try {
      doc.defaultView.history.replaceState(null, '', qs ? '?' + qs : doc.defaultView.location.pathname)
    } catch (e) {}
  }

  /* Facets are derived from the dataset, so a control can only appear
     when at least one record backs it. Price, availability and rating
     are absent on every record today, which is exactly why those groups
     do not render. */
  function facetData () {
    var subs = M.activeSubcategories()
    if (state.cat.length) {
      subs = subs.filter(function (x) { return state.cat.indexOf(x.cat) > -1 })
    }
    return {
      cats: M.activeCategories(),
      subs: subs,
      sellers: M.activeSellers(),
      locs: M.areas.filter(function (a) { return M.countIn(null, a.slug) > 0 }),
      price: M.hasPrice(),
      bounds: M.priceBounds(),
      avail: M.hasAvailability(),
      ratings: M.hasRatings(),
      verified: M.hasVerified()
    }
  }

  function group (id, legend, name, items, kind) {
    if (!items.length) return ''
    var boxes = items.map(function (it) {
      var val = kind === 'sub' ? it.cat + '/' + it.sub.slug : it.slug
      var label = kind === 'sub' ? M.get(it.sub.name) : M.get(it.name)
      var on = state[kind].indexOf(kind === 'sub' ? val : it.slug) > -1
      return '<label class="mk-check">' +
        '<input type="checkbox" name="' + name + '" value="' + esc(val) + '"' + (on ? ' checked' : '') + ' />' +
        '<span class="mk-check__box" aria-hidden="true">' + icon('check') + '</span>' +
        '<span class="mk-check__label">' + esc(label) + '</span>' +
        '<span class="mk-check__n">' + countFor(kind, val) + '</span>' +
      '</label>'
    }).join('')
    return '<fieldset class="mk-group" data-group="' + id + '"><legend class="mk-group__legend">' + esc(legend) + '</legend>' + boxes + '</fieldset>'
  }

  function countFor (kind, val) {
    return M.products.filter(function (p) {
      if (kind === 'cat' && p.category !== val) return false
      if (kind === 'sub' && (!p.subcategory || p.category + '/' + p.subcategory.slug !== val)) return false
      if (kind === 'seller' && p.sellerSlug !== val) return false
      if (kind === 'loc' && p.location !== val) return false
      return true
    }).length
  }

  function renderFilters (host, d) {
    var html = group('cat', t('fCategory'), 'cat', d.cats, 'cat')
    if (d.subs.length) html += group('sub', t('fSubcategory'), 'sub', d.subs, 'sub')
    html += group('seller', t('fSeller'), 'seller', d.sellers, 'seller')
    html += group('loc', t('fLocation'), 'loc', d.locs, 'loc')

    /* Price range only when at least one product carries a price. */
    if (d.price && d.bounds) {
      html += '<fieldset class="mk-group" data-group="price"><legend class="mk-group__legend">' + esc(t('fPrice')) + '</legend>' +
        '<div class="mk-check"><input type="number" inputmode="numeric" name="pmin" placeholder="' + esc(String(d.bounds.min)) + '" value="' + esc(state.priceMin) + '" min="' + esc(String(d.bounds.min)) + '" max="' + esc(String(d.bounds.max)) + '" /></div>' +
        '<div class="mk-check"><input type="number" inputmode="numeric" name="pmax" placeholder="' + esc(String(d.bounds.max)) + '" value="' + esc(state.priceMax) + '" min="' + esc(String(d.bounds.min)) + '" max="' + esc(String(d.bounds.max)) + '" /></div>' +
        '</fieldset>'
    }

    /* Availability only when some record states it. */
    if (d.avail) {
      html += '<fieldset class="mk-group" data-group="avail"><legend class="mk-group__legend">' + esc(t('fAvailability')) + '</legend>' +
        '<label class="mk-check"><input type="checkbox" name="avail" value="in"' + (state.avail === 'in' ? ' checked' : '') + ' />' +
        '<span class="mk-check__box" aria-hidden="true">' + icon('check') + '</span>' +
        '<span class="mk-check__label">' + esc(t('inStock')) + '</span></label></fieldset>'
    }

    /* Rating only once real reviews exist. */
    if (d.ratings) {
      html += '<fieldset class="mk-group" data-group="rating"><legend class="mk-group__legend">' + esc(t('fRating')) + '</legend>' +
        '<label class="mk-check"><input type="checkbox" name="rating" value="4"' + (state.rating === '4' ? ' checked' : '') + ' />' +
        '<span class="mk-check__box" aria-hidden="true">' + icon('check') + '</span>' +
        '<span class="mk-check__label">4 &amp; ' + esc(t('fRating')) + '</span></label></fieldset>'
    }

    if (!d.price || !d.avail || !d.ratings) {
      html += '<p class="mk-hint" style="text-align:left">' + esc(t('fHiddenNote')) + '</p>'
    }

    html += '<div class="mk-filters__foot">' +
      '<button type="button" class="btn btn--ink mk-filters__apply" data-mk-close-sheet>' + esc(t('applyFilters')) + '</button>' +
      '<button type="button" class="mk-filters__clear" data-mk-clear>' + esc(t('clearFilters')) + '</button>' +
    '</div>'

    host.innerHTML = html
  }

  /* Sort options are gated the same way: the two price orders only
     appear when a real price exists, and "Relevance" only makes sense
     while there is a query. */
  function sortOptions () {
    var opts = []
    if (state.q) opts.push({ v: 'relevance', l: t('sortRelevance') })
    opts.push({ v: 'newest', l: t('sortNewest') })
    if (M.hasPrice()) {
      opts.push({ v: 'price-asc', l: t('sortPriceAsc') })
      opts.push({ v: 'price-desc', l: t('sortPriceDesc') })
    }
    opts.push({ v: 'name', l: t('sortName') })
    return opts
  }

  function renderSort (host) {
    host.innerHTML = '<label class="mk-sort"><span class="mk-sort__label">' + esc(t('sortBy')) + '</span>' +
      '<select class="mk-sort__select" name="sort">' +
      sortOptions().map(function (o) {
        return '<option value="' + o.v + '"' + (state.sort === o.v ? ' selected' : '') + '>' + esc(o.l) + '</option>'
      }).join('') + '</select></label>'
  }

  function apply () {
    var q = state.q.toLowerCase()
    var lo = state.priceMin === '' ? null : Number(state.priceMin)
    var hi = state.priceMax === '' ? null : Number(state.priceMax)

    var list = M.products.filter(function (p) {
      if (state.cat.length && state.cat.indexOf(p.category) === -1) return false
      if (state.sub.length) {
        var key = p.subcategory ? p.category + '/' + p.subcategory.slug : ''
        var hit = state.sub.some(function (v) { return v === key })
        if (!hit) return false
      }
      if (state.seller.length && state.seller.indexOf(p.sellerSlug) === -1) return false
      if (state.loc.length && state.loc.indexOf(p.location) === -1) return false
      if (lo !== null || hi !== null) {
        /* A product with no price cannot satisfy a price range, and is
           not silently treated as free. */
        var v = p.price === null || p.price === undefined || isNaN(Number(p.price)) ? null : Number(p.price)
        if (v === null) return false
        if (lo !== null && v < lo) return false
        if (hi !== null && v > hi) return false
      }
      if (state.avail === 'in') {
        if (!(p.stock > 0)) return false
      }
      if (state.rating) {
        if (p.rating === null || p.rating === undefined) return false
        if (Number(p.rating) < Number(state.rating)) return false
      }
      if (q && M.searchTerms(p).indexOf(q) === -1) return false
      return true
    })

    if (state.sort === 'name') {
      list.sort(function (a, b) { return M.get(a.name).localeCompare(M.get(b.name)) })
    } else if (state.sort === 'relevance') {
      list.sort(function (a, b) {
        var d = M.score(b, q) - M.score(a, q)
        return d !== 0 ? d : M.get(a.name).localeCompare(M.get(b.name))
      })
    } else if (state.sort === 'price-asc' || state.sort === 'price-desc') {
      /* Products with no price sink to the bottom of a price order rather
         than being treated as zero. */
      var dir = state.sort === 'price-asc' ? 1 : -1
      list.sort(function (a, b) {
        var av = a.price === null || a.price === undefined || isNaN(Number(a.price)) ? null : Number(a.price)
        var bv = b.price === null || b.price === undefined || isNaN(Number(b.price)) ? null : Number(b.price)
        if (av === null && bv === null) return M.get(a.name).localeCompare(M.get(b.name))
        if (av === null) return 1
        if (bv === null) return -1
        return av === bv ? 0 : (av - bv) * dir
      })
    } else {
      list.sort(function (a, b) {
        return String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
      })
    }
    return list
  }

  function resultTitle () {
    if (state.q) return t('resultsFor') + ' “' + state.q + '”'
    if (state.cat.length === 1) return catName(state.cat[0]) + ' in Buxar'
    if (state.loc.length === 1) return t('productsIn') + ' ' + areaName(state.loc[0])
    if (state.seller.length === 1) {
      var s = sellerRec(state.seller[0])
      return s ? M.get(s.name) : t('resultsTitle')
    }
    return t('resultsTitle')
  }

  function renderResults () {
    var gridEl = doc.getElementById('mk-grid')
    var countEl = doc.getElementById('mk-count')
    var more = doc.getElementById('mk-more')
    var emptyHost = doc.getElementById('mk-empty-host')
    var titleEl = doc.getElementById('mk-results-title')
    if (!gridEl) return

    var list = apply()
    var slice = list.slice(0, state.shown)

    if (titleEl) titleEl.textContent = resultTitle()
    if (countEl) {
      countEl.textContent = list.length
        ? t('showing') + ' ' + Math.min(state.shown, list.length) + ' ' + t('of') + ' ' + list.length + ' ' + t('products')
        : '0 ' + t('products')
    }

    /* No matches is its own designed state with a way out, never a blank
       grid. */
    if (!list.length) {
      gridEl.innerHTML = ''
      gridEl.hidden = true
      if (emptyHost) {
        emptyHost.innerHTML = emptyState('search', t('noProducts'), t('noProductsSub'),
          '<button type="button" class="btn btn--ink" data-mk-clear>' + esc(t('clearFilters')) + '</button>')
      }
      if (more) more.hidden = true
      return
    }

    if (emptyHost) emptyHost.innerHTML = ''
    gridEl.hidden = false
    gridEl.innerHTML = slice.map(function (p) { return productCard(p) }).join('')
    if (more) more.hidden = slice.length >= list.length
    revealNow(gridEl)
  }

  function clearAll () {
    state.q = ''
    state.cat = []; state.sub = []; state.seller = []; state.loc = []
    state.priceMin = ''; state.priceMax = ''
    state.avail = ''; state.rating = ''
    state.sort = 'newest'
    state.shown = PAGE_SIZE
    var qi = doc.getElementById('mk-q')
    if (qi) qi.value = ''
    var fi = doc.getElementById('mk-filters')
    if (fi) renderFilters(fi, facetData())
    var si = doc.getElementById('mk-sheet-filters')
    if (si) renderFilters(si, facetData())
    var so = doc.getElementById('mk-sort')
    if (so) renderSort(so)
    syncUrl()
    renderResults()
  }

  /* Re-reads state from the URL and repaints. Safe to call repeatedly:
     it only writes innerHTML and values, never binds a listener. */
  function refreshList () {
    if (!doc.getElementById('mk-grid')) return
    readState()

    var qi = doc.getElementById('mk-q')
    if (qi) qi.value = state.q

    var d = facetData()
    var fi = doc.getElementById('mk-filters')
    if (fi) renderFilters(fi, d)
    var si = doc.getElementById('mk-sheet-filters')
    if (si) renderFilters(si, d)
    var so = doc.getElementById('mk-sort')
    if (so) renderSort(so)

    syncUrl()
    renderResults()
  }

  function initList () {
    if (!doc.getElementById('mk-grid')) return

    /* Listeners bind exactly once. refreshList() is what the language
       observer calls, so flipping the language repaints the grid without
       stacking a second copy of every handler. */
    if (doc.body.getAttribute('data-mk-bound')) return
    doc.body.setAttribute('data-mk-bound', '1')

    /* Hero search on the landing page jumps straight into results. */
    var heroForm = doc.getElementById('mk-hero-form')
    if (heroForm) {
      heroForm.addEventListener('submit', function (e) {
        e.preventDefault()
        var input = heroForm.querySelector('input[name="q"]')
        var q = input ? input.value.trim() : ''
        doc.defaultView.location.href = q
          ? M.listUrl('?q=' + encodeURIComponent(q))
          : M.listUrl()
      })
    }

    var bar = doc.getElementById('mk-bar-form')
    if (bar) {
      bar.addEventListener('submit', function (e) {
        e.preventDefault()
        var input = bar.querySelector('input[name="q"]')
        state.q = input ? input.value.trim() : ''
        state.shown = PAGE_SIZE
        syncUrl()
        renderResults()
      })
    }

    function onFacetChange (e) {
      var el = e.target
      if (!el || !el.name) return
      if (el.name === 'sort') {
        state.sort = el.value
      } else if (el.name === 'pmin' || el.name === 'pmax') {
        state[el.name === 'pmin' ? 'priceMin' : 'priceMax'] = el.value.trim()
      } else if (el.name === 'avail') {
        state.avail = el.checked ? 'in' : ''
      } else if (el.name === 'rating') {
        state.rating = el.checked ? '4' : ''
      } else if (['cat', 'sub', 'seller', 'loc'].indexOf(el.name) > -1) {
        state[el.name] = state[el.name].filter(function (v) { return v !== el.value })
        if (el.checked) state[el.name].push(el.value)
        /* Narrowing the category invalidates a subcategory choice that
           no longer sits inside it. */
        if (el.name === 'cat') {
          state.sub = state.sub.filter(function (v) {
            return state.cat.some(function (c) { return v.indexOf(c + '/') === 0 })
          })
        }
      } else {
        return
      }
      state.shown = PAGE_SIZE
      syncUrl()
      renderResults()
      /* The desktop rail and the mobile sheet hold the same controls, so
         both are repainted to keep them in step. */
      var d = facetData()
      var fi = doc.getElementById('mk-filters')
      if (fi) renderFilters(fi, d)
      var si = doc.getElementById('mk-sheet-filters')
      if (si) renderFilters(si, d)
    }

    var fi = doc.getElementById('mk-filters')
    if (fi) fi.addEventListener('change', onFacetChange)
    var si = doc.getElementById('mk-sheet-filters')
    if (si) si.addEventListener('change', onFacetChange)
    var so = doc.getElementById('mk-sort')
    if (so) so.addEventListener('change', onFacetChange)

    var more = doc.getElementById('mk-more')
    if (more) {
      more.addEventListener('click', function () {
        state.shown += PAGE_SIZE
        renderResults()
      })
    }

    /* Mobile: filters open as a bottom sheet. The closed state is
       display:none in CSS, which already removes the panel from the tab
       order, so no aria-hidden is needed. */
    var sheetBtn = doc.getElementById('mk-sheet-btn')
    if (sheetBtn && si) {
      var setSheet = function (open) {
        doc.body.classList.toggle('mk-sheet-open', open)
        sheetBtn.setAttribute('aria-expanded', open ? 'true' : 'false')
        if (open) {
          var first = si.querySelector('input, button')
          if (first) first.focus({ preventScroll: true })
        } else {
          sheetBtn.focus({ preventScroll: true })
        }
      }
      sheetBtn.addEventListener('click', function () { setSheet(true) })
      si.addEventListener('click', function (e) {
        if (e.target.closest('[data-mk-close-sheet]')) setSheet(false)
      })
      doc.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && doc.body.classList.contains('mk-sheet-open')) setSheet(false)
      })
    }

    refreshList()
  }

  /* ------------------------------------------------------------------ */
  /* Product detail page                                                */
  /* ------------------------------------------------------------------ */

  function crumbs (extra) {
    return '<nav class="mk-crumbs" aria-label="Breadcrumb"><ol>' +
      '<li><a href="' + M.path + 'index.html">' + esc(t('home')) + '</a></li>' +
      '<li><a href="' + esc(M.marketUrl()) + '">' + esc(t('marketCrumb')) + '</a></li>' +
      extra +
      '</ol></nav>'
  }

  /* Information panel. Each one falls back to an honest empty state when
     the seller supplied nothing — nothing is ever filled in on their
     behalf. */
  function infoPanel (titleKey, body) {
    return '<section class="mk-sec reveal"><h2 class="mk-sec__title serif">' + esc(t(titleKey)) + '</h2>' +
      '<div class="mk-sec__body">' + body + '</div></section>'
  }

  function pendingBody (iconName, text) {
    return '<p class="mk-empty__sub" style="text-align:left">' + esc(text) + '</p>'
  }

  function renderProduct () {
    var host = doc.getElementById('mk-product')
    if (!host) return

    var p = params()
    var prod = M.productBySlug(p.slug)

    /* An unknown slug is its own state, distinct from a product with no
       data: the page keeps one H1 and offers a way back. */
    if (!prod) {
      doc.title = t('missingTitle') + ' | TheBuxar.com'
      var nmd = doc.querySelector('meta[name="description"]')
      if (nmd) nmd.setAttribute('content', t('missingSub').slice(0, 300))
      host.innerHTML = '<div class="mk-shell mk-page">' + crumbs('<li aria-current="page">' + esc(t('missingTitle')) + '</li>') +
        '<h1 class="mk-title serif">' + esc(t('missingTitle')) + '</h1>' +
        emptyState('box', t('missingTitle'), t('missingSub'),
          '<a class="btn btn--ink" href="' + esc(M.listUrl()) + '">' + esc(t('browseAll')) + '</a>') +
        '</div>'
      return
    }

    var name = M.get(prod.name)
    var cat = catName(prod.category)
    var seller = sellerRec(prod.sellerSlug)
    var imgs = prod.images || []

    /* --- SEO, injected because one template serves every slug --- */
    doc.title = name + ' | Buxar Marketplace | TheBuxar.com'
    var md = doc.querySelector('meta[name="description"]')
    if (md) {
      md.setAttribute('content', (name + ' — ' + cat + ' in Buxar. ' + (prod.description ? M.get(prod.description) : '')).slice(0, 300))
    }

    /* --- Gallery --- */
    var gallery = imgs.length
      ? '<button type="button" class="mk-gallery__main" data-mk-zoom aria-label="' + esc(t('zoom')) + '">' +
          '<img id="mk-main-img" src="' + M.path + esc(imgs[0].src || imgs[0]) + '" alt="' + esc(imgs[0].alt || name) + '" fetchpriority="high" />' +
        '</button>' +
        '<div class="mk-gallery__thumbs">' + imgs.map(function (g, i) {
          return '<button type="button" class="mk-gallery__thumb' + (i === 0 ? ' is-active' : '') + '" data-mk-thumb="' + i + '">' +
            '<img src="' + M.path + esc(g.src || g) + '" alt="' + esc(g.alt || name) + '" loading="lazy" decoding="async" /></button>'
        }).join('') + '</div>'
      : '<div class="mk-gallery__main" aria-hidden="true">' +
          '<span class="mk-card__ph"><span class="mk-card__mono">' + esc(M.monogram(prod.name)) + '</span>' +
          '<span class="mk-card__photo-note">' + esc(t('photoPending')) + '</span></span>' +
        '</div>' +
        '<p class="mk-hint" style="text-align:left">' + esc(t('photoPendingSub')) + '</p>'

    /* --- Availability: only when the record states it --- */
    var availHtml
    if (prod.availability) {
      availHtml = '<p class="mk-buy__avail">' + icon('check') + '<span>' + esc(M.get(prod.availability)) + '</span></p>'
    } else if (prod.stock !== null && prod.stock !== undefined) {
      availHtml = '<p class="mk-buy__avail">' + (prod.stock > 0
        ? icon('check') + '<span>' + esc(t('inStock')) + '</span>'
        : '<span>' + esc(t('outStock')) + '</span>') + '</p>'
    } else {
      availHtml = '<p class="mk-hint" style="text-align:left">' + esc(t('stockPending')) + '</p>'
    }

    /* --- Buy column --- */
    var buy =
      '<div class="mk-buy">' +
        '<div class="mk-card__meta">' +
          '<span class="mk-chip">' + esc(cat) + '</span>' +
          (prod.subcategory ? '<span class="mk-chip">' + esc(M.get(prod.subcategory.name)) + '</span>' : '') +
          demoChip(prod) + verifiedChip(prod) +
        '</div>' +
        '<h1 class="mk-buy__name serif">' + esc(name) + '</h1>' +
        (seller ? '<p class="mk-card__seller">' + esc(t('seller')) + ': <a href="' + esc(M.sellerUrl(seller)) + '">' + esc(M.get(seller.name)) + '</a>' +
          (seller.areaSlug ? ' · ' + esc(areaName(seller.areaSlug)) : '') + '</p>' : '') +
        priceBlock(prod, 'mk-buy__price') +
        availHtml +
        '<div class="mk-buy__qty">' +
          '<span class="mk-sort__label">' + esc(t('qty')) + '</span>' +
          '<button type="button" class="mk-buy__qty-btn" data-mk-qty="-1" aria-label="-">' + icon('minus') + '</button>' +
          '<input class="mk-buy__qty-input" id="mk-qty" type="number" min="1" max="99" value="1" inputmode="numeric" aria-label="' + esc(t('qty')) + '" />' +
          '<button type="button" class="mk-buy__qty-btn" data-mk-qty="1" aria-label="+">' + icon('plus') + '</button>' +
        '</div>' +
        '<div class="mk-buy__acts">' +
          '<button type="button" class="mk-card__cta" data-mk-add="' + esc(prod.slug) + '">' + icon('cart') + '<span>' + esc(t('addToCart')) + '</span></button>' +
          '<a class="mk-card__cta mk-card__cta--ghost" href="' + esc(M.checkoutUrl()) + '" data-mk-buynow="' + esc(prod.slug) + '">' + esc(t('buyNow')) + '</a>' +
          '<button type="button" class="mk-card__cart" data-mk-wish="' + esc(prod.slug) + '" aria-pressed="' + (M.store.inWishlist(prod.slug) ? 'true' : 'false') + '">' +
            icon('heart') + '<span>' + esc(t('wishlist')) + '</span></button>' +
        '</div>' +
        '<p class="mk-hint" style="text-align:left">' + esc(t('cartNote')) + '</p>' +
      '</div>'

    /* --- Information panels --- */
    var panels = ''

    panels += infoPanel('description', prod.description
      ? '<p>' + esc(M.get(prod.description)) + '</p>'
      : pendingBody('info', t('noDescription')))

    var detailRows = []
    detailRows.push([t('category'), cat])
    if (prod.subcategory) detailRows.push([t('subcategory'), M.get(prod.subcategory.name)])
    if (seller) detailRows.push([t('seller'), M.get(seller.name)])
    if (prod.location) detailRows.push([t('location'), areaName(prod.location)])
    if (prod.sku) detailRows.push(['SKU', prod.sku])
    var created = M.formatDate(prod.createdAt)
    if (created) detailRows.push([t('listedOn'), created])
    panels += infoPanel('details',
      '<div class="mk-specs">' + detailRows.map(function (r) {
        return '<div class="mk-specs__row"><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>'
      }).join('') + '</div>')

    /* Specifications come only from the record. Every product currently
       carries an empty list, so the panel explains that instead of
       guessing a material or a weight. */
    var specRows = []
    ;(prod.specifications || []).forEach(function (s) {
      specRows.push([M.get(s.label || s.key), M.get(s.value)])
    })
    if (prod.material) specRows.push([t('specMaterial'), M.get(prod.material)])
    if (prod.weight) specRows.push([t('specWeight'), M.get(prod.weight)])
    if (prod.dimensions) specRows.push([t('specDimensions'), M.get(prod.dimensions)])
    /* fSpecs, not a separate 'specs': one key per string. The panel heading
       and the sell-form field are the same word, so they read the same key. */
    panels += infoPanel('fSpecs', specRows.length
      ? '<div class="mk-specs">' + specRows.map(function (r) {
          return '<div class="mk-specs__row"><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>'
        }).join('') + '</div>'
      : pendingBody('box', t('noSpecs')))

    /* "What makes it special" is drawn only from verified tags. */
    var tags = prod.tags || []
    panels += infoPanel('special', tags.length
      ? '<div class="mk-card__meta">' + tags.map(function (tg) {
          return '<span class="mk-chip">' + esc(M.get(tg)) + '</span>'
        }).join('') + '</div>'
      : pendingBody('leaf', t('noSpecial')))

    /* The cultural story is the one panel where a wrong sentence is a
       real harm, so it renders only when a seller or TheBuxar.com has
       supplied a verified one. */
    panels += infoPanel('storyTitle', prod.story
      ? '<p>' + esc(M.get(prod.story)) + '</p>'
      : pendingBody('leaf', t('storyPending')))

    /* Seller information */
    var sellerBody
    if (seller) {
      sellerBody = '<div class="mk-seller-card">' +
        '<div class="mk-seller__body">' +
          '<h3 class="mk-seller__name">' + esc(M.get(seller.name)) + '</h3>' +
          '<p class="mk-card__loc">' + icon('pin') + '<span>' + esc(areaName(seller.areaSlug)) + '</span></p>' +
          (seller.description ? '<p class="mk-seller__desc">' + esc(M.get(seller.description)) + '</p>' : '') +
          '<div class="mk-card__meta">' + demoChip(seller) + verifiedChip(seller) + '</div>' +
        '</div>' +
        '<div class="mk-buy__acts">' +
          '<a class="mk-card__cta" href="' + esc(M.sellerUrl(seller)) + '">' + esc(t('viewStore')) + '</a>' +
          /* Business Directory link only when the seller record names a
             business listing. All demo sellers leave it null, so the
             honest "not linked" note is what shows. */
          (seller.businessSlug
            ? '<a class="mk-card__cta mk-card__cta--ghost" href="' + esc(M.businessUrl(seller.businessSlug)) + '">' + esc(t('viewBusiness')) + '</a>'
            : '<p class="mk-hint" style="text-align:left">' + esc(t('noBizLink')) + '</p>') +
        '</div></div>'
    } else {
      sellerBody = pendingBody('store', t('noSellerInfo'))
    }
    panels += infoPanel('sellerInfo', sellerBody)

    panels += infoPanel('deliveryInfo', prod.delivery
      ? '<p>' + esc(M.get(prod.delivery)) + '</p>'
      : pendingBody('truck', t('noDelivery')))

    panels += infoPanel('returnPolicy', prod.returns
      ? '<p>' + esc(M.get(prod.returns)) + '</p>'
      : pendingBody('box', t('noReturns')))

    /* Reviews. No review system is connected and no review exists, so
       the panel is a prepared empty state — never a fabricated rating or
       a fake "verified purchase". */
    var reviewBody
    if (prod.rating !== null && prod.rating !== undefined) {
      reviewBody = '<p class="mk-card__meta">' + stars(prod) +
        '<span class="mk-card__cat">' + esc(String(prod.rating)) + ' · ' + prod.reviewCount + '</span></p>'
      if (prod.reviews && prod.reviews.length) {
        reviewBody += prod.reviews.map(function (r) {
          return '<div class="mk-review">' +
            '<p class="mk-review__name">' + esc(M.get(r.name)) + '</p>' +
            '<p>' + esc(M.get(r.text)) + '</p></div>'
        }).join('')
      } else {
        reviewBody += pendingBody('star', t('noReviews'))
      }
    } else {
      reviewBody = emptyState('star', t('noReviews'), t('noReviewsSub'),
        '<span class="mk-chip">' + esc(t('beFirst')) + '</span>')
    }
    panels += infoPanel('reviews', reviewBody)

    /* Related products: same category, then same seller. */
    var related = M.products.filter(function (x) {
      return x.slug !== prod.slug && (x.category === prod.category || x.sellerSlug === prod.sellerSlug)
    }).slice(0, 4)

    var crumbExtra = '<li><a href="' + esc(M.categoryUrl(prod.category)) + '">' + esc(cat) + '</a></li>' +
      '<li aria-current="page">' + esc(name) + '</li>'

    /* Mobile sticky buy bar, hidden on desktop by CSS. */
    var sticky = '<nav class="mk-sticky" aria-label="' + esc(t('addToCart')) + '"><div class="mk-sticky__inner">' +
      '<button type="button" class="mk-card__cta" data-mk-add="' + esc(prod.slug) + '">' + esc(t('addToCart')) + '</button>' +
      '<a class="mk-card__cta mk-card__cta--ghost" href="' + esc(M.checkoutUrl()) + '" data-mk-buynow="' + esc(prod.slug) + '">' + esc(t('buyNow')) + '</a>' +
      '</div></nav>'

    host.innerHTML =
      '<div class="mk-page">' +
        '<div class="mk-shell">' +
          crumbs(crumbExtra) +
          '<div class="mk-detail">' +
            '<div class="mk-gallery">' + gallery + '</div>' +
            buy +
          '</div>' +
          '<div class="mk-info">' + panels + '</div>' +
          (related.length
            ? section({ tight: true, title: t('relatedProducts') }, grid(related, 4))
            : '') +
        '</div>' +
      '</div>' +
      sticky

    revealNow(host)
    initLightbox(imgs, name)
  }

  /* Fullscreen viewer. Same contract as the Business Directory lightbox:
     body scroll lock, focus saved and returned, counter and caption,
     Escape to close, arrow keys to move. It is only created when the
     product actually has images. */
  function initLightbox (imgs, name) {
    if (lbTeardown) { lbTeardown(); lbTeardown = null }
    if (!imgs || !imgs.length) return

    var main = doc.getElementById('mk-main-img')
    if (!main) return

    var box = doc.createElement('div')
    box.className = 'mk-lb'
    box.setAttribute('role', 'dialog')
    box.setAttribute('aria-modal', 'true')
    box.setAttribute('aria-label', t('gallery'))
    box.hidden = true
    box.innerHTML =
      '<button type="button" class="mk-lb__close" data-mk-lb-close aria-label="' + esc(t('closeLb')) + '">' + icon('close') + '</button>' +
      '<button type="button" class="mk-lb__prev" data-mk-lb-prev aria-label="' + esc(t('prevImg')) + '">' + icon('arrow') + '</button>' +
      '<button type="button" class="mk-lb__next" data-mk-lb-next aria-label="' + esc(t('nextImg')) + '">' + icon('arrow') + '</button>' +
      '<figure class="mk-lb__fig"><img class="mk-lb__img" alt="" /><figcaption class="mk-lb__cap"></figcaption></figure>'
    doc.body.appendChild(box)

    var img = box.querySelector('.mk-lb__img')
    var cap = box.querySelector('.mk-lb__cap')
    var n = 0
    var lastFocused = null

    function show (i) {
      n = (i + imgs.length) % imgs.length
      var g = imgs[n]
      img.setAttribute('src', M.path + (g.src || g))
      img.setAttribute('alt', g.alt || name)
      cap.textContent = (n + 1) + ' / ' + imgs.length + ' — ' + (g.caption || g.alt || name)
      var thumbs = doc.querySelectorAll('[data-mk-thumb]')
      for (var k = 0; k < thumbs.length; k++) {
        thumbs[k].classList.toggle('is-active', parseInt(thumbs[k].getAttribute('data-mk-thumb'), 10) === n)
      }
      if (main) {
        main.setAttribute('src', M.path + (g.src || g))
        main.setAttribute('alt', g.alt || name)
      }
    }

    function open (i) {
      lastFocused = doc.activeElement
      show(i)
      box.hidden = false
      doc.body.classList.add('mk-sheet-open')
      var c = box.querySelector('[data-mk-lb-close]')
      if (c) c.focus({ preventScroll: true })
    }

    function close () {
      box.hidden = true
      doc.body.classList.remove('mk-sheet-open')
      if (lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true })
    }

    function onKey (e) {
      if (box.hidden) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') show(n - 1)
      if (e.key === 'ArrowRight') show(n + 1)
    }

    /* One delegated listener on the document handles the thumbnail rail,
       the zoom click and the lightbox controls, so a re-render never
       stacks handlers. */
    function onClick (e) {
      var thumb = e.target.closest('[data-mk-thumb]')
      if (thumb) { show(parseInt(thumb.getAttribute('data-mk-thumb'), 10) || 0); return }
      if (e.target.closest('[data-mk-zoom]')) { open(0); return }
      if (e.target.closest('[data-mk-lb-close]')) { close(); return }
      if (e.target.closest('[data-mk-lb-prev]')) { show(n - 1); return }
      if (e.target.closest('[data-mk-lb-next]')) { show(n + 1); return }
      if (e.target === box) close()
    }

    doc.addEventListener('click', onClick)
    doc.addEventListener('keydown', onKey)

    lbTeardown = function () {
      doc.removeEventListener('click', onClick)
      doc.removeEventListener('keydown', onKey)
      if (box.parentNode) box.parentNode.removeChild(box)
    }
  }

  /* ------------------------------------------------------------------ */
  /* Seller page                                                        */
  /* ------------------------------------------------------------------ */

  function renderSeller () {
    var host = doc.getElementById('mk-seller')
    if (!host) return

    var p = params()
    var s = M.productBySlug ? sellerRec(p.slug) : null

    if (!s) {
      doc.title = t('missingTitle') + ' | TheBuxar.com'
      var nmd = doc.querySelector('meta[name="description"]')
      if (nmd) nmd.setAttribute('content', t('missingSub').slice(0, 300))
      host.innerHTML = '<div class="mk-shell mk-page">' +
        crumbs('<li aria-current="page">' + esc(t('missingTitle')) + '</li>') +
        '<h1 class="mk-title serif">' + esc(t('missingTitle')) + '</h1>' +
        emptyState('store', t('missingTitle'), t('missingSub'),
          '<a class="btn btn--ink" href="' + esc(M.listUrl()) + '">' + esc(t('browseAll')) + '</a>') +
        '</div>'
      return
    }

    var name = M.get(s.name)
    var prods = M.productsBySeller(s.slug)
    var cats = {}
    prods.forEach(function (x) { cats[x.category] = true })

    doc.title = name + ' | Buxar Marketplace | TheBuxar.com'
    var md = doc.querySelector('meta[name="description"]')
    if (md) md.setAttribute('content', (name + ' — ' + (s.type ? M.get(s.type) : '') + ' in Buxar. ' + countLabel(prods.length) + '.').slice(0, 300))

    /* --- Cover + hero --- */
    var cover = s.coverImage
      ? '<img src="' + M.path + esc(s.coverImage) + '" alt="' + esc(name) + '" />'
      : '<div class="mk-seller-hero__vignette"></div>'

    var logo = s.logo
      ? '<img src="' + M.path + esc(s.logo) + '" alt="' + esc(name) + ' logo" />'
      : '<span class="mk-mono">' + esc(M.monogram(s.name)) + '</span>'

    var hero =
      '<section class="mk-seller-hero">' +
        '<div class="mk-seller-hero__cover">' + cover + '</div>' +
        '<div class="mk-shell mk-seller-hero__inner">' +
          '<div class="mk-seller-hero__head">' +
            '<span class="mk-seller-hero__logo">' + logo + '</span>' +
            '<div>' +
              '<p class="mk-card__cat">' + esc(s.type ? M.get(s.type) : '') + '</p>' +
              '<h1 class="mk-seller-hero__name serif">' + esc(name) + '</h1>' +
              '<p class="mk-seller-hero__meta">' + icon('pin') + '<span>' + esc(areaName(s.areaSlug)) + '</span>' +
                '<span class="mk-chip">' + esc(countLabel(prods.length)) + '</span>' +
                demoChip(s) + verifiedChip(s) +
              '</p>' +
            '</div>' +
          '</div>' +
          (s.description ? '<p class="mk-sub" style="color:rgba(255,255,255,.84);max-width:64ch">' + esc(M.get(s.description)) + '</p>' : '') +
          (s.businessSlug
            ? '<div><a class="btn btn--gold" href="' + esc(M.businessUrl(s.businessSlug)) + '">' + esc(t('viewBusiness')) + '</a></div>'
            : '<p class="mk-hint" style="text-align:left;color:rgba(255,255,255,.7)">' + esc(t('noBizLink')) + '</p>') +
        '</div>' +
      '</section>'

    /* --- Body --- */
    var catChips = Object.keys(cats).map(function (slug) {
      var c = M.catBySlug(slug)
      if (!c) return ''
      return '<a class="mk-chip" href="' + esc(M.categoryUrl(slug)) + '">' + esc(M.get(c.name)) + '</a>'
    }).join('')

    var contact
    var rows = []
    if (s.phone) rows.push([t('fPhone'), s.phone, 'tel:' + String(s.phone).replace(/\s+/g, ''), 'phone'])
    if (s.email) rows.push([t('fEmail'), s.email, 'mailto:' + s.email, 'mail'])
    if (s.website) rows.push(['Website', s.website, s.website, 'globe'])
    if (s.address) rows.push([t('fAddress'), s.address, '', 'pin'])
    contact = rows.length
      ? '<ul class="mk-contact">' + rows.map(function (r) {
          return '<li class="mk-contact__row">' +
            '<span class="mk-contact__icon">' + icon(r[3]) + '</span>' +
            '<span class="mk-contact__text">' + (r[2]
              ? '<a href="' + esc(r[2]) + '">' + esc(r[1]) + '</a>'
              : esc(r[1])) + '</span></li>'
        }).join('') + '</ul>'
      : pendingBody('info', t('noContact'))

    var gallery = s.gallery && s.gallery.length
      ? '<div class="mk-gallery__thumbs">' + s.gallery.map(function (g) {
          return '<img class="mk-gallery__thumb" src="' + M.path + esc(g.src || g) + '" alt="' + esc(g.alt || name) + '" loading="lazy" decoding="async" />'
        }).join('') + '</div>'
      : pendingBody('image', t('noPhotos'))

    host.innerHTML =
      hero +
      '<div class="mk-page"><div class="mk-shell">' +
        crumbs('<li aria-current="page">' + esc(name) + '</li>') +
        section({ tight: true, title: t('products'), label: t('sellersLabel'),
          sub: countLabel(prods.length) },
          prods.length
            ? '<div class="mk-grid">' + prods.map(function (x) { return productCard(x) }).join('') + '</div>'
            : emptyState('box', t('noSellerProducts'), t('noSellerProductsSub'))) +
        section({ tight: true, title: t('about') },
          s.description ? '<p>' + esc(M.get(s.description)) + '</p>' : pendingBody('info', t('noAbout'))) +
        section({ tight: true, title: t('category') },
          catChips ? '<div class="mk-card__meta">' + catChips + '</div>' : pendingBody('box', t('noCategories'))) +
        section({ tight: true, title: t('contact') }, contact) +
        section({ tight: true, title: t('gallery') }, gallery) +
        section({ tight: true, title: t('storePolicies') },
          s.policies
            ? '<p>' + esc(M.get(s.policies)) + '</p>'
            : pendingBody('box', t('noPolicies'))) +
        '<div class="mk-cta" style="padding-bottom:clamp(40px,7vw,64px)">' +
          '<a class="btn btn--ink" href="' + esc(M.listUrl('?seller=' + encodeURIComponent(s.slug))) + '">' + esc(t('browseAll')) + '</a>' +
        '</div>' +
      '</div></div>'

    revealNow(host)
  }

  /* ------------------------------------------------------------------ */
  /* Cart                                                               */
  /* ------------------------------------------------------------------ */

  function cartLine (line, mode) {
    var p = M.productBySlug(line.slug)
    if (!p) return ''
    var name = M.get(p.name)
    var unit = p.price === null || p.price === undefined || isNaN(Number(p.price)) ? null : Number(p.price)
    var lineTotal = unit === null ? null : unit * line.qty

    return '<article class="mk-cart__item reveal" data-slug="' + esc(p.slug) + '">' +
      '<a class="mk-cart__media" href="' + esc(M.productUrl(p)) + '" tabindex="-1" aria-hidden="true">' + media(p, 'mk-cart') + '</a>' +
      '<div class="mk-cart__body">' +
        '<h3 class="mk-cart__name"><a href="' + esc(M.productUrl(p)) + '">' + esc(name) + '</a></h3>' +
        '<p class="mk-cart__meta">' + esc(sellerName(p)) + ' · ' + esc(catName(p.category)) + '</p>' +
        '<p class="mk-cart__meta">' + esc(t('qty')) + ' ' + line.qty + ' × ' +
          (unit === null ? esc(t('pricePending')) : esc(M.formatPrice(unit))) + '</p>' +
        '<div class="mk-card__meta">' + demoChip(p) + verifiedChip(p) + '</div>' +
        '<div class="mk-cart__acts">' +
          (mode === 'cart'
            ? '<button type="button" class="mk-linkbtn" data-mk-dec="' + esc(p.slug) + '" aria-label="-">' + icon('minus') + '</button>' +
              '<span class="mk-cart__qty">' + line.qty + '</span>' +
              '<button type="button" class="mk-linkbtn" data-mk-inc="' + esc(p.slug) + '" aria-label="+">' + icon('plus') + '</button>'
            : '') +
          (mode === 'cart'
            ? '<button type="button" class="mk-linkbtn" data-mk-save="' + esc(p.slug) + '">' + esc(t('saveForLater')) + '</button>' +
              '<button type="button" class="mk-linkbtn" data-mk-towish="' + esc(p.slug) + '">' + esc(t('moveToWishlist')) + '</button>' +
              '<button type="button" class="mk-linkbtn mk-linkbtn--danger" data-mk-remove="' + esc(p.slug) + '">' + esc(t('remove')) + '</button>'
            : '<button type="button" class="mk-linkbtn" data-mk-move="' + esc(p.slug) + '">' + esc(t('moveToCart')) + '</button>' +
              '<button type="button" class="mk-linkbtn mk-linkbtn--danger" data-mk-unmove="' + esc(p.slug) + '">' + esc(t('remove')) + '</button>') +
        '</div>' +
      '</div>' +
      '<div class="mk-cart__right">' +
        '<p class="mk-cart__price">' + (lineTotal === null ? esc(t('pricePending')) : esc(M.formatPrice(lineTotal))) + '</p>' +
      '</div>' +
    '</article>'
  }

  function summaryBlock (totals) {
    var rows = ''
    rows += '<div class="mk-summary__row"><span>' + esc(t('subtotal')) + '</span><span>' +
      (totals.subtotal === null ? '—' : esc(M.formatPrice(totals.subtotal))) + '</span></div>'
    rows += '<div class="mk-summary__row"><span>' + esc(t('delivery')) + '</span><span>' +
      (totals.delivery === null ? '—' : esc(M.formatPrice(totals.delivery))) + '</span></div>'
    rows += '<div class="mk-summary__row"><span>' + esc(t('discount')) + '</span><span>' +
      (totals.discount === null ? '—' : (totals.discount > 0 ? '− ' : '') + esc(M.formatPrice(totals.discount))) + '</span></div>'
    rows += '<div class="mk-summary__row mk-summary__total"><span>' + esc(t('total')) + '</span><span>' +
      (totals.total === null ? '—' : esc(M.formatPrice(totals.total))) + '</span></div>'
    /* Totals are withheld, not zeroed, whenever a line has no published
       price — a subtotal built from unknown numbers would be a fiction. */
    if (!totals.priced) {
      rows += '<p class="mk-hint" style="text-align:left">' + esc(t('noTotals')) + '</p>'
    }
    rows += '<a class="mk-card__cta mk-card__cta--ghost" href="' + esc(M.marketUrl()) + '">' + esc(t('continueShopping')) + '</a>'
    if (totals.priced) {
      rows += '<a class="mk-card__cta" href="' + esc(M.checkoutUrl()) + '">' + esc(t('proceedCheckout')) + '</a>'
    } else {
      /* The button still leads to the checkout structure so the journey
         is inspectable, but it is never dressed as a working purchase. */
      rows += '<a class="mk-card__cta mk-card__cta--ghost" href="' + esc(M.checkoutUrl()) + '" title="' + esc(t('checkoutSoon')) + '">' +
        esc(t('proceedCheckout')) + '</a>'
    }
    rows += '<p class="mk-hint" style="text-align:left">' + esc(t('cartNote')) + '</p>'
    return rows
  }

  function renderCart () {
    var host = doc.getElementById('mk-cart')
    if (!host) return

    var lines = M.store.cart()
    var totals = M.cartTotals(lines)
    var saved = M.store.saved()

    if (!lines.length) {
      host.innerHTML = emptyState('cart', t('emptyCart'), t('emptyCartSub'),
        '<a class="btn btn--ink" href="' + esc(M.listUrl()) + '">' + esc(t('browseAll')) + '</a>') +
        (saved.length
          ? '<section class="mk-section mk-section--tight"><h2 class="mk-sec__title serif">' + esc(t('emptySaved')) + '</h2>' +
            '<div class="mk-cart__items" style="margin-top:18px">' + saved.map(function (l) { return cartLine(l, 'saved') }).join('') + '</div></section>'
          : '')
      return
    }

    host.innerHTML =
      '<div class="mk-cart">' +
        '<div class="mk-cart__lines">' +
          '<div class="mk-cart__items">' + lines.map(function (l) { return cartLine(l, 'cart') }).join('') + '</div>' +
        '</div>' +
        '<aside class="mk-summary">' +
          '<h2 class="mk-sec__title serif">' + esc(t('summary')) + '</h2>' +
          summaryBlock(totals) +
        '</aside>' +
      '</div>' +
      (saved.length
        ? '<section class="mk-section mk-section--tight"><h2 class="mk-sec__title serif">' + esc(t('saveForLater')) + '</h2>' +
          '<div class="mk-cart__items" style="margin-top:18px">' + saved.map(function (l) { return cartLine(l, 'saved') }).join('') + '</div></section>'
        : '')
  }

  function renderWishlist () {
    var host = doc.getElementById('mk-wishlist')
    if (!host) return

    var lines = M.store.wishlist()

    if (!lines.length) {
      host.innerHTML = emptyState('heart', t('emptyWishlist'), t('emptyWishlistSub'),
        '<a class="btn btn--ink" href="' + esc(M.listUrl()) + '">' + esc(t('browseAll')) + '</a>')
      return
    }

    host.innerHTML = '<div class="mk-cart__items">' + lines.map(function (l) { return cartLine(l, 'wish') }).join('') + '</div>'
  }

  /* ------------------------------------------------------------------ */
  /* Checkout structure — explicitly not connected to anything           */
  /* ------------------------------------------------------------------ */

  function field (labelKey, name, opts) {
    opts = opts || {}
    var label = t(labelKey)
    var id = 'mk-' + name + (opts.idSuffix || '')
    var input
    if (opts.kind === 'textarea') {
      input = '<textarea class="mk-textarea" id="' + id + '" name="' + name + '"' + (opts.req ? ' required' : '') + '></textarea>'
    } else if (opts.kind === 'select') {
      /* Left empty on purpose: renderCheckout fills it from M.areas, so a
         new area appears here without editing this file. */
      input = '<select class="mk-input mk-select" id="' + id + '" name="' + name + '"' +
        (opts.req ? ' required' : '') + '></select>'
    } else {
      input = '<input class="mk-input" id="' + id + '" type="' + (opts.kind || 'text') + '" name="' + name + '"' +
        (opts.req ? ' required' : '') +
        (opts.kind === 'email' ? ' inputmode="email"' : '') +
        (opts.autocomplete ? ' autocomplete="' + opts.autocomplete + '"' : '') + ' />'
    }
    return '<div class="mk-field"><label class="mk-field__label" for="' + id + '">' + esc(label) +
      (opts.req ? ' *' : '') + '</label>' + input + '</div>'
  }

  function checkoutPanel (titleKey, body) {
    return '<section class="mk-sec reveal"><h2 class="mk-sec__title serif">' + esc(t(titleKey)) + '</h2>' +
      '<div class="mk-sec__body">' + body + '</div></section>'
  }

  function renderCheckout () {
    var host = doc.getElementById('mk-checkout')
    if (!host) return

    var lines = M.store.cart()
    var totals = M.cartTotals(lines)

    var summary = lines.length
      ? '<div class="mk-cart__items">' + lines.map(function (l) {
          return cartLine(Object.assign({}, l, { qty: l.qty }), 'saved').replace('data-mk-unmove', 'data-mk-checkout-noop')
        }).join('') + '</div>' + summaryBlock(totals)
      : emptyState('cart', t('emptyCart'), t('emptyCartSub'),
          '<a class="btn btn--ink" href="' + esc(M.listUrl()) + '">' + esc(t('browseAll')) + '</a>')

    host.innerHTML =
      '<div class="mk-checkout">' +
        '<div class="mk-notice reveal">' + icon('info') +
          '<div><p class="mk-field__label">' + esc(t('checkoutSoon')) + '</p>' +
          '<p>' + esc(t('checkoutSoonSub')) + '</p></div>' +
        '</div>' +
        '<div class="mk-checkout__grid">' +
          '<div class="mk-checkout__main">' +
            checkoutPanel('coCustomer',
              field('fEmail', 'email', { kind: 'email', req: true, autocomplete: 'email' }) +
              field('fPhone', 'phone', { kind: 'tel', req: true, autocomplete: 'tel' })) +
            checkoutPanel('coAddress',
              field('fAddress', 'address', { req: true, autocomplete: 'street-address' }) +
              field('fArea', 'area', { kind: 'select' }) +
              field('fPin', 'pincode', { autocomplete: 'postal-code' })) +
            checkoutPanel('coDelivery',
              '<label class="mk-radio"><input type="radio" name="delivery" disabled />' +
                '<span>' + esc(t('coPendingField')) + '</span></label>') +
            checkoutPanel('coPayment',
              '<label class="mk-radio"><input type="radio" name="payment" disabled />' +
                '<span>' + esc(t('payNotReady')) + '</span></label>') +
          '</div>' +
          '<aside class="mk-summary">' +
            '<h2 class="mk-sec__title serif">' + esc(t('coOrder')) + '</h2>' +
            summary +
          '</aside>' +
        '</div>' +
      '</div>'

    /* Area select is filled from the dataset so a new area appears here
       without touching this file. */
    var as = host.querySelector('select[name="area"]')
    if (as) {
      as.innerHTML = '<option value="">' + esc(t('chooseArea')) + '</option>' +
        M.areas.map(function (a) {
          return '<option value="' + esc(a.slug) + '">' + esc(M.get(a.name)) + '</option>'
        }).join('')
    }
  }

  /* ------------------------------------------------------------------ */
  /* Seller onboarding + product submission forms                        */
  /*                                                                     */
  /* Both validate and then say plainly that nothing was sent. The bank  */
  /* fields are present as disabled placeholders precisely because no    */
  /* secure payment-onboarding service exists to receive them.           */
  /* ------------------------------------------------------------------ */

  function fillSelect (root, name, items, placeholderKey) {
    var el = root.querySelector('select[name="' + name + '"]')
    if (!el) return
    el.innerHTML = '<option value="">' + esc(t(placeholderKey || 'chooseCategory')) + '</option>' +
      items.map(function (it) {
        return '<option value="' + esc(it.slug) + '">' + esc(M.get(it.name)) + '</option>'
      }).join('')
  }

  /* Seller onboarding picks product categories as checkboxes, filled from
     the dataset so a new category appears here without an edit. Every
     category is offered here — the filter rail only offers the ones a
     product already uses. */
  function fillCatPicker (root) {
    var host = root.querySelector('[data-mk-catpicker]')
    if (!host) return
    host.innerHTML = M.categories.map(function (c) {
      return '<label class="mk-check">' +
        '<input type="checkbox" name="categories" value="' + esc(c.slug) + '" />' +
        '<span class="mk-check__box" aria-hidden="true">' + icon('check') + '</span>' +
        '<span class="mk-check__label">' + esc(M.get(c.name)) + '</span>' +
      '</label>'
    }).join('')
  }

  function initForms () {
    var forms = doc.querySelectorAll('[data-mk-form]')
    if (!forms.length) return

    Array.prototype.forEach.call(forms, function (form) {
      fillSelect(form, 'category', M.categories, 'chooseCategory')
      fillSelect(form, 'area', M.areas, 'chooseArea')
      fillCatPicker(form)

      var status = doc.getElementById(form.getAttribute('data-mk-status') || '')
      form.addEventListener('submit', function (e) {
        e.preventDefault()
        var msg = form.getAttribute('data-mk-notice') === 'approval'
          ? t('approvalNote')
          : t('notStored')
        if (status) {
          status.textContent = msg
          status.className = 'mk-form__status is-warn'
        }
      })
    })
  }

  /* ------------------------------------------------------------------ */
  /* Cart + wishlist interactions                                       */
  /* ------------------------------------------------------------------ */

  function qty () {
    var el = doc.getElementById('mk-qty')
    var v = parseInt(el ? el.value : '1', 10)
    if (isNaN(v) || v < 1) v = 1
    if (v > 99) v = 99
    return v
  }

  function lineQty (slug) {
    var lines = M.store.cart()
    for (var i = 0; i < lines.length; i++) if (lines[i].slug === slug) return lines[i].qty
    return 0
  }

  /* Repaints whatever cart-shaped view is on screen. */
  function repaintStores () {
    renderCart()
    renderWishlist()
    renderCheckout()
    renderMounts()
    /* Wishlist hearts on cards and the product page reflect the store. */
    var hearts = doc.querySelectorAll('[data-mk-wish]')
    Array.prototype.forEach.call(hearts, function (b) {
      var on = M.store.inWishlist(b.getAttribute('data-mk-wish'))
      b.classList.toggle('is-active', on)
      b.setAttribute('aria-pressed', on ? 'true' : 'false')
    })
  }

  function initStore () {
    if (doc.body.getAttribute('data-mk-store-bound')) return
    doc.body.setAttribute('data-mk-store-bound', '1')

    doc.addEventListener('click', function (e) {
      /* Add to cart. This writes to this browser's localStorage and
         nowhere else — no order is created, nothing is reserved and no
         payment is taken. The cart page says so too. */
      var add = e.target.closest('[data-mk-add]')
      if (add) {
        e.preventDefault()
        M.store.addToCart(add.getAttribute('data-mk-add'), qty())
        repaintStores()
        return
      }

      /* Buy now puts the item in the cart and moves to the checkout
         structure, which states plainly that no gateway is connected. */
      var buy = e.target.closest('[data-mk-buynow]')
      if (buy) {
        e.preventDefault()
        M.store.addToCart(buy.getAttribute('data-mk-buynow'), qty())
        doc.defaultView.location.href = M.checkoutUrl()
        return
      }

      var wish = e.target.closest('[data-mk-wish]')
      if (wish) {
        e.preventDefault()
        M.store.toggleWishlist(wish.getAttribute('data-mk-wish'))
        repaintStores()
        return
      }

      var inc = e.target.closest('[data-mk-inc]')
      if (inc) {
        e.preventDefault()
        M.store.setQty(inc.getAttribute('data-mk-inc'), lineQty(inc.getAttribute('data-mk-inc')) + 1)
        repaintStores()
        return
      }

      var dec = e.target.closest('[data-mk-dec]')
      if (dec) {
        e.preventDefault()
        var dslug = dec.getAttribute('data-mk-dec')
        M.store.setQty(dslug, lineQty(dslug) - 1)
        repaintStores()
        return
      }

      var rm = e.target.closest('[data-mk-remove]')
      if (rm) {
        e.preventDefault()
        M.store.removeFromCart(rm.getAttribute('data-mk-remove'))
        repaintStores()
        return
      }

      var save = e.target.closest('[data-mk-save]')
      if (save) {
        e.preventDefault()
        M.store.saveForLater(save.getAttribute('data-mk-save'))
        repaintStores()
        return
      }

      var move = e.target.closest('[data-mk-move]')
      if (move) {
        e.preventDefault()
        M.store.savedToCart(move.getAttribute('data-mk-move'))
        repaintStores()
        return
      }

      var unmove = e.target.closest('[data-mk-unmove]')
      if (unmove) {
        e.preventDefault()
        M.store.removeSaved(unmove.getAttribute('data-mk-unmove'))
        M.store.removeFromWishlist(unmove.getAttribute('data-mk-unmove'))
        repaintStores()
        return
      }

      var towish = e.target.closest('[data-mk-towish]')
      if (towish) {
        e.preventDefault()
        M.store.moveToWishlist(towish.getAttribute('data-mk-towish'))
        repaintStores()
        return
      }

      /* Quantity stepper on the product page. */
      var step = e.target.closest('[data-mk-qty]')
      if (step) {
        e.preventDefault()
        var input = doc.getElementById('mk-qty')
        if (!input) return
        var next = qty() + parseInt(step.getAttribute('data-mk-qty'), 10)
        if (next < 1) next = 1
        if (next > 99) next = 99
        input.value = next
        return
      }

      /* Clear filters, from the empty state or the filter rail. */
      var clear = e.target.closest('[data-mk-clear]')
      if (clear) {
        e.preventDefault()
        if (doc.getElementById('mk-grid')) clearAll()
        else doc.defaultView.location.href = M.listUrl()
        return
      }

      if (e.target.closest('[data-mk-close-sheet]')) return
    })
  }

  /* ------------------------------------------------------------------ */
  /* Generic reveal for injected markup (mirrors sections.js)            */
  /* ------------------------------------------------------------------ */

  function revealNow (scope) {
    var els = Array.from((scope || doc).querySelectorAll('.reveal'))
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in') })
      return
    }
    if (!doc.__mkObs) {
      doc.__mkObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            doc.__mkObs.unobserve(entry.target)
          }
        })
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
    }
    els.forEach(function (el) { doc.__mkObs.observe(el) })
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                               */
  /* ------------------------------------------------------------------ */

  function renderMounts () {
    var hosts = doc.querySelectorAll('[data-mk]')
    for (var i = 0; i < hosts.length; i++) {
      var host = hosts[i]
      var fn = MOUNT[host.getAttribute('data-mk')]
      if (!fn) continue
      try { fn(host) } catch (err) {
        console.error('[TheBuxar] marketplace mount failed', host.getAttribute('data-mk'), err)
      }
    }
    revealNow(doc)
  }

  /* Another module on the page (the Business Directory) can insert a
     data-mk mount after this file has booted. It calls this so the new host
     is filled without either module knowing about the other's internals. */
  M.refreshMounts = function () { renderMounts() }

  function boot () {
    ;[renderMounts, initList, renderProduct, renderSeller, renderCart, renderWishlist,
      renderCheckout, initForms, initStore].forEach(function (fn) {
      try { fn() } catch (e) { console.error('[TheBuxar] marketplace init step failed', e) }
    })

    /* Re-render when the language toggle flips <html data-lang>. Mounts
       and the detail/store views are idempotent; the listing repaints
       without rebinding. */
    try {
      new MutationObserver(function () {
        var steps = [
          renderMounts,
          renderProduct,
          renderSeller,
          renderCart,
          renderWishlist,
          renderCheckout,
          function () { if (doc.getElementById('mk-grid')) refreshList() }
        ]
        for (var i = 0; i < steps.length; i++) {
          try { steps[i]() } catch (e) {}
        }
      }).observe(doc.documentElement, { attributes: true, attributeFilter: ['data-lang'] })
    } catch (e) {}
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot)
  else boot()
})()