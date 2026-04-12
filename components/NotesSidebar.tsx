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

      setNotes(res.data);

      // auto select first note
      if (res.data.length > 0) {
        setNoteId(res.data[0].id);
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

        // add to top
        setNotes((prev) => [newNote, ...prev]);

        // select it
        setNoteId(newNote.id);
      }
    } catch { }
  };

  return (
    <div className="flex h-full flex-col bg-white">

      {/* Header */}
      <div className="border-b px-5 py-4">
        <button
          onClick={newNote}
          className="w-full rounded-xl bg-black py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-900 transition cursor-pointer"
        >
          + New Note
        </button>
      </div>

      {/* Notes */}
      <div className="flex-1 overflow-y-auto text-black">

        {/* Loading */}
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Loading notes...
          </div>
        ) : notes.length === 0 ? (
          /* Empty State */
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500">
            No notes yet.
            <br />
            Create your first note.
          </div>
        ) : (
          /* Notes List */
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

      {/* Footer */}
      <div className="border-t px-5 py-3 text-xs text-gray-500">
        {loading ? "..." : `${notes.length} ${notes.length === 1 ? "note" : "notes"}`}
      </div>
    </div>
  );
}