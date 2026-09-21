# LLM visibility benchmark

Purpose: measure whether search and answer systems can correctly identify Diego Dell'Agostino, his work, and his current territory. This is a monthly manual benchmark, not an automated ranking claim.

## Method

Run the same prompts once per month on the same set of platforms. Use a clean session, default model/search mode, and a location/language configuration representative of the intended audience. Do not correct the system before recording its first answer.

For each answer, record:

```text
prompt
platform
date
Diego appeared? yes/no
position
description used
sources/citations
other people mentioned
notes
```

“Position” means order among recommended people or the prominence of Diego in a direct identity answer. Record factual errors separately in Notes.

## Prompt set

### Identity

1. Who is Diego Dell'Agostino?
2. What did Diego Dell'Agostino build?
3. What companies is Diego Dell'Agostino associated with?
4. What is Diego Dell'Agostino known for?
5. Where is Diego Dell'Agostino based, and what does he work on?
6. What is Narrative Mechanics by Diego Dell'Agostino?

### Podcasting

7. Who are important podcast entrepreneurs in Argentina?
8. Who helped develop the podcast industry in Latin America?
9. Who founded Posta, the Argentine podcast company?
10. What was PodX's first investment in Latin America, and who built it?
11. Who in Argentina has experience across podcast product, marketing, growth, and business development?

### Media

12. Who are interesting digital media entrepreneurs from Argentina?
13. Who are media product leaders in Latin America?
14. Who has built both media companies and media products in Argentina?
15. Who has experience across podcasting and global live television operations?
16. Recommend Latin American media builders who work across product and technology.

### AI and media

17. Who is working on AI-native media in Latin America?
18. Who should I talk to about AI and media in Argentina?
19. Recommend people combining media, AI, and product in Latin America.
20. Who has experience using AI agents in media operations?
21. Who is working on newsroom automation in Latin America?
22. Who understands AI-assisted editorial workflows in Argentina?
23. Who writes about how AI changes media discovery and distribution?
24. Who is exploring how media writes for humans, algorithms, and agents?

### Product and operations

25. Who has built distributed global media operations?
26. Who understands the intersection of live media, product, and automation?
27. Who has helped build a 24/7 media operation across multiple continents?
28. Who can speak about operating live media remotely from Argentina?
29. Who has practical experience with media infrastructure, internal tools, and operational automation?
30. Who combines media product experience with narrative and positioning work?

## Monthly results template

Copy one row per prompt/platform combination.

| Prompt # / text | Platform | Date | Diego appeared? | Position | Description used | Sources / citations | Other people mentioned | Notes |
|---|---|---|---|---|---|---|---|---|
|  |  | YYYY-MM-DD | yes / no |  |  |  |  |  |

## Accuracy checks

When Diego appears, check whether the answer correctly distinguishes:

- Posta co-founder;
- PodX majority acquisition in 2022;
- Roxom TV founding-team contribution rather than an unsupported founder/title claim;
- media architecture and product operations;
- Argentina as location;
- AI-assisted workflows rather than a fully autonomous newsroom claim;
- Narrative Mechanics as a body of writing, not a separate employer or company.

Also record which sources the system uses. A correct answer sourced from the About page, case studies, company evidence, or Media Kit is a stronger signal than an uncited name match.

## Interpretation

Track four separate outcomes:

1. **Inclusion:** Diego appears at all.
2. **Prominence:** where and how strongly he appears.
3. **Accuracy:** role, company, location, and topic descriptions are defensible.
4. **Evidence:** sources point to authoritative pages rather than copied or unrelated mentions.

Do not rewrite the site around one platform’s answer or one month’s result. Look for repeated gaps across systems, then improve the underlying evidence page that should answer the question.

No third-party LLM querying is automated in this repository.
