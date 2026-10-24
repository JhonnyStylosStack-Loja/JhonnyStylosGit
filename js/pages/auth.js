document.addEventListener('DOMContentLoaded', () => {
  Toast.init()
  // Auth tabs (Login / Register)
  const tabBtns = document.querySelectorAll('.auth-tab-btn')
  const panels  = document.querySelectorAll('.auth-panel-form')
  const loginPanel = document.getElementById('login-panel')
  const registerPanel = document.getElementById('register-panel')
  const recoveryPanel = document.getElementById('recovery-panel')
  const showPanel = (panel, activeTab = -1) => {
    panels.forEach(item => item.classList.remove('is-active'))
    tabBtns.forEach(btn => btn.classList.remove('is-active'))
    panel?.classList.add('is-active')
    if (activeTab >= 0) tabBtns[activeTab]?.classList.add('is-active')
  }

  tabBtns[0]?.addEventListener('click', () => showPanel(loginPanel, 0))
  tabBtns[1]?.addEventListener('click', () => showPanel(registerPanel, 1))

  document.getElementById('forgot-password-link')?.addEventListener('click', event => {
    event.preventDefault()
    const loginEmail = document.getElementById('login-email').value.trim()
    const recoveryEmail = document.getElementById('recovery-email')
    if (loginEmail) recoveryEmail.value = loginEmail
    showPanel(recoveryPanel)
    history.replaceState(null, '', '#recuperar-senha')
    recoveryEmail.focus()
  })

  document.getElementById('back-to-login')?.addEventListener('click', () => {
    showPanel(loginPanel, 0)
    history.replaceState(null, '', location.pathname + location.search)
  })

  if (location.hash === '#recuperar-senha') showPanel(recoveryPanel)

  document.getElementById('forgot-password-form')?.addEventListener('submit', async event => {
    event.preventDefault()
    const emailInput = document.getElementById('recovery-email')
    const message = document.getElementById('recovery-message')
    const button = event.currentTarget.querySelector('button[type="submit"]')
    const email = emailInput.value.trim()
    message.className = 'auth-form__message'

    if (!email || !emailInput.checkValidity()) {
      message.textContent = 'Informe um endereço de e-mail válido.'
      message.classList.add('is-error')
      emailInput.focus()
      return
    }

    button.disabled = true
    button.textContent = 'Enviando…'
    let result
    try {
      result = await SupabaseAuth.requestPasswordReset(email)
    } finally {
      button.disabled = false
      button.textContent = 'Enviar link de recuperação'
    }

    if (!result?.success) {
      message.textContent = result?.code === 'over_email_send_rate_limit'
        ? 'Aguarde cerca de 1 minuto antes de solicitar outro link.'
        : result?.error || 'Não foi possível enviar agora. Tente novamente.'
      message.classList.add('is-error')
      return
    }

    event.currentTarget.reset()
    message.textContent = 'Se o e-mail estiver cadastrado, o link chegará em instantes.'
    message.classList.add('is-success')
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
      await Cart.mergeFromCloud()
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
      document.getElementById('register-form').reset()
      document.getElementById('login-email').value = email
      showPanel(loginPanel, 0)
    } else {
      Toast.show('Erro ao cadastrar', result.error, 'error')
    }
  })
})
