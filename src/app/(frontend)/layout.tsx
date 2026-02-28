import React from 'react'
import './styles.css'
import { PageTransitionProvider } from '@/lib/PageTransitionContext'
import { LegalOverlayProvider } from '@/lib/LegalOverlayContext'
import { SiteSettingsProvider } from '@/lib/SiteSettingsContext'
import { getSiteSettings } from '@/lib/payload'
import { TransitionOverlay } from '@/components/transition/TransitionOverlay'
import { LegalOverlay } from '@/components/legal/LegalOverlay'

export const metadata = {
  description: 'die-menschenfotografin.de - Photography by Kathrin',
  title: 'die-menschenfotografin.de',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const settings = await getSiteSettings()

  return (
    <html lang="de">
      <body>
        <SiteSettingsProvider settings={settings}>
          <LegalOverlayProvider>
            <PageTransitionProvider>
              <main>{children}</main>
              <TransitionOverlay />
            </PageTransitionProvider>
            <LegalOverlay />
          </LegalOverlayProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  )
}
