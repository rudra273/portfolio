# Portfolio redesign plan — Orbital Observatory

Planning date: 7 November 2026. Status: proposed direction; implementation has not started.

## Brief

Redesign Rudrapratap Mohanty's portfolio as a modern astronomy-themed experience with a quiet cinematic hero, minimal navigation, illuminated glass controls, and new three-dimensional objects integrated into the content. Preserve the existing space scene and model code for history. “Astro” is interpreted as astronomy art direction; retain the current Next.js framework.

The central concept is an orbital observatory: visitors arrive above a planet, follow a custom exploration probe into selected work, inspect engineering capabilities, learn about Rudra, and make contact. The portfolio must communicate his work quickly while rewarding exploration.

## Research and design takeaways

I opened the live sites below and inspected their rendered views. The Awwwards collection supplied the two additional examples. These are qualitative design observations, not performance measurements or source-code audits.

| Reference | Observed | Application to this portfolio |
| --- | --- | --- |
| [Edolus](https://edolus.com/) | Centered wordmark, large light-weight hero type, a planetary horizon, an entry control, satellite fly-through, compute hardware, and a later warm particle/light environment. The supplied third screenshot shows large translucent content cards within that environment. | Borrow the spacious composition, deliberate lighting and scene progression. Make the portfolio readable immediately, with work accessible without completing an introduction. |
| [dozfx](https://www.dozfx.com/) | A large reflective sculptural object shares the hero with oversized typography. A magenta-lit starfield continues into the next section. Controls are compact. | Use one distinctive physical object, convincing materials, and consistent lighting. Keep motion and color quieter to fit the requested plain hero. |
| [Serhii Lastovychenko](https://serhii.website/) | A recurring particle material, direct work/contact actions, large project presentations, and a personal journey provide continuity. | Carry one recognizable visual motif through the page and make actual projects the primary content. |
| [Awwwards 3D collection](https://www.awwwards.com/websites/3d/) | A broad selection of 3D-led experiences, including the two references above. | Use it as a discovery source; keep a single coherent space direction. |

Reference assets, branding, copy and models are not proposed for reuse. New assets should be original or properly licensed.

## Current implementation findings

- Next.js 14, React 18, TypeScript and Tailwind are already present, along with Three.js, React Three Fiber, Drei, postprocessing and Framer Motion.
- `src/app/layout.tsx` mounts one fixed `SpaceBackground` beneath all routes.
- `src/components/background/SpaceBackground.tsx` disables pointer events. The current scene functions as scenery behind conventional content panels.
- `SpaceScene.tsx` and `BlackHolePhenomenon.tsx` contain substantial procedural planets, galaxies, stars, camera motion and black-hole work. No standalone GLB/GLTF/OBJ file was found in the inspected project file list. Preserve the procedural source as the historical model implementation.
- The hero currently combines an online badge, typing roles, two buttons, six social icons and orbit decoration. The redesign should establish a simpler hierarchy.
- The existing fixed navigation is full-width and uses Base / Orbit / Missions / Transmit labels. The brand link leads to `/explore`, an empty five-viewport scene scroll route.
- Projects come from Google Sheets with local fallback through `src/lib/projects.ts`; the contact form submits to `/api/contact`. Retain these integrations.
- Existing routes are `/`, `/projects`, `/projects/[id]`, `/about`, `/contact` and `/explore`.
- Local project content includes Text-to-SQL, Stock Advisory, Code Assistant, Chat App and Hisab-Kitab. Existing screenshot assets can anchor the new work presentations.
- Several links contain obvious placeholders, including project demos, an X profile, phone text and Open Graph domain. Resolve or omit placeholders before release. Verify current employment information before updating copy.

## Art direction

Working title: **Orbital Observatory**. This is an internal design name, not a proposed replacement for Rudra's identity.

- Base: near-black navy `#04070D`; surfaces `#101722`.
- Type: soft white `#F4F6FA`; secondary text starts at `#AAB4C4`, subject to contrast verification on the final surfaces.
- Light: atmospheric blue `#77BFFF` with restrained solar amber `#E7B978` for warmth. Mostly neutral pages; color comes from light and materials.
- Materials: satin titanium, dark ceramic, optical glass and small emissive details. A consistent family of materials across all new models.
- Typography: one clean sans family with a light/regular display weight, readable body weight and optional mono labels. Use roughly 80–112 px desktop hero type and 40–56 px mobile type, adjusted to fit the full name and copy.
- Layout: generous negative space; alternate open compositions with a few substantial glass surfaces. Let projects have room for real screenshots.
- Atmosphere: sparse stars, a directional sunrise, soft haze and short light trails. Limit simultaneous effects so the main object stays legible.

## Visitor journey and layout

| Sequence | Content and layout | 3D role | Interaction |
| --- | --- | --- | --- |
| 1. Arrival | Full-height hero. Small centered RUDRA wordmark, compact Menu control, centered headline, role sentence and one primary work CTA. | Newly authored planet with a broad atmospheric rim. A small custom probe introduces the site's recurring object. | Slow rotation and restrained pointer parallax. Normal scroll always works. |
| 2. Selected work | First substantial section after the hero. Three editorial project presentations with large real screenshots, a clear summary and case-study links. | Probe moves to one side of the composition; its optical ring becomes a framing motif around the active project. | A small glass project selector changes the highlighted project and light direction. Every project also has a normal HTML link. |
| 3. Capabilities | Three glass tabs: AI Systems, Backend, Cloud & MLOps. Each opens a concise description, relevant tools and related project links. | An exploded view of the probe exposes its core, data paths and modular outer structure. | Tab selection highlights one assembly. All content remains accessible through keyboard and touch. |
| 4. About / trajectory | Portrait, short biography, career milestones and a clearly labeled résumé link. | A thin orbital path with a few markers complements the timeline. | Small progress cues while scrolling; dates and roles remain static, readable text. |
| 5. Contact | Spacious closing statement, email, selected social links and a short contact form. | Probe antenna faces a distant light; one gentle signal pulse accents the CTA. | Clear form feedback; animation never represents delivery status. |

Proposed hero copy, to refine during design:

> RUDRAPRATAP MOHANTY
>
> ENGINEERING INTELLIGENT SYSTEMS.
>
> AI systems, backend engineering, and MLOps.
>
> Explore my work ↗

At desktop widths, use a large centered headline above a cropped planetary arc in the lower half. Keep the brightest atmospheric rim away from the letterforms. The probe is a secondary visual in the hero; it becomes more prominent after the first scroll.

The first viewport should answer who Rudra is, what he does and where to see his work. Do not require an “enter experience” click or a long cinematic preloader. Audio is optional future polish, off by default if added.

## Navigation and page behavior

- Replace the full-width bar with a small wordmark and a floating Menu capsule.
- After leaving the hero, reveal a compact bottom glass dock: Work / Expertise / About / Contact. These are clearly labeled section links with an active indicator.
- Menu opens a concise overlay with all main destinations, résumé, GitHub and LinkedIn. Support Escape, focus management and keyboard navigation.
- Preserve direct URLs for project listing and details, about and contact. A visitor arriving at a deep link should see that content immediately.
- The wordmark returns to `/`. Keep `/explore` available as a clearly labeled legacy scene destination during the migration, using the preserved scene when implementation begins.
- Use ordinary vertical scrolling. Any sticky scene sequence is short and supports quick navigation to another section. No mandatory horizontal scroll journey.
- On mobile, use stacked project presentations, simplified model placement and a compact touch-friendly dock with safe-area spacing.

## Glass and liquid controls

The user's lighting observation is central: glass appears convincing when it has a visibly varied scene behind it. Each glass surface needs a controlled light source and a quiet reading area.

- A smoked translucent fill, roughly 16–24 px backdrop blur as an initial tuning range, a fine bright upper edge, a darker lower edge and a faint inner highlight.
- Broad cool and warm light sources behind the sides or lower edges of panels. Keep high-frequency particles and bright streaks away from text.
- The active tab uses a rounded translucent indicator that moves smoothly between labels. Add a short highlight sweep and a slight spring settle.
- Use modest tilt only on appropriate pointer-driven cards; keep text and hit targets stable. Touch gets direct selection without a hover dependency.
- Larger project surfaces are clearer and less distorted than the small navigation capsules.
- Standard CSS glass is the baseline. Actual refraction can be explored for one small decorative lens if it improves the result within the performance budget. Do not rely on expensive full-screen refraction or put essential text inside a shader.
- Provide an opaque surface fallback when blur/transparency is unsupported or compromises readability. Verify contrast throughout the animated lighting cycle.

## New 3D asset plan

| Asset | Appearance and purpose | Production approach |
| --- | --- | --- |
| Planet and atmosphere | Cropped, photoreal-inspired planetary arc with blue atmospheric light, sparse clouds and a shadowed surface. | New sphere geometry, licensed/original texture maps and a lightweight atmospheric material; create a matching still fallback. |
| Signature orbital probe | Compact titanium/ceramic body, one offset optical ring, a small amber core and believable mechanical details. Recognizable as a space instrument. | Author an original model, split into a few meaningful parts for the capabilities sequence; export an optimized GLB. Procedural geometry is suitable for the initial composition prototype. |
| Probe interior | Core, paired data paths and a few modular shells that relate to AI, backend and infrastructure. | Reuse the probe's geometry and materials; animate an exploded configuration instead of loading an unrelated model for every section. |
| Signal and orbit details | Thin arcs, a few nodes and restrained signal pulses. | Lightweight curves/instanced geometry or DOM/SVG where sufficient. |

Validate silhouette and lighting in a graybox prototype before spending time on detailed asset production. Record asset provenance and usage rights. Keep editable source alongside optimized exports where practical. Generative raster images may support posters or mood exploration, but do not substitute for the interactive meshes.

The implementation should visibly demonstrate: an object changing angle with scroll, a component changing configuration with a tab, and consistent shadows/highlights across those states. These distinguish the intended experience from a decorative background.

## Technical implementation proposal

Retain the existing framework and rendering libraries. A framework migration adds work without contributing to the visual goal.

- Build a new `src/components/experience/` area for the scene, scroll coordination, quality settings and new model components. Do not overwrite the old scene files.
- Build navigation, glass tabs, project presentations and content as semantic HTML/React components. The canvas enriches the composition; text, links and forms are independently usable.
- Prefer one active WebGL canvas on a route, with section-aware object positioning and visibility. Avoid separate continuously running canvases for every card.
- Render portfolio content and a hero poster before the optional 3D bundle is ready. Defer model loading and load later details on demand.
- Keep project fetching in the existing data layer. Use stable project IDs for scene selection and retain local fallback data.
- Use the existing motion tools for interface transitions and scene state interpolation. Choose any additional scrolling dependency only after the prototype demonstrates a need.
- Add reduced-motion, WebGL-failure and low-performance paths. Reduced motion uses composed stills or stationary objects; it retains the same navigation and content.
- Pause continuous rendering when the tab is hidden and avoid off-screen work. Use adaptive resolution/effect quality based on measured behavior.
- Project details receive the same visual language with calmer rendering: overview, actual screenshots, problem, approach, stack, available evidence and verified links. Do not invent outcomes or numerical claims.
- Update title, Open Graph image, sitemap and navigation consistently with retained routes. Verify the real production domain before replacing placeholders.

## Preserve the old work

Keep the following source files intact during the redesign:

- `src/components/background/SpaceBackground.tsx`
- `src/components/background/SpaceScene.tsx`
- `src/components/background/BlackHolePhenomenon.tsx`
- `src/components/PolishedSpaceBackground.tsx`
- `src/components/StarField.tsx`

During implementation, detach the old global scene from the primary layout and expose it through `/explore` with a legacy label. Record the old entry points and dependencies in a short archive note. This preserves inspectable source and an accessible historical experience without loading it on the redesigned homepage. Preserve any additional old assets discovered during implementation.

## Build sequence and reviewable outputs

1. **Composition prototype:** desktop and mobile hero, the glass dock, one project presentation, and a coarse probe/planet scene. Deliver a runnable local preview of the visual direction.
2. **Asset and motion prototype:** finalize the new probe, planet, lighting and first scroll transition. Demonstrate one capabilities tab with an exploded assembly. Measure rendering cost before extending the scene.
3. **Homepage:** build the complete five-part journey with real portfolio content, project links and responsive layouts.
4. **Inner pages and history:** redesign project listing/detail, about and contact; connect the legacy scene route; retain integrations and URLs.
5. **Polish and validation:** tune glass/materials, inspect mobile and keyboard paths, test motion fallbacks, verify contact behavior safely, audit placeholders and measure performance.

Completion criteria for the redesign:

- The hero has the intended quiet Edolus-like scale and spacing, with Rudra's own copy and assets.
- At least two visible interactions involve the new 3D object within the content composition.
- Visitors can open a project or reach contact without completing a long animation.
- All existing project data and meaningful routes remain available.
- The old scene implementation and assets remain present and reachable through the historical route.
- Keyboard focus, tab semantics, readable contrast and touch controls work throughout.
- The site works when WebGL is unavailable and when reduced motion is enabled.
- No content is hidden indefinitely by loading or animation state.
- Validate layout at representative widths around 360, 390, 768, 1440 and 1920 px, including safe areas and zoom.
- Aim for 60 fps on a representative desktop and stable 30 fps or better on a representative midrange phone; lower rendering quality when necessary. These are acceptance targets, not measured results.
- Target LCP at or below 2.5 s, CLS at or below 0.1 and INP at or below 200 ms under an agreed test setup, then verify with real-user measurements when available. Keep the initial 3D transfer around 3 MB or less as a provisional budget; load later detail separately.
- Run the production build and targeted checks for navigation, project loading/fallbacks and form states. Browser-check supported desktop/mobile environments before release.

## Scope for this pass

Research and this plan only. No website source, existing 3D file, dependency, deployment or external content was changed. The next implementation milestone is the composition prototype in step 1.
