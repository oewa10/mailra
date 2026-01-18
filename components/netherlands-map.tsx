"use client"

import Image from "next/image"

export function NetherlandsMap() {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-background">
      <Image
        src="/netherlands.svg"
        alt="Kaart van Nederland"
        fill
        className="object-contain p-4"
      />
      
      {/* Amersfoort dot - positioned at approximately 52.15°N, 5.39°E */}
      {/* SVG viewBox is typically 0 0 960 1050 for the netherlands map */}
      <div 
        className="absolute w-4 h-4 bg-primary rounded-full shadow-lg animate-pulse"
        style={{
          left: "calc(50% + 8%)",
          top: "calc(50% - 12%)",
          transform: "translate(-50%, -50%)"
        }}
      >
        <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
      </div>

      {/* Label */}
      <div className="absolute bottom-6 left-6 right-6 bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-border">
        <p className="text-sm font-semibold text-foreground">Amersfoort</p>
        <p className="text-xs text-muted-foreground mt-1">
          Ons servicepunt in het hart van Nederland
        </p>
      </div>
    </div>
  )
}
