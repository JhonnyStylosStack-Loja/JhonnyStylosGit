const fs = require('node:fs/promises')
const path = require('node:path')
const crypto = require('node:crypto')
const sharp = require('sharp')

const catalogRoot = path.resolve('Catálogo Jhonny Styles', 'Catálogo (Atacado)')
const sourceRoot = path.join(catalogRoot, 'Itens', 'Categorias')
const outputRoot = path.join(catalogRoot, 'Thumbs', 'Itens', 'Categorias')
const largeOutputRoot = path.join(catalogRoot, 'Large', 'Itens', 'Categorias')
const supported = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const extensionPriority = new Map([['.webp', 4], ['.jpeg', 3], ['.jpg', 2], ['.png', 1]])

async function findImages(directory) {
  const entries = await fs.readdir(directory, {withFileTypes: true})
  const nested = await Promise.all(entries.map(entry => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return findImages(target)
    return supported.has(path.extname(entry.name).toLowerCase()) ? [target] : []
  }))
  return nested.flat()
}

async function generateThumbnail(source) {
  const relative = path.relative(sourceRoot, source)
  const output = path.join(outputRoot, relative.replace(/\.(?:jpe?g|png|webp)$/i, '.webp'))
  const largeOutput = path.join(largeOutputRoot, relative.replace(/\.(?:jpe?g|png|webp)$/i, '.webp'))
  const isLandscape = relative.split(path.sep).slice(0, 2).join('/') === 'Blusas/#01'
  const thumbnailSize = isLandscape ? {width: 800, height: 450} : {width: 600, height: 800}
  const largeSize = isLandscape ? {width: 1400, height: 788} : {width: 1000, height: 1333}
  const resizeImage = (size, quality) => {
    let image = sharp(source).rotate()
    if (isLandscape) {
      const innerWidth = Math.round(size.width * .88)
      const innerHeight = Math.round(size.height * .88)
      const horizontalPadding = size.width - innerWidth
      const verticalPadding = size.height - innerHeight
      image = image
        .resize({width: innerWidth, height: innerHeight, fit: 'contain', withoutEnlargement: true})
        .extend({
          left: Math.floor(horizontalPadding / 2),
          right: Math.ceil(horizontalPadding / 2),
          top: Math.floor(verticalPadding / 2),
          bottom: Math.ceil(verticalPadding / 2),
          background: '#f5e7e5'
        })
    } else {
      image = image.resize({...size, fit: 'cover', position: 'centre', withoutEnlargement: true})
    }
    return image.webp({quality, effort: 5})
  }
  await fs.mkdir(path.dirname(output), {recursive: true})
  await fs.mkdir(path.dirname(largeOutput), {recursive: true})
  await Promise.all([
    resizeImage(thumbnailSize, 76).toFile(output),
    resizeImage(largeSize, 80).toFile(largeOutput)
  ])
}

async function main() {
  const discoveredImages = await findImages(sourceRoot)
  const preferredImages = new Map()
  for (const image of discoveredImages) {
    const extension = path.extname(image).toLowerCase()
    const key = path.relative(sourceRoot, image).slice(0, -extension.length).toLowerCase()
    const current = preferredImages.get(key)
    if (!current || extensionPriority.get(extension) > extensionPriority.get(path.extname(current).toLowerCase())) {
      preferredImages.set(key, image)
    }
  }
  const contentHashes = new Set()
  const images = []
  for (const image of preferredImages.values()) {
    const hash = crypto.createHash('sha256').update(await fs.readFile(image)).digest('hex')
    const contentKey = `${path.dirname(path.relative(sourceRoot, image)).toLowerCase()}:${hash}`
    if (contentHashes.has(contentKey)) continue
    contentHashes.add(contentKey)
    images.push(image)
  }
  await Promise.all(images.map(generateThumbnail))
  await sharp(path.resolve('assets', 'images', 'logotipo', 'LOGO-MENU.webp'))
    .resize({width: 600, withoutEnlargement: true})
    .webp({quality: 78, effort: 5})
    .toFile(path.resolve('assets', 'images', 'logotipo', 'LOGO-MENU-catalog.webp'))
  console.log(`Generated ${images.length} catalog thumbnails and large images`)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
