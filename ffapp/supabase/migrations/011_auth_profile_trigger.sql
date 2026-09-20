-- Create the FoodForce profile automatically when a Supabase Auth user is created.
create or replace function ffapp.handle_new_user_profile()
returns trigger
language plpgsql security definer set search_path=ffapp,public
as $$
declare v_role text:=coalesce(new.raw_user_meta_data->>'role','extra');
begin
 if v_role not in ('extra','pro') then v_role:='extra'; end if;
 insert into ffapp.profiles(id,role,full_name,city)
 values(new.id,v_role,nullif(new.raw_user_meta_data->>'full_name',''),nullif(new.raw_user_meta_data->>'city',''))
 on conflict(id) do nothing;
 return new;
end;
$$;
drop trigger if exists trg_auth_user_profile on auth.users;
create trigger trg_auth_user_profile after insert on auth.users for each row execute function ffapp.handle_new_user_profile();