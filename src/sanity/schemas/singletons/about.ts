import { defineField, defineType } from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        { 
          name: 'title', 
          title: 'Title', 
          type: 'text',
          description: 'The main hero title.',
          validation: (Rule) => Rule.required()
        },
        { 
          name: 'subtitle', 
          title: 'Subtitle', 
          type: 'text',
          description: 'A short sentence displayed below the hero title.',
        }
      ],
      preview: {
        select: { title: 'title' },
        prepare({ title }) {
          return { title: title || 'Hero Section', subtitle: 'Section Content' }
        }
      }
    }),
    defineField({
      name: 'story',
      title: 'Story',
      type: 'object',
      fields: [
        { 
          name: 'heading', 
          title: 'Heading', 
          type: 'text',
        },
        { name: 'paragraphs', title: 'Paragraphs', type: 'array', of: [{ type: 'text' }] },
        { 
          name: 'founderImage', 
          title: 'Story Image', 
          type: 'customImage',
        }
      ],
      preview: {
        select: { title: 'heading', media: 'founderImage' },
        prepare({ title, media }) {
          return { title: title || 'Story Section', subtitle: 'Section Content', media }
        }
      }
    })
  ],
  // __experimental_actions: ['update', 'publish'],
  preview: {
    prepare() {
      return {
        title: 'About Page',
        subtitle: 'About Page Content'
      }
    }
  }
})
