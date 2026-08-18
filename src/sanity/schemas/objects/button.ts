import { defineField, defineType } from 'sanity'

export const button = defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: ['primary', 'secondary', 'outline', 'ghost'],
      },
      initialValue: 'primary'
    })
  ],
  preview: {
    select: { title: 'label', subtitle: 'url' },
    prepare({ title, subtitle }) {
      return { title: title || 'Button', subtitle: subtitle || 'No URL' }
    }
  }
})
