import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Code2, Settings } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Search } from "@/components/Search";
import { Link } from "react-router-dom";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-background text-foreground px-3 py-2 rounded">{t("Pular para o conteúdo", "Skip to content")}</a>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center glow">
              <Code2 className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-space-grotesk font-bold gradient-text">
                Monynha Softwares
              </h1>
              <p className="text-xs text-muted-foreground">
                {t('Desenvolvimento Futurista', 'Futuristic Development')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Primary">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              {t("Início", "Home")}
            </Link>
            <Link to="/projects" className="text-foreground hover:text-primary transition-colors">
              {t("Projetos", "Projects")}
            </Link>
            <Link to="/docs" className="text-foreground hover:text-primary transition-colors">
              {t("Docs", "Docs")}
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors">
              {t("Blog", "Blog")}
            </Link>
            
            {/* Search */}
            <div className="w-64">
              <Search 
                placeholder={t("Buscar...", "Search...")}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <select 
                className="bg-transparent text-sm focus:outline-none cursor-pointer"
                value={language}
                aria-label={t("Selecionar idioma", "Select language")}
                onChange={(e) => setLanguage(e.target.value as 'pt' | 'en')}
              >
                <option value="pt">PT</option>
                <option value="en">EN</option>
              </select>
            </div>
            <Button variant="ghost" size="icon" asChild className="glow-hover">
              <Link to="/admin" title={t('Painel Admin', 'Admin Panel')}>
                <Settings className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="hero" size="lg" asChild>
              <Link to="/projects">{t("Explorar", "Explore")}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? t('Fechar menu', 'Close menu') : t('Abrir menu', 'Open menu')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-4 p-4 glass-card animate-scale-in">
            <nav className="flex flex-col space-y-4" aria-label="Mobile Primary">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                {t("Início", "Home")}
              </Link>
              <Link to="/projects" className="text-foreground hover:text-primary transition-colors">
                {t("Projetos", "Projects")}
              </Link>
              <Link to="/docs" className="text-foreground hover:text-primary transition-colors">
                {t("Docs", "Docs")}
              </Link>
              <Link to="/blog" className="text-foreground hover:text-primary transition-colors">
                {t("Blog", "Blog")}
              </Link>
              <div className="flex items-center space-x-2 py-2">
                <Globe className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <select 
                  className="bg-transparent text-sm focus:outline-none cursor-pointer"
                  value={language}
                  aria-label={t("Selecionar idioma", "Select language")}
                  onChange={(e) => setLanguage(e.target.value as 'pt' | 'en')}
                >
                  <option value="pt">PT</option>
                  <option value="en">EN</option>
                </select>
              </div>
              <Button variant="hero" size="lg" className="mt-4" asChild>
                <Link to="/projects">{t("Explorar", "Explore")}</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="mt-2">
                <Link to="/admin" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  {t('Admin', 'Admin')}
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}