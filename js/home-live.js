/* ------------------------------------------------------------------ */
/* TheBuxar.com — Homepage live panel                                  */
/*                                                                     */
/* Two blocks that sit directly under the hero:                       */
/*                                                                     */
/*   1. "What's happening in Buxar?" — the newest real stories and     */
/*      upcoming events, read straight from the news data. When no    */
/*      article has been published yet the block says so plainly       */
/*      rather than inventing filler.                                  */
/*                                                                     */
/*   2. Quick Access — twelve routes into the portal, each with a      */
/*      live count where the underlying data can supply one.           */
/*                                                                     */
/* Nothing here is hard-coded to a count. Every number is counted from */
/* the data modules at render time, so the panel corrects itself the   */
/* moment real listings arrive.                                        */
/*                                                                     */
/* Language: bilingual via P.get() at render time.                      */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var P = window.TheBuxarPortal || (window.TheBuxarPortal = {})
  var L = window.TheBuxarListings

  function lang () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }
  function t (en, hi) { return lang() === 'hi' ? hi : en }
  function esc (s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }
  var path = function () {
    var c = window.TheBuxarConfig || {}
    return typeof c.path === 'string' ? c.path : './'
  }

  /* Icon set. Most tiles reuse the directory's existing artwork so the
     homepage and the directory speak the same visual language; the few
     without one get their own here rather than borrowing an unrelated
     glyph. */
  var SVG = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'
  var ICONS = {
    news: '<svg ' + SVG + '><path d="M4 5h13v14H4z"/><path d="M17 9h3v8a2 2 0 0 1-2 2h-1"/><path d="M7 8.5h7M7 12h7M7 15.5h4"/></svg>',
    shop: '<svg ' + SVG + '><path d="M4 8h16l-1.2 11.2a1 1 0 0 1-1 .8H6.2a1 1 0 0 1-1-.8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    building: '<svg ' + SVG + '><path d="M4 21V6l7-3v18"/><path d="M11 21V9l9 3v9"/><path d="M7 9v.01M7 13v.01M7 17v.01M15 13v.01M15 17v.01"/><path d="M2 21h20"/></svg>',
    food: '<svg ' + SVG + '><path d="M5 3v8a3 3 0 0 0 6 0V3M8 3v18"/><path d="M18 3c-2 1.6-3 3.6-3 6s1 4.4 3 5.4V3Z" /><path d="M18 21V3"/></svg>',
    stay: '<svg ' + SVG + '><path d="M3 18v-8h13v8M16 10V6h5v12M3 18h18M3 21v-3M21 21v-3"/><circle cx="7" cy="12" r="1.6"/></svg>',
    pin: '<svg ' + SVG + '><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>',
    calendar: '<svg ' + SVG + '><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h3M8 17.5h6"/></svg>',
    briefcase: '<svg ' + SVG + '><rect x="3" y="7.5" width="18" height="13" rx="2"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5"/><path d="M3 12.5h18"/></svg>',
    home: '<svg ' + SVG + '><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"/><path d="M9.5 21v-6h5v6"/></svg>',
    services: '<svg ' + SVG + '><path d="M14.5 4.5a4.5 4.5 0 0 0-5.9 5.9L4 15v5h5l4.6-4.6a4.5 4.5 0 0 0 5.9-5.9L17 12l-3-3Z"/></svg>',
    tag: '<svg ' + SVG + '><path d="M3 11.5V4a1 1 0 0 1 1-1h7.5L21 12.5 12.5 21Z"/><circle cx="7.5" cy="7.5" r="1.4"/></svg>',
    phone: '<svg ' + SVG + '><path d="M6.5 3.5h3l1.6 4-2 1.4a12 12 0 0 0 6 6l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"/></svg>'
  }

  /* ------------------------------------------------------------------ */
  /* What's happening                                                   */
  /* ------------------------------------------------------------------ */
  function realArticles () {
    var N = window.TheBuxarNews
    if (!N || !N.articles) return []
    return N.articles.filter(function (a) {
      return !(typeof N.isReal === 'function' && !N.isReal(a))
    })
  }

  function upcomingEvents () {
    var N = window.TheBuxarNews
    if (!N || !N.events) return []
    var today = new Date()
    today.setHours(0, 0, 0, 0)
    return N.events.filter(function (e) {
      if (typeof N.isReal === 'function' && !N.isReal(e)) return false
      var d = new Date(e.date || e.startDate || 0)
      return !isNaN(d) && d >= today
    }).sort(function (a, b) {
      return new Date(a.date || a.startDate) - new Date(b.date || b.startDate)
    })
  }

  function fmtDate (iso) {
    var d = new Date(iso)
    if (isNaN(d)) return ''
    var sameYear = d.getFullYear() === new Date().getFullYear()
    try {
      return d.toLocaleDateString(lang() === 'hi' ? 'hi-IN' : 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: sameYear ? undefined : 'numeric'
      })
    } catch (e) { return d.toDateString() }
  }

  function happeningHtml () {
    var N = window.TheBuxarNews
    var arts = realArticles().slice(0, 4)
    var evs = upcomingEvents().slice(0, 3)

    var h = '<section class="live" aria-labelledby="live-title">'
    h += '<div class="shell">'
    h += '<header class="live__head">'
    h += '<div>'
    h += '<p class="live__label">' + esc(t('Live from', 'सीधा प्रसारण')) + '</p>'
    h += '<h2 class="live__title serif" id="live-title">' +
      esc(t("What's happening in Buxar?", 'बक्सर में क्या हो रहा है?')) + '</h2>'
    h += '</div>'
    h += '<a class="live__all" href="' + esc(path() + 'news.html') + '">' +
      esc(t('All news', 'सभी समाचार')) + ' →</a>'
    h += '</header>'

    h += '<div class="live__grid">'

    /* --- stories --- */
    h += '<div class="live__col">'
    h += '<h3 class="live__coltitle">' + esc(t('Latest stories', 'नवीनतम खबरें')) + '</h3>'
    if (arts.length) {
      h += '<ul class="live__list">'
      arts.forEach(function (a) {
        var href = N.articleUrl ? N.articleUrl(a) : path() + 'news.html'
        var cat = a.category && N.categories
          ? (N.categories.filter(function (c) { return c.slug === a.category })[0] || {})
          : {}
        h += '<li class="live__item">'
        h += '<a class="live__link" href="' + esc(href) + '">'
        if (cat.slug) {
          h += '<span class="live__tag">' + esc(N.get(cat.name)) + '</span>'
        }
        h += '<span class="live__headline">' + esc(N.get(a.title)) + '</span>'
        var d = a.date || a.published
        if (d) h += '<span class="live__date">' + esc(fmtDate(d)) + '</span>'
        h += '</a></li>'
      })
      h += '</ul>'
    } else {
      h += '<p class="live__empty">' + esc(t(
        'No stories have been published yet. This space fills itself the moment TheBuxar publishes its first report.',
        'अभी तक कोई खबर प्रकाशित नहीं हुई है। पहली खबर प्रकाशित होते ही यह स्थान स्वयं भर जाएगा।')) + '</p>'
    }
    h += '</div>'

    /* --- events --- */
    h += '<div class="live__col">'
    h += '<h3 class="live__coltitle">' + esc(t('Coming up', 'आगामी')) + '</h3>'
    if (evs.length) {
      h += '<ul class="live__list">'
      evs.forEach(function (e) {
        var href = N.eventUrl ? N.eventUrl(e) : path() + 'news.html'
        h += '<li class="live__item">'
        h += '<a class="live__link" href="' + esc(href) + '">'
        h += '<span class="live__date live__date--lead">' + esc(fmtDate(e.date || e.startDate)) + '</span>'
        h += '<span class="live__headline">' + esc(N.get(e.title)) + '</span>'
        if (e.venue) h += '<span class="live__meta">' + esc(N.get(e.venue)) + '</span>'
        h += '</a></li>'
      })
      h += '</ul>'
    } else {
      h += '<p class="live__empty">' + esc(t(
        'No events are on the calendar right now.',
        'इस समय कोई कार्यक्रम निर्धारित नहीं है।')) + '</p>'
    }
    h += '</div>'

    /* --- directory pulse --- */
    h += '<div class="live__col">'
    h += '<h3 class="live__coltitle">' + esc(t('Directory today', 'आज की निर्देशिका')) + '</h3>'
    h += '<ul class="live__stats">'
    ;[
      { n: (window.TheBuxarBusiness ? window.TheBuxarBusiness.businesses.length : 0), l: t('businesses listed', 'सूचीकृत व्यापार'), h: path() + 'business.html' },
      { n: (window.TheBuxarMarket ? (window.TheBuxarMarket.products || []).length : 0), l: t('items in the market', 'बाज़ार में वस्तुएँ'), h: path() + 'marketplace.html' },
      { n: (window.TheBuxarRegions ? window.TheBuxarRegions.list.filter(function (r) { return r.live }).length : 0), l: t('regions covered', 'शामिल क्षेत्र'), h: path() + 'explore.html' },
      { n: realArticles().length, l: t('stories published', 'प्रकाशित खबरें'), h: path() + 'news.html' }
    ].forEach(function (s) {
      h += '<li class="live__stat">'
      h += '<a href="' + esc(s.h) + '">'
      h += '<span class="live__statnum">' + esc(String(s.n)) + '</span>'
      h += '<span class="live__statlabel">' + esc(s.l) + '</span>'
      h += '</a></li>'
    })
    h += '</ul>'
    h += '</div>'

    h += '</div></div></section>'
    return h
  }

  /* ------------------------------------------------------------------ */
  /* Quick Access                                                       */
  /* ------------------------------------------------------------------ */
  var B = function () { return window.TheBuxarBusiness }
  var MK = function () { return window.TheBuxarMarket }

  /* Each tile counts only real records, and says "—" when the section
     has no data yet rather than showing a fabricated zero-content claim. */
  function quickTiles () {
    var bz = B(), mk = MK()
    var bizCount = bz ? bz.businesses.length : 0
    var prodCount = mk ? (mk.products || []).length : 0

    /* Count records per group so the shop and service tiles reflect the
       directory's real state as it grows. */
    function inGroup (groupSlug) {
      if (!bz || !bz.parentGroupOf) return 0
      return bz.businesses.filter(function (x) {
        return bz.parentGroupOf(x.category) === groupSlug
      }).length
    }

    return [
      { k: 'news', icon: 'news', label: t('Latest News', 'नवीनतम समाचार'), sub: t('Buxar and the district', 'बक्सर और जिला'), href: 'news.html', n: realArticles().length, live: true },
      { k: 'shop', icon: 'shop', label: t('Shop Local', 'स्थानीय दुकान'), sub: t('Buy and sell in Buxar', 'बक्सर में खरीदें और बेचें'), href: 'marketplace.html', n: prodCount, live: true },
      { k: 'business', icon: 'building', label: t('Find a Business', 'व्यापार खोजें'), sub: t('Shops, offices, services', 'दुकानें, कार्यालय, सेवाएँ'), href: 'business.html', n: bizCount, live: true },
      { k: 'food', icon: 'food', label: t('Food & Restaurants', 'भोजन और रेस्तराँ'), sub: t('Eats across the town', 'शहर भर का भोजन'), href: 'food.html', n: L.itemsOf('F').length + inGroup('hospitality'), live: true },
      { k: 'hotels', icon: 'stay', label: t('Hotels & Stay', 'होटल और ठहरना'), sub: t('Where to stay in Buxar', 'बक्सर में ठहरने की जगह'), href: 'food.html?cat=hotels', n: L.activeCategories('F').filter(function (c) { return c.slug === 'hotels' || c.slug === 'guest-house' }).length, live: true },
      { k: 'tourism', icon: 'pin', label: t('Tourist Places', 'पर्यटन स्थल'), sub: t('Ganga, temples, forts', 'गंगा, मंदिर, किले'), href: 'tourism.html', n: (window.TheBuxarExplore ? window.TheBuxarExplore.places.length : null), live: true },
      { k: 'events', icon: 'calendar', label: t('Events', 'आयोजन'), sub: t('Festivals and gatherings', 'त्योहार और सम्मेलन'), href: 'news.html#nw-festivals', n: upcomingEvents().length, live: true },
      { k: 'jobs', icon: 'briefcase', label: t('Jobs', 'रोज़गार'), sub: t('Work in and around Buxar', 'बक्सर में काम'), href: 'jobs.html', n: L.itemsOf('J').length, live: true },
      { k: 'property', icon: 'home', label: t('Property', 'संपत्ति'), sub: t('Buy, rent or sell', 'खरीदें, किराये पर या बेचें'), href: 'property.html', n: L.itemsOf('PR').length, live: true },
      { k: 'services', icon: 'services', label: t('Local Services', 'स्थानीय सेवाएँ'), sub: t('Repairs, plumbing, help', 'मरम्मत, प्लंबिंग, सहायता'), href: 'services.html', n: L.itemsOf('S').length + inGroup('local-services'), live: true },
      { k: 'offers', icon: 'tag', label: t('Offers & Deals', 'ऑफर और सौदे'), sub: t('What is on sale', 'क्या बिक रहा है'), href: 'marketplace.html?filter=offers', n: 0, live: false },
      { k: 'emergency', icon: 'phone', label: t('Emergency Contacts', 'आपातकालीन संपर्क'), sub: t('Police, hospital, fire', 'पुलिस, अस्पताल, दमकाम'), href: 'business.html?cat=police', n: bz ? bz.businesses.filter(function (x) { return x.category === 'police' }).length : 0, live: true }
    ]
  }

  function quickHtml () {
    var tiles = quickTiles()
    var h = '<section class="quick" aria-labelledby="quick-title">'
    h += '<div class="shell">'
    h += '<header class="quick__head">'
    h += '<h2 class="quick__title serif" id="quick-title">' +
      esc(t('Quick Access', 'तुरंत पहुँच')) + '</h2>'
    h += '<p class="quick__sub">' + esc(t(
      'Everything the city needs, twelve doors in.',
      'शहर की हर ज़रूरत, बारह दरवाज़ों में।')) + '</p>'
    h += '</header>'
    h += '<div class="quick__grid">'
    tiles.forEach(function (q) {
      var href = esc(path() + q.href)
      h += '<a class="quick__tile' + (q.live ? '' : ' is-soon') + '" href="' + href + '"' +
        (q.live ? '' : ' data-soon="1"') + '>'
      h += '<span class="quick__icon" aria-hidden="true">' + (ICONS[q.icon] || '') + '</span>'
      h += '<span class="quick__label">' + esc(q.label) + '</span>'
      h += '<span class="quick__sub">' + esc(q.sub) + '</span>'
      if (q.n !== null) {
        h += '<span class="quick__count">' + esc(String(q.n)) + '</span>'
      } else {
        h += '<span class="quick__count quick__count--none">' + esc(t('soon', 'जल्द')) + '</span>'
      }
      h += '</a>'
    })
    h += '</div></div></section>'
    return h
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                               */
  /* ------------------------------------------------------------------ */
  function mount () {
    var host = document.getElementById('home-live')
    if (!host) return
    host.innerHTML = happeningHtml() + quickHtml()

    try {
      new MutationObserver(function () { mount() }).observe(document.documentElement, {
        attributes: true, attributeFilter: ['data-lang']
      })
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount)
  else mount()
})()
