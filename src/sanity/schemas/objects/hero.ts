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
    }),
    defineField({
      name: 'searchWidgetLabels',
      title: 'Search Widget Labels',
      type: 'object',
      fields: [
        { name: 'whereTo', title: 'Where To Label', type: 'string', initialValue: 'WHERE TO?' },
        { name: 'chooseLocation', title: 'Choose Location Placeholder', type: 'string', initialValue: 'Choose location' },
        { name: 'dates', title: 'Dates Label', type: 'string', initialValue: 'DATES' },
        { name: 'addDates', title: 'Add Dates Placeholder', type: 'string', initialValue: 'Add dates' },
        { name: 'guests', title: 'Guests Label', type: 'string', initialValue: 'GUESTS' },
        { name: 'addGuests', title: 'Add Guests Placeholder', type: 'string', initialValue: '2 adults' },
        { name: 'searchButton', title: 'Search Button Text', type: 'string', initialValue: 'Search' }
      ]
    })
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', media: 'images.0' },
    prepare({ title, subtitle, media }) {
      return { title: title || 'Hero', subtitle: subtitle || 'No subtitle', media }
    }
  }
})
