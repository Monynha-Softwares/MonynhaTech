import { Header } from "@ui/components/Header";
import { Hero } from "@ui/components/Hero";
import { About } from "@ui/components/About";
import { Projects } from "@ui/components/Projects";
import { Blog } from "@ui/components/Blog";
import { Footer } from "@ui/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const { t } = useLanguage();
  
  useSEO({
    title: 'Monynha Softwares - Futuristic Development',
    description: t(
      'Empresa líder em desenvolvimento de software especializada em aplicações web de ponta, soluções mobile e tecnologias futurísticas.',
      'Leading software development company specializing in cutting-edge web applications, mobile solutions, and futuristic technologies.'
    ),
    keywords: 'software development, desenvolvimento de software, web development, mobile apps, React, TypeScript, Supabase, futuristic technology',
    url: window.location.origin,
  });
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Projects />
        <Blog />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
