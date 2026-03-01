import Link from 'next/link'
import { getSiteSettings } from '@/lib/payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { DatenschutzFallback } from '@/components/legal/DatenschutzFallback'
import styles from '../legal.module.css'

// D1 database is only available at runtime on Cloudflare Workers
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Datenschutz - Kathrin Krause | die Menschenfotografin',
  description: 'Datenschutzerklärung für die-menschenfotografin.de',
}

export default async function DatenschutzPage() {
  const settings = await getSiteSettings()

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          {settings.photographerName} / {settings.brandName}
        </Link>
      </div>

      <article className={styles.content}>
        {settings.datenschutz ? (
          <RichText data={settings.datenschutz} />
        ) : (
          <DatenschutzFallback
            settings={settings}
            addressClassName={styles.address}
          />
        )}

        <div className={styles.footer}>
          <Link href="/impressum" className={styles.legalLink}>Impressum</Link>
          <span className={styles.separator}>|</span>
          <Link href="/" className={styles.legalLink}>Startseite</Link>
        </div>
      </article>
    </main>
  )
}
