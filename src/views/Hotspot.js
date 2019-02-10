import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { selectedHotspotChange, moveHotspot } from '../actions/UIActions';
import styles from './Hotspot.css';
import Knob from './Knob';

class Hotspot extends Component {
  onClick = () => {
    this.props.dispatch(selectedHotspotChange(this.props.hotspotIndex));
  }

  onMouseDown = (e) => {
    if (e.button !== 0 || !this.props.active) { return; }
    this.oldX = e.pageX;
    this.oldY = e.pageY;
    this._dragging = true;
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseUp = (e) => {
    this._dragging = false;
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseMove = (e) => {
    if (!this._dragging) { return; }
    const size = this.props.getSize();
    const dx = (e.pageX - this.oldX) * 100 / size.width;
    const dy = (e.pageY - this.oldY) * 100 / size.height;
    this.oldX = e.pageX;
    this.oldY = e.pageY;
    this.props.dispatch(moveHotspot(dx, dy));
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    const { hotspot, active } = this.props;
    const classes = classNames(styles.hotspot, { [styles.active]: active });
    const style = {
      top: hotspot.top + '%',
      left: hotspot.left + '%',
      width: hotspot.width + '%',
      height: hotspot.height + '%',
    };

    const knobs = active ? [
      <Knob getSize={this.props.getSize} key={0} top/>,
      <Knob getSize={this.props.getSize} key={1} bottom/>,
      <Knob getSize={this.props.getSize} key={2} left/>,
      <Knob getSize={this.props.getSize} key={3} right/>,
      <Knob getSize={this.props.getSize} key={4} top left/>,
      <Knob getSize={this.props.getSize} key={5} top right/>,
      <Knob getSize={this.props.getSize} key={6} bottom left/>,
      <Knob getSize={this.props.getSize} key={7} bottom right/>,
    ] : [];

    return <div className={classes} style={style}
      onClick={this.onClick}
      onMouseDown={this.onMouseDown}
      onMouseUp={this.onMouseUp}
      onMouseMove={this.onMouseMove}
    >
      {knobs}
    </div>;
  }
}

export default connect((state, props) => ({
  active: state.ui.selectedHotspot === props.hotspotIndex,
}))(Hotspot);
