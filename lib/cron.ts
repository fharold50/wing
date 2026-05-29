/**
 * Cron auth — Vercel Cron sends `Authorization: Bearer $CRON_SECRET`.
 * We check it on every cron route. In dev (no secret set) we let it through.
 *
 * If someone in the team rotates CRON_SECRET, they only need to update the
 * Vercel env var; the next cron firing will use the new one.
 */
export function isAuthorizedCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const got = req.headers.get("authorization");
  return got === `Bearer ${secret}`;
}
