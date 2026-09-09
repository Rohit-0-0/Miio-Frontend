import { defineField, defineType } from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
      description: 'Display date, e.g. July 2026',
    }),
    defineField({
      name: 'location',
      title: 'Location (optional)',
      type: 'string',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'e.g. from Airbnb',
    }),
    defineField({
      name: 'sourceLogo',
      title: 'Source Logo',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'author',
      subtitle: 'quote',
      media: 'sourceLogo',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Review',
        subtitle: subtitle
          ? subtitle.length > 60
            ? subtitle.slice(0, 60) + '...'
            : subtitle
          : '',
        media,
      }
    },
  },
})