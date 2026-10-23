document.addEventListener('DOMContentLoaded', () => {
  Toast.init()
  // Auth tabs (Login / Register)
  const tabBtns = document.querySelectorAll('.auth-tab-btn')
  const panels  = document.querySelectorAll('.auth-panel-form')
  tabBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('is-active'))
      panels.forEach(p => p.classList.remove('is-active'))
      btn.classList.add('is-active')
      panels[i]?.classList.add('is-active')
    })
  })

  // Login form
  document.getElementById('login-form')?.addEventListener('submit', async e => {
    e.preventDefault()
    const email = document.getElementById('login-email').value.trim()
    const password = document.getElementById('login-password').value
    if (!email || !password) {
      Toast.show('Ops!', 'Preencha e-mail e senha.', 'error')
      return
    }
    const result = await SupabaseAuth.login(email, password)
    if (result.success) {
      Toast.show('Bem-vindo de volta!', 'Login realizado com sucesso.', 'success')
      // Sempre vai pro início — admin ou não. O painel só é acessado pelo botão do header.
      const canAccessCRM = await SupabaseAuth.canAccessCRM()
      setTimeout(() => { location.href = canAccessCRM ? 'admin.html' : 'index.html' }, 1500)
    } else {
      Toast.show('Erro ao entrar', result.error, 'error')
    }
  })

  // Register form
  document.getElementById('register-form')?.addEventListener('submit', async e => {
    e.preventDefault()
    const firstName = document.getElementById('register-firstname').value.trim()
    const lastName = document.getElementById('register-lastname').value.trim()
    const email = document.getElementById('register-email').value.trim()
    const password = document.getElementById('register-password').value
    const confirmPassword = document.getElementById('register-confirm-password').value
    const terms = document.getElementById('terms')?.checked

    if (!firstName || !lastName || !email || !password) {
      Toast.show('Ops!', 'Preencha todos os campos.', 'error')
      return
    }
    if (password.length < 8) {
      Toast.show('Senha muito curta', 'Use no mínimo 8 caracteres.', 'error')
      return
    }
    if (password !== confirmPassword) {
      Toast.show('Senhas diferentes', 'As senhas não coincidem.', 'error')
      return
    }
    if (!terms) {
      Toast.show('Termos', 'Você precisa concordar com os Termos e a Política de Privacidade.', 'error')
      return
    }

    const result = await SupabaseAuth.signup(email, password, `${firstName} ${lastName}`)
    if (result.success) {
      Toast.show('Conta criada!', result.message, 'success')
      setTimeout(() => { location.href = 'account.html' }, 1500)
    } else {
      Toast.show('Erro ao cadastrar', result.error, 'error')
    }
  })
})
