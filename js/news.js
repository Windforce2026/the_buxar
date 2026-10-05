/* ------------------------------------------------------------------ */
/* TheBuxar.com — Current Buxar / News behaviours (pure vanilla)      */
/*                                                                     */
/* Load after js/news-data.js, the single source of truth for news,   */
/* events, festivals and city-life topics. This file renders every    */
/* part of the module from that dataset and wires the interactions.   */
/*                                                                     */
/* Page wiring (inline in each page, before this script):              */
/*   <script>window.TheBuxarConfig = { path: './' }</script>           */
/*                                                                     */
/* Rendering: section content mounts through the generic [data-nw]    */
/* hook, so a page only declares where content goes, never what it    */
/* contains. Pages:                                                   */
/*   news.html              current-news landing                       */
/*   news/article.html      one story          (?slug)                */
/*   news/event.html        one event          (?slug)                */
/*                                                                     */
/* Data honesty: a field is only drawn when the record carries it.    */
/* No date, author, source, venue, organiser or contact is ever       */
/* synthesised — the matching empty state is shown instead.            */
/*                                                                     */
/* Language: content is chosen via N.get() at render time and the     */
/* <html data-lang> change is observed so the module re-renders.       */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var N = window.TheBuxarNews
  if (!N) return

  var doc = document

  var CONFIG = window.TheBuxarConfig || {}
  N.path = typeof CONFIG.path === 'string' ? CONFIG.path : ''

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

  function t (key) { return N.get(N.ui[key]) }
  function icon (name) { return N.icons[name] || N.icons.doc }

  function params () {
    var p = {}
    try {
      var sp = new URLSearchParams(doc.defaultView.location.search)
      sp.forEach(function (v, k) { p[k] = v })
    } catch (e) { /* file:// with no query is fine */ }
    return p
  }

  function bySlug (list, slug) {
    if (!list) return null
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i]
    return null
  }

  function catName (slug) {
    for (var i = 0; i < N.categories.length; i++) if (N.categories[i].slug === slug) return N.get(N.categories[i].name)
    return ''
  }

  /* A record is only "real" when it is not a demo placeholder. */
  function isReal (rec) { return rec && rec.demo !== true }

  /* Date rendering — shows the date or a subtle en-dash. */
  function dateLabel (a) {
    return a.date
      ? '<time class="nw-card__date" datetime="' + esc(a.date) + '">' + esc(a.date) + '</time>'
      : '<span class="nw-card__date nw-card__date--pending">—</span>'
  }

  /* ---------------------------------------------------------------- */
  /* Empty states                                                     */
  /* ---------------------------------------------------------------- */

  function emptyState (iconName, title, sub, action, level) {
    /* Detail pages pass 1 so the page always keeps exactly one H1. */
    var tag = level === 1 ? 'h1' : 'h3'
    return '<div class="nw-empty" role="status">' +
      '<span class="nw-empty__mark" aria-hidden="true">' + icon(iconName || 'doc') + '</span>' +
      '<' + tag + ' class="nw-empty__title">' + esc(title) + '</' + tag + '>' +
      '<p class="nw-empty__sub">' + esc(sub) + '</p>' +
      (action || '') +
    '</div>'
  }

  /* ---------------------------------------------------------------- */
  /* Cards                                                            */
  /* ---------------------------------------------------------------- */

  function newsCard (a) {
    var date = dateLabel(a)
    return '<article class="nw-card reveal">' +
      '<a class="nw-card__media" href="' + esc(N.articleUrl(a)) + '" tabindex="-1" aria-hidden="true">' +
        '<img src="' + esc(N.imageUrl(a.image)) + '" alt="" loading="lazy" decoding="async" /></a>' +
      '<div class="nw-card__body">' +
        '<span class="nw-chip">' + esc(catName(a.category)) + '</span>' +
        '<h3 class="nw-card__title"><a href="' + esc(N.articleUrl(a)) + '">' + esc(N.get(a.title)) + '</a></h3>' +
        '<p class="nw-card__blurb">' + esc(N.get(a.excerpt)) + '</p>' +
        '<div class="nw-card__meta">' + date +
          '<a class="nw-card__cta" href="' + esc(N.articleUrl(a)) + '">' + esc(t('readMore')) + ' ' + icon('arrow') + '</a>' +
        '</div>' +
      '</div></article>'
  }

  function eventCard (e) {
    var dateBlock = e.date
      ? '<span class="nw-event__date"><span class="d">' + esc(e.date) + '</span><span class="m">' + esc(t('eventDate')) + '</span></span>'
      : '<span class="nw-event__date"><span class="d">—</span><span class="m">' + esc(t('eventDate')) + '</span></span>'
    var meta = ''
    if (e.time) meta += '<span>' + icon('clock') + esc(e.time) + '</span>'
    if (e.venue) meta += '<span>' + icon('pin') + esc(N.get(e.venue)) + '</span>'
    return '<article class="nw-event reveal">' +
      dateBlock +
      '<div class="nw-event__body">' +
        '<span class="nw-chip">' + esc(catName(e.category)) + '</span>' +
        '<h3 class="nw-event__title"><a href="' + esc(N.eventUrl(e)) + '">' + esc(N.get(e.title)) + '</a></h3>' +
        (meta ? '<div class="nw-event__meta">' + meta + '</div>' : '') +
        '<a class="nw-card__cta" href="' + esc(N.eventUrl(e)) + '">' + esc(t('viewEvent')) + ' ' + icon('arrow') + '</a>' +
      '</div></article>'
  }

  /* ---------------------------------------------------------------- */
  /* Mounts                                                           */
  /* ---------------------------------------------------------------- */

  var MOUNT = {}

  MOUNT.heroPhoto = function (host) {
    var src = N.imageUrl('assets/hero-buxar-sunset.jpg')
    if (!src) { host.innerHTML = ''; return }
    host.innerHTML = '<img src="' + esc(src) + '" alt="" fetchpriority="high" decoding="async" />'
  }

  /* Featured story. Only a real, dated article is featured. */
  MOUNT.featured = function (host) {
    var real = N.articles.filter(isReal)
    var a = real.length ? real[0] : N.articles[0]
    if (!a) {
      host.innerHTML = emptyState('doc', t('featuredTitle'), t('featuredSub'),
        '<a class="btn btn--ink" href="' + esc(N.path) + 'news.html#nw-latest">' + esc(t('readStory')) + '</a>')
      return
    }
    host.innerHTML =
      '<div class="nw-featured">' +
        '<figure class="nw-featured__media reveal"><img src="' + esc(N.imageUrl(a.image)) + '" alt="" /></figure>' +
        '<div class="nw-featured__body reveal">' +
          '<span class="nw-chip">' + esc(t('featuredLabel')) + '</span>' +
          '<h2 class="nw-title">' + esc(N.get(a.title)) + '</h2>' +
          '<p class="nw-sub">' + esc(N.get(a.excerpt)) + '</p>' +
          '<div class="nw-featured__meta">' +
            (a.date ? '<time datetime="' + esc(a.date) + '">' + esc(a.date) + '</time>' : '<span>—</span>') +
          '</div>' +
          '<a class="btn btn--ink" href="' + esc(N.articleUrl(a)) + '">' + esc(t('readStory')) + '</a>' +
        '</div>' +
      '</div>'
  }

  /* Durga Puja hero story. */
  MOUNT.durgaHero = function (host) {
    host.innerHTML =
      '<div class="nw-durga-hero">' +
        '<figure class="nw-durga-hero__media reveal"><img src="' + esc(N.imageUrl('assets/news-aarti.jpg')) + '" alt="" /></figure>' +
        '<div class="nw-durga-hero__body reveal">' +
          '<span class="nw-chip nw-chip--fest">' + esc(t('durgaLabel')) + '</span>' +
          '<h2 class="nw-title">' + esc(t('durgaTitle')) + '</h2>' +
          '<p class="nw-sub">' + esc(t('durgaSub')) + '</p>' +
          '<p class="nw-sub">' + esc(t('durgaBody')) + '</p>' +
          '<p class="nw-durga-hero__note">' + esc(t('durgaNote')) + '</p>' +
        '</div>' +
      '</div>'
  }

  /* Durga Puja event cards. Only real events render. */
  MOUNT.durgaEvents = function (host) {
    var real = N.events.filter(isReal)
    if (!real.length) {
      host.innerHTML = emptyState('calendar', t('durgaEventsTitle'), t('durgaEventsSub'))
      return
    }
    host.innerHTML = '<div class="nw-grid nw-grid--3">' + real.map(eventCard).join('') + '</div>'
  }

  /* Durga Puja gallery. Editorial images, clearly labelled. */
  MOUNT.durgaGallery = function (host) {
    var items = N.durgaGallery
    if (!items.length) {
      host.innerHTML = emptyState('image', t('galleryTitle'), t('gallerySub'))
      return
    }
    host.innerHTML = '<div class="nw-masonry">' + items.map(function (g, i) {
      var cls = 'nw-masonry__item reveal'
      if (i % 5 === 0) cls += ' nw-masonry__item--tall'
      if (i % 7 === 3) cls += ' nw-masonry__item--wide'
      return '<figure class="' + cls + '">' +
        '<img src="' + esc(N.imageUrl(g.src)) + '" alt="" loading="lazy" decoding="async" />' +
        '<figcaption>' + esc(N.get(g.caption)) + '</figcaption>' +
      '</figure>'
    }).join('') + '</div>'
  }

  /* Festivals & culture categories. Each one filters the Latest list, which is
     the only place these categories are actually indexed. */
  MOUNT.festivals = function (host) {
    host.innerHTML = '<div class="nw-grid nw-grid--4">' + N.festivals.map(function (f) {
      return '<button type="button" class="nw-card reveal nw-card--btn" data-nw-jump="nw-latest" data-nw-filter-slug="' +
        esc(f.slug) + '" aria-label="' + esc(N.get(f.name)) + '">' +
        '<span class="nw-chip nw-chip--fest">' + esc(N.get(f.name)) + '</span>' +
        '<span class="nw-card__title">' + esc(N.get(f.name)) + '</span>' +
      '</button>'
    }).join('') + '</div>'
  }

  /* Upcoming events with filters. */
  MOUNT.upcoming = function (host) {
    var real = N.events.filter(isReal)
    if (!real.length) {
      host.innerHTML = emptyState('calendar', t('upcomingTitle'), t('upcomingSub'))
      return
    }
    host.innerHTML = '<div class="nw-grid nw-grid--3">' + real.map(eventCard).join('') + '</div>'
  }

  /* Latest news. */
  MOUNT.latest = function (host) {
    var real = N.articles.filter(isReal)
    if (!real.length) {
      host.innerHTML = emptyState('doc', t('latestTitle'), t('latestSub'))
      return
    }
    host.innerHTML = '<div class="nw-grid nw-grid--3">' + real.slice(0, 6).map(newsCard).join('') + '</div>'
  }

  /* News category filter chips. */
  MOUNT.newsFilters = function (host) {
    host.innerHTML = '<div class="nw-filters" role="tablist" aria-label="News categories">' +
      N.categories.map(function (c, i) {
        return '<button type="button" class="nw-filter' + (i === 0 ? ' is-active' : '') + '" role="tab" data-nw-filter="' + esc(c.slug) + '">' + esc(N.get(c.name)) + '</button>'
      }).join('') + '</div>'
  }

  /* City life editorial topics. Markets, food and culture map to the Trade
     and Business sections; education and public spaces map to the
     district explorer. Nothing is left pointing nowhere. */
  var CITY_TOPIC_URL = {
    'markets': 'trade.html',
    'ganga': 'tourism.html',
    'food': 'business/list.html?cat=restaurants-food',
    'culture': 'news.html#nw-festivals',
    'education': 'business/list.html?cat=education',
    'youth': 'business.html',
    'business': 'business.html',
    'public-spaces': 'tourism.html'
  }

  MOUNT.cityLife = function (host) {
    host.innerHTML = '<div class="nw-grid nw-grid--4">' + N.cityLife.map(function (c) {
      var href = CITY_TOPIC_URL[c.slug]
      if (!href) return ''
      return '<a class="nw-card reveal" href="' + esc(N.path) + esc(href) + '">' +
        '<span class="nw-card__title">' + esc(N.get(c.name)) + '</span>' +
        '<span class="nw-card__blurb">' + esc(N.get(c.blurb)) + '</span>' +
      '</a>'
    }).join('') + '</div>'
  }

  /* Photography gallery. */
  MOUNT.photos = function (host) {
    var items = N.photos
    if (!items.length) {
      host.innerHTML = emptyState('image', t('photosTitle'), t('photosSub'))
      return
    }
    host.innerHTML = '<div class="nw-masonry">' + items.map(function (p, i) {
      var cls = 'nw-masonry__item reveal'
      if (i % 5 === 0) cls += ' nw-masonry__item--tall'
      if (i % 7 === 3) cls += ' nw-masonry__item--wide'
      return '<figure class="' + cls + '">' +
        '<img src="' + esc(N.imageUrl(p.src)) + '" alt="" loading="lazy" decoding="async" />' +
        '<figcaption>' + esc(N.get(p.caption)) + '</figcaption>' +
      '</figure>'
    }).join('') + '</div>'
  }

  /* ---------------------------------------------------------------- */
  /* Article detail page                                              */
  /* ---------------------------------------------------------------- */

  function renderArticle () {
    var host = doc.getElementById('nw-article')
    if (!host) return
    var p = params()
    var a = bySlug(N.articles, p.slug)

    if (!a) {
      doc.title = t('articleTitle') + ' | TheBuxar.com'
      host.innerHTML = '<div class="nw-shell"><div class="nw-article">' +
        emptyState('doc', t('articleTitle'), t('notFoundStory'),
          '<a class="btn btn--ink" href="' + esc(N.path) + 'news.html">' + esc(t('backToCurrent')) + '</a>', 1) +
        '</div></div>'
      return
    }

    var real = isReal(a)
    doc.title = N.get(a.title) + ' | Current Buxar | TheBuxar.com'
    var md = doc.querySelector('meta[name="description"]')
    if (md) md.setAttribute('content', N.get(a.excerpt).slice(0, 300))

    var body = real && a.content
      ? '<p>' + esc(N.get(a.content)) + '</p>'
      : '<p class="nw-article__note">' + esc(t('editorialNote')) + '</p>'

    /* Share and meta are only shown for real content. */

    var meta = ''
    if (a.date) meta += '<div class="nw-detail"><span class="nw-detail__label">' + esc(t('eventDate')) + '</span><span class="nw-detail__value">' + esc(a.date) + '</span></div>'
    if (a.author) meta += '<div class="nw-detail"><span class="nw-detail__label">' + esc(t('author')) + '</span><span class="nw-detail__value">' + esc(N.get(a.author)) + '</span></div>'
    if (a.source) meta += '<div class="nw-detail"><span class="nw-detail__label">' + esc(t('source')) + '</span><span class="nw-detail__value">' + esc(N.get(a.source)) + '</span></div>'
    if (a.location) meta += '<div class="nw-detail"><span class="nw-detail__label">' + esc(t('eventLocation')) + '</span><span class="nw-detail__value">' + esc(N.get(a.location)) + '</span></div>'

    host.innerHTML =
      '<div class="nw-shell"><div class="nw-article">' +
        '<span class="nw-chip">' + esc(catName(a.category)) + '</span>' +
        '<h1 class="nw-title" style="font-size:clamp(30px,5vw,48px)">' + esc(N.get(a.title)) + '</h1>' +
        (a.date ? '<p class="nw-sub" style="margin:0"><time datetime="' + esc(a.date) + '">' + esc(a.date) + '</time></p>' : '') +
        '<figure class="nw-article__hero"><img src="' + esc(N.imageUrl(a.image)) + '" alt="" /></figure>' +
        '<div class="nw-article__body">' + body + '</div>' +
        (meta ? '<div class="nw-detail-grid">' + meta + '</div>' : '') +
        '<div class="nw-share"><span class="nw-chip">' + esc(t('shareStory')) + '</span>' +
          '<button type="button" class="nw-share__btn" data-nw-share aria-label="' + esc(t('shareStory')) + '">' + icon('share') + '</button></div>' +
        '<div class="nw-cta"><a class="btn btn--ink" href="' + esc(N.path) + 'news.html">' + esc(t('backToCurrent')) + '</a></div>' +
      '</div></div>'
  }

  /* ---------------------------------------------------------------- */
  /* Event detail page                                                */
  /* ---------------------------------------------------------------- */

  function renderEvent () {
    var host = doc.getElementById('nw-event')
    if (!host) return
    var p = params()
    var e = bySlug(N.events, p.slug)

    if (!e) {
      doc.title = t('eventDetailTitle') + ' | TheBuxar.com'
      host.innerHTML = '<div class="nw-shell"><div class="nw-article">' +
        emptyState('calendar', t('eventDetailTitle'), t('notFoundEvent'),
          '<a class="btn btn--ink" href="' + esc(N.path) + 'news.html">' + esc(t('backToEvents')) + '</a>', 1) +
        '</div></div>'
      return
    }

    var real = isReal(e)
    doc.title = N.get(e.title) + ' | Buxar Events | TheBuxar.com'
    var md = doc.querySelector('meta[name="description"]')
    if (md) md.setAttribute('content', N.get(e.description).slice(0, 300))

    var body = real && e.description
      ? '<p>' + esc(N.get(e.description)) + '</p>'
      : '<p class="nw-article__note">' + esc(t('eventNote')) + '</p>'

    /* Share and meta are only shown for real content. */

    var grid = ''
    if (e.date) grid += '<div class="nw-detail"><span class="nw-detail__label">' + esc(t('eventDate')) + '</span><span class="nw-detail__value">' + esc(e.date) + '</span></div>'
    if (e.startTime) grid += '<div class="nw-detail"><span class="nw-detail__label">' + esc(t('eventTime')) + '</span><span class="nw-detail__value">' + esc(e.startTime) + (e.endTime ? ' – ' + esc(e.endTime) : '') + '</span></div>'
    if (e.venue) grid += '<div class="nw-detail"><span class="nw-detail__label">' + esc(t('eventVenue')) + '</span><span class="nw-detail__value">' + esc(N.get(e.venue)) + '</span></div>'
    if (e.location) grid += '<div class="nw-detail"><span class="nw-detail__label">' + esc(t('eventLocation')) + '</span><span class="nw-detail__value">' + esc(N.get(e.location)) + '</span></div>'
    if (e.organizer) grid += '<div class="nw-detail"><span class="nw-detail__label">' + esc(t('eventOrganizer')) + '</span><span class="nw-detail__value">' + esc(N.get(e.organizer)) + '</span></div>'
    if (e.contact) grid += '<div class="nw-detail"><span class="nw-detail__label">' + esc(t('eventContact')) + '</span><span class="nw-detail__value">' + esc(N.get(e.contact)) + '</span></div>'

    host.innerHTML =
      '<div class="nw-shell"><div class="nw-article">' +
        '<span class="nw-chip">' + esc(catName(e.category)) + '</span>' +
        '<h1 class="nw-title" style="font-size:clamp(30px,5vw,48px)">' + esc(N.get(e.title)) + '</h1>' +
        '<figure class="nw-article__hero"><img src="' + esc(N.imageUrl(e.image)) + '" alt="" /></figure>' +
        '<div class="nw-article__body">' + body + '</div>' +
        (grid ? '<div class="nw-detail-grid">' + grid + '</div>' : '') +
        '<div class="nw-cta"><a class="btn btn--ink" href="' + esc(N.path) + 'news.html">' + esc(t('backToEvents')) + '</a></div>' +
      '</div></div>'
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
    if (!doc.__nwObs) {
      doc.__nwObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            doc.__nwObs.unobserve(entry.target)
          }
        })
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
    }
    els.forEach(function (el) { doc.__nwObs.observe(el) })
  }

  /* ---------------------------------------------------------------- */
  /* Boot                                                             */
  /* ---------------------------------------------------------------- */

  function renderMounts () {
    var hosts = doc.querySelectorAll('[data-nw]')
    for (var i = 0; i < hosts.length; i++) {
      var host = hosts[i]
      var fn = MOUNT[host.getAttribute('data-nw')]
      if (!fn) continue
      try { fn(host) } catch (err) {
        console.error('[TheBuxar] news mount failed', host.getAttribute('data-nw'), err)
      }
    }
    revealNow(doc)
  }

  /* ---------------------------------------------------------------- */
  /* Delegated actions: festival jump + share                          */
  /* ---------------------------------------------------------------- */

  /* Festival tiles scroll to the Latest list. A matching category filter
     is applied first when one exists, so the tile always reveals content. */
  function onAction (e) {
    var jump = e.target.closest ? e.target.closest('[data-nw-jump]') : null
    if (jump) {
      var target = doc.getElementById(jump.getAttribute('data-nw-jump'))
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    var share = e.target.closest ? e.target.closest('[data-nw-share]') : null
    if (!share) return
    var url = window.location.href
    var title = doc.title
    if (navigator.share) {
      navigator.share({ title: title, url: url }).catch(function () {})
      return
    }
    /* No native share sheet (desktop) — copy the link instead. */
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        var old = share.getAttribute('aria-label')
        share.setAttribute('aria-label', t('linkCopied'))
        setTimeout(function () { share.setAttribute('aria-label', old) }, 1800)
      }).catch(function () {})
    }
  }

  function boot () {
    renderMounts()
    renderArticle()
    renderEvent()
    doc.addEventListener('click', onAction)
    try {
      new MutationObserver(function () {
        renderMounts()
        renderArticle()
        renderEvent()
      }).observe(doc.documentElement, { attributes: true, attributeFilter: ['data-lang'] })
    } catch (e) {}
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
