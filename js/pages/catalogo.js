const assetRoot = new URL('Catálogo Jhonny Styles/', document.baseURI).href;
const productPlaceholder = 'Catálogo Jhonny Styles/PLACAHOLDER/PLACEHOLTER CATALOGO.png';
const categories = ['Vestidos', 'Conjuntos', 'Blusas & Tops', 'Calças & Saias', 'Shorts'];
const totalPages = 50;
const pages = document.getElementById('catalog-pages');
const select = document.getElementById('catalog-select');
const footer = page => `<footer class="catalog-page__footer"><span>Jhonny Styles　|　Catálogo de produtos atacado</span><span>${String(page).padStart(2, '0')}</span></footer>`;
const cover = `<section class="catalog-page catalog-cover" id="pagina-1" aria-label="Capa"><div class="catalog-cover__content"><img class="catalog-cover__logo" src="assets/images/logotipo/LOGO-MENU.webp" alt="Jhonny Styles"><div class="catalog-cover__rule"></div><h1>Catálogo<br>de Produtos<br>Atacado</h1><p>Elegância e estilo<br>em cada detalhe</p><nav aria-label="Categorias"><a href="#pagina-3">Vestidos</a><a href="#pagina-12">Conjuntos</a><a href="#pagina-21">Blusas & Tops</a><a href="#pagina-30">Calças & Saias</a><a href="#pagina-39">Shorts</a></nav><small>Moda feminina<br>atacado e varejo<br>físico e online</small></div></section>`;
const index = `<section class="catalog-page catalog-index" id="pagina-2" aria-label="Índice"><div class="catalog-page__body"><p class="catalog-eyebrow">Jhonny Styles · Moda feminina</p><h1>Encontre o seu estilo</h1><p class="catalog-index__intro">Explore as peças por categoria. As fotos desta edição são ilustrativas; confirme modelos e disponibilidade antes de fazer seu pedido.</p><div class="catalog-index__links">${categories.map((name, i) => `<a href="#pagina-${3 + i * 9}"><span>0${i + 1}</span>${name}<span>↗</span></a>`).join('')}</div></div>${footer(2)}</section>`;
function productPage(page) {
  const index = page - 3;
  const category = categories[Math.min(4, Math.floor(index / 9))];
  const cards = Array.from({length: 4}, (_, slot) => {
    const number = index * 4 + slot + 1;

    return `<article class="catalog-item"><img src="${productPlaceholder}" alt="Espaço reservado para a imagem da peça ${String(number).padStart(3, '0')}" loading="lazy" decoding="async"><div class="catalog-item__copy"><div class="catalog-item__title-row"><h2>Peça ${String(number).padStart(3, '0')}</h2><span class="catalog-item__price" aria-label="Preço ilustrativo">R$ 0,00</span></div><p>${category}</p></div></article>`;
  }).join('');
  const background = ((index % 3) + 1).toString().padStart(2, '0');
  return `<section class="catalog-page catalog-products" id="pagina-${page}" style="--page-background:url('${assetRoot}Background Paginas/Back${background}.png')" aria-label="Página ${page}, ${category}"><div class="catalog-page__body"><div class="catalog-products__heading"><h1>${category}</h1><p>Elegância e estilo<br>em cada detalhe.</p></div><div class="catalog-grid">${cards}</div></div>${footer(page)}</section>`;
}
const back = `<section class="catalog-page catalog-back" id="pagina-50" aria-label="Contracapa"><div><img src="assets/images/logotipo/LOGO-MENU.webp" alt="Jhonny Styles"><h1>Obrigada por explorar nossa coleção.</h1><p>Entre em contato para consultar modelos, preços e disponibilidade.</p><a href="index.html">Voltar à loja ↗</a></div>${footer(50)}</section>`;
pages.innerHTML = cover + index + Array.from({length: 47}, (_, i) => productPage(i + 3)).join('') + back;
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
  if (reducedMotion.matches || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input, select, textarea')) return;
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
