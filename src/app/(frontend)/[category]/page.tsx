import { notFound } from 'next/navigation'
import { getCategoryBySlug, getAllCategorySlugs } from '@/lib/payload'
import { getMediaUrl } from '@/lib/payload'
import { CategoryPageClient } from '@/components/category/CategoryPageClient'
import type { CMSMedia } from '@/types/cms'

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs()
  return slugs.map((slug) => ({ category: slug }))
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params

  const category = await getCategoryBySlug(categorySlug)

  if (!category) {
    notFound()
  }

  const heroImage = getMediaUrl(category.heroImage as CMSMedia | string | undefined)

  return (
    <CategoryPageClient
      categorySlug={categorySlug}
      title={category.title}
      heroImage={heroImage}
      blocks={category.content || []}
    />
  )
}
