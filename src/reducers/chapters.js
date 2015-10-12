import { API_CHAPTER_REQUEST, API_CHAPTER_SUCCESS, API_CHAPTER_ERROR,
  UPDATE_HOTSPOT, INSERT_HOTSPOT, REMOVE_HOTSPOT, API_SAVE_REQUEST } from '../constants/ActionTypes';

import Immutable from 'immutable';

export default function chapter(state = Immutable.Map({}), action) {
  switch (action.type) {
    case API_CHAPTER_REQUEST:
      return state.set(action.chapter, Immutable.Map({
        state: 'loading',
        name: action.chapter,
      }));

    case API_CHAPTER_SUCCESS:
      return state.set(action.chapter,
          action.response.set('state', 'success'));

    case API_CHAPTER_ERROR:
      return state.set(action.chapter, Immutable.Map({
        state: 'error',
        error: action.error,
        name: action.chapter,
      }));

    case UPDATE_HOTSPOT: {
      const hotspot = Immutable.fromJS(action.value);
      return state
        .setIn([
          action.chapter, 'pages',
          action.page, 'hotspots',
          action.hotspot], hotspot)
        .setIn([action.chapter, 'dirty'], true);
    }

    case INSERT_HOTSPOT: {
      const hotspot = Immutable.fromJS(action.value);
      return state
        .updateIn([
          action.chapter, 'pages',
          action.page, 'hotspots'],
          hotspots => hotspots.push(hotspot))
        .setIn([action.chapter, 'dirty'], true);
    }

    case REMOVE_HOTSPOT:
      return state
        .updateIn([
          action.chapter, 'pages',
          action.page, 'hotspots'],
          hotspots => hotspots.delete(action.hotspot))
        .setIn([action.chapter, 'dirty'], true);

    case API_SAVE_REQUEST:
      return state.map(ch => ch.set('dirty', false));
  }

  return state;
}
