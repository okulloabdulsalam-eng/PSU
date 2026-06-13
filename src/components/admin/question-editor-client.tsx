"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Props { subjects: any[] }

const emptyOption = { text: "", isCorrect: false };

export function QuestionEditorClient({ subjects }: Props) {
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [text, setText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [type, setType] = useState("MCQ");
  const [year, setYear] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [explanationImageUrl, setExplanationImageUrl] = useState("");
  const [options, setOptions] = useState([...Array(4)].map(() => ({ ...emptyOption })));
  const [saving, setSaving] = useState(false);

  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const topics = selectedSubject?.topics ?? [];

  const handleOptionChange = (i: number, field: "text" | "isCorrect", value: any) => {
    setOptions((prev) => {
      const next = [...prev];
      if (field === "isCorrect") next.forEach((o, idx) => (o.isCorrect = idx === i));
      else next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const handleImageUpload = async (setter: (url: string) => void) => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const form = new FormData(); form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) setter(data.url);
    };
    input.click();
  };

  const handleSave = async () => {
    if (!topicId || !text || !explanation) { toast.error("Fill in all required fields"); return; }
    if (!options.some((o) => o.isCorrect)) { toast.error("Mark one option as correct"); return; }
    setSaving(true);
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId, text, explanation, difficulty, type, isPremium, pastExamYear: year ? parseInt(year) : null, imageUrl: imageUrl || null, explanationImageUrl: explanationImageUrl || null, options }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Question saved!");
      setText(""); setExplanation(""); setImageUrl(""); setExplanationImageUrl("");
      setOptions([...Array(4)].map(() => ({ ...emptyOption })));
    } else toast.error("Save failed");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-sora text-3xl font-bold text-dark">Question Editor</h1>

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
        <div>
          <Label>Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Question Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MCQ">MCQ</SelectItem>
              <SelectItem value="TRUE_FALSE">True / False</SelectItem>
              <SelectItem value="FILL_BLANK">Fill in the Blank</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Past Exam Year (optional)</Label>
          <Input className="mt-1" type="number" placeholder="e.g. 2023" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
        <div className="flex items-center gap-3 mt-6">
          <Switch checked={isPremium} onCheckedChange={setIsPremium} />
          <Label>Premium question</Label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <Label>Question Text *</Label>
          <button type="button" onClick={() => handleImageUpload(setImageUrl)} className="text-xs text-primary-500 flex items-center gap-1 hover:underline">
            <ImageIcon className="h-3 w-3" /> Add image
          </button>
        </div>
        <Textarea placeholder="Type the question here..." value={text} onChange={(e) => setText(e.target.value)} rows={4} />
        {imageUrl && <img src={imageUrl} alt="Question" className="mt-2 rounded-xl max-h-40 object-contain" />}
      </div>

      <div>
        <Label className="mb-3 block">Answer Options</Label>
        <div className="space-y-3">
          {options.map((opt, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${opt.isCorrect ? "border-green-400 bg-green-50" : "border-border"}`}>
              <button
                type="button"
                onClick={() => handleOptionChange(i, "isCorrect", true)}
                className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${opt.isCorrect ? "border-green-500 bg-green-500" : "border-border hover:border-green-400"}`}
              >
                {opt.isCorrect && <CheckCircle2 className="h-4 w-4 text-white" />}
              </button>
              <span className="font-bold text-sm text-muted shrink-0">{String.fromCharCode(65 + i)}.</span>
              <Input placeholder={`Option ${String.fromCharCode(65 + i)}`} value={opt.text} onChange={(e) => handleOptionChange(i, "text", e.target.value)} className="flex-1" />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-2">Click the circle to mark the correct answer</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <Label>Explanation *</Label>
          <button type="button" onClick={() => handleImageUpload(setExplanationImageUrl)} className="text-xs text-primary-500 flex items-center gap-1 hover:underline">
            <ImageIcon className="h-3 w-3" /> Add image
          </button>
        </div>
        <Textarea placeholder="Explain why the correct answer is correct..." value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={4} />
        {explanationImageUrl && <img src={explanationImageUrl} alt="Explanation" className="mt-2 rounded-xl max-h-40 object-contain" />}
      </div>

      <Button onClick={handleSave} disabled={saving} size="lg">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Question
      </Button>
    </div>
  );
}
