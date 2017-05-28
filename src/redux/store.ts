import { Store, Middleware, createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';
import { AppStore } from './IStore';
import { createLogger } from 'redux-logger';

export function configureStore(initialState?: AppStore): Store<AppStore> {

  const middlewares: Middleware[] = [];

  /** Add Only Dev. Middlewares */
  const logger = createLogger();
  middlewares.push(logger);

  const composeEnhancers = compose;

  const store = createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(...middlewares),
  ));

  return store;
}
