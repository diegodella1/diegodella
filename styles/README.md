# CSS architecture

Cascade order is declared in `global.css`:

1. `legacy`: quarantined pre-refactor rules; no `!important`.
2. `tokens`: public design tokens and light/dark values.
3. `page`: page-specific `<style>` blocks.
4. `editorial`: shared long-form layout and typography.
5. `components`: modal, reading map, tables, and commercial CTA.
6. `shell`: navigation, breadcrumbs, footer, focus, and responsive shell.
7. `utilities`: reserved for narrowly scoped compatibility utilities.

New shared styles must go into `tokens.css`, `editorial.css`, `components.css`, or `shell.css`. Do not add selectors to `legacy.css`.

`index.html` still uses Tailwind CDN utilities. Its dark-mode utility overrides are the only permitted presentation-level `!important` declarations. Remove this exception when the home utility classes are compiled or migrated to semantic classes.
