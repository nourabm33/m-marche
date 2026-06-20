/* =========================================================================
   Gallery manifest
   ----------------------------------------------------------------------
   To add real photos: drop files into assets/img/ and list them below.
   Each item: { src, span, alt: {it, en} }
   - `span` controls the editorial grid footprint (see CSS .g-* classes).
   - Leave `src` empty ("") to render a styled placeholder tile.

   Until images are provided, ITEMS renders an editorial grid of empty
   tiles so the layout/rhythm is fully visible.
   ========================================================================= */

const GALLERY_ITEMS = [
  { src: "gallery-01.jpg", span: "g-two3 g-tall", alt: { it: "Cena a lume di candela", en: "Candlelit dinner" } },
  { src: "gallery-02.jpg", span: "g-third",       alt: { it: "Architettura industriale", en: "Industrial architecture" } },
  { src: "gallery-03.jpg", span: "g-third",       alt: { it: "Spazi e brand M+", en: "M+ spaces & brand" } },
  { src: "gallery-04.jpg", span: "g-third",       alt: { it: "Identità e oggetti", en: "Identity & objects" } },
  { src: "gallery-05.jpg", span: "g-third",       alt: { it: "Dettaglio della tavola", en: "Table detail" } },
  { src: "gallery-06.jpg", span: "g-half g-tall", alt: { it: "Cena monumentale", en: "Monumental dinner" } },
  { src: "gallery-07.jpg", span: "g-half",        alt: { it: "Paesaggio delle Marche", en: "Marche landscape" } },
  { src: "gallery-08.jpg", span: "g-third",       alt: { it: "Luoghi del territorio", en: "Places of the territory" } },
  { src: "gallery-09.jpg", span: "g-third",       alt: { it: "Tavola nel paesaggio", en: "Table in the landscape" } }
];

window.GALLERY_ITEMS = GALLERY_ITEMS;
