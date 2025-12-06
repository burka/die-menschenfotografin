'use client'

import { useRouter } from 'next/navigation'
import { HomeTileGrid } from '@/components/homepage/HomeTileGrid'
import { usePageTransition } from '@/lib/PageTransitionContext'
import { CATEGORIES } from '@/data/categories'

export default function HomePage() {
  const router = useRouter()
  const { startTransition } = usePageTransition()

  const handleTileClick = (slug: string, rect: DOMRect) => {
    const category = CATEGORIES.find((c) => c.slug === slug)
    if (!category) return

    // Start the transition animation
    startTransition(category.previewImage, rect, slug)

    // Navigate after a short delay to let animation start
    setTimeout(() => {
      router.push(`/${slug}`)
    }, 50)
  }

  return <HomeTileGrid onTileClick={handleTileClick} />
}
