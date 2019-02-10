import React from 'react';
import { connect } from 'react-redux';

import ChapterSelector from './ChapterSelector';
import NoChapterSelected from './NoChapterSelected';
import ChapterView from './ChapterView';
import SaveButton from './SaveButton';

import { Container, Row, Col } from 'react-bootstrap';

import styles from './Home.css';

function Home({ selectedChapter }) {
  return (
    <Container>
      <Row>
        <Col xs={12} className={styles.selectorCol}>
          <span className={styles.selectorLabel}>Chapter:</span>
          <ChapterSelector/>
          <SaveButton/>
        </Col>
      </Row>
      { selectedChapter ? <ChapterView
          key={selectedChapter}
          chapterName={selectedChapter}
        /> : <NoChapterSelected/> }
    </Container>
  );
}

export default connect(state => ({
  selectedChapter: state.ui.selectedChapter,
}))(Home);
