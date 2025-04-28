import React from "react";
import TaskItem from "./TaskItem";
import { Draggable } from "@hello-pangea/dnd";

export default function Quadrant({ color, counterColor, tasks, completedCount, droppableProps, innerRef, isDraggingOver, children, onAdd, onTaskClick }) {
  return (
    <div className={`relative shadow-sm flex flex-col ${color} border border-gray-300 p-4 min-h-0 h-full w-full`}> 
      {/* Task List */}
      <div
        className={`flex-1 divide-y divide-gray-200 ${isDraggingOver ? 'bg-blue-100/40' : ''}`}
        ref={innerRef}
        {...droppableProps}
      >
        {tasks.map((task, idx) => (
          <Draggable draggableId={String(task.id)} index={idx} key={task.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={snapshot.isDragging ? 'opacity-70' : ''}
              >
                <TaskItem task={task} onClick={() => onTaskClick?.(task)} />
              </div>
            )}
          </Draggable>
        ))}
        {children}
      </div>
      {/* Bottom row: Counter and Add pill */}
      <div className="mt-4 w-full flex justify-between items-center">
        <span className={`w-10 h-10 flex items-center justify-center rounded-full font-bold border border-gray-300 shadow-sm text-lg ${counterColor}`}>
          {completedCount}
        </span>
        <button className="bg-white border border-gray-300 rounded-full px-6 py-1 text-sm font-medium shadow hover:bg-gray-100 transition" onClick={onAdd}>
          Add
        </button>
      </div>
    </div>
  );
} 