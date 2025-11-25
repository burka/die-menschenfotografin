# Implementation Notes

## UX Flow

```
┌─────────────────────────────────────┐
│   PARALLAX HERO (Scroll)            │
│                                     │
│   [Category 1] ──┐                 │
│   [Category 2]   │ Scroll          │
│   [Category 3]   │ Parallax        │
│   [Category 4] ──┘ 0.3x/0.6x/0.9x  │
│                                     │
│   Click → Zoom Out                  │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│   MASONRY GALLERY                   │
│   ┌──────┬──────┬──────┬──────┐    │
│   │ Img1 │ Img2 │ Img3 │ Img4 │    │
│   ├──────┼──────┼──────┼──────┤    │
│   │ Img5 │ Img6 │ Img7 │ Img8 │    │
│   └──────┴──────┴──────┴──────┘    │
│                                     │
│   Fly in from depth (staggered)     │
│   Click image → Fullscreen          │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│   LIGHTBOX (Fullscreen)             │
│   ┌───────────────────────────┐    │
│   │                           │    │
│   │      [  Image  ]          │    │
│   │                           │    │
│   └───────────────────────────┘    │
│   ← [1/24] ×                        │
│                                     │
│   Arrow keys or buttons             │
│   ESC → Back to gallery             │
└─────────────────────────────────────┘
```

## Animation Timings

| Transition | Duration | Easing |
|------------|----------|--------|
| Parallax scroll | Realtime | Linear per layer |
| Category → Gallery | 800ms | cubic-bezier(0.4,0,0.2,1) |
| Image fly-in | 600ms | cubic-bezier(0.4,0,0.2,1) |
| Image hover scale | 400ms | cubic-bezier(0.4,0,0.2,1) |
| Lightbox open | 400ms | cubic-bezier(0.4,0,0.2,1) |
| Gallery → Category | 600ms | cubic-bezier(0.4,0,0.2,1) |

## CSS Layers (Z-Index Stack)

```
1000: Lightbox overlay
100:  Gallery header (fixed)
10:   Category overlay text
3:    Parallax front layer
2:    Parallax mid layer
1:    Parallax back layer
```

## Performance Checklist

- [x] GPU acceleration (transform3d, will-change)
- [x] Debounced scroll calculations
- [x] Lazy image loading
- [x] Staggered animations
- [ ] Virtual scrolling (for 100+ images)
- [ ] Image CDN integration
- [ ] Preloading strategy
- [ ] Service worker caching

## Responsive Breakpoints

| Width | Columns | Adjustments |
|-------|---------|-------------|
| >1400px | 4 | Full experience |
| 1024-1400px | 3 | Maintained |
| 640-1024px | 2 | Simplified nav |
| <640px | 1 | Touch-optimized |

## Browser APIs Used

- IntersectionObserver (lazy loading ready)
- requestAnimationFrame (smooth scroll)
- CSS Transforms (GPU acceleration)
- CSS Columns (masonry)
- Backdrop Filter (blur effects)

## Next Level Features

1. **Touch gestures** for mobile (swipe between images)
2. **Image zoom** within lightbox (pinch/double-tap)
3. **Share functionality** per image
4. **Booking CTA** in lightbox overlay
5. **Category filtering** in gallery view
6. **Infinite scroll** for large galleries
7. **Video support** in masonry
8. **3D transforms** for more dramatic transitions
