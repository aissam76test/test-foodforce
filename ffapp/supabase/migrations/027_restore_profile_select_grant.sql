-- Restore the SELECT grant required by the Extra profile UI.
-- RLS still limits rows to the current user/admin.
grant select on table ffapp.profiles to authenticated;
