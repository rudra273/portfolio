# Observatory development preview

Implemented on the existing `dev` branch. No deployment or push performed.

## What changed

- Replaced the homepage with a plain planetary hero, selected project presentations, a 3D probe with interactive discipline tabs, an about section, and contact.
- Added a compact menu dialog and a floating section dock. Tabs support arrow keys, Home and End; the menu uses native dialog focus handling.
- Added new planet and probe scene components. The probe is original procedural geometry, with separate solar wings, an optical core and orbital rings.
- Added moving glass tab highlights, layered glass surfaces, and responsive layouts.
- Restyled project archive, project details, about, contact and not-found pages. Preserved category and technology filtering, résumé access, source links, project data loading and the contact API.
- Suppressed the known illustrative demo addresses from the existing seed data. Real demo URLs from the data source remain supported.
- Switched the shared typography to the bundled Geist font, avoiding a remote font build dependency.
- Added static artwork for unavailable WebGL/reduced motion, deferred scene mounting until near the viewport, and stopped offscreen/hidden-tab animation loops.

## Preserved history

The original `src/components/background/` files, `PolishedSpaceBackground.tsx` and `StarField.tsx` are unchanged. The old scene is available at `/explore`, linked as “Previous universe” from the menu. The new homepage no longer mounts that original scene globally.

## Validation

- TypeScript check and production Next.js build passed.
- Desktop and mobile browser inspections covered the hero, project presentation, navigation, discipline tabs and project details.
- Arrow-key discipline selection and native dialog focus behavior checked.
- Project category filtering checked against the existing project data.
- Required contact fields block empty submissions; no test message was sent to the connected Google Sheet.
- Historical source preservation checked with Git.

The production build can be previewed with `npm run start -- --hostname 127.0.0.1`, after `npm run build`. Use `npm run dev` for further edits. Stop the preview before rebuilding, since both commands use `.next`.

This is a working first design implementation. Detailed cross-device frame-rate measurements and real-world Core Web Vitals have not been collected. Static fallbacks are implemented; this pass did not change system accessibility preferences to force reduced motion.

## Services revision

The skills panel now presents Generative AI, Software Development, and Business Automation with client-facing copy and service examples. The navigation label is Services; the existing section anchor is retained.

The satellite is no longer mounted. Its source remains for history. A new, independent service scene provides a connected particle core, translucent blocks that assemble, and orbital paths with traveling light pulses. Tab changes ease the sculptures in and out in the same canvas. Static SVG artwork supports reduced motion and unavailable WebGL; the existing viewport component pauses offscreen rendering.

Validation: TypeScript and an isolated production build passed. Browser checks covered all three tabs, arrow-key selection, desktop rendering, and a 390px mobile layout with no horizontal overflow. No browser console errors were observed. The isolated build used a temporary source copy to avoid disrupting the running development server.
