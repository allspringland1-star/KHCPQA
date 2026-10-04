import { AdminConsoleShell } from "@/components/AdminConsole";
import { AdminDirectorsManager } from "@/components/AdminDirectorsManager";
import { getAdminContentRows } from "@/lib/admin-data";

export default async function AdminDirectorsPage() {
  const contentRows = await getAdminContentRows();
  const directorRows = contentRows.filter((row) => row.type === "Page" && row.slug?.startsWith("director-"));


  return (
    <AdminConsoleShell
      active="directors"
      description="국제 디렉터 프로필과 공개 노출 상태를 관리합니다."
      title="국제 디렉터 관리"
    >
      <AdminDirectorsManager items={directorRows} />
    </AdminConsoleShell>
  );
}
