import { useEffect, useRef, useState, useCallback } from "react";
import { ScrollRevealText } from "./ScrollRevealText";

export function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [alpineTranslateX, setAlpineTranslateX] = useState(-100);
  const [forestTranslateX, setForestTranslateX] = useState(100);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const rafRef = useRef<number | null>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const [titleWordsVisible, setTitleWordsVisible] = useState(false);
  const stableHeight = useRef(typeof window !== "undefined" ? window.innerHeight : 800);

  const updateTransforms = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = stableHeight.current;
    const sectionHeight = sectionRef.current.offsetHeight;
    const scrollableRange = sectionHeight - windowHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));
    setAlpineTranslateX((1 - progress) * -100);
    setForestTranslateX((1 - progress) * 100);
    setTitleOpacity(1 - progress);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateTransforms);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransforms();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateTransforms]);

  useEffect(() => {
    if (!textRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTextVisible(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(textRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTitleWordsVisible(true); obs.disconnect(); }
    }, { threshold: 0.05 });
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="bg-background">
      <div ref={sectionRef} className="relative" style={{ height: "200vh" }}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {/* Large decorative mandala — centered background */}
          <svg className="absolute inset-0 m-auto w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] text-[#e8b4b8] opacity-50 pointer-events-none" viewBox="0 0 600 600" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {/* Innermost — spiral center */}
            <circle cx="300" cy="300" r="8" /><circle cx="300" cy="300" r="16" />
            <path d="M300 300 C300 290 310 284 318 288 C326 292 324 306 316 308 C308 310 296 306 294 296 C292 286 300 278 312 278 C324 278 332 290 330 302 C328 314 314 322 302 320" />
            {/* Inner petals ring — 8 petals */}
            <path d="M300 272 Q312 244 300 218 Q288 244 300 272Z" />
            <path d="M320 278 Q346 264 356 238 Q336 256 320 278Z" />
            <path d="M328 300 Q356 300 378 280 Q352 292 328 300Z" />
            <path d="M320 322 Q346 336 356 362 Q336 344 320 322Z" />
            <path d="M300 328 Q312 356 300 382 Q288 356 300 328Z" />
            <path d="M280 322 Q254 336 244 362 Q264 344 280 322Z" />
            <path d="M272 300 Q244 300 222 280 Q248 292 272 300Z" />
            <path d="M280 278 Q254 264 244 238 Q264 256 280 278Z" />
            {/* Inner ring */}
            <circle cx="300" cy="300" r="60" />
            {/* Inner dot ring */}
            <circle cx="300" cy="232" r="4" /><circle cx="348" cy="248" r="4" /><circle cx="368" cy="300" r="4" />
            <circle cx="348" cy="352" r="4" /><circle cx="300" cy="368" r="4" /><circle cx="252" cy="352" r="4" />
            <circle cx="232" cy="300" r="4" /><circle cx="252" cy="248" r="4" />
            {/* Middle petals — 12 elongated */}
            <path d="M300 228 Q316 186 300 148 Q284 186 300 228Z" />
            <path d="M326 236 Q356 204 350 164 Q334 200 326 236Z" />
            <path d="M344 262 Q382 248 404 214 Q376 240 344 262Z" />
            <path d="M344 338 Q382 352 404 386 Q376 360 344 338Z" />
            <path d="M326 364 Q356 396 350 436 Q334 400 326 364Z" />
            <path d="M300 372 Q316 414 300 452 Q284 414 300 372Z" />
            <path d="M274 364 Q244 396 250 436 Q266 400 274 364Z" />
            <path d="M256 338 Q218 352 196 386 Q224 360 256 338Z" />
            <path d="M256 262 Q218 248 196 214 Q224 240 256 262Z" />
            <path d="M274 236 Q244 204 250 164 Q266 200 274 236Z" />
            <path d="M348 300 Q386 300 418 278 Q390 294 348 300Z" />
            <path d="M252 300 Q214 300 182 278 Q210 294 252 300Z" />
            {/* Middle ring */}
            <circle cx="300" cy="300" r="120" />
            {/* Outer scallop petals — 16 small */}
            <path d="M300 178 Q308 162 300 146 Q292 162 300 178" />
            <path d="M342 190 Q354 178 350 160 Q340 176 342 190" />
            <path d="M372 218 Q386 212 394 196 Q380 208 372 218" />
            <path d="M386 260 Q402 258 412 244 Q398 252 386 260" />
            <path d="M386 340 Q402 342 412 356 Q398 348 386 340" />
            <path d="M372 382 Q386 388 394 404 Q380 392 372 382" />
            <path d="M342 410 Q354 422 350 440 Q340 424 342 410" />
            <path d="M300 422 Q308 438 300 454 Q292 438 300 422" />
            <path d="M258 410 Q246 422 250 440 Q260 424 258 410" />
            <path d="M228 382 Q214 388 206 404 Q220 392 228 382" />
            <path d="M214 340 Q198 342 188 356 Q202 348 214 340" />
            <path d="M214 260 Q198 258 188 244 Q202 252 214 260" />
            <path d="M228 218 Q214 212 206 196 Q220 208 228 218" />
            <path d="M258 190 Q246 178 250 160 Q260 176 258 190" />
            <path d="M420 300 Q436 306 444 300 Q436 294 420 300" />
            <path d="M180 300 Q164 306 156 300 Q164 294 180 300" />
            {/* Outer ring */}
            <circle cx="300" cy="300" r="155" />
            {/* Outermost decorative arcs connecting tips */}
            <path d="M300 140 Q370 140 420 180" fill="none" />
            <path d="M420 180 Q462 230 462 300" fill="none" />
            <path d="M462 300 Q462 370 420 420" fill="none" />
            <path d="M420 420 Q370 462 300 462" fill="none" />
            <path d="M300 462 Q230 462 180 420" fill="none" />
            <path d="M180 420 Q138 370 138 300" fill="none" />
            <path d="M138 300 Q138 230 180 180" fill="none" />
            <path d="M180 180 Q230 140 300 140" fill="none" />
            {/* Outermost leaf accents at cardinal points */}
            <path d="M300 138 C310 120 306 100 300 88 C294 100 290 120 300 138" />
            <path d="M462 300 C480 310 500 306 512 300 C500 294 480 290 462 300" />
            <path d="M300 462 C310 480 306 500 300 512 C294 500 290 480 300 462" />
            <path d="M138 300 C120 310 100 306 88 300 C100 294 120 290 138 300" />
            {/* Tiny tip dots */}
            <circle cx="300" cy="84" r="3" /><circle cx="516" cy="300" r="3" />
            <circle cx="300" cy="516" r="3" /><circle cx="84" cy="300" r="3" />
          </svg>

          <div className="relative w-full">
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-0 word-blur-group ${titleWordsVisible ? "visible" : ""}`} style={{ opacity: titleOpacity }}>
              <h2 className="text-[12vw] font-medium leading-[0.95] tracking-tighter text-foreground md:text-[10vw] lg:text-[7vw] xl:text-[6vw] text-center px-6">
                <span className="word-blur" style={{ transitionDelay: "0s" }}>Wellness.</span>{" "}
                <span className="word-blur" style={{ transitionDelay: "0.15s" }}>Skills.</span>{" "}
                <span className="word-blur" style={{ transitionDelay: "0.35s", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>Empowerment.</span>
              </h2>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:px-12 xl:grid-cols-2 xl:px-20 place-items-center">
              <div
                className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl max-h-[38vh] xl:max-h-none"
                style={{ transform: `translate3d(${alpineTranslateX}%, 0, 0)`, backfaceVisibility: 'hidden' }}
              >
                <img src="/images/flott-05.webp" alt="Women's wellness session" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute bottom-6 left-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                    Wellness Education
                  </span>
                </div>
              </div>

              <div
                className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl max-h-[38vh] xl:max-h-none"
                style={{ transform: `translate3d(${forestTranslateX}%, 0, 0)`, backfaceVisibility: 'hidden' }}
              >
                <img src="/images/flott-10.webp" alt="Community empowerment gathering" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute bottom-6 left-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                    Community & Connection
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-36 lg:pb-14">
        {/* Decorative mandala flower */}
        <svg className="absolute -bottom-20 -right-16 w-[360px] h-[360px] text-[#e8b4b8] opacity-50 pointer-events-none hidden lg:block" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="200" cy="200" r="12" /><circle cx="200" cy="200" r="6" />
          <circle cx="200" cy="172" r="3" /><circle cx="228" cy="186" r="3" /><circle cx="217" cy="214" r="3" />
          <circle cx="183" cy="214" r="3" /><circle cx="172" cy="186" r="3" />
          <path d="M200 168 Q212 148 200 128 Q188 148 200 168Z" /><path d="M230 184 Q250 178 258 158 Q238 168 230 184Z" />
          <path d="M220 212 Q238 226 256 222 Q240 208 220 212Z" /><path d="M180 212 Q162 226 144 222 Q160 208 180 212Z" />
          <path d="M170 184 Q150 178 142 158 Q162 168 170 184Z" />
          <circle cx="200" cy="200" r="50" />
          <path d="M200 150 Q218 120 200 88 Q182 120 200 150Z" /><path d="M235 157 Q262 138 266 104 Q244 128 235 157Z" />
          <path d="M250 200 Q280 200 300 178 Q274 188 250 200Z" /><path d="M235 243 Q262 262 266 296 Q244 272 235 243Z" />
          <path d="M200 250 Q218 280 200 312 Q182 280 200 250Z" /><path d="M165 243 Q138 262 134 296 Q156 272 165 243Z" />
          <path d="M150 200 Q120 200 100 178 Q126 188 150 200Z" /><path d="M165 157 Q138 138 134 104 Q156 128 165 157Z" />
          <circle cx="200" cy="200" r="90" />
          <path d="M200 108 Q214 94 200 76 Q186 94 200 108" /><path d="M265 135 Q282 126 284 108 Q268 120 265 135" />
          <path d="M292 200 Q306 194 314 178 Q298 186 292 200" /><path d="M265 265 Q282 274 284 292 Q268 280 265 265" />
          <path d="M200 292 Q214 306 200 324 Q186 306 200 292" /><path d="M135 265 Q118 274 116 292 Q132 280 135 265" />
          <path d="M108 200 Q94 194 86 178 Q102 186 108 200" /><path d="M135 135 Q118 126 116 108 Q132 120 135 135" />
        </svg>

        <div ref={textRef} className="text-center relative z-10">
          <p className={`word-blur-group ${textVisible ? "visible" : ""} text-xs uppercase tracking-widest text-muted-foreground`}>
            <span className="word-blur" style={{ transitionDelay: "0s" }}>What</span>{" "}
            <span className="word-blur" style={{ transitionDelay: "0.06s" }}>We</span>{" "}
            <span className="word-blur" style={{ transitionDelay: "0.12s" }}>Believe</span>
          </p>
          <div className="mt-8">
            <ScrollRevealText
              text="A space where women gather to reconnect with themselves. To learn skills that actually matter. To grow alongside other women who understand the journey — rooted in culture, care, and shared experience."
              className="leading-relaxed text-muted-foreground text-3xl text-center"
              accentWords={["reconnect", "journey"]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
