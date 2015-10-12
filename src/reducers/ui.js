import { SELECTED_CHAPTER_CHANGE, SELECTED_PAGE_CHANGE, SELECTED_HOTSPOT_CHANGE, INSERT_HOTSPOT, REMOVE_HOTSPOT } from '../constants/ActionTypes';

export function selectedChapter(state = null, action) {
  if (action.type === SELECTED_CHAPTER_CHANGE) {
    return action.value;
  }
  return state;
}

export function selectedPage(state = 0, action) {
  switch (action.type) {
    case SELECTED_PAGE_CHANGE:
      return action.value;
    case SELECTED_CHAPTER_CHANGE:
      return 0;
  }
  return state;
}

export function selectedHotspot(state = null, action) {
  switch (action.type) {
    case SELECTED_HOTSPOT_CHANGE:
      return action.value;
    case SELECTED_PAGE_CHANGE:
    case SELECTED_CHAPTER_CHANGE:
    case REMOVE_HOTSPOT:
      return null;
    case INSERT_HOTSPOT:
      return action.hotspot;
  }
  return state;
}
