export default function JsonLd() {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Rudrapratap Mohanty",
            "url": "https://rudrapratap-mohanty.vercel.app",
            "jobTitle": "Software Developer",
            "sameAs": [
              "https://github.com/rudra273",
              "https://www.linkedin.com/in/rudrapratap-mohanty-2b57041b5"
            ],
            "knowsAbout": ["Software Development", "Backend Development", "MLOps", "DevOps"],
            "worksFor": {
              "@type": "Organization",
              "name": "Sigmoid" 
            }
          })
        }}
      />
    );
  }

  