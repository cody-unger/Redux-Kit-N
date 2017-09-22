import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import FlatButton from 'material-ui/FlatButton';
import utilities from '../utilities/index';

import store from '../reduxStore';
import unboundActions from '../actions';
let boundActions = bindActionCreators(unboundActions, store.dispatch);

class SubmitForm extends React.Component {
  render() {
    let {actions, store, components} = this.props;
    store = utilities.outputStore.convertPropertiesIntoObject(store);
    actions = _.keyBy(actions, 'id');
    return (
      <form className='submitForm' action='/download' method='get'>
        <input
          type='hidden'
          name='onion'
          value={JSON.stringify({actions, store, components})}
        />
        <button
          type='button'
          className='materialOutlineButton'
          style={{
            marginRight: '30px'
          }}
          onClick={boundActions.reset}
        >
          Reset Application
        </button>
        <button type='submit' className='materialButton'>
          Export Application
        </button>
      </form>
    );
  }
}

SubmitForm = connect(
  (state) => ({
    actions: state.outputActions.outputActions,
    store: state.outputStore.properties,
    components: state.outputComponents.components
  })
)(SubmitForm);

export default SubmitForm;
