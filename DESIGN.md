---
name: Narrative Mechanics — Asphalt & Ivory
description: "An industrial editorial system for strategy, market legibility, and mediated trust."
colors:
  background: "#131313"
  void: "#0e0e0e"
  surface: "#1c1b1b"
  industrial: "#262626"
  text: "#f5f3f0"
  muted: "#cfc4c5"
  orange: "#f97316"
typography:
  display: "Space Grotesk 700"
  body: "Inter 400/500/600"
  label: "Space Grotesk 700, uppercase, 0.1em tracking"
spacing:
  base: "8px"
  container: "1440px"
  desktopMargin: "64px"
  mobileMargin: "20px"
shapes:
  radius: "0px"
---

# Narrative Mechanics — Asphalt & Ivory

## North star

Site feels like strategy transmitted through industrial publishing equipment: direct, nocturnal, precise, and slightly unstable. Visual tension serves hierarchy. Long-form reading remains calm.

## Palette

- `#131313`: main background.
- `#0e0e0e`: deepest panels, navigation, footer, contact stage.
- `#1c1b1b` and `#262626`: layered industrial surfaces.
- `#f5f3f0`: primary text and structural contrast.
- `#cfc4c5`: secondary text.
- `#f97316`: only brand accent; actions, active states, rules, status.

Orange stays below roughly 10% of each viewport. No blue, yellow, gradients pretending to be light, glass, blur, or soft shadows.

## Typography

- Space Grotesk carries display, navigation, labels, numbers, and controls. Large titles use tight leading and negative tracking.
- Inter carries paragraphs, descriptions, form fields, and long-form content.
- Display text may use a restrained orange offset shadow. Body text never uses glitch effects.
- Reading measure stays near 65–75 characters.

## Layout

- Fixed-fluid 12-column desktop grid and stacked four-column mobile rhythm.
- Container maximum: 1440px. Desktop gutter: 64px. Mobile gutter: 20px.
- Home uses broken grids, controlled overlap, terminal windows, data grids, and hard offsets.
- Editorial pages use industrial framing around restrained, single-column prose.
- Every surface uses square corners. Depth uses hard black or gray offsets, never blur.

## Components

- Top bar: orange signal strip with contextual page message.
- Navigation: floating black panel, thin gray outline, orange active state, bracketed route labels.
- Primary action: orange or ivory fill, black text, hard offset shadow.
- Secondary action: dark fill, orange outline.
- Terminal panel: dark surface, thin outline, compact status header, optional hard shadow.
- Form: dark controls with bottom rules, explicit labels, visible errors, native dialog.
- Footer: oversized DIEGO wordmark, orange outline, compact real navigation.

## Motion and access

- Use only transform and opacity for movement.
- Hover motion stays within 2–8px and never hides meaning.
- `prefers-reduced-motion` disables reveal, glitch, and transition effects.
- All text and controls meet WCAG AA. Focus ring uses signal orange.
- Scanlines and grids remain pointer-transparent and decorative.

## Content and implementation rules

- Keep Narrative Mechanics copy, routes, SEO, JSON-LD, contact API, and native dialog.
- Never copy Foreign Rodeo branding, fake warnings, fake metrics, or placeholder links from design reference.
- No Tailwind runtime, Material Symbols, decorative remote assets, or new framework.
- CSS tokens in `styles/tokens.css` are palette source of truth.
- Home composition lives in `styles/home.css`; shared shell and editorial overrides remain layered.
