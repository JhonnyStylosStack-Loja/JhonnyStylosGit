const Tabs = {
  init(selector = '.tabs') {
    document.querySelectorAll(selector).forEach(tabGroup => {
      const btns   = tabGroup.querySelectorAll('.tabs__btn')
      const panels = tabGroup.querySelectorAll('.tabs__panel')
      btns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('is-active'))
          panels.forEach(p => p.classList.remove('is-active'))
          btn.classList.add('is-active')
          panels[i]?.classList.add('is-active')
        })
      })
    })
  }
}

document.addEventListener('DOMContentLoaded', () => Tabs.init())
