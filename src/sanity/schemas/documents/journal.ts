import { defineField, defineType } from 'sanity'
import { PropertySelector } from '../../components/PropertySelector'

export const journal = defineType({
  name: 'journal',
  title: 'Journal',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'customImage',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'customImage' }]
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'datetime',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo'
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'If enabled, this published journal will appear on the Homepage. If no journals are featured, the Homepage automatically displays the latest published journals.',
      initialValue: false,
    }),
    defineField({
      name: 'relatedProperties',
      title: 'Related Properties',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'propertyId', type: 'string' }
          ]
        }
      ],
      components: {
        input: PropertySelector,
      },
      description: 'The Guesty properties to display in this journal article.'
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      description: 'The heading text for the CTA block (e.g., "Experience this destination"). Defaults to "Experience this destination".'
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'heroImage',
    },
    prepare(selection) {
      const { title, author } = selection
      return {
        title,
        subtitle: author ? `By ${author}` : 'No author',
        media: selection.media
      }
    }
  }
})
