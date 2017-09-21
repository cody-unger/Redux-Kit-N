import React from 'react';
import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Dialog from 'material-ui/Dialog';
import unboundActions from '../../actions';
import store from '../../reduxStore';

let actions = bindActionCreators(unboundActions, store.dispatch);

import ComponentListHelp from './ComponentList';
import ComponentTreeHelp from './ComponentTree';
import StoreFormHelp from './StoreForm';
import ActionsFormHelp from './ActionsForm';

let titles = {
  COMPONENT_LIST: 'Help: Component List',
  COMPONENT_TREE: 'Help: Component Tree',
  STORE_FORM: 'Help: Store Form',
  ACTIONS_FORM: 'Help: Actions Form',
};

let content = {
  COMPONENT_LIST: ComponentListHelp,
  COMPONENT_TREE: ComponentTreeHelp,
  STORE_FORM: StoreFormHelp,
  ACTIONS_FORM: ActionsFormHelp
};

class HelpModal extends React.Component {
  render() {
    return (
      <Dialog
        title={titles[this.props.helpSection]}
        modal={false}
        open={!!this.props.helpSection}
      >
        { content[this.props.helpSection] }
      </Dialog>
    );
  }
}

export default HelpModal = connect(
  state => ({ helpSection: state.helpSection })
)(HelpModal);
