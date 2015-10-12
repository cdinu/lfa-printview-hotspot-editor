import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Button } from 'react-bootstrap';

import { selectedHotspotChange, createHotspot, deleteHotspot } from '../actions/UIActions';
import styles from './HotspotSelector.css';

export default connect(state => ({
  selectedHotspot: state.ui.selectedHotspot,
}))(

React.createClass({
  displayName: 'HotspotSelector',

  selectionChanged(val) {
    this.props.dispatch(selectedHotspotChange(val ? val - 1 : null));
  },

  createHotspot() {
    const value = {
      atom: 'atom_name',
      top: 10,
      left: 10,
      width: 80,
      height: 20,
    };
    this.props.dispatch(createHotspot(value));
  },

  deleteHotspot() {
    this.props.dispatch(deleteHotspot());
  },

  render() {
    const { selectedHotspot, page } = this.props;

    const options = page.get('hotspots').map((hotspot, idx) => ({
      value: idx + 1,
      label: `Hotspot ${idx + 1}`,
    })).toJS();

    const deleteButton = (selectedHotspot === null) ? null :
      <Button onClick={this.deleteHotspot} className={styles.button}>
        <i className='fa fa-fw fa-trash'/>
      </Button>;

    return <div className={styles.container}>
      <Select
        className={styles.selector}
        placeholder='Select a hotspot'
        value={selectedHotspot === null ? null : selectedHotspot + 1}
        options={options}
        onChange={this.selectionChanged}
      />
      {deleteButton}
      <Button onClick={this.createHotspot} className={styles.button}>
        <i className='fa fa-fw fa-plus'/>
      </Button>
    </div>;
  },
}));
