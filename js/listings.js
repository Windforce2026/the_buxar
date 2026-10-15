/* ------------------------------------------------------------------ */
/* TheBuxar.com — Listing vertical renderer                           */
/*                                                                     */
/* One renderer serves all five verticals. A page declares which one    */
/* it is and where to mount; everything else is derived.                 */
/*                                                                     */
/*   <body data-vertical="jobs">                                        */
/*   <div data-listing="hero"></div>                                    */
/*   <div data-listing="cats"></div>                                   */
/*   <div data-listing="list"></div>                                   */
/*   <div data-listing="submit"></div>                                 */
/*                                                                     */
/* The page never contains content. Adding a record to listings-data.js */
/* is enough for it to appear in the rail, the grid, the count on the   */
/* hero and the search index — there is no second place to update.      */
/*                                                                     */
/* Where a vertical is backed by the business directory (Food and       */
/* Services), real directory listings in the matching group are shown  */
/* alongside the vertical's own records, clearly attributed, because    */
/* they are genuinely the same businesses and should not be entered    */
/* twice.                                                              */
/*                                                                     */
/* Language: bilingual via L.get().                                    */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var L = window.TheBuxarListings
  if (!L) return

  function esc (s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }
  function t (v) { return L.get(v) }
  function lang () { return L.lang() }

  /* Icons reused from the directory's set so the verticals and the
     business pages speak one visual language. */
  var SVG = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'
  var ICONS = {
    food: '<svg ' + SVG + '><path d="M5 3v8a3 3 0 0 0 6 0V3M8 3v18"/><path d="M18 3c-2 1.6-3 3.6-3 6s1 4.4 3 5.4V21"/></svg>',
    services: '<svg ' + SVG + '><path d="M14.5 4.5a4.5 4.5 0 0 0-5.9 5.9L4 15v5h5l4.6-4.6a4.5 4.5 0 0 0 5.9-5.9L17 12l-3-3Z"/></svg>',
    briefcase: '<svg ' + SVG + '><rect x="3" y="7.5" width="18" height="13" rx="2"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5"/><path d="M3 12.5h18"/></svg>',
    home: '<svg ' + SVG + '><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"/><path d="M9.5 21v-6h5v6"/></svg>',
    tag: '<svg ' + SVG + '><path d="M3 11.5V4a1 1 0 0 1 1-1h7.5L21 12.5 12.5 21Z"/><circle cx="7.5" cy="7.5" r="1.4"/></svg>',
    pin: '<svg ' + SVG + '><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>',
    phone: '<svg ' + SVG + '><path d="M6.5 3.5h3l1.6 4-2 1.4a12 12 0 0 0 6 6l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"/></svg>',
    check: '<svg ' + SVG + '><path d="M4 12.5 9.5 18 20 6.5"/></svg>'
  }
  function icon (k) { return ICONS[k] || ICONS.tag }

  /* ------------------------------------------------------------------ */
  /* Region                                                             */
  /* ------------------------------------------------------------------ */
  function areaName (slug) {
    var R = window.TheBuxarRegions
    if (!R) return ''
    var r = R.bySlug(slug)
    return r ? R.get(r.name) : (slug ? String(slug) : '')
  }

  /* ------------------------------------------------------------------ */
  /* Records drawn from the business directory                          */
  /* ------------------------------------------------------------------ */
  function directoryItems (key) {
    var v = L.byKey(key)
    var B = window.TheBuxarBusiness
    if (!v || !v.fromDirectory || !B || !B.businesses) return []
    return B.businesses.filter(function (b) {
      return B.parentGroupOf && B.parentGroupOf(b.category) === v.fromDirectory
    })
  }

  /* ------------------------------------------------------------------ */
  /* Hero                                                               */
  /* ------------------------------------------------------------------ */
  function heroHtml (key) {
    var v = L.byKey(key)
    var own = L.itemsOf(key).length
    var dir = directoryItems(key).length
    var total = own + dir

    var h = '<div class="ls-hero__inner">'
    h += '<p class="ls-hero__label">' + esc(t(v.label)) + '</p>'
    h += '<h1 class="ls-hero__title">' + esc(t(v.title)) + '</h1>'
    h += '<p class="ls-hero__sub">' + esc(t(v.lead)) + '</p>'

    h += '<form class="ls-search" id="ls-form" role="search" onsubmit="return false">'
    h += '<div class="ls-search__field">'
    h += '<span class="ls-search__icon" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg></span>'
    h += '<input class="ls-search__input" id="ls-q" type="search" autocomplete="off" spellcheck="false" ' +
      'aria-label="' + esc(t(v.title)) + '" placeholder="' +
      esc(lang() === 'hi' ? 'खोजें…' : 'Search…') + '">'
    h += '</div>'
    h += '<span class="ls-search__loc">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 21s6-5.4 6-9.5A6 6 0 0 0 6 11.5C6 15.6 12 21 12 21Z"/><circle cx="12" cy="11" r="2.2"/></svg>' +
      esc(areaName(window.TheBuxarRegions ? window.TheBuxarRegions.current() : 'buxar-city')) + '</span>'
    h += '<button class="ls-search__go" type="submit">' +
      esc(lang() === 'hi' ? 'खोजें' : 'Search') + '</button>'
    h += '</form>'

    h += '<div class="ls-hero__stats">'
    h += '<div class="ls-stat"><span class="ls-stat__n">' + esc(String(total)) + '</span>' +
      '<span class="ls-stat__l">' + esc(lang() === 'hi' ? 'कुल सूचियाँ' : 'Listings') + '</span></div>'
    h += '<div class="ls-stat"><span class="ls-stat__n">' + esc(String(v.categories.length)) + '</span>' +
      '<span class="ls-stat__l">' + esc(lang() === 'hi' ? 'श्रेणियाँ' : 'Categories') + '</span></div>'
    var R = window.TheBuxarRegions
    h += '<div class="ls-stat"><span class="ls-stat__n">' +
      esc(String(R ? R.list.filter(function (r) { return r.live }).length : 0)) + '</span>' +
      '<span class="ls-stat__l">' + esc(lang() === 'hi' ? 'क्षेत्र' : 'Regions') + '</span></div>'
    h += '</div>'
    h += '</div>'
    return h
  }

  /* ------------------------------------------------------------------ */
  /* Category rail                                                      */
  /* ------------------------------------------------------------------ */
  function catsHtml (key) {
    var v = L.byKey(key)
    var active = L.activeCategories(key)
    var byCat = {}
    v.records.forEach(function (r) { byCat[r.category] = (byCat[r.category] || 0) + 1 })
    directoryItems(key).forEach(function (b) { byCat[b.category] = (byCat[b.category] || 0) + 1 })

    var h = '<div class="ls-cats">'
    h += '<button type="button" class="ls-cat is-active" data-cat="">' +
      '<span class="ls-cat__label">' + esc(lang() === 'hi' ? 'सभी' : 'All') + '</span>' +
      '<span class="ls-cat__n">' + esc(String(v.records.length + directoryItems(key).length)) + '</span></button>'
    v.categories.forEach(function (c) {
      var n = byCat[c.slug] || 0
      /* A category with nothing behind it is still listed — the taxonomy
         is the product — but it is marked so nobody mistakes it for a
         section with listings. */
      h += '<button type="button" class="ls-cat' + (n ? '' : ' is-empty') + '" data-cat="' + esc(c.slug) + '">' +
        '<span class="ls-cat__label">' + esc(t(c.noun || c.name)) + '</span>' +
        '<span class="ls-cat__n">' + esc(String(n)) + '</span></button>'
    })
    h += '</div>'

    /* Classifieds route the categories that have their own page. */
    if (v.redirects) {
      h += '<div class="ls-cats__more">'
      h += '<span class="ls-cats__morelabel">' + esc(lang() === 'hi' ? 'अपने पन्ने वाले विज्ञापन देखें' : 'Or browse those with a page of their own') + '</span>'
      v.redirects.forEach(function (r) {
        h += '<a class="ls-cats__moreitem" href="' + esc(L.path() + r.href) + '">' + esc(t(r.en ? { en: r.en, hi: r.hi } : r)) + ' →</a>'
      })
      h += '</div>'
    }
    return h
  }

  /* ------------------------------------------------------------------ */
  /* Cards                                                              */
  /* ------------------------------------------------------------------ */
  function fieldLabel (v, k) {
    for (var i = 0; i < v.fields.length; i++) if (v.fields[i].k === k) return v.fields[i]
    return null
  }

  function fieldValue (v, rec) {
    /* Only the fields that define this vertical are shown, so a restaurant
       card never grows a "Bedrooms" row. */
    var out = ''
    v.fields.forEach(function (f) {
      var raw = rec[f.k]
      if (raw === undefined || raw === null || raw === '' || raw === false) return
      var val
      if (f.type === 'bool') val = lang() === 'hi' ? 'हाँ' : 'Yes'
      else if (typeof raw === 'object') val = t(raw)
      else val = String(raw)
      out += '<div class="ls-card__field"><span class="ls-card__fl">' + esc(t(f)) +
        '</span><span class="ls-card__fv">' + esc(val) + '</span></div>'
    })
    return out
  }

  function cardHtml (rec, key, opts) {
    var v = L.byKey(key)
    opts = opts || {}
    var area = areaName(rec.area)
    var catName = L.catName(key, rec.category)

    var h = '<article class="ls-card">'
    h += '<a class="ls-card__link" href="' + esc(opts.href || '#') + '">'
    h += '<span class="ls-card__cat">' + esc(catName) + '</span>'
    h += '<h3 class="ls-card__title">' + esc(t(rec.name)) + '</h3>'
    if (rec.desc) h += '<p class="ls-card__desc">' + esc(t(rec.desc)) + '</p>'

    h += '<div class="ls-card__fields">' + fieldValue(v, rec) + '</div>'

    h += '<div class="ls-card__meta">'
    if (area) {
      h += '<span class="ls-card__meta-i">' + icon('pin') + esc(area) + '</span>'
    }
    if (rec.phone) {
      var R = window.TheBuxarRegions
      h += '<span class="ls-card__meta-i">' + icon('phone') +
        esc(R ? R.phone(rec.phone) : rec.phone) + '</span>'
    }
    h += '</div>'
    h += '</a></article>'
    return h
  }

  /* ------------------------------------------------------------------ */
  /* Grid + empty state                                                 */
  /* ------------------------------------------------------------------ */
  function emptyHtml (key, filtered) {
    var v = L.byKey(key)
    var R = window.TheBuxarRegions
    var regions = R ? R.switchable().filter(function (r) { return r.level === 'city' || r.level === 'block' }).length : 0

    var h = '<div class="ls-empty">'
    h += '<span class="ls-empty__icon">' + icon(v.icon) + '</span>'

    if (filtered) {
      /* Say which filter produced the empty result — a search miss and an
         empty category are different problems for the reader. */
      var why = state.q && !state.cat
        ? (lang() === 'hi'
            ? '"' + state.q + '" के लिए कुछ नहीं मिला।'
            : 'Nothing matches "' + state.q + '".')
        : (state.q
            ? (lang() === 'hi'
                ? 'इस श्रेणी में "' + state.q + '" नहीं मिला।'
                : 'Nothing in this category matches "' + state.q + '".')
            : (lang() === 'hi'
                ? 'इस श्रेणी में अभी कुछ नहीं है।'
                : 'Nothing in this category yet.'))
      h += '<h3 class="ls-empty__title">' + esc(why) + '</h3>'
      h += '<p class="ls-empty__sub">' + esc(lang() === 'hi'
        ? 'यह श्रेणी तैयार है और जैसे ही पहली सूची आएगी, यहाँ दिखने लगेगी।'
        : 'The category is ready. It fills itself the moment its first listing arrives.') + '</p>'
      h += '<button type="button" class="btn btn--gold" data-clearcat="1">' +
        esc(lang() === 'hi' ? 'सभी दिखाएँ' : 'Show everything') + '</button>'
    } else {
      h += '<h3 class="ls-empty__title">' + esc(lang() === 'hi' ? 'यहाँ अभी कोई सूची नहीं है' : 'No listings here yet') + '</h3>'
      h += '<p class="ls-empty__sub">' + esc(lang() === 'hi'
        ? 'हमने कोई नाम, नंबर या कीमत नहीं बनाई है। यह पन्ना ठीक से काम कर रहा है — सूचियाँ जुड़ते ही यहाँ दिखेंगी।'
        : 'No name, number or price has been invented here. The page is working — listings appear the moment they arrive.') + '</p>'
      h += '<div class="ls-empty__acts">'
      h += '<a class="btn btn--gold" href="#ls-submit">' + esc(t(v.submit)) + '</a>'
      h += '<a class="btn btn--ghost-light" href="contact.html">' +
        esc(lang() === 'hi' ? 'हमसे बात करें' : 'Talk to Us') + '</a>'
      h += '</div>'
      h += '<p class="ls-empty__note">' + esc(lang() === 'hi'
        ? 'ज़िले के ' + regions + ' नगरों और प्रखंडों के लिए यह पन्ना पहले से तैयार है।'
        : 'The page is already built out for ' + regions + ' towns and blocks of the district.') + '</p>'
    }
    h += '</div>'
    return h
  }

  function gridHtml (key, state) {
    var v = L.byKey(key)
    var own = L.itemsOf(key)
    var dir = directoryItems(key)
    var href = L.path() + 'business/profile.html?slug='

    var rows = own.filter(function (r) {
      if (state.cat && r.category !== state.cat) return false
      if (state.q && !matches(r, state.q)) return false
      return true
    })

    var dirRows = dir.filter(function (b) {
      if (state.cat && b.category !== state.cat) return false
      if (state.q) {
        var hay = [t(b.name), L.catName(key, b.category), areaName(b.area)].join(' ').toLowerCase()
        if (hay.indexOf(state.q.toLowerCase()) === -1) return false
      }
      return true
    })

    if (!rows.length && !dirRows.length) {
      return emptyHtml(key, !!(state.cat || state.q))
    }

    var h = '<div class="ls-grid">'
    rows.forEach(function (r) {
      h += cardHtml(r, key, { href: L.path() + v.page + '?item=' + encodeURIComponent(r.slug || '') })
    })
    dirRows.forEach(function (b) {
      h += cardHtml({
        name: b.name, desc: b.about || b.blurb, category: b.category,
        area: b.area, phone: b.phone
      }, key, { href: href + encodeURIComponent(b.slug) })
    })
    h += '</div>'
    h += '<p class="ls-count">' + esc(String(rows.length + dirRows.length)) +
      esc(lang() === 'hi' ? ' सूचियाँ' : (rows.length + dirRows.length === 1 ? ' listing' : ' listings')) + '</p>'
    return h
  }

  function matches (rec, q) {
    var hay = [t(rec.name), L.catName(L.currentKey, rec.category), areaName(rec.area), rec.desc ? t(rec.desc) : '']
      .join(' ').toLowerCase()
    return hay.indexOf(q.toLowerCase()) !== -1
  }

  /* ------------------------------------------------------------------ */
  /* Submit panel                                                       */
  /* ------------------------------------------------------------------ */
  function submitHtml (key) {
    var v = L.byKey(key)
    var R = window.TheBuxarRegions
    var regions = R ? R.switchable() : []

    var h = '<div class="ls-submit__card">'
    h += '<h3 class="ls-submit__title">' + esc(t(v.submit)) + '</h3>'
    h += '<p class="ls-submit__sub">' + esc(lang() === 'hi'
      ? 'विवरण भेजें और हम आपकी सूची का पन्ना बनाकर प्रकाशित कर देंगे। कोई फीस नहीं।'
      : 'Send the details and we will build and publish your listing page. No fee.') + '</p>'

    h += '<form class="ls-form" id="ls-submit-form" novalidate>'
    h += '<div class="ls-form__row">'
    h += '<label class="ls-form__field"><span>' + esc(lang() === 'hi' ? 'नाम' : 'Name') + ' *</span>' +
      '<input type="text" required name="name" autocomplete="organization"></label>'
    h += '<label class="ls-form__field"><span>' + esc(lang() === 'hi' ? 'श्रेणी' : 'Category') + ' *</span>' +
      '<select required name="category">'
    v.categories.forEach(function (c) {
      h += '<option value="' + esc(c.slug) + '">' + esc(t(c.noun || c.name)) + '</option>'
    })
    h += '</select></label>'
    h += '</div>'

    h += '<div class="ls-form__row">'
    h += '<label class="ls-form__field"><span>' + esc(lang() === 'hi' ? 'क्षेत्र' : 'Area') + '</span><select name="area">'
    if (regions.length) regions.forEach(function (r) {
      h += '<option value="' + esc(r.slug) + '"' + (r.slug === 'buxar-city' ? ' selected' : '') + '>' +
        esc(R.get(r.name)) + '</option>'
    })
    h += '</select></label>'
    h += '<label class="ls-form__field"><span>' + esc(lang() === 'hi' ? 'फ़ोन' : 'Phone') + ' *</span>' +
      '<input type="tel" required name="phone" autocomplete="tel" inputmode="tel"></label>'
    h += '</div>'

    /* One input per field this vertical actually shows, so an owner is
       never asked for something the card would not display. */
    if (v.fields.length) {
      h += '<div class="ls-form__row">'
      v.fields.forEach(function (f) {
        var type = f.type === 'bool' ? 'checkbox' : (f.type === 'number' ? 'number' : 'text')
        h += '<label class="ls-form__field"><span>' + esc(t(f)) + '</span>' +
          '<input type="' + type + '" name="' + esc(f.k) + '"></label>'
      })
      h += '</div>'
    }

    h += '<label class="ls-form__field ls-form__field--wide"><span>' +
      esc(lang() === 'hi' ? 'विवरण' : 'About') + '</span>' +
      '<textarea name="about" rows="3"></textarea></label>'

    h += '<div class="ls-form__foot">'
    h += '<button class="btn btn--gold" type="submit">' +
      esc(lang() === 'hi' ? 'भेजें' : 'Send') + '</button>'
    h += '<a class="btn btn--ghost-light" href="https://wa.me/919818048920" target="_blank" rel="noopener noreferrer">' +
      esc(lang() === 'hi' ? 'व्हाट्सएप करें' : 'Send on WhatsApp') + '</a>'
    h += '</div>'
    h += '<p class="ls-form__status" id="ls-form-status" role="status" aria-live="polite"></p>'
    h += '</form>'
    h += '</div>'
    return h
  }

  /* ------------------------------------------------------------------ */
  /* Mount + behaviour                                                  */
  /* ------------------------------------------------------------------ */
  var state = { cat: '', q: '' }
  var KEY = ''

  function host (name) { return document.querySelector('[data-listing="' + name + '"]') }
  var lastFocused = null

  function render () {
    L.currentKey = KEY
    var h = host('hero'); if (h) h.innerHTML = heroHtml(KEY)
    var c = host('cats'); if (c) c.innerHTML = catsHtml(KEY)
    var l = host('list'); if (l) l.innerHTML = gridHtml(KEY, state)
    var s = host('submit'); if (s) s.innerHTML = submitHtml(KEY)
  }

  function onClick (e) {
    var cat = e.target.closest && e.target.closest('[data-cat]')
    if (cat) {
      state.cat = cat.getAttribute('data-cat')
      document.querySelectorAll('.ls-cat').forEach(function (b) {
        b.classList.toggle('is-active', b === cat)
      })
      var l = host('list'); if (l) l.innerHTML = gridHtml(KEY, state)
      return
    }

    if (e.target.closest && e.target.closest('[data-clearcat]')) {
      state.cat = ''; state.q = ''
      var qi = document.getElementById('ls-q'); if (qi) qi.value = ''
      document.querySelectorAll('.ls-cat').forEach(function (b, i) {
        b.classList.toggle('is-active', i === 0)
      })
      var l2 = host('list'); if (l2) l2.innerHTML = gridHtml(KEY, state)
      return
    }

    /* Jump to the submit panel and focus its first field. */
    var jump = e.target.closest && e.target.closest('a[href="#ls-submit"]')
    if (jump) {
      e.preventDefault()
      lastFocused = document.activeElement
      var panel = document.getElementById('ls-submit')
      if (!panel) return
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' })
      var first = panel.querySelector('input, select, textarea')
      if (first) setTimeout(function () { first.focus({ preventScroll: true }) }, 420)
    }
  }

  function onInput (e) {
    if (e.target.id !== 'ls-q') return
    state.q = e.target.value
    var l = host('list'); if (l) l.innerHTML = gridHtml(KEY, state)
  }

  function onSubmit (e) {
    if (e.target.id === 'ls-submit-form') {
      e.preventDefault()
      var st = document.getElementById('ls-form-status')
      var form = e.target
      if (!form.checkValidity()) { form.reportValidity(); return }
      if (st) st.textContent = lang() === 'hi'
        ? 'धन्यवाद। आपका विवरण मिल गया है — हम इसे सत्यापित करके प्रकाशित करेंगे।'
        : 'Thank you. We have your details and will verify and publish it.'
      return
    }
    if (e.target.id === 'ls-form') {
      e.preventDefault()
      var input = document.getElementById('ls-q')
      if (input) input.value = state.q
    }
  }

  function boot () {
    KEY = document.body.getAttribute('data-vertical') || 'C'
    if (!L.byKey(KEY)) return

    /* Deep link: ?cat=plumbers on services.html, ?item=… on any page. */
    try {
      var qp = new URLSearchParams(window.location.search)
      if (qp.get('cat')) state.cat = qp.get('cat')
      if (qp.get('q')) state.q = qp.get('q')
    } catch (e) {}

    render()

    if (state.cat || state.q) {
      document.querySelectorAll('.ls-cat').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-cat') === (state.cat || ''))
      })
    }

    document.addEventListener('click', onClick)
    document.addEventListener('input', onInput)
    document.addEventListener('submit', onSubmit)

    try {
      new MutationObserver(render).observe(document.documentElement, {
        attributes: true, attributeFilter: ['data-lang']
      })
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
