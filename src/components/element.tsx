import { Draggable, DraggableProps } from './draggable';
import { Figure } from '../models/figures';
import * as React from 'react';
import { Rect, Ellipse } from './primitives';

export interface RectProps {
  figure: Figure;
}

// export const RectElement = (props: IRectProps) => {
//   const {rect, opacity, color} = props.rectFigure;
//   return <rect onMouseDown={props.onMouseDown} {...rect} fill={color} opacity={opacity} />;
// };

function renderFigure(figure: Figure): JSX.Element {
  const { rect, opacity, color } = figure;
  switch (figure.type) {
    case 'rect':
      return <Rect rect={rect} fill={color} opacity={opacity} />;
    case 'ellipse':
      return <Ellipse rect={rect} fill={color} opacity={opacity} />;

    default:
      throw new Error(`unkown figure type: ${figure}`);
  }
}

export class Element<T = {}> extends React.Component<RectProps & DraggableProps<T>, void> {
  public render(): JSX.Element {
    interface RectDraggable { new (): Draggable<T>; }
    const RectDraggable = Draggable as RectDraggable;
    const { figure, children, ...draggableProps } = this.props;
    return (
      <RectDraggable {...draggableProps}>
        {renderFigure(figure)}
      </RectDraggable>);
  }
}
