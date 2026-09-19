-- Mission publication is performed by a SECURITY DEFINER function so the browser
-- can never choose candidate_rate or employer_ttc.

create or replace function public.create_mission(
  p_tariff_id bigint,
  p_city text,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_seats integer,
  p_notes text default null
)
returns public.missions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_role text;
  v_tariff public.tariff_grid%rowtype;
  v_mission public.missions%rowtype;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select role into v_role from public.profiles where id = v_user;
  if v_role <> 'pro' then
    raise exception 'PRO_ROLE_REQUIRED';
  end if;

  if p_city is null or btrim(p_city) = '' then raise exception 'CITY_REQUIRED'; end if;
  if p_starts_at >= p_ends_at then raise exception 'INVALID_TIME_RANGE'; end if;
  if p_seats is null or p_seats < 1 then raise exception 'INVALID_SEATS'; end if;

  select * into v_tariff
  from public.tariff_grid
  where id = p_tariff_id and active = true;

  if not found then raise exception 'TARIFF_NOT_FOUND'; end if;

  insert into public.missions (
    establishment_id, tariff_id, city, starts_at, ends_at, seats, notes,
    status, candidate_rate, employer_ttc
  ) values (
    v_user, v_tariff.id, btrim(p_city), p_starts_at, p_ends_at, p_seats, p_notes,
    'published', v_tariff.candidate_rate, v_tariff.employer_ttc
  ) returning * into v_mission;

  return v_mission;
end;
$$;

grant execute on function public.create_mission(bigint, text, timestamptz, timestamptz, integer, text) to authenticated;

-- Pro can manage only its own missions. Extras can see published missions.
create policy "profiles_read_own" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "missions_read_published" on public.missions
  for select to authenticated using (status = 'published' or establishment_id = auth.uid());

create policy "missions_update_own" on public.missions
  for update to authenticated using (establishment_id = auth.uid()) with check (establishment_id = auth.uid());

create policy "applications_extra_insert" on public.applications
  for insert to authenticated with check (extra_id = auth.uid());

create policy "applications_read_parties" on public.applications
  for select to authenticated using (
    extra_id = auth.uid()
    or exists (select 1 from public.missions m where m.id = mission_id and m.establishment_id = auth.uid())
  );

create policy "applications_pro_update" on public.applications
  for update to authenticated using (
    exists (select 1 from public.missions m where m.id = mission_id and m.establishment_id = auth.uid())
  ) with check (
    exists (select 1 from public.missions m where m.id = mission_id and m.establishment_id = auth.uid())
  );

create policy "worked_hours_parties" on public.worked_hours
  for select to authenticated using (
    extra_id = auth.uid()
    or exists (select 1 from public.missions m where m.id = mission_id and m.establishment_id = auth.uid())
  );


create or replace function public.apply_to_mission(p_mission_id uuid)
returns public.applications
language plpgsql security definer set search_path = public
as $$
declare v_user uuid := auth.uid(); v_role text; v_m public.missions%rowtype; v_app public.applications%rowtype;
begin
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 select role into v_role from public.profiles where id=v_user;
 if v_role <> 'extra' then raise exception 'EXTRA_ROLE_REQUIRED'; end if;
 select * into v_m from public.missions where id=p_mission_id and status='published';
 if not found then raise exception 'MISSION_NOT_AVAILABLE'; end if;
 insert into public.applications(mission_id,extra_id) values(p_mission_id,v_user)
 returning * into v_app;
 return v_app;
end; $$;
grant execute on function public.apply_to_mission(uuid) to authenticated;
