import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'customImage',
    }),
    defineField({
      name: 'paymentTrustImages',
      title: 'Payment Trust Images (Checkout Modal)',
      description: 'Upload the secure checkout and payment method logos here for the light background Checkout Modal.',
      type: 'array',
      of: [{ type: 'customImage' }]
    })
  ],
  // __experimental_actions: ['update', 'publish'],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global Configuration'
      }
    }
  }
})
