import { useEffect, useRef, useState, useCallback } from "react";

export function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [alpineTranslateX, setAlpineTranslateX] = useState(-100);
  const [forestTranslateX, setForestTranslateX] = useState(100);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const rafRef = useRef<number | null>(null);

  const updateTransforms = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
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

  return (
    <section id="products" className="bg-background">
      <div ref={sectionRef} className="relative" style={{ height: "200vh" }}>
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" style={{ opacity: titleOpacity }}>
              <h2 className="text-[12vw] font-medium leading-[0.95] tracking-tighter text-foreground md:text-[10vw] lg:text-[8vw] text-center px-6">
                Meet Alpine & Forest.
              </h2>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:grid-cols-2 md:px-12 lg:px-20">
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                style={{ transform: `translate3d(${alpineTranslateX}%, 0, 0)`, backfaceVisibility: 'hidden' }}
              >
                <img src="/images/flott-05.jpeg" alt="Women's wellness session" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute bottom-6 left-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                    Alpine $299
                  </span>
                </div>
              </div>

              <div
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                style={{ transform: `translate3d(${forestTranslateX}%, 0, 0)`, backfaceVisibility: 'hidden' }}
              >
                <img src="/images/flott-10.jpeg" alt="Community empowerment gathering" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute bottom-6 left-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                    Forest $199
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36 lg:pb-14">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">First generation</p>
          <p className="mt-8 leading-relaxed text-muted-foreground text-3xl text-center">
            Alpine & Forest are high-tech outdoor accessories designed for modern adventurers.
            Lightweight, durable, and engineered for extreme conditions.
          </p>
        </div>
      </div>
    </section>
  );
}
