// src/blocks/FormBlocks.ts
import { Block } from 'payload'

export const FormBlock: Block = {
  slug: 'formBlock',
  labels: {
    singular: 'Form Block',
    plural: 'Form Blocks',
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms' as 'forms', // akan valid setelah generate:types
      required: true,
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
      defaultValue: false,
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, siblingData) => siblingData?.enableIntro,
      },
    },
  ],
}
