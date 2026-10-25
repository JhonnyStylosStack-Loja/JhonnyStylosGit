document.addEventListener('DOMContentLoaded', async () => {
  Toast.init()

  async function removeUnavailableItems() {
    // Aguarda o carrinho da conta ser restaurado antes de validar. Sem isso,
    // um item antigo da nuvem pode reaparecer logo depois de ser removido.
    await Header._cloudCartPromise
    const items = Cart.get()
    if (!items.length) return
    try {
      const activeProducts = await CMS.getProducts({ pageSize: 1000 })
      const activeIds = new Set(activeProducts.map(product => String(product.id)))
      const availableItems = items.filter(item => activeIds.has(String(item.id)))
      if (availableItems.length !== items.length) Cart.save(availableItems)
    } catch (error) {
      // Uma falha de rede não deve apagar um carrinho válido.
      console.error('Não foi possível validar o carrinho:', error)
    }
  }

  function render() {
    const items   = Cart.get()
    const section = document.getElementById('cart-items')
    const empty   = document.getElementById('cart-empty')
    const content = document.getElementById('cart-content')
    const countEl = document.querySelector('.cart-count-badge')

    if (countEl) { countEl.textContent = Cart.count(); countEl.style.display = Cart.count() > 0 ? 'flex' : 'none' }
    if (!items.length) { empty?.classList.remove('hidden'); content?.classList.add('hidden'); return }
    empty?.classList.add('hidden'); content?.classList.remove('hidden')
    if (!section) return

    section.innerHTML = items.map(item => `
    <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
      <div class="cart-item__product">
        <a href="product.html?id=${item.id}"><img class="cart-item__image" src="${item.image}" alt="${item.name}"></a>
        <div>
          <a href="product.html?id=${item.id}" class="cart-item__name">${item.name}</a>
          <p class="cart-item__variant">Tamanho: ${item.size}</p>
        </div>
      </div>
      <div class="cart-item__price">${Formatter.price(item.price)}</div>
      <div class="cart-item__qty">
        <button class="cart-item__qty-btn js-minus">−</button>
        <span class="cart-item__qty-val">${item.qty}</span>
        <button class="cart-item__qty-btn js-plus">+</button>
      </div>
      <div class="cart-item__total">${Formatter.price(item.price * item.qty)}</div>
      <button class="cart-item__remove js-remove" title="Remove">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
      </button>
    </div>`).join('')

    // Summary
    const subtotal  = Cart.total()
    const shipping  = subtotal > 100 ? 0 : 9.99
    const total     = subtotal + shipping
    document.getElementById('summary-subtotal')?.textContent && (document.getElementById('summary-subtotal').textContent = Formatter.price(subtotal))
    document.getElementById('summary-shipping')?.textContent && (document.getElementById('summary-shipping').textContent = shipping === 0 ? 'Grátis' : Formatter.price(shipping))
    document.getElementById('summary-total')?.textContent && (document.getElementById('summary-total').textContent = Formatter.price(total))

    // Events
    section.querySelectorAll('.js-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.cart-item')
        const id  = row.dataset.id, size = row.dataset.size
        const qty = Cart.get().find(i => i.id === id && i.size === size)?.qty || 1
        Cart.updateQty(id, size, qty - 1)
        render()
      })
    })
    section.querySelectorAll('.js-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.cart-item')
        const id  = row.dataset.id, size = row.dataset.size
        const qty = Cart.get().find(i => i.id === id && i.size === size)?.qty || 1
        Cart.updateQty(id, size, qty + 1)
        render()
      })
    })
    section.querySelectorAll('.js-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('.cart-item')
        Cart.remove(row.dataset.id, row.dataset.size)
        Toast.show('Item removido', '', 'info')
        render()
      })
    })
  }
  await removeUnavailableItems()
  render()
})
