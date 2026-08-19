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
      name: 'filters',
      title: 'Filters Configuration',
      type: 'object',
      fields: [
        { name: 'showLocationFilter', title: 'Show Location Filter', type: 'boolean' },
        { name: 'showGuestsFilter', title: 'Show Guests Filter', type: 'boolean' },
        { name: 'showPriceFilter', title: 'Show Price Filter', type: 'boolean' },
        { name: 'enableMapButton', title: 'Enable Map Button', type: 'boolean' },
        { 
          name: 'defaultSort', 
          title: 'Default Sort', 
          type: 'string',
          options: {
            list: [
              { title: 'Recommended', value: 'recommended' },
              { title: 'Newest', value: 'newest' },
              { title: 'Price (Low to High)', value: 'price_asc' },
              { title: 'Price (High to Low)', value: 'price_desc' },
            ]
          }
        }
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
