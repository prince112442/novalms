// scripts/create-admin.ts
// Creates the first login: a real Supabase Auth user, plus the matching
// profile row Prisma/the app reads roles from. Run once: npm run db:create-admin
// Edit the values below first.
import "dotenv/config";
import { createAdminClient } from "../lib/supabase/admin";
import { prisma } from "../lib/prisma";

const ADMIN = {
  fullName: "Library Admin",
  email: "libraryadmin@library.edu",
  password: "Library#Admin2026!" // you'll log in with this — change it after first login
};

(async () => {
  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN.email,
    password: ADMIN.password,
    email_confirm: true
  });

  if (error || !data.user) {
    console.error("Could not create the Supabase Auth user:", error?.message);
    process.exit(1);
  }

  await prisma.profile.create({
    data: {
      id: data.user.id,
      fullName: ADMIN.fullName,
      email: ADMIN.email,
      role: "SUPER_ADMIN"
    }
  });

  console.log(`Admin created: ${ADMIN.email} / ${ADMIN.password}`);
  process.exit(0);
})();
