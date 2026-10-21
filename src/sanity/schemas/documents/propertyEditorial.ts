import { defineField, defineType } from 'sanity'

import { SinglePropertySelector } from '../../components/SinglePropertySelector'
import { ListingReviewSelector } from '../../components/ListingReviewSelector'

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
      name: 'subtitle',
      title: 'Editorial Tagline (Heading)',
      description: 'Bold tagline directly under property title in Instrument Sans Semibold (e.g. "Bondi Beach Coastal Escape")',
      type: 'string'
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Subtitle / Introductory Text',
      description: 'Calm description line below the tagline (e.g. "A calm, design-led space just moments from the beach.")',
      type: 'text',
      rows: 2,
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
      of: [{ type: 'reference', to: [{ type: 'journal' }] }],
      validation: Rule => Rule.unique()
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
    }),
    defineField({
      name: 'reviews',
      title: 'Curated Reviews',
      type: 'array',
      description: 'Select reviews specifically for this property. If left empty, the latest live review from Guesty will be displayed.',
      components: {
        input: ListingReviewSelector,
      },
      of: [
        {
          type: 'object',
          fields: [
            { name: 'reviewId', title: 'Review ID', type: 'string' },
            { name: 'quote', title: 'Quote', type: 'text' },
            { name: 'author', title: 'Author', type: 'string' },
            { name: 'date', title: 'Date', type: 'string' },
            { name: 'rating', title: 'Rating', type: 'number' },
            { name: 'source', title: 'Source', type: 'string' },
          ],
          preview: {
            select: {
              title: 'author',
              subtitle: 'quote',
            },
          },
        },
      ],
    }),
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
