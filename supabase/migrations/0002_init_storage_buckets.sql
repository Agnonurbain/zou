-- Create a public bucket for product images
create bucket if not exists "product-images" with public;

-- Enable row level security for storage objects and restrict access by bucket and object prefix.
alter table if exists storage.objects enable row level security;

-- Allow public read access for product images.
create policy if not exists "product-images: public select" on storage.objects
  as permissive
  for select
  using (bucket_id = 'product-images');

-- Allow authenticated users to insert objects under their seller_id prefix.
create policy if not exists "product-images: authenticated insert own files" on storage.objects
  as permissive
  for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
    and name like auth.uid() || '/%'
  );

-- Allow authenticated users to delete their own files.
create policy if not exists "product-images: authenticated delete own files" on storage.objects
  as permissive
  for delete
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
    and name like auth.uid() || '/%'
  );
