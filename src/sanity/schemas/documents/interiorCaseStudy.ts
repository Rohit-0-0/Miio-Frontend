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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'afterImage',
      title: 'After Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'afterImage',
    },
  },
});
