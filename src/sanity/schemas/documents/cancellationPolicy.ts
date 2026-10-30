import { defineArrayMember, defineField, defineType } from 'sanity'
import { uniqueDefault } from '../validation/uniqueDefault'

export const cancellationPolicy = defineType({
  name: 'cancellationPolicy',
  title: 'Cancellation Policy',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Policy Name',
      type: 'string',
      description: 'Shown as the page title, e.g. "Flexible", "Moderate", "Strict"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isDefault',
      title: 'Use as default',
      type: 'boolean',
      description: 'Applied to every property that has no cancellation policy linked. Only one policy can be the default.',
      initialValue: false,
      validation: uniqueDefault('cancellationPolicy', 'cancellation policy'),
    }),
    defineField({
      name: 'summary',
      title: 'Checkout Summary',
      type: 'string',
      description: 'One line shown under the price in the booking tunnel, e.g. "Free cancellation until 7 days before check-in."',
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      description: 'Optional short paragraph shown at the top of the policy page.',
    }),
    defineField({
      name: 'tiers',
      title: 'Refund Timeline',
      type: 'array',
      description: 'Ordered from the earliest cancellation to the latest, e.g. Full refund, Partial refund, No refund.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'cancellationTier',
          fields: [
            defineField({
              name: 'title',
              title: 'Outcome',
              type: 'string',
              description: 'e.g. "Full refund"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'timeframe',
              title: 'When',
              type: 'string',
              description: 'e.g. "Cancel at least 7 days before check-in"',
            }),
            defineField({ name: 'details', title: 'Details', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'timeframe' },
          },
        }),
      ],
    }),
    defineField({
      name: 'details',
      title: 'Additional Terms',
      type: 'legalRichText',
      description: 'Fine print shown below the timeline (fees, exceptions, how to cancel).',
    }),
  ],
  preview: {
    select: { title: 'title', summary: 'summary', isDefault: 'isDefault' },
    prepare({ title, summary, isDefault }) {
      return {
        title: title || 'Untitled policy',
        subtitle: `${isDefault ? 'Default · ' : ''}${summary || ''}`,
      }
    },
  },
})
