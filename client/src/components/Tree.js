import React from 'react';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

import store from '../reduxStore';
import {connect} from 'react-redux';
import utils from '../utilities/index';

import TreeBranch from './TreeBranch';
import unboundActions from '../actions';
import TreeBranchPropOrAction from './TreeBranchPropOrAction';

let actions = bindActionCreators(unboundActions, store.dispatch);

const formInputProps = {
  floatingLabelStyle: {marginTop: '-18px'},
  fullWidth: true,
  style: {height: '54px'},
};

const propKeysByType = {
  parentProps: {nameKey: 'childProp', sourceKey: 'parentProp'},
  storeProps: {nameKey: 'propName', sourceKey: 'storeProp'}
};

const cleanFormProps = (state) => {
  let parentProps = _removeEmptyProps(state.parentProps);
  let storeProps = _removeEmptyProps(state.storeProps);
  let warnings = _validateProps(parentProps.concat(storeProps));
  return {parentProps, storeProps, warnings};
};

const _validateProps = (props) => {
  let warnings = new Set();
  let propNames = new Set();
  for (let prop of props) {
    let propName = prop.propName !== undefined ?
      prop.propName :
      prop.childProp;
    let source = prop.storeProp !== undefined ?
      prop.storeProp :
      prop.parentProp;

    if (propNames.has(propName)) {
      warnings.add('You may not have duplicate prop names.');
    } else {
      propNames.add(propName);
    }

    if (propName.includes(' ')) {
      warnings.add('Prop names may not include spaces.');
    }

    if (
      (propName === '' && source !== '') ||
      (propName !== '' && source === '')
    ) {
      warnings.add('You must enter values for both fields to add a prop.');
    }
  }

  return warnings;
};

const _removeEmptyProps = (props) => {
  return props.filter(prop => {
    for (let key in prop) {
      if (prop[key] !== '') {
        return true;
      }
    }
    return false;
  });
};

class Modal extends React.Component {
  constructor(props) {
    console.log(props.editing.component);
    super(props);
    let {
      actions,
      parentProps,
      storeProps
    } = props.editing.component;

    this.state = {
      actions,
      parentProps: [{childProp: '', parentProp: ''}, ...parentProps],
      storeProps: [{propName: '', storeProp: ''}, ...storeProps]
    };

    this.refreshPropSources(props, this.state);
    this.validate(props, this.state);

    this.updateActions = this.updateActions.bind(this);
    this.addProp = this.addProp.bind(this);
    this.deleteProp = this.deleteProp.bind(this);
    this.updatePropName = this.updatePropName.bind(this);
    this.updatePropSource = this.updatePropSource.bind(this);
  }

  componentWillUpdate(props, state) {
    this.refreshPropSources(props, state);
    this.validate(props, state);
  }

  validate(props, state) {
    let {parentProps, storeProps, warnings} = cleanFormProps(state);
    this.warnings = Array.from(warnings.values());
    this.cleanedForm = { actions: state.actions, parentProps, storeProps };
  }

  refreshPropSources(props, state) {
    if ( props.editing.component.connected ) {
      this.allProps = Object.keys(
        utils.outputStore.getTargetsFromOutputStore(
          props.outputStore.properties
        )
      );

      this.usedProps = new Set(
        _.map(state.storeProps, prop => prop.storeProp)
      );
    } else {
      this.allProps = Object.keys(this.props.editing.availableProps || {});

      this.usedProps = new Set(
        _.map(state.parentProps, prop => prop.parentProp)
      );
    }
  }

  addProp(type = 'parentProps') {
    let newProp = type === 'parentProps' ?
      {parentProp: '', childProp: ''} :
      {propName: '', storeProp: ''};

    this.setState((state) => ({
      [type]: [newProp, ...state[type]]
    }));
  }

  deleteProp(index, type = 'parentProps') {
    this.setState((state) => {
      let stateCopy = utils.safeDelete(state, `${type}.${index}`);
      return {
        [type]: stateCopy[type]
      };
    });
  }

  updatePropName(newValue, index, type = 'parentProps') {
    this.setState(state => {
      let oldProp = state[type][index];
      let nameKey = propKeysByType[type]['nameKey'];
      let update = {[nameKey]: newValue};
      let newProp = _.assign({}, oldProp, update);
      return utils.safeSet(state, newProp, `${type}.${index}`);
    });
  }

  updatePropSource(newValue, index, type = 'parentProps') {
    this.setState(state => {
      let oldProp = state[type][index];
      let sourceKey = propKeysByType[type]['sourceKey'];
      let update = {[sourceKey]: newValue};
      let newProp = _.assign({}, oldProp, update);
      return utils.safeSet(state, newProp, `${type}.${index}`);
    });
  }

  updateActions(e, k, payload) {
    this.setState(state => {
      let actionIds = payload;
      let currentActions = state.actions;
      let newActions = _.clone(currentActions);
      for (let actionId of actionIds) {
        if (actionId in newActions) {
          delete newActions[actionId];
        } else {
          newActions[actionId] = actionId;
        }
      }
      return { actions: newActions };
    });
  }

  getPropsFormWarnings() {
    return _.isEmpty(this.warnings) ?
      null :
      (
        <div className="errorMessages">
          {
            this.warnings.map((warning, i) => (
              <div key={i} className="errorMessage"> {warning} </div>
            ))
          }
        </div>
      );
  }

  getEditableProps(type = 'parentProps') {
    let nameKey = type === 'parentProps' ?
      'childProp' :
      'propName';

    let sourceKey = type === 'parentProps' ?
      'parentProp' :
      'storeProp';

    let sourceLabel = type === 'parentProps' ?
      'Parent Prop Name' :
      'Store Path';

    return (
      <div style={{display: 'flex'}}>
        <div className='xColumn'>
          {
            this.state[type].map((prop, i) => (
              <div key={i} className='xCell'>
                <i
                  className="material-icons pointer purple"
                  onClick={() => { this.deleteProp(i, type); }}
                >
                  clear
                </i>
              </div>
            ))
          }
        </div>

        <div className='propsColumn' style={{flexGrow: 1}}>
          {
            this.state[type].map((prop, i) => (
              <div className='row' key={i}>
                <div className='col-6'>
                  <TextField
                    floatingLabelText='Prop Name'
                    inputStyle={{marginTop: '6px'}}
                    value={this.state[type][i][nameKey]}
                    { ...formInputProps }
                    onChange={(event) => {
                      this.updatePropName(event.target.value, i, type);
                    }}
                    underlineFocusStyle={{borderBottomColor: '#6653ff'}}
                    floatingLabelFocusStyle={{color: '#6653ff'}}
                  />
                </div>
                <div className='col-6'>
                  <SelectField
                    floatingLabelText={sourceLabel}
                    inputStyle={{marginTop: '0px'}}
                    { ...formInputProps }
                    value={this.state[type][i][sourceKey]}
                    disabled={_.isEmpty(this.allProps)}
                    defaultValue={this.state[type][i][nameKey]}
                    onChange={(e, k, payload) => {
                      this.updatePropSource(payload, i, type);
                    }}
                    selectedMenuItemStyle={{color: '#6653ff'}}
                  >
                    { this.allProps.map((prop, j) => (
                      <MenuItem
                        key={j}
                        insetChildren={true}
                        checked={prop === this.state[type][j]}
                        disabled={this.usedProps.has(prop)}
                        value={prop}
                        primaryText={prop}
                      />
                    ))}
                  </SelectField>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  getPropsForm(type = 'parentProps') {
    let headerText = type === 'parentProps' ?
      'Props From Parent' :
      'Props From Store';

    let noSourcesMessage = type === 'parentProps' ?
      'This component\'s parent has no props to pass.' :
      'No properties have been declared in your store.';

    return (
      <div className='col-lg-6'>
        <div style={{display: 'flex'}}>
          <h5> {headerText} </h5>
          <i
            className="material-icons addButton pointer purple"
            onClick={()=>{ this.addProp(type); }}
          >
            add
          </i>
        </div>

        {
          _.isEmpty(this.allProps) ?
            noSourcesMessage :
            <div>
              { this.getPropsFormWarnings() }
              { this.getEditableProps(type) }
            </div>
        }

      </div>
    );
  }

  render() {
    let disableSubmit = !_.isEmpty(this.warnings);
    const dialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={actions.closeEditComponentModel}
        labelStyle={{color: '#6653ff'}}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={disableSubmit}
        onClick={() => {
          actions.submitComponentUpdate(this.cleanedForm);
          actions.closeEditComponentModel();
        }}
        labelStyle={_.isEmpty(this.warnings) ? {color: '#6653ff'} : {}}
      />
    ];

    if (this.props.editing) {
      let formActions = this.state.actions;
      let component = this.props.editing.component;
      let menuItems = this.props.outputActions
        .map((action) => (
          <MenuItem
            key={action.id}
            insetChildren={true}
            checked={action.id in formActions}
            value={action.id}
            primaryText={action.name}
          />
        ));

      let actionNames = this.props.outputActions
        .filter(action => action.id in formActions)
        .map(action => action.name);

      return (
        <Dialog
          title={`Edit ${component.name}`}
          actions={dialogActions}
          modal={false}
          open={!!this.props.editing}
          onRequestClose={() => actions.closeEditComponentModel()}
        >
          <div className="row">
            <div className="col-lg-6">
              <h5>
                Actions
              </h5>

              {
                _.isEmpty(this.props.outputActions) ?
                  'No actions have been defined yet.' :
                  <SelectField
                    multiple={true}
                    hintText={
                      (_.size(formActions) === 0) ?
                        'Select a name' :
                        ''
                    }
                    values={Object.keys(formActions)}
                    onChange={this.updateActions}
                    selectionRenderer={(values) => {
                      return actionNames.join(', ');
                    }}
                    selectedMenuItemStyle={{color: '#6653ff'}}
                  >
                    {menuItems}
                  </SelectField>
                  
              }
            </div>

            {
              component.connected ?
                this.getPropsForm('storeProps') :
                this.getPropsForm('parentProps')
            }
          </div>
        </Dialog>
      );
    } else {
      return null;
    }
  }
}

class Tree extends React.Component {
  render() {
    return (
      <div className={this.props.colWidth}>
        <div className="appTreeHeading" >
          <h4>App Tree</h4>
          <i
            className="material-icons addButton pointer purple"
            onClick={() => actions.toggleHelp('COMPONENT_TREE')}
          >
            help_outline
          </i>
        </div>
        {
          this.props.outputComponents.editing &&
          <Modal
            outputActions={this.props.outputActions.outputActions}
            outputStore={this.props.outputStore}
            editing={this.props.outputComponents.editing}
          />
        }

        <div className={`tree${this.props.leftBorder}`}>
          {
            utils.tree.generateTreeArray(
              this.props.outputComponents.components,
              this.props.outputActions,
              TreeBranch
            )
          }
        </div>

      </div>
    );
  }
}

Tree = connect(
  (state) => ({
    outputComponents: state.outputComponents,
    outputStore: state.outputStore,
    outputActions: state.outputActions
  })
)(Tree);

export default Tree;
