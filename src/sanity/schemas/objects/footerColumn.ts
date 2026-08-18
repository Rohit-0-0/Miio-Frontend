import { defineField, defineType } from 'sanity'

export const footerColumn = defineType({
  name: 'footerColumn',
  title: 'Footer Column',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Column Title',
      type: 'string',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'navigationItem' }]
    })
  ],
  preview: {
    select: { title: 'title', links: 'links' },
    prepare({ title, links }) {
      return { title: title || 'Column', subtitle: links ? `${links.length} links` : '0 links' }
    }
  }
})
