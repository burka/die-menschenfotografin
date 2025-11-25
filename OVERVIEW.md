# Die Menschenfotografin - Portfolio Prototype

## 🎯 Vision Delivered

An immersive photography portfolio with:
- **Multi-layer parallax scrolling** (inception-style depth effect)
- **Cinematic zoom transitions** between views
- **Masonry grid** with staggered fly-in animations
- **Spatial lightbox navigation** that maintains context

## 🚀 Quick Start

```bash
./start.sh
# or
npm install && npm run dev
```

Then open http://localhost:5173

## 📁 Project Structure

```
photo-portfolio/
├── src/
│   ├── components/
│   │   ├── ParallaxHero.jsx     # Multi-layer scroll effect
│   │   ├── ParallaxHero.css
│   │   ├── MasonryGallery.jsx   # Grid with transitions
│   │   ├── MasonryGallery.css
│   │   ├── Lightbox.jsx         # Fullscreen view
│   │   └── Lightbox.css
│   ├── App.jsx                   # Main orchestrator
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── README.md                     # Basic setup
├── IMPLEMENTATION.md             # Technical details
├── ADVANCED.md                   # Future features
└── start.sh                      # Quick launch
```

## ✨ Key Features Implemented

### 1. Parallax Hero
- 3 depth layers per category (0.3x, 0.6x, 0.9x speeds)
- Scroll-snap for smooth transitions
- Depth blur on distant layers
- Click to zoom to gallery

### 2. Masonry Gallery
- CSS columns for responsive layout
- Images fly in from depth (staggered 30ms)
- Hover effects with scale
- Smooth zoom-out transition

### 3. Lightbox
- Fullscreen with blur backdrop
- Arrow key navigation
- Spatial counter (1/24)
- ESC to close

## 🎨 UX Flow

```
Hero (Scroll) → Category (Click) → Gallery (Zoom) → Image (Click) → Lightbox (Navigate)
                                        ↑                                    ↓
                                        ← Back Button ─────────────── ESC Key
```

## ⚡ Performance

- GPU-accelerated transforms
- Lazy image loading
- Staggered animations (no jank)
- will-change hints
- 60fps target

## 📱 Responsive

| Breakpoint | Columns | Notes |
|------------|---------|-------|
| >1400px | 4 | Full experience |
| 1024-1400 | 3 | Maintained |
| 640-1024 | 2 | Touch-optimized |
| <640px | 1 | Mobile-first |

## 🛠 Tech Stack

- React 18 + Vite
- Pure CSS animations (no external deps)
- CSS columns for masonry
- Modern browser APIs

## 📈 Next Steps

See `ADVANCED.md` for:
- Touch gestures
- Image CDN integration
- Virtual scrolling
- Share functionality
- Booking CTAs
- 3D transforms
- Video support

## 🎯 Production Checklist

- [ ] Replace placeholder images
- [ ] Add actual category data
- [ ] Implement image CDN
- [ ] Add meta tags for SEO
- [ ] Set up analytics
- [ ] Add contact form integration
- [ ] Optimize bundle size
- [ ] Add service worker
- [ ] Set up CI/CD

## 📝 Notes

The prototype uses Unsplash placeholder images. Replace with actual photography in production.

Mock data structure:
```javascript
{
  id: 'category-id',
  title: 'Category Name',
  layers: [back, mid, front], // For parallax
  images: [...] // Gallery images
}
```

## 🤝 Integration

To integrate with existing site:
1. Copy `src/components` to your React project
2. Adapt `App.jsx` to your routing
3. Replace mock data with API/CMS
4. Customize colors in CSS files

## 📚 Documentation

- `README.md` - Setup and run instructions
- `IMPLEMENTATION.md` - Technical deep dive
- `ADVANCED.md` - Future features guide

---

**Prototype created for die-menschenfotografin.de**

Built with React, Vite, and modern CSS
