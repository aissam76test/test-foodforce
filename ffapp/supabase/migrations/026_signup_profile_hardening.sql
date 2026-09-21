-- FoodForce signup hardening: persist complete Extra/Pro profile at Auth signup.
-- This is server-side so it also works when email confirmation is enabled
-- (signUp() returns a user but no session in that case).

create or replace function ffapp.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path=ffapp,public
as $$
declare
  v_role text := coalesce(new.raw_user_meta_data->>'role','extra');
  v_job_id bigint;
  v_experience integer;
begin
  if v_role not in ('extra','pro') then
    v_role := 'extra';
  end if;

  insert into ffapp.profiles(id,role,full_name,phone,city)
  values(
    new.id,
    v_role,
    nullif(new.raw_user_meta_data->>'full_name',''),
    nullif(new.raw_user_meta_data->>'phone',''),
    nullif(new.raw_user_meta_data->>'city','')
  )
  on conflict(id) do update set
    role=excluded.role,
    phone=coalesce(ffapp.profiles.phone,excluded.phone),
    full_name=coalesce(ffapp.profiles.full_name,excluded.full_name),
    city=coalesce(ffapp.profiles.city,excluded.city);

  if v_role='extra' then
    if coalesce(new.raw_user_meta_data->>'primary_job_id','') ~ '^[0-9]+$' then
      v_job_id := (new.raw_user_meta_data->>'primary_job_id')::bigint;
    end if;

    if coalesce(new.raw_user_meta_data->>'experience_years','') ~ '^[0-9]+$' then
      v_experience := least((new.raw_user_meta_data->>'experience_years')::integer,50);
    else
      v_experience := 0;
    end if;

    insert into ffapp.extra_profiles(
      extra_id, experience_years, bio, auto_entrepreneur_number
    )
    values(
      new.id,
      v_experience,
      nullif(new.raw_user_meta_data->>'experience',''),
      nullif(new.raw_user_meta_data->>'auto_entrepreneur_number','')
    )
    on conflict(extra_id) do update set
      experience_years=excluded.experience_years,
      bio=coalesce(excluded.bio,ffapp.extra_profiles.bio),
      auto_entrepreneur_number=coalesce(
        excluded.auto_entrepreneur_number,
        ffapp.extra_profiles.auto_entrepreneur_number
      ),
      updated_at=now();

    if v_job_id is not null
       and exists(
         select 1 from ffapp.tariff_grid
         where id=v_job_id and active=true
       ) then
      insert into ffapp.extra_skills(extra_id,tariff_id)
      values(new.id,v_job_id)
      on conflict do nothing;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_auth_user_profile on auth.users;
create trigger trg_auth_user_profile
after insert on auth.users
for each row execute function ffapp.handle_new_user_profile();

-- Backfill profiles created before this hardening migration.
update ffapp.profiles p
set
  phone=coalesce(p.phone,nullif(u.raw_user_meta_data->>'phone','')),
  full_name=coalesce(p.full_name,nullif(u.raw_user_meta_data->>'full_name','')),
  city=coalesce(p.city,nullif(u.raw_user_meta_data->>'city',''))
from auth.users u
where u.id=p.id;

insert into ffapp.extra_profiles(extra_id,experience_years,bio,auto_entrepreneur_number)
select
  u.id,
  case
    when coalesce(u.raw_user_meta_data->>'experience_years','') ~ '^[0-9]+$'
      then least((u.raw_user_meta_data->>'experience_years')::integer,50)
    else 0
  end,
  nullif(u.raw_user_meta_data->>'experience',''),
  nullif(u.raw_user_meta_data->>'auto_entrepreneur_number','')
from auth.users u
join ffapp.profiles p on p.id=u.id
where p.role='extra'
on conflict(extra_id) do update set
  experience_years=excluded.experience_years,
  bio=coalesce(excluded.bio,ffapp.extra_profiles.bio),
  auto_entrepreneur_number=coalesce(
    excluded.auto_entrepreneur_number,
    ffapp.extra_profiles.auto_entrepreneur_number
  ),
  updated_at=now();

insert into ffapp.extra_skills(extra_id,tariff_id)
select
  u.id,
  (u.raw_user_meta_data->>'primary_job_id')::bigint
from auth.users u
join ffapp.profiles p on p.id=u.id
join ffapp.tariff_grid t
  on t.id=(u.raw_user_meta_data->>'primary_job_id')::bigint
 and t.active=true
where p.role='extra'
  and coalesce(u.raw_user_meta_data->>'primary_job_id','') ~ '^[0-9]+$'
on conflict do nothing;
