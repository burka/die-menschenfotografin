import { getPayload } from 'payload'
import config from '@payload-config'
import { categoriesData, siteSettingsData } from './seed-data'

async function seed() {
  console.log('Seeding CMS data...')

  const payload = await getPayload({ config })

  // 1. Create categories
  for (const cat of categoriesData) {
    // Check if category already exists
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`Category "${cat.title}" already exists, updating...`)
      await payload.update({
        collection: 'categories',
        id: existing.docs[0].id,
        data: cat,
      })
    } else {
      console.log(`Creating category "${cat.title}"...`)
      await payload.create({
        collection: 'categories',
        data: cat,
      })
    }
  }

  // 2. Update site settings
  console.log('Updating site settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: siteSettingsData,
  })

  console.log('Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
