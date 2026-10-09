import { defineType, defineField } from 'sanity';

export const interiorDesignPage = defineType({
  name: 'interiorDesignPage',
  title: 'Interior Design Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: { hotspot: true },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'string',
        }),
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'string',
        }),
        defineField({
          name: 'bodyCopy',
          title: 'Body Copy',
          type: 'text',
        }),
        defineField({
          name: 'ctaText',
          title: 'CTA Text',
          type: 'string',
        }),
      ]
    }),
    defineField({
      name: 'principles',
      title: 'Our Difference (Principles)',
      type: 'object',
      fields: [
        defineField({ name: 'headline', type: 'string', title: 'Headline' }),
        defineField({ name: 'bodyCopy', type: 'text', title: 'Body Copy' }),
        defineField({
          name: 'items',
          title: 'Principles',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'title', type: 'string', title: 'Title' }),
              defineField({ name: 'description', type: 'text', title: 'Description' }),
            ]
          }]
        }),
      ]
    }),
    defineField({
      name: 'caseStudies',
      title: 'Case Studies',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'interiorCaseStudy' }] }],
      description: 'Select the featured case studies to show in the Before/After section.',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
        defineField({ name: 'headline', type: 'string', title: 'Headline' }),
        defineField({
          name: 'items',
          title: 'Service Items',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'title', type: 'string', title: 'Title' }),
              defineField({ name: 'description', type: 'text', title: 'Description' }),
            ]
          }]
        }),
      ]
    }),
    defineField({
      name: 'brandMoment',
      title: 'Brand Moment',
      type: 'object',
      fields: [
        defineField({ name: 'image', type: 'image', title: 'Image', options: { hotspot: true } }),
        defineField({ name: 'headline', type: 'string', title: 'Headline' }),
      ]
    }),
    defineField({
      name: 'process',
      title: 'Our Process',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
        defineField({ name: 'headline', type: 'string', title: 'Headline' }),
        defineField({
          name: 'steps',
          title: 'Process Steps',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'title', type: 'string', title: 'Title' }),
              defineField({ name: 'description', type: 'text', title: 'Description' }),
            ]
          }]
        }),
      ]
    }),
    defineField({
      name: 'whyMiio',
      title: 'Why Miio',
      type: 'object',
      fields: [
        defineField({ name: 'headline', type: 'string', title: 'Headline' }),
        defineField({
          name: 'points',
          title: 'Points',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'title', type: 'string', title: 'Title' }),
              defineField({ name: 'description', type: 'text', title: 'Description' }),
            ]
          }]
        }),
      ]
    }),
    defineField({
      name: 'testimonial',
      title: 'Featured Testimonial',
      type: 'reference',
      to: [{ type: 'review' }],
      description: 'Select an existing review to feature as the social proof.',
    }),
    defineField({
      name: 'clientGroups',
      title: 'Who We Work With',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow' }),
        defineField({ name: 'headline', type: 'string', title: 'Headline' }),
        defineField({
          name: 'groups',
          title: 'Client Groups',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'title', type: 'string', title: 'Title' }),
              defineField({ name: 'description', type: 'text', title: 'Description' }),
            ]
          }]
        }),
      ]
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
    }),
    defineField({
      name: 'finalCta',
      title: 'Final CTA Section',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', type: 'string', title: 'Eyebrow', initialValue: 'INTERIOR DESIGN & PROPERTY STYLING' }),
        defineField({ name: 'headline', type: 'string', title: 'Headline', initialValue: 'Have a property in mind?' }),
        defineField({ name: 'bodyCopy', type: 'text', title: 'Body Copy', initialValue: 'Let\'s create a space that looks beautiful, works hard and stays with the people who experience it.' }),
        defineField({ name: 'ctaText', type: 'string', title: 'CTA Text', initialValue: 'BOOK A DISCOVERY CALL →' }),
        defineField({ name: 'ctaLink', type: 'string', title: 'CTA Link', description: 'Link for the CTA (e.g. #enquiry-form)', initialValue: '#enquiry-form' })
      ]
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Meta Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Meta Description',
          type: 'text',
        }),
      ]
    })
  ],
  preview: {
    prepare() {
      return {
        title: 'Interior Design Page Content',
      };
    },
  },
});
