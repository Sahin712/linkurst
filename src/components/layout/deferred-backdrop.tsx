"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Code-split the animated backdrop into its own chunk, loaded only after the
// page is interactive — it's purely decorative (behind content), so keeping it
// out of the initial HTML and critical JS improves first paint / LCP on mobile.
const SiteBackdrop = dynamic(
  () => import("./site-backdrop").then((m) => m.SiteBackdrop),
  { ssr: false },
);

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void) => number;
  cancelIdleCallback?: (id: number) => void;
};

export function DeferredBackdrop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const w = window as IdleWindow;
    const req = w.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const id = req(() => setShow(true));
    return () => {
      if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  return show ? <SiteBackdrop /> : null;
}
