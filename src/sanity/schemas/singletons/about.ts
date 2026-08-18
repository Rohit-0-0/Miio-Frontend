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
          description: 'The main hero title. Use <br/> for line breaks.',
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
      name: 'intro',
      title: 'Intro',
      type: 'object',
      fields: [
        { 
          name: 'label', 
          title: 'Label', 
          type: 'string',
          description: 'Small uppercase text above the intro body.'
        },
        { 
          name: 'body', 
          title: 'Body', 
          type: 'text',
          description: 'The main introductory text.',
        }
      ],
      preview: {
        select: { title: 'label' },
        prepare({ title }) {
          return { title: title || 'Intro Section', subtitle: 'Section Content' }
        }
      }
    }),
    defineField({
      name: 'story',
      title: 'Story',
      type: 'object',
      fields: [
        { name: 'label', title: 'Label', type: 'string' },
        { 
          name: 'heading', 
          title: 'Heading', 
          type: 'text',
          description: 'Use <br/> for line breaks.' 
        },
        { name: 'paragraphs', title: 'Paragraphs', type: 'array', of: [{ type: 'text' }] },
        { 
          name: 'founderImage', 
          title: 'Founder Image', 
          type: 'customImage',
        }
      ],
      preview: {
        select: { title: 'label', media: 'founderImage' },
        prepare({ title, media }) {
          return { title: title || 'Story Section', subtitle: 'Section Content', media }
        }
      }
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'object',
      fields: [
        { name: 'text', title: 'Quote Text', type: 'text' }
      ],
      preview: {
        select: { title: 'text' },
        prepare({ title }) {
          return { title: title || 'Pull Quote', subtitle: 'Section Content' }
        }
      }
    }),
    defineField({
      name: 'philosophy',
      title: 'Philosophy',
      type: 'object',
      fields: [
        { name: 'label', title: 'Label', type: 'string' },
        { name: 'paragraphs', title: 'Paragraphs', type: 'array', of: [{ type: 'text' }] }
      ],
      preview: {
        select: { title: 'label' },
        prepare({ title }) {
          return { title: title || 'Philosophy Section', subtitle: 'Section Content' }
        }
      }
    }),
    defineField({
      name: 'closing',
      title: 'Closing',
      type: 'object',
      fields: [
        { name: 'cta', title: 'Call to Action', type: 'cta' }
      ],
      preview: {
        select: { title: 'body' },
        prepare({ title }) {
          return { title: 'Closing Section', subtitle: title || 'Section Content' }
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
