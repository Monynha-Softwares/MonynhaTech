import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useLanguage } from "@/hooks/useLanguage";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Link } from "react-router-dom";

export function Blog() {
  const { data: posts, isLoading, error, refetch } = useBlogPosts();
  const { language, t } = useLanguage();

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              {t("Blog & Insights", "Blog & Insights")}
            </h2>
          </div>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4">
          <ErrorState 
            message={t("Erro ao carregar posts", "Error loading posts")} 
            onRetry={() => refetch()}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            {t("Blog & Insights", "Blog & Insights")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t(
              "Pensamentos, tutoriais e descobertas sobre tecnologia e desenvolvimento",
              "Thoughts, tutorials and discoveries about technology and development"
            )}
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group relative p-6 rounded-2xl border bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-4">
                  {post.categories?.map((cat: any) => (
                    <Badge key={cat.category.id} variant="secondary" className="text-xs">
                      {language === 'pt' ? cat.category.title_pt : (cat.category.title_en || cat.category.title_pt)}
                    </Badge>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {language === 'pt' ? post.title_pt : (post.title_en || post.title_pt)}
                </h3>

                <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-3">
                  {((language === 'pt' ? post.content_pt : (post.content_en || post.content_pt)) || '')?.substring(0, 150)}...
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                  {post.author && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author.name}</span>
                    </div>
                  )}
                  {post.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.published_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>5 min</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="group-hover:text-primary transition-colors p-0 h-auto"
                  asChild
                >
                  <Link to={`/blog/${post.slug}`}>
                    {t("Ler mais", "Read more")}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            {t("Nenhum post encontrado", "No posts found")}
          </div>
        )}

        <div className="text-center">
          <Button size="lg" className="px-8" asChild>
            <Link to="/blog">
              {t("Ver Todos os Posts", "View All Posts")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
