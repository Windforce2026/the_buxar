/* ------------------------------------------------------------------ */
/* TheBuxar.com — Hero interactions (pure vanilla, no dependencies)   */
/* Adds: golden particle canvas, ripple on the primary CTA and a      */
/* subtle scroll fade. The hero's entrance animation is driven by     */
/* js/loader.js adding .is-revealed.                                  */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* --- Golden particles (matches the loader canvas look) --- */
  function particles() {
    const canvas = document.getElementById('hero-particles')
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

    const COUNT = reduceMotion ? 0 : 80
    const ps = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.16,
      vy: -(0.05 + Math.random() * 0.2),
      tw: Math.random() * Math.PI * 2,
    }))

    const gold = '212, 175, 55'
    let raf = 0
    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) {
        p.x += p.vx
        p.y += p.vy
        p.tw += 0.018
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w }
        if (p.x < -4) p.x = w + 4
        if (p.x > w + 4) p.x = -4
        const alpha = 0.16 + 0.24 * (0.5 + 0.5 * Math.sin(p.tw))
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

  /* --- Ripple on the primary CTA --- */
  function ripple() {
    const btn = document.querySelector('.hero__btn--gold')
    if (!btn) return
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 1.4
      const el = document.createElement('span')
      el.className = 'hero__btn-ripple'
      el.style.width = `${size}px`
      el.style.height = `${size}px`
      el.style.left = `${e.clientX - rect.left - size / 2}px`
      el.style.top = `${e.clientY - rect.top - size / 2}px`
      el.addEventListener('animationend', () => el.remove(), { once: true })
      btn.appendChild(el)
      requestAnimationFrame(() => el.classList.add('is-rippling'))
    })
  }

  /* --- Fade the hero slightly as the page scrolls away --- */
  function scrollFade() {
    const hero = document.getElementById('hero')
    if (!hero) return
    let raf = 0
    window.addEventListener(
      'scroll',
      () => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          const p = Math.min(1, window.scrollY / (window.innerHeight * 0.8))
          hero.style.setProperty('--scrollfade', String(1 - p * 0.4))
        })
      },
      { passive: true }
    )
  }

  function boot() {
    ;[particles, ripple, scrollFade].forEach((fn) => {
      try { fn() } catch (e) { console.error('[TheBuxar] hero step failed', e) }
    })
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
