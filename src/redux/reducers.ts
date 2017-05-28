import { canvasReducer } from './canvas.reducers';
import { Reducer, combineReducers } from 'redux';
import { AppStore } from './IStore';

const rootReducer: Reducer<AppStore> = combineReducers<AppStore>({
  canvas: canvasReducer,
});

export default rootReducer;
