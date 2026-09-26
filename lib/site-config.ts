// Central place for brand + contact details.
// "details come later" — everything below is a clearly-marked placeholder,
// change it here once and it updates everywhere (header, footer, forms,
// JSON-LD, metadata, WhatsApp messages).

export const siteConfig = {
  brandFull: "Caftan by Mailra",
  brandShort: "Mailra",
  tagline: "Jouw feest, onze sfeer.",
  description:
    "Caftan by Mailra verhuurt hoogwaardige stoelen, tafels en decoratie voor bruiloften, feesten en zakelijke evenementen door heel Nederland.",

  url: "https://www.mailra.nl", // TODO: confirm live domain

  phone: {
    display: "+31 6 1234 5678",
    href: "tel:+31612345678",
  },
  email: "info@mailra.nl",
  whatsapp: {
    // Used for the WhatsApp deep-link ("coupled number").
    // International format, digits only, no leading +.
    number: "31612345678",
  },
  address: {
    locality: "Amsterdam",
    region: "Noord-Holland",
    country: "NL",
    display: "Amsterdam, Nederland",
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
    "Amsterdam",
    "Rotterdam",
    "Den Haag",
    "Utrecht",
    "Noord-Holland",
    "Zuid-Holland",
    "Noord-Brabant",
    "Gelderland",
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
