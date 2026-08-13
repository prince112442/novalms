import { getCurrentProfile } from "@/lib/getProfile";
import IssuedBooksClient from "./IssuedBooksClient";

export default async function IssuedBooksPage() {
  const profile = await getCurrentProfile();
  const canManage = profile?.role === "SUPER_ADMIN" || profile?.role === "LIBRARIAN";

  return <IssuedBooksClient canManage={canManage} />;
}
