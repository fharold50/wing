/**
 * Resend wrapper. Server-only. Never import from a client component.
 *
 * No marketing fluff in the templates — they read like a friend wrote them,
 * because that's what builds trust on a safety product.
 */

const RESEND_URL = "https://api.resend.com/emails";
const FROM = "Wing <onboarding@resend.dev>"; // swap to noreply@<verified-domain> once DNS lands

type SendArgs = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(args: SendArgs): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not configured" };

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [args.to],
        subject: args.subject,
        text: args.text,
        html: args.html,
      }),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, error: json?.message ?? `HTTP ${res.status}` };
    return { ok: true, id: json.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

/** Wraps a plain-text safety message in a minimal Wing-branded HTML shell. */
export function safetyEmailHtml(textBody: string): string {
  return `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f7f3ec;padding:48px 0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
<tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" width="520" style="background:#fff;border-radius:14px;border:1px solid #e8e0d2;padding:36px;">
<tr><td>
<div style="font-family:Georgia,serif;font-size:24px;font-style:italic;color:#1a1815;margin-bottom:24px;">Wing</div>
<p style="color:#1a1815;line-height:1.7;margin:0 0 24px;font-size:15px;">${textBody.replace(/\n/g, "<br>")}</p>
<p style="color:#7a7368;font-size:11px;line-height:1.6;margin:0;">Wing — the social companion app. Not a dating app. <a href="https://wing-gold.vercel.app" style="color:#b54f2c;text-decoration:none;">wing-gold.vercel.app</a></p>
</td></tr></table></td></tr></table>`;
}
