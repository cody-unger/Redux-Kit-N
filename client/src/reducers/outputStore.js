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
      let pathString = utils.outputStore.buildPropertiesPath(action.path);
      
      let getOldProperty = () => {
        let keys = pathString.split('.');
        let currentValue = state;
        
        keys.forEach((key) => {
          currentValue = currentValue[key];
        });

        return currentValue;
      }

      let oldProperty = getOldProperty();

      if (
        action.property.type === 'Object' &&
      (action.isNewProperty || !oldProperty.hasOwnProperty('properties'))
      ) {
        action.property.properties = [];

      } else if (action.property.type === 'Object') {
        action.property.properties = oldProperty.properties;

      }

      if (
        action.property.type === 'Array' &&
      (action.isNewProperty || !oldProperty.hasOwnProperty('elementSchema'))
      ) {
        action.property.elementSchema = {};

      } else if (action.property.type === 'Array') {
        action.property.elementSchema = oldProperty.elementSchema;

      }

      console.log(utils.safeSet(state, action.property, pathString));

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
        let isNewProperty = action.isNewProperty;
        let lookupKeys = path.slice(0, path.length - 1);
        let finalKey = path[path.length - 1];
        let nestedObj = state.properties;

        lookupKeys.forEach((key, index) => {
          nestedObj = nestedObj[key];
          if (!isNaN(Number(path[index + 1]))) {
            nestedObj = nestedObj.properties;
          }
        });

        state = utils.safeSet(state, {path, targetName, isNewProperty, property: nestedObj[finalKey] || {}}, 'editing');
      }

      return state;
    }

  }

  return state;
};

export default outputStoreReducer;
