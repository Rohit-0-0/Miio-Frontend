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
