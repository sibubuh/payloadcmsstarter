// src/collections/Pages.ts
import { CollectionConfig } from 'payload'
import {
  HeroBlock,
  ImageBlock,
  VideoBlock,
  RichTextBlock,
  SliderBlock,
} from '../blocks/ContentBlocks'
import { ColumnsBlock } from '@/blocks/ColumnBlocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier, e.g. "about-us"',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (!value && siblingData?.title) {
              return siblingData.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '')
            }
            return value
          },
        ],
      },
    },

    // ── SEO ─────────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'Optimal: 50–60 karakter',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'Optimal: 150–160 karakter',
          },
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG Image',
          admin: {
            description: 'Gambar untuk social media preview (1200x630px)',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Keywords',
          admin: {
            description: 'Pisahkan dengan koma, e.g. "keyword1, keyword2"',
          },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          label: 'No Index',
          defaultValue: false,
          admin: {
            description: 'Centang untuk menyembunyikan halaman dari search engine',
          },
        },
        {
          name: 'canonicalUrl',
          type: 'text',
          label: 'Canonical URL',
          admin: {
            description: 'Opsional, isi jika halaman ini duplikat dari URL lain',
          },
        },
      ],
    },

    // ── Layout Blocks ────────────────────────────────
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, ImageBlock, VideoBlock, RichTextBlock, ColumnsBlock, SliderBlock],
    },
  ],
}
