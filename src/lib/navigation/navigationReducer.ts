import type { NavigationState, NavigationAction } from './types'

export const initialNavigationState: NavigationState = {
  view: 'home',
  activeCategory: null,
  lightboxImageId: null,
  previousView: null,
  previousCategory: null,
}

export function navigationReducer(
  state: NavigationState,
  action: NavigationAction,
): NavigationState {
  switch (action.type) {
    case 'NAVIGATE_TO_GALLERY':
      return {
        view: 'gallery',
        activeCategory: action.category,
        lightboxImageId: null,
        previousView: state.view,
        previousCategory: state.activeCategory,
      }

    case 'NAVIGATE_TO_HOME':
      return {
        view: 'home',
        activeCategory: null,
        lightboxImageId: null,
        previousView: state.view,
        previousCategory: state.activeCategory,
      }

    case 'OPEN_LIGHTBOX':
      return {
        ...state,
        view: 'lightbox',
        lightboxImageId: action.imageId,
        previousView: state.view,
      }

    case 'CLOSE_LIGHTBOX':
      return {
        ...state,
        view: 'gallery',
        lightboxImageId: null,
        previousView: 'lightbox',
      }

    case 'NAVIGATE_LIGHTBOX':
      return {
        ...state,
        lightboxImageId: action.imageId,
      }

    case 'HANDLE_POPSTATE':
      return action.state

    default:
      return state
  }
}
