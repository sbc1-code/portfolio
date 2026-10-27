# Before you consolidate

Independent Upstart-focused work sample by Sebastian Becerra. Static HTML/CSS and ES modules, no build step. Serve this directory over HTTP; opening the HTML as `file://` can block module imports.

## Purpose and scope

An educational marketing-page component compares two illustrative loans against a debt payoff amount. It brings together net cash after an upfront fee, any remaining debt or excess cash, monthly payments, payment count, total scheduled payments, and cost above received cash. It does not assess eligibility, calculate an APR, create a recommendation, suggest increasing borrowing, or interact with a lender.

All scenarios are fictional. The default $10,000 principal and $815 deducted fee demonstrate the $9,185 proceeds arithmetic in Upstart's public representative example, but the other default terms are fictional and must not be described as that representative offer.

## Calculation rules

- All money is rounded to integer cents on input (at most two decimal places allowed).
- Net proceeds = principal − deducted fee.
- Payoff gap = entered debt payoff − net proceeds. Positive = unpaid debt; negative = cash beyond that balance. Exact equality is its own state.
- Scheduled payment total = stated monthly payment × whole-number payment count.
- Cost above money received = scheduled payment total − net proceeds. This includes the deducted fee once; the fee is never added a second time.
- No rate or APR is used as a payment input. Monthly payment comes directly from the scenario's disclosed terms.
- Assumes equal payments on time and no prepayment, balloon payment, or extra fees. Inconsistent terms, missing amounts, excess precision, fees at/above principal, negative values, and payment totals below principal receive field errors. An incomplete example hides its computed figures; the other example remains usable. Missing payoff amount hides coverage results, not valid loan arithmetic.
- Operational input bounds are $1,000,000 per amount and 600 payments. These are tool limits, not Upstart product limits.

## Presentation and measurement

- `?variant=a`: net-proceeds explanation first (default).
- `?variant=b`: monthly payment, payment count, and scheduled total first. Inputs, math, and disclosures are identical.
- These are manual presentation alternatives, not a running A/B test. Variant links reset entered values by loading a fresh page; financial inputs are not copied into URLs.
- Interaction event names are recorded in a bounded, in-memory reviewer log. No financial values, local/session storage, cookies, analytics requests, or backend are used. All events disappear on reload. The event demonstration does not establish production measurement readiness.
- Print opens the system print dialog with comparison-specific formatting; print is disabled when the comparison is incomplete or invalid.

## Design rationale

Reference: the current public `/personal-loans` page, rather than Upstart's older homepage styling. Local Figtree, teal `#00807b`, charcoal `#252627`, white, a restrained warm neutral, pill-shaped actions, and an aligned comparison preserve an approachable editorial hierarchy. The concept does not reuse a proprietary logo, photo, Forrest font, or copied site code. A small custom mark distinguishes this independent work from Upstart's official site. No decorative dashboard cards or unsupported trust claims are used.

The existing public page already has a monthly-payment calculator. This concept's hypothesis is that making deducted fees, payoff coverage, and payment tradeoffs visible together improves comprehension and the quality of a later decision. No demand, ROI, lift, or customer behavior has been measured. Useful first validation would test correct identification of proceeds, remaining debt, and total cost before considering an approved live experiment.

## Sources and provenance

Reviewed October 2026:

- https://www.upstart.com/personal-loans — public product page, calculator and fee disclosures. It is company marketing material, not independent evidence of user confusion.
- https://www.linkedin.com/posts/upstart-network_were-proud-to-introduce-the-next-evolution-activity-7441944078386196480-NY3L — Upstart's statement about making borrowing more human and reducing complexity.
- https://github.com/google/fonts/tree/main/ofl/figtree — original font distribution; `assets/OFL.txt` includes the SIL OFL 1.1 license and author copyright. Local `Figtree-Variable.ttf` is the unmodified variable upright font.
- Observed style references: https://www.upstart.com/static-tofu/_next/static/css/7d21cf9e2d57543f.css and https://www.upstart.com/static-tofu/_next/static/css/0a1022b4c08201d8.css . These generated public asset URLs may change with deployments; they are observations, not an official brand manual.

Sebastian selected the problem and approved the brief. Codex assisted research, implementation, and testing under his direction. Customer and business impact have not been measured. This independent concept is not affiliated with or endorsed by Upstart.

## Competitive context and evidence limits

Original pages inspected in October 2026:

| Source | Observable approach | Implication for this concept |
| --- | --- | --- |
| [Upstart personal loans](https://www.upstart.com/personal-loans) | An amount/APR/term calculator shows monthly payment and total interest. Fee explanations and a net-proceeds representative example appear separately. | Another monthly-payment calculator would duplicate existing work. Bring the payoff amount, deducted fee, cash received, and two scenarios together. |
| [Upgrade personal loans](https://www.upgrade.com/personal-loans/) | Explains rate, fee, and payment terms with a $10,000 − $500 = $9,500 proceeds example; contrasts shorter terms with lower-payment longer terms. | Net-proceeds education is already a competitor pattern. The sample must earn its value through a specific payoff-coverage decision, not claim invention of fee transparency. |
| [Prosper personal loan calculator](https://www.prosper.com/personal-loans/prosper-personal-loan-calculator) | A five-step estimate asks about credit, desired amount, employment, income, and housing. Its FAQ states that the origination fee reduces proceeds. | This sample deliberately demonstrates arithmetic with stated terms, without collecting profile data or imitating underwriting. |
| [SoFi personal loan calculator](https://www.sofi.com/personal-loan-calculator/) | Frames the calculation around refinancing and monthly/lifetime savings, while warning that estimates are not offers. | Compare monthly and lifetime obligations together, and avoid claiming savings without a full existing-debt baseline. |

These are lender-owned marketing pages. They show published messages and interface patterns, not independent satisfaction evidence, measured confusion, actual underwriting behavior, or conversion performance. Only public surfaces were inspected; no loan application was submitted. This is a proposed complement to a pre-application marketing page, not an assertion that Upstart's authenticated offer experience lacks equivalent information.

## Adjacent organizational evidence, not assumed role ownership

Upstart's [Principal Product Manager, Growth posting 8141777](https://careers.upstart.com/jobs?gh_jid=8141777), verified through its [official Greenhouse endpoint](https://boards-api.greenhouse.io/v1/boards/upstart/jobs/8141777), explicitly assigns that product role the conversion experience from application start through acceptance. It names the problem of helping people understand options when an offer differs from their request. This is evidence that offer comprehension matters to an adjacent team; it is not evidence that the Website Producer owns the authenticated flow, that origination-fee confusion is a measured cause, or that this prototype would improve conversion. The sample stays before application and could be evaluated with Product, Design, Analytics, and Compliance partners. The target candidacy remains [Website Producer 8325254](https://careers.upstart.com/jobs?gh_jid=8325254).

## Verification

Executed locally in October 2026:

- `node model.test.mjs`: 25 calculation and boundary assertions passed, including the public $10,000 − $815 = $9,185 arithmetic, zero fee, exact coverage, excess proceeds, incomplete inputs, invalid terms, cent precision, and operational limits.
- JavaScript syntax checks passed for both modules.
- Independent headless Chromium functional QA: 16/16 checks passed for rendered figures, edit/focus, incomplete and invalid states, exact cents, reset, variants, reload behavior, keyboard skip link, print invocation, and local-only event logging. Normal interactions requested only this route's local HTML, CSS, modules, and font; no runtime failures or transmitted financial inputs were observed.
- Independent targeted layout QA: 10/10 checks passed after fixes. This covered default and realistic large figures, the maximum accepted values, 320px mobile and 834px tablet widths, 640px reflow equivalent to a 200% desktop zoom, reduced-motion behavior, sampled text/control contrast, and a one-page Letter print without orphan attribution.
- Desktop and mobile screenshots and the final print image were reviewed in the coordinating task. The mobile heading separator, large-number containment, input boundaries, and print spacing were corrected.

Very large values can widen only the comparison table into a keyboard-accessible horizontal scroll area; exact amounts remain unbroken and are never abbreviated or rounded for layout. This validation does not include native Safari, VoiceOver, physical devices, or real-user comprehension testing. No live experiment or production impact has been measured.

To repeat calculation checks, run `node model.test.mjs`. Serve the route over HTTP for browser checks. Source links are explicit external navigation; normal page interactions have no external network dependency.
