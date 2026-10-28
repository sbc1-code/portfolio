# Community Brief Studio

An independent application sample by Sebastian Becerra for Codeword’s Strategic Communications & Web Project Manager contract. Sebastian selected the role, directed the concept, reviewed the working app, and approved this revised version for publication on October 27, 2026.

## Useful task

A community communications producer edits one market brief, consolidates section feedback, requests review and publishes a version that drives the public page, printable HTML one-pager and public JSON. Restoring an older version creates a new draft without changing the current public copy.

The browser app works without an account or CMS connection. Its three stages are Edit brief, Review copy, and Publish & share. Select Construction and use the inline guidance to clarify the notice. Review the draft, address the section comment, approve that exact copy, then publish. The Published brief page places the printable HTML and JSON beside the version they export. Earlier versions can be copied into a new draft. All content remains fictional and unverified as local project information.

## Run the frontend

```sh
npm ci --ignore-scripts
npm test
npm run dev
npm run build
```

React 19.3.1 and Vite 8.3.5 are pinned in `package-lock.json`. A static production build is written to `dist/` with relative asset paths. It needs no API key or runtime service. The portfolio route is `/portfolio/codeword-community/`; publication and availability depend on the portfolio deployment.

`Community_Brief_Studio_Source.zip` contains the frontend, a separate local Wagtail implementation, reproduction instructions, recorded CMS evidence, and a file-hash manifest. Dependencies, databases, local credentials, and private application materials are excluded.

## What is real

- Real editable sections, inline writing guidance, section comments and resolution.
- Review tied to the exact public-field content; edits invalidate approval.
- Immutable publication snapshots and restoration as a draft.
- Browser-local persistence with validation and recovery warnings. Incomplete drafts can be restored; incomplete publication snapshots are rejected. History retains the latest 200 previous publications.
- Public-field whitelists; internal comments and content owner excluded from exports.
- HTML escaping, HTTPS-only background links and restrictive export CSP.
- A separate real Wagtail 8.0.1 application with Page models, draft revisions, publication and recovery. See the sibling `codeword-cms` directory in the source package and its evidence manifest.

## Scope

Cedar County is fictional. Microsoft Local and AWS pages informed the topic selection only. They do not verify project facts, identify Codeword’s client or endorse the sample. No investment, jobs, water-use, energy or other local benefit is asserted. No inquiry endpoint or analytics is present.

Browser review actions simulate a workflow; they do not authenticate people, verify a real project or provide enterprise access control. The first published revision is explicitly a sample fixture. Other visitors begin with that fixture; this is not a shared publishing server. The browser prototype is not connected to the local Wagtail database.

ChatGPT (Codex) assisted with research, original copy, design, code and checks. The visual references used OpenAI Image Gen; interface content and controls are native HTML, CSS and React. No live model runs in the sample. Sebastian owns the application and review decisions. New demonstration work does not establish prior professional Wagtail experience, measured operating savings, or a relationship with Codeword or its clients. Do not enter private client information.

## Verification to date

**Model:** Eleven automated Node tests pass. They cover review invalidation, open-comment and incomplete-copy gates, snapshot isolation, history recovery, public-field exclusion, hostile-text escaping, URL validation, corrupted storage, and retention/reload across the 200-publication boundary.

**Revised browser interface:** The edit, missing-content, literal hostile-text, add/resolve-comment, approve, late-edit invalidation, publish, recovery, and reload paths were exercised in Chrome. Desktop layout was checked at 1728 × 823 with no horizontal overflow. Responsive views at 390 × 800 and 900 × 800 were inspected, including the mobile preview toggle using the keyboard. These are browser viewport checks, not physical-device or screen-reader testing.

**Downloads and printing:** The actual published-v2 HTML and JSON downloads were inspected for consistent public content and exclusion of internal fields. Sebastian manually checked that downloaded HTML fixture and reported one readable printed page without clipping. Arbitrary maximum-length edits, other browsers, printer settings, and paper sizes have not been validated for pagination; the export is a printable brief, not a guarantee that every possible edit fits one page.

**Separate CMS proof:** Four Django/Wagtail tests passed. Recorded checks show that an unpublished draft leaves both public outputs unchanged, publication updates both, original content can be recovered, and revision history remains available. The proof uses Django’s HTTP test client; no Wagtail admin UI, running CMS server, authenticated approval process, or production deployment was tested. Its evidence is included in `codeword-cms/evidence/` and summarized in the app.

Primary context: [Codeword’s official posting](https://job-boards.greenhouse.io/codeword/jobs/5444206008). Background sources and their limitations are in `content.json` and the interface.
