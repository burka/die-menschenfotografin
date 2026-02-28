import { getPayload } from 'payload'
import config from '@payload-config'

async function seed() {
  console.log('Seeding CMS data...')

  const payload = await getPayload({ config })

  // 1. Create categories
  const categoriesData = [
    {
      title: 'Business & Event',
      slug: 'business-event',
      sortOrder: 1,
      description:
        'Professionelle Business- und Event-Fotografie für Unternehmen und Veranstaltungen.',
    },
    {
      title: 'Hochzeiten & Feiern',
      slug: 'hochzeiten-feiern',
      sortOrder: 2,
      description: 'Emotionale Hochzeitsfotografie und Dokumentation besonderer Feiern.',
    },
    {
      title: 'Familie & Kind',
      slug: 'familie-kind',
      sortOrder: 3,
      description: 'Authentische Familien- und Kinderfotografie mit Herz.',
    },
    {
      title: 'Kindergarten',
      slug: 'kindergarten',
      sortOrder: 4,
      description:
        'Moderne Kindergartenfotografie mit Herz – Strahlende Kinderaugen, lautes Gekicher, viel Spaß und authentische Bilder.',
    },
  ]

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
    data: {
      photographerName: 'Kathrin Krause',
      brandName: 'die Menschenfotografin',
      tagline: 'Fine portraits for fine people',
      contact: {
        email: 'info@die-menschenfotografin.de',
        phone: '+49 1556 6222336',
        address: 'Kathrin Krause\nFichtenweg 28\n22962 Siek',
      },
    },
  })

  console.log('Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
