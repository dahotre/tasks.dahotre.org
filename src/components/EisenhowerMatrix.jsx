import React, { useState } from "react";
import Quadrant from "./Quadrant";
import TaskModal from "./TaskModal";
import Confetti from "react-confetti";

const QUADRANTS = [
  {
    key: "not-urgent-important",
    color: "bg-blue-50",
    counterColor: "bg-blue-200 text-blue-700",
  },
  {
    key: "urgent-important",
    color: "bg-green-50",
    counterColor: "bg-green-200 text-green-700",
  },
  {
    key: "not-urgent-not-important",
    color: "bg-gray-50",
    counterColor: "bg-gray-200 text-gray-700",
  },
  {
    key: "urgent-not-important",
    color: "bg-yellow-50",
    counterColor: "bg-yellow-200 text-yellow-700",
  },
];

const initialTasks = {
  "not-urgent-important": [
    { id: 1, text: "Task 1", due: "2025-05-25", completed: false },
    { id: 2, text: "Task 2", due: null, completed: false },
  ],
  "urgent-important": [
    { id: 7, text: "Task 7", due: "2025-05-01", completed: false },
    { id: 8, text: "Task 8", due: "2025-04-30", completed: false },
  ],
  "not-urgent-not-important": [
    { id: 4, text: "Task 4", due: null, completed: true },
    { id: 5, text: "Task 5", due: null, completed: false },
    { id: 6, text: "Task 6", due: null, completed: false },
  ],
  "urgent-not-important": [
    { id: 10, text: "Task 10", due: null, completed: false },
    { id: 12, text: "Task 12", due: "2025-07-02", completed: false },
  ],
};

function getQuadrantLabel(key) {
  switch (key) {
    case "not-urgent-important": return "Not Urgent & Important";
    case "urgent-important": return "Urgent & Important";
    case "not-urgent-not-important": return "Not Urgent & Not Important";
    case "urgent-not-important": return "Urgent & Not Important";
    default: return "";
  }
}

export default function EisenhowerMatrix() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modal, setModal] = useState({ open: false, mode: "add", task: null, quadrant: null });
  const [showConfetti, setShowConfetti] = useState(false);
  const [fadeConfetti, setFadeConfetti] = useState(false);

  function handleAdd(quadrantKey) {
    setModal({ open: true, mode: "add", task: null, quadrant: quadrantKey });
  }

  function handleEdit(task, quadrantKey) {
    setModal({ open: true, mode: "edit", task: { ...task, quadrant: quadrantKey }, quadrant: quadrantKey });
  }

  function handleModalClose() {
    setModal({ open: false, mode: "add", task: null, quadrant: null });
  }

  function handleModalSave(task) {
    if (modal.mode === "add") {
      setTasks((prev) => ({
        ...prev,
        [task.quadrant]: [
          ...prev[task.quadrant],
          { ...task, id: Date.now(), completed: false },
        ],
      }));
    } else if (modal.mode === "edit") {
      // If quadrant changed, move task
      setTasks((prev) => {
        const oldQuadrant = modal.task.quadrant;
        const newQuadrant = task.quadrant;
        let newTasks = { ...prev };
        // Remove from old
        newTasks[oldQuadrant] = newTasks[oldQuadrant].filter((t) => t.id !== modal.task.id);
        // Add to new
        newTasks[newQuadrant] = [
          ...newTasks[newQuadrant],
          { ...task, completed: modal.task.completed || false },
        ];
        return newTasks;
      });
    }
    handleModalClose();
  }

  function handleModalDelete() {
    setTasks((prev) => {
      const q = modal.task.quadrant;
      return {
        ...prev,
        [q]: prev[q].filter((t) => t.id !== modal.task.id),
      };
    });
    handleModalClose();
  }

  function handleModalComplete() {
    setTasks((prev) => {
      const q = modal.task.quadrant;
      return {
        ...prev,
        [q]: prev[q].map((t) =>
          t.id === modal.task.id ? { ...t, completed: true } : t
        ),
      };
    });
    handleModalClose();
    setFadeConfetti(false);
    setShowConfetti(true);
    setTimeout(() => setFadeConfetti(true), 3000); // Start fade after 3s
    setTimeout(() => setShowConfetti(false), 5000); // Hide after 5s
  }

  return (
    <div className="w-screen h-screen flex items-stretch justify-stretch bg-neutral-50 font-sans relative">
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={800} gravity={0.8} recycle={false} />
          <div
            className={`absolute inset-0 transition-opacity duration-2000 ${fadeConfetti ? 'opacity-0' : 'opacity-100'}`}
            style={{ background: 'transparent' }}
          />
        </div>
      )}
      <div className="grid grid-cols-[16px_1fr_1fr] grid-rows-[16px_1fr_1fr] w-full h-full gap-0.5 p-2">
        {/* Top-left empty cell */}
        <div></div>
        {/* Top headers - minimal space, smallest padding */}
        <div className="flex items-center justify-center font-normal text-[10px] text-gray-500 tracking-wide bg-transparent h-[10px]">Not Urgent</div>
        <div className="flex items-center justify-center font-normal text-[10px] text-gray-500 tracking-wide bg-transparent h-[10px]">Urgent</div>
        {/* Left labels - minimal space, smallest padding */}
        <div className="flex items-center justify-center h-full w-[10px]"><span className="font-normal text-[10px] text-gray-500 tracking-wide origin-center rotate-[-90deg] whitespace-nowrap">Important</span></div>
        {QUADRANTS.slice(0, 2).map((q) => (
          <Quadrant
            key={q.key}
            color={q.color}
            counterColor={q.counterColor}
            tasks={tasks[q.key] || []}
            completedCount={tasks[q.key]?.filter(t => t.completed).length || 0}
            onAdd={() => handleAdd(q.key)}
            onTaskClick={(task) => handleEdit(task, q.key)}
          />
        ))}
        <div className="flex items-center justify-center h-full w-[10px]"><span className="font-normal text-[10px] text-gray-500 tracking-wide origin-center rotate-[-90deg] whitespace-nowrap">Not Important</span></div>
        {QUADRANTS.slice(2, 4).map((q) => (
          <Quadrant
            key={q.key}
            color={q.color}
            counterColor={q.counterColor}
            tasks={tasks[q.key] || []}
            completedCount={tasks[q.key]?.filter(t => t.completed).length || 0}
            onAdd={() => handleAdd(q.key)}
            onTaskClick={(task) => handleEdit(task, q.key)}
          />
        ))}
      </div>
      <TaskModal
        key={modal.mode + (modal.task?.id || modal.quadrant || 'add')}
        open={modal.open}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
        onComplete={handleModalComplete}
        initialTask={modal.mode === 'add' ? {} : modal.task}
        mode={modal.mode}
        defaultQuadrant={modal.quadrant}
      />
    </div>
  );
} 