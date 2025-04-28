import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// Mock react-confetti to avoid canvas errors in jsdom
vi.mock('react-confetti', () => ({ default: () => null }));
import EisenhowerMatrix from '../EisenhowerMatrix';

describe('EisenhowerMatrix interactions', () => {
  it('opens the modal when Add Task is clicked', () => {
    render(<EisenhowerMatrix />);
    const addButtons = screen.getAllByRole('button', { name: /add task/i });
    fireEvent.click(addButtons[0]);
    expect(screen.getByRole('heading', { name: /add task/i })).toBeInTheDocument();
  });

  it('closes the modal when Cancel is clicked', () => {
    render(<EisenhowerMatrix />);
    const addButtons = screen.getAllByRole('button', { name: /add task/i });
    fireEvent.click(addButtons[0]);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(screen.queryByRole('heading', { name: /add task/i })).not.toBeInTheDocument();
  });

  it('adds a new task and displays it in the correct quadrant', () => {
    render(<EisenhowerMatrix />);
    const addButtons = screen.getAllByRole('button', { name: /add task/i });
    fireEvent.click(addButtons[0]);
    const input = screen.getByPlaceholderText('Enter task description');
    fireEvent.change(input, { target: { value: 'New Task' } });
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('edits a task when clicked', () => {
    render(<EisenhowerMatrix />);
    const addButtons = screen.getAllByRole('button', { name: /add task/i });
    fireEvent.click(addButtons[0]);
    const input = screen.getByPlaceholderText('Enter task description');
    fireEvent.change(input, { target: { value: 'Editable Task' } });
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    const task = screen.getByText('Editable Task');
    fireEvent.click(task);
    const editInput = screen.getByPlaceholderText('Enter task description');
    fireEvent.change(editInput, { target: { value: 'Edited Task' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByText('Edited Task')).toBeInTheDocument();
  });

  it('deletes a task via the modal and removes it from the UI', async () => {
    render(<EisenhowerMatrix />);
    // Add a new task
    const addButtons = screen.getAllByRole('button', { name: /add task/i });
    fireEvent.click(addButtons[0]);
    const input = screen.getByPlaceholderText('Enter task description');
    fireEvent.change(input, { target: { value: 'Task to Delete' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Confirm the task is present
    expect(screen.getByText('Task to Delete')).toBeInTheDocument();

    // Open the modal for the task
    fireEvent.click(screen.getByText('Task to Delete'));
    // Click the Delete button in the modal
    const deleteButton = screen.getByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteButton);

    // Wait for the modal to close and the task to be removed
    await waitFor(() => {
      expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument();
    });
  });
}); 