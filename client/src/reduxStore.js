import { createStore, applyMiddleware } from 'redux';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage';

import reducer from './reducers';

const engine = createEngine('redux-kit-n-storage');
const storageMiddleware = storage.createMiddleware(engine);

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(storageMiddleware)
);

const load = storage.createLoader(engine);

load(store)
  .then((newState) => console.log('Loaded state:', newState));

export default store;
