import { useEffect, useRef, useState } from "react";
import { ScrollRevealText } from "./ScrollRevealText";

const sideImages = [
  { src: "/images/flott-36.webp", alt: "Abuja Circle gathering", position: "left", span: 1 },
  { src: "/images/flott-38.webp", alt: "Kaduna Circle session", position: "left", span: 1 },
  { src: "/images/flott-40.webp", alt: "Port Harcourt Circle", position: "right", span: 1 },
  { src: "/images/flott-42.webp", alt: "Enugu Circle meeting", position: "right", span: 1 },
];

export function TechnologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const stableHeight = useRef(typeof window !== "undefined" ? window.innerHeight : 800);

  const descriptionText = "Four cities. One shared philosophy. Each Circle moves to the rhythm of its community — honouring local culture while staying rooted in wellness, skills, and empowerment. From Kaduna to Ilorin, every gathering brings women closer to balanced, intentional living.";

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = stableHeight.current * 2;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1280;
  const isDesktop = screenWidth >= 1280;
  const titleOpacity = Math.max(0, 1 - (scrollProgress / 0.2));
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));
  const centerWidth = Math.max(
    isMobile ? 52 : isTablet ? 48 : 42,
    100 - (imageProgress * (isTablet ? 50 : 58))
  );
  const centerHeight = 100 - (imageProgress * 30);
  const sideWidth = imageProgress * (isMobile ? 23 : isTablet ? 24 : 22);
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + (imageProgress * 100);
  const sideTranslateRight = 100 - (imageProgress * 100);
  const borderRadius = imageProgress * 24;
  const gap = imageProgress * (isMobile ? 3 : isTablet ? 4 : 16);
  const containerPadding = imageProgress * (isMobile ? 0 : isTablet ? 0 : 16);

  return (
    <section ref={sectionRef} className="relative bg-foreground">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          <div className="relative flex h-full w-full items-stretch justify-center" style={{ gap: `${gap}px`, padding: `${containerPadding}px` }}>

            <div className="flex flex-col will-change-transform" style={{ width: `${sideWidth}%`, gap: `${gap}px`, transform: `translateX(${sideTranslateLeft}%)`, opacity: sideOpacity, ...(!isDesktop ? { height: '50%', alignSelf: 'center' } : {}) }}>
              {sideImages.filter(img => img.position === "left").map((img, idx) => (
                <div key={idx} className="relative overflow-hidden will-change-transform" style={{ flex: img.span, borderRadius: `${borderRadius}px` }}>
                  <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden will-change-transform" style={{ width: `${centerWidth}%`, height: `${centerHeight}%`, flex: "0 0 auto", borderRadius: `${borderRadius}px`, alignSelf: 'center' }}>
              <img src="/images/flott-15.webp" alt="Women's empowerment event" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-foreground/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <h2 className="max-w-3xl font-medium leading-tight tracking-tight text-white md:text-5xl lg:text-7xl text-5xl">
                  {["Five Cities.", "One", "Circle."].map((word, index) => {
                    const wordFadeStart = index * 0.07;
                    const wordFadeEnd = wordFadeStart + 0.07;
                    const wordProgress = Math.max(0, Math.min(1, (scrollProgress - wordFadeStart) / (wordFadeEnd - wordFadeStart)));
                    const wordOpacity = 1 - wordProgress;
                    const wordBlur = wordProgress * 10;
                    return (
                      <span key={index} className="inline-block" style={{ opacity: wordOpacity, filter: `blur(${wordBlur}px)`, transition: 'opacity 0.1s linear, filter 0.1s linear', marginRight: index < 2 ? '0.3em' : '0', ...(index === 2 ? { fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 } : {}) }}>
                        {word}
                        {index === 1 && <br />}
                      </span>
                    );
                  })}
                </h2>
              </div>
            </div>

            <div className="flex flex-col will-change-transform" style={{ width: `${sideWidth}%`, gap: `${gap}px`, transform: `translateX(${sideTranslateRight}%)`, opacity: sideOpacity, ...(!isDesktop ? { height: '50%', alignSelf: 'center' } : {}) }}>
              {sideImages.filter(img => img.position === "right").map((img, idx) => (
                <div key={idx} className="relative overflow-hidden will-change-transform" style={{ flex: img.span, borderRadius: `${borderRadius}px` }}>
                  <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      <div className="h-[200vh]" />

      <div className="relative overflow-hidden bg-background px-6 py-14 md:px-12 md:py-20 lg:px-20 lg:py-40">
        {/* Large mandala — left side, partially cropped */}
        <svg className="absolute -left-[140px] top-1/2 -translate-y-1/2 w-[420px] h-[420px] md:-left-[100px] md:w-[520px] md:h-[520px] lg:-left-[60px] lg:w-[600px] lg:h-[600px] text-[#e8b4b8] opacity-[0.18] pointer-events-none" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {/* Outer circles */}
          <circle cx="200" cy="200" r="195" />
          <circle cx="200" cy="200" r="180" />
          <circle cx="200" cy="200" r="155" />
          {/* Cardinal scallops */}
          <path d="M200 25 Q218 48 200 55 Q182 48 200 25" />
          <path d="M200 375 Q218 352 200 345 Q182 352 200 375" />
          <path d="M25 200 Q48 182 55 200 Q48 218 25 200" />
          <path d="M375 200 Q352 182 345 200 Q352 218 375 200" />
          {/* Diagonal scallops */}
          <path d="M73 73 Q96 80 88 96 Q80 96 73 73" />
          <path d="M327 73 Q304 80 312 96 Q320 96 327 73" />
          <path d="M73 327 Q80 304 96 312 Q96 320 73 327" />
          <path d="M327 327 Q320 304 304 312 Q304 320 327 327" />
          {/* 12 large petals */}
          <path d="M200 55 Q214 105 200 140 Q186 105 200 55Z" />
          <path d="M200 345 Q214 295 200 260 Q186 295 200 345Z" />
          <path d="M55 200 Q105 186 140 200 Q105 214 55 200Z" />
          <path d="M345 200 Q295 186 260 200 Q295 214 345 200Z" />
          <path d="M96 96 Q122 114 138 138 Q114 122 96 96Z" />
          <path d="M304 96 Q278 114 262 138 Q286 122 304 96Z" />
          <path d="M96 304 Q114 278 138 262 Q122 286 96 304Z" />
          <path d="M304 304 Q286 278 262 262 Q278 286 304 304Z" />
          <path d="M145 62 Q166 108 162 145 Q150 102 145 62Z" />
          <path d="M255 62 Q234 108 238 145 Q250 102 255 62Z" />
          <path d="M145 338 Q150 298 162 255 Q166 292 145 338Z" />
          <path d="M255 338 Q250 298 238 255 Q234 292 255 338Z" />
          {/* 8 inner petals */}
          <path d="M200 115 Q210 148 200 168 Q190 148 200 115Z" />
          <path d="M200 285 Q210 252 200 232 Q190 252 200 285Z" />
          <path d="M115 200 Q148 190 168 200 Q148 210 115 200Z" />
          <path d="M285 200 Q252 190 232 200 Q252 210 285 200Z" />
          <path d="M138 138 Q155 152 165 165 Q152 155 138 138Z" />
          <path d="M262 138 Q245 152 235 165 Q258 155 262 138Z" />
          <path d="M138 262 Q152 245 165 235 Q155 258 138 262Z" />
          <path d="M262 262 Q258 245 235 235 Q245 258 262 262Z" />
          {/* Center mandala */}
          <circle cx="200" cy="200" r="60" />
          <circle cx="200" cy="200" r="42" />
          <circle cx="200" cy="200" r="22" />
          <circle cx="200" cy="200" r="8" fill="currentColor" opacity="0.2" />
          {/* Center rays */}
          <line x1="200" y1="158" x2="200" y2="140" />
          <line x1="200" y1="242" x2="200" y2="260" />
          <line x1="158" y1="200" x2="140" y2="200" />
          <line x1="242" y1="200" x2="260" y2="200" />
          <line x1="170" y1="170" x2="158" y2="158" />
          <line x1="230" y1="170" x2="242" y2="158" />
          <line x1="170" y1="230" x2="158" y2="242" />
          <line x1="230" y1="230" x2="242" y2="242" />
          {/* Dot accents */}
          <circle cx="200" cy="125" r="3" /><circle cx="200" cy="275" r="3" />
          <circle cx="125" cy="200" r="3" /><circle cx="275" cy="200" r="3" />
          <circle cx="148" cy="148" r="2.5" /><circle cx="252" cy="148" r="2.5" />
          <circle cx="148" cy="252" r="2.5" /><circle cx="252" cy="252" r="2.5" />
          <circle cx="168" cy="112" r="2" /><circle cx="232" cy="112" r="2" />
          <circle cx="168" cy="288" r="2" /><circle cx="232" cy="288" r="2" />
          <circle cx="112" cy="168" r="2" /><circle cx="112" cy="232" r="2" />
          <circle cx="288" cy="168" r="2" /><circle cx="288" cy="232" r="2" />
        </svg>

        {/* Two-column editorial layout */}
        <div className="relative z-10 flex flex-col gap-12 md:flex-row md:gap-16 lg:gap-24">
          {/* Left column — heading + CTA */}
          <div className="md:w-[42%] lg:w-[38%] flex flex-col justify-center">
            <h3 className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Five Cities.
              <br />
              One{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
                Circle.
              </span>
            </h3>
            <p className="mt-6 text-sm tracking-[0.12em] uppercase text-muted-foreground/60">
              Abuja &bull; Kaduna &bull; Port Harcourt &bull; Enugu &bull; Ilorin
            </p>
            <a
              href="/circles"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-xs font-medium uppercase tracking-[0.15em] text-background transition-all duration-500 hover:bg-foreground/85"
              style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
            >
              Explore Our Circles
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>

          {/* Right column — body text */}
          <div className="md:w-[58%] lg:w-[62%] flex items-center">
            <ScrollRevealText text={descriptionText} accentWords={["Circle", "empowerment"]} className="!text-2xl md:!text-3xl lg:!text-[2.5rem] lg:!leading-snug" />
          </div>
        </div>
      </div>
    </section>
  );
}
