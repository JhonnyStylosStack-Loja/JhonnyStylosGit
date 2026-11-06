const uniformRoot = new URL('Catálogo Jhonny Styles/Catálogo (Fardamento)/', document.baseURI).href;
const uniformProducts = window.uniformProducts || [];
const uniformClients = window.uniformClients || [];
const uniformPages = document.getElementById('uniform-pages');
const productsPerPage = 2;
const productPages = [];
for (let i = 0; i < uniformProducts.length; i += productsPerPage) productPages.push(uniformProducts.slice(i, i + productsPerPage));
const totalPages = productPages.length + 4;
const pageNumber = number => String(number).padStart(2, '0');
const footer = number => `<footer class="uniform-page__footer"><span>Jhonny Styles | Catálogo Fardamento</span><b>${pageNumber(number)}</b></footer>`;
const imageUrl = image => new URL(image, uniformRoot).href;

const cover = `<section class="uniform-page uniform-cover" id="fardamento-pagina-1" aria-label="Capa do catálogo de fardamento"><div class="uniform-cover__copy"><img src="assets/images/logotipo/LOGO-MENU-catalog.webp" alt="Jhonny Styles" width="300" height="145"><i></i><h1>Catálogo<br>Fardamento</h1><p>Peças que fazem parte de momentos especiais.</p><ul><li>Modelos para grupos e eventos</li><li>Variedade de tecidos e tamanhos</li><li>Atendimento para seu pedido</li></ul><a href="#fardamento-pagina-2">Conheça nossas clientes <span>›</span></a></div></section>`;

const portfolioPage = (number, start, end, title, intro) => {
  const photos = uniformClients.slice(start, end).map((photo, i) => `<button class="portfolio-photo portfolio-photo--${i + 1}" type="button" data-gallery="clients" data-index="${start + i}" aria-label="Ampliar foto ${start + i + 1} de nossas clientes"><img src="${imageUrl(photo)}" alt="Clientes Jhonny Styles em um evento" loading="lazy" decoding="async"><span aria-hidden="true">↗</span></button>`).join('');
  return `<section class="uniform-page portfolio portfolio--${number}" id="fardamento-pagina-${number}" aria-label="Nossas clientes, página ${number}"><div class="portfolio__header"><span>Jhonny Styles / Nossas clientes</span><span>${pageNumber(number)} — 03</span></div><div class="portfolio__intro"><h1>${title}</h1><p>${intro}</p></div><div class="portfolio__grid">${photos}</div><div class="portfolio__bottom"><p>Momentos reais, histórias compartilhadas.</p><span>Toque nas fotos para ampliar ↗</span></div></section>`;
};
const portfolio = portfolioPage(2, 0, 6, 'Momentos que<br>vestimos juntas.', 'Cada encontro tem uma história. É uma alegria fazer parte desses momentos com vocês.') +
  portfolioPage(3, 6, uniformClients.length, 'Feito para<br>estar presente.', 'Entre celebrações e encontros, nossas peças acompanham momentos que ficam na memória.');

const card = (product, index) => `<article class="uniform-card"><button class="uniform-card__media" type="button" data-gallery="product" data-index="${index}" aria-label="Ver fotos de ${product.name}, modelo ${product.code}"><img src="${imageUrl(product.images[0])}" alt="${product.name}, modelo ${product.code}" loading="lazy" decoding="async"><span class="uniform-card__count">${product.images.length > 1 ? `${product.images.length} fotos` : 'Ampliar'}</span></button><div class="uniform-card__copy"><h2>${product.name} <span>${product.code}</span></h2><p>${product.details}</p><strong>${product.price}</strong><button type="button" data-details="${index}">Tamanhos e detalhes</button></div></article>`;
const catalogue = productPages.map((products, index) => {
  const number = index + 4;
  const background = String((index % 3) + 1).padStart(2, '0');
  return `<section class="uniform-page uniform-products" id="fardamento-pagina-${number}" style="--uniform-bg:url('${uniformRoot}Background Paginas/Back${background}.webp')" aria-label="Página ${number}, modelos de fardamento"><div class="uniform-page__body"><header><h1>Fardamento</h1><p>Modelos para<br>momentos especiais.</p></header><div class="uniform-grid">${products.map((product, i) => card(product, index * productsPerPage + i)).join('')}</div></div>${footer(number)}</section>`;
}).join('');
const back = `<section class="uniform-page uniform-back" id="fardamento-pagina-${totalPages}" aria-label="Contracapa"><div><img src="assets/images/logotipo/LOGO-MENU-catalog.webp" alt="Jhonny Styles" width="300" height="145"><h1>Vamos vestir<br>o seu grupo?</h1><p>Conte o que você precisa e fale com a nossa equipe sobre seu pedido.</p><a href="https://wa.me/5585986348334?text=Olá!%20Gostaria%20de%20conhecer%20os%20modelos%20de%20fardamento." target="_blank" rel="noopener">Falar no WhatsApp</a></div>${footer(totalPages)}</section>`;
uniformPages.innerHTML = cover + portfolio + catalogue + back;

document.body.insertAdjacentHTML('beforeend', `<dialog class="uniform-dialog" aria-labelledby="uniform-dialog-title"><button class="uniform-dialog__close" type="button" aria-label="Fechar imagem ampliada">×</button><div class="uniform-dialog__inner"><div class="uniform-dialog__stage"><div class="uniform-dialog__media"><img alt=""><button class="uniform-dialog__prev" type="button" aria-label="Foto anterior">‹</button><button class="uniform-dialog__next" type="button" aria-label="Próxima foto">›</button><span class="uniform-dialog__counter" aria-live="polite"></span></div></div><div class="uniform-dialog__zoom" aria-label="Controles de zoom"><button type="button" data-uniform-zoom="out" aria-label="Diminuir zoom">−</button><output aria-live="polite">100%</output><button type="button" data-uniform-zoom="in" aria-label="Aumentar zoom">+</button><button type="button" data-uniform-zoom="reset">Restaurar</button></div><div class="uniform-dialog__info"><h2 id="uniform-dialog-title"></h2><p></p><p class="uniform-dialog__sizes"></p><a target="_blank" rel="noopener">Consultar este modelo</a></div></div></dialog>`);
const dialog = document.querySelector('.uniform-dialog');
const galleryMedia = dialog.querySelector('.uniform-dialog__media');
const galleryImage = galleryMedia.querySelector('img');
let gallery = [];
let galleryIndex = 0;
let lastTrigger;
let zoom = 1;
let panX = 0;
let panY = 0;
const pointers = new Map();
let gesture = null;
const setZoom = (value, snap = true) => {
  zoom = Math.max(1, Math.min(3, snap ? Math.round(value * 4) / 4 : value));
  const maxX = galleryMedia.clientWidth * (zoom - 1) / 2;
  const maxY = galleryMedia.clientHeight * (zoom - 1) / 2;
  panX = Math.max(-maxX, Math.min(maxX, panX));
  panY = Math.max(-maxY, Math.min(maxY, panY));
  galleryImage.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})`;
  galleryMedia.classList.toggle('is-zoomed', zoom > 1);
  dialog.querySelector('.uniform-dialog__zoom output').textContent = `${Math.round(zoom * 100)}%`;
  dialog.querySelector('[data-uniform-zoom="out"]').disabled = zoom <= 1;
  dialog.querySelector('[data-uniform-zoom="in"]').disabled = zoom >= 3;
  dialog.querySelector('[data-uniform-zoom="reset"]').disabled = zoom === 1;
};
const renderGallery = () => {
  galleryImage.src = imageUrl(gallery[galleryIndex]);
  galleryImage.alt = `${dialog.querySelector('h2').textContent} — foto ${galleryIndex + 1}`;
  dialog.querySelector('.uniform-dialog__counter').textContent = `${galleryIndex + 1} / ${gallery.length}`;
  dialog.querySelector('.uniform-dialog__counter').hidden = gallery.length < 2;
  dialog.querySelectorAll('.uniform-dialog__prev, .uniform-dialog__next').forEach(button => { button.hidden = gallery.length < 2; });
  panX = 0; panY = 0; setZoom(1);
};
const openGallery = (trigger, type, index) => {
  lastTrigger = trigger;
  const product = type === 'product' ? uniformProducts[index] : null;
  gallery = product ? product.images : uniformClients;
  galleryIndex = product ? 0 : index;
  galleryMedia.classList.toggle('uniform-dialog__media--clients', !product);
  dialog.querySelector('h2').textContent = product ? `${product.name} ${product.code}` : 'Nossas clientes';
  dialog.querySelector('p').textContent = product ? `${product.details} · ${product.price}` : 'Momentos reais com Jhonny Styles';
  dialog.querySelector('.uniform-dialog__sizes').textContent = product ? 'Grade por numeração: P 36/38 · M 38/40 · G 42/44 · GG 46/48 · XGG 48/52.' : '';
  const link = dialog.querySelector('a');
  link.hidden = !product;
  if (product) link.href = `https://wa.me/5585986348334?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre ${product.name}, modelo ${product.code}.`)}`;
  renderGallery();
  dialog.showModal();
  document.body.classList.add('uniform-lightbox-open');
  dialog.querySelector('.uniform-dialog__close').focus({preventScroll: true});
};
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-gallery], [data-details]');
  if (trigger) openGallery(trigger, trigger.dataset.gallery || 'product', Number(trigger.dataset.index ?? trigger.dataset.details));
});
dialog.querySelector('.uniform-dialog__close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => { document.body.classList.remove('uniform-lightbox-open'); pointers.clear(); gesture = null; lastTrigger?.focus({preventScroll: true}); });
const moveGallery = direction => { galleryIndex = (galleryIndex + direction + gallery.length) % gallery.length; renderGallery(); };
dialog.querySelector('.uniform-dialog__prev').addEventListener('click', () => moveGallery(-1));
dialog.querySelector('.uniform-dialog__next').addEventListener('click', () => moveGallery(1));
dialog.querySelector('.uniform-dialog__zoom').addEventListener('click', event => {
  const action = event.target.closest('[data-uniform-zoom]')?.dataset.uniformZoom;
  if (action) setZoom(action === 'in' ? zoom + .25 : action === 'out' ? zoom - .25 : 1);
});
galleryMedia.addEventListener('pointerdown', event => {
  if (event.target.closest('button')) return;
  pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
  galleryMedia.setPointerCapture(event.pointerId);
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    gesture = {type: 'pinch', distance: Math.hypot(a.x - b.x, a.y - b.y), zoom};
  } else if (pointers.size === 1) gesture = {type: zoom > 1 ? 'pan' : 'swipe', x: event.clientX, y: event.clientY, panX, panY};
});
galleryMedia.addEventListener('pointermove', event => {
  if (!pointers.has(event.pointerId)) return;
  pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
  if (gesture?.type === 'pinch' && pointers.size >= 2) {
    const [a, b] = [...pointers.values()];
    if (gesture.distance) setZoom(gesture.zoom * Math.hypot(a.x - b.x, a.y - b.y) / gesture.distance, false);
  } else if (gesture?.type === 'pan') {
    panX = gesture.panX + event.clientX - gesture.x;
    panY = gesture.panY + event.clientY - gesture.y;
    setZoom(zoom, false);
  }
});
const endGesture = event => {
  if (!pointers.has(event.pointerId)) return;
  if (event.type === 'pointerup' && gesture?.type === 'swipe' && gallery.length > 1 && Math.abs(event.clientX - gesture.x) >= Math.min(70, galleryMedia.clientWidth * .18)) moveGallery(event.clientX < gesture.x ? 1 : -1);
  pointers.delete(event.pointerId);
  if (gesture?.type === 'pinch' && pointers.size) gesture = null;
  if (!pointers.size) gesture = null;
};
galleryMedia.addEventListener('pointerup', endGesture);
galleryMedia.addEventListener('pointercancel', endGesture);
galleryMedia.addEventListener('dblclick', () => setZoom(zoom > 1 ? 1 : 2));
galleryMedia.addEventListener('wheel', event => { event.preventDefault(); setZoom(zoom + (event.deltaY < 0 ? .25 : -.25)); }, {passive: false});
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); moveGallery(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); moveGallery(1); }
  if (event.key === '+' || event.key === '=') { event.preventDefault(); setZoom(zoom + .25); }
  if (event.key === '-') { event.preventDefault(); setZoom(zoom - .25); }
  if (event.key === '0') { event.preventDefault(); setZoom(1); }
});

const pages = [...document.querySelectorAll('.uniform-page')];
const input = document.getElementById('uniform-page');
const previous = document.getElementById('uniform-prev');
const next = document.getElementById('uniform-next');
document.getElementById('uniform-total').textContent = `/ ${totalPages}`;
input.max = totalPages;
let current = 1;
const update = number => {
  current = Math.max(1, Math.min(totalPages, number));
  if (document.activeElement !== input) input.value = current;
  previous.disabled = current === 1;
  next.disabled = current === totalPages;
};
const goTo = number => {
  const target = Math.max(1, Math.min(totalPages, Number(number) || 1));
  update(target);
  document.getElementById(`fardamento-pagina-${target}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
};
const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) update(pages.indexOf(visible.target) + 1);
}, { rootMargin: '-20% 0px -50% 0px', threshold: 0 });
pages.forEach(page => observer.observe(page));
previous.addEventListener('click', () => goTo(current - 1));
next.addEventListener('click', () => goTo(current + 1));
input.addEventListener('focus', () => input.select());
input.addEventListener('change', () => {
  const page = Number(input.value);
  if (Number.isInteger(page) && page >= 1 && page <= totalPages) goTo(page);
  else input.value = current;
});
input.addEventListener('keydown', event => { if (event.key === 'Enter') input.blur(); });
document.getElementById('uniform-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  update(1);
});
update(1);
