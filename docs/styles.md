# CSS architecture

`public/global.css` declares this cascade order:

1. `legacy`: `legacy.css` and `legacy-components.css`, retained for existing page and diagram geometry.
2. `tokens`: `tokens.css`, the approved dark palette, fonts, aliases, spacing, and shared scales.
3. `page`: `page-inline.css`, existing page-specific styling.
4. `editorial`: `editorial.css`, shared reading layout.
5. `components`: `components.css`, shared component behavior and geometry.
6. `shell`: `shell.css`, base navigation, breadcrumbs, footer, and responsive structure.
7. `utilities`: `theme-contract.css`, compatibility rules for older templates.
8. `design`: `home.css`, `fonts.css`, then `design.css`; the final approved visual contract.

Layer declaration order controls precedence even though `home.css` is imported before several lower layers. Within `design`, the later `design.css` overrides homepage defaults, including final heading scales and 320px fit fixes. Read the complete cascade before changing a value. Avoid editing quarantined legacy styles for shared visual changes; preserve their diagram geometry.

## Ownership

- `public/styles/tokens.css`: nearly-black `#0a0a0d`, orange `#ff5500`, lime `#d4f028`, text/surface/state colors, font stacks, spacing, radius, and compatibility aliases. There is one fixed dark theme.
- `public/styles/home.css`: homepage composition, feature cards, localized gradient accents, and grid behavior.
- `public/styles/design.css`: shared shell and reading overrides, accessibility states, final responsive corrections, and decorative treatment. Homepage dots are scoped to `body[data-surface=index]`; reading surfaces stay calm.
- `public/styles/fonts.css`: local WOFF2 Latin/Latin-extended faces using `font-display: swap`: Syne 700/800, Space Grotesk 400/500/600, JetBrains Mono 400/600. Preserve their three OFL 1.1 license files in `public/fonts/`.
- `DESIGN.md`: portable frontmatter tokens and visual guidance reflecting the implemented design.
- `.impeccable/design.json`: schema-v2 extensions, component previews, motion, breakpoints, and narrative. Primitive tokens belong in `DESIGN.md` rather than a duplicate sidecar token store. Derived tonal ramps support the preview panel; they are not additional production colors.

## Responsive and access contract

At 1024px, navigation changes from toggle/panel to inline links. At 640px and below, feature grids stack, navigation narrows to viewport minus 24px, and display sizes/weights reduce to preserve 320px fit. Final narrow adjustments cover thesis grid tracks, intent-flow padding, contact heading, navigation brand, and the 24px footer name. Do not revert these by copying earlier rules from `home.css` or legacy files.

Reading paragraphs use 18–20px type, 1.7 leading, and a 68ch maximum. Focus is a 3px lime outline with a 4px offset. Reduced-motion overrides intentionally use `!important` to disable animation, transitions, and smooth scrolling; do not extend that exception into ordinary presentation rules. Forced-colors mode restores readable gradient text. Mobile `<noscript>` navigation stays in flow with visible links; contact links retain a working page fallback.

## Editorial hierarchy

The final editorial rules at the end of `design.css` take precedence over earlier display treatments. Homepage hero keeps its thesis and gradient; subsequent section headings use natural-case Syne 700 at `clamp(28px,3vw,40px)`, without paired slogans. The homepage has three editorial essay rows, six product cards, and two case-study cards. `FeatureCard` requires an explicit action label matching the destination.

`ArticleHeader.astro` is the shared article opening: content title, description deck, and one `PublishedDate` instance. Titles use `clamp(32px,4.6vw,64px)` and 30px on mobile; decks use 20px/1.6 and 18px on mobile. Published/updated dates and author use 12px Space Grotesk rather than mono styling. The final deck margin and visible, unanimated text prevent title/deck collisions and blank introductions.

Opening diagrams sit after the first paragraph, with responsive SVG width and a 760px maximum. Paragraphs align left without automatic hyphenation or drop caps. Reading chapter dividers, section icons, and section numbers are hidden. Section titles use 23–32px/700. Preserve diagram internals and prose order.

`archive.astro` renders the full four-group writing list outside the optional library disclosure. Recommended routes supplement this complete browseable list. These are implemented editorial structures; do not restore older ornamental headers or card-only essay layouts from earlier CSS layers.

## Validation

Use the repository's existing build and visual-audit tooling after meaningful CSS changes. `scripts/audit-theme.mjs` supports `AUDIT_SCREENSHOT_DIR=/tmp/path` for capture alongside the audit. Check effective computed styles and layout at 320px as well as the established audit viewports, especially long article titles, thesis panels, navigation, and footer. Keep routes, page copy, SEO/JSON-LD, and contact behavior intact. Documentation records implementation; it does not itself certify a new accessibility or browser audit.
