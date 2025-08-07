import { CollectionConfig } from 'payload/types';

const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Em desenvolvimento',
          value: 'em-desenvolvimento',
        },
        {
          label: 'Beta',
          value: 'beta',
        },
        {
          label: 'Stable',
          value: 'stable',
        },
      ],
      defaultValue: 'em-desenvolvimento',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tech',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'stars',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'contributors',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'gradient',
      type: 'select',
      options: [
        {
          label: 'Primary',
          value: 'from-primary to-primary-glow',
        },
        {
          label: 'Secondary',
          value: 'from-secondary to-secondary-glow',
        },
        {
          label: 'Purple to Pink',
          value: 'from-purple-500 to-pink-500',
        },
        {
          label: 'Blue to Cyan',
          value: 'from-blue-500 to-cyan-500',
        },
        {
          label: 'Green to Teal',
          value: 'from-green-500 to-teal-500',
        },
      ],
      defaultValue: 'from-primary to-primary-glow',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'githubUrl',
      label: 'GitHub URL',
      type: 'text',
    },
    {
      name: 'demoUrl',
      label: 'Demo URL',
      type: 'text',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
};

export default Projects;