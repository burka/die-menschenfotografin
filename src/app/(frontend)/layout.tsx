import React from 'react'
import './styles.css'

export const metadata = {
  description: 'die-menschenfotografin.de - Photography by Kathrin',
  title: 'die-menschenfotografin.de',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="de">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
