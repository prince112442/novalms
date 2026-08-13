import { getCurrentProfile } from "@/lib/getProfile";
import BooksClient from "./BooksClient";

// Only librarians/admins can add or edit books. Students (and lecturers)
// get a read-only view — the "Add a Book" form just doesn't render for them,
// and the API routes enforce the same rule server-side either way.
export default async function BooksPage() {
  const profile = await getCurrentProfile();
  const canManage = profile?.role === "SUPER_ADMIN" || profile?.role === "LIBRARIAN";

  return <BooksClient canManage={canManage} />;
}
