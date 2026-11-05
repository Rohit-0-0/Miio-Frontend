import { defineField, defineType } from 'sanity';
import { ReviewSelector } from '../../components/ReviewSelector';

export const reviewsPage = defineType({
  name: 'reviewsPage',
  title: 'Reviews Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Read all reviews',
      description: 'Main heading displayed at the top of the reviews page.',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / Description',
      type: 'text',
      rows: 2,
      initialValue:
        'Verified feedback and impressions from guests who have stayed across our properties.',
      description: 'Brief description shown below the main title.',
    }),
    defineField({
      name: 'featuredReviews',
      title: 'Selected Property Reviews (Guesty / Airbnb)',
      description:
        'Select which reviews from your properties to display on the Reviews page. Check the ones you want to show.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'featuredReviewRef',
          fields: [
            { name: 'reviewId', title: 'Guesty Review ID', type: 'string' },
            { name: 'listingId', title: 'Guesty Listing ID', type: 'string' },
          ],
          preview: {
            select: { title: 'reviewId', subtitle: 'listingId' },
          },
        },
      ],
      components: {
        input: ReviewSelector,
      },
    }),
    defineField({
      name: 'manualReviews',
      title: 'Additional Curated Reviews',
      description: 'Optional additional reviews or direct booking reviews.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'review' }] }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Reviews Page Settings',
      };
    },
  },
});

