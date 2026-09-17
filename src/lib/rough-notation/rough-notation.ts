import rough from 'roughjs';
import type { 
  Rect, 
  RoughAnnotationConfig, 
  RoughAnnotation, 
  RoughAnnotationGroup 
} from './types';
import { renderAnnotation } from './render';

const SVG_NS = 'http://www.w3.org/2000/svg';
export const DEFAULT_ANIMATION_DURATION = 500;

export function ensureKeyframes() {
  if (typeof document === 'undefined') return;
  if (!document.getElementById('rough-notation-styles')) {
    const style = document.createElement('style');
    style.id = 'rough-notation-styles';
    style.textContent = `
      @keyframes rough-notation-dash {
        to {
          stroke-dashoffset: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

type AnnotationState = 'unattached' | 'not-showing' | 'showing';

export class RoughAnnotationImpl implements RoughAnnotation {
  private _state: AnnotationState = 'unattached';
  private _config: RoughAnnotationConfig;
  private _resizing = false;
  private _ro?: ResizeObserver;
  private _seed: number;
  private _customSvg = false;

  private _e: HTMLElement;
  private _svg?: SVGSVGElement;
  private _lastSizes: Rect[] = [];

  _animationDelay = 0;

  constructor(e: HTMLElement, config: RoughAnnotationConfig) {
    this._e = e;
    this._config = { ...config };
    this._seed = rough.newSeed ? rough.newSeed() : Math.floor(Math.random() * 2 ** 31);
    if (config.svg) {
      this._svg = config.svg;
      this._customSvg = true;
      this._state = 'not-showing';
      this.attachListeners();
    } else {
      this.attach();
    }
  }

  get animate() { return this._config.animate ?? true; }
  set animate(value: boolean) { this._config.animate = value; }

  get animationDuration() { return this._config.animationDuration ?? DEFAULT_ANIMATION_DURATION; }
  set animationDuration(value: number) { this._config.animationDuration = value; }

  get iterations() { return this._config.iterations ?? 2; }
  set iterations(value: number) { this._config.iterations = value; }

  get color() { return this._config.color ?? 'currentColor'; }
  set color(value: string) {
    if (this._config.color !== value) {
      this._config.color = value;
      this.refresh();
    }
  }

  get strokeWidth() { return this._config.strokeWidth ?? 2; }
  set strokeWidth(value: number) {
    if (this._config.strokeWidth !== value) {
      this._config.strokeWidth = value;
      this.refresh();
    }
  }

  get padding() { return this._config.padding ?? 5; }
  set padding(value: number | [number, number] | [number, number, number, number] | number[]) {
    if (this._config.padding !== value) {
      this._config.padding = value;
      this.refresh();
    }
  }

  private _resizeListener = () => {
    if (!this._resizing) {
      this._resizing = true;
      setTimeout(() => {
        this._resizing = false;
        if (this._state === 'showing') {
          if (this.haveRectsChanged()) {
            this.show();
          }
        }
      }, 300);
    }
  };

  private attach() {
    if (this._state === 'unattached' && this._e.parentElement) {
      ensureKeyframes();
      const svg = (this._svg = document.createElementNS(SVG_NS, 'svg'));
      svg.setAttribute('class', 'rough-annotation');
      const style = svg.style;
      style.position = 'absolute';
      style.top = '0';
      style.left = '0';
      style.overflow = 'visible';
      style.pointerEvents = 'none';
      style.width = '100%';
      style.height = '100%';
      const prepend = this._config.type === 'highlight';
      this._e.insertAdjacentElement(prepend ? 'beforebegin' : 'afterend', svg);
      this._state = 'not-showing';

      if (prepend) {
        const computedPos = window.getComputedStyle(this._e).position;
        const unpositioned = !computedPos || computedPos === 'static';
        if (unpositioned) {
          this._e.style.position = 'relative';
        }
      }
      this.attachListeners();
    }
  }

  private detachListeners() {
    window.removeEventListener('resize', this._resizeListener);
    if (this._ro) {
      this._ro.unobserve(this._e);
      this._ro.disconnect();
    }
  }

  private attachListeners() {
    this.detachListeners();
    window.addEventListener('resize', this._resizeListener, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect) {
            this._resizeListener();
          }
        }
      });
      this._ro.observe(this._e);
    }
  }

  private haveRectsChanged(): boolean {
    if (this._lastSizes.length) {
      const newRects = this.rects();
      if (newRects.length === this._lastSizes.length) {
        for (let i = 0; i < newRects.length; i++) {
          if (!this.isSameRect(newRects[i], this._lastSizes[i])) {
            return true;
          }
        }
      } else {
        return true;
      }
    }
    return false;
  }

  private isSameRect(rect1: Rect, rect2: Rect): boolean {
    const si = (a: number, b: number) => Math.round(a) === Math.round(b);
    return (
      si(rect1.x, rect2.x) &&
      si(rect1.y, rect2.y) &&
      si(rect1.w, rect2.w) &&
      si(rect1.h, rect2.h)
    );
  }

  isShowing(): boolean {
    return this._state === 'showing';
  }

  private pendingRefresh?: Promise<void>;
  private refresh() {
    if (this.isShowing() && !this.pendingRefresh) {
      this.pendingRefresh = Promise.resolve().then(() => {
        if (this.isShowing()) {
          this.show();
        }
        delete this.pendingRefresh;
      });
    }
  }

  show(): void {
    switch (this._state) {
      case 'unattached':
        this.attach();
        if (this._svg) {
          this.render(this._svg, false);
        }
        break;
      case 'showing':
        this.hide();
        if (this._svg) {
          this.render(this._svg, true);
        }
        break;
      case 'not-showing':
        if (!this._svg && !this._customSvg) {
          this.attach();
        }
        if (this._svg) {
          this.render(this._svg, false);
        }
        break;
    }
  }

  hide(): void {
    if (this._svg) {
      while (this._svg.lastChild) {
        this._svg.removeChild(this._svg.lastChild);
      }
    }
    this._state = 'not-showing';
  }

  remove(): void {
    if (!this._customSvg && this._svg && this._svg.parentElement) {
      this._svg.parentElement.removeChild(this._svg);
    }
    if (this._customSvg && this._svg) {
      while (this._svg.lastChild) {
        this._svg.removeChild(this._svg.lastChild);
      }
    }
    this._svg = undefined;
    this._state = 'unattached';
    this.detachListeners();
  }

  private render(svg: SVGSVGElement, ensureNoAnimation: boolean) {
    let config = this._config;
    if (ensureNoAnimation) {
      config = { ...this._config, animate: false };
    }
    const rects = this.rects();
    let totalWidth = 0;
    rects.forEach((rect) => (totalWidth += rect.w));
    const totalDuration = config.animationDuration || DEFAULT_ANIMATION_DURATION;
    let delay = 0;
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      const ad = totalWidth ? totalDuration * (rect.w / totalWidth) : totalDuration;
      renderAnnotation(svg, rect, config, delay + this._animationDelay, ad, this._seed);
      delay += ad;
    }
    this._lastSizes = rects;
    this._state = 'showing';
  }

  private rects(): Rect[] {
    const ret: Rect[] = [];
    if (this._svg) {
      if (this._config.multiline) {
        const elementRects = this._e.getClientRects();
        if (elementRects && elementRects.length > 0) {
          for (let i = 0; i < elementRects.length; i++) {
            ret.push(this.svgRect(this._svg, elementRects[i]));
          }
        } else {
          ret.push(this.svgRect(this._svg, this._e.getBoundingClientRect()));
        }
      } else {
        ret.push(this.svgRect(this._svg, this._e.getBoundingClientRect()));
      }
    }
    return ret;
  }

  private svgRect(svg: SVGSVGElement, bounds: DOMRect | DOMRectReadOnly): Rect {
    const rect1 = svg.getBoundingClientRect();
    const rect2 = bounds;
    return {
      x: (rect2.x || rect2.left) - (rect1.x || rect1.left),
      y: (rect2.y || rect2.top) - (rect1.y || rect1.top),
      w: rect2.width,
      h: rect2.height
    };
  }
}

export function annotate(element: HTMLElement, config: RoughAnnotationConfig): RoughAnnotation {
  return new RoughAnnotationImpl(element, config);
}

export function annotationGroup(annotations: RoughAnnotation[]): RoughAnnotationGroup {
  let delay = 0;
  for (const a of annotations) {
    const ai = a as RoughAnnotationImpl;
    ai._animationDelay = delay;
    const duration = ai.animationDuration === 0 ? 0 : (ai.animationDuration || DEFAULT_ANIMATION_DURATION);
    delay += duration;
  }
  const list = [...annotations];
  return {
    show() {
      for (const a of list) {
        a.show();
      }
    },
    hide() {
      for (const a of list) {
        a.hide();
      }
    }
  };
}
