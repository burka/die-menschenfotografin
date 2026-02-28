# CMS-Analyse: die Menschenfotografin

## Zusammenfassung der Ist-Situation

### Was existiert bereits

**Payload CMS (v3.63)** ist installiert und konfiguriert mit:
- Admin-Panel unter `/admin`
- REST-API unter `/api`
- SQLite-Datenbank (Cloudflare D1)
- R2-Storage für Bilder (Cloudflare R2)
- Lexical Rich-Text-Editor

**4 Collections sind definiert:**

| Collection | Felder | Status |
|-----------|--------|--------|
| **Users** | email | Funktioniert (Auth) |
| **Media** | alt, upload | Funktioniert (R2-Upload) |
| **Images** | image, alt, caption, date, story, category | Definiert, aber nicht genutzt |
| **Categories** | title, slug, heroImage, description, content (blocks) | Definiert, aber nicht genutzt |

**Block-Typen in Categories:**
- `galleryBlock` – Bilder-Auswahl aus Images-Collection
- `richTextBlock` – Freitext mit Lexical-Editor

**Block-Renderer existieren bereits:**
- `BlockRenderer.tsx` – Verteiler für Block-Typen
- `GalleryBlock.tsx` – Rendert Galerie-Blöcke
- `RichTextBlock.tsx` – Rendert Rich-Text-Blöcke

---

## Was FEHLT (Kernprobleme)

### Problem 1: Website nutzt NICHT das CMS

Die gesamte Website liest **keinerlei Daten aus dem CMS**. Stattdessen:

| Datenquelle | Datei | Was dort steht |
|------------|-------|---------------|
| Kategorien | `src/data/categories.ts` | 4 hardcodierte Kategorien mit Unsplash-Platzhalterbildern |
| Galerie-Bilder | `src/app/(frontend)/[category]/page.tsx` | 8 Mock-Bilder (Unsplash) direkt im Code |
| Branding | `src/components/homepage/BrandingOverlay.tsx` | "Kathrin Krause", "die Menschenfotografin", "Fine portraits for fine people" |
| Impressum | `src/app/(frontend)/impressum/page.tsx` | Gesamter Rechtstext hardcodiert |
| Datenschutz | `src/app/(frontend)/datenschutz/page.tsx` | Gesamter Rechtstext hardcodiert |

**Ergebnis:** Änderungen am CMS haben NULL Auswirkung auf die Website.

### Problem 2: Fehlende Block-Typen für flexiblen Content

Die Anforderung ist: Pro Kategorie sollen **beliebige Inhalte in beliebiger Reihenfolge** eingefügt werden:
- Text-Block (Überschrift + Beschreibung)
- Bild + Text (Bild links, Text rechts)
- Text + Bild (Text links, Bild rechts)
- Galerie (Bildergalerie)

**Aktuell gibt es nur 2 Block-Typen:**
- `galleryBlock` – Nur Bilder
- `richTextBlock` – Nur Text

**Es fehlen:**
- `imageTextBlock` – Bild + Text nebeneinander (Richtung konfigurierbar)
- `headingBlock` – Überschrift + optionaler Untertitel/Beschreibung (als eigenständiger Block)

### Problem 3: Categories-Collection hat kein Vorschaubild für Homepage-Kachel

Die Homepage zeigt 4 Kacheln mit je:
- `previewImage` – Vorschaubild für die Kachel
- `backgroundBokeh` – Hintergrundbild bei Hover

Die Categories-Collection hat nur `heroImage` (Hero-Bild auf der Kategorie-Seite selbst), aber kein separates `previewImage` oder `backgroundBokeh` für die Homepage-Kacheln.

### Problem 4: Sortierung der Kategorien fehlt

Es gibt kein `order`/`sortOrder`-Feld, um die Reihenfolge der Kategorien auf der Homepage zu steuern.

### Problem 5: CMS ist nicht mit Daten vorbestückt

Die bestehenden 4 Kategorien und der Content aus dem WordPress-Export existieren nur im Code, nicht im CMS.

### Problem 6: Homepage und globale Einstellungen fehlen im CMS

Es gibt keine Möglichkeit, folgende Dinge im CMS zu bearbeiten:
- Fotografin-Name ("Kathrin Krause")
- Untertitel ("die Menschenfotografin")
- Tagline ("Fine portraits for fine people")
- Kontaktdaten
- Impressum-Text
- Datenschutz-Text

---

## Lösungsplan: Vollständige CMS-Integration

### Phase 1: CMS-Datenmodell erweitern

#### 1.1 Neue Global: `SiteSettings` (für globale Einstellungen)

```
SiteSettings (Payload Global):
├── photographerName: text ("Kathrin Krause")
├── brandName: text ("die Menschenfotografin")
├── tagline: text ("Fine portraits for fine people")
├── contact:
│   ├── email: text
│   ├── phone: text
│   └── address: textarea
├── impressum: richText (gesamter Rechtstext)
└── datenschutz: richText (gesamter Rechtstext)
```

#### 1.2 Categories-Collection erweitern

```
Categories (erweitert):
├── title: text (existiert) ✓
├── slug: text (existiert) ✓
├── sortOrder: number (NEU – Reihenfolge auf Homepage)
├── heroImage: upload (existiert) ✓
├── previewImage: upload (NEU – Kachelbild für Homepage)
├── description: textarea (existiert) ✓
└── content: blocks (ERWEITERT):
    ├── galleryBlock (existiert) ✓
    ├── richTextBlock (existiert) ✓
    ├── imageTextBlock (NEU):
    │   ├── image: relationship → Images
    │   ├── heading: text (optional)
    │   ├── text: richText
    │   └── imagePosition: select ["left", "right"]
    └── headingBlock (NEU):
        ├── heading: text
        ├── level: select ["h2", "h3", "h4"]
        └── description: textarea (optional)
```

#### 1.3 Images-Collection: Keine Änderung nötig ✓

Die Images-Collection ist bereits gut strukturiert.

---

### Phase 2: Frontend mit CMS verbinden

#### 2.1 Daten-Abruf-Funktionen erstellen

Eine zentrale `src/lib/payload.ts` Datei mit Funktionen:

```typescript
// Kategorien für Homepage laden (sortiert nach sortOrder)
getCategories(): Promise<Category[]>

// Einzelne Kategorie mit allen Blocks laden
getCategoryBySlug(slug: string): Promise<CategoryWithContent>

// Globale Settings laden (Branding, Kontakt, Legal)
getSiteSettings(): Promise<SiteSettings>
```

Diese nutzen die **Payload Local API** (direkter DB-Zugriff, kein HTTP nötig da Payload im gleichen Next.js-Prozess läuft).

#### 2.2 Homepage umbauen

**Aktuell:** `src/app/(frontend)/page.tsx` importiert `CATEGORIES` aus `src/data/categories.ts`

**Neu:** Server-Component lädt Kategorien aus CMS:
```
page.tsx (Server) → getCategories() → Payload DB
  └── Gibt Daten an Client-Component weiter
```

#### 2.3 Kategorie-Seiten umbauen

**Aktuell:** `src/app/(frontend)/[category]/page.tsx` nutzt hardcodierte Mock-Bilder

**Neu:** Server-Component lädt Kategorie + Blocks aus CMS:
```
[category]/page.tsx (Server) → getCategoryBySlug(slug) → Payload DB
  └── Rendert blocks mit BlockRenderer
      ├── galleryBlock → GalleryBlock-Component
      ├── richTextBlock → RichTextBlock-Component
      ├── imageTextBlock → ImageTextBlock-Component (NEU)
      └── headingBlock → HeadingBlock-Component (NEU)
```

#### 2.4 Impressum/Datenschutz aus CMS laden

**Aktuell:** Hardcodierter HTML-Text in den Seiten-Dateien

**Neu:** Rich-Text aus `SiteSettings` Global laden und rendern.

#### 2.5 Branding aus CMS laden

**Aktuell:** "Kathrin Krause" und "die Menschenfotografin" hardcodiert in Components

**Neu:** Aus `SiteSettings` laden und per Props/Context an Components übergeben.

---

### Phase 3: Neue Block-Components erstellen

#### 3.1 `ImageTextBlock` Component

```
┌──────────────────────────────────────────┐
│  [Bild]  │  Überschrift                  │  ← imagePosition: "left"
│          │  Lorem ipsum dolor sit amet... │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Überschrift                  │  [Bild]  │  ← imagePosition: "right"
│  Lorem ipsum dolor sit amet... │         │
└──────────────────────────────────────────┘
```

Responsiv: Auf Mobile stapeln sich Bild und Text vertikal.

#### 3.2 `HeadingBlock` Component

```
┌──────────────────────────────────────────┐
│  Überschrift (h2/h3/h4)                  │
│  Optionale Beschreibung darunter         │
└──────────────────────────────────────────┘
```

---

### Phase 4: CMS mit aktuellen Daten vorbestücken

#### 4.1 Seed-Script erstellen

Ein Script `src/seed.ts`, das über die Payload Local API:

1. **4 Kategorien anlegt:**
   - Business & Event (sortOrder: 1)
   - Hochzeiten & Feiern (sortOrder: 2)
   - Familie & Kind (sortOrder: 3)
   - Kindergarten (sortOrder: 4)

2. **SiteSettings befüllt:**
   - photographerName: "Kathrin Krause"
   - brandName: "die Menschenfotografin"
   - tagline: "Fine portraits for fine people"
   - Kontaktdaten aus Impressum
   - Impressum-Text (als Rich-Text)
   - Datenschutz-Text (als Rich-Text)

3. **Kindergarten-Content aus WordPress-Export migriert:**
   - "Das Konzept" als richTextBlock
   - "Der Ablauf" als richTextBlock
   - Galerie-Bilder als galleryBlock

---

### Phase 5: `src/data/categories.ts` und Mock-Daten entfernen

Nach erfolgreicher CMS-Integration:
- `src/data/categories.ts` löschen
- Mock-Bilder in `[category]/page.tsx` entfernen
- Alle Imports auf CMS-Daten umstellen

---

## Ergebnis-Übersicht: CMS ↔ Website Struktur

```
CMS (Payload Admin /admin)          Website (Frontend)
─────────────────────────           ──────────────────

SiteSettings                    →   Branding (Name, Tagline)
  ├── photographerName              Impressum-Seite
  ├── brandName                     Datenschutz-Seite
  ├── tagline                       Footer/Kontakt
  ├── contact
  ├── impressum
  └── datenschutz

Categories (sortiert)           →   Homepage (4 Kacheln)
  ├── title                         Kachel-Titel
  ├── previewImage                  Kachel-Bild
  ├── sortOrder                     Kachel-Reihenfolge
  └── ...

Category (einzeln)              →   /[category]-Seite
  ├── title                         Seitentitel + Header
  ├── heroImage                     Hero-Bild
  ├── description                   Beschreibung
  └── content (blocks):
      ├── headingBlock          →   Überschrift-Abschnitt
      ├── richTextBlock         →   Freitext-Abschnitt
      ├── imageTextBlock        →   Bild+Text-Abschnitt
      └── galleryBlock          →   Bildergalerie

Images                          →   Einzelne Fotos
  ├── image (Media)                 Bild-URL
  ├── alt                           Alt-Text
  ├── caption                       Bildunterschrift
  ├── date                          Aufnahmedatum
  └── story                         Geschichte zum Bild
```

## Arbeitsreihenfolge

| # | Schritt | Aufwand |
|---|---------|---------|
| 1 | SiteSettings Global erstellen | Klein |
| 2 | Categories-Collection erweitern (previewImage, sortOrder, neue Blocks) | Mittel |
| 3 | `src/lib/payload.ts` – Daten-Abruf-Funktionen | Mittel |
| 4 | ImageTextBlock + HeadingBlock Components | Mittel |
| 5 | BlockRenderer erweitern | Klein |
| 6 | Homepage auf CMS-Daten umstellen | Mittel |
| 7 | Kategorie-Seiten auf CMS-Daten + BlockRenderer umstellen | Groß |
| 8 | Impressum/Datenschutz auf CMS umstellen | Klein |
| 9 | Branding-Components auf CMS umstellen | Klein |
| 10 | Seed-Script für Vorbestückung | Mittel |
| 11 | Migration ausführen + testen | Klein |
| 12 | Hardcodierte Daten entfernen | Klein |
