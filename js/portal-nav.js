/* ------------------------------------------------------------------ */
/* TheBuxar.com — Portal navigation                                    */
/*                                                                     */
/* The client's primary navigation is ten items: News | Business |     */
/* Shop | Food | Tourism | Events | Services | Jobs | Property |       */
/* Classifieds.                                                         */
/*                                                                     */
/* Sections that do not exist yet are rendered with `is-soon` so they   */
/* are visibly marked rather than being dead links. The moment the page */
/* is built, setting `live: true` on the entry is all that is needed.   */
/*                                                                     */
/* This module owns:                                                  */
/*   - the ten-item primary menu, injected into every .nav__menu        */
/*   - the region switcher, which makes js/regions.js visible          */
/*   - re-rendering on language change                                 */
/*                                                                     */
/* Language: bilingual via P.get() at render time.                      */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var P = window.TheBuxarPortal = window.TheBuxarPortal || {}
  window.TheBuxarPortal = P

  function lang () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }
  P.get = function (o) {
    if (typeof o === 'string') return o
    return o ? (o[lang()] || o.en || '') : ''
  }

  /* Path prefix, resolved from the page's own config. */
  var CONFIG = window.TheBuxarConfig || {}
  P.path = typeof CONFIG.path === 'string' ? CONFIG.path : './'

  /* ------------------------------------------------------------------ */
  /* The ten primary destinations                                         */
  /* ------------------------------------------------------------------ */
  P.nav = [
    { key: 'news', label: { en: 'News', hi: 'समाचार' }, href: 'news.html', live: true },
    { key: 'business', label: { en: 'Business', hi: 'व्यापार' }, href: 'business.html', live: true },
    { key: 'shop', label: { en: 'Shop', hi: 'दुकान' }, href: 'marketplace.html', live: true },
    { key: 'food', label: { en: 'Food', hi: 'भोजन' }, href: 'food.html', live: true },
    { key: 'tourism', label: { en: 'Tourism', hi: 'पर्यटन' }, href: 'tourism.html', live: true },
    { key: 'events', label: { en: 'Events', hi: 'आयोजन' }, href: 'news.html#nw-festivals', live: true },
    { key: 'services', label: { en: 'Services', hi: 'सेवाएँ' }, href: 'services.html', live: true },
    { key: 'jobs', label: { en: 'Jobs', hi: 'रोज़गार' }, href: 'jobs.html', live: true },
    { key: 'property', label: { en: 'Property', hi: 'संपत्ति' }, href: 'property.html', live: true },
    { key: 'classifieds', label: { en: 'Classifieds', hi: 'विज्ञापन' }, href: 'classifieds.html', live: true }
  ]

  /* Home and Contact sit outside the ten so they stay on every page. */
  P.utility = [
    { key: 'home', label: { en: 'Home', hi: 'होम' }, href: 'index.html', live: true },
    { key: 'history', label: { en: 'History', hi: 'इतिहास' }, href: 'history.html', live: true },
    { key: 'explore', label: { en: 'Explore', hi: 'खोजें' }, href: 'explore.html', live: true },
    { key: 'trade', label: { en: 'Trade', hi: 'वाणिज्य' }, href: 'trade.html', live: true },
    { key: 'contact', label: { en: 'Contact', hi: 'संपर्क' }, href: 'contact.html', live: true }
  ]

  /* ------------------------------------------------------------------ */
  /* Region switcher                                                     */
  /* ------------------------------------------------------------------ */
  function regionButton () {
    var R = window.TheBuxarRegions
    var cur = R ? R.bySlug(R.current()) : null
    var name = cur ? R.get(cur.name) : 'Buxar'
    var lvl = cur && R.levels[cur.level] ? R.get(R.levels[cur.level]) : ''

    return '<button type="button" class="nav__region" id="nav-region" aria-expanded="false" aria-haspopup="true" ' +
      'aria-label="' + esc(name) + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
      '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>' +
      '<span class="nav__region-name">' + esc(name) + '</span>' +
      '<span class="nav__region-lvl">' + esc(lvl) + '</span>' +
    '</button>'
  }

  function esc (s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }

  function regionPanel () {
    var R = window.TheBuxarRegions
    if (!R) return ''
    var cur = R.current()

    var groups = {}
    ;['state', 'zone', 'district', 'city', 'block'].forEach(function (lvl) {
      var kids = R.list.filter(function (r) { return r.live && r.level === lvl })
      if (kids.length) groups[lvl] = kids
    })

    var html = '<div class="regionpanel" id="region-panel" role="dialog" aria-label="Choose your region" hidden>'
    html += '<div class="regionpanel__inner">'
    html += '<p class="regionpanel__head" data-en="Browsing" data-hi="देख रहे हैं">' +
      (lang() === 'hi' ? 'देख रहे हैं' : 'Browsing') + '</p>'

    Object.keys(groups).forEach(function (lvl) {
      var label = lang() === 'hi' ? R.levels[lvl].hi : R.levels[lvl].en
      html += '<div class="regionpanel__group"><p class="regionpanel__label">' + esc(label) + '</p><div class="regionpanel__items">'
      groups[lvl].forEach(function (r) {
        var on = r.slug === cur
        html += '<button type="button" class="regionpanel__item' + (on ? ' is-active' : '') + '" ' +
          'data-region="' + esc(r.slug) + '"' + (on ? ' aria-current="true"' : '') + '>' +
          esc(R.get(r.name)) + '</button>'
      })
      html += '</div></div>'
    })

    html += '<p class="regionpanel__note" data-en="More regions are on the way — Buxaur, Ara, Patna and the remaining Buxar blocks are already built into the platform." data-hi="और क्षेत्र जल्द आ रहे हैं — बक्सौर, आरा, पटना और शेष बक्सर प्रखंड पहले से ही मंच में जोड़े जा चुके हैं।">More regions are on the way — Buxaur, Ara, Patna and the remaining Buxar blocks are already built into the platform.</p>'
    html += '</div></div>'
    return html
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */
  function isActive (href) {
    var here = window.location.pathname.split('/').pop() || 'index.html'
    return String(href).split('#')[0].split('?')[0] === here
  }

  function navHtml () {
    return P.nav.map(function (n) {
      var cls = 'nav__link' + (isActive(n.href) ? ' is-active' : '') + (n.live ? '' : ' is-soon')
      return '<a href="' + esc(P.path + n.href) + '" class="' + cls + '"' +
        (n.live ? '' : ' data-soon="1"') +
        ' data-en="' + esc(P.get(n.label)) + '" data-hi="' + esc(n.label.hi) + '">' +
        esc(P.get(n.label)) +
        (n.live ? '' : '<span class="nav__soon-dot" aria-hidden="true"></span>') +
      '</a>'
    }).join('')
  }

  function render () {
    var menu = document.querySelector('.nav__menu')
    if (menu) menu.innerHTML = navHtml()

    var actions = document.querySelector('.nav__actions')
    if (actions && !document.getElementById('nav-region')) {
      actions.insertAdjacentHTML('afterbegin', regionButton())
      document.body.insertAdjacentHTML('beforeend', regionPanel())
    }

    // refresh the current-region label
    var btn = document.getElementById('nav-region')
    var R = window.TheBuxarRegions
    if (btn && R) {
      var cur = R.bySlug(R.current())
      var nameEl = btn.querySelector('.nav__region-name')
      var lvlEl = btn.querySelector('.nav__region-lvl')
      if (nameEl) nameEl.textContent = cur ? R.get(cur.name) : 'Buxar'
      if (lvlEl && cur && R.levels[cur.level]) lvlEl.textContent = R.get(R.levels[cur.level])
    }
    var panel = document.getElementById('region-panel')
    if (panel && R) {
      var cur2 = R.current()
      panel.querySelectorAll('[data-region]').forEach(function (b) {
        var on = b.getAttribute('data-region') === cur2
        b.classList.toggle('is-active', on)
        if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current')
      })
    }
  }

  /* ------------------------------------------------------------------ */
  /* Behaviour                                                          */
  /* ------------------------------------------------------------------ */
  function toggleRegion (open) {
    var btn = document.getElementById('nav-region')
    var panel = document.getElementById('region-panel')
    if (!btn || !panel) return
    var next = open === undefined ? panel.hidden : open
    panel.hidden = !next
    btn.setAttribute('aria-expanded', String(next))
    btn.classList.toggle('is-open', next)
  }

  function onClick (e) {
    var t = e.target

    var regionPick = t.closest ? t.closest('[data-region]') : null
    if (regionPick) {
      var R = window.TheBuxarRegions
      if (R) {
        R.set(regionPick.getAttribute('data-region'))
        var url = new URL(window.location.href)
        url.searchParams.set('region', regionPick.getAttribute('data-region'))
        window.location.href = url.toString()
      }
      return
    }

    if (t.closest && t.closest('#nav-region')) { toggleRegion(); return }

    // A "soon" link must not look like it works.
    var soon = t.closest ? t.closest('[data-soon]') : null
    if (soon) {
      e.preventDefault()
      announce(
        window.TheBuxarPortal.get({ en: 'This section is being built.', hi: 'यह खंड बनाया जा रहा है।' })
      )
      return
    }

    if (t.closest && t.closest('#region-panel') && t === e.target) toggleRegion(false)
  }

  function onKey (e) {
    if (e.key === 'Escape') toggleRegion(false)
  }

  function announce (msg) {
    var live = document.getElementById('portal-live')
    if (!live) {
      live = document.createElement('div')
      live.id = 'portal-live'
      live.setAttribute('role', 'status')
      live.setAttribute('aria-live', 'polite')
      live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap'
      document.body.appendChild(live)
    }
    live.textContent = msg
  }

  function boot () {
    render()
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    try {
      new MutationObserver(render).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-lang']
      })
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()