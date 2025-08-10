import { useEffect, useMemo } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  siteName?: string;
}

const DEFAULT_SEO = {
  title: 'Monynha Softwares - Futuristic Development',
  description: 'Leading software development company specializing in cutting-edge web applications, mobile solutions, and futuristic technologies.',
  keywords: 'software development, web development, mobile apps, React, TypeScript, Supabase, futuristic technology',
  siteName: 'Monynha Softwares',
  type: 'website' as const,
};

export function useSEO(seoProps: SEOProps = {}) {
  const seo = useMemo(() => ({ ...DEFAULT_SEO, ...seoProps }), [seoProps]);

  useEffect(() => {
    // Update document title
    document.title = seo.title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', seo.description);
    updateMetaTag('keywords', seo.keywords);

    // Open Graph tags
    updateMetaTag('og:title', seo.title, true);
    updateMetaTag('og:description', seo.description, true);
    updateMetaTag('og:type', seo.type, true);
    updateMetaTag('og:site_name', seo.siteName, true);
    
    if (seo.url) {
      updateMetaTag('og:url', seo.url, true);
    }
    
    if (seo.image) {
      updateMetaTag('og:image', seo.image, true);
    }

    // Article specific tags
    if (seo.type === 'article') {
      if (seo.publishedTime) {
        updateMetaTag('article:published_time', seo.publishedTime, true);
      }
      if (seo.modifiedTime) {
        updateMetaTag('article:modified_time', seo.modifiedTime, true);
      }
      if (seo.author) {
        updateMetaTag('article:author', seo.author, true);
      }
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', seo.image ? 'summary_large_image' : 'summary');
    updateMetaTag('twitter:title', seo.title);
    updateMetaTag('twitter:description', seo.description);
    
    if (seo.image) {
      updateMetaTag('twitter:image', seo.image);
    }

    // Canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalElement && seo.url) {
      canonicalElement = document.createElement('link');
      canonicalElement.rel = 'canonical';
      document.head.appendChild(canonicalElement);
    }
    if (canonicalElement && seo.url) {
      canonicalElement.href = seo.url;
    }

  }, [seo]);

  return seo;
}

export function generateSEOForBlogPost(post: any, author?: any) {
  return {
    title: `${post.title_pt} | Monynha Softwares Blog`,
    description: post.content_pt?.substring(0, 160) || post.title_pt,
    keywords: `blog, ${post.title_pt}, software development`,
    type: 'article' as const,
    publishedTime: post.published_at,
    modifiedTime: post.updated_at,
    author: author?.name,
    url: `${window.location.origin}/blog/${post.slug}`,
  };
}

export function generateSEOForProject(project: any) {
  return {
    title: `${project.name_pt} | Monynha Softwares Portfolio`,
    description: project.description_pt || `Project: ${project.name_pt}`,
    keywords: `project, portfolio, ${project.name_pt}, software development`,
    url: `${window.location.origin}/projects/${project.slug}`,
  };
}
