# Crawler policy

Owner decision, 2026-09-14: permit search and user-initiated retrieval; block model-training crawlers. `public/robots.txt` is the source policy. Cloudflare may prepend managed directives and apply additional network rules.

## Intended access

- Googlebot, Bingbot: public pages allowed.
- OAI-SearchBot, Claude-SearchBot, PerplexityBot: search allowed.
- ChatGPT-User, Claude-User, Perplexity-User: user-initiated retrieval allowed.
- Training tokens in robots.txt: disallow `/`; includes GPTBot, ClaudeBot, CCBot and Applebot-Extended.
- Google-Extended: blocked. This token covers training and certain Gemini grounding uses together; blocking it also restricts those grounding uses. Ordinary Google Search uses Googlebot and is unaffected by this token.
- Amazonbot remains blocked, consistent with the existing Cloudflare policy; its uses are not limited to training.
- Bytespider remains blocked. Social preview crawlers remain allowed.
- `/admin` and `/api/` remain excluded from crawl permission. Robots is advisory, not access control.

Search permission does not grant training permission. Nor does blocking training guarantee that all noncompliant copying stops.

## Production evidence and remaining verification

On 2026-09-14 six simulated search/retrieval user-agents returned 403 at Cloudflare. This does **not** establish whether the authentic crawlers are blocked: the requests came from our test IP, not verified provider infrastructure. Origin permission cannot override a WAF block.

In Cloudflare AI Crawl Control and Security Events, record the crawler identity, timestamp, action, Ray ID, matched rule and verification method. Compare verified search/retrieval activity with origin responses. Correct only the matching rule that blocks intended access; preserve training blocks and general WAF protections. Do not allowlist a caller solely because it supplies a crawler user-agent.

No authenticated Cloudflare account connection was available during implementation. Account rules and verified crawler activity remain unconfirmed.

## Verification contract

`npm run smoke:discovery` checks site contracts and simulates crawler headers. Exit 1 means a site/transport assertion failed. Exit 2 means the site assertions passed but Cloudflare returned 403/429 to simulated agents; it prints Ray IDs for investigation. Exit 0 means the synthetic checks passed, not that every authentic crawler has been verified.

After changing account rules, compare public robots directives with origin, inspect actual crawler events, and rerun the smoke against origin and public URLs. Record external verification separately from repository checks.

## Primary references

- [OpenAI crawler purposes and verification](https://developers.openai.com/api/docs/bots)
- [Google crawler tokens, including Google-Extended](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
- [Cloudflare AI Crawl Control and WAF ordering](https://developers.cloudflare.com/ai-crawl-control/configuration/ai-crawl-control-with-waf/)
- [Cloudflare verified bots](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/)
