/* ------------------------------------------------------------------ */
/* TheBuxar.com — homepage sections (pure vanilla, no dependencies)   */
/* Subtle fade-up reveal driven by IntersectionObserver. The section  */
/* backgrounds get a CSS-only parallax (background-attachment: fixed) */
/* defined in sections.css. Nothing moves automatically.              */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function reveal() {
    const els = Array.from(document.querySelectorAll('.reveal'))
    if (!els.length) return

    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    els.forEach((el) => obs.observe(el))
  }

  /* --- Gold scroll progress bar --- */
  function progress() {
    const bar = document.getElementById('progress')
    const fill = bar && bar.querySelector('span')
    if (!bar || !fill) return
    let raf = 0
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      const p = h > 0 ? window.scrollY / h : 0
      fill.style.transform = `scaleX(${p.toFixed(4)})`
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
  }

  /* --- Back-to-top button --- */
  function backTop() {
    const btn = document.getElementById('back-top')
    if (!btn) return
    const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > 520)
    window.addEventListener('scroll', onScroll, { passive: true })
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
    onScroll()
  }

  /* --- Footer newsletter (visual only) --- */
  function footerForm() {
    const form = document.getElementById('footer-form')
    const status = document.getElementById('footer-status')
    if (!form || !status) return
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const email = form.querySelector('input')
      const hi = document.documentElement.getAttribute('data-lang') === 'hi'
      if (email && email.value && email.checkValidity()) {
        status.textContent = hi ? 'धन्यवाद! सफलतापूर्वक सदस्यता ली गई।' : 'Thank you — you are subscribed.'
        form.reset()
      } else {
        status.textContent = hi ? 'कृपया एक मान्य ईमेल डालें।' : 'Please enter a valid email.'
      }
    })
  }

  function boot() {
    reveal()
    progress()
    backTop()
    footerForm()
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
