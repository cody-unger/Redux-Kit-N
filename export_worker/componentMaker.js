const _ = require('lodash');

/*
This module will create the react components, it's will require the following inputs:
  key: the ID key of the specific component to create
  onion: opbject with the needed components to be created and their properties
*/

const importStatement = (key, childName) => {
  if (key === '0') {
    return `import ${childName} from './components/${childName}.jsx';\n`;
  } else {
    return `import ${childName} from './${childName}.jsx';\n`;
  }
};

const actionsImportStatement = (key, onion) => {
  //creates the additional imports needed for actions if present on the component
  let compActions = onion.components[key].actions;
  let actions = onion.actions;
  let path = key === '0' ? './' : '../';
  if (!_.isEmpty(compActions)) {
    let actionsImport = `import { actions } from '${path}actions';\n`
      + `import { bindActionCreators } from 'redux';\n`
      + `const _actions = bindActionCreators(actions, store.dispatch);\n\n`;
    actionsKeys = Object.keys(compActions);
    actionsKeys.forEach((actionId) => {
      let action = actions[actionId].name;
      actionsImport += `const ${action} = _actions.${action};\n`;
    });
    return actionsImport;
  } else {
    //returns and empty string if no actions
    return '';
  }
};

const classStatement = (name) => {
  return `\nclass ${name} extends React.Component {\n`;
};

const methodStatement = () => {
  //constructs the methods for the component
  return `\n  /* add component methods here */\n`;
};

const propsStatement = (key, childProps) => {
  if (childProps && childProps.length) {
    //child props will be an array of objects indicating which props this child expects to receive
    let statement = ''
    let space = key === '0' ? '        ': '      ';
    _.forEach(childProps, (prop) => {
      statement += `\n  ${space + prop.childProp}={this.props.${prop.parentProp}}\n`
    });
    return statement + space;
  } else {
    return ' props={/*FILL_ME_IN*/} ';
  }
};

const renderChild = (key, childName, propsStatement) => {
  //returns the string for the child component to be rendered.

  if (key === '0') {
    return `        <${childName + propsStatement}/>\n`;
  } else {
    return `      <${childName + propsStatement}/>\n`;
  }
};

const storeConnect = (compName, component, onion) => {
  if (component.connected) {
    let typer = (storeProp) => {
      if(typeof storeProp === 'object') {
        if (Array.isArray(storeProp)){
          return 'array';
        }
        if (storeProp === null) {
          return 'null';
        }
        return 'object';
      } else {
        return typeof storeProp;
      }
    }
    let connect = `${compName} = connect(\n`
      + '  (state) => ({\n';
    let propTypes = `${compName}.propTypes = {\n`
    _.forEach(component.storeProps, (prop) => {
      connect += `    ${prop.propName}: '${prop.storeProp}',\n`;
      propTypes += `  ${prop.propName}: `
        + `PropTypes.${typer(_.get(onion, prop.storeProp))}.isRequired,\n`;
    });
    return connect + `  })\n)(${compName});\n\n` + propTypes + '};';
  } else {
    return '';
  }
};

const exportStatement = (key, compName) => {
  //returns the export statement for all child components
  //or render statement for app.jsx
  if (key === '0') {
    return `\n\nReactDOM.render(<${compName} />, document.getElementById('root'));\n`;
  } else {
    return `\n\nexport default ${compName};\n`;
  }
};

const createComponent = (key, onion) => {
  //for the given key of a given component,
  //compose the contents of that component and return the string of it's contents
  let component = onion.components[key];
  let compName = _.upperFirst(component.name); //component's name
  let compChildren = component.children; //array of components children
  let jsxTemplate = `/* ${compName} Component File */\n\n`;

  let appHead = 'import React from \'react\';\n'
    + 'import ReactDOM from \'react-dom\';\n'
    + 'import { Provider } from \'react-redux\';\n'
    + 'import store from \'./store\';\n'
    + 'import PropTypes from \'prop-types\';\n';

  let compHead = 'import React from \'react\';\n'
    + 'import { connect } from \'react-redux\';\n'
    + 'import store from \'../store\';\n'
    + 'import PropTypes from \'prop-types\';\n';

  let appRenderTemplate = '  render() {\n'
    + '    return (\n'
    + '      <div>\n'
    + '      <Provider store={store}>\n'
    + '        {/*Space for wrapping HTML if needed */}\n';

  let appRenderTemplateEnd = '        {/*Space for wrapping HTML if needed */}\n'
    + '      </Provider>\n'
    + '      </div>\n'
    + '    );\n'
    + '  };\n'
    + '};';

  let compRenderTemplate = '  render() {\n'
    + '    return (\n'
    + '      <div>\n'
    + '      {/*Space for wrapping HTML if needed */}\n';

  let compRenderTemplateEnd = '      {/*Space for wrapping HTML if needed */}\n'
    + '      </div>\n'
    + '    );\n'
    + '  };\n'
    + '};\n\n';

  if (compChildren.length) {
    _.forEach(compChildren, (childObj) => {
      let childName = _.upperFirst(onion.components[childObj.componentId].name);
      let childProps = onion.components[childObj.componentId].parentProps;
      if (key === '0') {
        appHead += importStatement(key, childName);
        appRenderTemplate += renderChild(key, childName, propsStatement(key, childProps));
      } else {
        compHead += importStatement(key, childName);
        compRenderTemplate += renderChild(key, childName, propsStatement(key, childProps));
      }
    });
  }
  //conditional return statement
  if (key === '0') {
    return jsxTemplate
      + appHead
      + actionsImportStatement(key, onion)
      + classStatement(compName)
      + methodStatement()
      + appRenderTemplate
      + appRenderTemplateEnd
      + storeConnect(compName, component, onion)
      + exportStatement(key, compName);
  } else {
    return jsxTemplate
      + compHead
      + actionsImportStatement(key, onion)
      + classStatement(compName)
      + methodStatement()
      + compRenderTemplate
      + compRenderTemplateEnd
      + storeConnect(compName, component, onion)
      + exportStatement(key, compName);
  }
};

module.exports.createComponent = createComponent;
