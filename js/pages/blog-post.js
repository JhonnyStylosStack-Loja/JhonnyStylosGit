function formatDate(str) {
  const d = new Date(str + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const FULL_CONTENT = `
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  <h2>O Segredo das Peças Atemporais</h2>
  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
  <blockquote><p>"A moda passa, o estilo fica. Invista em peças que contam a sua história."</p></blockquote>
  <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.</p>
  <h2>Como Montar Looks Completos</h2>
  <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis.</p>
  <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. Itaque earum rerum hic tenetur a sapiente delectus.</p>
`

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
  if (heroImg) { heroImg.src = post.image; heroImg.alt = post.title }

  const el = id => document.getElementById(id)
  if (el('post-tag'))    el('post-tag').textContent    = post.category
  if (el('post-date'))   el('post-date').textContent   = formatDate(post.date)
  if (el('post-author')) el('post-author').textContent = `Por ${post.author}`
  if (el('post-title'))  el('post-title').textContent  = post.title
  if (el('post-content')) el('post-content').innerHTML = post.content || FULL_CONTENT

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
