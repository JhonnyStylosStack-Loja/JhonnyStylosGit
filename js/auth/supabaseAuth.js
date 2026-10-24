/**
 * Camada de autenticação — usa o client global `supabaseClient` (js/config/supabase.js).
 * Padrão de objeto global, igual ao CMS em js/data/storage.js (sem import/export).
 */
const SupabaseAuth = {
  _getErrorMessage(error) {
    const messages = {
      invalid_credentials: 'E-mail ou senha incorretos.',
      email_not_confirmed: 'Confirme seu e-mail antes de entrar.',
      user_not_found: 'Não encontramos uma conta com esse e-mail.',
      too_many_requests: 'Muitas tentativas. Aguarde um pouco e tente novamente.',
      over_request_rate_limit: 'Muitas tentativas. Aguarde um pouco e tente novamente.'
    }
    const code = error?.code || error?.error_code
    if (code && messages[code]) return messages[code]
    if (error?.status === 429) return messages.too_many_requests
    if (/invalid login credentials/i.test(error?.message || '')) return messages.invalid_credentials
    return error?.message || 'Não foi possível entrar. Tente novamente.'
  },
  async signup(email, password, fullName) {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          // Metadata is only profile data. Authorization is assigned by the
          // database trigger and always starts as `customer`.
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/login.html?confirmed=1`
        }
      })
      if (error) throw error
      return { success: true, user: data.user, message: 'Cadastro realizado! Confirme seu email.' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async login(email, password) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password })
      if (error) throw error
      return { success: true, user: data.user, session: data.session }
    } catch (error) {
      return { success: false, error: this._getErrorMessage(error) }
    }
  },

  async updatePassword(password) {
    try {
      const { error } = await supabaseClient.auth.updateUser({ password })
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async requestPasswordReset(email) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)
    try {
      const redirectTo = `${window.location.origin}/set-password.html`
      const response = await fetch(`${SUPABASE_URL}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
        signal: controller.signal
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        const error = new Error(payload.msg || 'Não foi possível enviar o e-mail de recuperação.')
        error.code = payload.error_code
        throw error
      }
      return { success: true }
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'A solicitação demorou demais. Verifique sua conexão e tente novamente.', code: 'timeout' }
      }
      return { success: false, error: error.message, code: error.code }
    } finally {
      clearTimeout(timeout)
    }
  },

  async logout() {
    try {
      const { error } = await supabaseClient.auth.signOut()
      if (error) throw error
      return { success: true, message: 'Desconectado com sucesso' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser()
      if (error) throw error
      return user
    } catch {
      return null
    }
  },

  async getCurrentUserProfile() {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null
      const { data, error } = await supabaseClient.from('users').select('*').eq('id', user.id).single()
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return null
    }
  },

  async canAccessCRM() {
    try {
      const profile = await this.getCurrentUserProfile()
      return ['admin', 'hr'].includes(profile?.role)
    } catch {
      return false
    }
  },

  // Compatibilidade com os componentes atuais do site.
  // Admin e RH podem acessar o CRM nesta primeira fase.
  async isAdmin() {
    return this.canAccessCRM()
  },

  onAuthStateChange(callback) {
    return supabaseClient.auth.onAuthStateChange((event, session) => callback(event, session))
  }
}
