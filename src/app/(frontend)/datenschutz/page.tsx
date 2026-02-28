import Link from 'next/link'
import { getSiteSettings } from '@/lib/payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import styles from '../legal.module.css'

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
          <>
            {/* Fallback: hardcoded content until CMS is populated */}
            <h1>Datenschutzerklärung</h1>
            <h2>1. Datenschutz auf einen Blick</h2>
            <h3>Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen
              Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit
              denen Sie persönlich identifiziert werden können.
            </p>
            <h3>Datenerfassung auf dieser Website</h3>
            <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
            <p>
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten
              können Sie dem Abschnitt &bdquo;Hinweis zur Verantwortlichen Stelle&ldquo; in dieser Datenschutzerklärung entnehmen.
            </p>
            <h3>Verantwortliche Stelle</h3>
            <address className={styles.address}>
              Kathrin Krause<br />
              Fichtenweg 28<br />
              22962 Siek<br />
              <br />
              Telefon: +49 176 37649371<br />
              E-Mail: info@die-menschenfotografin.de
            </address>
            <h3>Ihre Rechte</h3>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck
              Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die
              Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur
              Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft
              widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der
              Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein
              Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
            </p>
            <h2>2. Hosting</h2>
            <p>
              Wir hosten die Inhalte unserer Website bei All-Inkl (ALL-INKL.COM – Neue Medien Münnich,
              Hauptstraße 68, 02742 Friedersdorf). Die Datenverarbeitung erfolgt auf Grundlage von Art. 6
              Abs. 1 lit. f DSGVO basierend auf unserem berechtigten Interesse an einer zuverlässigen
              Websitepräsentation. Ein Auftragsverarbeitungsvertrag wurde geschlossen.
            </p>
            <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3>SSL- bzw. TLS-Verschlüsselung</h3>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
              Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie
              daran, dass die Adresszeile des Browsers von &bdquo;http://&ldquo; auf &bdquo;https://&ldquo; wechselt und an dem
              Schloss-Symbol in Ihrer Browserzeile.
            </p>
            <h3>Einwilligungsmanagement (Usercentrics)</h3>
            <p>
              Diese Website nutzt die Einwilligungstechnologie Usercentrics. Dabei werden unter anderem
              Einwilligungsentscheidungen, IP-Adressen, Browser- und Geräteinformationen sowie
              Besuchszeitstempel übertragen. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1
              lit. c DSGVO.
            </p>
            <h3>Server-Log-Dateien</h3>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
              Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp
              und Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden
              Rechners, Uhrzeit der Serveranfrage und IP-Adresse. Die Erfassung dieser Daten erfolgt
              auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
            </p>
            <h3>Kontaktformular und E-Mail-Kommunikation</h3>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem
              Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung
              der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Die Verarbeitung
              dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung)
              oder Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
            </p>
            <h2>4. Plugins und Tools</h2>
            <h3>Google Fonts (lokal gehostet)</h3>
            <p>
              Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Google Fonts,
              die lokal gehostet werden. Es findet keine Verbindung zu externen Google-Servern statt.
            </p>
            <h3>Wordfence Security</h3>
            <p>
              Wordfence (Defiant Inc., Seattle, USA) schützt diese Website vor Cyberangriffen über
              laufende Serververbindungen. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1
              lit. f DSGVO. Datenübertragungen in die USA basieren auf EU-Standardvertragsklauseln.
              Ein Auftragsverarbeitungsvertrag wurde geschlossen.
            </p>
            <h2>Weitere Rechte</h2>
            <p>
              Sie können die Übertragung Ihrer Daten verlangen, die Verarbeitung einschränken lassen,
              Korrekturen erhalten und Informationen über Datenempfänger anfordern. Widerspruchsrechte
              bestehen gegen Direktwerbung gemäß Art. 21 DSGVO.
            </p>
            <h3>Hinweis zur Datenweitergabe</h3>
            <p>
              Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden
              aufgeführten Zwecken findet nicht statt. Die Datenübertragung im Internet kann
              Sicherheitslücken aufweisen. Ein lückenloser Schutz der Daten vor dem Zugriff durch
              Dritte ist nicht möglich.
            </p>
          </>
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
