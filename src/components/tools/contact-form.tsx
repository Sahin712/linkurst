"use client";

import { useState } from "react";
import { Loader2, ArrowRight, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const inputCls =
  "min-h-12 w-full rounded-xl border border-border bg-background px-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted focus:border-coral/50 focus-visible:ring-2 focus-visible:ring-coral/30";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          company: form.get("company"),
          message: form.get("message"),
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("sent");
        track("contact_message_sent");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-8 text-center shadow-[var(--shadow-panel)]">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-coral-wash text-coral-600">
          <Check size={24} />
        </span>
        <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">Message sent</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-fog">
          Thanks for reaching out — we&rsquo;ll reply within one business day. Keep an eye on your
          inbox.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-panel)] sm:p-7"
    >
      <div className="mb-5 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-coral-wash text-coral-600">
          <Mail size={17} />
        </span>
        <div>
          <p className="text-[15px] font-bold tracking-tight text-foreground">Send a message</p>
          <p className="text-[12.5px] text-muted">We reply within 1 business day.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="name" placeholder="Your name" required className={inputCls} />
          <input name="email" type="email" placeholder="Work email" required className={inputCls} />
        </div>
        <input name="company" placeholder="Company (optional)" className={inputCls} />
        <textarea
          name="message"
          rows={5}
          required
          placeholder="What can we help you get found for?"
          className={cn(inputCls, "resize-y py-3 leading-relaxed")}
        />
      </div>

      {error && <p className="mt-3 text-[13px] text-coral-600">{error}</p>}

      <Button type="submit" size="lg" className="mt-5 w-full" {...(status === "sending" ? { disabled: true } : {})}>
        {status === "sending" ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Sending&hellip;
          </>
        ) : (
          <>
            Send message
            <ArrowRight size={18} />
          </>
        )}
      </Button>
      <p className="mt-3 text-center text-[11.5px] text-muted">
        No spam. Your details stay between us.
      </p>
    </form>
  );
}
