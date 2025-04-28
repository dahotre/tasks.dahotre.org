import React from "react";

function formatDue(due) {
  if (!due) return null;
  const d = new Date(due);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}/${dd}`;
}

function getDueColor(due) {
  if (!due) return "bg-gray-200 text-gray-500 border-gray-300";
  const today = new Date();
  const dueDate = new Date(due);
  const diff = (dueDate - today) / (1000 * 60 * 60 * 24);
  if (diff < 0.5) return "bg-red-200 text-red-800 border-red-300"; // Due today or overdue
  if (diff < 2) return "bg-orange-200 text-orange-800 border-orange-300"; // 1-2 days
  if (diff < 5) return "bg-yellow-200 text-yellow-800 border-yellow-300"; // 3-5 days
  if (diff < 10) return "bg-green-200 text-green-800 border-green-300"; // 6-9 days
  return "bg-green-100 text-green-700 border-green-200"; // 10+ days
}

export default function TaskItem({ task, onClick }) {
  return (
    <div
      className="flex justify-between items-center bg-white px-3 py-2 cursor-pointer hover:bg-gray-50 transition text-base"
      onClick={onClick}
    >
      <span>{task.text}</span>
      {task.due && (
        <span className={`ml-2 px-3 py-1 rounded-lg text-xs font-semibold border ${getDueColor(task.due)}`}>
          {formatDue(task.due)}
        </span>
      )}
    </div>
  );
} 