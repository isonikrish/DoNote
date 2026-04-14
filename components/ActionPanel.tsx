"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export function ActionPanel() {

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get("/api/task/fetch-tasks");
      if (res.status === 200) {

        setTasks(res.data)
      }
    };
    fetchTasks()
  }, [])

  return (
    <div className="flex h-full flex-col bg-white">

      {/* Header */}
      <div className="border-b px-5 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Actions
          </h2>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">

        {tasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            <div className="pt-0.5">
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition 
                ${task.status === "DONE"
                    ? "bg-black border-black"
                    : "border-gray-300 group-hover:border-gray-400"
                  }`}
              >
                {task.status === "DONE" && (
                  <div className="w-2 h-2 bg-white rounded-sm" />
                )}
              </div>
            </div>

            {/* Task content */}
            <div className="flex-1">
              <p
                className={`text-sm leading-snug transition 
                ${task.status === "DONE"
                    ? "text-gray-400 line-through"
                    : "text-gray-800"
                  }`}
              >
                {task.title}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition">
                Linked to current note
              </p>
            </div>

            {/* Right hover action (premium feel) */}
            <div className="opacity-0 group-hover:opacity-100 transition text-gray-400 text-xs">
              •••
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}