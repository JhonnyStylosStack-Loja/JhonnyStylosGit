const StoreGallery = {
  images: [], selected: 0, staff: false,
  editButton: '<button class="store-gallery-edit" data-store-gallery-edit aria-label="Editar imagem" title="Editar imagem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg></button>',
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
          item.insertAdjacentHTML('beforeend', this.editButton)
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
        ${this.staff ? this.editButton : ''}
      </div>`).join('')
    root.querySelectorAll('[data-store-gallery-edit]').forEach(button => button.addEventListener('click', () => this.open()))
  },
  open() {
    const previousModal = document.getElementById('store-gallery-modal')
    if (previousModal) previousModal._close ? previousModal._close() : previousModal.remove()
    const current = this.images[this.selected]
    const modal = document.createElement('div')
    modal.id = 'store-gallery-modal'
    modal.className = 'store-gallery-modal'
    modal.innerHTML = `<div class="store-gallery-modal__panel" role="dialog" aria-modal="true" aria-labelledby="store-gallery-title">
      <header><div><span class="store-gallery-modal__eyebrow">Editor de imagem</span><strong id="store-gallery-title">Galeria da Loja Física</strong></div><button data-close aria-label="Fechar">${UIIcons.svg('x')}</button></header>
      <div class="store-gallery-modal__body">
        <div class="store-gallery-editor-list" aria-label="Imagens da galeria">${this.images.map((image, index) => `<button class="store-gallery-thumb ${index === this.selected ? 'is-active' : ''}" data-index="${index}" aria-label="Editar imagem ${index + 1}"><img src="${image.url}" alt=""></button>`).join('')}<label class="store-gallery-add" aria-label="Adicionar imagens">${UIIcons.svg('plus')}<input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden></label></div>
        ${current ? `<div class="store-gallery-crop" id="store-crop-stage" tabindex="0" role="application" aria-label="Reposicione a imagem arrastando ou usando as teclas de direção">
          <img src="${current.url}" id="store-crop-preview" alt="Prévia do recorte" style="object-position:${current.crop_x}% ${current.crop_y}%;transform:scale(${current.crop_zoom})">
          <span class="store-gallery-drag-hint">${UIIcons.svg('arrowUp')} Arraste ou use as teclas de direção para reposicionar</span>
        </div>
        <div class="store-gallery-zoom"><button type="button" data-zoom-step="-.1" aria-label="Diminuir zoom">−</button><input data-zoom type="range" min="1" max="3" step=".05" value="${current.crop_zoom}" aria-label="Zoom da imagem"><button type="button" data-zoom-step=".1" aria-label="Aumentar zoom">+</button></div>
        <p class="store-gallery-help">A área exibida na prévia será o recorte usado no site.</p>` : `<label class="store-gallery-empty">${UIIcons.svg('image')}<strong>Adicione uma imagem para começar</strong><span>JPG, PNG ou WebP</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden></label>`}
      </div>
      <footer><button class="store-gallery-cancel" data-close>Cancelar</button><button class="store-gallery-confirm" data-save ${current ? '' : 'disabled'}>Salvar</button></footer></div>`
    document.body.append(modal)
    const events = new AbortController()
    const close = () => { events.abort(); modal.remove() }
    modal._close = close
    modal.querySelectorAll('[data-close]').forEach(button => button.onclick = close)
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') close()
    }, { signal: events.signal })
    modal.querySelectorAll('[data-index]').forEach(button => button.onclick = () => { this.selected = Number(button.dataset.index); this.open() })
    modal.querySelectorAll('input[type=file]').forEach(input => { input.onchange = event => this.addFiles(event.target.files) })

    const stage = modal.querySelector('#store-crop-stage')
    const preview = modal.querySelector('#store-crop-preview')
    const zoom = modal.querySelector('[data-zoom]')
    const clamp = value => Math.max(0, Math.min(100, value))
    const updatePreview = () => {
      if (!current || !preview) return
      preview.style.objectPosition = `${current.crop_x}% ${current.crop_y}%`
      preview.style.transform = `scale(${current.crop_zoom})`
      if (zoom) zoom.value = current.crop_zoom
    }

    if (current && stage) {
      let drag = null
      const stopDrag = () => { drag = null; stage.classList.remove('is-dragging') }
      stage.addEventListener('pointerdown', event => {
        stage.focus()
        stage.setPointerCapture(event.pointerId)
        drag = { x: event.clientX, y: event.clientY, cropX: current.crop_x, cropY: current.crop_y }
        stage.classList.add('is-dragging')
      }, { signal: events.signal })
      stage.addEventListener('pointermove', event => {
        if (!drag) return
        const bounds = stage.getBoundingClientRect()
        current.crop_x = clamp(drag.cropX - ((event.clientX - drag.x) / bounds.width) * 100 / current.crop_zoom)
        current.crop_y = clamp(drag.cropY - ((event.clientY - drag.y) / bounds.height) * 100 / current.crop_zoom)
        updatePreview()
      }, { signal: events.signal })
      stage.addEventListener('pointerup', stopDrag, { signal: events.signal })
      stage.addEventListener('pointercancel', stopDrag, { signal: events.signal })
      stage.addEventListener('keydown', event => {
        const movement = { ArrowLeft: [2, 0], ArrowRight: [-2, 0], ArrowUp: [0, 2], ArrowDown: [0, -2] }[event.key]
        if (!movement) return
        event.preventDefault()
        current.crop_x = clamp(current.crop_x + movement[0])
        current.crop_y = clamp(current.crop_y + movement[1])
        updatePreview()
      }, { signal: events.signal })
      zoom.oninput = () => { current.crop_zoom = Number(zoom.value); updatePreview() }
      modal.querySelectorAll('[data-zoom-step]').forEach(button => {
        button.onclick = () => {
          current.crop_zoom = Math.max(1, Math.min(3, current.crop_zoom + Number(button.dataset.zoomStep)))
          updatePreview()
        }
      })
    }
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
    modal._close?.(); await this.load(); Toast.show('Galeria atualizada.', '', 'success')
  }
}
document.addEventListener('DOMContentLoaded', () => StoreGallery.init())
