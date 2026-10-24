document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('set-password-form')
  const message = document.getElementById('password-message')
  const button = form.querySelector('button')

  form.addEventListener('submit', async event => {
    event.preventDefault()
    const password = document.getElementById('new-password').value
    const confirmation = document.getElementById('confirm-password').value
    message.className = 'password-message'

    if (password.length < 8) {
      message.textContent = 'Use pelo menos 8 caracteres.'
      message.classList.add('error')
      return
    }
    if (password !== confirmation) {
      message.textContent = 'As senhas não coincidem.'
      message.classList.add('error')
      return
    }

    button.disabled = true
    const result = await SupabaseAuth.updatePassword(password)
    button.disabled = false
    if (!result.success) {
      message.textContent = 'O link expirou ou é inválido. Solicite uma nova recuperação de senha.'
      message.classList.add('error')
      return
    }

    message.textContent = 'Senha definida com sucesso. Redirecionando para sua conta…'
    message.classList.add('success')
    setTimeout(() => { window.location.href = 'account.html' }, 1500)
  })
})
