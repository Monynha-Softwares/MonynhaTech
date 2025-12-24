import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useProjects } from '@/hooks/useProjects';
import { useLanguage } from '@/hooks/useLanguage';
import { useSEO } from '@/hooks/useSEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { Link } from 'react-router-dom';

export default function ProjectsIndex() {
  const { t } = useLanguage();
  const { data: projects, isLoading, error } = useProjects();

  useSEO({
    title: `${t('Projetos', 'Projects')} | Monynha Softwares`,
    description: t('Explore nosso portfólio de projetos.', 'Explore our project portfolio.'),
    url: `${window.location.origin}/projects`,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold gradient-text mb-8">{t('Projetos', 'Projects')}</h1>
        {isLoading && <LoadingSkeleton />}
        {error && <ErrorState message={t('Erro ao carregar projetos.', 'Failed to load projects.')} />}
        {!isLoading && projects && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <Card key={project.id} className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl">
                    <Link to={`/projects/${project.slug}`} className="hover:text-primary">{project.name_pt || project.name_en}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{project.description_pt || project.description_en}</p>
                  <Button variant="outline" size="sm" asChild className="mt-4"><Link to={`/projects/${project.slug}`}>{t('Ver detalhes', 'View details')}</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
