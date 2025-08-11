import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Users, 
  BookOpen,
  Menu,
  LogOut,
  Home
} from 'lucide-react';
import { toast } from 'sonner';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Blog Posts', href: '/admin/posts', icon: FileText },
  { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { name: 'Authors', href: '/admin/authors', icon: Users },
  { name: 'Categories', href: '/admin/categories', icon: BookOpen },
];

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex h-full flex-col ${mobile ? 'w-full' : 'w-64'} bg-card/50 backdrop-blur-xl border-r border-border/50`}>
      <div className="flex h-16 items-center px-6 border-b border-border/50">
        <h1 className="text-xl font-bold gradient-text">Admin Panel</h1>
      </div>
      
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent/50 ${
                isActive 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border/50 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
        >
          <Home className="h-4 w-4" />
          Back to Site
        </Link>
        
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:z-50">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="md:pl-64">
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="md:hidden" /> {/* Spacer for mobile menu button */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome back, {user.email}
                </span>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}