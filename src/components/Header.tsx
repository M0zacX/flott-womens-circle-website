import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl transition-all duration-700 ${isScrolled ? "bg-background/80 backdrop-blur-md rounded-full" : "bg-transparent"}`}
      style={{
        boxShadow: isScrolled ? "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px" : "none"
      }}
    >
      <div className="flex items-center justify-between transition-all duration-700 px-2 pl-5 py-2">
        <a href="/" className="transition-opacity duration-700">
          <img src="/images/flott-women-circle-logo.png" alt="Flott Women's Circle" className={`h-8 w-auto transition-all duration-700 ${isScrolled ? "" : "brightness-0 invert"}`} />
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          <a href="#about" className={`text-sm transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>About</a>
          <a href="#focus-areas" className={`text-sm transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Focus Areas</a>
          <a href="#programs" className={`text-sm transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Programs</a>
          <a href="#gallery" className={`text-sm transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Gallery</a>
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <a href="/contact" className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${isScrolled ? "bg-primary text-primary-foreground hover:opacity-80" : "bg-white text-foreground hover:bg-white/90"}`}>
            Join a Circle
          </a>
        </div>

        <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className={`transition-colors md:hidden ${isScrolled ? "text-foreground" : "text-white"}`} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background px-6 py-8 md:hidden rounded-b-2xl">
          <nav className="flex flex-col gap-6">
            <a href="#about" className="text-lg text-foreground" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#focus-areas" className="text-lg text-foreground" onClick={() => setIsMenuOpen(false)}>Focus Areas</a>
            <a href="#programs" className="text-lg text-foreground" onClick={() => setIsMenuOpen(false)}>Programs</a>
            <a href="#gallery" className="text-lg text-foreground" onClick={() => setIsMenuOpen(false)}>Gallery</a>
            <a href="/contact" className="mt-4 bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground rounded-full" onClick={() => setIsMenuOpen(false)}>Join a Circle</a>
          </nav>
        </div>
      )}
    </header>
  );
}
