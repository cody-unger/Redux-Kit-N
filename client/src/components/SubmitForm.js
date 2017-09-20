import React from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import utilities from '../utilities/index';

class SubmitForm extends React.Component {
  render() {
    let {actions, store, components} = this.props;
    store = utilities.outputStore.convertPropertiesIntoObject(store);
    return (
      <form className='submitForm' action='/download' method='get'>
        <input
          type='hidden'
          name='onion'
          value={JSON.stringify({actions, store, components})}
        />
        <FlatButton
          label="Export Application"
          primary={true}
          backgroundColor='#6653ff'
          labelStyle={{color: '#f9f9f9'}}
          hoverColor='#7F00FF'
        />
        
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
