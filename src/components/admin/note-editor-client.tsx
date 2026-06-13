"use client";
import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import TableExtension from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Minus, Table, Image as ImageIcon, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props { subjects: any[] }

export function NoteEditorClient({ subjects }: Props) {
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const topics = selectedSubject?.topics ?? [];

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({ inline: false, allowBase64: true }),
      TableExtension.configure({ resizable: true }),
      TableRow, TableCell, TableHeader,
      Placeholder.configure({ placeholder: "Start writing your note here..." }),
    ],
    editorProps: {
      attributes: { class: "min-h-[400px] focus:outline-none p-4" },
    },
  });

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !editor) return;
      setUploadingImage(true);
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      setUploadingImage(false);
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        toast.error("Image upload failed");
      }
    };
    input.click();
  }, [editor]);

  const handleSave = async () => {
    if (!title || !topicId || !editor) { toast.error("Fill in all fields"); return; }
    setSaving(true);
    const res = await fetch("/api/admin/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, topicId, content: editor.getHTML(), isPremium }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Note saved!");
      setTitle(""); editor.commands.clearContent();
    } else {
      toast.error("Save failed");
    }
  };

  const ToolbarBtn = ({ onClick, active, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${active ? "bg-primary-100 text-primary-600" : "hover:bg-background text-muted hover:text-dark"}`}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-sora text-3xl font-bold text-dark">Note Editor</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Subject</Label>
          <Select value={subjectId} onValueChange={(v) => { setSubjectId(v); setTopicId(""); }}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select subject" /></SelectTrigger>
            <SelectContent>
              {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Topic</Label>
          <Select value={topicId} onValueChange={setTopicId} disabled={!subjectId}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select topic" /></SelectTrigger>
            <SelectContent>
              {topics.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Note Title</Label>
        <Input className="mt-1" placeholder="e.g. Introduction to Pharmacokinetics" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={isPremium} onCheckedChange={setIsPremium} />
        <Label>Premium content</Label>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-border p-2 flex flex-wrap gap-1">
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")}>
            <Bold className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")}>
            <Italic className="h-4 w-4" />
          </ToolbarBtn>
          <div className="w-px bg-border mx-1" />
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive("heading", { level: 1 })}>
            <Heading1 className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })}>
            <Heading2 className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive("heading", { level: 3 })}>
            <Heading3 className="h-4 w-4" />
          </ToolbarBtn>
          <div className="w-px bg-border mx-1" />
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")}>
            <List className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")}>
            <ListOrdered className="h-4 w-4" />
          </ToolbarBtn>
          <div className="w-px bg-border mx-1" />
          <ToolbarBtn onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
            <Table className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
            <Minus className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn onClick={handleImageUpload}>
            {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          </ToolbarBtn>
        </div>
        <EditorContent editor={editor} />
      </div>

      <Button onClick={handleSave} disabled={saving} size="lg">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Note
      </Button>
    </div>
  );
}
