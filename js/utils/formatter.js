const Formatter = {
  price(value, currency = 'BRL') {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
  },
  date(dateStr) {
    return new Intl.DateTimeFormat('pt-BR', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr))
  },
  truncate(str, len = 60) {
    return str.length > len ? str.slice(0, len).trimEnd() + '…' : str
  },
  slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  },
  // Atributos src/srcset/sizes usando as versões de scripts/generate-responsive-images.js.
  imgAttrs(src, sizes = '(max-width: 580px) 50vw, 300px') {
    const value = String(src || '')
    const match = value.match(/^(?:\.\/)?assets\/images\/((?:roupas|blogs|IMAGENS(?:%20| )SITE|lojafisica|usuarios)\/[^?#]+)\.(?:webp|jpe?g|png)(?:[?#].*)?$/i)
    if (!match) return `src="${value}"`
    const rel = `${match[1]}.webp`
    return `src="${value}" srcset="assets/images/_resp/400/${rel} 400w, assets/images/_resp/800/${rel} 800w" sizes="${sizes}"`
  }
}

// Se uma versão responsiva não existir, volta para a imagem original.
document.addEventListener('error', event => {
  const img = event.target
  if (img instanceof HTMLImageElement && img.srcset && img.srcset.includes('/_resp/')) {
    img.removeAttribute('srcset')
    img.removeAttribute('sizes')
  }
}, true)
