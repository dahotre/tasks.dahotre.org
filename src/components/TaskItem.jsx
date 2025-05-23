import React from "react";

function formatDue(due) {
  if (!due) return null;
  console.log('input due', due);
  // If due is in 'YYYY-MM-DD' format, split it
  const [year, month, day] = due.split('-');
  console.log('formatted due', `${month}/${day}`);
  return `${month}/${day}`;
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
  const isCompleted = task.completed;
  return (
    <div
      className={`flex items-center px-2 py-1.5 mx-0.5 rounded-xl cursor-pointer transition-all duration-150 font-sans bg-transparent hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-200 ${isCompleted ? 'text-gray-400 line-through opacity-60' : 'text-gray-800'} select-none`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={task.title}
    >
      <span className="flex-1 text-sm font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>{task.title}</span>
      {task.due && (
        <span className={`ml-2 px-1.5 py-0 rounded-lg text-[10px] font-medium border ${getDueColor(task.due)}`}>
          {formatDue(task.due)}
        </span>
      )}
    </div>
  );
} 