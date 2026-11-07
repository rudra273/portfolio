"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Arrow from "./Arrow";
import ServiceArtwork from "./ServiceArtwork";

const ServiceScene = dynamic(() => import("./ServiceScene"), { ssr: false });

const services = [
  {
    label: "Generative AI",
    kicker: "INTELLIGENCE, APPLIED",
    title: "Your knowledge.\nNew possibilities.",
    description:
      "Make your business knowledge useful through AI that understands, creates, and assists. Give your team and customers a simpler way to find answers and get things done.",
    examples: ["AI assistants", "Knowledge search", "Content generation"],
    caption: "INTELLIGENCE, CONNECTED",
    project: "4",
    link: "Explore Text-to-SQL",
  },
  {
    label: "Software Development",
    kicker: "IDEAS, MADE REAL",
    title: "Your next idea.\nBuilt for real life.",
    description:
      "Build software around your business, your users, and your next idea. From a customer-facing product to an internal platform, turn the way you want to work into something people can use.",
    examples: ["Web applications", "Customer portals", "Internal platforms"],
    caption: "PIECE BY PIECE",
    project: "1",
    link: "Explore Chat App",
  },
  {
    label: "Business Automation",
    kicker: "LESS REPETITION. MORE PROGRESS.",
    title: "Let the routine\ntake care of itself.",
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
 * Edolus-style row of glass slides. One live 3D form sits fixed behind the
 * centred slide and morphs as slides pass over it, so the glass always has
 * light to refract. Native scroll-snap handles touch, trackpad and keyboard.
 */
export default function ServiceCarousel() {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // The slide whose centre is nearest the track's centre is active.
        const centre = element.scrollLeft + element.clientWidth / 2;
        let nearest = 0;
        let best = Infinity;
        slides.current.forEach((slide, index) => {
          if (!slide) return;
          const distance = Math.abs(
            slide.offsetLeft + slide.offsetWidth / 2 - centre,
          );
          if (distance < best) {
            best = distance;
            nearest = index;
          }
        });
        setActive(nearest);
      });
    };
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      element.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function go(index: number) {
    const element = track.current;
    const slide = slides.current[index];
    if (!element || !slide) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    element.scrollTo({
      left: slide.offsetLeft - (element.clientWidth - slide.offsetWidth) / 2,
      behavior: reduce.matches ? "auto" : "smooth",
    });
    setActive(index);
  }

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") go(Math.min(active + 1, 2));
    else if (event.key === "ArrowLeft") go(Math.max(active - 1, 0));
    else return;
    event.preventDefault();
  }

  return (
    <div
      className="service-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Services"
    >
      <div className="section-shell service-controls">
        <div className="service-pills liquid-glass">
          <span
            className="liquid-tab-indicator"
            aria-hidden="true"
            style={{
              transform: `translateX(calc(${active * 100}% + ${active * 4}px))`,
            }}
          />
          {services.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-current={active === index}
              aria-controls={`service-slide-${index}`}
              onClick={() => go(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="service-arrows">
          <button
            type="button"
            aria-label="Previous service"
            disabled={active === 0}
            onClick={() => go(active - 1)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next service"
            disabled={active === 2}
            onClick={() => go(active + 1)}
          >
            →
          </button>
        </div>
      </div>

      <div className="service-viewport">
        {/* Shared live form, fixed behind the centred slide. */}
        <div className="service-art" data-mode={active} aria-hidden="true">
          <div className="service-halo" />
          <ServiceArtwork mode={active} />
          <ServiceScene mode={active} />
        </div>

        <div
          ref={track}
          className="service-track"
          tabIndex={0}
          onKeyDown={onKey}
          aria-label="Service slides, use left and right arrow keys"
        >
          {services.map((item, index) => (
            <article
              key={item.label}
              id={`service-slide-${index}`}
              ref={(element) => {
                slides.current[index] = element;
              }}
              className="service-slide liquid-glass"
              data-active={active === index}
              aria-roledescription="slide"
              aria-label={`${index + 1} of 3: ${item.label}`}
              onClick={() => active !== index && go(index)}
            >
              {/* Faint static art so neighbouring slides aren't empty. */}
              <div className="service-slide__art" aria-hidden="true">
                <ServiceArtwork mode={index} />
              </div>
              <div className="service-slide__body">
                <p className="eyebrow warm">
                  <span className="section-number">0{index + 1}</span>{" "}
                  {item.kicker}
                </p>
                <h3>{item.title}</h3>
                <p className="expertise-description">{item.description}</p>
                <ul className="service-points">
                  {item.examples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
                <Link
                  className="text-link"
                  href={`/projects/${item.project}`}
                  tabIndex={active === index ? 0 : -1}
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
  );
}
