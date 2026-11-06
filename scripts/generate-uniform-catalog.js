const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('Catálogo Jhonny Styles', 'Catálogo (Fardamento)', 'Itens');
const images = folder => fs.readdirSync(path.join(root, folder))
  .filter(name => /\.(?:jpe?g|png|webp)$/i.test(name))
  .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }))
  .map(name => ['Itens', folder, name].map(encodeURIComponent).join('/'));
const folders = fs.readdirSync(root).filter(name => /^#\d+$/u.test(name))
  .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
const products = folders.map(folder => {
  const description = fs.readFileSync(path.join(root, folder, 'Descrição.txt'), 'utf8');
  const match = description.match(/(?:^|\n)\s*([^\n]+)\s*\nTecido:\s*([^\n]+)([\s\S]*?)\nValor:\s*(\d+[,.]\d{2})/iu);
  if (!match) throw new Error(`Descrição inválida: ${folder}`);
  const photos = images(folder);
  if (!photos.length) throw new Error(`Produto sem fotos: ${folder}`);
  return { code: folder, name: match[1].trim(), details: [match[2].trim(), match[3].trim()].filter(Boolean).join(' · '), price: `R$ ${match[4].replace('.', ',')}`, images: photos };
});
const clients = images('NOSSAS CLIENTES (PAGINA ANTES DOS PRODUTOS)');
fs.writeFileSync(path.resolve('js/pages/catalog-products-fardamento.js'), `// Gerado por scripts/generate-uniform-catalog.js.\nwindow.uniformProducts = ${JSON.stringify(products, null, 2)};\nwindow.uniformClients = ${JSON.stringify(clients, null, 2)};\n`);
console.log(`${products.length} produtos e ${clients.length} fotos de clientes gerados.`);
