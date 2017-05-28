import { Id } from './id';
import { Rectangle } from './geometry/rectangle';

export interface RectFigure {
  id: Id;
  rect: Rectangle;
  color: string;
  opacity: number;
}
