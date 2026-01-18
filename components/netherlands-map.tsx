"use client"

export function NetherlandsMap() {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/30 to-secondary/10">
      {/* SVG Map with styled paths */}
      <svg
        viewBox="3.359403 50.750938 7.227496 3.809468"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Import the Netherlands map paths */}
        <g fill="currentColor" className="text-primary/20" stroke="currentColor" strokeWidth="0.01">
          {/* Simplified Netherlands outline */}
          <path d="M 5.5 52.5 L 6.5 52.3 L 7 52.8 L 6.8 53.5 L 5.8 53.8 L 5.2 53.2 Z" />
          <path d="M 5.3 51.5 L 6.2 51.2 L 6.8 51.8 L 6.5 52.3 L 5.5 52.5 L 5.3 51.5 Z" />
          <path d="M 4.5 52 L 5.2 51.8 L 5.5 52.5 L 5 52.8 L 4.5 52 Z" />
        </g>

        {/* Amersfoort marker - positioned at 52.15°N, 5.39°E */}
        <g>
          {/* Outer pulse ring */}
          <circle
            cx="5.39"
            cy="52.15"
            r="0.15"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.02"
            className="text-primary/30 animate-pulse"
          />
          {/* Main dot */}
          <circle
            cx="5.39"
            cy="52.15"
            r="0.08"
            fill="currentColor"
            className="text-primary"
          />
        </g>
      </svg>

      {/* Label */}
      <div className="absolute bottom-6 left-6 right-6 bg-background/95 backdrop-blur-md rounded-lg p-4 border border-primary/20 shadow-lg">
        <p className="text-sm font-semibold text-foreground">Amersfoort</p>
        <p className="text-xs text-muted-foreground mt-1">
          Ons servicepunt in het hart van Nederland
        </p>
      </div>
    </div>
  )
}
