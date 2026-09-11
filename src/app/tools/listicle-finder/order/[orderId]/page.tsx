import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getOrder } from "@/lib/listicle/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Selected Listicles",
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    return (
      <section className="py-12 sm:py-16">
        <Container size="default">
          <div className="mx-auto max-w-lg rounded-[var(--radius-xl)] border border-border bg-surface p-8 text-center shadow-[var(--shadow-panel)] sm:p-10">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-coral-wash text-coral-600">
              <AlertCircle size={24} />
            </span>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
              Request not found
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-fog">
              This link is invalid or has expired. Placement requests are kept for 30 days.
            </p>
            <Button href="/tools/listicle-finder" size="lg" className="mt-6">
              <ArrowLeft size={18} />
              Back to Listicle Finder
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  const drLabel = order.daSource === "ahrefs" ? "DR" : "DA";
  const meta = [
    { label: "Website", value: order.meta.website },
    { label: "Keyword", value: order.meta.keyword },
    { label: "Industry", value: order.meta.industry },
    { label: "Location", value: order.meta.location },
  ].filter((r) => r.value);

  return (
    <section className="py-12 sm:py-16">
      <Container size="default">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* header */}
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-panel)] sm:p-8">
            <p className="eyebrow-mono text-coral">Placement request received</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Selected listicles
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-fog">
              {order.contact.name.split(" ")[0]}, here are the{" "}
              <span className="font-semibold text-foreground">{order.listicles.length}</span>{" "}
              listicle{order.listicles.length === 1 ? "" : "s"} you selected for placement. Our team
              is reviewing them.
            </p>

            {meta.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 font-[family-name:var(--font-mono)] text-[11px] text-muted">
                {meta.map((r) => (
                  <span key={r.label} className="rounded-full border border-border px-2.5 py-1">
                    {r.label}: {r.value}
                  </span>
                ))}
              </div>
            )}

            {order.reportUrl && (
              <a
                href={order.reportUrl}
                className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-coral-600 hover:text-coral"
              >
                <ExternalLink size={14} />
                View full research report
              </a>
            )}
          </div>

          {/* table */}
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
                    <th className="px-4 py-3 font-medium">Listicle</th>
                    <th className="px-3 py-3 font-medium">{drLabel}</th>
                    <th className="px-3 py-3 font-medium">PA</th>
                    <th className="px-3 py-3 font-medium">Updated</th>
                    <th className="px-4 py-3 font-medium">Mentioned</th>
                  </tr>
                </thead>
                <tbody>
                  {order.listicles.map((l) => (
                    <tr key={l.url} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3">
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-start gap-1 font-semibold text-foreground hover:text-coral-600"
                        >
                          {l.title}
                          <ArrowUpRight size={13} className="mt-0.5 shrink-0 text-muted" />
                        </a>
                        {l.domain && (
                          <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[10.5px] text-muted">
                            {l.domain}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3 align-top tabular-nums text-fog">{l.da ?? "—"}</td>
                      <td className="px-3 py-3 align-top tabular-nums text-fog">{l.pa ?? "—"}</td>
                      <td className="px-3 py-3 align-top font-[family-name:var(--font-mono)] text-[11px] text-muted">
                        {l.updated ?? "—"}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {l.mentionsBrand ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-coral-wash px-2 py-0.5 text-[11px] font-semibold text-coral-600">
                            <Check size={11} />
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted">
                            No
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="px-1 text-[12px] leading-relaxed text-muted">
            Need to change your selection? Reply to your confirmation email and we&rsquo;ll update it.
          </p>

          <div className="pt-2">
            <Link
              href="/tools/listicle-finder"
              className="inline-flex items-center gap-1.5 text-[13px] text-fog hover:text-foreground"
            >
              <ArrowLeft size={15} />
              Back to Listicle Finder
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
