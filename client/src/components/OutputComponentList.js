import React from 'react';
import OutputComponentListItem from './OutputComponentListItem';
import _ from 'lodash';
import {connect} from 'react-redux';
import store from '../reduxStore';
import unboundActions from '../actions';
import {bindActionCreators} from 'redux';

let actions = bindActionCreators(unboundActions, store.dispatch);

class OutputComponentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickAdd = this.handleClickAdd.bind(this);
  }

  handleClickAdd() {
    actions.addComponent();
  }

  render() {
    return (
      <div className={this.props.colWidth}>
        <div className="outputComponentsHeading">
          <h4>Components</h4>
          <i
            className="material-icons addButton pointer purple"
            onClick={this.handleClickAdd}
          >
            add
          </i>
          <i
            className="material-icons addButton pointer purple"
            onClick={() => actions.toggleHelp('COMPONENT_LIST')}
          >
            help_outline
          </i>
        </div>
        <div className="outputComponents">
          {_.map(this.props.outputComponents.components, (outputComponent, id) => (
            <OutputComponentListItem outputComponents={this.props.outputComponents.components} outputComponent={outputComponent} id={id} key={id} />
          )
          )}
        </div>
      </div>
    );
  }
}

OutputComponentList = connect(
  (state) => ({outputComponents: state.outputComponents})
)(OutputComponentList);

export default OutputComponentList;
