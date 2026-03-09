-- Brand generation persistence and multi-agent orchestration schema
-- Date: 2026-02-10

create extension if not exists pgcrypto;

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  brand_id uuid not null references public.brands (id) on delete cascade,
  team_id uuid null,
  status text not null default 'created' check (status in ('created', 'in_progress', 'running', 'completed', 'failed')),
  active_module text not null default 'geometry',
  current_brief_version integer not null default 0,
  last_run_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_sessions_user_updated_at on public.sessions (user_id, updated_at desc);
create index if not exists idx_sessions_brand on public.sessions (brand_id);
create index if not exists idx_sessions_team on public.sessions (team_id);

create table if not exists public.brand_briefs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  version integer not null,
  brand_name text not null default '',
  industry text not null default '',
  description text not null default '',
  audience text not null default '',
  goals text[] not null default '{}',
  personality text[] not null default '{}',
  competitors text[] not null default '{}',
  raw_payload jsonb not null default '{}'::jsonb,
  is_valid boolean not null default false,
  validation_errors jsonb null,
  source text not null default 'autosave',
  created_at timestamptz not null default now(),
  unique (session_id, version)
);

create index if not exists idx_brand_briefs_session_version on public.brand_briefs (session_id, version desc);

create table if not exists public.agent_outputs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  brand_id uuid not null references public.brands (id) on delete cascade,
  run_id uuid not null,
  agent_key text not null check (agent_key in ('strategist', 'researcher', 'designer', 'copywriter', 'validator')),
  status text not null check (status in ('completed', 'failed', 'skipped')),
  reasoning text[] not null default '{}',
  output jsonb null,
  error_message text null,
  duration_ms integer null,
  dependencies text[] not null default '{}',
  prompt_version text null,
  created_at timestamptz not null default now()
);

create index if not exists idx_agent_outputs_session_created on public.agent_outputs (session_id, created_at desc);
create index if not exists idx_agent_outputs_run on public.agent_outputs (run_id, agent_key);

create table if not exists public.design_assets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  brand_id uuid not null references public.brands (id) on delete cascade,
  run_id uuid not null,
  asset_type text not null,
  asset_path text not null,
  format text not null,
  metadata jsonb not null default '{}'::jsonb,
  malicious_scan_status text not null default 'pending' check (malicious_scan_status in ('pending', 'clean', 'flagged')),
  created_at timestamptz not null default now()
);

create index if not exists idx_design_assets_session on public.design_assets (session_id, created_at desc);

create table if not exists public.consistency_reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  brand_id uuid not null references public.brands (id) on delete cascade,
  run_id uuid not null,
  passed boolean not null default false,
  score integer not null default 0,
  contradictions text[] not null default '{}',
  actions_taken text[] not null default '{}',
  report jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_consistency_reports_session on public.consistency_reports (session_id, created_at desc);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  run_id uuid null,
  actor_type text not null check (actor_type in ('user', 'system', 'agent')),
  event_type text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_session_created on public.audit_logs (session_id, created_at desc);
create index if not exists idx_audit_logs_run_id on public.audit_logs (run_id);

alter table public.sessions enable row level security;
alter table public.brand_briefs enable row level security;
alter table public.agent_outputs enable row level security;
alter table public.design_assets enable row level security;
alter table public.consistency_reports enable row level security;
alter table public.audit_logs enable row level security;
alter table public.team_members enable row level security;

drop policy if exists team_members_select_own on public.team_members;
create policy team_members_select_own
on public.team_members
for select
using (auth.uid() = user_id);

drop policy if exists sessions_owner_or_team_select on public.sessions;
create policy sessions_owner_or_team_select
on public.sessions
for select
using (
  auth.uid() = user_id
  or (
    team_id is not null
    and exists (
      select 1
      from public.team_members tm
      where tm.team_id = sessions.team_id
        and tm.user_id = auth.uid()
    )
  )
);

drop policy if exists sessions_owner_or_team_insert on public.sessions;
create policy sessions_owner_or_team_insert
on public.sessions
for insert
with check (
  auth.uid() = user_id
  or (
    team_id is not null
    and exists (
      select 1
      from public.team_members tm
      where tm.team_id = sessions.team_id
        and tm.user_id = auth.uid()
    )
  )
);

drop policy if exists sessions_owner_or_team_update on public.sessions;
create policy sessions_owner_or_team_update
on public.sessions
for update
using (
  auth.uid() = user_id
  or (
    team_id is not null
    and exists (
      select 1
      from public.team_members tm
      where tm.team_id = sessions.team_id
        and tm.user_id = auth.uid()
    )
  )
)
with check (
  auth.uid() = user_id
  or (
    team_id is not null
    and exists (
      select 1
      from public.team_members tm
      where tm.team_id = sessions.team_id
        and tm.user_id = auth.uid()
    )
  )
);

drop policy if exists sessions_owner_or_team_delete on public.sessions;
create policy sessions_owner_or_team_delete
on public.sessions
for delete
using (
  auth.uid() = user_id
  or (
    team_id is not null
    and exists (
      select 1
      from public.team_members tm
      where tm.team_id = sessions.team_id
        and tm.user_id = auth.uid()
    )
  )
);

drop policy if exists brand_briefs_owner_or_team_all on public.brand_briefs;
create policy brand_briefs_owner_or_team_all
on public.brand_briefs
for all
using (
  exists (
    select 1
    from public.sessions s
    where s.id = brand_briefs.session_id
      and (
        s.user_id = auth.uid()
        or (
          s.team_id is not null
          and exists (
            select 1
            from public.team_members tm
            where tm.team_id = s.team_id
              and tm.user_id = auth.uid()
          )
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.sessions s
    where s.id = brand_briefs.session_id
      and (
        s.user_id = auth.uid()
        or (
          s.team_id is not null
          and exists (
            select 1
            from public.team_members tm
            where tm.team_id = s.team_id
              and tm.user_id = auth.uid()
          )
        )
      )
  )
);

drop policy if exists agent_outputs_owner_or_team_all on public.agent_outputs;
create policy agent_outputs_owner_or_team_all
on public.agent_outputs
for all
using (
  exists (
    select 1
    from public.sessions s
    where s.id = agent_outputs.session_id
      and (
        s.user_id = auth.uid()
        or (
          s.team_id is not null
          and exists (
            select 1
            from public.team_members tm
            where tm.team_id = s.team_id
              and tm.user_id = auth.uid()
          )
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.sessions s
    where s.id = agent_outputs.session_id
      and (
        s.user_id = auth.uid()
        or (
          s.team_id is not null
          and exists (
            select 1
            from public.team_members tm
            where tm.team_id = s.team_id
              and tm.user_id = auth.uid()
          )
        )
      )
  )
);

drop policy if exists design_assets_owner_or_team_all on public.design_assets;
create policy design_assets_owner_or_team_all
on public.design_assets
for all
using (
  exists (
    select 1
    from public.sessions s
    where s.id = design_assets.session_id
      and (
        s.user_id = auth.uid()
        or (
          s.team_id is not null
          and exists (
            select 1
            from public.team_members tm
            where tm.team_id = s.team_id
              and tm.user_id = auth.uid()
          )
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.sessions s
    where s.id = design_assets.session_id
      and (
        s.user_id = auth.uid()
        or (
          s.team_id is not null
          and exists (
            select 1
            from public.team_members tm
            where tm.team_id = s.team_id
              and tm.user_id = auth.uid()
          )
        )
      )
  )
);

drop policy if exists consistency_reports_owner_or_team_all on public.consistency_reports;
create policy consistency_reports_owner_or_team_all
on public.consistency_reports
for all
using (
  exists (
    select 1
    from public.sessions s
    where s.id = consistency_reports.session_id
      and (
        s.user_id = auth.uid()
        or (
          s.team_id is not null
          and exists (
            select 1
            from public.team_members tm
            where tm.team_id = s.team_id
              and tm.user_id = auth.uid()
          )
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.sessions s
    where s.id = consistency_reports.session_id
      and (
        s.user_id = auth.uid()
        or (
          s.team_id is not null
          and exists (
            select 1
            from public.team_members tm
            where tm.team_id = s.team_id
              and tm.user_id = auth.uid()
          )
        )
      )
  )
);

drop policy if exists audit_logs_owner_or_team_all on public.audit_logs;
create policy audit_logs_owner_or_team_all
on public.audit_logs
for all
using (
  exists (
    select 1
    from public.sessions s
    where s.id = audit_logs.session_id
      and (
        s.user_id = auth.uid()
        or (
          s.team_id is not null
          and exists (
            select 1
            from public.team_members tm
            where tm.team_id = s.team_id
              and tm.user_id = auth.uid()
          )
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.sessions s
    where s.id = audit_logs.session_id
      and (
        s.user_id = auth.uid()
        or (
          s.team_id is not null
          and exists (
            select 1
            from public.team_members tm
            where tm.team_id = s.team_id
              and tm.user_id = auth.uid()
          )
        )
      )
  )
);

insert into storage.buckets (id, name, public)
values ('brand-assets', 'brand-assets', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('exports', 'exports', false)
on conflict (id) do nothing;

drop policy if exists storage_brand_assets_select on storage.objects;
create policy storage_brand_assets_select
on storage.objects
for select
using (
  bucket_id = 'brand-assets'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists storage_brand_assets_insert on storage.objects;
create policy storage_brand_assets_insert
on storage.objects
for insert
with check (
  bucket_id = 'brand-assets'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists storage_brand_assets_update on storage.objects;
create policy storage_brand_assets_update
on storage.objects
for update
using (
  bucket_id = 'brand-assets'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'brand-assets'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists storage_exports_select on storage.objects;
create policy storage_exports_select
on storage.objects
for select
using (
  bucket_id = 'exports'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists storage_exports_insert on storage.objects;
create policy storage_exports_insert
on storage.objects
for insert
with check (
  bucket_id = 'exports'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists storage_exports_update on storage.objects;
create policy storage_exports_update
on storage.objects
for update
using (
  bucket_id = 'exports'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'exports'
  and auth.uid()::text = (storage.foldername(name))[1]
);

