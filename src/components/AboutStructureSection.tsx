import { useEffect, useRef, useState } from "react";

const circles = [
  { city: "Abuja", lead: "Zulaihat" },
  { city: "Kaduna", lead: "Maimuna" },
  { city: "Port Harcourt", lead: "Rita" },
  { city: "Enugu", lead: "Jane" },
  { city: "Ilorin", lead: "Fatima" },
];

export function AboutStructureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const startOffset = windowHeight * 0.85;
      const endOffset = windowHeight * 0.35;
      const totalDistance = startOffset - endOffset;
      const currentPosition = startOffset - rect.top;
      setProgress(Math.max(0, Math.min(1, currentPosition / totalDistance)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!textRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTextVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(textRef.current);
    return () => obs.disconnect();
  }, []);

  const headingWords = ["One", "Umbrella,", "Five"];
  const accentWord = "Circles";

  const getWordReveal = (wordIndex: number) => {
    const wordDelay = wordIndex * 0.06;
    const wp = Math.max(0, Math.min(1, (progress - wordDelay) * 2.5));
    return { opacity: wp, blur: (1 - wp) * 8 };
  };

  const subtitleProgress = Math.max(0, Math.min(1, progress * 2.2));

  return (
    <section
      ref={sectionRef}
      className="bg-foreground py-10 md:py-14 lg:py-24 relative overflow-hidden"
    >
      {/* Decorative SVG */}
      <svg
        className="absolute -bottom-10 -left-12 w-[320px] h-[460px] text-[#e8b4b8] opacity-50 pointer-events-none hidden lg:block"
        viewBox="0 0 350 500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ transform: "scaleX(-1)" }}
      >
        <path d="M175 480 C175 420 140 380 160 320 C180 260 120 240 140 180 C160 120 200 140 190 80 C182 40 150 20 175 10" />
        <path d="M175 10 C220 10 260 50 250 100 C240 150 190 140 190 80" />
        <path d="M160 320 C130 300 110 310 100 290" />
        <path d="M160 320 C190 300 210 310 220 290" />
        <path d="M140 180 C110 170 90 190 100 210 C110 230 135 220 130 200" />
        <circle cx="100" cy="286" r="2.5" />
        <circle cx="220" cy="286" r="2.5" />
      </svg>

      <div className="px-6 md:px-12 lg:px-20">
        {/* Heading */}
        <div className="text-center mb-6 md:mb-8 lg:mb-20">
          <p
            className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3 md:mb-6"
            style={{
              fontStyle: "italic",
              opacity: subtitleProgress,
              filter: `blur(${(1 - subtitleProgress) * 6}px)`,
              transition: "opacity 0.3s, filter 0.3s",
            }}
          >
            Our Structure
          </p>
          <h2 className="text-3xl font-medium tracking-tight text-white md:text-4xl lg:text-5xl">
            {headingWords.map((word, i) => {
              const r = getWordReveal(i);
              return (
                <span
                  key={i}
                  style={{
                    color: r.opacity > 0.01 ? "white" : "transparent",
                    filter: `blur(${r.blur}px)`,
                    transition: "color 0.3s, filter 0.3s",
                  }}
                >
                  {word}{" "}
                </span>
              );
            })}
            <span
              style={{
                color:
                  getWordReveal(headingWords.length).opacity > 0.01
                    ? "white"
                    : "transparent",
                filter: `blur(${getWordReveal(headingWords.length).blur}px)`,
                transition: "color 0.3s, filter 0.3s",
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              {accentWord}
            </span>
          </h2>
        </div>

        {/* Overlapping circles */}
        <div className="mx-auto flex flex-wrap justify-center items-center w-fit">
          {circles.map((circle, index) => {
            const delay = 0.05 + index * 0.1;
            const circleProgress = Math.max(
              0,
              Math.min(1, (progress - delay) * 2.5)
            );
            const circleOpacity = circleProgress;
            const circleBlur = (1 - circleProgress) * 8;
            const circleScale = 0.7 + circleProgress * 0.3;
            const spreadX = (1 - circleProgress) * (index - 2) * 30;

            const overlapClass =
              index === 0
                ? ""
                : "-ml-5 sm:-ml-6 md:-ml-8 lg:-ml-10";

            return (
              <div
                key={index}
                className={`flex flex-col items-center ${overlapClass}`}
                style={{
                  opacity: circleOpacity,
                  filter: `blur(${circleBlur}px)`,
                  transform: `scale(${circleScale}) translateX(${spreadX}px)`,
                  transition: "opacity 0.8s, filter 0.8s, transform 0.8s",
                }}
              >
                <div
                  className="relative flex flex-col items-center justify-center w-[5rem] h-[5rem] sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-full border border-white/15 overflow-hidden"
                  style={{
                    background: `rgba(15, 9, 6, ${0.9 - index * 0.1})`,
                  }}
                >
                  <span
                    className="text-white text-sm sm:text-lg md:text-2xl lg:text-3xl"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic",
                      fontWeight: 500,
                    }}
                  >
                    {circle.city}
                  </span>
                  <p className="mt-0.5 sm:mt-1 text-[7px] sm:text-[9px] md:text-[10px] lg:text-xs uppercase tracking-[0.08em] sm:tracking-[0.15em] text-white/35 text-center leading-tight">
                    {circle.lead}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Below circles: two-column text */}
        <div
          ref={textRef}
          className={`max-w-4xl mx-auto mt-12 md:mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 ${textVisible ? "" : ""}`}
        >
          <div
            className="reveal"
            style={{ transitionDelay: "0s" }}
          >
            <h3 className="text-base font-semibold text-white mb-3">
              Headquarters &mdash; The Umbrella
            </h3>
            <p className="text-sm leading-relaxed text-white/50">
              One philosophy. One standard. Five Circles — each moving to the
              rhythm of its own community. Headquarters sets the vision,
              training standards, and wellness frameworks that unite every
              Circle.
            </p>
          </div>
          <div
            className="reveal"
            style={{ transitionDelay: "0.15s" }}
          >
            <h3 className="text-base font-semibold text-white mb-3">
              Local Circles
            </h3>
            <p className="text-sm leading-relaxed text-white/50">
              Each Circle hosts regular gatherings — wellness sessions,
              skill-building workshops, and empowerment experiences rooted in
              our shared philosophy. Same heart, different rhythm.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
