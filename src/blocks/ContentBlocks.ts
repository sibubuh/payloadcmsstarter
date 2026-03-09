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

// blocks/VideoBlock.ts

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
    // Self-hosted video
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'upload',
      },
    },
    // Embed URL (YouTube / Vimeo)
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
