'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLegalOverlay } from '@/lib/LegalOverlayContext';
import styles from './LegalOverlay.module.css';

const TRANSITION_DURATION = 0.3;

export function LegalOverlay() {
  const { activePage, closeLegal, openLegal } = useLegalOverlay();

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePage) {
        closeLegal();
      }
    };

    if (activePage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activePage, closeLegal]);

  return (
    <AnimatePresence>
      {activePage && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: TRANSITION_DURATION }}
          onClick={closeLegal}
        >
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: TRANSITION_DURATION, delay: 0.05 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeLegal} aria-label="Schließen">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className={styles.scrollArea}>
              {activePage === 'impressum' && <ImpressumContent onSwitchPage={openLegal} />}
              {activePage === 'datenschutz' && <DatenschutzContent onSwitchPage={openLegal} />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ContentProps {
  onSwitchPage: (page: 'impressum' | 'datenschutz') => void;
}

function ImpressumContent({ onSwitchPage }: ContentProps) {
  return (
    <article className={styles.article}>
      <h1>Impressum</h1>

      <h2>Angaben gemäß § 5 TMG</h2>
      <address className={styles.address}>
        Kathrin Krause<br />
        Fichtenweg 28<br />
        22962 Siek
      </address>

      <h2>Kontakt</h2>
      <p>
        Telefon: +49 1556 6222336<br />
        E-Mail: info@die-menschenfotografin.de
      </p>

      <h2>EU-Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
        <a
          href="https://ec.europa.eu/consumers/odr/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.externalLink}
        >
          https://ec.europa.eu/consumers/odr/
        </a>
      </p>
      <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>

      <h2>Verbraucherschlichtung</h2>
      <p>
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>Quellenangaben für Bilder und Grafiken</h2>
      <p>Copyright Kathrin Krause</p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
        nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
        Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
        Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
        Tätigkeit hinweisen.
      </p>
      <p>
        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
        allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
        erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
        Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
        entfernen.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
        Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
        Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
        Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
        mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
        Verlinkung nicht erkennbar.
      </p>
      <p>
        Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
        Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
        Rechtsverletzungen werden wir derartige Links umgehend entfernen.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
        dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
        der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
        Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind
        nur für den privaten, nicht kommerziellen Gebrauch gestattet.
      </p>
      <p>
        Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
        Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
        gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
        bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
        werden wir derartige Inhalte umgehend entfernen.
      </p>

      <p className={styles.source}>Quelle: eRecht24</p>

      <div className={styles.footer}>
        <button className={styles.linkButton} onClick={() => onSwitchPage('datenschutz')}>
          Datenschutz
        </button>
      </div>
    </article>
  );
}

function DatenschutzContent({ onSwitchPage }: ContentProps) {
  return (
    <article className={styles.article}>
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

      <div className={styles.footer}>
        <button className={styles.linkButton} onClick={() => onSwitchPage('impressum')}>
          Impressum
        </button>
      </div>
    </article>
  );
}
