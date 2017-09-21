import React from 'react';
import _ from 'lodash';

export const _getChildAvailableProps = (component, availableProps) => {
  if (availableProps !== undefined) {
    return new Set(
      component.parentProps
        .filter(prop => availableProps.has(prop.parentProp))
        .map(prop => prop.childProp)
    );
  } else if (component.connected) {
    return new Set(
      component.storeProps.
        map(prop => prop.propName)
    );
  }
};

export const generateTreeArray = (
  outputComponents,
  outputActions,
  TreeBranch
) => {
  let treeArray = [];

  let key = 0;
  const traverseOutputComponents = (
    indent,
    componentId,
    availableProps,
    inheritsConnection = false
  ) => {
    let component = outputComponents[componentId];
    let hasConnectedDescendant = checkForConnectedDescendants(componentId, outputComponents);
    let connectionCanBeToggled = !inheritsConnection && !hasConnectedDescendant;
    let childrenInheritConnection = inheritsConnection || component.connected;

    treeArray.push(
      <TreeBranch
        key={key}
        id={componentId}
        outputComponent={component}
        indent={indent}
        inheritsConnection={inheritsConnection}
        connectionCanBeToggled={connectionCanBeToggled}
        outputActions={outputActions}
        availableProps={
          availableProps ?
            _.keyBy(Array.from(availableProps.values())) : //turn set to object
            undefined
        }
      />
    );

    key++;
    let childAvailableProps = _getChildAvailableProps(component, availableProps);

    outputComponents[componentId].children.forEach((child) => {
      traverseOutputComponents(
        indent + 25,
        child.componentId,
        childAvailableProps,
        childrenInheritConnection
      );
    });
  };

  traverseOutputComponents(0, '0');
  return treeArray;
};

export const getAncestorKeys = (ancestryPath) => {
  let ancestorIds = ancestryPath.split('_').slice(0, -1);
  return _.map(
    ancestorIds,
    (ancestorId, index, ancestorIds) =>
      ancestorIds.slice(0, index + 1).join('_')
  );
};

export const checkForConnectedDescendants = (componentId, outputComponents) => {
  let component = outputComponents[componentId];

  if (component.children.length === 0) {
    return false;
  }

  return _.some(
    component.children,
    (child) =>
      outputComponents[child.componentId].connected ||
      checkForConnectedDescendants(child.componentId, outputComponents)
  );
};

export const applyToComponentTree = (componentTree, callback, root = 0, test, stop) => {
  test = test || function() { return true; };

  const _recurse = (id, component, history = []) => {
    let resolvedTest = test(id, component, history);

    if (resolvedTest) {
      callback(id, component, history);
    }

    let shouldContinue = (
      (stop === undefined) ||
      (!resolvedTest && stop === 'success') ||
      (resolvedTest && stop === 'failure')
    );

    if (shouldContinue) {
      let updatedHistory = history.concat(id);
      for (let child of component.children) {
        let childId = child.componentId;
        let childComponent = componentTree[childId];
        _recurse(childId, childComponent, updatedHistory);
      }
    }
  };
  _recurse(root, componentTree[root], []);
};

export const isComponentAncestor = (outputComponents, testId, descendantId) => {
  let descendantFound = false;

  applyToComponentTree(
    outputComponents,
    () => descendantFound = true,
    testId,
    (id) => id === descendantId,
    'success'
  );

  return descendantFound;
};
