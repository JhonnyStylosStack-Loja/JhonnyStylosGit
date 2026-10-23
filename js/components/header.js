const Header = {
  init() {
    this._restoreBottomNavScroll()
    this._sticky()
    this._mobileMenu()
    this._injectFab()
    this._cartCount()
    this._activeLink()
    this._applyProfile()
    this._applyAdminAccess()
  },
  // Botão do painel admin só aparece pra quem está logado como admin de verdade
  async _applyAdminAccess() {
    const btns = document.querySelectorAll('.header__action-btn--admin')
    if (!btns.length || typeof SupabaseAuth === 'undefined') return
    const isAdmin = await SupabaseAuth.isAdmin()
    if (isAdmin) btns.forEach(btn => btn.classList.add('is-admin-visible'))
  },
  _restoreBottomNavScroll() {
    const nav = document.querySelector('.bottom-nav')
    if (!nav) return
    const saved = sessionStorage.getItem('_bnScroll')
    if (saved === null) return
    // Disable snap temporarily so the position is set instantly (no snap animation)
    nav.style.scrollSnapType = 'none'
    nav.scrollLeft = +saved
    sessionStorage.removeItem('_bnScroll')
    requestAnimationFrame(() => { nav.style.scrollSnapType = '' })
  },
  _activeLink() {
    const page = location.pathname.split('/').pop() || 'index.html'
    document.querySelectorAll('.nav .nav__item > .nav__link').forEach(link => {
      if (link.getAttribute('href') === page) link.classList.add('is-active')
    })
    document.querySelectorAll('.bottom-nav__item').forEach(link => {
      if (link.getAttribute('href') === page) link.classList.add('is-active')
    })
  },
  _sticky() {
    const header = document.querySelector('.header')
    if (!header) return
    const onScroll = throttle(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 10)
    }, 100)
    window.addEventListener('scroll', onScroll, { passive: true })
  },
  _mobileMenu() {
    const hamburger = document.querySelector('.nav__hamburger')
    const mobileNav  = document.querySelector('.nav__mobile')
    const overlay    = document.querySelector('.nav__overlay')
    const closeBtn   = document.querySelector('.nav__mobile-close')
    if (!hamburger) return
    const open  = () => { hamburger.classList.add('is-open'); mobileNav.classList.add('is-open'); overlay.classList.add('is-visible'); document.body.style.overflow = 'hidden' }
    const close = () => { hamburger.classList.remove('is-open'); mobileNav.classList.remove('is-open'); overlay.classList.remove('is-visible'); document.body.style.overflow = '' }
    hamburger.addEventListener('click', open)
    closeBtn?.addEventListener('click', close)
    overlay?.addEventListener('click', close)
  },
  _injectFab() {
    if (document.querySelector('.fab-cart')) return
    const fab = document.createElement('a')
    fab.href = 'cart.html'
    fab.className = 'fab-cart'
    fab.setAttribute('aria-label', 'Ver carrinho')
    fab.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <span class="fab-cart__badge cart-count-badge" aria-live="polite"></span>`
    document.body.appendChild(fab)
  },
  _cartCount() {
    const count = Cart.count()
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      const prev = parseInt(badge.textContent) || 0
      badge.textContent = count
      if (badge.classList.contains('fab-cart__badge')) {
        if (count > 0) {
          badge.classList.add('is-visible')
          if (count > prev) {
            const fab = document.querySelector('.fab-cart')
            fab?.classList.remove('is-bump')
            requestAnimationFrame(() => fab?.classList.add('is-bump'))
            fab?.addEventListener('animationend', () => fab.classList.remove('is-bump'), { once: true })
          }
        } else {
          badge.classList.remove('is-visible')
        }
      } else {
        badge.style.display = count > 0 ? 'flex' : 'none'
      }
    })
  },
  updateCart() { this._cartCount() },
  _applyProfile() {
    const photo = localStorage.getItem('adm_profile_photo')
    if (!photo) return
    const btn = document.querySelector('a[href="account.html"].header__action-btn')
    if (!btn) return
    const svgEl = btn.querySelector('svg')
    if (!svgEl) return
    const adm  = JSON.parse(localStorage.getItem('adm_profile')  || '{}')
    const user = JSON.parse(localStorage.getItem('user_profile') || '{}')
    const name = adm.name || user.name || ''
    const label = btn.querySelector('.header__action-label')
    if (label && name) label.textContent = name.split(' ')[0]
    const img = document.createElement('img')
    img.src = photo
    img.style.cssText = 'width:26px;height:26px;border-radius:50%;object-fit:cover;display:block;flex-shrink:0'
    img.alt = name || 'Perfil'
    svgEl.replaceWith(img)
  }
}

document.addEventListener('DOMContentLoaded', () => Header.init())
