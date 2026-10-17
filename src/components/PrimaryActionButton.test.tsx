import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../test/test-utils';
import { PrimaryActionButton } from './PrimaryActionButton';

describe('PrimaryActionButton', () => {
  it('renders with label and triggers onClick', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <PrimaryActionButton
        label="Woche abschliessen"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button', { name: /woche abschliessen/i });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders reviewed state icon and label', () => {
    render(
      <PrimaryActionButton
        label="Wochenrückblick ansehen"
        isReviewed={true}
        onClick={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /wochenrückblick ansehen/i })).toBeInTheDocument();
  });

  it('renders without hover bracket animation elements', async () => {
    const user = userEvent.setup();

    render(
      <PrimaryActionButton
        label="No hover brackets"
        onClick={vi.fn()}
      />
    );

    const button = screen.getByRole('button', { name: /no hover brackets/i });
    expect(screen.queryByTestId('left-bracket-svg')).not.toBeInTheDocument();
    expect(screen.queryByTestId('right-bracket-svg')).not.toBeInTheDocument();

    await user.hover(button);
    expect(screen.queryByTestId('left-bracket-svg')).not.toBeInTheDocument();
    expect(screen.queryByTestId('right-bracket-svg')).not.toBeInTheDocument();
  });
});
