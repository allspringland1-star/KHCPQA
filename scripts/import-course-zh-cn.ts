// Retired: the former importer generated unrelated topics and fabricated review metadata.
// Fail closed so old runbooks cannot republish that data.
throw new Error(
  "This importer is retired. Run scripts/prepare-course-translation-repairs.ts for a review bundle, " +
  "then load the prepared translation in /admin/courses and use the authenticated review/publish workflow."
);
