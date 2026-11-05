const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')

const catalogRoot = path.resolve('Catálogo Jhonny Styles', 'Catálogo (Atacado)')
const categoriesRoot = path.join(catalogRoot, 'Itens', 'Categorias')
const output = path.resolve('js', 'pages', 'catalog-products.js')
const supportedImages = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const categoryLabels = new Map([
  ['Vestidos', 'Vestidos'],
  ['Vestidos Longos', 'Vestidos Longos'],
  ['Conjuntos e Macaquinhos', 'Conjuntos / Macaquinhos'],
  ['Coleção Festas', 'Coleção Festas'],
  ['Blusas', 'Blusas']
])

const numericId = name => Number.parseInt(name.replace(/\D/g, ''), 10) || 0
const byProductNumber = (left, right) => numericId(left.name) - numericId(right.name)
const cleanLine = line => line
  .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}!.?]+$/gu, '')
  .replace(/\s+/g, ' ')
  .trim()

function extractPrice(description, label) {
  const line = description.split(/\r?\n/).find(item => new RegExp(label, 'iu').test(item))
  if (!line) return 'Consulte'
  const price = line.match(/R\$\s*\d[\d.]*,\d{2}/u)
  return price ? price[0].replace(/R\$\s*/, 'R$ ') : 'Consulte'
}

function productCopy(description, folder) {
  const lines = description.split(/\r?\n/).map(cleanLine).filter(Boolean)
  const name = lines[0] || `Produto ${folder.replace('#', '')}`
  const details = lines.slice(1).filter(line =>
    !/atacado|varejo|garanta|delicad|perfeit|estampa linda/iu.test(line)
  )
  return {
    name,
    size: details.slice(0, 3).join(' · ') || 'Consulte os tamanhos disponíveis',
    wholesale: extractPrice(description, 'atacado'),
    retail: extractPrice(description, 'varejo')
  }
}

function productImages(category, directory) {
  const preferred = new Map()
  const contentHashes = new Set()
  const priority = new Map([['.webp', 4], ['.jpeg', 3], ['.jpg', 2], ['.png', 1]])
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (!entry.isFile()) continue
    const extension = path.extname(entry.name).toLowerCase()
    if (!supportedImages.has(extension)) continue
    const stem = path.basename(entry.name, extension).toLocaleLowerCase('pt-BR')
    const current = preferred.get(stem)
    if (!current || priority.get(extension) > priority.get(path.extname(current).toLowerCase())) {
      preferred.set(stem, entry.name)
    }
  }
  return [...preferred.values()]
    .sort((left, right) => left.localeCompare(right, 'pt-BR', {numeric: true}))
    .filter(file => {
      const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(directory, file))).digest('hex')
      if (contentHashes.has(hash)) return false
      contentHashes.add(hash)
      return true
    })
    .map(file => ['Itens', 'Categorias', category, path.basename(directory), file].map(encodeURIComponent).join('/'))
}

const products = []
for (const [folder, label] of categoryLabels) {
  const categoryDirectory = path.join(categoriesRoot, folder)
  if (!fs.existsSync(categoryDirectory)) continue
  const productDirectories = fs.readdirSync(categoryDirectory, {withFileTypes: true})
    .filter(entry => entry.isDirectory() && /^#\d+$/u.test(entry.name))
    .sort(byProductNumber)
  for (const entry of productDirectories) {
    const directory = path.join(categoryDirectory, entry.name)
    const images = productImages(folder, directory)
    if (!images.length) continue
    const descriptionPath = path.join(directory, 'Descrição.txt')
    const description = fs.existsSync(descriptionPath) ? fs.readFileSync(descriptionPath, 'utf8').trim() : ''
    products.push({
      category: label,
      icon: '✨',
      ...(folder === 'Blusas' && entry.name === '#01' ? {layout: 'landscape'} : {}),
      ...productCopy(description, entry.name),
      images
    })
  }
}

const categoryNames = [...categoryLabels.values()].filter(category =>
  products.some(product => product.category === category)
)
const source = `// Gerado por scripts/generate-catalog-data.js. Não edite manualmente.\n` +
  `window.catalogProducts = ${JSON.stringify(products, null, 2)};\n` +
  `window.catalogCategoryNames = ${JSON.stringify(categoryNames)};\n`
fs.writeFileSync(output, source)
console.log(`Generated ${products.length} products in ${categoryNames.length} categories`)
