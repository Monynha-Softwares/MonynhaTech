import { GlobalConfig } from 'payload/types';

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteTitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        {
          name: 'github',
          type: 'text',
        },
        {
          name: 'twitter',
          type: 'text',
        },
        {
          name: 'linkedin',
          type: 'text',
        },
        {
          name: 'email',
          type: 'text',
        },
      ],
    },
    {
      name: 'heroSection',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          localized: true,
        },
        {
          name: 'subheading',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'primaryButtonText',
          type: 'text',
          localized: true,
        },
        {
          name: 'primaryButtonLink',
          type: 'text',
        },
        {
          name: 'secondaryButtonText',
          type: 'text',
          localized: true,
        },
        {
          name: 'secondaryButtonLink',
          type: 'text',
        },
        {
          name: 'techStack',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'aboutSection',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'stats',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
            },
            {
              name: 'value',
              type: 'text',
            },
            {
              name: 'suffix',
              type: 'text',
            },
          ],
        },
        {
          name: 'values',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'icon',
              type: 'select',
              options: [
                { label: 'Heart', value: 'Heart' },
                { label: 'Sparkles', value: 'Sparkles' },
                { label: 'Zap', value: 'Zap' },
                { label: 'Users', value: 'Users' },
                { label: 'Globe', value: 'Globe' },
                { label: 'Code2', value: 'Code2' },
              ],
            },
            {
              name: 'color',
              type: 'select',
              options: [
                { label: 'Pink', value: 'text-pink-400' },
                { label: 'Primary', value: 'text-primary' },
                { label: 'Secondary', value: 'text-secondary' },
                { label: 'Purple', value: 'text-purple-400' },
                { label: 'Green', value: 'text-green-400' },
                { label: 'Cyan', value: 'text-cyan-400' },
              ],
            },
          ],
        },
        {
          name: 'missionStatement',
          type: 'textarea',
          localized: true,
        },
      ],
    },
    {
      name: 'footerSection',
      type: 'group',
      fields: [
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'newsletterHeading',
          type: 'text',
          localized: true,
        },
        {
          name: 'newsletterDescription',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'newsletterButtonText',
          type: 'text',
          localized: true,
        },
        {
          name: 'copyrightText',
          type: 'text',
          localized: true,
        },
      ],
    },
  ],
};

export default SiteSettings;