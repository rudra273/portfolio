import Image from "next/image";
import Link from "next/link";
import Arrow from "@/components/observatory/Arrow";
import { careerTimeline } from "@/career";
export default function AboutPage() {
  return (
    <div className="inner-page section-shell">
      <p className="eyebrow">A LITTLE MORE ABOUT ME</p>
      <h1>
        Always building.
        <br />
        <span className="muted">Always looking up.</span>
      </h1>
      <div className="about-detail-grid">
        <div className="about-detail-photo">
          <Image
            src="https://res.cloudinary.com/dldkrpbjt/image/upload/v1774436299/profile/rudra.jpg"
            alt="Rudrapratap Mohanty"
            fill
            sizes="(max-width: 760px) 90vw, 40vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="about-detail-copy">
          <p>
            I’m Rudrapratap Mohanty, a software and MLOps engineer based in
            Bangalore. My work connects backend engineering, cloud
            infrastructure, and applied AI.
          </p>
          <p>
            I build APIs and services with Django and FastAPI, and work with
            containers, cloud platforms, and machine learning workflows. Lately,
            my curiosity has taken me deeper into LLM engineering and agentic
            systems with LangChain and LangGraph.
          </p>
          <p>
            Outside of work, I enjoy algorithmic challenges and exploring the
            ideas that make technology interesting. Space and astronomy have
            always been part of that curiosity. This portfolio is a small
            expression of both worlds.
          </p>
          <a
            className="light-button"
            href="https://drive.google.com/drive/folders/1BWzQhsPt2WGACNzpWYfq_etNg2654N7Y?usp=drive_link"
            target="_blank"
            rel="noreferrer"
          >
            View my résumé
            <Arrow diagonal />
          </a>
        </div>
      </div>
      <div className="career-strip">
        {careerTimeline.map((item) => (
          <div key={item.date}>
            <span>{item.date}</span>
            <h3>{item.title}</h3>
            <p>{item.role}</p>
          </div>
        ))}
      </div>
      <div className="inner-footer">
        <Link href="/">← Back to the observatory</Link>
        <Link href="/contact">Let’s build something together ↗</Link>
      </div>
    </div>
  );
}
