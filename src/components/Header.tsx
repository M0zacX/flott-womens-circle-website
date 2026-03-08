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
    { label: "Gallery", href: "/gallery" },
  ];

  return (
    <header
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl rounded-full"
      style={{ border: "1px solid transparent" }}
    >
      {/* Glass background layer — fades in/out smoothly */}
      <div
        className="absolute inset-0 rounded-full backdrop-blur-xl transition-opacity duration-700"
        style={{
          opacity: isScrolled ? 1 : 0,
          background: "linear-gradient(135deg, rgba(246,131,19,0.08) 0%, rgba(245,230,213,0.65) 40%, rgba(232,212,196,0.55) 100%)",
          boxShadow: "0 1px 2px rgba(246,131,19,0.06), 0 4px 16px rgba(246,131,19,0.04), inset 0 1px 0 rgba(255,255,255,0.5)",
          border: "1px solid rgba(246,131,19,0.1)",
          pointerEvents: "none",
        }}
      />
      <div className="relative flex items-center justify-between transition-all duration-700 px-2 pl-5 py-2">
        <a href="/" className="transition-opacity duration-700">
          <img src="/images/flott-women-circle-logo.png" alt="Flott Women's Circle" className={`h-8 w-auto transition-all duration-700 ${isScrolled ? "" : "brightness-0 invert"}`} />
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

        <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className={`transition-colors md:hidden ${isScrolled ? "text-foreground" : "text-white"}`} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background px-6 py-8 md:hidden rounded-b-2xl">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => {
              const isActive = currentPath.replace(/\/$/, "") === link.href;
              return (
                <a key={link.label} href={link.href} className={`text-lg ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`} onClick={() => setIsMenuOpen(false)}>{link.label}</a>
              );
            })}
            <a href="/contact" className="mt-4 bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground rounded-full" onClick={() => setIsMenuOpen(false)}>Join a Circle</a>
          </nav>
        </div>
      )}
    </header>
  );
}
