import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../TaskItem';

describe('TaskItem', () => {
  it('renders the task text', () => {
    render(<TaskItem task={{ id: 1, title: 'Test Task', completed: false }} onClick={() => {}} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<TaskItem task={{ id: 1, title: 'Test Task', completed: false }} onClick={handleClick} />);
    fireEvent.click(screen.getByText('Test Task'));
    expect(handleClick).toHaveBeenCalled();
  });
}); 