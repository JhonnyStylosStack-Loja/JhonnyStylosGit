function formatDate(str) {
  const d = new Date(str + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

document.addEventListener('DOMContentLoaded', async () => {
  Toast.init()

  const params = new URLSearchParams(location.search)
  const id     = params.get('id')
  const allPosts = await CMS.getBlogPosts()
  const post   = allPosts.find(p => p.id === id)

  if (!post) {
    document.title = 'Post não encontrado — Blog'
    const main = document.getElementById('post-main')
    if (main) main.innerHTML = '<p style="padding:4rem 0;text-align:center;color:var(--color-text-muted)">Post não encontrado. <a href="blog.html">Voltar ao blog</a></p>'
    return
  }

  document.title = `${post.title} — Blog`

  const heroImg = document.getElementById('post-hero-img')
  if (heroImg) { heroImg.src = post.image; heroImg.alt = post.title; heroImg.style.objectPosition = `${post.coverCropX}% ${post.coverCropY}%`; heroImg.style.transform = `scale(${post.coverCropZoom})` }

  const el = id => document.getElementById(id)
  if (el('post-tag'))    el('post-tag').textContent    = post.category
  if (el('post-date'))   el('post-date').textContent   = formatDate(post.date)
  if (el('post-author')) el('post-author').textContent = `Por ${post.author}`
  if (el('post-title'))  el('post-title').textContent  = post.title
  if (el('post-content')) {
    el('post-content').innerHTML = post.content || ''
    if (post.gallery?.length) el('post-content').insertAdjacentHTML('beforeend', `<div class="post-media-gallery">${post.gallery.map(src => `<img src="${src}" alt="Imagem do post" loading="lazy">`).join('')}</div>`)
  }

  const relatedEl = document.getElementById('related-posts')
  if (relatedEl) {
    relatedEl.innerHTML = allPosts.filter(p => p.id !== id).map(p => `
      <a href="blog-post.html?id=${p.id}" class="related-item">
        <img class="related-item__img" src="${p.image}" alt="${p.title}" loading="lazy">
        <div>
          <p class="related-item__title">${p.title}</p>
          <p class="related-item__date">${formatDate(p.date)}</p>
        </div>
      </a>`).join('')
  }
})
