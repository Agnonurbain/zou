-- supabase/migrations/0001_init_zou_schema.sql

-- Enable pgcrypto for UUID generation
create extension if not exists "pgcrypto";

-- Profiles table linked to auth.users
create table if not exists profiles (
  id uuid not null primary key references auth.users(id) on delete cascade,
  business_name text not null,
  phone_number text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "Profiles can be selected by owner" on profiles for select using (
  auth.uid() = id
);
create policy "Profiles can insert their own profile" on profiles for insert with check (
  auth.uid() = id
);
create policy "Profiles can update their own profile" on profiles for update using (
  auth.uid() = id
) with check (
  auth.uid() = id
);
create policy "Profiles can delete their own profile" on profiles for delete using (
  auth.uid() = id
);

create index if not exists idx_profiles_phone_number on profiles(phone_number);

-- Products table for seller listings
create table if not exists products (
  id uuid not null primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  description text,
  price integer not null,
  images text[],
  stock integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table products enable row level security;
create policy "Public can select products" on products for select using (true);
create policy "Sellers can insert own products" on products for insert with check (
  seller_id = auth.uid()
);
create policy "Sellers can update own products" on products for update using (
  seller_id = auth.uid()
) with check (
  seller_id = auth.uid()
);
create policy "Sellers can delete own products" on products for delete using (
  seller_id = auth.uid()
);

create index if not exists idx_products_seller_id on products(seller_id);
create index if not exists idx_products_created_at on products(created_at desc);
create index if not exists idx_products_is_active on products(is_active);

-- Orders table for seller transactions
create table if not exists orders (
  id uuid not null primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  customer_name text not null,
  customer_phone text not null,
  items jsonb not null,
  total_amount integer not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  whatsapp_link text,
  created_at timestamptz not null default now()
);

alter table orders enable row level security;
create policy "Sellers can select own orders" on orders for select using (
  seller_id = auth.uid()
);
create policy "Sellers can insert own orders" on orders for insert with check (
  seller_id = auth.uid()
);
create policy "Sellers can update own orders" on orders for update using (
  seller_id = auth.uid()
) with check (
  seller_id = auth.uid()
);
create policy "Sellers can delete own orders" on orders for delete using (
  seller_id = auth.uid()
);

create index if not exists idx_orders_seller_id on orders(seller_id);
create index if not exists idx_orders_seller_status on orders(seller_id, status);
create index if not exists idx_orders_created_at on orders(created_at desc);
