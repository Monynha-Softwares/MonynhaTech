import { Heart, Sparkles, Zap, Users, Globe, Code2 } from "lucide-react";
import { useSite } from "@/contexts/SiteContext";

// Map icon strings from CMS to Lucide React components
const iconMap: Record<string, any> = {
  Heart,
  Sparkles,
  Zap,
  Users,
  Globe,
  Code2,
};

export function About() {
  const { siteSettings, isLoading } = useSite();

  // Default values to use while loading or if CMS data is not available
  const defaultValues = [
    {
      icon: "Heart",
      title: "Inclusão & Diversidade",
      description: "Criamos tecnologia para todas as pessoas, celebrando a diversidade como nossa maior força.",
      color: "text-pink-400"
    },
    {
      icon: "Sparkles",
      title: "Inovação Constante",
      description: "Exploramos tecnologias emergentes para criar soluções que transcendem o presente.",
      color: "text-primary"
    },
    {
      icon: "Zap",
      title: "Performance Extrema",
      description: "Otimizamos cada linha de código para entregar experiências instantâneas e fluidas.",
      color: "text-secondary"
    },
    {
      icon: "Users",
      title: "Comunidade Ativa",
      description: "Construímos juntos, compartilhamos conhecimento e crescemos como coletivo.",
      color: "text-purple-400"
    },
    {
      icon: "Globe",
      title: "Impacto Global",
      description: "Nossas soluções conectam culturas e transformam vidas ao redor do mundo.",
      color: "text-green-400"
    },
    {
      icon: "Code2",
      title: "Open Source",
      description: "Acreditamos no poder do código aberto para democratizar a tecnologia.",
      color: "text-cyan-400"
    }
  ];

  const defaultStats = [
    { label: "Projetos Ativos", value: "50+", suffix: "" },
    { label: "Contribuidores", value: "200+", suffix: "" },
    { label: "Países Alcançados", value: "25+", suffix: "" },
    { label: "Stars no GitHub", value: "15k+", suffix: "" }
  ];

  // Use CMS data if available, otherwise use defaults
  const aboutSection = siteSettings?.aboutSection || {};
  const values = aboutSection.values || defaultValues;
  const stats = aboutSection.stats || defaultStats;
  const heading = aboutSection.heading || "Sobre a Monynha";
  const description = aboutSection.description || "Somos uma comunidade de desenvolvedores apaixonados por criar o futuro da web. Nascemos da necessidade de tecnologia mais inclusiva, acessível e extraordinária.";
  const missionStatement = aboutSection.missionStatement || "Democratizar a tecnologia através de soluções inovadoras e inclusivas, criando um futuro digital onde todas as pessoas possam prosperar. Utilizamos nosso conhecimento técnico como ferramenta de transformação social, sempre celebrando a diversidade e promovendo a igualdade.";

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-space-grotesk font-bold mb-6">
            {isLoading ? "Sobre a " : heading.split(" ").slice(0, -1).join(" ") + " "}
            <span className="gradient-text">
              {isLoading ? "Monynha" : heading.split(" ").slice(-1)}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {isLoading ? description : aboutSection.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat: any, index: number) => (
            <div 
              key={stat.label} 
              className="text-center glass-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl font-space-grotesk font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value: any, index: number) => {
            const IconComponent = iconMap[value.icon] || Heart;
            return (
              <div 
                key={value.title} 
                className="glass-card glow-hover group cursor-pointer"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-background/50 ${value.color} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-space-grotesk font-semibold mb-3 group-hover:gradient-text transition-all">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <div className="glass-card max-w-4xl mx-auto">
            <div className="text-6xl mb-6">🏳️‍🌈</div>
            <h3 className="text-3xl font-space-grotesk font-bold mb-6 gradient-text">
              Nossa Missão
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {missionStatement}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}