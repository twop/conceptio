import { MuiTheme } from 'material-ui/styles';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';

import { Draggable } from '../components/draggable';
import { Element } from '../components/element';
import { MarkUp } from '../components/markup';
import { Rect } from '../components/primitives';
import { DragAndDrop } from '../logic/dragndrop';
import { DragEvent } from '../logic/dragndrop';
import { Figure, RectData } from '../models/figures';
import { Point } from '../models/geometry/point';
import { Id, newId } from '../models/id';
import { canvasActions } from '../redux/canvas.actions';
import { AppStore, ToolType } from '../redux/IStore';
import { check } from '../utils';
import { CanvasState, idle, idleState, moveFigure, newFigure, resize } from './canvas-state';

export interface CanvasProps {
    width: number;
    dnd: DragAndDrop;
    muiTheme?: MuiTheme;
}

interface CanvasReduxProps {
    figures: Figure[];
    selectedFigure?: Figure;
    activeTool: ToolType;
}

interface ElementWithId { new (): Element<Id>; }
const ElementWithId = Element as ElementWithId;
type FigureDragEvent = DragEvent<Id>;

const dragRectStyle = { strokeWidth: 2, strokeOpacity: 0.5 };

type Props = CanvasProps & CanvasReduxProps & { dispatch: Dispatch<{}> };

class CanvasComponent extends React.Component<Props, CanvasState> {

    private svg: SVGElement | null = null;

    constructor(props: Props) {
        super(props);
        this.state = idleState;
    }

    public render(): JSX.Element {
        const canvasColor = check(check(check(this.props.muiTheme).palette).canvasColor);

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
                    <rect width="100%" height="100%" opacity="1" fill={canvasColor} />
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
    private findFigure = (figureId: Id): Figure => check(this.props.figures.find((f) => f.id === figureId));
    private resizeFigure = ({ point }: FigureDragEvent) => this.setState(resize(point));
    private addEmptyFigure = ({ point }: FigureDragEvent) => this.setState(newFigure(point));

    private commitFigure = () => {
        if (this.state.state !== 'creating') { throw new Error('smth'); }

        const figureData: RectData = {
            rect: this.state.dragRect,
            color: 'green',
            opacity: 0.5,
        };
        const id = newId();
        const figure: Figure = this.props.activeTool === 'ellipse' ?
            { ...figureData, id, type: 'ellipse' } :
            { ...figureData, id, type: 'rect', };

        this.setState(idle);
        this.props.dispatch(canvasActions.addFigure(figure));
    }

    private figureStartMove = ({ payload: figureId, point }: FigureDragEvent) => {
        const figure: Figure = this.findFigure(check(figureId));
        const dragOffset: Point = figure.rect.leftTop.subtract(point);
        this.setState(moveFigure(dragOffset));
    }

    private figureMove = ({ payload: figureId, point }: FigureDragEvent) => {

        if (this.state.state !== 'moving') { return; }

        const figure: Figure = this.findFigure(check(figureId));
        const dragOffset: Point = this.state.dragStart;
        this.props.dispatch(canvasActions.moveFigure(figure.id, point.copy().add(dragOffset)));
    }

    private figureEndMove = () => this.setState(idle);

    private onFigureMouseDown = (evt: FigureDragEvent) => {
        // console.log('onFigure mouse down', evt);
        evt.mouseEvent.stopPropagation();
        const figureId: Id = check(evt.payload);
        this.props.dispatch(canvasActions.selectFigure(figureId));
    }

    private renderFigure = (figure: Figure) => {
        return (
            <ElementWithId
                key={figure.id}
                onStart={this.figureStartMove}
                onDrag={this.figureMove}
                onEnd={this.figureEndMove}
                onDown={this.onFigureMouseDown}
                relativeTo={this.getSvgInstance}
                payload={figure.id}
                dnd={this.props.dnd}
                figure={figure}
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
    const canvas = store.canvas.present;
    const newProps: CanvasReduxProps = {
        activeTool: store.tool.active,
        figures: canvas.figures,
        selectedFigure: canvas.figures.find((f) => f.id === canvas.selected),
    };

    return newProps;
};

export const Canvas = muiThemeable()(connect(mapStateToProps)(CanvasComponent));
