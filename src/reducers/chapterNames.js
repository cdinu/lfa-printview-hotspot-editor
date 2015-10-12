import { API_CHAPTERS_REQUEST, API_CHAPTERS_SUCCESS, API_CHAPTERS_ERROR } from '../constants/ActionTypes';

const defaultValue = {
  state: null,
  error: null,
  chapters: null,
};

export default function chapters(state = defaultValue, action) {
  switch (action.type) {
    case API_CHAPTERS_REQUEST:
      return {
        state: 'loading',
        error: null,
        chapters: null,
      };
    case API_CHAPTERS_SUCCESS:
      return {
        state: 'success',
        error: null,
        chapters: action.response,
      };
    case API_CHAPTERS_ERROR:
      return {
        state: 'error',
        error: action.error,
        chapters: null,
      };
  }

  return state;
}
