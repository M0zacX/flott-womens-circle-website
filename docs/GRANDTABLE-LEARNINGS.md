# Grand Table 2026 — Running Learnings (Remy)

## Research (2026-10-20)
### Global Entrepreneurship Festival Egypt (globalentrepreneurshipfestival.com)
- Hero leads with date + venue line and a live countdown — urgency works for registration launch (29 Oct). Use a countdown to 5 Dec 2026.
- Big stat strip (10,000+ delegates, 70+ countries, 200+ investors). We should use a restrained stat row (Markets: Nigeria · UAE · India) — no invented numbers until client confirms.
- Weakness: busy, conversion-heavy, many tiers on homepage. We go calmer and more luxurious; tiers live on Sponsorship page.
- Clear multi-audience CTAs (tickets, exhibit, sponsor) — mirrors our 4 buttons; make one primary, three secondary.
### Awwwards / Dribbble premium-event patterns
- Full-bleed cinematic hero, oversized serif display type, tiny tracked uppercase labels in corners (title-card credits).
- Single accent colour on black; gold as thin hairlines, not big fills.
- Slow reveal motion (mask/line reveals, 1–1.5s easing), subtle grain + light beam for depth; respect prefers-reduced-motion.
- Sticky minimal nav that gains a blurred backdrop on scroll; mobile full-screen menu.

## Decisions
- Palette: Jet #0B0B0C, Champagne Gold #C9A96E / #E6D3A3, Ivory #F5F0E6.
- Type: Cormorant Garamond (display) + Inter (UI labels).
- Hero: abstract "grand table" light beam / glowing horizon line instead of stock photo (no approved imagery yet).

## Open questions / blockers
- Domain thegrandtable.com availability unconfirmed (not purchased — rule).
- Contact email/phone TBC; venue in Abuja TBC.

## Scope change (08:45 Dubai)
- Lives inside FWC Astro site as /grand-table (pattern copied from /dubai: Layout + Header + FooterSection, word-blur reveals, dark hero). FWC credited as initiator; two co-organiser slots TBC.
- Page-scoped palette (Jet/Champagne/Ivory) overrides FWC orange only within the page; Playfair italic accent kept for brand continuity.

## Form UX (10:25 Dubai, 20 Oct)
- Mobbin connector returned "requires a paid plan"; not purchased (rule). Takeaways below come from established form-UX practice (Baymard, GOV.UK Design System, NN/g) instead.
- Long forms (15 fields): chunk into 3 named steps with a visible progress cue; validate per step; Back never loses data.
- Errors: inline, under the field, specific wording, shown on blur/submit only (never while typing first time); focus first invalid field; aria-invalid + aria-describedby.
- Uploads: show explicit states (idle, drag-over, selected chip with name + size + remove, error for type/size) and the constraint up front ("PDF only, max 10 MB").
- Remove internal-status badges from public UI; keep notes in config/code.
- Anchored sections need scroll-margin-top so the floating nav pill does not cover headings.
