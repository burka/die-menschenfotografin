import { useEffect, useState } from 'react'

export function useMobileScrollHeight(activeSlug: string | null) {
  const [gridStyles, setGridStyles] = useState<React.CSSProperties>({})

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  useEffect(() => {
    if (!isMobile) {
      setGridStyles({})
      return
    }

    // Define height ratios for each position based on active category
    const getHeights = (activeIndex: number | null) => {
      const baseHeight = '120px'
      const activeHeight = '300px'

      switch (activeIndex) {
        case 0: // Business & Event active
          return {
            gridTemplateRows: `${activeHeight} ${baseHeight} auto ${baseHeight} ${baseHeight}`,
          }
        case 1: // Hochzeiten & Feiern active
          return {
            gridTemplateRows: `${baseHeight} ${activeHeight} auto ${baseHeight} ${baseHeight}`,
          }
        case 2: // Familie & Kind active
          return {
            gridTemplateRows: `${baseHeight} ${baseHeight} auto ${activeHeight} ${baseHeight}`,
          }
        case 3: // Kindergarten active
          return {
            gridTemplateRows: `${baseHeight} ${baseHeight} auto ${baseHeight} ${activeHeight}`,
          }
        default:
          return {
            gridTemplateRows: `${activeHeight} ${baseHeight} auto ${baseHeight} ${baseHeight}`,
          }
      }
    }

    // Map slug to index
    const slugToIndex: { [key: string]: number } = {
      'business-event': 0,
      'hochzeiten-feiern': 1,
      'familie-kind': 2,
      kindergarten: 3,
    }

    const activeIndex = activeSlug ? slugToIndex[activeSlug] : null
    const styles = getHeights(activeIndex)

    setGridStyles(styles)
  }, [activeSlug, isMobile])

  return gridStyles
}
