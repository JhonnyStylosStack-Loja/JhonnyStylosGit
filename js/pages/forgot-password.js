document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('forgot-password-form')
  const emailInput = document.getElementById('recovery-email')
  const message = document.getElementById('recovery-message')
  const button = form.querySelector('button')

  form.addEventListener('submit', async event => {
    event.preventDefault()
    const email = emailInput.value.trim()
    message.className = 'recovery-message'

    if (!email || !emailInput.checkValidity()) {
      message.textContent = 'Informe um endereço de e-mail válido.'
      message.classList.add('error')
      emailInput.focus()
      return
    }

    button.disabled = true
    button.textContent = 'Enviando…'
    const result = await SupabaseAuth.requestPasswordReset(email)
    button.disabled = false
    button.textContent = 'Enviar link de recuperação'

    if (!result.success) {
      message.textContent = 'Não foi possível enviar o link agora. Aguarde um momento e tente novamente.'
      message.classList.add('error')
      return
    }

    form.reset()
    message.textContent = 'Se este e-mail estiver cadastrado, você receberá o link de recuperação em instantes.'
    message.classList.add('success')
  })
})
