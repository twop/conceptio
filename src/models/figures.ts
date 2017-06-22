import { Id } from './id';
import { Rectangle } from './geometry/rectangle';

export interface RectData {
    rect: Rectangle;
    color: string;
    opacity: number;
}

interface FigureId {
    id: Id;
}

export interface RectFigure extends RectData, FigureId {
    type: 'rect';
}

export interface EllipseFigure extends RectData, FigureId {
    type: 'ellipse';
}

export type Figure = RectFigure | EllipseFigure;
