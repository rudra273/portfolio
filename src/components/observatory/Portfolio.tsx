"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Arrow from "./Arrow";
import ContactForm from "./ContactForm";
import ServiceCarousel from "./ServiceCarousel";
import LightSweep from "./LightSweep";

const PlanetScene = dynamic(() => import("./PlanetScene"), { ssr: false });
export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  features: string[];
  techStack: string[];
  categories: string[];
  githubUrl: string;
  liveUrl: string;
}
const summaries: Record<string, string> = {
  "4": "Ask in plain English. Get answers from your data. An LLM-powered bridge between natural language and databases.",
  "5": "A team of AI agents for market research, technical analysis, and news sentiment. One connected workspace.",
  "6": "Everyday finances, made clearer. Transaction dashboards and a conversational way to explore your spending.",
};
export default function Portfolio({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  const featured = ["4", "5", "6"]
    .map((id) => projects.find((p) => String(p.id) === id))
    .filter((p): p is PortfolioProject => !!p);
  const selected = featured.length ? featured : projects.slice(0, 3);
  return (
    <div className="observatory">
      <section id="top" className="orbital-hero" aria-labelledby="hero-title">
        <div className="hero-stars" aria-hidden="true" />
        <div className="planet-fallback" aria-hidden="true" />
        <PlanetScene />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-copy">
          <p className="hero-intro">RUDRAPRATAP MOHANTY</p>
          <h1 id="hero-title">
            Engineering
            <br />
            <span>beyond the ordinary.</span>
          </h1>
          <p className="hero-description">
            AI systems. Backend engineering. A curiosity without limits.
          </p>
          <a className="light-button hero-button" href="#work">
            Explore my work
            <Arrow diagonal />
          </a>
        </div>
        <div className="hero-foot">
          <span>BASED ON EARTH. THINKING BEYOND.</span>
          <a href="#work">
            Scroll to discover <span aria-hidden="true">↓</span>
          </a>
          <span>PORTFOLIO / 2026</span>
        </div>
      </section>

      <section
        id="work"
        className="work-section section-shell"
        aria-labelledby="work-title"
      >
        <LightSweep variant="fall" />
        <div className="section-heading">
          <div>
            <h2 id="work-title">
              Ideas, brought
              <br />
              <span className="muted">into the real world.</span>
            </h2>
          </div>
          <Link className="text-link" href="/projects">
            All projects <Arrow diagonal />
          </Link>
        </div>
        <div className="project-showcase">
          {selected.map((project, index) => (
            <article
              key={project.id}
              className={`showcase-card showcase-${index} liquid-glass`}
            >
              <div className="showcase-info">
                <div className="project-category">
                  <span>0{index + 1} /</span>{" "}
                  {project.categories.slice(0, 2).join(" + ")}
                </div>
                <h3>
                  <Link href={`/projects/${project.id}`}>{project.title}</Link>
                </h3>
                <p>{summaries[project.id] || project.description}</p>
                <div className="project-technologies">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                <Link className="text-link" href={`/projects/${project.id}`}>
                  Explore project <Arrow diagonal />
                </Link>
              </div>
              <Link
                className="showcase-visual"
                href={`/projects/${project.id}`}
                aria-label={`View ${project.title}`}
              >
                <div className="project-window">
                  <div className="window-bar">
                    <span />
                    <span />
                    <span />
                    <i>{project.title.toLowerCase().replaceAll(" ", "-")}</i>
                    <span className="window-expand">↗</span>
                  </div>
                  <div className="project-image">
                    <Image
                      src={project.image}
                      alt={`${project.title} application interface`}
                      fill
                      sizes={
                        index === 0
                          ? "(max-width: 760px) 90vw, 55vw"
                          : "(max-width: 760px) 90vw, 42vw"
                      }
                      unoptimized={project.image.startsWith("/")}
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <span className="visual-orbit" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        id="expertise"
        className="expertise-section"
        aria-labelledby="expertise-title"
      >
        <ServiceCarousel />
      </section>

      <section
        id="about"
        className="about-section section-shell"
        aria-labelledby="about-title"
      >
        <LightSweep variant="arc" />
        <div className="about-grid">
          <div>
            <h2 id="about-title">
              Grounded in code.
              <br />
              <span className="muted">Drawn to the unknown.</span>
            </h2>
            <div className="about-description">
              <p>
                I’m Rudra, a software and MLOps engineer based in Bangalore. I
                build backend systems, work with cloud infrastructure, and turn
                ideas in AI into things you can actually use.
              </p>
              <p>
                Outside the editor, I’m usually following another curiosity.
                Often, it’s somewhere in the universe.
              </p>
            </div>
            <Link className="text-link" href="/about">
              A little more about me
              <Arrow diagonal />
            </Link>
          </div>
          <div className="about-orbit">
            <div className="portrait-frame">
              <Image
                src="https://res.cloudinary.com/dldkrpbjt/image/upload/v1774436299/profile/rudra.jpg"
                alt="Rudrapratap Mohanty"
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
            <span className="portrait-caption">
              ENGINEER BY PRACTICE.
              <br />
              EXPLORER BY NATURE.
            </span>
          </div>
        </div>
        <div className="career-strip">
          <div>
            <span>2022</span>
            <h3>The foundation</h3>
            <p>B.Tech in Computer Science</p>
          </div>
          <div>
            <span>2023</span>
            <h3>Building software</h3>
            <p>Testyantra · Software Development</p>
          </div>
          <div>
            <span>2024</span>
            <h3>Connecting the dots</h3>
            <p>Sigmoid · MLOps Engineering</p>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="contact-section section-shell"
        aria-labelledby="contact-title"
      >
        <div className="contact-glow" aria-hidden="true" />
        <div className="contact-grid">
          <div>
            <h2 id="contact-title">
              What’s your
              <br />
              <span className="muted">next big idea?</span>
            </h2>
            <p className="contact-description">
              Something to build. A problem to solve.
              <br />
              Or a shared curiosity. I’d love to hear it.
            </p>
            <a className="contact-email" href="mailto:rudramohanty45@gmail.com">
              rudramohanty45@gmail.com <Arrow diagonal />
            </a>
          </div>
          <ContactForm />
        </div>
      </section>
      <footer className="orbital-footer section-shell">
        <Link className="footer-wordmark" href="#top">
          RUDRA<span>© {new Date().getFullYear()}</span>
        </Link>
        <p>A small corner of a very big universe.</p>
        <div>
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
        </div>
      </footer>
    </div>
  );
}
