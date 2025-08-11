import { Button } from "@ui/components/ui/button";
import { ArrowRight, Sparkles, Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const techStack = [
  { pt: "React", en: "React" },
  { pt: "TypeScript", en: "TypeScript" },
  { pt: "Next.js", en: "Next.js" },
  { pt: "Supabase", en: "Supabase" },
  { pt: "Tailwind", en: "Tailwind" },
  { pt: "Payload CMS", en: "Payload CMS" },
  { pt: "Turborepo", en: "Turborepo" }
];

export function Hero() {
  const { t } = useLanguage();
  return (
    <section
      id="home"
      className="hero-background min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float float-delayed"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Hero Badge */}
          <div className="inline-flex items-center glass px-4 py-2 rounded-full mb-8 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary mr-2" aria-hidden="true" />
            <span className="text-sm font-medium">
              {t("Tecnologia Futurista • Código Aberto", "Futuristic Technology • Open Source")}
            </span>
            <Heart className="w-4 h-4 text-secondary ml-2" aria-hidden="true" />
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-space-grotesk font-bold mb-6 leading-tight">
            <span className="gradient-text">Monynha</span>
            <br />
            <span className="text-foreground">Softwares</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {t(
              "Criamos experiências digitais ",
              "We build digital experiences "
            )}
            <span className="gradient-text font-semibold">{t("futuristas", "futuristic")}</span>
            {t(" e", " and")}
            <span className="gradient-text font-semibold">{t(" inclusivas", " inclusive")}</span>
            {t(" com tecnologias de ponta. Desenvolvendo o futuro da web com amor e diversidade.", " with cutting-edge technologies. Developing the future of the web with love and diversity.")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="hero" className="group" asChild>
              <Link to="/projects">
                {t("Explorar Projetos", "Explore Projects")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="glass" size="hero" asChild>
              <Link to="/docs">
                <Zap className="w-5 h-5 mr-2" aria-hidden="true" />
                {t("Ver Documentação", "View Documentation")}
              </Link>
            </Button>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <div
                key={tech.en}
                className="glass px-4 py-2 rounded-xl text-sm font-jetbrains-mono"
              >
                {t(tech.pt, tech.en)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}