// src/globals/SiteSettings.ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'siteDescription',
      type: 'textarea',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'contactEmail',
      type: 'email',
    },

    // ── Default SEO ──────────────────────────────────
    {
      name: 'defaultSeo',
      type: 'group',
      label: 'Default SEO',
      admin: {
        description: 'Fallback SEO jika halaman tidak mengisi SEO sendiri',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Default Meta Title',
          admin: {
            description: 'Biasanya nama site, e.g. "My Website"',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Default Meta Description',
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Default OG Image',
          admin: {
            description: 'Gambar default untuk social media preview (1200x630px)',
          },
        },
        {
          name: 'twitterHandle',
          type: 'text',
          label: 'Twitter Handle',
          admin: {
            description: 'e.g. "@mywebsite"',
          },
        },
        {
          name: 'googleAnalyticsId',
          type: 'text',
          label: 'Google Analytics ID',
          admin: {
            description: 'e.g. "G-XXXXXXXXXX"',
          },
        },
      ],
    },
  ],
}
