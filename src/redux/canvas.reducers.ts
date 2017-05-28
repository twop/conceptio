import { Point } from '../models/geometry/point';
import { RectHandlerType } from '../models/drag-handler';
import { Rectangle } from '../models/geometry/rectangle';
import { Reducer, Action } from 'redux';

import {
  canvasActionTypes,
  AdjustFigureAction,
  MoveFigureAction,
  NewFigureAction,
  SelectFigureAction,
} from './canvas.actions';
import { Canvas } from './IStore';

const initialState: Canvas = { figures: [], selected: 0 };

export const canvasReducer: Reducer<Canvas> = (state = initialState, action: Action) => {

  switch (action.type) {
    case canvasActionTypes.ADD_FIGURE: {
      const { figure } = action as NewFigureAction;
      return { ...state, figures: [...state.figures, figure] };
    }
    case canvasActionTypes.SELECT_FIGURE: {
      const { figureId } = action as SelectFigureAction;
      return { ...state, selected: figureId };
    }
    case canvasActionTypes.MOVE_FIGURE: {
      const { figureId, toLocation } = action as MoveFigureAction;
      return {
        ...state,
        figures: state.figures.map((f) => {
          if (f.id !== figureId) { return f; }
          return { ...f, rect: f.rect.moveTo(toLocation) };
        }),
      };
    }
    case canvasActionTypes.ADJUST_FIGURE: {
      const { figureId, handleLocation, handleType } = action as AdjustFigureAction;
      return {
        ...state,
        figures: state.figures.map((f) => {
          if (f.id !== figureId) { return f; }
          return { ...f, rect: adjustHandlers[handleType](f.rect, handleLocation) };
        }),
      };
    }
    default: { return state; }
  }
};

interface AdjustHandlers {
  [key: number]: (rect: Rectangle, handleLocation: Point) => Rectangle;
}

const adjustHandlers: AdjustHandlers = {
  [RectHandlerType.LeftTop]: (rect, point) => Rectangle.betweenPoints(point, rect.rightBottom),

  [RectHandlerType.Top]: (rect, point) => Rectangle.betweenPoints(new Point(rect.x, point.y), rect.rightBottom),

  [RectHandlerType.RightTop]: (rect, point) => Rectangle.betweenPoints(
    new Point(rect.x, point.y),
    new Point(point.x, rect.bottom)),

  [RectHandlerType.Right]: (rect, point) => Rectangle.betweenPoints(rect.leftTop, new Point(point.x, rect.bottom)),

  [RectHandlerType.RightBottom]: (rect, point) => Rectangle.betweenPoints(rect.leftTop, point),

  [RectHandlerType.Bottom]: (rect, point) => Rectangle.betweenPoints(rect.leftTop, new Point(rect.right, point.y)),

  [RectHandlerType.LeftBottom]: (rect, point) => Rectangle.betweenPoints(
    new Point(point.x, rect.y),
    new Point(rect.right, point.y)),

  [RectHandlerType.Left]: (rect, point) => Rectangle.betweenPoints(new Point(point.x, rect.y), rect.rightBottom),
};
