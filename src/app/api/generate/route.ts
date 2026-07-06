import { NextResponse } from "next/server";
import { generatorSchema } from "@/lib/validation/schemas";
import { buildGeneratePrompt } from "@/lib/prompts/generate-prompt";
import { getAIProvider, AIError } from "@/lib/ai";

// Runs on the Node.js runtime (the Gemini SDK needs it). Never statically cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/generate
 * Body: GeneratorInput  →  { letter: string }
 *
 * The key is used server-side only, so it is never exposed to the browser.
 * We re-validate with the shared Zod schema: never trust the client.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = generatorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fill in the form correctly and try again." },
      { status: 422 },
    );
  }

  try {
    const { system, prompt } = buildGeneratePrompt(parsed.data);
    const letter = await getAIProvider().generateText({ system, prompt });
    return NextResponse.json({ letter });
  } catch (err) {
    if (err instanceof AIError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[/api/generate] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong generating your letter." },
      { status: 500 },
    );
  }
}
