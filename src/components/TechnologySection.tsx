import { useEffect, useRef, useState } from "react";
import { ScrollRevealText } from "./ScrollRevealText";

const sideImages = [
  { src: "/images/flott-36.jpeg", alt: "Abuja Circle gathering", position: "left", span: 1 },
  { src: "/images/flott-38.jpeg", alt: "Kaduna Circle session", position: "left", span: 1 },
  { src: "/images/flott-40.jpeg", alt: "Port Harcourt Circle", position: "right", span: 1 },
  { src: "/images/flott-42.jpeg", alt: "Enugu Circle meeting", position: "right", span: 1 },
];

export function TechnologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const descriptionText = "Flott Women's Circle operates across five vibrant cities in Nigeria. Each Circle adapts programming to its local rhythm and culture, while staying rooted in our shared philosophy of wellness, skills, and holistic empowerment. From Abuja to Ilorin, every gathering is a step toward balanced, fulfilled living.";

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

  const titleOpacity = Math.max(0, 1 - (scrollProgress / 0.2));
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));
  const centerWidth = 100 - (imageProgress * 58);
  const centerHeight = 100 - (imageProgress * 30);
  const sideWidth = imageProgress * 22;
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + (imageProgress * 100);
  const sideTranslateRight = 100 - (imageProgress * 100);
  const borderRadius = imageProgress * 24;
  const gap = imageProgress * 16;

  return (
    <section ref={sectionRef} className="relative bg-foreground">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          <div className="relative flex h-full w-full items-stretch justify-center" style={{ gap: `${gap}px`, padding: `${imageProgress * 16}px` }}>

            <div className="flex flex-col will-change-transform" style={{ width: `${sideWidth}%`, gap: `${gap}px`, transform: `translateX(${sideTranslateLeft}%)`, opacity: sideOpacity }}>
              {sideImages.filter(img => img.position === "left").map((img, idx) => (
                <div key={idx} className="relative overflow-hidden will-change-transform" style={{ flex: img.span, borderRadius: `${borderRadius}px` }}>
                  <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden will-change-transform" style={{ width: `${centerWidth}%`, height: "100%", flex: "0 0 auto", borderRadius: `${borderRadius}px` }}>
              <img src="/images/flott-15.jpeg" alt="Women's empowerment event" className="absolute inset-0 w-full h-full object-cover" />
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

            <div className="flex flex-col will-change-transform" style={{ width: `${sideWidth}%`, gap: `${gap}px`, transform: `translateX(${sideTranslateRight}%)`, opacity: sideOpacity }}>
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

      <div className="relative overflow-hidden bg-background px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-40">
        {/* Spiral Fern Garden — left side */}
        <svg className="absolute -left-10 top-1/2 -translate-y-1/2 w-[280px] h-[400px] lg:w-[360px] lg:h-[500px] text-[#e8b4b8] opacity-[0.3] pointer-events-none hidden md:block" viewBox="0 0 380 520" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {/* Main spiral fern — large fiddlehead */}
          <path d="M190 500 C190 440 170 380 175 320 C180 260 160 220 170 160 C180 100 200 80 220 60 C240 40 260 40 270 60 C280 80 270 110 250 120 C230 130 210 115 220 95" />
          {/* Inner spiral detail */}
          <path d="M240 75 C252 68 260 76 256 88 C252 100 240 96 244 84" />
          {/* Branch 1 — right frond */}
          <path d="M175 320 C210 300 240 310 250 290 C260 270 240 258 210 280" />
          <path d="M210 280 C220 272 228 276 225 286" />
          <path d="M220 296 C232 288 238 292 234 302" opacity="0.6" />
          <path d="M236 282 C246 276 252 280 248 290" opacity="0.6" />
          {/* Branch 2 — left frond */}
          <path d="M170 260 C135 245 108 255 102 238 C96 220 118 212 148 236" />
          <path d="M148 236 C138 228 134 234 138 242" />
          <path d="M128 248 C118 242 114 248 118 256" opacity="0.6" />
          <path d="M112 236 C102 230 98 236 102 244" opacity="0.6" />
          {/* Branch 3 — right spiral with folk flower */}
          <path d="M178 200 C208 188 226 198 224 218 C222 238 202 234 206 216" />
          <path d="M224 218 C236 212 242 218 238 228" />
          <circle cx="240" cy="230" r="2" />
          <circle cx="224" cy="218" r="4" />
          <path d="M224 210 Q228 204 224 198 Q220 204 224 210Z" />
          <path d="M232 214 Q238 212 240 206 Q234 210 232 214Z" />
          <path d="M232 222 Q238 224 240 230 Q234 226 232 222Z" />
          <path d="M224 226 Q228 232 224 238 Q220 232 224 226Z" />
          <path d="M216 222 Q210 224 208 230 Q214 226 216 222Z" />
          <path d="M216 214 Q210 212 208 206 Q214 210 216 214Z" />
          {/* Branch 4 — left tendril */}
          <path d="M165 380 C132 368 115 378 118 396 C121 414 140 408 136 392" />
          <path d="M118 396 C108 388 100 394 104 404" />
          <circle cx="105" cy="406" r="2" />
          <path d="M136 392 C124 384 118 390 122 400" />
          <path d="M136 392 C148 384 154 390 150 400" />
          {/* Scattered leaves along stem */}
          <path d="M185 440 C198 432 204 438 200 448" />
          <path d="M185 440 C172 432 166 438 170 448" />
          <path d="M172 140 C184 132 190 138 186 148" />
          <path d="M172 140 C160 132 154 138 158 148" />
          {/* Dot accents */}
          <circle cx="250" cy="288" r="2.5" /><circle cx="102" cy="234" r="2.5" />
          <circle cx="175" cy="320" r="2" /><circle cx="170" cy="260" r="2" />
          <circle cx="178" cy="200" r="2" /><circle cx="165" cy="380" r="2" />
          <circle cx="270" cy="62" r="2.5" /><circle cx="250" cy="122" r="2.5" />
          {/* Hydrangea cluster near bottom */}
          <circle cx="210" cy="460" r="4" /><circle cx="220" cy="455" r="4" /><circle cx="215" cy="465" r="4" />
          <circle cx="205" cy="468" r="3" /><circle cx="225" cy="462" r="3" />
          {/* Concentric rings at fern center */}
          <circle cx="220" cy="95" r="3" />
          <circle cx="220" cy="95" r="8" opacity="0.5" />
        </svg>

        {/* Small leaf cluster — right side accent */}
        <svg className="absolute -right-4 bottom-12 w-[100px] h-[140px] md:w-[130px] md:h-[180px] text-[#e8b4b8] opacity-[0.25] pointer-events-none" viewBox="0 0 200 280" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: "scaleX(-1)" }}>
          <path d="M100 270 C100 230 85 200 92 160 C99 120 88 95 100 55" />
          <path d="M100 160 C125 148 140 155 142 142 C144 130 130 124 100 144" />
          <path d="M100 144 C120 136 134 134 142 142" opacity="0.5" />
          <path d="M100 100 C75 88 58 95 56 82 C54 70 68 64 100 84" />
          <path d="M100 84 C78 76 60 74 56 82" opacity="0.5" />
          <path d="M100 55 C108 42 104 28 100 20 C96 28 92 42 100 55" />
          <circle cx="100" cy="16" r="2" /><circle cx="142" cy="140" r="2" /><circle cx="56" cy="80" r="2" />
        </svg>

        <div className="relative z-10 mx-auto max-w-4xl">
          <ScrollRevealText text={descriptionText} accentWords={["Circle", "empowerment"]} />
        </div>
      </div>
    </section>
  );
}
