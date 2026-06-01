-- =============================================================================
-- MediCare — PostgreSQL schema for Supabase
-- =============================================================================
-- Security model:
--   * Every table is owned by a user (user_id = auth.uid()).
--   * Row-Level Security (RLS) is ON everywhere: a user can ONLY ever read or
--     write their own rows.
--   * Columns documented as "(encrypted)" are encrypted client-side before
--     insert; the server stores ciphertext and never sees plaintext.
-- Run this in the Supabase SQL editor (or via the CLI migrations).
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- PROFILES (1:1 with auth.users)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  full_name               text,
  date_of_birth           date,
  gender                  text check (gender in ('male','female','other','prefer_not_to_say')),
  blood_group             text,
  height_cm               int,
  weight_kg               numeric(5,2),
  emergency_contact_name  text,
  emergency_contact_phone text,          -- (encrypted)
  primary_doctor          text,
  allergies               text,          -- (encrypted)
  photo_url               text,
  language                text not null default 'en',
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- HEALTH CONDITIONS
-- -----------------------------------------------------------------------------
create table if not exists public.conditions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  severity        text check (severity in ('mild','moderate','severe')),
  diagnosed_date  date,
  notes           text,                  -- (encrypted)
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);
create index if not exists conditions_user_idx on public.conditions(user_id);

-- -----------------------------------------------------------------------------
-- MEDICATIONS
-- -----------------------------------------------------------------------------
create table if not exists public.medications (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  condition_id      uuid references public.conditions(id) on delete set null,
  name              text not null,
  dosage            text not null,
  form              text not null default 'tablet',
  instruction       text not null default 'anytime',
  start_date        date not null default current_date,
  end_date          date,
  stock_count       int,
  refill_threshold  int,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);
create index if not exists medications_user_idx on public.medications(user_id);

-- -----------------------------------------------------------------------------
-- MEDICATION SCHEDULES
-- -----------------------------------------------------------------------------
create table if not exists public.medication_schedules (
  id              uuid primary key default gen_random_uuid(),
  medication_id   uuid not null references public.medications(id) on delete cascade,
  time            time not null,
  days_of_week    text[],                -- {'MO','TU',...} or null => daily
  created_at      timestamptz not null default now()
);
create index if not exists schedules_med_idx on public.medication_schedules(medication_id);

-- -----------------------------------------------------------------------------
-- MEDICATION LOGS
-- -----------------------------------------------------------------------------
create table if not exists public.medication_logs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  medication_id   uuid not null references public.medications(id) on delete cascade,
  schedule_id     uuid references public.medication_schedules(id) on delete set null,
  scheduled_time  timestamptz not null,
  actual_time     timestamptz,
  status          text not null check (status in ('taken','missed','snoozed','skipped','pending')),
  notes           text,                  -- (encrypted)
  created_at      timestamptz not null default now()
);
create index if not exists logs_user_time_idx on public.medication_logs(user_id, scheduled_time desc);

-- -----------------------------------------------------------------------------
-- VITALS
-- -----------------------------------------------------------------------------
create table if not exists public.vitals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  type          text not null check (type in ('blood_sugar','blood_pressure','weight','temperature','heart_rate','spo2')),
  value_1       numeric not null,
  value_2       numeric,
  unit          text not null,
  context       text check (context in ('fasting','post_meal','random','pre_meal')),
  notes         text,                    -- (encrypted)
  recorded_at   timestamptz not null default now(),
  created_at    timestamptz not null default now()
);
create index if not exists vitals_user_type_idx on public.vitals(user_id, type, recorded_at desc);

-- -----------------------------------------------------------------------------
-- APPOINTMENTS
-- -----------------------------------------------------------------------------
create table if not exists public.appointments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  doctor_name   text not null,
  specialty     text,
  location      text,
  phone         text,
  scheduled_at  timestamptz not null,
  purpose       text,
  notes_before  text,                    -- (encrypted)
  notes_after   text,                    -- (encrypted)
  status        text not null default 'upcoming' check (status in ('upcoming','completed','cancelled')),
  created_at    timestamptz not null default now()
);
create index if not exists appts_user_time_idx on public.appointments(user_id, scheduled_at);

-- -----------------------------------------------------------------------------
-- REMINDERS (custom)
-- -----------------------------------------------------------------------------
create table if not exists public.reminders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  title           text not null,
  description     text,
  type            text not null default 'custom' check (type in ('water','exercise','meal','custom')),
  schedule_cron   text not null,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);
create index if not exists reminders_user_idx on public.reminders(user_id);

-- -----------------------------------------------------------------------------
-- NOTIFICATION TOKENS
-- -----------------------------------------------------------------------------
create table if not exists public.notification_tokens (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  token         text not null,
  device_type   text check (device_type in ('ios','android','web')),
  created_at    timestamptz not null default now(),
  last_used     timestamptz not null default now(),
  unique (user_id, token)
);

-- -----------------------------------------------------------------------------
-- AUDIT LOGS (append-only)
-- -----------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  action        text not null,
  ip_address    inet,
  device_info   text,
  created_at    timestamptz not null default now()
);
create index if not exists audit_user_idx on public.audit_logs(user_id, created_at desc);

-- =============================================================================
-- ROW-LEVEL SECURITY
-- =============================================================================
alter table public.profiles             enable row level security;
alter table public.conditions           enable row level security;
alter table public.medications          enable row level security;
alter table public.medication_schedules enable row level security;
alter table public.medication_logs      enable row level security;
alter table public.vitals               enable row level security;
alter table public.appointments         enable row level security;
alter table public.reminders            enable row level security;
alter table public.notification_tokens  enable row level security;
alter table public.audit_logs           enable row level security;

-- Helper: standard "owner can do everything with their own rows" policy.
-- profiles uses id; everything else uses user_id.
create policy "profiles_owner" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "conditions_owner" on public.conditions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "medications_owner" on public.medications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Schedules are owned transitively via their medication.
create policy "schedules_owner" on public.medication_schedules
  for all using (
    exists (
      select 1 from public.medications m
      where m.id = medication_id and m.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.medications m
      where m.id = medication_id and m.user_id = auth.uid()
    )
  );

create policy "logs_owner" on public.medication_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "vitals_owner" on public.vitals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "appointments_owner" on public.appointments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "reminders_owner" on public.reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "tokens_owner" on public.notification_tokens
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Audit logs: users may read their own; inserts happen via service role / trigger.
create policy "audit_read_own" on public.audit_logs
  for select using (auth.uid() = user_id);

-- =============================================================================
-- TRIGGER: auto-create a profile row when a new auth user signs up
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
