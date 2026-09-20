-- FoodForce hardening: persist signup metadata and lock mission tariff snapshots.
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
  if v_role not in ('extra','pro') then v_role := 'extra'; end if;

  insert into ffapp.profiles(id,role,full_name,phone,city)
  values(new.id,v_role,nullif(new.raw_user_meta_data->>'full_name',''),nullif(new.raw_user_meta_data->>'phone',''),nullif(new.raw_user_meta_data->>'city',''))
  on conflict(id) do update set
    phone=coalesce(ffapp.profiles.phone,excluded.phone),
    full_name=coalesce(ffapp.profiles.full_name,excluded.full_name),
    city=coalesce(ffapp.profiles.city,excluded.city);

  if v_role='extra' then
    if coalesce(new.raw_user_meta_data->>'primary_job_id','') ~ '^[0-9]+$' then
      v_job_id := (new.raw_user_meta_data->>'primary_job_id')::bigint;
    end if;
    if coalesce(new.raw_user_meta_data->>'experience_years','') ~ '^[0-9]+$' then
      v_experience := least((new.raw_user_meta_data->>'experience_years')::integer,50);
    else v_experience := 0; end if;

    insert into ffapp.extra_profiles(extra_id,experience_years,bio,auto_entrepreneur_number)
    values(new.id,v_experience,nullif(new.raw_user_meta_data->>'experience',''),nullif(new.raw_user_meta_data->>'auto_entrepreneur_number',''))
    on conflict(extra_id) do update set
      experience_years=excluded.experience_years,
      bio=coalesce(excluded.bio,ffapp.extra_profiles.bio),
      auto_entrepreneur_number=coalesce(excluded.auto_entrepreneur_number,ffapp.extra_profiles.auto_entrepreneur_number),
      updated_at=now();

    if v_job_id is not null and exists(select 1 from ffapp.tariff_grid where id=v_job_id and active=true) then
      insert into ffapp.extra_skills(extra_id,tariff_id) values(new.id,v_job_id) on conflict do nothing;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_auth_user_profile on auth.users;
create trigger trg_auth_user_profile after insert on auth.users for each row execute function ffapp.handle_new_user_profile();

create or replace function ffapp.prevent_mission_tariff_mutation()
returns trigger language plpgsql security invoker set search_path=ffapp,public
as $$
begin
  if auth.uid() is not null and auth.uid()=old.establishment_id and
    (new.tariff_id is distinct from old.tariff_id or new.candidate_rate is distinct from old.candidate_rate or new.employer_ttc is distinct from old.employer_ttc) then
    raise exception 'FoodForce tariff is immutable for a mission';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_mission_tariff_immutable on ffapp.missions;
create trigger trg_mission_tariff_immutable before update on ffapp.missions for each row execute function ffapp.prevent_mission_tariff_mutation();

revoke insert,update,delete on ffapp.missions from anon;
revoke insert,delete on ffapp.missions from authenticated;
grant update on ffapp.missions to authenticated;
