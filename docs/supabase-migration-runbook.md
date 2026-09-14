# Supabase Migration Runbook

## Current Project

- Project ref: `lyjwcxbenhkszadgfkjn`
- Local env file: `.env.local`
- Required app env values are set locally:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## Apply With Supabase SQL Editor

Open Supabase Dashboard > SQL Editor and run the migration files in this exact order:

1. `supabase/migrations/202607120001_create_auth_domain_tables.sql`
2. `supabase/migrations/202607120002_allow_public_inquiry_insert.sql`
3. `supabase/migrations/202607120003_create_admin_content_tables.sql`
4. `supabase/migrations/202607220001_add_admin_image_urls.sql`
5. `supabase/migrations/202607270001_reload_admin_content_image_url.sql`
6. `supabase/migrations/202607270002_create_admin_uploads_bucket.sql`
7. `supabase/migrations/202608020001_add_board_author_and_view_count.sql`
8. `supabase/migrations/202608080001_extend_profile_registration_fields.sql`
9. `supabase/migrations/202609140001_create_certificate_templates.sql`

Run each file separately. The migrations use `create ... if not exists`, `drop trigger if exists`, and policy/table names that are intended for forward setup.

## Auth URL Settings

Open Supabase Dashboard > Authentication > URL Configuration.

For local testing:

- Site URL: `http://localhost:3000`
- Redirect URL: `http://localhost:3000/auth/callback`

For production:

- Site URL: production domain
- Redirect URL: `https://production-domain/auth/callback`

## Verification SQL

After applying migrations, run:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'profiles',
    'inquiries',
    'certifications',
    'certificate_templates',
    'admin_content_items',
    'banners',
    'admin_publish_events'
  )
order by table_name;
```

Expected rows:

- `admin_content_items`
- `admin_publish_events`
- `banners`
- `certificate_templates`
- `certifications`
- `inquiries`
- `profiles`

Check policies:

```sql
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
  and tablename in (
    'profiles',
    'inquiries',
    'certifications',
    'certificate_templates',
    'admin_content_items',
    'banners',
    'admin_publish_events'
  )
order by tablename, policyname;
```

Check signup trigger:

```sql
select tgname
from pg_trigger
where tgname = 'on_auth_user_created_profile';
```

Check CMS image URL columns:

```sql
select table_name, column_name
from information_schema.columns
where table_schema = 'public'
  and table_name in ('admin_content_items', 'banners')
  and column_name = 'image_url'
order by table_name;
```

Check the certificate template contract:

```sql
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'certificate_templates'
  and column_name in ('name', 'background_image_url', 'layout_json', 'status')
order by column_name;

select indexname
from pg_indexes
where schemaname = 'public'
  and tablename = 'certificate_templates'
  and indexname = 'certificate_templates_single_published_idx';
```

## Seed Sample Data

After the migrations are applied, run `supabase/seed.sql` in the SQL Editor or through local Supabase reset. The seed inserts:

- published CMS content with `source_url` and `image_url`
- a published home banner with `image_url`
- one public partnership inquiry
- certification sample rows for `member@example.com` when that profile exists

For certification samples, first create or sign up a user with `member@example.com`, then confirm the matching row exists in `public.profiles`. The seed intentionally skips certification rows when that profile does not exist, so it does not create an unsafe demo login account.

Verification:

```sql
select content_type, locale, slug, status, source_url, image_url
from public.admin_content_items
order by content_type, locale, slug;

select id, inquiry_type, name, status, created_at
from public.inquiries
order by created_at desc
limit 5;

select certificate_number, course_title, issued_at, status, verification_code
from public.certifications
order by issued_at desc
limit 5;

select name, background_image_url, status, updated_at
from public.certificate_templates
order by updated_at desc
limit 5;
```

## Apply With Supabase CLI

This repository includes `supabase/config.toml` for CLI usage. To apply from CLI, create a Supabase access token first:

1. Open Supabase Dashboard.
2. Open Account > Access Tokens.
3. Create a personal access token.
4. Store it locally only. Do not commit it.

Add it to `.env.local` or export it in the shell:

```env
SUPABASE_ACCESS_TOKEN=sbp_your_token_here
```

Then run:

```bash
export SUPABASE_ACCESS_TOKEN="$(awk -F= '/^SUPABASE_ACCESS_TOKEN=/ { print $2 }' .env.local)"
npx supabase link --project-ref lyjwcxbenhkszadgfkjn
npx supabase db push
```

CLI application requires a Supabase access token or browser login. App keys in `.env.local` are not enough to run database migrations.

## Signup E2E Checklist

1. Start local app with `.env.local`.
2. Open `http://localhost:3000/ko/signup`.
3. Register with a real email and password.
4. If email confirmation is enabled, open the email confirmation link.
5. Confirm the link returns through `/auth/callback`.
6. Confirm `/ko/account` opens while logged in.
7. In Supabase SQL Editor, verify a matching `profiles` row exists:

```sql
select id, email, full_name, phone, country, interested_course, marketing_opt_in, preferred_locale, role, status
from public.profiles
order by created_at desc
limit 5;
```
