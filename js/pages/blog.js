function formatDate(str) {
  const d = new Date(str + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function renderBlogCard(post) {
  return `
  <article class="blog-card">
    <a href="blog-post.html?id=${post.id}" class="blog-card__image-wrap" style="display:block;text-decoration:none">
      <img class="blog-card__image" src="${post.image}" alt="${post.title}" loading="lazy">
    </a>
    <div class="blog-card__body">
      <div class="blog-card__meta">
        <span class="blog-card__category">${post.category}</span>
        <span class="blog-card__date">${formatDate(post.date)}</span>
      </div>
      <h3 class="blog-card__title">
        <a href="blog-post.html?id=${post.id}" style="color:inherit;text-decoration:none">${post.title}</a>
      </h3>
      <p class="blog-card__excerpt">${post.excerpt}</p>
      <a href="blog-post.html?id=${post.id}" class="blog-card__link">Leia Mais
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </a>
    </div>
  </article>`
}

document.addEventListener('DOMContentLoaded', async () => {
  Toast.init()

  const grid    = document.getElementById('blog-grid')
  const filters = document.querySelectorAll('.blog-filter')
  let active    = 'Todos'
  const allPosts = await CMS.getBlogPosts()

  function render(category) {
    const posts = category === 'Todos'
      ? allPosts
      : allPosts.filter(p => p.category === category)
    grid.innerHTML = posts.length
      ? posts.map(renderBlogCard).join('')
      : '<p style="color:var(--color-text-muted);grid-column:1/-1;padding:var(--space-2xl) 0">Nenhum post encontrado.</p>'
  }

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('is-active'))
      btn.classList.add('is-active')
      active = btn.dataset.cat
      render(active)
    })
  })

  render(active)
})
