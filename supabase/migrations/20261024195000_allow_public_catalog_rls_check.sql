-- Public catalog policies call this SECURITY DEFINER boolean function. Anonymous
-- execution is safe: without an authenticated uid it can only return false.
revoke all on function private.is_staff() from public;
grant execute on function private.is_staff() to anon, authenticated;
