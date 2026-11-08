"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Arrow from "./Arrow";
import LightSweep, { curves } from "./LightSweep";
import type { PortfolioProject } from "./Portfolio";

/**
 * Featured work riding the black hole's stream. The project cards float as
 * small glass tiles along the gold lines, drifting downstream (left → right)
 * as the page scrolls. At the centre, each one in turn lifts off the stream
 * and comes forward to face you: its screenshot fades in, a viewfinder locks
 * on and slowly scans it, and a huge outlined title sits behind it. Then it
 * settles back onto the stream and drifts on while the next one arrives.
 * In the stream the cards are plain glass; the screenshot only appears as a
 * card comes forward, so nothing is set up per project.
 *
 * Everything is HTML with CSS 3D transforms, driven by page scroll, so
 * screenshots stay sharp and links work. Phones and reduced motion get a
 * simple stacked layout.
 */

// The gold "fall" lines' centre curve, in their 1600 × 900 drawing space.
const [P0X, P0Y, P1X, P1Y, P2X, P2Y, P3X, P3Y] = curves.fall;
const LIFT_AT = 0.5; // where on the stream a card lifts off (0 = left end)
const SPACING = 0.28; // gap between cards along the stream
const INTRO = 0.6; // scroll steps before the first card lifts (heading shows)
const PERSPECTIVE = 1500; // must match .bay-stage perspective
const STREAM_DEPTH = 160; // px behind the front card

/** Point and direction on the stream curve at u (0..1), drawing space. */
function streamAt(u: number) {
  const a = 1 - u;
  const x =
    a * a * a * P0X +
    3 * a * a * u * P1X +
    3 * a * u * u * P2X +
    u * u * u * P3X;
  const y =
    a * a * a * P0Y +
    3 * a * a * u * P1Y +
    3 * a * u * u * P2Y +
    u * u * u * P3Y;
  const dx =
    3 * a * a * (P1X - P0X) + 6 * a * u * (P2X - P1X) + 3 * u * u * (P3X - P2X);
  const dy =
    3 * a * a * (P1Y - P0Y) + 6 * a * u * (P2Y - P1Y) + 3 * u * u * (P3Y - P2Y);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export default function ProjectBay({
  projects,
  summaries,
  heading,
}: {
  projects: PortfolioProject[];
  summaries: Record<string, string>;
  /** Section heading, shown over the stream until the first card lifts. */
  heading?: React.ReactNode;
}) {
  const count = projects.length;
  const pin = useRef<HTMLDivElement>(null);
  const slabs = useRef<(HTMLElement | null)[]>([]);
  const infos = useRef<(HTMLElement | null)[]>([]);
  const ghosts = useRef<(HTMLElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const [animated, setAnimated] = useState(false);

  // Animate only on wide screens without reduced motion.
  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 761px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setAnimated(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!animated) {
      // Static layout: clear anything the animation wrote inline.
      [
        ...slabs.current,
        ...infos.current,
        ...ghosts.current,
        headingRef.current,
      ].forEach((el) => el?.removeAttribute("style"));
      return;
    }
    let frame = 0;
    const draw = () => {
      frame = 0;
      const box = pin.current;
      if (!box) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const travel = box.offsetHeight - height;
      const progress =
        travel > 0 ? clamp(-box.getBoundingClientRect().top / travel) : 0;
      // q < 0: heading shown, cards drifting in. Card i lifts off at q = i.
      const q = progress * (count + INTRO) - INTRO;
      // The lines are drawn "cover"-fitted into the screen; match that.
      const fit = Math.max(width / 1600, height / 900);
      let current = -1;

      const heading = headingRef.current;
      if (heading) {
        const fade = smooth(-0.35, 0.1, q);
        heading.style.opacity = `${1 - fade}`;
        heading.style.transform = `translateY(${-fade * 40}px)`;
      }

      for (let i = 0; i < count; i++) {
        const slab = slabs.current[i];
        if (!slab) continue;
        const t = q - i;
        const inside = t >= 0 && t <= 1;
        // Lift off the stream and face you (0 → 1), then settle back.
        const come = inside ? smooth(0, 0.28, t) : 0;
        const leave = inside ? smooth(0.72, 1, t) : 0;
        const presence = come * (1 - leave);
        const hold = inside ? clamp((t - 0.28) / 0.44) : t > 1 ? 1 : 0;
        if (presence > 0.5) current = i;

        // Every card drifts steadily downstream, one spacing apart, and
        // passes the lift-off point halfway through its turn. So the card
        // settling back is already downstream when the next one lifts off.
        const u = LIFT_AT + (t - 0.5) * SPACING;
        const p = streamAt(u);
        const streamX = (p.x - 800) * fit;
        const streamY = (p.y - 450) * fit;
        // Fade in/out at the ends of the stream.
        const edge = smooth(-0.05, 0.12, u) * (1 - smooth(0.88, 1.05, u));

        // Stream cards sit a little deeper than the card in front, so the
        // browser's 3D depth sorting never lets one cut through another.
        // Position and size are scaled up to cancel the perspective shrink,
        // keeping them exactly on the lines.
        const depth = mix(-STREAM_DEPTH, 0, presence);
        const grow = (PERSPECTIVE - depth) / PERSPECTIVE;
        const x = mix(streamX * grow, -width * 0.12, presence);
        const y = mix(streamY * grow, 0, presence);
        const rotateZ = mix(p.angle, 0, presence);
        const rotateY = mix(-28, -9, presence);
        const rotateX = mix(8, 3, presence);
        const scale = mix(0.32 * grow, 1, presence);
        slab.style.transform = `translate3d(${x}px, ${y}px, ${depth}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
        slab.style.opacity = `${mix(0.85 * edge, 1, presence)}`;
        slab.style.zIndex = `${Math.round(presence * 10)}`;
        slab.style.setProperty("--presence", presence.toFixed(3));
        slab.style.setProperty("--hold", hold.toFixed(3));

        const info = infos.current[i];
        if (info) {
          const show = smooth(0.6, 0.9, presence);
          info.style.opacity = `${show}`;
          info.style.transform = `translateY(${(1 - show) * 24}px)`;
        }
        const ghost = ghosts.current[i];
        if (ghost) {
          ghost.style.opacity = `${presence * 0.9}`;
          ghost.style.transform = `translate(-50%, -50%) translateX(${(1 - presence) * 120}px)`;
        }
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [animated, count]);

  // Only the project in front can be tabbed into.
  useEffect(() => {
    [...slabs.current, ...infos.current].forEach((el, k) => {
      if (!el) return;
      const index = k % count;
      if (animated && index !== active) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
  }, [active, animated, count]);

  return (
    <div
      ref={pin}
      className={`project-bay ${animated ? "is-animated" : "is-static"}`}
      style={{ ["--count" as string]: count + INTRO }}
    >
      <div className="bay-sticky">
        <LightSweep variant="fall" />
        {heading && (
          <div ref={headingRef} className="bay-heading section-heading">
            {heading}
          </div>
        )}
        <div className="bay-stage">
          {projects.map((project, i) => (
            <div
              key={`ghost-${project.id}`}
              ref={(el) => {
                ghosts.current[i] = el;
              }}
              className="bay-ghost"
              aria-hidden="true"
            >
              {project.title}
            </div>
          ))}

          <div className="bay-rack">
            {projects.map((project, i) => (
              <article
                key={project.id}
                ref={(el) => {
                  slabs.current[i] = el;
                }}
                className="bay-slab"
                aria-label={`${i + 1} of ${count}: ${project.title}`}
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="bay-panel liquid-glass"
                  aria-label={`Open ${project.title}`}
                >
                  <div className="bay-shot">
                    <div className="bay-scan">
                      <Image
                        src={project.image}
                        alt={`${project.title} interface`}
                        fill
                        sizes="(max-width: 760px) 92vw, 52vw"
                        unoptimized={project.image.startsWith("/")}
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                  <span className="bay-corner tl" aria-hidden="true" />
                  <span className="bay-corner tr" aria-hidden="true" />
                  <span className="bay-corner bl" aria-hidden="true" />
                  <span className="bay-corner br" aria-hidden="true" />
                  <span className="bay-scanline" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>

          <div className="bay-infos">
            {projects.map((project, i) => (
              <div
                key={`info-${project.id}`}
                ref={(el) => {
                  infos.current[i] = el;
                }}
                className="bay-info"
              >
                <p className="bay-index">
                  <span>0{i + 1}</span> / 0{count}
                  <i>{project.categories.slice(0, 2).join(" + ")}</i>
                </p>
                <h3>
                  <Link href={`/projects/${project.id}`}>{project.title}</Link>
                </h3>
                <p className="bay-summary">
                  {summaries[project.id] || project.description}
                </p>
                <div className="project-technologies">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                <Link className="text-link" href={`/projects/${project.id}`}>
                  Explore project <Arrow diagonal />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
