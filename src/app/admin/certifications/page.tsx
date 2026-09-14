import { AdminConsoleShell, AdminPanel } from "@/components/AdminConsole";
import { AdminCertificationsManager } from "@/components/AdminCertificationsManager";
import { getAdminCertificateTemplate, getAdminCertifications, getAdminCourses } from "@/lib/admin-data";
import { getPublishedCourses } from "@/lib/course-repository";
import type { CourseCategoryKey } from "@/lib/course-model";

const categoryLabels: Record<CourseCategoryKey, string> = {
  certification: "자격 과정",
  practical: "실무 과정",
  professional: "전문 과정"
};

export default async function AdminCertificationsPage() {
  const [certifications, adminCourses, publishedCourses, certificateTemplate] = await Promise.all([
    getAdminCertifications(),
    getAdminCourses(),
    getPublishedCourses("ko"),
    getAdminCertificateTemplate()
  ]);
  const adminCourseOptions = adminCourses
    .filter((course) => course.isActive)
    .map((course) => ({
      category: categoryLabels[course.categoryKey],
      title: course.localizations.find((localization) => localization.locale === "ko")?.title ?? course.localizations[0]?.title ?? course.slug
    }))
    .filter((course) => course.title);
  const courseOptions = adminCourseOptions.length
    ? adminCourseOptions
    : publishedCourses.map((course) => ({
        category: course.category,
        title: course.title
      }));

  return (
    <AdminConsoleShell
      active="certifications"
      description="자격 정보 및 발급 내역을 관리합니다."
      title="자격 데이터"
    >
      <AdminPanel className="admin-certifications-panel">
        <AdminCertificationsManager
          certificateTemplate={certificateTemplate}
          certifications={certifications}
          courseOptions={courseOptions}
        />
      </AdminPanel>
    </AdminConsoleShell>
  );
}
