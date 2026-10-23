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
  }
}
