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
  const [text, setText] = useState("");
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
        setText(initialTask.text || "");
        setDue(initialTask.due || "");
        setQuadrant(initialTask.quadrant || defaultQuadrant || QUADRANT_OPTIONS[0].value);
      } else {
        setText("");
        setDue("");
        setQuadrant(defaultQuadrant || QUADRANT_OPTIONS[0].value);
      }
    }
  }, [open, initialTask, defaultQuadrant, mode]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl bg-white rounded-lg"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">{mode === "add" ? "Add Task" : "Edit Task"}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave({
              ...initialTask,
              text,
              due,
              quadrant,
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Task</label>
            <input
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 bg-white text-gray-900"
              value={text}
              onChange={e => setText(e.target.value)}
              required
              placeholder="Enter task description"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring focus:border-blue-300 bg-white"
              value={due}
              onChange={e => setDue(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quadrant</label>
            <select
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 bg-white text-gray-900"
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
              className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
        {mode === "edit" && (
          <div className="flex justify-between items-center mt-6">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold hover:bg-green-200 border border-green-300"
              onClick={onComplete}
            >
              <span className="inline-block w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-lg">✓</span>
              Complete
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold hover:bg-red-200 border border-red-300"
              onClick={onDelete}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 