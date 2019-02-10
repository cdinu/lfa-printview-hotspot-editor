import React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button } from 'react-bootstrap';

import { selectedPageChange } from '../actions/UIActions';
import styles from './PageSelector.css';

function PageSelector(props) {
  const { pageCount, selectedPage, dispatch } = props;

  const buttons = [];
  for (let i = 0; i < pageCount; i++) {
    const index = i;
    buttons.push(
      <Button
        key={index}
        active={index === selectedPage}
        onClick={() => {
          dispatch(selectedPageChange(index));
        }}
      >
        {index + 1}
      </Button>
    );
  }

  return (
    <ButtonGroup className={styles.buttonGroup}>
      {buttons}
    </ButtonGroup>
  );
}

export default connect()(PageSelector);
