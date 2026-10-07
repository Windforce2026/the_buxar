/* ------------------------------------------------------------------ */
/* TheBuxar.com — Trade & Industry behaviours (pure vanilla, no deps)  */
/*                                                                     */
/* Load after js/trade-data.js, the single source of truth for        */
/* economic themes, business categories, trade locations and         */
/* opportunity cards. This file renders every part of the module      */
/* from that dataset.                                                 */
/*                                                                     */
/* Page wiring (inline in each page, before this script):              */
/*   <script>window.TheBuxarConfig = { path: './' }</script>           */
/*                                                                     */
/* Rendering: section content mounts through the generic [data-td]    */
/* hook, so a page only declares where content goes, never what it    */
/* contains.                                                          */
/*                                                                     */
/* Data honesty: a field is only drawn when the record carries it.    */
/* No statistic, projection or investment claim is ever synthesised.  */
/*                                                                     */
/* Language: content is chosen via T.get() at render time and the     */
/* <html data-lang> change is observed so the module re-renders.       */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var T = window.TheBuxarTrade
  if (!T) return

  var doc = document

  var CONFIG = window.TheBuxarConfig || {}
  T.path = typeof CONFIG.path === 'string' ? CONFIG.path : ''

  var reduceMotion = (function () {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) { return false }
  })()

  /* ---------------------------------------------------------------- */
  /* Small helpers                                                    */
  /* ---------------------------------------------------------------- */

  function esc (s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }

  function t (key) { return T.get(T.ui[key]) }
  function icon (name) { return T.icons[name] || T.icons.commerce }

  /* Words that carry no identity in an acronym. */
  var MONO_SKIP = { of: 1, the: 1, and: 1, for: 1, at: 1, in: 1, on: 1, a: 1, an: 1, to: 1 }

  /* Acronym from the sector's own name: "Professional Services" -> PS,
     "Food & Hospitality" -> FH, "Retail" -> R. Never a guessed mark. */
  function monoOf (name, override) {
    /* An explicit `mono` on the record always wins. Two single-word sectors
       would otherwise land on the same letter, so those set their own. */
    if (typeof override === 'string' && override.trim()) {
      return override.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 5)
    }
    var words = String(name || '')
      .replace(/[(),.\/\-–—:&]/g, ' ')
      .split(/\s+/)
      .map(function (w) { return w.replace(/[^A-Za-z]/g, '') })
      .filter(Boolean)
    if (!words.length) return '?'

    var significant = words.filter(function (w) { return !MONO_SKIP[w.toLowerCase()] })
    var source = (significant.length ? significant : words)

    /* A one-word sector takes a single letter. Squeezing two letters out of
       it would collide with real two-word sectors — "Retail" would become
       RE and clash with "Real Estate". */
    if (source.length === 1) return source[0][0].toUpperCase()
    if (source.length >= 2) {
      return source.slice(0, 2).map(function (w) { return w[0] }).join('').toUpperCase()
    }
    return words.join('').slice(0, 2).toUpperCase() || '?'
  }

  /* Stable per-sector hue in a narrow navy→steel band, matching the
     business monogram tiles so both modules share one visual language. */
  function toneOf (slug) {
    var s = String(slug || '')
    var h = 0
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360
    return 196 + (h % 40)
  }

  /* ---------------------------------------------------------------- */
  /* Mounts                                                           */
  /* ---------------------------------------------------------------- */

  var MOUNT = {}

  /* Hero photograph. Decorative only. */
  MOUNT.heroPhoto = function (host) {
    var src = T.imageUrl(T.images.hero)
    if (!src) { host.innerHTML = ''; return }
    host.innerHTML = '<img src="' + esc(src) + '" alt="" fetchpriority="high" decoding="async" />'
  }

  /* Business ecosystem categories. */
  MOUNT.ecosystem = function (host) {
    host.innerHTML = '<div class="td-ecosystem">' + T.categories.map(function (c) {
      /* Same treatment as the business cards: the acronym IS the mark, set
         in gold serif on a tinted navy plate. An earlier version layered the
         letters behind a line icon as a watermark, which read as clutter and
         let long marks spill past the plate edge. */
      var mono = monoOf(T.get(c.name), c.mono)
      return '<a class="td-ecosystem__item reveal" href="' + esc(T.businessUrl()) + '"' +
        ' style="--td-tone:' + toneOf(c.slug) + '">' +
        '<span class="td-ecosystem__tile">' +
          '<span class="td-ecosystem__mono" data-len="' + mono.length + '" aria-hidden="true">' + esc(mono) + '</span>' +
        '</span>' +
        '<span class="td-ecosystem__name">' + esc(T.get(c.name)) + '</span>' +
        '<span class="td-ecosystem__blurb">' + esc(T.get(c.blurb)) + '</span>' +
      '</a>'
    }).join('') + '</div>'
  }

  /* Trade locations — the six Explore Buxar areas. */
  MOUNT.locations = function (host) {
    host.innerHTML = '<div class="td-locations">' + T.locations.map(function (l) {
      return '<a class="td-location reveal" href="' + esc(T.exploreUrl(l.slug)) + '">' +
        '<span class="td-location__bg" aria-hidden="true"><img src="' + esc(T.imageUrl(l.image)) + '" alt="" loading="lazy" decoding="async" /></span>' +
        '<span class="td-location__scrim" aria-hidden="true"></span>' +
        '<span class="td-location__body">' +
          '<span class="td-location__name">' + esc(T.get(l.name)) + '</span>' +
          '<span class="td-location__blurb">' + esc(T.get(l.blurb)) + '</span>' +
          '<span class="td-location__cta">' + esc(t('explore')) + ' ' + icon('arrow') + '</span>' +
        '</span>' +
      '</a>'
    }).join('') + '</div>'
  }

  /* Opportunity cards. */
  MOUNT.opportunities = function (host) {
    host.innerHTML = '<div class="td-opportunities">' + T.opportunities.map(function (o) {
      return '<a class="td-opportunity reveal" href="' + esc(T.businessUrl()) + '">' +
        '<span class="td-opportunity__icon">' + icon(o.icon) + '</span>' +
        '<span class="td-opportunity__name">' + esc(T.get(o.name)) + '</span>' +
        '<span class="td-opportunity__blurb">' + esc(T.get(o.blurb)) + '</span>' +
      '</a>'
    }).join('') + '</div>'
  }

  /* ---------------------------------------------------------------- */
  /* Generic reveal for injected markup (mirrors sections.js)          */
  /* ---------------------------------------------------------------- */

  function revealNow (scope) {
    var els = Array.from((scope || doc).querySelectorAll('.reveal'))
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in') })
      return
    }
    if (!doc.__tdObs) {
      doc.__tdObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            doc.__tdObs.unobserve(entry.target)
          }
        })
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
    }
    els.forEach(function (el) { doc.__tdObs.observe(el) })
  }

  /* ---------------------------------------------------------------- */
  /* Boot                                                             */
  /* ---------------------------------------------------------------- */

  function renderMounts () {
    var hosts = doc.querySelectorAll('[data-td]')
    for (var i = 0; i < hosts.length; i++) {
      var host = hosts[i]
      var fn = MOUNT[host.getAttribute('data-td')]
      if (!fn) continue
      try { fn(host) } catch (err) {
        console.error('[TheBuxar] trade mount failed', host.getAttribute('data-td'), err)
      }
    }
    revealNow(doc)
  }

  function boot () {
    renderMounts()
    try {
      new MutationObserver(function () { renderMounts() }).observe(doc.documentElement, {
        attributes: true,
        attributeFilter: ['data-lang']
      })
    } catch (e) {}
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
