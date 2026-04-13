// src/blocks/ColumnBlocks.ts
import { Block } from 'payload'
import {
  HeroBlock,
  RichTextBlock,
  ImageBlock,
  VideoBlock,
  SliderBlock,
  TabBlock,
  AccordionBlock,
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
            AccordionBlock,
          ],
        },
        {
          name: 'width',
          type: 'select',
          options: ['1/4', '1/3', '1/2', '2/3', '3/4', 'full'],
        },
        {
          name: 'backgroundColor',
          type: 'text',
          label: 'Background Color',
          admin: {
            description: 'Hex color (e.g. #1f2937) or Tailwind class (e.g. bg-gray-900)',
          },
        },
        {
          name: 'textColor',
          type: 'select',
          label: 'Text Color',
          options: [
            { label: 'Default', value: '' },
            { label: 'White', value: 'text-white' },
            { label: 'Gray', value: 'text-gray-500' },
            { label: 'Dark', value: 'text-gray-900' },
          ],
        },
        {
          name: 'padding',
          type: 'select',
          label: 'Padding',
          options: [
            { label: 'None', value: '' },
            { label: 'Small', value: 'py-4' },
            { label: 'Medium', value: 'py-8' },
            { label: 'Large', value: 'py-12' },
          ],
        },
        {
          name: 'customClass',
          type: 'text',
          label: 'Custom CSS Class',
          admin: {
            description: 'Additional Tailwind classes',
          },
        },
      ],
    },
  ],
}
