// src/blocks/ColumnBlocks.ts
import { Block } from 'payload'
import {
  HeroBlock,
  RichTextBlock,
  ImageBlock,
  VideoBlock,
  SliderBlock,
  TabBlock,
} from './ContentBlocks' // ← tambah TabBlock
import { FormBlock } from './FormBlocks'

export const ColumnsBlock: Block = {
  slug: 'columns',
  labels: { singular: 'Columns Layout', plural: 'Columns Layouts' },
  fields: [
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'content',
          type: 'blocks',
          blocks: [
            HeroBlock,
            RichTextBlock,
            ImageBlock,
            VideoBlock,
            FormBlock,
            SliderBlock,
            TabBlock,
          ], // ← tambah TabBlock
        },
        {
          name: 'width',
          type: 'select',
          options: ['1/4', '1/3', '1/2', '2/3', '3/4', 'full'],
        },
      ],
    },
  ],
}
