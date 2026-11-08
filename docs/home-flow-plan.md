# Home page flow upgrade — "Event Horizon"

Planning date: 9 November 2026. Status: proposed; nothing below is built yet.
Builds on `space-redesign-plan.md`. The services carousel (intro card → three
cards → scroll-driven slide) is done and stays as is.

## The idea in one line

A black hole sits in the hero. The gold light ribbons already on the page are
**matter streaming off its accretion disk**. You follow that one stream down the
whole page; each section is a stop along it, and the page ends by falling back
into the black hole. One object and one stream link the whole page, so it feels
continuous rather than a stack of sections.

## What makes Edolus feel smooth (findings)

Checked on edolus.com, 8 November 2026:

- **It is not a scrolling page.** The document is exactly one screen tall
  (900 px at 1440×900). Everything is one PlayCanvas (3D engine) canvas with
  GSAP; the wheel moves a camera through one scene. "Sections" are camera
  stops, so nothing ever cuts or reloads.
- **One continuous world.** Earth hero → content cards → warm light ribbons are
  all in the same space and lighting, so transitions are camera moves, not
  page changes.
- **Depth, not just sideways.** Cards come toward you, things pass the camera,
  and only some steps are horizontal.
- **Eased input.** Wheel input is smoothed (inertia), so motion glides even
  with a notchy mouse.
- **Downside we should not copy:** content is locked behind an "Initiate
  system" gate and lives in the canvas, which hurts SEO, accessibility and
  first impression. We keep real HTML content and normal scrolling.

## How we get the same feel without rebuilding as a game engine

1. **Smooth scroll everywhere** — add Lenis (inertial smooth scrolling). This is
   the single biggest "smooth" win and also smooths the services carousel.
2. **One persistent "world" canvas** — a fixed, full-screen WebGL layer behind
   the whole home page holding the black hole and the light stream. A single
   scroll timeline (0 → 1 over the page) drives its camera and the stream's
   shape. HTML sections scroll on top. Because the world never unmounts, there
   are no visual cuts between sections.
3. **Scroll-scrubbed transitions between sections** — each boundary gets a short
   pinned moment where something moves in depth (zoom in, fly past, pull back),
   driven by the same timeline.
4. **Route transitions** — clicking a project card expands it into the project
   page using the View Transitions API, so even page changes feel like one motion.

## Visitor journey

| # | Section | What you see | Transition to next |
|---|---|---|---|
| 1 | **Hero — Event horizon** | A realistic black hole: dark shadow, thin bright accretion disk bent over and under it by gravity (the lensing look), a photon ring, one side brighter (Doppler beaming). Stars behind it subtly warped. Headline over it, as now. The disk slowly turns. | Scrolling pushes the camera toward the disk; a stream of gold light peels off the disk edge and flows down the screen. |
| 2 | **Statement interlude** *(new)* | One large sentence revealed word by word as you scroll, e.g. "I turn ideas into systems that think." The stream curves behind it. | The stream narrows into a point of light; the first project card grows out of that point. |
| 3 | **Selected work — depth flight** *(rebuilt)* | Project cards are stacked in depth, not in a row. Each scroll step flies the camera toward the next card: it grows, its screenshot sharpens and fills most of the screen ("zoom into the card"), details fade in, then it passes the camera and the next card is behind it. | The last card flies past and the services intro card is waiting behind it. |
| 4 | **Services** *(done)* | Intro card with the question mark, three cards join, row slides with scroll. Stream runs behind the glass. | The loop form on the last card unravels into the stream, which arcs down. |
| 5 | **About** | Portrait and timeline as now; the stream already arcs under the photo (keep). Timeline dots light up as the stream passes them. | Camera pulls back; the black hole reappears small and distant at the top. |
| 6 | **Contact — return** | Contact form and links; the stream curls back toward the distant black hole. On send, a pulse of light travels along the stream into the disk. | Footer: the black hole fills the view and fades to black (the loop closes). |

## Building blocks

| Component | What it is | Notes |
|---|---|---|
| `SmoothScroll` | Lenis wrapper in the home layout, exposes scroll progress | Off for reduced motion; native scroll then. |
| `WorldCanvas` | Fixed full-screen canvas behind the home page | One WebGL context for the black hole and stream; pauses when the tab is hidden. |
| `BlackHole` | Fullscreen ray-bending fragment shader | Original procedural shader: bends each pixel's ray around the mass, hits a noise-textured disk with a temperature gradient. Renders at ~0.5–0.75 resolution and is upscaled; quality tiers by device. Old `BlackHolePhenomenon.tsx` kept for history. |
| `LightStream` | The gold ribbons as one 3D tube or line bundle inside `WorldCanvas` | Control points change with scroll so the same stream takes each section's shape. Replaces the three SVG `LightSweep`s. |
| `StatementReveal` | Word-by-word scroll reveal | Plain HTML text; animation is decoration only. |
| `WorkFlight` | Pinned depth-stacked project cards | Cards are HTML with CSS 3D transforms (sharp text, real links); reuses the services carousel's scroll-easing code. |
| Route transition | Card → project page expand | `document.startViewTransition` around navigation (Next 14 has no built-in support). Falls back to a normal navigation. |

New dependencies: `lenis` only. GSAP is optional; our own scroll engine from
the services carousel covers most needs.

## Build order (one step at a time)

1. **Black hole hero** — `BlackHole` shader in the hero, replacing the planet
   (planet code stays). Static image fallback. *Biggest visual payoff; decide
   the look here first.*
2. **Smooth scroll** — Lenis plus a shared scroll-progress hook; check the
   services carousel still behaves.
3. **World canvas and light stream** — move the black hole into the fixed
   `WorldCanvas`; build `LightStream` coming off the disk; retire the SVG ribbons.
4. **Hero → statement → work** — statement interlude and the stream-to-card hand-off.
5. **Work depth flight** — rebuild Selected work as the zoom-through card stack.
6. **Work → services hand-off** and **about → contact pull-back** transitions.
7. **Project page transition** — card expands into `/projects/[id]`.
8. **Polish pass** — mobile layouts, reduced motion, low-power devices, frame
   rate, Lighthouse, keyboard and screen-reader check.

## Performance and accessibility rules

- All text, links and the contact form stay real HTML; the canvas is decoration
  (`aria-hidden`).
- Reduced motion: no Lenis, a still black hole image, sections without pinning.
- Low-power or mobile: fewer shader steps at lower resolution, or a short
  pre-rendered loop video of the black hole if the shader is too slow.
- One WebGL context on the home page where possible; the existing per-section
  canvases (planet, service form, probe) merge into `WorldCanvas` over time.
- Target 60 fps on a mid-range laptop; measure after step 1 and step 3.

## Decisions needed

1. **Planet or black hole?** Recommended: the black hole replaces the planet in
   the hero (the planet competes with it and the theme gets muddled).
2. **Realism level.** Recommended: real-time shader on desktop, video fallback
   on phones. Pure video everywhere is cheaper but can't react to scroll.
3. **Statement text** for the interlude (I can draft options).
4. **Entry gate** like Edolus's "Initiate system"? Recommended: no; content
   stays readable immediately.
