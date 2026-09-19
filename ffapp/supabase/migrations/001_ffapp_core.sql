create table if not exists public.tariff_grid (
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

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('extra','pro','admin')),
  full_name text,
  phone text,
  city text,
  created_at timestamptz not null default now()
);

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.profiles(id),
  tariff_id bigint not null references public.tariff_grid(id),
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

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  extra_id uuid not null references public.profiles(id),
  status text not null default 'pending' check (status in ('pending','accepted','rejected','withdrawn')),
  created_at timestamptz not null default now(),
  unique(mission_id, extra_id)
);

create table if not exists public.worked_hours (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  extra_id uuid not null references public.profiles(id),
  hours numeric(8,2) not null check (hours > 0),
  validated_at timestamptz,
  validated_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.tariff_grid enable row level security;
alter table public.profiles enable row level security;
alter table public.missions enable row level security;
alter table public.applications enable row level security;
alter table public.worked_hours enable row level security;

-- Tariffs are readable but never writable by Pro/Extra clients.
create policy "tariffs_read" on public.tariff_grid for select to authenticated using (active = true);

-- All tariff writes are reserved for controlled server/admin operations.
