import { SELECTED_CHAPTER_CHANGE, SELECTED_PAGE_CHANGE, SELECTED_HOTSPOT_CHANGE,
  UPDATE_HOTSPOT, INSERT_HOTSPOT, REMOVE_HOTSPOT } from '../constants/ActionTypes';

export function selectedChapterChange(value) {
  return { type: SELECTED_CHAPTER_CHANGE, value };
}

export function selectedPageChange(value) {
  return { type: SELECTED_PAGE_CHANGE, value };
}

export function selectedHotspotChange(value) {
  return { type: SELECTED_HOTSPOT_CHANGE, value };
}

export function updateHotspot(chapter, page, hotspot, value) {
  return { type: UPDATE_HOTSPOT, chapter, page, hotspot, value };
}

export function insertHotspot(chapter, page, hotspot, value) {
  return { type: INSERT_HOTSPOT, chapter, page, hotspot, value };
}

export function removeHotspot(chapter, page, hotspot) {
  return { type: REMOVE_HOTSPOT, chapter, page, hotspot };
}

export function moveHotspot(dx, dy) {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedChapter, selectedPage, selectedHotspot } = state.ui;
    const hotspot = state.chapters
      .get(selectedChapter)
      .get('pages')
      .get(selectedPage)
      .get('hotspots')
      .get(selectedHotspot)
      .toJS();

    hotspot.left += dx;
    hotspot.top += dy;
    dispatch(updateHotspot(selectedChapter, selectedPage, selectedHotspot, hotspot));
  };
}

export function resizeHotspot(deltaX, moveX, deltaY, moveY) {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedChapter, selectedPage, selectedHotspot } = state.ui;
    const hotspot = state.chapters
      .get(selectedChapter)
      .get('pages')
      .get(selectedPage)
      .get('hotspots')
      .get(selectedHotspot)
      .toJS();

    if (deltaX + hotspot.width < 0) { deltaX = -hotspot.width; }
    if (deltaY + hotspot.height < 0) { deltaY = -hotspot.height; }
    hotspot.width += deltaX;
    hotspot.height += deltaY;
    if (moveX) { hotspot.left -= deltaX; }
    if (moveY) { hotspot.top -= deltaY; }

    dispatch(updateHotspot(selectedChapter, selectedPage, selectedHotspot, hotspot));
  };
}

export function createHotspot(value) {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedChapter, selectedPage } = state.ui;
    const position = state.chapters
      .get(selectedChapter)
      .get('pages')
      .get(selectedPage)
      .get('hotspots')
      .size;

    dispatch(insertHotspot(selectedChapter, selectedPage, position, value));
  };
}

export function deleteHotspot() {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedChapter, selectedPage, selectedHotspot } = state.ui;

    if (selectedHotspot !== null) {
      dispatch(removeHotspot(selectedChapter, selectedPage, selectedHotspot));
    }
  };
}
