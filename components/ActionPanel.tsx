"use client";

import useAppStore from "@/stores/useApp";
import axios from "axios";
import { useEffect, useState } from "react";

type Filter = "ALL" | "PENDING" | "DONE";

export function ActionPanel() {
  const { setNoteId } = useAppStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");

  /* ---------------- Fetch ---------------- */
  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/task/fetch-tasks");
      if (res.status === 200) {
        setTasks(res.data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ---------------- Toggle ---------------- */
  const toggleStatus = async (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === "DONE" ? "PENDING" : "DONE" }
          : t
      )
    );

    try {
      await axios.put("/api/task/toggle-status", { taskId });
    } catch {
      fetchTasks();
    }
  };

  /* ---------------- Filtered Tasks ---------------- */
  const filteredTasks =
    filter === "ALL"
      ? tasks
      : tasks.filter((t) => t.status === filter);

  /* ---------------- Task Row ---------------- */
  const TaskRow = (task: Task) => (
    <div
      key={task.id}
      className="group flex flex-col gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
    >
      <div className="flex items-center gap-3">

        {/* Checkbox */}
        <div
          className="pt-0.5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleStatus(task.id);
          }}
        >
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center transition 
            ${
              task.status === "DONE"
                ? "bg-black border-black"
                : "border-gray-300 group-hover:border-gray-400"
            }`}
          >
            {task.status === "DONE" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Task title */}
        <div className="flex-1">
          <p
            className={`text-sm leading-snug transition 
            ${
              task.status === "DONE"
                ? "text-gray-400 line-through"
                : "text-gray-800"
            }`}
          >
            {task.title}
          </p>
        </div>
      </div>

      {/* Note link (hover) */}
      <div
        className="flex items-center gap-1.5 text-[11px] text-gray-400 
         transition"
        onClick={(e) => {
          e.stopPropagation();
          setNoteId(task.note.id);
        }}
        title={task.note?.title}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="6" cy="6" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="12" cy="18" r="2" />
          <path d="M6 8v4a6 6 0 006 6" />
          <path d="M18 8v4a6 6 0 01-6 6" />
        </svg>

        <span className="truncate max-w-25">
          {task.note?.title || "Untitled"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col bg-white">

      {/* Header */}
      <div className="border-b px-5 py-4 space-y-3">

        <h2 className="text-sm font-semibold text-gray-900">
          Actions
        </h2>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: "ALL", label: "All" },
            { key: "PENDING", label: "Pending" },
            { key: "DONE", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as Filter)}
              className={`px-3 py-1.5 text-xs rounded-md transition cursor-pointer
                ${
                  filter === tab.key
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(TaskRow)
        ) : (
          <div className="text-sm text-gray-400 text-center mt-10">
            No tasks found
          </div>
        )}
      </div>
    </div>
  );
}