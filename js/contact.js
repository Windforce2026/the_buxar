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

  /* Contact form. Compiles the enquiry into a WhatsApp message and hands
     the visitor to WhatsApp, where they can edit before sending. Nothing
     is transmitted from this page and nothing is stored. */
  function initForm () {
    var form = doc.getElementById('ct-form')
    var status = doc.getElementById('ct-form-status')
    if (!form || !status) return

    var TOPIC_LABEL = {
      general: ['General enquiry', 'सामान्य पूछताछ'],
      feedback: ['Feedback', 'प्रतिक्रिया'],
      editorial: ['Editorial contribution', 'संपादकीय योगदान'],
      business: ['Business or seller', 'व्यवसाय या विक्रेता'],
      advertising: ['Advertising', 'विज्ञापन'],
      partnership: ['Partnership', 'साझेदारी'],
      press: ['Press / Media', 'प्रेस / मीडिया'],
      correction: ['Correction request', 'शुद्धि अनुरोध']
    }

    function topicLabel (value) {
      var pair = TOPIC_LABEL[value]
      if (!pair) return value
      return doc.documentElement.getAttribute('data-lang') === 'hi' ? pair[1] : pair[0]
    }

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

      var lines = hi
        ? [
            '*नया संदेश — TheBuxar.com*',
            '',
            '*विषय:* ' + subject.value.trim(),
            '*श्रेणी:* ' + topicLabel(topic.value),
            '*नाम:* ' + name.value.trim(),
            '*ईमेल:* ' + email.value.trim(),
            '',
            message.value.trim()
          ]
        : [
            '*New enquiry — TheBuxar.com*',
            '',
            '*Subject:* ' + subject.value.trim(),
            '*Topic:* ' + topicLabel(topic.value),
            '*Name:* ' + name.value.trim(),
            '*Email:* ' + email.value.trim(),
            '',
            message.value.trim()
          ]

      var url = C.contact.whatsapp + '?text=' + encodeURIComponent(lines.join('\n'))
      status.textContent = hi
        ? 'व्हाट्सऐप खुल रहा है — संदेश भेजने से पहले उसमें संपादन कर सकते हैं।'
        : 'Opening WhatsApp — you can edit the message before you send it.'
      status.className = 'ct-form__status is-ok'
      window.open(url, '_blank', 'noopener')
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
