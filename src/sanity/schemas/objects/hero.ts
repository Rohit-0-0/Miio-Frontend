import { defineField, defineType } from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
    }),
    defineField({
      name: 'images',
      title: 'Hero Images',
      type: 'array',
      of: [{ type: 'customImage' }],
      description: 'Upload one image for a static display. Upload multiple images to automatically enable the carousel on the frontend.',
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'cta',
    })
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', media: 'images.0' },
    prepare({ title, subtitle, media }) {
      return { title: title || 'Hero', subtitle: subtitle || 'No subtitle', media }
    }
  }
})
