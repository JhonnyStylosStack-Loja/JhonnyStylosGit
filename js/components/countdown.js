const Countdown = {
  init(endDate) {
    const els = {
      d: document.getElementById('cd-days'),
      h: document.getElementById('cd-hours'),
      m: document.getElementById('cd-minutes'),
      s: document.getElementById('cd-seconds'),
    }
    if (!els.d) return
    const target = endDate ? new Date(endDate).getTime() : Date.now() + 86400000 * 2 + 3600000 * 5
    const tick = () => {
      const diff = target - Date.now()
      if (diff <= 0) { clearInterval(timer); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      els.d.textContent = String(d).padStart(2, '0')
      els.h.textContent = String(h).padStart(2, '0')
      els.m.textContent = String(m).padStart(2, '0')
      els.s.textContent = String(s).padStart(2, '0')
    }
    tick()
    const timer = setInterval(tick, 1000)
  }
}

document.addEventListener('DOMContentLoaded', () => Countdown.init())
