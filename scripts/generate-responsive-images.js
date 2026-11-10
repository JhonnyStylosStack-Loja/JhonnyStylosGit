// Gera versões menores das imagens do site principal para uso em srcset.
// Saída: assets/images/_resp/<largura>/<caminho original>.webp
// Uso: npm run images:responsive
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..', 'assets', 'images')
const OUT = path.join(ROOT, '_resp')
const SOURCE_DIRS = ['roupas', 'blogs', 'IMAGENS SITE', 'lojafisica', 'usuarios']
const WIDTHS = [400, 800]
const LOGOS = [
  { from: 'logotipo/LOGO-MENU.webp', to: 'logotipo/LOGO-MENU-400.webp', width: 400 },
  { from: 'logotipo/ICONE CIRCULAR.webp', to: 'logotipo/ICONE-CIRCULAR-192.webp', width: 192 }
]

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return /\.(webp|jpe?g|png)$/i.test(entry.name) ? [full] : []
  })
}

async function resize(input, output, width) {
  if (fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(input).mtimeMs) return false
  fs.mkdirSync(path.dirname(output), { recursive: true })
  await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 78, effort: 6 }).toFile(output)
  return true
}

async function main() {
  let created = 0
  for (const dir of SOURCE_DIRS) {
    const base = path.join(ROOT, dir)
    if (!fs.existsSync(base)) continue
    for (const file of walk(base)) {
      const rel = path.relative(ROOT, file).replace(/\.(jpe?g|png)$/i, '.webp')
      for (const width of WIDTHS) {
        if (await resize(file, path.join(OUT, String(width), rel), width)) created++
      }
    }
  }
  for (const logo of LOGOS) {
    if (await resize(path.join(ROOT, logo.from), path.join(ROOT, logo.to), logo.width)) created++
  }
  console.log(`Imagens responsivas geradas/atualizadas: ${created}`)
}

main().catch(error => { console.error(error); process.exit(1) })
