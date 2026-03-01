import { getCategories } from '@/lib/payload'
import { HomePageClient } from '@/components/homepage/HomePageClient'

export default async function HomePage() {
  const categories = await getCategories()

  return <HomePageClient categories={categories} />
}
