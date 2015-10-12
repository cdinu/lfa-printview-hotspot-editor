import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import styles from './SaveButton.css';
import { save } from '../actions/APIActions';

export default connect(state => ({
  chapters: state.chapters,
}))(

React.createClass({
  displayName: 'SaveButton',

  save() {
    this.props.dispatch(save());
  },

  render() {
    let enabled = false;
    this.props.chapters.forEach(ch => {
      if (ch.get('state') === 'success' && ch.get('dirty')) {
        enabled = true;
      }
    });

    return <Button
      className={styles.button}
      onClick={this.save}
      disabled={!enabled}
    >
      <i className='fa fa-floppy-o'/>
    </Button>;
  },
}));
