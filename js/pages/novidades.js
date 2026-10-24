/* novidades.js — Página de Novidades */

let allProducts = []
const ILLUSTRATIVE_ASSETS = [
  'IMAGEM%20ILUSTRATIV/PRODUTOS.png',
  'IMAGEM%20ILUSTRATIV/BANNERS.png',
  'IMAGEM%20ILUSTRATIV/BANNERS%20BLOGS.png',
  'IMAGEM%20ILUSTRATIV/BACKGROUNDS.png'
]

function renderIllustrativeLayout() {
  const spotlight = document.getElementById('nov-spotlight-card')
  const mosaic = document.getElementById('nov-mosaic-grid')
  const grid = document.getElementById('nov-all-grid')

  if (spotlight) {
    spotlight.innerHTML = `
      <div class="nov-spotlight__img-wrap">
        <img src="${ILLUSTRATIVE_ASSETS[0]}" alt="Imagem ilustrativa da seção de novidades" class="nov-spotlight__img" loading="eager">
        <div class="nov-spotlight__badges"><span class="badge-destaque">Imagem ilustrativa</span></div>
      </div>
      <div class="nov-spotlight__info">
        <p class="nov-spotlight__cat">Em preparação</p>
        <h2 class="nov-spotlight__name">A próxima seleção chega em breve</h2>
        <p class="nov-spotlight__desc">Esta é uma prévia visual da página. As novidades reais aparecem aqui automaticamente assim que forem cadastradas e publicadas no catálogo.</p>
        <div class="nov-spotlight__actions"><a href="shop.html" class="btn btn--primary">Ver catálogo</a></div>
      </div>`
  }

  if (mosaic) {
    mosaic.innerHTML = ILLUSTRATIVE_ASSETS.map((image, index) => `
      <article class="mos-card mos-card--illustrative">
        <img src="${image}" alt="Imagem ilustrativa ${index + 1} da seção de novidades" class="mos-card__img" loading="lazy">
        <div class="mos-card__overlay"></div>
        <div class="mos-card__body">
          <p class="mos-card__cat">Prévia visual</p>
          <p class="mos-card__name">Novidades em preparação</p>
        </div>
      </article>`).join('')
  }

  if (grid) {
    grid.innerHTML = `
      <div class="nov-empty nov-empty--illustrated">
        <img src="${ILLUSTRATIVE_ASSETS[2]}" alt="Imagem ilustrativa do catálogo de novidades" loading="lazy">
        <div>
          <h3>Ainda não há novidades publicadas</h3>
          <p>Quando os produtos forem publicados no CRM, eles serão exibidos nesta área.</p>
          <a href="shop.html" class="btn btn--outline">Ir para o catálogo</a>
        </div>
      </div>`
  }
}

function renderSpotlight(SPOTLIGHT) {
  const el = document.getElementById('nov-spotlight-card')
  if (!el || !SPOTLIGHT) return
  const discount = SPOTLIGHT.comparePrice
    ? Math.round((1 - SPOTLIGHT.price / SPOTLIGHT.comparePrice) * 100)
    : null
  el.innerHTML = `
    <div class="nov-spotlight__img-wrap">
      <img src="${SPOTLIGHT.image}" alt="${SPOTLIGHT.name}" class="nov-spotlight__img">
      <div class="nov-spotlight__badges">
        <span class="badge-novo">Novo</span>
        ${discount ? `<span class="badge-destaque">-${discount}%</span>` : ''}
      </div>
    </div>
    <div class="nov-spotlight__info">
      <p class="nov-spotlight__cat">${SPOTLIGHT.category}</p>
      <h2 class="nov-spotlight__name">${SPOTLIGHT.name}</h2>
      <p class="nov-spotlight__desc">Peça exclusiva da nova coleção Jhonny Styles. Tecido de alta qualidade, modelagem cuidadosa para valorizar cada silhueta.</p>
      <div class="nov-spotlight__price-row">
        <span class="nov-spotlight__price">${Formatter.price(SPOTLIGHT.price)}</span>
        ${SPOTLIGHT.comparePrice ? `<span class="nov-spotlight__compare">${Formatter.price(SPOTLIGHT.comparePrice)}</span>` : ''}
      </div>
      <div class="nov-spotlight__actions">
        <button class="btn btn--primary js-spotlight-cart" data-id="${SPOTLIGHT.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          Adicionar ao Carrinho
        </button>
        <a href="product.html?id=${SPOTLIGHT.id}" class="btn btn--outline">Ver Produto</a>
      </div>
    </div>`

  el.querySelector('.js-spotlight-cart')?.addEventListener('click', () => {
    Cart.add(SPOTLIGHT)
    Header.updateCart()
    Toast.show('Adicionado ao carrinho!', SPOTLIGHT.name, 'success')
  })
}

// ── Mosaico ───────────────────────────────────────────────────
function renderMosaic() {
  const el = document.getElementById('nov-mosaic-grid')
  if (!el) return
  const items = allProducts.slice(0, 6)
  el.innerHTML = items.map(p => `
    <div class="mos-card" data-id="${p.id}">
      <img src="${p.image}" alt="${p.name}" class="mos-card__img" loading="lazy">
      <div class="mos-card__overlay"></div>
      ${p.isNew ? '<span class="mos-badge-novo">Novo</span>' : ''}
      <div class="mos-card__body">
        <p class="mos-card__cat">${p.category}</p>
        <p class="mos-card__name">${p.name}</p>
        <div class="mos-card__price-row">
          <span class="mos-card__price">${Formatter.price(p.price)}</span>
        </div>
        <div class="mos-card__actions">
          <button class="mos-card__btn mos-card__btn--primary js-mos-cart" data-id="${p.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Comprar
          </button>
          <a href="product.html?id=${p.id}" class="mos-card__btn mos-card__btn--ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Ver
          </a>
        </div>
      </div>
    </div>`).join('')

  el.querySelectorAll('.mos-card').forEach(card => {
    card.addEventListener('click', e => {
      if (!e.target.closest('.mos-card__btn')) {
        location.href = `product.html?id=${card.dataset.id}`
      }
    })
  })
  el.querySelectorAll('.js-mos-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const p = allProducts.find(x => x.id === btn.dataset.id)
      if (!p) return
      Cart.add(p)
      Header.updateCart()
      Toast.show('Adicionado ao carrinho!', p.name, 'success')
    })
  })
}

// ── Countdown semanal ─────────────────────────────────────────
function startCountdown() {
  const now = new Date()
  const nextSunday = new Date(now)
  nextSunday.setDate(now.getDate() + (7 - now.getDay()))
  nextSunday.setHours(23, 59, 59, 0)

  function tick() {
    const diff = nextSunday - new Date()
    if (diff <= 0) return
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = String(v).padStart(2, '0') }
    set('nov-cd-days', d); set('nov-cd-hours', h)
    set('nov-cd-minutes', m); set('nov-cd-seconds', s)
  }
  tick()
  setInterval(tick, 1000)
}

// ── Grade de novos produtos ───────────────────────────────────
let currentCat = 'all'
let currentSort = 'default'

function getFiltered() {
  let list = allProducts.filter(p => p.isNew)
  if (currentCat !== 'all') list = list.filter(p => p.category === currentCat)
  if (currentSort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
  else if (currentSort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
  else if (currentSort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
  return list
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
          <span class="badge badge--new">Novo</span>
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

function renderGrid() {
  const grid = document.getElementById('nov-all-grid')
  if (!grid) return
  const items = getFiltered()
  grid.innerHTML = items.length
    ? items.map(renderCard).join('')
    : '<p class="nov-empty">Nenhum produto encontrado nesta categoria.</p>'
  bindGridEvents()
}

function bindGridEvents() {
  document.querySelectorAll('#nov-all-grid .js-addcart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault()
      const p = allProducts.find(x => x.id === btn.dataset.id)
      if (!p) return
      Cart.add(p)
      Header.updateCart()
      Toast.show('Adicionado ao carrinho!', p.name, 'success')
    })
  })
  document.querySelectorAll('#nov-all-grid .js-wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      const added = Wishlist.toggle(btn.dataset.id)
      btn.classList.toggle('is-wishlisted', added)
      Toast.show(added ? 'Adicionado aos favoritos' : 'Removido dos favoritos', '', 'info')
    })
  })
}

// ── Category pills & sort ─────────────────────────────────────
function initControls() {
  document.querySelectorAll('.nov-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nov-cat-btn').forEach(b => b.classList.remove('is-active'))
      btn.classList.add('is-active')
      currentCat = btn.dataset.cat
      renderGrid()
    })
  })
  document.getElementById('nov-sort-select')?.addEventListener('change', e => {
    currentSort = e.target.value
    renderGrid()
  })
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  Toast.init()
  try {
    allProducts = await CMS.getProducts() || []
  } catch (error) {
    console.error('Não foi possível carregar as novidades:', error)
    allProducts = []
  }

  const newProducts = allProducts.filter(product => product.isNew)
  if (!newProducts.length) {
    renderIllustrativeLayout()
    startCountdown()
    return
  }

  allProducts = newProducts
  const SPOTLIGHT = newProducts.find(p => p.isSale) || newProducts[0]
  renderSpotlight(SPOTLIGHT)
  renderMosaic()
  startCountdown()
  renderGrid()
  initControls()
})
