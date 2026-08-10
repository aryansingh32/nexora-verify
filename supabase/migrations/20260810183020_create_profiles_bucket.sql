insert into storage.buckets (id, name, public) values ('profiles', 'profiles', true);

create policy "Public Access" on storage.objects for select using ( bucket_id = 'profiles' );
create policy "Authenticated users can upload profiles" on storage.objects for insert with check ( bucket_id = 'profiles' and auth.role() = 'authenticated' );
create policy "Authenticated users can update profiles" on storage.objects for update with check ( bucket_id = 'profiles' and auth.role() = 'authenticated' );
create policy "Authenticated users can delete profiles" on storage.objects for delete using ( bucket_id = 'profiles' and auth.role() = 'authenticated' );
