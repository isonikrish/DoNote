"use client";
export function NoteEditor({ noteId }: { noteId: number | null}) {
  console.log(noteId)
  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="border-b px-6 py-4">
        <input
          placeholder="Untitled Note"
          className="w-full text-xl font-semibold outline-none"
        />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4">
        <textarea
          placeholder="Start writing your note..."
          className="w-full h-full resize-none outline-none text-sm text-gray-700 leading-relaxed"
        />
      </div>
    </div>
  );
}