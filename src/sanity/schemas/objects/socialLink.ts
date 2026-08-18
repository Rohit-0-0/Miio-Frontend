import { defineField, defineType } from 'sanity'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok']
      }
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
    })
  ],
  preview: {
    select: { title: 'platform', subtitle: 'url' },
    prepare({ title, subtitle }) {
      return { title: title || 'Social Link', subtitle: subtitle || 'No URL' }
    }
  }
})
