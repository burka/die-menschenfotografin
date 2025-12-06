import React from 'react'
import './styles.css'
import { PageTransitionProvider } from '@/lib/PageTransitionContext'
import { TransitionOverlay } from '@/components/transition/TransitionOverlay'

export const metadata = {
  description: 'die-menschenfotografin.de - Photography by Kathrin',
  title: 'die-menschenfotografin.de',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="de">
      <body>
        <PageTransitionProvider>
          <main>{children}</main>
          <TransitionOverlay />
        </PageTransitionProvider>
      </body>
    </html>
  )
}
