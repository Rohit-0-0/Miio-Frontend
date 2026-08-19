import { defineField, defineType } from 'sanity'

export const journalPage = defineType({
  name: 'journalPage',
  title: 'Journal Page',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'The small uppercase text above the main title.',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The main heading of the page.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'The short paragraph below the title.',
    })
  ],
  preview: {
    prepare() {
      return {
        title: 'Journal Page Settings'
      }
    }
  }
})
