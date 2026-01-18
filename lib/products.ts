export interface Product {
  id: string
  name: string
  category: "stoelen" | "tafels" | "decoratie"
  description: string
  dimensions?: string
  capacity?: string
  image: string
}

export const products: Product[] = [
  // Stoelen
  {
    id: "chiavari-stoel",
    name: "Chiavari Stoel",
    category: "stoelen",
    description: "Elegante chiavari stoel, perfect voor bruiloften en formele evenementen.",
    dimensions: "40 x 40 x 92 cm",
    image: "/products/chiavari-chair.jpg",
  },
  {
    id: "crossback-stoel",
    name: "Crossback Stoel",
    category: "stoelen",
    description: "Rustieke crossback stoel met karakteristieke X-vormige rugleuning.",
    dimensions: "45 x 45 x 88 cm",
    image: "/products/crossback-chair.jpg",
  },
  {
    id: "ghost-stoel",
    name: "Ghost Stoel",
    category: "stoelen",
    description: "Moderne transparante stoel voor een stijlvol en eigentijds effect.",
    dimensions: "38 x 40 x 90 cm",
    image: "/products/ghost-chair.jpg",
  },
  {
    id: "velvet-stoel",
    name: "Velvet Stoel",
    category: "stoelen",
    description: "Luxe velvet stoel met zachte bekleding voor extra comfort.",
    dimensions: "50 x 50 x 85 cm",
    image: "/products/velvet-chair.jpg",
  },
  // Tafels
  {
    id: "ronde-tafel-150",
    name: "Ronde Tafel 150cm",
    category: "tafels",
    description: "Klassieke ronde tafel, ideaal voor dineropstellingen.",
    dimensions: "150 cm diameter, 76 cm hoog",
    capacity: "8 personen",
    image: "/products/round-table.jpg",
  },
  {
    id: "rechthoekige-tafel",
    name: "Rechthoekige Tafel",
    category: "tafels",
    description: "Veelzijdige rechthoekige tafel voor diverse opstellingen.",
    dimensions: "180 x 80 x 76 cm",
    capacity: "6-8 personen",
    image: "/products/rectangular-table.jpg",
  },
  {
    id: "cocktail-tafel",
    name: "Cocktail Tafel",
    category: "tafels",
    description: "Statafel perfect voor recepties en netwerkevenementen.",
    dimensions: "60 cm diameter, 110 cm hoog",
    capacity: "4-6 personen staand",
    image: "/products/cocktail-table.jpg",
  },
  {
    id: "lange-tafel",
    name: "Lange Tafel",
    category: "tafels",
    description: "Imposante lange tafel voor feestelijke diners.",
    dimensions: "240 x 90 x 76 cm",
    capacity: "10-12 personen",
    image: "/products/long-table.jpg",
  },
  // Decoratie
  {
    id: "bloemenvaas",
    name: "Glazen Bloemenvaas",
    category: "decoratie",
    description: "Elegante glazen vaas voor bloemstukken en tafeldecoratie.",
    dimensions: "15 x 15 x 30 cm",
    image: "/products/vase.jpg",
  },
  {
    id: "kandelaar",
    name: "Kandelaar Set",
    category: "decoratie",
    description: "Set van 3 gouden kandelaars voor sfeervolle verlichting.",
    dimensions: "Verschillende hoogtes",
    image: "/products/candle-holder.jpg",
  },
  {
    id: "tafelloper",
    name: "Tafelloper",
    category: "decoratie",
    description: "Luxe tafelloper beschikbaar in diverse kleuren.",
    dimensions: "30 x 200 cm",
    image: "/products/table-runner.jpg",
  },
  {
    id: "backdrop",
    name: "Backdrop Frame",
    category: "decoratie",
    description: "Decoratief backdrop frame voor foto-opstellingen.",
    dimensions: "200 x 220 cm",
    image: "/products/backdrop.jpg",
  },
]

export const categories = [
  { id: "stoelen", name: "Stoelen", description: "Elegante stoelen voor elke gelegenheid" },
  { id: "tafels", name: "Tafels", description: "Tafels in diverse maten en stijlen" },
  { id: "decoratie", name: "Decoratie", description: "Decoratieve items voor de perfecte sfeer" },
] as const

export type Category = (typeof categories)[number]["id"]
