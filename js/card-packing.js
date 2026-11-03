/* ------------------------------------------------------------------ */
/* TheBuxar.com — card grid packing                                    */
/*                                                                     */
/* Client brief: every card grid should look stacked and packed, the  */
/* way the Samridhi reference grids do — no empty slots left at the    */
/* end of a row, nothing looking half-finished.                        */
/*                                                                     */
/* The routine below is purely a layout pass. It never reorders the    */
/* DOM and never changes what a card contains: it reads each managed   */
/* grid's real column count at the current width, finds the trailing   */
/* row's deficit, and lets the trailing-row cards share the empty      */
/* columns between them so the row always finishes flush. When a       */
/* record is added later the same maths keeps the row full.            */
/*                                                                     */
/* Managed grids are equal-height card grids only. The curated photo   */
/* gallery (.gal) deliberately keeps its own tall-frame composition    */
/* and is never touched.                                               */
/*                                                                     */
/* Language: none — layout only.                                       */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  /* Grids the packer is allowed to manage. */
  var GRIDS = [
    '.bz-grid',
    '.bz-catgrid',
    '.ls-grid',
    '.bz-area',
    '.ops-grid',
    '.mk-grid',
    '.mk-catgrid',
    '.tour-home__grid',
    '.tour-more__grid',
    '.tour-travel__grid',
    '.tour-dest',
    '.expl-grid3',
    '.expl-grid--side',
    '.expl-gal',
    '.expl-home__row',
    '.hist-explore__grid',
    '.hist-heritage__grid',
    '.hist-heritage__items',
    '.hist-ledger',
    '.hist-places__grid'
  ]

  var TIMER = 0

  /* Column count of an element's own grid track list — 0 when it is
     not behaving as a multi-column grid at this width. */
  function colCount (grid) {
    var s = window.getComputedStyle(grid)
    if (s.display !== 'grid') return 0
    var t = s.gridTemplateColumns.split(/\s+/).filter(Boolean)
    if (t.length < 2 || t[0] === '0px' || t[0] === 'none') return 0
    return t.length
  }

  function pack (grid) {
    var kids = grid.children
    /* Reset previous spans first so maths always runs on a fresh track. */
    Array.prototype.forEach.call(kids, function (el) { el.style.gridColumn = '' })

    var n = colCount(grid)
    if (n < 2) return

    /* Group direct children into rows by their offset top (grid rows   */
    /* stretch children, so tops are flat and reliable per row).        */
    var tops = []
    Array.prototype.forEach.call(kids, function (el) {
      var r = el.getBoundingClientRect()
      if (r.width < 4) return
      var key = null
      for (var i = 0; i < tops.length; i++) {
        if (Math.abs(tops[i] - r.top) < 32) { key = i; break }
      }
      if (key === null) { tops.push(r.top); key = tops.length - 1 }
      el._packRow = key
    })

    /* Trailing row and its deficit. */
    var last = tops.length - 1
    if (last < 1) return
    var members = Array.prototype.filter.call(kids, function (el) {
      return el._packRow === last
    })
    var deficit = n - members.length
    if (deficit <= 0) return

    /* Hand the spare columns out from the centre outwards, so odd      */
    /* contributions keep the row visually balanced.                    */
    var share = []
    for (var j = 0; j < members.length; j++) share.push(1)
    var order = []
    var mid = (members.length - 1) / 2
    for (var k = 0; k < members.length; k++) order.push(Math.round(mid + (k % 2 === 0 ? k / 2 : -(k + 1) / 2)))
    for (var d = 0; d < deficit; d++) share[order[d % order.length]]++

    members.forEach(function (el, idx) {
      if (share[idx] > 1) el.style.gridColumn = 'span ' + share[idx]
    })
  }

  function sweep () {
    GRIDS.forEach(function (sel) {
      try {
        Array.prototype.forEach.call(document.querySelectorAll(sel), pack)
      } catch (e) { /* a mis-argued selector must never break the page */ }
    })
  }

  function schedule () {
    if (TIMER) return
    TIMER = window.setTimeout(function () {
      TIMER = 0
      sweep()
    }, 160)
  }

  /* Data-driven grids render after the page, so both DOM mutations     */
  /* and resize re-run the pass; everything is debounced.               */
  window.addEventListener('resize', schedule)
  window.addEventListener('load', schedule)

  if ('MutationObserver' in window) {
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true })
  }

  /* Deferred and async render passes land between paint frames, so a  */
  /* few late passes make the pack deterministic on every page. */
  [0, 400, 1100, 2400].forEach(function (ms) {
    window.setTimeout(schedule, ms)
  })

  /* Exposed for modules that know precisely when they finish rendering. */
  window.TheBuxarPack = { sweep: sweep }
})()
