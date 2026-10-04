/* ------------------------------------------------------------------ */
/* TheBuxar.com — Bihar map loader (pure vanilla, no dependencies)    */
/* The map is inlined in index.html, so it works over http:// or      */
/* file:// with no fetch and no GSAP/CDN requirements.                */
/* Sequence (~2.5s): Bihar outline draws, districts fade in, Buxar    */
/* highlights + pulses, typography reveals, then the loader fades out */
/* while the homepage fades in. The video backdrop loads lazily and   */
/* never blocks the reveal.                                           */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const loader = document.getElementById('loader')
  const hero = document.getElementById('hero')
  const mapEl = document.getElementById('loader-map')

  /* --- Golden floating particles (canvas) --- */
  function particles() {
    const canvas = document.getElementById('loader-particles')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const COUNT = reduceMotion ? 0 : 60
    const ps = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(0.06 + Math.random() * 0.22),
      tw: Math.random() * Math.PI * 2,
    }))

    const gold = '212, 175, 55'
    let raf = 0
    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) {
        p.x += p.vx
        p.y += p.vy
        p.tw += 0.02
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w }
        if (p.x < -4) p.x = w + 4
        if (p.x > w + 4) p.x = -4
        const alpha = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(p.tw))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${gold}, ${alpha})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    if (COUNT) raf = requestAnimationFrame(tick)
    window.addEventListener('unload', () => cancelAnimationFrame(raf))
  }

  /* Set the outline dash so CSS can draw it. */
  function setOutline() {
    const outline = document.getElementById('br-outline')
    if (!outline) return
    const len = Math.ceil(outline.getTotalLength())
    outline.style.strokeDasharray = `${len} ${len}`
    outline.style.strokeDashoffset = String(len)
    outline.style.setProperty('--olen', `${len}px`)
  }

  /* Lazy-start the cinematic backdrop video so the loader never blocks
     on it: we defer fetching/playing until the map is already painting,
     and the reveal timer is fully independent of video readiness. */
  function bgVideo() {
    const video = document.getElementById('loader-bg-video')
    if (!video || reduceMotion) return
    video.addEventListener(
      'playing',
      () => loader.classList.add('is-video'),
      { once: true }
    )
    setTimeout(() => {
      video.load()
      const p = video.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }, 350)
  }

  /* Place the pulses + "BUXAR" label on Buxar's centroid. */
  function placeBuxar() {
    const origin = document.getElementById('br-pulse-origin')
    const rect = mapEl.getBoundingClientRect()
    let bx = NaN
    let by = NaN
    if (origin) {
      const r = origin.getBoundingClientRect()
      bx = r.left + r.width / 2 - rect.left
      by = r.top + r.height / 2 - rect.top
    }
    if (isNaN(bx)) { bx = rect.width / 2; by = rect.height / 2 }

    for (let i = 0; i < 2; i++) {
      const p = document.createElement('div')
      p.className = 'loader__pulse is-anim'
      p.style.left = `${bx.toFixed(1)}px`
      p.style.top = `${by.toFixed(1)}px`
      p.style.animationDelay = `${(1.7 + i * 0.8).toFixed(1)}s`
      mapEl.appendChild(p)
    }

    const label = document.createElement('div')
    label.className = 'loader__label'
    label.innerHTML = '<span class="dot"></span><span class="connector"></span><span class="text">BUXAR</span>'
    mapEl.appendChild(label)
    label.style.left = `${(bx - 3).toFixed(1)}px`
    label.style.top = `${(by - 6).toFixed(1)}px`
    setTimeout(() => label.classList.add('is-live'), reduceMotion ? 50 : 1950)
  }

  /* Fade the loader out and the hero in together, right after the
     map animation finishes (~2.3s) instead of a fixed long wait. */
  function reveal() {
    setTimeout(() => {
      loader.classList.add('is-leaving')
      // Pages without a #hero (business.html, marketplace.html and the
      // marketplace/* pages) must not throw here: the throw would abort
      // this callback before the video is paused and before the loader
      // is hidden, leaving the particle rAF loop and the mp4 running
      // forever behind a visibility:hidden overlay.
      if (hero) hero.classList.add('is-revealed')
      const video = document.getElementById('loader-bg-video')
      if (video) video.pause()
      setTimeout(() => { loader.style.display = 'none' }, 700)
    }, reduceMotion ? 120 : 2450)
  }

  /* Show the full cinematic loader once per session only; on every
     later navigation skip straight to the revealed state so the
     loader never replays on page-to-page changes. */
  let seenLoader = false
  try { seenLoader = sessionStorage.getItem('tbx:loader-seen') === '1' } catch (e) { /* storage unavailable */ }

  function skipLoader() {
    if (loader) loader.style.display = 'none'
    if (hero) hero.classList.add('is-revealed')
    document.body.classList.add('buxar-ready')
  }

  if (seenLoader) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', skipLoader)
    else skipLoader()
    return
  }

  try { sessionStorage.setItem('tbx:loader-seen', '1') } catch (e) { /* storage unavailable */ }

  function boot() {
    setOutline()
    placeBuxar()
    particles()
    bgVideo()
    document.body.classList.add('buxar-ready')
    reveal()
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()