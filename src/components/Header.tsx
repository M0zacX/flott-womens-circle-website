import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Header({ innerPage = false, currentPath = "" }: { innerPage?: boolean; currentPath?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(innerPage);

  useEffect(() => {
    if (innerPage) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [innerPage]);

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Focus Areas", href: "/focus-areas" },
    { label: "Programs", href: "/programs" },
    { label: "Our Circles", href: "/circles" },
    { label: "Gallery", href: "/gallery" },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const header = document.getElementById("site-header");
      if (header && !header.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside as EventListener);
    };
  }, [isMenuOpen]);

  const showGlass = isScrolled || isMenuOpen;

  return (
    <header id="site-header" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl">
      {/* Top bar — always a pill */}
      <div className="relative rounded-full" style={{ border: "1px solid transparent" }}>
        {/* Glass background for pill */}
        <div
          className="absolute inset-0 rounded-full backdrop-blur-xl transition-opacity duration-700"
          style={{
            opacity: showGlass ? 1 : 0,
            background: "linear-gradient(135deg, rgba(246,131,19,0.08) 0%, rgba(245,230,213,0.65) 40%, rgba(232,212,196,0.55) 100%)",
            boxShadow: "0 1px 2px rgba(246,131,19,0.06), 0 4px 16px rgba(246,131,19,0.04), inset 0 1px 0 rgba(255,255,255,0.5)",
            border: "1px solid rgba(246,131,19,0.1)",
            pointerEvents: "none",
          }}
        />
        <div className="relative flex items-center justify-between px-2 pl-5 py-2">
          <a href="/" className="transition-opacity duration-700">
            <img src="/images/flott-women-circle-logo.png" alt="Flott Women's Circle" className={`h-8 w-auto transition-all duration-700 ${showGlass ? "" : "brightness-0 invert"}`} />
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => {
              const isActive = currentPath.replace(/\/$/, "") === link.href;
              return (
                <a key={link.label} href={link.href} className={`text-sm transition-colors ${isActive ? (isScrolled ? "text-foreground font-medium" : "text-white font-medium") : (isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white")}`}>{link.label}</a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-6 md:flex">
            <a href="/contact" className={`flex h-10 w-10 items-center justify-center text-sm font-medium transition-all rounded-full ${isScrolled ? "bg-primary text-primary-foreground hover:opacity-80" : "bg-white text-foreground hover:bg-white/90"}`} title="Join a Circle">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>

          <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className={`transition-colors md:hidden ${showGlass ? "text-foreground" : "text-white"}`} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown — separate panel below the pill */}
      {isMenuOpen && (
        <div
          className="mobile-menu-panel mt-2 rounded-2xl backdrop-blur-xl px-6 py-8 md:hidden"
          style={{
            background: "linear-gradient(135deg, rgba(246,131,19,0.06) 0%, rgba(245,230,213,0.85) 40%, rgba(232,212,196,0.75) 100%)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
            border: "1px solid rgba(246,131,19,0.1)",
          }}
        >
          <nav className="flex flex-col gap-6">
            {navLinks.map((link, i) => {
              const isActive = currentPath.replace(/\/$/, "") === link.href;
              return (
                <a key={link.label} href={link.href} className={`mobile-menu-item text-lg ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`} style={{ animationDelay: `${0.05 + i * 0.06}s` }} onClick={() => setIsMenuOpen(false)}>{link.label}</a>
              );
            })}
            <a href="/contact" className="mobile-menu-item mt-4 bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground rounded-full" style={{ animationDelay: `${0.05 + navLinks.length * 0.06}s` }} onClick={() => setIsMenuOpen(false)}>Join a Circle</a>
          </nav>
        </div>
      )}
    </header>
  );
}
