# Die Menschenfotografin - Technical Vision

## Core Concept

**Static site generator** that transforms a simple folder structure into an immersive photography portfolio with parallax scrolling, masonry galleries, and cinematic transitions.

---

## Filesystem Structure

```
content/
├── portraits/
│   ├── index.mdx                    # Category intro/description
│   ├── _meta.json                   # Category config (title, order)
│   ├── image-001.jpg
│   ├── image-001.md                 # Caption/story for this image
│   ├── image-002.jpg
│   ├── image-002.md
│   └── parallax/                    # 3 layers for hero effect
│       ├── back.jpg
│       ├── mid.jpg
│       └── front.jpg
├── paare/
│   ├── index.mdx
│   ├── _meta.json
│   ├── image-001.jpg
│   ├── image-001.md
│   └── parallax/
├── familien/
│   └── ...
└── kinder/
    └── ...
```

---

## Build Pipeline

### 1. Discovery Phase
```bash
npm run build
```
- Scans `content/` folder structure
- Discovers all categories (folders)
- Pairs images with `.md` captions
- Reads `_meta.json` for config

### 2. Image Optimization
```javascript
// Generates responsive variants automatically
image-001.jpg →
  ├── image-001-400w.avif
  ├── image-001-400w.webp
  ├── image-001-400w.jpg
  ├── image-001-800w.avif
  ├── image-001-800w.webp
  ├── image-001-800w.jpg
  ├── image-001-1200w.avif
  └── image-001-1200w.webp
```

### 3. Static Generation
- Builds HTML pages for each category
- Embeds optimized images with `srcset`
- Renders MDX content to HTML
- Generates JSON manifests for client-side navigation

---

## Content Format

### `_meta.json`
```json
{
  "title": "Portraits",
  "order": 1,
  "description": "Authentische Porträtfotografie"
}
```

### `image-001.md`
```markdown
**Anna, 2024**

Ein spontaner Moment während des goldenen Lichts. 
Die Authentizität dieser Aufnahme zeigt, wie wichtig 
es ist, den richtigen Augenblick abzuwarten.
```

### `index.mdx`
```mdx
import { Gallery } from '@/components'

# Portraits

Jeder Mensch hat eine Geschichte. Meine Aufgabe ist es,
diese Geschichte in einem einzigen Bild einzufangen.

<Gallery layout="masonry" />

## Philosophie

Authentizität über Perfektion...
```

---

## UX Features

### 1. Parallax Hero
- **3-layer depth** (back/mid/front images)
- Smooth scroll with velocity-based parallax
- Click category → zoom transition to gallery

### 2. Masonry Gallery
- **Responsive grid** (4→3→2→1 columns)
- Images fly in from depth (staggered)
- MDX-rendered captions on hover/click

### 3. Lightbox View
- **Fullscreen** with caption overlay
- Arrow navigation with preloading
- Markdown-rendered descriptions

---

## Tech Stack

```
Vite + React
├── vite-plugin-mdx           # MDX support
├── sharp                      # Image optimization
├── @tailwindcss/typography    # Markdown styling
└── vite-imagetools            # Responsive images
```

**Build targets:**
- Static HTML/CSS/JS
- Optimized images in `/dist/assets/`
- CDN-ready (Cloudflare Pages, Vercel, Netlify)

---

## Developer Experience

### Add new category:
```bash
mkdir content/new-category
touch content/new-category/index.mdx
touch content/new-category/_meta.json
# Add images + captions
npm run build
```

### Add new image:
```bash
cp photo.jpg content/portraits/
echo "**Description**" > content/portraits/photo.md
npm run build
```

**Zero config** - filesystem is the API.

---

## Performance Goals

- **First Contentful Paint:** <1s
- **Largest Contentful Paint:** <2.5s
- **Time to Interactive:** <3s
- **Image formats:** AVIF → WebP → JPEG fallback
- **Lazy loading:** Native browser lazy loading, but preload 200px out of viewport
- **Preloading:** Next/prev images in lightbox

---

## Output

Static site with:
- Beautiful parallax scrolling
- Cinematic transitions
- Responsive images (auto-optimized)
- Rich markdown content
- Zero runtime dependencies for content
- Fast, CDN-cacheable

**One command:** `npm run build` → Deploy-ready `/dist/`