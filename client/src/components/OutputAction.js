import React from 'react';
import unboundActions from '../actions';
import store from '../reduxStore';
import {bindActionCreators} from 'redux';
import utilities from '../utilities/index';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

let actions = bindActionCreators(unboundActions, store.dispatch);

class OutputAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  handleClickEdit() {
    actions.toggleEditActionModal(this.props.index);
  }

  handleClickRemove() {
    actions.removeOutputAction(this.props.index);
    actions.removeDeletedActionFromComponents(this.props.outputAction.id);
  }

  handleMouseEnter() {
    this.setState({hover: true});
  }

  handleMouseLeave() {
    this.setState({hover: false});
  }

  render() {
    return (
      <TableRow onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}>
        <TableRowColumn style={{paddingLeft: '0', paddingRight: '0', textAlign: 'center'}}>{this.props.outputAction.name}</TableRowColumn>
        <TableRowColumn style={{paddingLeft: '0', paddingRight: '0', textAlign: 'center'}}>{this.props.outputAction.target || 'no target'}</TableRowColumn>
        <TableRowColumn style={{paddingLeft: '0', paddingRight: '0', textAlign: 'center'}}>{this.props.outputAction.type || 'no type'}</TableRowColumn>
        {this.state.hover ?
          <TableRowColumn style={{paddingLeft: '0', paddingRight: '0'}}>
            <i className="material-icons pointer outputActionEditDelete purple"
              onClick={this.handleClickEdit.bind(this)}>mode_edit</i>
            <i className="material-icons pointer purple"
              onClick={this.handleClickRemove.bind(this)}>clear</i>
          </TableRowColumn>
          :
          <TableRowColumn></TableRowColumn>
        }
      </TableRow>
    );
  }
}

export default OutputAction;
