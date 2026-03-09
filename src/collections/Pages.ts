// src/collections/Pages.ts
import { CollectionConfig } from 'payload'
import { HeroBlock, ImageBlock, VideoBlock, RichTextBlock } from '../blocks/ContentBlocks' // Import block baru
import { ColumnsBlock } from '@/blocks/ColumnBlocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, ImageBlock, VideoBlock, RichTextBlock, ColumnsBlock], // Tambahkan di sini
    },
  ],
}
