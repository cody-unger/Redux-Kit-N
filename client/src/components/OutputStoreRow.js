import React from 'react';
import unboundActions from '../actions';
import store from '../reduxStore';
import {bindActionCreators} from 'redux';

let actions = bindActionCreators(unboundActions, store.dispatch);

class OutputStoreRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hover: false};
  }

  handleMouseEnter() {
    this.setState({hover: true});
  }

  handleMouseLeave() {
    this.setState({hover: false});
  }

  handleClickEdit() {
    actions.toggleEditStoreModal(this.props.path, this.props.targetName, false);
  }

  handleClickDelete() {
    actions.removeOutputStoreProperty(this.props.path);
    this.props.targetName !== null && actions.updateActionsForRemovedTarget(this.props.targetName);
    this.props.targetName !== null && actions.removeStorePropFromComponent(this.props.targetName);
  }

  render() {
    let divStyle = {
      marginLeft: this.props.indent + 'px'
    };

    return this.props.isElementSchema
      ? (
        <div style={divStyle}
          className="outputStoreRow"
          onMouseEnter={this.handleMouseEnter.bind(this)}
          onMouseLeave={this.handleMouseLeave.bind(this)}>
          <div className="outputStoreRowText"><div style={{textDecoration: 'underline'}}>Element Type:</div>&nbsp;<div>{this.props.type}</div></div>
          {this.state.hover ?
            <div>
              <i className="material-icons pointer purple" onClick={this.handleClickEdit.bind(this)}>mode_edit</i>
            </div>
            :
            <div className="editPlaceHolder"></div>
          }
        </div>
      )
      : (
        <div style={divStyle}
          className="outputStoreRow"
          onMouseEnter={this.handleMouseEnter.bind(this)}
          onMouseLeave={this.handleMouseLeave.bind(this)}>
          <i className="material-icons">subdirectory_arrow_right</i>
          <div className="outputStoreRowText">{this.props.name} ({this.props.type})</div>
          {this.state.hover ?
            <div>
              <i className="material-icons pointer purple" onClick={this.handleClickEdit.bind(this)}>mode_edit</i>
              <i className="material-icons pointer purple" onClick={this.handleClickDelete.bind(this)}>clear</i>
            </div>
            :
            <div className="editDeletePlaceHolder"></div>
          }
        </div>
      );
  }
}

export default OutputStoreRow;
