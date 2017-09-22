import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import FlatButton from 'material-ui/FlatButton';
import utilities from '../utilities/index';

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
          className='materialButton'
          style={{
            marginRight: '10px'
          }}
        >
          Reset
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
