import { defineField, defineType } from 'sanity'

export const faq = defineType({
  name: 'faq',
  title: 'FAQ Group',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Group Title',
      type: 'string',
      description: 'Internal title for identifying this FAQ group (e.g., "General Stays FAQ")'
    }),
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' }
          ],
          preview: {
            select: { title: 'question', subtitle: 'answer' },
            prepare({ title, subtitle }) {
              return { title: title || 'Untitled Question', subtitle: subtitle || 'No answer provided' }
            }
          }
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      questions: 'questions'
    },
    prepare(selection) {
      const { title, questions } = selection
      return {
        title,
        subtitle: questions ? `${questions.length} questions` : '0 questions'
      }
    }
  }
})
