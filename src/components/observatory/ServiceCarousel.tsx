"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Arrow from "./Arrow";
import ServiceArtwork from "./ServiceArtwork";
import LightSweep from "./LightSweep";
import { isSmoothScrolling, scrollToY } from "@/lib/smoothScroll";

const ServiceScene = dynamic(() => import("./ServiceScene"), { ssr: false });

const services = [
  {
    label: "Generative AI",
    tagline: "Your knowledge.\nNew possibilities.",
    description:
      "Make your business knowledge useful through AI that understands, creates, and assists. Give your team and customers a simpler way to find answers and get things done.",
    examples: ["AI assistants", "Knowledge search", "Content generation"],
    caption: "INTELLIGENCE, CONNECTED",
    project: "4",
    link: "Explore Text-to-SQL",
  },
  {
    label: "Software Development",
    tagline: "Your next idea.\nBuilt for real life.",
    description:
      "Build software around your business, your users, and your next idea. From a customer-facing product to an internal platform, turn the way you want to work into something people can use.",
    examples: ["Web applications", "Customer portals", "Internal platforms"],
    caption: "PIECE BY PIECE",
    project: "1",
    link: "Explore Chat App",
  },
  {
    label: "Business Automation",
    tagline: "Let the routine\ntake care of itself.",
    description:
      "Simplify repetitive work and keep your tools and processes connected. Bring information together, process documents, and automate reporting so your team can focus on what needs them.",
    examples: [
      "Document processing",
      "Automated reporting",
      "Connected workflows",
    ],
    caption: "EVERYTHING IN FLOW",
    project: "5",
    link: "Explore Stock Advisory",
  },
];

/**
 * Edolus-style services stage. It opens on a single intro card ("What I can
 * build for you.") with a glowing question mark inside. As the page scrolls,
 * the three service cards fly in from the right, join the row, and the row
 * slides left card by card. One live 3D form stays behind the centred card and
 * morphs from the question mark into each service's shape.
 */
const LAST = services.length; // slide 0 is the intro, 1..3 are services
// Scroll steps: first the cards join the intro card, then one per slide move.
const STEPS = LAST + 1;

// Still moments at each end of the pinned scroll, in screen heights.
const HOLD_START = 0.12; // intro card rests before the cards start joining
const HOLD_END = 0.2; // last card rests before the page moves on

/** Pixels scrolled into the pinned area → step (0 … STEPS). */
function stepFor(scrolled: number, travel: number, screen: number) {
  const start = HOLD_START * screen;
  const span = travel - start - HOLD_END * screen;
  if (span <= 0) return 0;
  return Math.min(Math.max((scrolled - start) / span, 0), 1) * STEPS;
}

export default function ServiceCarousel() {
  const [active, setActive] = useState(0);
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    let last = 0;
    let current = -1; // eased step actually drawn; -1 = not drawn yet
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const draw = (step: number) => {
      const row = track.current;
      const view = stage.current;
      if (!row || !view) return;
      // Step 0→1: the service cards slide in beside the still intro card.
      // After that the whole row glides left, following the scroll exactly.
      const join = 1 - Math.min(step, 1);
      const position = Math.max(step - 1, 0);
      const centre = (k: number) => {
        const slide = slides.current[k];
        return slide
          ? slide.offsetLeft + slide.offsetWidth / 2 - row.clientWidth / 2
          : 0;
      };
      const from = Math.min(Math.floor(position), LAST);
      const to = Math.min(from + 1, LAST);
      const offset =
        centre(from) + (centre(to) - centre(from)) * (position - from);
      row.style.transform = `translate3d(${-offset}px, 0, 0)`;
      row.style.setProperty("--join", `${join * window.innerWidth * 0.6}px`);
      view.style.setProperty("--art-shift", `${Math.min(position, 1)}`);
      // Cards brighten gradually as they near the centre: no sudden switch.
      slides.current.forEach((slide, k) => {
        if (slide)
          slide.style.opacity = `${1 - 0.45 * Math.min(Math.abs(k - position), 1)}`;
      });
      setActive(Math.round(position));
    };

    const tick = (now: number) => {
      const box = pin.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const target = stepFor(-rect.top, travel, window.innerHeight);
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      // Lenis already glides the page scroll, so follow it exactly; easing on
      // top of that would feel laggy. Without Lenis (and without reduced
      // motion) ease here instead so motion still glides.
      current =
        current < 0 || reduce.matches || isSmoothScrolling()
          ? target
          : current + (target - current) * (1 - Math.exp(-dt * 7));
      draw(current);
      if (Math.abs(target - current) > 0.0005) {
        frame = requestAnimationFrame(tick);
      } else {
        last = 0;
        frame = 0;
      }
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      cancelAnimationFrame(frame);
    };
  }, []);

  /** Keys and clicks scroll the page to the point where slide i rests. */
  function go(index: number) {
    const box = pin.current;
    if (!box) return;
    const screen = window.innerHeight;
    const travel = box.offsetHeight - screen;
    const top = box.getBoundingClientRect().top + window.scrollY;
    // Slide 0 rests at the very start; slide i rests after the join step.
    scrollToY(
      top +
        HOLD_START * screen +
        ((travel - (HOLD_START + HOLD_END) * screen) *
          (index === 0 ? 0 : index + 1)) /
          STEPS,
    );
  }

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") go(Math.min(active + 1, LAST));
    else if (event.key === "ArrowLeft") go(Math.max(active - 1, 0));
    else return;
    event.preventDefault();
  }

  // Intro shows the question mark (mode 3); services use modes 0..2.
  const mode = active === 0 ? 3 : active - 1;

  return (
    <div
      ref={pin}
      className="service-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Services"
    >
      <div className="service-sticky">
        <LightSweep variant="rise" />
        <div ref={stage} className="service-viewport">
          {/* Shared live form, fixed behind the centred card. */}
          <div className="service-art" data-mode={mode} aria-hidden="true">
            <div className="service-halo" />
            <ServiceArtwork mode={mode} />
            <ServiceScene mode={mode} />
          </div>

          <div
            ref={track}
            className="service-track"
            tabIndex={0}
            onKeyDown={onKey}
            aria-label="Services, use left and right arrow keys"
          >
            <div
              className="service-intro"
              ref={(element) => {
                slides.current[0] = element;
              }}
            >
              <h2 id="expertise-title" className="service-intro__line">
                What I can build
              </h2>
              <div
                className="service-slide service-intro__card liquid-glass"
                data-active={active === 0}
                onClick={() => active !== 0 && go(0)}
              >
                <p className="service-intro__aside">
                  From an early idea
                  <br />
                  to a working product.
                </p>
              </div>
              <p className="service-intro__line muted">for you.</p>
            </div>

            {services.map((item, index) => (
              <article
                key={item.label}
                id={`service-slide-${index}`}
                ref={(element) => {
                  slides.current[index + 1] = element;
                }}
                className="service-slide service-card liquid-glass"
                data-active={active === index + 1}
                aria-roledescription="slide"
                aria-label={`${index + 1} of 3: ${item.label}`}
                onClick={() => active !== index + 1 && go(index + 1)}
              >
                <div className="service-slide__body">
                  <p className="eyebrow warm">
                    <span className="section-number">0{index + 1}</span>{" "}
                    {item.label}
                  </p>
                  <h3>{item.tagline}</h3>
                  <p className="expertise-description">{item.description}</p>
                  <ul className="service-points">
                    {item.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                  <Link
                    className="text-link"
                    href={`/projects/${item.project}`}
                    tabIndex={active === index + 1 ? 0 : -1}
                  >
                    {item.link}
                    <Arrow diagonal />
                  </Link>
                </div>
                <div className="service-caption">
                  <span className="status-dot" />
                  {item.caption}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
