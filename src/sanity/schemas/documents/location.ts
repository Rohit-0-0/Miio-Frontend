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
      description:
        'Must exactly match the city/area returned by Guesty. This value is used to automatically load properties for this Location.',
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
      name: 'highlights',
      title: 'Highlights Card',
      description: 'Short local facts shown in the intro card (icon + text).',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'highlightItem',
          title: 'Highlight',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'customImage',
              description: 'Optional. Shown inside the terracotta circle.',
            },
            {
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: 'text', media: 'icon' },
            prepare({ title, media }) {
              return { title: title || 'Highlight', media }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'localGuideHeading',
      title: 'Local Guide Heading',
      type: 'string',
      initialValue: 'Local guide',
    }),
    defineField({
      name: 'localGuideItems',
      title: 'Local Guide Cards',
      description: 'Cards in the Local guide section (image + title + description).',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'localGuideItem',
          title: 'Local Guide Card',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'customImage',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'description', media: 'image' },
          },
        },
      ],
    }),
    defineField({
      name: 'relatedJournalsCta',
      title: 'Related Journals CTA Label',
      type: 'string',
      initialValue: 'Related journal articles →',
    }),
    defineField({
      name: 'nearbyJournals',
      title: 'Nearby Journals',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'journal' }] }],
    }),
    defineField({
      name: 'finalCta',
      title: 'Final CTA',
      description: 'Bottom call-to-action shown below the Local guide section.',
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
        },
      },
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
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
        media: selection.media,
      }
    },
  },
})
