---
name: update-publication-list
description: 'Update the publication list for this personal academic website using Google Scholar, web verification, and verified venue status. Use when auditing missing entries, moving papers from preprint to accepted, searching Google to confirm conference acceptance, refreshing publications.txt, syncing News or Selected Publications on the page, and checking for duplicate preprint/accepted/workshop variants.'
argument-hint: 'What should be updated: audit Scholar, refresh publications.txt, or sync the about page?'
user-invocable: true
disable-model-invocation: false
---

# Update Publication List

Use this skill to maintain the publication list for this personal page from Google Scholar and verified acceptance information.

## When to Use
- Audit Google Scholar for missing papers
- Move papers from preprint to accepted after conference or journal decisions
- Search the web to verify whether Scholar-listed papers have been accepted by a conference
- Keep citation counts in sync with Google Scholar when refreshing the staged list
- Refresh [publications.txt](./../../../publications.txt) as the staging source of truth
- Update News and Selected Publications on the site at the end of the workflow, using incremental edits at all times
- Build a Selected Publications list using recent work plus older high-citation papers, with full author names
- Detect duplicate entries caused by preprint, accepted, journal, workshop, or retitled variants

## Workflow
1. Read the current staged list in [publications.txt](./../../../publications.txt).
2. If the user mentions the website page, also read [_pages/about.md](./../../../_pages/about.md) to see whether publications or news are already synced.
3. Open the Google Scholar profile and expand the full articles list before comparing titles.
4. Compare every Scholar entry against the staged list and classify each item into one of these buckets:
   - already represented correctly
   - missing unique entry
   - same work but duplicate variant (for example preprint vs accepted version, workshop version, retitled version)
   - entry whose status changed from preprint to accepted or published
5. For every Scholar-listed paper that is missing, still marked as a preprint, or otherwise unclear, search the web to verify its latest status:
   - use the Acceptance Cross-Reference Protocol below
   - search for the exact paper title together with likely venue terms such as ICLR, ICML, NeurIPS, CVPR, EMNLP, AAAI, COLING, journal, accepted, oral, spotlight, or proceedings
6. For each status-changed paper, record the best verified venue label from the user or web evidence. Preserve notes such as Oral Presentation when provided.
7. Refresh citation counts from Google Scholar for every staged publication you touch, and prefer the latest visible Scholar count over stale local values.
8. Update [publications.txt](./../../../publications.txt) first:
   - keep peer-reviewed publications separate from preprints
   - include full author names whenever a reliable source is available, preserving author order
   - include a paper link for every publication entry
   - include conference or journal name, year, status, citations sourced from Google Scholar, and a short focus note when useful
   - move arXiv-only papers out of peer-reviewed sections
   - avoid duplicate listings when an accepted version already covers the same work
9. Recompute summary counts so totals, year ranges, and headline notes remain internally consistent.
10. Update [_pages/about.md](./../../../_pages/about.md) only after [publications.txt](./../../../publications.txt) has been refreshed with full author names, paper links, and current citation counts, using the staged file as the approved source of truth.
11. When updating [_pages/about.md](./../../../_pages/about.md), make incremental changes at all times:
   - change only the specific News or Selected Publications block that needs syncing
   - preserve surrounding biography, layout, styling, and unrelated content unchanged
   - prefer several small, targeted edits over a single large rewrite
   - after each substantive page edit, do a quick read-back or validation before making the next adjacent change
   - do not include preprints on the about page unless the user explicitly asks for them or a page section clearly requires them
   - carry paper links over from [publications.txt](./../../../publications.txt) so each shown publication entry links to the paper
12. After finishing all intended [_pages/about.md](./../../../_pages/about.md) edits, do one dedicated final pass on the page:
   - validate the file or run an equivalent cheap check
   - read back the touched News or Selected Publications blocks
   - check for local issues such as ordering mistakes, stale contradictions, missing links, duplicated entries, malformed markdown, or accidental drift outside the intended sections
   - if that pass finds a local issue, fix it immediately and rerun the same final pass before stopping
13. When updating the Recent News section, keep entries in descending time order, with the newest verified item first.
14. When updating the Selected Publications section, include:
   - all accepted or published papers from the last 5 calendar years, counting backward from the current year
   - older accepted or published papers only if they have high citations
   - by default, treat high citations as 200 or more unless the user specifies a different threshold
15. When writing author lines for the Selected Publications section, expand abbreviated names to full names whenever a reliable source is available:
   - prefer author names from Google Scholar citation pages, DBLP, publisher pages, ACL Anthology, OpenReview, or author homepages
   - keep the ordering of authors unchanged
   - if a full name cannot be verified reliably, keep the existing abbreviated form rather than guessing
16. When adding links:
   - prefer the canonical paper landing page such as proceedings, OpenReview, ACL Anthology, publisher page, DOI landing page, or arXiv page
   - keep the same link target in [publications.txt](./../../../publications.txt) and [_pages/about.md](./../../../_pages/about.md) unless a more authoritative paper URL is discovered during the same update
   - if no reliable canonical page is available, use the best stable bibliographic or preprint URL instead of leaving the entry unlinked

## Acceptance Cross-Reference Protocol
- For papers still marked as preprints or otherwise unclear, check sources in this order:
  1. primary venue source such as an OpenReview decision page, official proceedings page, publisher landing page, DOI page, or official virtual poster page
  2. bibliographic source such as DBLP, ACL Anthology, PMLR, or another venue-maintained index
  3. preprint metadata such as arXiv comments, journal-ref, or version notes
  4. author or lab publication page
  5. general search results only as a fallback
- Use venue-specific shortcuts when available:
  - NeurIPS, ICLR, ICML: OpenReview first, then proceedings or official virtual pages
  - ACL, EMNLP, COLING: ACL Anthology first
  - ICML, AISTATS, UAI: PMLR first when applicable
  - CVPR, ICCV, ECCV: official proceedings or IEEE/CVF pages first
  - journal papers: publisher or DOI landing page first
- Stop once one primary source and one corroborating bibliographic or venue source agree on the title, authors, and venue, unless there is an explicit conflict.
- Move a paper from preprint to accepted or published only when a primary source explicitly shows accepted, poster, oral, spotlight, published, journal publication, or inclusion in official proceedings for the exact paper.
- Do not move a paper based only on arXiv metadata, CoRR, or a generic search result snippet. Treat author-page claims or search snippets without a matching primary record as provisional evidence only.
- Normalize minor title differences before deciding a paper is new: punctuation, hyphenation, capitalization, spacing, subtitle wording, and tokenization variants such as "SimplexDiffusion" versus "Simplex Diffusion".
- Classify near matches before editing as one of: preprint vs accepted main-paper version, workshop vs main-conference version, conference paper vs journal extension, retitled accepted version, or distinct paper with similar title.
- Do not keep both a preprint and its accepted main-conference version unless the distinction is explicitly useful.
- For Recent News ordering, use the earliest reliable acceptance or publication date from these sources in order: explicit decision date on the venue page, publication date on the canonical paper page, or official venue month when the exact decision date is unavailable. If no reliable month can be established, do not add a News item yet.
- For each paper whose status changes, capture and report the canonical title, canonical URL, venue or journal label, evidence source URL, acceptance or publication phrase, decision or publication date when available, and whether citation counts were refreshed or retained.

## Decision Rules
- If Scholar shows both a preprint and a conference or journal version of the same paper, keep the accepted or published version in the peer-reviewed section and either remove the preprint or label it explicitly as an earlier version only when that distinction is useful.
- If a title appears with a noticeably different wording but overlapping authors, year, and topic, treat it as a likely variant and do not add it blindly.
- If acceptance status is supplied by the user, treat it as authoritative unless it conflicts with the rest of the request.
- If no reliable conference or journal evidence is found after the web search, keep the paper in preprints and note that acceptance could not be verified.
- If a paper is journal-published rather than conference-accepted, keep it in peer-reviewed publications with a Journal field instead of Conference.
- If a primary venue source conflicts with slower bibliographic metadata such as CoRR-only DBLP indexing, prefer the primary venue source for acceptance status and use the bibliography only as supplemental evidence.
- If syncing the about page, treat [publications.txt](./../../../publications.txt) as the approved source and apply it in small local edits rather than reworking the whole page.
- If syncing the about page, default to accepted and published papers only; exclude preprints unless the user explicitly requests them or the target section is specifically about works in progress.
- If updating Recent News, sort by the actual event month and year in descending order instead of preserving the previous list order.
- If updating Selected Publications, default to all accepted or published entries from the last 5 years plus older papers with 200+ citations.
- If a paper falls outside the last 5 years and below the citation threshold, omit it from Selected Publications unless the user explicitly asks for a complete publication list on the page.
- If full author names are inconsistent across sources, prefer the most authoritative bibliographic source available and avoid inventing expansions for initials.
- If Google Scholar is unavailable for a given paper during an update, retain the existing citation count and note that it could not be refreshed.

## Quality Checks
- The staged list contains no obvious duplicates.
- Accepted and published papers are not still listed as under-review preprints.
- Papers kept in preprints have either verified preprint-only status or no reliable acceptance evidence after web search.
- Citation counts in [publications.txt](./../../../publications.txt) are refreshed from Google Scholar for touched entries, or explicitly left unchanged when Scholar data could not be retrieved.
- Papers moved from preprint to accepted or published have an evidence trail that includes at least one primary source, unless the user explicitly requested a provisional update.
- Counts in the Summary section match the visible entries.
- Recent News items do not contradict the accepted status of papers already moved into peer-reviewed publications.
- Recent News items are sorted in descending time order.
- About-page edits are incremental and limited to the sections being synced.
- A dedicated post-edit pass was completed after `_pages/about.md` changes to check the touched blocks for ordering mistakes, stale contradictions, duplicate entries, missing links, malformed markdown, and unintended drift.
- About-page publication sections do not include preprints unless they were explicitly requested.
- The about page is synced from the staged list at the end of the workflow.
- Selected Publications includes all accepted or published work from the last 5 years and only older high-citation work beyond that window.
- The Selected Publications citation threshold defaults to 200+ unless the user overrides it.
- Author names shown in Selected Publications use verified full names when available.
- Every publication entry in [publications.txt](./../../../publications.txt) includes a paper link.
- Every publication entry shown on the about page links to the paper.

## Output Expectations
- Report what changed in the staged list.
- Briefly cite the evidence source used when a paper was moved from preprint to accepted or published.
- If acceptance was verified through a primary source that overrode slower bibliographic metadata, say that explicitly.
- Call out any ambiguous duplicate candidates that still need a human decision.
- If the about page was synced, summarize which small sections were updated rather than describing it as a full rewrite.
- If the about page was synced, mention that a final post-edit pass was run and call out any local issues it caught.
- If preprints were intentionally omitted from the about page, say so explicitly in the summary of the page sync.
- Mention that Recent News was reordered in descending time order when that section changed.
- Mention the Selected Publications inclusion rule used, including the last-5-years window and the 200+ citation threshold when applicable.
- Mention if any author names could not be expanded to full names because reliable sources were not available.
- Mention if any paper links had to use a fallback source such as arXiv or a bibliographic landing page.
- Mention whether citation counts were refreshed from Google Scholar or left unchanged for any entries due to unavailable Scholar data.
