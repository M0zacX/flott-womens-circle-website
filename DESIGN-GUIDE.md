# Flott Women's Circle - Design System Guide

Reference document for adding new sections or pages. Follow every item to maintain visual consistency across the site.

---

## 1. Color Palette

Defined in `src/styles/globals.css` via Tailwind `@theme`:

| Token                | Hex       | Usage                                      |
|----------------------|-----------|---------------------------------------------|
| `background`         | `#EBE7E2` | Page background, light section backgrounds  |
| `foreground`         | `#0F0906` | Primary text, dark section backgrounds      |
| `secondary`          | `#F5E6D5` | Card backgrounds, subtle fills              |
| `border`             | `#E8D5C4` | Dividers, borders, unrevealed word color    |
| `muted-foreground`   | `#5C3D2E` | Body text, subtitles, secondary text        |
| `primary`            | `#F68313` | CTA buttons, accent highlights              |
| `primary-foreground` | `#FFFFFF` | Text on primary-colored elements            |
| Floral pink          | `#e8b4b8` | Decorative SVG elements (not a CSS variable)|

### Dark sections (e.g. StatsSection, TechnologySection hero)
- Background: `bg-foreground` (#0F0906)
- Text: `text-white`, `text-white/40`, `text-white/60`
- Borders: `border-white/15`

### Text on images
- Use `#0F0906` (foreground) for text overlaid on light/gradient images
- Never use `#3B2216` or other brown variants - always use the foreground color
- Subtitle opacity: `rgb(15 9 6 / 0.6)`

---

## 2. Typography

### Font stack
- **Body / Headings**: System sans-serif (Tailwind default)
- **Accent words**: `'Playfair Display', serif` - italic only, weight 500

### Loading Playfair Display
Already in `Layout.astro`:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,500;1,600&display=swap" rel="stylesheet" />
```

### Accent word treatment
Every section heading should have 1-2 "focused" words styled in Playfair Display italic. Apply this inline:

**In Astro (.astro):**
```html
<span style="font-family: 'Playfair Display', serif; font-style: italic; font-weight: 500;">Together.</span>
```

**In React (.tsx):**
```tsx
<span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Forest.</span>
```

**In ScrollRevealText:** Use the `accentWords` prop:
```tsx
<ScrollRevealText text="..." accentWords={["explorers", "wild"]} />
```

### Font weight rule
- Always use `font-weight: 500` for Playfair Display - never 400 or 600
- This matches the "Adventure" weight established across the site

### Heading sizes (typical)
| Context              | Classes                                                       |
|----------------------|---------------------------------------------------------------|
| Hero overlay         | `text-[22vw]` (viewport-based)                               |
| Section hero (sticky)| `text-[12vw] md:text-[10vw] lg:text-[8vw]`                   |
| Section heading      | `text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight`|
| CTA image heading    | `text-4xl md:text-6xl lg:text-7xl xl:text-8xl`               |
| Card title           | `text-xl font-semibold` or `text-lg font-medium`             |
| Subtitle label       | `text-xs uppercase tracking-[0.3em]` or `tracking-widest`    |
| Body text            | `text-sm leading-relaxed`                                     |

### Subtitle labels
Typically italic, uppercase, wide tracking:
```html
<p class="text-xs uppercase tracking-[0.3em] text-muted-foreground" style="font-style: italic">Key Facts</p>
```

---

## 3. Animation System

**Master easing:** `cubic-bezier(0.22, 1, 0.36, 1)` - used everywhere for consistency.

### 3a. Global IntersectionObserver (Layout.astro)
- Threshold: `0.15`
- Root margin: `0px 0px -150px 0px` (triggers 150px before element reaches viewport bottom)
- Observed classes: `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-clip`, `.reveal-words`, `.reveal-counter`, `.reveal-flip`, `.word-blur-group`
- All add `.visible` class on intersection

### 3b. Available animation classes

| Class            | Effect                          | Duration | Use for                            |
|------------------|---------------------------------|----------|------------------------------------|
| `reveal`         | Fade up + blur (50px)           | 4.125s   | General elements, cards, paragraphs|
| `reveal-left`    | Slide from left + blur          | 4.125s   | Directional reveals                |
| `reveal-right`   | Slide from right + blur         | 4.125s   | Directional reveals                |
| `reveal-clip`    | Clip-path curtain (bottom-up)   | 4.5s     | Images, full-width sections        |
| `reveal-flip`    | 3D perspective flip + blur      | 4.125s   | Card titles, small headings        |
| `reveal-counter` | Scale up (0.88) + blur          | 3.5s     | Stat counters, spec values         |
| `reveal-words`   | Word-by-word slide up (auto-split) | 2.8s  | Pure text elements (no HTML inside)|
| `word-blur-group`| Container for word-blur children | 1.2s    | Headings with accent word spans    |
| `blur-words`     | Auto-split word blur (JS)       | 1.2s     | Plain text labels, body paragraphs |

### 3c. Word-by-word blur reveal (primary heading animation)

For headings with accent words (manual wrapping):
```html
<h2 class="word-blur-group text-3xl font-medium tracking-tight text-foreground">
  <span class="word-blur" style="transition-delay: 0s">Essential</span>
  <span class="word-blur" style="transition-delay: 0.15s; font-family: 'Playfair Display', serif; font-style: italic; font-weight: 500;">Accessories</span>
</h2>
```

For plain text (auto-split, no HTML children allowed):
```html
<p class="blur-words text-xs uppercase tracking-[0.3em] text-muted-foreground">Our Team</p>
```
The JS auto-splitter wraps each word in `<span class="word-blur">` with 0.06s stagger.

### 3d. Word-blur delay guidelines
- Heading words: ~0.1-0.15s between words
- Add a slight gap before the accent word: extra 0.1s
- Auto-split (`blur-words`): 0.06s per word (handled automatically)

### 3e. Staggering with transition-delay
For multiple elements in a group (cards, list items), stagger via inline `style`:
```html
<div class="reveal" style="transition-delay: 0.15s">...</div>
<div class="reveal" style="transition-delay: 0.3s">...</div>
```

### 3f. React components (client:load / client:visible)
React components hydrate AFTER the global observer script runs. You MUST create an IntersectionObserver inside the component:
```tsx
const [visible, setVisible] = useState(false);
const ref = useRef<HTMLElement>(null);

useEffect(() => {
  if (!ref.current) return;
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
  }, { threshold: 0.15 });
  obs.observe(ref.current);
  return () => obs.disconnect();
}, []);
```
Then apply: `className={`word-blur-group ${visible ? "visible" : ""}`}`

### 3g. Footer / bottom-of-page elements
Use a dedicated observer with lower threshold since the global one (-150px rootMargin) won't trigger:
```js
const footerObs = new IntersectionObserver(cb, { threshold: 0.01 });
```

### 3h. ScrollRevealText component
For long descriptive paragraphs that reveal on scroll (not intersection-triggered):
```tsx
<ScrollRevealText
  client:visible
  text="Your paragraph text here..."
  className="mx-auto max-w-5xl"
  accentWords={["keyword1", "keyword2"]}
/>
```
- Words transition from `var(--color-border)` to `var(--color-foreground)` as user scrolls
- accentWords get Playfair Display italic treatment automatically

### 3i. Image loading animation
```html
<img class="fade-image" onload="this.classList.add('loaded')" loading="lazy" />
```
Images start at `opacity: 0` and fade to `1` over 2s when loaded.

### 3j. Hover effects
Image zoom on parent hover:
```html
<div class="group">
  <img class="hover-zoom absolute inset-0 w-full h-full object-cover" />
</div>
```
Scales to `1.08` on hover with eased transition.

### 3k. Reduced motion
All animations fall back to simple opacity fade for `prefers-reduced-motion: reduce`.

---

## 4. Decorative Floral SVG Elements

Every section includes hand-crafted SVG decorations. This is a core visual identity element.

### Rules
- Color: `text-[#e8b4b8]` (soft pink) with `stroke="currentColor"`
- Opacity: `0.25` to `0.5` (never fully opaque)
- Positioning: `absolute` with negative offsets to bleed off edges (`-top-16 -right-20`)
- Pointer events: Always `pointer-events-none`
- Accessibility: Always `aria-hidden="true"`
- Stroke style: `stroke-width="0.8"` to `"1.2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, `fill="none"`
- Responsive: Large florals `hidden md:block` or `hidden lg:block`, small ones always visible

### Placement pattern (2 per section)
1. **Large floral** - opposite corners from the main content, partially offscreen
2. **Small accent** - smaller element on the other side, visible on mobile

### Types used across the site
| Type                | Sections used in                              |
|---------------------|-----------------------------------------------|
| Mandala (circular)  | PhilosophySection (centered), TestimonialsSection |
| Paisley (teardrop)  | HeroSection, TestimonialsSection               |
| Spiral vine/fern    | FeaturedProductsSection, TechnologySection     |
| Folk dahlia (flower)| CollectionSection                              |
| Henna vine          | TeamSection                                    |
| Rosette (small)     | StatsSection, CollectionSection                |

### Template for a new floral
```html
<svg class="absolute -top-12 -right-16 w-[320px] h-[460px] text-[#e8b4b8] opacity-[0.4] pointer-events-none hidden lg:block"
     viewBox="0 0 340 460" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- Build from: center spiral, concentric rings, petals, dot accents, outer arcs -->
</svg>
```

---

## 5. Spacing Conventions

### Horizontal padding (consistent across ALL sections)
```
px-6 md:px-12 lg:px-20
```
This is the universal content padding. Never deviate.

### Vertical section padding
```
py-20 md:py-28 lg:py-32       (standard)
py-24 md:py-32 lg:py-40       (generous - text-heavy sections)
py-28 md:py-36 lg:py-44       (extra - stats/impact sections)
```

### Gaps
- Card grids: `gap-4` or `gap-8`
- Stacked content: `mt-6` to `mt-8` between elements

---

## 6. Image Treatments

### Card images
```html
<div class="relative aspect-[4/3] overflow-hidden rounded-2xl reveal-clip">
  <img src="..." class="fade-image absolute inset-0 w-full h-full object-cover hover-zoom" loading="lazy" onload="this.classList.add('loaded')" />
</div>
```

### Aspect ratios used
| Ratio     | Usage                                    |
|-----------|------------------------------------------|
| `4/3`     | Feature cards, product showcase          |
| `3/4`     | Team member portraits                   |
| `2/3`     | Accessory/collection cards              |
| `16/9`    | Editorial wide images                   |
| `21/9`    | Editorial ultra-wide (desktop)          |
| `32/9`    | CTA banner image                        |

### Image with text overlay
```html
<div class="relative aspect-[32/9] w-full reveal-clip">
  <img src="..." class="absolute inset-0 w-full h-full object-cover" />
  <div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30"></div>
  <div class="absolute inset-0 flex items-end px-8 pb-8 md:px-14 md:pb-12 lg:px-20 lg:pb-16">
    <!-- Text content here -->
  </div>
</div>
```

### Glass/frosted overlays (on images)
```html
<div class="backdrop-blur-md rounded-xl px-4 py-3" style="background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.1)">
```

### Product price badges (on images)
```html
<span class="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
  Alpine $299
</span>
```

---

## 7. Section Structure Patterns

### Standard section (Astro)
```astro
<section class="bg-background relative overflow-hidden">
  <!-- Floral SVG 1 (large, hidden lg:block) -->
  <!-- Floral SVG 2 (small, always visible) -->

  <div class="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32">
    <!-- Subtitle label (blur-words or word-blur-group) -->
    <!-- Heading (word-blur-group with accent span) -->
    <!-- Body content -->
  </div>
</section>
```

### Sticky scroll section (React)
Used for Hero and Philosophy sections with scroll-driven parallax:
```tsx
<section ref={sectionRef} className="relative bg-background">
  <div className="sticky top-0 h-screen overflow-hidden">
    {/* Scroll-driven content */}
  </div>
  <div className="h-[200vh]" /> {/* Scroll distance */}
  <div className="px-6 py-20 md:px-12 lg:px-20">
    {/* Post-scroll content */}
  </div>
</section>
```

### Card grid section
```html
<div class="grid grid-cols-1 gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
  {items.map((item, index) => (
    <div class="reveal group" style={`transition-delay: ${index * 0.15}s`}>
      <div class="relative aspect-[4/3] overflow-hidden rounded-2xl reveal-clip" style={`transition-delay: ${0.1 + index * 0.15}s`}>
        <img class="fade-image absolute inset-0 w-full h-full object-cover hover-zoom" loading="lazy" onload="this.classList.add('loaded')" />
      </div>
      <div class="py-6">
        <p class="reveal mb-2 text-xs uppercase tracking-widest text-muted-foreground">{item.label}</p>
        <h3 class="reveal-flip text-foreground text-xl font-semibold">{item.title}</h3>
      </div>
    </div>
  ))}
</div>
```

### Mobile horizontal scroll + Desktop grid
Used in CollectionSection - horizontal scroll on mobile, grid on desktop:
```html
<!-- Mobile: horizontal scroll -->
<div class="flex gap-6 overflow-x-auto px-6 pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
  {items.map(...)}
</div>
<!-- Desktop: grid -->
<div class="hidden md:grid md:grid-cols-3 gap-8 md:px-12 lg:px-20">
  {items.map(...)}
</div>
```

---

## 8. Component Reference

| Component                    | File                          | Type   | Hydration       |
|------------------------------|-------------------------------|--------|-----------------|
| Header                       | `Header.tsx`                  | React  | `client:load`   |
| HeroSection                  | `HeroSection.tsx`             | React  | `client:load`   |
| PhilosophySection            | `PhilosophySection.tsx`       | React  | `client:load`   |
| FeaturedProductsSection      | `FeaturedProductsSection.astro`| Astro | Server-rendered  |
| TechnologySection            | `TechnologySection.tsx`       | React  | `client:load`   |
| GallerySection               | `GallerySection.tsx`          | React  | `client:load`   |
| CollectionSection            | `CollectionSection.astro`     | Astro  | Server-rendered  |
| EditorialSection             | `EditorialSection.astro`      | Astro  | Server-rendered  |
| StatsSection                 | `StatsSection.tsx`            | React  | `client:visible` |
| TeamSection                  | `TeamSection.astro`           | Astro  | Server-rendered  |
| TestimonialsSection          | `TestimonialsSection.astro`   | Astro  | Server-rendered  |
| FooterSection                | `FooterSection.astro`         | Astro  | Server-rendered  |
| ScrollRevealText             | `ScrollRevealText.tsx`        | React  | `client:visible` |

---

## 9. Header Behavior

- Floating pill: `fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl`
- Before scroll: transparent background, white text, inverted logo
- After scroll (>50px): `bg-background/80 backdrop-blur-md rounded-full` with shadow
- CTA button: `rounded-full bg-primary text-primary-foreground`

---

## 10. Footer Structure

Three-row layout on light background (`bg-background`):
1. **Row 1**: Logo + horizontal nav links
2. **Row 2**: Contact info (icon circles + text) + social icons (rounded border circles)
3. **Row 3**: Copyright ("Developed by MozacX") + legal links

Footer uses dedicated `footer-reveal` animation with `threshold: 0.01` (no rootMargin).

---

## 11. Borders & Dividers

- Standard: `border-border` (warm beige `#E8D5C4`)
- Section dividers: `border-t border-border` with matching horizontal padding
- On dark backgrounds: `border-white/15`

---

## 12. Responsive Breakpoints

| Prefix | Min-width | Usage                    |
|--------|-----------|--------------------------|
| (none) | 0px       | Mobile-first base        |
| `sm:`  | 640px     | Small tablets            |
| `md:`  | 768px     | Tablets, 2-3 col grids   |
| `lg:`  | 1024px    | Desktop, wider padding   |
| `xl:`  | 1280px    | Large desktop type scale |

---

## New Section Checklist

When adding a new section, go through every item:

### Structure
- [ ] Section wrapper: `<section class="bg-background relative overflow-hidden">`
- [ ] Content container: `px-6 md:px-12 lg:px-20` with appropriate vertical padding
- [ ] Section has an `id` attribute if it's a nav target

### Decorative Elements
- [ ] At least 1 large floral SVG (hidden on mobile if complex)
- [ ] At least 1 small accent floral (visible on all screens)
- [ ] Florals use `text-[#e8b4b8]`, opacity 0.25-0.5, `pointer-events-none`, `aria-hidden="true"`
- [ ] Florals positioned with negative offsets to bleed off edges
- [ ] Floral type varies from adjacent sections (no two mandalas in a row)

### Typography
- [ ] Main heading uses `word-blur-group` with individual `word-blur` spans
- [ ] At least 1 accent word in heading uses Playfair Display italic, weight 500
- [ ] Subtitle label is `text-xs uppercase tracking-[0.3em]` with italic style
- [ ] Body text uses `text-muted-foreground`
- [ ] Heading sizes match the scale in Section 2

### Animations
- [ ] Every visible text element has an entrance animation
- [ ] Headings: `word-blur-group` with staggered `word-blur` spans
- [ ] Subtitles/labels: `blur-words` (auto-split) or manual `word-blur`
- [ ] Body paragraphs: `blur-words` class
- [ ] Card groups: `reveal` with staggered `transition-delay`
- [ ] Images: `reveal-clip` with `fade-image` + `hover-zoom`
- [ ] Elements have appropriate `transition-delay` for stagger effect
- [ ] React components: IntersectionObserver in useEffect (not relying on global observer)
- [ ] Near-bottom elements: use dedicated observer with `threshold: 0.01`

### Images
- [ ] All images use `object-cover` with `absolute inset-0 w-full h-full`
- [ ] Lazy loading: `loading="lazy"` on below-fold images
- [ ] Fade-in: `class="fade-image"` with `onload="this.classList.add('loaded')"`
- [ ] Container has fixed aspect ratio and `overflow-hidden rounded-2xl`
- [ ] Hover zoom: `hover-zoom` class inside a `group` parent

### Responsiveness
- [ ] Horizontal padding scales: `px-6 md:px-12 lg:px-20`
- [ ] Grid adapts: `grid-cols-1 md:grid-cols-2` or `md:grid-cols-3`
- [ ] Text sizes scale across breakpoints
- [ ] Mobile: consider horizontal scroll alternative for card rows

### Accessibility
- [ ] Decorative SVGs have `aria-hidden="true"`
- [ ] Images have meaningful `alt` text
- [ ] Interactive elements have `aria-label` when no visible text
- [ ] Color contrast sufficient for text readability
