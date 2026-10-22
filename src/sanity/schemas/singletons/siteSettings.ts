import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'customImage',
    }),
    defineField({
      name: 'utilityBarLink',
      title: 'Top Bar Link',
      description: 'The link displayed in the top bar above the header (e.g. PARTNER WITH US).',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Link Text',
          type: 'string',
          initialValue: 'PARTNER WITH US'
        },
        {
          name: 'href',
          title: 'Link URL',
          type: 'string',
          initialValue: '/partner-with-us'
        }
      ]
    }),
    defineField({
      name: 'applePayLogo',
      title: 'Apple Pay Logo (Checkout)',
      description: 'Upload custom Apple Pay badge/logo for the payment options in the checkout tunnel. If not uploaded, the standard official Apple Pay badge is used.',
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
        { name: 'addCodeText', title: 'Add Code Text', type: 'string', initialValue: 'Add a code' },
        { name: 'freeCancellationText', title: 'Free Cancellation Text', type: 'string', initialValue: 'Free cancellation until 7 days before check-in.' },
        { name: 'cleaningFeeText', title: 'Cleaning Fee Text', type: 'string', initialValue: 'Cleaning fee' },
        { name: 'nightsText', title: 'Nights Text', type: 'string', initialValue: 'nights' },
        {
          name: 'miioClubCouponCode',
          title: 'Miio Club Coupon Code (Trigger)',
          description: 'The exact coupon code that triggers the custom label (e.g., MIIOCLUB)',
          type: 'string',
          initialValue: 'MIIOCLUB'
        },
        {
          name: 'miioClubCouponLabel',
          title: 'Miio Club Coupon Display Label',
          description: 'The text to show when this code is applied (e.g., Miio Club (10%))',
          type: 'string',
          initialValue: 'Miio Club (10%)'
        }
      ]
    }),
    defineField({
      name: 'reviewsLink',
      title: 'Reviews Link',
      description: 'The text and destination link for "Read all reviews" shown on the homepage and property details page.',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Link Text',
          type: 'string',
          initialValue: 'Read all reviews'
        },
        {
          name: 'href',
          title: 'Link URL',
          type: 'string',
          initialValue: 'https://airbnb.com'
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
