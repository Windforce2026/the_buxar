/* ------------------------------------------------------------------ */
/* TheBuxar.com — Regions                                              */
/*                                                                     */
/* The platform is designed for Day 1 multi-region operation: Buxar    */
/* city today, then the district, the wider Shahabad belt, then other  */
/* towns and cities — without rebuilding anything.                    */
/*                                                                     */
/* EVERY place reference on the site resolves through this file.        */
/* Regions form a tree:                                                */
/*                                                                     */
/*   level 1  country                                                 */
/*   level 2  state            (Bihar)                                */
/*   level 3  zone             (Shahabad belt)                        */
/*   level 4  district         (Buxar)                                */
/*   level 5  city / town      (Buxar City, Dumraon, …)               */
/*   level 6  block / area     (Braxpur block, Brahmpur block, …)      */
/*                                                                     */
/* A record never hard-codes an area name. It stores a region slug and  */
/* everything else — labels, breadcrumbs, phone STD codes, search      */
/* scope — is derived from here. Adding a new region is a data edit,   */
/* not a code change.                                                 */
/*                                                                     */
/* Language: bilingual via R.get() at render time.                     */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var R = window.TheBuxarRegions = window.TheBuxarRegions || {}
  window.TheBuxarRegions = R

  R.defaultRegion = 'buxar-city'

  /* Level labels, shown in the region switcher. */
  R.levels = {
    country: { en: 'Country', hi: 'देश' },
    state: { en: 'State', hi: 'राज्य' },
    zone: { en: 'Zone', hi: 'क्षेत्र' },
    district: { en: 'District', hi: 'जिला' },
    city: { en: 'City / Town', hi: 'नगर' },
    block: { en: 'Block / Area', hi: 'प्रखंड / क्षेत्र' }
  }

  /* ------------------------------------------------------------------ */
  /* The region tree                                                    */
  /* ------------------------------------------------------------------ */
  /* `live` marks a region the platform currently serves. Every other    */
  /* region is already modelled and can be switched on by flipping one   */
  /* flag — which is the whole point of building this before it is       */
  /* needed.                                                             */
  /* ------------------------------------------------------------------ */
  R.list = [
    {
      slug: 'india',
      level: 'country',
      parent: null,
      live: true,
      name: { en: 'India', hi: 'भारत' },
      /* National dialling code. Used to derive a phone's country. */
      dial: '+91',
      lat: 20.5937,
      lng: 78.9629
    },
    {
      slug: 'bihar',
      level: 'state',
      parent: 'india',
      live: true,
      name: { en: 'Bihar', hi: 'बिहार' },
      /* State STD codes, used to normalise a landline. */
      std: ['0612', '06152', '06177', '06183'],
      lat: 25.0961,
      lng: 85.3131
    },
    {
      slug: 'shahabad-belt',
      level: 'zone',
      parent: 'bihar',
      live: true,
      name: { en: 'Shahabad Belt', hi: 'शाहाबाद पट्टी' },
      /* Buxar and its neighbours sit inside the Shahabad cultural belt. */
      blurb: {
        en: 'The Shahabad belt — Buxar, Buxaur, Ara and the towns between them.',
        hi: 'शाहाबाद पट्टी — बक्सर, बक्सौर, आरा और बीच के नगर।'
      },
      lat: 25.5542,
      lng: 84.6636
    },
    {
      slug: 'buxar',
      level: 'district',
      parent: 'shahabad-belt',
      live: true,
      name: { en: 'Buxar', hi: 'बक्सर' },
      /* District STD code — every Buxar landline starts with this. */
      std: ['06183'],
      blurb: {
        en: 'District of Buxar, Bihar — eleven blocks from the Ganga to the south.',
        hi: 'बिहार का बक्सर जिला — गंगा से दक्षिण तक ग्यारह प्रखंड।'
      },
      lat: 25.5641,
      lng: 84.6636
    },

    /* ---- level 5 : cities and towns ---- */
    {
      slug: 'buxar-city',
      level: 'city',
      parent: 'buxar',
      live: true,
      primary: true,
      seat: true,
      name: { en: 'Buxar City', hi: 'बक्सर नगर' },
      blurb: {
        en: 'The district headquarters — ghats, the maidan and the rail line.',
        hi: 'जिला मुख्यालय — घाट, मैदान और रेल-पटरी।'
      },
      image: 'assets/explore/buxar-town/hero.webp',
      lat: 25.5641,
      lng: 84.6636
    },
    {
      slug: 'dumraon',
      level: 'city',
      parent: 'buxar',
      live: true,
      name: { en: 'Dumraon', hi: 'डुमराँव' },
      blurb: {
        en: 'The second municipality and the old capital of the Dumraon Raj.',
        hi: 'दूसरा नगरपालिका नगर और प्राचीन डुमराँव राज की राजधानी।'
      },
      image: 'assets/explore/dumraon/hero.webp',
      lat: 25.5119,
      lng: 84.7069
    },

    /* ---- level 6 : blocks and areas ---- */
    {
      slug: 'brahampur',
      level: 'block',
      parent: 'buxar',
      live: true,
      name: { en: 'Brahampur', hi: 'ब्रहमपुर' },
      blurb: {
        en: 'The land of Baba Brahmeshwar Nath and the Shrawan walking pilgrimage.',
        hi: 'बाबा ब्रह्मेश्वर नाथ की भूमि और श्रावण पद-यात्रा।'
      },
      image: 'assets/explore/brahampur/hero.webp',
      lat: 25.6297,
      lng: 84.3867
    },
    {
      slug: 'chausa',
      level: 'block',
      parent: 'buxar',
      live: true,
      name: { en: 'Chausa', hi: 'चौसा' },
      blurb: {
        en: 'The field of the Battle of Chausa, 1539, and the mango that carries its name.',
        hi: 'चौसा का युद्ध, 1539 का मैदान और उसका नाम रखने वाला आम।'
      },
      image: 'assets/explore/chausa/hero.webp',
      lat: 25.4833,
      lng: 84.5167
    },
    {
      slug: 'itarhi',
      level: 'block',
      parent: 'buxar',
      live: true,
      name: { en: 'Itarhi', hi: 'इटाढ़ी' },
      blurb: {
        en: 'A largely rural block of the Buxar plains.',
        hi: 'बक्सर के मैदान का अधिकतर ग्रामीण प्रखंड।'
      },
      image: 'assets/explore/itarhi/hero.webp',
      lat: 25.3692,
      lng: 84.7806
    },
    {
      slug: 'rajpur',
      level: 'block',
      parent: 'buxar',
      live: true,
      name: { en: 'Rajpur', hi: 'राजपुर' },
      blurb: {
        en: 'The wide rural flank of the district’s south-east.',
        hi: 'जिले के दक्षिण-पूर्व की विस्तृत ग्रामीण भूमि।'
      },
      image: 'assets/explore/rajpur/hero.jpg',
      lat: 25.4333,
      lng: 84.8833
    },
    {
      /* Modelled but not yet served. Flip live:true when it goes live. */
      slug: 'chakki',
      level: 'block',
      parent: 'buxar',
      live: false,
      name: { en: 'Chakki', hi: 'चक्की' },
      lat: 25.4833,
      lng: 84.6167
    },
    {
      slug: 'chaugain',
      level: 'block',
      parent: 'buxar',
      live: false,
      name: { en: 'Chaugain', hi: 'चौगाईन' },
      lat: 25.5500,
      lng: 84.5167
    },
    {
      slug: 'simri',
      level: 'block',
      parent: 'buxar',
      live: false,
      name: { en: 'Simri', hi: 'सिमरी' },
      lat: 25.4833,
      lng: 84.5833
    },
    {
      slug: 'nawanagar',
      level: 'block',
      parent: 'buxar',
      live: false,
      name: { en: 'Nawanagar', hi: 'नवानगर' },
      lat: 25.5167,
      lng: 84.7167
    },
    {
      slug: 'kesath',
      level: 'block',
      parent: 'buxar',
      live: false,
      name: { en: 'Kesath', hi: 'केसठ' },
      lat: 25.5333,
      lng: 84.6167
    },

    /* ---- the wider belt, modelled but not yet served ---- */
    {
      slug: 'buxaur',
      level: 'district',
      parent: 'shahabad-belt',
      live: false,
      name: { en: 'Buxaur', hi: 'बक्सौर' },
      lat: 25.5667,
      lng: 83.7833
    },
    {
      slug: 'ara',
      level: 'district',
      parent: 'shahabad-belt',
      live: false,
      name: { en: 'Ara', hi: 'आरा' },
      lat: 25.5547,
      lng: 84.6606
    },
    {
      slug: 'patna',
      level: 'city',
      parent: 'bihar',
      live: false,
      name: { en: 'Patna', hi: 'पटना' },
      lat: 25.5941,
      lng: 85.1376
    }
  ]

  /* ------------------------------------------------------------------ */
  /* Derived helpers — every lookup goes through these                  */
  /* ------------------------------------------------------------------ */

  function lang () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }

  R.get = function (value) {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') return value
    return value[lang()] || value.en || ''
  }

  R.bySlug = function (slug) {
    if (!slug) return null
    for (var i = 0; i < R.list.length; i++) {
      if (R.list[i].slug === slug) return R.list[i]
    }
    return null
  }

  R.name = function (slug) {
    var r = R.bySlug(slug)
    return r ? R.get(r.name) : ''
  }

  R.children = function (slug) {
    return R.list.filter(function (r) { return r.parent === slug })
  }

  /* Live regions at one level beneath a parent. */
  R.liveChildren = function (slug) {
    return R.list.filter(function (r) { return r.parent === slug && r.live })
  }

  /* The chain from country down to a region — used for breadcrumbs. */
  R.trail = function (slug) {
    var out = []
    var cur = R.bySlug(slug)
    while (cur) {
      out.unshift(cur)
      cur = cur.parent ? R.bySlug(cur.parent) : null
    }
    return out
  }

  R.isLive = function (slug) {
    var r = R.bySlug(slug)
    return !!(r && r.live)
  }

  /* The region a page is currently scoped to: ?region=slug, else the
     default. Unknown or not-yet-live slugs fall back to the default so a
     stale link can never land on an empty page. */
  R.current = function () {
    var slug = R.defaultRegion
    try {
      var q = new URLSearchParams(window.location.search).get('region')
      if (q && R.bySlug(q)) slug = q
    } catch (e) {}
    return slug
  }

  R.set = function (slug) {
    try { localStorage.setItem('buxar-region', slug) } catch (e) {}
  }

  R.saved = function () {
    try { return localStorage.getItem('buxar-region') || '' } catch (e) { return '' }
  }

  /* Every live region that a reader can switch to, grouped by level. */
  R.switchable = function () {
    var out = []
    ;['state', 'zone', 'district', 'city', 'block'].forEach(function (lvl) {
      R.list.forEach(function (r) {
        if (r.live && r.level === lvl) out.push(r)
      })
    })
    return out
  }

  /* Does this region sit inside the one being viewed? Used to scope
     listings: viewing Buxar should still show Brahampur records. */
  R.within = function (slug, ancestor) {
    var trail = R.trail(slug).map(function (r) { return r.slug })
    return trail.indexOf(ancestor) !== -1
  }

  /* Phone numbers are normalised against the region's STD code so a
     landline reads consistently whichever region is being viewed. */
  R.phone = function (num) {
    var digits = String(num || '').replace(/[^\d]/g, '')
    if (!digits) return ''
    if (digits.length === 10) return '+91 ' + digits
    if (digits.length === 11 && digits.charAt(0) === '0') return '+91 ' + digits.slice(1)
    if (digits.length === 12 && digits.indexOf('91') === 0) return '+' + digits
    return '+91 ' + digits
  }
})()