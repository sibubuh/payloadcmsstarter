// src/blocks/FormBlocks.ts
import { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

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
      relationTo: 'forms' as 'forms',
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
      editor: lexicalEditor({}), // ← tambahkan editor lexical eksplisit
      admin: {
        condition: (_, siblingData) => siblingData?.enableIntro,
        description: 'Konten intro yang ditampilkan di atas form',
      },
    },
  ],
}
