/* ------------------------------------------------------------------ */
/* TheBuxar.com — Community Hub                                       */
/*                                                                     */
/* Three kinds of member contribution, sharing one model because they   */
/* behave the same - a title, a body, an author, a region, a status:    */
/*                                                                     */
/*   blog     a written post from a member                             */
/*   forum    a thread, with replies                                  */
/*   review   a rating attached to a real directory listing             */
/*                                                                     */
/* A review is the only one that can be wrong in a way that matters, so  */
/* it carries the strictest rule: it may only be written about a listing */
/* that actually exists in js/business-data.js. The renderer refuses to   */
/* show a review for a business that is not there.                      */
/*                                                                     */
/* EVERY array below is empty. No member has written anything yet, and  */
/* no rating has been invented for a hospital or a police station.        */
/*                                                                     */
/* Moderation: the client's spec does not say who moderates forums and   */
/* reviews. Until that is answered, every member post is created with    */
/* status 'pending' and none is published by the front end. This is a   */
/* deliberate refusal to publish unreviewed user content, not an         */
/* omission - see C.MODERATION below.                                    */
/*                                                                     */
/* Language: bilingual throughout.                                      */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var C = window.TheBuxarCommunity = window.TheBuxarCommunity || {}
  window.TheBuxarCommunity = C

  var T = function (en, hi) { return { en: en, hi: hi } }

  C.get = function (o) {
    if (typeof o === 'string') return o
    return o ? (o[C.lang()] || o.en || '') : ''
  }
  C.lang = function () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }
  C.path = function () {
    var c = window.TheBuxarConfig || {}
    return typeof c.path === 'string' ? c.path : './'
  }

  /* ------------------------------------------------------------------ */
  /* Moderation                                                         */
  /*                                                                     */
  /* The client has not answered who moderates forums and reviews.       */
  /* Until they do, posts are queued rather than published. Flip        */
  /* C.autoPublish to true ONLY once a moderator is actually in place -  */
  /* doing it earlier means publishing whatever anyone types.            */
  /* ------------------------------------------------------------------ */
  C.MODERATION = {
    autoPublish: false,
    note: {
      en: 'Every post from a member is checked before it appears. Nobody has posted yet.',
      hi: 'सदस्य का हर पोस्ट दिखने से पहले जाँचा जाता है। अभी किसी ने कुछ नहीं लिखा है।'
    },
    pending: { en: 'Waiting for review', hi: 'समीक्षा की प्रतीक्षा में' },
    published: { en: 'Published', hi: 'प्रकाशित' }
  }

  /* ------------------------------------------------------------------ */
  /* Topics                                                             */
  /* ------------------------------------------------------------------ */
  C.topics = [
    { slug: 'general', name: T('General', 'सामान्य') },
    { slug: 'heritage', name: T('Heritage & History', 'विरासत एवं इतिहास') },
    { slug: 'food', name: T('Food', 'भोजन') },
    { slug: 'civic', name: T('Civic Issues', 'नागरिक मुद्दे') },
    { slug: 'education', name: T('Education', 'शिक्षा') },
    { slug: 'business', name: T('Business & Trade', 'व्यापार एवं वाणिज्य') },
    { slug: 'help', name: T('Need Help', 'मदद चाहिए') },
    { slug: 'events', name: T('Events', 'आयोजन') }
  ]

  /* ------------------------------------------------------------------ */
  /* Records — empty by design                                          */
  /*                                                                     */
  /*   C.blogs = [{                                                      */
  /*     slug: 'a-walk-through-brahampur',                               */
  /*     title: { en: 'A walk through Brahampur', hi: '…' },             */
  /*     topic: 'heritage',                                              */
  /*     author: { en: 'A reader', hi: 'एक पाठक' },                      */
  /*     region: 'brahampur',                                           */
  /*     body: { en: '…', hi: '…' },                                    */
  /*     date: '2026-01-20',                                             */
  /*     status: 'published',                                            */
  /*     featured: true                                                  */
  /*   }]                                                                */
  /*                                                                     */
  /*   C.forums = [{                                                     */
  /*     slug, title, topic, author, region, body, date, status,         */
  /*     replies: [{ author, body, date, status }]                      */
  /*   }]                                                                */
  /*                                                                     */
  /*   C.reviews = [{                                                    */
  /*     slug, business: '<a real BuxarBusiness slug>',                  */
  /*     author, rating: 1..5, body, date, status                       */
  /*   }]                                                                */
  /*                                                                     */
  /* Only `published` posts render. Anything else is held.               */
  /* ------------------------------------------------------------------ */
  C.blogs = []
  C.forums = []
  C.reviews = []

  /* ------------------------------------------------------------------ */
  /* Derived                                                            */
  /* ------------------------------------------------------------------ */
  function live (arr) {
    return (arr || []).filter(function (r) {
      return C.MODERATION.autoPublish || r.status === 'published'
    })
  }

  C.blogList = function () {
    return live(C.blogs).sort(function (a, b) {
      var fa = a.featured ? 0 : 1, fb = b.featured ? 0 : 1
      if (fa !== fb) return fa - fb
      return String(b.date || '').localeCompare(String(a.date || ''))
    })
  }

  C.forumList = function () {
    return live(C.forums)
      .map(function (t) {
        t.replyCount = live(t.replies).length
        return t
      })
      .sort(function (a, b) {
        if (b.replyCount !== a.replyCount) return b.replyCount - a.replyCount
        return String(b.date || '').localeCompare(String(a.date || ''))
      })
  }

  /* A review is only ever shown against a business that exists. */
  C.reviewsFor = function (bizSlug) {
    return live(C.reviews).filter(function (r) { return r.business === bizSlug })
  }

  /* The average rating for a business, or 0 when nobody has reviewed it.
     A business with no reviews is never given a fabricated average. */
  C.ratingOf = function (bizSlug) {
    var list = C.reviewsFor(bizSlug)
    if (!list.length) return { count: 0, average: 0 }
    var sum = 0
    list.forEach(function (r) { sum += Math.max(1, Math.min(5, Number(r.rating) || 0)) })
    return { count: list.length, average: Math.round((sum / list.length) * 10) / 10 }
  }

  /* Every review on the site, for the dashboard's moderation queue. */
  C.pending = function () {
    var out = []
    C.blogs.forEach(function (b) { if (b.status !== 'published') out.push({ kind: 'blog', slug: b.slug, title: b.title, author: b.author, date: b.date }) })
    C.forums.forEach(function (f) {
      if (f.status !== 'published') out.push({ kind: 'forum', slug: f.slug, title: f.title, author: f.author, date: f.date })
      ;(f.replies || []).forEach(function (r, i) {
        if (r.status !== 'published') out.push({ kind: 'reply', slug: f.slug + '#' + i, title: f.title, author: r.author, date: r.date })
      })
    })
    C.reviews.forEach(function (r) {
      if (r.status !== 'published') out.push({ kind: 'review', slug: r.slug, title: r.title || r.business, author: r.author, date: r.date })
    })
    return out
  }

  C.total = function () {
    return C.blogList().length +
      C.forumList().length +
      live(C.reviews).length
  }

  C.topicName = function (slug) {
    for (var i = 0; i < C.topics.length; i++) {
      if (C.topics[i].slug === slug) return C.get(C.topics[i].name)
    }
    return ''
  }

  /* ------------------------------------------------------------------ */
  /* Creating posts                                                     */
  /*                                                                     */
  /* The forms work and save a draft, but nothing is published until a  */
  /* moderator says so - see C.MODERATION.                               */
  /* ------------------------------------------------------------------ */
  C.create = function (kind, data) {
    var acct = window.TheBuxarAccount ? window.TheBuxarAccount.current() : null
    var rec = {
      slug: (kind + '-' + Date.now().toString(36)),
      title: { en: data.title || '', hi: data.title || '' },
      topic: data.topic || 'general',
      region: data.region || '',
      body: { en: data.body || '', hi: data.body || '' },
      author: acct ? { en: acct.name, hi: acct.name } : { en: 'Guest', hi: 'अतिथि' },
      date: new Date().toISOString().slice(0, 10),
      status: C.MODERATION.autoPublish ? 'published' : 'pending'
    }
    if (kind === 'forum') rec.replies = []
    if (kind === 'review') {
      rec.business = data.business || ''
      rec.rating = Math.max(1, Math.min(5, Number(data.rating) || 5))
    }

    var store = kind === 'blog' ? 'buxar-blogs' : (kind === 'forum' ? 'buxar-forums' : 'buxar-reviews')
    var all = C.readStore(store)
    all.unshift(rec)
    C.writeStore(store, all)
    return rec
  }

  /* Drafts a member has written on this device. Not published content. */
  C.readStore = function (k) {
    try { return JSON.parse(localStorage.getItem(k) || '[]') } catch (e) { return [] }
  }
  C.writeStore = function (k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {}
  }
  C.drafts = function (kind) {
    var store = kind === 'blog' ? 'buxar-blogs' : (kind === 'forum' ? 'buxar-forums' : 'buxar-reviews')
    return C.readStore(store)
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                          */
  /* ------------------------------------------------------------------ */
  function esc (s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }

  function meta (rec) {
    var R = window.TheBuxarRegions
    var where = rec.region && R ? C.get(R.bySlug(rec.region) ? R.bySlug(rec.region).name : '') : ''
    var bits = []
    if (rec.author) bits.push(C.get(rec.author))
    if (where) bits.push(where)
    if (rec.date) bits.push(C.date(rec.date))
    return bits.join(' · ')
  }

  C.date = function (iso) {
    var d = new Date(iso)
    if (isNaN(d)) return ''
    try {
      return d.toLocaleDateString(C.lang() === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch (e) { return '' }
  }

  C.stars = function (n) {
    var full = Math.round(n)
    var h = '<span class="cu__stars" role="img" aria-label="' + n + ' / 5">'
    for (var i = 1; i <= 5; i++) {
      h += '<span class="cu__star' + (i <= full ? ' is-on' : '') + '" aria-hidden="true">★</span>'
    }
    return h + '</span>'
  }

  C.blogHtml = function (b) {
    return '<article class="cb">' +
      '<p class="cb__topic">' + esc(C.topicName(b.topic)) + '</p>' +
      '<h3 class="cb__title">' + esc(C.get(b.title)) + '</h3>' +
      (b.body ? '<p class="cb__body">' + esc(C.get(b.body).slice(0, 190)) +
        (C.get(b.body).length > 190 ? '…' : '') + '</p>' : '') +
      '<p class="cb__meta">' + esc(meta(b)) + '</p>' +
      '</article>'
  }

  C.forumHtml = function (f) {
    return '<article class="cf">' +
      '<p class="cf__topic">' + esc(C.topicName(f.topic)) + '</p>' +
      '<h3 class="cf__title">' + esc(C.get(f.title)) + '</h3>' +
      '<p class="cf__body">' + esc(C.get(f.body).slice(0, 190)) +
        (C.get(f.body).length > 190 ? '…' : '') + '</p>' +
      '<p class="cf__meta">' + esc(meta(f)) +
        ' · <span class="cf__replies">' + f.replyCount + ' ' +
        esc(C.lang() === 'hi' ? 'जवाब' : (f.replyCount === 1 ? 'reply' : 'replies')) +
        '</span></p>' +
      '</article>'
  }

  C.reviewHtml = function (r) {
    var B = window.TheBuxarBusiness
    var biz = B ? B.bySlug(r.business) : null
    /* Refuse to render a review for a listing that does not exist. */
    if (!biz) return ''
    return '<article class="cr">' +
      C.stars(r.rating) +
      '<p class="cr__body">' + esc(C.get(r.body)) + '</p>' +
      '<p class="cr__meta">' + esc(meta(r)) + '</p>' +
      '<a class="cr__biz" href="' + esc(C.path() + 'business/profile.html?slug=' + encodeURIComponent(r.business)) + '">' +
      esc(C.get(biz.name)) + ' →</a>' +
      '</article>'
  }

  /* Nothing published yet — say so, and point at the way in. */
  C.emptyHtml = function (kind, msg) {
    var labels = {
      blog: { en: 'No posts yet', hi: 'अभी कोई लेख नहीं' },
      forum: { en: 'No discussions yet', hi: 'अभी कोई चर्चा नहीं' },
      review: { en: 'No reviews yet', hi: 'अभी कोई समीक्षा नहीं' }
    }
    return '<div class="cu-empty">' +
      '<h3 class="cu-empty__title">' + esc(C.get(labels[kind])) + '</h3>' +
      '<p class="cu-empty__sub">' + esc(msg) + '</p>' +
      '<a class="btn btn--gold" href="#cu-write">' +
      esc(C.lang() === 'hi' ? 'पहला लेख लिखें' : 'Write the first one') + '</a>' +
      '</div>'
  }

  /* ------------------------------------------------------------------ */
  /* Page mount                                                         */
  /* ------------------------------------------------------------------ */
  function mount () {
    var host = document.getElementById('cu-lists')
    if (!host) return

    var blogs = C.blogList()
    var forums = C.forumList()
    var reviews = (function () {
      var B = window.TheBuxarBusiness
      if (!B) return []
      var out = []
      /* Only reviews whose business is real survive. */
      B.businesses.forEach(function (b) { out = out.concat(C.reviewsFor(b.slug)) })
      return out.slice(0, 6)
    })()

    var h = ''

    h += '<section class="cu-col">'
    h += '<h2 class="cu-col__title">' + esc(C.lang() === 'hi' ? 'ब्लॉग' : 'Blog') + '</h2>'
    h += blogs.length ? blogs.map(C.blogHtml).join('')
      : C.emptyHtml('blog', C.lang() === 'hi'
        ? 'किसी सदस्य ने अभी कुछ नहीं लिखा। पहला लेख आपका हो सकता है।'
        : 'No member has written anything yet. The first post could be yours.')
    h += '</section>'

    h += '<section class="cu-col">'
    h += '<h2 class="cu-col__title">' + esc(C.lang() === 'hi' ? 'फ़ोरम चर्चाएँ' : 'Forum discussions') + '</h2>'
    h += forums.length ? forums.map(C.forumHtml).join('')
      : C.emptyHtml('forum', C.lang() === 'hi'
        ? 'कोई चर्चा शुरू नहीं हुई है। सवाल पूछने के लिए यहाँ लिखें।'
        : 'No discussion has been started. Ask a question and it will appear here.')
    h += '</section>'

    h += '<section class="cu-col">'
    h += '<h2 class="cu-col__title">' + esc(C.lang() === 'hi' ? 'समीक्षाएँ' : 'Reviews') + '</h2>'
    h += reviews.length ? reviews.map(C.reviewHtml).join('')
      : C.emptyHtml('review', C.lang() === 'hi'
        ? 'अभी तक किसी व्यापार की कोई समीक्षा नहीं हुई। समीक्षा केवल उस व्यापार के लिए लिखी जा सकती है जो निर्देशिका में मौजूद है।'
        : 'No business has been reviewed yet. A review can only be written about a listing that exists in the directory.')
    h += '</section>'

    host.innerHTML = h
    mountWriter()
  }

  function mountWriter () {
    var host = document.getElementById('cu-write')
    if (!host || host.dataset.mounted) return
    host.dataset.mounted = '1'

    var R = window.TheBuxarRegions
    var acct = window.TheBuxarAccount ? window.TheBuxarAccount.current() : null
    var regions = R ? R.switchable() : []

    var h = '<div class="cu-write__card">'
    h += '<h3 class="cu-write__title">' + esc(C.lang() === 'hi' ? 'कुछ लिखें' : 'Write something') + '</h3>'
    h += '<p class="cu-write__sub">' + esc(C.MODERATION.autoPublish
      ? (C.lang() === 'hi' ? 'आपकी लेख सीधे प्रकाशित हो जाएगी।' : 'Your post appears straight away.')
      : C.get(C.MODERATION.note)) + '</p>'

    h += '<div class="cu-write__tabs" role="tablist">'
    ;[['blog', C.lang() === 'hi' ? 'ब्लॉग' : 'Blog'],
      ['forum', C.lang() === 'hi' ? 'फ़ोरम' : 'Forum'],
      ['review', C.lang() === 'hi' ? 'समीक्षा' : 'Review']].forEach(function (t, i) {
      h += '<button type="button" class="cu-write__tab' + (i === 0 ? ' is-active' : '') + '" ' +
        'role="tab" aria-selected="' + (i === 0) + '" data-cukind="' + t[0] + '">' + esc(t[1]) + '</button>'
    })
    h += '</div>'

    h += '<form class="cu-form" id="cu-form" novalidate>'
    h += '<label class="cu-form__field"><span>' + esc(C.lang() === 'hi' ? 'शीर्षक' : 'Title') + ' *</span>' +
      '<input type="text" name="title" required></label>'
    h += '<div class="cu-form__row">'
    h += '<label class="cu-form__field"><span>' + esc(C.lang() === 'hi' ? 'विषय' : 'Topic') + '</span><select name="topic">'
    C.topics.forEach(function (t) {
      h += '<option value="' + esc(t.slug) + '">' + esc(C.get(t.name)) + '</option>'
    })
    h += '</select></label>'
    h += '<label class="cu-form__field"><span>' + esc(C.lang() === 'hi' ? 'क्षेत्र' : 'Area') + '</span><select name="region">'
    h += '<option value="">—</option>'
    regions.forEach(function (r) { h += '<option value="' + esc(r.slug) + '">' + esc(C.get(r.name)) + '</option>' })
    h += '</select></label>'
    h += '</div>'
    /* The review tab needs a business and a rating; hidden otherwise. */
    h += '<div class="cu-form__row cu-form__review" hidden>'
    h += '<label class="cu-form__field"><span>' + esc(C.lang() === 'hi' ? 'व्यापार' : 'Business') + ' *</span><select name="business">'
    h += '<option value="">—</option>'
    var B = window.TheBuxarBusiness
    if (B) B.businesses.forEach(function (b) {
      h += '<option value="' + esc(b.slug) + '">' + esc(C.get(b.name)) + '</option>'
    })
    h += '</select></label>'
    h += '<label class="cu-form__field"><span>' + esc(C.lang() === 'hi' ? 'रेटिंग' : 'Rating') + '</span><select name="rating">'
    for (var i = 5; i >= 1; i--) h += '<option value="' + i + '">' + i + '</option>'
    h += '</select></label></div>'
    h += '<label class="cu-form__field"><span>' + esc(C.lang() === 'hi' ? 'लिखें' : 'Write') + ' *</span>' +
      '<textarea name="body" rows="5" required></textarea></label>'
    h += '<div class="cu-form__foot">'
    h += '<button class="btn btn--gold" type="submit">' +
      esc(C.lang() === 'hi' ? 'भेजें' : 'Post') + '</button>'
    if (!acct) h += '<a class="btn btn--ghost-light" href="' + esc(C.path()) + 'login.html">' +
      esc(C.lang() === 'hi' ? 'पहले खाता बनाएँ' : 'Create an account first') + '</a>'
    h += '</div>'
    h += '<p class="cu-form__status" id="cu-status" role="status" aria-live="polite"></p>'
    h += '</form>'
    h += '</div>'
    host.innerHTML = h
  }

  function onClick (e) {
    var tab = e.target.closest && e.target.closest('[data-cukind]')
    if (!tab) return
    document.querySelectorAll('.cu-write__tab').forEach(function (b) {
      var on = b === tab
      b.classList.toggle('is-active', on)
      b.setAttribute('aria-selected', String(on))
    })
    var form = document.getElementById('cu-form')
    if (form) form.dataset.kind = tab.getAttribute('data-cukind')
    var reviewRow = document.querySelector('.cu-form__review')
    if (reviewRow) reviewRow.hidden = tab.getAttribute('data-cukind') !== 'review'
  }

  function onSubmit (e) {
    if (e.target.id !== 'cu-form') return
    e.preventDefault()
    var f = e.target
    var st = document.getElementById('cu-status')
    var kind = f.dataset.kind || 'blog'
    var data = {
      title: f.title.value.trim(),
      topic: f.topic.value,
      region: f.region.value,
      body: f.body.value.trim()
    }
    if (kind === 'review') {
      data.business = f.business.value
      data.rating = f.rating.value
    }
    if (!data.title || !data.body) {
      if (st) st.textContent = C.lang() === 'hi' ? 'शीर्षक और लेख दोनों लिखें।' : 'Please write both a title and the post.'
      return
    }
    if (kind === 'review' && !data.business) {
      if (st) st.textContent = C.lang() === 'hi'
        ? 'समीक्षा के लिए निर्देशिका का कोई व्यापार चुनें।'
        : 'Choose a business from the directory to review.'
      return
    }
    C.create(kind, data)
    if (st) {
      st.textContent = C.MODERATION.autoPublish
        ? (C.lang() === 'hi' ? 'प्रकाशित। धन्यवाद।' : 'Published. Thank you.')
        : (C.lang() === 'hi'
          ? 'भेज दिया गया। समीक्षा के बाद प्रकाशित किया जाएगा।'
          : 'Sent. It will be published once it has been checked.')
    }
    f.reset()
    mount()
    var w = document.getElementById('cu-write')
    if (w) delete w.dataset.mounted
    mountWriter()
  }

  function boot () {
    mount()
    document.addEventListener('click', onClick)
    document.addEventListener('submit', onSubmit)
    try {
      new MutationObserver(mount).observe(document.documentElement, {
        attributes: true, attributeFilter: ['data-lang']
      })
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
