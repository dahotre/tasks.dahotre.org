import React from 'react';
import { render, screen } from '@testing-library/react';
import EisenhowerMatrix from '../EisenhowerMatrix';

describe('EisenhowerMatrix', () => {
  it('renders four quadrants', () => {
    render(<EisenhowerMatrix />);
    // There should be four Add Task buttons (one per quadrant)
    const addButtons = screen.getAllByRole('button', { name: /add task/i });
    expect(addButtons.length).toBe(4);
  });
}); 