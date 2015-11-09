import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import NumberInput from 'babel!react-number-input';

import { updateHotspot } from '../actions/UIActions';
import styles from './HotspotEditor.css';

export default connect(state => ({
  selectedHotspot: state.ui.selectedHotspot,
  selectedPage: state.ui.selectedPage,
  selectedChapter: state.ui.selectedChapter,
}))(

React.createClass({
  displayName: 'HotspotEditor',

  updateHotspot(modif) {
    const { page, selectedHotspot, selectedPage, selectedChapter, dispatch } = this.props;
    const oldHotspot = page.get('hotspots').get(selectedHotspot).toJS();
    const hotspot = Object.assign({}, oldHotspot, modif);
    for (const key in hotspot) {
      if (hotspot[key] === null) {
        delete hotspot[key];
      }
    }
    dispatch(updateHotspot(selectedChapter, selectedPage, selectedHotspot, hotspot));
  },

  updateAtom(atom) {
    this.updateHotspot({ atom });
  },

  updateType(type) {
    this.updateHotspot({ type: type || null });
  },

  updateClass(event) {
    this.updateHotspot({ className: event.target.value || null });
  },

  updateValue(key, event) {
    const number = parseFloat(event.target.value);
    if (isNaN(number)) {
      this.forceUpdate();
    } else {
      this.updateHotspot({ [key]: number });
    }
  },

  render() {
    const { selectedHotspot, page, chapter } = this.props;

    if (selectedHotspot === null) {
      return <div></div>;
    }

    const hotspot = page.get('hotspots').get(selectedHotspot).toJS();
    const atoms = chapter.get('atoms').toJS();
    const atomOptions = atoms.map(atom => ({ value: atom, label: atom }));

    const propEditors = ['top', 'left', 'width', 'height'].map(value => {
      const label = value.substr(0, 1).toUpperCase() + value.substr(1) + ':';

      return <div className={styles.value} key={value}>
        <span className={styles.valueLabel}>{label}</span>
        <NumberInput
          className={styles.valueInput}
          value={hotspot[value]}
          format='0.0000'
          onBlur={this.updateValue.bind(this, value)}
        />
      </div>;
    });

    const typeOptions = ['video', 'audio', 'text', 'exercise', 'blank']
      .map(type => ({ value: type, label: type }));

    return <div>
      <div className={styles.atom}>
        <span className={styles.atomLabel}>Atom:</span>
        <Select
          className={styles.atomSelector}
          placeholder='Select an atom'
          value={hotspot.atom}
          options={atomOptions}
          onChange={this.updateAtom}
          allowCreate
        />
      </div>
      <div className={styles.type}>
        <span className={styles.typeLabel}>Type:</span>
        <Select
          className={styles.typeSelector}
          placeholder='undefined'
          value={hotspot.type}
          options={typeOptions}
          onChange={this.updateType}
          clearable
          allowCreate
        />
      </div>
      <div className={styles.className}>
        <span className={styles.classNameLabel}>Class:</span>
        <input
          type='text'
          className={styles.classNameSelector}
          placeholder='undefined'
          value={hotspot.className}
          onChange={this.updateClass}
        />
      </div>
      {propEditors}
    </div>;
  },
}));
