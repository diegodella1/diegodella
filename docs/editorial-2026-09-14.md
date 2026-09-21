# Editorial and layout refinement — 2026-09-14

The approved pass covers 42 pages, 23 long-form pieces and 86 Nuggets. English and the dark/orange/lime identity remain. The editorial standard is direct language grounded in the existing writing: retain original scenes and useful terminology; remove repeated premises, inflated claims, manufactured urgency and conclusions that merely repeat the opening. This is an editorial assessment, not an authorship detector or external fact-check.

## Delivered

- Homepage leads with “The market decides before the search begins.” Three essay rows, six products, two case studies and one contact section replace competing layers of introductory claims.
- Section titles now say “Narrative Mechanics”, “Products” and “Posta & Roxom TV”. Actions identify their destination: read an essay, open a tool, view a repository or read a case study.
- All 23 articles share a title, descriptive deck and one publication/byline row. The opening paragraph precedes its diagram. Duplicate hero labels and decorative chapter numbering were removed.
- Article openings and endings were edited selectively. Existing personal scenes were retained; universal claims and unsupported certainty were narrowed. Recognizable titles and conceptual definitions remain connected.
- “Before You Build”, “Before You Fit” and “Before You Scale” now agree across article titles and listings. Listing titles and descriptions inherit their MDX source.
- All 86 Nuggets were reviewed. Selected titles were clarified and source actions standardized; source IDs, order and destinations were preserved.
- The archive now exposes all four writing groups, outside the explanatory disclosure.
- Reading columns use left-aligned prose without decorative drop caps. Mobile headings, diagram widths and section hierarchy are quieter and consistent.
- Page metadata, structured-data labels and design documentation were synchronized.

## Review evidence

- [Source changes](editorial-source-diff-2026-09-14.json): final unified diffs for 42 source files. The ArticleHeader baseline is empty because it is new; FeatureCard's original action is reconstructed as “Explore”. Remaining baselines come from the saved source tree immediately before this pass.
- [Rendered field deltas](../tests/fixtures/editorial-deltas.json): explicit before/after fields for 36 pages, layered over the previous release fixture.
- [Main-text deltas](../tests/fixtures/editorial-main-deltas.json): 35 changed interior page bodies, preserving the original fixture as the baseline.
- [Editing journal](editorial-changes-2026-09-14.json): partial working notes only; the final source and rendered deltas above are authoritative.
- Visual captures: `.editorial/editorial-final/`. Independent review approved the current homepage, mobile navigation, representative article headers/prose and updated design documentation. A reported title/deck collision was withdrawn after reopening the exact capture; no additional spacing change was needed.

## Verification

Astro check passed with zero errors, warnings or hints; the 42-page build and validation passed. The 13 unit/content checks, 44 migration checks and browser interaction checks passed. The selected six-page audit at 320px and desktop passed with shipped fonts, including contrast and overflow checks.

The full 42-page browser audit and comparative HTTP performance run encountered Chromium timeouts. These attempts are not counted as passes, and this release makes no measured Core Web Vitals improvement claim. Release and production verification results are recorded below when complete.

Rollback target: `workspace-20260914T235331Z-16099`.

## Production result

Activated `workspace-20260915T004329Z-21053`. All 145 release files match the verified local build byte-for-byte. The isolated release passed Astro check, build, 42-page validation, 13 frontend/content tests and 14 contact-backend tests. Migration parity passed all 44 checks after the final metadata deltas.

Origin smoke passed 324 assertions. The public domain passed 312 site assertions; six requests using simulated AI crawler user agents received Cloudflare 403 responses, as in the previous release. These requests do not establish the behavior of authenticated crawlers. Public discovery is therefore not reported as an unconditional pass.

Public homepage, archive, Writing for the Filter, design CSS, home CSS, global JavaScript and font CSS matched the released bytes using the `20260914edit1` asset version. Long-running browser audits and HTTP timing comparisons remain incomplete because Chromium timed out; no performance improvement is claimed.
