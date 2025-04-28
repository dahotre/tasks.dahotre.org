import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// Mock react-confetti to avoid canvas errors in jsdom
jest.mock('react-confetti', () => () => null);
import EisenhowerMatrix from '../EisenhowerMatrix';

describe('EisenhowerMatrix user interactions', () => {
  it('allows adding a new task to a quadrant', () => {
    render(<EisenhowerMatrix />);
    // Click the first Add Task button
    const addButtons = screen.getAllByRole('button', { name: /add task/i });
    fireEvent.click(addButtons[0]);
    // Fill out the modal (specifically select the input field)
    fireEvent.change(screen.getByLabelText('Task', { selector: 'input' }), { target: { value: 'My New Task' } });
    // Save
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    // The new task should appear in the quadrant
    expect(screen.getByText('My New Task')).toBeInTheDocument();
  });

  it('allows editing a task', () => {
    render(<EisenhowerMatrix />);
    // Click the first task
    fireEvent.click(screen.getByText('Task 1'));
    // Change the text
    fireEvent.change(screen.getByLabelText('Task', { selector: 'input' }), { target: { value: 'Task 1 Edited' } });
    // Save
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    // The edited task should appear
    expect(screen.getByText('Task 1 Edited')).toBeInTheDocument();
    // The old text should not be present
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  it('allows deleting a task', () => {
    render(<EisenhowerMatrix />);
    // Click the first task
    fireEvent.click(screen.getByText('Task 1'));
    // Click Delete
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    // The task should be gone
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  it('allows completing a task', () => {
    render(<EisenhowerMatrix />);
    // Click the first task
    fireEvent.click(screen.getByText('Task 1'));
    // Click Complete
    fireEvent.click(screen.getByRole('button', { name: /complete/i }));
    // The task should be gone from the visible list
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    // The completed counter should increase (look for "1 ✓")
    expect(screen.getAllByText(/✓/)[0].textContent).toMatch(/1/);
  });
}); 