import { Id } from '../models/id';
import { canvasActions } from '../redux/canvas.actions';
import * as React from 'react';

import { Dispatch } from 'redux';

import { Draggable, RelativeTo } from './draggable';
import { Rectangle } from '../models/geometry/rectangle';
import { DragAndDrop, DragEvent } from '../logic/dragndrop';
import { Figure } from '../models/figures';
import { Size } from '../models/geometry/size';
import { constructHandlers, RectHandlerType } from '../models/drag-handler';
import { Rect } from './primitives';

export interface MarkUpProps {
  figure?: Figure;
  dnd: DragAndDrop;
  relativeTo: RelativeTo;
  dispatch: Dispatch<void>;
}

interface HandleWithId {
  figureId: Id;
  handleType: RectHandlerType;
}

type Props = MarkUpProps & { dispatch: Dispatch<void> };

export class MarkUp extends React.Component<Props, void> {
  public moveFigure = (evt: DragEvent) => {
    const { payload, point } = evt;
    const { handleType, figureId } = payload as HandleWithId;
    this.props.dispatch(canvasActions.adjustFigure(figureId, point.copy(), handleType));
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    return this.props.figure !== nextProps.figure;
  }

  public onHandlerMouseDown = (evt: DragEvent) => evt.mouseEvent.stopPropagation();

  public render(): JSX.Element | null {
    const { figure, dnd, relativeTo } = this.props;

    if (!figure) { return null; }

    const size = new Size(10, 10);
    const handlers = constructHandlers(figure.rect)
      .map((h) => {
        return {
          handleType: h.type,
          rect: Rectangle.fromCenter(h.point, size),
        };
      });

    const elements = handlers.map((h) => {
      const handleWithId: HandleWithId = { figureId: figure.id, handleType: h.handleType };
      interface MarkupDraggable { new (): Draggable<HandleWithId>; }
      const MarkupDraggable = Draggable as MarkupDraggable;

      return (
        <MarkupDraggable
          key={h.handleType}
          dnd={dnd}
          relativeTo={relativeTo}
          payload={handleWithId}
          onDrag={this.moveFigure}
          onDown={this.onHandlerMouseDown}
        >
          <Rect rect={h.rect} fill="blue" opacity={0.7} />
        </MarkupDraggable >);
    });

    return <g> {elements} </g>;
  }
}
