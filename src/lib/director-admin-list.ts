type DirectorRow = { locale: string; slug?: string; title: string; summary?: string; status: string };

/** One Korean source per person; filters inspect that person's translations. */
export function filterDirectorGroups<T extends DirectorRow>(items: readonly T[], search: string, locale: string, status: string): T[] {
  const keyword = search.trim().toLowerCase();
  return items.filter((source) => {
    if (source.locale !== "ko") return false;
    const group = items.filter((item) => item.slug === source.slug);
    const candidates = locale ? group.filter((item) => item.locale === locale) : group;
    return candidates.some((item) => (!status || item.status === status) &&
      (!keyword || [item.title, item.summary, item.slug].some((value) => value?.toLowerCase().includes(keyword))));
  });
}
