"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Arrow from "./observatory/Arrow";

const destinations = [
  { id: "work", label: "Work" },
  { id: "expertise", label: "Expertise" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
export default function Navbar() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [docked, setDocked] = useState(false);
  const [active, setActive] = useState("work");
  const close = () => dialog.current?.close();
  useEffect(() => {
    close();
    if (pathname !== "/") return;
    const onScroll = () =>
      setDocked(window.scrollY > window.innerHeight * 0.65);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    destinations.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="orbital-header">
        <Link className="wordmark" href="/" aria-label="Rudra — home">
          RUDRA
          <span className="wordmark-orbit" aria-hidden="true" />
        </Link>
        <button
          className="menu-trigger"
          onClick={() => dialog.current?.showModal()}
          aria-haspopup="dialog"
        >
          Menu
          <span className="menu-lines" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>
      {pathname === "/" && (
        <nav
          className={`orbital-dock liquid-glass ${docked ? "is-visible" : ""}`}
          aria-label="Page sections"
          {...(!docked ? { "aria-hidden": true } : {})}
        >
          <a className="dock-home" href="#top" aria-label="Back to top">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3" stroke="currentColor" />
              <ellipse
                cx="12"
                cy="12"
                rx="10"
                ry="4"
                stroke="currentColor"
                transform="rotate(-40 12 12)"
              />
            </svg>
          </a>
          {destinations.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={active === item.id ? "active" : ""}
              aria-current={active === item.id ? "location" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
      <dialog
        ref={dialog}
        className="orbital-menu"
        aria-labelledby="menu-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="menu-content">
          <div className="menu-top">
            <span id="menu-title" className="eyebrow">
              Explore the portfolio
            </span>
            <button onClick={close} className="menu-trigger">
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav aria-label="Main navigation">
            {[
              ["01", "Selected work", "/projects"],
              ["02", "About me", "/about"],
              ["03", "Get in touch", "/contact"],
            ].map(([n, label, href]) => (
              <Link key={href} href={href} onClick={close}>
                <span>{n}</span>
                {label}
                <Arrow diagonal />
              </Link>
            ))}
          </nav>
          <div className="menu-bottom">
            <a
              href="https://github.com/rudra273"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/rudrapratap-mohanty-2b57041b5"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>
            <Link href="/explore" onClick={close}>
              Previous universe ↗
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
