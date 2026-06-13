export default function SubjectsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-border rounded-xl w-40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border h-48" />
        ))}
      </div>
    </div>
  );
}
