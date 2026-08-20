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
      name: 'relatedProperty',
      title: 'Related Property',
      type: 'reference',
      to: [{ type: 'propertyEditorial' }],
      description: 'The single property this journal is linked to.'
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      description: 'The heading text for the CTA block (e.g., "Experience this destination").'
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description',
      type: 'text',
      description: 'The supporting text for the CTA block.'
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      description: 'The text for the button linking to the related property (e.g., "View The Bondi Estate"). If left blank, it defaults to "View Property".'
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
