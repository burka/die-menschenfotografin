'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RichText } from '@payloadcms/richtext-lexical/react';
import { useLegalOverlay } from '@/lib/LegalOverlayContext';
import { useSiteSettings } from '@/lib/SiteSettingsContext';
import { ImpressumFallback } from './ImpressumFallback';
import { DatenschutzFallback } from './DatenschutzFallback';
import styles from './LegalOverlay.module.css';

const TRANSITION_DURATION = 0.3;

export function LegalOverlay() {
  const { activePage, closeLegal, openLegal } = useLegalOverlay();

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
  const settings = useSiteSettings();

  return (
    <article className={styles.article}>
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
        <button className={styles.linkButton} onClick={() => onSwitchPage('datenschutz')}>
          Datenschutz
        </button>
      </div>
    </article>
  );
}

function DatenschutzContent({ onSwitchPage }: ContentProps) {
  const settings = useSiteSettings();

  return (
    <article className={styles.article}>
      {settings.datenschutz ? (
        <RichText data={settings.datenschutz} />
      ) : (
        <DatenschutzFallback
          settings={settings}
          addressClassName={styles.address}
        />
      )}

      <div className={styles.footer}>
        <button className={styles.linkButton} onClick={() => onSwitchPage('impressum')}>
          Impressum
        </button>
      </div>
    </article>
  );
}
