/* ------------------------------------------------------------------ */
/* TheBuxar.com — Accounts and listing tiers                          */
/*                                                                     */
/* This is the client's business model, encoded once so the whole site  */
/* speaks about it the same way:                                        */
/*                                                                     */
/*   Basic     free.  Enough to be found and listed.                   */
/*   Premium   paid.  Everything Basic has, plus placement, larger      */
/*              cards, images and a claim badge.                       */
/*                                                                     */
/* THERE IS NO SERVER. Accounts live in localStorage on this device,   */
/* and every action is honest about that: nothing is transmitted,      */
/* nothing is verified, and signing in on another device starts over.   */
/* The shape of the code is deliberately the shape a real backend      */
/* needs - one Account object, one tier check, one permission check -   */
/* so swapping localStorage for an API touches this file only.          */
/*                                                                     */
/* Language: bilingual throughout.                                      */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var A = window.TheBuxarAccount = window.TheBuxarAccount || {}
  window.TheBuxarAccount = A

  var KEY = 'buxar-account'
  var TIER_KEY = 'buxar-tier'

  function lang () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }

  /* Published so the UI layer can re-render on a language change without
     reaching back into this file's closure. */
  A.lang = lang

  /* Base for the page-relative links this module builds. */
  A.path = function () {
    var c = window.TheBuxarConfig || {}
    return typeof c.path === 'string' ? c.path : './'
  }

  A.t = function (o) {
    if (typeof o === 'string') return o
    return o ? (o[lang()] || o.en || '') : ''
  }

  /* ------------------------------------------------------------------ */
  /* Tiers                                                              */
  /*                                                                     */
  /* `weight` orders the tiers for any "is this enough?" question, and   */
  /* `features` is the single list the pricing pages render from, so the  */
  /* comparison never disagrees with the permission checks below.        */
  /* ------------------------------------------------------------------ */
  A.tiers = {
    basic: {
      key: 'basic',
      weight: 1,
      price: { en: 'Free', hi: 'मुफ़्त' },
      period: { en: 'forever', hi: 'हमेशा' },
      name: { en: 'Basic', hi: 'बेसिक' },
      tagline: { en: 'Be found. Get listed.', hi: 'मिलिए, सूचीबद्ध होइए।' },
      blurb: {
        en: 'A free page for your shop, service or office. Anyone searching TheBuxar can find you.',
        hi: 'आपकी दुकान, सेवा या कार्यालय के लिए एक मुफ़्त पेज। जो भी TheBuxar पर खोजेगा, वह आपको ढूँढ सकेगा।'
      },
      features: {
        en: ['Listed in the directory and search', 'Unlimited contact details', 'Basic listing card', 'Appear in one category', 'Respond to enquiries'],
        hi: ['निर्देशिका और खोज में सूचीबद्ध', 'असीमित संपर्क विवरण', 'सामान्य सूची कार्ड', 'एक श्रेणी में दिखाई देंगे', 'पूछताछ का जवाब दें']
      },
      limits: { listings: 1, photos: 0, priority: false, analytics: false },
      /* What the tier does NOT include. Shown on the Basic card so the
         comparison is not one-sided. */
      excludes: {
        en: ['Priority placement', 'Photos', 'Claimed badge', 'More than one category'],
        hi: ['प्राथमिक स्थान', 'तस्वीरें', 'दावा बैज', 'एक से अधिक श्रेणी']
      }
    },
    premium: {
      key: 'premium',
      weight: 2,
      price: { en: 'Paid', hi: 'सशुल्क' },
      period: { en: 'per year', hi: 'प्रति वर्ष' },
      name: { en: 'Premium', hi: 'प्रीमियम' },
      tagline: { en: 'Be chosen.', hi: 'चुना जाइए।' },
      blurb: {
        en: 'Everything in Basic, plus the placement and presence that decide who gets the call.',
        hi: 'बेसिक की सब कुछ, उसके साथ वह प्राथमिकता और उपस्थिति जो तय करती है कि कॉल किसे मिलेगी।'
      },
      features: {
        en: ['Everything in Basic', 'Priority placement in search and category pages', 'Photos on your card and page', 'Claimed and verified badge', 'List in up to five categories', 'Monthly visitor counts', 'Support when a listing is wrong'],
        hi: ['बेसिक की सब कुछ', 'खोज और श्रेणी पेज में प्राथमिक स्थान', 'कार्ड और पेज पर तस्वीरें', 'दावा और सत्यापन बैज', 'पाँच तक श्रेणियों में सूचीबद्ध', 'मासिक आगंतुक संख्या', 'सूची गलत हो तो सहायता']
      },
      limits: { listings: 5, photos: 10, priority: true, analytics: true },
      /* Exactly what Premium adds over Basic. Listed here rather than
         derived by comparing feature strings, so the upgrade case on the
         account page is written once and cannot drift. */
      adds: {
        en: ['Priority placement in search and category pages', 'Up to 10 photos', 'Claimed and verified badge', 'List in up to five categories', 'Monthly visitor counts'],
        hi: ['खोज और श्रेणी पेज में प्राथमिक स्थान', 'दस तस्वीरों तक', 'दावा और सत्यापन बैज', 'पाँच तक श्रेणियों में सूचीबद्ध', 'मासिक आगंतुक संख्या']
      }
    }
  }

  A.tierList = function () { return [A.tiers.basic, A.tiers.premium] }

  A.tier = function (key) { return A.tiers[key] || A.tiers.basic }

  /* The single permission check the rest of the site calls. */
  A.can = function (account, feature) {
    var lim = A.tier(account && account.tier).limits
    if (feature in lim) return !!lim[feature]
    return true
  }

  /* Higher tier first, then featured, then newest — the order every
     listing grid on the site uses. */
  A.rank = function (account) { return A.tier(account && account.tier).weight }

  /* ------------------------------------------------------------------ */
  /* Session                                                            */
  /* ------------------------------------------------------------------ */
  function read () {
    try {
      var raw = localStorage.getItem(KEY)
      return raw ? JSON.parse(raw) : null
    } catch (e) { return null }
  }

  function write (a) {
    try {
      if (a) localStorage.setItem(KEY, JSON.stringify(a))
      else localStorage.removeItem(KEY)
    } catch (e) {}
  }

  A.current = read

  A.isSignedIn = function () { return !!read() }

  A.isAdmin = function () {
    var a = read()
    return !!(a && a.role === 'admin')
  }

  A.register = function (name, email, password, opts) {
    opts = opts || {}
    name = String(name || '').trim()
    email = String(email || '').trim().toLowerCase()

    if (name.length < 2) return { ok: false, field: 'name', error: { en: 'Please enter your name.', hi: 'कृपया अपना नाम लिखें।' } }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) return { ok: false, field: 'email', error: { en: 'That email address does not look right.', hi: 'यह ईमेल पता सही नहीं लगता।' } }
    if (String(password || '').length < 8) return { ok: false, field: 'password', error: { en: 'Use at least 8 characters.', hi: 'कम से कम 8 अक्षर रखें।' } }

    var existing = A.all()
    for (var i = 0; i < existing.length; i++) {
      if (existing[i].email === email) {
        return { ok: false, field: 'email', error: { en: 'An account already exists for that email on this device.', hi: 'इस डिवाइस पर उस ईमेल से पहले से खाता बना है।' } }
      }
    }

    var acct = {
      id: 'u' + Date.now().toString(36),
      name: name,
      email: email,
      tier: opts.tier === 'premium' ? 'premium' : 'basic',
      role: 'user',
      /* Never the password. The shape is here so a real backend has a
         column to fill; a browser must not pretend to store one. */
      hasPassword: !!password,
      joined: new Date().toISOString(),
      listings: []
    }
    existing.push(acct)
    try { localStorage.setItem('buxar-accounts', JSON.stringify(existing)) } catch (e) {}
    write(acct)
    return { ok: true, account: acct }
  }

  A.signIn = function (email, password) {
    email = String(email || '').trim().toLowerCase()
    var list = A.all()
    for (var i = 0; i < list.length; i++) {
      if (list[i].email === email) {
        write(list[i])
        return { ok: true, account: list[i] }
      }
    }
    return {
      ok: false,
      field: 'email',
      error: {
        en: 'No account on this device uses that email. Accounts are stored only in this browser, so an account made elsewhere will not be found here.',
        hi: 'इस डिवाइस पर उस ईमेल से कोई खाता नहीं है। खाते केवल इसी ब्राउज़र में रहते हैं, इसलिए दूसरी जगह बना खाता यहाँ नहीं मिलेगा।'
      }
    }
  }

  A.signOut = function () { write(null) }

  A.all = function () {
    try { return JSON.parse(localStorage.getItem('buxar-accounts') || '[]') } catch (e) { return [] }
  }

  /* ------------------------------------------------------------------ */
  /* Admin                                                              */
  /*                                                                     */
  /* The dashboard counts what is actually on the site. It reports zeros */
  /* where there is genuinely nothing, which is the number that should   */
  /* drive the client's next decision.                                    */
  /* ------------------------------------------------------------------ */
  A.stats = function () {
    var B = window.TheBuxarBusiness
    var N = window.TheBuxarNews
    var M = window.TheBuxarMarket
    var L = window.TheBuxarListings
    var X = window.TheBuxarExplore
    var R = window.TheBuxarRegions
    var C = window.TheBuxarCommunity

    function vcount (k) { return L ? L.itemsOf(k).length : 0 }

    var articles = N && N.isReal ? N.articles.filter(N.isReal).length : 0
    var events = N && N.isReal ? N.events.filter(N.isReal).length : 0
    var demoArticles = N ? N.articles.length - articles : 0

    return {
      accounts: A.all().length,
      listings: {
        business: B ? B.businesses.length : 0,
        market: M && M.products ? M.products.length : 0,
        food: vcount('F'),
        services: vcount('S'),
        jobs: vcount('J'),
        property: vcount('PR'),
        classifieds: vcount('C'),
        community: C ? C.total() : 0
      },
      content: {
        articles: articles,
        events: events,
        placeholders: demoArticles,
        places: X && X.places ? X.places.length : 0
      },
      coverage: {
        regionsModelled: R ? R.list.length : 0,
        regionsLive: R ? R.list.filter(function (r) { return r.live }).length : 0,
        categories: B ? B.categories.length : 0
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Header state                                                       */
  /*                                                                     */
  /* Adds an account button to the bar so the reader can see at a glance */
  /* whether they are signed in, and at which tier.                       */
  /* ------------------------------------------------------------------ */
  A.mountHeader = function () {
    var actions = document.querySelector('.nav__actions')
    if (!actions || document.getElementById('acct-btn')) return

    var acct = A.current()
    var label = acct ? acct.name.split(' ')[0] : (lang() === 'hi' ? 'खाता' : 'Account')
    var href = acct ? 'account.html' : 'login.html'
    /* A.path() falls back to './' when the page has not declared
       window.TheBuxarConfig, so this can never build "undefinedlogin.html". */
    var prefix = A.path()

    var btn = document.createElement('a')
    btn.id = 'acct-btn'
    btn.className = 'nav__acct' + (acct ? ' is-on' : '') +
      (acct && acct.tier === 'premium' ? ' is-premium' : '')
    btn.href = prefix + href
    btn.setAttribute('aria-label', lang() === 'hi' ? 'मेरा खाता' : 'My account')
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
      '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>' +
      '<span class="nav__acct-name">' + label.replace(/[<>&]/g, '') + '</span>' +
      (acct && acct.tier === 'premium'
        ? '<span class="nav__acct-badge" aria-hidden="true"></span>'
        : '')
    actions.insertBefore(btn, actions.querySelector('.nav__search-btn') || null)
  }

  function boot () {
    A.mountHeader()
    try {
      new MutationObserver(function () { A.mountHeader() }).observe(document.documentElement, {
        attributes: true, attributeFilter: ['data-lang']
      })
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
