import sources from "../data/course-translations/source-ko.json";
import en from "../data/course-translations/en.json";
import es from "../data/course-translations/es.json";
import zh from "../data/course-translations/zh-CN.json";

export const courseTranslationSources = sources;
export const courseTranslationDictionaries: Record<string, Record<string, string>> = { en, es, "zh-CN": zh };
const structuralKeys = new Set(["id", "type", "url", "image_url", "pdf_url"]);

export function validatePreparedCourseSave(expected: string | undefined, current: string | null, status: string) {
  if (!expected) return null;
  if (current !== expected) return "번역을 불러온 뒤 한국어 원문이 변경되었습니다. 최신 원문을 다시 확인해 주세요.";
  if (status !== "reviewed") return "불러온 번역은 내용을 검수한 뒤 검수완료로 저장해 주세요. 다시 열어 최고 관리자가 공개할 수 있습니다.";
  return null;
}

/** Translate exact source leaves, preserving all arrays, identifiers and media URLs. */
export function translateCourseContent<T>(value: T, dictionary: Record<string, string>, key = ""): T {
  if (structuralKeys.has(key)) return value;
  if (typeof value === "string") {
    if (!/[가-힣]/.test(value)) return value;
    const translated = Object.hasOwn(dictionary, value) ? dictionary[value] : undefined;
    if (!translated?.trim() || /[가-힣]/.test(translated)) throw new Error(`Missing translation: ${value}`);
    return translated as T;
  }
  if (Array.isArray(value)) return value.map(item => translateCourseContent(item, dictionary, key)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, translateCourseContent(item, dictionary, name)])) as T;
  }
  return value;
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(",")}}`;
  return JSON.stringify(value);
}

export function buildPreparedCourseTranslation(slug: string, locale: string, liveSource: Record<string, unknown>) {
  if (!Object.hasOwn(courseTranslationDictionaries, locale)) throw new Error("Unsupported translation locale");
  const source = sources.find(row => row.slug === slug);
  if (!source) throw new Error("No prepared translation for this course");
  const current = Object.fromEntries(Object.keys(source.content).map(key => [key, liveSource[key] ?? null]));
  if (source.updated_at !== liveSource.updated_at || canonical(source.content) !== canonical(current)) {
    throw new Error("Korean source changed; prepare and review a new translation");
  }
  return {
    content: translateCourseContent(source.content, courseTranslationDictionaries[locale]),
    sourceUpdatedAt: source.updated_at,
    status: "draft" as const
  };
}
