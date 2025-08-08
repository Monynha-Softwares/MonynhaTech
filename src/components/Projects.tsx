import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star, Users, Code } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

const gradients = [
  "from-primary to-primary-glow",
  "from-secondary to-secondary-glow", 
  "from-purple-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-blue-500 to-cyan-500",
  "from-orange-500 to-red-500",
];

export function Projects() {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <section id="projects" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center text-destructive">
            Erro ao carregar projetos: {error.message}
          </div>
        </div>
      </section>
    );
  }

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
          {projects?.map((project, index) => {
            const projectLinks = project.links as any;
            const gradientClass = gradients[index % gradients.length];
            
            return (
              <div 
                key={project.id} 
                className="glass-card glow-hover group cursor-pointer"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Project Header */}
                <div className={`h-2 w-full bg-gradient-to-r ${gradientClass} rounded-t-3xl`}></div>
                
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                      Ativo
                    </span>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{Math.floor(Math.random() * 3000) + 500}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{Math.floor(Math.random() * 30) + 5}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-2xl font-space-grotesk font-semibold mb-3 group-hover:gradient-text transition-all">
                    {project.name_pt}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {project.description_pt}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-background/50 rounded-lg text-xs font-jetbrains-mono border border-border/50">
                      React
                    </span>
                    <span className="px-3 py-1 bg-background/50 rounded-lg text-xs font-jetbrains-mono border border-border/50">
                      TypeScript
                    </span>
                    <span className="px-3 py-1 bg-background/50 rounded-lg text-xs font-jetbrains-mono border border-border/50">
                      Supabase
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    {projectLinks?.github && (
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={projectLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Código
                        </a>
                      </Button>
                    )}
                    {projectLinks?.demo && (
                      <Button variant="glow" size="sm" className="flex-1" asChild>
                        <a href={projectLinks.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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