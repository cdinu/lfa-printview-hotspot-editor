import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as reducers from '../reducers';

const rootReducer = combineReducers(reducers);

export default function configureStore(initialState) {
  let composeEnhancers = compose;
  if (process.env.NODE_ENV !== 'production') {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }

  const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunkMiddleware),
  ), initialState);
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(reducers);
    });
  }
  return store;
}
