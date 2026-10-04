type DirectorSource = {
  slug: string;
  title: string;
  lead?: string;
  imageUrl?: string;
  updatedAt?: string;
  translatedFromUpdatedAt?: string;
};

/** Korean published rows own identity, order, visibility and portraits. */
export function resolveDirectorRoster(sources: DirectorSource[], translations: DirectorSource[], locale: string) {
  const bySlug = new Map(translations.map((row) => [row.slug, row]));
  return sources.map((source) => {
    const candidate = locale === "ko" ? undefined : bySlug.get(source.slug);
    const translation = source.updatedAt && candidate?.translatedFromUpdatedAt === source.updatedAt ? candidate : undefined;
    return {
      slug: source.slug,
      imageUrl: source.imageUrl,
      name: translation?.title || source.title,
      role: translation?.lead || source.lead || "",
      needsTranslation: locale !== "ko" && !translation
    };
  });
}
