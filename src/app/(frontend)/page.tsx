'use client'

import { useRouter } from 'next/navigation'
import { HomeTileGrid } from '@/components/homepage/HomeTileGrid'

export default function HomePage() {
  const router = useRouter()

  return <HomeTileGrid onTileClick={(slug) => router.push(`/${slug}`)} />
}
