const { createClient } = require('@supabase/supabase-js')

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!supabaseUrl || !publishableKey || !secretKey) {
    return res.status(500).json({ error: 'Configuração de autenticação incompleta.' })
  }

  const authorization = req.headers.authorization || ''
  const accessToken = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : ''
  if (!accessToken) return res.status(401).json({ error: 'Sessão obrigatória.' })

  const { email, role } = req.body || {}
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail || !['admin', 'hr'].includes(role)) {
    return res.status(400).json({ error: 'Informe um e-mail e o papel admin ou hr.' })
  }

  const authClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  })
  const { data: authData, error: authError } = await authClient.auth.getUser(accessToken)
  if (authError || !authData.user) return res.status(401).json({ error: 'Sessão inválida.' })

  const adminClient = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  const { data: inviter, error: inviterError } = await adminClient
    .from('users')
    .select('role')
    .eq('id', authData.user.id)
    .single()

  // RH does not grant privileged roles. Only an administrator can invite staff.
  if (inviterError || inviter?.role !== 'admin') {
    return res.status(403).json({ error: 'Somente administradores podem convidar membros da equipe.' })
  }

  const redirectTo = `${String(process.env.PUBLIC_SITE_URL || 'https://jhonnystylos.com.br').replace(/\/$/, '')}/set-password.html`
  const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
    normalizedEmail,
    { redirectTo, data: { account_type: 'staff' } }
  )
  if (inviteError) return res.status(400).json({ error: inviteError.message })

  const { error: roleError } = await adminClient
    .from('users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', invited.user.id)
  if (roleError) {
    return res.status(500).json({
      error: 'O convite foi criado, mas o papel interno não pôde ser atribuído. A conta permanece sem acesso administrativo.'
    })
  }

  return res.status(200).json({ message: 'Convite enviado com segurança.' })
}
