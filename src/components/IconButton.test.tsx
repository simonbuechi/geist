import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '../test/test-utils';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('renders with children and accessible label', () => {
    render(
      <IconButton aria-label="Settings" title="Settings">
        <span data-testid="icon">⚙</span>
      </IconButton>
    );

    const button = screen.getByRole('button', { name: /settings/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <IconButton aria-label="Edit" onClick={handleClick}>
        <span>✎</span>
      </IconButton>
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <IconButton aria-label="Disabled Action" disabled onClick={handleClick}>
        <span>✕</span>
      </IconButton>
    );

    const button = screen.getByRole('button', { name: /disabled action/i });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(
      <IconButton variant="primary" aria-label="Save">
        <span>✓</span>
      </IconButton>
    );
    let button = screen.getByRole('button', { name: /save/i });
    expect(button.className).toContain('bg-transparent');
    expect(button.className).toContain('text-[#D7195F]');

    rerender(
      <IconButton variant="ghost" aria-label="Save">
        <span>✓</span>
      </IconButton>
    );
    button = screen.getByRole('button', { name: /save/i });
    expect(button.className).toContain('bg-transparent');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(
      <IconButton size="sm" aria-label="Small">
        <span>•</span>
      </IconButton>
    );
    let button = screen.getByRole('button', { name: /small/i });
    expect(button.className).toContain('w-7');

    rerender(
      <IconButton size="lg" aria-label="Large">
        <span>•</span>
      </IconButton>
    );
    button = screen.getByRole('button', { name: /large/i });
    expect(button.className).toContain('w-10');
  });

  it('renders with custom fillWeight for thicker zigzag fill', () => {
    render(
      <IconButton aria-label="Add" fillWeight={3.0}>
        <span>+</span>
      </IconButton>
    );

    const button = screen.getByRole('button', { name: /add/i });
    expect(button).toBeInTheDocument();
  });
});
