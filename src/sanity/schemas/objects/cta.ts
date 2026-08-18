import { defineField, defineType } from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
    }),
    defineField({
      name: 'href',
      title: 'Link URL',
      type: 'string',
    }),
    defineField({
      name: 'style',
      title: 'Button Style',
      type: 'string',
      options: {
        list: ['primary', 'secondary', 'link']
      },
      initialValue: 'primary'
    })
  ],
  preview: {
    select: { title: 'text', subtitle: 'href' },
    prepare({ title, subtitle }) {
      return { title: title || 'CTA', subtitle: subtitle || 'No link' }
    }
  }
})
