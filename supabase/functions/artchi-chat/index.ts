// supabase/functions/artchi-chat/index.ts
//
// Secure proxy between Artchi's chat UI and the Claude API. The Anthropic
// API key lives ONLY here, as a Supabase secret (ANTHROPIC_API_KEY) — it
// never touches client-side code, so it can't be copied out of the
// browser's dev tools.
//
// SCOPE: Artchi only helps with the student's current lesson/task (art
// technique questions, encouragement, hints). This keeps cost predictable
// and keeps her from turning into a general-purpose chatbot for a product
// that includes younger students.
//
// RATE LIMIT: each student gets a capped number of messages per rolling
// 24 hours (see DAILY_MESSAGE_LIMIT below). Once hit, Artchi replies with
// a friendly "come back tomorrow" message WITHOUT calling the paid API —
// this is what actually protects the budget, not just the model choice.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const DAILY_MESSAGE_LIMIT = 40; // per student, per rolling 24h — generous for real use, cheap even maxed out
const MODEL = "claude-haiku-4-5-20251001";
const MAX_REPLY_TOKENS = 300; // keeps replies short — better UX in a small chat bubble, and controls cost

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ARTCHI_SYSTEM_PROMPT = `You are Artchi, a warm, encouraging art companion inside FEI TeamArt's Art GPS learning platform. You help students (ages roughly 8-18) while they work through a specific art lesson.

STRICT SCOPE — you must stay within this:
- Only discuss the CURRENT lesson/task described below. Give hints, technique tips, and encouragement — never do the work for them or give a complete finished answer.
- If asked about anything outside art, this lesson, or the platform (personal topics, other subjects, unrelated chit-chat), gently redirect: "That's outside what I can help with here — let's get back to your art! What are you working on?"
- Never ask for or store personal information (full name, address, phone, socials, etc.).
- Keep replies SHORT — 1-3 sentences, friendly and age-appropriate. No long lectures.
- If a student seems frustrated or stuck, be encouraging and break the hint into a smaller, more specific nudge rather than the full answer.
- You are not a substitute for their teacher — if something needs a teacher's real feedback, say so warmly and suggest they ask their teacher.`;

async function callClaude(userMessage: string, lessonContext: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_REPLY_TOKENS,
      system: `${ARTCHI_SYSTEM_PROMPT}\n\nCURRENT LESSON: ${lessonContext || "General practice"}`,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Anthropic API error:", res.status, errText);
    throw new Error("Claude API request failed");
  }

  const data = await res.json();
  const textBlock = (data.content || []).find((b: any) => b.type === "text");
  return textBlock?.text?.trim() || "Sorry, I couldn't think of a reply just now — try asking again!";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "content-type": "application/json" },
    });
  }

  try {
    const { email, message, lessonContext } = await req.json();

    if (!email || !message || typeof message !== "string" || !message.trim()) {
      return new Response(JSON.stringify({ error: "Missing email or message" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "content-type": "application/json" },
      });
    }

    if (!ANTHROPIC_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing required secrets on the Edge Function.");
      return new Response(
        JSON.stringify({ reply: "Artchi's AI brain isn't set up yet — ask your teacher to finish setup!" }),
        { status: 200, headers: { ...CORS_HEADERS, "content-type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const normalizedEmail = String(email).trim().toLowerCase();

    // ── Rate limit check — count this student's messages in the last 24h ──
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("artchi_messages")
      .select("id", { count: "exact", head: true })
      .eq("student_email", normalizedEmail)
      .gte("created_at", since);

    if (countError) {
      console.error("Rate limit check failed:", countError);
      // fail open on a read error rather than blocking every student — but log it
    } else if ((count ?? 0) >= DAILY_MESSAGE_LIMIT) {
      return new Response(
        JSON.stringify({
          reply: "I've chatted a LOT with you today! Let's pick this back up tomorrow — you've got this. ✨",
          rateLimited: true,
        }),
        { status: 200, headers: { ...CORS_HEADERS, "content-type": "application/json" } }
      );
    }

    const reply = await callClaude(message.trim(), lessonContext || "");

    // Log AFTER a successful reply, so failed calls don't count against the student's limit
    const { error: insertError } = await supabase.from("artchi_messages").insert({
      student_email: normalizedEmail,
      lesson_context: lessonContext || null,
    });
    if (insertError) {
      console.error("Failed to log Artchi message (non-fatal):", insertError);
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...CORS_HEADERS, "content-type": "application/json" },
    });
  } catch (e) {
    console.error("artchi-chat error:", e);
    return new Response(
      JSON.stringify({ reply: "Hmm, I glitched for a second! Try asking me again." }),
      { status: 200, headers: { ...CORS_HEADERS, "content-type": "application/json" } }
    );
  }
});
