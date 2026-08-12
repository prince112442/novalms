import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconBook,
  IconUsers,
  IconBookOut,
  IconDollar,
  IconChat,
  IconGraduationCap,
  IconClockBook,
  IconCheck
} from "@/components/ui/icons";

const FEATURES = [
  {
    icon: IconBook,
    title: "Full Catalog",
    desc: "Search and browse every title in the library, with live copy availability."
  },
  {
    icon: IconBookOut,
    title: "Easy Borrowing",
    desc: "Issue and return books in a few taps, with due dates tracked automatically."
  },
  {
    icon: IconDollar,
    title: "Fines in Cedis",
    desc: "Overdue fines are calculated and shown in Ghana Cedis (GH₵), no surprises."
  },
  {
    icon: IconChat,
    title: "AI Librarian",
    desc: "Ask a question in plain language and get book recommendations instantly."
  }
];

const STEPS = [
  { title: "Create an account", desc: "Sign up with your name, email and a password — it takes under a minute." },
  { title: "Browse the catalog", desc: "Find the book you need and check whether a copy is available." },
  { title: "Borrow & return", desc: "Pick it up at the desk, and return it on time to avoid a fine." }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-navy-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <IconBook className="h-6 w-6 text-orange" />
            <span className="text-lg font-bold">LMS</span>
          </div>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" className="px-3 text-[13px] sm:px-4 sm:text-sm">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button className="px-3 text-[13px] sm:px-4 sm:text-sm">Create Account</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-orange-light px-3 py-1 text-[12.5px] font-semibold text-orange-dark">
            University Library Management System
          </span>
          <h1 className="text-[32px] font-extrabold leading-tight sm:text-[44px]">
            Your library, <span className="text-orange">online</span> and always open.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[15px] text-slate-500 sm:text-base">
            Browse the catalog, borrow and return books, and track fines — all from one place.
            Built for students, lecturers and staff.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button className="w-full px-6 py-3 text-[15px] sm:w-auto">Create your account</Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full px-6 py-3 text-[15px] sm:w-auto">I already have an account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-100 bg-[var(--bg)] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-center text-2xl font-bold sm:text-[28px]">Everything the library needs</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-[13.5px] text-slate-500">
            One system for the catalog, loans, members and fines.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(f => (
              <div key={f.title} className="rounded-card border border-slate-200 bg-white p-5 shadow-card">
                <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-orange">
                  <f.icon className="h-[22px] w-[22px]" />
                </div>
                <h3 className="text-[15px] font-bold">{f.title}</h3>
                <p className="mt-1.5 text-[13px] text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <h2 className="text-center text-2xl font-bold sm:text-[28px]">Get started in three steps</h2>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="text-center sm:text-left">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-[13px] font-bold text-orange sm:mx-0">
                  {i + 1}
                </div>
                <h3 className="mt-3 text-[15px] font-bold">{s.title}</h3>
                <p className="mt-1.5 text-[13px] text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center sm:justify-start">
            <Link href="/signup">
              <Button className="px-6 py-3 text-[15px]">Create your account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-t border-slate-100 bg-navy-900 py-14 text-[#c7cbe8] sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-center text-2xl font-bold text-white sm:text-[28px]">Built for the whole campus</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-card bg-white/5 p-5">
              <IconGraduationCap className="h-6 w-6 text-orange" />
              <h3 className="mt-3 text-[15px] font-bold text-white">Students</h3>
              <p className="mt-1.5 text-[13px]">Sign up, borrow books, and keep an eye on due dates and fines.</p>
            </div>
            <div className="rounded-card bg-white/5 p-5">
              <IconUsers className="h-6 w-6 text-orange" />
              <h3 className="mt-3 text-[15px] font-bold text-white">Lecturers &amp; Staff</h3>
              <p className="mt-1.5 text-[13px]">Reserve course materials and manage reading lists with ease.</p>
            </div>
            <div className="rounded-card bg-white/5 p-5">
              <IconClockBook className="h-6 w-6 text-orange" />
              <h3 className="mt-3 text-[15px] font-bold text-white">Librarians</h3>
              <p className="mt-1.5 text-[13px]">Manage the catalog, members and fines from one dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
          <div className="mb-3 flex justify-center gap-1.5 text-emerald-600">
            <IconCheck className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold sm:text-[28px]">Ready to get your library card, digitally?</h2>
          <p className="mt-2 text-[13.5px] text-slate-500">It only takes a minute to create your account.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button className="w-full px-6 py-3 text-[15px] sm:w-auto">Create your account</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-5 py-6 text-center text-[12.5px] text-slate-500 sm:px-8">
        © 2026 University Library Management System. All rights reserved.
      </footer>
    </div>
  );
}
