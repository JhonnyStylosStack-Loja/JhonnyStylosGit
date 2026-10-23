document.addEventListener('DOMContentLoaded', async () => {
  Toast.init()

  const allProducts = await CMS.getProducts()
  const categories = await CMS.getCategories()
  const collections = await CMS.getCollections()
  const productCollectionsMap = await CMS.getProductCollectionsMap()
  let filtered = [...allProducts]
  const PAGE_SIZE = 12
  let currentPage = 1
  let sortValue = 'default'

  const params = new URLSearchParams(location.search)
  const initialCollectionId = params.get('collection')

  const priceBounds = { min: 0, max: allProducts.length ? Math.ceil(Math.max(...allProducts.map(p => p.price))) : 0 }

  function initPriceFilter() {
    const minInput  = document.getElementById('price-min')
    const maxInput  = document.getElementById('price-max')
    const slider    = document.getElementById('price-slider')
    if (!minInput || !maxInput || !slider) return

    // Sempre começa zerado (0 até o preço máximo do site) pra mostrar todos os produtos
    minInput.min = maxInput.min = slider.min = priceBounds.min
    minInput.max = maxInput.max = slider.max = priceBounds.max
    minInput.value = priceBounds.min
    maxInput.value = priceBounds.max
    slider.value   = priceBounds.max

    // Tempo real: dispara a cada digitação/arraste, sem precisar de Enter/blur
    minInput.addEventListener('input', () => applyFilters())
    maxInput.addEventListener('input', () => { slider.value = maxInput.value; applyFilters() })
    slider.addEventListener('input',   () => { maxInput.value = slider.value; applyFilters() })
  }

  function renderCategoryFilters() {
    const el = document.getElementById('shop-category-filters')
    if (!el) return
    el.innerHTML = categories.map(cat => {
      const count = allProducts.filter(p => p.category === cat).length
      return `<label class="filter-option"><input type="checkbox" data-cat="${cat}"> ${cat} <span class="filter-option__count">(${count})</span></label>`
    }).join('') || '<p style="color:var(--color-text-muted);font-size:var(--font-size-sm)">Nenhuma categoria cadastrada.</p>'
  }

  function renderCollectionFilters() {
    const el = document.getElementById('shop-collection-filters')
    if (!el) return
    el.innerHTML = collections.map(col => {
      const count = allProducts.filter(p => (productCollectionsMap[p.id] || []).includes(col.id)).length
      const checked = col.id === initialCollectionId ? 'checked' : ''
      return `<label class="filter-option"><input type="checkbox" data-col="${col.id}" ${checked}> ${col.name} <span class="filter-option__count">(${count})</span></label>`
    }).join('') || '<p style="color:var(--color-text-muted);font-size:var(--font-size-sm)">Nenhuma coleção cadastrada.</p>'
  }

  function renderRatingFilters() {
    const el = document.getElementById('shop-rating-filters')
    if (!el) return
    const tiers = [5, 4, 3]
    el.innerHTML = tiers.map(stars => {
      const count = allProducts.filter(p => p.rating >= stars).length
      const label = stars === 5 ? '5 Estrelas' : `${stars}+ Estrelas`
      return `<label class="filter-option"><input type="checkbox" data-rating="${stars}"> ${label} <span class="filter-option__count">(${count})</span></label>`
    }).join('')
  }

  function applyFilters() {
    const selectedCats = Array.from(document.querySelectorAll('#shop-category-filters input[data-cat]:checked')).map(i => i.dataset.cat)
    const selectedCols = Array.from(document.querySelectorAll('#shop-collection-filters input[data-col]:checked')).map(i => i.dataset.col)
    const priceMin = Number(document.getElementById('price-min')?.value ?? priceBounds.min)
    const priceMax = Number(document.getElementById('price-max')?.value ?? priceBounds.max)
    const selectedRatings = Array.from(document.querySelectorAll('#shop-rating-filters input[data-rating]:checked')).map(i => Number(i.dataset.rating))
    const minRating = selectedRatings.length ? Math.min(...selectedRatings) : null

    filtered = allProducts.filter(p => {
      if (selectedCats.length && !selectedCats.includes(p.category)) return false
      if (selectedCols.length) {
        const productCols = productCollectionsMap[p.id] || []
        if (!selectedCols.some(c => productCols.includes(c))) return false
      }
      if (p.price < priceMin || p.price > priceMax) return false
      if (minRating !== null && p.rating < minRating) return false
      return true
    })

    if (sortValue === 'price-asc')  filtered.sort((a, b) => a.price - b.price)
    if (sortValue === 'price-desc') filtered.sort((a, b) => b.price - a.price)
    if (sortValue === 'rating')     filtered.sort((a, b) => b.rating - a.rating)
    if (sortValue === 'newest')     filtered = filtered.filter(p => p.isNew)

    currentPage = 1
    render()
  }

  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) =>
      `<svg class="${i < Math.round(rating) ? 'filled' : ''}" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
    ).join('')
  }

  function renderCard(p) {
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
          <button class="product-card__action-btn js-wishlist${Wishlist.has(p.id) ? ' is-wishlisted' : ''}" data-id="${p.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
        <button class="product-card__quickadd js-addcart" data-id="${p.id}">Adicionar ao Carrinho</button>
      </div>
      <div class="product-card__body">
        <p class="product-card__category">${p.category}</p>
        <a href="product.html?id=${p.id}" class="product-card__name">${p.name}</a>
        <div class="product-card__rating"><div class="stars">${renderStars(p.rating)}</div><span class="product-card__rating-count">(${p.reviews})</span></div>
        <div class="product-card__pricing">
          <span class="product-card__price">${Formatter.price(p.price)}</span>
          ${p.comparePrice ? `<span class="product-card__compare">${Formatter.price(p.comparePrice)}</span>` : ''}
        </div>
      </div>
    </article>`
  }

  function renderPagination() {
    const nav = document.getElementById('shop-pagination')
    if (!nav) return
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    if (currentPage > totalPages) currentPage = totalPages

    let html = `<button class="pagination__btn" data-page="prev" title="Previous" ${currentPage === 1 ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>`
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="pagination__btn${i === currentPage ? ' is-active' : ''}" data-page="${i}">${i}</button>`
    }
    html += `<button class="pagination__btn" data-page="next" title="Next" ${currentPage === totalPages ? 'disabled' : ''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>`
    nav.innerHTML = html

    nav.querySelectorAll('.pagination__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
        if (btn.dataset.page === 'prev') currentPage = Math.max(1, currentPage - 1)
        else if (btn.dataset.page === 'next') currentPage = Math.min(totalPages, currentPage + 1)
        else currentPage = Number(btn.dataset.page)
        render()
        document.getElementById('shop-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }

  function render() {
    const grid  = document.getElementById('shop-grid')
    const count = document.getElementById('shop-count')
    const start = (currentPage - 1) * PAGE_SIZE
    const pageItems = filtered.slice(start, start + PAGE_SIZE)
    if (grid)  grid.innerHTML = pageItems.map(renderCard).join('')
    if (count) count.textContent = `Exibindo ${pageItems.length} de ${filtered.length} produtos`
    renderPagination()
    bindEvents()
  }

  function bindEvents() {
    document.querySelectorAll('.js-addcart').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault()
        const p = allProducts.find(x => x.id === btn.dataset.id)
        if (!p) return
        Cart.add(p)
        Header.updateCart()
        Toast.show('Adicionado ao carrinho!', p.name, 'success')
      })
    })
    document.querySelectorAll('.js-wishlist').forEach(btn => {
      btn.addEventListener('click', () => {
        const added = Wishlist.toggle(btn.dataset.id)
        btn.classList.toggle('is-wishlisted', added)
        Toast.show(added ? 'Adicionado aos favoritos' : 'Removido dos favoritos', '', 'info')
      })
    })
  }

  // Sort
  document.getElementById('shop-sort')?.addEventListener('change', e => {
    sortValue = e.target.value
    applyFilters()
  })

  // Category filter
  renderCategoryFilters()
  document.getElementById('shop-category-filters')?.addEventListener('change', e => {
    if (!e.target.matches('input[data-cat]')) return
    applyFilters()
  })

  // Collection filter
  renderCollectionFilters()
  document.getElementById('shop-collection-filters')?.addEventListener('change', e => {
    if (!e.target.matches('input[data-col]')) return
    applyFilters()
  })

  // Price range (tempo real)
  initPriceFilter()

  // Rating filter
  renderRatingFilters()
  document.getElementById('shop-rating-filters')?.addEventListener('change', e => {
    if (!e.target.matches('input[data-rating]')) return
    applyFilters()
  })

  applyFilters()
})
