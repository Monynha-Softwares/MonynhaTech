import { useState } from 'react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useAuthors } from '@/hooks/useAuthors';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { Plus, Edit, Trash2, Eye, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPosts() {
  const { data: posts, isLoading, error, refetch } = useBlogPosts();
  const { data: authors } = useAuthors();
  const { data: categories } = useCategories();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message="Failed to load blog posts" onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Button className="glow-hover">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid gap-6">
        {posts?.map((post) => {
          const author = authors?.find(a => a.id === post.author_id);
          const postCategories = post.categories?.map(pc => pc.category) || [];
          
          return (
            <Card key={post.id} className="glass-card glow-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-space-grotesk">
                      {post.title_pt}
                    </CardTitle>
                    {post.title_en && (
                      <CardDescription className="text-sm italic">
                        EN: {post.title_en}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {author && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {author.name.charAt(0)}
                        </span>
                      </div>
                      <span>{author.name}</span>
                    </div>
                  )}
                  
                  {post.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(post.published_at), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                
                {postCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {postCategories.map((category) => (
                      <Badge key={category.id} variant="outline" className="text-xs">
                        {category.title_pt}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {post.content_pt && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.content_pt.substring(0, 200)}...
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
        
        {!posts?.length && (
          <Card className="glass-card text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Start creating content for your blog
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}