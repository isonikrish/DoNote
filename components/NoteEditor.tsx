"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

type Note = {
  id: number;
  title: string;
  content: string;
};

export function NoteEditor({ noteId }: { noteId: number | null }) {
  const [data, setData] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [actionPos, setActionPos] = useState<{ x: number; y: number } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ---------------- Fetch Note ---------------- */
  useEffect(() => {
    if (!noteId) return;

    let isMounted = true;
    setLoading(true);

    axios
      .get(`/api/note/fetch/${noteId}`)
      .then((res) => {
        if (isMounted) setData(res.data);
      })
      .catch(() => {
        if (isMounted) setData(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [noteId]);

  /* ---------------- Selection Handler ---------------- */
  const handleSelection = () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;

    const text = el.value.substring(start, end).trim();
    setSelectedText(text);

    if (text.length > 0) {
      const rect = el.getBoundingClientRect();

      // approximate position (textarea doesn't give exact range position)
      setActionPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 40,
      });
    } else {
      setActionPos(null);
    }
  };

  /* ---------------- Handlers ---------------- */
  const handleTitleChange = (value: string) => {
    setData((prev) => (prev ? { ...prev, title: value } : prev));
  };

  const handleContentChange = (value: string) => {
    setData((prev) => (prev ? { ...prev, content: value } : prev));
  };

  const saveNote = async () => {
    if (!data) return;

    try {
      setSaving(true);

      await axios.put("/api/note/save", {
        noteId: data.id,
        title: data.title,
        content: data.content,
      });
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTask = async () => {
    if (!selectedText.trim()) return;

    try {
      await axios.post("/api/task/add", {
        title: selectedText,
        noteId,
      });
    } catch (err) {
      console.error("Task creation failed:", err);
    } finally {
      setActionPos(null);
    }
  };

  /* ---------------- UI States ---------------- */
  if (!noteId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a note
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Note not found
      </div>
    );
  }

  /* ---------------- Render ---------------- */
  return (
    <div className="h-full flex flex-col relative">

      {/* Floating Action Button */}
      {actionPos && (
        <button
          style={{
            position: "fixed",
            top: actionPos.y,
            left: actionPos.x,
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
          className="px-3 py-1 text-xs bg-black text-white rounded-md shadow cursor-pointer"
          onClick={handleAddTask}
        >
          + Add action
        </button>
      )}

      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between gap-4">
        <input
          value={data.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled Note"
          className="w-full text-xl font-semibold outline-none text-black"
        />

        <button
          onClick={saveNote}
          disabled={saving}
          className="rounded-xl cursor-pointer bg-black px-4 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4">
        <textarea
          ref={textareaRef}
          value={data.content}
          onChange={(e) => handleContentChange(e.target.value)}
          onMouseUp={handleSelection}
          onKeyUp={handleSelection}
          placeholder="Start writing your note..."
          className="w-full h-full resize-none outline-none text-sm text-gray-700 leading-relaxed"
        />
      </div>
    </div>
  );
}