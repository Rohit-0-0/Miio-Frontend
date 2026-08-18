import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemas'
import { structure } from './src/sanity/structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jvblp287'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'

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
})
