"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  description?: string;
  durationSecs: number;
}

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoGrid({ videos }: { videos: Video[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (videos.length === 0) {
    return <div className="text-center py-12 text-muted">No videos yet for this topic.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="bg-surface rounded-2xl border border-border overflow-hidden">
          {activeId === video.id ? (
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <button
              className="relative aspect-video w-full group"
              onClick={() => setActiveId(video.id)}
            >
              <Image
                src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                alt={video.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 text-primary-500 ml-1" />
                </div>
              </div>
              {video.durationSecs > 0 && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                  {formatDuration(video.durationSecs)}
                </div>
              )}
            </button>
          )}
          <div className="p-3">
            <h3 className="font-sora font-semibold text-dark text-sm leading-tight">{video.title}</h3>
            {video.description && <p className="text-xs text-muted mt-1 line-clamp-2">{video.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
