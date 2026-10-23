const Animations = {
  _bar: null,

  init() {
    this._progressBar()
    this._prefetch()
    this._pageTransitions()
    this._scrollReveal()
  },

  // Barra de progresso no topo
  _progressBar() {
    const bar = document.createElement('div')
    bar.className = 'page-bar'
    document.body.prepend(bar)
    this._bar = bar

    requestAnimationFrame(() => {
      bar.classList.add('is-running')
      setTimeout(() => {
        bar.classList.remove('is-running')
        bar.classList.add('is-done')
      }, 450)
    })
  },

  // Pré-carrega páginas ao passar o mouse sobre links internos
  _prefetch() {
    const done = new Set()
    document.addEventListener('mouseover', e => {
      const a = e.target.closest('a[href]')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href.startsWith('#') || href.includes(':') || done.has(href)) return
      done.add(href)
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      document.head.appendChild(link)
    }, { passive: true })
  },

  // Transição suave apenas ao entrar no CRM
  _pageTransitions() {
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href]')
      if (!link) return

      const href = link.getAttribute('href')
      if (!href) return

      // Preserve bottom-nav scroll for all internal navigation
      const bottomNav = document.querySelector('.bottom-nav')
      if (bottomNav) sessionStorage.setItem('_bnScroll', bottomNav.scrollLeft)

      // Fade apenas na transição ecommerce → CRM
      if (href === 'admin.html' || href.endsWith('/admin.html')) {
        e.preventDefault()
        document.body.classList.add('is-leaving')
        setTimeout(() => { window.location.href = href }, 190)
      }
    })
  },

  // Revelar elementos ao rolar
  _scrollReveal() {
    // Seletores que receberão animação de entrada
    const GROUPS = [
      // Pares hero (esquerda / direita)
      { sel: '.hero__content', variant: 'left' },
      { sel: '.hero__image',   variant: 'right' },

      // Seções com stagger por linha
      { sel: '.benefit',            stagger: true },
      { sel: '.banner-card',        stagger: true },
      { sel: '.promo-card',         stagger: true },
      { sel: '.product-card',       stagger: true },
      { sel: '.blog-card',          stagger: true },
      { sel: '.mini-list',          stagger: true },
      { sel: '.footer__grid > div', stagger: true },

      // Cabeçalhos e blocos únicos
      { sel: '.section__header' },
      { sel: '.page-header' },
      { sel: '.banner-offer__content' },
      { sel: '.daily-deals__featured' },
      { sel: '.daily-deals__tabs', delay: 100 },
      { sel: '.brands__grid', variant: 'fade' },

      // Páginas internas
      { sel: '.filter-block',       stagger: true },
      { sel: '.checkout-section',   stagger: true },
      { sel: '.order-summary',      delay: 120 },
      { sel: '.account-sidebar' },
      { sel: '.account-card',       stagger: true },
      { sel: '.cart-layout' },
    ]

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        obs.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' })

    const seen = new Set()
    const parentCount = new Map()

    GROUPS.forEach(({ sel, variant, stagger, delay = 0 }) => {
      document.querySelectorAll(sel).forEach(el => {
        if (seen.has(el)) return
        seen.add(el)

        el.classList.add('reveal')
        if (variant) el.classList.add(`reveal--${variant}`)

        // Stagger baseado na posição entre irmãos no mesmo pai
        if (stagger) {
          const parent = el.parentElement
          const idx = parentCount.get(parent) ?? 0
          parentCount.set(parent, idx + 1)
          el.style.setProperty('--reveal-delay', `${idx * 75}ms`)
        } else if (delay) {
          el.style.setProperty('--reveal-delay', `${delay}ms`)
        }

        observer.observe(el)
      })
    })
  }
}

document.addEventListener('DOMContentLoaded', () => Animations.init())
