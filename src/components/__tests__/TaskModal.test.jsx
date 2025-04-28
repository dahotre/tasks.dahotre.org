import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskModal from '../TaskModal';

describe('TaskModal', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    onDelete: jest.fn(),
    onComplete: jest.fn(),
    initialTask: {},
    mode: 'add',
    defaultQuadrant: 'not-urgent-important',
  };

  it('renders input fields', () => {
    render(<TaskModal {...defaultProps} />);
    expect(screen.getByLabelText(/task/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quadrant/i)).toBeInTheDocument();
  });

  it('calls onSave when Save is clicked', () => {
    const onSave = jest.fn();
    render(<TaskModal {...defaultProps} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/task/i), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(onSave).toHaveBeenCalled();
  });

  it('calls onClose when Cancel is clicked', () => {
    const onClose = jest.fn();
    render(<TaskModal {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
}); 