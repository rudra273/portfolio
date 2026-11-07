import SpaceBackground from "@/components/background/SpaceBackground";
import Link from "next/link";
export default function ExplorePage() {
  return (
    <>
      <SpaceBackground />
      <div className="legacy-label liquid-glass">
        <span>THE PREVIOUS UNIVERSE</span>
        <p>The original space experiment, preserved.</p>
        <Link href="/">Return to the new portfolio ↗</Link>
      </div>
      <div
        style={{ height: "500vh" }}
        aria-label="Scroll to explore the original space scene"
      />
    </>
  );
}
