import { describe, it, expect } from 'vitest';
import { annotate, annotationGroup } from './index';

describe('rough-notation library (zero-redundancy roughjs integration)', () => {
  it('creates and attaches an annotation to a DOM element', () => {
    const el = document.createElement('span');
    el.textContent = 'Hello Rough';
    document.body.appendChild(el);

    const annotation = annotate(el, {
      type: 'highlight',
      color: '#D7195F',
      animationDuration: 400,
    });

    expect(annotation.isShowing()).toBe(false);

    annotation.show();
    expect(annotation.isShowing()).toBe(true);

    annotation.hide();
    expect(annotation.isShowing()).toBe(false);

    annotation.remove();
    document.body.removeChild(el);
  });

  it('supports all RoughNotation annotation types', () => {
    const types = [
      'highlight',
      'underline',
      'box',
      'circle',
      'strike-through',
      'crossed-off',
      'bracket'
    ] as const;

    for (const type of types) {
      const el = document.createElement('div');
      el.textContent = `Type ${type}`;
      document.body.appendChild(el);

      const a = annotate(el, { type, color: '#D7195F' });
      a.show();
      expect(a.isShowing()).toBe(true);
      a.hide();
      a.remove();
      document.body.removeChild(el);
    }
  });

  it('groups annotations with annotationGroup', () => {
    const el1 = document.createElement('span');
    const el2 = document.createElement('span');
    document.body.appendChild(el1);
    document.body.appendChild(el2);

    const a1 = annotate(el1, { type: 'highlight' });
    const a2 = annotate(el2, { type: 'underline' });

    const group = annotationGroup([a1, a2]);
    group.show();
    expect(a1.isShowing()).toBe(true);
    expect(a2.isShowing()).toBe(true);

    group.hide();
    expect(a1.isShowing()).toBe(false);
    expect(a2.isShowing()).toBe(false);

    a1.remove();
    a2.remove();
    document.body.removeChild(el1);
    document.body.removeChild(el2);
  });
});
