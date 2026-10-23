# Grand Table 2026 — Page Audit (post-redesign, 23 Oct 2026)

Scope: `src/pages/grand-table.astro`, `src/components/GrandTableForm.astro`, `src/data/grand-table-event.ts`, `src/data/grand-table-forms.ts`, `src/pages/api/grand-table/submit/[form].ts`, `src/lib/gt/email.ts`, `src/lib/gt/templates.ts`, `wrangler.toml`.

This supersedes the 22 Oct pre-redesign audit. Content (dates, venue, speakers, dignitaries, the 9 package prices, Safiya Umar as Convener, Seila Gurdal, ambassador initials placeholder, Meenasu, Dubai footer, no venue photos) is unchanged — only layout, order, visual system and polish changed.

## Section order (final)

Hero → About → Convener & Host → Priority Sectors → Dignitaries → Speakers → Partners (companies + media) → Event Experience → Enterprise registration → Delegates & Investors (reasons, entry packages, form) → Sponsorship (tiers, form) → Venue → FAQ → Contact.

Rationale: the credibility chain (who is attending, who endorses it, what's included) now runs before any of the three conversion asks (Enterprise / Delegate-Investor / Sponsor registration), matching the brief's own ordering (hero → why attend → sectors → speakers → dignitaries → partners → tickets/registration → venue → FAQ → contact). Previously all three forms appeared before any speaker, dignitary or partner proof — moved via a pure block reorder (ids unchanged, all anchors like `#enterprise`, `#delegate-form`, `#sponsor-form` still resolve correctly since every CTA across the page links by `id`, not by document position).

Seam transitions were re-derived for the new adjacencies: a new dark→cream seam was added between Sectors and Dignitaries; Partners→Experience, Experience→Enterprise, Enterprise→Delegates and Delegates→Sponsorship reuse the seam types that already existed for those exact colour transitions. Sponsorship→Venue is cream→cream (no seam needed); Venue picked up the same thin `border-t` hairline divider that Dignitaries/Speakers/Partners already use for cream-to-cream adjacency, and Dignitaries dropped that same hairline since it now follows a seam instead of a flat cream section.

## Section-by-section (current state)

**Hero** — Cinematic video/poster, gold beam, word-blur reveal, countdown, three CTAs (Register / Apply as Enterprise / Become a Sponsor). Unchanged, no issues.

**About** — Centered intro, 4-cell fact strip, 5 objective cards with serif numerals. No icons here by design — the brief asked for icons specifically on the sectors list and the five participation reasons, not the About objectives or the enterprise process steps (those stay numeral/step-driven, which is the correct pattern for a linear process).

**Convener & Host** — Safiya Umar portrait (`founder-safiya.jpg`, alt "Safiya Umar, Convener") + bio, premium two-column layout with a "Convener & Host" pill badge over the portrait. Present and final.

**Priority Sectors** — 7 rows, each with an inline-SVG icon plus numeral, title and description. **Overflow bug from the pre-redesign audit is fixed**: `.gt-sector-title` has no `whitespace-nowrap`; it uses `text-[clamp(1.3rem,2vw,1.85rem)]` at `lg`, sits in a `min-w-0 flex-1` column with `overflow-wrap: break-word`, so the longest title ("Artificial Intelligence, Technology & Digital Transformation") wraps cleanly instead of overflowing at any width.

**Dignitaries** — 5 cards, photo or two-letter monogram (ambassador placeholder, kept as content), name, title; every card has a title (all 5 have explicit titles; the shared `SPEAKER_FALLBACK_TITLE` mechanism also covers this group). Richer card treatment: duotone portrait hover, consistent frame, border.

**Speakers** — 10 cards, same card language as Dignitaries. The two speakers without an authored title (Bouchra Izaabel, Dr. Sahar Gul Bukhari) render `SPEAKER_FALLBACK_TITLE` ("Speaker, The Grand Table 2026") so every card reads consistently — no ragged/short cards.

**Partners (companies + media)** — Logo tiles on cream, media partner (Meenasu included) gets its own dark tile for distinction.

**Event Experience** — Horizontally scrollable highlight strip, duotone textured backgrounds, drag/arrow navigation, the most heavily "designed" motion on the page (frame-bg scale on hover, animated underline, progress bar).

**Enterprise registration** — 4-step process with connecting line, notice callout, inline form.

**Delegates & Investors** — Five reasons to participate, each with an inline-SVG icon (not just a numeral, per the brief), bordered entry-package cards (Early Bird, General Admission — the first 2 of the 9 final prices), tabbed Delegate/Investor form.

**Sponsorship** — 7 tier cards (Business Delegate through Title Sponsor — the remaining 7 of the 9 final prices), featured-tier elevation/shadow/badge treatment on Title Sponsor, hover lift on all tiers, inline sponsor form.

**Venue** — Text-only card (no photo, per final content decision), address, map text. No change to content.

**FAQ** — Native `<details>` accordion, single-open behavior, animated open/close via `::details-content`.

**Contact** — Email + phone/WhatsApp cards, general enquiry form, footer.

## Visual system

- **Seams** (`.gt-seam-to-ivory` / `.gt-seam-to-jet`) are long multi-stop gradients (14 stops dark→cream, 8 stops cream→dark) with a crisp 1px champagne hairline (`.gt-seam::after`) at the exact section join — no visible banding. This was the muddy single-midpoint-stop seam flagged pre-redesign; it is now a true eased blend.
- Icons: inline SVG on every sector row and every "five reasons" card (brief's two named lists). Card elevation/hover now extends beyond Sponsorship tiers to speaker/dignitary portraits (duotone + scale), entry-package and tier cards (translateY lift), and the Experience strip (background scale + animated underline).
- Motion: shared IntersectionObserver drives staggered `.reveal` entrances across every section; hero has three independent slow breathing/pulse keyframes (beam, source glow, table-ambient); all keyframe and hover motion is disabled under `prefers-reduced-motion: reduce`.
- Colour system (jet `#0B0B0C`, champagne `#C9A96E`/`#E6D3A3`, ivory `#F5F0E6`, bronze `#9A7B45`) unchanged.

## Forms UX

Five form configs (enterprise, delegate, investor, sponsor, contact): multi-step (3 named steps, per-step validation, progress bar) only for the 16-field Enterprise form; single-step for the rest — correct chunking for form length per Baymard/NN-g/GOV.UK practice. Honeypot field, client validation on blur/submit (never while first typing), server-side validation mirrored in `src/lib/gt/validate.ts`, `aria-required`/`aria-invalid`/`aria-describedby` wired on every field, drag-and-drop file upload with idle/drag/selected/error states and an up-front size/type constraint. Success state hides the form and focuses an accessible confirmation panel.

Change made in this pass: optional fields (e.g. Website, Additional notes, optional Phone on the contact form) now show a quiet "(optional)" hint next to the label, matching the existing required-field `*` convention, so users don't have to guess which fields they can skip. No structural change was needed — the form architecture was already sound.

## Backend / email verification — honest status

Code-level findings as of this commit:

- `EMAIL_ENABLED = "true"` in `wrangler.toml` — emails are switched on.
- `ADMIN_NOTIFY_TO = "info@flottwomenscircle.com"` in `wrangler.toml` — every successful submission (any of the 5 forms) sends an admin notification to **info@flottwomenscircle.com**, with Reply-To set to the submitter and all fields in a label/value table.
- Admin notification send path: Cloudflare `send_email` binding (`SEND_EMAIL`, sender `notify@notify.flottwomenscircle.com`, `allowed_destination_addresses = ["info@flottwomenscircle.com"]` in `wrangler.toml`). This is free but requires Cloudflare Email Routing to be enabled on the `notify.` subdomain and `info@flottwomenscircle.com` verified as a destination in the Cloudflare dashboard — **neither of those two things is visible from this repo or this environment**, so whether the admin email actually lands cannot be confirmed here.
- Registrant confirmation send path: falls back to Resend (`RESEND_API_KEY`) because Cloudflare `send_email` can only reach the `allowed_destination_addresses` list, not arbitrary registrant inboxes. `RESEND_API_KEY` is a secret (`wrangler secret put`), never committed, and **this environment has no Cloudflare dashboard/CLI access to check whether it's actually set in production**. If it isn't set, confirmation emails are silently skipped (logged only) — the submission itself still succeeds and is stored in D1.
- `PUBLIC_GT_FORMS_LIVE=true` in `.env.production` — forms submit live rather than showing the "opens 29 Oct" placeholder notice.

**Bottom line, stated plainly:** the code is wired correctly and admin notifications are configured to go to `info@flottwomenscircle.com`. Whether that mail is actually arriving (Cloudflare Email Routing + destination verification) and whether registrant confirmation emails are being sent at all (Resend API key presence + domain verification) cannot be verified from the codebase or from this sandboxed environment — only Cloudflare/Resend dashboard access can confirm live delivery. This is not a code gap; it is an infrastructure-configuration fact that should be checked once in either dashboard before the 29 Oct launch, per the existing provisioning checklist in `docs/GRANDTABLE-BACKEND.md`.

## Accessibility & performance

No regressions from the reorder (IDs and anchors unchanged, `scroll-margin-top` still applies per-section). Hero video, lazy-loaded images below the fold, and reduced-motion handling are unchanged from the pre-redesign audit and remain solid.
