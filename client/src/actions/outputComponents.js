import * as types from './types';

export const selectComponent = (id) => ({
  type: types.SELECT_COMPONENT,
  id: id.toString()
});

export const addComponent = () => ({
  type: types.ADD_COMPONENT
});

export const openEditComponentModel = (id, availableProps) => ({
  type: types.OPEN_EDIT_COMPONENT_MODAL,
  id,
  availableProps
});;

export const editComponentUpdate = (update) => ({
  type: types.EDIT_COMPONENT_UPDATE,
  update
});

export const saveComponentUpdate = () => ({
  type: types.SAVE_COMPONENT_UPDATE
})

export const closeEditComponentModel = () => ({
  type: types.CLOSE_EDIT_COMPONENT_MODAL
});

export const updateComponentName = (id, update) => ({
  type: types.UPDATE_COMPONENT,
  id: id.toString(),
  update: update
});

export const removeComponent = (id) => ({
  type: types.REMOVE_COMPONENT,
  id: id.toString()
});

export const addChildComponent = ({parent, child}) => ({
  type: types.ADD_CHILD_COMPONENT,
  parent: parent.toString(),
  child: child.toString()
});

export const removeChildComponent = ({parent, childIndex}) => ({
  type: types.REMOVE_CHILD_COMPONENT,
  parent: parent.toString(),
  childIndex
});

export const toggleComponentConnection = (id) => ({
  type: types.TOGGLE_COMPONENT_CONNECTION,
  id
});

export const bindActionToComponent = (id, outputAction) => ({
  type: types.BIND_ACTION_TO_COMPONENT,
  id,
  outputAction
});

export const removeActionFromComponent = (id, outputAction) => ({
  type: types.REMOVE_ACTION_FROM_COMPONENT,
  id,
  outputAction
});

export const bindStorePropToComponent = (id, outputStoreProp, outputStorePropName) => ({
  type: types.BIND_STORE_PROP_TO_COMPONENT,
  id,
  outputStoreProp,
  outputStorePropName
});

export const removeStorePropFromComponent = (id, outputStoreProp) => ({
  type: types.REMOVE_STORE_PROP_FROM_COMPONENT,
  id,
  outputStoreProp
});

export const bindParentPropToComponent = (id, parentProp, childProp) => ({
  type: types.BIND_PARENT_PROP_TO_COMPONENT,
  id,
  parentProp,
  childProp
});

export const removeParentPropFromComponent = (id, parentProp) => ({
  type: types.REMOVE_PARENT_PROP_FROM_COMPONENT,
  id,
  parentProp
});
