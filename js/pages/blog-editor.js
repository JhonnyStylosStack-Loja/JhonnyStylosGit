const BlogEditor = {
  staff: false,
  objectUrl: '',
  file: null,
  crop: { x: 50, y: 50, zoom: 1 },

  escape(value = '') { const el = document.createElement('div'); el.textContent = value; return el.innerHTML },
  async init() {
    try {
      const user = await SupabaseAuth.getCurrentUser()
      const profile = user ? await SupabaseAuth.getCurrentUserProfile() : null
      this.staff = ['admin', 'hr'].includes(profile?.role)
    } catch (error) { console.warn('Não foi possível verificar a edição do blog:', error.message) }
    if (!this.staff) return
    const filters = document.querySelector('.blog-filters')
    if (!filters || document.getElementById('blog-new-post')) return
    const button = document.createElement('button')
    button.id = 'blog-new-post'; button.className = 'blog-new-post'; button.type = 'button'
    button.innerHTML = `${UIIcons.svg('plus')} Adicionar novo post`
    button.onclick = () => this.open()
    filters.append(button)
  },
  open() {
    this.file = null; this.crop = { x: 50, y: 50, zoom: 1 }
    const modal = document.createElement('div'); modal.className = 'blog-editor-modal'; modal.id = 'blog-editor-modal'
    modal.innerHTML = `<form class="blog-editor-modal__panel" role="dialog" aria-modal="true" aria-labelledby="blog-editor-title">
      <header><div><span>Conteúdo do blog</span><strong id="blog-editor-title">Adicionar novo post</strong><p>O post será publicado no site e ficará disponível no CRM.</p></div><button type="button" data-close aria-label="Fechar">${UIIcons.svg('x')}</button></header>
      <div class="blog-editor-modal__body">
        <div class="blog-editor-fields"><label>Título<input name="title" required maxlength="140" placeholder="Título do post"></label><label>Categoria<select name="category"><option>Moda</option><option>Estilo de Vida</option><option>Tendências</option></select></label><label>Autor<input name="author" value="Jhonny Styles" maxlength="80"></label><label>Data<input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}"></label><label class="is-wide">Resumo<textarea name="excerpt" required rows="3" maxlength="320" placeholder="Uma introdução curta para o card do blog"></textarea></label><label class="is-wide">Conteúdo do post<textarea name="content" required rows="8" placeholder="Escreva o conteúdo. Separe os parágrafos com uma linha em branco."></textarea><small>Você também pode usar HTML para títulos, listas e destaques.</small></label></div>
        <section class="blog-cover-editor"><div class="blog-cover-editor__heading"><div><span>Editor de imagem</span><strong>Capa do post</strong></div><label>${UIIcons.svg('image')} Escolher imagem<input type="file" accept="image/jpeg,image/png,image/webp" hidden></label></div><div class="blog-cover-stage is-empty" tabindex="0" role="application" aria-label="Arraste ou use as teclas de direção para reposicionar a capa"><div class="blog-cover-empty">${UIIcons.svg('image')}<strong>Escolha uma imagem para a capa</strong><span>JPG, PNG ou WebP — até 8 MB</span></div><img alt="Prévia da capa"><span class="blog-cover-hint">${UIIcons.svg('arrowUp')} Arraste ou use as teclas de direção para reposicionar</span></div><div class="blog-cover-zoom"><button type="button" data-step="-.1" aria-label="Diminuir zoom">−</button><input type="range" min="1" max="3" step=".05" value="1" disabled aria-label="Zoom"><button type="button" data-step=".1" aria-label="Aumentar zoom">+</button></div></section>
      </div>
      <footer><button type="button" class="blog-editor-cancel" data-close>Cancelar</button><button type="submit" class="blog-editor-save">Publicar post</button></footer>
    </form>`
    document.body.append(modal); this.bindModal(modal)
  },
  bindModal(modal) {
    const controller = new AbortController()
    const close = () => { controller.abort(); if (this.objectUrl) URL.revokeObjectURL(this.objectUrl); this.objectUrl = ''; modal.remove() }
    modal._close = close; modal.querySelectorAll('[data-close]').forEach(button => button.onclick = close)
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close() }, { signal: controller.signal })
    const stage = modal.querySelector('.blog-cover-stage'), preview = stage.querySelector('img'), zoom = modal.querySelector('input[type=range]')
    const update = () => { preview.style.objectPosition = `${this.crop.x}% ${this.crop.y}%`; preview.style.transform = `scale(${this.crop.zoom})`; zoom.value = this.crop.zoom }
    const clamp = value => Math.max(0, Math.min(100, value)); let drag = null
    modal.querySelector('input[type=file]').onchange = event => {
      const file = event.target.files?.[0]; if (!file) return
      if (file.size > 8 * 1024 * 1024) { Toast.show('Imagem muito grande.', 'O limite é de 8 MB.', 'error'); event.target.value = ''; return }
      if (this.objectUrl) URL.revokeObjectURL(this.objectUrl)
      this.file = file; this.objectUrl = URL.createObjectURL(file); preview.src = this.objectUrl
      this.crop = { x: 50, y: 50, zoom: 1 }; stage.classList.remove('is-empty'); zoom.disabled = false; update()
    }
    stage.onpointerdown = event => { if (!this.file) return; stage.focus(); stage.setPointerCapture(event.pointerId); drag = { x:event.clientX,y:event.clientY,cropX:this.crop.x,cropY:this.crop.y }; stage.classList.add('is-dragging') }
    stage.onpointermove = event => { if (!drag) return; const rect=stage.getBoundingClientRect(); this.crop.x=clamp(drag.cropX-((event.clientX-drag.x)/rect.width)*100/this.crop.zoom); this.crop.y=clamp(drag.cropY-((event.clientY-drag.y)/rect.height)*100/this.crop.zoom); update() }
    stage.onpointerup = stage.onpointercancel = () => { drag=null; stage.classList.remove('is-dragging') }
    stage.onkeydown = event => { if(!this.file)return; const move={ArrowLeft:[2,0],ArrowRight:[-2,0],ArrowUp:[0,2],ArrowDown:[0,-2]}[event.key]; if(!move)return; event.preventDefault(); this.crop.x=clamp(this.crop.x+move[0]); this.crop.y=clamp(this.crop.y+move[1]); update() }
    zoom.oninput = () => { this.crop.zoom=Number(zoom.value); update() }
    modal.querySelectorAll('[data-step]').forEach(button => button.onclick=()=>{ if(!this.file)return; this.crop.zoom=Math.max(1,Math.min(3,this.crop.zoom+Number(button.dataset.step))); update() })
    modal.querySelector('form').onsubmit = event => this.save(event, modal)
  },
  normalizeContent(value) {
    const text = value.trim(); if (/<[a-z][\s\S]*>/i.test(text)) return text
    return text.split(/\n\s*\n/).map(paragraph => `<p>${this.escape(paragraph).replace(/\n/g, '<br>')}</p>`).join('')
  },
  async upload(file) {
    const extension=(file.name.split('.').pop() || 'jpg').toLowerCase(); const path=`covers/${Date.now()}-${crypto.randomUUID()}.${extension}`
    const { error }=await supabaseClient.storage.from('blog-media').upload(path,file,{cacheControl:'3600',upsert:false}); if(error)throw error
    return supabaseClient.storage.from('blog-media').getPublicUrl(path).data.publicUrl
  },
  async save(event, modal) {
    event.preventDefault(); if (!event.currentTarget.reportValidity()) return
    if (!this.file) { Toast.show('Escolha uma capa.', 'A imagem é obrigatória para publicar o post.', 'error'); return }
    const button=modal.querySelector('.blog-editor-save'); button.disabled=true; button.textContent='Publicando…'
    try {
      const values=new FormData(event.currentTarget); const image=await this.upload(this.file); const title=String(values.get('title')).trim()
      await CMS.upsertPost({ title, slug:'', category:String(values.get('category')), date:String(values.get('date')), author:String(values.get('author')).trim() || 'Jhonny Styles', excerpt:String(values.get('excerpt')).trim(), content:this.normalizeContent(String(values.get('content'))), image, coverCropX:this.crop.x, coverCropY:this.crop.y, coverCropZoom:this.crop.zoom, gallery:[] })
      modal._close(); Toast.show('Post publicado.', 'O conteúdo também já está disponível no CRM.', 'success'); document.dispatchEvent(new CustomEvent('blog-post-saved'))
    } catch(error) { Toast.show('Não foi possível publicar.', error.message, 'error'); button.disabled=false; button.textContent='Publicar post' }
  }
}

document.addEventListener('DOMContentLoaded', () => BlogEditor.init())
