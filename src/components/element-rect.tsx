import { Draggable, DraggableProps } from './draggable';
import { RectFigure } from '../models/figure-rect';
import * as React from 'react';
import { Rect } from './rect';

export interface RectProps {
  rectFigure: RectFigure;
}

// export const RectElement = (props: IRectProps) => {
//   const {rect, opacity, color} = props.rectFigure;
//   return <rect onMouseDown={props.onMouseDown} {...rect} fill={color} opacity={opacity} />;
// };

export class RectElement<T = {}> extends React.Component<RectProps & DraggableProps<T>, void> {
  public render(): JSX.Element {
    interface RectDraggable { new (): Draggable<T>; }
    const RectDraggable = Draggable as RectDraggable;
    const { rectFigure, children, ...draggableProps } = this.props;
    const { rect, opacity, color } = rectFigure;
    return (
      <RectDraggable {...draggableProps}>
        <Rect
          rect={rect}
          fill={color}
          opacity={opacity}
        />
      </RectDraggable>);
  }
}
