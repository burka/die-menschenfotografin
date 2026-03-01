import { getCategories } from '@/lib/payload'
import { HomePageClient } from '@/components/homepage/HomePageClient'

// D1 database is only available at runtime on Cloudflare Workers
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const categories = await getCategories()

  return <HomePageClient categories={categories} />
}
