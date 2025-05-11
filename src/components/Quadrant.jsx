import React from "react";
import TaskItem from "./TaskItem";

export default function Quadrant({
  color, // pastel color, not used directly now
  counterColor, // not used directly now
  tasks = [],
  completedCount = 0,
  onAdd,
  onTaskClick,
  onShowCompleted,
  children,
}) {
  // Only show incomplete tasks in the list
  const visibleTasks = tasks.filter(t => !t.completed);
  return (
    <div
      className="relative flex flex-col h-full w-full bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-3 transition-all duration-300 overflow-hidden"
    >
      {/* Completed tasks counter badge, now a button */}
      <button
        type="button"
        className="absolute top-2 right-3 z-10 bg-gray-100 text-gray-500 text-xs font-medium rounded-full px-2 py-0.5 shadow border border-gray-200 select-none hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        onClick={onShowCompleted}
        aria-label="Show completed tasks"
        tabIndex={0}
      >
        {completedCount} ✓
      </button>
      {/* Scrollable task list */}
      <div className="flex-1 flex flex-col gap-0.5 pt-4 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {visibleTasks.map((task, idx) => (
          <React.Fragment key={task.id}>
            <TaskItem task={task} onClick={() => onTaskClick(task)} />
            {idx < visibleTasks.length - 1 && <div className="h-px bg-gray-100 my-0.5" />}
          </React.Fragment>
        ))}
      </div>
      {/* Add Task button always at the bottom */}
      <div className="mt-2 flex-shrink-0 flex justify-center">
        <button
          className="px-4 py-1.5 rounded-full bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition w-fit text-xs"
          onClick={onAdd}
          type="button"
        >
          + Add Task
        </button>
      </div>
      {children}
    </div>
  );
} 