document.addEventListener('DOMContentLoaded', async () => {
  Toast.init()
  const PAGE_SIZE = 24
  let page = 1, total = 0
  const categories = await CMS.getCategories()
  const collections = await CMS.getCollections()
  const facets = await CMS.getCatalogFacets()
  const params = new URLSearchParams(location.search)
  const initialSearch = params.get('q')?.trim() || ''
  const values = selector => Array.from(document.querySelectorAll(`${selector}:checked`)).map(el => el.value)
  const options = (id, list) => {
    const el = document.getElementById(id)
    if (el) el.innerHTML = list.map(value => `<label class="filter-option"><input type="checkbox" value="${value}"> ${value}</label>`).join('')
  }
  const debounce = (fn, delay = 250) => { let timer; return () => { clearTimeout(timer); timer = setTimeout(fn, delay) } }

  options('shop-category-filters', categories)
  options('shop-size-filters', facets.sizes)
  options('shop-color-filters', facets.colors)
  const collectionEl = document.getElementById('shop-collection-filters')
  if (collectionEl) collectionEl.innerHTML = collections.map(c => `<label class="filter-option"><input type="checkbox" value="${c.id}" ${c.id === params.get('collection') ? 'checked' : ''}> ${c.name}</label>`).join('')
  const ratingEl = document.getElementById('shop-rating-filters')
  if (ratingEl) ratingEl.innerHTML = [5, 4, 3].map(n => `<label class="filter-option"><input type="checkbox" value="${n}"> ${n}${n === 5 ? '' : '+'} Estrelas</label>`).join('')
  const min = document.getElementById('price-min'), max = document.getElementById('price-max'), slider = document.getElementById('price-slider')
  const searchInput = document.getElementById('shop-search')
  if (searchInput && initialSearch) searchInput.value = initialSearch
  const sidebar = document.querySelector('.shop-sidebar')
  const toolbar = document.querySelector('.shop-toolbar')
  if (sidebar && toolbar) {
    const filterButton = document.createElement('button')
    filterButton.type = 'button'
    filterButton.className = 'shop-filter-toggle'
    filterButton.setAttribute('aria-expanded', 'false')
    filterButton.innerHTML = `${UIIcons.svg('filter')}<span>Filtros</span>`
    toolbar.prepend(filterButton)
    filterButton.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('is-open')
      filterButton.classList.toggle('is-active', isOpen)
      filterButton.setAttribute('aria-expanded', String(isOpen))
      filterButton.querySelector('span').textContent = isOpen ? 'Fechar filtros' : 'Filtros'
      if (isOpen) sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
  if (min && max && slider) { min.max = max.max = slider.max = facets.maxPrice; min.value = facets.minPrice; max.value = slider.value = facets.maxPrice }

  function filters() {
    return { search: document.getElementById('shop-search')?.value || '', categories: values('#shop-category-filters input'), collectionIds: values('#shop-collection-filters input'), sizes: values('#shop-size-filters input'), colors: values('#shop-color-filters input'), minPrice: Number(min?.value) || null, maxPrice: Number(max?.value) || null, minRating: values('#shop-rating-filters input').map(Number).reduce((a, n) => a === null ? n : Math.min(a, n), null), sort: document.getElementById('shop-sort')?.value || 'default' }
  }
  function stars(rating) { return Array.from({ length: 5 }, (_, i) => `<svg class="${i < Math.round(rating) ? 'filled' : ''}" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`).join('') }
  function card(p) {
    const sale = p.comparePrice ? Math.round((1 - p.price / p.comparePrice) * 100) : 0
    return `<article class="product-card"><div class="product-card__image-wrap"><a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async"></a><div class="product-card__badges">${p.isNew ? '<span class="badge badge--new">Novo</span>' : ''}${p.isSale ? `<span class="badge badge--sale">-${sale}%</span>` : ''}</div><a class="product-card__quickadd" href="product.html?id=${p.id}">Ver opções</a></div><div class="product-card__body"><p class="product-card__category">${p.category}</p><a href="product.html?id=${p.id}" class="product-card__name">${p.name}</a><div class="product-card__rating"><div class="stars">${stars(p.rating)}</div><span class="product-card__rating-count">(${p.reviews})</span></div><div class="product-card__pricing"><span class="product-card__price">${Formatter.price(p.price)}</span>${p.comparePrice ? `<span class="product-card__compare">${Formatter.price(p.comparePrice)}</span>` : ''}</div></div></article>`
  }
  function pagination() {
    const nav = document.getElementById('shop-pagination'), pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    if (!nav) return
    const first = Math.max(1, page - 2), last = Math.min(pages, page + 2)
    nav.innerHTML = `<button class="pagination__btn" data-page="prev" aria-label="Página anterior" ${page === 1 ? 'disabled' : ''}>${UIIcons.svg('arrowLeft')}</button>${Array.from({ length: last - first + 1 }, (_, i) => { const n = first + i; return `<button class="pagination__btn${n === page ? ' is-active' : ''}" data-page="${n}">${n}</button>` }).join('')}<button class="pagination__btn" data-page="next" aria-label="Próxima página" ${page === pages ? 'disabled' : ''}>${UIIcons.svg('arrowRight')}</button>`
    nav.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { page = b.dataset.page === 'prev' ? page - 1 : b.dataset.page === 'next' ? page + 1 : Number(b.dataset.page); load(); document.getElementById('shop-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }))
  }
  async function load() {
    const grid = document.getElementById('shop-grid'), count = document.getElementById('shop-count')
    if (grid) grid.setAttribute('aria-busy', 'true')
    if (count) count.textContent = 'Carregando catálogo…'
    try {
      const result = await CMS.getCatalogPage({ ...filters(), page, pageSize: PAGE_SIZE })
      total = result.total
      if (grid) grid.innerHTML = result.products.length ? result.products.map(card).join('') : '<p class="shop-empty">Nenhum produto encontrado.</p>'
      const start = total ? (page - 1) * PAGE_SIZE + 1 : 0, end = (page - 1) * PAGE_SIZE + result.products.length
      if (count) count.textContent = total ? `Exibindo ${start}–${end} de ${total} produtos` : ''
      pagination()
    } catch (error) {
      if (grid) grid.innerHTML = `<p class="shop-empty">${error.message}</p>`
      if (count) count.textContent = 'Não foi possível carregar o catálogo'
    } finally { if (grid) grid.removeAttribute('aria-busy') }
  }
  const reset = () => { page = 1; load() }
  document.querySelector('.shop-sidebar')?.addEventListener('change', reset)
  document.getElementById('shop-sort')?.addEventListener('change', reset)
  document.getElementById('shop-search')?.addEventListener('input', debounce(reset))
  slider?.addEventListener('input', () => { max.value = slider.value; reset() })
  await load()
})
