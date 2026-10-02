/* ------------------------------------------------------------------ */
/* TheBuxar.com — Business Directory behaviours (pure vanilla, no deps) */
/*                                                                     */
/* Load after js/business-data.js, which is the single source of truth  */
/* for categories, areas and business records. This file renders every  */
/* part of the module from that dataset and wires the interactions.     */
/*                                                                     */
/* Page wiring (inline in each page, before this script):              */
/*   <script>window.TheBuxarConfig = { path: './' }</script>           */
/* At the site root path is './'; inside business/ it is '../' so       */
/* links and image URLs resolve from the nested folder.                 */
/*                                                                     */
/* Rendering: every section mounts through the generic [data-biz]      */
/* hook, so a page only declares where content goes, never what it      */
/* contains. Pages:                                                    */
/*   business.html          directory landing                          */
/*   business/list.html     results + filters (?q ?cat ?loc ?type)     */
/*   business/profile.html  one profile      (?slug)                    */
/*   business/add.html      submission form structure                  */
/*   business/claim.html    claim workflow UI                          */
/*                                                                     */
/* Data honesty: a field is only drawn when the record carries it.     */
/* No contact detail, rating, hour, coordinate or verification badge   */
/* is ever synthesised — the matching empty state is shown instead.     */
/*                                                                     */
/* Language: content is chosen via B.get() at render time and the     */
/* <html data-lang> change is observed so the module re-renders.        */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var B = window.TheBuxarBusiness
  if (!B) return

  var doc = document
  var PAGE_SIZE = 6

  /* Set by initGalleryLightbox so a re-render can remove the previous
     dialog and its document-level listener instead of leaking them. */
  var lbTeardown = null

  var CONFIG = window.TheBuxarConfig || {}
  B.path = typeof CONFIG.path === 'string' ? CONFIG.path : ''

  var reduceMotion = (function () {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) { return false }
  })()

  /* ------------------------------------------------------------------ */
  /* Small helpers                                                      */
  /* ------------------------------------------------------------------ */

  function esc (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }

  function t (key) { return B.get(B.ui[key]) }

  function icon (name) { return B.icons[name] || B.icons.other }

  function catName (slug) { var c = B.catBySlug(slug); return c ? B.get(c.name) : '' }
  function areaName (slug) { var a = B.areaBySlug(slug); return a ? B.get(a.name) : '' }
  function typeName (slug) { var x = B.typeBySlug(slug); return x ? B.get(x.name) : '' }

  function serviceLabels (biz) {
    return (biz.services || []).map(function (s) { return B.get(s) }).filter(Boolean)
  }

  /* Every searchable string on a record, in both languages. Searching only
     the visible language would hide records from a visitor who types in the
     other one, so the index spans both. */
  function searchTerms (biz) {
    var cat = B.catBySlug(biz.category)
    var area = B.areaBySlug(biz.area)
    var type = B.typeBySlug(biz.type)
    var terms = B.all(biz.name)
      .concat(B.all(biz.subcategory))
      .concat(B.all(biz.description))
      .concat(cat ? B.all(cat.name) : [])
      .concat(cat ? B.all(cat.blurb) : [])
      .concat(area ? B.all(area.name) : [])
      .concat(type ? B.all(type.name) : [])
    ;(biz.services || []).forEach(function (s) { terms = terms.concat(B.all(s)) })
    return terms.filter(Boolean)
  }

  /* Normalised haystack for the search box. */
  function haystack (biz) {
    return searchTerms(biz).join(' ').toLowerCase()
  }

  /* Relevance — how well a record matches the query. 0 means no match. */
  function score (biz, q) {
    if (!q) return 1
    var names = B.all(biz.name).map(function (s) { return s.toLowerCase() })
    for (var i = 0; i < names.length; i++) {
      if (names[i] === q) return 100
      if (names[i].indexOf(q) === 0) return 80
      if (names[i].indexOf(q) > -1) return 60
    }
    var cat = B.catBySlug(biz.category)
    var area = B.areaBySlug(biz.area)
    if (cat && B.all(cat.name).some(function (s) { return s.toLowerCase().indexOf(q) > -1 })) return 45
    if (B.all(biz.subcategory).some(function (s) { return s.toLowerCase().indexOf(q) > -1 })) return 40
    var svcHit = (biz.services || []).some(function (s) {
      return B.all(s).some(function (x) { return x.toLowerCase().indexOf(q) > -1 })
    })
    if (svcHit) return 30
    if (area && B.all(area.name).some(function (s) { return s.toLowerCase().indexOf(q) > -1 })) return 25
    if (haystack(biz).indexOf(q) > -1) return 10
    return 0
  }

  /* ------------------------------------------------------------------ */
  /* Small shared pieces                                                */
  /* ------------------------------------------------------------------ */

  /* Monogram tile. A typographic placeholder for a logo — never a stock
     photo, so an unbranded record cannot be mistaken for a real brand. */
  function monogram (biz) {
    return '<span class="bz-mono" aria-hidden="true">' + esc(B.monogram(biz)) + '</span>'
  }

  function demoChip (biz) {
    return biz.demo === true ? '<span class="bz-chip bz-chip--demo">' + esc(t('demoBadge')) + '</span>' : ''
  }

  /* Verified badge — driven only by the record's own flag. */
  function verifiedChip (biz) {
    return B.isVerified(biz)
      ? '<span class="bz-chip bz-chip--verified">' + icon('check') + esc(t('verifiedBadge')) + '</span>'
      : ''
  }

  /* Open/closed only when the record actually carries hours. */
  function statusChip (biz) {
    if (!biz.hours) return ''
    return '<span class="bz-chip bz-chip--open">' + esc(biz.hours.open ? t('openNow') : t('closedNow')) + '</span>'
  }

  /* Stars appear only for a real rating. */
  function rating (biz) {
    if (biz.rating === null || biz.rating === undefined) {
      return '<span class="bz-card__rating bz-card__rating--none">' + esc(t('noRating')) + '</span>'
    }
    var full = Math.round(biz.rating)
    var stars = ''
    for (var i = 1; i <= 5; i++) {
      stars += '<span class="bz-star' + (i <= full ? ' is-on' : '') + '">' + icon('star') + '</span>'
    }
    return '<span class="bz-card__rating">' + stars +
      '<span class="bz-card__rating-n">' + Number(biz.rating).toFixed(1) + '</span>' +
      (biz.reviewCount ? '<span class="bz-card__reviews">(' + esc(biz.reviewCount) + ')</span>' : '') +
      '</span>'
  }

  /* A contact action is only rendered when the value exists. */
  function contactActions (biz) {
    var out = ''
    if (biz.phone) out += '<a class="bz-act bz-act--call" href="tel:' + esc(biz.phone.replace(/\s+/g, '')) + '">' + icon('phone') + '<span>' + esc(t('callNow')) + '</span></a>'
    if (biz.whatsapp) out += '<a class="bz-act bz-act--wa" href="https://wa.me/' + esc(String(biz.whatsapp).replace(/\D/g, '')) + '" rel="noopener" target="_blank">' + icon('chat') + '<span>' + esc(t('whatsapp')) + '</span></a>'
    out += '<a class="bz-act bz-act--dir" href="' + esc(B.directionsUrl(biz)) + '"' + (biz.coords && biz.coordsVerified ? '' : ' aria-disabled="true"') + '>' + icon('pin') + '<span>' + esc(t('directions')) + '</span></a>'
    return out
  }

  B.directionsUrl = function (biz) {
    if (biz.coords && biz.coordsVerified) {
      return 'https://www.google.com/maps/search/?api=1&query=' + biz.coords[0] + ',' + biz.coords[1]
    }
    if (biz.address) return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(biz.address + ', Buxar, Bihar')
    /* Nothing verified to map to. The caller marks this aria-disabled
       and the profile explains why rather than guessing a position. */
    return B.profileUrl(biz) + '#bz-location'
  }

  /* ------------------------------------------------------------------ */
  /* Cards                                                              */
  /* ------------------------------------------------------------------ */

  function card (biz) {
    var cover = biz.coverImage
      ? '<img class="bz-card__img" src="' + B.path + esc(biz.coverImage) + '" alt="' + esc(B.get(biz.name)) + '" loading="lazy" decoding="async" />'
      : monogram(biz)
    return '' +
      '<article class="bz-card reveal" data-slug="' + esc(biz.slug) + '">' +
        '<a class="bz-card__media" href="' + esc(B.profileUrl(biz)) + '" tabindex="-1" aria-hidden="true">' + cover + '</a>' +
        '<div class="bz-card__body">' +
          '<p class="bz-card__cat">' + esc(catName(biz.category)) + '</p>' +
          '<h3 class="bz-card__name"><a href="' + esc(B.profileUrl(biz)) + '">' + esc(B.get(biz.name)) + '</a></h3>' +
          '<p class="bz-card__loc">' + icon('pin') + '<span>' + esc(areaName(biz.area)) + '</span></p>' +
          (biz.description ? '<p class="bz-card__desc">' + esc(B.get(biz.description)) + '</p>' : '') +
          '<div class="bz-card__meta">' + rating(biz) + statusChip(biz) + verifiedChip(biz) + demoChip(biz) + '</div>' +
          '<div class="bz-card__foot">' +
            '<a class="bz-card__cta" href="' + esc(B.profileUrl(biz)) + '">' + esc(t('viewDetails')) + '<span class="bz-card__arrow">' + icon('arrow') + '</span></a>' +
            '<div class="bz-card__acts">' + contactActions(biz) + '</div>' +
          '</div>' +
        '</div>' +
      '</article>'
  }

  /* Compact row used in search results. */
  function row (biz) {
    var media = biz.coverImage
      ? '<img class="bz-row__img" src="' + B.path + esc(biz.coverImage) + '" alt="" loading="lazy" decoding="async" />'
      : monogram(biz)
    var acts = []
    if (biz.phone) acts.push('<a class="bz-row__act" href="tel:' + esc(biz.phone.replace(/\s+/g, '')) + '">' + icon('phone') + '<span>' + esc(t('callNow')) + '</span></a>')
    if (biz.whatsapp) acts.push('<a class="bz-row__act" href="https://wa.me/' + esc(String(biz.whatsapp).replace(/\D/g, '')) + '" rel="noopener" target="_blank">' + icon('chat') + '<span>' + esc(t('whatsapp')) + '</span></a>')
    acts.push('<a class="bz-row__act' + (biz.coords && biz.coordsVerified ? '' : ' is-off') + '" href="' + esc(B.directionsUrl(biz)) + '">' + icon('pin') + '<span>' + esc(t('directions')) + '</span></a>')
    return '' +
      '<article class="bz-row reveal">' +
        '<a class="bz-row__media" href="' + esc(B.profileUrl(biz)) + '" tabindex="-1" aria-hidden="true">' + media + '</a>' +
        '<div class="bz-row__body">' +
          '<p class="bz-row__cat">' + esc(catName(biz.category)) + (biz.subcategory ? ' <span class="bz-dot">\u00b7</span> ' + esc(B.get(biz.subcategory)) : '') + '</p>' +
          '<h3 class="bz-row__name"><a href="' + esc(B.profileUrl(biz)) + '">' + esc(B.get(biz.name)) + '</a></h3>' +
          '<p class="bz-row__loc">' + icon('pin') + '<span>' + esc(areaName(biz.area)) + '</span></p>' +
          (biz.description ? '<p class="bz-row__desc">' + esc(B.get(biz.description)) + '</p>' : '') +
          '<div class="bz-row__meta">' + rating(biz) + statusChip(biz) + verifiedChip(biz) + demoChip(biz) + '</div>' +
          '<div class="bz-row__foot">' +
            '<div class="bz-row__acts">' + acts.join('') + '</div>' +
            '<a class="bz-card__cta" href="' + esc(B.profileUrl(biz)) + '">' + esc(t('viewDetails')) + '<span class="bz-card__arrow">' + icon('arrow') + '</span></a>' +
          '</div>' +
        '</div>' +
      '</article>'
  }

  /* Skeleton used for the first paint before data lands. */
  function skeletonCards (n) {
    var out = ''
    for (var i = 0; i < n; i++) {
      out += '<div class="bz-card bz-card--skel" aria-hidden="true">' +
        '<span class="bz-skel bz-skel--media"></span>' +
        '<div class="bz-card__body"><span class="bz-skel bz-skel--line" style="width:38%"></span>' +
        '<span class="bz-skel bz-skel--line bz-skel--title" style="width:74%"></span>' +
        '<span class="bz-skel bz-skel--line" style="width:52%"></span>' +
        '<span class="bz-skel bz-skel--line" style="width:100%;height:52px"></span></div></div>'
    }
    return out
  }

  function emptyState (title, sub) {
    return '<div class="bz-empty" role="status">' +
      '<span class="bz-empty__mark" aria-hidden="true">' + icon('search') + '</span>' +
      '<h3 class="bz-empty__title">' + esc(title) + '</h3>' +
      '<p class="bz-empty__sub">' + esc(sub) + '</p>' +
      '<button type="button" class="btn btn--ink" data-bz-clear>' + esc(t('clearAll')) + '</button>' +
    '</div>'
  }

  /* ------------------------------------------------------------------ */
  /* Mount points — every section on every page                         */
  /* ------------------------------------------------------------------ */

  var MOUNT = {}

  /* Quick category rail under the search box. */
  MOUNT.quick = function (host) {
    var cats = B.activeCategories()
    host.innerHTML = cats.map(function (c) {
      return '<a class="bz-quick" href="' + esc(B.catUrl(c.slug)) + '">' +
        '<span class="bz-quick__icon">' + icon(c.icon) + '</span>' +
        '<span class="bz-quick__name">' + esc(B.get(c.name)) + '</span>' +
        '<span class="bz-quick__n">' + B.countIn(c.slug) + '</span>' +
      '</a>'
    }).join('') + '<p class="bz-hint">' + esc(t('moreCatsNote')) + '</p>'
  }

  /* Featured businesses on the landing page. */
  MOUNT.featured = function (host) {
    var n = parseInt(host.getAttribute('data-limit'), 10) || 6
    var list = B.businesses.slice().sort(function (a, b) {
      return String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    }).slice(0, n)
    host.innerHTML = list.map(card).join('')
  }

  /* Large category grid. data-limit keeps the homepage preview short
     while the directory landing shows every active category. */
  MOUNT.categories = function (host) {
    var all = B.activeCategories()
    var lim = parseInt(host.getAttribute('data-limit'), 10)
    var cats = lim > 0 ? all.slice(0, lim) : all
    host.innerHTML = '<div class="bz-catgrid">' + cats.map(function (c, i) {
      var big = i === 0 && !host.hasAttribute('data-limit')
      return '<a class="bz-catgrid__item' + (big ? ' bz-catgrid__item--lead' : '') + '" href="' + esc(B.catUrl(c.slug)) + '">' +
        '<span class="bz-catgrid__icon">' + icon(c.icon) + '</span>' +
        '<span class="bz-catgrid__body">' +
          '<span class="bz-catgrid__name">' + esc(B.get(c.name)) + '</span>' +
          '<span class="bz-catgrid__blurb">' + esc(B.get(c.blurb)) + '</span>' +
          '<span class="bz-catgrid__n">' + B.countIn(c.slug) + ' \u00b7 ' + esc(t('businesses')) + '</span>' +
        '</span>' +
        '<span class="bz-catgrid__cta">' + esc(t('viewDetails')) + ' \u2192</span>' +
      '</a>'
    }).join('') + '</div>' + (all.length < B.categories.length
      ? '<p class="bz-hint">' + esc(t('moreCatsNote')) + '</p>' : '')
  }

  /* The six areas, mirroring the Explore Buxar structure. */
  MOUNT.areas = function (host) {
    host.innerHTML = '<div class="bz-area">' + B.areas.map(function (a, i) {
      var n = B.countIn(null, a.slug)
      return '<a class="bz-area__item' + (i === 0 ? ' bz-area__item--lead' : '') + '" href="' + esc(B.areaUrl(a.slug)) + '">' +
        '<span class="bz-area__num">' + (i + 1 < 10 ? '0' + (i + 1) : i + 1) + '</span>' +
        '<span class="bz-area__body">' +
          '<span class="bz-area__name">' + esc(B.get(a.name)) + '</span>' +
          '<span class="bz-area__count">' + n + ' \u00b7 ' + esc(t('businesses')) + '</span>' +
        '</span>' +
        '<span class="bz-area__cta">' + esc(t('viewAllArea')) + '</span>' +
      '</a>'
    }).join('') + '</div>'
  }

  /* "What are you looking for?" discovery tiles. */
  MOUNT.discovery = function (host) {
    var cats = B.activeCategories().slice(0, 6)
    host.innerHTML = '<div class="bz-find">' + cats.map(function (c) {
      return '<a class="bz-find__item" href="' + esc(B.catUrl(c.slug)) + '">' +
        '<span class="bz-find__icon">' + icon(c.icon) + '</span>' +
        '<span class="bz-find__label">' + esc(c.find ? B.get(c.find) : B.get(c.name)) + '</span>' +
        '<span class="bz-find__arrow">' + icon('arrow') + '</span>' +
      '</a>'
    }).join('') + '</div>'
  }

  /* Businesses on an Explore Buxar area page. Mounted with data-slug.
     The section carries .bz-page so this module's own colour tokens
     resolve even though the host page never declares them. */
  MOUNT.area = function (host) {
    var slug = host.getAttribute('data-slug')
    var list = B.businesses.filter(function (b) { return b.area === slug })
    var name = areaName(slug)

    host.innerHTML =
      '<section class="section bz-page bz-area-biz" id="area-businesses">' +
        '<div class="shell">' +
          '<header class="section__head section__head--left reveal">' +
            '<p class="section__label">' + esc(t('areaBizTitle')) + '</p>' +
            '<h2 class="section__title serif">' + esc(name) + '</h2>' +
            '<p class="section__sub">' + esc(t('areaBizSub')) + '</p>' +
          '</header>' +
          (list.length
            ? '<div class="bz-grid">' + list.map(card).join('') + '</div>' +
              '<div class="section__cta"><a class="btn btn--ink" href="' + esc(B.areaUrl(slug)) + '">' + esc(t('viewAllArea')) + '</a></div>'
            : emptyState(t('noAreaTitle'), t('noAreaSub'))) +
        '</div>' +
      '</section>'
  }

  /* Nearby businesses on a tourism page. Nothing is matched until a
     destination and a business share verified location data. */
  MOUNT.tourism = function (host) {
    var mappable = B.mapBusinesses()
    host.innerHTML =
      '<section class="section bz-page bz-tourism-biz" id="tourism-businesses">' +
        '<div class="shell">' +
          '<header class="section__head section__head--left reveal">' +
            '<p class="section__label">' + esc(t('tourismBizTitle')) + '</p>' +
            '<h2 class="section__title serif">' + esc(t('businesses')) + '</h2>' +
            '<p class="section__sub">' + esc(t('tourismBizSub')) + '</p>' +
          '</header>' +
          (mappable.length
            ? '<div class="bz-grid">' + mappable.map(card).join('') + '</div>'
            : emptyState(t('noAreaTitle'), t('tourismBizSub'))) +
        '</div>' +
      '</section>'
  }

  /* ------------------------------------------------------------------ */
  /* Search + filters (listing page)                                    */
  /* ------------------------------------------------------------------ */

  var state = {
    q: '',
    cat: [],
    loc: [],
    type: [],
    svc: [],
    verified: false,
    sort: 'relevance',
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
    state.loc = p.loc ? p.loc.split(',').filter(Boolean) : []
    state.type = p.type ? p.type.split(',').filter(Boolean) : []
    state.svc = p.svc ? p.svc.split(',').filter(Boolean) : []
    state.verified = p.verified === '1'
    state.sort = p.sort || (state.q ? 'relevance' : 'newest')
    state.shown = PAGE_SIZE
  }

  function syncUrl () {
    var sp = []
    if (state.q) sp.push('q=' + encodeURIComponent(state.q))
    if (state.cat.length) sp.push('cat=' + state.cat.join(','))
    if (state.loc.length) sp.push('loc=' + state.loc.join(','))
    if (state.type.length) sp.push('type=' + state.type.join(','))
    if (state.svc.length) sp.push('svc=' + state.svc.join(','))
    if (state.verified) sp.push('verified=1')
    if (state.sort !== 'newest') sp.push('sort=' + state.sort)
    var qs = sp.join('&')
    try { doc.defaultView.history.replaceState(null, '', qs ? '?' + qs : doc.defaultView.location.pathname) } catch (e) {}
  }

  /* Only facets that at least one record backs are offered. If no
     record is verified, there is no verified filter; if no record has
     hours, there is no open-now filter; and so on. */
  function filterData () {
    var cats = {}, locs = {}, types = {}, svcs = {}
    B.businesses.forEach(function (b) {
      cats[b.category] = true
      locs[b.area] = true
      if (b.type) types[b.type] = true
      serviceLabels(b).forEach(function (l) { svcs[l] = true })
    })
    return {
      cats: B.categories.filter(function (c) { return cats[c.slug] }),
      locs: B.areas.filter(function (a) { return locs[a.slug] }),
      types: B.types.filter(function (x) { return types[x.slug] }),
      svcs: Object.keys(svcs).sort(),
      verified: B.hasVerified(),
      hours: B.hasHours(),
      price: B.hasPrice()
    }
  }

  function group (id, legend, name, items, kind) {
    if (!items.length) return ''
    /* Service labels arrive as plain strings, categories/locations/types as
       records with a slug and a bilingual name. Normalising both shapes here
       keeps the checkbox value, its label and its query parameter identical. */
    var boxes = items.map(function (it) {
      var isSvc = kind === 'svc'
      var val = isSvc ? String(it) : it.slug
      var label = isSvc ? String(it) : B.get(it.name)
      var on = state[kind].indexOf(val) > -1
      var count = countFor(kind, val)
      return '<label class="bz-check">' +
        '<input type="checkbox" name="' + name + '" value="' + esc(val) + '"' + (on ? ' checked' : '') + ' />' +
        '<span class="bz-check__box" aria-hidden="true">' + icon('check') + '</span>' +
        '<span class="bz-check__label">' + esc(label) + '</span>' +
        '<span class="bz-check__n">' + count + '</span>' +
      '</label>'
    }).join('')
    return '<fieldset class="bz-group" data-group="' + id + '"><legend class="bz-group__legend">' + esc(legend) + '</legend>' + boxes + '</fieldset>'
  }

  function countFor (kind, val) {
    return B.businesses.filter(function (b) {
      if (kind === 'cat' && b.category !== val) return false
      if (kind === 'loc' && b.area !== val) return false
      if (kind === 'type' && b.type !== val) return false
      if (kind === 'svc' && serviceLabels(b).indexOf(val) === -1) return false
      return true
    }).length
  }

  function renderFilters (host, data) {
    var html =
      group('cat', t('fCategory'), 'cat', data.cats, 'cat') +
      group('loc', t('fLocation'), 'loc', data.locs, 'loc') +
      group('type', t('fType'), 'type', data.types, 'type') +
      group('svc', t('fService'), 'svc', data.svcs, 'svc')

    if (data.verified) {
      html += '<fieldset class="bz-group" data-group="verified"><legend class="bz-group__legend">' + esc(t('fVerified')) + '</legend>' +
        '<label class="bz-check"><input type="checkbox" name="verified" value="1"' + (state.verified ? ' checked' : '') + ' />' +
        '<span class="bz-check__box" aria-hidden="true">' + icon('check') + '</span>' +
        '<span class="bz-check__label">' + esc(t('fVerified')) + '</span></label></fieldset>'
    }
    /* Open-now and price filters are intentionally omitted: no record
       carries opening hours or a price band yet. They appear on their
       own the moment a real listing supplies the data. */

    html += '<div class="bz-filters__foot">' +
      '<button type="button" class="btn btn--ink bz-filters__apply" data-bz-close-sheet>' + esc(t('applyFilters')) + '</button>' +
      '<button type="button" class="bz-filters__clear" data-bz-clear>' + esc(t('clearAll')) + '</button>' +
    '</div>'

    host.innerHTML = html
  }

  function renderSort (host, data) {
    var opts = [
      { v: 'relevance', l: t('sortRelevance') },
      { v: 'newest', l: t('sortNewest') },
      { v: 'name', l: t('sortName') }
    ]
    if (B.mapBusinesses().length) opts.push({ v: 'distance', l: t('sortDistance') })
    host.innerHTML = '<label class="bz-sort"><span class="bz-sort__label">' + esc(t('sortBy')) + '</span>' +
      '<select class="bz-sort__select" name="sort">' +
      opts.map(function (o) {
        return '<option value="' + o.v + '"' + (state.sort === o.v ? ' selected' : '') + '>' + esc(o.l) + '</option>'
      }).join('') + '</select></label>'
  }

  function apply () {
    var q = state.q.toLowerCase()
    var list = B.businesses.filter(function (b) {
      if (state.cat.length && state.cat.indexOf(b.category) === -1) return false
      if (state.loc.length && state.loc.indexOf(b.area) === -1) return false
      if (state.type.length && b.type && state.type.indexOf(b.type) === -1) return false
      if (state.type.length && !b.type) return false
      if (state.svc.length) {
        var has = serviceLabels(b).some(function (l) { return state.svc.indexOf(l) > -1 })
        if (!has) return false
      }
      if (state.verified && !B.isVerified(b)) return false
      if (q && haystack(b).indexOf(q) === -1) return false
      return true
    })

    if (state.sort === 'name') {
      list.sort(function (a, b) { return B.get(a.name).localeCompare(B.get(b.name)) })
    } else if (state.sort === 'relevance') {
      list.sort(function (a, b) {
        var d = score(b, q) - score(a, q)
        return d !== 0 ? d : B.get(a.name).localeCompare(B.get(b.name))
      })
    } else if (state.sort === 'distance') {
      list.sort(function (a, b) {
        var da = (a.coords && a.coordsVerified) ? 0 : 1
        var db = (b.coords && b.coordsVerified) ? 0 : 1
        return da !== db ? da - db : B.get(a.name).localeCompare(B.get(b.name))
      })
    } else {
      list.sort(function (a, b) {
        return String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
      })
    }
    return list
  }

  function renderResults () {
    var grid = doc.getElementById('bz-grid')
    var countEl = doc.getElementById('bz-count')
    var more = doc.getElementById('bz-more')
    var emptyHost = doc.getElementById('bz-empty-host')
    if (!grid) return

    var list = apply()
    var slice = list.slice(0, state.shown)

    if (countEl) {
      countEl.textContent = list.length
        ? t('showing') + ' ' + Math.min(state.shown, list.length) + ' ' + t('of') + ' ' + list.length + ' ' + t('businesses')
        : '0 ' + t('businesses')
    }

    /* An empty result is a designed state, not a blank page: the grid is
       cleared and the empty-state block explains what happened. */
    if (!list.length) {
      grid.innerHTML = ''
      grid.hidden = true
      if (emptyHost) emptyHost.innerHTML = emptyState(t('noResultsTitle'), t('noResultsSub'))
      if (more) more.hidden = true
      return
    }

    if (emptyHost) emptyHost.innerHTML = ''
    grid.hidden = false
    grid.innerHTML = slice.map(row).join('')
    if (more) more.hidden = slice.length >= list.length
    revealNow(grid)
  }

  function clearAll () {
    state.q = ''
    state.cat = []; state.loc = []; state.type = []; state.svc = []
    state.verified = false
    state.sort = 'newest'
    state.shown = PAGE_SIZE
    var qi = doc.getElementById('bz-q')
    if (qi) qi.value = ''
    var fi = doc.getElementById('bz-filters')
    if (fi) renderFilters(fi, filterData())
    var so = doc.getElementById('bz-sort')
    if (so) renderSort(so, filterData())
    syncUrl()
    renderResults()
  }

  /* Re-reads state from the URL and repaints. Safe to call repeatedly:
     it only writes innerHTML / values, never binds listeners. */
  function refreshList () {
    var grid = doc.getElementById('bz-grid')
    if (!grid) return

    readState()

    var qi = doc.getElementById('bz-q')
    if (qi) qi.value = state.q

    var fi = doc.getElementById('bz-filters')
    var so = doc.getElementById('bz-sort')
    if (fi) renderFilters(fi, filterData())
    if (so) renderSort(so, filterData())

    syncUrl()
    renderResults()
  }

  function initList () {
    if (!doc.getElementById('bz-grid')) return

    /* Listeners are bound exactly once. refreshList() is what the
       language observer calls, so flipping the language repaints the
       directory without stacking a second copy of every handler. */
    if (doc.body.getAttribute('data-bz-bound')) return
    doc.body.setAttribute('data-bz-bound', '1')

    /* Hero search on the landing page jumps straight into results. */
    var heroForm = doc.getElementById('bz-hero-form')
    if (heroForm) {
      heroForm.addEventListener('submit', function (e) {
        e.preventDefault()
        var val = (heroForm.querySelector('input[name="q"]') || {}).value || ''
        var q = val.trim()
        doc.defaultView.location.href = q ? B.listUrl('?q=' + encodeURIComponent(q)) : B.listUrl()
      })
    }

    /* Results-page search box. */
    var bar = doc.getElementById('bz-bar-form')
    if (bar) {
      bar.addEventListener('submit', function (e) {
        e.preventDefault()
        state.q = (bar.querySelector('input[name="q"]') || {}).value.trim()
        state.shown = PAGE_SIZE
        syncUrl()
        renderResults()
      })
    }

    var fi = doc.getElementById('bz-filters')
    if (fi) {
      fi.addEventListener('change', function (e) {
        var el = e.target
        if (el.name === 'verified') {
          state.verified = el.checked
        } else if (['cat', 'loc', 'type', 'svc'].indexOf(el.name) > -1) {
          state[el.name] = state[el.name].filter(function (v) { return v !== el.value })
          if (el.checked) state[el.name].push(el.value)
        }
        state.shown = PAGE_SIZE
        syncUrl()
        renderResults()
      })
    }

    var so = doc.getElementById('bz-sort')
    if (so) {
      so.addEventListener('change', function (e) {
        state.sort = e.target.value
        state.shown = PAGE_SIZE
        syncUrl()
        renderResults()
      })
    }

    var more = doc.getElementById('bz-more')
    if (more) {
      more.addEventListener('click', function () {
        state.shown += PAGE_SIZE
        renderResults()
      })
    }

    /* Mobile: filters open as a bottom sheet over the results. The
       closed state is visibility:hidden in CSS, which already removes
       the panel from the tab order — so no aria-hidden is needed, and
       adding one would only hide focusable controls from assistive
       technology. */
    var sheetBtn = doc.getElementById('bz-sheet-btn')
    if (sheetBtn && fi) {
      var setSheet = function (open) {
        doc.body.classList.toggle('bz-sheet-open', open)
        sheetBtn.setAttribute('aria-expanded', open ? 'true' : 'false')
        if (open) {
          var first = fi.querySelector('input, button')
          if (first) first.focus({ preventScroll: true })
        } else {
          sheetBtn.focus({ preventScroll: true })
        }
      }
      sheetBtn.addEventListener('click', function () { setSheet(true) })
      fi.addEventListener('click', function (e) {
        if (e.target.closest('[data-bz-close-sheet]')) setSheet(false)
      })
      doc.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && doc.body.classList.contains('bz-sheet-open')) setSheet(false)
      })
    }

    refreshList()
  }

  /* ------------------------------------------------------------------ */
  /* Profile page                                                       */
  /* ------------------------------------------------------------------ */

  function profileSection (title, body, mod) {
    return '<section class="bz-sec' + (mod ? ' ' + mod : '') + '">' +
      '<header class="bz-sec__head"><p class="section__label">' + esc(title) + '</p></header>' +
      '<div class="bz-sec__body">' + body + '</div></section>'
  }

  function contactList (biz) {
    var rows = []
    if (biz.phone) rows.push([t('phone') || 'Phone', biz.phone, 'tel:' + biz.phone.replace(/\s+/g, ''), 'phone'])
    if (biz.whatsapp) rows.push([t('whatsapp'), biz.whatsapp, 'https://wa.me/' + String(biz.whatsapp).replace(/\D/g, ''), 'chat'])
    if (biz.email) rows.push([t('email'), biz.email, 'mailto:' + biz.email, 'mail'])
    if (biz.website) rows.push([t('website'), biz.website, biz.website, 'globe'])
    biz.socialLinks.forEach(function (s) { rows.push([s.label || s.name, s.url, s.url, 'globe']) })
    return rows
  }

  function renderProfile () {
    var host = doc.getElementById('bz-profile')
    if (!host) return

    var p = params()
    var biz = B.bySlug(p.slug)

    /* An unknown slug is its own state, distinct from an empty search:
       the page keeps one H1, a sensible title, and a way back. */
    if (!biz) {
      doc.title = t('missingTitle') + ' | TheBuxar.com'
      var nmd = doc.querySelector('meta[name="description"]')
      if (nmd) nmd.setAttribute('content', t('missingSub').slice(0, 300))
      host.innerHTML = '<section class="section bz-page bz-profile--missing"><div class="shell">' +
        '<nav class="bz-crumbs" aria-label="Breadcrumb"><ol>' +
          '<li><a href="' + B.path + 'index.html">' + esc(t('home')) + '</a></li>' +
          '<li><a href="' + esc(B.directoryUrl()) + '">' + esc(t('dirLabel')) + '</a></li>' +
          '<li aria-current="page">' + esc(t('missingTitle')) + '</li></ol></nav>' +
        '<h1 class="bz-missing__title">' + esc(t('missingTitle')) + '</h1>' +
        '<div class="bz-empty" role="status">' +
          '<p class="bz-empty__sub">' + esc(t('missingSub')) + '</p>' +
          '<a class="btn btn--ink" href="' + esc(B.listUrl()) + '">' + esc(t('browseAll')) + '</a>' +
        '</div>' +
        '</div></section>'
      return
    }

    var name = B.get(biz.name)
    var hasDir = !!(biz.coords && biz.coordsVerified)

    /* --- SEO, injected because one template serves every slug --- */
    doc.title = name + ' \u2014 ' + catName(biz.category) + ' in Buxar | TheBuxar.com'
    var desc = biz.description
      ? name + ' \u2014 ' + catName(biz.category) + ' in ' + areaName(biz.area) + ', Buxar. ' + B.get(biz.description)
      : name + ' \u2014 ' + catName(biz.category) + ' in ' + areaName(biz.area) + ', Buxar.'
    var md = doc.querySelector('meta[name="description"]')
    if (md) md.setAttribute('content', desc.slice(0, 300))

    /* --- Crumbs --- */
    var crumbs = '<nav class="bz-crumbs" aria-label="Breadcrumb"><ol>' +
      '<li><a href="' + B.path + 'index.html">' + esc(t('home')) + '</a></li>' +
      '<li><a href="' + esc(B.directoryUrl()) + '">' + esc(t('dirLabel')) + '</a></li>' +
      '<li><a href="' + esc(B.catUrl(biz.category)) + '">' + esc(catName(biz.category)) + '</a></li>' +
      '<li aria-current="page">' + esc(name) + '</li></ol></nav>'

    /* --- Cover + hero --- */
    var cover = biz.coverImage
      ? '<img class="bz-cover__img" src="' + B.path + esc(biz.coverImage) + '" alt="' + esc(name) + '" />'
      : '<div class="bz-cover__plain" aria-hidden="true"><span class="bz-cover__mark">' + icon('building') + '</span>' +
        '<span class="bz-cover__note">' + esc(t('photogPending')) + '</span></div>'

    var logo = biz.logo
      ? '<img class="bz-hero__logo-img" src="' + B.path + esc(biz.logo) + '" alt="' + esc(name) + ' logo" />'
      : '<span class="bz-hero__logo bz-mono" aria-hidden="true">' + esc(B.monogram(biz)) + '</span>'

    var hero =
      '<section class="bz-hero">' +
        '<div class="bz-cover">' + cover + '</div>' +
        '<div class="shell bz-hero__inner">' +
          logo +
          '<p class="bz-hero__cat">' + esc(catName(biz.category)) +
            (biz.subcategory ? ' <span class="bz-dot">\u00b7</span> ' + esc(B.get(biz.subcategory)) : '') + '</p>' +
          '<h1 class="bz-hero__name">' + esc(name) + '</h1>' +
          '<p class="bz-hero__loc">' + icon('pin') +
            '<a href="' + esc(B.areaUrl(biz.area)) + '">' + esc(areaName(biz.area)) + '</a>' +
            '<span class="bz-dot">\u00b7</span><span>Buxar, Bihar</span></p>' +
          '<div class="bz-hero__meta">' + rating(biz) + statusChip(biz) + verifiedChip(biz) + demoChip(biz) + '</div>' +
          '<div class="bz-hero__acts">' + contactActions(biz) + '</div>' +
        '</div>' +
      '</section>'

    /* --- About --- */
    var about = biz.description
      ? '<p class="bz-about">' + esc(B.get(biz.description)) + '</p>'
      : '<p class="bz-about bz-about--none">' + esc(t('pending')) + '</p>'
    if (biz.demo) about += '<p class="bz-callout">' + icon('check') + '<span>' + esc(t('demoProfileNote')) + '</span></p>'

    /* --- Services --- */
    var svc = serviceLabels(biz)
    var services = svc.length
      ? '<ol class="bz-svcs">' + svc.map(function (s, i) {
          return '<li class="bz-svcs__item"><span class="bz-svcs__n">' + (i < 9 ? '0' : '') + (i + 1) + '</span>' +
            '<span class="bz-svcs__label">' + esc(s) + '</span></li>'
        }).join('') + '</ol>'
      : '<p class="bz-about bz-about--none">' + esc(t('pending')) + '</p>'

    /* --- Contact --- */
    var rows = contactList(biz)
    var contact = rows.length
      ? '<ul class="bz-contact">' + rows.map(function (r) {
          return '<li class="bz-contact__row">' +
            '<span class="bz-contact__icon">' + icon(r[3]) + '</span>' +
            '<span class="bz-contact__text"><span class="bz-contact__label">' + esc(r[0]) + '</span>' +
            '<a href="' + esc(r[2]) + '"' + (r[3] === 'globe' ? ' rel="noopener" target="_blank"' : '') + '>' + esc(r[1]) + '</a></span>' +
          '</li>'
        }).join('') + '</ul>' +
        '<p class="bz-note">' + icon('check') + '<span>' + esc(t('noPhoneNote')) + '</span></p>'
      : '<div class="bz-empty bz-empty--sm"><span class="bz-empty__mark" aria-hidden="true">' + icon('phone') + '</span>' +
        '<h3 class="bz-empty__title">' + esc(t('contact')) + '</h3>' +
        '<p class="bz-empty__sub">' + esc(t('noPhoneNote')) + '</p></div>'

    /* --- Location --- */
    var location = hasDir
      ? '<div class="bz-map"><div class="bz-map__pin" aria-hidden="true"></div></div>' +
        '<p class="bz-about">' + esc(biz.coords[0].toFixed(4) + '\u00b0 N, ' + biz.coords[1].toFixed(4) + '\u00b0 E') + '</p>'
      : '<div class="bz-map bz-map--empty"><span class="bz-empty__mark" aria-hidden="true">' + icon('pin') + '</span>' +
        '<p class="bz-about">' + esc(t('noAddressNote')) + '</p></div>'
    if (biz.address) {
      location += '<p class="bz-about">' + esc(biz.address) + '</p>'
      location += '<a class="btn btn--ink" href="' + esc(B.directionsUrl(biz)) + '">' + icon('pin') + '<span>' + esc(t('getDirections')) + '</span></a>'
    }

    /* --- Hours --- */
    var hours = biz.hours
      ? '<dl class="bz-hours">' + biz.hours.map(function (h) {
          return '<div class="bz-hours__row"><dt>' + esc(h[0]) + '</dt><dd>' + esc(h[1]) + '</dd></div>'
        }).join('') + '</dl>'
      : '<div class="bz-empty bz-empty--sm"><span class="bz-empty__mark" aria-hidden="true">' + icon('clock') + '</span>' +
        '<h3 class="bz-empty__title">' + esc(t('hours')) + '</h3><p class="bz-empty__sub">' + esc(t('pending')) + '</p></div>'

    /* --- Gallery --- */
    var gallery = biz.gallery && biz.gallery.length
      ? '<div class="bz-gallery">' + biz.gallery.map(function (g, i) {
          return '<button type="button" class="bz-gallery__fig" data-bz-lb="' + i + '">' +
            '<img src="' + B.path + esc(g.src) + '" alt="' + esc(g.alt || name) + '" loading="lazy" decoding="async" /></button>'
        }).join('') + '</div>' +
        '<p class="bz-note">' + esc(t('galleryTap')) + '</p>'
      : '<div class="bz-empty bz-empty--sm"><span class="bz-empty__mark" aria-hidden="true">' + icon('image') + '</span>' +
        '<h3 class="bz-empty__title">' + esc(t('noPhotos')) + '</h3><p class="bz-empty__sub">' + esc(t('noPhotosSub')) + '</p></div>'

    /* --- Reviews --- */
    var reviews = '<div class="bz-empty bz-empty--sm"><span class="bz-empty__mark" aria-hidden="true">' + icon('star') + '</span>' +
      '<h3 class="bz-empty__title">' + esc(t('comingSoon')) + '</h3><p class="bz-empty__sub">' + esc(t('comingSoonSub')) + '</p></div>'

    /* --- Related --- */
    var related = B.businesses.filter(function (b) {
      return b.slug !== biz.slug && (b.category === biz.category || b.area === biz.area)
    }).slice(0, 3)
    var relatedHtml = related.length
      ? '<div class="bz-grid">' + related.map(card).join('') + '</div>'
      : '<p class="bz-about bz-about--none">' + esc(t('noResultsSub')) + '</p>'

    host.innerHTML =
      '<div class="bz-profile">' + crumbs + hero +
      '<div class="shell bz-profile__grid">' +
        '<div class="bz-profile__main">' +
          profileSection(t('about'), about) +
          profileSection(t('services'), services) +
          profileSection(t('contact'), contact) +
          '<section class="bz-sec" id="bz-location">' + '<header class="bz-sec__head"><p class="section__label">' + esc(t('location')) + '</p></header>' +
            '<div class="bz-sec__body">' + location + '</div></section>' +
          profileSection(t('hours'), hours) +
          profileSection(t('photos'), gallery) +
        '</div>' +
        '<aside class="bz-profile__side">' +
          '<div class="bz-sec"><header class="bz-sec__head"><p class="section__label">' + esc(t('reviews')) + '</p></header>' +
            '<div class="bz-sec__body">' + reviews + '</div></div>' +
        '</aside>' +
      '</div>' +
      profileSection(t('related'), relatedHtml, 'bz-sec--wide') +
        /* Business → Marketplace link. This module does not depend on the
           marketplace data file, so it only emits the mount point; when
           js/market-data.js is also loaded, js/market.js fills it with the
           products of any seller linked to this business. With no seller
           linked, it renders an honest "not linked yet" empty state. */
        (window.TheBuxarMarket
          ? '<section class="bz-sec bz-sec--wide" id="bz-marketplace">' +
              '<header class="bz-sec__head"><p class="section__label" data-en="From this business" data-hi="\u0907\u0938 \u0935\u094d\u092f\u0935\u0938\u093e\u092f \u0938\u0947">From this business</p></header>' +
              '<div class="bz-sec__body"><div data-mk="fromBusiness" data-slug="' + esc(biz.slug) + '"></div></div>' +
            '</section>'
          : '') +
      '<section class="section bz-owner">' +
        '<div class="shell">' +
          '<div class="bz-owner__card reveal">' +
            '<p class="section__label">' + esc(t('ownerTitle')) + '</p>' +
            '<h2 class="bz-owner__title serif">' + esc(t('ownerSub')) + '</h2>' +
            '<div class="bz-owner__acts">' +
              '<a class="btn btn--gold" href="' + esc(B.addUrl()) + '">' + esc(t('listBusiness')) + '</a>' +
              '<a class="btn btn--ghost-light" href="' + esc(B.claimUrl()) + '">' + esc(t('claimBusiness')) + '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '<nav class="bz-actionbar" aria-label="Contact">' + contactActions(biz) + '</nav>' +
      '</div>'

    revealNow(host)
    initGalleryLightbox(biz)

    /* The marketplace mount above was written into the DOM just now, so it
       needs the marketplace renderer. It has already booted by this point,
       hence the explicit call rather than waiting for its own pass. */
    if (window.TheBuxarMarket && typeof window.TheBuxarMarket.refreshMounts === 'function') {
      try { window.TheBuxarMarket.refreshMounts() } catch (e) {}
    }
  }

  /* Gallery lightbox. Same contract as the Explore / History lightboxes:
     body scroll lock, focus saved and returned, counter, caption, credit. */
  function initGalleryLightbox (biz) {
    /* Tear down any previous lightbox first. renderProfile() re-runs on
       every language switch, and without this the dialog node, its
       listeners and its document-level keydown handler would stack up. */
    if (lbTeardown) { lbTeardown(); lbTeardown = null }

    var figs = doc.querySelectorAll('[data-bz-lb]')
    if (!figs.length || !biz.gallery || !biz.gallery.length) return

    var box = doc.createElement('div')
    box.className = 'bz-lb'
    box.setAttribute('role', 'dialog')
    box.setAttribute('aria-modal', 'true')
    box.setAttribute('aria-label', t('photos'))
    box.hidden = true
    box.innerHTML =
      '<button type="button" class="bz-lb__close" data-bz-lb-close aria-label="Close">' + icon('close') + '</button>' +
      '<button type="button" class="bz-lb__prev" data-bz-lb-prev aria-label="Previous">' + icon('arrow') + '</button>' +
      '<button type="button" class="bz-lb__next" data-bz-lb-next aria-label="Next">' + icon('arrow') + '</button>' +
      '<figure class="bz-lb__fig"><img class="bz-lb__img" alt="" /><figcaption class="bz-lb__cap"></figcaption></figure>'
    doc.body.appendChild(box)

    var img = box.querySelector('.bz-lb__img')
    var cap = box.querySelector('.bz-lb__cap')
    var n = 0
    var lastFocused = null

    function show (i) {
      n = (i + biz.gallery.length) % biz.gallery.length
      var g = biz.gallery[n]
      img.setAttribute('src', B.path + g.src)
      img.setAttribute('alt', g.alt || B.get(biz.name))
      cap.innerHTML = '<span class="bz-lb__n">' + (n + 1) + ' / ' + biz.gallery.length + '</span>' +
        '<span class="bz-lb__text">' + esc(g.caption || g.alt || '') + '</span>' +
        (g.credit ? '<span class="bz-lb__credit">' + esc(g.credit) + '</span>' : '')
    }

    function open (i) {
      lastFocused = doc.activeElement
      show(i)
      box.hidden = false
      requestAnimationFrame(function () { box.classList.add('is-open') })
      doc.body.style.overflow = 'hidden'
      var c = box.querySelector('[data-bz-lb-close]')
      if (c) c.focus({ preventScroll: true })
    }

    function close () {
      box.classList.remove('is-open')
      doc.body.style.overflow = ''
      box.hidden = true
      if (lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true })
    }

    figs.forEach(function (f) {
      f.addEventListener('click', function () { open(parseInt(f.getAttribute('data-bz-lb'), 10) || 0) })
    })
    box.querySelector('[data-bz-lb-close]').addEventListener('click', close)
    box.querySelector('[data-bz-lb-prev]').addEventListener('click', function () { show(n - 1) })
    box.querySelector('[data-bz-lb-next]').addEventListener('click', function () { show(n + 1) })

    function onKey (e) {
      if (box.hidden) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') show(n - 1)
      if (e.key === 'ArrowRight') show(n + 1)
    }
    doc.addEventListener('keydown', onKey)

    lbTeardown = function () {
      doc.removeEventListener('keydown', onKey)
      if (box.parentNode) box.parentNode.removeChild(box)
    }
  }

  /* ------------------------------------------------------------------ */
  /* Submission + claim forms                                           */
  /*                                                                     */
  /* Both validate and then say plainly that nothing was sent. There is  */
  /* no backend, so the form must not pretend a listing was stored.     */
  /* ------------------------------------------------------------------ */
  function initForms () {
    var form = doc.querySelector('[data-bz-form]')
    if (!form) return
    var status = doc.getElementById('bz-form-status')

    /* Category + area selects are filled from the dataset so a new
       category appears here automatically. */
    var cs = form.querySelector('select[name="category"]')
    if (cs) {
      cs.innerHTML = '<option value="">' + esc(t('chooseCategory')) + '</option>' +
        B.categories.map(function (c) {
          return '<option value="' + esc(c.slug) + '">' + esc(B.get(c.name)) + '</option>'
        }).join('')
    }
    var as = form.querySelector('select[name="area"]')
    if (as) {
      as.innerHTML = '<option value="">' + esc(t('chooseArea')) + '</option>' +
        B.areas.map(function (a) {
          return '<option value="' + esc(a.slug) + '">' + esc(B.get(a.name)) + '</option>'
        }).join('')
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      if (!status) return
      if (!form.reportValidity ? form.reportValidity() : true) {
        status.textContent = t('notStored')
        status.className = 'bz-form__status is-warn'
        status.focus({ preventScroll: true })
      }
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
    if (!doc.__bzObs) {
      doc.__bzObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            doc.__bzObs.unobserve(entry.target)
          }
        })
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
    }
    els.forEach(function (el) { doc.__bzObs.observe(el) })
  }

  /* Any [data-bz-clear] button anywhere empties the filters. */
  function initClearButtons () {
    doc.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-bz-clear]')
      if (!btn) return
      e.preventDefault()
      if (doc.getElementById('bz-grid')) clearAll()
      else doc.defaultView.location.href = B.listUrl()
    })
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                               */
  /* ------------------------------------------------------------------ */

  function renderMounts () {
    var hosts = doc.querySelectorAll('[data-biz]')
    for (var i = 0; i < hosts.length; i++) {
      var host = hosts[i]
      var fn = MOUNT[host.getAttribute('data-biz')]
      if (!fn) continue
      try { fn(host) } catch (err) {
        console.error('[TheBuxar] business mount failed', host.getAttribute('data-biz'), err)
      }
    }
    revealNow(doc)
  }

  function boot () {
    ;[renderMounts, initList, renderProfile, initForms, initClearButtons].forEach(function (fn) {
      try { fn() } catch (e) { console.error('[TheBuxar] business init step failed', e) }
    })

    /* Re-render when the language toggle flips <html data-lang>. Mounts and
     the profile are idempotent; the listing repaints without rebinding. */
    try {
      new MutationObserver(function () {
        var steps = [
          renderMounts,
          renderProfile,
          function () { if (doc.getElementById('bz-grid')) refreshList() }
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