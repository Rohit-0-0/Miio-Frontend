import { defineField, defineType } from 'sanity'

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
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }]
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
      of: [{ type: 'reference', to: [{ type: 'propertyEditorial' }] }]
    }),
    defineField({
      name: 'relatedLocations',
      title: 'Related Locations',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'location' }] }]
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
