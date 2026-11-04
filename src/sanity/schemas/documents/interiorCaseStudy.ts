import { defineType, defineField } from 'sanity';

export const interiorCaseStudy = defineType({
  name: 'interiorCaseStudy',
  title: 'Interior Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Project title (e.g. "Sydney Short-Term Stay")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short paragraph describing the transformation.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL (External)',
      type: 'string',
      description: 'External link to project details (leave blank if uploading a PDF below)',
    }),
    defineField({
      name: 'pdfDownload',
      title: 'PDF Download (Internal)',
      type: 'file',
      description: 'Upload a PDF directly to Sanity. If uploaded, the "View Project" button will download this PDF instead of going to the Link URL.',
      options: {
        accept: 'application/pdf'
      }
    }),
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
      description: 'Text for the link (e.g. "VIEW PROJECT ->")',
      initialValue: 'VIEW PROJECT →',
    }),
    defineField({
      name: 'beforeImage',
      title: 'Before Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          const comparisons = context?.document?.comparisons;
          if (Array.isArray(comparisons) && comparisons.length > 0) return true;
          return value ? true : 'Before image is required when no comparisons are added';
        }),
    }),
    defineField({
      name: 'afterImage',
      title: 'After Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          const comparisons = context?.document?.comparisons;
          if (Array.isArray(comparisons) && comparisons.length > 0) return true;
          return value ? true : 'After image is required when no comparisons are added';
        }),
    }),
    defineField({
      name: 'comparisons',
      title: 'Multiple Before / After Comparisons (Optional)',
      description: 'Add multiple rooms/spaces for this project (e.g. Living Area, Bedroom, Kitchen). If provided, visitors can switch between rooms using tabs.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Space / Room Label',
              type: 'string',
              description: 'e.g. Living Area, Master Bedroom, Kitchen',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'beforeImage',
              title: 'Before Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'afterImage',
              title: 'After Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'label',
              media: 'afterImage',
            },
            prepare({ title, media }: any) {
              return {
                title: title || 'Comparison Pair',
                media,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'afterImage',
    },
  },
});
