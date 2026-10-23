const Toast = {
  container: null,
  init() {
    this.container = document.getElementById('toast-container')
  },
  show(title, text = '', type = 'success', duration = 4000) {
    if (!this.container) this.init()
    const el = document.createElement('div')
    el.className = `toast toast--${type}`
    el.innerHTML = `
      <span class="toast__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${type === 'success'
            ? '<polyline points="20 6 9 17 4 12"/>'
            : type === 'error'
            ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
            : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
        </svg>
      </span>
      <div class="toast__content">
        <div class="toast__title">${title}</div>
        ${text ? `<div class="toast__text">${text}</div>` : ''}
      </div>
      <button class="toast__close" type="button" aria-label="Fechar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>`

    this.container.appendChild(el)

    const closeBtn = el.querySelector('.toast__close')
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this._dismiss(el)
    })

    const timer = setTimeout(() => this._dismiss(el), duration)
    closeBtn.addEventListener('click', () => clearTimeout(timer), { once: true })
  },

  _dismiss(el) {
    if (!el || el._dismissing) return
    el._dismissing = true
    el.classList.add('is-leaving')
    const fallback = setTimeout(() => el.remove(), 250)
    el.addEventListener('animationend', () => {
      clearTimeout(fallback)
      el.remove()
    }, { once: true })
  }
}
