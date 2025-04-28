import React from 'react';
import { render, screen } from '@testing-library/react';
import Quadrant from '../Quadrant';

describe('Quadrant', () => {
  it('renders the correct number of tasks and the Add Task button', () => {
    const tasks = [
      { id: 1, text: 'Task 1', completed: false },
      { id: 2, text: 'Task 2', completed: false },
    ];
    render(
      <Quadrant
        color="bg-blue-50"
        counterColor="bg-blue-200 text-blue-700"
        tasks={tasks}
        completedCount={0}
        onAdd={() => {}}
        onTaskClick={() => {}}
      />
    );
    // Should render both tasks
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    // Should show the Add Task button
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });
}); 