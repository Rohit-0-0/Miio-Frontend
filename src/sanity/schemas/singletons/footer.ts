import { defineField, defineType } from 'sanity'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'columns',
      title: 'Footer Columns',
      type: 'array',
      of: [{ type: 'footerColumn' }]
    }),
    defineField({
      name: 'newsletter',
      title: 'Newsletter Section',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'icon', title: 'Key Icon', type: 'image' }
      ],
      preview: {
        select: { title: 'heading' },
        prepare({ title }) {
          return { title: title || 'Newsletter Section', subtitle: 'Section Content' }
        }
      }
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', title: 'Platform Name', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
            { name: 'icon', title: 'Icon', type: 'image', options: { hotspot: true } }
          ]
        }
      ]
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      description: 'Format: Include country code (e.g., +1234567890)',
      type: 'string'
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright Text',
      type: 'string',
    }),
    defineField({
      name: 'partnerLogos',
      title: 'Payment Trust Images (Footer)',
      description: 'Upload the white versions of secure checkout and payment method logos here for the dark background Footer.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }
          ]
        }
      ]
    })
  ],
  // __experimental_actions: ['update', 'publish'],
  preview: {
    prepare() {
      return {
        title: 'Footer',
        subtitle: 'Footer Content'
      }
    }
  }
})
