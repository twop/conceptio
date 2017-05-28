import { AppStore } from './redux/IStore';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable } from 'rxjs/Observable';

import { DragAndDrop } from './logic/dragndrop';
import { Provider } from 'react-redux';
import { App } from './App';
import { configureStore } from './redux/store';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

interface Window {
  // A hack for the Redux DevTools Chrome extension.
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <F extends Function>(f: F) => F;
  __INITIAL_STATE__?: AppStore;
}

const store = configureStore((window as Window).__INITIAL_STATE__);

const mouseup$: Observable<MouseEvent> = fromEvent(document, 'mouseup');
const mousemove$: Observable<MouseEvent> = fromEvent(document, 'mousemove');

const dnd = new DragAndDrop(mouseup$, mousemove$);

ReactDOM.render((
  <Provider store={store} key="provider">
    <App dnd={dnd} />
  </Provider>
),
                document.getElementById('root') as HTMLElement,
);
registerServiceWorker();