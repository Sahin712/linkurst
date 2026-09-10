import { renderOgImage, ogAlt, ogSize, ogContentType } from "@/lib/og";

export const runtime = "nodejs";
export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage();
}
