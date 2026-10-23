document.addEventListener('DOMContentLoaded', async () => {
  Toast.init()
  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const products = await CMS.getProducts()
  const product = products.find(p => p.id === id) || products[0]
  if (!product) return

  // Fill product info
  document.querySelector('.product-info__category').textContent = product.category
  document.querySelector('.product-info__name').textContent     = product.name
  document.querySelector('.product-info__price').textContent    = Formatter.price(product.price)
  const compare = document.querySelector('.product-info__compare')
  compare.textContent = product.comparePrice ? Formatter.price(product.comparePrice) : ''

  // Gallery
  const mainImg = document.querySelector('.product-gallery__main img')
  if (mainImg) mainImg.src = product.image
  document.querySelectorAll('.product-gallery__thumb img').forEach((img, i) => {
    img.src = product.image
  })
  document.querySelectorAll('.product-gallery__thumb').forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.product-gallery__thumb').forEach(t => t.classList.remove('is-active'))
      thumb.classList.add('is-active')
      mainImg.src = product.image
    })
  })

  // Size
  let selectedSize = 'M'
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('is-active'))
      btn.classList.add('is-active')
      selectedSize = btn.dataset.size
    })
  })

  // Qty
  let qty = 1
  const qtyVal = document.querySelector('.qty-val')
  document.querySelector('.qty-btn--minus')?.addEventListener('click', () => { if (qty > 1) { qty--; qtyVal.textContent = qty } })
  document.querySelector('.qty-btn--plus')?.addEventListener('click', () => { qty++; qtyVal.textContent = qty })

  // Add to cart
  document.querySelector('.js-add-to-cart')?.addEventListener('click', () => {
    Cart.add(product, qty, selectedSize)
    Header.updateCart()
    Toast.show('Adicionado ao carrinho!', product.name, 'success')
  })

  // Wishlist
  const wishBtn = document.querySelector('.product-info__wishlist')
  if (wishBtn) {
    wishBtn.classList.toggle('is-wishlisted', Wishlist.has(product.id))
    wishBtn.addEventListener('click', () => {
      const added = Wishlist.toggle(product.id)
      wishBtn.classList.toggle('is-wishlisted', added)
      Toast.show(added ? 'Adicionado aos favoritos' : 'Removido dos favoritos', '', 'info')
    })
  }

  // Detail tabs
  document.querySelectorAll('.detail-tab-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.detail-tab-btn').forEach(b => b.classList.remove('is-active'))
      document.querySelectorAll('.detail-panel').forEach(p => p.classList.remove('is-active'))
      btn.classList.add('is-active')
      document.querySelectorAll('.detail-panel')[i]?.classList.add('is-active')
    })
  })

  // Related products
  function renderStars(r) {
    return Array.from({ length: 5 }, (_, i) =>
      `<svg class="${i < Math.round(r) ? 'filled' : ''}" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
    ).join('')
  }
  const related = products.filter(p => p.id !== product.id).slice(0, 4)
  const relGrid = document.getElementById('related-grid')
  if (relGrid) relGrid.innerHTML = related.map(p => `
    <article class="product-card">
      <div class="product-card__image-wrap">
        <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"></a>
        <button class="product-card__quickadd js-addcart-rel" data-id="${p.id}">Adicionar ao Carrinho</button>
      </div>
      <div class="product-card__body">
        <p class="product-card__category">${p.category}</p>
        <a href="product.html?id=${p.id}" class="product-card__name">${p.name}</a>
        <div class="product-card__rating"><div class="stars">${renderStars(p.rating)}</div></div>
        <span class="product-card__price">${Formatter.price(p.price)}</span>
      </div>
    </article>`).join('')

  document.querySelectorAll('.js-addcart-rel').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault()
      const p = products.find(x => x.id === btn.dataset.id)
      if (!p) return
      Cart.add(p)
      Header.updateCart()
      Toast.show('Adicionado ao carrinho!', p.name, 'success')
    })
  })
})
