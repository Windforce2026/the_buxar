/* ------------------------------------------------------------------ */
/* TheBuxar.com — History page behaviour (pure vanilla, no deps)      */
/* Timeline rail draw, archive arrows + lightbox, Chausa story toggle  */
/* and nav state. Reveal + progress + back-to-top are handled by       */
/* js/sections.js (shared with the homepage).                          */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* Mark "History" as the active nav link on this page. */
  function navActive() {
    const links = Array.from(document.querySelectorAll('.nav__link'))
    links.forEach((l) => l.classList.remove('is-active'))
    const link = links.find((l) => (l.getAttribute('href') || '').includes('history.html'))
    if (link) link.classList.add('is-active')
  }

  /* Timeline rail — drawn downward with scroll (sets --tl on the track). */
  function timelineDraw() {
    const track = document.querySelector('.hist-time__track')
    if (!track) return

    if (reduceMotion) {
      track.style.setProperty('--tl', '1')
      return
    }

    let raf = 0
    const update = () => {
      const rect = track.getBoundingClientRect()
      const total = rect.height + window.innerHeight * 0.5
      let p = (window.innerHeight * 0.9 - rect.top) / total
      p = Math.min(1, Math.max(0, p))
      track.style.setProperty('--tl', p.toFixed(3))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
  }

  /* Map pins: each one jumps to the story it labels. */
  function initMapPins() {
    const pins = Array.from(document.querySelectorAll('.hist-mapbox__pin[data-hist-goto]'))
    if (!pins.length) return
    pins.forEach((pin) => {
      pin.addEventListener('click', () => {
        const target = document.getElementById(pin.dataset.histGoto)
        pins.forEach((p) => p.classList.remove('is-active'))
        pin.classList.add('is-active')
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }

  /* Chausa "Read Full Story" toggle (animated through grid-template-rows). */
  function readMore() {
    const btn = document.getElementById('hist-read-btn')
    const wrap = document.querySelector('.hist-story__wrap')
    if (!btn || !wrap) return
    btn.addEventListener('click', () => {
      const open = wrap.classList.toggle('is-open')
      btn.setAttribute('aria-expanded', String(open))
      btn.classList.toggle('is-open', open)
      wrap.setAttribute('aria-hidden', String(!open))
      if (open) {
        const inner = wrap.querySelector('.hist-story__inner')
        if (inner) inner.focus({ preventScroll: true })
      }
    })
  }

  /* Archive scroller left/right arrows. */
  function archiveNav() {
    const scroller = document.querySelector('.hist-archive__scroller')
    const prev = document.getElementById('archive-prev')
    const next = document.getElementById('archive-next')
    if (!scroller) return
    const go = (dir) =>
      scroller.scrollBy({
        left: dir * Math.min(scroller.clientWidth * 0.85, 460),
        behavior: reduceMotion ? 'auto' : 'smooth',
      })
    if (prev) prev.addEventListener('click', () => go(-1))
    if (next) next.addEventListener('click', () => go(1))
  }

  /* Premium lightbox for the archive gallery. */
  function lightbox() {
    const root = document.getElementById('hist-lightbox')
    if (!root) return
    const lbImg = root.querySelector('.hist-lightbox__img')
    const lbCap = root.querySelector('.hist-lightbox__cap')
    const lbCredit = root.querySelector('.hist-lightbox__credit')
    const lbCounter = root.querySelector('.hist-lightbox__counter')
    const close = root.querySelector('.hist-lightbox__close')
    const prev = root.querySelector('.hist-lightbox__prev')
    const next = root.querySelector('.hist-lightbox__next')
    const fullBtn = root.querySelector('.hist-lightbox__full')
    const items = Array.from(document.querySelectorAll('.hist-archive__item'))
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

    // Clicking the dimmed backdrop closes the viewer.
    root.addEventListener('click', (e) => {
      if (e.target === root) closeLb()
    })
  }

  function boot() {
  initMapPins()
    navActive()
    timelineDraw()
    readMore()
    archiveNav()
    lightbox()
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()