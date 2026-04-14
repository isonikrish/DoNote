"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import useAppStore from "@/stores/useApp";

type Note = {
  id: number;
  title: string;
  createdAt: string;
};

export function NotesSidebar() {
  const { selectedNoteId, setNoteId } = useAppStore();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyNotes = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/note/all-notes");

      const sorted = res.data.sort(
        (a: Note, b: Note) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNotes(sorted);
      if (sorted.length > 0) {
        setNoteId(sorted[0].id);
      }

    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyNotes();
  }, []);

  const newNote = async () => {
    try {
      const res = await axios.post("/api/note/new");

      if (res.status === 200) {
        const newNote = res.data;

        setNotes((prev) => [newNote, ...prev]);

        setNoteId(newNote.id);
      }
    } catch { }
  };

  return (
    <div className="flex h-full flex-col bg-white">

      <div className="border-b px-5 py-4">
        <button
          onClick={newNote}
          className="w-full rounded-xl bg-black py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-900 transition cursor-pointer"
        >
          + New Note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto text-black">

        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Loading notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500">
            No notes yet.
            <br />
            Create your first note.
          </div>
        ) : (
          <div className="flex flex-col">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setNoteId(note.id)}
                className={`px-5 py-3 border cursor-pointer transition ${selectedNoteId === note.id
                  ? "bg-gray-100 border-gray-200"
                  : "hover:bg-gray-50 border-gray-200"
                  }`}
              >
                <p className="text-sm font-medium truncate">
                  {note.title || "Untitled"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}