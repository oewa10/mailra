"use client"

import Image from "next/image"

export function NetherlandsMap() {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-background">
      <Image
        src="/nl.svg"
        alt="Kaart van Nederland"
        fill
        className="object-contain p-8"
      />
    </div>
  )
}
