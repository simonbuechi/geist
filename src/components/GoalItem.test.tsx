import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../test/test-utils';
import { GoalItem } from './GoalItem';
import type { Goal } from '../types';

describe('GoalItem', () => {
  const mockGoal: Goal = {
    id: 'goal-1',
    category: 'body',
    description: '30 Minuten Spaziergang',
    status: 'pending',
    createdAt: Date.now(),
  };

  it('renders goal description', () => {
    render(
      <GoalItem
        goal={mockGoal}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('30 Minuten Spaziergang')).toBeInTheDocument();
  });

  it('allows editing the description and saving changes', async () => {
    const onUpdate = vi.fn();
    const user = userEvent.setup();

    render(
      <GoalItem
        goal={mockGoal}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
      />
    );

    // Click edit button
    const editButton = screen.getByRole('button', { name: /bearbeiten|edit/i });
    await user.click(editButton);

    // Input should be present with existing text
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('30 Minuten Spaziergang');

    // Type new description
    await user.clear(input);
    await user.type(input, '45 Minuten Joggen');

    // Save changes
    const saveButton = screen.getByRole('button', { name: /speichern|save/i });
    await user.click(saveButton);

    expect(onUpdate).toHaveBeenCalledWith('45 Minuten Joggen');
  });

  it('allows canceling edit mode on Escape key', async () => {
    const onUpdate = vi.fn();
    const user = userEvent.setup();

    render(
      <GoalItem
        goal={mockGoal}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
      />
    );

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /bearbeiten|edit/i });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.type(input, ' extra text');
    await user.keyboard('{Escape}');

    // Edit input should be gone and original text displayed
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('30 Minuten Spaziergang')).toBeInTheDocument();
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked and user confirms', async () => {
    const onDelete = vi.fn();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();

    render(
      <GoalItem
        goal={mockGoal}
        onUpdate={vi.fn()}
        onDelete={onDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /löschen|delete/i });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalledTimes(1);

    confirmSpy.mockRestore();
  });

  it('does not call onDelete when user cancels the delete confirmation', async () => {
    const onDelete = vi.fn();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const user = userEvent.setup();

    render(
      <GoalItem
        goal={mockGoal}
        onUpdate={vi.fn()}
        onDelete={onDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /löschen|delete/i });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('displays status badge when goal is reviewed', () => {
    const reviewedGoal: Goal = {
      ...mockGoal,
      status: 'good',
    };

    render(
      <GoalItem
        goal={reviewedGoal}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    // Should display good status label (e.g. Erreicht in German default)
    expect(screen.getByText(/erreicht|achieved/i)).toBeInTheDocument();
  });
});
