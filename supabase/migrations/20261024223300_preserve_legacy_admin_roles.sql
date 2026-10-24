-- Preserve trusted admin flags from the pre-role schema.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'is_admin'
  ) then
    execute $migration$
      update public.users
      set role = 'admin'
      where is_admin is true
        and role not in ('admin', 'hr')
    $migration$;
  end if;
end
$$;
