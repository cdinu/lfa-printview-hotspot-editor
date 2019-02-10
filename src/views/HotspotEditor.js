import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/lib/Creatable';

import { updateHotspot } from '../actions/UIActions';
import NumberInput from './NumberInput';
import styles from './HotspotEditor.css';

class HotspotEditor extends Component {
  updateHotspot = (modif) => {
    const { page, selectedHotspot, selectedPage, selectedChapter, dispatch } = this.props;
    const oldHotspot = page.get('hotspots').get(selectedHotspot).toJS();
    const hotspot = Object.assign({}, oldHotspot, modif);
    for (const key in hotspot) {
      if (hotspot[key] === null) {
        delete hotspot[key];
      }
    }
    dispatch(updateHotspot(selectedChapter, selectedPage, selectedHotspot, hotspot));
  }

  updateAtom = (option) => {
    this.updateHotspot({ atom: (option && option.value) ? option.value : null });
  }

  updateType = (option) => {
    this.updateHotspot({ type: (option && option.value) ? option.value : null });
  }

  updateClass = (event) => {
    this.updateHotspot({ className: event.target.value || null });
  }

  updateValue = (key) => (event, number) => {
    this.updateHotspot({ [key]: number });
  }

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
          onChange={this.updateValue(value)}
        />
      </div>;
    });

    const typeOptions = ['video', 'audio', 'text', 'exercise', 'blank']
      .map(type => ({ value: type, label: type }));

    const { atom, type } = hotspot;

    return <div>
      <div className={styles.atom}>
        <span className={styles.atomLabel}>Atom:</span>
        <CreatableSelect
          className={styles.atomSelector}
          placeholder='Select an atom'
          value={atom && { value: atom, label: atom }}
          options={atomOptions}
          onChange={this.updateAtom}
        />
      </div>
      <div className={styles.type}>
        <span className={styles.typeLabel}>Type:</span>
        <CreatableSelect
          isClearable
          className={styles.typeSelector}
          placeholder='undefined'
          value={type && { value: type, label: type }}
          options={typeOptions}
          onChange={this.updateType}
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
  }
}

export default connect(state => ({
  selectedHotspot: state.ui.selectedHotspot,
  selectedPage: state.ui.selectedPage,
  selectedChapter: state.ui.selectedChapter,
}))(HotspotEditor);
