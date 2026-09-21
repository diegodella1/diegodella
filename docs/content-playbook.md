# Content playbook

The goal is to build a factual body of work that makes Diego Dell'Agostino legible through evidence. It is not to repeat a positioning paragraph or manufacture search inventory.

## Two-layer editorial architecture

Every piece does not need to name every category, but the body of work should preserve this causal structure.

### Core experience

- digital media;
- digital products;
- marketing and distribution;
- content strategy;
- audience development and communities.

### Current frontier

- AI-native media;
- AI agents and agentic workflows;
- editorial operations and media automation;
- AI-mediated discovery.

AI is the current layer built on the core experience. Do not rewrite the career as if it began with generative AI.

## Four current-frontier territories

### 1. AI-native media

Write about what changes when AI becomes part of media infrastructure: research, workflows, interfaces, programming, production, metadata, discovery, distribution, and decisions.

Avoid treating generated content as the whole subject. Show the operating model, constraints, and consequences.

### 2. Media product

Write about product choices inside media businesses: formats, interfaces, audience behavior, distribution, positioning, revenue mechanics, and the connection between editorial and product systems.

Use Posta, Roxom TV, and current product work when a claim can be supported.

### 3. AI workflows and agents

Write about agents as infrastructure rather than characters. Useful questions include where agency begins and ends, what needs human approval, how metadata moves, where automation fails, and what operational interfaces people actually need.

Avoid implying autonomy where a workflow is assisted, supervised, or rule-bound.

### 4. Media operations

Write about the machinery required to run real media: distributed teams, live production, playout, graphics, remote control, dashboards, handoffs, failure recovery, editorial tooling, and global coverage.

Operational detail is valuable when it teaches a transferable principle without disclosing confidential systems.

Not every article needs all four territories. One strong territory with concrete proof is better than four superficial references.

## Supporting territory

Narrative Mechanics and AI-mediated discovery connect the work to questions of positioning, trust, interpretation, and machine-mediated visibility. Use this territory when it emerges naturally from a product or operating problem.

## Evidence pattern

A strong piece usually contains some version of:

```text
Context → Constraint → Decision → System → Failure or tradeoff → Result → Principle
```

Possible evidence:

- a workflow diagram;
- an operating constraint;
- a concrete interface or tool;
- an architecture decision at a safe level of abstraction;
- a failure and its correction;
- a before/after process;
- a sourced public event, acquisition, or product launch;
- code or a public experiment;
- a decision that looked reasonable but failed in practice.

Do not convert confidential work into vague grand claims. If the specifics cannot be published, state the limit and extract only the defensible lesson.

## Voice

Write like an experienced builder/operator who thinks:

- direct;
- curious;
- precise;
- slightly informal;
- confident without self-importance;
- specific about what was built and what did not work.

Avoid “leveraging,” “unlocking,” “revolutionizing,” “passionate about,” “thought leader,” “at the forefront,” “cutting-edge,” and “transformative.”

Prefer:

> We automated metadata preparation, but the hard part was deciding which editorial exceptions should stop the workflow.

Over:

> We leveraged cutting-edge AI to transform newsroom operations.

## Publication standard

Before publishing:

1. Confirm every company, role, city, date, and result.
2. Distinguish “founded,” “co-founded,” “founding team,” “helped build,” “led,” “designed,” and “operated.”
3. Remove numbers that do not have a durable source or firsthand approval.
4. Explain at least one meaningful constraint or tradeoff.
5. Link to the relevant case study, topic hub, and About page where useful.
6. Add one unique description and a truthful publication date.
7. Add the completed piece and its metadata to `src/content/writing/*.mdx` only when it is ready; Astro generates `site-data.json`.
8. Run discovery sync and validation.

Do not publish outlines, thin placeholders, synthetic interviews, repetitive FAQs, or generic trend summaries just to create URLs.

## Canonical editorial program

Five complete briefs live in `content/briefs/`:

1. **AI-Native Media Is an Operating Model, Not a Content Format**
2. **AI Changes Media Operations Before It Changes Content**
3. **From Audience to Community: The Product Layer Media Still Gets Wrong**
4. **AI-Mediated Discovery: What Changes When People Stop Browsing**
5. **Media Is a Product Problem, Not Just a Content Problem**

The future queue lives in `content/ARTICLE-BACKLOG.md`. Briefs are not articles and must not receive public URLs, schema, sitemap entries, feed items, or IndexNow submissions until publication-ready copy exists.

## Internal linking

Links should answer the reader’s next real question:

- a Posta lesson about format transitions → Posta case study;
- a global operations detail → Roxom TV case study;
- an agent/workflow principle → AI-Native Media;
- author identity or career context → About;
- copy-ready background for a host or journalist → Media Kit;
- a new article’s conceptual predecessor → the most relevant existing essay.

Avoid inserting the same exact link phrase into every piece.

## What this body of work should prove over time

The archive should let a reader or retrieval system infer, from multiple independent pages, that Diego has worked across media companies, digital products, marketing, content, audiences and communities, distributed live operations, AI-assisted workflows, agents, editorial infrastructure, and AI-mediated discovery.

That inference should come from cases and decisions—not from repeatedly calling Diego an expert.
