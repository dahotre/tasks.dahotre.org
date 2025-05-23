import React, { useState, useEffect } from "react";

const QUADRANT_OPTIONS = [
  { value: "not-urgent-important", label: "Not Urgent & Important" },
  { value: "urgent-important", label: "Urgent & Important" },
  { value: "not-urgent-not-important", label: "Not Urgent & Not Important" },
  { value: "urgent-not-important", label: "Urgent & Not Important" },
];

export default function TaskModal({
  open,
  onClose,
  onSave,
  onDelete,
  onComplete,
  initialTask = {},
  mode = "add", // or "edit"
  defaultQuadrant,
}) {
  initialTask = initialTask || {};
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [quadrant, setQuadrant] = useState(defaultQuadrant || QUADRANT_OPTIONS[0].value);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      if (mode === "edit") {
        setTitle(initialTask.title || "");
        setDue(initialTask.due || "");
        setQuadrant(initialTask.quadrant || defaultQuadrant || QUADRANT_OPTIONS[0].value);
      } else {
        setTitle("");
        setDue("");
        setQuadrant(defaultQuadrant || QUADRANT_OPTIONS[0].value);
      }
    }
  }, [open, initialTask, defaultQuadrant, mode]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 transition-all duration-300">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-6 relative font-sans transition-all duration-300">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-2xl rounded-full transition p-1 border-0 bg-transparent shadow-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-base font-semibold mb-4 text-gray-800 tracking-wide">{mode === "add" ? "Add Task" : "Edit Task"}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave({
              ...initialTask,
              title,
              due,
              quadrant,
            });
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="task-title" className="block text-xs font-medium mb-1 text-gray-500">Task</label>
            <input
              id="task-title"
              className="w-full rounded-xl px-3 py-2 bg-gray-100 text-gray-800 text-base placeholder-gray-400 placeholder:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Enter task"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="task-due" className="block text-xs font-medium mb-1 text-gray-500">Due Date</label>
            <input
              id="task-due"
              type="date"
              className="w-full rounded-xl px-3 py-2 bg-gray-100 text-gray-800 text-base placeholder-gray-400 placeholder:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              value={due}
              onChange={e => setDue(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="task-quadrant" className="block text-xs font-medium mb-1 text-gray-500">Quadrant</label>
            <select
              id="task-quadrant"
              className="w-full rounded-xl px-3 py-2 bg-gray-100 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              value={quadrant}
              onChange={e => setQuadrant(e.target.value)}
              required
            >
              {QUADRANT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-full bg-gray-100 text-gray-600 font-medium text-base hover:bg-gray-200 transition shadow-none"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-full bg-blue-500 text-white font-semibold text-base hover:bg-blue-600 transition shadow-none"
            >
              Save
            </button>
          </div>
        </form>
        {mode === "edit" && (
          <div className="flex justify-end gap-2 mt-3">
            <button
              className="px-3.5 py-1.5 rounded-full border border-green-300 text-green-700 font-medium text-base bg-white hover:bg-green-50 transition shadow-none"
              onClick={onComplete}
            >
              ✓ Complete
            </button>
            <button
              className="px-3.5 py-1.5 rounded-full border border-red-300 text-red-700 font-medium text-base bg-white hover:bg-red-50 transition shadow-none"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 