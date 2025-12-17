import React from 'react'
import './styles.css'
import './view-transitions.css'
import { AppShell } from '@/components/app'

export const metadata = {
  description: 'die-menschenfotografin.de - Photography by Kathrin',
  title: 'die-menschenfotografin.de',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="de">
      <body>
        <AppShell />
        {/* Children kept for legal pages that are still route-based */}
        {children}
      </body>
    </html>
  )
}
