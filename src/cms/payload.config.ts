import { buildConfig } from 'payload/config';
import path from 'path';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { slateEditor } from '@payloadcms/richtext-slate';

// Import collections
import Projects from './collections/Projects';
import BlogPosts from './collections/BlogPosts';
import Authors from './collections/Authors';
import Pages from './collections/Pages';
import Categories from './collections/Categories';
import Media from './collections/Media';

// Import globals
import SiteSettings from './globals/SiteSettings';
import Navigation from './globals/Navigation';

export default buildConfig({
  admin: {
    user: 'users',
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [
    Projects,
    BlogPosts,
    Authors,
    Pages,
    Categories,
    Media,
    // Users collection is required for admin access
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'roles',
          type: 'select',
          hasMany: true,
          options: [
            {
              label: 'Admin',
              value: 'admin',
            },
            {
              label: 'Editor',
              value: 'editor',
            },
          ],
          defaultValue: ['editor'],
          required: true,
        },
      ],
    },
  ],
  globals: [
    SiteSettings,
    Navigation,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost/monynha-nexus-lab',
  }),
  cors: ['http://localhost:5173'],
  csrf: ['http://localhost:5173'],
});