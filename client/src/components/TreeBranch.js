import React from 'react';
import Popover from 'material-ui/Popover';
import store from '../reduxStore';
import unboundActions from '../actions';
import {bindActionCreators} from 'redux';
import TreeBranchPropOrAction from './TreeBranchPropOrAction';
import _ from 'lodash';

let actions = bindActionCreators(unboundActions, store.dispatch);

class TreeBranch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      expanded: false,
      connectStoreError: false,
    };

    this.handleClickConnect = this.handleClickConnect.bind(this);
    this.handleClickEdit = this.handleClickEdit.bind(this);
  }


  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData('text');
    actions.addChildComponent({parent: this.props.id, child: data});
  }

  handleClickEdit() {
    actions.openEditComponentModel(this.props.id, this.props.availableProps);
  }

  handleMouseEnter() {
    this.setState({hover: true});
  }

  handleMouseLeave() {
    this.setState({hover: false});
  }

  handleClickConnect() {
    if (this.props.connectionCanBeToggled) {
      actions.toggleComponentConnection(this.props.id);
    } else {
      this.setState({connectStoreError: true}, function() {
        setTimeout(this.hideConnectStoreError.bind(this), 1500);
      });
    }
  }

  hideConnectStoreError() {
    this.setState({connectStoreError: false});
  }

  handleSelectAction(event) {
    this.setState({selectedAction: event.target.value});
  }

  getActionIcons() {
    let showConnectIcon = (
      (
        this.state.hover ||
        this.state.expanded
      ) &&
      !this.props.outputComponent.connected &&
      !this.props.inheritsConnection
    );
    let showDisconnectIcon = this.props.outputComponent.connected;
    let showEditIcon = this.state.hover;

    let actionIcons = [
      {show: showDisconnectIcon, class: 'purple', onClick: this.handleClickConnect, icon: 'link'},
      {show: showConnectIcon, onClick: this.handleClickConnect, icon: 'link'},
      {show: showEditIcon, onClick: this.handleClickEdit, icon: 'edit'},
    ];

    return actionIcons.map((icon, i) => {
      if (icon.show) {
        return (
          <i
            key={i}
            className={'material-icons purple pointer ' + (icon.class || '')}
            onClick={icon.onClick}
          >
            {icon.icon}
          </i>
        );
      }
    });
  }

  getProps() {
    if (this.props.outputComponent.connected) {
      return (
        <div>
          <b> Props From Store: </b>
          {
            _.isEmpty(this.props.outputComponent.storeProps) ?
              <p> 'No Props Specified' </p> :
              <ul>
                {
                  this.props.outputComponent.storeProps.map((prop, i) => (
                    <li key={i}>
                    Receives
                      <b> {prop.storeProp} </b>
                    from store as
                      <b> {prop.propName} </b>
                    </li>
                  ))
                }
              </ul>
          }
        </div>
      );
    } else if (this.props.inheritsConnection) {
      return (
        <div>
          <b> Inherited Props: </b>
          {
            _.isEmpty(this.props.outputComponent.parentProps) ?
              <p> No Props Specified </p> :
              <ul>
                {
                  this.props.outputComponent.parentProps.map((prop, i) => (
                    <li key={i}>
                    Receives
                      <b> {prop.parentProp} </b>
                    from parent as
                      <b> {prop.childProp} </b>
                    </li>
                  ))
                }
              </ul>
          }
        </div>
      );
    } else {
      return null;
    }
  }

  getActions() {
    let actions = this.props.outputActions.outputActions
      .filter(
        action => (action.id in this.props.outputComponent.actions)
      )
      .map( action => action.name );

    return (
      <div>
        <b>Actions Specified For This Component:</b>
        {
          _.isEmpty(actions) ?
            <p> No Actions Specified </p> :
            <ul>
              {
                actions.map((action, i) => <li key={i}>{action}</li>)
              }
            </ul>
        }
      </div>
    );
  }

  render() {
    let divStyle = {
      marginLeft: this.props.indent + 'px'
    };
    let underline = this.props.inheritsConnection ? ' purpleUnderline' : '';

    return (
      <div>
        <div
          style={divStyle}
          className="treeBranchNameRow"
          onMouseEnter={this.handleMouseEnter.bind(this)}
          onMouseLeave={this.handleMouseLeave.bind(this)}
          ref={row => this.anchor = row}
        >
          {this.props.outputComponent.name === 'App' ?
            <i className="material-icons homeIcon">home</i>
            :
            <i className="material-icons">subdirectory_arrow_right</i>
          }
          <div
            className={`treeBranchName${underline}`}
            onDragOver={this.handleDragOver.bind(this)}
            onDrop={this.handleDrop.bind(this)}
          >
            {this.props.outputComponent.name}
          </div>

          { this.getActionIcons() }

          {
            this.state.connectStoreError &&
            <div className="red">Only connect 1 tree level</div>
          }
        </div>

        
          
        <Popover
          open={this.state.hover}
          anchorEl={this.anchor}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          useLayerForClickAway={false}
          canAutoPosition={false}
          animated={true}
          useLayerForClickAway={false}
        >
          <div
            style={{ padding: '8px 12px' }}
          >
            {this.getProps()}
            {this.getActions()}
          </div>
        </Popover>
        
      </div>
    );
  }
}

export default TreeBranch;
