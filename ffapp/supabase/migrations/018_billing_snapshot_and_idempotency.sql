-- 018 — Billing uses the mission snapshot and is idempotent.
alter table ffapp.payment_records
  add column if not exists worked_hours_id uuid references ffapp.worked_hours(id) on delete cascade;

create unique index if not exists payment_records_worked_hours_uniq
  on ffapp.payment_records (worked_hours_id)
  where worked_hours_id is not null;

create or replace function ffapp.create_payment_record(p_worked_hours_id uuid)
returns ffapp.payment_records
language plpgsql security definer set search_path = ffapp, public
as $$
declare
  v_user uuid := auth.uid();
  v_wh ffapp.worked_hours%rowtype;
  v_m ffapp.missions%rowtype;
  v_p ffapp.payment_records%rowtype;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_wh from ffapp.worked_hours where id=p_worked_hours_id and validated_at is not null;
  if not found then raise exception 'VALIDATED_HOURS_REQUIRED'; end if;
  select * into v_m from ffapp.missions where id=v_wh.mission_id;
  if not found then raise exception 'MISSION_NOT_FOUND'; end if;
  if v_m.establishment_id<>v_user and not ffapp.is_admin() then raise exception 'MISSION_NOT_OWNED'; end if;
  select * into v_p from ffapp.payment_records where worked_hours_id=p_worked_hours_id;
  if found then return v_p; end if;
  insert into ffapp.payment_records(worked_hours_id,mission_id,extra_id,hours,candidate_hourly_rate,extra_amount,employer_hourly_ttc,employer_amount_ttc,status)
  values(p_worked_hours_id,v_m.id,v_wh.extra_id,v_wh.hours,v_m.candidate_rate,round(v_wh.hours*v_m.candidate_rate,2),v_m.employer_ttc,round(v_wh.hours*v_m.employer_ttc,2),'pending')
  returning * into v_p;
  return v_p;
end;
$$;
grant execute on function ffapp.create_payment_record(uuid) to authenticated;
create unique index if not exists worked_hours_mission_extra_uniq on ffapp.worked_hours(mission_id,extra_id);
