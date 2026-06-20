# M+ | More Than Marche

Premium bilingual (IT / EN) one-page scrolling website for **M+ — More Than Marche**, a cultural & creative platform born in the Marche region of Italy.

Built with plain HTML, CSS and JavaScript — no build step, no dependencies. Just open `index.html` (or serve the folder) in a browser.

## Run locally

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Structure

```
index.html        # all sections (hero, 1–8, gallery, contact, footer)
css/styles.css    # design system + responsive layout
js/i18n.js        # all Italian + English content
js/gallery.js     # gallery image manifest
js/main.js        # language switch, scroll reveal, nav, forms, image slots
assets/logo/      # official M+ logo (mark + full lockup, light/dark variants)
assets/img/       # all photography (extracted from the supplied brand deck)
```

## Logo

The official M+ logo (from the supplied brand deck) is included as transparent PNGs:

```
logo-mark-light.png / logo-mark-dark.png   # "m+" mark — used in the navbar
logo-full-light.png / logo-full-dark.png   # full lockup — identity section + footer
```

`light` = ivory mark for dark backgrounds, `dark` = charcoal mark for light backgrounds.

## Adding images (the only allowed visuals)

The site uses **only** images you place in `assets/img/`. There are two places to wire them up:

### 1. Section image slots — `js/main.js`

Edit the `IMG_SLOTS` map and set the filename for each slot:

```js
const IMG_SLOTS = {
  hero:      "hero.jpg",
  about:     "about.jpg",
  mission:   "mission.jpg",
  meaning:   "meaning.jpg",
  manifesto: "manifesto.jpg"
};
```

### 2. Gallery — `js/gallery.js`

Add/replace entries in `GALLERY_ITEMS`. `span` controls the editorial footprint
(`g-third`, `g-half`, `g-two3`, `g-tall`, `g-full`, …):

```js
{ src: "gallery-01.jpg", span: "g-two3 g-tall", alt: { it: "Esperienza M+", en: "M+ Experience" } },
```

Empty `src` / empty slots render a styled placeholder tile so the layout stays intact until photos are added.

## Languages

Italian is the default. The IT / EN switcher lives in the navbar and footer; the
choice is remembered via `localStorage`. All copy is in `js/i18n.js`.
