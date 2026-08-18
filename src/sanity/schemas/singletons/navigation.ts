import { defineField, defineType } from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'headerNav',
      title: 'Header Navigation',
      type: 'array',
      of: [{ type: 'navigationItem' }]
    }),
    defineField({
      name: 'footerNav',
      title: 'Footer Navigation',
      type: 'array',
      of: [{ type: 'navigationItem' }]
    }),
    defineField({
      name: 'legalNav',
      title: 'Legal Navigation',
      type: 'array',
      of: [{ type: 'navigationItem' }]
    })
  ],
  // __experimental_actions: ['update', 'publish'],
  preview: {
    prepare() {
      return {
        title: 'Navigation',
        subtitle: 'Navigation Menus'
      }
    }
  }
})
