import React, { Component } from 'react';
import { connect } from 'react-redux';

import { resizeHotspot } from '../actions/UIActions';
import styles from './Knob.css';

class Knob extends Component {
  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown = (e) => {
    if (e.button !== 0) { return; }
    this._oldX = e.pageX;
    this._oldY = e.pageY;
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
    const dx = (e.pageX - this._oldX) * 100 / size.width;
    const dy = (e.pageY - this._oldY) * 100 / size.height;
    this._oldX = e.pageX;
    this._oldY = e.pageY;

    const { top, bottom, left, right } = this.props;
    const deltaX = (left || right) ? (left ? -dx : dx) : 0;
    const deltaY = (top || bottom) ? (top ? -dy : dy) : 0;
    this.props.dispatch(resizeHotspot(deltaX, left, deltaY, top));
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    const { top, bottom, left, right } = this.props;

    const style = {
      top: top ? 0 : bottom ? '100%' : '50%',
      left: left ? 0 : right ? '100%' : '50%',
    };

    return <div
      draggable='true'
      className={styles.knob}
      style={style}
      onMouseDown={this.onMouseDown}
    />;
  }
}

export default connect()(Knob);
