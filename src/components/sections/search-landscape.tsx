import { Search, Sparkles, MessageSquare, ArrowUp } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SearchLandscape() {
  return (
    <Section id="channels" spacing="lg" className="bg-surface">
      <SectionHeader
        eyebrow="The search landscape is changing"
        title="Your customers don't search in one place anymore."
        description="Google remains critical, but discovery is expanding across AI answers, Reddit discussions, communities, publications, and conversational search. Your organic strategy needs to account for all of them."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <ChannelCard
          icon={Search}
          name="Google"
          headline="Capture existing search demand."
          body="Build the technical foundation, content strategy, and authority needed to compete for valuable organic search demand."
          visual={<SerpVisual />}
        />
        <ChannelCard
          icon={Sparkles}
          name="AI Search"
          headline="Become part of the answer."
          body="Build visibility across AI-generated answers through AEO, GEO, entity optimization, content, and citation strategies."
          visual={<AiAnswerVisual />}
        />
        <ChannelCard
          icon={MessageSquare}
          name="Reddit"
          headline="Show up where conversations happen."
          body="Understand the communities, questions, and conversations influencing your audience, then identify meaningful opportunities for visibility."
          visual={<RedditVisual />}
        />
      </div>
    </Section>
  );
}

function ChannelCard({
  icon: Icon,
  name,
  headline,
  body,
  visual,
}: {
  icon: React.ElementType;
  name: string;
  headline: string;
  body: string;
  visual: React.ReactNode;
}) {
  return (
    <Reveal className="flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-background/50 shadow-[var(--shadow-card)]">
      <div className="border-b border-border bg-background/40 p-4">{visual}</div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-coral-100 text-coral-600">
            <Icon size={16} />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {name}
          </span>
        </div>
        <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
          {headline}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-fog">{body}</p>
      </div>
    </Reveal>
  );
}

/* --- Minimal illustrative interface mockups --- */

function MockBar({ className }: { className?: string }) {
  return <div className={cn("h-2 rounded-full bg-gray/25", className)} />;
}

function SerpVisual() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
        <Search size={12} className="text-gray" />
        <MockBar className="w-24" />
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-2 w-1/3 rounded-full bg-coral/70" />
          <MockBar className="w-5/6" />
          <MockBar className="w-2/3" />
        </div>
      ))}
    </div>
  );
}

function AiAnswerVisual() {
  return (
    <div className="space-y-2 rounded-lg bg-surface p-3">
      <div className="flex items-center gap-1.5 text-coral-600">
        <Sparkles size={12} />
        <span className="text-[0.65rem] font-semibold">AI answer</span>
      </div>
      <MockBar className="w-full" />
      <div className="flex items-center gap-1">
        <MockBar className="w-1/3" />
        <span className="rounded bg-coral-100 px-1.5 py-0.5 text-[0.6rem] font-semibold text-coral-600">
          Linkurst
        </span>
        <MockBar className="w-1/4" />
      </div>
      <MockBar className="w-4/5" />
    </div>
  );
}

function RedditVisual() {
  return (
    <div className="space-y-2.5">
      {[0, 1].map((i) => (
        <div key={i} className="flex gap-2 rounded-lg bg-surface p-2.5">
          <div className="flex flex-col items-center gap-0.5 text-gray">
            <ArrowUp size={11} className={i === 0 ? "text-coral-600" : ""} />
            <span className="text-[0.6rem] font-semibold">
              {i === 0 ? "128" : "54"}
            </span>
          </div>
          <div className="flex-1 space-y-1.5 pt-0.5">
            <MockBar className="w-3/4" />
            <MockBar className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
