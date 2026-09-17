import rough from 'roughjs';
import type { Options, Drawable } from 'roughjs/bin/core';
import type { Rect, RoughAnnotationConfig, FullPadding, BracketType } from './types';

const SVG_NS = 'http://www.w3.org/2000/svg';

type RoughOptionsType = 'highlight' | 'single' | 'double';
type Point = [number, number];

function getOptions(type: RoughOptionsType, seed: number): Options {
  return {
    maxRandomnessOffset: 2,
    roughness: type === 'highlight' ? 3 : 1.5,
    bowing: type === 'highlight' ? 1.2 : 1,
    stroke: '#000',
    strokeWidth: 1.5,
    curveTightness: 0,
    curveFitting: 0.95,
    curveStepCount: 9,
    fillStyle: 'hachure',
    fillWeight: -1,
    hachureAngle: -41,
    hachureGap: -1,
    dashOffset: -1,
    dashGap: -1,
    zigzagOffset: -1,
    disableMultiStroke: type !== 'double',
    disableMultiStrokeFill: false,
    seed
  };
}

export function parsePadding(config: RoughAnnotationConfig): FullPadding {
  const p = config.padding;
  if (p || (p === 0)) {
    if (typeof p === 'number') {
      return [p, p, p, p];
    } else if (Array.isArray(p)) {
      const pa = p as number[];
      if (pa.length) {
        switch (pa.length) {
          case 4:
            return [...pa] as FullPadding;
          case 1:
            return [pa[0], pa[0], pa[0], pa[0]];
          case 2:
            return [...pa, ...pa] as FullPadding;
          case 3:
            return [...pa, pa[1]] as FullPadding;
          default:
            return [pa[0], pa[1], pa[2], pa[3]];
        }
      }
    }
  }
  return [5, 5, 5, 5];
}

export function renderAnnotation(
  svg: SVGSVGElement,
  rect: Rect,
  config: RoughAnnotationConfig,
  animationGroupDelay: number,
  animationDuration: number,
  seed: number
) {
  const gen = rough.generator();
  const drawables: Drawable[] = [];
  let strokeWidth = config.strokeWidth || 2;
  const padding = parsePadding(config);
  const animate = (config.animate === undefined) ? true : (!!config.animate);
  const iterations = config.iterations || (config.type === 'highlight' ? 2 : 2);
  const rtl = config.rtl ? 1 : 0;
  const o = getOptions('single', seed);

  switch (config.type) {
    case 'underline': {
      const y = rect.y + rect.h + padding[2];
      for (let i = rtl; i < iterations + rtl; i++) {
        if (i % 2) {
          drawables.push(gen.line(rect.x + rect.w, y, rect.x, y, o));
        } else {
          drawables.push(gen.line(rect.x, y, rect.x + rect.w, y, o));
        }
      }
      break;
    }
    case 'strike-through': {
      const y = rect.y + (rect.h / 2);
      for (let i = rtl; i < iterations + rtl; i++) {
        if (i % 2) {
          drawables.push(gen.line(rect.x + rect.w, y, rect.x, y, o));
        } else {
          drawables.push(gen.line(rect.x, y, rect.x + rect.w, y, o));
        }
      }
      break;
    }
    case 'box': {
      const x = rect.x - padding[3];
      const y = rect.y - padding[0];
      const width = rect.w + (padding[1] + padding[3]);
      const height = rect.h + (padding[0] + padding[2]);
      for (let i = 0; i < iterations; i++) {
        drawables.push(gen.rectangle(x, y, width, height, o));
      }
      break;
    }
    case 'bracket': {
      const brackets: BracketType[] = Array.isArray(config.brackets)
        ? config.brackets
        : (config.brackets ? [config.brackets] : ['right']);
      const lx = rect.x - padding[3] * 2;
      const rx = rect.x + rect.w + padding[1] * 2;
      const ty = rect.y - padding[0] * 2;
      const by = rect.y + rect.h + padding[2] * 2;
      for (const br of brackets) {
        let points: Point[] | undefined;
        switch (br) {
          case 'bottom':
            points = [
              [lx, rect.y + rect.h],
              [lx, by],
              [rx, by],
              [rx, rect.y + rect.h]
            ];
            break;
          case 'top':
            points = [
              [lx, rect.y],
              [lx, ty],
              [rx, ty],
              [rx, rect.y]
            ];
            break;
          case 'left':
            points = [
              [rect.x, ty],
              [lx, ty],
              [lx, by],
              [rect.x, by]
            ];
            break;
          case 'right':
            points = [
              [rect.x + rect.w, ty],
              [rx, ty],
              [rx, by],
              [rect.x + rect.w, by]
            ];
            break;
        }
        if (points) {
          drawables.push(gen.linearPath(points, o));
        }
      }
      break;
    }
    case 'crossed-off': {
      const x = rect.x;
      const y = rect.y;
      const x2 = x + rect.w;
      const y2 = y + rect.h;
      for (let i = rtl; i < iterations + rtl; i++) {
        if (i % 2) {
          drawables.push(gen.line(x2, y2, x, y, o));
        } else {
          drawables.push(gen.line(x, y, x2, y2, o));
        }
      }
      for (let i = rtl; i < iterations + rtl; i++) {
        if (i % 2) {
          drawables.push(gen.line(x, y2, x2, y, o));
        } else {
          drawables.push(gen.line(x2, y, x, y2, o));
        }
      }
      break;
    }
    case 'circle': {
      const doubleO = getOptions('double', seed);
      const width = rect.w + (padding[1] + padding[3]);
      const height = rect.h + (padding[0] + padding[2]);
      const x = rect.x - padding[3] + (width / 2);
      const y = rect.y - padding[0] + (height / 2);
      const fullItr = Math.floor(iterations / 2);
      const singleItr = iterations - (fullItr * 2);
      for (let i = 0; i < fullItr; i++) {
        drawables.push(gen.ellipse(x, y, width, height, doubleO));
      }
      for (let i = 0; i < singleItr; i++) {
        drawables.push(gen.ellipse(x, y, width, height, o));
      }
      break;
    }
    case 'highlight': {
      const highlightO = getOptions('highlight', seed);
      const effectiveH = rect.h > 0 ? rect.h : 20;
      const effectiveW = rect.w > 0 ? rect.w : 80;
      strokeWidth = config.strokeWidth || effectiveH * 0.85;
      const y = rect.y + (effectiveH / 2);
      const p = padding;
      const x1 = rect.x - p[3];
      const x2 = rect.x + effectiveW + p[1];
      for (let i = rtl; i < iterations + rtl; i++) {
        if (i % 2) {
          drawables.push(gen.line(x2, y, x1, y, highlightO));
        } else {
          drawables.push(gen.line(x1, y, x2, y, highlightO));
        }
      }
      break;
    }
  }

  const pathStrings: string[] = [];
  for (const drawable of drawables) {
    for (const set of drawable.sets) {
      const d = gen.opsToPath(set);
      if (d && d.trim()) {
        pathStrings.push(d.trim());
      }
    }
  }

  if (pathStrings.length) {
    const lengths: number[] = [];
    const pathElements: SVGPathElement[] = [];
    let totalLength = 0;

    for (const d of pathStrings) {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', config.color || 'currentColor');
      path.setAttribute('stroke-width', `${strokeWidth}`);
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');

      let length = 0;
      if (animate) {
        try {
          length = (typeof path.getTotalLength === 'function') 
            ? path.getTotalLength() 
            : (rect.w || 100);
        } catch {
          length = rect.w || 100;
        }
        lengths.push(length);
        totalLength += length;
      }
      svg.appendChild(path);
      pathElements.push(path);
    }

    if (animate) {
      let durationOffset = 0;
      for (let i = 0; i < pathElements.length; i++) {
        const path = pathElements[i];
        const length = lengths[i];
        const duration = totalLength ? (animationDuration * (length / totalLength)) : 0;
        const delay = animationGroupDelay + durationOffset;
        const style = path.style;
        style.strokeDashoffset = `${length}`;
        style.strokeDasharray = `${length}`;
        style.animation = `rough-notation-dash ${duration}ms ease-out ${delay}ms forwards`;
        durationOffset += duration;
      }
    }
  }
}
