import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "5", label: "Circles Nationwide" },
  { value: "4", label: "Empowerment Dimensions" },
  { value: "6", label: "Circle Leads" },
  { value: "1", label: "Shared Philosophy" },
];

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

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

  const headingWords = ["Empowering", "Women", "to", "Thrive"];
  const accentWord = "Together";

  const getWordReveal = (wordIndex: number, totalWords: number) => {
    const wordDelay = wordIndex * 0.06;
    const wp = Math.max(0, Math.min(1, (progress - wordDelay) * 2.5));
    return { opacity: wp, blur: (1 - wp) * 8, y: (1 - wp) * 20 };
  };

  const subtitleProgress = Math.max(0, Math.min(1, progress * 2.2));

  return (
    <section ref={sectionRef} className="bg-foreground py-28 md:py-36 lg:py-44 relative overflow-hidden">
      {/* Decorative mirrored spiral vine — white on dark */}
      <svg className="absolute -bottom-10 -left-12 w-[320px] h-[460px] text-[#e8b4b8] opacity-50 pointer-events-none hidden lg:block" viewBox="0 0 350 500" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: "scaleX(-1)" }}>
        <path d="M175 480 C175 420 140 380 160 320 C180 260 120 240 140 180 C160 120 200 140 190 80 C182 40 150 20 175 10" />
        <path d="M175 10 C220 10 260 50 250 100 C240 150 190 140 190 80" />
        <path d="M200 50 C220 50 236 70 230 90 C224 110 204 105 204 80" />
        <path d="M160 320 C130 300 110 310 100 290" /><path d="M100 290 C110 300 108 316 120 312" />
        <path d="M160 320 C190 300 210 310 220 290" /><path d="M220 290 C210 300 212 316 200 312" />
        <path d="M140 180 C110 170 90 190 100 210 C110 230 135 220 130 200" />
        <path d="M130 240 C100 228 82 238 72 222" /><path d="M130 240 C160 228 178 238 188 222" />
        <path d="M170 400 C200 390 220 400 218 420 C216 440 196 435 198 418" />
        <circle cx="100" cy="286" r="2.5" /><circle cx="220" cy="286" r="2.5" />
        <circle cx="72" cy="218" r="2.5" /><circle cx="188" cy="218" r="2.5" />
      </svg>

      {/* Small rosette — bottom right, visible on mobile */}
      <svg className="absolute -bottom-6 -right-6 w-[120px] h-[120px] md:w-[160px] md:h-[160px] text-[#e8b4b8] opacity-50 pointer-events-none" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M100 100 C100 94 106 90 112 92 C118 94 118 102 112 106 C106 110 96 108 94 100 C92 92 98 84 108 84 C118 84 124 94 122 104 C120 114 108 120 98 118" />
        <path d="M100 82 Q108 60 100 42 Q92 60 100 82Z" /><path d="M113 86 Q130 72 138 54 Q122 68 113 86Z" />
        <path d="M118 100 Q140 100 156 92 Q138 98 118 100Z" /><path d="M113 114 Q130 128 138 146 Q122 132 113 114Z" />
        <path d="M100 118 Q108 140 100 158 Q92 140 100 118Z" /><path d="M87 114 Q70 128 62 146 Q78 132 87 114Z" />
        <path d="M82 100 Q60 100 44 92 Q62 98 82 100Z" /><path d="M87 86 Q70 72 62 54 Q78 68 87 86Z" />
        <circle cx="100" cy="36" r="2" /><circle cx="142" cy="50" r="2" /><circle cx="162" cy="92" r="2" />
        <circle cx="142" cy="150" r="2" /><circle cx="100" cy="164" r="2" /><circle cx="58" cy="150" r="2" />
      </svg>

      <div className="px-6 md:px-12 lg:px-20">
        <div className="text-center mb-20">
          <p
            className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6"
            style={{
              fontStyle: "italic",
              opacity: subtitleProgress,
              filter: `blur(${(1 - subtitleProgress) * 6}px)`,
              transition: "opacity 0.3s, filter 0.3s",
            }}
          >
            Our Impact
          </p>
          <h2 className="text-3xl font-medium tracking-tight text-white md:text-4xl lg:text-5xl">
            {headingWords.map((word, i) => {
              const r = getWordReveal(i, headingWords.length);
              return (
                <span key={i} style={{ color: r.opacity > 0.01 ? "white" : "transparent", filter: `blur(${r.blur}px)`, transition: "color 0.3s, filter 0.3s" }}>
                  {word}{" "}
                </span>
              );
            })}
            <span style={{ color: getWordReveal(headingWords.length, headingWords.length + 1).opacity > 0.01 ? "white" : "transparent", filter: `blur(${getWordReveal(headingWords.length, headingWords.length + 1).blur}px)`, transition: "color 0.3s, filter 0.3s", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>
              {accentWord}
            </span>
          </h2>
        </div>

        <div className="mx-auto flex justify-center items-center">
          {stats.map((stat, index) => {
            const delay = 0.05 + index * 0.1;
            const circleProgress = Math.max(0, Math.min(1, (progress - delay) * 2.5));
            const circleOpacity = circleProgress;
            const circleBlur = (1 - circleProgress) * 8;
            const circleScale = 0.7 + circleProgress * 0.3;
            const spreadX = (1 - circleProgress) * (index - 1.5) * 40;

            return (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{
                  marginLeft: index > 0 ? "-3rem" : "0",
                  opacity: circleOpacity,
                  filter: `blur(${circleBlur}px)`,
                  transform: `scale(${circleScale}) translateX(${spreadX}px)`,
                  transition: "opacity 0.8s, filter 0.8s, transform 0.8s",
                }}
              >
                <div
                  className="relative flex flex-col items-center justify-center w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full border border-white/15"
                  style={{ background: `rgba(15, 9, 6, ${0.85 - index * 0.15})` }}
                >
                  <span
                    className="text-white text-4xl md:text-5xl lg:text-6xl"
                    style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: "italic" }}
                  >
                    {stat.value}
                  </span>
                  <p className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/40">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
