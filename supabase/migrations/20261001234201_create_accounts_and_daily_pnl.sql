create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  starting_balance numeric(14, 2) not null check (starting_balance > 0),
  created_at timestamptz not null default now()
);

create index accounts_user_id_idx on public.accounts (user_id);

-- Net P&L after fees, one row per account per trading day.
create table public.daily_pnl (
  account_id uuid not null references public.accounts (id) on delete cascade,
  day date not null,
  pnl numeric(14, 2) not null,
  primary key (account_id, day)
);

alter table public.accounts enable row level security;
alter table public.daily_pnl enable row level security;

grant select, insert, update, delete on public.accounts to authenticated;
grant select, insert, update, delete on public.daily_pnl to authenticated;
revoke all on public.accounts, public.daily_pnl from anon;

create policy "Users read own accounts" on public.accounts
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users create own accounts" on public.accounts
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own accounts" on public.accounts
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users delete own accounts" on public.accounts
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users read own daily pnl" on public.daily_pnl
  for select to authenticated using (
    exists (select 1 from public.accounts a where a.id = account_id and a.user_id = (select auth.uid()))
  );
create policy "Users create own daily pnl" on public.daily_pnl
  for insert to authenticated with check (
    exists (select 1 from public.accounts a where a.id = account_id and a.user_id = (select auth.uid()))
  );
create policy "Users update own daily pnl" on public.daily_pnl
  for update to authenticated
  using (
    exists (select 1 from public.accounts a where a.id = account_id and a.user_id = (select auth.uid()))
  )
  with check (
    exists (select 1 from public.accounts a where a.id = account_id and a.user_id = (select auth.uid()))
  );
create policy "Users delete own daily pnl" on public.daily_pnl
  for delete to authenticated using (
    exists (select 1 from public.accounts a where a.id = account_id and a.user_id = (select auth.uid()))
  );
