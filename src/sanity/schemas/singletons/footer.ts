import { defineField, defineType } from 'sanity'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'columns',
      title: 'Footer Columns',
      type: 'array',
      of: [{ type: 'footerColumn' }]
    }),
    defineField({
      name: 'newsletter',
      title: 'Newsletter Section',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' }
      ],
      preview: {
        select: { title: 'heading' },
        prepare({ title }) {
          return { title: title || 'Newsletter Section', subtitle: 'Section Content' }
        }
      }
    }),
    defineField({
      name: 'partnerLogos',
      title: 'Partner Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'logo', title: 'Logo Image', type: 'image' },
            { name: 'alt', title: 'Alt Text', type: 'string' }
          ]
        }
      ],
      description: 'Logos displayed at the bottom of the footer (e.g. Guesty, Stripe).'
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright Text',
      type: 'string',
    })
  ],
  // __experimental_actions: ['update', 'publish'],
  preview: {
    prepare() {
      return {
        title: 'Footer',
        subtitle: 'Footer Content'
      }
    }
  }
})
