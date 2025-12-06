Vier Kacheln 

Business & Event / Hochzeiten & Feiern / Familie & Kind / Kindergarten

Die Bereiche kommen aus einem Blur hinter dem Benutzer, erscheinen sanft und manifestieren sich.

Im Hintegrund ein Bild das zu dem aktuell gehoverten Bereich passt, eher Bokeh ohne Menschen
Aktuell gehoverter Bereich wird hervorgehoben, andere Bereiche werden treten zurück
- ggf aktuelles größer 1,5x, andere werden kleiner 0,5x, ggf etwas blur oder mehr schwarzweiß bei den gerade nicht aktiven Bereichen
- Der Hintergrund wechselt je nach aktivem Bereich

Mobil ist der oberste Bereich groß, die anderen in recht klein schon sichtbar, mit den gleichen Effekten wie non-mobil.
Beim Scrollen wird das Bild vom nächsten Bereich größer, der aktuelle kleiner


Fine portraits for fine people


Die Bilder für die Bereiche und die Gallerie können auch nur Ausschnitte anzeigen, beim Aktivieren/Zoom wird das ganze Bild angezeigt, das Passepartout rückt zur Seite


Bei Bereichsklick explodiert der Bereich

Weißer Hintergrund sonst so

Bereich oben mit Headerbild


Breadcrumbs oben
Fullscreen Bilder Mit Logo oben links?

Kindergarten mit 4 Kacheln oben, wie die Hauptseite, aber die Kacheln scrollen on click zu dem Bereich
Login|Gallerie|Infos für Eltern|Infos für Kitas

Zugangscode für Kindergarten:
<div class="fotocdn-integrator"><div class="fotocdn-integrator-guestbox" data-language="deu" data-backlink-url="" data-target="https://kathrinkrause.fotograf.de"></div></div><script type="text/javascript">!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//integration.fotocdn.de/fotocdn-integration/4bhr9g4u.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","fotocdn-sdk");</script>


# Website-Konzept: die-menschenfotografin.de

## Hauptseite

### Branding
**Kathrin Krause - die Menschenfotografin**

**Position:**
- Zentral zwischen den 4 Bereichen
- 2 Kacheln darüber
- 2 Kacheln darunter

**Verhalten:**
- Initial: groß dargestellt
- Bei Bereichsaktivierung: tritt zurück/wird kleiner

**Tagline:** "Fine portraits for fine people"

### Navigation/Bereiche
4 Kacheln:
- Business & Event
- Hochzeiten & Feiern
- Familie & Kind
- Kindergarten

### Animations-/Interaktionskonzept

**Initial Animation:**
- Kacheln kommen aus Blur hinter dem Benutzer
- Erscheinen sanft
- Manifestieren sich
- Viel mit Zoom-Effekten

**Hintergrund:**
- Bokeh-Bild passend zum aktuell gehoverten Bereich
- Keine Menschen
- Wechselt dynamisch je nach aktivem Bereich

**Hover-Effekte (Desktop):**
- Aktiver Bereich: 1,5x Größe
- Andere Bereiche: 0,5x Größe
- Nicht-aktive Bereiche: leichter Blur + teilweise Entsättigung (nicht komplett SW)

**Übergang beim Klick:**
- Bereich "explodiert" / Zoom-In-Animation
- Bild wird Hintergrund der Bereichsseite
- Passepartout rückt zur Seite

### Mobile Ansicht
- Oberster Bereich: groß dargestellt
- Andere Bereiche: klein, aber sichtbar
- Beim Scrollen: nächstes Bild wird größer, aktuelles kleiner
- Gleiche Effekte wie Desktop-Version

## Bilddarstellung (Global)

**Ausschnitt-Logik:**
- Nicht-Fullscreen: Teilausschnitt aus Bild
- Hover/Active: Ausschnitt wird größer (Zoom)
- Fullscreen/Bereichsheader: ganzes Bild sichtbar

## Bereichsseiten

### Struktur
- Header mit Bild (Übergangs-Hintergrund vom Klick, ganzes Bild)
- Breadcrumbs oben
- Weißer Hintergrund für Content

### Content-Bausteine (aus PayloadCMS)
Mix aus:
- Gallerien
- Texten
- Alternierende Layouts:
  - Zeile 1: [Text][Bild]
  - Zeile 2: [Bild][Text]
  - etc.

### Bilddarstellung
- Fullscreen-Bilder (ganzes Bild)
- Logo oben links (optional)

## Kindergarten-Bereich (Spezial)

### Navigation
4 Kacheln (wie Hauptseite):
- Login
- Gallerie
- Infos für Eltern
- Infos für Kitas

**Verhalten:**
- Kacheln scrollen bei Click zum jeweiligen Bereich

### Zugang
- Login-geschützt (nur Kindergarten-Kunden)
- Zugangscode-Schutz
- Implementierung per JavaScript

## Tech Stack

### Frontend
- React SPA
- Static Prerendering

### CMS
- PayloadCMS (Headless)
- Content-Bausteine für Bereichsinhalte

### Hosting & Deployment
- Cloudflare Pages
- Thumbnails werden statisch vorgerendert
- Build-Trigger bei Änderungen im PayloadCMS
- Alle generierten Thumbnails werden deployed

### Zugriff
- Öffentliche Seite (außer Kindergarten-Bereich)
- Login nur für Kindergarten-Kunden
