/* ------------------------------------------------------------------ */
/* TheBuxar.com — Contact page behaviours (pure vanilla, no deps)    */
/*                                                                     */
/* Renders the hero photograph and wires the contact form. The form   */
/* is visual only: it validates and reports locally, matching the    */
/* site's footer newsletter pattern. No message is sent or stored.    */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var C = window.TheBuxarContact
  if (!C) return

  var doc = document

  var CONFIG = window.TheBuxarConfig || {}
  C.path = typeof CONFIG.path === 'string' ? CONFIG.path : ''

  var reduceMotion = (function () {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) { return false }
  })()

  function esc (s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }

  /* Hero photograph. Decorative only. */
  function renderHeroPhoto (host) {
    var src = C.imageUrl(C.images.hero)
    if (!src) { host.innerHTML = ''; return }
    host.innerHTML = '<img src="' + esc(src) + '" alt="" fetchpriority="high" decoding="async" />'
  }

  /* Contact form. Visual only — validates and reports locally. */
  function initForm () {
    var form = doc.getElementById('ct-form')
    var status = doc.getElementById('ct-form-status')
    if (!form || !status) return

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var hi = doc.documentElement.getAttribute('data-lang') === 'hi'
      var name = form.querySelector('[name="name"]')
      var email = form.querySelector('[name="email"]')
      var topic = form.querySelector('[name="topic"]')
      var subject = form.querySelector('[name="subject"]')
      var message = form.querySelector('[name="message"]')

      var valid = name && name.value.trim() && email && email.checkValidity() &&
        topic && topic.value && subject && subject.value.trim() && message && message.value.trim()

      if (!valid) {
        status.textContent = hi
          ? 'कृपया सभी आवश्यक फ़ील्ड भरें और एक मान्य ईमेल डालें।'
          : 'Please complete every required field and enter a valid email.'
        status.className = 'ct-form__status is-warn'
        return
      }

      status.textContent = hi
        ? 'धन्यवाद! आपका संदेश तैयार है। हम जल्द ही ' + C.contact.email + ' या व्हाट्सऐप (' + C.contact.phone + ') पर जवाब देंगे।'
        : 'Thank you! Your message is ready. We will respond shortly at ' + C.contact.email + ' or WhatsApp (' + C.contact.phone + ').'
      status.className = 'ct-form__status is-ok'
      form.reset()
    })
  }

  /* Generic reveal for injected markup (mirrors sections.js). */
  function revealNow (scope) {
    var els = Array.from((scope || doc).querySelectorAll('.reveal'))
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in') })
      return
    }
    if (!doc.__ctObs) {
      doc.__ctObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            doc.__ctObs.unobserve(entry.target)
          }
        })
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
    }
    els.forEach(function (el) { doc.__ctObs.observe(el) })
  }

  function renderMounts () {
    var hosts = doc.querySelectorAll('[data-ct]')
    for (var i = 0; i < hosts.length; i++) {
      var host = hosts[i]
      if (host.getAttribute('data-ct') === 'heroPhoto') renderHeroPhoto(host)
    }
    revealNow(doc)
  }

  function boot () {
    renderMounts()
    initForm()
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
