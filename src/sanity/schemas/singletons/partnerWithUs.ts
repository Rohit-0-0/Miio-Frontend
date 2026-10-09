import { defineType, defineField } from 'sanity';

export const partnerWithUs = defineType({
  name: 'partnerWithUs',
  title: 'Partner With Us',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'The main headline for the page (e.g. "A more considered way to manage your property.")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'problem',
      title: 'Problem Statement',
      type: 'text',
      description: 'The problem statement (e.g. "Inconsistent income. Time-consuming management.")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'solution',
      title: 'Solution Statement',
      type: 'text',
      description: 'The solution statement (e.g. "Full-service management. Design-led approach. Reliable returns.")',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Partner With Us Page Content',
      };
    },
  },
});
