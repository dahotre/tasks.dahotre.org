import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
// Mock react-confetti to avoid canvas errors in jsdom
vi.mock('react-confetti', () => ({ default: () => null }));
import EisenhowerMatrix from '../EisenhowerMatrix';

describe('EisenhowerMatrix interactions', () => {
  it('opens the modal when Add Task is clicked', async () => {
    render(<EisenhowerMatrix />);
    const addButtons = screen.getAllByRole('button', { name: /add task/i });
    await act(async () => { fireEvent.click(addButtons[0]); });
    expect(screen.getByRole('heading', { name: /add task/i })).toBeInTheDocument();
  });

  it('closes the modal when Cancel is clicked', async () => {
    render(<EisenhowerMatrix />);
    const addButtons = screen.getAllByRole('button', { name: /add task/i });
    await act(async () => { fireEvent.click(addButtons[0]); });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await act(async () => { fireEvent.click(cancelButton); });
    expect(screen.queryByRole('heading', { name: /add task/i })).not.toBeInTheDocument();
  });

  it('adds a new task and displays it in the correct quadrant', async () => {
    render(<EisenhowerMatrix />);
    const addButtons = screen.getAllByRole('button', { name: /add task/i });
    await act(async () => { fireEvent.click(addButtons[0]); });
    const input = screen.getByPlaceholderText('Enter task description');
    await act(async () => { fireEvent.change(input, { target: { value: 'New Task' } }); });
    const saveButton = screen.getByRole('button', { name: /save/i });
    await act(async () => { fireEvent.click(saveButton); });
    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });

  it('edits a task when clicked', async () => {
    render(<EisenhowerMatrix />);
    const addButtons = screen.getAllByRole('button', { name: /add task/i });
    await act(async () => { fireEvent.click(addButtons[0]); });
    const input = screen.getByPlaceholderText('Enter task description');
    await act(async () => { fireEvent.change(input, { target: { value: 'Editable Task' } }); });
    const saveButton = screen.getByRole('button', { name: /save/i });
    await act(async () => { fireEvent.click(saveButton); });
    const task = await screen.findByText('Editable Task');
    await act(async () => { fireEvent.click(task); });
    const editInput = screen.getByPlaceholderText('Enter task description');
    await act(async () => { fireEvent.change(editInput, { target: { value: 'Edited Task' } }); });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /save/i })); });
    expect(await screen.findByText('Edited Task')).toBeInTheDocument();
  });

  it('deletes a task via the modal and removes it from the UI', async () => {
    render(<EisenhowerMatrix />);
    // Add a new task
    const addButtons = screen.getAllByRole('button', { name: /add task/i });
    await act(async () => { fireEvent.click(addButtons[0]); });
    const input = screen.getByPlaceholderText('Enter task description');
    await act(async () => { fireEvent.change(input, { target: { value: 'Task to Delete' } }); });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /save/i })); });

    // Confirm the task is present
    expect(await screen.findByText('Task to Delete')).toBeInTheDocument();

    // Open the modal for the task
    await act(async () => { fireEvent.click(screen.getByText('Task to Delete')); });
    // Click the Delete button in the modal
    const deleteButton = screen.getByRole('button', { name: /^delete$/i });
    await act(async () => { fireEvent.click(deleteButton); });

    // Wait for the modal to close and the task to be removed
    await waitFor(() => {
      expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument();
    });
  });
}); 