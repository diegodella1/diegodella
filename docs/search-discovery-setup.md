# Search and discovery setup

The repository work is complete without external account access. The steps below require Diego or an authorized account owner.

## Google Search Console

1. Add and verify the Domain property `diegodella.ar`. DNS verification is preferred because it covers HTTPS and any subdomains.
2. Submit `https://diegodella.ar/sitemap.xml` under **Sitemaps**.
3. Inspect the key canonical URLs listed below. Confirm Google-selected canonical matches the declared canonical.
4. Test `about.html`, one case study, and one article with Google’s Rich Results Test and Schema Markup Validator. Person/ProfilePage may validate without producing a rich-result preview; that is expected.
5. Use URL Inspection to request indexing for materially new or updated pages after deployment. Do not repeatedly request unchanged pages.
6. Review **Pages**, **HTTPS**, **Core Web Vitals**, and **Enhancements** after Google recrawls the site.

## Cloudflare and canonical transport

Checks on 2026-09-14 confirmed HTTP redirects to HTTPS with 301. The unused `www` hostname does not resolve; it is not a canonical or sitemap URL. No new hostname is required for this release.

Six simulated AI search/retrieval user-agents returned 403 at Cloudflare. Authentic crawler access is unverified. Follow `docs/crawler-policy.md`: inspect verified identity, matched rule and Ray ID before changing rules. The owner selected search/retrieval access with training blocked.

## Bing Webmaster Tools

1. Add and verify `https://diegodella.ar/`. Importing an existing Search Console property is acceptable if the account setup permits it.
2. Submit `https://diegodella.ar/sitemap.xml`.
3. Inspect the key URLs below and confirm their canonicals are accepted.
4. Verify that `https://diegodella.ar/5f23e6aa9d52af688ddc7c193a83fc3e.txt` returns the public IndexNow key after deployment.
5. Run a local dry run with `node scripts/indexnow.mjs --all`.
6. Submit once with `node scripts/indexnow.mjs --submit --all` after the new pages are live. For later releases, submit only materially changed canonical URLs.

IndexNow support does not replace a sitemap, internal linking, or normal crawling.

## Structured-data checks

Use both tools because they answer different questions:

- Google Rich Results Test: Google feature eligibility for supported types.
- Schema.org Validator: vocabulary and graph correctness beyond Google rich-result types.

Confirm:

- only `about.html` carries the complete Person `https://diegodella.ar/#person` definition;
- About is a ProfilePage whose `mainEntity` is that Person;
- the homepage is a WebPage, not a duplicate ProfilePage;
- articles reference the same Person as author;
- article `datePublished` and `dateModified` match visible/source content;
- breadcrumb items match the visible navigation hierarchy;
- no FAQ, review, award, or employer claims appear without visible factual support.

## Test URLs

### Identity and primary routes

- `https://diegodella.ar/`
- `https://diegodella.ar/about.html`
- `https://diegodella.ar/work.html`
- `https://diegodella.ar/ai-media.html`
- `https://diegodella.ar/essays.html`
- `https://diegodella.ar/speaking.html`
- `https://diegodella.ar/media-kit.html`

### Evidence pages

- `https://diegodella.ar/work-posta.html`
- `https://diegodella.ar/work-roxom.html`
- `https://diegodella.ar/thesis.html`
- `https://diegodella.ar/the-last-human-impression.html`
- `https://diegodella.ar/writing-for-the-filter.html`

### Discovery files

- `https://diegodella.ar/robots.txt`
- `https://diegodella.ar/sitemap.xml`
- `https://diegodella.ar/feed.xml`
- `https://diegodella.ar/llms.txt`
- `https://diegodella.ar/site-data.json`
- `https://diegodella.ar/5f23e6aa9d52af688ddc7c193a83fc3e.txt`

### Redirects

- `https://diegodella.ar/writing` → `https://diegodella.ar/essays.html`
- `https://diegodella.ar/work/posta` → `https://diegodella.ar/work-posta.html`
- `https://diegodella.ar/work/roxom` → `https://diegodella.ar/work-roxom.html`

## After deployment

1. Confirm all test URLs return the intended status and content type.
2. Run synthetic discovery checks, then verify real search/retrieval crawler activity in Cloudflare. Keep those two kinds of evidence separate.
3. Confirm HTTP redirects to the HTTPS canonical and only canonical URLs appear in the sitemap. `www` is currently unused and has no DNS record.
4. Inspect page source for title, canonical, Open Graph, RSS link, and JSON-LD.
5. Submit the sitemap in both consoles.
6. Record the deployment date and initial index coverage.
7. Begin the manual benchmark in `docs/llm-visibility-benchmark.md` only after recrawling has had time to occur.

Do not mark Search Console verification, Bing verification, indexing, or account-level submission as complete until an authenticated owner performs and confirms those actions.

## Analytics setup and follow-up

The shared layout loads `/analytics.js` once with `defer`; it loads GA4 asynchronously only at `https://diegodella.ar`. Keep property `G-TJF4P0NYFT`. Local files, development servers and preview hosts do not report traffic.

- Mark `generate_lead` as a key event in GA4. It represents a server-confirmed conversation submission, not a click or form attempt.
- Keep `updates_request_success` separate: it confirms an update request was sent, not that a subscription or double opt-in completed.
- Parameters are `contact_mode`, `page_path`, and sanitized `page_location`. Register `contact_mode` as an event-scoped custom dimension if needed for reporting.
- Review enhanced measurement: disable automatic form interactions for this stream to avoid treating attempted submissions as leads. Remove any existing `form_submit` key-event designation used as a proxy for contact success. Audit account-level custom tags for collection of form fields; no such collection is introduced here.
- Query strings and fragments are removed from the explicitly configured location/referrer. No contact fields are supplied to analytics. Contact remains usable when analytics is unavailable.
- Confirm event receipt with an identified test and record/exclude it from lead totals. Do not send a live email merely to run an automated smoke.

Authenticated GA4 configuration and event receipt have not been verified. GSC/Bing exports have not been provided.

Export Search Console/Bing queries and pages for the last three months versus the previous three, plus indexing, sitemap status and Core Web Vitals. Review available generative AI reports and inclusion settings in Search Console. Do not interpret absent field data as passing CWV.

Record deployment date, organic clicks, confirmed professional inquiries and assistant referrals. Compare at 28 and 56 days; referral reports do not capture every AI-influenced visit. Establish the manual benchmark in `docs/llm-visibility-benchmark.md`, recording date, product, prompt, cited URL and exact answer evidence. No citations or ranking gains are guaranteed.
