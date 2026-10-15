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
          return {
            title: t(b.name),
            sub: [B.catBySlug(b.category) ? t(B.catBySlug(b.category).name) : '', t(b.address)].filter(Boolean).join(' · '),
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
    return L.itemsOf(key).map(function (r) {
      return {
        title: t(r.name),
        sub: L.catName(key, r.category),
        url: S.path() + v.page + '?item=' + encodeURIComponent(r.slug || ''),
        meta: L.catName(key, r.category)
      }
    })
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
     anywhere. Ties break on shorter titles, which is usually the more
     specific record. */
  function score (row, q) {
    var title = row.title.toLowerCase()
    var sub = (row.sub || '').toLowerCase()
    if (title === q) return 100
    if (title.indexOf(q) === 0) return 80
    var i = title.indexOf(q)
    if (i > 0) return 60 - Math.min(20, i)
    if (sub.indexOf(q) !== -1) return 40
    if ((row.meta || '').toLowerCase().indexOf(q) !== -1) return 20
    return 0
  }

  S.query = function (raw, perGroup) {
    var q = String(raw || '').trim().toLowerCase()
    if (q.length < 1) return { q: q, total: 0, groups: [] }
    perGroup = perGroup || 8

    var groups = S.groups()
    var out = []
    var total = 0

    groups.forEach(function (g) {
      var hits = []
      g.rows.forEach(function (row) {
        var s = score(row, q)
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
    return { q: q, total: total, groups: out }
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
  function renderResults () {
    var host = document.getElementById('sr-results')
    if (!host) return
    var q = ''
    try { q = new URLSearchParams(window.location.search).get('q') || '' } catch (e) {}

    var input = document.getElementById('sr-input')
    if (input) input.value = q

    var count = document.getElementById('sr-count')
    var title = document.getElementById('sr-query')

    if (title) title.textContent = q
    if (!q) {
      if (count) count.textContent = ''
      host.innerHTML = S.suggestHtml()
      return
    }

    var res = S.query(q, 10)
    if (count) {
      count.textContent = lang() === 'hi'
        ? (res.total + ' परिणाम')
        : (res.total + (res.total === 1 ? ' result' : ' results'))
    }
    document.title = q + ' — ' + (lang() === 'hi' ? 'खोज' : 'Search') + ' | TheBuxar.com'

    if (!res.total) {
      host.innerHTML =
        '<div class="sr-empty">' +
        '<h2 class="sr-empty__title">' + esc(lang() === 'hi'
          ? '"' + q + '" के लिए कुछ नहीं मिला'
          : 'Nothing found for "' + q + '"') + '</h2>' +
        '<p class="sr-empty__sub">' + esc(lang() === 'hi'
          ? 'कुछ अलग शब्द आज़माएँ, या नीचे दिए गए पन्नों में से किसी एक पर जाएँ।'
          : 'Try a different word, or head to one of the sections below.') + '</p>' +
        S.suggestHtml() +
        '</div>'
      return
    }
    host.innerHTML = res.groups.map(function (g) { return S.groupHtml(g) }).join('')
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
      ? 'खोज इन ' + total + ' वास्तविक रिकॉर्ड में चलती है। जो कुछ अभी नहीं है, वह दिखाया नहीं जाता।'
      : 'Search covers ' + total + ' real records. Anything not published yet does not appear.') + '</p>'
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
