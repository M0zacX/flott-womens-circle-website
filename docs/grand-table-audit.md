# Grand Table 2026 — Page Audit (pre-redesign, 22 Oct 2026)

Scope: `src/pages/grand-table.astro`, `src/components/GrandTableForm.astro`, `src/data/grand-table-event.ts`, `src/data/grand-table-forms.ts`, `src/pages/api/grand-table/submit/[form].ts`.

## Section-by-section

**Hero** — Strong: cinematic video/poster, countdown, gold beam, word-blur reveal. No structural issues. Minor: three CTAs of near-equal visual weight (Register / Apply as Enterprise / Become a Sponsor) dilute the primary action.

**About** — Plain centered text block + a 4-cell fact strip + 5 numbered "objective" cards in a thin top-border row. No imagery, no icons, flat on a cream field — reads like a text document, not a premium summit page. The objectives have no visual anchor beyond a serif numeral.

**Sectors** — A vertical list of 7 rows (number + title + one-line description), gold hover sweep. Good interaction detail, but:
- **Bug**: `.gt-sector-title` has `lg:whitespace-nowrap` with a `clamp(1.5rem,2.6vw,2.25rem)` size. At `lg` (1024–1280px) the longest title, "Artificial Intelligence, Technology & Digital Transformation" (56 characters), does not fit the `1fr` column within the `pr-28` padding at that font size and is forced not to wrap — it overflows the container and can run under/past the arrow or off the visible column. This is the "sector titles overflowing off-screen" issue named in the brief.
- No icon/visual distinction between the seven sectors — just a serif numeral.

**Enterprise registration** — 4-step numbered process (text + thin connecting line), a notice callout, CTA, then the form inline. Functionally fine; visually it's the plainest section on the page (no cards, no icons, flat list).

**Delegates & investors** — "Five reasons to participate" uses the same bare numeral + heading + paragraph pattern as About's objectives (visual repetition without variation). Fee block is a nice bordered card. Tabbed Delegate/Investor form switch works and is accessible (roving tabindex, `aria-selected`, keyboard arrows).

**Sponsorship** — Tier cards are the best-designed cards on the page (featured tier treatment, price, passes, hover lift). Good baseline to extend elsewhere.

**Dignitaries / Speakers** — Two near-identical sections back to back (same card markup, duplicated). Photo + name + title, portrait duotone hover. **Inconsistent**: 2 of 9 speakers (Bouchra Izaabel, Dr. Sahar Gul Bukhari) have no `title`, so their cards are shorter than the rest — ragged bottom edge across the row, and the task requires all cards show a title consistently.

**Partners (companies + media)** — Logo tiles in white boxes on cream — functional, a bit generic grid-of-boxes treatment; media partner gets its own dark tile for distinction, which is a nice touch.

**Event Experience** — The highlight strip (horizontal drag/scroll cards with duotone pattern backgrounds) is the most "designed" section on the page — good motion, good texture work. Icons are hand-drawn-feeling line icons.

**Venue** — Simple two-column text + photo mosaic. Fine, under-decorated relative to the hero.

**FAQ** — Native `<details>` accordion, single-open behavior via JS, decent interaction polish.

**Contact** — Two contact cards (email, phone/WhatsApp) + the general enquiry form. Fine.

## Section order (current → issue)

Hero → About → Sectors → **Enterprise form** → **Delegate/Investor form** → **Sponsor form** → Dignitaries → Speakers → Partners → Experience → Venue → FAQ → Contact(+form).

Problem: the page asks for three separate registrations/commitments (Enterprise, Delegate/Investor, Sponsor) **before** showing any social proof — the speakers, dignitaries and partner logos that would justify the ask don't appear until after all three forms. For a premium investment-summit landing page the credibility chain (who's attending → what's covered → proof) should come before the conversion asks.

## Visual system

- **Seam gradient** (`.gt-seam-to-ivory` / `.gt-seam-to-jet`): `linear-gradient(to bottom, #0B0B0C 0%, #2a2218 50%, #F5F0E6 100%)` over a fixed 64–96px band. The single midpoint stop (`#2a2218`, a muddy olive-brown) creates a visible banding/muddy seam exactly where the brief flagged it — a true multi-stop blend needs more intermediate stops with eased spacing, not one flat 50% stop.
- No icons anywhere except the Experience strip and a few inline chevrons/arrows — sectors list and "five reasons" are bare numerals, which reads as a wireframe rather than a finished design.
- Card elevation/hover states exist only on Sponsorship tiers and About objectives; most sections are flat bordered rows.
- Color system (jet `#0B0B0C`, champagne `#C9A96E`/`#E6D3A3`, ivory `#F5F0E6`, bronze `#9A7B45`) is consistent and premium — kept as-is.

## Mobile

- Sector rows, reasons grid, and objective cards all stack cleanly — no overflow issues on mobile widths themselves (the nowrap bug is `lg:`-only, i.e. narrow/medium desktop, not phone).
- Three-button hero CTA stack is tall on small screens (3 full-width pills + scroll hint) — acceptable but adds scroll distance before first content.
- Highlight strip and speaker grids both scroll/wrap correctly on mobile already.

## Accessibility

- Good baseline: skip targets via `scroll-margin-top`, `focus-visible` rings on every interactive element, `aria-live` on countdown-adjacent regions is not used (countdown isn't announced — acceptable, it's decorative/non-critical), FAQ accordion and form-tab roving tabindex both follow WAI-ARIA patterns correctly, forms have proper `aria-required`/`aria-describedby`/inline error association.
- Gaps: speaker/dignitary cards with missing titles create an inconsistent reading order for screen readers (name-only vs name+role). Sector row `aria-label` ("Apply as an enterprise in …") is good. No `alt` issues found — every `<img>` has a real name-based alt.

## Performance

- Hero video (webm+mp4, `preload="metadata"`, poster fallback, reduced-motion swaps to poster) is already well optimized.
- Images use `loading="lazy"` consistently below the fold; hero poster uses `fetchpriority="high"`. Good.
- Google Fonts loaded via `@import`-style `<link>` with `preconnect` — fine, single family/weight set.
- No major perf red flags; biggest win available is reducing the number of distinct `.reveal` elements with individual transition-delay math (micro-optimization, not urgent).

## Forms UX (pre-redesign)

- Four form configs (`enterprise`, `delegate`, `investor`, `sponsor`, `contact`) are solid: proper `required`/`type`, multi-step only for the 15-field Enterprise form (3 named steps, per-step validation, progress bar), single-step for the rest — this matches best-practice chunking (Baymard/NN·g, per the team's own learnings doc) and does **not** need a structural redesign, just visual polish to match the new card language.
- `grand-table-forms.ts` still carries a stale header comment ("UI-only… No submissions are wired to a backend yet") even though the backend (`/api/grand-table/submit/[form]`, D1, email) has shipped — corrected as part of this pass.
- Honeypot field, client + server validation, inline error messages, and a `role="status"` live notice region are all already in place.

## Backend / email verification

See final report for live-endpoint test results and exact email-delivery status (code-level: `EMAIL_ENABLED=true`, admin notifications wired to `info@flottwomenscircle.com` via Cloudflare `send_email`; registrant confirmations require `RESEND_API_KEY`, which could not be confirmed from this environment — Cloudflare CLI/dashboard access was not available here).
