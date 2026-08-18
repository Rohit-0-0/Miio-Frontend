import { defineField, defineType } from 'sanity'

export const navigationItem = defineType({
  name: 'navigationItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'href',
      title: 'Link URL',
      type: 'string',
    })
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
    prepare({ title, subtitle }) {
      return { title: title || 'Navigation Item', subtitle: subtitle || 'No link' }
    }
  }
})
