'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'
import { navigationReducer, initialNavigationState } from './navigationReducer'
import type { NavigationState, NavigationAction } from './types'
import { VALID_CATEGORIES } from './types'

interface NavigationContextType {
  state: NavigationState
  dispatch: React.Dispatch<NavigationAction>
  dispatchSync: (action: NavigationAction) => void // Synchronous dispatch for View Transitions
  updateURL: () => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

// Parse URL to state
function parseURLToState(pathname: string): NavigationState {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return { ...initialNavigationState }
  }

  const [category, imageId] = segments

  // Validate category
  if (!VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
    return { ...initialNavigationState }
  }

  if (imageId) {
    return {
      view: 'lightbox',
      activeCategory: category,
      lightboxImageId: imageId,
      previousView: null,
      previousCategory: null,
    }
  }

  return {
    view: 'gallery',
    activeCategory: category,
    lightboxImageId: null,
    previousView: null,
    previousCategory: null,
  }
}

// State to URL
function stateToURL(state: NavigationState): string {
  if (state.view === 'home') return '/'
  if (state.view === 'gallery' && state.activeCategory) return `/${state.activeCategory}`
  if (state.view === 'lightbox' && state.activeCategory && state.lightboxImageId) {
    return `/${state.activeCategory}/${state.lightboxImageId}`
  }
  return '/'
}

interface NavigationProviderProps {
  children: ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [state, dispatch] = useReducer(navigationReducer, initialNavigationState)
  const isPopstateNavigation = useRef(false)
  const initialized = useRef(false)

  // Synchronous dispatch using flushSync - required for View Transitions API
  const dispatchSync = useCallback((action: NavigationAction) => {
    flushSync(() => {
      dispatch(action)
    })
  }, [])

  // Initialize state from URL on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const initialState = parseURLToState(window.location.pathname)
    if (initialState.view !== 'home') {
      dispatch({ type: 'HANDLE_POPSTATE', state: initialState })
    }

    // Replace initial history entry with state
    history.replaceState(initialState, '', window.location.pathname)
  }, [])

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      isPopstateNavigation.current = true

      const newState = event.state
        ? (event.state as NavigationState)
        : parseURLToState(window.location.pathname)

      dispatch({ type: 'HANDLE_POPSTATE', state: newState })

      setTimeout(() => {
        isPopstateNavigation.current = false
      }, 0)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Update URL after state change
  const updateURL = useCallback(() => {
    if (isPopstateNavigation.current) return

    const url = stateToURL(state)
    if (url !== window.location.pathname) {
      history.pushState(state, '', url)
    }
  }, [state])

  return (
    <NavigationContext.Provider value={{ state, dispatch, dispatchSync, updateURL }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigationContext() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider')
  }
  return context
}
