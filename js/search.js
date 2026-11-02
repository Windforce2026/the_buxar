/* ------------------------------------------------------------------ */
/* TheBuxar.com — Unified search                                       */
/*                                                                     */
/* One search box answers for the whole portal. It reads whichever data */
/* modules are loaded, indexes only what is real, and returns grouped */
/* results with the source named.                                     */
/*                                                                     */
/* Nothing is fetched. There is no server: the index is assembled from */
/* the same files the pages already render, so search can never show    */
/* something the rest of the site would not.                            */
/*                                                                     */
/* Sources, in the order they are presented:                           */
/*   news       published articles and upcoming events                 */
/*   business   the directory's real listings                          */
/*   food       restaurants, hotels, caterers                          */
/*   services   trades and repairs                                     */
/*   jobs       openings                                                */
/*   property   sale and rent                                          */
/*   classifieds short ads                                             */
/*   place      tourist places and district areas                      */
/*                                                                     */
/* Language: bilingual via T.get().                                     */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var S = window.TheBuxarSearch = window.TheBuxarSearch || {}
  window.TheBuxarSearch = S

  function lang () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }
  function t (o) {
    if (typeof o === 'string') return o
    return o ? (o[lang()] || o.en || '') : ''
  }
  /* Both languages, for the hidden search keywords: a reader may type in
     Hindi even when the interface is English, and vice versa. */
  function both (o) {
    if (typeof o === 'string') return o
    if (!o) return ''
    return [o.en, o.hi].filter(Boolean).join(' ')
  }
  function bothList (a) {
    return (a || []).map(both).filter(Boolean).join(' ')
  }
  function esc (s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }
  S.path = function () {
    var c = window.TheBuxarConfig || {}
    return typeof c.path === 'string' ? c.path : './'
  }

  /* ------------------------------------------------------------------ */
  /* Source definitions                                                 */
  /*                                                                     */
  /* Each source knows how to read its own module and how to link a      */
  /* record. A module that is not on the page contributes nothing, so    */
  /* the same code works on the homepage and on a single-vertical page.  */
  /* ------------------------------------------------------------------ */
  var SOURCES = [
    {
      key: 'news',
      label: { en: 'News & Events', hi: 'समाचार एवं आयोजन' },
      available: function () { return !!window.TheBuxarNews },
      read: function () {
        var N = window.TheBuxarNews
        var out = []
        N.articles.forEach(function (a) {
          if (!N.isReal(a)) return
          out.push({
            title: t(a.title),
            sub: t(a.summary || a.excerpt),
            keywords: both(a.title) + ' ' + both(a.summary || a.excerpt),
            url: N.articleUrl(a),
            meta: a.date ? S.date(a.date) : ''
          })
        })
        N.events.forEach(function (e) {
          if (!N.isReal(e)) return
          out.push({
            title: t(e.title),
            sub: t(e.venue) || (e.date ? S.date(e.date) : ''),
            url: N.eventUrl(e),
            meta: e.date ? S.date(e.date) : 'Event'
          })
        })
        return out
      }
    },
    {
      key: 'business',
      label: { en: 'Businesses', hi: 'व्यापार' },
      available: function () { return !!window.TheBuxarBusiness },
      read: function () {
        var B = window.TheBuxarBusiness
        return B.businesses.map(function (b) {
          var cat = B.catBySlug(b.category)
          var area = B.areaBySlug ? B.areaBySlug(b.area) : null
          var sub = [cat ? t(cat.name) : '', t(b.subcategory), t(b.address)].filter(Boolean).join(' · ')
          /* Everything a reader might type: the description, the services
             offered, the area and the sub-category. Kept separate from the
             visible row so search never invents a label. */
          var keywords = [
            both(b.description),
            bothList(b.services),
            cat ? both(cat.name) : '',
            both(b.subcategory),
            area ? both(area.name) : '',
            b.type || '',
            b.address || ''
          ].filter(Boolean).join(' ')
          return {
            title: t(b.name),
            sub: sub,
            keywords: keywords,
            area: b.area || '',
            url: S.path() + 'business/profile.html?slug=' + encodeURIComponent(b.slug),
            meta: b.phone ? (window.TheBuxarRegions ? window.TheBuxarRegions.phone(b.phone) : b.phone) : ''
          }
        })
      }
    },
    {
      key: 'food',
      label: { en: 'Food & Stay', hi: 'भोजन एवं ठहरना' },
      vertical: 'F',
      read: function () { return S.readVertical('F') }
    },
    {
      key: 'services',
      label: { en: 'Local Services', hi: 'स्थानीय सेवाएँ' },
      vertical: 'S',
      read: function () { return S.readVertical('S') }
    },
    {
      key: 'jobs',
      label: { en: 'Jobs', hi: 'रोज़गार' },
      vertical: 'J',
      read: function () { return S.readVertical('J') }
    },
    {
      key: 'property',
      label: { en: 'Property', hi: 'संपत्ति' },
      vertical: 'PR',
      read: function () { return S.readVertical('PR') }
    },
    {
      key: 'classifieds',
      label: { en: 'Classifieds', hi: 'विज्ञापन' },
      vertical: 'C',
      read: function () { return S.readVertical('C') }
    },
    {
      key: 'place',
      label: { en: 'Places & Areas', hi: 'स्थल एवं क्षेत्र' },
      available: function () { return !!window.TheBuxarExplore || !!window.TheBuxarRegions },
      read: function () {
        var out = []
        var L = window.TheBuxarExplore
        if (L && L.places) {
          L.places.forEach(function (p) {
            out.push({
              title: t(p.name),
              sub: t(p.blurb || p.about || ''),
              keywords: both(p.name) + ' ' + both(p.blurb || p.about),
              area: p.slug || '',
              url: S.path() + 'explore.html',
              meta: 'Place'
            })
          })
        }
        var R = window.TheBuxarRegions
        if (R) {
          R.list.forEach(function (r) {
            out.push({
              title: t(r.name),
              sub: t(r.blurb || (R.get(R.levels[r.level]) || '')),
              keywords: both(r.name) + ' ' + both(r.blurb) + ' ' + (R.get(R.levels[r.level]) || ''),
              area: r.live ? r.slug : '',
              url: S.path() + 'explore.html?region=' + r.slug,
              meta: R.get(R.levels[r.level]) || 'Region'
            })
          })
        }
        return out
      }
    }
  ]

  /* The marketplace products, if that module is loaded. */
  S.readMarket = function () {
    var M = window.TheBuxarMarket
    if (!M || !M.products || !M.products.length) return []
    return M.products.map(function (p) {
      return {
        title: t(p.title || p.name),
        sub: [p.price, t(p.condition)].filter(Boolean).join(' · '),
        url: S.path() + 'marketplace/product.html?slug=' + encodeURIComponent(p.slug),
        meta: 'Marketplace'
      }
    })
  }

  S.readVertical = function (key) {
    var L = window.TheBuxarListings
    if (!L) return []
    var v = L.byKey(key)
    if (!v) return []
    var rows = L.itemsOf(key).map(function (r) {
      var keywords = [
        both(r.desc),
        both(r.description),
        bothList(r.services),
        bothList(r.tags),
        r.address || '',
        r.area || ''
      ].filter(Boolean).join(' ')
      return {
        title: t(r.name),
        sub: L.catName(key, r.category),
        keywords: keywords,
        area: r.area || '',
        url: S.path() + v.page + '?item=' + encodeURIComponent(r.slug || ''),
        meta: L.catName(key, r.category)
      }
    })

    /* A vertical with no records still has categories. They are not
       records and are marked as categories, but they give a reader a
       real destination instead of an empty result. */
    if (!rows.length && v.categories) {
      rows = v.categories.map(function (c) {
        return {
          title: t(c.name),
          sub: lang() === 'hi' ? 'श्रेणी देखें' : 'Browse this category',
          keywords: both(c.name) + ' ' + both(c.noun),
          url: S.path() + v.page + '?cat=' + encodeURIComponent(c.slug),
          meta: lang() === 'hi' ? 'श्रेणी' : 'Category'
        }
      })
    }
    return rows
  }

  S.date = function (iso) {
    var d = new Date(iso)
    if (isNaN(d)) return ''
    try {
      return d.toLocaleDateString(lang() === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch (e) { return '' }
  }

  /* ------------------------------------------------------------------ */
  /* The index                                                          */
  /* ------------------------------------------------------------------ */
  var cache = null

  S.build = function () {
    var groups = []
    SOURCES.forEach(function (src) {
      if (src.available && !src.available()) return
      var rows
      try { rows = src.read() } catch (e) { rows = [] }
      if (!rows || !rows.length) return
      groups.push({ key: src.key, label: src.label, rows: rows })
    })

    var mkt = S.readMarket()
    if (mkt.length) {
      groups.splice(2, 0, { key: 'market', label: { en: 'Marketplace', hi: 'बाज़ार' }, rows: mkt })
    }
    cache = groups
    return groups
  }

  S.groups = function () { return cache || S.build() }

  /* Rank: an exact title match beats a prefix, which beats a match
     anywhere. Matching is token-based, so "ngo" no longer finds "mango":
     a query term must equal a word or be a prefix of one. Hindi is
     tokenised on Devanagari letters as well as Latin ones. */
  function norm (s) {
    return String(s || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  }
  function words (s) {
    return norm(s).split(/[^0-9a-z\u0900-\u097F]+/).filter(Boolean)
  }
  function hit (tokens, term) {
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i] === term || (term.length > 1 && tokens[i].indexOf(term) === 0)) return true
    }
    return false
  }
  function score (row, q) {
    var terms = words(q)
    if (!terms.length) return 0
    var title = norm(row.title)
    var sub = norm(row.sub || '')
    var keys = norm(row.keywords || '')
    var meta = norm(row.meta || '')
    var tt = words(title)
    var st = words(sub)
    var kt = words(keys)
    var mt = words(meta)

    /* Every term must appear somewhere; this makes a two-word query
       narrow the result instead of widening it. */
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i]
      if (!hit(tt, term) && !hit(st, term) && !hit(kt, term) && !hit(mt, term)) return 0
    }

    if (title === q) return 100
    if (title.indexOf(q) === 0) return 90
    if (hit(tt, q)) return 80
    var inTitle = terms.every(function (term) { return hit(tt, term) })
    if (inTitle) return 75
    var inKeys = terms.every(function (term) { return hit(kt, term) })
    if (inKeys) return 55
    var inSub = terms.every(function (term) { return hit(st, term) })
    if (inSub) return 40
    return 20
  }

  /* `loc` is a region slug from the homepage or search-page picker. It
     narrows results to records whose own area is known; records without
     an area cannot honestly be claimed for a place, so they drop out. */
  S.query = function (raw, perGroup, loc) {
    var q = String(raw || '').trim().toLowerCase()
    var where = String(loc || '').trim()
    if (!q && !where) return { q: '', loc: '', total: 0, groups: [] }
    perGroup = perGroup || 8

    var groups = S.groups()
    var out = []
    var total = 0
    var R = window.TheBuxarRegions

    groups.forEach(function (g) {
      var hits = []
      g.rows.forEach(function (row) {
        if (where && !(R && R.matchArea ? R.matchArea(row.area, where) : row.area === where)) return
        var s = q ? score(row, q) : 1
        if (s > 0) hits.push({ row: row, s: s })
      })
      if (!hits.length) return
      hits.sort(function (a, b) { return b.s - a.s || a.row.title.length - b.row.title.length })
      total += hits.length
      out.push({
        key: g.key,
        label: t(g.label),
        total: hits.length,
        rows: hits.slice(0, perGroup).map(function (h) { return h.row }),
        more: hits.length - Math.min(perGroup, hits.length)
      })
    })
    return { q: q, loc: where, total: total, groups: out }
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                          */
  /* ------------------------------------------------------------------ */
  S.resultHtml = function (r, compact) {
    return '<a class="sr__row' + (compact ? ' sr__row--compact' : '') + '" href="' + esc(r.url) + '">' +
      '<span class="sr__body"><span class="sr__title">' + esc(r.title) + '</span>' +
      (r.sub ? '<span class="sr__sub">' + esc(r.sub) + '</span>' : '') + '</span>' +
      (r.meta ? '<span class="sr__meta">' + esc(r.meta) + '</span>' : '') +
      '</a>'
  }

  S.groupHtml = function (g, compact) {
    return '<section class="sg">' +
      '<h2 class="sg__title">' + esc(g.label) +
      '<span class="sg__n">' + esc(String(g.total)) + '</span></h2>' +
      '<div class="sg__rows">' + g.rows.map(function (r) { return S.resultHtml(r, compact) }).join('') + '</div>' +
      (g.more > 0
        ? '<p class="sg__more">' + esc(lang() === 'hi' ? 'और ' + g.more + ' परिणाम' : 'and ' + g.more + ' more') + '</p>'
        : '') +
      '</section>'
  }

  /* ------------------------------------------------------------------ */
  /* Results page                                                       */
  /* ------------------------------------------------------------------ */
  /* The search page's location picker, built from the region registry
     and limited to the cities and blocks a record can name. */
  function fillLoc (select) {
    if (!select || select.options.length > 1) return
    var R = window.TheBuxarRegions
    if (!R || !R.list) return
    var html = '<option value="" data-en="All Buxar" data-hi="पूरा बक्सर">' + esc(lang() === 'hi' ? 'पूरा बक्सर' : 'All Buxar') + '</option>'
    R.list.forEach(function (r) {
      if (!r.live || (r.level !== 'city' && r.level !== 'block')) return
      var name = R.get(r.name)
      html += '<option value="' + esc(r.slug) + '" data-en="' + esc(name) + '" data-hi="' + esc(r.name.hi || name) + '">' + esc(name) + '</option>'
    })
    select.innerHTML = html
  }

  function locName (slug) {
    var R = window.TheBuxarRegions
    return R && R.name ? R.name(slug) : slug
  }

  function renderResults () {
    var host = document.getElementById('sr-results')
    if (!host) return
    var q = ''
    var loc = ''
    try {
      var params = new URLSearchParams(window.location.search)
      q = params.get('q') || ''
      loc = params.get('loc') || ''
    } catch (e) {}

    var input = document.getElementById('sr-input')
    if (input) input.value = q

    var select = document.getElementById('sr-loc')
    fillLoc(select)
    if (select) select.value = loc

    var count = document.getElementById('sr-count')
    var title = document.getElementById('sr-query')

    if (title && q) title.textContent = q
    if (!q && !loc) {
      if (count) count.textContent = ''
      host.innerHTML = S.suggestHtml()
      return
    }

    var res = S.query(q, 10, loc)
    if (count) {
      if (lang() === 'hi') count.textContent = res.total + ' परिणाम' + (loc ? ' · ' + locName(loc) : '')
      else count.textContent = res.total + (res.total === 1 ? ' result' : ' results') + (loc ? ' · ' + locName(loc) : '')
    }
    if (q) {
      document.title = q + ' — ' + (lang() === 'hi' ? 'खोज' : 'Search') + ' | TheBuxar.com'
    }

    /* A visible, removable location chip so a reader always knows the
       result set is scoped and how to widen it again. */
    var clearHref = S.path() + 'search.html' + (q ? '?q=' + encodeURIComponent(q) : '')
    var scope = loc
      ? '<p class="sr-scope">' + esc(lang() === 'hi' ? 'स्थान: ' + locName(loc) : 'Location: ' + locName(loc)) +
        ' <a class="sr-scope__clear" href="' + esc(clearHref) + '">' +
        esc(lang() === 'hi' ? 'साफ़ करें' : 'clear') + '</a></p>'
      : ''

    if (!res.total) {
      host.innerHTML =
        '<div class="sr-empty">' +
        '<h2 class="sr-empty__title">' + esc(lang() === 'hi'
          ? (loc ? locName(loc) + ' में कुछ नहीं मिला' : '"' + q + '" के लिए कुछ नहीं मिला')
          : (loc ? 'Nothing recorded in ' + locName(loc) + (q ? ' for "' + q + '"' : '') + ' yet'
                 : 'Nothing found for "' + q + '"')) + '</h2>' +
        '<p class="sr-empty__sub">' + esc(lang() === 'hi'
          ? 'कुछ अलग शब्द आज़माएँ, स्थान हटाएँ, या नीचे दिए गए पन्नों में से किसी एक पर जाएँ।'
          : 'Try a different word, clear the location, or head to one of the sections below.') + '</p>' +
        scope +
        S.suggestHtml() +
        '</div>'
      return
    }
    host.innerHTML = scope + res.groups.map(function (g) { return S.groupHtml(g) }).join('')
  }

  /* What to show when the reader has not typed anything, or found
     nothing — the sections themselves are always a valid answer. */
  S.suggestHtml = function () {
    var groups = S.groups()
    var total = groups.reduce(function (a, g) { return a + g.rows.length }, 0)

    var h = '<div class="sr-suggest">'
    h += '<h2 class="sr-suggest__title">' +
      esc(lang() === 'hi' ? 'खोजें, या इनमें से देखें' : 'Search, or browse a section') + '</h2>'
    h += '<div class="sr-suggest__grid">'
    groups.forEach(function (g) {
      var href = {
        news: 'news.html', business: 'business.html', market: 'marketplace.html',
        food: 'food.html', services: 'services.html', jobs: 'jobs.html',
        property: 'property.html', classifieds: 'classifieds.html', place: 'explore.html'
      }[g.key] || 'index.html'
      h += '<a class="sr-suggest__item" href="' + esc(S.path() + href) + '">' +
        '<span class="sr-suggest__label">' + esc(t(g.label)) + '</span>' +
        '<span class="sr-suggest__n">' + esc(String(g.rows.length)) + '</span></a>'
    })
    h += '</div>'
    h += '<p class="sr-suggest__note">' + esc(lang() === 'hi'
      ? 'खोज इन ' + total + ' प्रविष्टियों में चलती है — वास्तविक रिकॉर्ड और श्रेणी लिंक। जो अभी प्रकाशित नहीं है, वह नहीं दिखता।'
      : 'Search covers these ' + total + ' entries — real records and category links. Anything not published yet does not appear.') + '</p>'
    h += '</div>'
    return h
  }

  /* ------------------------------------------------------------------ */
  /* Nav wiring — the search box in the header now searches everywhere  */
  /* ------------------------------------------------------------------ */
  function navWiring () {
    var form = document.getElementById('nav-search')
    var input = document.getElementById('nav-search-input')
    if (!form || !input) return
    var results = document.getElementById('nav-search-results')

    function run () {
      var q = input.value.trim()
      if (q.length < 2) { if (results) results.hidden = true; return }
      var res = S.query(q, 4)
      if (!results) {
        results = document.createElement('div')
        results.id = 'nav-search-results'
        results.className = 'nsr'
        form.appendChild(results)
      }
      if (!res.total) {
        results.innerHTML = '<p class="nsr__none">' +
          esc(lang() === 'hi' ? '"' + q + '" के लिए कुछ नहीं मिला' : 'Nothing found for "' + q + '"') + '</p>'
      } else {
        results.innerHTML = res.groups.map(function (g) {
          return '<div class="nsr__group"><p class="nsr__label">' + esc(g.label) + '</p>' +
            g.rows.map(function (r) { return S.resultHtml(r, true) }).join('') +
            (g.more > 0 ? '<p class="nsr__more">+' + esc(String(g.more)) + '</p>' : '') +
            '</div>'
        }).join('')
      }
      results.hidden = false
    }

    input.addEventListener('input', run)
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault()
        var q = input.value.trim()
        if (q) window.location.href = S.path() + 'search.html?q=' + encodeURIComponent(q)
      }
      if (e.key === 'Escape' && results) results.hidden = true
    })
    document.addEventListener('click', function (e) {
      if (results && !form.contains(e.target)) results.hidden = true
    })
  }

  function boot () {
    renderResults()
    navWiring()
    try {
      new MutationObserver(renderResults).observe(document.documentElement, {
        attributes: true, attributeFilter: ['data-lang']
      })
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
