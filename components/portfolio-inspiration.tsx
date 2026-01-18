"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Define the portfolio categories
const categories = [
  { id: "bruiloften", label: "Bruiloften" },
  { id: "feesten", label: "Feesten" },
  { id: "zakelijk", label: "Zakelijk" }
]

// Define the portfolio items for each category
const portfolioItems = {
  bruiloften: [
    {
      id: 1,
      image: "/images/misc/misc (2).jpg",
      title: "Elegante Bruiloft Setting",
      description: "Stijlvolle opstelling met witte stoelen en gouden accenten voor een luxe bruiloft."
    },
    {
      id: 2,
      image: "/images/misc/misc (5).jpg",
      title: "Romantisch Diner",
      description: "Intieme tafelopstelling met prachtige decoratie voor het bruiloftsdiner."
    },
    {
      id: 3,
      image: "/images/misc/misc (8).jpg",
      title: "Ceremonie Opstelling",
      description: "Perfecte setting voor een buitenceremonie met natuurlijke elementen."
    }
  ],
  feesten: [
    {
      id: 1,
      image: "/images/misc/misc (11).jpg",
      title: "Verjaardagsfeest",
      description: "Kleurrijke opstelling voor een onvergetelijk verjaardagsfeest."
    },
    {
      id: 2,
      image: "/images/misc/misc (17).jpg",
      title: "Tuinfeest",
      description: "Gezellige setting voor een zomers tuinfeest met familie en vrienden."
    },
    {
      id: 3,
      image: "/images/misc/misc (22).jpg",
      title: "Jubileum Viering",
      description: "Elegante decoratie voor een speciale jubileumviering."
    }
  ],
  zakelijk: [
    {
      id: 1,
      image: "/images/misc/misc (13).jpg",
      title: "Conferentie Setup",
      description: "Professionele opstelling voor zakelijke conferenties en presentaties."
    },
    {
      id: 2,
      image: "/images/misc/misc (20).jpg",
      title: "Netwerk Evenement",
      description: "Stijlvolle setting voor netwerkevenementen en zakelijke recepties."
    },
    {
      id: 3,
      image: "/images/misc/misc (27).jpg",
      title: "Bedrijfsdiner",
      description: "Elegante tafelopstelling voor formele bedrijfsdiners."
    }
  ]
}

export function PortfolioInspiration() {
  const [activeCategory, setActiveCategory] = useState("bruiloften")

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-sm font-medium tracking-wider text-primary uppercase">Inspiratie</p>
          <h2 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl mt-2">
            Evenement Scenario's
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Ontdek hoe onze producten uw evenement kunnen transformeren met deze inspirerende voorbeelden.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border border-border p-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "px-6 py-2 text-sm font-medium rounded-md transition-all",
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioItems[activeCategory as keyof typeof portfolioItems].map((item) => (
            <div key={item.id} className="group overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-serif text-xl text-card">{item.title}</h3>
                  <p className="mt-2 text-sm text-card/80">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
