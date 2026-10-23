const HeroSlider = {
  realTotal: 0,
  current: 1,
  autoInterval: null,
  isAnimating: false,
  _snapTimer: null,
  dragStartX: 0,
  dragDelta: 0,
  isDragging: false,
  DRAG_THRESHOLD: 60,
  AUTO_DELAY: 5000,
  TRANSITION_MS: 550,

  init() {
    const root = document.getElementById('hero-slider')
    if (!root) return

    this.root     = root
    this.track    = document.getElementById('slider-track')
    this.progress = root.querySelector('.hero-slider__progress')
    this.dots     = Array.from(root.querySelectorAll('.hero-slider__dot'))

    const realSlides = Array.from(this.track.querySelectorAll('.hero-slide'))
    this.realTotal   = realSlides.length

    const cloneFirst = realSlides[0].cloneNode(true)
    const cloneLast  = realSlides[realSlides.length - 1].cloneNode(true)
    cloneFirst.classList.remove('is-active')
    cloneLast.classList.remove('is-active')
    this.track.appendChild(cloneFirst)
    this.track.insertBefore(cloneLast, realSlides[0])

    this.slides = Array.from(this.track.querySelectorAll('.hero-slide'))

    root.querySelector('.hero-slider__arrow--prev')
      ?.addEventListener('click', () => { this.prev(); this._resetAuto() })
    root.querySelector('.hero-slider__arrow--next')
      ?.addEventListener('click', () => { this.next(); this._resetAuto() })

    this.dots.forEach((dot, i) =>
      dot.addEventListener('click', () => { this.goTo(i + 1); this._resetAuto() })
    )

    this._initDrag()
    this._initKeyboard()
    this._jumpTo(1)
    this._startAuto()
  },

  goTo(index) {
    // Ignora cliques/gestos durante uma transição em andamento — evita que o
    // índice ultrapasse os clones das pontas (o que deixava o slider em branco).
    if (this.isAnimating) return
    this.isAnimating = true

    clearTimeout(this._snapTimer)
    this.current = index
    this.track.style.transition = `transform ${this.TRANSITION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`
    this.track.style.transform  = `translateX(-${index * 100}%)`
    this._updateState()

    // Deterministic snap-back via timeout — never relies on transitionend
    this._snapTimer = setTimeout(() => {
      if (index === 0)                      this._jumpTo(this.realTotal)
      else if (index === this.realTotal + 1) this._jumpTo(1)
      this.isAnimating = false
    }, this.TRANSITION_MS + 20)
  },

  _jumpTo(index) {
    clearTimeout(this._snapTimer)
    this.current = index
    this.track.style.transition = 'none'
    this.track.style.transform  = `translateX(-${index * 100}%)`
    this._updateState()
  },

  next() { this.goTo(this.current + 1) },
  prev() { this.goTo(this.current - 1) },

  _updateState() {
    let realIdx = this.current - 1
    if (realIdx < 0)               realIdx = this.realTotal - 1
    if (realIdx >= this.realTotal) realIdx = 0

    this.slides.forEach(s => s.classList.remove('is-active'))
    this.slides[this.current]?.classList.add('is-active')

    this.dots.forEach(d => d.classList.remove('is-active'))
    this.dots[realIdx]?.classList.add('is-active')

    this._animateProgress()
  },

  _startAuto() {
    this.autoInterval = setInterval(() => this.next(), this.AUTO_DELAY)
  },
  _resetAuto() {
    clearInterval(this.autoInterval)
    this._startAuto()
  },

  _animateProgress() {
    if (!this.progress) return
    this.progress.style.transition = 'none'
    this.progress.style.width = '0%'
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.progress.style.transition = `width ${this.AUTO_DELAY}ms linear`
      this.progress.style.width = '100%'
    }))
  },

  _initDrag() {
    const start = x => {
      this.isDragging = true
      this.dragStartX = x
      this.dragDelta  = 0
      this.track.classList.add('is-dragging')
      this.root.classList.add('is-dragging')
    }
    const move = x => {
      if (!this.isDragging) return
      this.dragDelta = x - this.dragStartX
      this.track.style.transition = 'none'
      this.track.style.transform  =
        `translateX(calc(-${this.current * 100}% + ${this.dragDelta}px))`
    }
    const end = () => {
      if (!this.isDragging) return
      this.isDragging = false
      this.track.classList.remove('is-dragging')
      this.root.classList.remove('is-dragging')
      if      (this.dragDelta < -this.DRAG_THRESHOLD) { this.next(); this._resetAuto() }
      else if (this.dragDelta >  this.DRAG_THRESHOLD) { this.prev(); this._resetAuto() }
      // dragDelta === 0 significa que não houve arrasto (foi só um clique, ex.: nas
      // setas) — nesse caso não faz nada aqui, senão consome o travamento de animação
      // antes do próprio clique (ex.: da seta) ser processado.
      else if (this.dragDelta !== 0) this.goTo(this.current)
    }

    this.root.addEventListener('mousedown',  e => start(e.clientX))
    window.addEventListener('mousemove',     e => { if (this.isDragging) move(e.clientX) })
    window.addEventListener('mouseup',       end)
    this.root.addEventListener('touchstart', e => start(e.touches[0].clientX), { passive: true })
    this.root.addEventListener('touchmove',  e => { if (this.isDragging) move(e.touches[0].clientX) }, { passive: true })
    this.root.addEventListener('touchend',   end)
  },

  _initKeyboard() {
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { this.prev(); this._resetAuto() }
      if (e.key === 'ArrowRight') { this.next(); this._resetAuto() }
    })
  }
}

document.addEventListener('DOMContentLoaded', () => HeroSlider.init())
