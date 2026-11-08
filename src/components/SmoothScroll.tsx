"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { scrollToY, setSmoothScroller } from "@/lib/smoothScroll";

/**
 * Inertial smooth scrolling for wheel and trackpad, site-wide.
 * Touch keeps the device's native momentum. Off for reduced motion.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const start = () => {
      if (lenis || preference.matches) return;
      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.085, // lower = longer, softer glide
        wheelMultiplier: 0.9,
        // In-page links (#work, #about…) glide instead of jumping.
        anchors: true,
        // Let open dialogs (the menu) scroll natively.
        prevent: (node) => !!node.closest("dialog[open]"),
      });
      setSmoothScroller(lenis);
    };
    const stop = () => {
      lenis?.destroy();
      lenis = null;
      setSmoothScroller(null);
    };
    const onPreference = () => (preference.matches ? stop() : start());

    start();
    preference.addEventListener("change", onPreference);
    return () => {
      preference.removeEventListener("change", onPreference);
      stop();
    };
  }, []);

  // A new page starts at the top. Jump there instantly, and stop any glide
  // still running from the previous page. Skipped on first load so a reload
  // keeps the visitor's position.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    if (!window.location.hash) scrollToY(0, { immediate: true });
  }, [pathname]);

  return null;
}
