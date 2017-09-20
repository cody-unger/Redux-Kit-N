import * as types from '../actions/types';
import _ from 'lodash';
import utils from '../utilities';

const initialState = {
  properties: [],
  warning: '',
  lastUpdatedBy: null,
  editing: null
};

const outputStoreReducer = (state = initialState, action = {}) => {
  switch (action.type) {

    case types.SET_OUTPUT_STORE_PROPERTY: {
      if (
        action.property.type === 'Object' &&
      !('properties' in action.property)
      ) {
        action.property.properties = [];
      }

      if (
        action.property.type === 'Array' &&
      !('elementSchema' in action.property)
      ) {
        action.property.elementSchema = {};
      }

      let pathString = utils.outputStore.buildPropertiesPath(action.path);
      return utils.safeSet(state, action.property, pathString);
    }

    case types.REMOVE_OUTPUT_STORE_PROPERTY: {
      let pathString = utils.outputStore.buildPropertiesPath(action.path);
      return utils.safeDelete(state, pathString);
    }

    case types.TOGGLE_EDIT_STORE_MODAL: {
      if (state.editing) {
        state = utils.safeSet(state, null, 'editing');

      } else {
        let path = action.path;
        let targetName = action.targetName;
        let lookupKeys = path.slice(0, path.length - 1);
        let finalKey = path[path.length - 1];
        let nestedObj = state.properties;

        lookupKeys.forEach((key, index) => {
          nestedObj = nestedObj[key];
          if (!isNaN(Number(path[index + 1]))) {
            nestedObj = nestedObj.properties;
          }
        });

        state = utils.safeSet(state, {path, targetName, property: nestedObj[finalKey] || {}}, 'editing');
      }

      return state;
    }

  }

  return state;
};

export default outputStoreReducer;
