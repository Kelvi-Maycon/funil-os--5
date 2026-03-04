export function SkeletonCard() {
  return (
    <div className="card-premium p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-5 w-14 rounded-full" />
      </div>
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-3/4 rounded" />
      <div className="skeleton h-1 w-full rounded-full" />
      <div className="flex gap-4">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-3 w-16 rounded" />
      </div>
    </div>
  )
}

export function SkeletonMetrics() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="metric-card">
          <div className="skeleton h-9 w-9 rounded-lg mb-3" />
          <div className="skeleton h-7 w-16 rounded mb-2" />
          <div className="skeleton h-3 w-24 rounded" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonTaskList() {
  return (
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="task-row">
          <div className="skeleton h-4 w-4 rounded" />
          <div className="skeleton h-3 flex-1 rounded" />
          <div className="skeleton h-5 w-12 rounded-full" />
        </div>
      ))}
    </div>
  )
}
