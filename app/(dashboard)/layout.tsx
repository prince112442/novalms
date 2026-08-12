import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/getProfile";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Administrator",
  LIBRARIAN: "Librarian",
  STUDENT: "Student",
  LECTURER: "Lecturer"
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <DashboardShell fullName={profile.fullName} roleLabel={ROLE_LABELS[profile.role] ?? profile.role}>
      {children}
    </DashboardShell>
  );
}
