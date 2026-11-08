import type Lenis from "lenis";

/**
 * One shared handle on the site's smooth scroller, so any component can
 * scroll the page the same way. When Lenis isn't running (reduced motion,
 * before mount), these fall back to native scrolling.
 */
let instance: Lenis | null = null;

export function setSmoothScroller(next: Lenis | null) {
  instance = next;
}

/** True while Lenis is smoothing the page; components can skip their own easing. */
export function isSmoothScrolling() {
  return instance !== null;
}

/** Scroll the page to an absolute Y position. */
export function scrollToY(top: number, options: { immediate?: boolean } = {}) {
  if (instance) {
    instance.scrollTo(top, { immediate: options.immediate });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top,
    behavior: options.immediate || reduce ? "auto" : "smooth",
  });
}
