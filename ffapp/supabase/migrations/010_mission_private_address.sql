-- Private mission address: stored server-side and revealed only after acceptance.
alter table ffapp.missions add column if not exists address text;

drop function if exists ffapp.create_mission(bigint,text,timestamptz,timestamptz,integer,text);

create or replace function ffapp.create_mission(
  p_tariff_id bigint,
  p_city text,
  p_address text,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_seats integer,
  p_notes text default null
)
returns ffapp.missions
language plpgsql security definer set search_path=ffapp,public
as $$
declare v_user uuid:=auth.uid(); v_role text; v_tariff ffapp.tariff_grid%rowtype; v_mission ffapp.missions%rowtype;
begin
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 select role into v_role from ffapp.profiles where id=v_user;
 if v_role <> 'pro' then raise exception 'PRO_ROLE_REQUIRED'; end if;
 if p_city is null or btrim(p_city)='' then raise exception 'CITY_REQUIRED'; end if;
 if p_address is null or btrim(p_address)='' then raise exception 'ADDRESS_REQUIRED'; end if;
 if p_starts_at>=p_ends_at then raise exception 'INVALID_TIME_RANGE'; end if;
 if p_seats is null or p_seats<1 then raise exception 'INVALID_SEATS'; end if;
 select * into v_tariff from ffapp.tariff_grid where id=p_tariff_id and active=true;
 if not found then raise exception 'TARIFF_NOT_FOUND'; end if;
 insert into ffapp.missions(establishment_id,tariff_id,city,address,starts_at,ends_at,seats,notes,status,candidate_rate,employer_ttc)
 values(v_user,v_tariff.id,btrim(p_city),btrim(p_address),p_starts_at,p_ends_at,p_seats,p_notes,'published',v_tariff.candidate_rate,v_tariff.employer_ttc)
 returning * into v_mission;
 return v_mission;
end;
$$;
grant execute on function ffapp.create_mission(bigint,text,text,timestamptz,timestamptz,integer,text) to authenticated;

drop function if exists ffapp.get_my_mission_details(uuid);
create or replace function ffapp.get_my_mission_details(p_mission_id uuid)
returns table(mission_id uuid,job text,city text,address text,starts_at timestamptz,ends_at timestamptz,candidate_rate numeric,employer_ttc numeric,establishment_name text,establishment_phone text)
language plpgsql security definer set search_path=ffapp,public
as $$
declare v_user uuid:=auth.uid();
begin
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 return query
 select m.id,t.job,m.city,m.address,m.starts_at,m.ends_at,m.candidate_rate,m.employer_ttc,p.full_name,p.phone
 from ffapp.missions m join ffapp.tariff_grid t on t.id=m.tariff_id join ffapp.applications a on a.mission_id=m.id join ffapp.profiles p on p.id=m.establishment_id
 where m.id=p_mission_id and a.extra_id=v_user and a.status='accepted';
end;
$$;
grant execute on function ffapp.get_my_mission_details(uuid) to authenticated;