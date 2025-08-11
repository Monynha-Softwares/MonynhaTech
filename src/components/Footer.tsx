import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail, Heart, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="relative py-20 border-t border-border/50">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center glow">
                <Code2 className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-2xl font-space-grotesk font-bold gradient-text">
                  Monynha Softwares
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("Desenvolvimento Futurista", "Futuristic Development")}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
              {t(
                "Criamos experiências digitais futuristas e inclusivas. Nossa missão é democratizar a tecnologia e construir um futuro mais diverso e igualitário.",
                "We create futuristic and inclusive digital experiences. Our mission is to democratize technology and build a more diverse and equal future."
              )}
            </p>
            <div className="flex space-x-4">
              <Button
                variant="glass"
                size="icon"
                aria-label={t('GitHub', 'GitHub')}
                title={t('GitHub', 'GitHub')}
              >
                <Github className="w-5 h-5" aria-hidden="true" />
              </Button>
              <Button
                variant="glass"
                size="icon"
                aria-label={t('Twitter', 'Twitter')}
                title={t('Twitter', 'Twitter')}
              >
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </Button>
              <Button
                variant="glass"
                size="icon"
                aria-label={t('LinkedIn', 'LinkedIn')}
                title={t('LinkedIn', 'LinkedIn')}
              >
                <Linkedin className="w-5 h-5" aria-hidden="true" />
              </Button>
              <Button
                variant="glass"
                size="icon"
                aria-label={t('E-mail', 'Email')}
                title={t('E-mail', 'Email')}
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-space-grotesk font-semibold mb-6">
              {t("Navegação", "Navigation")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("Início", "Home")}
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("Projetos", "Projects")}
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("Documentação", "Documentation")}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("Blog", "Blog")}
                </Link>
              </li>
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("Comunidade", "Community")}
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-space-grotesk font-semibold mb-6">
              {t("Recursos", "Resources")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/docs" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("API Docs", "API Docs")}
                </Link>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('GitHub', 'GitHub')}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("Contribuir", "Contribute")}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/roadmap"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Roadmap', 'Roadmap')}
                </a>
              </li>
              <li>
                <a
                  href="https://www.githubstatus.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Status', 'Status')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="glass-card mb-12">
          <div className="text-center">
            <h4 className="text-2xl font-space-grotesk font-bold mb-4 gradient-text">
              {t("Fique por dentro das novidades", "Stay up to date with news")}
            </h4>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t(
                "Receba atualizações sobre nossos projetos, novidades da comunidade e conteúdo exclusivo sobre desenvolvimento futurista.",
                "Receive updates about our projects, community news, and exclusive content on futuristic development."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t("seu@email.com", "your@email.com")}
                className="flex-1 px-4 py-3 bg-background/50 rounded-xl border border-border/50 focus:border-primary focus:outline-none"
              />
              <Button variant="hero">{t("Inscrever-se", "Subscribe")}</Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/30">
          <div className="flex items-center space-x-2 text-muted-foreground mb-4 md:mb-0">
            <span>© 2024 Monynha Softwares. {t("Feito com", "Made with")}</span>
            <Heart className="w-4 h-4 text-pink-400" aria-hidden="true" />
            <span>{t("e muito café.", "and lots of coffee.")}</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              {t("Privacidade", "Privacy")}
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              {t("Termos", "Terms")}
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              {t("Cookies", "Cookies")}
            </a>
          </div>
        </div>

        {/* Pride Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center glass px-4 py-2 rounded-full border border-primary/20">
            <span className="text-6xl mr-2">🏳️‍🌈</span>
            <span className="text-sm font-medium">
              {t("Orgulhosos de ser inclusivos", "Proud to be inclusive")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}