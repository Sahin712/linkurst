/**
 * AEO Content Grader, a transparent, rules-based analysis of how ready a piece
 * of content is to be cited by AI search (ChatGPT, Perplexity, Gemini, AI
 * Overviews) and to rank in traditional search. Pure and deterministic: no
 * network calls, no LLM, just documented heuristics based on AEO best practice.
 */

export type CheckStatus = "pass" | "warn" | "fail";

export type Check = {
  id: string;
  label: string;
  status: CheckStatus;
  score: number;
  max: number;
  detail: string;
  tip: string;
  pillar: string;
  pillarLabel: string;
};

export type Pillar = { id: string; label: string; score: number; max: number };

export type GradeResult = {
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  summary: string;
  stats: {
    words: number;
    sentences: number;
    headings: number;
    questionHeadings: number;
    lists: number;
    links: number;
    numbers: number;
    hasSchema: boolean;
    readingMinutes: number;
  };
  pillars: Pillar[];
  checks: Check[];
  priorities: Check[];
};

const PILLAR_MAP: Record<string, { id: string; label: string }> = {
  "direct-answer": { id: "answerability", label: "Answerability" },
  "question-headings": { id: "answerability", label: "Answerability" },
  scannable: { id: "answerability", label: "Answerability" },
  headings: { id: "structure", label: "Structure" },
  readability: { id: "structure", label: "Structure" },
  depth: { id: "structure", label: "Structure" },
  specificity: { id: "authority", label: "Authority & Trust" },
  freshness: { id: "authority", label: "Authority & Trust" },
  sources: { id: "authority", label: "Authority & Trust" },
  schema: { id: "technical", label: "Technical" },
};
const PILLAR_ORDER = ["answerability", "structure", "authority", "technical"];

const QUESTION_STARTERS =
  /^(what|how|why|when|where|who|which|can|does|do|is|are|should|will|has|have)\b/i;

function stripHtml(raw: string): string {
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHeadings(raw: string): string[] {
  const headings: string[] = [];
  // HTML headings
  const htmlH = raw.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi);
  for (const m of htmlH) {
    const t = stripHtml(m[1]);
    if (t) headings.push(t);
  }
  // Markdown headings
  for (const line of raw.split(/\n/)) {
    const m = line.match(/^\s{0,3}#{1,4}\s+(.+?)\s*#*\s*$/);
    if (m) headings.push(m[1].trim());
  }
  return headings;
}

function extractParagraphs(raw: string): string[] {
  const htmlP = [...raw.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) =>
    stripHtml(m[1]),
  );
  if (htmlP.length) return htmlP.filter(Boolean);
  return stripHtml(raw)
    ? raw
        .replace(/<[^>]+>/g, "\n")
        .split(/\n{2,}|\r\n{2,}/)
        .map((p) => stripHtml(p))
        .filter((p) => p.length > 0)
    : [];
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function analyzeContent(raw: string): GradeResult | null {
  const text = stripHtml(raw);
  if (!text || text.split(/\s+/).length < 8) return null;

  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  const headings = extractHeadings(raw);
  const paragraphs = extractParagraphs(raw);
  const avgSentenceLen = wordCount / sentenceCount;

  const hasHtml = /<(h[1-6]|p|div|ul|ol|li|script|section|article)[\s>]/i.test(raw);
  const listItems =
    (raw.match(/<li[\s>]/gi) || []).length +
    raw.split(/\n/).filter((l) => /^\s{0,3}([-*+]|\d+\.)\s+/.test(l)).length;
  const links =
    (raw.match(/<a\s[^>]*href=/gi) || []).length +
    (raw.match(/\[[^\]]+\]\([^)]+\)/g) || []).length +
    (raw.match(/https?:\/\/[^\s)"']+/g) || []).length;
  const numbers = (text.match(/\b\d[\d,.%]*/g) || []).length;
  const currentYear = new Date().getFullYear();
  const years = (text.match(/\b(20\d{2})\b/g) || []).map(Number);
  const hasJsonLd = /application\/ld\+json/i.test(raw);
  const hasFaqSchema = /"@type"\s*:\s*"FAQPage"/i.test(raw);

  const questionHeadings = headings.filter(
    (h) => h.trim().endsWith("?") || QUESTION_STARTERS.test(h.trim()),
  ).length;

  const checks: Check[] = [];
  const push = (c: Omit<Check, "pillar" | "pillarLabel">) => {
    const p = PILLAR_MAP[c.id];
    checks.push({ ...c, pillar: p.id, pillarLabel: p.label });
  };

  // 1. Direct answer / TL;DR up top (15)
  {
    const lead = paragraphs[0] ? paragraphs[0].split(/\s+/).length : 0;
    const hasTldr = /\b(tl;?dr|in short|in summary|the short answer|bottom line)\b/i.test(
      text.slice(0, 600),
    );
    let status: CheckStatus, score: number, detail: string;
    if (hasTldr || (lead >= 15 && lead <= 80)) {
      status = "pass";
      score = 15;
      detail = "The opening gives a concise, extractable answer.";
    } else if (lead > 80) {
      status = "warn";
      score = 8;
      detail = `The first paragraph is ${lead} words, long for a lead answer.`;
    } else {
      status = "fail";
      score = 3;
      detail = "No concise answer near the top.";
    }
    push({
      id: "direct-answer",
      label: "Direct answer up top",
      status,
      score,
      max: 15,
      detail,
      tip: "Lead with a 2–3 sentence answer (or a TL;DR). AI models lift the first clear, self-contained answer they find.",
    });
  }

  // 2. Question-based headings (15)
  {
    let status: CheckStatus, score: number, detail: string;
    if (questionHeadings >= 2) {
      status = "pass";
      score = 15;
      detail = `${questionHeadings} headings are phrased as questions.`;
    } else if (questionHeadings === 1 || headings.length >= 3) {
      status = "warn";
      score = 8;
      detail =
        questionHeadings === 1
          ? "Only one question-style heading."
          : "Headings aren't phrased as questions.";
    } else {
      status = "fail";
      score = 2;
      detail = "No question-style headings found.";
    }
    push({
      id: "question-headings",
      label: "Question-based headings",
      status,
      score,
      max: 15,
      detail,
      tip: "Phrase subheadings the way buyers ask AI (e.g. “How does X work?”). It maps your content directly onto real prompts.",
    });
  }

  // 3. Scannable structure, lists + short paragraphs (15)
  {
    const longParas = paragraphs.filter((p) => p.split(/\s+/).length > 90).length;
    let status: CheckStatus, score: number, detail: string;
    if (listItems >= 3 && longParas === 0) {
      status = "pass";
      score = 15;
      detail = "Uses lists and keeps paragraphs tight.";
    } else if (listItems >= 1 || longParas <= 2) {
      status = "warn";
      score = 9;
      detail = listItems
        ? `${longParas} long paragraph(s) could be broken up.`
        : "No lists, dense prose is harder to extract.";
    } else {
      status = "fail";
      score = 3;
      detail = "Dense, unbroken text with no lists.";
    }
    push({
      id: "scannable",
      label: "Scannable structure",
      status,
      score,
      max: 15,
      detail,
      tip: "Break answers into short paragraphs and lists. Models quote clean, self-contained chunks far more often than walls of text.",
    });
  }

  // 4. Heading coverage (10)
  {
    let status: CheckStatus, score: number, detail: string;
    if (headings.length >= 3) {
      status = "pass";
      score = 10;
      detail = `${headings.length} subheadings give clear structure.`;
    } else if (headings.length >= 1) {
      status = "warn";
      score = 6;
      detail = `Only ${headings.length} subheading(s).`;
    } else {
      status = "fail";
      score = 1;
      detail = "No subheadings detected.";
    }
    push({
      id: "headings",
      label: "Clear heading structure",
      status,
      score,
      max: 10,
      detail,
      tip: "Use descriptive H2/H3s every few paragraphs. They define the sections an AI answer can pull from.",
    });
  }

  // 5. Specificity, data & numbers (10)
  {
    const density = (numbers / Math.max(1, wordCount)) * 100;
    let status: CheckStatus, score: number, detail: string;
    if (density >= 0.8) {
      status = "pass";
      score = 10;
      detail = `${numbers} concrete figures, good specificity.`;
    } else if (numbers >= 1) {
      status = "warn";
      score = 6;
      detail = "Light on concrete numbers and data.";
    } else {
      status = "fail";
      score = 1;
      detail = "No numbers, stats, or specifics.";
    }
    push({
      id: "specificity",
      label: "Specific facts & data",
      status,
      score,
      max: 10,
      detail,
      tip: "Add concrete numbers, dates, and named specifics. Models prefer citing sources that state verifiable facts.",
    });
  }

  // 6. Readability (10)
  {
    let status: CheckStatus, score: number, detail: string;
    if (avgSentenceLen <= 20) {
      status = "pass";
      score = 10;
      detail = `~${Math.round(avgSentenceLen)} words per sentence, easy to parse.`;
    } else if (avgSentenceLen <= 28) {
      status = "warn";
      score = 6;
      detail = `~${Math.round(avgSentenceLen)} words per sentence, a little long.`;
    } else {
      status = "fail";
      score = 2;
      detail = `~${Math.round(avgSentenceLen)} words per sentence, hard to parse.`;
    }
    push({
      id: "readability",
      label: "Readability",
      status,
      score,
      max: 10,
      detail,
      tip: "Aim for ~15–20 words per sentence. Shorter sentences extract cleanly into answers.",
    });
  }

  // 7. Depth (10)
  {
    let status: CheckStatus, score: number, detail: string;
    if (wordCount >= 300 && wordCount <= 3000) {
      status = "pass";
      score = 10;
      detail = `${wordCount} words, solid depth.`;
    } else if (wordCount < 300) {
      status = "warn";
      score = 5;
      detail = `${wordCount} words, likely too thin to be authoritative.`;
    } else {
      status = "warn";
      score = 7;
      detail = `${wordCount} words, long; make sure it stays focused.`;
    }
    push({
      id: "depth",
      label: "Content depth",
      status,
      score,
      max: 10,
      detail,
      tip: "Cover the topic thoroughly (usually 300+ words) without padding. Depth signals authority; padding dilutes it.",
    });
  }

  // 8. Freshness cues (5)
  {
    const recent = years.some((y) => y >= currentYear - 1);
    let status: CheckStatus, score: number, detail: string;
    if (recent) {
      status = "pass";
      score = 5;
      detail = "References a current year.";
    } else if (years.length) {
      status = "warn";
      score = 2;
      detail = "Only older years referenced.";
    } else {
      status = "warn";
      score = 2;
      detail = "No date/year cues.";
    }
    push({
      id: "freshness",
      label: "Freshness signals",
      status,
      score,
      max: 5,
      detail,
      tip: "Reference the current year and update timestamps. Freshness raises trust for time-sensitive queries.",
    });
  }

  // 9. Structured data (5)
  {
    let status: CheckStatus, score: number, detail: string;
    if (hasFaqSchema || hasJsonLd) {
      status = "pass";
      score = 5;
      detail = hasFaqSchema ? "FAQPage schema detected." : "JSON-LD schema detected.";
    } else if (!hasHtml) {
      status = "warn";
      score = 2;
      detail = "Paste page HTML to check for schema markup.";
    } else {
      status = "fail";
      score = 0;
      detail = "No JSON-LD structured data found.";
    }
    push({
      id: "schema",
      label: "Structured data (schema)",
      status,
      score,
      max: 5,
      detail,
      tip: "Add JSON-LD (Article, FAQPage, HowTo). It helps engines understand and cite your content.",
    });
  }

  // 10. Sources & links (5)
  {
    let status: CheckStatus, score: number, detail: string;
    if (links >= 1) {
      status = "pass";
      score = 5;
      detail = `${links} link(s)/reference(s) present.`;
    } else {
      status = "warn";
      score = 1;
      detail = "No outbound links or sources.";
    }
    push({
      id: "sources",
      label: "Sources & links",
      status,
      score,
      max: 5,
      detail,
      tip: "Link to primary sources. Cited, well-referenced pages read as more trustworthy to both users and models.",
    });
  }

  const score = clamp(
    checks.reduce((s, c) => s + c.score, 0),
    0,
    100,
  );
  const grade =
    score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : score >= 40 ? "D" : "F";
  const summary =
    grade === "A"
      ? "Strong AI-search readiness. Small tweaks will squeeze out the rest."
      : grade === "B"
        ? "Good foundation. A few fixes will make this much more citable."
        : grade === "C"
          ? "Middling. The structure and specificity need real work to get cited."
          : "This content isn't built to be the answer yet. Start with the fails below.";

  const pillars: Pillar[] = PILLAR_ORDER.map((pid) => {
    const group = checks.filter((c) => c.pillar === pid);
    return {
      id: pid,
      label: group[0]?.pillarLabel ?? pid,
      score: group.reduce((s, c) => s + c.score, 0),
      max: group.reduce((s, c) => s + c.max, 0),
    };
  });

  // Priority fixes: biggest point gaps first (fails before warns on ties).
  const priorities = checks
    .filter((c) => c.status !== "pass")
    .sort((a, b) => {
      const gap = b.max - b.score - (a.max - a.score);
      if (gap !== 0) return gap;
      return (a.status === "fail" ? 0 : 1) - (b.status === "fail" ? 0 : 1);
    })
    .slice(0, 3);

  return {
    score,
    grade,
    summary,
    stats: {
      words: wordCount,
      sentences: sentenceCount,
      headings: headings.length,
      questionHeadings,
      lists: listItems,
      links,
      numbers,
      hasSchema: hasJsonLd || hasFaqSchema,
      readingMinutes: Math.max(1, Math.round(wordCount / 220)),
    },
    pillars,
    checks,
    priorities,
  };
}
