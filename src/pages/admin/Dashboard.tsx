import { useProjects } from '@/hooks/useProjects';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useAuthors } from '@/hooks/useAuthors';
import { useCategories } from '@/hooks/useCategories';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { FileText, FolderOpen, Users, BookOpen, BarChart3, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useProjects();
  const { data: blogPosts, isLoading: blogLoading, error: blogError } = useBlogPosts();
  const { data: authors, isLoading: authorsLoading, error: authorsError } = useAuthors();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  if (projectsLoading || blogLoading || authorsLoading || categoriesLoading) {
    return <LoadingSkeleton />;
  }

  if (projectsError || blogError || authorsError || categoriesError) {
    return <ErrorState message="Failed to load dashboard data" />;
  }

  const stats = [
    {
      title: 'Total Projects',
      value: projects?.length || 0,
      icon: FolderOpen,
      description: 'Active projects',
      color: 'text-primary',
    },
    {
      title: 'Blog Posts',
      value: blogPosts?.length || 0,
      icon: FileText,
      description: 'Published articles',
      color: 'text-secondary',
    },
    {
      title: 'Authors',
      value: authors?.length || 0,
      icon: Users,
      description: 'Content creators',
      color: 'text-accent',
    },
    {
      title: 'Categories',
      value: categories?.length || 0,
      icon: BookOpen,
      description: 'Content categories',
      color: 'text-muted-foreground',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your content management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="glass-card glow-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Content Overview
            </CardTitle>
            <CardDescription>
              Summary of your content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Projects</span>
              <span className="text-sm text-muted-foreground">{projects?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Published Posts</span>
              <span className="text-sm text-muted-foreground">{blogPosts?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Authors</span>
              <span className="text-sm text-muted-foreground">{authors?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Categories</span>
              <span className="text-sm text-muted-foreground">{categories?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Use the navigation menu to:
            </div>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Create new blog posts</li>
              <li>• Manage projects</li>
              <li>• Add authors</li>
              <li>• Organize categories</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}