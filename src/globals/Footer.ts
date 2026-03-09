// src/globals/Footer.ts
import { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  fields: [
    // ── Logo & Description ──────────────────────────
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Footer logo (optional, fallback ke logo SiteSettings)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Teks singkat di bawah logo',
      },
    },

    // ── Kolom Navigasi ──────────────────────────────
    {
      name: 'columns',
      type: 'array',
      label: 'Footer Columns',
      maxRows: 4,
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          label: 'Column Heading',
        },
        {
          name: 'navItems',
          type: 'array',
          label: 'Links',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
            },
            {
              name: 'newTab',
              type: 'checkbox',
              defaultValue: false,
              label: 'Open in new tab',
            },
          ],
        },
      ],
    },

    // ── Social Media ────────────────────────────────
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'WhatsApp', value: 'whatsapp' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },

    // ── Bottom Bar ──────────────────────────────────
    {
      name: 'bottomBar',
      type: 'group',
      label: 'Bottom Bar',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          defaultValue: `© ${new Date().getFullYear()} All rights reserved.`,
          admin: {
            description: 'Teks copyright di bagian paling bawah',
          },
        },
        {
          name: 'links',
          type: 'array',
          label: 'Bottom Links',
          admin: {
            description: 'Contoh: Privacy Policy, Terms of Service',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
