import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import { loadChapter } from '../actions/APIActions';
import PageSelector from './PageSelector';
import PageView from './PageView';
import HotspotSelector from './HotspotSelector';
import HotspotEditor from './HotspotEditor';

class ChapterView extends Component {
  componentWillMount() {
    const { chapter, dispatch, chapterName } = this.props;
    const state = chapter ? chapter.get('state') : null;
    if (!state || state === 'error') {
      dispatch(loadChapter(chapterName));
    }
  }

  render() {
    const { chapter, page } = this.props;
    if (!chapter) { return <div/>; }

    const state = chapter.get('state');

    if (state === 'loading') {
      return <div>
        <i className='fa fa-spinner fa-spin'/>
        <span> Loading...</span>
      </div>;
    }

    if (state === 'error') {
      return <div>Error: { chapter.get('error').toString() }</div>;
    }

    if (chapter.get('hasSpread') === false) {
      return <div>This chapter does not contain +print-spread</div>;
    }

    const pageCount = chapter.get('pages').size;
    const pageObj = chapter.get('pages').get(page);

    return <Row>
      <Col sm={9}>
        <PageView pageNumber={page} chapter={chapter}/>
      </Col>
      <Col sm={3}>
        <div>
          <p><strong>Page:</strong></p>
          <PageSelector selectedPage={page} pageCount={pageCount}/>
          <p><strong>Hotspot:</strong></p>
          <HotspotSelector page={pageObj}/>
          <HotspotEditor page={pageObj} chapter={chapter}/>
        </div>
      </Col>
    </Row>;
  }
}

export default connect((state, props) => ({
  chapter: state.chapters.get(props.chapterName),
  page: state.ui.selectedPage,
}))(ChapterView);
