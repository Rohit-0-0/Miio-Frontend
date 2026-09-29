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
    }),
    defineField({
      name: 'checkoutTunnel',
      title: 'Checkout Tunnel Copy',
      description: 'Text labels for the booking/checkout tunnel',
      type: 'object',
      fields: [
        { name: 'datesHeading', title: 'Dates Heading', type: 'string', initialValue: 'Dates' },
        { name: 'guestsHeading', title: 'Guests Heading', type: 'string', initialValue: 'Guests' },
        { name: 'continueButton', title: 'Continue Button Text', type: 'string', initialValue: 'Continue to details' },
        { name: 'totalLabel', title: 'Total Label', type: 'string', initialValue: 'Total (AUD)' },
        { name: 'flexiblePaymentsText', title: 'Flexible Payments Text', type: 'string', initialValue: 'or flexible payments with' },
        { name: 'addCodeText', title: 'Add Code Text', type: 'string', initialValue: 'Add a code' },
        { name: 'freeCancellationText', title: 'Free Cancellation Text', type: 'string', initialValue: 'Free cancellation until 7 days before check-in.' },
        { name: 'cleaningFeeText', title: 'Cleaning Fee Text', type: 'string', initialValue: 'Cleaning fee' },
        { name: 'includedText', title: 'Included Text', type: 'string', initialValue: 'Included' },
        { name: 'nightsText', title: 'Nights Text', type: 'string', initialValue: 'nights' },
        { 
          name: 'flexiblePaymentLogos', 
          title: 'Flexible Payment Logos (Afterpay, Klarna, etc)', 
          type: 'array', 
          of: [{ type: 'customImage' }]
        }
      ]
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
