import { useEffect, useRef, useState } from "react";

const word = "FLOTT";

const sideImages = [
  { src: "/images/flott-26.webp", alt: "Women's circle gathering", position: "left", span: 1 },
  { src: "/images/flott-29.webp", alt: "Community wellness session", position: "left", span: 1 },
  { src: "/images/flott-32.webp", alt: "Empowerment workshop", position: "right", span: 1 },
  { src: "/images/flott-34.webp", alt: "Women connecting", position: "right", span: 1 },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroTextRef = useRef<HTMLParagraphElement>(null);
  const [heroTextVisible, setHeroTextVisible] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState("0:00");
  const [videoDuration, setVideoDuration] = useState("0:00");
  const [videoMuted, setVideoMuted] = useState(false);
  const stableHeight = useRef(typeof window !== "undefined" ? window.innerHeight : 800);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = stableHeight.current * 2;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!heroTextRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setHeroTextVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(heroTextRef.current);
    return () => obs.disconnect();
  }, []);

  const textOpacity = Math.max(0, 1 - (scrollProgress / 0.2));
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1280;
  const isDesktop = screenWidth >= 1280;
  const flottTextOpacity = textOpacity;
  // FLOTT font size: fills image width at each breakpoint
  // Mobile (portrait): 36vw overflows & clips to 100% — perfect fill
  // Tablet: 30vw — fills ~90% of wider center image
  // Desktop (landscape): 24vw — fills ~80%, still massive (346-461px)
  // Key: on landscape screens, vw produces huge heights relative to vh,
  // so we scale down to keep the text in the bottom ~35% of the image
  const flottSize = isMobile ? '36vw' : isTablet ? '30vw' : '24vw';
  // Widget bottom: fontSize * 0.8 leading + 16px gap above FLOTT text
  const widgetBottom = isMobile ? 'calc(29vw + 16px)' : isTablet ? 'calc(24.5vw + 16px)' : 'calc(19.5vw + 16px)';

  const centerWidth = Math.max(
    isMobile ? 52 : isTablet ? 48 : 42,
    100 - (imageProgress * (isTablet ? 50 : 58))
  );
  const centerHeight = 100 - (imageProgress * 30);
  const sideWidth = imageProgress * (isMobile ? 23 : isTablet ? 24 : 22);
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + (imageProgress * 100);
  const sideTranslateRight = 100 - (imageProgress * 100);
  const borderRadius = imageProgress * 24;
  const gap = imageProgress * (isMobile ? 3 : isTablet ? 4 : 16);
  const sideTranslateY = -(imageProgress * 15);
  const containerPadding = imageProgress * 16;
  const containerBottomPadding = 60 + (imageProgress * 40);

  return (
    <section ref={sectionRef} className="relative bg-background">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative flex h-full w-full items-stretch justify-center"
            style={{ gap: `${gap}px`, padding: `${containerPadding}px`, paddingBottom: `${containerBottomPadding}px` }}
          >
            {/* Left Column */}
            <div
              className="flex flex-col will-change-transform"
              style={{ width: `${sideWidth}%`, gap: `${gap}px`, transform: `translateX(${sideTranslateLeft}%) translateY(${sideTranslateY}%)`, opacity: sideOpacity, height: isDesktop ? '98%' : '78%', alignSelf: 'center' }}
            >
              {sideImages.filter(img => img.position === "left").map((img, idx) => (
                <div key={idx} className="relative overflow-hidden will-change-transform" style={{ flex: img.span, borderRadius: `${borderRadius}px` }}>
                  <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Center */}
            <div
              className="relative will-change-transform"
              style={{ width: `${centerWidth}%`, height: `${centerHeight}%`, flex: "0 0 auto" }}
            >
              {/* Clipped image + text content */}
              <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: `${borderRadius}px` }}>
                <img src="/images/hero-section-main-image.webp" alt="Flott Women's Circle gathering" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 25%, transparent 50%)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 35%, transparent 60%)" }} />
                <div className="absolute inset-0 flex items-end overflow-hidden" style={{ opacity: flottTextOpacity }}>
                  <h1 className="w-full text-center font-medium leading-[0.8] tracking-tighter text-white" style={{ fontSize: flottSize }}>
                    {word.split("").map((letter, index) =>
                      letter === "O" ? (
                        <span
                          key={index}
                          className="inline-block align-bottom animate-[slideUp_1.8s_cubic-bezier(0.22,1,0.36,1)_forwards] opacity-0"
                          style={{
                            animationDelay: `${0.3 + index * 0.1}s`,
                            width: "0.75em",
                            height: "0.75em",
                            position: "relative",
                            marginBottom: "-0.04em",
                            marginLeft: "0.01em",
                            marginRight: "0.01em",
                          }}
                        >
                          <svg
                            viewBox="0 0 200 200"
                            className="absolute inset-0 w-full h-full"
                            style={{ animation: "hero-spin 25s linear infinite" }}
                          >
                            <defs>
                              <path
                                id="heroCirclePath"
                                d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
                              />
                            </defs>
                            <text
                              className="fill-white"
                              style={{
                                fontSize: "17px",
                                letterSpacing: "4.5px",
                                textTransform: "uppercase",
                                fontWeight: 500,
                              }}
                            >
                              <textPath href="#heroCirclePath">
                                Wellness &bull; Empowerment &bull; Community &bull; Growth &bull;&nbsp;
                              </textPath>
                            </text>
                          </svg>
                        </span>
                      ) : (
                        <span
                          key={index}
                          className="inline-block animate-[slideUp_1.8s_cubic-bezier(0.22,1,0.36,1)_forwards] opacity-0"
                          style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                        >
                          {letter}
                        </span>
                      )
                    )}
                  </h1>
                </div>
              </div>

              {/* Glass widget — sits above FLOTT text, fades with it on scroll */}
              <div
                className="absolute z-10 left-1/2 -translate-x-1/2"
                style={{
                  bottom: widgetBottom,
                  opacity: flottTextOpacity,
                  transition: 'opacity 0.15s linear',
                }}
              >
                <div
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-xl animate-[slideUp_1.8s_cubic-bezier(0.22,1,0.36,1)_forwards] opacity-0 min-w-[280px] sm:min-w-[320px]"
                  style={{
                    animationDelay: "1.2s",
                    background: "rgba(0,0,0,0.45)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <button
                    onClick={() => setVideoOpen(true)}
                    className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl xl:h-20 xl:w-20 cursor-pointer group"
                  >
                    <img
                      src="/images/flott-26.webp"
                      alt="Play tour video"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 group-hover:scale-110"
                        style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.5)" }}
                      >
                        <svg className="h-2.5 w-2.5 text-white ml-[2px]" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] leading-relaxed text-white/90 md:text-xs">
                      Where women slow down, grow stronger, and reconnect with what matters.
                    </p>
                    <a
                      href="/contact"
                      className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-white transition-colors hover:text-white/70"
                    >
                      <span className="whitespace-nowrap">Join a Circle</span>
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div
              className="flex flex-col will-change-transform"
              style={{ width: `${sideWidth}%`, gap: `${gap}px`, transform: `translateX(${sideTranslateRight}%) translateY(${sideTranslateY}%)`, opacity: sideOpacity, height: isDesktop ? '98%' : '78%', alignSelf: 'center' }}
            >
              {sideImages.filter(img => img.position === "right").map((img, idx) => (
                <div key={idx} className="relative overflow-hidden will-change-transform" style={{ flex: img.span, borderRadius: `${borderRadius}px` }}>
                  <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator — below image */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{
            opacity: scrollProgress > 0.02 ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        >
          <div
            className="flex items-center gap-2 animate-[slideUp_1.8s_cubic-bezier(0.22,1,0.36,1)_forwards] opacity-0"
            style={{ animationDelay: "1.6s" }}
          >
            <span className="text-[10px] tracking-[0.25em] uppercase text-foreground/50">
              Scroll down
            </span>
            <svg
              className="w-3.5 h-3.5 text-foreground/50 animate-[scrollArrow_2s_cubic-bezier(0.22,1,0.36,1)_infinite]"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 4l5 4 5-4" />
              <path d="M3 9l5 4 5-4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="h-[200vh]" />

      <div className="relative px-6 pt-16 pb-12 sm:pt-20 sm:pb-14 md:pt-24 md:px-12 md:pb-16 lg:px-20 lg:pt-40 lg:pb-36 overflow-hidden">
        {/* Henna Paisley Cascade — right side */}
        <svg className="absolute -right-8 top-1/2 -translate-y-1/2 w-[260px] h-[380px] md:w-[320px] md:h-[460px] lg:w-[400px] lg:h-[550px] text-[#e8b4b8] opacity-[0.35] pointer-events-none" viewBox="0 0 400 550" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {/* Outer paisley body */}
          <path d="M200 530 C125 455 50 355 50 235 C50 115 115 40 200 18 C285 40 350 115 350 235 C350 355 275 455 200 530Z" />
          {/* Inner paisley with scalloped edge */}
          <path d="M200 475 C142 415 90 335 90 245 C90 155 138 92 200 72 C262 92 310 155 310 245 C310 335 258 415 200 475Z" />
          {/* Scallop bumps on inner paisley */}
          <path d="M120 130 C135 118 155 122 165 132" /><path d="M165 132 C175 118 195 112 200 112" />
          <path d="M200 112 C205 112 225 118 235 132" /><path d="M235 132 C245 122 265 118 280 130" />
          <path d="M92 200 C82 215 84 235 90 245" /><path d="M310 245 C316 235 318 215 308 200" />
          {/* Third inner ring */}
          <path d="M200 420 C158 372 125 310 125 250 C125 185 155 138 200 120 C245 138 275 185 275 250 C275 310 242 372 200 420Z" />
          {/* Spiral center */}
          <path d="M200 270 C200 260 210 254 218 258 C226 262 224 276 216 278 C208 280 198 276 196 266 C194 256 202 248 214 248 C226 248 234 260 232 272 C230 284 216 292 204 290" />
          {/* Radiating petals from center — 8 directions */}
          <path d="M200 240 Q208 220 200 200 Q192 220 200 240Z" />
          <path d="M220 252 Q238 240 248 222 Q232 236 220 252Z" />
          <path d="M228 272 Q248 272 264 262 Q246 268 228 272Z" />
          <path d="M220 290 Q238 302 248 320 Q232 306 220 290Z" />
          <path d="M200 300 Q208 320 200 340 Q192 320 200 300Z" />
          <path d="M180 290 Q162 302 152 320 Q168 306 180 290Z" />
          <path d="M172 272 Q152 272 136 262 Q154 268 172 272Z" />
          <path d="M180 252 Q162 240 152 222 Q168 236 180 252Z" />
          {/* Dot ring around center */}
          <circle cx="200" cy="195" r="3" /><circle cx="248" cy="218" r="3" /><circle cx="268" cy="260" r="3" />
          <circle cx="248" cy="322" r="3" /><circle cx="200" cy="345" r="3" /><circle cx="152" cy="322" r="3" />
          <circle cx="132" cy="260" r="3" /><circle cx="152" cy="218" r="3" />
          {/* Teardrop accents between 2nd and 3rd rings */}
          <path d="M145 175 C137 165 135 172 140 180 C145 172 147 168 145 175" />
          <path d="M255 175 C263 165 265 172 260 180 C255 172 253 168 255 175" />
          <path d="M112 280 C104 270 102 278 107 286 C112 278 114 274 112 280" />
          <path d="M288 280 C296 270 298 278 293 286 C288 278 286 274 288 280" />
          <path d="M145 370 C137 360 135 368 140 376 C145 368 147 364 145 370" />
          <path d="M255 370 C263 360 265 368 260 376 C255 368 253 364 255 370" />
          {/* Small inner dots in teardrops zone */}
          <circle cx="130" cy="210" r="2" /><circle cx="270" cy="210" r="2" />
          <circle cx="110" cy="310" r="2" /><circle cx="290" cy="310" r="2" />
          <circle cx="155" cy="400" r="2" /><circle cx="245" cy="400" r="2" />
          {/* Top tip curling tendrils */}
          <path d="M200 18 C222 8 236 18 232 36 C228 54 210 48 213 34" />
          <path d="M200 18 C178 8 164 18 168 36 C172 54 190 48 187 34" />
          <circle cx="200" cy="8" r="3.5" />
          {/* Decorative zigzag band between outer and 2nd ring (upper) */}
          <path d="M115 108 L125 98 L135 108 L145 98 L155 108 L165 98 L175 108 L185 98 L195 108 L205 98 L215 108 L225 98 L235 108 L245 98 L255 108 L265 98 L275 108" opacity="0.6" />
          {/* Small vine from bottom */}
          <path d="M200 530 C228 542 244 528 240 508 C236 488 218 492 220 510" />
          <path d="M240 508 C254 498 262 506 258 518" />
          <circle cx="260" cy="520" r="2.5" />
          {/* Leaf pair at bottom vine */}
          <path d="M220 510 C208 500 198 506 202 516" />
          <path d="M240 508 C248 496 256 500 252 510" />
        </svg>

        {/* Mirrored small paisley — left side (mobile visible) */}
        <svg className="absolute -left-4 bottom-8 w-[100px] h-[140px] md:w-[140px] md:h-[200px] text-[#e8b4b8] opacity-[0.3] pointer-events-none" viewBox="0 0 400 550" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: "scaleX(-1) rotate(30deg)" }}>
          <path d="M200 530 C125 455 50 355 50 235 C50 115 115 40 200 18 C285 40 350 115 350 235 C350 355 275 455 200 530Z" />
          <path d="M200 420 C158 372 125 310 125 250 C125 185 155 138 200 120 C245 138 275 185 275 250 C275 310 242 372 200 420Z" />
          <path d="M200 270 C200 260 210 254 218 258 C226 262 224 276 216 278 C208 280 198 276 196 266 C194 256 202 248 214 248" />
          <path d="M200 240 Q208 220 200 200 Q192 220 200 240Z" />
          <path d="M200 300 Q208 320 200 340 Q192 320 200 300Z" />
          <path d="M228 272 Q248 272 264 262 Q246 268 228 272Z" />
          <path d="M172 272 Q152 272 136 262 Q154 268 172 272Z" />
          <circle cx="200" cy="195" r="3" /><circle cx="200" cy="345" r="3" />
          <circle cx="132" cy="260" r="3" /><circle cx="268" cy="260" r="3" />
        </svg>

        <p ref={heroTextRef} className={`word-blur-group ${heroTextVisible ? "visible" : ""} mx-auto max-w-3xl text-center text-[2rem] leading-tight tracking-tight font-semibold text-foreground sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] relative z-10`}>
          <span className="word-blur" style={{ transitionDelay: "0s" }}>We're</span>{" "}
          <span className="word-blur" style={{ transitionDelay: "0.1s" }}>not</span>{" "}
          <span className="word-blur" style={{ transitionDelay: "0.2s" }}>networking.</span>
          <br />
          <span className="word-blur" style={{ transitionDelay: "0.35s" }}>We're</span>{" "}
          <span className="word-blur" style={{ transitionDelay: "0.5s", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>reconnecting.</span>
        </p>
      </div>

      {/* Video modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => { setVideoOpen(false); setVideoPaused(false); }}
        >
          <button
            onClick={() => { setVideoOpen(false); setVideoPaused(false); }}
            className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <div
            className="relative w-[85vw] max-w-[400px] overflow-hidden rounded-2xl group"
            style={{ aspectRatio: "9/16" }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              src="/videos/tour.mp4"
              className="h-full w-full object-cover cursor-pointer"
              autoPlay
              playsInline
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                if (v.paused) { v.play(); setVideoPaused(false); }
                else { v.pause(); setVideoPaused(true); }
              }}
              onTimeUpdate={() => {
                const v = videoRef.current;
                if (!v || !v.duration) return;
                setVideoProgress((v.currentTime / v.duration) * 100);
                const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
                setVideoCurrentTime(fmt(v.currentTime));
                setVideoDuration(fmt(v.duration));
              }}
              onEnded={() => setVideoPaused(true)}
            />
            {/* Custom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Progress bar */}
              <div
                className="relative h-1 w-full rounded-full bg-white/20 cursor-pointer mb-3"
                onClick={(e) => {
                  const v = videoRef.current;
                  if (!v) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  v.currentTime = pct * v.duration;
                }}
              >
                <div className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${videoProgress}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    className="text-white cursor-pointer"
                    onClick={() => {
                      const v = videoRef.current;
                      if (!v) return;
                      if (v.paused) { v.play(); setVideoPaused(false); }
                      else { v.pause(); setVideoPaused(true); }
                    }}
                  >
                    {videoPaused ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    )}
                  </button>
                  <span className="text-xs text-white/70 tabular-nums">{videoCurrentTime} / {videoDuration}</span>
                </div>
                <button
                  className="text-white cursor-pointer"
                  onClick={() => {
                    const v = videoRef.current;
                    if (!v) return;
                    v.muted = !v.muted;
                    setVideoMuted(v.muted);
                  }}
                >
                  {videoMuted ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
