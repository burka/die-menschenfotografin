# Advanced Features Guide

## 1. Touch Gestures (Mobile)

```javascript
// Add to Lightbox.jsx
import { useSwipeable } from 'react-swipeable'

const handlers = useSwipeable({
  onSwipedLeft: () => onNext(),
  onSwipedRight: () => onPrev(),
  onSwipedDown: () => onClose(),
  trackMouse: false
})

return <div {...handlers} className="lightbox">
```

## 2. Image Zoom in Lightbox

```javascript
const [zoom, setZoom] = useState(1)
const [position, setPosition] = useState({ x: 0, y: 0 })

const handleWheel = (e) => {
  e.preventDefault()
  setZoom(z => Math.min(Math.max(z + e.deltaY * -0.01, 1), 4))
}

// In render:
<img 
  style={{
    transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
    cursor: zoom > 1 ? 'move' : 'zoom-in'
  }}
  onWheel={handleWheel}
/>
```

## 3. Virtual Scrolling (100+ Images)

```javascript
import { FixedSizeGrid } from 'react-window'

<FixedSizeGrid
  columnCount={4}
  columnWidth={300}
  height={window.innerHeight}
  rowCount={Math.ceil(images.length / 4)}
  rowHeight={400}
  width={window.innerWidth}
>
  {({ columnIndex, rowIndex, style }) => (
    <div style={style}>
      {/* Image component */}
    </div>
  )}
</FixedSizeGrid>
```

## 4. Image CDN Integration

```javascript
// utils/imageOptimizer.js
export const getOptimizedUrl = (url, { width, quality = 80, format = 'auto' }) => {
  // Cloudinary example
  return `https://res.cloudinary.com/yourcloud/image/fetch/f_${format},q_${quality},w_${width}/${url}`
  
  // ImageKit example
  return `https://ik.imagekit.io/yourkit/tr:w-${width},q-${quality},f-${format}/${url}`
}

// Usage in component:
<img 
  src={getOptimizedUrl(image.src, { width: 800 })}
  srcSet={`
    ${getOptimizedUrl(image.src, { width: 400 })} 400w,
    ${getOptimizedUrl(image.src, { width: 800 })} 800w,
    ${getOptimizedUrl(image.src, { width: 1200 })} 1200w
  `}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

## 5. Preloading Strategy

```javascript
// hooks/useImagePreload.js
export const useImagePreload = (images, currentIndex) => {
  useEffect(() => {
    // Preload next 3 images
    const toPreload = [
      images[currentIndex + 1],
      images[currentIndex + 2],
      images[currentIndex + 3]
    ].filter(Boolean)
    
    toPreload.forEach(img => {
      const image = new Image()
      image.src = img.src
    })
  }, [currentIndex, images])
}
```

## 6. Booking CTA in Lightbox

```javascript
<div className="lightbox-cta">
  <button onClick={() => openBooking(category)}>
    Shooting buchen
  </button>
</div>
```

```css
.lightbox-cta {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1002;
  animation: slideUp 0.5s ease 1s both;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
```

## 7. Category Filtering

```javascript
const [activeFilters, setActiveFilters] = useState(new Set())

const filteredImages = useMemo(() => {
  if (activeFilters.size === 0) return images
  return images.filter(img => activeFilters.has(img.category))
}, [images, activeFilters])
```

## 8. 3D Transform Effects

```css
.masonry-item {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.masonry-item:hover img {
  transform: rotateY(5deg) rotateX(-5deg) translateZ(20px);
}
```

## 9. Share Functionality

```javascript
const handleShare = async (image) => {
  if (navigator.share) {
    await navigator.share({
      title: category.title,
      text: `Check out this photo from ${category.title}`,
      url: image.src
    })
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(window.location.href)
  }
}
```

## 10. Smooth Scroll Snapping

```css
.masonry-gallery {
  scroll-snap-type: y proximity;
}

.masonry-item {
  scroll-snap-align: start;
  scroll-margin-top: 100px;
}
```

## Performance Monitoring

```javascript
// Add to App.jsx
useEffect(() => {
  // First Contentful Paint
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log('FCP:', entry.renderTime || entry.loadTime)
    })
  }).observe({ entryTypes: ['paint'] })
  
  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log('LCP:', entry.renderTime || entry.loadTime)
    })
  }).observe({ entryTypes: ['largest-contentful-paint'] })
}, [])
```

## SEO Optimization

```javascript
// Add to each route
import { Helmet } from 'react-helmet'

<Helmet>
  <title>{category.title} | Die Menschenfotografin</title>
  <meta name="description" content={`Browse ${category.title} photography`} />
  <meta property="og:image" content={category.images[0].src} />
</Helmet>
```
