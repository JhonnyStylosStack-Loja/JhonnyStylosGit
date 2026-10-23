class Carousel {
  constructor(el, options = {}) {
    this.el      = typeof el === 'string' ? document.querySelector(el) : el
    if (!this.el) return
    this.track   = this.el.querySelector('.carousel__track')
    this.slides  = Array.from(this.el.querySelectorAll('.carousel__slide'))
    this.prevBtn = this.el.querySelector('.carousel__prev')
    this.nextBtn = this.el.querySelector('.carousel__next')
    this.dots    = Array.from(this.el.querySelectorAll('.carousel__dot'))
    this.current = 0
    this.perView = options.perView || 1
    this.auto    = options.auto || false
    this.delay   = options.delay || 4000
    this._bind()
    if (this.auto) this._startAuto()
  }
  _bind() {
    this.prevBtn?.addEventListener('click', () => this.prev())
    this.nextBtn?.addEventListener('click', () => this.next())
    this.dots.forEach((dot, i) => dot.addEventListener('click', () => this.go(i)))
    let startX = 0
    this.track?.addEventListener('touchstart', e => { startX = e.touches[0].clientX }, { passive: true })
    this.track?.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX
      if (Math.abs(dx) > 40) dx < 0 ? this.next() : this.prev()
    })
  }
  go(index) {
    this.current = (index + this.slides.length) % this.slides.length
    const offset = -(this.current * (100 / this.perView))
    this.track.style.transform = `translateX(${offset}%)`
    this.dots.forEach((d, i) => d.classList.toggle('is-active', i === this.current))
  }
  next() { this.go(this.current + 1) }
  prev() { this.go(this.current - 1) }
  _startAuto() {
    this._timer = setInterval(() => this.next(), this.delay)
    this.el.addEventListener('mouseenter', () => clearInterval(this._timer))
    this.el.addEventListener('mouseleave', () => { this._timer = setInterval(() => this.next(), this.delay) })
  }
}
