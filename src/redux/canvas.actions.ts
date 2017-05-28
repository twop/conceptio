import { RectHandlerType } from '../models/drag-handler';
import { Point } from '../models/geometry/point';
import { Id } from '../models/id';
import { Action } from 'redux';

import { RectFigure } from '../models/figure-rect';

export const canvasActionTypes = {
  ADD_FIGURE: '[Canvas] add figure',
  SELECT_FIGURE: '[Canvas] select figure',
  MOVE_FIGURE: '[Canvas] move figure',
  ADJUST_FIGURE: '[Canvas] adjust figure',
};

export interface NewFigureAction extends Action {
  figure: RectFigure;
}

export interface SelectFigureAction extends Action {
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
  addFigure: (figure: RectFigure): NewFigureAction => {
    return { type: canvasActionTypes.ADD_FIGURE, figure };
  },
  selectFigure: (figureId: Id): SelectFigureAction => {
    return { type: canvasActionTypes.SELECT_FIGURE, figureId };
  },
  moveFigure: (figureId: Id, toLocation: Point): MoveFigureAction => {
    return { type: canvasActionTypes.MOVE_FIGURE, figureId, toLocation };
  },
  adjustFigure: (figureId: Id, handleLocation: Point, handleType: RectHandlerType): AdjustFigureAction => {
    return { type: canvasActionTypes.ADJUST_FIGURE, figureId, handleLocation, handleType };
  },
};
