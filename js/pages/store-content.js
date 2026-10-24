const StoreContent = {
  data: null, staff: false,
  empty: {
    hours: { weekday: '9h às 18h', saturday: '9h às 17h', sunday: 'Fechado', holidays: 'Consulte' },
    address: 'Rua das Flores, 123\nCentro — Sua Cidade, UF\nCEP: 00000-000', reference: 'Próximo ao Shopping Centro', maps_url: 'https://maps.google.com',
    phone: '(55) 0000-0000', whatsapp: '5500000000000', instagram: '@jhonnystylos', email: 'contato@jhonnystylos.com',
    how_title: 'Fácil de Encontrar', how_description: 'Nossa loja fica em uma localização privilegiada no centro da cidade, de fácil acesso por diferentes meios de transporte. Venha nos visitar e descobrir pessoalmente nossas coleções exclusivas.',
    how_checklist: ['A 5 minutos da estação de metrô/ônibus central', 'Estacionamento conveniado nas proximidades', 'Ambiente acessível para cadeirantes', 'Próximo ao Shopping Centro e Praça Principal', 'Atendimento personalizado com consultoras de moda'], how_map_label: 'Jhonny Styles — Rua das Flores, 123', how_directions_url: 'https://maps.google.com',
    cta_eyebrow: 'Te esperamos!', cta_title: 'Venha Criar Seu Look Perfeito', cta_description: 'Nossa equipe de consultoras está pronta para te ajudar a encontrar as peças ideais para o seu estilo.', cta_whatsapp_url: 'https://wa.me/5500000000000', cta_shop_url: 'shop.html'
  },
  async init() {
    const user = await SupabaseAuth.getCurrentUser()
    const profile = user ? await SupabaseAuth.getCurrentUserProfile() : null
    this.staff = ['admin', 'hr'].includes(profile?.role)
    const { data, error } = await supabaseClient.from('store_content').select('*').eq('id', true).maybeSingle()
    if (error) console.error('Erro ao carregar informações da loja:', error)
    const stored = data || {}
    this.data = { ...this.empty, ...stored, hours: { ...this.empty.hours, ...(stored.hours || {}) } }
    for (const key of ['address', 'reference', 'maps_url', 'phone', 'whatsapp', 'instagram', 'email', 'how_title', 'how_description', 'how_map_label', 'how_directions_url', 'cta_eyebrow', 'cta_title', 'cta_description', 'cta_whatsapp_url', 'cta_shop_url']) {
      if (!stored[key]) this.data[key] = this.empty[key]
    }
    if (!Array.isArray(stored.how_checklist) || !stored.how_checklist.length) this.data.how_checklist = this.empty.how_checklist
    this.render()
  },
  escape(value) { return String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]) },
  editButton(section) { return this.staff ? `<button class="store-content-edit" data-edit="${section}" aria-label="Editar ${section}">✎</button>` : '' },
  render() {
    const root = document.getElementById('store-content-cards')
    if (!root) return
    const d = this.data, hours = d.hours || {}, hourRows = [['weekday', 'Segunda a sexta'], ['saturday', 'Sábado'], ['sunday', 'Domingo'], ['holidays', 'Feriados']]
    root.innerHTML = `
      <article class="store-card store-content-card"><div class="store-card__icon">◷</div>${this.editButton('horários')}<h3 class="store-card__title">Horário de Funcionamento</h3><ul class="store-card__list">${hourRows.map(([key, label]) => `<li><span class="store-card__list-day">${label}</span><span class="store-card__list-hours ${/fechado/i.test(hours[key] || '') ? 'closed' : ''}">${this.escape(hours[key] || '—')}</span></li>`).join('')}</ul></article>
      <article class="store-card store-content-card"><div class="store-card__icon">⌖</div>${this.editButton('endereço')}<h3 class="store-card__title">Endereço &amp; Localização</h3><div class="store-card__address-line"><span>${this.escape(d.address || 'Informações em breve').replace(/\n/g, '<br>')}</span></div>${d.reference ? `<div class="store-card__address-line" style="margin-top:var(--space-md)"><span>${this.escape(d.reference)}</span></div>` : ''}${d.maps_url ? `<a href="${this.escape(d.maps_url)}" target="_blank" rel="noopener" class="btn btn--outline store-content-map">Abrir no Google Maps</a>` : ''}</article>
      <article class="store-card store-content-card"><div class="store-card__icon">☏</div>${this.editButton('contatos')}<h3 class="store-card__title">Fale Conosco</h3><div class="store-content-contacts">${d.phone ? `<div class="store-card__contact-item"><span>☎</span><a href="tel:${this.escape(d.phone.replace(/\D/g, ''))}">${this.escape(d.phone)}</a></div>` : ''}${d.whatsapp ? `<div class="store-card__contact-item"><span>◉</span><a href="https://wa.me/${this.escape(d.whatsapp.replace(/\D/g, ''))}" target="_blank" rel="noopener">WhatsApp de Pedidos</a></div>` : ''}${d.instagram ? `<div class="store-card__contact-item"><span>◎</span><a href="https://instagram.com/${this.escape(d.instagram.replace(/^@/, ''))}" target="_blank" rel="noopener">${this.escape(d.instagram)}</a></div>` : ''}${d.email ? `<div class="store-card__contact-item"><span>✉</span><a href="mailto:${this.escape(d.email)}">${this.escape(d.email)}</a></div>` : ''}${!d.phone && !d.whatsapp && !d.instagram && !d.email ? '<span>Informações em breve</span>' : ''}</div></article>`
    root.hidden = false
    root.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => this.open(button.dataset.edit)))
    this.renderHow()
    this.renderCta()
  },
  renderHow() {
    const root = document.getElementById('store-how-content')
    if (!root) return
    const d = this.data, checklist = Array.isArray(d.how_checklist) ? d.how_checklist.filter(Boolean) : []
    root.innerHTML = `<div class="store-how__text store-how-editable">${this.editButton('como chegar')}<p class="store-how__eyebrow">Localização</p><h2 class="store-how__title">${this.escape(d.how_title || 'Informações em breve')}</h2>${d.how_description ? `<p class="store-how__desc">${this.escape(d.how_description)}</p>` : ''}${checklist.length ? `<ul class="store-how__checklist">${checklist.map(item => `<li><span class="store-how__check">✓</span>${this.escape(item)}</li>`).join('')}</ul>` : ''}${d.how_directions_url ? `<a class="btn btn--primary" href="${this.escape(d.how_directions_url)}" target="_blank" rel="noopener">Como chegar</a>` : ''}</div><div class="store-how__map"><img class="store-how__map-img" src="assets/images/lojafisica/01.png" alt="Loja Jhonny Styles"><div class="store-how__map-pin">${this.escape(d.how_map_label || 'Localização da loja')}</div></div>`
    root.hidden = false
    root.querySelector('[data-edit]')?.addEventListener('click', () => this.open('como chegar'))
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
    document.getElementById('store-content-modal')?.remove()
    const d = this.data, input = (key, label, type = 'text', value = '') => `<label>${label}<input name="${key}" type="${type}" value="${this.escape(value)}"></label>`
    const hours = d.hours || {}
    const fields = section === 'horários' ? `${input('weekday','Segunda a sexta','text',hours.weekday)}${input('saturday','Sábado','text',hours.saturday)}${input('sunday','Domingo','text',hours.sunday)}${input('holidays','Feriados','text',hours.holidays)}`
      : section === 'endereço' ? `<label>Endereço<textarea name="address" rows="3">${this.escape(d.address)}</textarea></label>${input('reference','Ponto de referência','text',d.reference)}${input('maps_url','Link do Google Maps','url',d.maps_url)}`
      : section === 'como chegar' ? `${input('how_title','Título','text',d.how_title)}<label>Descrição<textarea name="how_description" rows="4">${this.escape(d.how_description)}</textarea></label><label>Itens da lista (um por linha)<textarea name="how_checklist" rows="5">${this.escape((d.how_checklist || []).join('\n'))}</textarea></label>${input('how_map_label','Rótulo exibido sobre a foto','text',d.how_map_label)}${input('how_directions_url','Link de Como chegar','url',d.how_directions_url)}`
      : section === 'chamada final' ? `${input('cta_eyebrow','Chamada curta','text',d.cta_eyebrow)}${input('cta_title','Título','text',d.cta_title)}<label>Texto de apoio<textarea name="cta_description" rows="3">${this.escape(d.cta_description)}</textarea></label>${input('cta_whatsapp_url','Link do WhatsApp','url',d.cta_whatsapp_url)}${input('cta_shop_url','Link de comprar online','url',d.cta_shop_url)}`
      : `${input('phone','Telefone','tel',d.phone)}${input('whatsapp','WhatsApp (somente números)','text',d.whatsapp)}${input('instagram','Instagram','text',d.instagram)}${input('email','E-mail','email',d.email)}`
    const modal = document.createElement('div')
    modal.id = 'store-content-modal'; modal.className = 'store-content-modal'
    modal.innerHTML = `<form class="store-content-modal__panel"><header><strong>Editar ${section}</strong><button type="button" data-close aria-label="Fechar">×</button></header><p>As alterações aparecem no site e no CRM.</p><div class="store-content-form">${fields}</div><footer><button type="button" data-close>Cancelar</button><button class="btn btn--primary">Salvar alterações</button></footer></form>`
    document.body.append(modal)
    modal.querySelectorAll('[data-close]').forEach(button => button.onclick = () => modal.remove())
    modal.querySelector('form').onsubmit = event => this.save(event, section, modal)
  },
  async save(event, section, modal) {
    event.preventDefault(); const form = new FormData(event.currentTarget), next = { ...this.data }
    if (section === 'horários') next.hours = Object.fromEntries(['weekday','saturday','sunday','holidays'].map(key => [key, String(form.get(key) || '').trim()]))
    else if (section === 'endereço') ['address','reference','maps_url'].forEach(key => { next[key] = String(form.get(key) || '').trim() })
    else if (section === 'como chegar') { ['how_title','how_description','how_map_label','how_directions_url'].forEach(key => { next[key] = String(form.get(key) || '').trim() }); next.how_checklist = String(form.get('how_checklist') || '').split('\n').map(item => item.trim()).filter(Boolean) }
    else if (section === 'chamada final') ['cta_eyebrow','cta_title','cta_description','cta_whatsapp_url','cta_shop_url'].forEach(key => { next[key] = String(form.get(key) || '').trim() })
    else ['phone','whatsapp','instagram','email'].forEach(key => { next[key] = String(form.get(key) || '').trim() })
    const { error } = await supabaseClient.from('store_content').upsert({ ...next, id: true, updated_at: new Date().toISOString() }, { onConflict: 'id' })
    if (error) return Toast.show('Não foi possível salvar.', error.message, 'error')
    this.data = next; modal.remove(); this.render(); Toast.show('Informações da loja atualizadas.', '', 'success')
  }
}
document.addEventListener('DOMContentLoaded', () => StoreContent.init())
