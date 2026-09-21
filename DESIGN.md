---
name: "Narrative Mechanics — Obsidian, Orange & Lime"
description: "Expressive ideas, practical products, and calm editorial reading."
colors:
  paper: "#0a0a0d"
  paper-2: "#070709"
  paper-3: "#18181e"
  surface: "#131317"
  surface-2: "#222228"
  surface-accent: "#2a170f"
  ink: "#ffffff"
  ink-2: "#d4d4db"
  ink-3: "#a2a1ab"
  muted: "#b7b6c0"
  accent: "#ff5500"
  accent-hover: "#ff9664"
  lime: "#d4f028"
  highlight: "#2b1b13"
  error: "#ffb4ab"
  panel-border: "#35333d"
  border-light: "#66636e"
  on-accent: "#111111"
typography:
  display:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(3.5rem,5.6vw,5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(28px,3vw,40px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-.035em"
  article-title:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(32px,4.6vw,64px)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-.03em"
  article-deck:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.6
  title:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(1.4rem,2.2vw,1.9rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-.025em"
  body:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(18px,1.5vw,20px)"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: ".06em"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
  lg: "0.75rem"
  control: "5px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "3rem"
  xl: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper-2}"
    rounded: "{rounded.control}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.paper-2}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "14px 24px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  navigation:
    backgroundColor: "#070709f2"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.lg}"
    width: "min(calc(100% - 40px),1160px)"
  feature-card:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "32px"
---

# Design System: Narrative Mechanics

## Overview

**Creative North Star: "Obsidian, Orange & Lime"**

The approved reference pairs a nearly black canvas with emphatic Syne headlines, orange actions, and lime signals. Local gradients and a floating navigation panel give the identity energy; generous spacing keeps content legible.

The homepage keeps its thesis-led gradient hero, then presents restrained section headings, three essay rows, six products, and two operating case studies. This sequence belongs to the homepage, not every page. Long-form articles use a shared title, explanatory deck, and one publication line before calm reading bodies; opening diagrams follow the first paragraph.

**Key Characteristics:**

- Nearly black surfaces with orange and lime accents.
- Syne headlines, Space Grotesk prose, and JetBrains Mono labels.
- Floating navigation, rounded panels, and localized glow.
- Quiet reading bodies and responsive layouts that fit 320px.

## Colors

### Primary

Orange (`accent`) identifies primary actions, selected intent nodes, and signature details. The softer `accent-hover` supports editorial kickers and title emphasis; primary homepage buttons instead turn lime on hover.

### Secondary

Lime (`lime`) marks focus, navigation activity, selected filters, and the lime feature-card variant. Legacy yellow and gold aliases resolve to this same accent.

### Neutral

`paper` is the page canvas; `paper-2` is the deeper footer and panel foundation. `surface` and `surface-2` distinguish inset areas. White `ink` carries headlines, `ink-2` carries paragraphs, and `muted` carries supporting metadata. `panel-border` separates panels; `border-light` supports stronger legacy boundaries. `error` identifies contact errors. `on-accent` remains the legacy control foreground; new orange/lime actions use the deeper `paper-2` foreground.

**The Local Accent Rule.** Keep the headline gradient on the homepage thesis hero, with localized glow on featured panels and primary actions. Section headings use one plain title rather than paired slogans. The subtle dotted background belongs to the homepage; article bodies stay visually quiet.

## Typography

The frontmatter records the desktop homepage display, section headline, feature-card title, reading body, and card-label roles. These are role-specific scales, not a universal heading reset.

- The homepage retains its large uppercase thesis and gradient. Its display uses the frontmatter scale at 1024px and wider, `clamp(3rem,7.3vw,6rem)` with 1.0 leading at 641–1023px, and Syne 700 at `clamp(2rem,9.2vw,3rem)` below 641px.
- Section headings and the contact heading use Syne 700 at `clamp(28px,3vw,40px)`, with natural case. Section headings have 1.15 leading. Do not reuse the earlier 64px uppercase section scale or paired gradient slogans.
- Shared article titles use the frontmatter article-title scale, natural case, balanced wrapping, and a 24ch maximum. At 640px and below they use 30px. The article deck uses the frontmatter scale with a 64ch maximum and drops to 18px on small screens.
- The single publication line uses Space Grotesk 400 at 12px/1.7, normal case and tracking, and muted color. It contains published date, updated date, and author; it is not a mono label.
- General informational page heroes use `clamp(30px,4vw,56px)`, natural case, and balanced wrapping. Reading section titles use Syne 700 at `clamp(23px,2.4vw,32px)` with 1.2 leading.
- Footer name uses Syne 700 at `clamp(2rem,3.5vw,3rem)` on two intentional lines, reduced to 24px at 640px and below. Navigation brand uses Syne 700, 16px normally and 12px on small screens.
- Reading paragraphs use the frontmatter body scale and a 68ch maximum, align left, and disable automatic hyphenation. First letters inherit body styling: no drop caps. Mono labels remain compact card/navigation metadata, never the reading body.

Fonts are local WOFF2 assets, with Latin and Latin-extended subsets and `font-display: swap`. `fonts.css` declares Syne 700/800, Space Grotesk 400/500/600, and JetBrains Mono 400/600. Keep the corresponding SIL Open Font License 1.1 notices in `public/fonts/` with redistributed assets. Sans-serif and monospace fallbacks remain available without font loading.

## Layout

The homepage container is capped at 1280px with 20px side gutters. General content uses a 1240px inner maximum; reading content uses an 1100px outer maximum and 68ch text measure. Outer container width is distinct from paragraph measure.

Product grids use three equal columns and 24px gaps; they become two columns below 1024px and one below 641px. The operating-experience grid uses 1.2fr/1fr; the featured thesis uses 1.3fr/1fr with a 64px gap, reduced to 32px below 1024px. Both stack on small screens. Section heading descriptions move below their headings below 1024px.

The three homepage essay rows use title/description/action columns (`minmax(0,1fr) minmax(0,1.3fr) auto`), 28px gaps and vertical padding, and a bottom border. At 640px and below they stack with 12px gaps and 24px vertical padding. Row titles are 24px/700; their hover state is lime.

Homepage sections have 88px vertical padding, reduced to 56px below 641px. Cards use 32px padding, experience cards 48px, and both use 24px on small screens. The homepage hero uses 70px/80px top/bottom padding and 36px/56px on small screens.

Fixed navigation sits 24px from the top, capped at 1160px, with a 64px minimum inner height. At 640px and below it sits 12px from the top, has `calc(100vw - 24px)` width, and a 60px minimum inner height. Body top clearance is 108px normally and 92px on small screens. Anchors have 120px scroll clearance.

Preserve the final 320px adjustments: shrinkable thesis children, a `minmax(0,1fr)` mobile thesis track, 26px/700 thesis title, 16px intent inset, 12px intent node text and padding, 28–40px/700 contact heading, and a readable navigation brand beside a nonshrinking menu toggle.

The final `design` cascade layer is the visual override contract. Earlier layers retain page-specific diagram and editorial geometry. Do not remove those layers to simplify styling or revive old visual decisions from them.

## Elevation & Depth

Depth combines dark tonal panels, thin borders, small radii, and selective ambient shadows. Navigation uses `0 16px 40px -22px #000` with 14px backdrop blur; the contact dialog uses `0 24px 80px -24px #000`. Primary homepage actions use `0 10px 30px -16px #ff550099`. Most content cards have no shadow.

Featured thesis and contact panels use restrained orange radial washes. Text gradients run at 105 degrees from orange through `#ff9466` at 45% to lime. Homepage dots use a 24px grid and low-opacity white. These are approved identity details, not a reason to add ambient effects to reading paragraphs.

## Shapes

Controls use a 5px radius. Standard cards and code panels use the medium radius; navigation, featured panels, and dialogs use the large radius. Small 8px circular signal dots distinguish brand and status. Borders are generally 1px; feature panels use a warmer border. Preserve rounded geometry and restrained borders.

## Components

### Buttons and fields

Homepage actions have a 52px minimum height, Space Grotesk 600 at 15px, and frontmatter padding; small-screen horizontal padding is 18px. Primary actions turn lime on hover; secondary actions acquire lime text and border. Pressing moves homepage actions down 1px. Contact controls use 16px text, dark backgrounds, visible labels, lime focus borders, and error-colored invalid borders. Disabled contact buttons use .6 opacity and a waiting cursor. Success status is lime; error status uses the error token.

### Navigation

The floating panel uses uppercase mono links, 44px minimum link height, and lime active/hover text. The contact action is orange and turns lime on hover. Below 1024px, the menu opens as a separate dark panel; its links have 48px minimum height and the active item gains an inset surface. The menu button exposes `aria-expanded` and `aria-controls`; current links use `aria-current`.

Without JavaScript on smaller screens, navigation becomes an in-flow panel with all links visible and the toggle hidden. Contact links retain their real `contact.html` destination when dialog enhancement is unavailable.

### Cards and section headings

Feature cards are full anchors with optional mono labels, Syne titles, supporting copy, and an explicit arrow action: Open tool, View repository, or Read case study. Orange and lime variants change accent details. Hover adds the variant border and a 3px upward translation. Homepage essays use editorial rows instead of these cards. Section headings pair one natural-case title with a shorter explanatory paragraph, aligned at the top with 32px bottom spacing. The component still supports an optional accent prop, but current homepage sections do not use it. The thesis panel retains its inset intent sequence.

### Footer and reading surfaces

The footer uses a filled white two-line name, real navigation, and a separated metadata row. It stacks below 1024px. Reading surfaces keep transparent article bodies, muted metadata, and inset quotes or definitions. Chapter dividers, section icons, and section numbers are hidden; the argument supplies the hierarchy.

### Article opening and archive

`ArticleHeader` reads the title and description from the writing entry and renders one `PublishedDate` component with semantic dates and an author link. The header is capped at 1100px with 20px side gutters, uses 32px/36px top/bottom margins (20px/28px on small screens), and keeps the deck visible without entrance animation. The title has no bottom padding; the deck has a 24px top margin. An opening diagram follows the first paragraph, capped at 760px with responsive SVG sizing and 32px vertical margins (24px on small screens). Preserve diagram internals while retaining this reading order.

Archive presents the complete writing list after its suggested routes, outside the optional library disclosure. The list draws all four `WritingGroup` groups, uses a 64px top gap, and has a 28px heading. It must remain browseable without opening a disclosure.

### Focus and motion

Every keyboard focus target receives a 3px lime outline offset by 4px. Action transitions last .18s; feature-card transitions last .2s. Reduced-motion preference disables animations, transitions, and smooth scrolling. Forced-colors mode replaces gradient text with `CanvasText`. Print hides navigation, contact dialog, and homepage actions.

## Do's and Don'ts

### Do:

- Do use the approved palette, local fonts, and final design layer as the visual contract.
- Do keep expressive display treatments separate from calm long-form prose.
- Do preserve 320px layout fit, keyboard focus, reduced motion, and no-JavaScript navigation.
- Do preserve real content, routes, SEO metadata, structured data, and contact behavior when styling.

### Don't:

- Don't restore Asphalt & Ivory colors, Inter body text, square-only panels, or hard offset shadows.
- Don't impose generic bans on gradients, mono labels, or panel grids over the approved reference.
- Don't remove legacy diagram geometry while updating the shared visual shell.
- Don't introduce fake metrics, placeholder destinations, or remote decorative assets.
