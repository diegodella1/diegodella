---
name: Narrative Mechanics
description: "A personal authority platform built around the idea that the market decides before the search begins."
colors:
  primary: "#1a1a1a"
  background: "#f5f0e8"
  surface: "#ffffff"
  yellow: "#ffcc00"
  red: "#c52f24"
  blue: "#0055ff"
  muted: "#4a4a4a"
typography:
  display:
    fontFamily: "Space Grotesk"
    fontSize: "clamp(3rem, 7vw, 5.8rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Space Grotesk"
    fontSize: "clamp(2rem, 4vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.55
  label:
    fontFamily: "Space Grotesk"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.2
    minSize: "0.75rem"
rounded:
  none: "0px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    border: "2px solid {colors.primary}"
    padding: "14px 24px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    border: "2px solid {colors.primary}"
    padding: "14px 24px"
---

# Design System: Bauhaus Neo-Brutalist

## North Star

**Form follows function.**

The site should feel bold, raw, commercial, and legible. It is not a soft editorial archive and not a standard consultant WordPress theme. It is a public thesis with a clear offer: Diego helps founders make strong work understandable before the market has already decided.

## Visual Character

- Large geometric type.
- Thick black borders.
- Flat color blocks.
- Square corners.
- Offset black shadows only when depth is useful.
- One dominant claim per viewport.
- Compact internal pages that behave like ledgers, not long decorative scroll.

## Colors

- **Primary** (`#1a1a1a`): Text, borders, dark sections, primary buttons.
- **Background** (`#f5f0e8`): Warm off-white base.
- **Surface** (`#ffffff`): Dense cards, ledgers, modal surfaces.
- **Accent Yellow** (`#ffcc00`): Primary highlight, active states, strong CTA contrast.
- **Accent Red** (`#c52f24`): Rare urgency or geometric emphasis.
- **Accent Blue** (`#0055ff`): Links, focus, interactive emphasis.
- **Muted** (`#4a4a4a`): Secondary text only.

No gradients, glass, glow, soft shadows, beige-on-beige softness, or AI-style atmospheric backgrounds.

## Typography

- **Headlines / Labels:** Space Grotesk, bold, uppercase when used as signage.
- **Body:** Inter, readable and direct.
- **Scale:** Display text should be dramatically larger than body text, but capped so it does not overflow on mobile.
- **Letter spacing:** Never tighter than `-0.04em`.
- **Paragraph measure:** 65-75 characters max for prose.

## Layout

- Home page uses high-contrast sections with strong horizontal cuts.
- Internal pages use compact ruled ledgers and two-column blocks to reduce vertical scroll.
- Cards are only for distinct repeated items or framed tools. Do not nest cards.
- Use asymmetry for emphasis, not confusion.
- Every page should quickly answer: what is this, why should I care, where do I go next?

## Components

### Buttons

Solid fill or white fill, thick black border, uppercase label, square corners. Hover inverts or switches to yellow. Focus uses blue outline.

### Cards / Ledgers

Thick black border, white surface, square corners. Offset shadow may be used for home cards. Internal ledgers should stay denser with strong rules and minimal scroll.

### Navigation

Primary routes: `Idea`, `Frameworks`, `Essays`, `Work`, `About`. `Start` is a contextual route from Home and the footer, not a sixth primary destination.

The navbar brand is `NARRATIVE MECHANICS`. Personal attribution and footer identity remain `DIEGO`.

### Forms

Bottom-border inputs, clear labels, high contrast, no rounded fields.

Contact uses one native dialog flow everywhere. Direct email remains visible inside it as recovery, not as a competing primary path.

### Discovery

- Start shows three recommended routes before exposing the full library.
- Essays may be filtered by topic without removing content from the underlying HTML.
- Custom framework names must be paired with plain-language “use this when” context at entry points.

## Rules

- Lead with: `The market decides before the search begins.`
- Explain the commercial problem before exposing the full archive.
- Make `Start with the thesis` and `Work with Diego` visible early.
- Do not make the site feel like a default WordPress theme.
- Do not make the internals feel like a separate design system.
- Do not add decorative scroll for its own sake.
- Do not hide the advisory offer under essays.
