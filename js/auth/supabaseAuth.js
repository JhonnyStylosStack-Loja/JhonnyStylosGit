/**
 * Camada de autenticação — usa o client global `supabaseClient` (js/config/supabase.js).
 * Padrão de objeto global, igual ao CMS em js/data/storage.js (sem import/export).
 */
const SupabaseAuth = {
  async signup(email, password, fullName) {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
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
      return { success: false, error: error.message }
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

  async isAdmin() {
    try {
      const profile = await this.getCurrentUserProfile()
      return profile?.is_admin === true
    } catch {
      return false
    }
  },

  onAuthStateChange(callback) {
    return supabaseClient.auth.onAuthStateChange((event, session) => callback(event, session))
  }
}
