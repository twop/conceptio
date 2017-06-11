import { Id } from '../models/id';
import { RectFigure } from '../models/figure-rect';
import { History } from './undoable';

export interface AppStore {
  canvas: History<Canvas>;
}

export interface Canvas {
  figures: RectFigure[];
  selected: Id;
}
