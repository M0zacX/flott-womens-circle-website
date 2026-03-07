import { useEffect, useRef, useState, useCallback } from "react";

export function GallerySection() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState("100vh");
  const [translateX, setTranslateX] = useState(0);
  const rafRef = useRef<number | null>(null);

  const images = [
    { src: "/images/flott-02.jpeg", alt: "Women's circle event" },
    { src: "/images/flott-06.jpeg", alt: "Community gathering" },
    { src: "/images/flott-08.jpeg", alt: "Wellness workshop" },
    { src: "/images/flott-11.jpeg", alt: "Empowerment session" },
    { src: "/images/flott-14.jpeg", alt: "Circle meeting" },
    { src: "/images/flott-17.jpeg", alt: "Women supporting women" },
    { src: "/images/flott-20.jpeg", alt: "Self care workshop" },
    { src: "/images/flott-22.jpeg", alt: "Cultural wellness experience" },
  ];

  useEffect(() => {
    const calculateHeight = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const totalHeight = viewportHeight + (containerWidth - viewportWidth);
      setSectionHeight(`${totalHeight}px`);
    };
    const timer = setTimeout(calculateHeight, 100);
    window.addEventListener("resize", calculateHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  const updateTransform = useCallback(() => {
    if (!galleryRef.current || !containerRef.current) return;
    const rect = galleryRef.current.getBoundingClientRect();
    const containerWidth = containerRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    const totalScrollDistance = containerWidth - viewportWidth;
    const scrolled = Math.max(0, -rect.top);
    const progress = Math.min(1, scrolled / totalScrollDistance);
    const newTranslateX = progress * -totalScrollDistance;
    setTranslateX(newTranslateX);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateTransform);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransform();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateTransform]);

  return (
    <section id="gallery" ref={galleryRef} className="relative bg-background" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full items-center">
          <div
            ref={containerRef}
            className="flex gap-6 px-6"
            style={{
              transform: `translate3d(${translateX}px, 0, 0)`,
              backfaceVisibility: 'hidden',
              perspective: 1000,
              touchAction: 'pan-y',
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-[70vh] w-[85vw] flex-shrink-0 overflow-hidden rounded-2xl md:w-[60vw] lg:w-[45vw]"
                style={{ transform: 'translateZ(0)' }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={index < 3 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
