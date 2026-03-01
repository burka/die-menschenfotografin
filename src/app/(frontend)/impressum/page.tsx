import Link from 'next/link'
import { getSiteSettings } from '@/lib/payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ImpressumFallback } from '@/components/legal/ImpressumFallback'
import styles from '../legal.module.css'

// D1 database is only available at runtime on Cloudflare Workers
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Impressum - Kathrin Krause | die Menschenfotografin',
  description: 'Impressum für die-menschenfotografin.de',
}

export default async function ImpressumPage() {
  const settings = await getSiteSettings()

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          {settings.photographerName} / {settings.brandName}
        </Link>
      </div>

      <article className={styles.content}>
        {settings.impressum ? (
          <RichText data={settings.impressum} />
        ) : (
          <ImpressumFallback
            settings={settings}
            addressClassName={styles.address}
            externalLinkClassName={styles.externalLink}
            sourceClassName={styles.source}
          />
        )}

        <div className={styles.footer}>
          <Link href="/datenschutz" className={styles.legalLink}>Datenschutz</Link>
          <span className={styles.separator}>|</span>
          <Link href="/" className={styles.legalLink}>Startseite</Link>
        </div>
      </article>
    </main>
  )
}
