import { NextResponse } from "next/server";
import { reviseSchema } from "@/lib/validation/schemas";
import { buildRevisePrompt } from "@/lib/prompts/revise-prompt";
import { getAIProvider, AIError } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/revise
 * Body: { letter, instruction }  →  { letter: string }
 *
 * Mirrors /api/generate but uses the revision prompt so the model edits the
 * existing letter in place rather than writing a new one. Slightly lower
 * temperature for more faithful, targeted edits.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = reviseSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid request.";
    return NextResponse.json({ error: first }, { status: 422 });
  }

  try {
    const { system, prompt } = buildRevisePrompt(parsed.data);
    const letter = await getAIProvider().generateText({
      system,
      prompt,
      temperature: 0.4,
    });
    return NextResponse.json({ letter });
  } catch (err) {
    if (err instanceof AIError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[/api/revise] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong revising your letter." },
      { status: 500 },
    );
  }
}
