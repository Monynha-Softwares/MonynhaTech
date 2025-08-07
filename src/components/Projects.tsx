import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star, Users, Code } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Nexus Lab",
    description: "Plataforma experimental para desenvolvimento de protótipos futuristas com tecnologias emergentes.",
    tech: ["React", "WebGL", "AI/ML", "WebAssembly"],
    stars: "2.1k",
    contributors: "12",
    status: "Em desenvolvimento",
    gradient: "from-primary to-primary-glow"
  },
  {
    id: 2,
    title: "Quantum UI",
    description: "Sistema de design futurista com componentes holográficos e animações quânticas.",
    tech: ["Framer Motion", "Three.js", "GSAP", "CSS3"],
    stars: "856",
    contributors: "8",
    status: "Stable",
    gradient: "from-secondary to-secondary-glow"
  },
  {
    id: 3,
    title: "Neural CMS",
    description: "Sistema de gerenciamento de conteúdo com IA integrada e edição inteligente.",
    tech: ["Payload CMS", "OpenAI", "PostgreSQL", "Docker"],
    stars: "1.3k",
    contributors: "15",
    status: "Beta",
    gradient: "from-purple-500 to-pink-500"
  }
];

export function Projects() {
  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-space-grotesk font-bold mb-6">
            Projetos <span className="gradient-text">Futuristas</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Desenvolvemos soluções inovadoras que transformam ideias em realidade digital, 
            sempre focando em inclusão, performance e experiências extraordinárias.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className="glass-card glow-hover group cursor-pointer"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Project Header */}
              <div className={`h-2 w-full bg-gradient-to-r ${project.gradient} rounded-t-3xl`}></div>
              
              <div className="p-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'Stable' ? 'bg-green-500/20 text-green-400' :
                    project.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {project.status}
                  </span>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{project.stars}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{project.contributors}</span>
                    </div>
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-2xl font-space-grotesk font-semibold mb-3 group-hover:gradient-text transition-all">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <span 
                      key={tech} 
                      className="px-3 py-1 bg-background/50 rounded-lg text-xs font-jetbrains-mono border border-border/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Github className="w-4 h-4 mr-2" />
                    Código
                  </Button>
                  <Button variant="glow" size="sm" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button variant="cyber" size="xl">
            <Code className="w-5 h-5 mr-2" />
            Ver Todos os Projetos
          </Button>
        </div>
      </div>
    </section>
  );
}