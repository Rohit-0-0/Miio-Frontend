import { defineField, defineType } from 'sanity'
import { PropertySelector } from '../../components/PropertySelector'

export const home = defineType({
  name: 'home',
  title: 'Home Page',
  type: 'document',
  // __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'hero',
    }),
    defineField({
      name: 'featuredEditorial',
      title: 'Featured Stays Editorial',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Section Heading', type: 'string' },
        { 
          name: 'displayMode', 
          title: 'Display Mode', 
          type: 'string', 
          options: { 
            list: [
              { title: 'Latest Properties (All)', value: 'LATEST' },
              { title: 'Manual Selection', value: 'MANUAL' }
            ]
          },
          initialValue: 'LATEST',
          description: 'Choose how to select featured properties.'
        },
        { 
          name: 'maxProperties', 
          title: 'Maximum Properties to Show', 
          type: 'number', 
          initialValue: 3,
          hidden: ({ parent }: any) => parent?.displayMode === 'MANUAL'
        },
        {
          name: 'manualSelection',
          title: 'Selected Properties',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'propertyId', type: 'string' }
              ]
            }
          ],
          components: {
            input: PropertySelector,
          },
          hidden: ({ parent }: any) => parent?.displayMode !== 'MANUAL',
          description: 'Manually select the properties you want to feature.'
        },
        { name: 'sideCardTitle', title: 'Side Card Title', type: 'string' },
        { name: 'sideCardDescription', title: 'Side Card Description', type: 'text' },
        { name: 'cta', title: 'Call to Action', type: 'cta' }
      ],
      preview: {
        select: { title: 'heading' },
        prepare({ title }) {
          return { title: title || 'Featured Editorial', subtitle: 'Section Content' }
        }
      }
    }),
    defineField({
      name: 'locations',
      title: 'Locations',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        {
          name: 'items',
          title: 'Locations List',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{ type: 'location' }]
            }
          ]
        }
      ],
      preview: {
        select: { title: 'heading' },
        prepare({ title }) {
          return { title: title || 'Locations', subtitle: 'Section Content' }
        }
      }
    }),
    defineField({
      name: 'trust',
      title: 'The Miio Standard',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'ratingText', title: 'Rating Text', type: 'string' },
        { name: 'reviewText', title: 'Review Text', type: 'string' },
        { name: 'verifiedText', title: 'Verified Text', type: 'string' },
        {
          name: 'features',
          title: 'Feature Labels',
          type: 'array',
          of: [{ type: 'string' }]
        }
      ],
      preview: {
        select: { title: 'heading' },
        prepare({ title }) {
          return { title: title || 'The Miio Standard', subtitle: 'Section Content' }
        }
      }
    }),
    defineField({
      name: 'journal',
      title: 'Journal Section',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'cta', title: 'Call to Action', type: 'cta' }
      ],
      preview: {
        select: { title: 'heading' },
        prepare({ title }) {
          return { title: title || 'Journal Section', subtitle: 'Section Content' }
        }
      }
    }),
    defineField({
      name: 'finalCta',
      title: 'Final CTA',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'cta', title: 'Call to Action', type: 'cta' }
      ],
      preview: {
        select: { title: 'heading' },
        prepare({ title }) {
          return { title: title || 'Final CTA', subtitle: 'Section Content' }
        }
      }
    })
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'Homepage Content',
      }
    }
  }
})
