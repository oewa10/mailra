// Central place for brand + contact details. Change it here once and it updates everywhere
// (header, footer, forms, JSON-LD, metadata, WhatsApp messages).

export const siteConfig = {
  brandFull: "Caftan by Mailra",
  brandShort: "Mailra",
  tagline: "Jouw feest, onze sfeer.",
  description:
    "Caftan by Mailra uit Amersfoort verhuurt stoelen, tafels, decoratie en caftans voor bruiloften, henna-avonden en feesten door heel Nederland.",

  // The one canonical host; www.mailra.nl redirects here (next.config.mjs).
  url: "https://mailra.nl",

  phone: {
    display: "+31 6 38051319",
    href: "tel:+31638051319",
  },
  email: "Fatimabouyafsakh@hotmail.com",
  whatsapp: {
    // Used for the WhatsApp deep-link ("coupled number").
    // International format, digits only, no leading +.
    number: "31638051319",
  },
  address: {
    locality: "Amersfoort",
    region: "Utrecht",
    country: "NL",
    display: "Amersfoort, Nederland",
  },
  hours: {
    display: "Ma – Za: 9:00 – 18:00",
    closed: "Zondag gesloten",
  },
  social: {
    instagram: "", // TODO
    facebook: "", // TODO
  },
  serviceAreas: [
    "Amersfoort",
    "Utrecht",
    "Amsterdam",
    "Rotterdam",
    "Den Haag",
    "Provincie Utrecht",
    "Gelderland",
    "Noord-Holland",
    "Zuid-Holland",
  ],
} as const

/**
 * Builds a wa.me deep link that opens WhatsApp (app or web) with a
 * pre-filled message addressed to the coupled Mailra WhatsApp number.
 * No backend involved — this is how both contact forms "submit".
 */
export function buildWhatsAppLink(message: string) {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encoded}`
}

/** Plain chat link to the Mailra WhatsApp number, without a pre-filled message. */
export const whatsAppChatUrl = `https://wa.me/${siteConfig.whatsapp.number}`
