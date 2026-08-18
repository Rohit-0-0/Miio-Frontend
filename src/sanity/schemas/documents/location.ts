import { defineField, defineType } from 'sanity'

export const location = defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'guestyCity',
      title: 'Guesty City/Area',
      type: 'string',
      description: 'Must exactly match the city/area returned by Guesty. This value is used to automatically load properties for this Location.'
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'customImage',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'nearbyJournals',
      title: 'Nearby Journals',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'journal' }] }]
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo'
    })
  ],
  preview: {
    select: {
      title: 'title',
      guestyCity: 'guestyCity',
      media: 'heroImage',
    },
    prepare(selection) {
      const { title, guestyCity } = selection
      return {
        title,
        subtitle: guestyCity ? `City: ${guestyCity}` : 'No city mapped',
        media: selection.media
      }
    }
  }
})
