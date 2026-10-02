import { mkdirSync, writeFileSync } from "node:fs";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { buildPreparedCourseTranslation, courseTranslationSources } from "../src/lib/course-translation-repairs";

const targetLocales = ["en", "es", "zh-CN"];
const escape = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));
function leaves(value: unknown, prefix = ""): Array<[string, string]> {
  if (typeof value === "string") return [[prefix, value]];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) => leaves(item, prefix ? `${prefix}.${key}` : key));
}

async function run() {
  let live: Array<Record<string, unknown>> | undefined;
  if (process.argv.includes("--verify-live")) {
    loadEnvConfig(process.cwd());
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Public Supabase configuration is required for live source verification");
    const { data, error } = await createClient(url, key).from("course_localizations").select("*").eq("locale", "ko").eq("status", "published");
    if (error) throw error;
    live = data;
  }
  const bundle = courseTranslationSources.flatMap(source => targetLocales.map(locale => {
    const current = live?.find(row => row.course_id === source.course_id) ?? (live ? null : { ...source.content, updated_at: source.updated_at });
    if (!current) throw new Error(`Missing published source: ${source.slug}`);
    return { course_id: source.course_id, slug: source.slug, locale, ...buildPreparedCourseTranslation(source.slug, locale, current) };
  }));
  const sections = courseTranslationSources.map(source => {
    const translated = targetLocales.map(locale => new Map(leaves(bundle.find(row => row.slug === source.slug && row.locale === locale)!.content)));
    const rows = leaves(source.content).filter(([, value]) => /[가-힣]/.test(value)).map(([field, original]) => `<tr><th>${escape(field)}</th><td>${escape(original)}</td>${translated.map(map => `<td>${escape(map.get(field))}</td>`).join("")}</tr>`).join("");
    return `<details><summary>${escape(source.content.title)}</summary><p>한국어 기준: ${escape(source.updated_at)}</p><table><thead><tr><th>항목</th><th>한국어 원문</th><th>English</th><th>Español</th><th>简体中文</th></tr></thead><tbody>${rows}</tbody></table></details>`;
  }).join("");
  mkdirSync("output/course-translation-review", { recursive: true });
  writeFileSync("output/course-translation-review/drafts.json", JSON.stringify({ generatedAt: new Date().toISOString(), sourceVerifiedLive: Boolean(live), drafts: bundle }, null, 2));
  writeFileSync("output/course-translation-review/review.html", `<!doctype html><html lang="ko"><meta charset="utf-8"><title>교육과정 번역 대조표</title><style>body{font:15px/1.6 system-ui;margin:32px;color:#17212b}table{border-collapse:collapse;width:100%;table-layout:fixed}td,th{padding:12px;border:1px solid #ccc;white-space:pre-wrap;overflow-wrap:anywhere;vertical-align:top}th:first-child{width:12%}summary{font-size:20px;cursor:pointer;padding:14px;background:#f0f3f5}details{margin-bottom:16px}h1{font-size:28px}</style><h1>교육과정 번역 대조표</h1><p>18개 과정 × 3개 언어. AI 번역 초안이며 사람의 검수가 필요합니다. 운영 데이터는 변경하지 않았습니다.</p><p>기간·시간·교육 주제·주의사항을 확인한 뒤 관리자 과정 관리에서 대상 언어 → 원문 기준 번역 불러오기 → 검수 완료 저장 → 다시 열어 최고 관리자 공개 순서로 진행합니다. 검수 완료 저장부터 재공개까지는 해당 언어 과정이 잠시 비공개됩니다.</p>${sections}</html>`);
  console.log(`Prepared ${bundle.length} drafts; source verification: ${live ? "live" : "snapshot"}; no database writes.`);
}
run().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
