import {
  AdminConsoleShell,
  AdminFilterBar,
  AdminPanel,
  AdminSearchInput,
  AdminSelect
} from "@/components/AdminConsole";
import { AdminUsersManager } from "@/components/AdminUsersManager";
import { getAdminUsers } from "@/lib/admin-data";
import { getPublishedCourses } from "@/lib/course-repository";

export default async function AdminUsersPage() {
  const [users, courseOptions] = await Promise.all([getAdminUsers(), getPublishedCourses("ko")]);

  return (
    <AdminConsoleShell
      active="users"
      description="사용자 정보를 관리하고 권한을 설정합니다."
      title="사용자 관리"
    >
      <AdminPanel>
        <AdminFilterBar>
          <AdminSearchInput placeholder="이름, 이메일 검색" />
          <AdminSelect label="역할 전체" />
          <AdminSelect label="상태 전체" />
        </AdminFilterBar>
        <AdminUsersManager courseOptions={courseOptions} users={users} />
      </AdminPanel>
    </AdminConsoleShell>
  );
}
