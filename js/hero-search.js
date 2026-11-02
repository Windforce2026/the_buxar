/* ------------------------------------------------------------------ */
/* TheBuxar.com — Homepage hero search                                */
/*                                                                     */
/* The hero box is the front door: one query, one location, and it     */
/* hands off to the unified search page. The location list is built    */
/* from the region registry, so it can never offer a place the rest of */
/* the site does not know about.                                       */
/*                                                                     */
/*   query + location -> search.html?q=…&loc=…                         */
/*   query only       -> search.html?q=…                               */
/*   location only    -> search.html?loc=…                             */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  function lang () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }
  function get (o) {
    if (typeof o === 'string') return o
    return o ? (o[lang()] || o.en || '') : ''
  }
  function esc (s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  }

  var ALL = { en: 'All Buxar', hi: 'पूरा बक्सर' }

  /* Cities and blocks inside the Buxar district, in registry order. */
  function places () {
    var R = window.TheBuxarRegions
    if (!R || !R.list) return []
    return R.list.filter(function (r) {
      return r.live && (r.level === 'city' || r.level === 'block')
    })
  }

  function fill (select) {
    if (!select) return
    var current = select.value
    var options = '<option value="" data-en="' + esc(ALL.en) + '" data-hi="' + esc(ALL.hi) + '">' + esc(get(ALL)) + '</option>'
    places().forEach(function (r) {
      var name = get(r.name)
      options += '<option value="' + esc(r.slug) + '" data-en="' + esc(name) + '" data-hi="' + esc(r.name.hi || name) + '">' + esc(name) + '</option>'
    })
    select.innerHTML = options

    /* Keep the region the reader is already browsing, if it is listed. */
    var R = window.TheBuxarRegions
    var wanted = current
    if (!wanted && R && R.current) {
      var cur = R.bySlug(R.current())
      if (cur && (cur.level === 'city' || cur.level === 'block')) wanted = cur.slug
    }
    if (wanted && select.querySelector('option[value="' + wanted + '"]')) select.value = wanted
  }

  function go (q, loc) {
    var params = []
    if (q) params.push('q=' + encodeURIComponent(q))
    if (loc) params.push('loc=' + encodeURIComponent(loc))
    window.location.href = './search.html' + (params.length ? '?' + params.join('&') : '')
  }

  function boot () {
    var form = document.getElementById('hero-search')
    if (!form) return
    var input = document.getElementById('hero-q')
    var select = document.getElementById('hero-loc')

    fill(select)

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var q = input ? input.value.trim() : ''
      var loc = select ? select.value : ''
      if (!q && !loc) {
        if (input) input.focus()
        return
      }
      go(q, loc)
    })

    /* Choosing a place with an empty box should browse that place
       rather than do nothing. */
    if (select) {
      select.addEventListener('change', function () {
        if (input && input.value.trim()) return
        if (select.value) go('', select.value)
      })
    }

    /* The language toggle rewrites [data-en] elements, including the
       options built above; refresh the list so the placeholder stays
       correct too. */
    try {
      new MutationObserver(function () { fill(select) }).observe(document.documentElement, {
        attributes: true, attributeFilter: ['data-lang']
      })
    } catch (err) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
