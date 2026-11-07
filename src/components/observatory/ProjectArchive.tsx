"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Arrow from "./Arrow";
import type { PortfolioProject } from "./Portfolio";
export default function ProjectArchive({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  const [category, setCategory] = useState("All work");
  const [technology, setTechnology] = useState("");
  const technologies = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.techStack))).sort(),
    [projects],
  );
  const categories = useMemo(
    () => [
      "All work",
      ...Array.from(new Set(projects.flatMap((p) => p.categories))),
    ],
    [projects],
  );
  const filtered = projects.filter(
    (p) =>
      (category === "All work" || p.categories.includes(category)) &&
      (!technology || p.techStack.includes(technology)),
  );
  return (
    <>
      <div
        className="archive-filters"
        role="group"
        aria-label="Filter projects"
      >
        {categories.map((item) => (
          <button
            key={item}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <label className="technology-filter">
        Technology
        <select
          value={technology}
          onChange={(event) => setTechnology(event.target.value)}
        >
          <option value="">All technologies</option>
          {technologies.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
      </label>
      <p className="archive-count" role="status">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"}
      </p>
      <div className="archive-grid">
        {filtered
          .slice()
          .reverse()
          .map((project, index) => (
            <article className="archive-card liquid-glass" key={project.id}>
              <Link href={`/projects/${project.id}`} className="archive-image">
                <Image
                  src={project.image}
                  alt={`${project.title} interface`}
                  fill
                  sizes="(max-width: 760px) 90vw, 45vw"
                  unoptimized={project.image.startsWith("/")}
                  className="object-cover object-top"
                />
              </Link>
              <div className="archive-info">
                <span className="eyebrow">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {project.categories.join(" · ")}
                </span>
                <h2>
                  <Link href={`/projects/${project.id}`}>
                    {project.title}
                    <Arrow diagonal />
                  </Link>
                </h2>
                <p>{project.description}</p>
                <div className="skill-tags">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
      </div>
      {!!projects.length && !filtered.length && (
        <div className="empty-projects liquid-glass">
          <h2>No projects match these filters.</h2>
          <p>Try a different category or technology.</p>
          <button
            className="text-link"
            onClick={() => {
              setCategory("All work");
              setTechnology("");
            }}
          >
            Clear filters <Arrow />
          </button>
        </div>
      )}
      {!projects.length && (
        <div className="empty-projects liquid-glass">
          <h2>No projects available right now.</h2>
          <p>Please check back soon, or explore my work on GitHub.</p>
          <a
            className="text-link"
            href="https://github.com/rudra273"
            target="_blank"
            rel="noreferrer"
          >
            Visit GitHub
            <Arrow diagonal />
          </a>
        </div>
      )}
    </>
  );
}
