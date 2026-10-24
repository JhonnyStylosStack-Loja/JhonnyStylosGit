function formatBlogDate(str) {
  const d = new Date(str + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function renderLatestBlogCard(post) {
  return `
  <article class="blog-card">
    <a href="blog-post.html?id=${post.id}" class="blog-card__image-wrap" style="display:block;text-decoration:none">
      <img class="blog-card__image" src="${post.image}" alt="${post.title}" loading="lazy">
    </a>
    <div class="blog-card__body">
      <div class="blog-card__meta">
        <span class="blog-card__category">${post.category}</span>
        <span class="blog-card__date">${formatBlogDate(post.date)}</span>
      </div>
      <h3 class="blog-card__title">
        <a href="blog-post.html?id=${post.id}" style="color:inherit;text-decoration:none">${post.title}</a>
      </h3>
      <p class="blog-card__excerpt">${post.excerpt}</p>
      <a href="blog-post.html?id=${post.id}" class="blog-card__link">Leia Mais
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </a>
    </div>
  </article>`
}

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) =>
    `<svg class="${i < Math.round(rating) ? 'filled' : ''}" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  ).join('')
}

function renderProductCard(p) {
  const salePct = p.comparePrice ? Math.round((1 - p.price / p.comparePrice) * 100) : 0
  return `
  <article class="product-card" data-id="${p.id}">
    <div class="product-card__image-wrap">
      <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"></a>
      <div class="product-card__badges">
        ${p.isNew ? '<span class="badge badge--new">Novo</span>' : ''}
        ${p.isSale ? `<span class="badge badge--sale">-${salePct}%</span>` : ''}
      </div>
      <div class="product-card__actions">
        <button class="product-card__action-btn js-wishlist${Wishlist.has(p.id) ? ' is-wishlisted' : ''}" data-id="${p.id}" title="Adicionar à lista de desejos">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <button class="product-card__action-btn js-quickview" data-id="${p.id}" title="Ver rápido">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <button class="product-card__quickadd js-addcart" data-id="${p.id}">Adicionar ao Carrinho</button>
    </div>
    <div class="product-card__body">
      <p class="product-card__category">${p.category}</p>
      <a href="product.html?id=${p.id}" class="product-card__name">${p.name}</a>
      <div class="product-card__rating">
        <div class="stars">${renderStars(p.rating)}</div>
        <span class="product-card__rating-count">(${p.reviews})</span>
      </div>
      <div class="product-card__pricing">
        <span class="product-card__price">${Formatter.price(p.price)}</span>
        ${p.comparePrice ? `<span class="product-card__compare">${Formatter.price(p.comparePrice)}</span>` : ''}
      </div>
    </div>
  </article>`
}

function renderFeaturedNew(p) {
  const salePct = p.comparePrice ? Math.round((1 - p.price / p.comparePrice) * 100) : 0
  return `
  <div class="na-feature-img-wrap">
    <img src="${p.image}" alt="${p.name}" loading="lazy">
    <div class="na-feature-badges">
      ${p.isNew ? '<span class="badge badge--new">Novo</span>' : ''}
      ${p.isSale ? `<span class="badge badge--sale">-${salePct}%</span>` : ''}
    </div>
  </div>
  <div class="na-feature-body">
    <p class="na-feature-cat">${p.category}</p>
    <h3 class="na-feature-name">${p.name}</h3>
    <div class="na-feature-rating">
      <div class="stars">${renderStars(p.rating)}</div>
      <span>(${p.reviews})</span>
    </div>
    <div class="na-feature-pricing">
      <span class="na-feature-price">${Formatter.price(p.price)}</span>
      ${p.comparePrice ? `<span class="na-feature-compare">${Formatter.price(p.comparePrice)}</span>` : ''}
    </div>
    <a href="product.html?id=${p.id}" class="na-feature-btn">Ver Produto</a>
  </div>`
}

function renderMiniItem(p) {
  return `
  <a href="product.html?id=${p.id}" class="mini-item">
    <img class="mini-item__image" src="${p.image}" alt="${p.name}" loading="lazy">
    <div class="mini-item__content">
      <p class="mini-item__name">${p.name}</p>
      <div class="mini-item__rating"><div class="stars">${renderStars(p.rating)}</div></div>
      <div>
        <span class="mini-item__price">${Formatter.price(p.price)}</span>
        ${p.comparePrice ? `<span class="mini-item__compare">${Formatter.price(p.comparePrice)}</span>` : ''}
      </div>
    </div>
  </a>`
}

function bindCardEvents(container = document, products) {
  container.querySelectorAll('.js-addcart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault()
      const product = products.find(p => p.id === btn.dataset.id)
      if (!product) return
      Cart.add(product)
      Header.updateCart()
      Toast.show('Adicionado ao carrinho!', product.name, 'success')
    })
  })
  container.querySelectorAll('.js-quickview').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = products.find(p => p.id === btn.dataset.id)
      if (product) Quickview.open(product)
    })
  })
  container.querySelectorAll('.js-wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      const added = Wishlist.toggle(btn.dataset.id)
      btn.classList.toggle('is-wishlisted', added)
      Toast.show(added ? 'Adicionado aos favoritos' : 'Removido dos favoritos', '', 'info')
    })
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  Toast.init()

  // Botões "Ver Coleção" do Hero/banner apontam pra coleção marcada em destaque
  const featuredCollection = await CMS.getFeaturedCollection()
  if (featuredCollection) {
    document.querySelectorAll('.js-featured-collection-cta').forEach(a => {
      a.href = `shop.html?collection=${featuredCollection.id}`
    })
  }

  const products = await CMS.getProducts()
  const blogPosts = await CMS.getBlogPosts()
  if (!products.length) return

  // ── New Arrivals section ────────────────────────────────
  const newArrivals = products.filter(p => p.isNew)
  const naFeatured  = newArrivals.length ? newArrivals.reduce((a, b) => a.rating >= b.rating ? a : b) : null
  const naFeatureEl = document.getElementById('na-feature')
  const naGridEl    = document.getElementById('na-grid')
  const naPills     = document.querySelectorAll('.na-pill')

  if (naFeatureEl && naFeatured) naFeatureEl.innerHTML = renderFeaturedNew(naFeatured)

  function renderNewGrid(filter) {
    if (!naGridEl) return
    const pool = filter === 'all'
      ? newArrivals.filter(p => p.id !== naFeatured?.id)
      : newArrivals.filter(p => p.category === filter && p.id !== naFeatured?.id)
    naGridEl.innerHTML = pool.slice(0, 4).map(renderProductCard).join('')
    bindCardEvents(naGridEl, products)
  }
  renderNewGrid('all')

  naPills.forEach(pill => {
    pill.addEventListener('click', () => {
      naPills.forEach(p => p.classList.remove('is-active'))
      pill.classList.add('is-active')
      renderNewGrid(pill.dataset.filter)
    })
  })

  // ── Legacy data (bestSellers / saleItems for other sections) ──
  const bestSellers = products.slice(4, 8)
  const saleItems   = products.filter(p => p.isSale)

  // Mini lists
  const miniOffer   = document.getElementById('mini-offer')
  const miniNew     = document.getElementById('mini-new')
  const miniBest    = document.getElementById('mini-best')
  if (miniOffer) miniOffer.innerHTML = products.filter(p => p.isSale).slice(0, 4).map(renderMiniItem).join('')
  if (miniNew)   miniNew.innerHTML   = products.filter(p => p.isNew).slice(0, 4).map(renderMiniItem).join('')
  if (miniBest)  miniBest.innerHTML  = products.slice(0, 4).map(renderMiniItem).join('')

  // Daily deals grids
  const dealsGrid = document.getElementById('deals-grid')
  const dealsNew  = document.getElementById('deals-new')
  const dealsSale = document.getElementById('deals-sale')
  if (dealsGrid) dealsGrid.innerHTML = products.slice(0, 4).map(renderProductCard).join('')
  if (dealsNew)  dealsNew.innerHTML  = products.filter(p => p.isNew).slice(0, 4).map(renderProductCard).join('')
  if (dealsSale) dealsSale.innerHTML = products.filter(p => p.isSale).slice(0, 4).map(renderProductCard).join('')

  // Últimos posts publicados
  const blogLatestGrid = document.getElementById('blog-latest-grid')
  if (blogLatestGrid) {
    blogLatestGrid.innerHTML = blogPosts.slice(0, 3).map(renderLatestBlogCard).join('')
  }

  if (dealsGrid) bindCardEvents(dealsGrid, products)
  if (dealsNew)  bindCardEvents(dealsNew, products)
  if (dealsSale) bindCardEvents(dealsSale, products)
})
