import { Heart, Sparkles, Zap, Users, Globe, Code2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const values = [
  {
    icon: Heart,
    title: {
      pt: "Inclusão & Diversidade",
      en: "Inclusion & Diversity"
    },
    description: {
      pt: "Criamos tecnologia para todas as pessoas, celebrando a diversidade como nossa maior força.",
      en: "We create technology for everyone, celebrating diversity as our greatest strength."
    },
    color: "text-pink-400"
  },
  {
    icon: Sparkles,
    title: {
      pt: "Inovação Constante",
      en: "Constant Innovation"
    },
    description: {
      pt: "Exploramos tecnologias emergentes para criar soluções que transcendem o presente.",
      en: "We explore emerging technologies to craft solutions that transcend the present."
    },
    color: "text-primary"
  },
  {
    icon: Zap,
    title: {
      pt: "Performance Extrema",
      en: "Extreme Performance"
    },
    description: {
      pt: "Otimizamos cada linha de código para entregar experiências instantâneas e fluidas.",
      en: "We optimize every line of code to deliver instant and smooth experiences."
    },
    color: "text-secondary"
  },
  {
    icon: Users,
    title: {
      pt: "Comunidade Ativa",
      en: "Active Community"
    },
    description: {
      pt: "Construímos juntos, compartilhamos conhecimento e crescemos como coletivo.",
      en: "We build together, share knowledge, and grow as a collective."
    },
    color: "text-purple-400"
  },
  {
    icon: Globe,
    title: {
      pt: "Impacto Global",
      en: "Global Impact"
    },
    description: {
      pt: "Nossas soluções conectam culturas e transformam vidas ao redor do mundo.",
      en: "Our solutions connect cultures and transform lives around the world."
    },
    color: "text-green-400"
  },
  {
    icon: Code2,
    title: {
      pt: "Open Source",
      en: "Open Source"
    },
    description: {
      pt: "Acreditamos no poder do código aberto para democratizar a tecnologia.",
      en: "We believe in the power of open source to democratize technology."
    },
    color: "text-cyan-400"
  }
];

const stats = [
  { label: { pt: "Projetos Ativos", en: "Active Projects" }, value: "50+", suffix: "" },
  { label: { pt: "Contribuidores", en: "Contributors" }, value: "200+", suffix: "" },
  { label: { pt: "Países Alcançados", en: "Countries Reached" }, value: "25+", suffix: "" },
  { label: { pt: "Stars no GitHub", en: "GitHub Stars" }, value: "15k+", suffix: "" }
];

export function About() {
  const { t } = useLanguage();
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-space-grotesk font-bold mb-6">
            {t("Sobre a", "About")}{" "}
            <span className="gradient-text">Monynha</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {t(
              "Somos uma comunidade de desenvolvedores apaixonados por criar o futuro da web. Nascemos da necessidade de tecnologia mais inclusiva, acessível e extraordinária.",
              "We are a community of developers passionate about building the future of the web. We were born from the need for more inclusive, accessible, and extraordinary technology."
            )}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={stat.label.pt}
              className="text-center glass-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl font-space-grotesk font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">
                {t(stat.label.pt, stat.label.en)}
              </div>
            </div>
          ))}
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div
                key={value.title.pt}
                className="glass-card glow-hover group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-background/50 ${value.color} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-space-grotesk font-semibold mb-3 group-hover:gradient-text transition-all">
                      {t(value.title.pt, value.title.en)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(value.description.pt, value.description.en)}
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
              {t("Nossa Missão", "Our Mission")}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t(
                "Democratizar a tecnologia através de soluções inovadoras e inclusivas, criando um futuro digital onde todas as pessoas possam prosperar. Utilizamos nosso conhecimento técnico como ferramenta de transformação social, sempre celebrando a diversidade e promovendo a igualdade.",
                "Democratize technology through innovative and inclusive solutions, creating a digital future where everyone can thrive. We use our technical knowledge as a tool for social transformation, always celebrating diversity and promoting equality."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}