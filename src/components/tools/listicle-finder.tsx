"use client";

import { useState } from "react";
import { Search, Globe, MapPin, Briefcase, Users, X, Loader2, Mail, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LOCATIONS = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "India",
  "Germany",
  "France",
];

type Field = {
  keyword: string;
  website: string;
  competitors: string;
  location: string;
  industry: string;
};

export function ListicleFinder() {
  const [f, setF] = useState<Field>({
    keyword: "",
    website: "",
    competitors: "",
    location: "United States",
    industry: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  const set = (k: keyof Field, v: string) => setF((s) => ({ ...s, [k]: v }));

  function openModal(e: React.FormEvent) {
    e.preventDefault();
    if (!f.keyword.trim()) return;
    setError(null);
    setStatus("idle");
    setModalOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/listicle/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: f.keyword,
          website: f.website,
          competitors: f.competitors,
          location: f.location,
          industry: f.industry,
          email,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setReportUrl(typeof data.reportUrl === "string" ? data.reportUrl : null);
        setStatus("sent");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  const inputCls =
    "min-h-[52px] w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted/70 hover:border-fog/40 focus:border-coral focus-visible:ring-4 focus-visible:ring-coral/15";

  return (
    <div className="mt-10">
      <form
        onSubmit={openModal}
        className="rounded-[var(--radius-xl)] border border-coral/20 bg-surface p-6 shadow-[0_24px_70px_-24px_rgba(232,85,58,0.3)] sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field icon={Search} label="Keyword" required>
            <input
              value={f.keyword}
              onChange={(e) => set("keyword", e.target.value)}
              placeholder="sales engagement platform"
              className={inputCls}
              required
            />
          </Field>
          <Field icon={Globe} label="Your website">
            <input
              value={f.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="yourbrand.com"
              className={inputCls}
            />
          </Field>
          <Field icon={Users} label="Competitors">
            <input
              value={f.competitors}
              onChange={(e) => set("competitors", e.target.value)}
              placeholder="apollo.io, lemlist.com"
              className={inputCls}
            />
          </Field>
          <Field icon={MapPin} label="Location">
            <select
              value={f.location}
              onChange={(e) => set("location", e.target.value)}
              className={cn(inputCls, "cursor-pointer appearance-none pr-10")}
            >
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
          </Field>
          <Field icon={Briefcase} label="Industry" full>
            <input
              value={f.industry}
              onChange={(e) => set("industry", e.target.value)}
              placeholder="B2B SaaS"
              className={inputCls}
            />
          </Field>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3">
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto sm:min-w-[220px]"
            {...(!f.keyword.trim() ? { disabled: true } : {})}
          >
            <Search size={18} />
            Find listicles
          </Button>
          <p className="font-[family-name:var(--font-mono)] text-[11px] text-muted">
            No sign-up · Report sent to your inbox
          </p>
        </div>
      </form>

      {/* email modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setModalOpen(false)}
            className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-7 text-center shadow-[var(--shadow-panel)]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-foreground/[0.04] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              <X size={18} />
            </button>

            {status === "sent" ? (
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-coral-wash text-coral-600">
                  <Mail size={22} />
                </span>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">
                  Check your inbox
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-fog">
                  We&rsquo;re analyzing listicles for{" "}
                  <span className="font-semibold text-foreground">{f.keyword}</span>. Your report
                  will arrive at <span className="font-semibold text-foreground">{email}</span> in a
                  few minutes.
                </p>
                {reportUrl && (
                  <Button href={reportUrl} size="lg" className="mt-6 w-full">
                    Watch it build
                    <ArrowRight size={18} />
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setStatus("idle");
                  }}
                  className="mt-3 text-[13px] text-fog underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-coral-wash text-coral-600">
                  <Search size={22} />
                </span>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">
                  This takes a few minutes.
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-fog">
                  Leave your email and we&rsquo;ll send your listicle report the moment it&rsquo;s
                  ready.
                </p>
                <div className="mt-5 text-left">
                  <label
                    htmlFor="lf-email"
                    className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-muted"
                  >
                    Work email
                  </label>
                  <input
                    id="lf-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className={cn(inputCls, "mt-2")}
                  />
                </div>
                {error && <p className="mt-3 text-[13px] text-coral-600">{error}</p>}
                <Button
                  type="submit"
                  size="lg"
                  className="mt-5 w-full"
                  {...(status === "sending" || !email.trim() ? { disabled: true } : {})}
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send results to email
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>
                <p className="mt-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-muted">
                  No spam · Just your report
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  required,
  full,
  children,
}: {
  icon: React.ElementType;
  label: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative", full && "sm:col-span-2")}>
      {children}
      <label className="pointer-events-none absolute -top-2 left-3 z-10 rounded bg-surface px-1.5 text-[11px] font-medium text-fog">
        {label}
        {required && <span className="text-coral-600"> *</span>}
      </label>
      <Icon
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
