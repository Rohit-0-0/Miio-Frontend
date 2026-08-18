import { defineField, defineType } from 'sanity'

export const property = defineType({
  name: 'property',
  title: 'Property (Guesty Synced)',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'city',
    },
    prepare(selection) {
      return {
        title: selection.title || 'Untitled Property',
        subtitle: selection.subtitle || 'Unknown City',
      }
    }
  }
})
