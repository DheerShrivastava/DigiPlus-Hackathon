-- Supabase SQL Schema for DigiPlus Smart Leads
-- Copy and paste this ENTIRE block into your Supabase SQL Editor and click "RUN"

-- 1. Create Hoardings Table
create table if not exists public.hoardings (
  id bigint generated always as identity primary key,
  site_id text unique not null,
  location text,
  size_sqft numeric,
  traffic_score numeric,
  monthly_rate_inr numeric,
  latitude numeric,
  longitude numeric,
  created_at timestamptz default now()
);

-- 2. Create Customers Table
create table if not exists public.customers (
  id bigint generated always as identity primary key,
  customer_id text unique not null,
  name text,
  industry text,
  budget_band text,
  relationship_score numeric,
  last_contact_date date,
  created_at timestamptz default now()
);

-- 3. Create Bookings Table
create table if not exists public.bookings (
  id bigint generated always as identity primary key,
  booking_id text unique not null,
  site_id text references public.hoardings(site_id) on delete cascade,
  customer_id text references public.customers(customer_id) on delete cascade,
  start_date date,
  end_date date,
  value_inr numeric,
  created_at timestamptz default now()
);

-- 4. Disable Row Level Security (RLS) for API access
alter table public.hoardings disable row level security;
alter table public.customers disable row level security;
alter table public.bookings disable row level security;
