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
    useAsTitle: 'title', // ← tampilkan title di admin panel
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
        position: 'sidebar', // ← tampil di sidebar admin
        description: 'URL-friendly identifier, e.g. "about-us"',
      },
      hooks: {
        // ← auto-generate slug dari title
        beforeValidate: [
          ({ value, siblingData }) => {
            if (!value && siblingData?.title) {
              return siblingData.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '') // hapus karakter spesial
                .replace(/[\s_-]+/g, '-') // spasi jadi dash
                .replace(/^-+|-+$/g, '') // hapus dash di awal/akhir
            }
            return value
          },
        ],
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, ImageBlock, VideoBlock, RichTextBlock, ColumnsBlock, SliderBlock],
    },
  ],
}
