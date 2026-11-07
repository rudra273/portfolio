import Link from "next/link";
import ContactForm from "@/components/observatory/ContactForm";
import Arrow from "@/components/observatory/Arrow";
export default function ContactPage() {
  return (
    <div className="inner-page section-shell">
      <p className="eyebrow">OPEN A CONVERSATION</p>
      <h1>
        Good things start
        <br />
        <span className="muted">with a hello.</span>
      </h1>
      <div className="contact-grid">
        <div>
          <p className="inner-intro">
            Have a project in mind, a problem worth solving, or a question about
            my work? Send a message.
          </p>
          <a className="contact-email" href="mailto:rudramohanty45@gmail.com">
            rudramohanty45@gmail.com
            <Arrow diagonal />
          </a>
          <div className="contact-socials">
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
            <a
              href="https://leetcode.com/rudra273/"
              target="_blank"
              rel="noreferrer"
            >
              LeetCode ↗
            </a>
          </div>
        </div>
        <ContactForm />
      </div>
      <div className="inner-footer">
        <Link href="/">← Back to the observatory</Link>
        <span>Bangalore, India · Planet Earth</span>
      </div>
    </div>
  );
}
