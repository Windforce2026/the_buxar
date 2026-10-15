/* ------------------------------------------------------------------ */
/* TheBuxar.com — Account, tier and admin UI                          */
/*                                                                     */
/* Renders whichever account surface the current page asks for:         */
/*                                                                     */
/*   [data-au="tiers"]      the Basic / Premium comparison             */
/*   [data-au="signin"]     sign-in form                               */
/*   [data-au="register"]   registration form, with tier choice        */
/*   [data-au="me"]         the signed-in header                       */
/*   [data-au="dashboard"]  tier, permissions and drafts               */
/*   [data-au="admin"]      dashboard header                           */
/*   [data-au="adminbody"]  the dashboard's panels                     */
/*                                                                     */
/* The rules come from js/account.js; this file only draws them and     */
/* collects input. Nothing here invents a permission or a price.        */
/*                                                                     */
/* Language: bilingual.                                                 */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var A = window.TheBuxarAccount
  if (!A) return

  function lang () { return A.lang() }
  function esc (s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }
  function t (o) { return A.t(o) }
  function path () { return A.path ? A.path() : './' }
  function host (n) { return document.querySelector('[data-au="' + n + '"]') }

  /* Set when an account is created, so the confirmation survives the
     re-render that replaces the registration form. */
  var confirmed = ''

  /* ------------------------------------------------------------------ */
  /* Tiers                                                              */
  /* ------------------------------------------------------------------ */
  function tiersHtml () {
    var h = '<div class="au-hero__inner">'
    h += '<p class="au-hero__label">' + esc(lang() === 'hi' ? 'सूचीकरण' : 'Listings') + '</p>'
    h += '<h1 class="au-hero__title">' +
      esc(lang() === 'hi' ? 'अपना व्यापास सूचीबद्ध करें' : 'List your business on TheBuxar') + '</h1>'
    h += '<p class="au-hero__sub">' + esc(lang() === 'hi'
      ? 'मुफ़्त बेसिक या प्रीमियम — दोनों में आपको खोजा जा सकता है। अंतर यह है कि कॉल किसे मिलती है।'
      : 'Free Basic, or Premium. Either way people can find you. The difference is who gets the call.') + '</p>'
    h += '</div>'

    h += '<div class="au-tiers">'
    A.tierList().forEach(function (tr) {
      var f = tr.features[lang()] || tr.features.en
      var lim = tr.limits
      h += '<article class="au-tier' + (tr.key === 'premium' ? ' au-tier--featured' : '') + '">'
      if (tr.key === 'premium') {
        h += '<p class="au-tier__flag">' + esc(lang() === 'hi' ? 'सबसे अधिक दिखाई देने वाला' : 'Most visible') + '</p>'
      }
      h += '<h2 class="au-tier__name">' + esc(t(tr.name)) + '</h2>'
      h += '<p class="au-tier__tag">' + esc(t(tr.tagline)) + '</p>'
      h += '<p class="au-tier__price">' + esc(t(tr.price)) +
        ' <span class="au-tier__period">' + esc(t(tr.period)) + '</span></p>'
      h += '<p class="au-tier__blurb">' + esc(t(tr.blurb)) + '</p>'
      h += '<ul class="au-tier__list">'
      f.forEach(function (x) { h += '<li>' + esc(x) + '</li>' })
      h += '</ul>'
      h += '<p class="au-tier__limits">' + esc(lang() === 'hi'
        ? lim.listings + ' तक सूची · ' + lim.photos + ' तस्वीरें' + (lim.priority ? ' · प्राथमिक स्थान' : '')
        : lim.listings + (lim.listings === 1 ? ' listing' : ' listings') + ' · ' + lim.photos +
          (lim.photos === 1 ? ' photo' : ' photos') + (lim.priority ? ' · priority placement' : '')) + '</p>'
      h += '</article>'
    })
    h += '</div>'
    return h
  }

  /* ------------------------------------------------------------------ */
  /* Forms                                                              */
  /* ------------------------------------------------------------------ */
  function signinHtml () {
    var h = '<div class="au-card__inner">'
    h += '<h2 class="au-card__title">' + esc(lang() === 'hi' ? 'साइन इन' : 'Sign in') + '</h2>'
    h += '<p class="au-card__sub">' + esc(lang() === 'hi'
      ? 'इसी ब्राउज़र में बना खाता।'
      : 'An account created in this browser.') + '</p>'
    h += '<form class="au-form" id="au-signin" novalidate>'
    h += '<label class="au-form__field"><span>' + esc(lang() === 'hi' ? 'ईमेल' : 'Email') + '</span>' +
      '<input type="email" name="email" autocomplete="email" required></label>'
    h += '<label class="au-form__field"><span>' + esc(lang() === 'hi' ? 'पासवर्ड' : 'Password') + '</span>' +
      '<input type="password" name="password" autocomplete="current-password"></label>'
    h += '<button class="btn btn--gold" type="submit">' + esc(lang() === 'hi' ? 'साइन इन' : 'Sign in') + '</button>'
    h += '<p class="au-form__status" id="au-signin-status" role="status" aria-live="polite"></p>'
    h += '</form>'
    h += '</div>'
    return h
  }

  function registerHtml () {
    var acct = A.current()

    /* Already signed in — show the account instead of a second form. */
    if (acct) {
      var tr = A.tier(acct.tier)
      var h = '<div class="au-card__inner">'
      h += '<h2 class="au-card__title">' + esc(lang() === 'hi' ? 'आप साइन इन हैं' : 'You are signed in') + '</h2>'
      /* The confirmation has to survive the re-render, otherwise the one
         moment the reader is told "welcome" is the moment it vanishes. */
      if (confirmed) h += '<p class="au-card__confirm" id="au-register-status">' + esc(confirmed) + '</p>'
      h += '<p class="au-card__sub">' + esc(acct.name) + ' · ' + esc(acct.email) + '</p>'
      h += '<p class="au-card__tier">' + esc(t(tr.name)) + '</p>'
      h += '<div class="au-card__acts">'
      h += '<a class="btn btn--gold" href="' + esc(path()) + 'account.html">' +
        esc(lang() === 'hi' ? 'मेरा खाता' : 'My account') + '</a>'
      h += '<button class="btn btn--ghost-light" type="button" id="au-signout">' +
        esc(lang() === 'hi' ? 'साइन आउट' : 'Sign out') + '</button>'
      h += '</div>'
      h += '</div>'
      return h
    }

    var r = '<div class="au-card__inner">'
    r += '<h2 class="au-card__title">' + esc(lang() === 'hi' ? 'खाता बनाएँ' : 'Create an account') + '</h2>'
    r += '<p class="au-card__sub">' + esc(lang() === 'hi'
      ? 'बेसिक मुफ़्त है। प्रीमियम चुनें तो आपकी सूची पहले दिखेगी।'
      : 'Basic is free. Choose Premium and your listing is placed first.') + '</p>'
    r += '<form class="au-form" id="au-register" novalidate>'

    r += '<label class="au-form__field"><span>' + esc(lang() === 'hi' ? 'नाम' : 'Name') + ' *</span>' +
      '<input type="text" name="name" autocomplete="name" required></label>'
    r += '<label class="au-form__field"><span>' + esc(lang() === 'hi' ? 'ईमेल' : 'Email') + ' *</span>' +
      '<input type="email" name="email" autocomplete="email" required></label>'
    r += '<label class="au-form__field"><span>' + esc(lang() === 'hi' ? 'पासवर्ड' : 'Password') + ' *</span>' +
      '<input type="password" name="password" autocomplete="new-password" minlength="8" required>' +
      '<small class="au-form__hint">' + esc(lang() === 'hi' ? 'कम से कम 8 अक्षर' : 'At least 8 characters') + '</small></label>'

    r += '<fieldset class="au-form__tierpick"><legend>' +
      esc(lang() === 'hi' ? 'टीयर चुनें' : 'Choose your tier') + '</legend>'
    A.tierList().forEach(function (tr, i) {
      r += '<label class="au-pick' + (i === 0 ? ' is-on' : '') + '">'
      r += '<input type="radio" name="tier" value="' + esc(tr.key) + '"' + (i === 0 ? ' checked' : '') + '>'
      r += '<span class="au-pick__body">'
      r += '<span class="au-pick__name">' + esc(t(tr.name)) + '</span>'
      r += '<span class="au-pick__price">' + esc(t(tr.price)) + '</span>'
      r += '<span class="au-pick__tag">' + esc(t(tr.tagline)) + '</span>'
      r += '</span></label>'
    })
    r += '</fieldset>'

    r += '<button class="btn btn--gold" type="submit">' + esc(lang() === 'hi' ? 'खाता बनाएँ' : 'Create account') + '</button>'
    r += '<p class="au-form__status" id="au-register-status" role="status" aria-live="polite"></p>'
    r += '</form>'
    r += '</div>'
    return r
  }

  /* ------------------------------------------------------------------ */
  /* Signed-in header + dashboard                                       */
  /* ------------------------------------------------------------------ */
  function meHtml () {
    var acct = A.current()
    if (!acct) {
      var h = '<div class="au-hero__inner">'
      h += '<p class="au-hero__label">' + esc(lang() === 'hi' ? 'खाता' : 'Account') + '</p>'
      h += '<h1 class="au-hero__title">' + esc(lang() === 'hi' ? 'साइन इन करें' : 'Sign in to continue') + '</h1>'
      h += '<p class="au-hero__sub">' + esc(lang() === 'hi'
        ? 'अपनी सूची देखने, संपादित करने या टीयर बदलने के लिए साइन इन करें।'
        : 'Sign in to see your listings, edit them, or change your tier.') + '</p>'
      h += '<div class="au-hero__acts">'
      h += '<a class="btn btn--gold" href="' + esc(path()) + 'login.html">' +
        esc(lang() === 'hi' ? 'साइन इन / खाता बनाएँ' : 'Sign in or register') + '</a>'
      h += '</div></div>'
      return h
    }

    var tr = A.tier(acct.tier)
    var h = '<div class="au-hero__inner">'
    h += '<p class="au-hero__label">' + esc(lang() === 'hi' ? 'मेरा खाता' : 'My account') + '</p>'
    h += '<h1 class="au-hero__title">' + esc(acct.name) + '</h1>'
    h += '<p class="au-hero__sub">' + esc(acct.email) + ' · ' +
      esc(lang() === 'hi' ? 'सदस्य बने' : 'joined') + ' ' +
      esc(acct.joined ? acct.joined.slice(0, 10) : '—') + '</p>'
    h += '<p class="au-hero__tier' + (acct.tier === 'premium' ? ' is-premium' : '') + '">' +
      esc(t(tr.name)) + ' · ' + esc(t(tr.price)) + '</p>'
    h += '<div class="au-hero__acts">'
    if (acct.role === 'admin') {
      h += '<a class="btn btn--ghost-light" href="' + esc(path()) + 'admin.html">' +
        esc(lang() === 'hi' ? 'एडमिन' : 'Admin') + '</a>'
    }
    h += '<button class="btn btn--ghost-light" type="button" id="au-signout">' +
      esc(lang() === 'hi' ? 'साइन आउट' : 'Sign out') + '</button>'
    h += '</div></div>'
    return h
  }

  function dashboardHtml () {
    var acct = A.current()
    if (!acct) {
      return '<div class="au-empty"><p>' +
        esc(lang() === 'hi' ? 'पहले साइन इन करें।' : 'Sign in first.') + '</p></div>'
    }
    var tr = A.tier(acct.tier)
    var C = window.TheBuxarCommunity
    var drafts = C ? ['blog', 'forum', 'review'].reduce(function (a, k) { return a + (C.drafts(k) || []).length }, 0) : 0

    var h = '<div class="au-panels">'

    /* --- tier and what it permits --- */
    h += '<section class="au-panel">'
    h += '<h2 class="au-panel__title">' + esc(lang() === 'hi' ? 'आपका टीयर' : 'Your tier') + '</h2>'
    h += '<div class="au-panel__body">'
    h += '<ul class="au-perm">'
    var f = tr.features[lang()] || tr.features.en
    f.forEach(function (x) { h += '<li class="au-perm__on">' + esc(x) + '</li>' })
    /* And what the other tier would add, so upgrading has a visible
       reason rather than a sales pitch. The upgrade case is written once
       on the tier itself rather than inferred by comparing feature
       strings, which would be brittle and would drift. */
    var other = A.tierList().filter(function (x) { return x.key !== tr.key })[0]
    if (other && other.adds) {
      var adds = other.adds[lang()] || other.adds.en
      h += '<li class="au-perm__more">' + esc(lang() === 'hi'
        ? t(other.name) + ' में अतिरिक्त:'
        : t(other.name) + ' would add:') + '</li>'
      adds.forEach(function (x) { h += '<li class="au-perm__add">' + esc(x) + '</li>' })
    }
    if (tr.excludes) {
      h += '<li class="au-perm__more">' + esc(lang() === 'hi' ? 'इसमें शामिल नहीं:' : 'Not included:') + '</li>'
      ;(tr.excludes[lang()] || tr.excludes.en).forEach(function (x) {
        h += '<li class="au-perm__add">' + esc(x) + '</li>'
      })
    }
    h += '</ul>'
    h += '</div></section>'

    /* --- listings --- */
    h += '<section class="au-panel">'
    h += '<h2 class="au-panel__title">' + esc(lang() === 'hi' ? 'आपकी सूचियाँ' : 'Your listings') + '</h2>'
    h += '<div class="au-panel__body">'
    var mine = acct.listings || []
    if (mine.length) {
      h += '<ul class="au-lists">'
      mine.forEach(function (l) {
        h += '<li><a href="' + esc(l.href || '#') + '">' + esc(l.title) + '</a></li>'
      })
      h += '</ul>'
    } else {
      h += '<p class="au-panel__empty">' + esc(lang() === 'hi'
        ? 'अभी कोई सूची नहीं बनी। नीचे से पहली सूची जोड़ें।'
        : 'No listings yet. Add your first one below.') + '</p>'
      h += '<div class="au-panel__acts">'
      h += '<a class="btn btn--gold" href="' + esc(path()) + 'business/add.html">' +
        esc(lang() === 'hi' ? 'व्यापास जोड़ें' : 'Add a business') + '</a>'
      h += '<a class="btn btn--ghost-light" href="' + esc(path()) + 'food.html">' +
        esc(lang() === 'hi' ? 'रेस्तराँ जोड़ें' : 'Add a restaurant') + '</a>'
      h += '</div>'
    }
    h += '</div></section>'

    /* --- community drafts --- */
    h += '<section class="au-panel">'
    h += '<h2 class="au-panel__title">' + esc(lang() === 'hi' ? 'सामुदायिक' : 'Community') + '</h2>'
    h += '<div class="au-panel__body">'
    h += '<p class="au-panel__note">' + esc(lang() === 'hi'
      ? drafts + ' लेख इस ब्राउज़र में लिखे गए हैं और समीक्षा की प्रतीक्षा में हैं।'
      : drafts + ' post(s) written in this browser and awaiting review.') + '</p>'
    h += '<div class="au-panel__acts">'
    h += '<a class="btn btn--ghost-light" href="' + esc(path()) + 'community.html">' +
      esc(lang() === 'hi' ? 'सामुदायिक हब' : 'Community hub') + '</a>'
    h += '</div>'
    h += '</div></section>'

    h += '</div>'
    return h
  }

  /* ------------------------------------------------------------------ */
  /* Admin                                                              */
  /*                                                                     */
  /* Reports what is on the site, not what ought to be. A zero is shown   */
  /* as a zero and named, because the number that should drive the next   */
  /* decision is the one that is missing.                                 */
  /* ------------------------------------------------------------------ */
  function adminHtml () {
    var s = A.stats()
    var acct = A.current()

    var h = '<div class="au-hero__inner">'
    h += '<p class="au-hero__label">' + esc(lang() === 'hi' ? 'प्रशासन' : 'Administration') + '</p>'
    h += '<h1 class="au-hero__title">' + esc(lang() === 'hi' ? 'कंट्रोल पैनल' : 'Control panel') + '</h1>'
    h += '<p class="au-hero__sub">' + esc(lang() === 'hi'
      ? 'यह पैनल वही गिनता है जो साइट अपने आप दिखाता है — कुछ भी अनुमान नहीं।'
      : 'These are the counts the site reports for itself. Nothing here is estimated.') + '</p>'
    if (!acct || acct.role !== 'admin') {
      h += '<p class="au-warn">' + esc(lang() === 'hi'
        ? 'यह बिल्ड किसी भी अतिथि को दिखाता है। किसी admin खाते तक पहुँच सुरक्षित रखने के लिए असली सर्वर चाहिए।'
        : 'This build shows the panel to any visitor. Restricting it to an admin account needs a real server.') + '</p>'
    }
    h += '</div>'
    return h
  }

  function statRow (label, value, note) {
    var h = '<div class="au-stat">'
    h += '<span class="au-stat__n">' + esc(String(value)) + '</span>'
    h += '<span class="au-stat__l">' + esc(label) + '</span>'
    if (note) h += '<span class="au-stat__note">' + esc(note) + '</span>'
    h += '</div>'
    return h
  }

  function adminBodyHtml () {
    var s = A.stats()
    var C = window.TheBuxarCommunity
    var pending = C ? C.pending() : []
    var L = window.TheBuxarListings

    var h = '<div class="au-panels">'

    /* --- listings --- */
    h += '<section class="au-panel au-panel--wide">'
    h += '<h2 class="au-panel__title">' + esc(lang() === 'hi' ? 'सूचियाँ' : 'Listings') + '</h2>'
    h += '<div class="au-stats">'
    h += statRow(lang() === 'hi' ? 'निर्देशिका' : 'Directory', s.listings.business, lang() === 'hi' ? 'सरकारी कार्यालय' : 'government offices')
    h += statRow(lang() === 'hi' ? 'बाज़ार' : 'Marketplace', s.listings.market)
    h += statRow(lang() === 'hi' ? 'भोजन' : 'Food', s.listings.food)
    h += statRow(lang() === 'hi' ? 'सेवाएँ' : 'Services', s.listings.services)
    h += statRow(lang() === 'hi' ? 'रोज़गार' : 'Jobs', s.listings.jobs)
    h += statRow(lang() === 'hi' ? 'संपत्ति' : 'Property', s.listings.property)
    h += statRow(lang() === 'hi' ? 'विज्ञापन' : 'Classifieds', s.listings.classifieds)
    h += statRow(lang() === 'hi' ? 'सामुदायिक' : 'Community', s.listings.community)
    h += '</div>'
    h += '<p class="au-panel__note">' + esc(lang() === 'hi'
      ? 'केवल निर्देशिका में वास्तविक रिकॉर्ड हैं। शेष सभी खाली हैं — यह जानबूझकर है।'
      : 'Only the directory holds real records. Every other vertical is empty, deliberately. Those are the numbers the next decision should be based on.') + '</p>'
    h += '</section>'

    /* --- content --- */
    h += '<section class="au-panel au-panel--wide">'
    h += '<h2 class="au-panel__title">' + esc(lang() === 'hi' ? 'सामग्री' : 'Content') + '</h2>'
    h += '<div class="au-stats">'
    h += statRow(lang() === 'hi' ? 'प्रकाशित खबरें' : 'Published articles', s.content.articles)
    h += statRow(lang() === 'hi' ? 'आयोजन' : 'Events', s.content.events)
    h += statRow(lang() === 'hi' ? 'पर्यटन स्थल' : 'Tourist places', s.content.places)
    h += statRow(lang() === 'hi' ? 'स्थानीय खाते' : 'Local accounts', s.accounts)
    h += '</div>'
    if (s.content.placeholders > 0) {
      h += '<p class="au-panel__note">' + esc(lang() === 'hi'
        ? s.content.placeholders + ' डेमो खबरें फ़ाइल में हैं लेकिन कहीं नहीं दिखतीं — यह जानबूझकर है।'
        : s.content.placeholders + (s.content.placeholders === 1
          ? ' demo article sits in the data file but is shown nowhere. That is deliberate.'
          : ' demo articles sit in the data file but are shown nowhere. That is deliberate.')) + '</p>'
    }
    h += '</section>'

    /* --- moderation --- */
    h += '<section class="au-panel au-panel--wide">'
    h += '<h2 class="au-panel__title">' + esc(lang() === 'hi' ? 'नियमन' : 'Moderation') + '</h2>'
    if (pending.length) {
      h += '<ul class="au-queue">'
      pending.forEach(function (p) {
        h += '<li><span class="au-queue__kind">' + esc(p.kind) + '</span>' +
          '<span class="au-queue__title">' + esc(t(p.title)) + '</span>' +
          '<span class="au-queue__meta">' + esc(t(p.author) || '—') + (p.date ? ' · ' + esc(p.date) : '') + '</span></li>'
      })
      h += '</ul>'
    } else {
      h += '<p class="au-panel__empty">' + esc(lang() === 'hi'
        ? 'किसी सदस्य का कोई लेख समीक्षा की प्रतीक्षा में नहीं है।'
        : 'No member post is waiting for review.') + '</p>'
    }
    h += '<p class="au-panel__note">' + esc(lang() === 'hi'
      ? 'सवाल खुला है — फ़ोरम और समीक्षा कौन संभालेगा? तब तक हर लेख जाँच के बाद ही प्रकाशित होता है।'
      : 'Open question: who moderates forums and reviews? Until that is answered every post is held rather than published.') + '</p>'
    h += '</section>'

    /* --- coverage --- */
    h += '<section class="au-panel au-panel--wide">'
    h += '<h2 class="au-panel__title">' + esc(lang() === 'hi' ? 'क्षेत्र और श्रेणी' : 'Regions and categories') + '</h2>'
    h += '<div class="au-stats">'
    h += statRow(lang() === 'hi' ? 'मॉडल किए गए क्षेत्र' : 'Regions modelled', s.coverage.regionsModelled)
    h += statRow(lang() === 'hi' ? 'चालू क्षेत्र' : 'Regions live', s.coverage.regionsLive)
    h += statRow(lang() === 'hi' ? 'निर्देशिका श्रेणियाँ' : 'Directory categories', s.coverage.categories)
    h += '</div>'
    h += '<p class="au-panel__note">' + esc(lang() === 'hi'
      ? 'बाकी क्षेत्र पहले से मॉडल हैं — चालू करने के लिए एक flag बदलना है।'
      : 'The remaining regions are already modelled. Switching one on is a single flag.') + '</p>'
    h += '</section>'

    h += '</div>'
    return h
  }

  /* ------------------------------------------------------------------ */
  /* Behaviour                                                          */
  /* ------------------------------------------------------------------ */
  function render () {
    var map = {
      tiers: tiersHtml,
      signin: signinHtml,
      register: registerHtml,
      me: meHtml,
      dashboard: dashboardHtml,
      admin: adminHtml,
      adminbody: adminBodyHtml
    }
    Object.keys(map).forEach(function (n) {
      var el = host(n)
      if (el) el.innerHTML = map[n]()
    })
  }

  function say (id, msg) {
    var el = document.getElementById(id)
    if (el) el.textContent = msg
  }

  function onSubmit (e) {
    var f = e.target

    if (f.id === 'au-signin') {
      e.preventDefault()
      var r = A.signIn(f.email.value, f.password.value)
      if (!r.ok) { say('au-signin-status', A.t(r.error)); return }
      render()
      window.location.href = A.path ? A.path() + 'account.html' : 'account.html'
      return
    }

    if (f.id === 'au-register') {
      e.preventDefault()
      var tier = (f.querySelector('input[name="tier"]:checked') || {}).value || 'basic'
      var res = A.register(f.name.value, f.email.value, f.password.value, { tier: tier })
      if (!res.ok) { say('au-register-status', A.t(res.error)); return }
      confirmed = lang() === 'hi'
        ? 'खाता बन गया। ' + A.t(A.tier(tier).name) + ' टीयर चुना गया। स्वागत है।'
        : 'Account created on the ' + A.t(A.tier(tier).name) + ' tier. Welcome.'
      render()
    }
  }

  function onClick (e) {
    /* Tier picker highlight */
    var radio = e.target.closest && e.target.closest('.au-pick input[type="radio"]')
    if (radio) {
      document.querySelectorAll('.au-pick').forEach(function (p) {
        p.classList.toggle('is-on', p.contains(radio))
      })
      return
    }
    if (e.target.closest && e.target.closest('#au-signout')) {
      A.signOut()
      confirmed = ''
      var back = window.location.pathname.indexOf('account.html') !== -1 ? 'login.html' : 'index.html'
      window.location.href = A.path ? A.path() + back : back
    }
  }

  function boot () {
    render()
    document.addEventListener('submit', onSubmit)
    document.addEventListener('click', onClick)
    try {
      new MutationObserver(render).observe(document.documentElement, {
        attributes: true, attributeFilter: ['data-lang']
      })
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
