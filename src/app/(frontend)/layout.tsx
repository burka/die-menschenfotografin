import React from 'react'
import { HashRouterProvider } from '@/lib/hashRouter'
import './styles.css'

export const metadata = {
  description: 'die-menschenfotografin.de - Photography by Janina',
  title: 'die-menschenfotografin.de',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="de">
      <body>
        <HashRouterProvider>
          <main>{children}</main>
        </HashRouterProvider>
      </body>
    </html>
  )
}
