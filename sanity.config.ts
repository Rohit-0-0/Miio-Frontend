import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemas'
import { structure } from './src/sanity/structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jvblp287'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'

const singletonTypes = new Set(['siteSettings', 'navigation', 'footer', 'home', 'about', 'partnerWithUs', 'journalPage', 'locationsPage', 'staysPage'])

export default defineConfig({
  basePath: '/studio',
  name: 'miio',
  title: 'Miio Editorial Studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure
    }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((templateItem) => !singletonTypes.has(templateItem.templateId))
      }
      return prev
    },
  },
})
