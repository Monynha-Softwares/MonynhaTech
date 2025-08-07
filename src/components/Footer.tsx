import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail, Heart, Code2 } from "lucide-react";
import { useSite } from "@/contexts/SiteContext";

export function Footer() {
  const { siteSettings, navigation, isLoading } = useSite();

  // Default values to use while loading or if CMS data is not available
  const defaultFooter = {
    description: "Criamos experiências digitais futuristas e inclusivas. Nossa missão é democratizar a tecnologia e construir um futuro mais diverso e igualitário.",
    newsletterHeading: "Fique por dentro das novidades",
    newsletterDescription: "Receba atualizações sobre nossos projetos, novidades da comunidade e conteúdo exclusivo sobre desenvolvimento futurista.",
    newsletterButtonText: "Inscrever-se",
    copyrightText: "© 2024 Monynha Softwares. Feito com"
  };

  const defaultNavigation = {
    column1: {
      title: "Navegação",
      links: [
        { label: "Início", link: "#home" },
        { label: "Projetos", link: "#projects" },
        { label: "Documentação", link: "#docs" },
        { label: "Blog", link: "#blog" },
        { label: "Comunidade", link: "#community" }
      ]
    },
    column2: {
      title: "Recursos",
      links: [
        { label: "API Docs", link: "#" },
        { label: "GitHub", link: "#" },
        { label: "Contribuir", link: "#" },
        { label: "Roadmap", link: "#" },
        { label: "Status", link: "#" }
      ]
    }
  };

  const defaultLegalLinks = [
    { label: "Privacidade", link: "#" },
    { label: "Termos", link: "#" },
    { label: "Cookies", link: "#" }
  ];

  // Use CMS data if available, otherwise use defaults
  const footerSection = siteSettings?.footerSection || defaultFooter;
  const footerNavigation = navigation?.footerNavigation || defaultNavigation;
  const legalLinks = navigation?.legalLinks || defaultLegalLinks;
  const socialLinks = siteSettings?.socialLinks || {};
  const siteTitle = siteSettings?.siteTitle || "Monynha Softwares";

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
                <Code2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-space-grotesk font-bold gradient-text">
                  {siteTitle}
                </h3>
                <p className="text-sm text-muted-foreground">Futuristic Development</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
              {footerSection.description}
            </p>
            <div className="flex space-x-4">
              {socialLinks?.github && (
                <Button variant="glass" size="icon" asChild>
                  <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {socialLinks?.twitter && (
                <Button variant="glass" size="icon" asChild>
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {socialLinks?.linkedin && (
                <Button variant="glass" size="icon" asChild>
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {socialLinks?.email && (
                <Button variant="glass" size="icon" asChild>
                  <a href={`mailto:${socialLinks.email}`}>
                    <Mail className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {/* If no social links are provided, show default buttons */}
              {!socialLinks?.github && !socialLinks?.twitter && !socialLinks?.linkedin && !socialLinks?.email && (
                <>
                  <Button variant="glass" size="icon">
                    <Github className="w-5 h-5" />
                  </Button>
                  <Button variant="glass" size="icon">
                    <Twitter className="w-5 h-5" />
                  </Button>
                  <Button variant="glass" size="icon">
                    <Linkedin className="w-5 h-5" />
                  </Button>
                  <Button variant="glass" size="icon">
                    <Mail className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-space-grotesk font-semibold mb-6">
              {footerNavigation.column1?.title || "Navegação"}
            </h4>
            <ul className="space-y-3">
              {(footerNavigation.column1?.links || defaultNavigation.column1.links).map((link: any) => (
                <li key={link.label}>
                  <a href={link.link} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-space-grotesk font-semibold mb-6">
              {footerNavigation.column2?.title || "Recursos"}
            </h4>
            <ul className="space-y-3">
              {(footerNavigation.column2?.links || defaultNavigation.column2.links).map((link: any) => (
                <li key={link.label}>
                  <a href={link.link} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="glass-card mb-12">
          <div className="text-center">
            <h4 className="text-2xl font-space-grotesk font-bold mb-4 gradient-text">
              {footerSection.newsletterHeading}
            </h4>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {footerSection.newsletterDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="seu@email.com" 
                className="flex-1 px-4 py-3 bg-background/50 rounded-xl border border-border/50 focus:border-primary focus:outline-none"
              />
              <Button variant="hero">{footerSection.newsletterButtonText}</Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/30">
          <div className="flex items-center space-x-2 text-muted-foreground mb-4 md:mb-0">
            <span>{footerSection.copyrightText}</span>
            <Heart className="w-4 h-4 text-pink-400" />
            <span>e muito café.</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            {legalLinks.map((link: any) => (
              <a key={link.label} href={link.link} className="hover:text-primary transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Pride Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center glass px-4 py-2 rounded-full border border-primary/20">
            <span className="text-6xl mr-2">🏳️‍🌈</span>
            <span className="text-sm font-medium">Proud to be inclusive • Orgulhosos de ser inclusivos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}