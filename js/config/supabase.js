/**
 * Client Supabase — usado por todas as páginas e pelo admin.
 * A publishable key é pública por design (protegida pelas policies de RLS no banco).
 */
const SUPABASE_URL = 'https://qjvydpxdesvextfrmyyg.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_lZuWGhU-pW9DM6LEZpywUA_LulV3TMi'
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
