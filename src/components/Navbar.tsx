"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Arrow from "./observatory/Arrow";

export default function Navbar() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [pastHero, setPastHero] = useState(false);
  const close = () => dialog.current?.close();

  useEffect(() => {
    if (pathname !== "/") {
      setPastHero(false);
      return;
    }

    const updateHeader = () => {
      const expertise = document.getElementById("expertise");
      setPastHero(!!expertise && expertise.getBoundingClientRect().top <= 0);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
    };
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {(pathname !== "/" || pastHero) && (
        <header className="orbital-header">
          <Link className="wordmark" href="/" aria-label="Rudra — home">
            RUDRA
          </Link>
        </header>
      )}
      {pathname === "/" && (
        <>
          <div className="orbital-header hero-menu">
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
          </div>
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
      )}
    </>
  );
}
