create table if not exists public.certificate_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  background_image_url text,
  layout_json jsonb not null default '{}'::jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists certificate_templates_single_published_idx
on public.certificate_templates ((status))
where status = 'published';

create trigger set_certificate_templates_updated_at
before update on public.certificate_templates
for each row execute function public.set_updated_at();

alter table public.certificate_templates enable row level security;

create policy "certificate_templates_select_admin"
on public.certificate_templates
for select
to authenticated
using (public.has_admin_role(array['certification_manager', 'super_admin']));

create policy "certificate_templates_select_published"
on public.certificate_templates
for select
to anon, authenticated
using (status = 'published');

create policy "certificate_templates_insert_manager"
on public.certificate_templates
for insert
to authenticated
with check (public.has_admin_role(array['certification_manager', 'super_admin']));

create policy "certificate_templates_update_manager"
on public.certificate_templates
for update
to authenticated
using (public.has_admin_role(array['certification_manager', 'super_admin']))
with check (public.has_admin_role(array['certification_manager', 'super_admin']));

drop policy if exists "admin_uploads_admin_insert" on storage.objects;
drop policy if exists "admin_uploads_admin_update" on storage.objects;
drop policy if exists "admin_uploads_admin_delete" on storage.objects;

create policy "admin_uploads_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'admin-uploads'
  and public.has_admin_role(array['content_manager', 'course_manager', 'certification_manager', 'super_admin'])
);

create policy "admin_uploads_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'admin-uploads'
  and public.has_admin_role(array['content_manager', 'course_manager', 'certification_manager', 'super_admin'])
)
with check (
  bucket_id = 'admin-uploads'
  and public.has_admin_role(array['content_manager', 'course_manager', 'certification_manager', 'super_admin'])
);

create policy "admin_uploads_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'admin-uploads'
  and public.has_admin_role(array['content_manager', 'course_manager', 'certification_manager', 'super_admin'])
);
