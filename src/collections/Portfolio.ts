import type { CollectionConfig } from 'payload'
import {
  lexicalEditor,
  HeadingFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
  BlockquoteFeature,
  InlineCodeFeature,
  HorizontalRuleFeature,
  UploadFeature,
  BlocksFeature,
} from '@payloadcms/richtext-lexical'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
    group: 'Content',
    description: 'Manage your portfolio projects and case studies.',
    listSearchableFields: ['title', 'category', 'client'],
  },
  access: {
    read: ({ req }) => {
      // Public can read published items; admins can read all
      if (req.user) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  versions: {
    drafts: {
      autosave: {
        interval: 3000, // autosave every 3 seconds
      },
    },
    maxPerDoc: 10,
  },
  timestamps: true,
  fields: [
    // ── Hero / Identity ─────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      label: 'Project Title',
      required: true,
      admin: {
        placeholder: 'e.g. E-Commerce Redesign for Acme Corp',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (auto-generated or custom).',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return (data.title as string)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published At',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (_, siblingData) => siblingData?.status === 'published',
      },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) => {
            // Auto-set publish date on first publish
            if (siblingData?.status === 'published' && !value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },

    // ── Metadata ────────────────────────────────────────────────────
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      required: true,
      options: [
        { label: 'Web Design', value: 'web-design' },
        { label: 'Web Development', value: 'web-development' },
        { label: 'Mobile App', value: 'mobile-app' },
        { label: 'Branding & Identity', value: 'branding' },
        { label: 'UI/UX Design', value: 'ui-ux' },
        { label: 'E-Commerce', value: 'ecommerce' },
        { label: 'Motion & Animation', value: 'motion' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: {
        description: 'Add relevant tags for filtering and search.',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'client',
      type: 'text',
      label: 'Client Name',
      admin: {
        placeholder: 'e.g. Acme Corporation',
      },
    },
    {
      name: 'projectUrl',
      type: 'text',
      label: 'Live Project URL',
      admin: {
        placeholder: 'https://example.com',
      },
    },
    {
      name: 'repositoryUrl',
      type: 'text',
      label: 'Repository URL',
      admin: {
        placeholder: 'https://github.com/you/project',
      },
    },
    {
      name: 'year',
      type: 'number',
      label: 'Year Completed',
      min: 2000,
      max: new Date().getFullYear() + 1,
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Project',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this project in featured sections.',
      },
    },

    // ── Media ───────────────────────────────────────────────────────
    {
      name: 'coverImage',
      type: 'upload',
      label: 'Cover Image',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Primary image shown in listing views (recommended: 1200×800px).',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Project Gallery',
      admin: {
        description: 'Additional screenshots or images for the project.',
      },
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
          label: 'Caption',
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
          required: true,
        },
      ],
    },

    // ── Short Summary ────────────────────────────────────────────────
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt / Summary',
      maxLength: 300,
      admin: {
        description: 'Short description shown in card/listing views (max 300 chars).',
        rows: 3,
      },
    },

    // ── Rich Text Content (Lexical) ──────────────────────────────────
    {
      name: 'content',
      type: 'richText',
      label: 'Project Description',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({
            enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
          }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          StrikethroughFeature(),
          InlineCodeFeature(),
          BlockquoteFeature(),
          HorizontalRuleFeature(),
          OrderedListFeature(),
          UnorderedListFeature(),
          LinkFeature({
            enabledCollections: ['portfolio', 'pages'],
          }),
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: 'caption',
                    type: 'text',
                    label: 'Caption',
                  },
                  {
                    name: 'alignment',
                    type: 'select',
                    label: 'Alignment',
                    options: [
                      { label: 'Left', value: 'left' },
                      { label: 'Center', value: 'center' },
                      { label: 'Right', value: 'right' },
                      { label: 'Full Width', value: 'full' },
                    ],
                    defaultValue: 'center',
                  },
                ],
              },
            },
          }),
          BlocksFeature({
            blocks: [
              // Callout / highlight block
              {
                slug: 'callout',
                labels: { singular: 'Callout', plural: 'Callouts' },
                fields: [
                  {
                    name: 'type',
                    type: 'select',
                    defaultValue: 'info',
                    options: [
                      { label: 'Info', value: 'info' },
                      { label: 'Warning', value: 'warning' },
                      { label: 'Success', value: 'success' },
                      { label: 'Error', value: 'error' },
                    ],
                  },
                  {
                    name: 'message',
                    type: 'textarea',
                    required: true,
                  },
                ],
              },
              // Key stat block
              {
                slug: 'statBlock',
                labels: { singular: 'Stat Block', plural: 'Stat Blocks' },
                fields: [
                  {
                    name: 'stats',
                    type: 'array',
                    required: true,
                    fields: [
                      { name: 'label', type: 'text', required: true },
                      { name: 'value', type: 'text', required: true },
                    ],
                  },
                ],
              },
              // Code snippet block
              {
                slug: 'codeSnippet',
                labels: { singular: 'Code Snippet', plural: 'Code Snippets' },
                fields: [
                  {
                    name: 'language',
                    type: 'select',
                    defaultValue: 'typescript',
                    options: [
                      { label: 'TypeScript', value: 'typescript' },
                      { label: 'JavaScript', value: 'javascript' },
                      { label: 'CSS', value: 'css' },
                      { label: 'HTML', value: 'html' },
                      { label: 'Shell', value: 'shell' },
                      { label: 'JSON', value: 'json' },
                    ],
                  },
                  {
                    name: 'code',
                    type: 'code',
                    required: true,
                    admin: { language: 'typescript' },
                  },
                  {
                    name: 'caption',
                    type: 'text',
                  },
                ],
              },
            ],
          }),
        ],
      }),
    },

    // ── Technical Details ────────────────────────────────────────────
    {
      name: 'techStack',
      type: 'array',
      label: 'Tech Stack / Tools',
      admin: {
        description: 'Technologies, frameworks, or tools used in this project.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Technology Name',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          label: 'Role / Purpose',
          admin: {
            placeholder: 'e.g. Frontend framework',
          },
        },
      ],
    },

    // ── Testimonial ──────────────────────────────────────────────────
    {
      name: 'testimonial',
      type: 'group',
      label: 'Client Testimonial',
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          label: 'Quote',
        },
        {
          name: 'author',
          type: 'text',
          label: 'Author Name',
        },
        {
          name: 'authorTitle',
          type: 'text',
          label: 'Author Title / Company',
        },
        {
          name: 'avatar',
          type: 'upload',
          label: 'Author Avatar',
          relationTo: 'media',
        },
      ],
    },

    // ── SEO ──────────────────────────────────────────────────────────
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
          maxLength: 60,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          maxLength: 160,
          admin: { rows: 3 },
        },
        {
          name: 'ogImage',
          type: 'upload',
          label: 'OG / Social Share Image',
          relationTo: 'media',
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        // Keep slug clean
        if (data.slug) {
          data.slug = (data.slug as string)
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
}
