'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type LegalPage = 'impressum' | 'datenschutz' | null;

interface LegalOverlayContextValue {
  activePage: LegalPage;
  openLegal: (page: 'impressum' | 'datenschutz') => void;
  closeLegal: () => void;
}

const LegalOverlayContext = createContext<LegalOverlayContextValue | null>(null);

export function LegalOverlayProvider({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState<LegalPage>(null);

  const openLegal = useCallback((page: 'impressum' | 'datenschutz') => {
    setActivePage(page);
  }, []);

  const closeLegal = useCallback(() => {
    setActivePage(null);
  }, []);

  return (
    <LegalOverlayContext.Provider value={{ activePage, openLegal, closeLegal }}>
      {children}
    </LegalOverlayContext.Provider>
  );
}

export function useLegalOverlay() {
  const context = useContext(LegalOverlayContext);
  if (!context) {
    throw new Error('useLegalOverlay must be used within a LegalOverlayProvider');
  }
  return context;
}
