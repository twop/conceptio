import { Point } from '../models/geometry/point';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as React from 'react';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeLast';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/concat';

export interface DragSubscription {
  unsubscribe: () => void;
  onMouseDown: (evt: React.MouseEvent<{}>) => void;
}

export interface DragMouseEvent {
  clientX: number;
  clientY: number;
  stopPropagation: () => void;
}

export interface DragEvent<T = {}> {
  mouseEvent: DragMouseEvent;
  point: Point;
  payload?: T;
}

export type DragCallback = (evt: DragEvent) => void;

export interface DragActions<T = {}> {
  onStart?: DragCallback;
  onDrag?: DragCallback;
  onEnd?: DragCallback;
  onDown?: DragCallback;
  payload?: T;
  getPayload?: () => T | undefined;
}

export function getRelativePos(evt: { clientX: number, clientY: number }, offsetParent: Element): Point {
  const isBody = offsetParent === offsetParent.ownerDocument.body;
  const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect();

  const x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left;
  const y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top;

  return new Point(x, y);
}

export class DragAndDrop {
  constructor(
    private documentUp$: Observable<MouseEvent>,
    private documentMove$: Observable<MouseEvent>) {
  }

  public subscribe(
    actions: DragActions,
    mouseDown$: Subject<React.MouseEvent<{}>>,
    parent: () => Element): DragSubscription {

    const { onStart, onDrag, onEnd, onDown, payload, getPayload } = actions;

    const makeDragEvent = (mouseEvent: DragMouseEvent): DragEvent => {
      return {
        mouseEvent,
        point: getRelativePos(mouseEvent, parent()),
        payload: getPayload ? getPayload() : payload,
      };
    };

    const drops$ = mouseDown$
      .map(makeDragEvent)
      .do((p) => onDown && onDown(p))
      .mergeMap((startPoint) => {
        let first: boolean = true;
        return this.documentMove$
          .takeUntil(this.documentUp$)
          .do((e) => e.preventDefault())
          .map(makeDragEvent)
          .do((p) => {
            if (first && onStart) { onStart(startPoint); }
            if (onDrag) { onDrag(p); }
            first = false;
          })
          .takeLast(1);
      })
      .do((p) => onEnd && onEnd(p));

    const subscription = drops$.subscribe({
      // tslint:disable-next-line:no-empty
      next: (endPoint) => {},
      // tslint:disable-next-line:no-empty
      complete: () => {},
    });

    return {
      unsubscribe: () => subscription.unsubscribe(),
      onMouseDown: (e) => mouseDown$.next(e),
    };
  }
}
