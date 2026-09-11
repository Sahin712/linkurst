/**
 * Transactional email for the Listicle Finder, via Resend. Two messages:
 *  - report-ready: sent to the visitor when their report finishes.
 *  - placement request: sent to Linkurst when a visitor asks for placement.
 *
 * When RESEND_API_KEY isn't set, emails are logged to the console so the local
 * flow works without an account. The "from" address must be on a Resend-verified
 * domain in production (set LISTICLE_FROM_EMAIL once linkurst.com is verified).
 */

import { Resend } from "resend";
import { siteConfig } from "@/lib/site";

export function hasResend(): boolean {
  return !!process.env.RESEND_API_KEY;
}

// resend.dev is Resend's shared sender — deliverable only to the account owner.
// Swap to a verified linkurst.com address via env for production sends.
const FROM = process.env.LISTICLE_FROM_EMAIL || "Linkurst <onboarding@resend.dev>";
const TO_LINKURST = process.env.LISTICLE_NOTIFY_EMAIL || siteConfig.email;

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    siteConfig.url ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

let client: Resend | null = null;
function resend(): Resend {
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] || c,
  );
}

const COLORS = { coral: "#E8553A", charcoal: "#1C1C1E", gray: "#8A8A8E", ivory: "#F7F4EF" };

type ReportReady = {
  to: string;
  keyword: string;
  reportUrl: string;
  totals: { listicles: number; gaps: number; avgDa: number | null };
};

export async function sendReportReadyEmail(m: ReportReady): Promise<void> {
  const subject = `Your listicle report for "${m.keyword}" is ready`;
  const html = `
  <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:${COLORS.ivory};padding:32px 0;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #ECE7DF;border-radius:16px;overflow:hidden;">
      <div style="padding:28px 32px 8px;">
        <p style="margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${COLORS.coral};font-weight:600;">Linkurst · Listicle Finder</p>
        <h1 style="margin:10px 0 0;font-size:22px;line-height:1.25;color:${COLORS.charcoal};">Your report for &ldquo;${esc(m.keyword)}&rdquo; is ready</h1>
      </div>
      <div style="padding:16px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="text-align:center;border:1px solid #ECE7DF;border-radius:12px;">
          <tr>
            <td style="padding:16px;border-right:1px solid #ECE7DF;">
              <div style="font-size:24px;font-weight:700;color:${COLORS.charcoal};">${m.totals.listicles}</div>
              <div style="font-size:11px;color:${COLORS.gray};text-transform:uppercase;letter-spacing:.08em;">Listicles</div>
            </td>
            <td style="padding:16px;border-right:1px solid #ECE7DF;">
              <div style="font-size:24px;font-weight:700;color:${COLORS.coral};">${m.totals.gaps}</div>
              <div style="font-size:11px;color:${COLORS.gray};text-transform:uppercase;letter-spacing:.08em;">Placement gaps</div>
            </td>
            <td style="padding:16px;">
              <div style="font-size:24px;font-weight:700;color:${COLORS.charcoal};">${m.totals.avgDa ?? "—"}</div>
              <div style="font-size:11px;color:${COLORS.gray};text-transform:uppercase;letter-spacing:.08em;">Avg DR</div>
            </td>
          </tr>
        </table>
      </div>
      <div style="padding:8px 32px 32px;">
        <a href="${m.reportUrl}" style="display:block;text-align:center;background:${COLORS.coral};color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 20px;border-radius:10px;">View your report &rarr;</a>
        <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:${COLORS.gray};">This link opens your full report — every listicle scored by authority, freshness dates, and the placement gaps where competitors rank and you don&rsquo;t. You can export it to Excel from there.</p>
      </div>
    </div>
    <p style="max-width:520px;margin:16px auto 0;text-align:center;font-size:11px;color:${COLORS.gray};">Linkurst · organic visibility for SaaS &amp; B2B</p>
  </div>`;

  if (!hasResend()) {
    console.info(`[email:dev] report-ready → ${m.to}\n  subject: ${subject}\n  report: ${m.reportUrl}`);
    return;
  }
  await resend().emails.send({ from: FROM, to: m.to, subject, html });
}

type PlacementRequest = {
  name: string;
  email: string;
  company?: string;
  message?: string;
  keyword?: string;
  listicles: { title: string; url: string }[];
};

export async function sendPlacementEmail(m: PlacementRequest): Promise<void> {
  const subject = `Placement request from ${m.name}${m.company ? ` (${m.company})` : ""}`;
  const list = m.listicles.length
    ? m.listicles
        .map((l) => `<li style="margin:4px 0;"><a href="${esc(l.url)}" style="color:${COLORS.coral};">${esc(l.title)}</a></li>`)
        .join("")
    : "<li style='color:#8A8A8E;'>No specific listicles selected.</li>";

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${COLORS.charcoal};max-width:560px;margin:0 auto;">
    <h2 style="font-size:18px;">New placement request</h2>
    <p style="margin:4px 0;"><strong>Name:</strong> ${esc(m.name)}</p>
    <p style="margin:4px 0;"><strong>Email:</strong> ${esc(m.email)}</p>
    ${m.company ? `<p style="margin:4px 0;"><strong>Company:</strong> ${esc(m.company)}</p>` : ""}
    ${m.keyword ? `<p style="margin:4px 0;"><strong>Keyword:</strong> ${esc(m.keyword)}</p>` : ""}
    ${m.message ? `<p style="margin:12px 0;"><strong>Message:</strong><br>${esc(m.message)}</p>` : ""}
    <p style="margin:12px 0 4px;"><strong>Requested listicles:</strong></p>
    <ul style="padding-left:18px;margin:0;">${list}</ul>
  </div>`;

  if (!hasResend()) {
    console.info(
      `[email:dev] placement request → ${TO_LINKURST}\n  from: ${m.name} <${m.email}>${m.company ? ` @ ${m.company}` : ""}\n  keyword: ${m.keyword ?? "—"}\n  listicles: ${m.listicles.map((l) => l.title).join("; ") || "none"}`,
    );
    return;
  }
  await resend().emails.send({
    from: FROM,
    to: TO_LINKURST,
    replyTo: m.email,
    subject,
    html,
  });
}

type PlacementConfirmation = {
  to: string;
  name: string;
  website?: string;
  keyword?: string;
  industry?: string;
  location?: string;
  reportUrl?: string;
  listicles: { title: string; url: string }[];
};

/** Confirmation sent to the visitor who submitted a placement request. */
export async function sendPlacementConfirmationEmail(
  m: PlacementConfirmation,
): Promise<void> {
  const subject = "Your placement request has been received";

  const summaryRow = (label: string, value: string) =>
    `<tr>
      <td style="padding:4px 0;color:${COLORS.gray};font-size:13px;width:120px;vertical-align:top;">${label}</td>
      <td style="padding:4px 0;color:${COLORS.charcoal};font-size:13px;font-weight:600;">${value}</td>
    </tr>`;

  const summary = [
    m.website ? summaryRow("Website", esc(m.website)) : "",
    m.keyword ? summaryRow("Keyword", esc(m.keyword)) : "",
    m.industry ? summaryRow("Industry", esc(m.industry)) : "",
    m.location ? summaryRow("Location", esc(m.location)) : "",
  ].join("");

  const list = m.listicles.length
    ? m.listicles
        .map(
          (l) =>
            `<li style="margin:6px 0;"><a href="${esc(l.url)}" style="color:${COLORS.coral};text-decoration:none;">${esc(l.title)}</a></li>`,
        )
        .join("")
    : `<li style="color:${COLORS.gray};">You didn't select specific listicles — we'll recommend the best targets.</li>`;

  const firstName = esc(m.name.split(" ")[0] || m.name);

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:${COLORS.ivory};padding:32px 0;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #ECE7DF;border-radius:16px;overflow:hidden;">
      <div style="padding:28px 32px 4px;">
        <p style="margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${COLORS.coral};font-weight:600;">Linkurst · Listicle Finder</p>
        <h1 style="margin:10px 0 0;font-size:22px;line-height:1.3;color:${COLORS.charcoal};">Your placement request has been received</h1>
      </div>
      <div style="padding:12px 32px 4px;color:${COLORS.charcoal};font-size:15px;line-height:1.6;">
        <p style="margin:8px 0;">Hi ${firstName},</p>
        <p style="margin:8px 0;">Thanks for your submission. We've received your placement request and our team is reviewing the listicles you selected. We'll be in touch about getting your brand featured.</p>
      </div>
      ${
        summary
          ? `<div style="padding:12px 32px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${COLORS.charcoal};text-transform:uppercase;letter-spacing:.06em;">Request summary</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">${summary}</table>
      </div>`
          : ""
      }
      <div style="padding:8px 32px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${COLORS.charcoal};text-transform:uppercase;letter-spacing:.06em;">Selected listicles</p>
        <ul style="padding-left:18px;margin:0;font-size:14px;">${list}</ul>
      </div>
      ${
        m.reportUrl
          ? `<div style="padding:12px 32px 4px;">
        <p style="margin:0 0 8px;font-size:14px;color:${COLORS.charcoal};">You can view your full research report here:</p>
        <a href="${esc(m.reportUrl)}" style="display:inline-block;background:${COLORS.coral};color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 18px;border-radius:9px;">View your report &rarr;</a>
      </div>`
          : ""
      }
      <div style="padding:16px 32px 28px;color:${COLORS.gray};font-size:13px;line-height:1.6;">
        <p style="margin:8px 0;">Need to update something? Just reply to this email.</p>
        <p style="margin:14px 0 0;color:${COLORS.charcoal};">Best regards,<br>The Linkurst Team</p>
        <p style="margin:4px 0 0;"><a href="${siteUrl()}" style="color:${COLORS.coral};text-decoration:none;">linkurst.com</a></p>
      </div>
    </div>
  </div>`;

  if (!hasResend()) {
    console.info(
      `[email:dev] placement confirmation → ${m.to}\n  name: ${m.name}\n  keyword: ${m.keyword ?? "—"} | website: ${m.website ?? "—"}\n  report: ${m.reportUrl ?? "—"}\n  listicles: ${m.listicles.map((l) => l.title).join("; ") || "none"}`,
    );
    return;
  }
  await resend().emails.send({
    from: FROM,
    to: m.to,
    replyTo: TO_LINKURST,
    subject,
    html,
  });
}
