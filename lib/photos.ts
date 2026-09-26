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
  }),
  categoryStoelen: slot({
    id: "category-stoelen",
    label: "Categorie Stoelen",
    brief: "Rij van onze eigen stoelen in een echte opstelling (ceremonie of diner), dichtbij met een zachte achtergrond.",
    format: "Staand 4:5 · min. 1600 × 2000 px",
    alt: "Stoelen van Mailra opgesteld voor een ceremonie",
  }),
  categoryTafels: slot({
    id: "category-tafels",
    label: "Categorie Tafels",
    brief: "Gedekte tafel van ons met linnen, servies en bloemstuk, gefotografeerd op ooghoogte.",
    format: "Liggend 16:10 · min. 1600 × 1000 px",
    alt: "Gedekte tafel van Mailra met bloemstuk",
  }),
  categoryDecoratie: slot({
    id: "category-decoratie",
    label: "Categorie Decoratie",
    brief: "Detail van onze decoratie in een echte opstelling: bloemenboog, kandelaars of backdrop.",
    format: "Liggend 16:10 · min. 1600 × 1000 px",
    alt: "Decoratie van Mailra op een feest",
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
    src: "/images/misc/misc (22).jpg",
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
    src: "/images/misc/misc (20).jpg",
  },
  {
    id: "gallery-2",
    label: "Diner bij kaarslicht",
    brief: "",
    format: "",
    alt: "Lange dinertafel bij kaarslicht met rozen",
    src: "/images/misc/misc (13).jpg",
  },
  {
    id: "gallery-3",
    label: "Sweet table",
    brief: "",
    format: "",
    alt: "Taarttafel met pampasgras en rotan lantaarns",
    src: "/images/misc/misc (8).jpg",
  },
  {
    id: "gallery-4",
    label: "Lounge met draperieën",
    brief: "",
    format: "",
    alt: "Bruid op een loungebank met gele draperieën en bloemen",
    src: "/images/misc/misc (2).jpg",
  },
]
