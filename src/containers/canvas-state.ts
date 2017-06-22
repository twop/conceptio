import { Point } from '../models/geometry/point';
import { Rectangle } from '../models/geometry/rectangle';

export type CanvasState =
    { state: 'idle' } |
    { state: 'moving', dragStart: Point } |
    { state: 'creating', dragStart: Point, dragRect: Rectangle };

export interface StateModification<TProps = {}> {
    (prevState: CanvasState, props: TProps): CanvasState;
}

export const idleState: CanvasState = { state: 'idle' };
export const idle: StateModification = (prev, props) => idleState;
export const moveFigure = (dragStart: Point): StateModification => (prev, props) => ({ state: 'moving', dragStart });
export const newFigure = (dragStart: Point): StateModification => (prev, props) => ({
    state: 'creating',
    dragRect: new Rectangle(dragStart.x, dragStart.y, 0, 0),
    dragStart,
});

export const resize = (toPoint: Point): StateModification => (prevState, props) => {
    if (prevState.state === 'idle') { return prevState; }
    return {
        state: 'creating',
        dragStart: prevState.dragStart,
        dragRect: Rectangle.betweenPoints(prevState.dragStart, toPoint)
    };
};