import { z } from 'zod';

export const linkKeys = ['github', 'demo', 'website', 'twitter', 'linkedin', 'youtube'] as const;
export type LinkKey = (typeof linkKeys)[number];

export const linkDefinitions: Array<{
  key: LinkKey;
  label: string;
  description?: string;
  placeholder?: string;
}> = [
  {
    key: 'github',
    label: 'GitHub',
    description: 'Link to the repository or organization.',
    placeholder: 'https://github.com/monynha',
  },
  {
    key: 'demo',
    label: 'Demo',
    description: 'Public demo or live preview.',
    placeholder: 'https://demo.example.com',
  },
  {
    key: 'website',
    label: 'Website',
    description: 'Official website or landing page.',
    placeholder: 'https://example.com',
  },
  {
    key: 'twitter',
    label: 'Twitter / X',
    description: 'Profile or announcement thread.',
    placeholder: 'https://twitter.com/monynha',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    description: 'Company or team profile.',
    placeholder: 'https://www.linkedin.com/company/monynha',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    description: 'Launch video or walkthrough.',
    placeholder: 'https://youtube.com/@monynha',
  },
];

const strictUrlSchema = z
  .string()
  .trim()
  .url({ message: 'Enter a valid URL including the protocol (e.g. https://example.com).' });

export const linkFieldSchema = z
  .object({
    enabled: z.boolean(),
    url: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.enabled) {
      if (!data.url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['url'],
          message: 'URL is required when this link is enabled.',
        });
        return;
      }
      const result = strictUrlSchema.safeParse(data.url);
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['url'],
          message: 'Enter a valid URL including https://',
        });
      }
    } else if (data.url.trim().length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['url'],
        message: 'Clear the URL or enable the toggle to include this link.',
      });
    }
  });

export const linksSchema = z.object(
  Object.fromEntries(linkKeys.map((key) => [key, linkFieldSchema])) as Record<LinkKey, typeof linkFieldSchema>
);

export type LinkFormValues = z.infer<typeof linksSchema>;

export const createDefaultLinkValues = (): LinkFormValues =>
  linkKeys.reduce((acc, key) => {
    acc[key] = { enabled: false, url: '' };
    return acc;
  }, {} as LinkFormValues);

export const parseLinksToForm = (links: Record<string, unknown> | null | undefined): LinkFormValues => {
  const defaults = createDefaultLinkValues();
  if (!links || typeof links !== 'object') {
    return defaults;
  }

  linkKeys.forEach((key) => {
    const raw = (links as Record<string, unknown>)[key];
    if (typeof raw === 'string' && raw.trim().length > 0) {
      defaults[key] = { enabled: true, url: raw };
    }
  });

  return defaults;
};

export const serializeLinks = (links: LinkFormValues): Partial<Record<LinkKey, string>> | null => {
  const result: Partial<Record<LinkKey, string>> = {};

  linkKeys.forEach((key) => {
    const value = links[key];
    if (value.enabled) {
      const trimmed = value.url.trim();
      if (trimmed) {
        result[key] = trimmed;
      }
    }
  });

  return Object.keys(result).length > 0 ? result : null;
};
