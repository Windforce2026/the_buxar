/* ------------------------------------------------------------------ */
/* TheBuxar.com — entry point                                          */
/* Plain (non-module) script so it runs anywhere, including file://.   */
/* Boots theme, language and nav listeners. The loader runs on its    */
/* own in js/loader.js and no longer depends on this file.            */
/* ------------------------------------------------------------------ */
(function () {
  'use strict'

  const isHi = () => document.documentElement.getAttribute('data-lang') === 'hi'

  /* --- Theme --- */
  function initTheme() {
    const btn = document.querySelector('.nav__theme')
    const sun = btn && btn.querySelector('.nav__theme-sun')
    const moon = btn && btn.querySelector('.nav__theme-moon')
    const root = document.documentElement
    const set = (light) => {
      if (light) root.setAttribute('data-theme', 'light')
      else root.removeAttribute('data-theme')
      try {
        localStorage.setItem('buxar-theme', light ? 'light' : 'dark')
      } catch (e) {}
    }
    // Clicking the sun -> light theme; clicking the moon -> dark theme.
    if (sun) sun.addEventListener('click', (e) => { e.stopPropagation(); set(true) })
    if (moon) moon.addEventListener('click', (e) => { e.stopPropagation(); set(false) })
    const meta = document.querySelector('meta[name="theme-color"]')
    const applyMeta = () =>
      meta && meta.setAttribute('content', root.getAttribute('data-theme') === 'light' ? '#f6f0e1' : '#081C33')
    applyMeta()
    const obs = new MutationObserver(applyMeta)
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
  }

  /* --- Language --- */
  function applyLang() {
    const hi = isHi()
    document.documentElement.lang = hi ? 'hi' : 'en'
    document.querySelectorAll('[data-en]').forEach((el) => {
      el.textContent = hi ? el.dataset.hi : el.dataset.en
    })
    document.querySelectorAll('[data-ph]').forEach((el) => {
      const parts = (el.dataset.ph || '').split('|')
      el.placeholder = hi ? parts[1] : parts[0]
    })
    const toggle = document.querySelector('[data-lang-toggle]')
    if (toggle) toggle.setAttribute('aria-pressed', hi ? 'true' : 'false')
  }

  function initLang() {
    const root = document.documentElement
    const toggle = document.querySelector('[data-lang-toggle]')
    applyLang()
    if (toggle) {
      toggle.addEventListener('click', () => {
        if (root.getAttribute('data-lang') === 'hi') root.removeAttribute('data-lang')
        else root.setAttribute('data-lang', 'hi')
        try {
          localStorage.setItem('buxar-lang', isHi() ? 'hi' : 'en')
        } catch (e) {}
        applyLang()
      })
    }
  }

  /* --- Nav scroll state + active link --- */
  function initNav() {
    const nav = document.getElementById('nav')
    if (!nav) return
    const links = Array.from(nav.querySelectorAll('.nav__link'))
    const sections = links
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean)

    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 24)
      if (!sections.length) return
      let current = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          current = section
        }
      }
      links.forEach((link) => {
        link.classList.toggle('is-active', current && link.getAttribute('href') === `#${current.id}`)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  /* --- Search toggle --- */
  function initSearch() {
    const btn = document.getElementById('nav-search-btn')
    const panel = document.getElementById('nav-search')
    const input = document.getElementById('nav-search-input')
    const close = document.getElementById('nav-search-close')
    if (!btn || !panel || !input) return

    const isOpen = () => panel.classList.contains('is-open')
const open = () => {
      panel.classList.add('is-open')
      btn.setAttribute('aria-expanded', 'true')
      setTimeout(() => input.focus({ preventScroll: true }), 60)
    }
    const closePanel = () => {
      panel.classList.remove('is-open')
      btn.setAttribute('aria-expanded', 'false')
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      if (isOpen()) closePanel()
      else open()
    })
    if (close) close.addEventListener('click', closePanel)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePanel()
    })
    document.addEventListener('click', (e) => {
      if (isOpen() && !panel.contains(e.target) && e.target !== btn) closePanel()
    })
  }

  /* --- Mobile hamburger menu --- */
  function initNavToggle() {
    const btn = document.getElementById('nav-toggle')
    const nav = document.getElementById('nav')
    if (!btn || !nav) return

    const setOpen = (open) => {
      nav.classList.toggle('nav-open', open)
      btn.setAttribute('aria-expanded', open ? 'true' : 'false')
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
      document.body.style.overflow = open ? 'hidden' : ''
    }

    btn.addEventListener('click', () => setOpen(!nav.classList.contains('nav-open')))

    // Close when a link is chosen.
    nav.querySelectorAll('.nav__link, .nav__login--menu').forEach((link) => {
      link.addEventListener('click', () => setOpen(false))
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false)
    })

    // Close when clicking outside the drawer on mobile.
    document.addEventListener('click', (e) => {
      if (
        nav.classList.contains('nav-open') &&
        !nav.contains(e.target)
      ) {
        setOpen(false)
      }
    })
  }

  function boot() {
    // Init theme + language first so an unrelated nav error can never
    // break core controls. Each is isolated in its own try/catch.
    ;[applyLang, initTheme, initLang, initNav, initSearch, initNavToggle].forEach((fn) => {
      try { fn() } catch (e) { console.error('[TheBuxar] init step failed', e) }
    })
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()