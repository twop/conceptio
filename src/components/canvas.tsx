import { check } from '../utils';
import { DragEvent } from '../logic/dragndrop';
import { Id, newId } from '../models/id';
import { canvasActions } from '../redux/canvas.actions';
import { AppStore } from '../redux/IStore';
import { DragAndDrop } from '../logic/dragndrop';

import * as React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';

import { RectFigure } from '../models/figure-rect';
import { Rectangle } from '../models/geometry/rectangle';
import { RectElement } from '../components/element-rect';
import { Draggable } from '../components/draggable';

import { Point } from '../models/geometry/point';
import { MarkUp } from '../components/markup';
import { Rect } from '../components/rect';

export interface CanvasProps {
    width: number;
    dnd: DragAndDrop;
}

interface CanvasReduxProps {
    figures: RectFigure[];
    selectedFigure?: RectFigure;
}

type CanvasState =
    { state: 'idle' } |
    { state: 'moving', dragStart: Point } |
    { state: 'creating', dragStart: Point, dragRect: Rectangle };

interface RectElementWithId { new (): RectElement<Id>; }
const RectElementWithId = RectElement as RectElementWithId;
type FiugreDragEvent = DragEvent<Id>;

interface StateModification {
    (prevState: CanvasState, props: Props): CanvasState;
}

const idleState: CanvasState = { state: 'idle' };
const idle: StateModification = (prev, props) => idleState;
const movingFigure = (dragStart: Point): StateModification => (prev, props) => ({ state: 'moving', dragStart });
const newFigure = (dragStart: Point): StateModification => (prev, props) => ({
    state: 'creating',
    dragRect: new Rectangle(dragStart.x, dragStart.y, 0, 0),
    dragStart,
});

const resize = (toPoint: Point): StateModification => (prevState, props) => {
    if (prevState.state === 'idle') { return prevState; }
    return {
        state: 'creating',
        dragStart: prevState.dragStart,
        dragRect: Rectangle.betweenPoints(prevState.dragStart, toPoint)
    };
};

const dragRectStyle = { strokeWidth: 2, strokeOpacity: 0.5 };

type Props = CanvasProps & CanvasReduxProps & { dispatch: Dispatch<{}> };

class CanvasComponent extends React.Component<Props, CanvasState> {

    private svg: SVGElement | null = null;

    constructor(props: Props) {
        super(props);
        this.state = idleState;
    }

    public render(): JSX.Element {
        return (
            <Draggable
                onStart={this.addEmptyFigure}
                onDrag={this.resizeFigure}
                onEnd={this.commitFigure}
                relativeTo={this.getSvgInstance}
                dnd={this.props.dnd}
            >
                <svg
                    ref={this.setSvgInstance}
                    width={this.props.width}
                    height={this.props.width}
                >
                    <rect width="100%" height="100%" opacity="0.2" fill="gray" />
                    {this.props.figures.map(this.renderFigure)}
                    {this.renderDragRect(this.state)}
                    <MarkUp
                        dispatch={this.props.dispatch}
                        figure={this.props.selectedFigure}
                        relativeTo={this.getSvgInstance}
                        dnd={this.props.dnd}
                    />
                </svg>
            </Draggable>
        );
    }
    private setSvgInstance = (svg: SVGElement) => this.svg = svg;
    private getSvgInstance = () => check(this.svg);
    private findFigure = (figureId: Id): RectFigure => check(this.props.figures.find((f) => f.id === figureId));
    private resizeFigure = ({ point }: FiugreDragEvent) => this.setState(resize(point));
    private addEmptyFigure = ({ point }: FiugreDragEvent) => this.setState(newFigure(point));

    private commitFigure = () => {
        if (this.state.state !== 'creating') { throw new Error('smth'); }

        const newRect: RectFigure = {
            id: newId(),
            rect: this.state.dragRect,
            color: 'green',
            opacity: 0.5,
        };

        this.setState(idle);
        this.props.dispatch(canvasActions.addFigure(newRect));
    }

    private figureStartMove = ({ payload: figureId, point }: FiugreDragEvent) => {
        const figure: RectFigure = this.findFigure(check(figureId));
        const dragOffset: Point = figure.rect.leftTop.subtract(point);
        this.setState(movingFigure(dragOffset));
    }

    private figureMove = ({ payload: figureId, point }: FiugreDragEvent) => {

        if (this.state.state !== 'moving') { return; }

        const figure: RectFigure = this.findFigure(check(figureId));
        const dragOffset: Point = this.state.dragStart;
        this.props.dispatch(canvasActions.moveFigure(figure.id, point.copy().add(dragOffset)));
    }

    private figureEndMove = () => this.setState(idle);

    private onFigureMouseDown = (evt: FiugreDragEvent) => {
        // console.log('onFigure mouse down', evt);
        evt.mouseEvent.stopPropagation();
        const figureId: Id = check(evt.payload);
        this.props.dispatch(canvasActions.selectFigure(figureId));
    }

    private renderFigure = (figure: RectFigure) => {
        return (
            <RectElementWithId
                key={figure.id}
                onStart={this.figureStartMove}
                onDrag={this.figureMove}
                onEnd={this.figureEndMove}
                onDown={this.onFigureMouseDown}
                relativeTo={this.getSvgInstance}
                payload={figure.id}
                dnd={this.props.dnd}
                rectFigure={figure}
            />);
    }

    private renderDragRect = (state: CanvasState) => {
        if (!this.state || this.state.state !== 'creating') { return null; }
        return (
            <Rect
                opacity={0.5}
                fill="black"
                style={dragRectStyle}
                rect={this.state.dragRect}
            />);
    }

}

const mapStateToProps: MapStateToProps<CanvasReduxProps, CanvasProps> = (store: AppStore) => {
    const newProps: CanvasReduxProps = {
        figures: store.canvas.figures,
        selectedFigure: store.canvas.figures.find((f) => f.id === store.canvas.selected),
    };

    return newProps;
};

export const Canvas: React.ComponentClass<CanvasProps> = connect(mapStateToProps)(CanvasComponent);
