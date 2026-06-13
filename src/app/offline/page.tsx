export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-7xl mb-6">📴</div>
        <h1 className="font-sora text-3xl font-bold text-dark mb-3">You're offline</h1>
        <p className="text-muted text-lg mb-4 max-w-sm mx-auto">
          No internet connection. Previously visited notes and questions are available below.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 text-sm max-w-sm mx-auto">
          📚 Tip: Visit notes and questions while online to cache them for offline use.
        </div>
      </div>
    </div>
  );
}
