-- FoodForce isolated schema. The legacy public schema is kept intact.
create schema if not exists ffapp;

create table if not exists ffapp.tariff_grid (
  id bigint generated always as identity primary key,
  job text not null unique,
  avg_rate numeric(12,6) not null,
  candidate_rate numeric(12,6) not null,
  employer_ht numeric(12,6) not null,
  vat numeric(12,6) not null,
  employer_ttc numeric(12,6) not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists ffapp.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('extra','pro','admin')),
  full_name text,
  phone text,
  city text,
  created_at timestamptz not null default now()
);

create table if not exists ffapp.missions (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references ffapp.profiles(id),
  tariff_id bigint not null references ffapp.tariff_grid(id),
  city text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  seats integer not null default 1 check (seats > 0),
  notes text,
  status text not null default 'published' check (status in ('draft','published','filled','completed','cancelled')),
  candidate_rate numeric(12,6) not null,
  employer_ttc numeric(12,6) not null,
  created_at timestamptz not null default now()
);

create table if not exists ffapp.applications (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references ffapp.missions(id) on delete cascade,
  extra_id uuid not null references ffapp.profiles(id),
  status text not null default 'pending' check (status in ('pending','accepted','rejected','withdrawn')),
  created_at timestamptz not null default now(),
  unique(mission_id, extra_id)
);

create table if not exists ffapp.worked_hours (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references ffapp.missions(id) on delete cascade,
  extra_id uuid not null references ffapp.profiles(id),
  hours numeric(8,2) not null check (hours > 0),
  validated_at timestamptz,
  validated_by uuid references ffapp.profiles(id),
  created_at timestamptz not null default now()
);

alter table ffapp.tariff_grid enable row level security;
alter table ffapp.profiles enable row level security;
alter table ffapp.missions enable row level security;
alter table ffapp.applications enable row level security;
alter table ffapp.worked_hours enable row level security;

-- Tariffs are readable but never writable by Pro/Extra clients.
create policy "tariffs_read" on ffapp.tariff_grid for select to authenticated using (active = true);

-- All tariff writes are reserved for controlled server/admin operations.

-- FoodForce official tariff seed
-- Source: salaires foodforce v7.xlsx / Grille Tarifaire FoodForce
-- 59 métiers. Values are imported as published; the application must read them server-side.

insert into ffapp.tariff_grid (job,avg_rate,candidate_rate,employer_ht,vat,employer_ttc) values
('Directeur Food & Beverage',183.246073,265.706806,332.133508,66.426702,398.560209),
('Directeur',157.068063,227.748691,284.685864,56.937173,341.623037),
('Manager',89.005236,129.057592,161.321990,32.264398,193.586387),
('Responsable de salle',60.209424,87.303665,109.129581,21.825916,130.955497),
('Maître d''hôtel',52.356021,75.916230,94.895288,18.979058,113.874346),
('Assistant maître d''hôtel',40.575916,58.835079,73.543848,14.708770,88.252618),
('Chef de Rang',32.722513,47.447644,59.309555,11.861911,71.171466),
('Serveur',24.869110,36.060209,45.075262,9.015052,54.090314),
('Runner',20.942408,30.366492,37.958115,7.591623,45.549738),
('Officier',20.942408,30.366492,37.958115,7.591623,45.549738),
('Limonadier',24.869110,36.060209,45.075262,9.015052,54.090314),
('Garçon de café',20.942408,30.366492,37.958115,7.591623,45.549738),
('Chef Barman',47.120419,68.324607,85.405759,17.081152,102.486911),
('Barman',30.104712,43.651832,54.564791,10.912958,65.477749),
('Commis de salle',19.633508,28.468586,35.585733,7.117147,42.702880),
('Barista',26.178010,37.958115,47.447644,9.489529,56.937173),
('Cafetier',20.942408,30.366492,37.958115,7.591623,45.549738),
('Sommelier',39.267016,56.937173,71.171466,14.234293,85.405759),
('Hôte / Hôtesse de caisse',23.560209,34.162304,42.702880,8.540576,51.243455),
('Hôte / Hôtesse d''accueil',23.560209,34.162304,42.702880,8.540576,51.243455),
('Vestiaire',19.109948,27.709424,34.636780,6.927356,41.564136),
('Employé polyvalent restauration',20.942408,30.366492,37.958115,7.591623,45.549738),
('Vendeur boulangerie',20.942408,30.366492,37.958115,7.591623,45.549738),
('Ménage',17.801047,25.811518,32.264398,6.452880,38.717277),
('Chef de cuisine',130.890052,189.790576,237.238220,47.447644,284.685864),
('Second de cuisine',70.680628,102.486911,128.108639,25.621728,153.730366),
('Chef de partie',47.120419,68.324607,85.405759,17.081152,102.486911),
('Demi-chef de partie',32.722513,47.447644,59.309555,11.861911,71.171466),
('Commis de cuisine',22.251309,32.264398,40.330497,8.066099,48.396597),
('Chocolatier',39.267016,56.937173,71.171466,14.234293,85.405759),
('Chef pâtissier',62.827225,91.099476,113.874346,22.774869,136.649215),
('Pâtissier',32.722513,47.447644,59.309555,11.861911,71.171466),
('Pâtissier (nuit)',36.649215,53.141361,66.426702,13.285340,79.712042),
('Pâtissier en laboratoire',32.722513,47.447644,59.309555,11.861911,71.171466),
('Commis de pâtisserie',20.942408,30.366492,37.958115,7.591623,45.549738),
('Boulanger',30.104712,43.651832,54.564791,10.912958,65.477749),
('Commis boulanger',20.942408,30.366492,37.958115,7.591623,45.549738),
('Crêpier',24.869110,36.060209,45.075262,9.015052,54.090314),
('Pizzaiolo',30.104712,43.651832,54.564791,10.912958,65.477749),
('Cuisinier Collectif',26.178010,37.958115,47.447644,9.489529,56.937173),
('Écailler',30.104712,43.651832,54.564791,10.912958,65.477749),
('Économe',24.869110,36.060209,45.075262,9.015052,54.090314),
('Plongeur',19.109948,27.709424,34.636780,6.927356,41.564136),
('Préparateur de commandes',20.942408,30.366492,37.958115,7.591623,45.549738),
('Employé polyvalent cuisine',20.942408,30.366492,37.958115,7.591623,45.549738),
('Bagagiste',20.942408,30.366492,37.958115,7.591623,45.549738),
('Cafetier (hôtel)',20.942408,30.366492,37.958115,7.591623,45.549738),
('Concierge',39.267016,56.937173,71.171466,14.234293,85.405759),
('Employé polyvalent d''hôtel',22.251309,32.264398,40.330497,8.066099,48.396597),
('Esthéticienne',27.486911,39.856021,49.820026,9.964005,59.784031),
('Femme / Valet de chambre',20.418848,29.607330,37.009162,7.401832,44.410995),
('Gouvernante',47.120419,68.324607,85.405759,17.081152,102.486911),
('Linger',20.942408,30.366492,37.958115,7.591623,45.549738),
('Manutentionnaire',19.109948,27.709424,34.636780,6.927356,41.564136),
('Night Auditor',36.649215,53.141361,66.426702,13.285340,79.712042),
('Premier de réception',54.973822,79.712042,99.640052,19.928010,119.568063),
('Réceptionniste',30.104712,43.651832,54.564791,10.912958,65.477749),
('Room service',22.251309,32.264398,40.330497,8.066099,48.396597),
('Voiturier',22.251309,32.264398,40.330497,8.066099,48.396597)
on conflict (job) do update set
  avg_rate=excluded.avg_rate,
  candidate_rate=excluded.candidate_rate,
  employer_ht=excluded.employer_ht,
  vat=excluded.vat,
  employer_ttc=excluded.employer_ttc,
  active=true;

-- Mission publication is performed by a SECURITY DEFINER function so the browser
-- can never choose candidate_rate or employer_ttc.

create or replace function ffapp.create_mission(
  p_tariff_id bigint,
  p_city text,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_seats integer,
  p_notes text default null
)
returns ffapp.missions
language plpgsql
security definer
set search_path = ffapp, public
as $$
declare
  v_user uuid := auth.uid();
  v_role text;
  v_tariff ffapp.tariff_grid%rowtype;
  v_mission ffapp.missions%rowtype;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select role into v_role from ffapp.profiles where id = v_user;
  if v_role <> 'pro' then
    raise exception 'PRO_ROLE_REQUIRED';
  end if;

  if p_city is null or btrim(p_city) = '' then raise exception 'CITY_REQUIRED'; end if;
  if p_starts_at >= p_ends_at then raise exception 'INVALID_TIME_RANGE'; end if;
  if p_seats is null or p_seats < 1 then raise exception 'INVALID_SEATS'; end if;

  select * into v_tariff
  from ffapp.tariff_grid
  where id = p_tariff_id and active = true;

  if not found then raise exception 'TARIFF_NOT_FOUND'; end if;

  insert into ffapp.missions (
    establishment_id, tariff_id, city, starts_at, ends_at, seats, notes,
    status, candidate_rate, employer_ttc
  ) values (
    v_user, v_tariff.id, btrim(p_city), p_starts_at, p_ends_at, p_seats, p_notes,
    'published', v_tariff.candidate_rate, v_tariff.employer_ttc
  ) returning * into v_mission;

  return v_mission;
end;
$$;

grant execute on function ffapp.create_mission(bigint, text, timestamptz, timestamptz, integer, text) to authenticated;

-- Pro can manage only its own missions. Extras can see published missions.
create policy "profiles_read_own" on ffapp.profiles
  for select to authenticated using (id = auth.uid());

create policy "profiles_update_own" on ffapp.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "missions_read_published" on ffapp.missions
  for select to authenticated using (status = 'published' or establishment_id = auth.uid());

create policy "missions_update_own" on ffapp.missions
  for update to authenticated using (establishment_id = auth.uid()) with check (establishment_id = auth.uid());

create policy "applications_extra_insert" on ffapp.applications
  for insert to authenticated with check (extra_id = auth.uid());

create policy "applications_read_parties" on ffapp.applications
  for select to authenticated using (
    extra_id = auth.uid()
    or exists (select 1 from ffapp.missions m where m.id = mission_id and m.establishment_id = auth.uid())
  );

create policy "applications_pro_update" on ffapp.applications
  for update to authenticated using (
    exists (select 1 from ffapp.missions m where m.id = mission_id and m.establishment_id = auth.uid())
  ) with check (
    exists (select 1 from ffapp.missions m where m.id = mission_id and m.establishment_id = auth.uid())
  );

create policy "worked_hours_parties" on ffapp.worked_hours
  for select to authenticated using (
    extra_id = auth.uid()
    or exists (select 1 from ffapp.missions m where m.id = mission_id and m.establishment_id = auth.uid())
  );


create or replace function ffapp.apply_to_mission(p_mission_id uuid)
returns ffapp.applications
language plpgsql security definer set search_path = ffapp, public
as $$
declare v_user uuid := auth.uid(); v_role text; v_m ffapp.missions%rowtype; v_app ffapp.applications%rowtype;
begin
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 select role into v_role from ffapp.profiles where id=v_user;
 if v_role <> 'extra' then raise exception 'EXTRA_ROLE_REQUIRED'; end if;
 select * into v_m from ffapp.missions where id=p_mission_id and status='published';
 if not found then raise exception 'MISSION_NOT_AVAILABLE'; end if;
 insert into ffapp.applications(mission_id,extra_id) values(p_mission_id,v_user)
 returning * into v_app;
 return v_app;
end; $$;
grant execute on function ffapp.apply_to_mission(uuid) to authenticated;


create or replace function ffapp.validate_worked_hours(
  p_mission_id uuid,
  p_extra_id uuid,
  p_hours numeric
)
returns ffapp.worked_hours
language plpgsql security definer set search_path = ffapp, public
as $$
declare v_user uuid := auth.uid(); v_role text; v_m ffapp.missions%rowtype; v_app ffapp.applications%rowtype; v_hours ffapp.worked_hours%rowtype;
begin
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 select role into v_role from ffapp.profiles where id=v_user;
 if v_role <> 'pro' then raise exception 'PRO_ROLE_REQUIRED'; end if;
 select * into v_m from ffapp.missions where id=p_mission_id and establishment_id=v_user;
 if not found then raise exception 'MISSION_NOT_OWNED'; end if;
 select * into v_app from ffapp.applications where mission_id=p_mission_id and extra_id=p_extra_id and status='accepted';
 if not found then raise exception 'EXTRA_NOT_ACCEPTED'; end if;
 if p_hours is null or p_hours <= 0 then raise exception 'INVALID_HOURS'; end if;
 insert into ffapp.worked_hours(mission_id,extra_id,hours,validated_at,validated_by)
 values(p_mission_id,p_extra_id,p_hours,now(),v_user)
 returning * into v_hours;
 update ffapp.missions set status='completed' where id=p_mission_id;
 return v_hours;
end; $$;
grant execute on function ffapp.validate_worked_hours(uuid,uuid,numeric) to authenticated;

create policy "worked_hours_pro_insert" on ffapp.worked_hours
 for insert to authenticated with check (
   exists (select 1 from ffapp.missions m where m.id=mission_id and m.establishment_id=auth.uid())
 );


-- Price snapshots are immutable from client roles. Mission editing must use
-- controlled server functions so candidate_rate/employer_ttc cannot be altered.
revoke insert, update, delete on ffapp.missions from authenticated;
revoke insert, update, delete on ffapp.tariff_grid from authenticated;
revoke insert, update, delete on ffapp.worked_hours from authenticated;

-- Applications are changed only through the controlled Pro workflow.
revoke update on ffapp.applications from authenticated;

create table if not exists ffapp.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references ffapp.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table ffapp.notifications enable row level security;

create policy "notifications_read_own" on ffapp.notifications
  for select to authenticated using (user_id = auth.uid());

create policy "notifications_update_own" on ffapp.notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function ffapp.notify_application_status()
returns trigger
language plpgsql security definer set search_path = ffapp, public
as $$
declare v_job text; v_pro uuid;
begin
  if new.status is distinct from old.status and new.status in ('accepted','rejected') then
    select m.establishment_id, t.job into v_pro, v_job
    from ffapp.missions m join ffapp.tariff_grid t on t.id=m.tariff_id
    where m.id=new.mission_id;

    insert into ffapp.notifications(user_id,type,title,body)
    values (
      new.extra_id,
      'application_status',
      case when new.status='accepted' then 'Candidature acceptée' else 'Candidature refusée' end,
      'Votre candidature pour '||coalesce(v_job,'la mission')||' a été '||
      case when new.status='accepted' then 'acceptée.' else 'refusée.' end
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_application_status_notification on ffapp.applications;
create trigger trg_application_status_notification
after update on ffapp.applications
for each row execute function ffapp.notify_application_status();

create or replace function ffapp.is_admin()
returns boolean
language sql stable security definer set search_path = ffapp, public
as $$
  select exists(select 1 from ffapp.profiles where id=auth.uid() and role='admin');
$$;


create policy "admin_read_profiles" on ffapp.profiles
  for select to authenticated using (id = auth.uid() or ffapp.is_admin());

create policy "admin_read_missions" on ffapp.missions
  for select to authenticated using (establishment_id = auth.uid() or status = 'published' or ffapp.is_admin());

create policy "admin_read_applications" on ffapp.applications
  for select to authenticated using (
    extra_id = auth.uid()
    or exists (select 1 from ffapp.missions m where m.id = mission_id and m.establishment_id = auth.uid())
    or ffapp.is_admin()
  );

create policy "admin_read_worked_hours" on ffapp.worked_hours
  for select to authenticated using (
    extra_id = auth.uid()
    or exists (select 1 from ffapp.missions m where m.id = mission_id and m.establishment_id = auth.uid())
    or ffapp.is_admin()
  );

create policy "admin_read_tariffs" on ffapp.tariff_grid
  for select to authenticated using (active = true or ffapp.is_admin());

create table if not exists ffapp.payment_records (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references ffapp.missions(id) on delete cascade,
  extra_id uuid not null references ffapp.profiles(id),
  hours numeric(8,2) not null check (hours > 0),
  candidate_hourly_rate numeric(12,6) not null,
  extra_amount numeric(12,2) not null,
  employer_hourly_ttc numeric(12,6) not null,
  employer_amount_ttc numeric(12,2) not null,
  status text not null default 'pending' check (status in ('pending','paid','failed','cancelled')),
  provider text,
  provider_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table ffapp.payment_records enable row level security;

create policy "payments_read_parties" on ffapp.payment_records
for select to authenticated using (
  extra_id = auth.uid()
  or exists (select 1 from ffapp.missions m where m.id = mission_id and m.establishment_id = auth.uid())
  or ffapp.is_admin()
);

create or replace function ffapp.create_payment_record(
  p_worked_hours_id uuid
)
returns ffapp.payment_records
language plpgsql security definer set search_path = ffapp, public
as $$
declare
  v_user uuid := auth.uid();
  v_wh ffapp.worked_hours%rowtype;
  v_m ffapp.missions%rowtype;
  v_t ffapp.tariff_grid%rowtype;
  v_p ffapp.payment_records%rowtype;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;

  select * into v_wh from ffapp.worked_hours where id=p_worked_hours_id and validated_at is not null;
  if not found then raise exception 'VALIDATED_HOURS_REQUIRED'; end if;

  select * into v_m from ffapp.missions where id=v_wh.mission_id;
  select * into v_t from ffapp.tariff_grid where id=v_m.tariff_id;

  if v_m.establishment_id <> v_user and not ffapp.is_admin() then
    raise exception 'MISSION_NOT_OWNED';
  end if;

  insert into ffapp.payment_records(
    mission_id, extra_id, hours, candidate_hourly_rate, extra_amount,
    employer_hourly_ttc, employer_amount_ttc, status
  )
  values(
    v_m.id, v_wh.extra_id, v_wh.hours, v_t.candidate_rate,
    round(v_wh.hours * v_t.candidate_rate, 2),
    v_t.employer_ttc, round(v_wh.hours * v_t.employer_ttc, 2), 'pending'
  )
  returning * into v_p;

  return v_p;
end;
$$;

grant execute on function ffapp.create_payment_record(uuid) to authenticated;

-- Controlled application decision workflow.
create or replace function ffapp.decide_application(
  p_application_id uuid,
  p_status text
)
returns ffapp.applications
language plpgsql
security definer
set search_path = ffapp, public
as $$
declare
  v_user uuid := auth.uid();
  v_role text;
  v_app ffapp.applications%rowtype;
  v_m ffapp.missions%rowtype;
  v_updated ffapp.applications%rowtype;
  v_accepted integer;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_status not in ('accepted','rejected') then raise exception 'INVALID_APPLICATION_STATUS'; end if;

  select role into v_role from ffapp.profiles where id=v_user;
  if v_role <> 'pro' then raise exception 'PRO_ROLE_REQUIRED'; end if;

  select * into v_app from ffapp.applications where id=p_application_id;
  if not found then raise exception 'APPLICATION_NOT_FOUND'; end if;

  select * into v_m from ffapp.missions
  where id=v_app.mission_id and establishment_id=v_user;
  if not found then raise exception 'MISSION_NOT_OWNED'; end if;

  if v_app.status <> 'pending' then raise exception 'APPLICATION_ALREADY_DECIDED'; end if;

  if p_status = 'accepted' then
    select count(*) into v_accepted
    from ffapp.applications
    where mission_id=v_m.id and status='accepted';
    if v_accepted >= v_m.seats then raise exception 'MISSION_FULL'; end if;
  end if;

  update ffapp.applications
  set status=p_status
  where id=p_application_id
  returning * into v_updated;

  return v_updated;
end;
$$;

grant execute on function ffapp.decide_application(uuid,text) to authenticated;
-- Explicit Data API grants for the isolated application schema.
grant usage on schema ffapp to anon, authenticated, service_role;
grant all on all tables in schema ffapp to anon, authenticated, service_role;
grant all on all routines in schema ffapp to anon, authenticated, service_role;
grant all on all sequences in schema ffapp to anon, authenticated, service_role;
alter default privileges for role postgres in schema ffapp grant all on tables to anon, authenticated, service_role;
alter default privileges for role postgres in schema ffapp grant all on routines to anon, authenticated, service_role;
alter default privileges for role postgres in schema ffapp grant all on sequences to anon, authenticated, service_role;
alter role authenticator set pgrst.db_schemas = 'public, ffapp, graphql_public';
notify pgrst, 'reload config';
-- Remove only the empty FoodForce tables accidentally created in public by the first migration.
drop table if exists public.payment_records cascade;
drop table if exists public.notifications cascade;
drop table if exists public.worked_hours cascade;
drop table if exists public.applications cascade;
drop table if exists public.profiles cascade;
drop table if exists public.tariff_grid cascade;