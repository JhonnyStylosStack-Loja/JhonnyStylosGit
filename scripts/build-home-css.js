// Junta os CSS da página inicial em um único arquivo minificado (menos requisições
// que bloqueiam a renderização) e atualiza a versão no index.html.
// Edite os arquivos em css/ normalmente e rode: npm run css:home
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const ROOT = path.join(__dirname, '..')
const OUTPUT = 'css/bundles/home.css'
const FILES = [
  'css/reset.css',
  'css/variables.css',
  'css/global.css',
  'css/components/header.css',
  'css/components/hero.css',
  'css/components/product-card.css',
  'css/components/tabs.css',
  'css/components/new-arrivals.css',
  'css/components/banner.css',
  'css/components/countdown.css',
  'css/components/mini-list.css',
  'css/components/blog-card.css',
  'css/components/footer.css',
  'css/components/modal.css',
  'css/components/toast.css',
  'css/components/animations.css',
  'css/pages/home-mobile.css'
]

function minify(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim()
}

const css = FILES.map(file => {
  const content = fs.readFileSync(path.join(ROOT, file), 'utf8')
  if (/@import|url\((?!['"]?(?:data:|https?:))/i.test(content)) {
    throw new Error(`${file} tem @import ou url() relativa; ajuste antes de juntar.`)
  }
  return minify(content)
}).join('\n')

fs.mkdirSync(path.join(ROOT, path.dirname(OUTPUT)), { recursive: true })
fs.writeFileSync(path.join(ROOT, OUTPUT), css + '\n')

const hash = crypto.createHash('sha1').update(css).digest('hex').slice(0, 10)
const indexPath = path.join(ROOT, 'index.html')
const html = fs.readFileSync(indexPath, 'utf8')
const updated = html.replace(/css\/bundles\/home\.css\?v=[\w-]+/, `${OUTPUT}?v=${hash}`)
if (updated === html && !html.includes(`${OUTPUT}?v=${hash}`)) throw new Error('Link do bundle não encontrado no index.html')
fs.writeFileSync(indexPath, updated)
console.log(`${OUTPUT} gerado (${(css.length / 1024).toFixed(1)} KiB, v=${hash})`)
