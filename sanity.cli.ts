import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jvblp287'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})
