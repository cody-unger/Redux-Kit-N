import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import unboundActions from '../actions';
import store from '../reduxStore';
import {bindActionCreators} from 'redux';
import utilities from '../utilities/index';
import OutputAction from './OutputAction';
import OutputActionsEdit from './OutputActionsEdit';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

let actions = bindActionCreators(unboundActions, store.dispatch);

class OutputActionsForm extends React.Component {
  handleClickAdd() {
    actions.toggleEditActionModal('newAction');
  }

  render() {
    return (
      <div className={this.props.colWidth}>
        <div className="outputActionsHeading">
          <h4>Actions</h4>
          <i
            className="material-icons addButton pointer purple"
            onClick={this.handleClickAdd.bind(this)}
          >
            add
          </i>
          <i
            className="material-icons addButton pointer purple"
            onClick={() => actions.toggleHelp('ACTIONS_FORM')}
          >
            help_outline
          </i>
        </div>
        <div className={`outputActionsList${this.props.leftBorder}`}>
          <Table fixedHeader={true} height='21.6em' style={{backgroundColor: '#f9f9f9'}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn style={{paddingLeft: '0', paddingRight: '0', textAlign: 'center'}}>Name</TableHeaderColumn>
                <TableHeaderColumn style={{paddingLeft: '0', paddingRight: '0', textAlign: 'center'}}>Target</TableHeaderColumn>
                <TableHeaderColumn style={{paddingLeft: '0', paddingRight: '0', textAlign: 'center'}}>Type</TableHeaderColumn>
                <TableHeaderColumn></TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.props.outputActions.outputActions.map((outputAction, index) => (
                <OutputAction outputAction={outputAction}
                  index={index}
                  key={index} />
              )
              )}
            </TableBody>
          </Table>
        </div>
        <OutputActionsEdit targetsTypes={utilities.outputStore.getTargetsFromOutputStore(this.props.outputStore.properties)}/>
      </div>
    );
  }
}

OutputActionsForm = connect(
  (state) => (
    {
      outputStore: state.outputStore,
      outputActions: state.outputActions
    }
  )
)(OutputActionsForm);

export default OutputActionsForm;

// <div className="outputActionsList">
//           {this.props.outputActions.outputActions.map((outputAction, index) => (
//             <OutputAction outputAction={outputAction}
//               index={index}/>
//           )
//           )}
//         </div>
