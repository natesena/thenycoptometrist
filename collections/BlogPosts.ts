import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedDate', '_status'],
    description: 'Blog posts for the website',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 255,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from title if empty)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 500,
      admin: {
        description: 'Brief summary shown in blog listing (max 500 characters)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Main blog post content',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'When this post should be published',
      },
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      defaultValue: 'Dr. Joanna Latek',
    },
    {
      name: 'metaDescription',
      type: 'text',
      maxLength: 160,
      admin: {
        description: 'SEO meta description (max 160 characters)',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main image for the blog post',
      },
    },
    // Tags field for content performance tracking
    // Reference: AI Blog Generation System Plan
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Eye Exams', value: 'eye-exams' },
        { label: 'Preventive Care', value: 'preventive-care' },
        { label: 'Early Detection', value: 'early-detection' },
        { label: 'Contact Lenses', value: 'contact-lenses' },
        { label: 'Lens Care', value: 'lens-care' },
        { label: 'Specialty Lenses', value: 'specialty-lenses' },
        { label: 'Pediatrics', value: 'pediatrics' },
        { label: 'Children', value: 'children' },
        { label: 'School Vision', value: 'school-vision' },
        { label: 'Trending', value: 'trending' },
        { label: 'Eye Health Tips', value: 'eye-health-tips' },
        { label: 'Dry Eyes', value: 'dry-eyes' },
        { label: 'Treatments', value: 'treatments' },
        { label: 'Prevention', value: 'prevention' },
        { label: 'Eyeglasses', value: 'eyeglasses' },
        { label: 'Vision Correction', value: 'vision-correction' },
        { label: 'Prescriptions', value: 'prescriptions' },
        { label: 'Myopia', value: 'myopia' },
        { label: 'Progression Control', value: 'progression-control' },
        { label: 'Eye Disease', value: 'eye-disease' },
        { label: 'Glaucoma', value: 'glaucoma' },
        { label: 'Macular Degeneration', value: 'macular-degeneration' },
        { label: 'Cataracts', value: 'cataracts' },
        { label: 'Vision Therapy', value: 'vision-therapy' },
        { label: 'Exercises', value: 'exercises' },
        { label: 'Binocular Vision', value: 'binocular-vision' },
      ],
      admin: {
        description: 'Tags for content categorization and performance tracking',
      },
    },
    // Publish token for one-click email publishing
    // Reference: AI Blog Generation System Plan - Email Publish Flow
    {
      name: 'publishToken',
      type: 'text',
      admin: {
        hidden: true,
        description: 'Token for secure one-click publishing from email',
      },
    },
    // Instagram content fields for AI-generated social media
    // Reference: AI Blog Generation System Plan
    {
      name: 'instagramCaption',
      type: 'textarea',
      admin: {
        description: 'Instagram caption for this post (AI-generated)',
      },
    },
    {
      name: 'instagramCarouselSlides',
      type: 'array',
      admin: {
        description: 'Instagram carousel slide content (AI-generated)',
      },
      fields: [
        {
          name: 'slideContent',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'featuredImageSuggestion',
      type: 'textarea',
      admin: {
        description: 'AI-suggested description for featured image',
      },
    },
    {
      name: 'bibliography',
      type: 'textarea',
      admin: {
        description: 'MLA bibliography for citations (AI-generated)',
      },
    },
  ],
}
