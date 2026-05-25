/**
 * Anti-Hookup AI Shield.
 *
 * Scans text for romantic/sexual/dating intent. Returns:
 *   { pass: true } when safe
 *   { pass: false, reason: "..." } when violating
 *
 * Strategy:
 *   1. Cheap keyword/regex pre-filter — catches the obvious stuff with zero cost.
 *   2. If ANTHROPIC_API_KEY is set, send the text to Claude for nuanced classification.
 *   3. If no key, the keyword filter is the only gate (still better than nothing).
 *
 * All calls are server-side only.
 */

const HARD_BLOCKLIST = [
  /\b(hookup|hook[\s-]?up|smash|netflix and chill)\b/i,
  /\b(send (?:me )?(?:nudes|pics|noods))\b/i,
  /\b(daddy|baby|babe|honey|sexy|hot stuff)\b/i,
  /\b(dtf|fwb|nsa)\b/i,
];

const SOFT_BLOCKLIST = [
  /\b(date(?: me| with you)?|dating|romance|romantic)\b/i,
  /\b(kiss|hug|cuddle|make out)\b/i,
  /\b(my (?:place|hotel|room|bed)|your (?:place|hotel|room|bed))\b/i,
  /\b(single|relationship status|partner|spouse)\b/i,
];

export type ModerationResult = { pass: boolean; reason?: string };

function keywordCheck(text: string): ModerationResult {
  const lower = text.toLowerCase();
  for (const re of HARD_BLOCKLIST) {
    if (re.test(lower)) return { pass: false, reason: "Romantic/sexual content not allowed on Wing." };
  }
  let softHits = 0;
  for (const re of SOFT_BLOCKLIST) if (re.test(lower)) softHits++;
  if (softHits >= 2) return { pass: false, reason: "Multiple romantic/dating signals detected." };
  return { pass: true };
}

async function anthropicCheck(text: string): Promise<ModerationResult | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 50,
        system:
          "You are the moderation layer for Wing — a non-dating social companion app. " +
          "Classify the user message as 'pass' if it is a normal platonic message about activities, " +
          "logistics, interests, or friendship. Classify as 'block' if it expresses romantic, sexual, " +
          "or dating intent (asking out, flirting, sexual language, requesting private meetings framed romantically). " +
          "Respond with ONLY one word: 'pass' or 'block'.",
        messages: [{ role: "user", content: text }],
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const out = String(json?.content?.[0]?.text ?? "").trim().toLowerCase();
    if (out.startsWith("block")) return { pass: false, reason: "AI moderation flagged this as romantic/dating intent." };
    return { pass: true };
  } catch {
    return null;
  }
}

export async function moderateText(text: string): Promise<ModerationResult> {
  const kw = keywordCheck(text);
  if (!kw.pass) return kw;
  const ai = await anthropicCheck(text);
  return ai ?? kw;
}
