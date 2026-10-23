function renderCard(product) {
  const isSale = !!product.comparePrice
  return `
  <article class="product-card" data-id="${product.id}">
    <div class="product-card__image-wrap">
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </a>
      <div class="product-card__badges">
        ${product.isNew ? '<span class="badge badge--new">Novo</span>' : ''}
        ${isSale ? '<span class="badge badge--sale">Promoção</span>' : ''}
      </div>
      <div class="product-card__actions">
        <button class="product-card__action-btn js-remove-wish" data-id="${product.id}" title="Remover dos favoritos">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" style="color:var(--color-primary-mid)"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
      <button class="product-card__quickadd js-add-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
    </div>
    <div class="product-card__body">
      <p class="product-card__category">${product.category}</p>
      <a href="product.html?id=${product.id}" class="product-card__name">${product.name}</a>
      <div class="product-card__pricing">
        <span class="product-card__price">${Formatter.price(product.price)}</span>
        ${isSale ? `<span class="product-card__compare">${Formatter.price(product.comparePrice)}</span>` : ''}
      </div>
    </div>
  </article>`
}

function updateCartBadges() {
  const count = Cart.count()
  document.querySelectorAll('.cart-count-badge').forEach(el => {
    el.textContent = count
    el.style.display = count > 0 ? 'inline-flex' : 'none'
  })
}

function render(allProducts) {
  const grid  = document.getElementById('wishlist-grid')
  const empty = document.getElementById('wishlist-empty')
  const ids   = Wishlist.get()
  const products = allProducts.filter(p => ids.includes(p.id))

  if (!products.length) {
    grid.style.display  = 'none'
    empty.style.display = 'flex'
    return
  }
  empty.style.display = 'none'
  grid.style.display  = 'grid'
  grid.innerHTML = products.map(renderCard).join('')

  grid.querySelectorAll('.js-remove-wish').forEach(btn => {
    btn.addEventListener('click', () => {
      Wishlist.toggle(btn.dataset.id)
      Toast.show('Removido dos favoritos', '', 'info')
      render(allProducts)
    })
  })

  grid.querySelectorAll('.js-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = allProducts.find(p => p.id === btn.dataset.id)
      if (!product) return
      Cart.add(product)
      updateCartBadges()
      Toast.show('Adicionado ao carrinho!', '', 'success')
    })
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  Toast.init()
  updateCartBadges()
  const allProducts = await CMS.getProducts()
  render(allProducts)
})
