import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Categories() {
  const { data: categories, isLoading, error, refetch } = useCategories();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message="Failed to load categories" onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Categories</h1>
          <p className="text-muted-foreground">Organize your content with categories</p>
        </div>
        <Button className="glow-hover" asChild>
          <Link to="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <Card key={category.id} className="glass-card glow-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="font-space-grotesk">
                    {category.title_pt}
                  </CardTitle>
                  {category.title_en && (
                    <CardDescription className="text-sm italic">
                      EN: {category.title_en}
                    </CardDescription>
                  )}
                  <Badge variant="outline" className="text-xs w-fit">
                    {category.slug}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/admin/categories/${category.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {category.description_pt && (
                <p className="text-sm text-muted-foreground">
                  {category.description_pt}
                </p>
              )}
              
              {category.description_en && (
                <p className="text-xs text-muted-foreground italic">
                  EN: {category.description_en}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        
        {!categories?.length && (
          <Card className="glass-card text-center py-12 md:col-span-2 lg:col-span-3">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
              <p className="text-muted-foreground mb-4">
                Create categories to organize your content
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Category
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}