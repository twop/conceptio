import { Subject } from 'rxjs/Subject';
import * as React from 'react';

import { DragAndDrop, DragActions, DragSubscription } from '../logic/dragndrop';

export type RelativeTo = () => Element;

export interface DraggableProps<T = {}> extends DragActions<T> {
  dnd: DragAndDrop;
  relativeTo: RelativeTo;
}

export class Draggable<T = {}> extends React.Component<DraggableProps<T>, void> {

  private dragSubscription: DragSubscription | null = null;
  private readonly mouseDown$ = new Subject<React.MouseEvent<{}>>();

  public componentDidMount() {
    const { relativeTo, dnd, ...actions } = this.props;
    const dragActions: DragActions<T> = { ...actions, getPayload: this.getPayload };
    this.dragSubscription = dnd.subscribe(dragActions, this.mouseDown$, relativeTo);
  }

  public componentWillUnmount() {
    if (this.dragSubscription) { this.dragSubscription.unsubscribe(); }
  }

  public render(): JSX.Element {
    const child = React.Children.only(this.props.children);
    return React.cloneElement(child, { onMouseDown: this.onMouseDown });
  }

  private onMouseDown = (evt: React.MouseEvent<{}>) => this.mouseDown$.next(evt);

  private getPayload = () => this.props.payload;
}
