import { useEffect, useRef, useState, useCallback } from "react";
import { ScrollRevealText } from "./ScrollRevealText";

export function AboutStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [leftX, setLeftX] = useState(-100);
  const [rightX, setRightX] = useState(100);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const rafRef = useRef<number | null>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const [titleWordsVisible, setTitleWordsVisible] = useState(false);

  const updateTransforms = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = sectionRef.current.offsetHeight;
    const scrollableRange = sectionHeight - windowHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));
    setLeftX((1 - progress) * -100);
    setRightX((1 - progress) * 100);
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
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTextVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(textRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTitleWordsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-background">
      <div ref={sectionRef} className="relative" style={{ height: "200vh" }}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {/* Tree of Life — roots (care/foundation), branches (community) */}
          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vw] max-w-[680px] max-h-[680px] md:max-w-[820px] md:max-h-[820px] lg:max-w-[960px] lg:max-h-[960px] text-[#e8b4b8] opacity-[0.6] pointer-events-none"
            viewBox="0 0 800 800"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Trunk */}
            <path d="M392 560 C388 510 384 450 386 400 C388 360 394 320 400 280" />
            <path d="M408 560 C412 510 416 450 414 400 C412 360 406 320 400 280" />
            <path d="M398 540 C396 490 398 440 400 390" opacity="0.3" />
            <path d="M402 540 C404 490 402 440 400 390" opacity="0.3" />

            {/* Roots spreading — the foundation of care */}
            <path d="M392 560 C365 590 320 620 268 640" />
            <path d="M392 560 C375 605 350 656 318 696" />
            <path d="M398 564 C396 620 390 668 384 716" />
            <path d="M408 560 C435 590 480 620 532 640" />
            <path d="M408 560 C425 605 450 656 482 696" />
            <path d="M402 564 C404 620 410 668 416 716" />
            {/* Root tips curl */}
            <path d="M268 640 C252 648 236 650 224 644" />
            <path d="M532 640 C548 648 564 650 576 644" />
            <path d="M318 696 C306 706 292 710 280 706" />
            <path d="M482 696 C494 706 508 710 520 706" />
            {/* Small root hairs */}
            <path d="M340 610 C330 618 316 622 306 618" opacity="0.4" />
            <path d="M460 610 C470 618 484 622 494 618" opacity="0.4" />
            <path d="M370 650 C362 660 350 664 340 660" opacity="0.4" />
            <path d="M430 650 C438 660 450 664 460 660" opacity="0.4" />

            {/* Main branches — community spreading */}
            <path d="M400 280 C360 240 296 196 228 186" />
            <path d="M400 280 C440 240 504 196 572 186" />
            <path d="M400 280 C368 248 310 228 254 240" />
            <path d="M400 280 C432 248 490 228 546 240" />
            <path d="M400 280 C382 232 362 176 348 132" />
            <path d="M400 280 C418 232 438 176 452 132" />
            <path d="M400 280 C396 236 400 192 400 152" />

            {/* Upper canopy branches */}
            <path d="M228 186 C200 178 170 186 152 206" />
            <path d="M572 186 C600 178 630 186 648 206" />
            <path d="M254 240 C228 250 204 268 192 296" />
            <path d="M546 240 C572 250 596 268 608 296" />
            <path d="M348 132 C322 114 290 106 262 116" />
            <path d="M452 132 C478 114 510 106 538 116" />
            <path d="M228 186 C216 170 198 158 178 162" />
            <path d="M572 186 C584 170 602 158 622 162" />

            {/* Leaves — teardrop shapes throughout the canopy */}
            {/* Top center */}
            <path d="M400 148 Q406 132 400 116 Q394 132 400 148Z" />
            <path d="M386 166 Q380 150 386 136 Q392 150 386 166Z" />
            <path d="M414 166 Q420 150 414 136 Q408 150 414 166Z" />
            {/* Upper left cluster */}
            <path d="M348 130 Q340 114 346 100 Q354 114 348 130Z" />
            <path d="M310 118 Q302 104 308 90 Q316 104 310 118Z" />
            <path d="M270 120 Q262 108 268 94 Q276 108 270 120Z" />
            <path d="M236 140 Q226 128 230 114 Q238 128 236 140Z" />
            {/* Upper right cluster */}
            <path d="M452 130 Q460 114 454 100 Q446 114 452 130Z" />
            <path d="M490 118 Q498 104 492 90 Q484 104 490 118Z" />
            <path d="M530 120 Q538 108 532 94 Q524 108 530 120Z" />
            <path d="M564 140 Q574 128 570 114 Q562 128 564 140Z" />
            {/* Left side */}
            <path d="M224 184 Q214 170 218 156 Q226 170 224 184Z" />
            <path d="M190 202 Q180 192 184 178 Q192 190 190 202Z" />
            <path d="M158 214 Q148 204 152 190 Q160 204 158 214Z" />
            <path d="M180 168 Q170 158 174 144 Q182 158 180 168Z" />
            <path d="M252 242 Q242 228 246 214 Q254 228 252 242Z" />
            <path d="M218 264 Q208 254 212 240 Q220 254 218 264Z" />
            <path d="M198 300 Q188 290 192 276 Q200 290 198 300Z" />
            {/* Right side */}
            <path d="M576 184 Q586 170 582 156 Q574 170 576 184Z" />
            <path d="M610 202 Q620 192 616 178 Q608 190 610 202Z" />
            <path d="M642 214 Q652 204 648 190 Q640 204 642 214Z" />
            <path d="M620 168 Q630 158 626 144 Q618 158 620 168Z" />
            <path d="M548 242 Q558 228 554 214 Q546 228 548 242Z" />
            <path d="M582 264 Q592 254 588 240 Q580 254 582 264Z" />
            <path d="M602 300 Q612 290 608 276 Q600 290 602 300Z" />
            {/* Mid-canopy leaves */}
            <path d="M300 200 Q292 186 298 172 Q306 186 300 200Z" />
            <path d="M500 200 Q508 186 502 172 Q494 186 500 200Z" />
            <path d="M340 226 Q332 212 338 198 Q346 212 340 226Z" />
            <path d="M460 226 Q468 212 462 198 Q454 212 460 226Z" />

            {/* Small flower blooms in canopy */}
            {/* Flower top */}
            <circle cx="400" cy="110" r="4" />
            <path d="M400 102 Q403 96 400 90 Q397 96 400 102Z" />
            <path d="M407 107 Q413 104 416 98 Q410 104 407 107Z" />
            <path d="M407 115 Q413 118 416 124 Q410 118 407 115Z" />
            <path d="M393 115 Q387 118 384 124 Q390 118 393 115Z" />
            <path d="M393 107 Q387 104 384 98 Q390 104 393 107Z" />
            {/* Flower left */}
            <circle cx="166" cy="230" r="3.5" />
            <path d="M166 224 Q168 218 166 212 Q164 218 166 224Z" />
            <path d="M172 228 Q177 225 180 220 Q175 225 172 228Z" />
            <path d="M172 234 Q177 237 180 242 Q175 237 172 234Z" />
            <path d="M160 234 Q155 237 152 242 Q157 237 160 234Z" />
            <path d="M160 228 Q155 225 152 220 Q157 225 160 228Z" />
            {/* Flower right */}
            <circle cx="634" cy="230" r="3.5" />
            <path d="M634 224 Q636 218 634 212 Q632 218 634 224Z" />
            <path d="M640 228 Q645 225 648 220 Q643 225 640 228Z" />
            <path d="M640 234 Q645 237 648 242 Q643 237 640 234Z" />
            <path d="M628 234 Q623 237 620 242 Q625 237 628 234Z" />
            <path d="M628 228 Q623 225 620 220 Q625 225 628 228Z" />

            {/* Scattered dots — seeds/fruit */}
            <circle cx="330" cy="150" r="2.5" />
            <circle cx="470" cy="150" r="2.5" />
            <circle cx="210" cy="220" r="2.5" />
            <circle cx="590" cy="220" r="2.5" />
            <circle cx="370" cy="120" r="2" />
            <circle cx="430" cy="120" r="2" />
            <circle cx="280" cy="170" r="2" />
            <circle cx="520" cy="170" r="2" />
            <circle cx="186" cy="280" r="2" />
            <circle cx="614" cy="280" r="2" />
            <circle cx="296" cy="674" r="2.5" />
            <circle cx="504" cy="674" r="2.5" />
            <circle cx="360" cy="700" r="2" />
            <circle cx="440" cy="700" r="2" />

            {/* Encircling ring — community embrace */}
            <circle cx="400" cy="400" r="320" opacity="0.15" />
            <circle cx="400" cy="400" r="330" opacity="0.08" />
          </svg>

          {/* Centered title — fades as images slide in */}
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none z-0 word-blur-group ${titleWordsVisible ? "visible" : ""}`}
            style={{ opacity: titleOpacity }}
          >
            <h2 className="text-[12vw] font-medium leading-[0.95] tracking-tighter text-foreground md:text-[10vw] lg:text-[8vw] text-center px-6">
              <span className="word-blur" style={{ transitionDelay: "0s" }}>
                A
              </span>{" "}
              <span className="word-blur" style={{ transitionDelay: "0.1s" }}>
                Community
              </span>{" "}
              <span className="word-blur" style={{ transitionDelay: "0.2s" }}>
                Built
              </span>{" "}
              <span className="word-blur" style={{ transitionDelay: "0.3s" }}>
                on
              </span>{" "}
              <span
                className="word-blur"
                style={{
                  transitionDelay: "0.45s",
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                }}
              >
                Care
              </span>
            </h2>
          </div>

          {/* Two images sliding in from opposite sides */}
          <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:px-12 xl:grid-cols-2 xl:px-20 place-items-center">
            <div
              className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl max-h-[38vh] xl:max-h-none"
              style={{
                transform: `translate3d(${leftX}%, 0, 0)`,
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src="/images/gallery/event-05.jpeg"
                alt="Flott Women's Circle gathering"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6">
                <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                  Since 2019
                </span>
              </div>
            </div>

            <div
              className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl max-h-[38vh] xl:max-h-none"
              style={{
                transform: `translate3d(${rightX}%, 0, 0)`,
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src="/images/gallery/event-15.jpeg"
                alt="Community empowerment session"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6">
                <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                  5 Cities Strong
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post-scroll brand story text */}
      <div
        ref={textRef}
        className="relative px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-24 overflow-hidden"
      >
        {/* Large flowing paisley — right side, behind text */}
        <svg
          className="absolute top-1/2 -right-[10%] md:right-[2%] -translate-y-1/2 w-[480px] h-[680px] md:w-[560px] md:h-[790px] lg:w-[640px] lg:h-[900px] text-[#e8b4b8] opacity-[0.6] pointer-events-none"
          viewBox="0 0 500 720"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Main paisley body */}
          <path d="M250 680 C170 610 60 500 60 340 C60 180 140 70 250 30 C360 70 440 180 440 340 C440 500 330 610 250 680Z" />
          {/* Inner paisley */}
          <path d="M250 620 C190 570 100 480 100 340 C100 210 160 120 250 85 C340 120 400 210 400 340 C400 480 310 570 250 620Z" />
          {/* Second inner paisley */}
          <path d="M250 560 C210 520 140 450 140 340 C140 240 185 170 250 142 C315 170 360 240 360 340 C360 450 290 520 250 560Z" />
          {/* Spiral center */}
          <path d="M250 370 C250 358 262 350 272 355 C282 360 278 378 268 382 C258 386 244 378 243 366 C242 354 252 344 266 344 C280 344 290 358 286 372 C282 386 264 396 252 392" />
          {/* 8 petals around spiral */}
          <path d="M250 340 Q258 316 250 294 Q242 316 250 340Z" />
          <path d="M270 350 Q290 340 300 322 Q284 336 270 350Z" />
          <path d="M276 370 Q296 370 310 358 Q294 366 276 370Z" />
          <path d="M270 388 Q290 398 300 416 Q284 402 270 388Z" />
          <path d="M250 396 Q258 420 250 442 Q242 420 250 396Z" />
          <path d="M230 388 Q210 398 200 416 Q216 402 230 388Z" />
          <path d="M224 370 Q204 370 190 358 Q206 366 224 370Z" />
          <path d="M230 350 Q210 340 200 322 Q216 336 230 350Z" />
          {/* Dot ring around petals */}
          <circle cx="250" cy="288" r="3" />
          <circle cx="306" cy="318" r="3" />
          <circle cx="316" cy="362" r="3" />
          <circle cx="306" cy="422" r="3" />
          <circle cx="250" cy="448" r="3" />
          <circle cx="194" cy="422" r="3" />
          <circle cx="184" cy="362" r="3" />
          <circle cx="194" cy="318" r="3" />
          {/* Inner detail — leaf veins following paisley curve */}
          <path d="M250 140 C270 160 290 200 290 250" opacity="0.4" />
          <path d="M250 140 C230 160 210 200 210 250" opacity="0.4" />
          <path d="M250 560 C230 530 210 480 210 430" opacity="0.4" />
          <path d="M250 560 C270 530 290 480 290 430" opacity="0.4" />
          {/* Decorative fill between rings */}
          <path d="M160 240 Q170 220 190 210 Q176 224 160 240Z" />
          <path d="M340 240 Q330 220 310 210 Q324 224 340 240Z" />
          <path d="M160 460 Q170 480 190 490 Q176 476 160 460Z" />
          <path d="M340 460 Q330 480 310 490 Q324 476 340 460Z" />
          {/* Top curl */}
          <path d="M250 30 C290 20 310 35 304 60 C298 84 272 78 278 56 C284 40 304 36 316 48" />
          <circle cx="250" cy="18" r="4" />
          <circle cx="322" cy="52" r="3" />
          {/* Scattered dots inside paisley */}
          <circle cx="180" cy="300" r="2.5" />
          <circle cx="320" cy="300" r="2.5" />
          <circle cx="180" cy="420" r="2.5" />
          <circle cx="320" cy="420" r="2.5" />
          <circle cx="140" cy="360" r="2.5" />
          <circle cx="360" cy="360" r="2.5" />
          <circle cx="250" cy="220" r="2.5" />
          <circle cx="250" cy="500" r="2.5" />
          {/* Additional small paisley forms inside */}
          <path d="M190 260 C180 240 185 220 200 218 C210 220 212 238 205 248 C198 256 186 254 190 260Z" />
          <path d="M310 260 C320 240 315 220 300 218 C290 220 288 238 295 248 C302 256 314 254 310 260Z" />
          <path d="M190 470 C180 490 185 510 200 512 C210 510 212 492 205 482 C198 474 186 476 190 470Z" />
          <path d="M310 470 C320 490 315 510 300 512 C290 510 288 492 295 482 C302 474 314 476 310 470Z" />
        </svg>

        <div className="max-w-3xl mx-auto">
          <p
            className={`word-blur-group ${textVisible ? "visible" : ""} text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4`}
            style={{ fontStyle: "italic" }}
          >
            <span className="word-blur" style={{ transitionDelay: "0s" }}>
              Our
            </span>{" "}
            <span className="word-blur" style={{ transitionDelay: "0.08s" }}>
              Story
            </span>
          </p>
          <div className="mt-6">
            <ScrollRevealText
              text="We create safe, intentional spaces where women can slow down. Reconnect with their bodies. Learn skills that matter. And grow alongside a community rooted in culture, care, and shared experience."
              className="leading-relaxed text-muted-foreground text-xl md:text-2xl lg:text-3xl"
              accentWords={["intentional", "community"]}
            />
          </div>
          <p className="reveal mt-8 text-sm leading-relaxed text-muted-foreground" style={{ transitionDelay: "0.1s" }}>
            We believe wellness is education, confidence is built, and community is healing.
          </p>
          <p className="reveal mt-4 text-sm leading-relaxed text-muted-foreground" style={{ transitionDelay: "0.2s" }}>
            This isn't a corporate network. It isn't a business club. It's a grounded community for real women seeking wellness, clarity, confidence, and holistic growth.
          </p>
        </div>
      </div>
    </section>
  );
}
