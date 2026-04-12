import { NotesSidebar } from "@/components/NotesSidebar";
import { ActionPanel } from "@/components/ActionPanel";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-white overflow-hidden">

      {/* Sidebar */}
      <div className="w-72 border-r">
        <NotesSidebar />
      </div>

      {/* Dynamic Editor */}
      <div className="flex-1">
        {children}
      </div>

      {/* Action Panel */}
      <div className="w-80 border-l hidden lg:block">
        <ActionPanel />
      </div>
    </div>
  );
}