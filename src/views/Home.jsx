import React from 'react';
import { connect } from 'react-redux';

import ChapterSelector from './ChapterSelector';
import NoChapterSelected from './NoChapterSelected';
import ChapterView from './ChapterView';

import { Grid, Row, Col } from 'react-bootstrap';

import styles from './Home.css';

export default connect(state => ({
  selectedChapter: state.ui.selectedChapter,
}))(

React.createClass({
  displayName: 'Home',

  render() {
    const { selectedChapter } = this.props;

    return <Grid>
      <Row>
        <Col xs={12} className={styles.selectorCol}>
          <span className={styles.selectorLabel}>Chapter:</span>
          <ChapterSelector/>
        </Col>
      </Row>
      { selectedChapter ? <ChapterView
          key={selectedChapter}
          chapterName={selectedChapter}
        /> : <NoChapterSelected/> }
    </Grid>;
  },
}));
