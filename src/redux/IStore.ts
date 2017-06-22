import { Figure } from '../models/figures';
import { Id } from '../models/id';
import { History } from './undoable';

export interface AppStore {
  canvas: History<Canvas>;
  tool: Tool;
}

export type ToolType = 'rect' | 'ellipse';

export interface Tool {
  active: ToolType;
}

export interface Canvas {
  figures: Figure[];
  selected: Id;
}
