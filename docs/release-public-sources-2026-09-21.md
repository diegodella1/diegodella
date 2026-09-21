# Public sources on About and Media Kit

Both pages now surface six existing outbound sources through `src/components/PublicSources.astro`. Each link has a factual context line, an explicit source category, and `rel="noopener noreferrer"`. The block also links to the Posta and Roxom case studies and the past-talks section. No Person or other JSON-LD changes are included.

## Source provenance

- [LA NACION, December 2022](https://www.lanacion.com.ar/tecnologia/el-podcast-argentino-da-un-salto-internacional-con-la-asociacion-entre-posta-y-la-sueca-podx-nid07122022/): already in `src/data/site.json` and the Posta case study. Reports on the partnership, identifies Diego as a co-founder, and describes Velocidad support involving SembraMedia, ICFJ, and Luminate.
- [Podnews acquisition press release](https://podnews.net/press-release/podx-group-posta): already in site data and the Posta case study. Identifies Diego as co-founder and CMO at the time of the investment; labeled as a press release, not independent reporting.
- [PodX studio directory](https://podx.com/studios/): already in site data and the Posta case study. Lists Posta among the group's studios.
- [Roxom TV](https://roxom.tv/): already in site data and the Roxom case study. Official network description.
- [Roxom TV company background](https://roxom.tv/about): already in site data and the Roxom case study. Official bureau locations; does not independently verify Diego's role.
- [Knight Center / UT Austin announcement](https://knightcenter.utexas.edu/registration-open-for-14th-ibero-american-colloquium-on-digital-journalism/): already in Speaking. Lists Diego among the 2021 colloquium speakers.

All six source pages were retrieved and their supporting content checked on September 21, 2026. No new external URL was invented or introduced from outside the existing repository references.

## Evidence gaps

No dedicated ICFJ/SembraMedia Velocidad source URL or public El Ojo jury URL was found in the active repository content. Velocidad is supported by the existing LA NACION report. No El Ojo citation was added. Company pages support company context; Diego's account of his Roxom role remains in the case study.

## Verification

The rendered About and Media Kit sections each contain all six source URLs as real anchors inside main content. External links include `noopener`, and the existing JSON-LD is unchanged. Editorial snapshots record the approved text additions. The release workflow runs type checking, build, site validation, JavaScript tests, and mocked contact-service tests before activation.
