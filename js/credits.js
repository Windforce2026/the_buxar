/* ------------------------------------------------------------------ */
/* TheBuxar.com — Image credits (pure vanilla, no dependencies)        */
/*                                                                     */
/* Renders the two provenance registers on /credits.html:              */
/*   window.TheBuxarMarketCredits  (js/market-image-credits.js)        */
/*   window.TheBuxarHeritageCredits (js/heritage-image-credits.js)     */
/*                                                                     */
/* Nothing here invents provenance. If an entry is missing a source    */
/* or a licence, it is left blank rather than guessed.                 */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  var doc = document
  var CONFIG = window.TheBuxarConfig || {}
  var base = typeof CONFIG.path === 'string' ? CONFIG.path : ''

  var UI = {
    marketplaceTitle: { en: 'Marketplace & Commerce', hi: 'बाज़ार एवं वाणिज्य' },
    marketplaceSub: {
      en: 'Category, editorial and atmosphere photography used across the Marketplace.',
      hi: 'बाज़ार में प्रयुक्त श्रेणी, संपादकीय और वातावरण की तस्वीरें।'
    },
    heritageTitle: { en: 'Heritage & Editorial', hi: 'विरासत एवं संपादकीय' },
    heritageSub: {
      en: 'Photographs, engravings and museum plates used on the heritage and editorial pages.',
      hi: 'विरासत और संपादकीय पृष्ठों पर प्रयुक्त तस्वीरें, नक़्क़ाशियाँ और संग्रहालय पट्टियाँ।'
    },
    depicts: { en: 'Depicts', hi: 'दर्शाता है' },
    source: { en: 'Source', hi: 'स्रोत' },
    licence: { en: 'Licence', hi: 'लाइसेंस' },
    usage: { en: 'Used for', hi: 'उपयोग' },
    photographer: { en: 'Photographer', hi: 'छायाकार' },
    openSource: { en: 'View original source', hi: 'मूल स्रोत देखें' },
    note: {
      en: 'Several images here illustrate a subject rather than depict Buxar itself — a period engraving of a battle, a museum object from the Buxar mound, or a district-region study. Each entry states what it actually shows.',
      hi: 'यहाँ कुछ तस्वीरें किसी विषय को समझाने के लिए हैं, बक्सर को नहीं — युद्ध की पुरानी नक़्क़ाशी, बक्सर की मोहर से मिला संग्रहालय वस्तु, या जिला-क्षेत्र का अध्ययन। हर प्रविष्टि में स्पष्ट रूप से लिखा है कि वह वास्तव में क्या दिखाती है।'
    }
  }

  function hi () { return doc.documentElement.getAttribute('data-lang') === 'hi' }
  function t (k) { return hi() ? UI[k].hi : UI[k].en }

  function esc (s) {
    return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    })
  }

  /* Wrap so a long URL never widens the page. */
  function link (url, label) {
    if (!url) return esc(label || '')
    return '<a class="cr-row__link" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer nofollow">' +
      esc(label || t('openSource')) + '</a>'
  }

  /* The registry stores a machine-readable usage key; show it as a word. */
  var USAGE = {
    hero: { en: 'hero image', hi: 'मुख्य चित्र' },
    category: { en: 'category', hi: 'श्रेणी' },
    location: { en: 'area', hi: 'क्षेत्र' },
    seller: { en: 'storefront', hi: 'स्टोर' },
    product: { en: 'product', hi: 'उत्पाद' }
  }

  function usage (key) {
    var u = USAGE[key]
    return u ? (hi() ? u.hi : u.en) : (key || '')
  }

  function row (c) {
    var cells = ''
    cells += '<div class="cr-row__cell cr-row__cell--depicts">' + esc(c.depicts || c.creditAs || c.key || '') + '</div>'

    var sourceBits = []
    if (c.photographer) sourceBits.push(esc(c.photographer))
    if (c.source) sourceBits.push(esc(c.source))
    if (c.usageType) sourceBits.push(esc(usage(c.usageType)))
    cells += '<div class="cr-row__cell cr-row__cell--source">' +
      (sourceBits.length ? sourceBits.join(' &middot; ') : '<span class="cr-row__na">—</span>') +
      (c.sourceUrl ? ' ' + link(c.sourceUrl) : '') + '</div>'

    cells += '<div class="cr-row__cell cr-row__cell--licence">' +
      (c.licence ? esc(c.licence) : '<span class="cr-row__na">—</span>') + '</div>'

    return '<div class="cr-row">' + cells + '</div>'
  }

  function table (list) {
    if (!list || !list.length) {
      return '<p class="cr-empty">—</p>'
    }
    return '<div class="cr-head">' +
        '<span>' + esc(t('depicts')) + '</span>' +
        '<span>' + esc(t('source')) + '</span>' +
        '<span>' + esc(t('licence')) + '</span>' +
      '</div>' + list.map(row).join('')
  }

  function render () {
    var host = doc.getElementById('cr-list')
    if (!host) return

    var market = window.TheBuxarMarketCredits || []
    var heritage = window.TheBuxarHeritageCredits || []

    host.innerHTML =
      '<section class="cr-section">' +
        '<h2 class="cr-h">' + esc(t('marketplaceTitle')) + '</h2>' +
        '<p class="cr-sub">' + esc(t('marketplaceSub')) + '</p>' +
        table(market) +
      '</section>' +
      '<section class="cr-section">' +
        '<h2 class="cr-h">' + esc(t('heritageTitle')) + '</h2>' +
        '<p class="cr-sub">' + esc(t('heritageSub')) + '</p>' +
        table(heritage) +
      '</section>' +
      '<p class="cr-note">' + esc(t('note')) + '</p>'
  }

  function boot () {
    render()
    try {
      new MutationObserver(render).observe(doc.documentElement, {
        attributes: true,
        attributeFilter: ['data-lang']
      })
    } catch (e) {}
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot)
  else boot()
})()