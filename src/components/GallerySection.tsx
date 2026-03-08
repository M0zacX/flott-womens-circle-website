import { useEffect, useRef, useState, useCallback } from "react";

type ColDef = {
  width: string;
  images: { src: string; alt: string; flex: number }[];
};

const columns: ColDef[] = [
  {
    width: "max(220px, 18vw)",
    images: [
      { src: "/images/gallery/event-01.jpeg", alt: "Circle gathering", flex: 1 },
    ],
  },
  {
    width: "max(190px, 15vw)",
    images: [
      { src: "/images/gallery/event-05.jpeg", alt: "Community workshop", flex: 3 },
      { src: "/images/gallery/event-12.jpeg", alt: "Women connecting", flex: 2 },
    ],
  },
  {
    width: "max(170px, 13vw)",
    images: [
      { src: "/images/gallery/event-18.jpeg", alt: "Empowerment session", flex: 1 },
      { src: "/images/gallery/event-22.jpeg", alt: "Creative workshop", flex: 1 },
      { src: "/images/gallery/event-28.jpeg", alt: "Wellness gathering", flex: 1 },
    ],
  },
  {
    width: "max(240px, 20vw)",
    images: [
      { src: "/images/flott-08.jpeg", alt: "Circle celebration", flex: 1 },
    ],
  },
  {
    width: "max(200px, 16vw)",
    images: [
      { src: "/images/gallery/event-32.jpeg", alt: "Skills workshop", flex: 2 },
      { src: "/images/gallery/event-35.jpeg", alt: "Group mentoring", flex: 3 },
    ],
  },
  {
    width: "max(190px, 15vw)",
    images: [
      { src: "/images/gallery/event-38.jpeg", alt: "Sisterhood moment", flex: 1 },
      { src: "/images/gallery/event-42.jpeg", alt: "Wellness ritual", flex: 1 },
    ],
  },
  {
    width: "max(170px, 13vw)",
    images: [
      { src: "/images/gallery/event-45.jpeg", alt: "Creative expression", flex: 2 },
      { src: "/images/gallery/event-48.jpeg", alt: "Learning together", flex: 1 },
      { src: "/images/gallery/event-50.jpeg", alt: "Community bond", flex: 2 },
    ],
  },
  {
    width: "max(220px, 18vw)",
    images: [
      { src: "/images/flott-14.jpeg", alt: "Event highlight", flex: 1 },
    ],
  },
  {
    width: "max(200px, 16vw)",
    images: [
      { src: "/images/gallery/event-55.jpeg", alt: "Cultural exchange", flex: 3 },
      { src: "/images/gallery/event-58.jpeg", alt: "Joy and connection", flex: 2 },
    ],
  },
  {
    width: "max(240px, 20vw)",
    images: [
      { src: "/images/gallery/event-60.jpeg", alt: "Circle experience", flex: 1 },
    ],
  },
  {
    width: "max(190px, 15vw)",
    images: [
      { src: "/images/gallery/event-03.jpeg", alt: "Wellness journey", flex: 2 },
      { src: "/images/gallery/event-09.jpeg", alt: "Shared laughter", flex: 3 },
    ],
  },
  {
    width: "max(170px, 13vw)",
    images: [
      { src: "/images/gallery/event-14.jpeg", alt: "Circle session", flex: 1 },
      { src: "/images/gallery/event-20.jpeg", alt: "Growth together", flex: 1 },
      { src: "/images/gallery/event-25.jpeg", alt: "Safe space", flex: 1 },
    ],
  },
  {
    width: "max(220px, 18vw)",
    images: [
      { src: "/images/gallery/event-30.jpeg", alt: "Empowerment moment", flex: 1 },
    ],
  },
  {
    width: "max(200px, 16vw)",
    images: [
      { src: "/images/gallery/event-40.jpeg", alt: "Hands together", flex: 3 },
      { src: "/images/gallery/event-52.jpeg", alt: "Learning circle", flex: 2 },
    ],
  },
  {
    width: "max(170px, 13vw)",
    images: [
      { src: "/images/gallery/event-56.jpeg", alt: "Healing space", flex: 2 },
      { src: "/images/gallery/event-62.jpeg", alt: "Celebration", flex: 1 },
      { src: "/images/gallery/event-64.jpeg", alt: "Unity", flex: 2 },
    ],
  },
  {
    width: "max(240px, 20vw)",
    images: [
      { src: "/images/gallery/event-07.jpeg", alt: "Connection", flex: 1 },
    ],
  },
];

export function GallerySection() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState("100vh");
  const [translateX, setTranslateX] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

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
    const prog = Math.min(1, scrolled / totalScrollDistance);
    const newTranslateX = prog * -totalScrollDistance;
    setTranslateX(newTranslateX);
    setProgress(prog);
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

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = window.scrollY;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !galleryRef.current || !containerRef.current) return;
      const dx = dragStartX.current - e.clientX;
      const containerWidth = containerRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const totalScrollDistance = containerWidth - viewportWidth;
      const sectionTop = galleryRef.current.offsetTop;
      const scrollRatio = dx / viewportWidth;
      const newScroll = dragStartScroll.current + scrollRatio * totalScrollDistance;
      window.scrollTo({ top: Math.max(sectionTop, Math.min(sectionTop + totalScrollDistance, newScroll)) });
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <section id="gallery" ref={galleryRef} className="relative bg-background" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen overflow-hidden cursor-grab active:cursor-grabbing flex flex-col" onMouseDown={handleMouseDown}>
        {/* Heading */}
        <div className="flex-shrink-0 px-6 pt-10 pb-4 md:px-12 md:pt-12 md:pb-5 lg:px-20 lg:pt-14 lg:pb-6">
          <p
            className="text-xs tracking-[0.2em] uppercase text-muted-foreground/50 mb-2"
            style={{ fontStyle: "italic" }}
          >
            Moments from our circles
          </p>
          <h2 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-semibold tracking-[-0.04em] leading-none text-foreground/[0.08] uppercase">
            Gallery
          </h2>
        </div>

        {/* Gallery strip */}
        <div className="flex-1 flex items-center min-h-0">
          <div
            ref={containerRef}
            className="flex px-6 select-none"
            style={{
              gap: "4px",
              transform: `translate3d(${translateX}px, 0, 0)`,
              backfaceVisibility: "hidden",
              perspective: 1000,
              touchAction: "pan-y",
            }}
          >
            {columns.map((col, colIdx) => (
              <div
                key={colIdx}
                className="flex flex-col flex-shrink-0"
                style={{
                  width: col.width,
                  height: "60vh",
                  gap: "4px",
                  transform: `translateY(${colIdx % 2 === 0 ? progress * 14 : progress * -14}px)`,
                  transition: "transform 0.15s linear",
                }}
              >
                {col.images.map((img, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="gallery-card relative overflow-hidden rounded-lg group"
                    style={{ flex: img.flex, transform: "translateZ(0)" }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      draggable={false}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08] pointer-events-none"
                      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                      loading={colIdx < 4 ? "eager" : "lazy"}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-white/80">{img.alt}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar & Gallery button */}
        <div className="flex-shrink-0 px-6 py-6 md:px-12 md:py-8 lg:px-20 lg:py-10 flex items-center gap-6">
          <div className="flex-1 h-[2px] bg-foreground/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground/70 rounded-full"
              style={{
                width: `${progress * 100}%`,
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <a
            href="/gallery"
            className="flex-shrink-0 border border-foreground/30 text-foreground text-xs tracking-[0.15em] uppercase px-6 py-3 rounded-full hover:bg-foreground hover:text-background transition-all duration-500"
            style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
          >
            View Gallery
          </a>
        </div>
      </div>
    </section>
  );
}
