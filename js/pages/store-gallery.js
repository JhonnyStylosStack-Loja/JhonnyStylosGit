const StoreGallery = {
  images: [], selected: 0, staff: false,
  async init() {
    const user = await SupabaseAuth.getCurrentUser()
    const profile = user ? await SupabaseAuth.getCurrentUserProfile() : null
    this.staff = ['admin', 'hr'].includes(profile?.role)
    await this.load()
  },
  async load() {
    const { data, error } = await supabaseClient.from('store_gallery_images').select('*').order('position')
    if (error) return console.error(error)
    const paths = data.map(item => item.storage_path)
    const signed = paths.length ? await supabaseClient.storage.from('store-gallery').createSignedUrls(paths, 3600) : { data: [] }
    this.images = data.map((item, index) => ({ ...item, url: signed.data?.[index]?.signedUrl || '' }))
    this.render()
  },
  render() {
    const root = document.getElementById('store-gallery-grid')
    if (!root) return
    if (!this.images.length) {
      if (this.staff) {
        root.querySelectorAll('.store-gallery__main, .store-gallery__item').forEach(item => {
          if (item.querySelector('[data-store-gallery-edit]')) return
          item.insertAdjacentHTML('beforeend', '<button class="store-gallery-edit" data-store-gallery-edit aria-label="Editar imagem">✎</button>')
        })
        root.querySelectorAll('[data-store-gallery-edit]').forEach(button => button.addEventListener('click', () => this.open()))
      }
      return
    }
    root.innerHTML = this.images.slice(0, 3).map((item, index) => `
      <div class="${index === 0 ? 'store-gallery__main' : 'store-gallery__item'}">
        <img src="${item.url}" alt="${item.alt || 'Loja Jhonny Styles'}" loading="lazy"
          style="object-position:${item.crop_x}% ${item.crop_y}%;transform:scale(${item.crop_zoom})">
        ${index === 0 ? '<div class="store-gallery__label"><span class="store-gallery__label-tag">Loja Física</span></div>' : ''}
        ${this.staff ? '<button class="store-gallery-edit" data-store-gallery-edit aria-label="Editar imagem">✎</button>' : ''}
      </div>`).join('')
    root.querySelectorAll('[data-store-gallery-edit]').forEach(button => button.addEventListener('click', () => this.open()))
  },
  open() {
    document.getElementById('store-gallery-modal')?.remove()
    const modal = document.createElement('div')
    modal.id = 'store-gallery-modal'
    modal.className = 'store-gallery-modal'
    modal.innerHTML = `<div class="store-gallery-modal__panel" role="dialog" aria-modal="true" aria-label="Editar imagens da loja">
      <header><strong>🖼️ Galeria da Loja Física</strong><button data-close>×</button></header>
      <p>Arraste para reordenar. Selecione uma foto para ajustar o recorte.</p>
      <div class="store-gallery-editor-list">${this.images.map((image, index) => `<button class="store-gallery-thumb ${index === this.selected ? 'is-active' : ''}" draggable="true" data-index="${index}"><img src="${image.url}" alt=""></button>`).join('')}</div>
      <label class="store-gallery-upload">＋ Adicionar imagens<input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden></label>
      <div class="store-gallery-crop">${this.images[this.selected] ? `<img src="${this.images[this.selected].url}" id="store-crop-preview" style="object-position:${this.images[this.selected].crop_x}% ${this.images[this.selected].crop_y}%;transform:scale(${this.images[this.selected].crop_zoom})">` : '<span>Adicione uma imagem para começar.</span>'}</div>
      <div class="store-gallery-controls"><label>Zoom <input data-crop="crop_zoom" type="range" min="1" max="3" step=".05" value="${this.images[this.selected]?.crop_zoom || 1}"></label><label>Horizontal <input data-crop="crop_x" type="range" min="0" max="100" value="${this.images[this.selected]?.crop_x || 50}"></label><label>Vertical <input data-crop="crop_y" type="range" min="0" max="100" value="${this.images[this.selected]?.crop_y || 50}"></label></div>
      <footer><button data-close>Cancelar</button><button class="store-gallery-confirm" data-save>Confirmar</button></footer></div>`
    document.body.append(modal)
    modal.querySelectorAll('[data-close]').forEach(button => button.onclick = () => modal.remove())
    modal.querySelectorAll('[data-index]').forEach(button => button.onclick = () => { this.selected = Number(button.dataset.index); this.open() })
    modal.querySelector('input[type=file]').onchange = event => this.addFiles(event.target.files)
    modal.querySelectorAll('[data-crop]').forEach(input => input.oninput = () => {
      const image = this.images[this.selected]; if (!image) return
      image[input.dataset.crop] = Number(input.value)
      const preview = modal.querySelector('#store-crop-preview')
      if (preview) preview.style.cssText = `object-position:${image.crop_x}% ${image.crop_y}%;transform:scale(${image.crop_zoom})`
    })
    modal.querySelector('[data-save]').onclick = () => this.save(modal)
  },
  async addFiles(files) {
    for (const file of files) {
      const path = `store/${crypto.randomUUID()}-${file.name.replace(/[^a-z0-9._-]/gi, '-')}`
      const { error } = await supabaseClient.storage.from('store-gallery').upload(path, file)
      if (error) return Toast.show('Não foi possível enviar a imagem.', error.message, 'error')
      this.images.push({ storage_path: path, alt: '', position: this.images.length, crop_x: 50, crop_y: 50, crop_zoom: 1, url: URL.createObjectURL(file), pending: true })
    }
    this.selected = this.images.length - 1
    this.open()
  },
  async save(modal) {
    const rows = this.images.map((image, position) => ({ storage_path: image.storage_path, alt: image.alt || '', position, crop_x: image.crop_x, crop_y: image.crop_y, crop_zoom: image.crop_zoom }))
    const { error } = await supabaseClient.from('store_gallery_images').upsert(rows, { onConflict: 'storage_path' })
    if (error) return Toast.show('Não foi possível salvar a galeria.', error.message, 'error')
    modal.remove(); await this.load(); Toast.show('Galeria atualizada.', '', 'success')
  }
}
document.addEventListener('DOMContentLoaded', () => StoreGallery.init())
