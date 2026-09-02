require('dotenv').config({ path: '.env.local' });
const { createClient } = require('next-sanity');
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false
});
async function test() {
  const data = await client.fetch('*[_type == "homepage"][0]{ featuredProperties->{ properties[]->{ id, title, guestyImageUrl, coverImageId, gallery, coverImage } } }');
  console.log(JSON.stringify(data.featuredProperties.properties, null, 2));
}
test();
