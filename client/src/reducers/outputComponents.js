import * as types from '../actions/types';
import utils from '../utilities';
import _ from 'lodash';
const { makeMutableCopy, safeSet, safeDelete, tree } = utils;

const initialState = {
  selected: '0',
  nextId: 1,
  components: {
    0: {
      name: 'App',
      children: [],
      nextId: 0,
      connected: false,
      actions: {},
      storeProps: [],
      parentProps: []
    }
  },
  editing: null,
};

const outputComponentsReducer = (state = initialState, action = {}) => {
  let newState;
  try {
    switch (action.type) {

      case types.SELECT_COMPONENT: {
        if (action.id in state.components) {
          return _.assign({}, state, {selected: action.id});
        } else {
          throw 'The component id you passed does not exist in state.components.';
        }
      }

      case types.ADD_COMPONENT: {
        newState = makeMutableCopy(state, 'components.0', 'nextId');
        newState.components[state.nextId] = {
          name: `Component${state.nextId}`,
          children: [],
          nextId: 0,
          connected: false,
          actions: {},
          storeProps: [],
          parentProps: []
        };
        newState.nextId += 1;
        return newState;
      }

      case types.OPEN_EDIT_COMPONENT_MODAL: {
        let id = action.id;
        let component = state.components[id];
        let availableProps = action.availableProps;
        return safeSet(state, {id, component, availableProps}, 'editing');
      }

      case types.SUBMIT_COMPONENT_UPDATE: {
        let componentId = state.editing.id;
        let newComponent = Object.assign(
          {},
          state.components[componentId],
          action.update
        );
        return safeSet(state, newComponent, `components.${componentId}`);
      }

      case types.CLOSE_EDIT_COMPONENT_MODAL: {
        return safeSet(state, null, 'editing');
      }

      case types.UPDATE_COMPONENT_NAME:
        return safeSet(state, action.name, `components.${action.id}.name`);

      case types.REMOVE_DELETED_ACTION_FROM_COMPONENTS:
        let { outputAction } = action;
        newState = makeMutableCopy(state, 'state.components.0');

        _.forEach(state.components, (component, id) => {
          if (component.actions[outputAction]) {
            newState.components[id] = safeDelete(component, `actions.${outputAction}`);
          }
        });

        return newState;

      case types.REMOVE_COMPONENT:
        if (action.id === '0') {
          throw 'You may not remove initial app component.';
        }

        newState = makeMutableCopy(state, 'components');
        newState.components = _.cloneDeep(newState.components);
        delete newState.components[action.id];
        for (var component of Object.values(newState.components)) {
          for (var index = component.children.length - 1; index >= 0; index--) {
            component.children[index].componentId === action.id && component.children.splice(index, 1);
          }
        }
        return newState;

      case types.ADD_CHILD_COMPONENT:
        let childIsAncestor = tree.isComponentAncestor(state.components, action.child, action.parent);

        if (childIsAncestor) {
          throw 'You may not add a child to a parent if the child has the parent as a child';
        } else if (action.parent === action.child) {
          throw 'You may not a component to itself as a child';
        } else if (!(action.parent in state.components)) {
          throw 'The specified parent id does not exist';
        } else if (!(action.child in state.components)) {
          throw 'The specified child id does not exist';
        }

        newState = makeMutableCopy(
          state,
          `components.${action.parent}.children.0`
        );

        newState.components[action.parent].children.push({
          componentId: action.child,
          childId: newState.components[action.parent].nextId.toString()
        });

        newState.components[action.parent].nextId += 1;
        return newState;

      case types.REMOVE_CHILD_COMPONENT:
        if (!(action.parent in state.components)) {
          throw 'The specified parent id does not exist';
        }

        newState = makeMutableCopy(
          state,
          `components.${action.parent}.children.${action.childIndex}`
        );

        newState.components[action.parent].children.splice(action.childIndex, 1);
        return newState;

      case types.TOGGLE_COMPONENT_CONNECTION:
        let {id} = action;
        newState = makeMutableCopy(
          state,
          `components.${id}.connected`
        );

        newState.components[id].connected = !state.components[id].connected;
        return newState;

      case types.BIND_ACTION_TO_COMPONENT: {
        let {id, outputAction} = action;
        return safeSet(
          state,
          outputAction,
          `components.${id}.actions.${outputAction}`
        );
      }

      case types.REMOVE_ACTION_FROM_COMPONENT: {
        let {id, outputAction} = action;
        return safeDelete(
          state,
          `components.${id}.actions.${outputAction}`
        );
      }

      case types.BIND_STORE_PROP_TO_COMPONENT: {
        let {id, outputStoreProp, outputStorePropName} = action;

        let storeProps = state.components[id].storeProps;
        let newStoreProps = storeProps
          .filter(prop =>
            prop.storeProp !== outputStoreProp &&
          prop.propName !== outputStorePropName
          )
          .concat({
            storeProp: outputStoreProp,
            propName: outputStorePropName
          });

        return safeSet(
          state,
          newStoreProps,
          `components.${id}.storeProps`
        );
      }

      case types.REMOVE_STORE_PROP_FROM_COMPONENT: {
        let {outputStoreProp} = action;
        let outputStorePropLength = outputStoreProp.length;
        newState = makeMutableCopy(
          state,
          'components'
        );

        let components = state.components;
        for (let component in components) {
          console.log(components[component]);
          console.log('****', components[component].storeProps);
          for (let i = components[component].storeProps.length - 1; i >= 0; i--) {
            console.log('**',components[component].storeProps[i].storeProp);
            if (components[component].storeProps[i].storeProp === outputStoreProp
                || components[component].storeProps[i].storeProp.slice(0, outputStorePropLength + 1) === `${outputStoreProp}.`) {
              newState = safeDelete(state, `components.${component}.storeProps.${i}`);
            }
          }
        }

        return newState;
      }

      case types.BIND_PARENT_PROP_TO_COMPONENT: {
        let {id, parentProp, childProp} = action;

        let parentProps = state.components[id].parentProps;
        let newParentProps = parentProps
          .filter(prop =>
            prop.parentProp !== parentProp &&
          prop.childProp !== childProp
          )
          .concat(
            { parentProp, childProp }
          );

        return safeSet(
          state,
          newParentProps,
          `components.${id}.parentProps`
        );
      }

      case types.REMOVE_PARENT_PROP_FROM_COMPONENT: {
        let {id, parentProp} = action;

        let parentProps = state.components[id].parentProps;
        let newParentProps = parentProps
          .filter(prop =>
            prop.parentProp !== parentProp
          );

        return safeSet(
          state,
          newParentProps,
          `components.${id}.parentProps`
        );
      }

    }
  } catch (err) {
    console.log(err);
  }

  return state;
};

export default outputComponentsReducer;
