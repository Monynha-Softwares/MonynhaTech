import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail, Heart, Code2 } from "lucide-react";

export function Footer() {
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
                  Monynha Softwares
                </h3>
                <p className="text-sm text-muted-foreground">Futuristic Development</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
              Criamos experiências digitais futuristas e inclusivas. 
              Nossa missão é democratizar a tecnologia e construir um futuro mais diverso e igualitário.
            </p>
            <div className="flex space-x-4">
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
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-space-grotesk font-semibold mb-6">Navegação</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-muted-foreground hover:text-primary transition-colors">Início</a></li>
              <li><a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">Projetos</a></li>
              <li><a href="#docs" className="text-muted-foreground hover:text-primary transition-colors">Documentação</a></li>
              <li><a href="#blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#community" className="text-muted-foreground hover:text-primary transition-colors">Comunidade</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-space-grotesk font-semibold mb-6">Recursos</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API Docs</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contribuir</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Roadmap</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="glass-card mb-12">
          <div className="text-center">
            <h4 className="text-2xl font-space-grotesk font-bold mb-4 gradient-text">
              Fique por dentro das novidades
            </h4>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Receba atualizações sobre nossos projetos, novidades da comunidade e 
              conteúdo exclusivo sobre desenvolvimento futurista.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="seu@email.com" 
                className="flex-1 px-4 py-3 bg-background/50 rounded-xl border border-border/50 focus:border-primary focus:outline-none"
              />
              <Button variant="hero">Inscrever-se</Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/30">
          <div className="flex items-center space-x-2 text-muted-foreground mb-4 md:mb-0">
            <span>© 2024 Monynha Softwares. Feito com</span>
            <Heart className="w-4 h-4 text-pink-400" />
            <span>e muito café.</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Termos</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
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