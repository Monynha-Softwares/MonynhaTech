"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Heart } from "lucide-react";
const heroImage = "/hero-bg.jpg";

export function Hero() {
  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
      style={{ 
        backgroundImage: `linear-gradient(rgba(35, 39, 42, 0.8), rgba(35, 39, 42, 0.9)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
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
            <Sparkles className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium">Tecnologia Futurista • Open Source</span>
            <Heart className="w-4 h-4 text-secondary ml-2" />
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-space-grotesk font-bold mb-6 leading-tight">
            <span className="gradient-text">Monynha</span>
            <br />
            <span className="text-foreground">Softwares</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Criamos experiências digitais <span className="gradient-text font-semibold">futuristas</span> e 
            <span className="gradient-text font-semibold"> inclusivas</span> com tecnologias de ponta. 
            Desenvolvendo o futuro da web com amor e diversidade.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="hero" className="group">
              Explorar Projetos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="glass" size="hero">
              <Zap className="w-5 h-5 mr-2" />
              Ver Documentação
            </Button>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "React", "TypeScript", "Next.js", "Supabase", 
              "Tailwind", "Payload CMS", "Turborepo"
            ].map((tech) => (
              <div key={tech} className="glass px-4 py-2 rounded-xl text-sm font-jetbrains-mono">
                {tech}
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