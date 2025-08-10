import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import BlogPosts from "./pages/admin/BlogPosts";
import NewPost from "./pages/admin/posts/NewPost";
import EditPost from "./pages/admin/posts/EditPost";
import Projects from "./pages/admin/Projects";
import Authors from "./pages/admin/Authors";
import Categories from "./pages/admin/Categories";
import SearchResults from "./pages/SearchResults";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import ProjectsIndex from "./pages/ProjectsIndex";
import ProjectDetail from "./pages/ProjectDetail";
import DocsIndex from "./pages/DocsIndex";
import DocPage from "./pages/DocPage";
import ErrorBoundary from "./pages/ErrorBoundary";
import ServerError from "./pages/ServerError";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/projects" element={<ProjectsIndex />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/docs" element={<DocsIndex />} />
                <Route path="/docs/:slug" element={<DocPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<AdminLayout />}> 
                  <Route index element={<Dashboard />} />
                  <Route path="posts">
                    <Route index element={<BlogPosts />} />
                    <Route path="new" element={<NewPost />} />
                    <Route path=":id/edit" element={<EditPost />} />
                  </Route>
                  <Route path="projects" element={<Projects />} />
                  <Route path="authors" element={<Authors />} />
                  <Route path="categories" element={<Categories />} />
                </Route>
                <Route path="/500" element={<ServerError />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
