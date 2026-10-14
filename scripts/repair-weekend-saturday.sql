-- Phase 1 operational repair. NOT APPLIED: connected Supabase SQL access denied.
-- Run with an authorized database operator. All four languages are updated atomically.
-- Abort on unexpected content rather than overwriting a concurrent customer's edit.
-- This changes only the Saturday schedule item and its duplicated duration label.
begin;
do $$
declare
  entry record;
  saturday text;
  sunday text;
  expected_labels jsonb;
  labels jsonb;
  repaired jsonb;
  count_rows integer := 0;
begin
  for entry in
    select l.id, l.locale, l.status, l.schedule_tracks
    from public.course_localizations l join public.courses c on c.id = l.course_id
    where c.slug = '주말반-취미반'
    order by l.locale for update of l
  loop
    saturday := case entry.locale when 'ko' then '토요일반' when 'en' then 'Saturday class'
      when 'es' then 'Grupo de los sábados' when 'zh-CN' then '周六班' end;
    sunday := case entry.locale when 'ko' then '일요일반' when 'en' then 'Sunday class'
      when 'es' then 'Grupo de los domingos' when 'zh-CN' then '周日班' end;
    if saturday is null or entry.status <> 'published'
      or jsonb_array_length(entry.schedule_tracks) <> 1
      or entry.schedule_tracks->0->>'id' <> 'track-1' then
      raise exception 'Unexpected course structure/status for %; no changes applied', entry.locale;
    end if;
    select jsonb_agg(item->>'label' order by position) into labels
    from jsonb_array_elements(entry.schedule_tracks->0->'items') with ordinality as items(item, position);
    expected_labels := jsonb_build_array(sunday, case entry.locale when 'ko' then '상담 안내'
      when 'en' then 'Consultation information' when 'es' then 'Información sobre asesoramiento'
      when 'zh-CN' then '咨询说明' end);
    -- Korean was already partially repaired by the customer; accept either before/after state.
    if labels is distinct from expected_labels
      and labels is distinct from (jsonb_build_array(saturday) || expected_labels) then
      raise exception 'Unexpected schedule items for %; no changes applied', entry.locale;
    end if;
    if coalesce(entry.schedule_tracks->0->>'duration', '') not in ('', saturday) then
      raise exception 'Unexpected duration for %; no changes applied', entry.locale;
    end if;
    select jsonb_agg(item order by position) into repaired
    from jsonb_array_elements(entry.schedule_tracks->0->'items') with ordinality as items(item, position)
    where item->>'label' is distinct from saturday;
    repaired := jsonb_set(jsonb_set(entry.schedule_tracks, '{0,items}', repaired), '{0,duration}', '""'::jsonb);
    if repaired is distinct from entry.schedule_tracks then
      update public.course_localizations set schedule_tracks = repaired where id = entry.id;
    end if;
    count_rows := count_rows + 1;
  end loop;
  if count_rows <> 4 then raise exception 'Expected exactly four locales; no changes applied'; end if;
end $$;
select l.locale, l.status, l.schedule_tracks
from public.course_localizations l join public.courses c on c.id = l.course_id
where c.slug = '주말반-취미반' order by l.locale;
commit;
