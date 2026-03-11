import { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'jobType', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Job Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier, e.g. "senior-engineer"',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (!value && siblingData?.title) {
              return siblingData.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'department',
      type: 'select',
      required: true,
      options: [
        { label: 'Engineering', value: 'engineering' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Sales', value: 'sales' },
        { label: 'Human Resources', value: 'hr' },
        { label: 'Finance', value: 'finance' },
        { label: 'Operations', value: 'operations' },
        { label: 'Design', value: 'design' },
        { label: 'Product', value: 'product' },
        { label: 'Customer Success', value: 'customer-success' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'jobType',
      type: 'select',
      required: true,
      options: [
        { label: 'Full-time', value: 'full-time' },
        { label: 'Part-time', value: 'part-time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Internship', value: 'internship' },
        { label: 'Freelance', value: 'freelance' },
      ],
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      admin: {
        description: 'e.g. "Jakarta, Indonesia"',
      },
    },
    {
      name: 'remoteType',
      type: 'select',
      label: 'Work Type',
      options: [
        { label: 'On-site', value: 'onsite' },
        { label: 'Remote', value: 'remote' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
      defaultValue: 'onsite',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Job Description',
      editor: lexicalEditor({}),
    },
    {
      name: 'requirements',
      type: 'richText',
      label: 'Requirements',
      editor: lexicalEditor({}),
    },
    {
      name: 'benefits',
      type: 'richText',
      label: 'Benefits',
      editor: lexicalEditor({}),
    },
    {
      name: 'salaryRange',
      type: 'group',
      label: 'Salary Range',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'min',
          type: 'number',
          label: 'Minimum',
        },
        {
          name: 'max',
          type: 'number',
          label: 'Maximum',
        },
        {
          name: 'currency',
          type: 'select',
          label: 'Currency',
          defaultValue: 'IDR',
          options: [
            { label: 'IDR', value: 'IDR' },
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'SGD', value: 'SGD' },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Closed', value: 'closed' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage',
      },
    },
    {
      name: 'applyForm',
      type: 'relationship',
      label: 'Application Form',
      relationTo: 'forms',
      admin: {
        position: 'sidebar',
        description: 'Select form for job application',
      },
    },
  ],
  timestamps: true,
}
