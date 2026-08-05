# CSS architecture

Cascade order is declared in `global.css`:

1. `legacy`: quarantined pre-refactor rules; no `!important`.
2. `tokens`: public tokens for the fixed Asphalt & Ivory dark theme.
3. `page`: page-specific `<style>` blocks.
4. `editorial`: shared long-form layout and typography.
5. `components`: modal, reading map, tables, and commercial CTA.
6. `shell`: navigation, breadcrumbs, footer, focus, and responsive shell.
7. `utilities`: reserved for narrowly scoped compatibility utilities.

New shared styles must go into `tokens.css`, `editorial.css`, `components.css`, or `shell.css`. Do not add selectors to `legacy.css`.

The site uses one fixed dark theme. `tokens.css` owns the palette, `home.css` owns the broken-grid home composition, and `theme-contract.css` adapts legacy editorial templates at the final cascade layer. Theme toggles, Tailwind runtime, presentation-level `!important`, and decorative remote assets are forbidden.

`scripts/audit-theme.mjs` audits the fixed theme across five viewports. Set `AUDIT_SCREENSHOT_DIR=/tmp/path` to capture full-page PNGs during the same pass.
