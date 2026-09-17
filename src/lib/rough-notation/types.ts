export type RoughAnnotationType = 
  | 'underline' 
  | 'box' 
  | 'circle' 
  | 'highlight' 
  | 'strike-through' 
  | 'crossed-off' 
  | 'bracket';

export type BracketType = 'left' | 'right' | 'top' | 'bottom';

export type FullPadding = [number, number, number, number];

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface RoughAnnotationConfig {
  animate?: boolean;
  animationDuration?: number;
  color?: string;
  strokeWidth?: number;
  padding?: number | [number, number] | [number, number, number, number] | number[];
  iterations?: number;
  brackets?: BracketType | BracketType[];
  multiline?: boolean;
  rtl?: boolean;
  type: RoughAnnotationType;
  order?: number;
  svg?: SVGSVGElement;
}

export interface RoughAnnotation {
  isShowing(): boolean;
  show(): void;
  hide(): void;
  remove(): void;
  color: string;
  strokeWidth: number;
  padding: number | [number, number] | [number, number, number, number] | number[];
  animate: boolean;
  animationDuration: number;
  iterations: number;
}

export interface RoughAnnotationGroup {
  show(): void;
  hide(): void;
}
