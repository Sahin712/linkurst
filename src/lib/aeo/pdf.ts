import { jsPDF } from "jspdf";
import type { GradeResult } from "./analyze";

/**
 * Renders a branded, multi-page AEO readiness report to a downloadable PDF —
 * programmatically (no html2canvas), so it's deterministic and free of CSS
 * color-parsing issues.
 */

const COLORS = {
  coral: [232, 85, 58] as const,
  coralDark: [200, 62, 39] as const,
  charcoal: [28, 28, 30] as const,
  slate: [58, 58, 61] as const,
  muted: [105, 104, 106] as const,
  border: [230, 225, 216] as const,
  wash: [251, 236, 231] as const,
  ivory: [247, 244, 239] as const,
};

const STATUS_LABEL: Record<string, string> = {
  pass: "PASS",
  warn: "IMPROVE",
  fail: "FIX",
};

export function downloadReportPdf(
  result: GradeResult,
  meta: { source: string },
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 44; // margin
  const CW = W - M * 2; // content width
  let y = 0;

  const setColor = (c: readonly number[]) => doc.setTextColor(c[0], c[1], c[2]);
  const setFill = (c: readonly number[]) => doc.setFillColor(c[0], c[1], c[2]);
  const setDraw = (c: readonly number[]) => doc.setDrawColor(c[0], c[1], c[2]);

  function footer() {
    setColor(COLORS.muted);
    doc.setFont("helvetica", "normal").setFontSize(8);
    doc.text("linkurst.com  ·  AEO Readiness Report", M, H - 24);
    const pg = `Page ${doc.getNumberOfPages()}`;
    doc.text(pg, W - M, H - 24, { align: "right" });
  }

  function ensure(h: number) {
    if (y + h > H - 48) {
      footer();
      doc.addPage();
      y = M;
    }
  }

  function sectionTitle(label: string) {
    ensure(34);
    y += 8;
    setColor(COLORS.coralDark);
    doc.setFont("helvetica", "bold").setFontSize(9);
    doc.text(label.toUpperCase(), M, y);
    y += 6;
    setDraw(COLORS.border);
    doc.setLineWidth(0.8);
    doc.line(M, y, W - M, y);
    y += 16;
  }

  function wrapped(text: string, x: number, maxW: number, size: number, color: readonly number[], style: "normal" | "bold" = "normal", lineH = 13) {
    doc.setFont("helvetica", style).setFontSize(size);
    setColor(color);
    const lines = doc.splitTextToSize(text, maxW) as string[];
    for (const line of lines) {
      ensure(lineH);
      doc.text(line, x, y);
      y += lineH;
    }
  }

  /* ---------- header band ---------- */
  setFill(COLORS.charcoal);
  doc.rect(0, 0, W, 92, "F");
  setFill(COLORS.coral);
  doc.rect(0, 0, W, 5, "F");
  doc.setFont("helvetica", "bold").setFontSize(18);
  doc.setTextColor(247, 244, 239);
  doc.text("Linkurst", M, 42);
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.setTextColor(210, 208, 205);
  doc.text("AEO Readiness Report", M, 62);
  doc.setFontSize(8.5);
  doc.setTextColor(180, 178, 175);
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  doc.text(dateStr, W - M, 42, { align: "right" });
  const src = doc.splitTextToSize(meta.source, 240) as string[];
  doc.text(src.slice(0, 2), W - M, 60, { align: "right" });

  y = 128;

  /* ---------- score hero ---------- */
  // score badge
  setFill(COLORS.wash);
  doc.roundedRect(M, y - 26, 120, 84, 8, 8, "F");
  doc.setFont("helvetica", "bold").setFontSize(40);
  setColor(COLORS.coralDark);
  doc.text(String(result.score), M + 60, y + 10, { align: "center" });
  doc.setFont("helvetica", "bold").setFontSize(10);
  setColor(COLORS.muted);
  doc.text(`GRADE ${result.grade}`, M + 60, y + 30, { align: "center" });

  // verdict
  wrapAt(M + 140, y - 20);
  function wrapAt(x: number, top: number) {
    const savedY = y;
    y = top;
    doc.setFont("helvetica", "bold").setFontSize(9);
    setColor(COLORS.coralDark);
    doc.text("OVERALL", x, y);
    y += 16;
    const maxW = W - M - x;
    doc.setFont("helvetica", "bold").setFontSize(13);
    setColor(COLORS.charcoal);
    const vlines = doc.splitTextToSize(result.summary, maxW) as string[];
    for (const l of vlines) {
      doc.text(l, x, y);
      y += 17;
    }
    y = Math.max(savedY + 64, y);
  }

  y += 24;

  /* ---------- pillars ---------- */
  sectionTitle("Pillar breakdown");
  for (const p of result.pillars) {
    ensure(30);
    const pct = Math.round((p.score / p.max) * 100);
    doc.setFont("helvetica", "bold").setFontSize(10);
    setColor(COLORS.charcoal);
    doc.text(p.label, M, y);
    doc.setFont("helvetica", "normal").setFontSize(9);
    setColor(COLORS.muted);
    doc.text(`${p.score}/${p.max}  ·  ${pct}%`, W - M, y, { align: "right" });
    y += 7;
    // track
    setFill(COLORS.border);
    doc.roundedRect(M, y, CW, 6, 3, 3, "F");
    // fill
    setFill(pct >= 70 ? COLORS.coral : COLORS.coralDark);
    const fw = Math.max(4, (CW * pct) / 100);
    doc.roundedRect(M, y, fw, 6, 3, 3, "F");
    y += 22;
  }

  /* ---------- content metrics ---------- */
  sectionTitle("Content metrics");
  const metrics: [string, string][] = [
    ["Words", String(result.stats.words)],
    ["Headings", String(result.stats.headings)],
    ["Question headings", String(result.stats.questionHeadings)],
    ["List items", String(result.stats.lists)],
    ["Links", String(result.stats.links)],
    ["Data points", String(result.stats.numbers)],
    ["Schema", result.stats.hasSchema ? "Yes" : "No"],
    ["Read time", `${result.stats.readingMinutes} min`],
  ];
  const cols = 4;
  const tileW = (CW - (cols - 1) * 10) / cols;
  const tileH = 44;
  ensure(tileH * 2 + 10);
  metrics.forEach((m, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = M + col * (tileW + 10);
    const ty = y + row * (tileH + 10);
    setDraw(COLORS.border);
    doc.setLineWidth(0.8);
    doc.roundedRect(x, ty, tileW, tileH, 5, 5, "S");
    doc.setFont("helvetica", "bold").setFontSize(15);
    setColor(COLORS.charcoal);
    doc.text(m[1], x + tileW / 2, ty + 21, { align: "center" });
    doc.setFont("helvetica", "normal").setFontSize(7.5);
    setColor(COLORS.muted);
    doc.text(m[0].toUpperCase(), x + tileW / 2, ty + 33, { align: "center" });
  });
  y += tileH * 2 + 10 + 8;

  /* ---------- priority fixes ---------- */
  if (result.priorities.length) {
    sectionTitle("Priority fixes: start here");
    result.priorities.forEach((c, i) => {
      ensure(40);
      setFill(COLORS.coral);
      doc.circle(M + 8, y - 3, 8, "F");
      doc.setFont("helvetica", "bold").setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(String(i + 1), M + 8, y, { align: "center" });
      doc.setFont("helvetica", "bold").setFontSize(10.5);
      setColor(COLORS.charcoal);
      doc.text(`${c.label}   (+${c.max - c.score} pts)`, M + 24, y);
      y += 14;
      const savedX = M + 24;
      wrapped(c.tip, savedX, CW - 24, 9.5, COLORS.slate, "normal", 12);
      y += 8;
    });
  }

  /* ---------- full breakdown ---------- */
  sectionTitle("Full breakdown");
  for (const p of result.pillars) {
    ensure(24);
    doc.setFont("helvetica", "bold").setFontSize(9.5);
    setColor(COLORS.charcoal);
    doc.text(`${p.label.toUpperCase()}   ${p.score}/${p.max}`, M, y);
    y += 14;
    for (const c of result.checks.filter((ch) => ch.pillar === p.id)) {
      ensure(30);
      doc.setFont("helvetica", "bold").setFontSize(9.5);
      setColor(COLORS.charcoal);
      doc.text(c.label, M + 10, y);
      const tag = STATUS_LABEL[c.status];
      doc.setFont("helvetica", "bold").setFontSize(8);
      setColor(c.status === "pass" ? COLORS.coralDark : COLORS.muted);
      doc.text(`${c.score}/${c.max}  ${tag}`, W - M, y, { align: "right" });
      y += 12;
      wrapped(c.detail, M + 10, CW - 20, 9, COLORS.slate, "normal", 11);
      if (c.status !== "pass") {
        wrapped(`Fix: ${c.tip}`, M + 10, CW - 20, 8.5, COLORS.muted, "normal", 10.5);
      }
      y += 8;
    }
    y += 4;
  }

  /* ---------- methodology ---------- */
  sectionTitle("Methodology");
  wrapped(
    "This report is a transparent, rules-based analysis, not a live AI query. It scores ten signals that consistently correlate with getting cited by AI search (ChatGPT, Perplexity, Gemini, AI Overviews) and ranking in traditional search, grouped into four pillars:",
    M,
    CW,
    9.5,
    COLORS.slate,
    "normal",
    12,
  );
  y += 4;
  const method: [string, string][] = [
    ["Answerability (45 pts)", "Direct answer up top, question-based headings, scannable structure."],
    ["Structure (30 pts)", "Clear heading coverage, readability, content depth."],
    ["Authority & Trust (20 pts)", "Specific facts & data, freshness signals, sources & links."],
    ["Technical (5 pts)", "Structured data (schema)."],
  ];
  for (const [h, d] of method) {
    ensure(24);
    doc.setFont("helvetica", "bold").setFontSize(9.5);
    setColor(COLORS.charcoal);
    doc.text(h, M, y);
    y += 12;
    wrapped(d, M, CW, 9, COLORS.slate, "normal", 11);
    y += 6;
  }
  wrapped(
    "Grade bands: A 85+, B 70–84, C 55–69, D 40–54, F below 40.",
    M,
    CW,
    9,
    COLORS.muted,
    "normal",
    11,
  );

  footer();

  const safe = meta.source.replace(/[^a-z0-9]+/gi, "-").slice(0, 40).replace(/^-|-$/g, "");
  doc.save(`linkurst-aeo-report-${safe || "content"}.pdf`);
}
