/** Existing seed data contains illustrative demo addresses; don't expose them as working demos. */
export function hasLiveDemo(url: string) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      ["https:", "http:"].includes(parsed.protocol) &&
      ![
        "project1.com",
        "code-assistant-demo.com",
        "text-to-sql-demo.com",
        "stock-adv-demo.com",
      ].includes(parsed.hostname)
    );
  } catch {
    return false;
  }
}
