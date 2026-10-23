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
    slug: row.sku || '',
    price: Number(row.price),
    comparePrice: row.original_price != null ? Number(row.original_price) : null,
    rating: Number(row.rating) || 0,
    reviews: row.review_count || 0,
    category: row.category,
    isNew: tags.includes('NOVO'),
    isSale: tags.includes('PROMO'),
    image: row.image_url,
    isActive: row.is_active
  }
}
function mapProductToDB(p) {
  return {
    name: p.name,
    description: p.description || '',
    category: p.category,
    price: p.price,
    original_price: p.comparePrice ?? null,
    image_url: p.image,
    sku: p.slug || p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    is_active: true,
    tags: [...(p.isNew ? ['NOVO'] : []), ...(p.isSale ? ['PROMO'] : [])],
    rating: p.rating || 0,
    review_count: p.reviews || 0
  }
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
    author: 'Jhonny Styles',
    image: row.image_url,
    content: row.content,
    isPublished: row.is_published
  }
}
function mapPostToDB(post) {
  return {
    title: post.title,
    slug: post.slug || post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    content: post.content,
    excerpt: post.excerpt || '',
    category: post.category,
    image_url: post.image,
    is_published: true
  }
}

const CMS = {
  /* ── Produtos (Supabase) ──────────────────────────────── */
  async getProducts() {
    const { data, error } = await supabaseClient.from('products').select('*').order('created_at', { ascending: false })
    if (error) { console.error('Erro ao buscar produtos:', error); return [] }
    return data.map(mapProductFromDB)
  },
  async deleteProduct(id) {
    const { error } = await supabaseClient.from('products').delete().eq('id', id)
    if (error) console.error('Erro ao excluir produto:', error)
  },
  async upsertProduct(product) {
    const payload = mapProductToDB(product)
    if (product.id) {
      const { error } = await supabaseClient.from('products').update(payload).eq('id', product.id)
      if (error) { console.error('Erro ao atualizar produto:', error); return null }
      return product.id
    } else {
      const { data, error } = await supabaseClient.from('products').insert(payload).select('id').single()
      if (error) { console.error('Erro ao criar produto:', error); return null }
      return data.id
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
      if (error) console.error('Erro ao atualizar post:', error)
    } else {
      const { error } = await supabaseClient.from('blog_posts').insert(payload)
      if (error) console.error('Erro ao criar post:', error)
    }
  },

  /* ── Loja Física ──────────────────────────────────────── */
  getLojaFisica() {
    const raw = localStorage.getItem('cms_loja_fisica')
    if (raw) return JSON.parse(raw)
    return {
      about:    'Somos uma loja de moda feminina com foco em estilo, qualidade e personalidade. Venha nos visitar!',
      address:  'Rua das Flores, 123 — Centro, Sua Cidade — SP',
      hours:    'Seg a Sex: 9h–18h | Sáb: 9h–14h',
      phone:    '(11) 99999-9999',
      whatsapp: '5511999999999',
      mapEmbed: '',
      gallery:  []
    }
  },
  saveLojaFisica(data) {
    localStorage.setItem('cms_loja_fisica', JSON.stringify(data))
  },

  /* ── Novidades (banner + config) ──────────────────────── */
  getNovidades() {
    const raw = localStorage.getItem('cms_novidades')
    if (raw) return JSON.parse(raw)
    return {
      heroTitle:    'Novidades',
      heroSubtitle: 'As últimas peças que chegaram na nossa loja',
      heroBg:       '',
      showCategories: ['Conjuntos', 'Vestidos', 'Blusas', 'Calças', 'Shorts']
    }
  },
  saveNovidades(data) {
    localStorage.setItem('cms_novidades', JSON.stringify(data))
  },

  /* ── Banners do Hero (index) ──────────────────────────── */
  getBanners() {
    const raw = localStorage.getItem('cms_banners')
    if (raw) return JSON.parse(raw)
    return [
      { id: 1, image: 'assets/images/banners/banner1.png', title: 'Seja bem<br><em>vinda!</em>', subtitle: 'Sua primeira vez aqui?', handle: '@jhonnystylos', link: 'shop.html' },
      { id: 2, image: 'assets/images/banners/banner2.png', title: 'Looks<br><em>Exclusivos</em>', subtitle: 'Nova coleção chegou!', handle: '@jhonnystylos', link: 'shop.html' }
    ]
  },
  saveBanners(arr) {
    localStorage.setItem('cms_banners', JSON.stringify(arr))
  },

  /* ── Categorias de Produtos (Supabase) ─────────────────── */
  async getCategories() {
    const { data, error } = await supabaseClient.from('categories').select('name').order('name')
    if (error) { console.error('Erro ao buscar categorias:', error); return [] }
    return data.map(c => c.name)
  },
  async addCategory(name) {
    const { error } = await supabaseClient.from('categories').insert({ name })
    if (error) console.error('Erro ao criar categoria:', error)
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
    if (error) { console.error('Erro ao buscar coleções do produto:', error); return [] }
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
    if (delError) { console.error('Erro ao limpar coleções do produto:', delError); return }
    if (!collectionIds.length) return
    const rows = collectionIds.map(collection_id => ({ product_id: productId, collection_id }))
    const { error } = await supabaseClient.from('product_collections').insert(rows)
    if (error) console.error('Erro ao vincular coleções ao produto:', error)
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
