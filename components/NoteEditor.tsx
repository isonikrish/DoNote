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

  const editorRef = useRef<HTMLDivElement>(null);

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

  /* ---------------- Sync ContentEditable ---------------- */
  useEffect(() => {
    if (editorRef.current && data) {
      editorRef.current.innerText = data.content || "";
    }
  }, [data?.id]);

  /* ---------------- Selection Handler ---------------- */
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || "";

      setSelectedText(text);

      if (text && selection && selection.rangeCount > 0) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();

        if (rect.width || rect.height) {
          setActionPos({
            x: rect.left + rect.width / 2,
            y: rect.top - 45,
          });
          return;
        }
      }

      setActionPos(null);
    };

    const hideOnScroll = () => setActionPos(null);

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);
    window.addEventListener("scroll", hideOnScroll);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
      window.removeEventListener("scroll", hideOnScroll);
    };
  }, []);

  /* ---------------- Handlers ---------------- */
  const handleTitleChange = (value: string) => {
    setData((prev) => (prev ? { ...prev, title: value } : prev));
  };

  const handleContentInput = () => {
    if (!editorRef.current) return;

    const text = editorRef.current.innerText;

    setData((prev) => {
      if (!prev || prev.content === text) return prev;
      return { ...prev, content: text };
    });
  };

  const saveNote = async () => {
    if (!data) return;

    try {
      setSaving(true);

      await axios.put("/api/note/save", {
        noteId: data.id,
        title: data.title,
        content: editorRef.current?.innerText || "",
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
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentInput}
          className="w-full h-full outline-none text-sm text-gray-700 leading-relaxed whitespace-pre-wrap"
        />
      </div>
    </div>
  );
}