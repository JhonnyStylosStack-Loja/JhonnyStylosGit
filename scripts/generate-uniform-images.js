// Gera as versões WebP otimizadas do Catálogo Fardamento.
// Thumbs/  -> fotos menores usadas nas páginas (cards e mosaico das clientes).
// Large/   -> fotos usadas na tela cheia, sem corte (mantém a proporção original).
// Capa     -> versão leve da capa usada no CSS.
// Rode depois de trocar ou adicionar fotos: npm run uniform:images
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const catalogRoot = path.resolve('Catálogo Jhonny Styles', 'Catálogo (Fardamento)');
const sourceRoot = path.join(catalogRoot, 'Itens');
const supported = /\.(?:jpe?g|png|webp)$/i;
const sizes = {
  thumb: { max: 760, quality: 78 },
  large: { max: 1600, quality: 82 },
};

async function findImages(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return findImages(target);
    return supported.test(entry.name) ? [target] : [];
  }));
  return nested.flat();
}

async function isFresh(source, output) {
  try {
    const [a, b] = await Promise.all([fs.stat(source), fs.stat(output)]);
    return b.mtimeMs >= a.mtimeMs;
  } catch {
    return false;
  }
}

async function encode(source, output, { max, quality }) {
  if (await isFresh(source, output)) return false;
  await fs.mkdir(path.dirname(output), { recursive: true });
  await sharp(source)
    .rotate()
    .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(output);
  return true;
}

async function main() {
  const images = await findImages(sourceRoot);
  let generated = 0;
  for (const source of images) {
    const relative = path.relative(catalogRoot, source).replace(supported, '.webp');
    if (await encode(source, path.join(catalogRoot, 'Thumbs', relative), sizes.thumb)) generated++;
    if (await encode(source, path.join(catalogRoot, 'Large', relative), sizes.large)) generated++;
  }
  // Capa: o original fica intocado; a página usa esta cópia leve.
  const cover = path.join(catalogRoot, 'Imagem da Capa Catálogo.png');
  if (await encode(cover, path.join(catalogRoot, 'Capa', 'capa.webp'), { max: 1440 * 4 / 3, quality: 82 })) generated++;
  console.log(`${images.length} fotos verificadas, ${generated} arquivos WebP gerados.`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
