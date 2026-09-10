import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Shared social-share (Open Graph / Twitter) image renderer. 1200x630 PNG,
 * on-brand: ivory ground, charcoal headline, coral accents, logo mark.
 * Used by app/opengraph-image.tsx and app/twitter-image.tsx.
 */

export const ogAlt = "Linkurst — organic visibility for SaaS & B2B";
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const logoData = readFileSync(join(process.cwd(), "public/brand/logo.png"));
const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f4ef",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* coral glow, top-right */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 50%, rgba(232,85,58,0.35), rgba(232,85,58,0) 68%)",
            display: "flex",
          }}
        />

        {/* top: logo + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={64} height={64} alt="" />
          <span
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: -0.5,
              color: "#1c1c1e",
            }}
          >
            Linkurst
          </span>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 66,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: "#1c1c1e",
              maxWidth: 940,
            }}
          >
            Organic visibility across Google,&nbsp;
            <span style={{ color: "#c83e27" }}>AI search</span>
            &nbsp;&amp; Reddit.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#3a3a3d",
              maxWidth: 860,
            }}
          >
            The organic-growth studio for SaaS &amp; B2B.
          </div>
        </div>

        {/* bottom: label row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 40, height: 3, background: "#e8553a" }} />
          <span
            style={{
              fontSize: 22,
              letterSpacing: 4,
              color: "#c83e27",
              fontWeight: 600,
            }}
          >
            SEO · AEO · GEO
          </span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
