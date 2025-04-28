import React from "react";
import TaskItem from "./TaskItem";
import { Draggable } from "@hello-pangea/dnd";

export default function Quadrant({
  color, // pastel color, not used directly now
  counterColor, // not used directly now
  tasks = [],
  completedCount = 0,
  droppableProps = {},
  innerRef,
  isDraggingOver,
  onAdd,
  onTaskClick,
  children,
}) {
  // Only show incomplete tasks in the list
  const visibleTasks = tasks.filter(t => !t.completed);
  return (
    <div
      ref={innerRef}
      {...droppableProps}
      className={`relative flex flex-col h-full w-full bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-4 gap-2 transition-all duration-300 ${isDraggingOver ? 'shadow-2xl border-blue-300' : 'hover:shadow-xl'} overflow-hidden`}
    >
      {/* Completed tasks counter badge, styled like previous tasks counter */}
      <span className="absolute top-2 right-3 z-10 bg-gray-100 text-gray-500 text-xs font-medium rounded-full px-2 py-0.5 shadow border border-gray-200 select-none">
        {completedCount} ✓
      </span>
      <div className="flex-1 flex flex-col gap-1 pt-6">
        {visibleTasks.map((task, idx) => (
          <Draggable draggableId={String(task.id)} index={idx} key={task.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={snapshot.isDragging ? 'opacity-70' : ''}
              >
                <TaskItem task={task} onClick={() => onTaskClick(task)} />
                {idx < visibleTasks.length - 1 && <div className="h-px bg-gray-100 my-1" />}
              </div>
            )}
          </Draggable>
        ))}
      </div>
      <button
        className="mt-3 px-5 py-2 rounded-full bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition w-fit self-center text-xs"
        onClick={onAdd}
        type="button"
      >
        + Add Task
      </button>
      {children}
    </div>
  );
} 