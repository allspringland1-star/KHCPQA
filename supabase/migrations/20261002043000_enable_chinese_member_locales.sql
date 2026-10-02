-- Match the four public locales for signup, profile editing and inquiries.
-- Only locale validation changes; row permissions and existing data are preserved.
begin;

alter table public.profiles
  drop constraint if exists profiles_preferred_locale_check;
alter table public.profiles
  add constraint profiles_preferred_locale_check
  check (preferred_locale in ('ko', 'en', 'es', 'zh-CN'));

alter table public.inquiries
  drop constraint if exists inquiries_locale_check;
alter table public.inquiries
  add constraint inquiries_locale_check
  check (locale in ('ko', 'en', 'es', 'zh-CN'));

commit;
