const NovidadesContent = {
  staff: false,
  data: null,
  defaults: {
    hero: { eyebrow: 'Nova coleção', title: 'Novidades', accent: 'em Alta', subtitle: 'Uma curadoria fresca de peças femininas para renovar seus looks.', image: 'assets/images/roupas/717249195_18138506848550228_5973150353313444939_n.jpg', cropX: 50, cropY: 35, zoom: 1 },
    categories: ['Todos', 'Vestidos', 'Conjuntos', 'Blusas', 'Calças', 'Looks', 'Shorts', 'Saias'],
    spotlight: { label: 'Destaque da Semana', eyebrow: 'Escolha da curadoria', title: 'Elegância que acompanha você', description: 'Modelagens femininas, tecidos confortáveis e detalhes que transformam qualquer produção.', button: 'Conhecer a coleção', link: 'shop.html', image: 'assets/images/roupas/672350601_18133246030550228_6238487994570565479_n.jpg', cropX: 50, cropY: 25, zoom: 1 },
    editorial: {
      label: 'Editorial — Peças que Chegaram',
      cards: [
        { eyebrow: 'Novo drop', title: 'Leveza em tons naturais', link: 'shop.html', image: 'assets/images/roupas/669751611_18132869941550228_8766216536007574101_n.jpg', cropX: 50, cropY: 28, zoom: 1 },
        { eyebrow: 'Essenciais', title: 'Conjuntos versáteis', link: 'shop.html', image: 'assets/images/roupas/661360880_18132584527550228_8380790774553928034_n.jpg', cropX: 50, cropY: 30, zoom: 1 },
        { eyebrow: 'Favoritos', title: 'Detalhes que encantam', link: 'shop.html', image: 'assets/images/roupas/659087011_18132595411550228_5594839873839737808_n.jpg', cropX: 50, cropY: 30, zoom: 1 },
        { eyebrow: 'Coleção', title: 'Produções para todos os momentos', link: 'shop.html', image: 'assets/images/roupas/640145856_18127728499550228_8066820905867045664_n.jpg', cropX: 50, cropY: 28, zoom: 1 },
        { eyebrow: 'Em alta', title: 'Silhuetas contemporâneas', link: 'shop.html', image: 'assets/images/roupas/636821417_18127353193550228_3736310066042731541_n.jpg', cropX: 50, cropY: 30, zoom: 1 },
        { eyebrow: 'Inspiração', title: 'Seu próximo look favorito', link: 'shop.html', image: 'assets/images/roupas/627966202_18126319933550228_2017830461251108621_n.jpg', cropX: 50, cropY: 28, zoom: 1 }
      ]
    },
    countdown: { eyebrow: 'Drop Semanal', title: 'Novas peças toda semana!', subtitle: 'Acompanhe os lançamentos e encontre seu novo look favorito.', target: '' },
    products: { title: 'Todos os', accent: 'Novos', emptyEyebrow: 'Próximo lançamento', emptyTitle: 'Seleção de novidades em preparação', emptyDescription: 'Cadastre produtos como novidade no CRM para preencher esta vitrine automaticamente.', emptyButton: 'Ir para o catálogo', emptyLink: 'shop.html', image: 'assets/images/roupas/611774660_18123418903550228_8019439332005677215_n.jpg', cropX: 50, cropY: 25, zoom: 1 }
  },

  escape(value = '') { const el = document.createElement('div'); el.textContent = value; return el.innerHTML },
  merge(remote = {}) {
    return {
      ...this.defaults, ...remote,
      hero: { ...this.defaults.hero, ...(remote.hero || {}) },
      spotlight: { ...this.defaults.spotlight, ...(remote.spotlight || {}) },
      editorial: { ...this.defaults.editorial, ...(remote.editorial || {}), cards: remote.editorial?.cards?.length ? remote.editorial.cards : this.defaults.editorial.cards },
      countdown: { ...this.defaults.countdown, ...(remote.countdown || {}) },
      products: { ...this.defaults.products, ...(remote.products || {}) }
    }
  },
  editButtons(section, index = '') {
    if (!this.staff) return ''
    const suffix = index === '' ? '' : ` data-index="${index}"`
    return `<span class="nov-edit-actions"><button class="nov-edit-btn" data-edit-text="${section}"${suffix} aria-label="Editar textos" title="Editar textos">${UIIcons.svg('edit')}</button><button class="nov-edit-btn" data-edit-image="${section}"${suffix} aria-label="Ajustar imagem" title="Ajustar imagem">${UIIcons.svg('image')}</button></span>`
  },
  textButton(section) { return this.staff ? `<button class="nov-edit-btn nov-edit-btn--single" data-edit-text="${section}" aria-label="Editar seção" title="Editar seção">${UIIcons.svg('edit')}</button>` : '' },

  async init() {
    this.data = this.merge()
    this.render()
    this.bind()

    const contentRequest = supabaseClient.from('novidades_content').select('content').eq('id', true).maybeSingle()
    const staffRequest = (async () => {
      const user = await SupabaseAuth.getCurrentUser()
      return user ? SupabaseAuth.getCurrentUserProfile() : null
    })()
    const [contentResult, staffResult] = await Promise.allSettled([contentRequest, staffRequest])

    const remoteContent = contentResult.status === 'fulfilled' && !contentResult.value.error
      ? contentResult.value.data?.content
      : null
    const nextStaff = staffResult.status === 'fulfilled' && ['admin', 'hr'].includes(staffResult.value?.role)
    if (contentResult.status === 'rejected' || contentResult.value?.error) {
      console.warn('Conteúdo de Novidades usando o modelo local:', contentResult.reason?.message || contentResult.value?.error?.message)
    }
    if (remoteContent || nextStaff !== this.staff) {
      if (remoteContent) this.data = this.merge(remoteContent)
      this.staff = nextStaff
      this.render()
      this.bind()
    }
  },

  render() {
    const d = this.data
    const hero = document.querySelector('.nov-page-header')
    if (hero) {
      hero.innerHTML = `<div class="nov-page-header__media"><img src="${this.escape(d.hero.image)}" alt="" fetchpriority="high" style="object-position:${d.hero.cropX}% ${d.hero.cropY}%;transform:scale(${d.hero.zoom})"></div><div class="nov-page-header__shade"></div><div class="nov-page-header__inner"><p class="nov-page-header__eyebrow">${this.escape(d.hero.eyebrow)}</p><h1 class="nov-page-header__title">${this.escape(d.hero.title)} <em>${this.escape(d.hero.accent)}</em></h1><p class="nov-page-header__sub">${this.escape(d.hero.subtitle)}</p><nav class="nov-page-header__breadcrumb" aria-label="Breadcrumb"><a href="index.html">Início</a><span class="sep">/</span><span>Novidades</span></nav>${this.editButtons('hero')}</div>`
    }
    const cats = document.querySelector('.nov-cats__inner')
    if (cats) cats.innerHTML = d.categories.map((cat, index) => `<button class="nov-cat-btn ${index === 0 ? 'is-active' : ''}" data-cat="${index === 0 ? 'all' : this.escape(cat)}">${this.escape(cat)}</button>`).join('') + this.textButton('categories')

    const spotlightLabel = document.querySelector('.nov-spotlight .nov-section-label')
    if (spotlightLabel) spotlightLabel.innerHTML = `${this.escape(d.spotlight.label)}${this.textButton('spotlightLabel')}`
    const spotlight = document.getElementById('nov-spotlight-card')
    if (spotlight) spotlight.innerHTML = `<div class="nov-spotlight__img-wrap"><img src="${this.escape(d.spotlight.image)}" alt="${this.escape(d.spotlight.title)}" class="nov-spotlight__img" style="object-position:${d.spotlight.cropX}% ${d.spotlight.cropY}%;transform:scale(${d.spotlight.zoom})"><span class="badge-novo">Novidade</span>${this.editButtons('spotlight')}</div><div class="nov-spotlight__info"><p class="nov-spotlight__cat">${this.escape(d.spotlight.eyebrow)}</p><h2 class="nov-spotlight__name">${this.escape(d.spotlight.title)}</h2><p class="nov-spotlight__desc">${this.escape(d.spotlight.description)}</p><div class="nov-spotlight__actions"><a href="${this.escape(d.spotlight.link)}" class="btn btn--primary">${this.escape(d.spotlight.button)}</a></div>${this.staff ? `<button class="nov-edit-btn nov-edit-btn--content" data-edit-text="spotlight" aria-label="Editar conteúdo">${UIIcons.svg('edit')}</button>` : ''}</div>`

    const editorialLabel = document.querySelector('.nov-mosaic .nov-section-label')
    if (editorialLabel) editorialLabel.innerHTML = `${this.escape(d.editorial.label)}${this.textButton('editorialLabel')}`
    const mosaic = document.getElementById('nov-mosaic-grid')
    if (mosaic) mosaic.innerHTML = d.editorial.cards.map((card, index) => `<article class="mos-card"><img src="${this.escape(card.image)}" alt="${this.escape(card.title)}" class="mos-card__img" style="object-position:${card.cropX}% ${card.cropY}%;transform:scale(${card.zoom})"><div class="mos-card__overlay"></div><div class="mos-card__body"><p class="mos-card__cat">${this.escape(card.eyebrow)}</p><p class="mos-card__name">${this.escape(card.title)}</p></div>${this.editButtons('editorial', index)}<a class="mos-card__link" href="${this.escape(card.link)}" aria-label="${this.escape(card.title)}"></a></article>`).join('')

    const countdown = document.querySelector('.nov-countdown>div:first-child')
    if (countdown) countdown.innerHTML = `<p class="nov-countdown__eyebrow">${this.escape(d.countdown.eyebrow)}</p><h2 class="nov-countdown__title">${this.escape(d.countdown.title)}</h2><p class="nov-countdown__sub">${this.escape(d.countdown.subtitle)}</p>${this.textButton('countdown')}`
    const heading = document.querySelector('.nov-all__heading')
    if (heading) heading.innerHTML = `${this.escape(d.products.title)} <span>${this.escape(d.products.accent)}</span>${this.textButton('products')}`
  },

  bind() {
    document.querySelectorAll('[data-edit-text]').forEach(button => button.onclick = event => { event.preventDefault(); event.stopPropagation(); this.openText(button.dataset.editText, button.dataset.index) })
    document.querySelectorAll('[data-edit-image]').forEach(button => button.onclick = event => { event.preventDefault(); event.stopPropagation(); this.openImage(button.dataset.editImage, button.dataset.index) })
    document.querySelectorAll('.nov-cat-btn').forEach(button => button.onclick = () => {
      document.querySelectorAll('.nov-cat-btn').forEach(item => item.classList.remove('is-active'))
      button.classList.add('is-active')
      if (typeof renderGrid === 'function') { currentCat = button.dataset.cat; renderGrid() }
    })
  },
  fields(section, index) {
    const d = this.data
    if (section === 'hero') return { target: d.hero, fields: [['eyebrow','Chamada curta'],['title','Título principal'],['accent','Título em destaque'],['subtitle','Descrição','textarea']] }
    if (section === 'spotlight') return { target: d.spotlight, fields: [['eyebrow','Chamada curta'],['title','Título'],['description','Descrição','textarea'],['button','Texto do botão'],['link','Link do botão']] }
    if (section === 'editorial') return { target: d.editorial.cards[Number(index)], fields: [['eyebrow','Chamada curta'],['title','Título'],['link','Link']] }
    if (section === 'countdown') return { target: d.countdown, fields: [['eyebrow','Chamada curta'],['title','Título'],['subtitle','Descrição','textarea'],['target','Data final','datetime-local']] }
    if (section === 'products') return { target: d.products, fields: [['title','Título'],['accent','Texto em destaque']] }
    if (section === 'productsEmpty') return { target: d.products, fields: [['emptyEyebrow','Chamada curta'],['emptyTitle','Título'],['emptyDescription','Descrição','textarea'],['emptyButton','Texto do botão'],['emptyLink','Link do botão']] }
    if (section === 'categories') return { target: d, fields: [['categories','Categorias (uma por linha)','textarea']] }
    if (section === 'spotlightLabel') return { target: d.spotlight, fields: [['label','Título da seção']] }
    return { target: d.editorial, fields: [['label','Título da seção']] }
  },
  openText(section, index = '') {
    const config = this.fields(section, index)
    const modal = document.createElement('div'); modal.className = 'nov-editor-modal'
    modal.innerHTML = `<form class="nov-editor-modal__panel" role="dialog" aria-modal="true" aria-labelledby="nov-editor-title"><header><div><span>Conteúdo de Novidades</span><strong id="nov-editor-title">Editar textos</strong><p>As alterações serão publicadas nesta página.</p></div><button type="button" data-close aria-label="Fechar">${UIIcons.svg('x')}</button></header><div class="nov-editor-form">${config.fields.map(([key,label,type='text']) => `<label>${label}${type === 'textarea' ? `<textarea name="${key}" rows="4">${this.escape(key === 'categories' ? config.target[key].join('\n') : config.target[key])}</textarea>` : `<input name="${key}" type="${type}" value="${this.escape(config.target[key] || '')}">`}</label>`).join('')}</div><footer><button type="button" class="nov-editor-cancel" data-close>Cancelar</button><button class="nov-editor-save" type="submit">Salvar alterações</button></footer></form>`
    document.body.append(modal); this.modalEvents(modal)
    modal.querySelector('form').onsubmit = async event => {
      event.preventDefault(); const values = new FormData(event.currentTarget)
      config.fields.forEach(([key]) => { config.target[key] = key === 'categories' ? String(values.get(key)).split('\n').map(v => v.trim()).filter(Boolean) : String(values.get(key) || '') })
      const button = modal.querySelector('.nov-editor-save'); button.disabled = true; button.textContent = 'Salvando…'
      try { await this.save(); modal._close(); this.render(); if (section === 'productsEmpty' && typeof renderIllustrativeLayout === 'function') renderIllustrativeLayout(); this.bind() }
      catch (error) { Toast.show('Não foi possível salvar.', error.message, 'error'); button.disabled = false; button.textContent = 'Salvar alterações' }
    }
  },
  getImage(section, index) { return section === 'hero' ? this.data.hero : section === 'spotlight' ? this.data.spotlight : section === 'productsEmpty' ? this.data.products : this.data.editorial.cards[Number(index)] },
  openImage(section, index = '') {
    const item = this.getImage(section, index); let objectUrl = ''; let file = null
    const modal = document.createElement('div'); modal.className = 'nov-editor-modal'
    const aspect = section === 'hero' ? '16/5' : section === 'spotlight' ? '1/1' : '4/3'
    modal.innerHTML = `<div class="nov-editor-modal__panel nov-image-editor" role="dialog" aria-modal="true" aria-labelledby="nov-image-title"><header><div><span>Editor de imagem</span><strong id="nov-image-title">Ajustar foto</strong><p>Defina exatamente como a imagem aparecerá na página.</p></div><button type="button" data-close aria-label="Fechar">${UIIcons.svg('x')}</button></header><div class="nov-image-editor__body"><div class="nov-image-stage" style="aspect-ratio:${aspect}" tabindex="0" role="application" aria-label="Arraste ou use as teclas de direção para reposicionar"><img src="${this.escape(item.image)}" alt="Prévia"><span>${UIIcons.svg('arrowUp')} Arraste ou use as teclas de direção para reposicionar</span></div><div class="nov-image-zoom"><button type="button" data-step="-.1" aria-label="Diminuir zoom">−</button><input type="range" min="1" max="3" step=".05" value="${item.zoom || 1}" aria-label="Zoom"><button type="button" data-step=".1" aria-label="Aumentar zoom">+</button></div><label class="nov-image-change">${UIIcons.svg('image')} Trocar imagem<input type="file" accept="image/jpeg,image/png,image/webp" hidden></label><p>JPG, PNG ou WebP. Tamanho máximo de 8 MB.</p></div><footer><button type="button" class="nov-editor-cancel" data-close>Cancelar</button><button class="nov-editor-save" type="button" data-save>Salvar</button></footer></div>`
    document.body.append(modal); this.modalEvents(modal, () => { if (objectUrl) URL.revokeObjectURL(objectUrl) })
    const stage = modal.querySelector('.nov-image-stage'), preview = stage.querySelector('img'), zoom = modal.querySelector('input[type=range]')
    let cropX = Number(item.cropX) || 50, cropY = Number(item.cropY) || 50, cropZoom = Number(item.zoom) || 1, drag = null
    const clamp = value => Math.max(0, Math.min(100, value)); const update = () => { preview.style.objectPosition = `${cropX}% ${cropY}%`; preview.style.transform = `scale(${cropZoom})`; zoom.value = cropZoom }; update()
    stage.onpointerdown = event => { stage.focus(); stage.setPointerCapture(event.pointerId); drag = { x:event.clientX,y:event.clientY,cropX,cropY }; stage.classList.add('is-dragging') }
    stage.onpointermove = event => { if (!drag) return; const rect=stage.getBoundingClientRect(); cropX=clamp(drag.cropX-((event.clientX-drag.x)/rect.width)*100/cropZoom); cropY=clamp(drag.cropY-((event.clientY-drag.y)/rect.height)*100/cropZoom); update() }
    stage.onpointerup = stage.onpointercancel = () => { drag=null; stage.classList.remove('is-dragging') }
    stage.onkeydown = event => { const move={ArrowLeft:[2,0],ArrowRight:[-2,0],ArrowUp:[0,2],ArrowDown:[0,-2]}[event.key]; if(!move)return; event.preventDefault(); cropX=clamp(cropX+move[0]); cropY=clamp(cropY+move[1]); update() }
    zoom.oninput = () => { cropZoom=Number(zoom.value); update() }
    modal.querySelectorAll('[data-step]').forEach(button => button.onclick=()=>{ cropZoom=Math.max(1,Math.min(3,cropZoom+Number(button.dataset.step))); update() })
    modal.querySelector('input[type=file]').onchange = event => { file=event.target.files?.[0]; if(!file)return; if(objectUrl)URL.revokeObjectURL(objectUrl); objectUrl=URL.createObjectURL(file); preview.src=objectUrl; cropX=50; cropY=50; cropZoom=1; update() }
    modal.querySelector('[data-save]').onclick = async () => { const button=modal.querySelector('[data-save]'); button.disabled=true; button.textContent='Salvando…'; try { if(file)item.image=await this.upload(file); item.cropX=cropX; item.cropY=cropY; item.zoom=cropZoom; await this.save(); modal._close(); this.render(); if (section === 'productsEmpty' && typeof renderIllustrativeLayout === 'function') renderIllustrativeLayout(); this.bind() } catch(error){ Toast.show('Não foi possível salvar a imagem.', error.message, 'error'); button.disabled=false; button.textContent='Salvar' } }
  },
  modalEvents(modal, cleanup = () => {}) {
    const controller = new AbortController(); const close = () => { controller.abort(); cleanup(); modal.remove() }; modal._close=close
    modal.querySelectorAll('[data-close]').forEach(button => button.onclick=close)
    document.addEventListener('keydown', event => { if(event.key==='Escape')close() }, { signal:controller.signal })
  },
  async upload(file) {
    if (file.size > 8 * 1024 * 1024) throw new Error('A imagem ultrapassa 8 MB.')
    const extension=(file.name.split('.').pop() || 'jpg').toLowerCase(); const path=`${Date.now()}-${crypto.randomUUID()}.${extension}`
    const { error }=await supabaseClient.storage.from('novidades-media').upload(path,file,{cacheControl:'3600',upsert:false}); if(error)throw error
    return supabaseClient.storage.from('novidades-media').getPublicUrl(path).data.publicUrl
  },
  async save() {
    const { error }=await supabaseClient.from('novidades_content').upsert({id:true,content:this.data,updated_at:new Date().toISOString()},{onConflict:'id'}); if(error)throw error
    Toast.show('Conteúdo atualizado.', 'As alterações já estão publicadas.', 'success')
  }
}

document.addEventListener('DOMContentLoaded', () => { NovidadesContent.ready = NovidadesContent.init() })
