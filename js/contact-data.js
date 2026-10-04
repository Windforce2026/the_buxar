/* ------------------------------------------------------------------ */
/* TheBuxar.com — Contact page data (pure vanilla, no deps)          */
/*                                                                     */
/* Only verified contact details live here. The phone field is        */
/* deliberately null until a real number is published.                */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var lang = function () {
    try { return document.documentElement.getAttribute('data-lang') === 'hi' ? 'hi' : 'en' } catch (e) { return 'en' }
  }
  var C = window.TheBuxarContact = window.TheBuxarContact || {}

  C.get = function (obj) {
    if (typeof obj === 'string') return obj
    return obj ? (obj[lang()] || obj.en || '') : ''
  }

  C.path = ''

  function url (p) { return C.path + p }

  var ICON = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'
  C.icons = {
    mail: '<svg ' + ICON + '><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    pin: '<svg ' + ICON + '><path d="M12 21s6-5.4 6-9.5A6 6 0 0 0 6 11.5C6 15.6 12 21 12 21Z"/><circle cx="12" cy="11" r="2.2"/></svg>',
    clock: '<svg ' + ICON + '><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    phone: '<svg ' + ICON + '><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>'
  }

  /* Verified contact details. Only email and location are real. */
  C.contact = {
    email: 'hello@thebuxar.com',
    location: { en: 'Buxar, Bihar · India', hi: 'बक्सर, बिहार · भारत' },
    phone: null
  }

  /* Hero photograph — a real Buxar ghat image. */
  C.images = {
    hero: 'assets/hero-buxar-sunset.jpg'
  }

  C.imageUrl = function (p) { return p ? url(p) : '' }
})()
