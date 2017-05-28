import { Point } from './geometry/point';
import { Rectangle } from './geometry/rectangle';

export enum RectHandlerType {
  LeftTop,
  Top,
  RightTop,
  Right,
  RightBottom,
  Bottom,
  LeftBottom,
  Left,
}

export interface Handler {
  point: Point;
  type: RectHandlerType;
}

export const constructHandlers = ({ x, y, width, height }: Rectangle): Handler[] => [
  { point: new Point(x, y), type: RectHandlerType.LeftTop },
  { point: new Point(x + width / 2, y), type: RectHandlerType.Top },
  { point: new Point(x + width, y), type: RectHandlerType.RightTop },
  { point: new Point(x + width, y + height / 2), type: RectHandlerType.Right },
  { point: new Point(x + width, y + height), type: RectHandlerType.RightBottom },
  { point: new Point(x + width / 2, y + height), type: RectHandlerType.Bottom },
  { point: new Point(x, y + height), type: RectHandlerType.LeftBottom },
  { point: new Point(x, y + height / 2), type: RectHandlerType.Left },
];
