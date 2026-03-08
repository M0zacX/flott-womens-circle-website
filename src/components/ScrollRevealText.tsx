import { useEffect, useRef, useState } from "react";

export function ScrollRevealText({ text, className = "", accentWords = [] }: { text: string; className?: string; accentWords?: string[] }) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const startOffset = windowHeight * 0.9;
      const endOffset = windowHeight * 0.35;
      const totalDistance = startOffset - endOffset;
      const currentPosition = startOffset - rect.top;
      const newProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));
      setProgress(newProgress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const words = text.split(" ");

  return (
    <p ref={containerRef} className={`text-3xl font-semibold leading-snug md:text-4xl lg:text-5xl ${className}`}>
      {words.map((word, index) => {
        const wordProgress = (index / words.length) * 0.7;
        const wordReveal = Math.max(0, Math.min(1, (progress - wordProgress) * 4));
        const blur = (1 - wordReveal) * 4;
        return (
          <span key={index} style={{
            color: wordReveal > 0.01 ? "var(--color-foreground)" : "var(--color-border)",
            filter: `blur(${blur}px)`,
            transition: "color 1.2s cubic-bezier(0.22, 1, 0.36, 1), filter 1.6s cubic-bezier(0.22, 1, 0.36, 1)",
            ...(accentWords.some(aw => word.replace(/[.,!?]$/, '') === aw) ? { fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 } : {}),
          }}>
            {word}{index < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}
