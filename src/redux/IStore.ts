import { Id } from '../models/id';
import { RectFigure } from '../models/figure-rect';

export interface AppStore {
  canvas: Canvas;
}

export interface Canvas {
  figures: RectFigure[];
  selected: Id;
}
