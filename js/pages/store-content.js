const StoreContent = {
  data: null, staff: false, howImageUrl: 'assets/images/lojafisica/01.png',
  icons: {
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 13v-2a8 8 0 0 1 16 0v2"/><path d="M6 18H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h1v5Zm12 0h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1v5Z"/><path d="M18 18c0 2-2 3-4 3h-2"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.2 3h3l1.5 4-2 1.5a15 15 0 0 0 5.8 5.8l1.5-2 4 1.5v3a3 3 0 0 1-3 3C10.3 19.8 4.2 13.7 4.2 6A3 3 0 0 1 7.2 3Z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.5 2.8 1.8 4.1 4.6 4.9l1-1.1 2 .7c0 1.4-.9 2.5-2.3 2.5-3.7 0-7.3-3.5-7.3-7.2C7 7 8.1 6 9.5 6l.7 2-1.2.5Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    navigation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 4 16 6-7 3-3 7L4 4Z"/></svg>'
  },
  empty: {
    hero_tag: 'Nossa Loja Física', hero_title: 'Venha Nos', hero_title_emphasis: 'Visitar',
    hero_description: 'Uma experiência de moda que vai além do online. Experimente, sinta o tecido e se apaixone pelas peças em pessoa.',
    hero_address: 'Rua das Flores, 123 — Centro, Sua Cidade', hero_image_url: 'assets/images/lojafisica/01.png', hero_crop_x: 50, hero_crop_y: 50, hero_crop_zoom: 1,
    hero_whatsapp_url: 'https://wa.me/5500000000000', hero_whatsapp_label: 'Falar no WhatsApp',
    hero_shop_url: 'shop.html', hero_shop_label: 'Ver Produtos Online',
    hours: { weekday: '9h às 18h', saturday: '9h às 17h', sunday: 'Fechado', holidays: 'Consulte' },
    address: 'Rua das Flores, 123\nCentro — Sua Cidade, UF\nCEP: 00000-000', reference: 'Próximo ao Shopping Centro', maps_url: 'https://maps.google.com',
    phone: '(55) 0000-0000', whatsapp: '5500000000000', instagram: '@jhonnystylos', email: 'contato@jhonnystylos.com',
    how_title: 'Fácil de Encontrar', how_description: 'Nossa loja fica em uma localização privilegiada no centro da cidade, de fácil acesso por diferentes meios de transporte. Venha nos visitar e descobrir pessoalmente nossas coleções exclusivas.',
    how_checklist: ['A 5 minutos da estação de metrô/ônibus central', 'Estacionamento conveniado nas proximidades', 'Ambiente acessível para cadeirantes', 'Próximo ao Shopping Centro e Praça Principal', 'Atendimento personalizado com consultoras de moda'], how_map_label: 'Jhonny Styles — Rua das Flores, 123', how_directions_url: 'https://maps.google.com', how_image_path: '',
    cta_eyebrow: 'Te esperamos!', cta_title: 'Venha Criar Seu Look Perfeito', cta_description: 'Nossa equipe de consultoras está pronta para te ajudar a encontrar as peças ideais para o seu estilo.', cta_whatsapp_url: 'https://wa.me/5500000000000', cta_shop_url: 'shop.html'
  },
  async init() {
    // Render the polished fallback immediately; network data hydrates it below.
    this.data = {
      ...this.empty,
      hours: { ...this.empty.hours },
      how_checklist: [...this.empty.how_checklist]
    }
    this.render()

    // Start content and authentication requests together instead of serially.
    const contentRequest = supabaseClient.from('store_content').select('*').eq('id', true).maybeSingle()
    const user = await SupabaseAuth.getCurrentUser()
    const profileRequest = user ? SupabaseAuth.getCurrentUserProfile(user) : Promise.resolve(null)
    const [{ data, error }, profile] = await Promise.all([contentRequest, profileRequest])
    this.staff = ['admin', 'hr'].includes(profile?.role)
    if (error) console.error('Erro ao carregar informações da loja:', error)
    const stored = data || {}
    this.data = { ...this.empty, ...stored, hours: { ...this.empty.hours, ...(stored.hours || {}) } }
    this.data.hero_crop_x = Number(stored.hours?.hero_crop_x) || 50
    this.data.hero_crop_y = Number(stored.hours?.hero_crop_y) || 50
    this.data.hero_crop_zoom = Number(stored.hours?.hero_crop_zoom) || 1
    await this.refreshHowImage()
    for (const key of ['hero_tag', 'hero_title', 'hero_title_emphasis', 'hero_description', 'hero_address', 'hero_image_url', 'hero_whatsapp_url', 'hero_whatsapp_label', 'hero_shop_url', 'hero_shop_label', 'address', 'reference', 'maps_url', 'phone', 'whatsapp', 'instagram', 'email', 'how_title', 'how_description', 'how_map_label', 'how_directions_url', 'cta_eyebrow', 'cta_title', 'cta_description', 'cta_whatsapp_url', 'cta_shop_url']) {
      if (!stored[key]) this.data[key] = this.empty[key]
    }
    if (!Array.isArray(stored.how_checklist) || !stored.how_checklist.length) this.data.how_checklist = this.empty.how_checklist
    this.render()
  },
  escape(value) { return String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]) },
  icon(name) { return this.icons[name] || '' },
  editButton(section) { return this.staff ? `<button class="store-content-edit" data-edit="${section}" aria-label="Editar ${section}" title="Editar ${section}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg></button>` : '' },
  async refreshHowImage() {
    const path = this.data?.how_image_path
    if (!path) {
      this.howImageUrl = 'assets/images/lojafisica/01.png'
      return
    }
    const { data, error } = await supabaseClient.storage.from('store-gallery').createSignedUrl(path, 3600)
    if (error) {
      console.error('Erro ao carregar a foto de como chegar:', error)
      this.howImageUrl = 'assets/images/lojafisica/01.png'
      return
    }
    this.howImageUrl = data.signedUrl
  },
  render() {
    this.renderHero()
    const root = document.getElementById('store-content-cards')
    if (!root) return
    const d = this.data, hours = d.hours || {}, hourRows = [['weekday', 'Segunda a sexta'], ['saturday', 'Sábado'], ['sunday', 'Domingo'], ['holidays', 'Feriados']]
    root.innerHTML = `
      <article class="store-card store-content-card"><div class="store-card__icon">${this.icon('clock')}</div>${this.editButton('horários')}<h3 class="store-card__title">Horário de Funcionamento</h3><ul class="store-card__list">${hourRows.map(([key, label]) => `<li><span class="store-card__list-day">${label}</span><span class="store-card__list-hours ${/fechado/i.test(hours[key] || '') ? 'closed' : ''}">${this.escape(hours[key] || '—')}</span></li>`).join('')}</ul></article>
      <article class="store-card store-content-card"><div class="store-card__icon">${this.icon('mapPin')}</div>${this.editButton('endereço')}<h3 class="store-card__title">Endereço &amp; Localização</h3><div class="store-card__address-line"><span class="store-card__contact-icon">${this.icon('mapPin')}</span><span>${this.escape(d.address || 'Informações em breve').replace(/\n/g, '<br>')}</span></div>${d.reference ? `<div class="store-card__address-line" style="margin-top:var(--space-md)"><span class="store-card__contact-icon">${this.icon('navigation')}</span><span>${this.escape(d.reference)}</span></div>` : ''}${d.maps_url ? `<a href="${this.escape(d.maps_url)}" target="_blank" rel="noopener" class="btn btn--outline store-content-map">Abrir no Google Maps</a>` : ''}</article>
      <article class="store-card store-content-card"><div class="store-card__icon">${this.icon('headset')}</div>${this.editButton('contatos')}<h3 class="store-card__title">Fale Conosco</h3><div class="store-content-contacts">${d.phone ? `<div class="store-card__contact-item"><span class="store-card__contact-icon">${this.icon('phone')}</span><a href="tel:${this.escape(d.phone.replace(/\D/g, ''))}">${this.escape(d.phone)}</a></div>` : ''}${d.whatsapp ? `<div class="store-card__contact-item"><span class="store-card__contact-icon">${this.icon('whatsapp')}</span><a href="https://wa.me/${this.escape(d.whatsapp.replace(/\D/g, ''))}" target="_blank" rel="noopener">WhatsApp de Pedidos</a></div>` : ''}${d.instagram ? `<div class="store-card__contact-item"><span class="store-card__contact-icon">${this.icon('instagram')}</span><a href="https://instagram.com/${this.escape(d.instagram.replace(/^@/, ''))}" target="_blank" rel="noopener">${this.escape(d.instagram)}</a></div>` : ''}${d.email ? `<div class="store-card__contact-item"><span class="store-card__contact-icon">${this.icon('mail')}</span><a href="mailto:${this.escape(d.email)}">${this.escape(d.email)}</a></div>` : ''}${!d.phone && !d.whatsapp && !d.instagram && !d.email ? '<span>Informações em breve</span>' : ''}</div></article>`
    root.hidden = false
    root.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => this.open(button.dataset.edit)))
    this.renderHow()
    this.renderCta()
  },
  renderHero() {
    const root = document.getElementById('store-hero-content')
    if (!root) return
    const d = this.data
    root.innerHTML = `
      ${this.editButton('banner hero')}
      <span class="store-hero__tag">${this.escape(d.hero_tag)}</span>
      <h1 class="store-hero__title">${this.escape(d.hero_title)}<br><em>${this.escape(d.hero_title_emphasis)}</em></h1>
      <p class="store-hero__sub">${this.escape(d.hero_description)}</p>
      <div class="store-hero__address">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${this.escape(d.hero_address)}
      </div>
      <div class="store-hero__btns">
        ${d.hero_whatsapp_url ? `<a href="${this.escape(d.hero_whatsapp_url)}" target="_blank" rel="noopener" class="btn btn--hero" style="background:#ffffff;border-color:#ffffff;color:var(--color-text)">${this.escape(d.hero_whatsapp_label)}</a>` : ''}
        ${d.hero_shop_url ? `<a href="${this.escape(d.hero_shop_url)}" class="btn btn--outline" style="color:white;border-color:rgba(255,255,255,.5)">${this.escape(d.hero_shop_label)}</a>` : ''}
      </div>`
    const image = root.closest('.store-hero')?.querySelector('.store-hero__bg img')
    if (image) {
      image.src = d.hero_image_url
      image.style.objectPosition = `${d.hero_crop_x ?? 50}% ${d.hero_crop_y ?? 50}%`
      image.style.transform = `scale(${d.hero_crop_zoom ?? 1})`
    }
    root.querySelector('[data-edit]')?.addEventListener('click', () => this.open('banner hero'))
  },
  renderHow() {
    const root = document.getElementById('store-how-content')
    if (!root) return
    const d = this.data, checklist = Array.isArray(d.how_checklist) ? d.how_checklist.filter(Boolean) : []
    root.innerHTML = `<div class="store-how__text store-how-editable">${this.editButton('como chegar')}<p class="store-how__eyebrow">Localização</p><h2 class="store-how__title">${this.escape(d.how_title || 'Informações em breve')}</h2>${d.how_description ? `<p class="store-how__desc">${this.escape(d.how_description)}</p>` : ''}${checklist.length ? `<ul class="store-how__checklist">${checklist.map(item => `<li><span class="store-how__check">${UIIcons.svg('check')}</span>${this.escape(item)}</li>`).join('')}</ul>` : ''}${d.how_directions_url ? `<a class="btn btn--primary" href="${this.escape(d.how_directions_url)}" target="_blank" rel="noopener">Como chegar</a>` : ''}</div><div class="store-how__map">${this.editButton('como chegar')}<img class="store-how__map-img" src="${this.escape(this.howImageUrl)}" alt="Loja Jhonny Styles"><div class="store-how__map-pin">${this.escape(d.how_map_label || 'Jhonny Styles')}</div></div>`
    root.hidden = false
    root.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => this.open('como chegar')))
  },
  renderCta() {
    const root = document.getElementById('store-cta-content')
    if (!root) return
    const d = this.data
    root.innerHTML = `<div class="container store-cta-editable">${this.editButton('chamada final')}<p class="store-cta__eyebrow">${this.escape(d.cta_eyebrow || 'Visite nossa loja')}</p><h2 class="store-cta__title">${this.escape(d.cta_title || 'Informações em breve')}</h2>${d.cta_description ? `<p class="store-cta__sub">${this.escape(d.cta_description)}</p>` : ''}<div class="store-cta__btns">${d.cta_whatsapp_url ? `<a href="${this.escape(d.cta_whatsapp_url)}" target="_blank" rel="noopener" class="btn btn--hero">Agendar visita</a>` : ''}${d.cta_shop_url ? `<a href="${this.escape(d.cta_shop_url)}" class="btn btn--outline-white">Comprar online</a>` : ''}</div></div>`
    root.hidden = false
    root.querySelector('[data-edit]')?.addEventListener('click', () => this.open('chamada final'))
  },
  open(section) {
    const previousModal = document.getElementById('store-content-modal')
    if (previousModal) previousModal._close ? previousModal._close() : previousModal.remove()
    const d = this.data, input = (key, label, type = 'text', value = '') => `<label>${label}<input name="${key}" type="${type}" value="${this.escape(value)}"></label>`
    const hours = d.hours || {}
    const fields = section === 'banner hero' ? `${input('hero_tag','Chamada curta','text',d.hero_tag)}${input('hero_title','Título (linha principal)','text',d.hero_title)}${input('hero_title_emphasis','Título em destaque','text',d.hero_title_emphasis)}<label>Descrição<textarea name="hero_description" rows="3">${this.escape(d.hero_description)}</textarea></label>${input('hero_address','Endereço exibido','text',d.hero_address)}<div class="store-hero-image-editor"><div class="store-hero-image-editor__head"><div><span>Editor de imagem</span><strong>Foto do banner</strong></div><label class="store-content-image-upload">${UIIcons.svg('image')} Trocar imagem<input name="hero_image" type="file" accept="image/jpeg,image/png,image/webp" hidden></label></div><div class="store-hero-image-stage" tabindex="0" role="application" aria-label="Arraste ou use as teclas de direção para reposicionar"><img id="hero-image-preview" src="${this.escape(d.hero_image_url)}" alt="Prévia atual do banner" style="object-position:${d.hero_crop_x ?? 50}% ${d.hero_crop_y ?? 50}%;transform:scale(${d.hero_crop_zoom ?? 1})"><span>${UIIcons.svg('arrowUp')} Arraste ou use as teclas de direção para reposicionar</span></div><div class="store-hero-image-zoom"><button type="button" data-hero-step="-.1" aria-label="Diminuir zoom">−</button><input name="hero_crop_zoom" type="range" min="1" max="3" step=".05" value="${d.hero_crop_zoom ?? 1}" aria-label="Zoom"><button type="button" data-hero-step=".1" aria-label="Aumentar zoom">+</button></div><input name="hero_crop_x" type="hidden" value="${d.hero_crop_x ?? 50}"><input name="hero_crop_y" type="hidden" value="${d.hero_crop_y ?? 50}"></div>${input('hero_whatsapp_label','Texto do botão WhatsApp','text',d.hero_whatsapp_label)}${input('hero_whatsapp_url','Link do WhatsApp','url',d.hero_whatsapp_url)}${input('hero_shop_label','Texto do botão loja online','text',d.hero_shop_label)}${input('hero_shop_url','Link da loja online','url',d.hero_shop_url)}`
      : section === 'horários' ? `${input('weekday','Segunda a sexta','text',hours.weekday)}${input('saturday','Sábado','text',hours.saturday)}${input('sunday','Domingo','text',hours.sunday)}${input('holidays','Feriados','text',hours.holidays)}`
      : section === 'endereço' ? `<label>Endereço<textarea name="address" rows="2">${this.escape(d.address)}</textarea></label>${input('reference','Ponto de referência','text',d.reference)}${input('maps_url','Link do Google Maps','url',d.maps_url)}`
      : section === 'como chegar' ? `${input('how_title','Título','text',d.how_title)}<label>Descrição<textarea name="how_description" rows="4">${this.escape(d.how_description)}</textarea></label><label>Itens da lista (um por linha)<textarea name="how_checklist" rows="5">${this.escape((d.how_checklist || []).join('\n'))}</textarea></label>${input('how_map_label','Rótulo exibido sobre a foto','text',d.how_map_label)}${input('how_directions_url','Link de Como chegar','url',d.how_directions_url)}<label class="store-content-image-upload">Alterar foto<input name="how_image" type="file" accept="image/jpeg,image/png,image/webp"></label><img class="store-content-image-preview" id="how-image-preview" src="${this.escape(this.howImageUrl)}" alt="Prévia da foto de como chegar">`
      : section === 'chamada final' ? `${input('cta_eyebrow','Chamada curta','text',d.cta_eyebrow)}${input('cta_title','Título','text',d.cta_title)}<label>Texto de apoio<textarea name="cta_description" rows="3">${this.escape(d.cta_description)}</textarea></label>${input('cta_whatsapp_url','Link do WhatsApp','url',d.cta_whatsapp_url)}${input('cta_shop_url','Link de comprar online','url',d.cta_shop_url)}`
      : `${input('phone','Telefone','tel',d.phone)}${input('whatsapp','WhatsApp (somente números)','text',d.whatsapp)}${input('instagram','Instagram','text',d.instagram)}${input('email','E-mail','email',d.email)}`
    const modal = document.createElement('div')
    modal.id = 'store-content-modal'; modal.className = 'store-content-modal'
    modal.innerHTML = `<form class="store-content-modal__panel"><header><div><span class="store-content-modal__eyebrow">Conteúdo da loja</span><strong>Editar ${section}</strong><p>As alterações aparecem no site e no CRM.</p></div><button class="store-content-modal__close" type="button" data-close aria-label="Fechar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header><div class="store-content-form">${fields}</div><footer><button class="store-content-modal__cancel" type="button" data-close>Cancelar</button><button class="store-content-modal__save" type="submit">Salvar alterações</button></footer></form>`
    document.body.append(modal)
    const events = new AbortController()
    const releasePreview = () => {
      modal.querySelectorAll('.store-content-image-preview,#hero-image-preview').forEach(preview => { if (preview.src.startsWith('blob:')) URL.revokeObjectURL(preview.src) })
      events.abort()
      modal.remove()
    }
    modal._close = releasePreview
    modal.querySelectorAll('[data-close]').forEach(button => button.onclick = releasePreview)
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') releasePreview()
    }, { signal: events.signal })
    modal.querySelector('[name="how_image"]')?.addEventListener('change', event => {
      const file = event.target.files[0]
      const preview = modal.querySelector('#how-image-preview')
      if (!file || !preview) return
      if (preview.src.startsWith('blob:')) URL.revokeObjectURL(preview.src)
      preview.src = URL.createObjectURL(file)
    })
    modal.querySelector('[name="hero_image"]')?.addEventListener('change', event => {
      const file = event.target.files[0]
      const preview = modal.querySelector('#hero-image-preview')
      if (!file || !preview) return
      if (preview.src.startsWith('blob:')) URL.revokeObjectURL(preview.src)
      preview.src = URL.createObjectURL(file)
      modal.querySelector('[name="hero_crop_x"]').value = 50
      modal.querySelector('[name="hero_crop_y"]').value = 50
      modal.querySelector('[name="hero_crop_zoom"]').value = 1
      preview.style.objectPosition = '50% 50%'
      preview.style.transform = 'scale(1)'
    })
    const heroStage = modal.querySelector('.store-hero-image-stage')
    if (heroStage) {
      const preview = modal.querySelector('#hero-image-preview'), zoom = modal.querySelector('[name="hero_crop_zoom"]'), cropX = modal.querySelector('[name="hero_crop_x"]'), cropY = modal.querySelector('[name="hero_crop_y"]')
      const clamp = value => Math.max(0, Math.min(100, value)); let drag = null
      const update = () => { preview.style.objectPosition = `${cropX.value}% ${cropY.value}%`; preview.style.transform = `scale(${zoom.value})` }
      heroStage.addEventListener('pointerdown', event => { heroStage.focus(); heroStage.setPointerCapture(event.pointerId); drag={x:event.clientX,y:event.clientY,cropX:Number(cropX.value),cropY:Number(cropY.value)}; heroStage.classList.add('is-dragging') }, { signal:events.signal })
      heroStage.addEventListener('pointermove', event => { if(!drag)return; const rect=heroStage.getBoundingClientRect(), scale=Number(zoom.value); cropX.value=clamp(drag.cropX-((event.clientX-drag.x)/rect.width)*100/scale); cropY.value=clamp(drag.cropY-((event.clientY-drag.y)/rect.height)*100/scale); update() }, { signal:events.signal })
      const stop = () => { drag=null; heroStage.classList.remove('is-dragging') }; heroStage.addEventListener('pointerup',stop,{signal:events.signal}); heroStage.addEventListener('pointercancel',stop,{signal:events.signal})
      heroStage.addEventListener('keydown', event => { const move={ArrowLeft:[2,0],ArrowRight:[-2,0],ArrowUp:[0,2],ArrowDown:[0,-2]}[event.key]; if(!move)return; event.preventDefault(); cropX.value=clamp(Number(cropX.value)+move[0]); cropY.value=clamp(Number(cropY.value)+move[1]); update() }, { signal:events.signal })
      zoom.addEventListener('input',update,{signal:events.signal}); modal.querySelectorAll('[data-hero-step]').forEach(button => button.onclick=()=>{ zoom.value=Math.max(1,Math.min(3,Number(zoom.value)+Number(button.dataset.heroStep))); update() })
    }
    modal.querySelector('form').onsubmit = event => this.save(event, section, modal)
  },
  async save(event, section, modal) {
    event.preventDefault(); const form = new FormData(event.currentTarget), next = { ...this.data }
    let uploadedHowImage = '', uploadedHeroImage = ''
    if (section === 'banner hero') {
      ['hero_tag','hero_title','hero_title_emphasis','hero_description','hero_address','hero_whatsapp_url','hero_whatsapp_label','hero_shop_url','hero_shop_label'].forEach(key => { next[key] = String(form.get(key) || '').trim() })
      next.hero_crop_x = Number(form.get('hero_crop_x')) || 50; next.hero_crop_y = Number(form.get('hero_crop_y')) || 50; next.hero_crop_zoom = Number(form.get('hero_crop_zoom')) || 1
    }
    else if (section === 'horários') next.hours = Object.fromEntries(['weekday','saturday','sunday','holidays'].map(key => [key, String(form.get(key) || '').trim()]))
    else if (section === 'endereço') ['address','reference','maps_url'].forEach(key => { next[key] = String(form.get(key) || '').trim() })
    else if (section === 'como chegar') { ['how_title','how_description','how_map_label','how_directions_url'].forEach(key => { next[key] = String(form.get(key) || '').trim() }); next.how_checklist = String(form.get('how_checklist') || '').split('\n').map(item => item.trim()).filter(Boolean) }
    else if (section === 'chamada final') ['cta_eyebrow','cta_title','cta_description','cta_whatsapp_url','cta_shop_url'].forEach(key => { next[key] = String(form.get(key) || '').trim() })
    else ['phone','whatsapp','instagram','email'].forEach(key => { next[key] = String(form.get(key) || '').trim() })
    if (section === 'como chegar') {
      const imageFile = form.get('how_image')
      if (imageFile instanceof File && imageFile.size) {
        uploadedHowImage = `store/how-${crypto.randomUUID()}-${imageFile.name.replace(/[^a-z0-9._-]/gi, '-')}`
        const { error: uploadError } = await supabaseClient.storage.from('store-gallery').upload(uploadedHowImage, imageFile)
        if (uploadError) return Toast.show('Não foi possível enviar a foto.', uploadError.message, 'error')
        next.how_image_path = uploadedHowImage
      }
    }
    if (section === 'banner hero') {
      const imageFile = form.get('hero_image')
      if (imageFile instanceof File && imageFile.size) {
        if (imageFile.size > 8 * 1024 * 1024) return Toast.show('Imagem muito grande.', 'O limite é de 8 MB.', 'error')
        uploadedHeroImage = `hero/${crypto.randomUUID()}-${imageFile.name.replace(/[^a-z0-9._-]/gi, '-')}`
        const { error: uploadError } = await supabaseClient.storage.from('novidades-media').upload(uploadedHeroImage, imageFile)
        if (uploadError) return Toast.show('Não foi possível enviar o banner.', uploadError.message, 'error')
        next.hero_image_url = supabaseClient.storage.from('novidades-media').getPublicUrl(uploadedHeroImage).data.publicUrl
      }
    }
    const payload = { ...next, hours: { ...next.hours, hero_crop_x: next.hero_crop_x, hero_crop_y: next.hero_crop_y, hero_crop_zoom: next.hero_crop_zoom }, id: true, updated_at: new Date().toISOString() }
    delete payload.hero_crop_x; delete payload.hero_crop_y; delete payload.hero_crop_zoom
    const { error } = await supabaseClient.from('store_content').upsert(payload, { onConflict: 'id' })
    if (error) {
      if (uploadedHowImage) {
        const { error: cleanupError } = await supabaseClient.storage.from('store-gallery').remove([uploadedHowImage])
        if (cleanupError) console.error('Não foi possível limpar a foto enviada após falha ao salvar:', cleanupError)
      }
      if (uploadedHeroImage) await supabaseClient.storage.from('novidades-media').remove([uploadedHeroImage])
      return Toast.show('Não foi possível salvar.', error.message, 'error')
    }
    this.data = next
    await this.refreshHowImage()
    modal.querySelectorAll('input[type="file"]').forEach(input => { input.value = '' })
    const preview = modal.querySelector('#how-image-preview')
    if (preview?.src.startsWith('blob:')) URL.revokeObjectURL(preview.src)
    modal._close?.(); this.render(); Toast.show('Informações da loja atualizadas.', '', 'success')
  }
}
document.addEventListener('DOMContentLoaded', () => StoreContent.init())
