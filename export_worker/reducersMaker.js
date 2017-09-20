const _ = require('lodash');

/*  
This module will create the reducers file  main function will require the following inputs:
  1: Onion object (onion)
  2: working directory to add file to (dir)
  3: callBack to trigger next part of the chain (callBack) 
*/

const caseMaker = (action, target) => {
  //for each action type we create a new case in the reducer fuction
  let snakeType = _.snakeCase(action.name);
  let type = snakeType.toUpperCase();
  let result = `\n    case types.${type}:\n      state = _.cloneDeep(state);\n`;
  if (action.type === 'set') {
    //for set we will set the target to the new value
    return result += `      state.${action.target} = action.value;\n      return state;`;
  }
  if (action.type === 'add') {
    //for add we will be pushing the new item into an existing state array
    return result += `      state.${action.target}.push(action.item);\n      return state;`;
  }
  if (action.type === 'setIn') {
    //for setIn we will be setting the new item in either an array or object
    let prop;
    Array.isArray(target) ? prop = 'index' : prop = 'key';
    return result += `      state.${action.target}[action.${prop}] = action.value;\n      return state;`;
  }
  if (action.type === 'delete') {
    //delete for arrays and objects 
    if (Array.isArray(target)) {
      return result += `      state.${action.target}.splice(index, 1);\n      return state;`;
    } else {
      return result += `      delete state.${action.target}[key];\n      return state;`;
    }
  }
  //future need for custom action delivery with /*FILL_ME_IN*/ for the case
  return result += `      /* FILL ME IN */\n      return state;`;
};

const createReducersJs = (onion) => {
  let store = onion.store;
  let actions = onion.actions;

  let reducersJs = '/* Reducers File */\n'
    + '\n'
    + `import _ from 'lodash';\n`
    + 'import { types } from \'./actions\';\n'
    + '\n'
    + `const INITIAL_STATE = ${JSON.stringify(onion.store, null, 2)};\n`
    + '\n'
    + 'const reducer = (state = INITIAL_STATE, action) => {\n'
    + '  switch (action.type) {\n';
  _.forEach(actions, (action) => {
    /*for each action in the onion we pass the action, key, and target to caseMaker, 
    which will return the populated custom string for that case */
    let target = store[action.target];
    reducersJs += caseMaker(action, target);
  });

  // fs.writeFile(path.join(dir, 'reducers.js'), reducersJs, (err) => {
  //   if(err) throw err;
  //   cb();
  // })

  return reducersJs += '\n    default:\n      return state;\n  }\n};\n\nexport default reducer;\n';
};

module.exports.createReducersJs = createReducersJs;