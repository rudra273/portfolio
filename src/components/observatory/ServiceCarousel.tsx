"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Arrow from "./Arrow";
import ServiceArtwork from "./ServiceArtwork";
import LightSweep from "./LightSweep";

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

/** Each card rests for a moment before the next slides in. */
function dwell(progress: number) {
  const raw = Math.min(Math.max(progress, 0), 1) * LAST;
  const index = Math.min(Math.floor(raw), LAST - 1);
  const t = Math.min(Math.max((raw - index - 0.2) / 0.6, 0), 1);
  return index + t * t * (3 - 2 * t);
}

export default function ServiceCarousel() {
  const [active, setActive] = useState(0);
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const box = pin.current;
      const row = track.current;
      const view = stage.current;
      if (!box || !row || !view) return;
      const rect = box.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const position = dwell(travel > 0 ? -rect.top / travel : 0);
      // Offset that centres slide k in the track.
      const centre = (k: number) => {
        const slide = slides.current[k];
        return slide
          ? slide.offsetLeft + slide.offsetWidth / 2 - row.clientWidth / 2
          : 0;
      };
      const from = Math.floor(position);
      const to = Math.min(from + 1, LAST);
      const offset =
        centre(from) + (centre(to) - centre(from)) * (position - from);
      row.style.transform = `translate3d(${-offset}px, 0, 0)`;
      // Service cards start off-screen right and catch up with the row.
      const join = 1 - Math.min(position, 1);
      row.style.setProperty("--join", `${join * window.innerWidth * 0.5}px`);
      // The form drifts from the intro card's centre to the cards' right side.
      view.style.setProperty("--art-shift", `${Math.min(position, 1)}`);
      setActive(Math.round(position));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  /** Keys and clicks scroll the page to the point where slide i rests. */
  function go(index: number) {
    const box = pin.current;
    if (!box) return;
    const travel = box.offsetHeight - window.innerHeight;
    const top = box.getBoundingClientRect().top + window.scrollY;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.scrollTo({
      top: top + (travel * index) / LAST,
      behavior: reduce.matches ? "auto" : "smooth",
    });
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
                <div className="service-slide__art" aria-hidden="true">
                  <ServiceArtwork mode={3} />
                </div>
                <p className="eyebrow">
                  <span className="section-number">02</span> SERVICES
                </p>
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
                {/* Faint static art so neighbouring slides aren't empty. */}
                <div className="service-slide__art" aria-hidden="true">
                  <ServiceArtwork mode={index} />
                </div>
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
