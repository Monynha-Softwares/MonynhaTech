import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import { useLanguage } from "@/hooks/useLanguage";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  useSEO({
    title: t("404 - Página não encontrada", "404 - Page not found"),
    description: t("Página não encontrada", "Page not found"),
    url: window.location.origin + location.pathname,
  });

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <div
        className="absolute inset-0 bg-gradient-radial opacity-30"
        aria-hidden="true"
      />
      <Header />
      <main
        id="main-content"
        className="flex flex-1 items-center justify-center p-4"
      >
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold gradient-text">
            {t("404", "404")}
          </h1>
          <p className="text-xl text-foreground">
            {t("Página não encontrada", "Page not found")}
          </p>
          <Button asChild>
            <Link to="/">
              {t("Voltar ao início", "Back to home")}
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;

