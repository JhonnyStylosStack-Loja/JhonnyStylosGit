// Sempre abre na página 1, mesmo após F5, recarregar ou voltar pelo histórico.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
const resetToFirstPage = () => window.scrollTo({ top: 0, behavior: 'instant' });
resetToFirstPage();
addEventListener('load', resetToFirstPage);
addEventListener('pageshow', event => { if (event.persisted) { resetToFirstPage(); update(1); } });

const uniformRoot = new URL('Catálogo Jhonny Styles/Catálogo (Fardamento)/', document.baseURI).href;
const uniformProducts = window.uniformProducts || [];
const uniformClients = window.uniformClients || [];
const uniformPages = document.getElementById('uniform-pages');
const productsPerPage = 2;
const productPages = [];
for (let i = 0; i < uniformProducts.length; i += productsPerPage) productPages.push(uniformProducts.slice(i, i + productsPerPage));
const totalPages = productPages.length + 4;
const pageNumber = number => String(number).padStart(2, '0');
const footer = number => `<footer class="uniform-page__footer"><span>Jhonny Stylos · Catálogo Fardamento</span><b>${pageNumber(number)}</b></footer>`;
const imageUrl = image => new URL(image, uniformRoot).href;
// Versões WebP geradas por scripts/generate-uniform-images.js: Thumbs para as páginas, Large para a tela cheia.
const optimized = (folder, image) => imageUrl(`${folder}/${image.replace(/.(?:jpe?g|png|webp)$/i, '.webp')}`);
const thumbUrl = image => optimized('Thumbs', image);
const largeUrl = image => optimized('Large', image);

const cover = `<section class="uniform-page uniform-cover" id="fardamento-pagina-1" aria-label="Capa do catálogo de fardamento"><div class="uniform-cover__copy"><span class="uniform-brand-mark" role="img" aria-label="Jhonny Stylos"></span><h1>Catálogo Fardamento</h1><p class="uniform-cover__tagline">Peças para momentos especiais</p><ul><li>Grupos e eventos</li><li>Variedade de tecidos</li><li>Grade do P ao XGG</li></ul><a class="uniform-cover__cta" href="#fardamento-pagina-2">Conheça nossas clientes <span aria-hidden="true">›</span></a></div></section>`;

const portfolioPage = (number, start, end, title, intro) => {
  const photos = uniformClients.slice(start, end).map((photo, i) => `<button class="portfolio-photo portfolio-photo--${i + 1}" type="button" data-gallery="clients" data-index="${start + i}" aria-label="Ampliar foto ${start + i + 1} de nossas clientes"><img data-src="${thumbUrl(photo)}" data-large="${largeUrl(photo)}" alt="Clientes Jhonny Stylos em um evento" decoding="async"><span aria-hidden="true">↗</span></button>`).join('');
  return `<section class="uniform-page portfolio portfolio--${number}" id="fardamento-pagina-${number}" aria-label="Nossas clientes, página ${number}"><div class="portfolio__header"><span>Nossas clientes</span><span>${pageNumber(number)}</span></div><div class="portfolio__intro"><h1>${title}</h1><p>${intro}</p></div><div class="portfolio__grid">${photos}</div><div class="portfolio__bottom"><p>Momentos reais, histórias compartilhadas.</p><span>Toque nas fotos para ampliar ↗</span></div></section>`;
};
const portfolio = portfolioPage(2, 0, 6, 'Momentos que<br>vestimos juntas.', 'Cada encontro tem uma história. É uma alegria fazer parte desses momentos com vocês.') +
  portfolioPage(3, 6, uniformClients.length, 'Feito para<br>estar presente.', 'Entre celebrações e encontros, nossas peças acompanham momentos que ficam na memória.');

const card = (product, index) => `<article class="uniform-card"><button class="uniform-card__media" type="button" data-gallery="product" data-index="${index}" aria-label="Ver fotos de ${product.name}, modelo ${product.code}"><img data-src="${thumbUrl(product.images[0])}" data-large="${product.images.map(largeUrl).join('|')}" alt="${product.name}, modelo ${product.code}" decoding="async"><span class="uniform-card__count">${product.images.length > 1 ? `${product.images.length} fotos` : 'Ampliar'}</span></button><div class="uniform-card__copy"><h2>${product.name} <span>${product.code}</span></h2><p>${product.details}</p><strong>${product.price}</strong><button type="button" data-details="${index}">Ver tamanhos <span aria-hidden="true">›</span></button></div></article>`;
const catalogue = productPages.map((products, index) => {
  const number = index + 4;
  const background = String((index % 3) + 1).padStart(2, '0');
  return `<section class="uniform-page uniform-products" id="fardamento-pagina-${number}" style="--uniform-bg:url('${uniformRoot}Background Paginas/Back${background}.webp')" aria-label="Página ${number}, modelos de fardamento"><div class="uniform-page__body"><header><h1>Fardamento</h1><p>Modelos para<br>momentos especiais.</p></header><div class="uniform-grid">${products.map((product, i) => card(product, index * productsPerPage + i)).join('')}</div></div>${footer(number)}</section>`;
}).join('');
const back = `<section class="uniform-page uniform-back" id="fardamento-pagina-${totalPages}" aria-label="Contracapa"><div class="uniform-back__inner"><span class="uniform-brand-mark" role="img" aria-label="Jhonny Stylos"></span><h1>Vamos vestir<br>o seu grupo?</h1><p>Conte o que você precisa e fale com a nossa equipe sobre seu pedido.</p><a href="https://wa.me/5585986348334?text=Olá!%20Gostaria%20de%20conhecer%20os%20modelos%20de%20fardamento." target="_blank" rel="noopener" class="uniform-back__cta"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.88 9.88 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41"/></svg>Falar no WhatsApp</a></div>${footer(totalPages)}</section>`;
uniformPages.innerHTML = cover + portfolio + catalogue + back;

// Carregamento antecipado: capa, clientes e os 15 primeiros modelos carregam na abertura.
// O restante começa a baixar cerca de 3 telas antes de aparecer, então a rolagem nunca espera.
// As fotos de tela cheia de cada modelo são buscadas quando ele se aproxima da tela.
const INITIAL_PRODUCTS = 15;
const loadImage = image => {
  if (!image?.dataset.src) return;
  image.src = image.dataset.src;
  delete image.dataset.src;
};
const requestedLarge = new Set();
const prefetchLarge = image => (image?.dataset.large || '').split('|').forEach(url => {
  if (!url || requestedLarge.has(url)) return;
  requestedLarge.add(url);
  const preload = new Image();
  preload.fetchPriority = 'low';
  preload.decoding = 'async';
  preload.src = url;
});
const pageImages = [...uniformPages.querySelectorAll('img[data-src]')];
const isInitial = image => image.closest('.portfolio') || Number(image.closest('[data-index]')?.dataset.index) < INITIAL_PRODUCTS;
// Tela de carregamento: espera a capa, os fundos, as fotos das clientes e os 15 primeiros modelos.
// Assim o cliente já encontra tudo pronto, sem fotos vazias. Limite de 18 s para nunca travar.
const preloadInitialCatalog = async () => {
  const preloader = document.getElementById('catalog-preloader');
  const initialImages = pageImages.filter(isInitial);
  const urls = [...new Set([
    imageUrl('Capa/capa.webp'),
    imageUrl('Background%20Paginas/Back01.webp'),
    imageUrl('Background%20Paginas/Back02.webp'),
    ...initialImages.map(image => image.dataset.src),
  ])];
  if (preloader) {
    const bar = preloader.querySelector('.catalog-preloader__bar span');
    const output = preloader.querySelector('output');
    let done = 0;
    const progress = () => {
      done += 1;
      const percent = `${Math.round(done / urls.length * 100)}%`;
      bar.style.width = percent;
      output.textContent = percent;
    };
    const fetchImage = url => new Promise(resolve => {
      const image = new Image();
      const finish = () => { clearTimeout(timer); progress(); resolve(); };
      const timer = setTimeout(finish, 12000);
      image.addEventListener('load', finish, { once: true });
      image.addEventListener('error', finish, { once: true });
      image.decoding = 'async';
      image.src = url;
    });
    let cursor = 0;
    const worker = async () => { while (cursor < urls.length) await fetchImage(urls[cursor++]); };
    const workers = Promise.all(Array.from({ length: Math.min(8, urls.length) }, worker));
    await Promise.race([workers, new Promise(resolve => setTimeout(resolve, 18000))]);
    bar.style.width = '100%';
    output.textContent = '100%';
  }
  initialImages.forEach(loadImage);
  resetToFirstPage();
  if (preloader) {
    preloader.classList.add('is-complete');
    setTimeout(() => preloader.remove(), 280);
  }
  document.body.classList.remove('catalog-preloading');
};
preloadInitialCatalog();
const aheadObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  loadImage(entry.target);
  aheadObserver.unobserve(entry.target);
}), { rootMargin: '300% 0px' });
const largeObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  prefetchLarge(entry.target);
  largeObserver.unobserve(entry.target);
}), { rootMargin: '120% 0px' });
pageImages.forEach(image => {
  if (image.dataset.src) aheadObserver.observe(image);
  largeObserver.observe(image);
});

document.body.insertAdjacentHTML('beforeend', `<dialog class="uniform-dialog" aria-labelledby="uniform-dialog-title"><button class="uniform-dialog__close" type="button" aria-label="Fechar imagem ampliada">×</button><div class="uniform-dialog__inner"><div class="uniform-dialog__stage"><div class="uniform-dialog__media"><div class="uniform-dialog__track"></div><button class="uniform-dialog__prev" type="button" aria-label="Foto anterior">‹</button><button class="uniform-dialog__next" type="button" aria-label="Próxima foto">›</button><span class="uniform-dialog__counter" aria-live="polite"></span></div></div><div class="uniform-dialog__zoom" aria-label="Controles de zoom"><button type="button" data-uniform-zoom="out" aria-label="Diminuir zoom">−</button><output aria-live="polite">100%</output><button type="button" data-uniform-zoom="in" aria-label="Aumentar zoom">+</button><button type="button" data-uniform-zoom="reset">Restaurar</button></div><div class="uniform-dialog__info"><h2 id="uniform-dialog-title"></h2><p></p><p class="uniform-dialog__sizes"></p><a target="_blank" rel="noopener">Consultar este modelo</a></div></div></dialog>`);
const dialog = document.querySelector('.uniform-dialog');
const galleryMedia = dialog.querySelector('.uniform-dialog__media');
const galleryTrack = galleryMedia.querySelector('.uniform-dialog__track');
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const photoRatios = new Map();
let gallery = [];
let galleryIndex = 0;
let galleryIsClients = false;
let lastTrigger;
let zoom = 1;
let panX = 0;
let panY = 0;
let finishSlide = null;
let closeTimer = 0;
const pointers = new Map();
let gesture = null;

// Carrossel com cópias nas pontas (última antes da primeira e vice-versa) para o loop deslizar sem salto.
const visualOf = index => gallery.length > 1 ? index + 1 : 0;
const slideAt = visual => galleryTrack.children[visual];
const currentImage = () => slideAt(visualOf(galleryIndex))?.querySelector('img');
const setTrack = (visual, animate, offset = 0) => {
  galleryTrack.classList.toggle('is-resetting', !animate);
  galleryTrack.style.transform = offset ? `translate3d(calc(${-visual * 100}% + ${offset}px),0,0)` : `translate3d(${-visual * 100}%,0,0)`;
  if (!animate) { galleryTrack.getBoundingClientRect(); galleryTrack.classList.remove('is-resetting'); }
};

// Fotos das clientes têm proporções variadas: a moldura vira 3:4 (em pé) ou 4:3 (deitada).
// Se a foto foge muito da moldura, aparece inteira sobre um fundo desfocado dela mesma, sem cortar rostos.
const frameRatio = ratio => ratio > 1 ? 4 / 3 : 3 / 4;
const fitSlide = (slide, ratio) => {
  const target = galleryIsClients ? frameRatio(ratio) : 3 / 4;
  slide.classList.toggle('is-contain', Math.abs(ratio / target - 1) > .12);
};
const applyFrame = (instant = false) => {
  if (instant) galleryMedia.classList.add('is-instant');
  const ratio = photoRatios.get(gallery[galleryIndex]);
  galleryMedia.classList.toggle('is-landscape', galleryIsClients && ratio > 1);
  if (instant) { galleryMedia.getBoundingClientRect(); galleryMedia.classList.remove('is-instant'); }
};
const loadSlide = visual => {
  const slide = slideAt(visual);
  const image = slide?.querySelector('img');
  if (!image || image.getAttribute('src')) return;
  image.addEventListener('load', () => {
    const ratio = image.naturalWidth / image.naturalHeight;
    photoRatios.set(slide.dataset.photo, ratio);
    fitSlide(slide, ratio);
    image.classList.add('is-loaded');
    if (slide.dataset.photo === gallery[galleryIndex]) applyFrame();
  }, { once: true });
  slide.style.setProperty('--slide-bg', `url("${image.dataset.thumb}")`);
  image.src = image.dataset.src;
};
const loadAround = () => {
  const visual = visualOf(galleryIndex);
  [visual - 1, visual, visual + 1].forEach(loadSlide);
};
// As miniaturas da página já carregadas informam a proporção antes da foto grande chegar.
const readThumbnailRatios = () => document.querySelectorAll('.portfolio-photo').forEach(button => {
  const image = button.querySelector('img');
  if (image?.naturalWidth) photoRatios.set(uniformClients[Number(button.dataset.index)], image.naturalWidth / image.naturalHeight);
});

const setZoom = (value, snap = true) => {
  zoom = Math.max(1, Math.min(3, snap ? Math.round(value * 4) / 4 : value));
  const maxX = galleryMedia.clientWidth * (zoom - 1) / 2;
  const maxY = galleryMedia.clientHeight * (zoom - 1) / 2;
  panX = Math.max(-maxX, Math.min(maxX, panX));
  panY = Math.max(-maxY, Math.min(maxY, panY));
  const image = currentImage();
  if (image) image.style.transform = zoom > 1 ? `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})` : '';
  galleryMedia.classList.toggle('is-zoomed', zoom > 1);
  dialog.querySelector('.uniform-dialog__zoom output').textContent = `${Math.round(zoom * 100)}%`;
  dialog.querySelector('[data-uniform-zoom="out"]').disabled = zoom <= 1;
  dialog.querySelector('[data-uniform-zoom="in"]').disabled = zoom >= 3;
  dialog.querySelector('[data-uniform-zoom="reset"]').disabled = zoom === 1;
};
const resetZoom = () => { panX = 0; panY = 0; setZoom(1); };
const updateCounter = () => {
  const counter = dialog.querySelector('.uniform-dialog__counter');
  counter.textContent = `${galleryIndex + 1} / ${gallery.length}`;
  counter.hidden = gallery.length < 2;
};
const renderGallery = () => {
  finishSlide?.();
  const title = dialog.querySelector('h2').textContent;
  const sources = gallery.length > 1 ? [gallery.at(-1), ...gallery, gallery[0]] : gallery;
  galleryTrack.innerHTML = sources.map((photo, i) => {
    const number = gallery.length > 1 ? (i + gallery.length - 1) % gallery.length + 1 : 1;
    return `<div class="uniform-slide" data-photo="${photo}"${gallery.length > 1 && (i === 0 || i === sources.length - 1) ? ' aria-hidden="true"' : ''}><img data-src="${largeUrl(photo)}" data-thumb="${thumbUrl(photo)}" alt="${title} — foto ${number}" decoding="async" draggable="false"></div>`;
  }).join('');
  galleryTrack.querySelectorAll('.uniform-slide').forEach(slide => { if (photoRatios.has(slide.dataset.photo)) fitSlide(slide, photoRatios.get(slide.dataset.photo)); });
  setTrack(visualOf(galleryIndex), false);
  dialog.querySelectorAll('.uniform-dialog__prev, .uniform-dialog__next').forEach(button => { button.hidden = gallery.length < 2; });
  updateCounter();
  applyFrame(true);
  loadAround();
  resetZoom();
};
const moveGallery = direction => {
  if (gallery.length < 2) return;
  finishSlide?.();
  resetZoom();
  const visual = visualOf(galleryIndex) + direction;
  galleryIndex = (galleryIndex + direction + gallery.length) % gallery.length;
  updateCounter();
  loadSlide(visual);
  loadAround();
  applyFrame();
  if (reduceMotion()) { setTrack(visualOf(galleryIndex), false); return; }
  setTrack(visual, true);
  let timer = 0;
  const done = event => {
    if (event && (event.target !== galleryTrack || event.propertyName !== 'transform')) return;
    clearTimeout(timer);
    galleryTrack.removeEventListener('transitionend', done);
    finishSlide = null;
    setTrack(visualOf(galleryIndex), false);
  };
  galleryTrack.addEventListener('transitionend', done);
  timer = setTimeout(done, 520);
  finishSlide = () => done();
};

const openGallery = (trigger, type, index) => {
  clearTimeout(closeTimer);
  lastTrigger = trigger;
  const product = type === 'product' ? uniformProducts[index] : null;
  gallery = product ? product.images : uniformClients;
  galleryIndex = product ? 0 : index;
  galleryIsClients = !product;
  if (galleryIsClients) readThumbnailRatios();
  dialog.querySelector('h2').textContent = product ? `${product.name} ${product.code}` : 'Nossas clientes';
  dialog.querySelector('p').textContent = product ? `${product.details} · ${product.price}` : 'Momentos reais com Jhonny Stylos';
  dialog.querySelector('.uniform-dialog__sizes').textContent = product ? 'Grade por numeração: P 36/38 · M 38/40 · G 42/44 · GG 46/48 · XGG 48/52.' : '';
  const link = dialog.querySelector('a');
  link.hidden = !product;
  if (product) link.href = `https://wa.me/5585986348334?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre ${product.name}, modelo ${product.code}.`)}`;
  if (!dialog.open) dialog.showModal();
  renderGallery();
  document.body.classList.add('uniform-lightbox-open');
  requestAnimationFrame(() => dialog.classList.add('is-open'));
  dialog.querySelector('.uniform-dialog__close').focus({preventScroll: true});
};
// Fecha com a mesma transição suave do atacado.
const closeGallery = () => {
  if (!dialog.open || !dialog.classList.contains('is-open')) return;
  dialog.classList.remove('is-open');
  closeTimer = setTimeout(() => dialog.close(), reduceMotion() ? 0 : 240);
};
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-gallery], [data-details]');
  if (trigger) openGallery(trigger, trigger.dataset.gallery || 'product', Number(trigger.dataset.index ?? trigger.dataset.details));
});
dialog.querySelector('.uniform-dialog__close').addEventListener('click', closeGallery);
dialog.addEventListener('click', event => { if (event.target === dialog) closeGallery(); });
dialog.addEventListener('cancel', event => { event.preventDefault(); closeGallery(); });
dialog.addEventListener('close', () => {
  dialog.classList.remove('is-open');
  document.body.classList.remove('uniform-lightbox-open');
  pointers.clear(); gesture = null;
  lastTrigger?.focus({preventScroll: true});
});
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
    if (gesture?.type === 'swipe') { galleryMedia.classList.remove('is-dragging'); setTrack(visualOf(galleryIndex), true); }
    gesture = {type: 'pinch', distance: Math.hypot(a.x - b.x, a.y - b.y), zoom};
  } else if (pointers.size === 1) {
    if (zoom === 1) finishSlide?.();
    gesture = {type: zoom > 1 ? 'pan' : 'swipe', x: event.clientX, y: event.clientY, panX, panY, dx: 0};
    galleryMedia.classList.toggle('is-panning', zoom > 1);
  }
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
  } else if (gesture?.type === 'swipe' && gallery.length > 1) {
    // A foto acompanha o dedo, como no atacado.
    gesture.dx = event.clientX - gesture.x;
    galleryMedia.classList.add('is-dragging');
    galleryTrack.style.transform = `translate3d(calc(${-visualOf(galleryIndex) * 100}% + ${gesture.dx}px),0,0)`;
  }
});
const endGesture = event => {
  if (!pointers.has(event.pointerId)) return;
  if (gesture?.type === 'swipe' && gallery.length > 1) {
    galleryMedia.classList.remove('is-dragging');
    galleryTrack.getBoundingClientRect();
    if (event.type === 'pointerup' && Math.abs(gesture.dx) >= Math.min(70, galleryMedia.clientWidth * .18)) moveGallery(gesture.dx < 0 ? 1 : -1);
    else setTrack(visualOf(galleryIndex), true);
  }
  pointers.delete(event.pointerId);
  galleryMedia.classList.remove('is-panning');
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
