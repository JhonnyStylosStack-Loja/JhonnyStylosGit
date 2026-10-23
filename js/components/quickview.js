const Quickview = {
  init() {
    const overlay = document.getElementById('quickview-overlay')
    const closeBtn = document.getElementById('quickview-close')
    if (!overlay) return
    closeBtn?.addEventListener('click', () => this.close())
    overlay.addEventListener('click', e => { if (e.target === overlay) this.close() })
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this.close() })
  },
  open(product) {
    const overlay = document.getElementById('quickview-overlay')
    if (!overlay) return
    overlay.querySelector('.modal__gallery-main').src = product.image
    overlay.querySelector('.modal__category').textContent = product.category
    overlay.querySelector('.modal__name').textContent = product.name
    overlay.querySelector('.modal__price').textContent = Formatter.price(product.price)
    const compare = overlay.querySelector('.modal__compare')
    compare.textContent = product.comparePrice ? Formatter.price(product.comparePrice) : ''
    overlay.querySelector('.modal__qty-val').textContent = '1'
    overlay.classList.add('is-open')
    document.body.style.overflow = 'hidden'

    const addBtn = overlay.querySelector('.modal__add-btn')
    addBtn.onclick = () => {
      const size = overlay.querySelector('.modal__size-btn.is-active')?.dataset.size || 'M'
      const qty  = parseInt(overlay.querySelector('.modal__qty-val').textContent, 10)
      Cart.add(product, qty, size)
      Header.updateCart()
      Toast.show('Adicionado ao carrinho!', product.name, 'success')
      this.close()
    }
  },
  close() {
    const overlay = document.getElementById('quickview-overlay')
    overlay?.classList.remove('is-open')
    document.body.style.overflow = ''
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Quickview.init()
  // qty controls inside modal
  document.getElementById('qv-qty-minus')?.addEventListener('click', () => {
    const el = document.querySelector('#quickview-overlay .modal__qty-val')
    const v = parseInt(el.textContent, 10); if (v > 1) el.textContent = v - 1
  })
  document.getElementById('qv-qty-plus')?.addEventListener('click', () => {
    const el = document.querySelector('#quickview-overlay .modal__qty-val')
    el.textContent = parseInt(el.textContent, 10) + 1
  })
  document.querySelectorAll('#quickview-overlay .modal__size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#quickview-overlay .modal__size-btn').forEach(b => b.classList.remove('is-active'))
      btn.classList.add('is-active')
    })
  })
})
