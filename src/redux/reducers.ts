import { Reducer, combineReducers } from 'redux';

import { canvasReducer } from './canvas.reducers';
import { AppStore } from './IStore';
import { toolbarReducer } from './toolbar-reducer';

export const rootReducer: Reducer<AppStore> = combineReducers<AppStore>({
  canvas: canvasReducer,
  tool: toolbarReducer,
});