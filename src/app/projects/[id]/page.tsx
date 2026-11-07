import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/projects";
import { hasLiveDemo } from "@/lib/projectLinks";
import Arrow from "@/components/observatory/Arrow";
import type { PortfolioProject } from "@/components/observatory/Portfolio";
export type { PortfolioProject as Project } from "@/components/observatory/Portfolio";
export const revalidate = 300;
export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const projects: PortfolioProject[] = await getProjects();
  const project = projects.find((p) => String(p.id) === params.id);
  if (!project) notFound();
  return (
    <article className="inner-page section-shell project-detail">
      <Link href="/projects" className="text-link">
        ← All projects
      </Link>
      <div className="project-detail-heading">
        <div>
          <p className="eyebrow">{project.categories.join(" / ")}</p>
          <h1>{project.title}</h1>
        </div>
        <div className="project-actions">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              className="light-button"
              target="_blank"
              rel="noreferrer"
            >
              View source
              <Arrow diagonal />
            </a>
          )}
          {hasLiveDemo(project.liveUrl) && (
            <a
              href={project.liveUrl}
              className="text-link"
              target="_blank"
              rel="noreferrer"
            >
              Live demo
              <Arrow diagonal />
            </a>
          )}
        </div>
      </div>
      <div className="detail-lead-image">
        <Image
          src={project.image}
          alt={`${project.title} application overview`}
          width={1400}
          height={900}
          sizes="(max-width: 760px) 100vw, 90vw"
          unoptimized={project.image.startsWith("/")}
          className="w-full h-auto"
          priority
        />
      </div>
      <div className="detail-body">
        <div>
          <p className="eyebrow">THE IDEA</p>
          <h2>About the project.</h2>
          <p className="detail-description">{project.description}</p>
          <h2>What it does.</h2>
          <ul>
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
        <aside className="detail-stack liquid-glass">
          <p className="eyebrow">BUILT WITH</p>
          <div className="skill-tags">
            {project.techStack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <p className="eyebrow">
            PROJECT / {String(project.id).padStart(2, "0")}
          </p>
        </aside>
      </div>
      {project.images.filter((image) => image !== project.image).length > 0 && (
        <section className="detail-gallery" aria-label="Project screenshots">
          {project.images
            .filter((image) => image !== project.image)
            .map((image, index) => (
              <figure key={image}>
                <Image
                  src={image}
                  alt={`${project.title} — application view ${index + 1}`}
                  width={1200}
                  height={800}
                  sizes="(max-width: 760px) 95vw, 80vw"
                  unoptimized={image.startsWith("/")}
                  className="w-full h-auto"
                />
                <figcaption>
                  {project.title} <span>0{index + 1}</span>
                </figcaption>
              </figure>
            ))}
        </section>
      )}
      <div className="inner-footer">
        <Link href="/projects">← Explore more projects</Link>
        <Link href="/contact">Let’s build something together ↗</Link>
      </div>
    </article>
  );
}
