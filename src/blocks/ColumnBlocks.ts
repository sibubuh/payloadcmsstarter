// blocks/ColumnsBlock.ts
import { Block } from 'payload'
import { HeroBlock, RichTextBlock, ImageBlock, VideoBlock } from './ContentBlocks'

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
          name: 'content', // <-- nested blocks field
          type: 'blocks',
          blocks: [HeroBlock, RichTextBlock, ImageBlock, VideoBlock],
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
