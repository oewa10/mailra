// Shown instantly while a panel page loads its data, so navigation never feels stuck.
export default function AdminLoading() {
  return (
    <div className="animate-pulse" role="status" aria-label="Laden…">
      <div className="h-3 w-24 bg-linen" />
      <div className="mt-3 h-9 w-64 bg-linen" />
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 border border-hairline bg-surface" />
        ))}
      </div>
      <div className="mt-8 space-y-px border border-hairline bg-hairline">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-surface" />
        ))}
      </div>
    </div>
  )
}
