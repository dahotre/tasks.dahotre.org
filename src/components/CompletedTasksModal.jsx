import React from "react";

export default function CompletedTasksModal({ open, tasks = [], onClose, quadrant }) {
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
        <h2 className="text-base font-semibold mb-4 text-gray-800 tracking-wide">
          Completed Tasks{quadrant ? ` (${quadrant.replace(/-/g, ' ')})` : ''}
        </h2>
        {tasks.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8">No completed tasks.</div>
        ) : (
          <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
            {tasks.map(task => (
              <li key={task.id} className="py-2 px-1 flex items-center gap-2">
                <span className="flex-1 text-sm text-gray-700 line-through">{task.title}</span>
                {task.due && (
                  <span className="ml-2 px-2 py-0.5 rounded-lg text-xs font-medium border bg-gray-100 text-gray-500 border-gray-200">
                    {task.due}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end mt-6">
          <button
            className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 font-medium text-xs hover:bg-gray-200 transition shadow-none"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 