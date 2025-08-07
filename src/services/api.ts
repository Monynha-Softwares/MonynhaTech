import axios from 'axios';

// Create an axios instance for the Payload CMS API
const payloadAPI = axios.create({
  baseURL: import.meta.env.VITE_PAYLOAD_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await payloadAPI.get('/projects');
    return response.data;
  },
  getBySlug: async (slug: string) => {
    const response = await payloadAPI.get(`/projects?where[slug][equals]=${slug}`);
    return response.data.docs[0];
  },
};

// Blog Posts API
export const blogPostsAPI = {
  getAll: async (options = {}) => {
    const response = await payloadAPI.get('/blog-posts', { params: options });
    return response.data;
  },
  getBySlug: async (slug: string) => {
    const response = await payloadAPI.get(`/blog-posts?where[slug][equals]=${slug}`);
    return response.data.docs[0];
  },
  getByCategory: async (categorySlug: string) => {
    const response = await payloadAPI.get(`/blog-posts?where[categories.slug][equals]=${categorySlug}`);
    return response.data;
  },
};

// Authors API
export const authorsAPI = {
  getAll: async () => {
    const response = await payloadAPI.get('/authors');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await payloadAPI.get(`/authors/${id}`);
    return response.data;
  },
};

// Pages API
export const pagesAPI = {
  getBySlug: async (slug: string) => {
    const response = await payloadAPI.get(`/pages?where[slug][equals]=${slug}`);
    return response.data.docs[0];
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await payloadAPI.get('/categories');
    return response.data;
  },
  getBySlug: async (slug: string) => {
    const response = await payloadAPI.get(`/categories?where[slug][equals]=${slug}`);
    return response.data.docs[0];
  },
};

// Global Settings API
export const settingsAPI = {
  getSiteSettings: async () => {
    const response = await payloadAPI.get('/globals/site-settings');
    return response.data;
  },
  getNavigation: async () => {
    const response = await payloadAPI.get('/globals/navigation');
    return response.data;
  },
};

export default {
  projects: projectsAPI,
  blogPosts: blogPostsAPI,
  authors: authorsAPI,
  pages: pagesAPI,
  categories: categoriesAPI,
  settings: settingsAPI,
};