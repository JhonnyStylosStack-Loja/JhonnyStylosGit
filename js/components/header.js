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
    this._restoreCloudCart()
  },
  // Botão do painel admin só aparece pra quem está logado como admin de verdade
  async _applyAdminAccess() {
    const btns = document.querySelectorAll('.header__action-btn--admin')
    if (!btns.length || typeof SupabaseAuth === 'undefined') return
    const canAccessCRM = await SupabaseAuth.canAccessCRM()
    if (canAccessCRM) btns.forEach(btn => btn.classList.add('is-admin-visible'))
  },
  async _restoreCloudCart() {
    if (typeof Cart === 'undefined' || typeof supabaseClient === 'undefined') return
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) return
    const marker = `_cartMerged_${user.id}`
    if (sessionStorage.getItem(marker)) return
    await Cart.mergeFromCloud()
    sessionStorage.setItem(marker, '1')
    this._cartCount()
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
    if (typeof Cart === 'undefined') return
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
  _getStoredUser() {
    if (typeof SUPABASE_URL === 'undefined') return null
    const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0]
    const storedSession = localStorage.getItem(`sb-${projectRef}-auth-token`)
    if (!storedSession) return null

    try {
      return JSON.parse(storedSession).user || null
    } catch {
      return null
    }
  },
  _renderProfileAvatar(user, profile = null) {
    const name = profile?.full_name || user.user_metadata?.full_name || user.email || 'Minha conta'
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2)
      .map(part => part[0]).join('').toUpperCase()
    const photo = localStorage.getItem(`user_profile_photo_${user.id}`)
      || profile?.avatar_url
      || user.user_metadata?.avatar_url
      || user.user_metadata?.picture
      || (['admin', 'hr'].includes(profile?.role) ? localStorage.getItem('adm_profile_photo') : '')

    const createAvatar = (compact = false) => {
      const avatar = document.createElement('span')
      avatar.className = `user-avatar${compact ? ' user-avatar--compact' : ''}`
      avatar.setAttribute('aria-hidden', 'true')

      const fallback = document.createElement('span')
      fallback.className = 'user-avatar__initials'
      fallback.textContent = initials || 'JS'
      avatar.appendChild(fallback)

      if (photo) {
        const img = document.createElement('img')
        img.className = 'user-avatar__photo'
        img.alt = ''
        img.addEventListener('load', () => {
          avatar.classList.add('has-photo')
          document.documentElement.classList.remove('has-cached-profile-photo')
        })
        img.addEventListener('error', () => {
          img.remove()
          document.documentElement.classList.remove('has-cached-profile-photo')
        })
        avatar.appendChild(img)
        img.src = photo
        if (img.complete && img.naturalWidth > 0) {
          avatar.classList.add('has-photo')
          document.documentElement.classList.remove('has-cached-profile-photo')
        }
      }

      return avatar
    }

    document.querySelectorAll('a[href="account.html"].header__action-btn').forEach(btn => {
      btn.querySelector(':scope > .user-avatar, :scope > svg')?.replaceWith(createAvatar())
      btn.title = `Minha conta — ${name}`
      btn.setAttribute('aria-label', `Minha conta de ${name}`)
    })

    document.querySelectorAll('a[href="account.html"].bottom-nav__item').forEach(link => {
      link.querySelector(':scope > .user-avatar, :scope > .bottom-nav__icon')?.replaceWith(createAvatar(true))
      link.setAttribute('aria-label', `Minha conta de ${name}`)
    })
  },
  async _applyProfile() {
    const storedUser = this._getStoredUser()
    if (storedUser) this._renderProfileAvatar(storedUser)

    if (typeof SupabaseAuth === 'undefined') return

    const user = await SupabaseAuth.getCurrentUser()
    if (!user) return

    this._renderProfileAvatar(user)
    this._renderProfileAvatar(user, await SupabaseAuth.getCurrentUserProfile())
  }
}

document.addEventListener('DOMContentLoaded', () => Header.init())
