"use client";

export function ActionPanel() {
  return (
    <div className="flex h-full flex-col bg-white">

      {/* Header */}
      <div className="border-b px-5 py-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Actions
        </h2>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">

        <div className="flex items-center gap-3">
          <input type="checkbox" />
          <p className="text-sm text-gray-800">Update landing page</p>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" />
          <p className="text-sm text-gray-800">Fix auth bug</p>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" />
          <p className="text-sm text-gray-800">Write docs</p>
        </div>

      </div>

      {/* Footer */}
      <div className="border-t px-5 py-3 text-xs text-gray-500">
        3 tasks
      </div>
    </div>
  );
}