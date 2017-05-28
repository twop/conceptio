import { DragAndDrop } from './logic/dragndrop';
import { Observable } from 'rxjs/Rx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';

const mouseup$: Observable<MouseEvent> =  Observable.empty<MouseEvent>(); 
const mousemove$: Observable<MouseEvent> = Observable.empty<MouseEvent>();

const dnd = new DragAndDrop(mouseup$, mousemove$);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App dnd={dnd} />, div);
});
