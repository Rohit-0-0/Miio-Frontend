import { defineField, defineType } from 'sanity'

export const staysPage = defineType({
  name: 'staysPage',
  title: 'Stays Page',
  type: 'document',
  fields: [
    defineField({
      name: 'general',
      title: 'General Settings',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'introText', title: 'Intro Text', type: 'text' }
      ]
    }),
    defineField({
      name: 'emptyState',
      title: 'Empty State',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'ctaText', title: 'CTA Text', type: 'string' },
        { name: 'ctaLink', title: 'CTA Link', type: 'string' }
      ]
    }),
    defineField({
      name: 'finalCta',
      title: 'Final CTA',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'buttonText', title: 'Button Text', type: 'string' },
        { name: 'buttonLink', title: 'Button Link', type: 'string' },
      ],
      preview: {
        select: { title: 'heading' },
        prepare({ title }) {
          return { title: title || 'Final CTA', subtitle: 'Section Content' }
        }
      }
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo'
    })
  ],
  preview: {
    prepare() {
      return {
        title: 'Stays Page Settings'
      }
    }
  }
})
