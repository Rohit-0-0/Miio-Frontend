import { defineField, defineType } from 'sanity'

export const locationsPage = defineType({
  name: 'locationsPage',
  title: 'Locations Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    })
  ],
  preview: {
    prepare() {
      return {
        title: 'Locations Page Settings'
      }
    }
  }
})
