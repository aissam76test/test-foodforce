create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifications_read_own" on public.notifications
  for select to authenticated using (user_id = auth.uid());

create policy "notifications_update_own" on public.notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.notify_application_status()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare v_job text; v_pro uuid;
begin
  if new.status is distinct from old.status and new.status in ('accepted','rejected') then
    select m.establishment_id, t.job into v_pro, v_job
    from public.missions m join public.tariff_grid t on t.id=m.tariff_id
    where m.id=new.mission_id;

    insert into public.notifications(user_id,type,title,body)
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

drop trigger if exists trg_application_status_notification on public.applications;
create trigger trg_application_status_notification
after update on public.applications
for each row execute function public.notify_application_status();

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;


create policy "admin_read_profiles" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

create policy "admin_read_missions" on public.missions
  for select to authenticated using (establishment_id = auth.uid() or status = 'published' or public.is_admin());

create policy "admin_read_applications" on public.applications
  for select to authenticated using (
    extra_id = auth.uid()
    or exists (select 1 from public.missions m where m.id = mission_id and m.establishment_id = auth.uid())
    or public.is_admin()
  );

create policy "admin_read_worked_hours" on public.worked_hours
  for select to authenticated using (
    extra_id = auth.uid()
    or exists (select 1 from public.missions m where m.id = mission_id and m.establishment_id = auth.uid())
    or public.is_admin()
  );

create policy "admin_read_tariffs" on public.tariff_grid
  for select to authenticated using (active = true or public.is_admin());
