import { RectHandlerType } from '../models/drag-handler';
import { Point } from '../models/geometry/point';
import { Id } from '../models/id';
import { Action } from 'redux';

import { Figure } from '../models/figures';
import { type } from './utils';

export const ADD_FIGURE = type('[Canvas] add figure');
export const SELECT_FIGURE = type('[Canvas] select figure');
export const MOVE_FIGURE = type('[Canvas] move figure');
export const ADJUST_FIGURE = type('[Canvas] adjust figure');
export const DELETE_FIGURE = type('[Canvas] delete figure');
export const CANVAS_UNDO = type('[Canvas] undo');
export const CANVAS_REDO = type('[Canvas] redo');

export interface NewFigureAction extends Action {
  figure: Figure;
}

export interface SelectFigureAction extends Action {
  figureId: Id;
}

export interface DeleteFigureAction extends Action {
  figureId: Id;
}

export interface MoveFigureAction extends Action {
  figureId: Id;
  toLocation: Point;
}

export interface AdjustFigureAction extends Action {
  figureId: Id;
  handleLocation: Point;
  handleType: RectHandlerType;
}

export const canvasActions = {
  undo: (): Action => ({ type: CANVAS_UNDO }),
  redo: (): Action => ({ type: CANVAS_REDO }),
  addFigure: (figure: Figure): NewFigureAction => ({ type: ADD_FIGURE, figure }),
  selectFigure: (figureId: Id): SelectFigureAction => ({ type: SELECT_FIGURE, figureId }),
  deleteFigure: (figureId: Id): DeleteFigureAction => ({ type: DELETE_FIGURE, figureId }),
  moveFigure: (figureId: Id, toLocation: Point): MoveFigureAction => ({ type: MOVE_FIGURE, figureId, toLocation }),
  adjustFigure: (figureId: Id, handleLocation: Point, handleType: RectHandlerType): AdjustFigureAction =>
    ({ type: ADJUST_FIGURE, figureId, handleLocation, handleType }),
};
