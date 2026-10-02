export const adminLocaleLabels: Record<string, string> = {
  ko: "한국어", en: "English", es: "Español", "zh-CN": "简体中文"
};

/** Copy to a new locale identity without mutating or publishing the source. */
export function createTranslationDraft<T extends { locale: string; slug?: string; status: string; id?: string }>(
  source: T,
  locale: string,
  items: readonly { locale: string; slug?: string }[]
): (Omit<T, "id"> & { id?: undefined }) | null {
  if (!Object.hasOwn(adminLocaleLabels, locale) || locale === source.locale || !source.slug ||
    items.some((item) => item.slug === source.slug && item.locale === locale)) return null;
  return { ...source, id: undefined, locale, status: "draft" };
}
