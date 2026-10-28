# Teamworks event follow-up workspace

Independent application work sample by Sebastian Becerra. Reviewed and approved for publication October 27, 2026.

## Purpose

A working event-operations review workspace: preserve one person identity and separate event touchpoints, resolve conflicting source data, hold incomplete or declined-permission records, and export approved contacts and event memberships with an all-source audit. The intended operating value is a more reliable handoff. Time savings, conversion improvements and revenue outcomes have not been measured.

The built-in batch contains 14 fictional source rows, 11 people and 13 event touchpoints. Seven people need attention and four are ready for review. All begin unapproved. Attendance is not consent, a qualified lead or revenue. This is not an official Teamworks tool or a diagnosis of its internal systems.

## Try it

1. Review Morgan Lee, including both event touchpoints, and approve the customer-success handoff.
2. Resolve Jordan Ellis's organization conflict using the visible source rows and a fresh correction note.
3. Open Review export and download separate contacts, memberships and audit CSVs.
4. Import the supplied synthetic example or reset the demo to clear local decisions.

Edits invalidate approval. Unresolved records stay out of the contact/membership handoff. The audit preserves all source rows, including held people and exact duplicates. CSV cells are escaped for spreadsheet formula safety. Imports accept synthetic CSV only, below 1 MiB and up to 1,000 rows. Browser storage is per device and origin; do not enter real customer data.

## Implementation and privacy

The self-contained HTML embeds React 19.2.0, React DOM 19.2.0, application CSS and Manrope 400/600/700. Vite 7.1.12 produced the bundle. No remote script, font, analytics, AI model or API resource is needed. The content policy blocks network connections. There are no emails, CRM writes, scores or live integrations. Research links are explicit user navigation. License notices are embedded and included alongside the HTML.

Sebastian selected the concept, directed the work, reviewed the working version and approved publication. Codex and AI coding agents supported research, implementation and testing; image generation supported the interface reference. No unverified model/version is asserted. Final review of the separate job application is not implied by this sample's publication.

## Research

- [Teamworks platform](https://teamworks.com/platform)
- [Academics and community engagement event](https://explore.teamworks.com/academics-community-engagement)
- [APAC partner summit](https://explore.teamworks.com/2026-apac-partner-summit)
- [HubSpot record deduplication](https://knowledge.hubspot.com/records/deduplication-of-records)
- [Customer.io automations](https://docs.customer.io/messaging/send/types-of-automations-and-broadcasts/)

Generic matching and workflow triggers already exist in CRM/messaging products. This bounded sample demonstrates the Teamworks-specific context and review before a handoff. Product taxonomy and event examples use public material; all sample people, organizations and registrations are fictional.

## Verification and limits

Nineteen domain tests passed, covering identity, event membership, source conflicts, permission holds, stale approvals, parsing, exports and formula escaping. Production build and dependency audit passed. Independent source review and actual in-app browser tests covered approval, correction, declined permission, editing invalidation, reload, search, filters, keyboard navigation, malformed and replacement imports, correct dataset labels and actual CSV downloads. Approving Morgan yielded one contact and two memberships; the audit retained all fourteen source rows.

Desktop 1536x1024, intermediate 1024x900 and mobile 390x844 viewport dimensions and distinct screenshots were checked. The design reference and final captures were visually compared. The standalone bundle was checked for embedded-module consistency, all three fonts and no external resource dependencies.

Physical devices, native Safari, VoiceOver, vendor-specific CRM mappings and business outcomes were not verified. Direct file-protocol opening was not browser-verified; serve over HTTP/HTTPS. Local review state does not migrate between origins.

Standalone HTML SHA256: `99f0bef2688fcd91aed35c549c7254e5ffe89d8979574082a4127898280e48d8`.

## Release and rollback

Published under the existing portfolio GitHub Pages workflow, without a new hosting project. This directory is isolated from prior samples. Rollback is a normal revert of the commit adding this directory.
