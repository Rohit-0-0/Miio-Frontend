import { defineField, defineType } from 'sanity'

import { SinglePropertySelector } from '../../components/SinglePropertySelector'

export const propertyEditorial = defineType({
  name: 'propertyEditorial',
  title: 'Property Editorial',
  type: 'document',
  fields: [
    defineField({
      name: 'guestyListingId',
      title: 'Guesty Listing ID',
      type: 'string',
      components: {
        input: SinglePropertySelector,
      },
      validation: Rule => Rule.required().error('Guesty Listing ID is required to link with operational data.')
    }),
    defineField({
      name: 'heroStory',
      title: 'Hero Story',
      type: 'text'
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'text'
    }),
    defineField({
      name: 'localTips',
      title: 'Local Tips',
      type: 'array',
      of: [{ type: 'text' }]
    }),
    defineField({
      name: 'houseRules',
      title: 'House Rules',
      type: 'array',
      of: [{ type: 'text' }]
    }),
    defineField({
      name: 'nearbyAttractions',
      title: 'Nearby Attractions',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'faqReferences',
      title: 'FAQ References',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }]
    }),
    defineField({
      name: 'relatedJournals',
      title: 'Related Journals',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'journal' }] }]
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo'
    }),
    defineField({
      name: 'galleryOverrides',
      title: 'Gallery Overrides (Optional)',
      type: 'array',
      of: [{ type: 'customImage' }],
      description: 'Upload one image for a static display. Upload multiple images to automatically enable the carousel on the frontend.'
    }),
    defineField({
      name: 'futureBookingNotes',
      title: 'Future Booking Notes',
      type: 'text'
    })
  ],
  preview: {
    select: {
      title: 'guestyListingId'
    },
    prepare(selection) {
      return {
        title: `Property Editorial (${selection.title})`
      }
    }
  }
})
