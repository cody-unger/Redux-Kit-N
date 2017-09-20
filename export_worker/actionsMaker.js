const _ = require('lodash');

const actionInput = (type, target) => {
  //take in type from action and target
  if (type === 'add') { return 'item'; }
  if (type === 'set') { return 'value'; }
  if (type === 'delete') {
    if (Array.isArray(target)) {
      return 'index';
    } else {
      return 'key';
    }
  }
  if (type === 'setIn') {
    if (Array.isArray(target)) {
      return 'index, value';
    } else {
      return 'key, value';
    }
  }
  return '/* FILL ME IN */';
};

const actionOutput = (type, target) => {
  if (type === 'add') { return 'item'; }
  if (type === 'set') { return 'value'; }
  if (type === 'delete') {
    if (Array.isArray(target)) {
      return 'index';
    } else {
      return 'key';
    }
  }
  if (type === 'setIn') {
    if (Array.isArray(target)) {
      return 'index,\n  value';
    } else {
      return 'key,\n  value';
    }
  }
  return '/* FILL ME IN */';
};

const makeHeader = (types) => {
  let header = '';
  types.forEach((type) => {
    header += `const ${type} = '${type}';\n`;
  });
  return header;
};

const makeExport = (types) => {
  let exp = '\nexport const types = {\n';
  types.forEach((type) => {
    exp += `  ${type},\n`;
  });
  return exp += '};\n\n';
};

const createActionJs = (onion) => {
  //ingredients: whole onion, directory to create file in, callback 
  //process: slice onion for actions layer and store
  let types = [];
  let store = onion.store;
  let actions = onion.actions;
  let actionList = '';
  let actionsJs = '/* Actions file */\n\n';
  let actionsExport = 'export const actions = {\n';
  // pull types out of onion.actions into types array as 'ACTIONTYPE_ACTIONTARGET'
  _.forEach(actions, (action) => {
    //set target reference for actionList
    let target = onion.store[action.target];
    //format the action name to the SNAKE_CASE and push to types array
    let snakeType = _.snakeCase(action.name);
    let type = snakeType.toUpperCase();
    types.push(type);
    // create and save action list to actionList array
    actionList += `const ${action.name} = (${actionInput(action.type, target)}) => ({\n`
      + `  type: ${type},\n  ${actionOutput(action.type, target)}\n});\n\n`;
    actionsExport += `  ${action.name},\n`;
  });
  //stitch together the header, export and action functions
  actionsJs += makeHeader(types) + makeExport(types) + actionList + actionsExport + '};\n';
  
  //create file actions.js in working directory
  
  //create actions.js and write string result to file
  // fs.writeFile(path.join(dir, 'actions.js'), actionsJs, (err) => {
  //   if (err) { throw err; }
  //   // console.log('File write completed for Action.js');
  //   cb();
  // });
  return actionsJs;
};



module.exports.createActionJs = createActionJs;
