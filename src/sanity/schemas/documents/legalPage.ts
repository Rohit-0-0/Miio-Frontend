import { defineArrayMember, defineField, defineType } from 'sanity'

const DEFAULT_SECTION_HEADINGS = [
  'Definitions',
  'Bookings and Reservations',
  'Rates, Payments and Taxes',
  'Cancellations and Refunds',
  'Check-in and Check-out',
  'Guest Responsibilities and Occupancy',
  'Security Deposit and Damages',
  'Liability and Indemnity',
  'Privacy',
  'Changes to these Terms',
  'Governing Law',
  'Contact Us',
]

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'e.g. "Terms & Conditions", "Privacy Policy". Cancellation policies are managed per property under Cancellation Policies.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'The page is published at /legal/<slug>. Use "terms" for Terms & Conditions and "privacy" for the Privacy Policy so existing links keep working.',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Short introduction shown under the title.',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      description: 'Each section becomes a numbered heading with an entry in the table of contents.',
      initialValue: () =>
        DEFAULT_SECTION_HEADINGS.map((heading, index) => ({
          _type: 'legalSection',
          _key: `section-${index + 1}`,
          heading,
        })),
      of: [
        defineArrayMember({
          name: 'legalSection',
          title: 'Section',
          type: 'object',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'legalRichText',
            }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: title || 'Untitled section' }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'showInFooter',
      title: 'Show in Footer',
      type: 'boolean',
      description: 'Adds a link to this page in the site and checkout footers.',
      initialValue: true,
    }),
    defineField({
      name: 'footerOrder',
      title: 'Footer Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
      hidden: ({ document }) => !document?.showInFooter,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  orderings: [
    { title: 'Footer order', name: 'footerOrderAsc', by: [{ field: 'footerOrder', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', lastUpdated: 'lastUpdated' },
    prepare({ title, slug, lastUpdated }) {
      return {
        title: title || 'Untitled legal page',
        subtitle: [slug ? `/legal/${slug}` : null, lastUpdated ? `Updated ${lastUpdated}` : null]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
