import { combineReducers } from 'redux';
import { LOAD } from 'redux-storage';
import utils from '../utilities';
import * as types from '../actions/types';
import outputStoreReducer from './outputStore';
import outputActionsReducer from './outputActions';
import outputComponentsReducer from './outputComponents';

const reducer = combineReducers({
  outputStore: outputStoreReducer,
  outputActions: outputActionsReducer,
  outputComponents: outputComponentsReducer
});

const miscellaneousReducer = (state, action) => {
  switch (action.type) {
    case types.TOGGLE_HELP:
      state = utils.makeMutableCopy(state, 'help')
      if (!state.helpSection) {
        state.helpSection = action.section;
      } else {
        state.helpSection = null;
      }
      return state;
  }

  return state;
}

const loadReducer = (state, action) => {
  if (action.type === LOAD) {
    console.log(action.payload);
    return Object.assign({}, state, action.payload);
  } else {
    return state;
  }
};

export default utils.applyReducersSequentially(
  reducer,
  miscellaneousReducer,
  loadReducer
);
