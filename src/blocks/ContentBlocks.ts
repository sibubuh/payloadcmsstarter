// src/blocks/ContentBlocks.ts
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  fields: [
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor({}),
    },
  ],
}

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'text' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
  ],
}

export const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Full Width', value: 'full' },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}

export const VideoBlock: Block = {
  slug: 'video',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'upload',
      options: [
        { label: 'File Upload', value: 'upload' },
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
      ],
    },
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'upload',
      },
    },
    {
      name: 'embedUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => ['youtube', 'vimeo'].includes(siblingData?.source),
        description: 'Paste the full video URL (e.g. https://youtube.com/watch?v=...)',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'muted',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: '16/9',
      options: [
        { label: '16:9 (Widescreen)', value: '16/9' },
        { label: '4:3 (Standard)', value: '4/3' },
        { label: '1:1 (Square)', value: '1/1' },
        { label: '9:16 (Vertical)', value: '9/16' },
      ],
    },
  ],
}

// ← SliderBlock baru
export const SliderBlock: Block = {
  slug: 'slider',
  labels: { singular: 'Image Slider', plural: 'Image Sliders' },
  fields: [
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
        {
          name: 'heading',
          type: 'text',
          admin: {
            description: 'Optional overlay heading on slide',
          },
        },
        {
          name: 'subheading',
          type: 'text',
          admin: {
            description: 'Optional overlay subheading on slide',
          },
        },
        {
          name: 'link',
          type: 'group',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.enabled,
              },
            },
            {
              name: 'label',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.enabled,
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                condition: (_, siblingData) => siblingData?.enabled,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'autoplaySpeed',
      type: 'number',
      label: 'Autoplay Speed (ms)',
      defaultValue: 4000,
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.autoplay,
        description: 'Duration per slide in milliseconds',
      },
    },
    {
      name: 'showDots',
      type: 'checkbox',
      label: 'Show Dots Navigation',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showArrows',
      type: 'checkbox',
      label: 'Show Arrow Navigation',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'height',
      type: 'select',
      label: 'Slider Height',
      defaultValue: 'medium',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Small (300px)', value: 'small' },
        { label: 'Medium (500px)', value: 'medium' },
        { label: 'Large (700px)', value: 'large' },
        { label: 'Full Screen', value: 'screen' },
      ],
    },
  ],
}
