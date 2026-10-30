import type { BooleanRule } from 'sanity'

export const uniqueDefault = (documentType: string, label: string) => (Rule: BooleanRule) =>
  Rule.custom(async (isDefault, context) => {
    if (!isDefault) return true
    const id = context.document?._id?.replace(/^drafts\./, '')
    const client = context.getClient({ apiVersion: '2024-03-12' })
    const otherDefaults = await client.fetch<number>(
      'count(*[_type == $type && isDefault == true && !(_id in [$id, $draftId])])',
      { type: documentType, id, draftId: `drafts.${id}` }
    )
    return otherDefaults === 0 || `Another ${label} is already the default.`
  })
