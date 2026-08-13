import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/apiAuth";

// POST /api/ai-librarian  { message }
//
// Lightweight retrieval-augmented approach: pull books matching keywords
// from the user's message out of the real catalog, then hand that short
// list to an AI model as grounding context so it can answer naturally
// ("find me networking books", "recommend something like Clean Code",
// "summarize what we have on databases") without inventing titles that
// aren't actually in the library.
//
// Uses Google's Gemini API (free tier, no card required) through its
// OpenAI-compatible endpoint, so the same `openai` SDK works unchanged —
// just a different base URL, API key, and model name from plain OpenAI.
// If GEMINI_API_KEY isn't set, this still works — it falls back to
// returning the matching catalog results directly, so the feature never
// hard-fails just because a key hasn't been configured yet.
export async function POST(req: NextRequest) {
  const { unauthorized } = await requireAuth();
  if (unauthorized) return unauthorized;

  const { message } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ message: "A message is required" }, { status: 400 });
  }

  const keywords = message
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 6);

  let matches: Prisma.BookGetPayload<{ include: { category: true } }>[] = [];
  try {
    matches = await prisma.book.findMany({
      where: keywords.length
        ? {
            OR: keywords.flatMap(k => [
              { title: { contains: k, mode: "insensitive" as const } },
              { author: { contains: k, mode: "insensitive" as const } },
              { category: { name: { contains: k, mode: "insensitive" as const } } }
            ])
          }
        : {},
      include: { category: true },
      take: 8
    });
  } catch (err) {
    console.error(err);
  }

  const catalogContext = matches.length
    ? matches.map(b => `- "${b.title}" by ${b.author} (${b.category?.name ?? "Uncategorized"}), ${b.availableCopies} available`).join("\n")
    : "No close matches found in the catalog for these keywords.";

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({
      reply: matches.length
        ? `AI Librarian isn't fully configured yet (no GEMINI_API_KEY set), but here's what matches directly in the catalog:\n\n${catalogContext}`
        : "AI Librarian isn't fully configured yet (no GEMINI_API_KEY set), and no catalog matches were found for that either. Add a free GEMINI_API_KEY from Google AI Studio to enable full natural-language answers.",
      matches
    });
  }

  try {
    const { default: OpenAI } = await import("openai");
    const ai = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });

    const messages = [
      {
        role: "system" as const,
        content:
          "You are the AI Librarian for a university library system. Answer helpfully and concisely. " +
          "Only recommend or reference books that appear in the catalog excerpt provided — never invent " +
          "titles, authors, or ISBNs that aren't listed. If nothing in the excerpt fits, say so plainly " +
          "and suggest the person browse the full catalog instead."
      },
      {
        role: "user" as const,
        content: `Catalog excerpt (from a keyword search on the question below):\n${catalogContext}\n\nQuestion: ${message}`
      }
    ];

    // Gemini's free tier occasionally returns a transient 503 ("model
    // overloaded") — worth one quick retry before falling back, since a
    // second attempt a moment later usually goes through fine.
    let completion;
    try {
      completion = await ai.chat.completions.create({ model: "gemini-flash-latest", messages });
    } catch (firstErr) {
      const status = (firstErr as { status?: number })?.status;
      if (status !== 503) throw firstErr;
      await new Promise(r => setTimeout(r, 800));
      completion = await ai.chat.completions.create({ model: "gemini-flash-latest", messages });
    }

    const reply = completion.choices[0]?.message?.content ?? "I couldn't generate a response — please try again.";
    return NextResponse.json({ reply, matches });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      reply: `The AI service is a little busy right now, but here's what matches directly in the catalog:\n\n${catalogContext}`,
      matches
    });
  }
}
