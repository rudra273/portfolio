import Link from "next/link";
import { getProjects } from "@/lib/projects";
import ProjectArchive from "@/components/observatory/ProjectArchive";
export type { PortfolioProject as Project } from "@/components/observatory/Portfolio";
export const revalidate = 300;
export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="inner-page section-shell">
      <p className="eyebrow">EXPERIMENTS. EXPLORATIONS. WORKING SYSTEMS.</p>
      <h1>
        A collection
        <br />
        <span className="muted">of possibilities.</span>
      </h1>
      <p className="inner-intro">
        From AI assistants to real-time applications. A closer look at the
        things I’ve built and the ideas behind them.
      </p>
      <ProjectArchive projects={projects} />
      <div className="inner-footer">
        <Link href="/">← Back to the observatory</Link>
        <Link href="/contact">Have something in mind? ↗</Link>
      </div>
    </div>
  );
}
