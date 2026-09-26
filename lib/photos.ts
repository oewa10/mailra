/**
 * Every editorial photo on the public site, in one place.
 *
 * A slot without `src` renders as a labelled placeholder showing its brief, so the page keeps its
 * layout until the real photo exists. To fill one: put the file in /public/images/site/, set `src`
 * (and check `alt`), done. Product photos are not listed here; they are managed in the admin.
 */
export type PhotoSlot = {
  id: string
  /** Short name shown on the placeholder. */
  label: string
  /** What to photograph, for the shoot list. */
  brief: string
  /** Orientation and the smallest size that still looks sharp full-width. */
  format: string
  alt: string
  src?: string
}

const slot = (s: PhotoSlot) => s

export const photos = {
  hero: slot({
    id: "home-hero",
    label: "Homepage — openingsfoto",
    brief:
      "Brede sfeerfoto van een complete Mailra-opstelling op locatie: gedekte tafels met onze stoelen, bloemen en verlichting, bij voorkeur in het gouden uur. Houd de linkerhelft rustig voor de titel.",
    format: "Liggend 16:9 · min. 2400 × 1350 px",
    alt: "Complete tafelopstelling van Mailra op een feestlocatie",
    src: "/images/site/hero.webp",
  }),
  categoryStoelen: slot({
    id: "category-stoelen",
    label: "Categorie Stoelen",
    brief: "Rij van onze eigen stoelen in een echte opstelling (ceremonie of diner), dichtbij met een zachte achtergrond.",
    format: "Staand 4:5 · min. 1600 × 2000 px",
    alt: "Stoelen van Mailra opgesteld voor een ceremonie",
    src: "/images/site/stoelen.webp",
  }),
  categoryTafels: slot({
    id: "category-tafels",
    label: "Categorie Tafels",
    brief: "Gedekte tafel van ons met linnen, servies en bloemstuk, gefotografeerd op ooghoogte.",
    format: "Liggend 16:10 · min. 1600 × 1000 px",
    alt: "Gedekte tafel van Mailra met bloemstuk",
    src: "/images/site/tafels.webp",
  }),
  categoryDecoratie: slot({
    id: "category-decoratie",
    label: "Categorie Decoratie",
    brief: "Detail van onze decoratie in een echte opstelling: bloemenboog, kandelaars of backdrop.",
    format: "Liggend 16:10 · min. 1600 × 1000 px",
    alt: "Decoratie van Mailra op een feest",
    src: "/images/site/decoratie.webp",
  }),
  about: slot({
    id: "over-ons",
    label: "Over ons",
    brief: "Sfeervol detail van een eigen opstelling.",
    format: "Staand 4:5 · min. 1600 × 2000 px",
    alt: "Sfeervolle decoratie van Caftan by Mailra",
    src: "/about-us.jpg",
  }),
  contact: slot({
    id: "contact",
    label: "Contact",
    brief: "Gasten die proosten aan een door ons gestylede tafel.",
    format: "Staand 4:5 · min. 1600 × 2000 px",
    alt: "Gasten proosten aan een feestelijk gedekte tafel",
    src: "/images/werk/gasten-proosten-feesttafel.jpg",
  }),
  delivery: slot({
    id: "over-ons-levering",
    label: "Over ons — levering & opbouw",
    brief: "Ons team dat de bus inlaadt en op locatie opbouwt, als bewijs van de volledige service.",
    format: "Liggend 16:9 · min. 2000 × 1125 px",
    alt: "Ons team laadt stoelen en tafels in de bus en bouwt ze op bij een landgoed voor een bruiloft",
    src: "/images/werk/levering-opbouw-landgoed.jpg",
  }),
}

/** Real work, shown in the "Uit ons werk" gallery on the homepage. */
export const gallery: PhotoSlot[] = [
  {
    id: "gallery-1",
    label: "Bruidstafel",
    brief: "",
    format: "",
    alt: "Bruidstafel onder een bloemenboog",
    src: "/images/werk/bruidstafel-bloemenboog.jpg",
  },
  {
    id: "gallery-2",
    label: "Diner bij kaarslicht",
    brief: "",
    format: "",
    alt: "Lange dinertafel bij kaarslicht met rozen",
    src: "/images/werk/dinertafel-kaarslicht-rozen.jpg",
  },
  {
    id: "gallery-3",
    label: "Sweet table",
    brief: "",
    format: "",
    alt: "Taarttafel met pampasgras en rotan lantaarns",
    src: "/images/werk/sweet-table-pampasgras.jpg",
  },
  {
    id: "gallery-4",
    label: "Lounge met draperieën",
    brief: "",
    format: "",
    alt: "Bruid op een loungebank met gele draperieën en bloemen",
    src: "/images/werk/lounge-draperieen-bloemen.jpg",
  },
]
