import React from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button } from 'react-bootstrap';

import { selectedPageChange } from '../actions/UIActions';
import styles from './PageSelector.css';

export default connect()(

React.createClass({
  displayName: 'PageSelector',

  buttonPressed(i) {
    this.props.dispatch(selectedPageChange(i));
  },

  render() {
    const { pageCount, selectedPage } = this.props;

    const buttons = [];
    for (let i = 0; i < pageCount; i++) {
      buttons.push(<Button
          key={i}
          active={i === selectedPage}
          onClick={this.buttonPressed.bind(this, i)}
        >{i + 1}</Button>);
    }

    return <ButtonGroup className={styles.buttonGroup}>
      {buttons}
    </ButtonGroup>;
  },
}));
