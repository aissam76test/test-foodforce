create table if not exists public.payment_records (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  extra_id uuid not null references public.profiles(id),
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

alter table public.payment_records enable row level security;

create policy "payments_read_parties" on public.payment_records
for select to authenticated using (
  extra_id = auth.uid()
  or exists (select 1 from public.missions m where m.id = mission_id and m.establishment_id = auth.uid())
  or public.is_admin()
);

create or replace function public.create_payment_record(
  p_worked_hours_id uuid
)
returns public.payment_records
language plpgsql security definer set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_wh public.worked_hours%rowtype;
  v_m public.missions%rowtype;
  v_t public.tariff_grid%rowtype;
  v_p public.payment_records%rowtype;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;

  select * into v_wh from public.worked_hours where id=p_worked_hours_id and validated_at is not null;
  if not found then raise exception 'VALIDATED_HOURS_REQUIRED'; end if;

  select * into v_m from public.missions where id=v_wh.mission_id;
  select * into v_t from public.tariff_grid where id=v_m.tariff_id;

  if v_m.establishment_id <> v_user and not public.is_admin() then
    raise exception 'MISSION_NOT_OWNED';
  end if;

  insert into public.payment_records(
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

grant execute on function public.create_payment_record(uuid) to authenticated;
