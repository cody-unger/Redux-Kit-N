import * as types from './types';

export const setOutputStore = (newOutputStore, lastUpdatedBy) => (
  {
    type: types.SET_OUTPUT_STORE,
    newOutputStore,
    lastUpdatedBy
  }
);

export const toggleEditStoreModal = (path, targetName, isNewProperty) => ({
  type: types.TOGGLE_EDIT_STORE_MODAL,
  path,
  targetName,
  isNewProperty
});

export const setOutputStoreProperty = (property, path, isNewProperty) => ({
  type: types.SET_OUTPUT_STORE_PROPERTY,
  property,
  path,
  isNewProperty
});

export const removeOutputStoreProperty = (path) => ({
  type: types.REMOVE_OUTPUT_STORE_PROPERTY,
  path
});

export const setOutputStoreWarning = (warning, lastUpdatedBy) => ({
  type: types.SET_OUTPUT_STORE_WARNING,
  warning,
  lastUpdatedBy
});
