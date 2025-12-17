import { describe, it, expect } from 'vitest'
import {
  navigationReducer,
  initialNavigationState,
} from '../../src/lib/navigation/navigationReducer'
import type { NavigationState } from '../../src/lib/navigation/types'

describe('navigationReducer', () => {
  describe('NAVIGATE_TO_GALLERY', () => {
    it('should navigate to gallery view with category', () => {
      const result = navigationReducer(initialNavigationState, {
        type: 'NAVIGATE_TO_GALLERY',
        category: 'business-event',
      })

      expect(result).toEqual({
        view: 'gallery',
        activeCategory: 'business-event',
        lightboxImageId: null,
        previousView: 'home',
        previousCategory: null,
      })
    })

    it('should preserve previous state information', () => {
      const stateInGallery: NavigationState = {
        view: 'gallery',
        activeCategory: 'familie-kind',
        lightboxImageId: null,
        previousView: 'home',
        previousCategory: null,
      }

      const result = navigationReducer(stateInGallery, {
        type: 'NAVIGATE_TO_GALLERY',
        category: 'hochzeiten-feiern',
      })

      expect(result.previousView).toBe('gallery')
      expect(result.previousCategory).toBe('familie-kind')
      expect(result.activeCategory).toBe('hochzeiten-feiern')
    })
  })

  describe('NAVIGATE_TO_HOME', () => {
    it('should navigate to home from gallery', () => {
      const stateInGallery: NavigationState = {
        view: 'gallery',
        activeCategory: 'business-event',
        lightboxImageId: null,
        previousView: 'home',
        previousCategory: null,
      }

      const result = navigationReducer(stateInGallery, {
        type: 'NAVIGATE_TO_HOME',
      })

      expect(result).toEqual({
        view: 'home',
        activeCategory: null,
        lightboxImageId: null,
        previousView: 'gallery',
        previousCategory: 'business-event',
      })
    })

    it('should clear active category and lightbox', () => {
      const stateInLightbox: NavigationState = {
        view: 'lightbox',
        activeCategory: 'familie-kind',
        lightboxImageId: 'img-123',
        previousView: 'gallery',
        previousCategory: null,
      }

      const result = navigationReducer(stateInLightbox, {
        type: 'NAVIGATE_TO_HOME',
      })

      expect(result.view).toBe('home')
      expect(result.activeCategory).toBeNull()
      expect(result.lightboxImageId).toBeNull()
    })
  })

  describe('OPEN_LIGHTBOX', () => {
    it('should open lightbox from gallery', () => {
      const stateInGallery: NavigationState = {
        view: 'gallery',
        activeCategory: 'business-event',
        lightboxImageId: null,
        previousView: 'home',
        previousCategory: null,
      }

      const result = navigationReducer(stateInGallery, {
        type: 'OPEN_LIGHTBOX',
        imageId: 'img-456',
      })

      expect(result).toEqual({
        view: 'lightbox',
        activeCategory: 'business-event',
        lightboxImageId: 'img-456',
        previousView: 'gallery',
        previousCategory: null,
      })
    })

    it('should preserve active category when opening lightbox', () => {
      const stateInGallery: NavigationState = {
        view: 'gallery',
        activeCategory: 'hochzeiten-feiern',
        lightboxImageId: null,
        previousView: 'home',
        previousCategory: null,
      }

      const result = navigationReducer(stateInGallery, {
        type: 'OPEN_LIGHTBOX',
        imageId: 'img-789',
      })

      expect(result.activeCategory).toBe('hochzeiten-feiern')
      expect(result.lightboxImageId).toBe('img-789')
    })
  })

  describe('CLOSE_LIGHTBOX', () => {
    it('should close lightbox and return to gallery', () => {
      const stateInLightbox: NavigationState = {
        view: 'lightbox',
        activeCategory: 'familie-kind',
        lightboxImageId: 'img-101',
        previousView: 'gallery',
        previousCategory: null,
      }

      const result = navigationReducer(stateInLightbox, {
        type: 'CLOSE_LIGHTBOX',
      })

      expect(result).toEqual({
        view: 'gallery',
        activeCategory: 'familie-kind',
        lightboxImageId: null,
        previousView: 'lightbox',
        previousCategory: null,
      })
    })

    it('should preserve active category when closing lightbox', () => {
      const stateInLightbox: NavigationState = {
        view: 'lightbox',
        activeCategory: 'kindergarten',
        lightboxImageId: 'img-202',
        previousView: 'gallery',
        previousCategory: 'business-event',
      }

      const result = navigationReducer(stateInLightbox, {
        type: 'CLOSE_LIGHTBOX',
      })

      expect(result.activeCategory).toBe('kindergarten')
      expect(result.lightboxImageId).toBeNull()
    })
  })

  describe('NAVIGATE_LIGHTBOX', () => {
    it('should change lightbox image without affecting other state', () => {
      const stateInLightbox: NavigationState = {
        view: 'lightbox',
        activeCategory: 'business-event',
        lightboxImageId: 'img-300',
        previousView: 'gallery',
        previousCategory: null,
      }

      const result = navigationReducer(stateInLightbox, {
        type: 'NAVIGATE_LIGHTBOX',
        imageId: 'img-301',
      })

      expect(result).toEqual({
        view: 'lightbox',
        activeCategory: 'business-event',
        lightboxImageId: 'img-301',
        previousView: 'gallery',
        previousCategory: null,
      })
    })

    it('should only update lightboxImageId', () => {
      const stateInLightbox: NavigationState = {
        view: 'lightbox',
        activeCategory: 'hochzeiten-feiern',
        lightboxImageId: 'img-400',
        previousView: 'gallery',
        previousCategory: 'familie-kind',
      }

      const result = navigationReducer(stateInLightbox, {
        type: 'NAVIGATE_LIGHTBOX',
        imageId: 'img-500',
      })

      expect(result.lightboxImageId).toBe('img-500')
      expect(result.view).toBe('lightbox')
      expect(result.activeCategory).toBe('hochzeiten-feiern')
      expect(result.previousView).toBe('gallery')
      expect(result.previousCategory).toBe('familie-kind')
    })
  })

  describe('HANDLE_POPSTATE', () => {
    it('should replace state with provided state', () => {
      const currentState: NavigationState = {
        view: 'lightbox',
        activeCategory: 'business-event',
        lightboxImageId: 'img-600',
        previousView: 'gallery',
        previousCategory: null,
      }

      const newState: NavigationState = {
        view: 'gallery',
        activeCategory: 'familie-kind',
        lightboxImageId: null,
        previousView: 'home',
        previousCategory: null,
      }

      const result = navigationReducer(currentState, {
        type: 'HANDLE_POPSTATE',
        state: newState,
      })

      expect(result).toEqual(newState)
    })

    it('should completely replace state including all fields', () => {
      const newState: NavigationState = {
        view: 'home',
        activeCategory: null,
        lightboxImageId: null,
        previousView: null,
        previousCategory: null,
      }

      const result = navigationReducer(initialNavigationState, {
        type: 'HANDLE_POPSTATE',
        state: newState,
      })

      expect(result).toEqual(newState)
    })
  })

  describe('unknown action', () => {
    it('should return the same state for unknown action', () => {
      const state: NavigationState = {
        view: 'gallery',
        activeCategory: 'business-event',
        lightboxImageId: null,
        previousView: 'home',
        previousCategory: null,
      }

      // @ts-expect-error Testing unknown action type
      const result = navigationReducer(state, { type: 'UNKNOWN_ACTION' })

      expect(result).toBe(state)
    })

    it('should not modify state for unknown action', () => {
      const stateCopy = { ...initialNavigationState }

      // @ts-expect-error Testing unknown action type
      navigationReducer(initialNavigationState, { type: 'INVALID' })

      expect(initialNavigationState).toEqual(stateCopy)
    })
  })

  describe('state immutability', () => {
    it('should not mutate original state', () => {
      const originalState: NavigationState = {
        view: 'gallery',
        activeCategory: 'business-event',
        lightboxImageId: null,
        previousView: 'home',
        previousCategory: null,
      }

      const stateCopy = { ...originalState }

      navigationReducer(originalState, {
        type: 'NAVIGATE_TO_HOME',
      })

      expect(originalState).toEqual(stateCopy)
    })
  })
})
