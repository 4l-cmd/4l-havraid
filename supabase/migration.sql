-- =========================================
-- 4L HAVRAID — Migration complète Supabase
-- À exécuter dans l'éditeur SQL de Supabase
-- =========================================

-- Extensions
create extension if not exists "uuid-ossp";

-- =========================================
-- TABLE: news (actualités)
-- =========================================
create table if not exists public.news (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  title text not null,
  content text not null,
  image_url text,
  type text not null default 'actualite' check (type in ('actualite', 'sponsor', 'etape', 'info')),
  published boolean not null default true,
  author text not null default 'L''équipe 4L Havraid'
);

-- =========================================
-- TABLE: etapes (étapes du raid)
-- =========================================
create table if not exists public.etapes (
  id uuid primary key default uuid_generate_v4(),
  "order" integer not null,
  label text not null,
  icon text not null default '📍',
  done boolean not null default false,
  done_at timestamptz,
  description text
);

-- =========================================
-- TABLE: sponsors
-- =========================================
create table if not exists public.sponsors (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  company text not null,
  contact text not null,
  email text not null,
  phone text,
  address text not null default '',
  siret text,
  position text not null default 'A',
  tier text not null check (tier in ('Bronze', 'Argent', 'Or')),
  amount integer not null default 350,
  paid boolean not null default false,
  logo_url text,
  description text,
  approved boolean not null default false
);

-- =========================================
-- TABLE: km_adoptions (adoption de km)
-- =========================================
create table if not exists public.km_adoptions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  user_email text not null,
  user_name text not null,
  km_number integer not null,
  amount integer not null default 5,
  paid boolean not null default false,
  message text,
  message_public boolean not null default false,
  photo_url text,
  photo_uploaded boolean not null default false
);

-- =========================================
-- TABLE: tickets (support)
-- =========================================
create table if not exists public.tickets (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  user_email text not null,
  user_name text not null,
  subject text not null,
  message text not null,
  status text not null default 'ouvert' check (status in ('ouvert', 'en_cours', 'resolu', 'ferme')),
  type text not null check (type in ('remboursement', 'changement_km', 'changement_sponsor', 'question', 'autre')),
  admin_response text,
  responded_at timestamptz
);

-- =========================================
-- TABLE: gps_positions
-- =========================================
create table if not exists public.gps_positions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  lat double precision not null,
  lng double precision not null,
  label text,
  km_parcourus integer
);

-- =========================================
-- TABLE: equipe (membres)
-- =========================================
create table if not exists public.equipe (
  id uuid primary key default uuid_generate_v4(),
  "order" integer not null default 1,
  name text not null,
  role text not null,
  details text,
  bio text not null default '',
  photo_url text,
  phone text,
  email text,
  instagram text
);

-- =========================================
-- TABLE: config (configuration du site)
-- =========================================
create table if not exists public.config (
  id uuid primary key default uuid_generate_v4(),
  helloasso_km_url text not null default '',
  helloasso_bronze_url text not null default '',
  helloasso_argent_url text not null default '',
  helloasso_or_url text not null default '',
  instagram_url text not null default 'https://www.instagram.com/4l_havraid/',
  dossier_sponsor_url text not null default '',
  km_price integer not null default 5,
  objectif_financier integer not null default 5000,
  site_actif boolean not null default true,
  message_accueil text not null default ''
);

-- Insert config par défaut si vide
insert into public.config (id) values (uuid_generate_v4())
  on conflict do nothing;

-- =========================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================

-- Activer RLS sur toutes les tables
alter table public.news enable row level security;
alter table public.etapes enable row level security;
alter table public.sponsors enable row level security;
alter table public.km_adoptions enable row level security;
alter table public.tickets enable row level security;
alter table public.gps_positions enable row level security;
alter table public.equipe enable row level security;
alter table public.config enable row level security;

-- =========================================
-- POLICIES: news
-- =========================================
-- Lecture publique des articles publiés
create policy "news_public_read" on public.news
  for select using (published = true);

-- Admin peut tout faire
create policy "news_admin_all" on public.news
  for all using (auth.jwt() ->> 'email' in ('gabin.ranson76@gmail.com', 'jules.marchand76@gmail.com'));

-- =========================================
-- POLICIES: etapes
-- =========================================
create policy "etapes_public_read" on public.etapes
  for select using (true);

create policy "etapes_admin_all" on public.etapes
  for all using (auth.jwt() ->> 'email' in ('gabin.ranson76@gmail.com', 'jules.marchand76@gmail.com'));

-- =========================================
-- POLICIES: sponsors
-- =========================================
-- Lecture publique des sponsors approuvés et payés
create policy "sponsors_public_read" on public.sponsors
  for select using (approved = true and paid = true);

-- N'importe qui peut soumettre une demande de sponsoring
create policy "sponsors_public_insert" on public.sponsors
  for insert with check (true);

-- Admin peut tout faire
create policy "sponsors_admin_all" on public.sponsors
  for all using (auth.jwt() ->> 'email' in ('gabin.ranson76@gmail.com', 'jules.marchand76@gmail.com'));

-- =========================================
-- POLICIES: km_adoptions
-- =========================================
-- Lecture publique des km payés (pour afficher sur le site)
create policy "km_public_read" on public.km_adoptions
  for select using (paid = true);

-- N'importe qui peut soumettre une adoption (via HelloAsso webhook ou formulaire)
create policy "km_public_insert" on public.km_adoptions
  for insert with check (true);

-- Admin peut tout faire
create policy "km_admin_all" on public.km_adoptions
  for all using (auth.jwt() ->> 'email' in ('gabin.ranson76@gmail.com', 'jules.marchand76@gmail.com'));

-- =========================================
-- POLICIES: tickets
-- =========================================
-- Lecture: l'utilisateur voit ses propres tickets
create policy "tickets_user_read" on public.tickets
  for select using (user_email = auth.jwt() ->> 'email');

-- N'importe qui peut créer un ticket
create policy "tickets_public_insert" on public.tickets
  for insert with check (true);

-- Admin peut tout faire
create policy "tickets_admin_all" on public.tickets
  for all using (auth.jwt() ->> 'email' in ('gabin.ranson76@gmail.com', 'jules.marchand76@gmail.com'));

-- =========================================
-- POLICIES: gps_positions
-- =========================================
-- Lecture publique (positions GPS sur la carte)
create policy "gps_public_read" on public.gps_positions
  for select using (true);

-- Seul l'admin peut insérer des positions GPS
create policy "gps_admin_insert" on public.gps_positions
  for insert with check (auth.jwt() ->> 'email' in ('gabin.ranson76@gmail.com', 'jules.marchand76@gmail.com'));

create policy "gps_admin_all" on public.gps_positions
  for all using (auth.jwt() ->> 'email' in ('gabin.ranson76@gmail.com', 'jules.marchand76@gmail.com'));

-- =========================================
-- POLICIES: equipe
-- =========================================
-- Lecture publique
create policy "equipe_public_read" on public.equipe
  for select using (true);

-- Admin peut tout faire
create policy "equipe_admin_all" on public.equipe
  for all using (auth.jwt() ->> 'email' in ('gabin.ranson76@gmail.com', 'jules.marchand76@gmail.com'));

-- =========================================
-- POLICIES: config
-- =========================================
-- Lecture publique (pour récupérer les liens HelloAsso, etc.)
create policy "config_public_read" on public.config
  for select using (true);

-- Admin peut tout faire
create policy "config_admin_all" on public.config
  for all using (auth.jwt() ->> 'email' in ('gabin.ranson76@gmail.com', 'jules.marchand76@gmail.com'));

-- =========================================
-- STORAGE: bucket photos
-- =========================================
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
  on conflict (id) do nothing;

-- Lecture publique des photos
create policy "photos_public_read" on storage.objects
  for select using (bucket_id = 'photos');

-- Admin peut uploader
create policy "photos_admin_upload" on storage.objects
  for insert with check (
    bucket_id = 'photos'
    and auth.jwt() ->> 'email' in ('gabin.ranson76@gmail.com', 'jules.marchand76@gmail.com')
  );

create policy "photos_admin_update" on storage.objects
  for update using (
    bucket_id = 'photos'
    and auth.jwt() ->> 'email' in ('gabin.ranson76@gmail.com', 'jules.marchand76@gmail.com')
  );

create policy "photos_admin_delete" on storage.objects
  for delete using (
    bucket_id = 'photos'
    and auth.jwt() ->> 'email' in ('gabin.ranson76@gmail.com', 'jules.marchand76@gmail.com')
  );

-- =========================================
-- REALTIME: activer sur gps_positions
-- =========================================
alter publication supabase_realtime add table public.gps_positions;
alter publication supabase_realtime add table public.etapes;
alter publication supabase_realtime add table public.news;
