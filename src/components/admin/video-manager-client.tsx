"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2, Link2, CheckCircle2 } from "lucide-react";
import { extractYouTubeId } from "@/lib/utils";
import { toast } from "sonner";

interface Props { subjects: any[] }

export function VideoManagerClient({ subjects }: Props) {
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [saving, setSaving] = useState(false);

  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const topics = selectedSubject?.topics ?? [];
  const extractedId = extractYouTubeId(youtubeUrl);

  const handleSave = async () => {
    if (!topicId || !title || !extractedId) { toast.error("Fill all fields and enter a valid YouTube URL"); return; }
    setSaving(true);
    const res = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, title, youtubeId: extractedId, description, displayOrder: parseInt(displayOrder) }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Video saved!"); setTitle(""); setYoutubeUrl(""); setDescription(""); setDisplayOrder("0");
    } else toast.error("Save failed");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-sora text-3xl font-bold text-dark">Video Manager</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Subject</Label>
          <Select value={subjectId} onValueChange={(v) => { setSubjectId(v); setTopicId(""); }}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select subject" /></SelectTrigger>
            <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Topic</Label>
          <Select value={topicId} onValueChange={setTopicId} disabled={!subjectId}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select topic" /></SelectTrigger>
            <SelectContent>{topics.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>YouTube URL or Video ID</Label>
        <div className="relative mt-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input className="pl-10" placeholder="https://youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
        </div>
        {youtubeUrl && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            {extractedId ? (
              <><CheckCircle2 className="h-4 w-4 text-green-500" /><span className="text-green-600 font-mono">ID: {extractedId}</span></>
            ) : (
              <span className="text-red-500">Invalid YouTube URL</span>
            )}
          </div>
        )}
      </div>

      {extractedId && (
        <div className="rounded-2xl overflow-hidden border border-border">
          <img src={`https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`} alt="Preview" className="w-full object-cover max-h-48" />
        </div>
      )}

      <div>
        <Label>Video Title</Label>
        <Input className="mt-1" placeholder="e.g. Introduction to Drug Metabolism" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label>Description (optional)</Label>
        <Textarea className="mt-1" placeholder="Brief description of the video content..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      <div>
        <Label>Display Order</Label>
        <Input className="mt-1" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
      </div>

      <Button onClick={handleSave} disabled={saving} size="lg">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Video
      </Button>
    </div>
  );
}
