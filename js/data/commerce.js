/* Estado operacional do carrinho e dos favoritos. Não contém dados de catálogo. */
const Cart = {
  key: 'jhonnystylos_cart',
  _syncTimer: null,
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || [] } catch { return [] } },
  save(items) {
    localStorage.setItem(this.key, JSON.stringify(items))
    this.queueCloudSync()
  },
  add(product, qty = 1, size = 'M') {
    const items = this.get()
    const existing = items.find(item => item.id === product.id && item.size === size)
    if (existing) existing.qty += qty
    else items.push({ ...product, qty, size })
    this.save(items)
    return items
  },
  remove(productId, size) {
    const items = this.get().filter(item => !(item.id === productId && item.size === size))
    this.save(items)
    return items
  },
  updateQty(productId, size, qty) {
    const items = this.get()
    const item = items.find(current => current.id === productId && current.size === size)
    if (item) {
      if (qty <= 0) return this.remove(productId, size)
      item.qty = qty
    }
    this.save(items)
    return items
  },
  count() { return this.get().reduce((total, item) => total + item.qty, 0) },
  total() { return this.get().reduce((total, item) => total + (Number(item.price) * item.qty), 0) },
  clear() {
    localStorage.removeItem(this.key)
    this.queueCloudSync()
  },
  queueCloudSync() {
    clearTimeout(this._syncTimer)
    this._syncTimer = setTimeout(() => this.syncToCloud(), 500)
  },
  async _currentUser() {
    if (typeof supabaseClient === 'undefined') return null
    const { data: { user } } = await supabaseClient.auth.getUser()
    return user
  },
  async _getOrCreateCloudCart(userId) {
    const { data, error } = await supabaseClient.from('carts').upsert({ user_id: userId }, { onConflict: 'user_id' }).select('id').single()
    if (error) throw error
    return data
  },
  async syncToCloud() {
    try {
      const user = await this._currentUser()
      if (!user) return
      const cart = await this._getOrCreateCloudCart(user.id)
      const { error: deleteError } = await supabaseClient.from('cart_items').delete().eq('cart_id', cart.id)
      if (deleteError) throw deleteError
      const items = this.get()
      if (!items.length) return
      const rows = items.map(item => ({ cart_id: cart.id, product_id: String(item.id), product_name: item.name, image_url: item.image || null, size: item.size || 'M', quantity: item.qty, unit_price: item.price }))
      const { error: insertError } = await supabaseClient.from('cart_items').insert(rows)
      if (insertError) throw insertError
    } catch (error) { console.error('Erro ao sincronizar carrinho:', error) }
  },
  async mergeFromCloud() {
    try {
      const user = await this._currentUser()
      if (!user) return this.get()
      const cart = await this._getOrCreateCloudCart(user.id)
      const { data, error } = await supabaseClient.from('cart_items').select('product_id, product_name, image_url, size, quantity, unit_price').eq('cart_id', cart.id)
      if (error) throw error
      const merged = new Map()
      for (const item of data || []) merged.set(`${item.product_id}::${item.size}`, { id: item.product_id, name: item.product_name, image: item.image_url, size: item.size, qty: item.quantity, price: Number(item.unit_price) })
      for (const item of this.get()) {
        const key = `${item.id}::${item.size || 'M'}`
        const cloudItem = merged.get(key)
        merged.set(key, { ...cloudItem, ...item, qty: Math.max(cloudItem?.qty || 0, item.qty || 1) })
      }
      const items = [...merged.values()]
      this.save(items)
      return items
    } catch (error) {
      console.error('Erro ao recuperar carrinho:', error)
      return this.get()
    }
  }
}

const Wishlist = {
  key: 'jhonnystylos_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || [] } catch { return [] } },
  toggle(productId) {
    const list = this.get()
    const index = list.indexOf(productId)
    if (index >= 0) list.splice(index, 1)
    else list.push(productId)
    localStorage.setItem(this.key, JSON.stringify(list))
    return list.includes(productId)
  },
  has(productId) { return this.get().includes(productId) }
}
