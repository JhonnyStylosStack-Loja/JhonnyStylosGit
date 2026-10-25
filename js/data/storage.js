/**
 * CMS Storage — camada de dados do site.
 * Produtos e posts do blog vêm do Supabase (async). Loja física, banners,
 * novidades e categorias ainda ficam em localStorage (não têm tabela própria no banco).
 * Todas as páginas públicas e o admin usam este módulo como única fonte de verdade.
 */
/* Adapta entre o formato da tabela products (Supabase) e o formato usado pelas páginas. */
function mapProductFromDB(row) {
  const tags = Array.isArray(row.tags) ? row.tags : []
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    sku: row.sku || '',
    slug: row.slug || row.sku || '',
    price: Number(row.price),
    comparePrice: row.original_price != null ? Number(row.original_price) : null,
    rating: Number(row.rating) || 0,
    reviews: row.review_count || 0,
    category: row.category,
    categoryId: row.category_id || null,
    brand: row.brand || '',
    status: row.status || (row.is_active ? 'active' : 'draft'),
    isNew: tags.includes('NOVO'),
    isSale: tags.includes('PROMO'),
    image: row.image_url || row.image || '',
    isActive: row.is_active
  }
}
function mapProductToDB(p) {
  const slug = _productSlug(p.slug || p.name || '')
  return {
    name: p.name,
    description: p.description || '',
    category: p.category,
    category_id: p.categoryId || null,
    brand: p.brand || null,
    price: p.price,
    original_price: p.comparePrice ?? null,
    slug,
    sku: p.sku || slug,
    status: p.status || 'draft',
    is_active: (p.status || 'draft') === 'active',
    tags: [...(p.isNew ? ['NOVO'] : []), ...(p.isSale ? ['PROMO'] : [])],
    rating: p.rating || 0,
    review_count: p.reviews || 0
  }
}

function _productSlug(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/* Adapta entre o formato da tabela blog_posts (Supabase) e o formato usado pelas páginas. */
function mapPostFromDB(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    excerpt: row.excerpt || '',
    date: row.created_at ? row.created_at.slice(0, 10) : '',
    author: row.author || 'Jhonny Styles',
    image: row.image_url,
    coverCropX: Number(row.cover_crop_x) || 50,
    coverCropY: Number(row.cover_crop_y) || 50,
    coverCropZoom: Number(row.cover_crop_zoom) || 1,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    content: row.content,
    isPublished: row.is_published
  }
}
function mapPostToDB(post) {
  const payload = {
    title: post.title,
    slug: post.slug || _productSlug(post.title),
    content: post.content,
    excerpt: post.excerpt || '',
    category: post.category,
    image_url: post.image,
    author: post.author || 'Jhonny Styles',
    cover_crop_x: post.coverCropX ?? 50,
    cover_crop_y: post.coverCropY ?? 50,
    cover_crop_zoom: post.coverCropZoom ?? 1,
    gallery: post.gallery || [],
    is_published: true
  }
  if (post.date) payload.created_at = new Date(`${post.date}T12:00:00Z`).toISOString()
  return payload
}

const CMS = {
  async getCatalogPage({ search = '', categories = [], collectionIds = [], minPrice = null, maxPrice = null, sizes = [], colors = [], minRating = null, newOnly = false, sort = 'default', page = 1, pageSize = 24 } = {}) {
    const term = search.trim().replace(/[,%()_*]/g, ' ')
    const { data, error } = await supabaseClient.rpc('search_catalog_products', {
      p_search: term || null, p_categories: categories, p_collection_ids: collectionIds,
      p_min_price: minPrice, p_max_price: maxPrice, p_sizes: sizes, p_colors: colors,
      p_min_rating: minRating, p_new_only: newOnly, p_sort: sort, p_page: page, p_page_size: pageSize
    })
    if (error) throw new Error(`Não foi possível pesquisar o catálogo: ${error.message}`)
    const paths = [...new Set(data.map(row => row.image_path).filter(Boolean))]
    const { data: signed, error: signError } = paths.length
      ? await supabaseClient.storage.from('product-images').createSignedUrls(paths, 3600)
      : { data: [], error: null }
    if (signError) throw new Error(`Não foi possível abrir as imagens do catálogo: ${signError.message}`)
    const signedByPath = new Map(paths.map((path, index) => [path, signed[index]?.signedUrl || '']))
    return {
      total: Number(data[0]?.total_count || 0),
      products: data.map(row => ({
        id: row.id, name: row.name, category: row.category, price: Number(row.price),
        comparePrice: row.original_price == null ? null : Number(row.original_price),
        rating: Number(row.rating) || 0, reviews: row.review_count || 0,
        isNew: (row.tags || []).includes('NOVO'), isSale: (row.tags || []).includes('PROMO'),
        image: signedByPath.get(row.image_path) || ''
      }))
    }
  },
  async getCatalogFacets() {
    const { data, error } = await supabaseClient.rpc('get_catalog_facets')
    if (error) throw new Error(`Não foi possível carregar os filtros do catálogo: ${error.message}`)
    return { minPrice: Number(data?.min_price || 0), maxPrice: Number(data?.max_price || 0), sizes: data?.sizes || [], colors: data?.colors || [] }
  },
  async getDashboardMetrics(period = 'semana') {
    const now = new Date()
    const from = new Date(now)
    if (period === 'ano') from.setMonth(0, 1)
    else if (period === 'mes') from.setDate(1)
    else from.setDate(now.getDate() - 6)
    from.setHours(0, 0, 0, 0)

    const [ordersResult, customersResult, variantsResult, productsResult] = await Promise.all([
      supabaseClient.from('orders').select('id, status, payment_status, total_amount, created_at').gte('created_at', from.toISOString()),
      supabaseClient.from('users').select('id', { count: 'exact', head: true }).eq('role', 'customer').gte('created_at', from.toISOString()),
      supabaseClient.from('product_variants').select('stock').eq('is_active', true),
      this.getProducts({ page: 0, pageSize: 4 })
    ])
    const firstError = [ordersResult.error, customersResult.error, variantsResult.error].find(Boolean)
    if (firstError) throw new Error('Não foi possível carregar os indicadores reais: ' + firstError.message)

    const orders = ordersResult.data || []
    const statusCounts = orders.reduce((counts, order) => {
      counts[order.status] = (counts[order.status] || 0) + 1
      return counts
    }, {})
    const paidOrders = orders.filter(order => order.payment_status === 'approved')
    const revenue = paidOrders.reduce((total, order) => total + Number(order.total_amount || 0), 0)
    const lowStock = (variantsResult.data || []).filter(variant => Number(variant.stock) <= 5).length
    const activeStock = (variantsResult.data || []).length

    return {
      revenue,
      orders,
      statusCounts,
      newCustomers: customersResult.count || 0,
      lowStock,
      activeStock,
      products: productsResult.products || [],
      productCount: productsResult.count || 0
    }
  },
  async getAdminOperations() {
    const [ordersResult, customersResult] = await Promise.all([
      supabaseClient.from('orders').select('*').order('created_at', { ascending: false }).limit(100),
      supabaseClient.from('users').select('id, full_name, email, phone, created_at').eq('role', 'customer').order('created_at', { ascending: false }).limit(100)
    ])
    const firstError = [ordersResult.error, customersResult.error].find(Boolean)
    if (firstError) throw new Error('Não foi possível carregar os dados operacionais: ' + firstError.message)
    return { orders: ordersResult.data || [], customers: customersResult.data || [] }
  },
  /* ── Produtos (Supabase) ──────────────────────────────── */
  async getProducts({ includeInactive = false, includeImages = false, page, pageSize = 48, search = '', category = '', status = '' } = {}) {
    const term = search.trim().replace(/[,%()_*]/g, ' ')
    let query
    if (includeInactive) {
      query = supabaseClient.rpc('search_admin_products', {
        p_search: term || null,
        p_category: category || null,
        p_status: status || null
      }, { count: page === undefined ? undefined : 'exact' })
        .order('created_at', { ascending: false })
    } else {
      query = supabaseClient.from('products').select('*', { count: page === undefined ? undefined : 'exact' })
        .eq('status', 'active').order('created_at', { ascending: false })
      if (category) query = query.eq('category', category)
      if (term) query = query.or(`name.ilike.%${term}%,sku.ilike.%${term}%,slug.ilike.%${term}%`)
    }
    if (!includeInactive && status) query = query.eq('status', status)
    if (page !== undefined) {
      const start = page * pageSize
      query = query.range(start, start + pageSize - 1)
    } else {
      query = query.limit(pageSize)
    }

    const { data, error, count } = await query
    if (error) {
      console.error('Erro ao buscar produtos:', error)
      throw new Error(`Não foi possível carregar os produtos: ${error.message}`)
    }
    if (!data.length) return page === undefined ? [] : { products: [], count: count || 0 }

    const productIds = data.map(product => product.id)
    let imageQuery = supabaseClient.from('product_images')
      .select('id, product_id, storage_path, url, alt, position, is_primary')
      .in('product_id', productIds)
    if (!includeImages) imageQuery = imageQuery.eq('is_primary', true)
    const { data: imageRows, error: imageError } = await imageQuery.order('position')
    if (imageError) {
      console.error('Erro ao buscar imagens dos produtos:', imageError)
      throw new Error(`Não foi possível carregar as imagens dos produtos: ${imageError.message}`)
    }

    const storagePaths = [...new Set(imageRows.map(image => image.storage_path).filter(Boolean))]
    const { data: signedImages, error: signedError } = storagePaths.length
      ? await supabaseClient.storage.from('product-images').createSignedUrls(storagePaths, 3600)
      : { data: [], error: null }
    if (signedError) {
      console.error('Erro ao gerar links de imagens:', signedError)
      throw new Error(`Não foi possível abrir as imagens dos produtos: ${signedError.message}`)
    }
    const signedByPath = new Map(storagePaths.map((path, index) => [path, signedImages[index]?.signedUrl || '']))
    const imagesByProduct = new Map()
    imageRows.forEach(image => {
      const list = imagesByProduct.get(image.product_id) || []
      list.push({ ...image, image: image.storage_path ? signedByPath.get(image.storage_path) : image.url })
      imagesByProduct.set(image.product_id, list)
    })

    const products = data.map(row => {
      const product = mapProductFromDB(row)
      const images = imagesByProduct.get(row.id) || []
      product.images = images
      const primary = images.find(image => image.is_primary) || images[0]
      if (primary?.image) product.image = primary.image
      else if (product.image && storagePaths.includes(product.image)) product.image = signedByPath.get(product.image) || ''
      return product
    })
    return page === undefined ? products : { products, count: count || 0 }
  },
  async getProductById(productId) {
    if (!productId) return null
    const { data, error } = await supabaseClient.from('products').select('*').eq('id', productId).maybeSingle()
    if (error) throw new Error(`Não foi possível carregar o produto: ${error.message}`)
    if (!data) return null
    const product = mapProductFromDB(data)
    const images = await this.getProductImages(product.id)
    product.images = images
    const primary = images.find(image => image.is_primary) || images[0]
    if (primary?.image) product.image = primary.image
    return product
  },
  async getProductVariants(productId) {
    const { data, error } = await supabaseClient.from('product_variants').select('*')
      .eq('product_id', productId).order('color').order('size')
    if (error) {
      console.error('Erro ao buscar variantes do produto:', error)
      throw new Error(`Não foi possível carregar tamanhos, cores e estoque: ${error.message}`)
    }
    return data
  },
  async getProductImages(productId) {
    const { data, error } = await supabaseClient.from('product_images')
      .select('id, product_id, storage_path, url, alt, position, is_primary')
      .eq('product_id', productId).order('position')
    if (error) {
      console.error('Erro ao buscar galeria do produto:', error)
      throw new Error(`Não foi possível carregar a galeria do produto: ${error.message}`)
    }
    const paths = data.map(image => image.storage_path).filter(Boolean)
    const { data: signed, error: signError } = paths.length
      ? await supabaseClient.storage.from('product-images').createSignedUrls(paths, 3600)
      : { data: [], error: null }
    if (signError) throw new Error(`Não foi possível abrir a galeria do produto: ${signError.message}`)
    const signedByPath = new Map(paths.map((path, index) => [path, signed[index]?.signedUrl || '']))
    return data.map(image => ({ ...image, image: image.storage_path ? signedByPath.get(image.storage_path) : image.url }))
  },
  async saveProductVariants(productId, variants) {
    const { error } = await supabaseClient.rpc('save_product_variants', {
      p_product_id: productId,
      p_variants: variants
    })
    if (error) {
      console.error('Erro ao salvar variantes:', error)
      throw new Error(`Não foi possível salvar tamanhos, cores e estoque: ${error.message}`)
    }
  },
  async saveProductImages(productId, images, onProgress = () => {}) {
    const uploadedPaths = []
    let metadataSaved = false
    try {
      const imageRows = []
      const pendingCount = images.filter(image => image.file).length
      let completed = 0
      for (let index = 0; index < images.length; index++) {
        const image = images[index]
        let storagePath = image.storage_path
        if (image.file) {
          storagePath = await this.uploadProductImage(productId, image.file)
          uploadedPaths.push(storagePath)
          completed++
          onProgress(completed, pendingCount)
        }
        imageRows.push({
          storage_path: storagePath,
          alt: image.alt || '',
          position: index,
          is_primary: index === 0
        })
      }
      const { data: removedPaths, error } = await supabaseClient.rpc('save_product_images', {
        p_product_id: productId,
        p_images: imageRows
      })
      if (error) throw error
      metadataSaved = true
      // The database trigger removes only detached files atomically with the
      // metadata update. Do not issue a second client-side delete here.
    } catch (error) {
      const { error: cleanupError } = !metadataSaved && uploadedPaths.length
        ? await supabaseClient.storage.from('product-images').remove(uploadedPaths)
        : { error: null }
      if (cleanupError) console.error('Falha limpando uploads incompletos:', cleanupError)
      console.error('Erro ao salvar imagens do produto:', error)
      throw new Error(`Não foi possível salvar as imagens: ${error.message}`)
    }
  },
  async uploadProductImage(productId, file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) throw new Error('Formato inválido. Use JPG, PNG ou WebP.')
    if (file.size > 10 * 1024 * 1024) throw new Error('Cada imagem deve ter no máximo 10 MB.')
    const blob = await this._toWebp(file)
    const fileName = `${crypto.randomUUID()}.webp`
    const path = `${productId}/${fileName}`
    const { error } = await supabaseClient.storage.from('product-images').upload(path, blob, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: false
    })
    if (error) throw error
    return path
  },
  _toWebp(file) {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file)
      const image = new Image()
      image.onload = () => {
        const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.naturalWidth * scale)
        canvas.height = Math.round(image.naturalHeight * scale)
        const context = canvas.getContext('2d')
        if (!context) {
          URL.revokeObjectURL(objectUrl)
          reject(new Error('Não foi possível preparar a imagem neste navegador.'))
          return
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(blob => {
          URL.revokeObjectURL(objectUrl)
          if (blob) resolve(blob)
          else reject(new Error('Não foi possível converter a imagem para WebP.'))
        }, 'image/webp', 0.88)
      }
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Arquivo de imagem inválido ou corrompido.'))
      }
      image.src = objectUrl
    })
  },
  async deleteProduct(id) {
    const { error } = await supabaseClient.from('products').delete().eq('id', id)
    if (error) {
      console.error('Erro ao excluir produto:', error)
      throw new Error(`Não foi possível excluir o produto: ${error.message}`)
    }
    // Cascade deletion invokes the database trigger that removes Storage
    // objects in the same transaction as the metadata deletion.
  },
  async upsertProduct(product) {
    const payload = mapProductToDB(product)
    if (product.id) {
      const { error } = await supabaseClient.from('products').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', product.id)
      if (error) {
        console.error('Erro ao atualizar produto:', error)
        throw new Error(`Não foi possível atualizar o produto: ${error.message}`)
      }
      return product.id
    } else {
      const { data, error } = await supabaseClient.from('products').insert({ ...payload, status: 'draft', is_active: false })
        .select('id').single()
      if (error) {
        console.error('Erro ao criar produto:', error)
        throw new Error(`Não foi possível criar o produto: ${error.message}`)
      }
      return data.id
    }
  },
  async getAdminProducts({ page = 0, pageSize = 25, search = '', category = '', status = '' } = {}) {
    return this.getProducts({ includeInactive: true, includeImages: true, page, pageSize, search, category, status })
  },
  async getProductCategories() {
    const { data, error } = await supabaseClient.from('categories').select('id, name, slug, parent_id').order('name')
    if (error) {
      console.error('Erro ao buscar categorias:', error)
      throw new Error(`Não foi possível carregar as categorias: ${error.message}`)
    }
    return data
  },
  async createProductCategory(name) {
    const slug = _productSlug(name)
    const { data, error } = await supabaseClient.from('categories')
      .insert({ name, slug }).select('id, name, slug, parent_id').single()
    if (error) {
      console.error('Erro ao criar categoria:', error)
      throw new Error(`Não foi possível criar a categoria: ${error.message}`)
    }
    return data
  },
  async renameProductCategory(id, name) {
    const { error } = await supabaseClient.rpc('rename_product_category', {
      p_category_id: id,
      p_name: name,
      p_slug: _productSlug(name)
    })
    if (error) {
      console.error('Erro ao renomear categoria:', error)
      throw new Error(`Não foi possível renomear a categoria: ${error.message}`)
    }
  },
  async deleteProductCategory(id) {
    const { error } = await supabaseClient.rpc('delete_product_category', { p_category_id: id })
    if (error) {
      console.error('Erro ao excluir categoria:', error)
      throw new Error(`Não foi possível excluir a categoria: ${error.message}`)
    }
  },
  async updateProductStatus(id, status) {
    const { error } = await supabaseClient.from('products')
      .update({ status, is_active: status === 'active', updated_at: new Date().toISOString() }).eq('id', id)
    if (error) {
      console.error('Erro ao atualizar publicação:', error)
      throw new Error(`Não foi possível atualizar o status do produto: ${error.message}`)
    }
  },

  /* ── Blog (Supabase) ──────────────────────────────────── */
  async getBlogPosts() {
    const { data, error } = await supabaseClient.from('blog_posts').select('*').order('created_at', { ascending: false })
    if (error) { console.error('Erro ao buscar posts:', error); return [] }
    return data.map(mapPostFromDB)
  },
  async deletePost(id) {
    const { error } = await supabaseClient.from('blog_posts').delete().eq('id', id)
    if (error) console.error('Erro ao excluir post:', error)
  },
  async upsertPost(post) {
    const payload = mapPostToDB(post)
    if (post.id) {
      const { error } = await supabaseClient.from('blog_posts').update(payload).eq('id', post.id)
      if (error) {
        console.error('Erro ao atualizar post:', error)
        throw new Error(`Não foi possível atualizar o post: ${error.message}`)
      }
    } else {
      const { error } = await supabaseClient.from('blog_posts').insert(payload)
      if (error) {
        console.error('Erro ao criar post:', error)
        throw new Error(`Não foi possível criar o post: ${error.message}`)
      }
    }
  },

  /* ── Loja Física ──────────────────────────────────────── */
  getLojaFisica() {
    const raw = localStorage.getItem('cms_loja_fisica')
    if (raw) return JSON.parse(raw)
    return {
      about:    '',
      address:  '',
      hours:    '',
      phone:    '',
      whatsapp: '',
      mapEmbed: '',
      gallery:  []
    }
  },
  saveLojaFisica(data) {
    localStorage.setItem('cms_loja_fisica', JSON.stringify(data))
  },
  async getStoreContent() {
    const { data, error } = await supabaseClient.from('store_content').select('*').eq('id', true).maybeSingle()
    if (error) throw error
    return data ? { ...data, hours: data.hours?.weekday || '' } : {}
  },
  async saveStoreContent(data) {
    const { error } = await supabaseClient.from('store_content').upsert({
      id: true,
      address: data.address || '', phone: data.phone || '', whatsapp: data.whatsapp || '',
      hours: { weekday: data.hours || '' }, updated_at: new Date().toISOString()
    }, { onConflict: 'id' })
    if (error) throw error
  },

  /* ── Novidades (banner + config) ──────────────────────── */
  getNovidades() {
    const raw = localStorage.getItem('cms_novidades')
    if (raw) return JSON.parse(raw)
    return {
      heroTitle:    '',
      heroSubtitle: '',
      heroBg:       '',
      showCategories: []
    }
  },
  saveNovidades(data) {
    localStorage.setItem('cms_novidades', JSON.stringify(data))
  },

  /* ── Banners do Hero (index) ──────────────────────────── */
  getBanners() {
    const raw = localStorage.getItem('cms_banners')
    if (raw) return JSON.parse(raw)
    return []
  },
  saveBanners(arr) {
    localStorage.setItem('cms_banners', JSON.stringify(arr))
  },

  /* ── Categorias de Produtos (Supabase) ─────────────────── */
  async getCategories() {
    const { data, error } = await supabaseClient.from('categories').select('name').order('name')
    if (error) {
      console.error('Erro ao buscar categorias:', error)
      throw new Error(`Não foi possível carregar as categorias: ${error.message}`)
    }
    return data.map(c => c.name)
  },
  async addCategory(name) {
    const { error } = await supabaseClient.from('categories').insert({ name, slug: _productSlug(name) })
    if (error) {
      console.error('Erro ao criar categoria:', error)
      throw new Error(`Não foi possível criar a categoria: ${error.message}`)
    }
    return this.getCategories()
  },

  /* ── Coleções (Supabase) ────────────────────────────────
     Um produto pode pertencer a várias coleções (tabela de ligação
     product_collections). "is_featured" marca a coleção que o botão
     "Ver Coleção" da home deve abrir. */
  async getCollections() {
    const { data, error } = await supabaseClient.from('collections').select('*').order('name')
    if (error) { console.error('Erro ao buscar coleções:', error); return [] }
    return data
  },
  async addCollection(name) {
    const { error } = await supabaseClient.from('collections').insert({ name })
    if (error) console.error('Erro ao criar coleção:', error)
    return this.getCollections()
  },
  async deleteCollection(id) {
    const { error } = await supabaseClient.from('collections').delete().eq('id', id)
    if (error) console.error('Erro ao excluir coleção:', error)
  },
  async setFeaturedCollection(id) {
    // Só uma coleção pode estar em destaque por vez.
    const { error: e1 } = await supabaseClient.from('collections').update({ is_featured: false }).neq('id', id)
    const { error: e2 } = await supabaseClient.from('collections').update({ is_featured: true }).eq('id', id)
    if (e1 || e2) console.error('Erro ao destacar coleção:', e1 || e2)
  },
  async getFeaturedCollection() {
    const { data, error } = await supabaseClient.from('collections').select('*').eq('is_featured', true).limit(1).maybeSingle()
    if (error) { console.error('Erro ao buscar coleção em destaque:', error); return null }
    return data
  },
  async getProductCollections(productId) {
    const { data, error } = await supabaseClient.from('product_collections').select('collection_id').eq('product_id', productId)
    if (error) {
      console.error('Erro ao buscar coleções do produto:', error)
      throw new Error(`Não foi possível carregar as coleções do produto: ${error.message}`)
    }
    return data.map(r => r.collection_id)
  },
  async getProductCollectionsMap() {
    const { data, error } = await supabaseClient.from('product_collections').select('product_id, collection_id')
    if (error) { console.error('Erro ao buscar vínculos produto-coleção:', error); return {} }
    const map = {}
    data.forEach(({ product_id, collection_id }) => {
      if (!map[product_id]) map[product_id] = []
      map[product_id].push(collection_id)
    })
    return map
  },
  async setProductCollections(productId, collectionIds) {
    const { error: delError } = await supabaseClient.from('product_collections').delete().eq('product_id', productId)
    if (delError) {
      console.error('Erro ao limpar coleções do produto:', delError)
      throw new Error(`Não foi possível atualizar as coleções do produto: ${delError.message}`)
    }
    if (!collectionIds.length) return
    const rows = collectionIds.map(collection_id => ({ product_id: productId, collection_id }))
    const { error } = await supabaseClient.from('product_collections').insert(rows)
    if (error) {
      console.error('Erro ao vincular coleções ao produto:', error)
      throw new Error(`Não foi possível vincular as coleções: ${error.message}`)
    }
  },

  /* ── Helpers ──────────────────────────────────────────── */
  _newId(arr) {
    return arr.length > 0 ? Math.max(...arr.map(i => i.id || 0)) + 1 : 1
  },

  /** Converte File → base64 data URL (retorna Promise) */
  fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload  = e => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  /** Redimensiona imagem antes de salvar (evita localStorage cheio) */
  resizeImage(dataUrl, maxW = 800, maxH = 800, quality = 0.82) {
    return new Promise(resolve => {
      const img = new Image()
      img.onload = () => {
        let { width: w, height: h } = img
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h)
          w = Math.round(w * ratio)
          h = Math.round(h * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width  = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = dataUrl
    })
  }
}
