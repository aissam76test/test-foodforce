-- Controlled application decision workflow.
create or replace function public.decide_application(
  p_application_id uuid,
  p_status text
)
returns public.applications
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_role text;
  v_app public.applications%rowtype;
  v_m public.missions%rowtype;
  v_updated public.applications%rowtype;
  v_accepted integer;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_status not in ('accepted','rejected') then raise exception 'INVALID_APPLICATION_STATUS'; end if;

  select role into v_role from public.profiles where id=v_user;
  if v_role <> 'pro' then raise exception 'PRO_ROLE_REQUIRED'; end if;

  select * into v_app from public.applications where id=p_application_id;
  if not found then raise exception 'APPLICATION_NOT_FOUND'; end if;

  select * into v_m from public.missions
  where id=v_app.mission_id and establishment_id=v_user;
  if not found then raise exception 'MISSION_NOT_OWNED'; end if;

  if v_app.status <> 'pending' then raise exception 'APPLICATION_ALREADY_DECIDED'; end if;

  if p_status = 'accepted' then
    select count(*) into v_accepted
    from public.applications
    where mission_id=v_m.id and status='accepted';
    if v_accepted >= v_m.seats then raise exception 'MISSION_FULL'; end if;
  end if;

  update public.applications
  set status=p_status
  where id=p_application_id
  returning * into v_updated;

  return v_updated;
end;
$$;

grant execute on function public.decide_application(uuid,text) to authenticated;