import Link from "next/link";
export default function NotFound() {
  return (
    <div className="inner-page section-shell">
      <p className="eyebrow">404 / OUTSIDE THE KNOWN UNIVERSE</p>
      <h1>
        A little
        <br />
        <span className="muted">off course.</span>
      </h1>
      <p className="inner-intro">
        This page couldn’t be found. Let’s get you back to familiar territory.
      </p>
      <Link href="/" className="light-button" style={{ marginTop: 35 }}>
        Back to the portfolio ↗
      </Link>
    </div>
  );
}
