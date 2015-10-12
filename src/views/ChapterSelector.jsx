import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import 'react-select/dist/default.css';

import { loadChapters } from '../actions/APIActions';
import { selectedChapterChange } from '../actions/UIActions';

import styles from './ChapterSelector.css';

export default connect(state => ({
  selectedChapter: state.ui.selectedChapter,
  chapters: state.chapterNames,
}))(

React.createClass({
  displayName: 'ChapterSelector',

  componentDidMount() {
    const { chapters, dispatch } = this.props;

    if (chapters.state === null) {
      dispatch(loadChapters());
    }
  },

  selectionChanged(val) {
    this.props.dispatch(selectedChapterChange(val));
  },

  render() {
    const { selectedChapter, chapters } = this.props;

    switch (chapters.state) {
      case 'error':
        return <div className={styles.chapterSelector}>Error: { chapters.error.toString() }</div>;

      case 'success':
        const options = chapters.chapters.map(ch => ({ value: ch, label: ch }));
        return <div className={styles.chapterSelector}>
          <Select
            placeholder='Select a chapter'
            value={selectedChapter}
            options={options}
            onChange={this.selectionChanged}
          />
        </div>;

      default:
        return <div className={styles.chapterSelector}>
          <i className='fa fa-spinner fa-spin'/>
          <span> Loading...</span>
        </div>;
    }
  },
}));
