import _ from 'lodash';

import * as outputStoreActions from './outputStore';
import * as outputActionsActions from './outputActions';
import * as outputComponentsActions from './outputComponents';
import * as types from './types';

let toggleHelp = (section) => ({
  type: types.TOGGLE_HELP,
  section: section
});

let reset = () => ({
  type: types.RESET
});

let miscellaneousActions = { toggleHelp, reset };

const actions = _.extend(
  {},
  miscellaneousActions,
  outputStoreActions,
  outputActionsActions,
  outputComponentsActions
);

export default actions;
