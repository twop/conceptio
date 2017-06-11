import { undoable, UndoableConfig } from './undoable';
import { Point } from '../models/geometry/point';
import { RectHandlerType } from '../models/drag-handler';
import { Rectangle } from '../models/geometry/rectangle';
import { Reducer } from 'redux';
import { HandlerMap, createReducer } from 'nested-reducer';

import {
    ADD_FIGURE,
    ADJUST_FIGURE,
    AdjustFigureAction,
    CANVAS_REDO,
    CANVAS_UNDO,
    DELETE_FIGURE,
    DeleteFigureAction,
    MOVE_FIGURE,
    MoveFigureAction,
    NewFigureAction,
    SELECT_FIGURE,
    SelectFigureAction
} from './canvas.actions';
import { Canvas } from './IStore';

const initialState: Canvas = { figures: [], selected: 0 };

const canvasHandlers: HandlerMap<Canvas> = {
  [ADD_FIGURE]: (state, { figure }: NewFigureAction) => ({ ...state, figures: [...state.figures, figure] }),
  [SELECT_FIGURE]: (state, { figureId }: SelectFigureAction) => ({ ...state, selected: figureId }),
  [ADJUST_FIGURE]: (state, { figureId, handleLocation, handleType }: AdjustFigureAction) => ({
    ...state,
    figures: state.figures.map((f) => {
      if (f.id !== figureId) { return f; }
      return { ...f, rect: adjustHandlers[handleType](f.rect, handleLocation) };
    }),
  }),
  [MOVE_FIGURE]: (state, { figureId, toLocation }: MoveFigureAction) => ({
    ...state,
    figures: state.figures.map((f) => {
      if (f.id !== figureId) { return f; }
      return { ...f, rect: f.rect.moveTo(toLocation) };
    }),
  }),
  [DELETE_FIGURE]: (state, { figureId }: DeleteFigureAction) => ({
    ...state,
    figures: state.figures.filter(f => f.id !== figureId),
    selected: state.selected === figureId ? 0 : state.selected
  }),
};

const config: UndoableConfig = { limit: 10, undoAction: CANVAS_UNDO, redoAction: CANVAS_REDO };
export const reducer: Reducer<Canvas> = createReducer(canvasHandlers, initialState);
export const canvasReducer = undoable(reducer, config, initialState);

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
