import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import styles from './SaveButton.css';
import { save } from '../actions/APIActions';

function SaveButton({ chapters, dispatch }) {
  let enabled = false;
  chapters.forEach(ch => {
    if (ch.get('state') === 'success' && ch.get('dirty')) {
      enabled = true;
    }
  });

  return (
    <Button
      className={styles.button}
      onClick={() => dispatch(save())}
      disabled={!enabled}
    >
      <i className='fa fa-floppy-o'/>
    </Button>
  );
}

export default connect(state => ({
  chapters: state.chapters,
}))(SaveButton);
