import Portfolio from "@/components/observatory/Portfolio";
import { getProjects } from "@/lib/projects";
export type { PortfolioProject as Project } from "@/components/observatory/Portfolio";
export const revalidate = 300;
export default async function Home() {
  const projects = await getProjects();
  return <Portfolio projects={projects} />;
}
