"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Arrow from "./Arrow";
import LightSweep from "./LightSweep";
import type { PortfolioProject } from "./Portfolio";

/**
 * Featured work as a "project bay". The projects stand edge-on in a rack.
 * Scrolling pulls one out toward you: it turns face-on, its screenshot fades
 * in, a viewfinder locks onto it and slowly scans it, and a huge outlined
 * title sits behind it. Then it slides back and the next
 * one comes out. The last one zooms through, handing over to About.
 * In the rack the cards are plain glass; the screenshot only appears as a
 * card comes forward, so nothing is set up per project.
 *
 * Everything is HTML with CSS 3D transforms, driven by page scroll, so
 * screenshots stay sharp and links work. Phones and reduced motion get a
 * simple stacked layout.
 */

const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export default function ProjectBay({
  projects,
  summaries,
}: {
  projects: PortfolioProject[];
  summaries: Record<string, string>;
}) {
  const count = projects.length;
  const pin = useRef<HTMLDivElement>(null);
  const slabs = useRef<(HTMLElement | null)[]>([]);
  const infos = useRef<(HTMLElement | null)[]>([]);
  const ghosts = useRef<(HTMLElement | null)[]>([]);
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
      [...slabs.current, ...infos.current, ...ghosts.current].forEach((el) =>
        el?.removeAttribute("style"),
      );
      return;
    }
    let frame = 0;
    const draw = () => {
      frame = 0;
      const box = pin.current;
      if (!box) return;
      const width = window.innerWidth;
      const travel = box.offsetHeight - window.innerHeight;
      const progress =
        travel > 0 ? clamp(-box.getBoundingClientRect().top / travel) : 0;
      const q = progress * count;
      let current = -1;

      for (let i = 0; i < count; i++) {
        const slab = slabs.current[i];
        if (!slab) continue;
        const t = q - i;
        const last = i === count - 1;
        const inside = t >= 0 && t <= 1;
        // Out of the rack and face-on (0 → 1), then back in.
        const come = inside ? smooth(0, 0.28, t) : t > 1 ? 1 : 0;
        const leave = inside ? smooth(0.78, 1, t) : t > 1 ? 1 : 0;
        // The last project doesn't go back: it zooms through instead.
        const presence = last ? come : come * (1 - leave);
        const dive = last ? leave : 0;
        const hold = inside ? clamp((t - 0.28) / 0.5) : t > 1 ? 1 : 0;
        if (presence > 0.5) current = i;

        const rackX = (i - (count - 1) / 2) * 70 + width * 0.06;
        const x = mix(rackX, -width * 0.12, presence);
        const z = mix(-700, 0, presence);
        const rotateY = mix(78, -9, presence);
        const rotateX = mix(0, 3, presence);
        const scale = 1 + dive * 1.4;
        slab.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
        slab.style.opacity = `${mix(0.4, 1, presence) * (1 - dive)}`;
        slab.style.zIndex = `${Math.round(presence * 10)}`;
        slab.style.setProperty("--presence", presence.toFixed(3));
        slab.style.setProperty("--hold", hold.toFixed(3));

        const info = infos.current[i];
        if (info) {
          const show = smooth(0.6, 0.9, presence) * (1 - dive * 2);
          info.style.opacity = `${clamp(show)}`;
          info.style.transform = `translateY(${(1 - show) * 24}px)`;
        }
        const ghost = ghosts.current[i];
        if (ghost) {
          ghost.style.opacity = `${presence * 0.9 * (1 - dive)}`;
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
      style={{ ["--count" as string]: count }}
    >
      <div className="bay-sticky">
        <LightSweep variant="fall" />
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
