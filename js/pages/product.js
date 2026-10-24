document.addEventListener('DOMContentLoaded', async () => {
  Toast.init()
  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const productPage = document.querySelector('.product-page')
  const showUnavailable = (message = 'Este produto não está disponível no catálogo.') => {
    if (!productPage) return
    productPage.innerHTML = `<section class="product-unavailable"><h1>Produto indisponível</h1><p>${message}</p><a href="shop.html" class="btn btn--primary">Ver produtos</a></section>`
    productPage.hidden = false
  }
  let product
  try {
    product = await CMS.getProductById(id)
  } catch (error) {
    console.error('Não foi possível carregar o produto:', error)
    showUnavailable('Não foi possível consultar este produto agora.')
    return
  }
  if (!product) {
    showUnavailable()
    return
  }
  const [variants, products] = await Promise.all([
    CMS.getProductVariants(product.id),
    CMS.getProducts({ pageSize: 8, category: product.category })
  ])
  const gallery = product.images || []

  // Fill product info
  document.querySelector('.product-info__category').textContent = product.category
  document.querySelector('.product-info__name').textContent     = product.name
  document.querySelector('.product-info__price').textContent    = Formatter.price(product.price)
  const compare = document.querySelector('.product-info__compare')
  compare.textContent = product.comparePrice ? Formatter.price(product.comparePrice) : ''
  const descriptionText = product.description?.trim() || ''
  const escapeHtml = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
  const productDesc = document.querySelector('.product-info__desc')
  if (productDesc) {
    productDesc.textContent = descriptionText
    productDesc.hidden = !descriptionText
  }

  const detailDescriptionPanel = document.querySelectorAll('.detail-panel')[0]
  if (detailDescriptionPanel) {
    const paragraphs = descriptionText.split(/\n+/).map(p => p.trim()).filter(Boolean)
    detailDescriptionPanel.innerHTML = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')
  }

  // Gallery
  const mainImg = document.querySelector('.product-gallery__main img')
  const productImages = gallery.length ? gallery : (product.image ? [{ image: product.image, alt: product.name }] : [])
  const thumbs = document.querySelector('.product-gallery__thumbs')
  if (thumbs) {
    thumbs.replaceChildren()
    productImages.forEach((image, index) => {
      const thumb = document.createElement('div')
      thumb.className = `product-gallery__thumb${index === 0 ? ' is-active' : ''}`
      const img = document.createElement('img')
      img.src = image.image
      img.alt = image.alt || `${product.name} — foto ${index + 1}`
      img.loading = 'lazy'
      thumb.append(img)
      thumbs.append(thumb)
    })
  }
  if (mainImg && productImages[0]) {
    mainImg.src = productImages[0].image
    mainImg.alt = productImages[0].alt || product.name
  }
  document.querySelectorAll('.product-gallery__thumb').forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.product-gallery__thumb').forEach(t => t.classList.remove('is-active'))
      thumb.classList.add('is-active')
      if (mainImg && productImages[index]) {
        mainImg.src = productImages[index].image
        mainImg.alt = productImages[index].alt || product.name
      }
    })
  })

  // Size
  let selectedSize = 'M'
  let selectedColor = ''
  let selectedVariant = null
  const sizeContainer = document.querySelector('.size-btns')
  const sizeLabel = document.querySelector('.product-info__option-label')
  const priceElement = document.querySelector('.product-info__price')
  const availability = document.querySelector('.product-info__availability')
  const addButton = document.querySelector('.js-add-to-cart')
  let qty = 1
  const qtyVal = document.querySelector('.qty-val')
  const variantColors = [...new Set(variants.filter(v => v.is_active).map(v => v.color).filter(Boolean))]
  const activeVariants = variants.filter(v => v.is_active)

  function updateVariantSelection() {
    const colorVariants = activeVariants.filter(v => !selectedColor || v.color === selectedColor)
    if (!colorVariants.some(v => v.size === selectedSize)) {
      selectedSize = colorVariants.find(v => v.stock > 0)?.size || colorVariants[0]?.size || ''
    }
    selectedVariant = colorVariants.find(v => v.size === selectedSize) || null
    if (selectedVariant?.stock > 0 && qty > selectedVariant.stock) {
      qty = selectedVariant.stock
      if (qtyVal) qtyVal.textContent = qty
    }
    if (sizeContainer) {
      sizeContainer.replaceChildren()
      const sizes = [...new Set(colorVariants.map(v => v.size).filter(Boolean))]
      sizes.forEach(size => {
        const variant = colorVariants.find(v => v.size === size)
        const button = document.createElement('button')
        button.className = `size-btn${size === selectedSize ? ' is-active' : ''}${variant?.stock > 0 ? '' : ' is-out'}`
        button.type = 'button'
        button.textContent = size
        button.disabled = !variant || variant.stock < 1
        button.addEventListener('click', () => {
          selectedSize = size
          updateVariantSelection()
        })
        sizeContainer.append(button)
      })
    }
    if (selectedVariant?.price) priceElement.textContent = Formatter.price(Number(selectedVariant.price))
    else priceElement.textContent = Formatter.price(product.price)
    if (availability) {
      availability.textContent = selectedVariant?.stock > 0
        ? 'Disponível'
        : 'Indisponível no momento'
    }
    if (addButton) addButton.disabled = !selectedVariant || selectedVariant.stock < 1
  }

  if (activeVariants.length && sizeContainer) {
    const colorBlock = document.createElement('div')
    colorBlock.className = 'product-info__option product-info__color-option'
    const colorCaption = document.createElement('span')
    colorCaption.className = 'product-info__option-label'
    colorCaption.textContent = 'Cor'
    const colorButtons = document.createElement('div')
    colorButtons.className = 'size-btns product-color-btns'
    colorBlock.append(colorCaption, colorButtons)
    sizeContainer.closest('.product-info__option')?.before(colorBlock)
    const sizeCaption = sizeLabel?.firstChild
    if (sizeCaption) sizeCaption.textContent = 'Tamanho'
    if (variantColors.length) {
      selectedColor = variantColors[0]
      variantColors.forEach(color => {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = `size-btn${color === selectedColor ? ' is-active' : ''}`
        button.textContent = color
        button.addEventListener('click', () => {
          selectedColor = color
          colorButtons.querySelectorAll('button').forEach(item => item.classList.toggle('is-active', item === button))
          updateVariantSelection()
        })
        colorButtons.append(button)
      })
    }
    selectedSize = activeVariants.find(v => v.stock > 0)?.size || activeVariants[0]?.size || ''
    updateVariantSelection()
  } else {
    if (availability) availability.textContent = 'Indisponível no momento'
    if (addButton) addButton.disabled = true
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('is-active'))
        btn.classList.add('is-active')
        selectedSize = btn.dataset.size
      })
    })
  }

  // Qty
  document.querySelector('.qty-btn--minus')?.addEventListener('click', () => { if (qty > 1) { qty--; qtyVal.textContent = qty } })
  document.querySelector('.qty-btn--plus')?.addEventListener('click', () => {
    if (selectedVariant && qty >= selectedVariant.stock) return
    qty++
    qtyVal.textContent = qty
  })

  // Add to cart
  document.querySelector('.js-add-to-cart')?.addEventListener('click', () => {
    if (!selectedVariant || selectedVariant.stock < 1) return
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
  if (productPage) productPage.hidden = false
})
