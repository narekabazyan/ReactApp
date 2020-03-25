import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { SortableHandle } from 'react-sortable-hoc';
import _ from 'lodash';
import './ActiveLabel.scss'

const SortableDragger = SortableHandle(() => {
  return (
    <i className="label-drag ion-android-more-vertical"></i>
  );
})

class ActiveLabel extends Component {

  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleItemClick(e) {
    if (this.props.onClick) {
      this.props.onClick(this.props.value);
    }
  }

  handleRemoveClick(e) {
    e.stopPropagation();
    this.props.onRemove(this.props.value);
  }

  render() {

    let labelClass = this.props.clickable ? 'label-content clickable' : 'label-content';

    let dragger = this.props.draggable ? ( <SortableDragger /> ) : null;

    return (
      <div className="ActiveLabel" onClick={ this.handleItemClick }>
        <div className={ labelClass }>
          { dragger }
          <span></span>
          { this.props.name }
          <i className="label-close ion-close" onClick={ this.handleRemoveClick }></i>
        </div>
      </div>
    );
  }
}

ActiveLabel.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.any,
  clickable: React.PropTypes.bool,
  draggable: React.PropTypes.bool,
  onRemove: React.PropTypes.func.isRequired,
  onClick: React.PropTypes.func,
}

export default ActiveLabel;