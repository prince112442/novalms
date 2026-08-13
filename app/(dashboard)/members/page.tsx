import { getCurrentProfile } from "@/lib/getProfile";
import MembersClient from "./MembersClient";

export default async function MembersPage() {
  const profile = await getCurrentProfile();
  const canManage = profile?.role === "SUPER_ADMIN";

  return <MembersClient canManage={canManage} />;
}
