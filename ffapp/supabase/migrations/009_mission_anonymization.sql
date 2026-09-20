-- Mission privacy: Extras see anonymized missions until accepted.
-- Establishment identity/address/contact are revealed only after acceptance.

alter table ffapp.profiles
  add column if not exists address text;

-- Never expose the establishment_id column to authenticated browser clients.
-- RLS still controls which mission rows are visible.
revoke select on ffapp.missions from authenticated;
grant select (
  id, tariff_id, city, starts_at, ends_at, seats, notes,
  status, candidate_rate, employer_ttc, created_at
) on ffapp.missions to authenticated;

-- The tariff relation remains readable, but only its public pricing/job data is needed.
grant select (id, job, candidate_rate, employer_ttc, active) on ffapp.tariff_grid to authenticated;

create or replace function ffapp.get_my_mission_details(p_mission_id uuid)
returns table (
  mission_id uuid,
  job text,
  city text,
  starts_at timestamptz,
  ends_at timestamptz,
  candidate_rate numeric,
  employer_ttc numeric,
  establishment_name text,
  establishment_address text,
  establishment_phone text
)
language plpgsql
security definer
set search_path = ffapp, public
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  return query
  select
    m.id,
    t.job,
    m.city,
    m.starts_at,
    m.ends_at,
    m.candidate_rate,
    m.employer_ttc,
    p.full_name,
    p.address,
    p.phone
  from ffapp.missions m
  join ffapp.tariff_grid t on t.id = m.tariff_id
  join ffapp.applications a on a.mission_id = m.id
  join ffapp.profiles p on p.id = m.establishment_id
  where m.id = p_mission_id
    and a.extra_id = v_user
    and a.status = 'accepted';
end;
$$;

grant execute on function ffapp.get_my_mission_details(uuid) to authenticated;

-- Keep profile reads limited to the signed-in user's own profile.
revoke select on ffapp.profiles from authenticated;
grant select (id, role, full_name, phone, city, address, created_at)
  on ffapp.profiles to authenticated;
