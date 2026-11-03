const assetRoot = new URL('Catálogo Jhonny Styles (Atacado)/', document.baseURI).href;
const pages = document.getElementById('catalog-pages');
const select = document.getElementById('catalog-select');
const products = [
  {icon:'✨💖', name:'Vestido de Festa em Tule Trabalhado', size:'Veste do 38 ao 42', wholesale:'R$ 110,00', retail:'R$ 135,00', images:['Itens/Categorias/Vestidos/%2301/Adjust_proportions,_faithful_image._47fc5d77_2K.webp','Itens/Categorias/Vestidos/%2301/Recreate_image_from_new_angle_fb473cd6_2K.webp']},
  {icon:'🌸✨', name:'Vestido em Tule Bordado', size:'Veste do 36 ao 42', wholesale:'R$ 90,00', retail:'R$ 125,00', images:['Itens/Categorias/Vestidos/%2302/Adjust_proportion,_faithful_image._005d01ea_2K.webp','Itens/Categorias/Vestidos/%2302/Recreate_image_from_new_angle_9d4ceaca_2K.webp']},
  {icon:'✨💕', name:'Vestido em Alfaiataria com Cinto', size:'Veste do 38 ao 42', wholesale:'Consulte', retail:'R$ 125,00', images:['Itens/Categorias/Vestidos/%2303/Adjust_proportions,_faithful_image._5226ce27_2K.webp','Itens/Categorias/Vestidos/%2303/Recreating_image_from_new_angle_405d1b2f_2K.webp']},
  {icon:'🌸', name:'Vestido em Renda Forrado', size:'Tamanho único · Veste até o 42', wholesale:'R$ 90,00', retail:'R$ 126,00', images:['Itens/Categorias/Vestidos/%2304/Adjust_proportions,_faithful_image._61aaa233_2K.webp','Itens/Categorias/Vestidos/%2304/Requesting_image_recreation_from…_aebdf0ca_2K.webp']},
  {icon:'✨💕', name:'Vestido em Alfaiataria com Cinto', size:'Tamanho único · Veste do 38 ao 42', wholesale:'R$ 90,00', retail:'R$ 124,90', images:['Itens/Categorias/Vestidos/%2305/Adjust_proportions,_faithful_image._8ad278de_2K.webp','Itens/Categorias/Vestidos/%2305/Translate_image_request_into_Eng…_b67a63f1_2K.webp']},
  {icon:'🌸✨', name:'Vestido Longo em Cambraia Bordada', size:'Veste até o 44', wholesale:'R$ 120,00', retail:'R$ 145,00', images:['Itens/Categorias/Vestidos/%2306/Vase_with_flowers_against_wall_dffe61f6_2K%20copiar.webp','Itens/Categorias/Vestidos/%2306/Recreate_dress_model_image_6bbba825_2K.webp','Itens/Categorias/Vestidos/%2306/Recreate_dress_on_mannequin_5fe59037_2K.webp']},
  {icon:'🌸✨', name:'Vestido Midi em Tule Estampado', size:'Veste do 38 ao 42', wholesale:'R$ 85,00', retail:'R$ 125,00', images:['Itens/Categorias/Vestidos/%2307/Adjust_proportion,_faithful_image._c48f94ea_2K.webp','Itens/Categorias/Vestidos/%2307/Adjust_proportions,_faithful_image._f4dfaf60_2K.webp','Itens/Categorias/Vestidos/%2307/Recreate_image_from_new_angle_7c4d420c_2K.webp']},
  {icon:'🌸', name:'Vestido Plus Size em Viscolinho', size:'Tamanhos 44 ao 48', wholesale:'R$ 110,00', retail:'R$ 45,90', images:['Itens/Categorias/Vestidos/%238/Adjust_proportions,_faithful_image._b9ceb441_2K.webp','Itens/Categorias/Vestidos/%238/Recreate_image_from_new_angle_f4ab7040_2K.webp']},
  {icon:'🌸', name:'Vestido Longo Floral com Tule', size:'Tamanho único · Veste até 42/44', wholesale:'R$ 95,00', retail:'R$ 124,90', images:['Itens/Categorias/Vestidos/%239/Adjust_image_aspect_ratio_4112e689_2K.webp','Itens/Categorias/Vestidos/%239/Recreate_image_from_new_angle_b02b8789_2K.webp']},
  {icon:'🌸', name:'Vestido com Elastex no Busto', size:'Modelo com elastex no busto', wholesale:'R$ 85,00', retail:'R$ 124,90', images:['Itens/Categorias/Vestidos/%2310/Adjust_proportion,_faithful_image._851466fd_2K.webp','Itens/Categorias/Vestidos/%2310/Recreate_image_from_new_angle_5aadb77c_2K%20(1).webp']},
  {icon:'🌸', name:'Vestido Golinha em Tule com Forro', size:'Tamanho único · Veste até 42/44', wholesale:'R$ 85,00', retail:'R$ 124,90', images:['Itens/Categorias/Vestidos/%2311/Adjust_image_proportions_f8c3097e_2K.webp','Itens/Categorias/Vestidos/%2311/Translate_image_prompt_to_English_48164d50_2K.webp']},
  {icon:'🌸✨', name:'Vestido Elegante com Cinto', size:'Tamanho único · Veste até 44 · Acompanha cinto', wholesale:'R$ 110,00', retail:'R$ 145,00', images:['Itens/Categorias/Vestidos/%2312/Adjust_proportion,_faithful_image._e6b2afa4_2K.webp','Itens/Categorias/Vestidos/%2312/Recreate_image_from_new_angle_2c6dd0c2_2K.webp']},
  {icon:'🌸✨', name:'Vestido de Chiffon Assimétrico com Faixa', size:'Tamanho único · Veste até 42 · Acompanha faixa', wholesale:'R$ 110,00', retail:'R$ 144,90', images:['Itens/Categorias/Vestidos/%2313/Adjusting_image_aspect_ratio_ef114a51_2K.webp','Itens/Categorias/Vestidos/%2313/Recreate_image_from_new_angle_2585de82_2K.webp']},
  {icon:'🌸✨', name:'Vestido em Tule Forrado', size:'Veste até o 42 · Zíper nas costas', wholesale:'R$ 90,00', retail:'R$ 124,90', images:['Itens/Categorias/Vestidos/%2314/Adjust_proportion_faithful_image_85b4e523_2K.webp','Itens/Categorias/Vestidos/%2314/Recreate_image_from_new_angle_29491fbd_2K.webp']},
  {icon:'🌸', name:'Vestido em Renda Bordada', size:'Tamanho único · Veste até 44', wholesale:'R$ 110,00', retail:'R$ 144,90', images:['Itens/Categorias/Vestidos/%2315/Adjust_proportion,_faithful_image._61fcd575_2K.webp','Itens/Categorias/Vestidos/%2315/Recreate_image_from_new_angle_ca9fe469_2K.webp']},
  {icon:'🌸✨', name:'Vestido Longo em Crepe com Elastex', size:'Modelo forrado', wholesale:'R$ 90,00', retail:'R$ 124,90', images:['Itens/Categorias/Vestidos/%2316/Adjust_proportion,_faithful_image._e99b0c6a_2K.webp']},
  {icon:'🌸✨', name:'Vestido em Alfaiataria', size:'Tamanho único · Veste até 42 · Acompanha cinto', wholesale:'R$ 95,00', retail:'R$ 134,90', images:['Itens/Categorias/Vestidos/%2317/Adjust_proportions,_faithful_image._1af144a1_2K.webp','Itens/Categorias/Vestidos/%2317/Recreate_image_from_new_angle_1e675034_2K.webp']},
  {icon:'🌸✨', name:'Vestido Longo com Manguinha em Crepe Airflow', size:'Modelo forrado · Veste até o 42', wholesale:'R$ 95,00', retail:'R$ 134,90', images:['Itens/Categorias/Vestidos/%2318/Adjust_proportion,_faithful_image._812e0cd7_2K.webp','Itens/Categorias/Vestidos/%2318/Recreate_image_from_new_angle_26464a1a_2K.webp']},
  {icon:'🌸✨', name:'Vestido Poá em Tecido Linen', size:'Tamanho único · Veste até 42 · Acompanha cinto', wholesale:'R$ 90,00', retail:'R$ 134,90', images:['Itens/Categorias/Vestidos/%2319/Adjust_proportion,_faithful_image._1ce26c86_2K.webp','Itens/Categorias/Vestidos/%2319/Recreate_image_from_new_angle_05fc2fdd_2K.webp']},
  {icon:'🌸✨', name:'Vestido Longo em Malha Jacquard', size:'Veste até o 44 · Babadinho nos ombros', wholesale:'R$ 110,00', retail:'R$ 144,90', images:['Itens/Categorias/Vestidos/%2320/Adjust_proportion,_faithful_image._96001b7d_2K.webp','Itens/Categorias/Vestidos/%2320/Recreate_image_from_new_angle_4c7e0ee0_2K.webp']},
  {icon:'🌸✨', name:'Vestido em Tule Chiffon Forrado', size:'Veste até o 42 · Acompanha faixa', wholesale:'R$ 90,00', retail:'R$ 124,90', images:['Itens/Categorias/Vestidos/%2321/01.webp','Itens/Categorias/Vestidos/%2321/02.webp','Itens/Categorias/Vestidos/%2321/03.webp','Itens/Categorias/Vestidos/%2321/04.webp']},
  {icon:'🌸💕', name:'Vestido Plus Size Estampado', size:'Tule chiffon forrado', wholesale:'R$ 100,00', retail:'R$ 124,90', images:['Itens/Categorias/Vestidos/%2322/Adjust_proportion,_faithful_image._757da265_2K.webp','Itens/Categorias/Vestidos/%2322/Recreate_image_from_new_angle_62ca1ed5_2K.webp']},
  {icon:'🌸✨', name:'Vestido Plus Size em Renda Forrada', size:'Veste do 48 ao 52', wholesale:'R$ 120,00', retail:'R$ 144,90', images:['Itens/Categorias/Vestidos/%2323/Adjust_proportion,_faithful_image._08f4f6ac_2K.webp','Itens/Categorias/Vestidos/%2323/Adjust_proportion,_faithful_image._ee190479_2K.webp']},
  {icon:'🌸✨', name:'Vestido Florido em Tule Chiffon Forrado', size:'Tamanho único · Veste até o 42', wholesale:'R$ 85,00', retail:'R$ 154,90', images:['Itens/Categorias/Vestidos/%2324/Adjust_proportion,_faithful_image._a0eaafff_2K.webp','Itens/Categorias/Vestidos/%2324/Adjust_proportion,_faithful_image._b72ad550_2K.webp']},
  {icon:'✨', name:'Conjunto Saia Plissada', size:'Tecido alfaiataria · Tamanho único · Veste até 44', wholesale:'R$ 110,00', retail:'R$ 139,90', images:['Itens/Categorias/Vestidos/%2325/Adjust_proportion,_faithful_image._7b15dc01_2K.webp']},
  {category:'Conjuntos', icon:'✨', name:'Conjunto Acetinado', size:'Tamanhos P, M, G e GG · Fivela dourada na blusa', wholesale:'R$ 80,00', retail:'R$ 115,90', images:['Itens/Categorias/Conjuntos/%2301/01.webp','Itens/Categorias/Conjuntos/%2301/02.webp','Itens/Categorias/Conjuntos/%2301/03.webp','Itens/Categorias/Conjuntos/%2301/04.webp','Itens/Categorias/Conjuntos/%2301/05.webp','Itens/Categorias/Conjuntos/%2301/06.webp','Itens/Categorias/Conjuntos/%2301/07.webp','Itens/Categorias/Conjuntos/%2301/08.webp','Itens/Categorias/Conjuntos/%2301/09.webp','Itens/Categorias/Conjuntos/%2301/10.webp','Itens/Categorias/Conjuntos/%2301/11.webp']}
];
const categoryNames = ['Vestidos', 'Conjuntos'];
const categories = categoryNames.map(name => ({name, products: products.filter(product => (product.category || 'Vestidos') === name)}));
const catalogPages = [];
const categoryStartPages = new Map();
categories.forEach(category => {
  categoryStartPages.set(category.name, catalogPages.length + 3);
  for (let index = 0; index < category.products.length; index += 2) {
    catalogPages.push({category: category.name, products: category.products.slice(index, index + 2)});
  }
});
const totalPages = catalogPages.length + 2;
const footer = page => `<footer class="catalog-page__footer"><span>Jhonny Styles　|　Catálogo de produtos atacado</span><span>${String(page).padStart(2, '0')}</span></footer>`;
const categoryLinks = categories.map((category, index) => `<a href="#pagina-${categoryStartPages.get(category.name)}"><span>${String(index + 1).padStart(2, '0')}</span>${category.name}<span>↗</span></a>`).join('');
const coverLinks = categories.map(category => `<a href="#pagina-${categoryStartPages.get(category.name)}">${category.name}</a>`).join('');
const cover = `<section class="catalog-page catalog-cover" id="pagina-1" aria-label="Capa"><div class="catalog-cover__content"><img class="catalog-cover__logo" src="assets/images/logotipo/LOGO-MENU.webp" alt="Jhonny Styles"><div class="catalog-cover__rule"></div><h1>Catálogo<br>de Produtos<br>Atacado</h1><p>Elegância e estilo<br>em cada detalhe</p><nav aria-label="Categorias">${coverLinks}</nav><small>Moda feminina<br>atacado e varejo<br>físico e online</small></div></section>`;
const index = `<section class="catalog-page catalog-index" id="pagina-2" aria-label="Índice"><div class="catalog-page__body"><p class="catalog-eyebrow">Jhonny Styles · Moda feminina</p><h1>Encontre o seu estilo</h1><p class="catalog-index__intro">Explore as peças por categoria. Confirme modelos e disponibilidade antes de fazer seu pedido.</p><div class="catalog-index__links">${categoryLinks}</div></div>${footer(2)}</section>`;
function productPage(page) {
  const index = page - 3;
  const pageData = catalogPages[index];
  const pageProducts = pageData.products;
  const cards = pageProducts.map(product => {
    const productIndex = products.indexOf(product);
    const controls = product.images.length > 1 ? `<button class="catalog-item__arrow catalog-item__arrow--previous" type="button" data-direction="-1" aria-label="Foto anterior de ${product.name}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 4.5-7.5 7.5 7.5 7.5"/></svg></button><button class="catalog-item__arrow catalog-item__arrow--next" type="button" data-direction="1" aria-label="Próxima foto de ${product.name}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 4.5 7.5 7.5L9 19.5"/></svg></button><span class="catalog-item__image-count" aria-live="polite">1/${product.images.length}</span>` : '';
    const slides = product.images.map((image, imageIndex) => `<img src="${assetRoot}${image}" alt="${product.name}, foto ${imageIndex + 1} de ${product.images.length}" loading="lazy" decoding="async">`).join('');
    const track = product.images.length > 1 ? `<div class="catalog-item__track"><img src="${assetRoot}${product.images.at(-1)}" alt="" aria-hidden="true" loading="lazy" decoding="async">${slides}<img src="${assetRoot}${product.images[0]}" alt="" aria-hidden="true" loading="lazy" decoding="async"></div>` : `<div class="catalog-item__track catalog-item__track--single">${slides}</div>`;
    return `<article class="catalog-item"><div class="catalog-item__media" data-product="${productIndex}" data-image="0" role="button" tabindex="0" aria-label="Ampliar fotos de ${product.name}">${track}${controls}</div><div class="catalog-item__copy"><h2>${product.name} <span class="catalog-item__title-icon" aria-hidden="true">${product.icon}</span></h2><p>${product.size}</p><span>Atacado: ${product.wholesale}</span><span>Varejo: ${product.retail}</span></div></article>`;
  }).join('');
  const background = ((index % 3) + 1).toString().padStart(2, '0');
  const gridClass = pageProducts.length === 1 ? 'catalog-grid catalog-grid--single' : 'catalog-grid';
  return `<section class="catalog-page catalog-products" id="pagina-${page}" style="--page-background:url('${assetRoot}Background Paginas/Back${background}.webp')" aria-label="Página ${page}, ${pageData.category}"><div class="catalog-page__body"><div class="catalog-products__heading"><h1>${pageData.category}</h1><p>Elegância e estilo<br>em cada detalhe.</p></div><div class="${gridClass}">${cards}</div></div>${footer(page)}</section>`;
}
pages.innerHTML = cover + index + catalogPages.map((_, index) => productPage(index + 3)).join('');
document.body.insertAdjacentHTML('beforeend', `<div class="catalog-lightbox" id="catalog-lightbox" role="dialog" aria-modal="true" aria-labelledby="catalog-lightbox-title" hidden><button class="catalog-lightbox__close" type="button" aria-label="Fechar imagem ampliada">×</button><div class="catalog-lightbox__dialog"><div class="catalog-lightbox__stage"></div><div class="catalog-lightbox__zoom" aria-label="Controles de zoom"><button type="button" data-zoom-action="out" aria-label="Diminuir zoom">−</button><output aria-live="polite">100%</output><button type="button" data-zoom-action="in" aria-label="Aumentar zoom">+</button><button class="catalog-lightbox__zoom-reset" type="button" data-zoom-action="reset">Restaurar</button></div><div class="catalog-lightbox__caption"><h2 id="catalog-lightbox-title"></h2><p></p></div></div></div>`);
const lightbox = document.getElementById('catalog-lightbox');
const lightboxStage = lightbox.querySelector('.catalog-lightbox__stage');
let lightboxTrigger = null;
let lightboxCloseTimer = 0;
function updateLightboxZoomTarget(media) {
  const images = media?.querySelectorAll('.catalog-item__track img');
  if (!images?.length) return;
  images.forEach(image => image.classList.remove('catalog-lightbox__zoom-target'));
  const product = products[Number(media.dataset.product)];
  const visualIndex = product.images.length > 1 ? Number(media.dataset.image) + 1 : 0;
  images[visualIndex]?.classList.add('catalog-lightbox__zoom-target');
}
function setLightboxPan(media, x, y) {
  const zoom = Number(media.dataset.zoom) || 1;
  const maxX = media.clientWidth * (zoom - 1) / 2;
  const maxY = media.clientHeight * (zoom - 1) / 2;
  const panX = Math.max(-maxX, Math.min(maxX, x));
  const panY = Math.max(-maxY, Math.min(maxY, y));
  media.dataset.panX = panX;
  media.dataset.panY = panY;
  media.style.setProperty('--pan-x', `${panX}px`);
  media.style.setProperty('--pan-y', `${panY}px`);
}
function setLightboxZoom(media, value, snap = true) {
  if (!media) return;
  updateLightboxZoomTarget(media);
  const zoom = Math.max(1, Math.min(3, snap ? Math.round(value * 4) / 4 : value));
  media.dataset.zoom = zoom;
  media.style.setProperty('--zoom', zoom);
  media.classList.toggle('is-zoomed', zoom > 1);
  if (zoom === 1) setLightboxPan(media, 0, 0);
  else setLightboxPan(media, Number(media.dataset.panX) || 0, Number(media.dataset.panY) || 0);
  lightbox.querySelector('.catalog-lightbox__zoom output').textContent = `${Math.round(zoom * 100)}%`;
  lightbox.querySelector('[data-zoom-action="out"]').disabled = zoom <= 1;
  lightbox.querySelector('[data-zoom-action="in"]').disabled = zoom >= 3;
  lightbox.querySelector('[data-zoom-action="reset"]').disabled = zoom === 1;
}
function openLightbox(sourceMedia) {
  clearTimeout(lightboxCloseTimer);
  lightboxTrigger = sourceMedia;
  const product = products[Number(sourceMedia.dataset.product)];
  const media = sourceMedia.cloneNode(true);
  media.classList.add('catalog-lightbox__media');
  media.removeAttribute('role');
  media.removeAttribute('tabindex');
  media.removeAttribute('aria-label');
  media.dataset.animating = 'false';
  media.dataset.panX = '0';
  media.dataset.panY = '0';
  media.querySelector('.catalog-item__track').style.transform = product.images.length > 1 ? `translate3d(-${(Number(media.dataset.image) + 1) * 100}%,0,0)` : 'none';
  lightboxStage.replaceChildren(media);
  setLightboxZoom(media, 1);
  lightbox.querySelector('h2').textContent = `${product.name} ${product.icon}`;
  lightbox.querySelector('.catalog-lightbox__caption p').textContent = `${product.size} · Atacado: ${product.wholesale} · Varejo: ${product.retail}`;
  lightbox.hidden = false;
  document.body.classList.add('catalog-lightbox-open');
  requestAnimationFrame(() => lightbox.classList.add('is-open'));
  lightbox.querySelector('.catalog-lightbox__close').focus({preventScroll:true});
}
function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.classList.remove('is-open');
  document.body.classList.remove('catalog-lightbox-open');
  lightboxCloseTimer = window.setTimeout(() => {
    lightbox.hidden = true;
    lightboxStage.replaceChildren();
  }, 220);
  lightboxTrigger?.focus?.({preventScroll:true});
}
const carouselAnimations = new WeakMap();
function moveProductImage(media, direction) {
  const product = products[Number(media.dataset.product)];
  if (product.images.length < 2 || media.dataset.animating === 'true') return false;
  if (media.classList.contains('catalog-lightbox__media')) setLightboxZoom(media, 1);
  const track = media.querySelector('.catalog-item__track');
  const currentIndex = Number(media.dataset.image);
  const visualIndex = currentIndex + direction;
  const imageIndex = (visualIndex + product.images.length) % product.images.length;
  media.dataset.image = imageIndex;
  media.dataset.animating = 'true';
  track.style.transform = `translate3d(-${(visualIndex + 1) * 100}%,0,0)`;
  media.querySelector('.catalog-item__image-count').textContent = `${imageIndex + 1}/${product.images.length}`;
  let settled = false;
  const finishAnimation = event => {
    if (settled || (event && (event.target !== track || event.propertyName !== 'transform'))) return;
    settled = true;
    window.clearTimeout(carouselAnimations.get(media)?.timer);
    carouselAnimations.delete(media);
    track.removeEventListener('transitionend', finishAnimation);
    track.classList.add('is-resetting');
    track.style.transform = `translate3d(-${(imageIndex + 1) * 100}%,0,0)`;
    track.getBoundingClientRect();
    track.classList.remove('is-resetting');
    media.dataset.animating = 'false';
  };
  track.addEventListener('transitionend', finishAnimation);
  const timer = window.setTimeout(finishAnimation, 520);
  carouselAnimations.set(media, {timer, finish: finishAnimation});
  return true;
}
let suppressMediaClick = false;
document.addEventListener('click', event => {
  const zoomAction = event.target.closest('[data-zoom-action]');
  if (zoomAction) {
    const media = lightbox.querySelector('.catalog-lightbox__media');
    const zoom = Number(media?.dataset.zoom) || 1;
    setLightboxZoom(media, zoomAction.dataset.zoomAction === 'in' ? zoom + .25 : zoomAction.dataset.zoomAction === 'out' ? zoom - .25 : 1);
    return;
  }
  const arrow = event.target.closest('.catalog-item__arrow');
  if (arrow) {
    moveProductImage(arrow.closest('.catalog-item__media'), Number(arrow.dataset.direction));
    return;
  }
  if (event.target.closest('.catalog-lightbox__close') || event.target === lightbox) {
    closeLightbox();
    return;
  }
  const media = event.target.closest('.catalog-products .catalog-item__media');
  if (media && !suppressMediaClick) openLightbox(media);
  suppressMediaClick = false;
});
let draggedMedia = null;
let dragStartX = 0;
let dragDistance = 0;
let panningMedia = null;
let panStartX = 0;
let panStartY = 0;
let panOriginX = 0;
let panOriginY = 0;
const lightboxTouchPoints = new Map();
let pinchGestureActive = false;
let pinchInitialDistance = 0;
let pinchInitialZoom = 1;
let pinchMedia = null;
function touchDistance() {
  const [first, second] = [...lightboxTouchPoints.values()];
  return first && second ? Math.hypot(second.x - first.x, second.y - first.y) : 0;
}
document.addEventListener('pointerdown', event => {
  const media = event.target.closest('.catalog-item__media');
  if (!media || event.target.closest('.catalog-item__arrow')) return;
  if (event.pointerType === 'touch' && media.classList.contains('catalog-lightbox__media')) {
    lightboxTouchPoints.set(event.pointerId, {x:event.clientX, y:event.clientY});
    if (lightboxTouchPoints.size === 2) {
      pinchGestureActive = true;
      pinchMedia = media;
      pinchInitialDistance = touchDistance();
      pinchInitialZoom = Number(media.dataset.zoom) || 1;
      panningMedia?.classList.remove('is-panning');
      panningMedia = null;
      if (draggedMedia) {
        draggedMedia.classList.remove('is-dragging');
        draggedMedia.querySelector('.catalog-item__track').style.transform = `translate3d(-${(Number(draggedMedia.dataset.image) + 1) * 100}%,0,0)`;
        draggedMedia = null;
      }
      suppressMediaClick = true;
      media.setPointerCapture(event.pointerId);
      return;
    }
  }
  if (media.classList.contains('catalog-lightbox__media') && Number(media.dataset.zoom) > 1) {
    panningMedia = media;
    panStartX = event.clientX;
    panStartY = event.clientY;
    panOriginX = Number(media.dataset.panX) || 0;
    panOriginY = Number(media.dataset.panY) || 0;
    suppressMediaClick = true;
    media.classList.add('is-panning');
    media.setPointerCapture(event.pointerId);
    return;
  }
  carouselAnimations.get(media)?.finish();
  dragDistance = 0;
  suppressMediaClick = false;
  if (products[Number(media.dataset.product)].images.length < 2) return;
  draggedMedia = media;
  dragStartX = event.clientX;
  media.classList.add('is-dragging');
  media.setPointerCapture(event.pointerId);
});
document.addEventListener('pointermove', event => {
  if (lightboxTouchPoints.has(event.pointerId)) {
    lightboxTouchPoints.set(event.pointerId, {x:event.clientX, y:event.clientY});
    if (pinchGestureActive && lightboxTouchPoints.size >= 2) {
      const distance = touchDistance();
      if (pinchInitialDistance > 0) setLightboxZoom(pinchMedia, pinchInitialZoom * distance / pinchInitialDistance, false);
      return;
    }
  }
  if (panningMedia) {
    setLightboxPan(panningMedia, panOriginX + event.clientX - panStartX, panOriginY + event.clientY - panStartY);
    return;
  }
  if (!draggedMedia) return;
  dragDistance = event.clientX - dragStartX;
  if (Math.abs(dragDistance) > 6) suppressMediaClick = true;
  const imageIndex = Number(draggedMedia.dataset.image);
  draggedMedia.querySelector('.catalog-item__track').style.transform = `translate3d(calc(-${(imageIndex + 1) * 100}% + ${dragDistance}px),0,0)`;
});
document.addEventListener('pointerup', event => {
  if (lightboxTouchPoints.has(event.pointerId)) {
    lightboxTouchPoints.delete(event.pointerId);
    if (pinchGestureActive) {
      if (lightboxTouchPoints.size === 0) {
        pinchGestureActive = false;
        pinchMedia = null;
      }
      return;
    }
  }
  if (panningMedia) {
    panningMedia.classList.remove('is-panning');
    panningMedia = null;
    return;
  }
  if (!draggedMedia) return;
  const media = draggedMedia;
  const track = media.querySelector('.catalog-item__track');
  media.classList.remove('is-dragging');
  draggedMedia = null;
  track.getBoundingClientRect();
  if (Math.abs(dragDistance) >= Math.min(70, media.clientWidth * .18)) {
    if (!moveProductImage(media, dragDistance < 0 ? 1 : -1)) {
      track.style.transform = `translate3d(-${(Number(media.dataset.image) + 1) * 100}%,0,0)`;
    }
  } else {
    track.style.transform = `translate3d(-${(Number(media.dataset.image) + 1) * 100}%,0,0)`;
  }
});
document.addEventListener('pointercancel', event => {
  lightboxTouchPoints.delete(event.pointerId);
  if (lightboxTouchPoints.size === 0) {
    pinchGestureActive = false;
    pinchMedia = null;
  }
  if (panningMedia) panningMedia.classList.remove('is-panning');
  panningMedia = null;
  if (draggedMedia) {
    draggedMedia.classList.remove('is-dragging');
    draggedMedia.querySelector('.catalog-item__track').style.transform = `translate3d(-${(Number(draggedMedia.dataset.image) + 1) * 100}%,0,0)`;
  }
  draggedMedia = null;
});
document.addEventListener('dragstart', event => {
  if (event.target.closest('.catalog-item__media')) event.preventDefault();
});
lightbox.addEventListener('dblclick', event => {
  const media = event.target.closest('.catalog-lightbox__media');
  if (media && !event.target.closest('.catalog-item__arrow')) setLightboxZoom(media, Number(media.dataset.zoom) > 1 ? 1 : 2);
});
lightbox.addEventListener('wheel', event => {
  const media = event.target.closest('.catalog-lightbox__media');
  if (!media) return;
  event.preventDefault();
  setLightboxZoom(media, (Number(media.dataset.zoom) || 1) + (event.deltaY < 0 ? .25 : -.25));
}, {passive:false});
document.addEventListener('keydown', event => {
  if (lightbox.hidden) {
    const media = event.target.closest?.('.catalog-products .catalog-item__media');
    if (media && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openLightbox(media);
    }
    return;
  }
  if (event.key === 'Escape') closeLightbox();
  if (event.key === '+' || event.key === '=') {
    event.preventDefault();
    const media = lightbox.querySelector('.catalog-lightbox__media');
    setLightboxZoom(media, (Number(media?.dataset.zoom) || 1) + .25);
  }
  if (event.key === '-') {
    event.preventDefault();
    const media = lightbox.querySelector('.catalog-lightbox__media');
    setLightboxZoom(media, (Number(media?.dataset.zoom) || 1) - .25);
  }
  if (event.key === '0') {
    event.preventDefault();
    setLightboxZoom(lightbox.querySelector('.catalog-lightbox__media'), 1);
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const media = lightbox.querySelector('.catalog-item__media');
    if (media) moveProductImage(media, event.key === 'ArrowLeft' ? -1 : 1);
  }
});
select.innerHTML = Array.from({length: totalPages}, (_, i) => `<option value="pagina-${i + 1}">${String(i + 1).padStart(2, '0')}</option>`).join('');
select.addEventListener('change', () => document.getElementById(select.value).scrollIntoView({behavior:'smooth'}));
const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) { select.value = visible.target.id; updateFloatingNavigation(); }
}, {rootMargin:'-20% 0px -50% 0px', threshold:0});
document.querySelectorAll('.catalog-page').forEach(page => observer.observe(page));
const requestedPage = Number(new URLSearchParams(location.search).get('pagina'));
if (requestedPage >= 1 && requestedPage <= totalPages) requestAnimationFrame(() => document.getElementById(`pagina-${requestedPage}`).scrollIntoView());

const floatingPrevious = document.getElementById('catalog-prev');
const floatingNext = document.getElementById('catalog-next');
const pageInput = document.getElementById('catalog-page-input');
const pageTotal = document.getElementById('catalog-page-total');
pageInput.max = totalPages;
pageTotal.textContent = `/ ${totalPages}`;
function currentPageNumber() { return Number(select.value.replace('pagina-', '')) || 1; }
function updateFloatingNavigation() {
  const page = currentPageNumber();
  floatingPrevious.disabled = page <= 1;
  floatingNext.disabled = page >= totalPages;
  if (document.activeElement !== pageInput) pageInput.value = page;
}
function movePage(direction) {
  const target = Math.max(1, Math.min(totalPages, currentPageNumber() + direction));
  stopWheelMotion();
  document.getElementById(`pagina-${target}`).scrollIntoView({behavior:'smooth', block:'start'});
  select.value = `pagina-${target}`;
  updateFloatingNavigation();
}
floatingPrevious.addEventListener('click', () => movePage(-1));
floatingNext.addEventListener('click', () => movePage(1));
window.addEventListener('scroll', updateFloatingNavigation, {passive:true});
updateFloatingNavigation();



pageInput.addEventListener('focus', () => pageInput.select());
pageInput.addEventListener('change', () => {
  const page = Number(pageInput.value);
  if (Number.isInteger(page) && page >= 1 && page <= totalPages) {
    stopWheelMotion();
    document.getElementById(`pagina-${page}`).scrollIntoView({behavior:'smooth', block:'start'});
    select.value = `pagina-${page}`;
    updateFloatingNavigation();
  } else {
    pageInput.value = currentPageNumber();
  }
});
pageInput.addEventListener('keydown', event => { if (event.key === 'Enter') pageInput.blur(); });




document.getElementById('catalog-back-to-cover').addEventListener('click', () => {
  stopWheelMotion();
  window.scrollTo({top: 0, behavior: 'smooth'});
  select.value = 'pagina-1';
  updateFloatingNavigation();
});



/* Rolagem de roda com desaceleração curta; toque mantém o comportamento nativo. */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let wheelTarget = window.scrollY;
let wheelPosition = window.scrollY;
let wheelFrame = 0;
function stopWheelMotion() {
  if (wheelFrame) cancelAnimationFrame(wheelFrame);
  wheelFrame = 0;
  wheelTarget = window.scrollY;
  wheelPosition = window.scrollY;
}
function animateWheel() {
  const distance = wheelTarget - wheelPosition;
  if (Math.abs(distance) < 0.35) {
    wheelPosition = wheelTarget;
    window.scrollTo({top: wheelPosition, behavior: 'instant'});
    wheelFrame = 0;
    return;
  }
  wheelPosition += distance * (Math.abs(distance) > 120 ? 0.26 : 0.09);
  window.scrollTo({top: wheelPosition, behavior: 'instant'});
  wheelFrame = requestAnimationFrame(animateWheel);
}
window.addEventListener('wheel', event => {
  if (!lightbox.hidden || reducedMotion.matches || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input, select, textarea')) return;
  event.preventDefault();
  if (!wheelFrame) wheelTarget = wheelPosition = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const delta = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? event.deltaY * window.innerHeight : event.deltaY;
  wheelTarget = Math.max(0, Math.min(maxScroll, wheelTarget + delta));
  if (!wheelFrame) wheelFrame = requestAnimationFrame(animateWheel);
}, {passive:false});
reducedMotion.addEventListener('change', stopWheelMotion);
window.addEventListener('pointerdown', stopWheelMotion, {passive:true});
window.addEventListener('touchstart', stopWheelMotion, {passive:true});
window.addEventListener('keydown', stopWheelMotion);
