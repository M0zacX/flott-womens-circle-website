import { useEffect, useRef, useState } from "react";

const word = "FLOTT";

const sideImages = [
  { src: "/images/flott-26.jpeg", alt: "Women's circle gathering", position: "left", span: 1 },
  { src: "/images/flott-29.jpeg", alt: "Community wellness session", position: "left", span: 1 },
  { src: "/images/flott-32.jpeg", alt: "Empowerment workshop", position: "right", span: 1 },
  { src: "/images/flott-34.jpeg", alt: "Women connecting", position: "right", span: 1 },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroTextRef = useRef<HTMLParagraphElement>(null);
  const [heroTextVisible, setHeroTextVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 2;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!heroTextRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setHeroTextVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(heroTextRef.current);
    return () => obs.disconnect();
  }, []);

  const textOpacity = Math.max(0, 1 - (scrollProgress / 0.2));
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));
  const centerWidth = 100 - (imageProgress * 58);
  const centerHeight = 100 - (imageProgress * 30);
  const sideWidth = imageProgress * 22;
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + (imageProgress * 100);
  const sideTranslateRight = 100 - (imageProgress * 100);
  const borderRadius = imageProgress * 24;
  const gap = imageProgress * 16;
  const sideTranslateY = -(imageProgress * 15);

  return (
    <section ref={sectionRef} className="relative bg-background">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative flex h-full w-full items-stretch justify-center"
            style={{ gap: `${gap}px`, padding: `${imageProgress * 16}px`, paddingBottom: `${60 + (imageProgress * 40)}px` }}
          >
            {/* Left Column */}
            <div
              className="flex flex-col will-change-transform"
              style={{ width: `${sideWidth}%`, gap: `${gap}px`, transform: `translateX(${sideTranslateLeft}%) translateY(${sideTranslateY}%)`, opacity: sideOpacity }}
            >
              {sideImages.filter(img => img.position === "left").map((img, idx) => (
                <div key={idx} className="relative overflow-hidden will-change-transform" style={{ flex: img.span, borderRadius: `${borderRadius}px` }}>
                  <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Center */}
            <div
              className="relative overflow-hidden will-change-transform"
              style={{ width: `${centerWidth}%`, height: `${centerHeight}%`, flex: "0 0 auto", borderRadius: `${borderRadius}px` }}
            >
              <img src="/images/flott-01.jpeg" alt="Flott Women's Circle gathering" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
              <div className="absolute inset-0 flex items-end overflow-hidden" style={{ opacity: textOpacity }}>
                <h1 className="w-full text-[22vw] font-medium leading-[0.8] tracking-tighter text-white">
                  {word.split("").map((letter, index) => (
                    <span
                      key={index}
                      className="inline-block animate-[slideUp_1.8s_cubic-bezier(0.22,1,0.36,1)_forwards] opacity-0"
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      {letter}
                    </span>
                  ))}
                </h1>
              </div>
            </div>

            {/* Right Column */}
            <div
              className="flex flex-col will-change-transform"
              style={{ width: `${sideWidth}%`, gap: `${gap}px`, transform: `translateX(${sideTranslateRight}%) translateY(${sideTranslateY}%)`, opacity: sideOpacity }}
            >
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

      <div className="relative px-6 pt-32 pb-28 md:pt-48 md:px-12 md:pb-36 lg:px-20 lg:pt-56 lg:pb-44 overflow-hidden">
        {/* Henna Paisley Cascade — right side */}
        <svg className="absolute -right-8 top-1/2 -translate-y-1/2 w-[260px] h-[380px] md:w-[320px] md:h-[460px] lg:w-[400px] lg:h-[550px] text-[#e8b4b8] opacity-[0.35] pointer-events-none" viewBox="0 0 400 550" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {/* Outer paisley body */}
          <path d="M200 530 C125 455 50 355 50 235 C50 115 115 40 200 18 C285 40 350 115 350 235 C350 355 275 455 200 530Z" />
          {/* Inner paisley with scalloped edge */}
          <path d="M200 475 C142 415 90 335 90 245 C90 155 138 92 200 72 C262 92 310 155 310 245 C310 335 258 415 200 475Z" />
          {/* Scallop bumps on inner paisley */}
          <path d="M120 130 C135 118 155 122 165 132" /><path d="M165 132 C175 118 195 112 200 112" />
          <path d="M200 112 C205 112 225 118 235 132" /><path d="M235 132 C245 122 265 118 280 130" />
          <path d="M92 200 C82 215 84 235 90 245" /><path d="M310 245 C316 235 318 215 308 200" />
          {/* Third inner ring */}
          <path d="M200 420 C158 372 125 310 125 250 C125 185 155 138 200 120 C245 138 275 185 275 250 C275 310 242 372 200 420Z" />
          {/* Spiral center */}
          <path d="M200 270 C200 260 210 254 218 258 C226 262 224 276 216 278 C208 280 198 276 196 266 C194 256 202 248 214 248 C226 248 234 260 232 272 C230 284 216 292 204 290" />
          {/* Radiating petals from center — 8 directions */}
          <path d="M200 240 Q208 220 200 200 Q192 220 200 240Z" />
          <path d="M220 252 Q238 240 248 222 Q232 236 220 252Z" />
          <path d="M228 272 Q248 272 264 262 Q246 268 228 272Z" />
          <path d="M220 290 Q238 302 248 320 Q232 306 220 290Z" />
          <path d="M200 300 Q208 320 200 340 Q192 320 200 300Z" />
          <path d="M180 290 Q162 302 152 320 Q168 306 180 290Z" />
          <path d="M172 272 Q152 272 136 262 Q154 268 172 272Z" />
          <path d="M180 252 Q162 240 152 222 Q168 236 180 252Z" />
          {/* Dot ring around center */}
          <circle cx="200" cy="195" r="3" /><circle cx="248" cy="218" r="3" /><circle cx="268" cy="260" r="3" />
          <circle cx="248" cy="322" r="3" /><circle cx="200" cy="345" r="3" /><circle cx="152" cy="322" r="3" />
          <circle cx="132" cy="260" r="3" /><circle cx="152" cy="218" r="3" />
          {/* Teardrop accents between 2nd and 3rd rings */}
          <path d="M145 175 C137 165 135 172 140 180 C145 172 147 168 145 175" />
          <path d="M255 175 C263 165 265 172 260 180 C255 172 253 168 255 175" />
          <path d="M112 280 C104 270 102 278 107 286 C112 278 114 274 112 280" />
          <path d="M288 280 C296 270 298 278 293 286 C288 278 286 274 288 280" />
          <path d="M145 370 C137 360 135 368 140 376 C145 368 147 364 145 370" />
          <path d="M255 370 C263 360 265 368 260 376 C255 368 253 364 255 370" />
          {/* Small inner dots in teardrops zone */}
          <circle cx="130" cy="210" r="2" /><circle cx="270" cy="210" r="2" />
          <circle cx="110" cy="310" r="2" /><circle cx="290" cy="310" r="2" />
          <circle cx="155" cy="400" r="2" /><circle cx="245" cy="400" r="2" />
          {/* Top tip curling tendrils */}
          <path d="M200 18 C222 8 236 18 232 36 C228 54 210 48 213 34" />
          <path d="M200 18 C178 8 164 18 168 36 C172 54 190 48 187 34" />
          <circle cx="200" cy="8" r="3.5" />
          {/* Decorative zigzag band between outer and 2nd ring (upper) */}
          <path d="M115 108 L125 98 L135 108 L145 98 L155 108 L165 98 L175 108 L185 98 L195 108 L205 98 L215 108 L225 98 L235 108 L245 98 L255 108 L265 98 L275 108" opacity="0.6" />
          {/* Small vine from bottom */}
          <path d="M200 530 C228 542 244 528 240 508 C236 488 218 492 220 510" />
          <path d="M240 508 C254 498 262 506 258 518" />
          <circle cx="260" cy="520" r="2.5" />
          {/* Leaf pair at bottom vine */}
          <path d="M220 510 C208 500 198 506 202 516" />
          <path d="M240 508 C248 496 256 500 252 510" />
        </svg>

        {/* Mirrored small paisley — left side (mobile visible) */}
        <svg className="absolute -left-4 bottom-8 w-[100px] h-[140px] md:w-[140px] md:h-[200px] text-[#e8b4b8] opacity-[0.3] pointer-events-none" viewBox="0 0 400 550" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: "scaleX(-1) rotate(30deg)" }}>
          <path d="M200 530 C125 455 50 355 50 235 C50 115 115 40 200 18 C285 40 350 115 350 235 C350 355 275 455 200 530Z" />
          <path d="M200 420 C158 372 125 310 125 250 C125 185 155 138 200 120 C245 138 275 185 275 250 C275 310 242 372 200 420Z" />
          <path d="M200 270 C200 260 210 254 218 258 C226 262 224 276 216 278 C208 280 198 276 196 266 C194 256 202 248 214 248" />
          <path d="M200 240 Q208 220 200 200 Q192 220 200 240Z" />
          <path d="M200 300 Q208 320 200 340 Q192 320 200 300Z" />
          <path d="M228 272 Q248 272 264 262 Q246 268 228 272Z" />
          <path d="M172 272 Q152 272 136 262 Q154 268 172 272Z" />
          <circle cx="200" cy="195" r="3" /><circle cx="200" cy="345" r="3" />
          <circle cx="132" cy="260" r="3" /><circle cx="268" cy="260" r="3" />
        </svg>

        <p ref={heroTextRef} className={`word-blur-group ${heroTextVisible ? "visible" : ""} mx-auto max-w-2xl text-center text-2xl leading-relaxed text-muted-foreground md:text-3xl lg:text-[2.5rem] lg:leading-snug relative z-10`}>
          <span className="word-blur" style={{ transitionDelay: "0s" }}>We're</span>{" "}
          <span className="word-blur" style={{ transitionDelay: "0.1s" }}>not</span>{" "}
          <span className="word-blur" style={{ transitionDelay: "0.2s" }}>networking.</span>
          <br />
          <span className="word-blur" style={{ transitionDelay: "0.35s" }}>We're</span>{" "}
          <span className="word-blur" style={{ transitionDelay: "0.5s", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>reconnecting.</span>
        </p>
      </div>
    </section>
  );
}
