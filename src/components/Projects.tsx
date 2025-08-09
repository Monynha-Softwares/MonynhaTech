import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star, Users, Code } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useLanguage } from "@/hooks/useLanguage";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";

const gradients = [
  "from-primary to-primary-glow",
  "from-secondary to-secondary-glow", 
  "from-purple-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-blue-500 to-cyan-500",
  "from-orange-500 to-red-500",
];

export function Projects() {
  const { data: projects, isLoading, error, refetch } = useProjects();
  const { language, t } = useLanguage();

  if (isLoading) {
    return (
      <section id="projects" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-space-grotesk font-bold mb-6">
              {t("Projetos", "Projects")} <span className="gradient-text">{t("Futuristas", "Futuristic")}</span>
            </h2>
          </div>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 relative">
        <div className="container mx-auto px-6">
          <ErrorState 
            message={t("Erro ao carregar projetos", "Error loading projects")} 
            onRetry={() => refetch()}
          />
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
            {t("Projetos", "Projects")} <span className="gradient-text">{t("Futuristas", "Futuristic")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t(
              "Desenvolvemos soluções inovadoras que transformam ideias em realidade digital, sempre focando em inclusão, performance e experiências extraordinárias.",
              "We develop innovative solutions that transform ideas into digital reality, always focusing on inclusion, performance and extraordinary experiences."
            )}
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
                    {t("Ativo", "Active")}
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
                    {language === 'pt' ? project.name_pt : (project.name_en || project.name_pt)}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {language === 'pt' ? project.description_pt : (project.description_en || project.description_pt)}
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
                          {t("Código", "Code")}
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
            {t("Ver Todos os Projetos", "View All Projects")}
          </Button>
        </div>
      </div>
    </section>
  );
}