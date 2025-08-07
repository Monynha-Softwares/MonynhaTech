import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Code2 } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center glow">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-space-grotesk font-bold gradient-text">
                Monynha Softwares
              </h1>
              <p className="text-xs text-muted-foreground">Futuristic Development</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">
              Início
            </a>
            <a href="#projects" className="text-foreground hover:text-primary transition-colors">
              Projetos
            </a>
            <a href="#docs" className="text-foreground hover:text-primary transition-colors">
              Docs
            </a>
            <a href="#blog" className="text-foreground hover:text-primary transition-colors">
              Blog
            </a>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <select className="bg-transparent text-sm focus:outline-none">
                <option value="pt">PT</option>
                <option value="en">EN</option>
              </select>
            </div>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="hero" size="lg">
              Explorar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 glass-card animate-scale-in">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">
                Início
              </a>
              <a href="#projects" className="text-foreground hover:text-primary transition-colors">
                Projetos
              </a>
              <a href="#docs" className="text-foreground hover:text-primary transition-colors">
                Docs
              </a>
              <a href="#blog" className="text-foreground hover:text-primary transition-colors">
                Blog
              </a>
              <Button variant="hero" size="lg" className="mt-4">
                Explorar
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}