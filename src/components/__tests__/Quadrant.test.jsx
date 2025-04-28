import { render, screen } from '@testing-library/react';
import Quadrant from '../Quadrant';

describe('Quadrant', () => {
  it('renders the correct number of tasks and the Add Task button', () => {
    const tasks = [
      { id: 1, text: 'Task 1', due_date: '', quadrant: 'important-urgent', completed: false },
      { id: 2, text: 'Task 2', due_date: '', quadrant: 'important-urgent', completed: false },
    ];
    render(
      <Quadrant
        color="bg-blue-50"
        tasks={tasks}
        onAddTask={() => {}}
        onTaskClick={() => {}}
      />
    );
    // Each task is rendered as a button
    const taskButtons = screen.getAllByRole('button').filter(btn => btn.textContent !== '+ Add Task');
    expect(taskButtons.length).toBe(tasks.length);
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });
}); 