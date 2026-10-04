type Post = {id?: string; slug?: string; locale: string; title: string; summary?: string; status: string};
export type CommunityPostGroup<T extends Post> = {source: T; translations: T[]};
export function groupCommunityPosts<T extends Post>(items: readonly T[]): CommunityPostGroup<T>[] {
  const groups = new Map<string, CommunityPostGroup<T>>();
  items.forEach((item, index) => {
    const key = item.slug ? `slug:${item.slug}` : `row:${item.id ?? index}`;
    const group = groups.get(key);
    if (group) {
      group.translations.push(item);
      if (item.locale === 'ko') group.source = item;
    } else groups.set(key, {source: item, translations: [item]});
  });
  return Array.from(groups.values());
}
export function filterCommunityPostGroups<T extends Post>(groups: readonly CommunityPostGroup<T>[], search: string, locale: string, status: string): CommunityPostGroup<T>[] {
  const keyword = search.trim().toLowerCase();
  return groups.filter(({translations}) => translations.some(item =>
    (!locale || item.locale === locale) && (!status || item.status === status) &&
    (!keyword || [item.title, item.summary, item.slug].some(value => value?.toLowerCase().includes(keyword)))
  ));
}

