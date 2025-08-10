import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useSEO, generateSEOForProject } from '@/hooks/useSEO';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error || !data) {
        setError(error?.message || 'Not found');
      } else {
        setProject(data);
      }
      setLoading(false);
    }
    if (slug) fetchProject();
  }, [slug]);

  useSEO(project ? generateSEOForProject(project) : {
    title: `${t('Carregando...', 'Loading...')} | Monynha Softwares`,
    description: t('Carregando projeto', 'Loading project'),
    url: `${window.location.origin}/projects/${slug}`,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container mx-auto px-6 py-24">
        {loading && <LoadingSkeleton />}
        {error && <ErrorState message={t('Projeto não encontrado.', 'Project not found.')} />}
        {!loading && project && (
          <article>
            <h1 className="text-4xl font-bold gradient-text mb-4">{language === 'pt' ? project.name_pt : (project.name_en || project.name_pt)}</h1>
            <Card className="glass-card">
              <CardContent className="prose prose-invert max-w-none">
                <p>{language === 'pt' ? project.description_pt : (project.description_en || project.description_pt)}</p>
              </CardContent>
            </Card>
            <div className="mt-8">
              <Button variant="outline" asChild>
                <Link to="/projects">{t('Voltar aos projetos', 'Back to projects')}</Link>
              </Button>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
