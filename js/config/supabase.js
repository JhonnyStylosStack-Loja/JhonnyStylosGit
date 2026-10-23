/**
 * Client Supabase — usado por todas as páginas e pelo admin.
 * A publishable key é pública por design (protegida pelas policies de RLS no banco).
 */
const supabaseClient = supabase.createClient(
  'https://qjvydpxdesvextfrmyyg.supabase.co',
  'sb_publishable_lZuWGhU-pW9DM6LEZpywUA_LulV3TMi'
)
