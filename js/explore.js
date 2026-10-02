/* ------------------------------------------------------------------ */
/* TheBuxar.com — Explore Buxar behaviours (pure vanilla, no deps)    */
/* Load after js/explore-data.js, which is the single source of truth */
/* for every place's guide. This renderer draws the whole module from */
/* that dataset: the area-page hero and all sections, the hub card    */
/* grid, the schematic district map, the DISTRICT EXPLORER grid, the   */
/* nearby list and the gallery lightbox.                              */
/*                                                                     */
/* Page wiring (inline in each page, before this script):              */
/*   <script>window.TheBuxarConfig = { path: './' }</script>          */
/* On hub pages (project root) path is './'; on area pages it is       */
/* '../../' so links and image URLs resolve from nested folders.       */
/*                                                                     */
/* Language: data content is chosen via L.get() at render time. The   */
/* site's lang toggle flips <html data-lang> which this file observes */
/* and re-renders. Static shells (nav, footer, loader) keep their     */
/* data-en/data-hi markup handled by main.js.                         */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var L = window.TheBuxarExplore
  if (!L) return

  var doc = document
  var B = { n: 25.58, s: 25.33, e: 84.2, w: 83.85 }

  var CONFIG = window.TheBuxarConfig || {}
  L.path = typeof CONFIG.path === 'string' ? CONFIG.path : ''

  var lbKeysBound = false

  function bySlug (slug) {
    if (!slug) return null
    for (var i = 0; i < L.places.length; i++) {
      if (L.places[i].slug === slug) return L.places[i]
    }
    return null
  }

  function href (p) { return L.path + p.url }
  function coordText (p) {
    if (p.coords && p.coordsVerified) return p.coords[0].toFixed(4) + '° N, ' + p.coords[1].toFixed(4) + '° E'
    return L.get(L.coordsPending)
  }

  function esc (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }

  function el (html) {
    var t = doc.createElement('template')
    t.innerHTML = html.trim()
    return t.content.firstElementChild
  }

  /* Hero title — the name with its final word set in italic. */
  function nameParts (name) {
    var words = String(name).split(/\s+/)
    var em = words.length > 1 ? words.pop() : ''
    return { pre: words.join(' '), em: em }
  }

  /* ---------------------------------------------------------------- */
  /* Section headers — label + <em> heading + sub, all from data      */
  /* ---------------------------------------------------------------- */
  var HEAD_LABELS = {
    intro: 'introLabel',
    why: 'whyLabel',
    famous: 'famousLabel',
    culture: 'cultureLabel',
    history: 'historyLabel',
    gallery: 'galleryLabel',
    location: 'locationLabel',
    visit: 'visitLabel'
  }

  function renderHead (block, key) {
    var labelKey = HEAD_LABELS[key]
    var label = labelKey ? L.get(L.ui[labelKey]) : ''
    var html = label ? '<p class="expl-label">' + esc(label) + '</p>' : ''
    html += '<h2 class="expl-title serif">' + esc(L.get(block.heading.pre)) +
      '<em>' + esc(L.get(block.heading.em)) + '</em></h2>'
    html += '<p class="expl-sub">' + esc(L.get(block.sub)) + '</p>'
    return html
  }

  function fillHead (scope, key) {
    var heads = scope.querySelectorAll('[data-expl="head"][data-head="' + key + '"]')
    Array.prototype.forEach.call(heads, function (head) {
      head.innerHTML = renderHead(blk(key), key)
    })
  }

  /* The current place, read from the body tag. */
  function currentPlace () {
    return bySlug(doc.body.getAttribute('data-slug'))
  }
  var blk = null

  /* ---------------------------------------------------------------- */
  /* HERO (area pages)                                                */
  /* ---------------------------------------------------------------- */
  function renderHero (place) {
    var bg = doc.querySelector('[data-expl="hero-bg"]')
    if (bg) bg.style.backgroundImage = "url('" + esc(L.path + place.heroImage) + "')"

    var inner = doc.querySelector('[data-expl="hero-inner"]')
    if (!inner) return
    var parts = nameParts(L.get(place.name))
    var title = esc(parts.pre) + (parts.em ? ' <em>' + esc(parts.em) + '</em>' : '')
    var html =
      '<p class="area-hero__kicker">' + esc(L.get(L.ui.exploreLabel) + ' · ' + L.get(place.role)) + '</p>' +
      '<h1 class="area-hero__title serif">' + title + '</h1>' +
      '<p class="area-hero__sub">' + esc(L.get(place.subtitle)) + '</p>' +
      '<div class="area-hero__actions">' +
        '<a class="btn btn--gold" href="#area-intro">' + esc(L.get(L.ui.start)) + '</a>' +
        '<a class="btn btn--ghost-light" href="#area-location">' + esc(L.get(L.ui.onMap)) + '</a>' +
      '</div>' +
      '<p class="area-hero__credit">' + esc(L.get(place.heroCredit)) + '</p>'
    inner.innerHTML = html
  }

  /* ---------------------------------------------------------------- */
  /* STATS strip                                                      */
  /* <dl class="expl-stats" data-expl="stats" data-slug="slug">        */
  /* ---------------------------------------------------------------- */
  function renderStats (panel) {
    var slug = panel.getAttribute('data-slug')
    var place = bySlug(slug)
    if (!place || !place.stats) return
    var rows = place.stats.map(function (s) {
      return '<div class="expl-stat">' +
        '<span class="expl-stat__value">' + esc(L.get(s.value)) + '</span>' +
        '<span class="expl-stat__label">' + esc(L.get(s.label)) + '</span>' +
      '</div>'
    }).join('')
    panel.innerHTML = rows
  }

  /* ---------------------------------------------------------------- */
  /* INTRO (area pages)                                               */
  /* ---------------------------------------------------------------- */
  function renderIntro (place) {
    var box = doc.querySelector('[data-expl="intro-text"]')
    if (box) {
      var paras = place.intro.paragraphs.map(function (p) {
        return '<p>' + esc(L.get(p)) + '</p>'
      }).join('')
      var fig = place.intro.figure ? (
        '<figure class="expl-intro__media">' +
          '<img src="' + esc(L.path + place.intro.figure.src) + '" alt="' + esc(place.intro.figure.alt) + '" loading="lazy" />' +
          '<figcaption>' + esc(L.get(place.intro.figure.caption)) + '</figcaption>' +
        '</figure>'
      ) : ''
      box.innerHTML =
        '<p class="expl-label">' + esc(L.get(L.ui.introLabel)) + '</p>' +
        '<h2 class="expl-title serif">' + esc(L.get({ en: 'About', hi: 'परिचय:' })) + ' <em>' + esc(L.get(place.name)) + '</em></h2>' +
        '<div class="expl-intro__text">' + paras + fig + '</div>'
    }
    var note = doc.querySelector('[data-expl="intro-note"]')
    if (note && place.intro.note) {
      note.innerHTML = '<span>' + esc(L.get(place.intro.note)) + '</span>'
    }
  }

  /* ---------------------------------------------------------------- */
  /* TILES — why (>3) and culture blocks (3)                          */
  /* <div data-expl="tiles" data-tiles="why|culture">                  */
  /* ---------------------------------------------------------------- */
  function renderTiles (panel) {
    var key = panel.getAttribute('data-tiles')
    var place = currentPlace()
    var src = place && (key === 'culture' ? place.culture : place.why)
    if (!src) return
    var tiles = key === 'culture' ? src.blocks : src.tiles
    var items = tiles.map(function (t, i) {
      var num = '<span class="expl-tile__num">0' + (i + 1) + '</span>'
      var cat = t.chip ? '<span class="expl-tile__cat">' + esc(L.get(t.chip)) + '</span>' : ''
      return '<article class="expl-tile">' + num + cat +
        '<h3 class="expl-tile__title">' + esc(L.get(t.title)) + '</h3>' +
        '<p class="expl-tile__text">' + esc(L.get(t.text)) + '</p>' +
      '</article>'
    }).join('')
    panel.innerHTML = items
  }

  /* ---------------------------------------------------------------- */
  /* FAMOUS FOR / PLACES LIST                                         */
  /* <div data-expl="places" data-tiles="famous">                      */
  /* ---------------------------------------------------------------- */
  function renderPlaces (panel) {
    var place = currentPlace()
    if (!place || !place.famous) return
    var items = place.famous.items.map(function (it, i) {
      var media = it.img
        ? '<div class="expl-place__media"><img src="' + esc(L.path + it.img.src) + '" alt="' + esc(it.img.alt) + '" loading="lazy" /></div>'
        : '<div class="expl-place__num">0' + (i + 1) + '</div>'
      var note = it.note ? '<p class="expl-place__note">' + esc(L.get(it.note)) + '</p>' : ''
      return '<article class="expl-place">' + media +
        '<div class="expl-place__body">' +
          '<span class="expl-chip">' + esc(L.get(it.chip)) + '</span>' +
          '<h3 class="expl-place__title">' + esc(L.get(it.title)) + '</h3>' +
          '<p class="expl-place__loc">' + esc(L.get(it.loc)) + '</p>' +
          '<p class="expl-place__text">' + esc(L.get(it.text)) + '</p>' +
          note +
        '</div>' +
      '</article>'
    }).join('')
    var ph = ''
    var pill = doc.querySelector('[data-expl="ph"][data-tiles="famous"]')
    if (place.famous.placeholder) {
      ph = '<div class="expl-ph">' + esc(L.get(place.famous.placeholder)) + '</div>'
    }
    if (pill) pill.innerHTML = ph
    panel.innerHTML = items
  }

  /* ---------------------------------------------------------------- */
  /* HISTORY TIMELINE                                                 */
  /* <div data-expl="timeline">                                        */
  /* ---------------------------------------------------------------- */
  function renderTimeline (panel) {
    var place = currentPlace()
    if (!place || !place.history) return
    var rows = place.history.entries.map(function (e) {
      return '<article class="expl-era">' +
        '<span class="expl-era__period">' + esc(L.get(e.period)) + '</span>' +
        '<h3 class="expl-era__title">' + esc(L.get(e.title)) + '</h3>' +
        '<div class="expl-era__text"><p>' + esc(L.get(e.text)) + '</p></div>' +
      '</article>'
    }).join('')
    panel.innerHTML = rows
  }

  /* ---------------------------------------------------------------- */
  /* GALLERY                                                          */
  /* <div data-expl="gallery">                                         */
  /* ---------------------------------------------------------------- */
  function renderGallery (panel) {
    var place = currentPlace()
    if (!place || !place.gallery) return
    var figs = place.gallery.items.map(function (g) {
      var cls = 'expl-gal__fig'
      if (g.wide) cls += ' expl-gal__fig--wide'
      if (g.tall) cls += ' expl-gal__fig--tall'
      return '<figure class="' + cls + '" data-full="' + esc(L.path + g.full) + '"' +
        ' data-cap="' + esc(g.cap) + '" data-credit="' + esc(g.credit) + '">' +
        '<img src="' + esc(L.path + g.full) + '" alt="' + esc(g.alt) + '" loading="lazy" />' +
      '</figure>'
    }).join('')
    panel.innerHTML = figs
  }

  function renderGalleryTap (panel) {
    var place = currentPlace()
    if (!place || !place.gallery) return
    panel.innerHTML = L.get(L.districtExplorer.galleryTap)
  }

  /* ---------------------------------------------------------------- */
  /* LOCATION — facts + coords, map note, map, nearby                 */
  /* ---------------------------------------------------------------- */
  function renderFacts (panel) {
    var place = currentPlace()
    if (!place || !place.location) return
    var first = '<div class="expl-fact"><dt>' + esc(L.get(L.ui.coords)) + '</dt><dd>' + esc(coordText(place)) + '</dd></div>'
    var rest = place.location.facts.map(function (f) {
      return '<div class="expl-fact"><dt>' + esc(L.get(f.label)) + '</dt><dd>' + esc(L.get(f.value)) + '</dd></div>'
    }).join('')
    panel.innerHTML = first + rest
  }

  function renderMapNote (panel) {
    var place = currentPlace()
    if (!place || !place.location) return
    panel.innerHTML = '<span>' + esc(L.get(place.location.mapNote)) + '</span>'
  }

  /* ---------------------------------------------------------------- */
  /* TRAVEL / PLAN YOUR VISIT                                         */
  /* <div data-expl="travel"> + <div data-expl="visit-note">          */
  /* ---------------------------------------------------------------- */
  var travelIcons = {
    rail: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M3 17v3M21 17v3M7 20h10"/></svg>',
    road: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l2-6h10l2 6M5 13l-1 4h16l-1-4M7 13v4M17 13v4"/><path d="M3 17h18"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6-5-6-10a6 6 0 0 1 12 0c0 5-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/></svg>'
  }

  function renderTravel (panel) {
    var place = currentPlace()
    if (!place || !place.visit) return
    var rows = place.visit.rows.map(function (r) {
      var icon = travelIcons[r.icon] || travelIcons.pin
      return '<div class="expl-travel__row">' +
        '<span class="expl-travel__mode">' + icon + '<span>' + esc(L.get(r.mode)) + '</span></span>' +
        '<div class="expl-travel__info"><p>' + esc(L.get(r.text)) + '</p></div>' +
      '</div>'
    }).join('')
    panel.innerHTML = rows
  }

  function renderVisitNote (panel) {
    var place = currentPlace()
    if (!place || !place.visit) return
    panel.innerHTML =
      '<strong>' + esc(L.get(L.ui.pleaseVerify)) + '</strong> ' +
      '<span>' + esc(L.get(place.visit.note)) + '</span>'
  }

  /* ---------------------------------------------------------------- */
  /* EXPLORER section header (hub + area pages)                       */
  /* <header data-expl="explorer-head">                                */
  /* ---------------------------------------------------------------- */
  function renderExplorerHead (panel) {
    var place = currentPlace()
    var html
    if (place) {
      var viewing = L.get(L.ui.currentlyViewing) + ' ' + L.get(place.name)
      html = '<p class="expl-label">' + esc(L.get(L.ui.explorerLabel)) + '</p>' +
        '<h2 class="expl-title serif">' + esc(L.get(L.ui.explorerLabel)) + ' <em>' + esc(L.get(L.ui.explorerTitleEm)) + '</em></h2>' +
        '<p class="expl-sub">' + esc(viewing + ' — ' + L.get(L.ui.explorerNote)) + '</p>'
    } else {
      html = '<p class="expl-label">' + esc(L.get(L.districtExplorer.label)) + '</p>' +
        '<h2 class="expl-title serif">' + esc(L.get(L.districtExplorer.titlePre)) +
        ' <em>' + esc(L.get(L.districtExplorer.titleEm)) + '</em></h2>' +
        '<p class="expl-sub">' + esc(L.get(L.districtExplorer.text)) + '</p>'
    }
    panel.innerHTML = html
  }

  /* ---------------------------------------------------------------- */
  /* DISTRICT EXPLORER grid                                           */
  /* ---------------------------------------------------------------- */
  function explorerGrid (opts) {
    var active = (opts && opts.active) || null
    return L.places.map(function (p) {
      var pendingTag = p.coords ? '' : '<span class="explorer__pending">' + L.get(L.coordsPending) + '</span>'
      var isActive = p.slug === active
      var a = doc.createElement('a')
      a.className = 'explorer__card' + (isActive ? ' explorer__card--active' : '')
      a.href = href(p)
      a.innerHTML =
        '<span class="explorer__role">' + esc(L.get(p.role)) + '</span>' +
        '<span class="explorer__name">' + esc(L.get(p.name)) + '</span>' +
        '<span class="explorer__text">' + esc(L.get(p.subtitle)) + '</span>' +
        pendingTag
      return a
    })
  }

  function renderExplorer (panel, opts) {
    panel.innerHTML = ''
    var grid = el('<div class="explorer__grid"></div>')
    explorerGrid(opts).forEach(function (card) { grid.appendChild(card) })
    panel.appendChild(grid)
  }

  /* Back-to-hub button shown on area pages only. */
  function renderBackButtons (scope) {
    var backs = scope.querySelectorAll('[data-expl="back"]')
    var done = false
    Array.prototype.forEach.call(backs, function (back) {
      if (done) { back.remove(); return }
      var b = el('<div class="explorer__back"></div>')
      var top = doc.createElement('a')
      top.className = 'btn btn--ghost-light'
      top.href = L.path + 'explore.html'
      top.textContent = L.get(L.districtExplorer.back)
      b.appendChild(top)
      back.replaceWith(b)
      done = true
    })
  }

  /* ---------------------------------------------------------------- */
  /* NEARBY — other places of the district, listed on area pages      */
  /* ---------------------------------------------------------------- */
  function renderNearby (panel) {
    var active = panel.getAttribute('data-active') || null
    var current = bySlug(active)
    var others = L.places.filter(function (p) { return p !== current })

    panel.innerHTML = ''
    panel.classList.add('expl-nearby')

    var head = doc.createElement('div')
    head.appendChild(el('<h3 class="expl-nearby__title">' + esc(L.get(L.ui.nearbyTitle)) + '</h3>'))
    head.appendChild(el('<p class="expl-nearby__note">' + esc(L.get(L.ui.nearbyNote)) + '</p>'))
    panel.appendChild(head)

    var list = doc.createElement('div')
    list.className = 'expl-nearby__list'
    others.forEach(function (p) {
      var a = doc.createElement('a')
      a.className = 'expl-nearby__item'
      a.href = href(p)
      a.innerHTML =
        '<span class="expl-nearby__body">' +
          '<span class="expl-nearby__name">' + esc(L.get(p.name)) + '</span>' +
          '<span class="expl-nearby__role">' + esc(L.get(p.role)) + '</span>' +
        '</span>' +
        '<span class="expl-nearby__go">' + esc(L.get(L.ui.explore) + ' →') + '</span>'
      list.appendChild(a)
    })
    panel.appendChild(list)
  }

  /* ---------------------------------------------------------------- */
  /* HUB card grid                                                    */
  /* ---------------------------------------------------------------- */
  function hubCards (opts) {
    var active = (opts && opts.active) || null
    var feature = bySlug(active) || L.places[0]
    var rest = L.places.filter(function (p) { return p !== feature })

    var html = ''

    html +=
      '<a class="expl-feature" href="' + href(feature) + '">' +
        '<img alt="" src="' + esc(L.path + feature.heroImage) + '" loading="lazy">' +
        '<span class="expl-feature__num">01</span>' +
        '<span class="expl-feature__body">' +
          '<span class="expl-feature__role">' + esc(L.get(feature.role)) + '</span>' +
          '<span class="expl-feature__title">' + esc(L.get(feature.name)) + '</span>' +
          '<span class="expl-feature__sub">' + esc(L.get(feature.subtitle)) + '</span>' +
          '<span class="expl-feature__cta">' + esc(L.get(L.ui.exploreThis) + ' →') + '</span>' +
        '</span>' +
      '</a>'

    html += '<div class="expl-grid expl-grid--side">'
    rest.forEach(function (p, i) {
      html +=
        '<a class="expl-card" href="' + href(p) + '">' +
          '<img alt="" src="' + esc(L.path + p.heroImage) + '" loading="lazy">' +
          '<span class="expl-card__num">0' + (i + 2) + '</span>' +
          '<span class="expl-card__body">' +
            '<span class="expl-card__role">' + esc(L.get(p.role)) + '</span>' +
            '<span class="expl-card__title">' + esc(L.get(p.name)) + '</span>' +
            '<span class="expl-card__sub">' + esc(L.get(p.subtitle)) + '</span>' +
            '<span class="expl-card__cta">' + esc(L.get(L.ui.discover)) + '</span>' +
          '</span>' +
        '</a>'
    })
    html += '</div>'

    return html
  }

  function renderHub (panel, opts) {
    panel.innerHTML = hubCards(opts)
  }

  /* ---------------------------------------------------------------- */
  /* DISTRICT MAP — schematic, verified coords only                   */
  /* ---------------------------------------------------------------- */
  function placeOnMap (p) {
    if (!p.coords) return null
    return {
      x: ((p.coords[1] - B.w) / (B.e - B.w)) * 100,
      y: ((B.n - p.coords[0]) / (B.n - B.s)) * 100
    }
  }

  var pinIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-5.1-7-11a7 7 0 0 1 14 0c0 5.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>'

  function renderMap (panel, opts) {
    var active = (opts && opts.active) || null
    var showAll = !opts || opts.showAll !== false

    panel.innerHTML = ''
    var map = el('<div class="expl-map__panel"></div>')
    panel.appendChild(map)

    var grid = el('<div class="expl-map__grid"></div>')
    map.appendChild(grid)

    var river = el('<div class="expl-map__river"><span class="expl-map__river-label">Ganga · गंगा</span></div>')
    map.appendChild(river)

    var pending = []
    var pins = []

    function addPin (p) {
      var pos = placeOnMap(p)
      if (!pos) { pending.push(p); return }
      var self = L.get(p.name)
      var btn = doc.createElement('button')
      btn.className = 'expl-map__pin'
      btn.type = 'button'
      btn.setAttribute('aria-label', self)
      btn.style.left = pos.x + '%'
      btn.style.top = pos.y + '%'
      if (p.slug === active) btn.className += ' expl-map__pin--home'
      btn.innerHTML = pinIcon + '<span class="expl-map__pulse"></span>' +
        '<span class="expl-map__pin-label">' + esc(self) + '</span>'
      btn.addEventListener('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        togglePop(map, p, btn, pos)
      })
      pins.push(btn)
      map.appendChild(btn)
    }

    var toShow = showAll ? L.places : L.places.filter(function (p) { return p.slug === active })
    toShow.forEach(addPin)

    var legend = el('<div class="expl-map__legend"></div>')
    legend.appendChild(el('<span>' + esc(L.get(L.ui.verifiedPin)) + '</span>'))
    if (pending.length) legend.appendChild(el('<span class="expl-map__legend--pending">' + esc(L.get(L.coordsPending)) + '</span>'))
    map.appendChild(legend)

    map.appendChild(el('<p class="expl-map__disclaimer">' + esc(L.get(L.mapNote)) + '</p>'))

    var dismiss = function () {
      var pop = map.querySelector('.expl-map__pop.is-open')
      if (pop) pop.classList.remove('is-open')
    }
    map.addEventListener('click', function () { dismiss() })
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') dismiss() })
    return pins
  }

  function togglePop (map, p, btn, pos) {
    var pop = map.querySelector('.expl-map__pop.is-open')
    if (pop) pop.classList.remove('is-open')
    if (pop && pop === btn._pop) return

    var near = doc.createElement('div')
    near.className = 'expl-map__pop'
    near.innerHTML =
      '<button class="expl-map__pop-close" type="button" aria-label="Close">×</button>' +
      (p.heroImage ? '<img class="expl-map__pop-img" alt="" src="' + esc(L.path + p.heroImage) + '" loading="lazy">' : '') +
      '<div class="expl-map__pop-role">' + esc(L.get(p.role)) + '</div>' +
      '<div class="expl-map__pop-title">' + esc(L.get(p.name)) + '</div>' +
      '<div class="expl-map__pop-sub">' + esc(L.get(p.subtitle)) + '</div>' +
      '<div class="expl-map__pop-loc">' + esc(coordText(p)) + '</div>' +
      '<a class="expl-map__pop-link" href="' + href(p) + '">' + esc(L.get(L.ui.explore)) + '</a>'
    near.querySelector('.expl-map__pop-close').addEventListener('click', function (e) {
      e.stopPropagation()
      near.classList.remove('is-open')
    })
    var openPop = map.querySelector('.expl-map__pop')
    if (openPop) openPop.remove()
    btn._pop = near

    map.appendChild(near)
    var left = pos.x
    var top = pos.y
    var pw = near.offsetWidth
    var ph = near.offsetHeight
    var nearLeft = left + 4
    if (nearLeft + pw > 98) nearLeft = left - 4 - pw
    var nearTop = top
    if (nearTop + 18 + ph > 92) nearTop = top - 18 - ph
    else nearTop = top + 18
    near.style.left = Math.min(Math.max(nearLeft, 4), 98) + '%'
    near.style.top = Math.min(Math.max(nearTop, 4), 92) + '%'
    requestAnimationFrame(function () { near.classList.add('is-open') })
  }

  /* ---------------------------------------------------------------- */
  /* GALLERY lightbox                                                 */
  /* ---------------------------------------------------------------- */
  var lb, lbIdx, lbItems = [], lbLastFocused = null

  function ensureLightbox () {
    if (lb) return lb
    lb = el(
      '<div class="expl-lightbox" data-expl="lightbox">' +
        '<span class="expl-lightbox__counter"></span>' +
        '<img class="expl-lightbox__img" alt="">' +
        '<span class="expl-lightbox__cap"></span>' +
        '<span class="expl-lightbox__credit"></span>' +
        '<button class="expl-lightbox__close" type="button" aria-label="Close">×</button>' +
        '<button class="expl-lightbox__prev" type="button" aria-label="Previous">‹</button>' +
        '<button class="expl-lightbox__next" type="button" aria-label="Next">›</button>' +
      '</div>'
    )
    doc.body.appendChild(lb)
    lb.querySelector('.expl-lightbox__close').addEventListener('click', closeLb)
    lb.querySelector('.expl-lightbox__prev').addEventListener('click', function () { stepLb(-1) })
    lb.querySelector('.expl-lightbox__next').addEventListener('click', function () { stepLb(1) })
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb() })
    if (!lbKeysBound) {
      doc.addEventListener('keydown', function (e) {
        if (!lb || !lb.classList.contains('is-open')) return
        if (e.key === 'Escape') closeLb()
        if (e.key === 'ArrowLeft') stepLb(-1)
        if (e.key === 'ArrowRight') stepLb(1)
      })
      lbKeysBound = true
    }
    return lb
  }

  function openLb (index) {
    if (!lbItems.length) return
    lbIdx = (index + lbItems.length) % lbItems.length
    var it = lbItems[lbIdx]
    var box = ensureLightbox()
    if (!box.classList.contains('is-open')) {
      lbLastFocused = doc.activeElement
      doc.body.style.overflow = 'hidden'
    }
    box.classList.add('is-open')
    box.querySelector('.expl-lightbox__img').src = it.full
    box.querySelector('.expl-lightbox__img').alt = it.cap
    box.querySelector('.expl-lightbox__cap').textContent = it.cap
    box.querySelector('.expl-lightbox__credit').textContent = it.credit
    box.querySelector('.expl-lightbox__counter').textContent = (lbIdx + 1) + ' / ' + lbItems.length
  }

  function closeLb () {
    if (!lb) return
    lb.classList.remove('is-open')
    doc.body.style.overflow = ''
    if (lbLastFocused && lbLastFocused.focus) lbLastFocused.focus({ preventScroll: true })
    lbLastFocused = null
  }

  function stepLb (d) {
    if (lbItems.length) openLb((lbIdx + d + lbItems.length) % lbItems.length)
  }

  function bindGallery (scope) {
    var figs = scope.querySelectorAll('.expl-gal__fig[data-full]')
    if (!figs.length) return
    lbItems = Array.prototype.map.call(figs, function (fig) {
      return {
        full: fig.getAttribute('data-full'),
        cap: fig.getAttribute('data-cap') || '',
        credit: fig.getAttribute('data-credit') || ''
      }
    })
    Array.prototype.forEach.call(figs, function (fig, i) {
      fig.addEventListener('click', function () { openLb(i) })
    })
    ensureLightbox()
  }

  /* ---------------------------------------------------------------- */
  /* Sticky area nav scrollspy                                        */
  /* ---------------------------------------------------------------- */
  function navSpy (scope) {
    var links = scope.querySelectorAll('.area-nav__link[data-target]')
    if (!links.length) return
    var map = {}
    Array.prototype.forEach.call(links, function (link) {
      var sec = doc.getElementById(link.getAttribute('data-target'))
      if (sec) map[link.getAttribute('data-target')] = { link: link, sec: sec }
    })

    function update () {
      var now = doc.documentElement.scrollTop + 96
      var current = null
      for (var id in map) {
        if (map[id].sec.offsetTop <= now) current = id
      }
      Array.prototype.forEach.call(links, function (link) {
        var on = link.getAttribute('data-target') === current
        link.classList.toggle('is-active', on)
      })
    }

    update()
    doc.addEventListener('scroll', update, { passive: true })
  }

  /* ---------------------------------------------------------------- */
  /*  Refresh + language observer                                      */
  /* ---------------------------------------------------------------- */
  function refresh () {
    var place = currentPlace()

    if (place) {
      blk = function (key) { return place[key] }
      renderHero(place)
      renderIntro(place)

      fillHead(doc, 'why')
      var tiles = doc.querySelectorAll('[data-expl="tiles"]')
      Array.prototype.forEach.call(tiles, renderTiles)

      fillHead(doc, 'famous')
      var places = doc.querySelectorAll('[data-expl="places"]')
      Array.prototype.forEach.call(places, renderPlaces)

      fillHead(doc, 'culture')
      fillHead(doc, 'history')
      var timeline = doc.querySelector('[data-expl="timeline"]')
      if (timeline) renderTimeline(timeline)

      fillHead(doc, 'gallery')
      var gallery = doc.querySelector('[data-expl="gallery"]')
      if (gallery) renderGallery(gallery)
      var gtap = doc.querySelector('[data-expl="gallery-tap"]')
      if (gtap) renderGalleryTap(gtap)

      fillHead(doc, 'location')
      var facts = doc.querySelector('[data-expl="facts"]')
      if (facts) renderFacts(facts)
      var mnote = doc.querySelector('[data-expl="map-note"]')
      if (mnote) renderMapNote(mnote)

      fillHead(doc, 'visit')
      var travel = doc.querySelector('[data-expl="travel"]')
      if (travel) renderTravel(travel)
      var vnote = doc.querySelector('[data-expl="visit-note"]')
      if (vnote) renderVisitNote(vnote)
    }

    var eheads = doc.querySelectorAll('[data-expl="explorer-head"]')
    Array.prototype.forEach.call(eheads, renderExplorerHead)

    var stats = doc.querySelectorAll('[data-expl="stats"]')
    Array.prototype.forEach.call(stats, renderStats)

    var hubs = doc.querySelectorAll('[data-expl="hub-cards"]')
    Array.prototype.forEach.call(hubs, function (panel) {
      renderHub(panel, { active: panel.getAttribute('data-active') || null })
    })

    var explorers = doc.querySelectorAll('[data-expl="district-explorer"]')
    Array.prototype.forEach.call(explorers, function (panel) {
      renderExplorer(panel, { active: panel.getAttribute('data-active') || null })
    })

    var maps = doc.querySelectorAll('[data-expl="map"]')
    Array.prototype.forEach.call(maps, function (panel) {
      renderMap(panel, { active: panel.getAttribute('data-active') || null })
    })

    var near = doc.querySelectorAll('[data-expl="nearby"]')
    Array.prototype.forEach.call(near, renderNearby)

    renderBackButtons(doc)
    bindGallery(doc)
  }

  function init () {
    var html = doc.documentElement
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].attributeName === 'data-lang') { refresh(); return }
      }
    })
    mo.observe(html, { attributes: true, attributeFilter: ['data-lang'] })

    refresh()
    navSpy(doc)
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()