import React from 'react'
import './styles.css'
import { PageTransitionProvider } from '@/lib/PageTransitionContext'
import { LegalOverlayProvider } from '@/lib/LegalOverlayContext'
import { TransitionOverlay } from '@/components/transition/TransitionOverlay'
import { LegalOverlay } from '@/components/legal/LegalOverlay'

export const metadata = {
  description: 'die-menschenfotografin.de - Photography by Kathrin',
  title: 'die-menschenfotografin.de',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="de">
      <body>
        <LegalOverlayProvider>
          <PageTransitionProvider>
            <main>{children}</main>
            <TransitionOverlay />
          </PageTransitionProvider>
          <LegalOverlay />
        </LegalOverlayProvider>
      </body>
    </html>
  )
}
