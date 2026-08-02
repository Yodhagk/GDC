/**
 * Sends mail through Microsoft Graph instead of SMTP.
 *
 * Uses the OAuth2 client-credentials grant (app-only auth) to get a token,
 * then calls POST /users/{mailbox}/sendMail as that mailbox. Requires the
 * Azure app registration to have the *Application* permission Mail.Send
 * with admin consent — this is separate from the Delegated permissions
 * used by the "Sign in with Microsoft" login provider in lib/auth.ts.
 *
 * Required env vars:
 *   AZURE_AD_CLIENT_ID      — same app registration used for login
 *   AZURE_AD_CLIENT_SECRET  — same app registration used for login
 *   AZURE_MAIL_TENANT_ID    — the real tenant ID (a GUID, or the
 *                             *.onmicrosoft.com domain) — NOT "common".
 *                             Client-credentials tokens are always scoped
 *                             to one specific tenant.
 *   SMTP_USER               — reused as the sending mailbox address
 *                             (e.g. priti@goldendollarconsulting.com)
 */

const TENANT_ID = process.env.AZURE_MAIL_TENANT_ID;
const CLIENT_ID = process.env.AZURE_AD_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_AD_CLIENT_SECRET;
const SENDER = process.env.SMTP_USER;

export function graphMailConfigured(): boolean {
  return !!(TENANT_ID && CLIENT_ID && CLIENT_SECRET && SENDER);
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Reuse the token until shortly before it expires (tokens are valid ~1hr).
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const res = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      // .default = "whatever application permissions were admin-consented for this app"
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  });

  if (!res.ok) {
    throw new Error(`Graph token request failed (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

export async function sendGraphMail(opts: { to: string; subject: string; html: string }) {
  const token = await getAccessToken();

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(SENDER!)}/sendMail`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          subject: opts.subject,
          body: { contentType: 'HTML', content: opts.html },
          toRecipients: [{ emailAddress: { address: opts.to } }],
        },
        saveToSentItems: 'false',
      }),
    }
  );

  // Success is 202 Accepted with an empty body — nothing to parse.
  if (!res.ok) {
    throw new Error(`Graph sendMail failed (${res.status}): ${await res.text()}`);
  }
}
