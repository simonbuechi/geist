import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import { RoughNotationHighlight } from './RoughNotationHighlight';

describe('RoughNotationHighlight', () => {
  it('renders children correctly', () => {
    render(
      <RoughNotationHighlight>
        <span>Test Title</span>
      </RoughNotationHighlight>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('triggers highlight on mouse enter and clears on mouse leave', () => {
    const { container } = render(
      <RoughNotationHighlight trigger="hover">
        <span>Hover Me</span>
      </RoughNotationHighlight>
    );

    const wrapper = container.firstChild as HTMLElement;
    const svg = container.querySelector('svg') as SVGSVGElement;

    expect(svg.children.length).toBe(0);

    // Mouse enter triggers annotation show
    fireEvent.mouseEnter(wrapper);
    expect(svg.children.length).toBeGreaterThan(0);

    // Mouse leave triggers annotation hide
    fireEvent.mouseLeave(wrapper);
    expect(svg.children.length).toBe(0);
  });

  it('triggers and toggles highlight on click', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <RoughNotationHighlight trigger="click" onClick={handleClick}>
        <span>Click Me</span>
      </RoughNotationHighlight>
    );

    const wrapper = container.firstChild as HTMLElement;
    const svg = container.querySelector('svg') as SVGSVGElement;

    expect(svg.children.length).toBe(0);

    // Click triggers annotation
    fireEvent.click(wrapper);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(svg.children.length).toBeGreaterThan(0);

    // Click again toggles off
    fireEvent.click(wrapper);
    expect(handleClick).toHaveBeenCalledTimes(2);
    expect(svg.children.length).toBe(0);
  });
});
