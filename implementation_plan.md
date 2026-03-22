# Immersive 3D Space Scroll Homepage

Transform the portfolio homepage into a true **3D space flythrough** experience. As the user scrolls, the camera moves forward through space, passing planets, nebulae, and asteroid belts — with your content (hero, skills, projects, footer) floating as holographic panels at different Z-depths along the journey.

## User Review Required

> [!IMPORTANT]
> This is a **full rewrite of the homepage** ([page.tsx](file:///Users/rudrapratapmohanty/Desktop/projects/portfolio/src/app/page.tsx)) and a significant upgrade to [SpaceBackground.tsx](file:///Users/rudrapratapmohanty/Desktop/projects/portfolio/src/components/SpaceBackground.tsx). All existing content (hero, skills, featured projects, footer) is preserved — only the presentation changes. Other pages (`/projects`, `/contact`, etc.) are untouched.

> [!WARNING]
> The 3D scene adds GPU load. Performance will still be good on modern devices, but older phones may see lower FPS. We use `dpr={[1, 1.5]}`, frustum culling, and minimal geometry to keep things fast.

## Proposed Changes

### 3D Background Engine

#### [MODIFY] [SpaceBackground.tsx](file:///Users/rudrapratapmohanty/Desktop/projects/portfolio/src/components/SpaceBackground.tsx)

Currently: a fixed R3F canvas with slow-rotating stars and cosmic dust. Camera stays still.

**After:** The canvas listens to the page scroll position (via a shared React context or `window.scrollY`) and **moves the camera forward along the Z-axis** as the user scrolls. This creates the effect of flying through space.

Key additions:
- **`ScrollCamera`** — a component inside the Canvas that reads `scrollY` and interpolates `camera.position.z` from `10` → `-200` (or similar range) over the full page scroll height
- **StarTunnel effect** — stars are distributed in a long tunnel (Z range `+10` to `-250`), so the camera flies _through_ them. Stars streak past as you scroll.
- **Speed lines** — faint line geometry radiating from center when scrolling, to enhance the feeling of velocity
- **Nebula clouds** — 3-4 semi-transparent sprite planes with radial gradient textures placed at different Z-depths, giving a volumetric cloud feel as you fly by them

---

#### [NEW] [SpaceEnvironment.tsx](file:///Users/rudrapratapmohanty/Desktop/projects/portfolio/src/components/SpaceEnvironment.tsx)

3D objects placed at specific Z-depths along the scroll path:

| Object | Z-position | Description |
|--------|-----------|-------------|
| **Planet 1** (gas giant) | z = −30 | A large sphere with a ring, off to the right. Slowly rotates. |
| **Asteroid Belt** | z = −60 to −80 | Small randomised icosahedron meshes orbiting in a disc. |
| **Planet 2** (ice world) | z = −120 | Smaller blue-white sphere to the left. |
| **Distant Galaxy** | z = −180 | A flat disc with spiral arm texture (sprite). |

All objects use simple Three.js geometry + `MeshStandardMaterial` (no heavy textures needed — procedural colors + emissive glow).

---

### Homepage Scroll Layout

#### [MODIFY] [page.tsx](file:///Users/rudrapratapmohanty/Desktop/projects/portfolio/src/app/page.tsx)

Turn the page into a **very tall scroll container** (`height: 500vh` or similar) that drives the 3D camera. Content sections are positioned at scroll-linked breakpoints using Framer Motion's `useScroll` / `useTransform`:

```
Scroll Position    →  Content Visible         →  3D Environment
0vh – 100vh        →  Hero (name, typing)     →  Open space, slow drift
100vh – 200vh      →  Skills (glass cards)    →  Pass Planet 1
200vh – 350vh      →  Featured Projects       →  Asteroid belt fly-through
350vh – 450vh      →  Footer / Contact        →  Approach distant galaxy
450vh – 500vh      →  Fade to black           →  Deep void
```

Each section is wrapped in a `<div>` that:
1. Uses `position: sticky` + `top: 0` to pin itself while the scroll range is active
2. Uses Framer Motion `useTransform` to fade in/out and scale based on scroll progress
3. Has glassmorphism styling so it feels like a holographic HUD floating in space

The overall structure:
```tsx
<div style={{ height: '500vh' }}>
  {/* HeroPinnedSection: sticky, visible 0-100vh scroll */}
  {/* SkillsPinnedSection: sticky, visible 100-200vh scroll */}
  {/* ProjectsPinnedSection: sticky, visible 200-350vh scroll */}
  {/* FooterPinnedSection: sticky, visible 350-500vh scroll */}
</div>
```

---

### Styles

#### [MODIFY] [globals.css](file:///Users/rudrapratapmohanty/Desktop/projects/portfolio/src/app/globals.css)

Add:
- `.space-section` — base styles for each pinned scroll section (full viewport, sticky positioning, flex centering)
- `.hud-panel` — a holographic HUD glass panel effect (cyan border glow, scanline overlay)
- `.speed-indicator` — a subtle UI element at the screen edge showing scroll‐velocity as a bar

---

### Layout (minor)

#### [MODIFY] [layout.tsx](file:///Users/rudrapratapmohanty/Desktop/projects/portfolio/src/app/layout.tsx)

No structural changes — [SpaceBackground](file:///Users/rudrapratapmohanty/Desktop/projects/portfolio/src/components/SpaceBackground.tsx#87-101) already renders as a fixed canvas at `z-0`, and `<main>` renders content at `z-10`. The scroll-linked camera is self-contained inside the SpaceBackground canvas.

---

## Verification Plan

### Automated Tests
- Run `npm run build` in the project directory to ensure TypeScript compiles and Next.js builds successfully with no errors.

### Browser Verification
- Open `http://localhost:3000` in the browser
- Verify:
  1. **3D background renders** — stars visible, camera at starting position
  2. **Scroll moves camera** — scrolling down shows stars flying past, planets approaching and passing by
  3. **Content sections appear** — hero text visible at top, skills appear mid-scroll, projects appear further, footer at end
  4. **Glassmorphism panels** — content panels have glass/holographic look
  5. **Mobile responsiveness** — viewport resize to mobile width; content still visible and scroll still works
  6. **Performance** — smooth 30+ FPS on scroll (no major jank)
