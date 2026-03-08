import { useEffect, useRef, useState } from "react";
import { ScrollRevealText } from "./ScrollRevealText";

export function AboutHeroSection() {
  const storyRef = useRef<HTMLDivElement>(null);
  const [storyVisible, setStoryVisible] = useState(false);

  useEffect(() => {
    if (!storyRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStoryVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(storyRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative bg-background overflow-hidden">
      {/* ── Typographic hero ── */}
      <div className="relative px-6 pt-28 sm:pt-32 md:pt-40 lg:pt-48 md:px-12 lg:px-20">
        {/* WELLNESS — outlined, full width */}
        <div className="overflow-hidden">
          <p
            className="about-hero-word text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem] font-semibold tracking-[-0.04em] leading-[0.88] uppercase"
            style={{
              WebkitTextStroke: "1.5px var(--color-foreground)",
              WebkitTextFillColor: "transparent",
              animationDelay: "0.1s",
            }}
          >
            Wellness
          </p>
        </div>

        {/* SKILLS — ghosted, pushed right */}
        <div className="overflow-hidden ml-[12%] sm:ml-[15%] md:ml-[18%] -mt-1 sm:-mt-2 md:-mt-3">
          <p
            className="about-hero-word text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem] font-semibold tracking-[-0.04em] leading-[0.88] uppercase text-foreground/[0.08]"
            style={{ animationDelay: "0.25s" }}
          >
            Skills
          </p>
        </div>

        {/* EMPOWERMENT — Playfair italic, filled */}
        <div className="overflow-hidden -mt-1 sm:-mt-2 md:-mt-3">
          <p
            className="about-hero-word text-[3rem] sm:text-[4.5rem] md:text-[6.5rem] lg:text-[8.5rem] xl:text-[10rem] tracking-[-0.02em] leading-[0.88] text-foreground"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 500,
              animationDelay: "0.4s",
            }}
          >
            Empowerment
          </p>
        </div>

        {/* Tagline — elegant, small contrast */}
        <p
          className="about-hero-fade mt-8 md:mt-12 lg:mt-14 text-sm md:text-base tracking-wide text-muted-foreground"
          style={{ animationDelay: "0.65s" }}
        >
          We're not networking. We're{" "}
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--color-foreground)",
            }}
          >
            reconnecting.
          </span>
        </p>
      </div>

      {/* ── Story — centered narrow column ── */}
      <div
        ref={storyRef}
        className="relative z-10 max-w-2xl mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-24 lg:pt-28 lg:pb-28"
      >
        {/* Decorative paisley — behind story text */}
        <svg
          className="absolute -right-[40%] sm:-right-[25%] md:-right-[15%] top-0 w-[420px] h-[600px] md:w-[500px] md:h-[700px] text-[#e8b4b8] opacity-[0.45] pointer-events-none"
          viewBox="0 0 500 720"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M250 680 C170 610 60 500 60 340 C60 180 140 70 250 30 C360 70 440 180 440 340 C440 500 330 610 250 680Z" />
          <path d="M250 620 C190 570 100 480 100 340 C100 210 160 120 250 85 C340 120 400 210 400 340 C400 480 310 570 250 620Z" />
          <path d="M250 560 C210 520 140 450 140 340 C140 240 185 170 250 142 C315 170 360 240 360 340 C360 450 290 520 250 560Z" />
          <path d="M250 370 C250 358 262 350 272 355 C282 360 278 378 268 382 C258 386 244 378 243 366 C242 354 252 344 266 344 C280 344 290 358 286 372 C282 386 264 396 252 392" />
          <path d="M250 340 Q258 316 250 294 Q242 316 250 340Z" />
          <path d="M270 350 Q290 340 300 322 Q284 336 270 350Z" />
          <path d="M276 370 Q296 370 310 358 Q294 366 276 370Z" />
          <path d="M270 388 Q290 398 300 416 Q284 402 270 388Z" />
          <path d="M250 396 Q258 420 250 442 Q242 420 250 396Z" />
          <path d="M230 388 Q210 398 200 416 Q216 402 230 388Z" />
          <path d="M224 370 Q204 370 190 358 Q206 366 224 370Z" />
          <path d="M230 350 Q210 340 200 322 Q216 336 230 350Z" />
          <circle cx="250" cy="288" r="3" />
          <circle cx="306" cy="318" r="3" />
          <circle cx="316" cy="362" r="3" />
          <circle cx="306" cy="422" r="3" />
          <circle cx="250" cy="448" r="3" />
          <circle cx="194" cy="422" r="3" />
          <circle cx="184" cy="362" r="3" />
          <circle cx="194" cy="318" r="3" />
          <path d="M250 140 C270 160 290 200 290 250" opacity="0.4" />
          <path d="M250 140 C230 160 210 200 210 250" opacity="0.4" />
          <path d="M250 560 C230 530 210 480 210 430" opacity="0.4" />
          <path d="M250 560 C270 530 290 480 290 430" opacity="0.4" />
          <path d="M160 240 Q170 220 190 210 Q176 224 160 240Z" />
          <path d="M340 240 Q330 220 310 210 Q324 224 340 240Z" />
          <path d="M160 460 Q170 480 190 490 Q176 476 160 460Z" />
          <path d="M340 460 Q330 480 310 490 Q324 476 340 460Z" />
          <path d="M250 30 C290 20 310 35 304 60 C298 84 272 78 278 56 C284 40 304 36 316 48" />
          <circle cx="250" cy="18" r="4" />
          <circle cx="322" cy="52" r="3" />
        </svg>

        <div className="relative z-10">
          <ScrollRevealText
            text="We create safe, intentional spaces where women can slow down. Reconnect with their bodies. Learn skills that matter. And grow alongside a community rooted in culture, care, and shared experience."
            className="leading-relaxed text-muted-foreground text-lg md:text-xl lg:text-2xl"
            accentWords={["intentional", "community"]}
          />

          <p
            className={`mt-8 text-sm leading-relaxed text-muted-foreground transition-all duration-1000 ${storyVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-4 blur-sm"}`}
            style={{ transitionDelay: "0.4s" }}
          >
            We believe wellness is education, confidence is built, and community
            is healing.
          </p>
          <p
            className={`mt-4 text-sm leading-relaxed text-muted-foreground transition-all duration-1000 ${storyVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-4 blur-sm"}`}
            style={{ transitionDelay: "0.6s" }}
          >
            This isn't a corporate network. It isn't a business club. It's a
            grounded community for real women seeking wellness, clarity,
            confidence, and holistic growth.
          </p>
        </div>
      </div>
    </section>
  );
}
