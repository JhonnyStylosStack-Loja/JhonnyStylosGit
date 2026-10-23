const MOCK_PRODUCTS = [
  { id: 1,  name: 'Vestido Longo Decote',        slug: 'vestido-longo-decote',        price: 189.90, comparePrice: 249.90, rating: 4.8, reviews: 32, category: 'Vestidos',  isNew: true,  isSale: true,  image: 'assets/images/roupas/611774660_18123418903550228_8019439332005677215_n.jpg' },
  { id: 2,  name: 'Conjunto Elegante',            slug: 'conjunto-elegante',            price: 159.90, comparePrice: null,   rating: 4.5, reviews: 24, category: 'Conjuntos', isNew: true,  isSale: false, image: 'assets/images/roupas/627966202_18126319933550228_2017830461251108621_n.jpg' },
  { id: 3,  name: 'Look Social Moderno',          slug: 'look-social-moderno',          price: 134.90, comparePrice: null,   rating: 4.3, reviews: 18, category: 'Looks',     isNew: true,  isSale: false, image: 'assets/images/roupas/636821417_18127353193550228_3736310066042731541_n.jpg' },
  { id: 4,  name: 'Calça Alfaiataria Premium',    slug: 'calca-alfaiataria-premium',    price: 119.90, comparePrice: 159.90, rating: 4.2, reviews: 15, category: 'Calças',    isNew: false, isSale: true,  image: 'assets/images/roupas/640145856_18127728499550228_8066820905867045664_n.jpg' },
  { id: 5,  name: 'Vestido Midi Florido',         slug: 'vestido-midi-florido',         price: 169.90, comparePrice: 219.90, rating: 4.7, reviews: 41, category: 'Vestidos',  isNew: false, isSale: true,  image: 'assets/images/roupas/659087011_18132595411550228_5594839873839737808_n.jpg' },
  { id: 6,  name: 'Blusa Social Feminina',        slug: 'blusa-social-feminina',        price: 89.90,  comparePrice: null,   rating: 4.4, reviews: 27, category: 'Blusas',    isNew: false, isSale: false, image: 'assets/images/roupas/661360880_18132584527550228_8380790774553928034_n.jpg' },
  { id: 7,  name: 'Short Elegante',               slug: 'short-elegante',               price: 79.90,  comparePrice: 109.90, rating: 4.1, reviews: 19, category: 'Shorts',    isNew: false, isSale: true,  image: 'assets/images/roupas/669751611_18132869941550228_8766216536007574101_n.jpg' },
  { id: 8,  name: 'Conjunto Premium',             slug: 'conjunto-premium',             price: 199.90, comparePrice: null,   rating: 4.6, reviews: 35, category: 'Conjuntos', isNew: true,  isSale: false, image: 'assets/images/roupas/670724664_18134007166550228_5629713014605647118_n.jpg' },
  { id: 9,  name: 'Blusa Cropped Exclusiva',      slug: 'blusa-cropped-exclusiva',      price: 74.90,  comparePrice: 99.90,  rating: 4.3, reviews: 22, category: 'Blusas',    isNew: false, isSale: true,  image: 'assets/images/roupas/672350601_18133246030550228_6238487994570565479_n.jpg' },
  { id: 10, name: 'Vestido Rodado Festa',         slug: 'vestido-rodado-festa',         price: 229.90, comparePrice: 299.90, rating: 4.9, reviews: 58, category: 'Vestidos',  isNew: true,  isSale: true,  image: 'assets/images/roupas/689047483_992216516558389_6055088097668892625_n.jpg' },
  { id: 11, name: 'Calça Pantalona',              slug: 'calca-pantalona',              price: 109.90, comparePrice: null,   rating: 4.0, reviews: 14, category: 'Calças',    isNew: true,  isSale: false, image: 'assets/images/roupas/695795422_1215064067234155_1275461646721207703_n.jpg' },
  { id: 12, name: 'Saia Midi Social',             slug: 'saia-midi-social',             price: 99.90,  comparePrice: 129.90, rating: 4.5, reviews: 31, category: 'Saias',     isNew: false, isSale: true,  image: 'assets/images/roupas/696182518_1443905297510436_5739259852732623208_n.jpg' },
]

const MOCK_BLOG_POSTS = [
  {
    id: 1,
    title: 'Coleção de Inverno: Looks para Inspirar',
    slug: 'colecao-inverno-looks-para-inspirar',
    category: 'Moda',
    excerpt: 'Os tons neutros dominam as passarelas desta temporada, trazendo uma harmonia visual única que permite combinações versáteis para o dia a dia.',
    date: '2024-01-15',
    author: 'Jhonny Styles',
    image: 'assets/images/blogs/700669320_18136747153550228_8805070458752668745_n.jpg',
    content: `
      <p>As coleções de inverno chegam com propostas arrojadas e sofisticadas. Desta vez, os tons neutros dominam as passarelas, trazendo uma harmonia visual única que permite combinações versáteis para o dia a dia. Cada peça foi pensada para durar além da temporada, unindo qualidade e estilo.</p>
      <p>A tendência aposta em texturas diferenciadas: lãs, tweed e veludo ganham destaque nas peças da temporada. O importante é criar looks que equilibrem conforto e elegância, sem abrir mão do estilo pessoal. Aposte em camadas para garantir aquele visual sofisticado mesmo nos dias mais frios.</p>
      <h2>Como Usar as Peças da Coleção</h2>
      <p>Casacos longos combinam perfeitamente com calças de alfaiataria e ankle boots. Para uma produção mais casual, aposte em moletom oversized com tênis chunky e cachecol de tricô. O segredo está em misturar peças de diferentes texturas sem perder a coesão do look.</p>
      <blockquote><p>"O inverno é a estação perfeita para brincar com volumes e camadas, criando looks únicos e expressivos."</p></blockquote>
      <p>Não esqueça dos acessórios: luvas, chapéus e bolsas de couro envelhecido completam qualquer produção com charme e personalidade. A coleção traz opções para todos os estilos e ocasiões, do casual ao mais sofisticado.</p>
    `
  },
  {
    id: 2,
    title: 'Guarda-Roupa Cápsula: Menos é Mais',
    slug: 'guarda-roupa-capsula-menos-e-mais',
    category: 'Estilo de Vida',
    excerpt: 'Descubra como construir um guarda-roupa com apenas 30 peças essenciais que geram mais de 100 looks diferentes para o seu dia a dia.',
    date: '2024-01-22',
    author: 'Jhonny Styles',
    image: 'assets/images/blogs/700890373_18136752151550228_2241945891391189822_n.jpg',
    content: `
      <p>Moda e estilo de vida sempre andaram juntos. A forma como nos vestimos reflete nossa personalidade, nossos valores e a maneira como enxergamos o mundo ao nosso redor. Mais do que seguir tendências, trata-se de encontrar o que nos faz sentir bem e expressar quem somos de forma autêntica.</p>
      <h2>Construindo um Guarda-Roupa Cápsula</h2>
      <p>O conceito de guarda-roupa cápsula transformou minha relação com a moda. Com apenas 30 peças essenciais, consigo criar mais de 100 looks diferentes. A chave está em escolher itens versáteis e em tons neutros que combinam entre si sem esforço.</p>
      <blockquote><p>"Não se trata de ter mais roupas, mas de ter as peças certas que expressem quem você é."</p></blockquote>
    `
  },
  {
    id: 3,
    title: 'Tendências da Temporada: O que Usar Agora',
    slug: 'tendencias-temporada-o-que-usar-agora',
    category: 'Tendências',
    excerpt: 'As grandes casas de moda lançaram suas apostas e as tendências apontam para uma fusão surpreendente entre o clássico e o contemporâneo.',
    date: '2024-01-29',
    author: 'Jhonny Styles',
    image: 'assets/images/blogs/716070211_18138453778550228_4262120336808833200_n.webp',
    content: `
      <p>As grandes casas de moda lançaram suas apostas para a próxima temporada, e as tendências apontam para uma fusão surpreendente entre o clássico e o contemporâneo. Peças de alfaiataria ganham novos recortes, e as cores vibrantes voltam com força total às ruas e passarelas.</p>
      <h2>As Peças-Chave da Temporada</h2>
      <p>O blazer oversized segue como peça-coringa: funciona no trabalho, no happy hour e até em looks mais despojados aos fins de semana. Já as calças cargo voltam repaginadas, com tecidos mais nobres e modelagens mais ajustadas ao corpo.</p>
      <blockquote><p>"A moda de hoje celebra a individualidade — não existe look certo ou errado, existe o look que te representa."</p></blockquote>
    `
  },
]

const MOCK_CATEGORIES = [
  { id: 1, name: 'Vestidos',  slug: 'vestidos',  count: 24 },
  { id: 2, name: 'Blusas',    slug: 'blusas',    count: 18 },
  { id: 3, name: 'Conjuntos', slug: 'conjuntos', count: 15 },
  { id: 4, name: 'Calças',    slug: 'calcas',    count: 12 },
  { id: 5, name: 'Shorts',    slug: 'shorts',    count: 9  },
  { id: 6, name: 'Saias',     slug: 'saias',     count: 20 },
  { id: 7, name: 'Looks',     slug: 'looks',     count: 16 },
  { id: 8, name: 'Promoções', slug: 'promocoes', count: 32 },
]

const MOCK_BRANDS = ['Vogue', 'Elle', 'Harper\'s', 'Bazaar', 'Marie', 'Glamour']

/* Cart (localStorage-backed) */
const Cart = {
  key: 'jhonnystylos_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || [] } catch { return [] } },
  save(items) { localStorage.setItem(this.key, JSON.stringify(items)) },
  add(product, qty = 1, size = 'M') {
    const items = this.get()
    const existing = items.find(i => i.id === product.id && i.size === size)
    if (existing) { existing.qty += qty } else { items.push({ ...product, qty, size }) }
    this.save(items)
    return items
  },
  remove(productId, size) {
    const items = this.get().filter(i => !(i.id === productId && i.size === size))
    this.save(items)
    return items
  },
  updateQty(productId, size, qty) {
    const items = this.get()
    const item = items.find(i => i.id === productId && i.size === size)
    if (item) { if (qty <= 0) return this.remove(productId, size); item.qty = qty }
    this.save(items)
    return items
  },
  count() { return this.get().reduce((sum, i) => sum + i.qty, 0) },
  total() { return this.get().reduce((sum, i) => sum + (i.price * i.qty), 0) },
  clear() { localStorage.removeItem(this.key) }
}

/* Wishlist */
const Wishlist = {
  key: 'jhonnystylos_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || [] } catch { return [] } },
  toggle(productId) {
    const list = this.get()
    const idx = list.indexOf(productId)
    if (idx >= 0) { list.splice(idx, 1) } else { list.push(productId) }
    localStorage.setItem(this.key, JSON.stringify(list))
    return list.includes(productId)
  },
  has(productId) { return this.get().includes(productId) }
}
