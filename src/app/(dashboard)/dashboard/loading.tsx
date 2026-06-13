export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-border rounded-xl w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border p-5 h-28" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-surface rounded-2xl border border-border h-64" />
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border h-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border h-36" />
        ))}
      </div>
    </div>
  );
}
