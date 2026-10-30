import { defineArrayMember, defineField, defineType } from 'sanity'
import { uniqueDefault } from '../validation/uniqueDefault'

export const HOUSE_RULE_CATEGORIES = [
  { title: 'Checking in and out', value: 'checkInOut' },
  { title: 'During your stay', value: 'duringStay' },
  { title: 'Before you leave', value: 'beforeYouLeave' },
  { title: 'Safety and property', value: 'safety' },
  { title: 'Additional rules', value: 'additional' },
]

export const HOUSE_RULE_ICONS = [
  { title: 'Clock', value: 'clock' },
  { title: 'Key', value: 'key' },
  { title: 'Guests', value: 'users' },
  { title: 'Pets', value: 'pets' },
  { title: 'Smoking', value: 'smoking' },
  { title: 'Parties / events', value: 'party' },
  { title: 'Quiet hours', value: 'quiet' },
  { title: 'Camera / photography', value: 'camera' },
  { title: 'Rubbish', value: 'trash' },
  { title: 'Lock up', value: 'lock' },
  { title: 'Info', value: 'info' },
]

export const houseRules = defineType({
  name: 'houseRules',
  title: 'House Rules Group',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Group Title',
      type: 'string',
      description: 'Internal title for identifying this group of house rules (e.g., "Standard Apartment Rules")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isDefault',
      title: 'Use as default',
      type: 'boolean',
      description: 'Applied to every property that has no house rules linked. Only one group can be the default.',
      initialValue: false,
      validation: uniqueDefault('houseRules', 'house rules group'),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      description: 'Optional short paragraph shown above the rules.',
    }),
    defineField({
      name: 'rules',
      title: 'Rules',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'houseRule',
          fields: [
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              options: { list: HOUSE_RULE_CATEGORIES },
              initialValue: 'duringStay',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'rule',
              title: 'Rule',
              type: 'string',
              description: 'e.g. "Check-in after 3:00 pm", "No parties or events"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'details', title: 'Details', type: 'text', rows: 2 }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: { list: HOUSE_RULE_ICONS },
            }),
          ],
          preview: {
            select: { title: 'rule', category: 'category', details: 'details' },
            prepare({ title, category, details }) {
              const categoryTitle = HOUSE_RULE_CATEGORIES.find((c) => c.value === category)?.title
              return {
                title: title || 'Untitled rule',
                subtitle: [categoryTitle, details].filter(Boolean).join(' · '),
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', rules: 'rules', isDefault: 'isDefault' },
    prepare({ title, rules, isDefault }) {
      const count = rules ? rules.length : 0
      return {
        title: title || 'Untitled house rules',
        subtitle: `${isDefault ? 'Default · ' : ''}${count} rule${count === 1 ? '' : 's'}`,
      }
    },
  },
})
