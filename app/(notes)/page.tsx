"use client";

import { useParams } from "next/navigation";
import { NoteEditor } from "@/components/NoteEditor";
import useAppStore from "@/stores/useApp";

export default function NotePage() {
  const params = useParams();
  const { selectedNoteId: noteId } = useAppStore()

  return <NoteEditor noteId={noteId} />;
}