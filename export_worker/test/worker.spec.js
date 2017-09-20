const httpMocks = require('node-mocks-http');
const archiver = require('archiver');
const compose = require('../composer.js');
const expect = require('chai').expect;
const action = require('../actionsMaker.js');
const reducer = require('../reducersMaker.js');
const store = require('../storeMaker.js');
const comp = require('../componentMaker.js');
const fs = require('fs');
const path = require('path');
const { sep } = require('path');


const onion = {
  store: {
    todos: [],
    username: '',
    otherUser: ''
  },
  actions: {
    1: {
      name: 'addTodo',
      type: 'add',
      target: 'todos'
    },
    2: {
      name: 'deleteTodo',
      type: 'delete',
      target: 'todos'
    },
    3: {
      name: 'setTodo',
      type: 'setIn',
      target: 'todos'
    },
    4: {
      name: 'setUsername',
      type: 'set',
      target: 'username'
    },
    5: {
      name:'defaultAction',
      type: '',
      target: 'otherUser'
    }
  },
  components: {
    0: {
      name: 'App',
      children: [
        {
          childId: '0',
          componentId: '2'
        },
        {
          childId: '1',
          componentId: '3'
        },
        {
          childId: '2',
          componentId: '4'
        }
      ],
      actions: {},
      storeProps: [],
      connected: false,
      parentProps: [],
    },

    2: {
      name: 'exampleChild',
      children: [],
      actions: {
        '4':'4'
      },
      storeProps: [
        {
          storeProp: 'store.username',
          propName: 'onionUser'
        }
      ],
      connected: true,
      parentProps: [
        {
          parentProp: 'foo',
          childProp: 'bar'
        }
      ],
    },

    3: {
      name: 'exampleChild2',
      children: [
        {
          childId: '0',
          componentId: '4'
        },
        {
          childId: '1',
          componentId: '5'
        }
      ],
      actions: {
        '1': '1',
        '2': '2',
        '3': '3'
      },
      storeProps: [
        {
          storeProp: 'store.todos',
          propName: 'onionList'
        }
      ],
      connected: true,
      parentProps: [],
    },

    4: {
      name: 'exampleChildList',
      children: [],
      actions: {},
      storeProps: [],
      connected: false,
      parentProps:[
        {
          parentProp: 'onionList',
          childProp: 'listyList'
        }
      ],
    },

    5: {
      name: 'exampleChildOfChild',
      children: []
    }
  },
};

describe('file creators', () => {
  let actionOutput = '/* Actions file */\n\n'
    + `const ADD_TODO = 'ADD_TODO';\n`
    + `const DELETE_TODO = 'DELETE_TODO';\n`
    + `const SET_TODO = 'SET_TODO';\n`
    + `const SET_USERNAME = 'SET_USERNAME';\n`
    + `const DEFAULT_ACTION = 'DEFAULT_ACTION';\n`
    + '\n'
    + 'export const types = {\n'
    + '  ADD_TODO,\n'
    + '  DELETE_TODO,\n'
    + '  SET_TODO,\n'
    + '  SET_USERNAME,\n'
    + '  DEFAULT_ACTION,\n'
    + '};\n'
    + '\n'
    + 'const addTodo = (item) => ({\n'
    + '  type: ADD_TODO,\n'
    + '  item\n'
    + '});\n'
    + '\n'
    + 'const deleteTodo = (index) => ({\n'
    + '  type: DELETE_TODO,\n'
    + '  index\n'
    + '});\n'
    + '\n'
    + 'const setTodo = (index, value) => ({\n'
    + '  type: SET_TODO,\n'
    + '  index,\n'
    + '  value\n'
    + '});\n'
    + '\n'
    + 'const setUsername = (value) => ({\n'
    + '  type: SET_USERNAME,\n'
    + '  value\n'
    + '});\n'
    + '\n'
    + 'const defaultAction = (/* FILL ME IN */) => ({\n'
    + '  type: DEFAULT_ACTION,\n'
    + '  /* FILL ME IN */\n'
    + '});\n'
    + '\n'
    + 'export const actions = {\n'
    + '  addTodo,\n'
    + '  deleteTodo,\n'
    + '  setTodo,\n'
    + '  setUsername,\n'
    + '  defaultAction,\n'
    + '};\n';

  let reducersOutput = `/* Reducers File */\n`
    + `\n`
    + `import _ from 'lodash';\n`
    + `import { types } from './actions';\n`
    + `\n`
    + `const INITIAL_STATE = {\n`
    + `  "todos": [],\n`
    + `  "username": "",\n`
    + `  "otherUser": ""\n`
    + `};\n`
    + `\n`
    + `const reducer = (state = INITIAL_STATE, action) => {\n`
    + `  switch (action.type) {\n`
    + `\n`
    + `    case types.ADD_TODO:\n`
    + `      state = _.cloneDeep(state);\n`
    + `      state.todos.push(action.item);\n`
    + `      return state;\n`
    + `    case types.DELETE_TODO:\n`
    + `      state = _.cloneDeep(state);\n`
    + `      state.todos.splice(index, 1);\n`
    + `      return state;\n`
    + `    case types.SET_TODO:\n`
    + `      state = _.cloneDeep(state);\n`
    + `      state.todos[action.index] = action.value;\n`
    + `      return state;\n`
    + `    case types.SET_USERNAME:\n`
    + `      state = _.cloneDeep(state);\n`
    + `      state.username = action.value;\n`
    + `      return state;\n`
    + `    case types.DEFAULT_ACTION:\n`
    + `      state = _.cloneDeep(state);\n`
    + `      /* FILL ME IN */\n`
    + `      return state;\n`
    + `    default:\n`
    + `      return state;\n`
    + `  }\n`
    + `};\n`
    + `\n`
    + `export default reducer;\n`;

  let storeOutput = `/* Store File */\n`
    + `\n`
    + `import { createStore } from 'redux';\n`
    + `import reducer from './reducers';\n`
    + `\n`
    + `const store = createStore(reducer);\n`
    + `\n`
    + `export default store;\n`;
  
  let appOutput = `/* App Component File */\n`
    + `\n`
    + `import React from 'react';\n`
    + `import ReactDOM from 'react-dom';\n`
    + `import { Provider } from 'react-redux';\n`
    + `import store from './store';\n`
    + `import PropTypes from 'prop-types';\n`
    + `import ExampleChild from './components/ExampleChild';\n`
    + `import ExampleChild2 from './components/ExampleChild2';\n`
    + `import ExampleChildList from './components/ExampleChildList';\n`
    + `\n`
    + `class App extends React.Component {\n`
    + `\n`
    + `  /* add component methods here */\n`
    + `  render() {\n`
    + `    return (\n`
    + `      <div>\n`
    + `      <Provider store={store}>\n`
    + `        {/*Space for wrapping HTML if needed */}\n`
    + `        <ExampleChild\n`
    + `          bar={this.props.foo}\n`
    + `        />\n`
    + `        <ExampleChild2 props={/*FILL_ME_IN*/} />\n`
    + `        <ExampleChildList\n`
    + `          listyList={this.props.onionList}\n`
    + `        />\n`
    + `        {/*Space for wrapping HTML if needed */}\n`
    + `      </Provider>\n`
    + `      </div>\n`
    + `    );\n`
    + `  };\n`
    + `};\n`
    + `\n`
    + `ReactDOM.render(<App />, document.getElementById('root'));\n`;

  let exampleChildOutput = `/* ExampleChild2 Component File */\n`
    + `\n`
    + `import React from 'react';\n`
    + `import { connect } from 'react-redux';\n`
    + `import store from '../store';\n`
    + `import PropTypes from 'prop-types';\n`
    + `import ExampleChildList from './ExampleChildList';\n`
    + `import ExampleChildOfChild from './ExampleChildOfChild';\n`
    + `import { actions } from '../actions';\n`
    + `import { bindActionCreators } from 'redux';\n`
    + `const _actions = bindActionCreators(actions, store.dispatch);\n`
    + `\n`
    + `const addTodo = _actions.addTodo;\n`
    + `const deleteTodo = _actions.deleteTodo;\n`
    + `const setTodo = _actions.setTodo;\n`
    + `\n`
    + `class ExampleChild2 extends React.Component {\n`
    + `\n`
    + `  /* add component methods here */\n`
    + `  render() {\n`
    + `    return (\n`
    + `      <div>\n`
    + `      {/*Space for wrapping HTML if needed */}\n`
    + `      <ExampleChildList\n`
    + `        listyList={this.props.onionList}\n`
    + `      />\n`
    + `      <ExampleChildOfChild props={/*FILL_ME_IN*/} />\n`
    + `      {/*Space for wrapping HTML if needed */}\n`
    + `      </div>\n`
    + `    );\n`
    + `  };\n`
    + `};\n`
    + `\n`
    + `ExampleChild2 = connect(\n`
    + `  (state) => ({\n`
    + `    onionList: 'store.todos',\n`
    + `  })\n`
    + `)(ExampleChild2);\n`
    + `\n`
    + `ExampleChild2.propTypes = {\n`
    + `  onionList: PropTypes.array.isRequired,\n`
    + `};\n`
    + `\n`
    + `export default ExampleChild2;\n`;

  let curDir = path.join(__dirname, '../');
  let testFolder = fs.mkdtempSync(`${curDir}${sep}`, );
  let actionJs = path.join(testFolder, 'actions.js');
  let reducersJs = path.join(testFolder, 'reducers.js');
  let storeJs = path.join(testFolder, 'store.js');
  let appJsx = path.join(testFolder, 'app.jsx');
  let exampleCh2Jsx = path.join(testFolder, 'exampleChild2.jsx');

  before((done) => {
    fs.writeFileSync(actionJs, action.createActionJs(onion));
    fs.writeFileSync(reducersJs, reducer.createReducersJs(onion));
    fs.writeFileSync(storeJs, store.createStoreJs());
    fs.writeFileSync(appJsx, comp.createComponent('0', onion));
    fs.writeFileSync(exampleCh2Jsx, comp.createComponent('3', onion));
    done();
  });

  after((done) => {
    fs.unlinkSync(storeJs);
    fs.unlinkSync(appJsx);
    fs.unlinkSync(actionJs);
    fs.unlinkSync(reducersJs);
    fs.unlinkSync(exampleCh2Jsx);
    fs.rmdir(testFolder, done);
  });

  it('created an Action.js file', (done) => {
      expect(fs.existsSync(actionJs)).to.be.true;
      done();
  });

  it('contents of actions.js are correct', (done) => {
    expect(fs.readFileSync(actionJs, 'utf-8')).to.equal(actionOutput);
    done();
  });

  it('creates a reducer.js file', (done) => {
    expect(fs.existsSync(reducersJs)).to.be.true;
    done();
  });

  it(`contents of reducers.js are correct`, (done) => {
    expect(fs.readFileSync(reducersJs, 'utf-8')).to.equal(reducersOutput);
    done();
  });

  it('creates a store.js file', (done) => {
    expect(fs.existsSync(storeJs)).to.be.true;
    done();
  });

  it(`contents of store.js are correct`, (done) => {
    expect(fs.readFileSync(storeJs, 'utf-8')).to.equal(storeOutput);
    done();
  });

  it('creates a app.jsx file', (done) => {
    expect(fs.existsSync(appJsx)).to.be.true;
    done();
  });

  it(`contents of app.jsx are correct`, (done) => {
    expect(fs.readFileSync(appJsx, 'utf-8')).to.equal(appOutput);
    done();
  });

  it('creates an exampleChild2.jsx file', (done) => {
    expect(fs.existsSync(exampleCh2Jsx)).to.be.true;
    done();
  });

  it(`contents of exampleChild2.jsx are correct`, (done) => {
    expect(fs.readFileSync(exampleCh2Jsx, 'utf-8')).to.equal(exampleChildOutput);
    done();
  });
});

describe('Composer', () => {
  //setup test mocks and needed utils
  let curDir = path.join(__dirname, '../');
  let testFolder = fs.mkdtempSync(path.join(curDir, sep));
  let zipFile = path.join(testFolder, 'test.zip');
  console.log('zipFile', zipFile);

    
  before((done) => {
    let request = httpMocks.createRequest();
    request.onion = onion;
    let download = fs.createWriteStream(zipFile);
    compose.composer(request, download);
    
    download.on('unpipe', () => {
      done();
    });

  });

  // after((done) => {
  //   fs.unlinkSync(zipFile);
  //   fs.rmdirSync(testFolder);  
  //   done();  
  // });

  it('creates a zip file', () => {
    expect(fs.existsSync(zipFile)).to.be.true;
  });
  
  //addtional tests on the contents of the zip file to come!!  
});