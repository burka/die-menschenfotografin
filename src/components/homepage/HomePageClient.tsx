'use client'

import { useRouter } from 'next/navigation'
import { HomeTileGrid } from '@/components/homepage/HomeTileGrid'
import { usePageTransition } from '@/lib/PageTransitionContext'
import type { CategoryTile } from '@/types/homepage'

interface HomePageClientProps {
  categories: CategoryTile[]
}

export function HomePageClient({ categories }: HomePageClientProps) {
  const router = useRouter()
  const { startTransition } = usePageTransition()

  const handleTileClick = (slug: string, rect: DOMRect, titleRect: DOMRect) => {
    const category = categories.find((c) => c.slug === slug)
    if (!category) return

    startTransition(category.previewImage, rect, slug, category.title, titleRect)

    setTimeout(() => {
      router.push(`/${slug}`)
    }, 50)
  }

  return <HomeTileGrid categories={categories} onTileClick={handleTileClick} />
}
