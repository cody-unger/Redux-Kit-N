import React from 'react';
import store from '../reduxStore';
import unboundActions from '../actions';
import {bindActionCreators} from 'redux';
import OutputComponentListItemChild from './OutputComponentListItemChild';

let actions = bindActionCreators(unboundActions, store.dispatch);

class OutputComponentListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      editing: false,
      expanded: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({editing: false});
  }

  handleChange(event) {
    actions.updateComponentName(this.props.id, event.target.value);
  }

  handlePencilClick() {
    this.setState({editing: true});
  }

  handleCheckClick() {
    this.setState({editing: false});
  }

  handleMouseEnter() {
    this.setState({hover: true});
  }

  handleMouseLeave() {
    this.setState({hover: false});
  }

  handleClickRemove() {
    actions.removeComponent(this.props.id);
  }

  handleClickExpand() {
    this.setState({expanded: true});
  }

  handleClickHide() {
    this.setState({expanded: false});
  }

  handleDragStart(event) {
    event.dataTransfer.setData('text', this.props.id);
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData('text');
    data !== this.props.id && actions.addChildComponent({parent: this.props.id, child: data});
  }

  render() {
    return this.state.editing ? (
      <div className="outputComponentListItem">
        <form className="outputComponentListItemName" onSubmit={this.handleSubmit.bind(this)}>
          <input className="outputComponentListItemInput" onChange={this.handleChange.bind(this)} value={this.props.outputComponent.name}/>
        </form>
        <i className="material-icons pointer purple" onClick={this.handleCheckClick.bind(this)}>done</i>
      </div>
    ) : (
      <div>
        <div className="outputComponentListItem" onMouseEnter={this.handleMouseEnter.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}>
          <div className="outputComponentListItemName move"
            draggable="true"
            onDragStart={this.handleDragStart.bind(this)}
            onDragOver={this.handleDragOver.bind(this)}
            onDrop={this.handleDrop.bind(this)}>{this.props.outputComponent.name}</div>  
          {this.state.hover && this.state.expanded && <i className="material-icons pointer purple" onClick={this.handleClickHide.bind(this)}>keyboard_arrow_up</i>}
          {this.state.hover && !this.state.expanded && <i className="material-icons pointer purple" onClick={this.handleClickExpand.bind(this)}>keyboard_arrow_down</i>}
          {this.state.hover && <i className="material-icons pointer purple" onClick={this.handlePencilClick.bind(this)}>mode_edit</i>}
          {this.state.hover && this.props.id !== '0' && <i className="material-icons pointer purple" onClick={this.handleClickRemove.bind(this)}>clear</i>}

        </div>
        {this.state.expanded &&
          <div>
            {this.props.outputComponent.children.map((child, childIndex) => (
              <OutputComponentListItemChild parentComponentId={this.props.id} childIndex={childIndex} name={this.props.outputComponents[child.componentId].name} key={childIndex} />
            )
            )}
          </div>
        }
      </div>
    );

  }
}

export default OutputComponentListItem;
