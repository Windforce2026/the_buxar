/* ------------------------------------------------------------------ */
/* TheBuxar.com — Tourism page behaviour (pure vanilla, no deps)      */
/* Category switcher, schematic map pins, destination detail overlay,  */
/* gallery lightbox and nav state. Reveal + progress + back-to-top are */
/* handled by js/sections.js (shared with the homepage).               */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* Mark "Tourism" as the active nav link on this page. */
  function navActive() {
    const links = Array.from(document.querySelectorAll('.nav__link'))
    links.forEach((l) => l.classList.remove('is-active'))
    const link = links.find((l) => (l.getAttribute('href') || '').includes('tourism.html'))
    if (link) link.classList.add('is-active')
  }

  /* Category switcher — Spiritual / Historical. No reload, no jump:
     panes are stacked in one grid cell and crossfade; the atmosphere
     follows via body[data-category], which also drives the hero. */
  let applyCategory = null
  function categorySwitch() {
    const buttons = Array.from(document.querySelectorAll('.tour-switch__btn'))
    const panes = Array.from(document.querySelectorAll('.tour-pane'))
    if (!buttons.length) return

    applyCategory = (cat) => {
      document.body.setAttribute('data-category', cat)
      buttons.forEach((b) => {
        const on = b.dataset.cat === cat
        b.classList.toggle('is-active', on)
        b.setAttribute('aria-selected', String(on))
        b.setAttribute('aria-pressed', String(on))
      })
      panes.forEach((p) => {
        const on = p.dataset.pane === cat
        p.classList.toggle('is-active', on)
        p.setAttribute('aria-hidden', String(!on))
      })
    }

    buttons.forEach((b) =>
      b.addEventListener('click', () => {
        applyCategory(b.dataset.cat)
        if (b.closest('.tour-hero__switch')) {
          const target = document.getElementById('explore-tourism')
          if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
        }
      })
    )

    applyCategory(document.body.getAttribute('data-category') || 'spiritual')
  }

  /* Deep links (e.g. index.html → tourism.html#battle-of-buxar): if the
     hash names a destination inside a pane, reveal that pane first so the
     anchor target is actually visible. */
  function routeHash() {
    const raw = location.hash ? location.hash.replace(/^#/, '') : ''
    if (!raw || !applyCategory) return
    const panes = Array.from(document.querySelectorAll('.tour-pane'))
    for (const pane of panes) {
      const cat = pane.dataset.pane
      if (!cat) continue
      let found = false
      pane.querySelectorAll('[id]').forEach((el) => { if (el.id === raw) found = true })
      if (found) {
        applyCategory(cat)
        return
      }
    }
  }

  /* Destination detail overlay. Cards live in #tour-detail; any
     [data-detail="id"] button opens the matching card. */
  function detailModal() {
    const root = document.getElementById('tour-detail')
    if (!root) return
    const cards = Array.from(root.querySelectorAll('.tour-detail__card'))
    const close = root.querySelector('.tour-detail__close')
    let lastFocused = null

    const open = (id) => {
      const card = document.getElementById(id)
      if (!card) return
      cards.forEach((c) => c.classList.remove('is-open'))
      card.classList.add('is-open')
      root.classList.add('is-open')
      root.setAttribute('aria-hidden', 'false')
      document.body.style.overflow = 'hidden'
      lastFocused = document.activeElement
      requestAnimationFrame(() => close.focus())
    }

    const closeDetail = () => {
      root.classList.remove('is-open')
      root.setAttribute('aria-hidden', 'true')
      document.body.style.overflow = ''
      if (lastFocused) lastFocused.focus()
      lastFocused = null
    }

    document.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-detail]')
      if (opener) {
        e.preventDefault()
        open(opener.getAttribute('data-detail'))
      }
    })
    if (close) close.addEventListener('click', closeDetail)

    document.addEventListener('keydown', (e) => {
      if (!root.classList.contains('is-open')) return
      if (e.key === 'Escape') closeDetail()
    })

    root.addEventListener('click', (e) => {
      if (e.target === root) closeDetail()
    })
  }

  /* Schematic map — pins open a single popover positioned near the   */
  /* pin. Positions are decorative, not surveyed coordinates.          */
  function mapPins() {
    const panel = document.querySelector('.tour-map__panel')
    const pop = document.getElementById('tour-map-pop')
    if (!panel || !pop) return
    const pins = Array.from(panel.querySelectorAll('.tour-map__pin'))
    const popClose = pop.querySelector('.tour-map__pop-close')
    const pTitle = pop.querySelector('.tour-map__pop-title')
    const pCat = pop.querySelector('.tour-map__pop-cat')
    const pLoc = pop.querySelector('.tour-map__pop-loc')
    const pLink = pop.querySelector('.tour-map__pop-link')

    const place = (pin) => {
      const prect = panel.getBoundingClientRect()
      const pRect = pin.getBoundingClientRect()
      const cx = pRect.left + pRect.width / 2 - prect.left
      const top = pRect.top + pRect.height / 2 - prect.top

      pop.style.left = ''
      pop.style.top = ''
      pop.classList.remove('is-left', 'is-right')

      const popW = Math.min(320, prect.width * 0.8)
      const placeRight = cx < prect.width / 2
      let left = placeRight ? cx + 26 : cx - popW - 26
      left = Math.max(12, Math.min(prect.width - popW - 12, left))
      let topAdj = top - 40
      topAdj = Math.max(56, Math.min(prect.height - 160, topAdj))

      pop.style.left = `${left}px`
      pop.style.top = `${topAdj}px`
    }

    const show = (pin) => {
      pTitle.textContent = pin.dataset.title || ''
      pCat.textContent = pin.dataset.cat || ''
      pLoc.textContent = pin.dataset.loc || ''
      if (pin.dataset.detail) {
        pLink.href = '#'
        pLink.setAttribute('data-detail', pin.dataset.detail)
        pLink.style.display = ''
      } else {
        pLink.style.display = 'none'
      }
      place(pin)
      pop.classList.add('is-open')
    }

    const hide = () => pop.classList.remove('is-open')

    pins.forEach((pin) =>
      pin.addEventListener('click', (e) => {
        e.stopPropagation()
        pop.classList.contains('is-open') && pop.dataset.pin === pin.dataset.dest
          ? hide()
          : show(pin)
        pop.dataset.pin = pin.dataset.dest
      })
    )
    if (popClose) popClose.addEventListener('click', (e) => { e.stopPropagation(); hide() })
    panel.addEventListener('click', (e) => {
      if (!e.target.closest('.tour-map__pin') && !e.target.closest('.tour-map__pop')) hide()
    })
  }

  /* Premium lightbox for the tourism gallery. */
  function lightbox() {
    const root = document.getElementById('tour-lightbox')
    if (!root) return
    const lbImg = root.querySelector('.tour-lightbox__img')
    const lbCap = root.querySelector('.tour-lightbox__cap')
    const lbCredit = root.querySelector('.tour-lightbox__credit')
    const lbCounter = root.querySelector('.tour-lightbox__counter')
    const close = root.querySelector('.tour-lightbox__close')
    const prev = root.querySelector('.tour-lightbox__prev')
    const next = root.querySelector('.tour-lightbox__next')
    const fullBtn = root.querySelector('.tour-lightbox__full')
    const items = Array.from(document.querySelectorAll('.tour-gal__fig'))
    let index = 0
    let lastFocused = null

    if (fullBtn && !(root.requestFullscreen || root.webkitRequestFullscreen)) {
      fullBtn.hidden = true
    }

    const open = (i) => {
      if (!items.length) return
      index = (i + items.length) % items.length
      const item = items[index]
      const imgEl = item.querySelector('img')
      lbImg.src = (imgEl.currentSrc || imgEl.src)
      lbImg.alt = imgEl.alt || ''
      lbCap.textContent = item.dataset.caption || ''
      lbCredit.textContent = item.dataset.credit ? `Source · ${item.dataset.credit}` : ''
      lbCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`
      root.classList.add('is-open')
      root.setAttribute('aria-hidden', 'false')
      document.body.style.overflow = 'hidden'
      lastFocused = document.activeElement
      requestAnimationFrame(() => close.focus())
    }

    const closeLb = () => {
      root.classList.remove('is-open')
      root.setAttribute('aria-hidden', 'true')
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen()
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
      }
      document.body.style.overflow = ''
      if (lastFocused) lastFocused.focus()
      lastFocused = null
    }

    items.forEach((item, i) =>
      item.addEventListener('click', () => open(i))
    )

    if (close) close.addEventListener('click', closeLb)
    if (prev) prev.addEventListener('click', (e) => { e.stopPropagation(); open(index - 1) })
    if (next) next.addEventListener('click', (e) => { e.stopPropagation(); open(index + 1) })

    const toggleFull = () => {
      if (document.fullscreenElement === root) {
        if (document.exitFullscreen) document.exitFullscreen()
      } else if (root.requestFullscreen) {
        root.requestFullscreen().catch(() => {})
      } else if (root.webkitRequestFullscreen) {
        root.webkitRequestFullscreen()
      }
    }
    if (fullBtn) fullBtn.addEventListener('click', toggleFull)

    const syncFull = () => {
      const on = document.fullscreenElement === root
      root.classList.toggle('is-fullscreen', on)
      if (fullBtn) fullBtn.setAttribute('aria-pressed', String(on))
    }
    document.addEventListener('fullscreenchange', syncFull)

    document.addEventListener('keydown', (e) => {
      if (!root.classList.contains('is-open')) return
      if (e.key === 'Escape') {
        e.preventDefault()
        closeLb()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        open(index - 1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        open(index + 1)
      }
    })

    root.addEventListener('click', (e) => {
      if (e.target === root) closeLb()
    })
  }

  function boot() {
    navActive()
    categorySwitch()
    detailModal()
    mapPins()
    lightbox()
    routeHash()
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()