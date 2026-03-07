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
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md rounded-full" : "bg-transparent"}`}
      style={{
        boxShadow: isScrolled ? "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px" : "none"
      }}
    >
      <div className="flex items-center justify-between transition-all duration-300 px-2 pl-5 py-2">
        <a href="#" className={`text-lg font-medium tracking-tight transition-colors duration-300 ${isScrolled ? "text-foreground" : "text-white"}`}>
          EVASION
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          <a href="#products" className={`text-sm transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Products</a>
          <a href="#technology" className={`text-sm transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Technology</a>
          <a href="#gallery" className={`text-sm transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Gallery</a>
          <a href="#accessories" className={`text-sm transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Accessories</a>
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <a href="#reserve" className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${isScrolled ? "bg-foreground text-background hover:opacity-80" : "bg-white text-foreground hover:bg-white/90"}`}>
            Buy the product
          </a>
        </div>

        <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className={`transition-colors md:hidden ${isScrolled ? "text-foreground" : "text-white"}`} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background px-6 py-8 md:hidden rounded-b-2xl">
          <nav className="flex flex-col gap-6">
            <a href="#products" className="text-lg text-foreground" onClick={() => setIsMenuOpen(false)}>Products</a>
            <a href="#technology" className="text-lg text-foreground" onClick={() => setIsMenuOpen(false)}>Technology</a>
            <a href="#gallery" className="text-lg text-foreground" onClick={() => setIsMenuOpen(false)}>Gallery</a>
            <a href="#accessories" className="text-lg text-foreground" onClick={() => setIsMenuOpen(false)}>Accessories</a>
            <a href="#reserve" className="mt-4 bg-foreground px-5 py-3 text-center text-sm font-medium text-background rounded-full" onClick={() => setIsMenuOpen(false)}>Reserve</a>
          </nav>
        </div>
      )}
    </header>
  );
}
