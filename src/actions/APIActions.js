import 'whatwg-fetch';
import Immutable from 'immutable';
import parseDirtyJSON from 'jsonic';
import stringifyDirtyJSON from 'stringify-object';

import {
  API_CHAPTERS_REQUEST, API_CHAPTERS_SUCCESS, API_CHAPTERS_ERROR,
  API_CHAPTER_REQUEST, API_CHAPTER_SUCCESS, API_CHAPTER_ERROR,
  API_SAVE_REQUEST, API_SAVE_SUCCESS, API_SAVE_ERROR } from '../constants/ActionTypes';

export const apiURL = 'http://localhost:3000';

export function apiChaptersRequest() {
  return { type: API_CHAPTERS_REQUEST };
}

export function apiChaptersError(error) {
  return { type: API_CHAPTERS_ERROR, error };
}

export function apiChaptersSuccess(response) {
  return { type: API_CHAPTERS_SUCCESS, response };
}

export function loadChapters() {
  return (dispatch) => {
    dispatch(apiChaptersRequest());
    fetch(apiURL + '/api/chapters')
      .then(data => data.json())
      .then(data => {
        dispatch(apiChaptersSuccess(data));
      })
      .catch(error => {
        dispatch(apiChaptersError(error));
      });
  };
}

export function apiChapterRequest(chapter) {
  return { type: API_CHAPTER_REQUEST, chapter };
}

export function apiChapterError(error, chapter) {
  return { type: API_CHAPTER_ERROR, error, chapter };
}

export function apiChapterSuccess(response, chapter) {
  return { type: API_CHAPTER_SUCCESS, response, chapter };
}

function matchMixin(haystack, needle, cb, repeat = false) {
  const r = needle.exec(haystack);
  if (r === null) { return; }

  const contentStart = r.index + r[0].length;

  const para = /\(|\)/g;
  para.lastIndex = contentStart;
  let paraMatch;
  let paraCount = 1;

  for (;;) {
    paraMatch = para.exec(haystack);
    if (!paraMatch) { break; }
    paraCount += (paraMatch[0] === '(') ? 1 : -1;

    if (paraCount === 0) {
      const contentEnd = paraMatch.index;
      cb(haystack.substring(contentStart, contentEnd), contentStart, r[1]);

      if (repeat) {
        needle.lastIndex = contentEnd;
        matchMixin(haystack, needle, cb, true);
      }
      return;
    }
  }
}

function jadeToChapter(name, jade) {
  let jadeStart;
  let jadeEnd;
  let jadeIndent;
  let hasSpread = false;
  let pages;
  const atoms = [];

  matchMixin(jade, /([ \t]*)\+print-spread\(/, (content, contentStart, whitespace) => {
    hasSpread = true;
    jadeStart = jade.substr(0, contentStart);
    jadeEnd = jade.substr(contentStart + content.length);
    jadeIndent = whitespace;
    pages = parseDirtyJSON(content);
    pages.forEach(page => {
      page.hotspots = page.hotspots || [];
    });
  });

  if (!hasSpread) {
    return Immutable.Map({ name, hasSpread });
  }

  matchMixin(jade, /([ \t]*)\+atom\(/g, content => {
    try {
      atoms.push(parseDirtyJSON(content).id);
    } catch (ex) {
      // Do nothing
    }
  }, true);

  return Immutable.fromJS({
    name,
    hasSpread,
    jadeStart, jadeEnd, jadeIndent,
    pages,
    atoms,
  });
}

export function loadChapter(chapter) {
  return dispatch => {
    dispatch(apiChapterRequest(chapter));
    fetch(apiURL + '/api/files/text/' + chapter)
      .then(data => data.text())
      .then(jadeToChapter.bind(null, chapter))
      .then(data => {
        dispatch(apiChapterSuccess(data, chapter));
      })
      .catch(error => {
        dispatch(apiChapterError(error, chapter));
      });
  };
}

export function apiSaveRequest() {
  return { type: API_SAVE_REQUEST };
}

export function apiSaveError(error) {
  return { type: API_SAVE_ERROR, error };
}

export function apiSaveSuccess(response) {
  return { type: API_SAVE_SUCCESS, response };
}

export function save() {
  return (dispatch, getState) => {
    const state = getState();
    const postData = state.chapters
      .filter(ch => ch.get('state') === 'success' && ch.get('dirty'))
      .map(ch => {
        const pages = ch.get('pages').toJS();
        const jadeStart = ch.get('jadeStart');
        const jadeEnd = ch.get('jadeEnd');
        const jadeIndent = ch.get('jadeIndent');

        pages.forEach(page => {
          page.hotspots.forEach(hotspot => {
            for (const key in hotspot) {
              const val = hotspot[key];
              if (typeof val === 'number') {
                hotspot[key] = Math.round(val * 10000) / 10000;
              }
            }
          });
        });

        const innerData = stringifyDirtyJSON(pages, { indent: '  ' })
          .split('\n')
          .map((line, idx) => idx ? jadeIndent + line : line)
          .join('\n');
        return [jadeStart, innerData, jadeEnd].join('');
      })
      .toJS();

    dispatch(apiSaveRequest());
    fetch(apiURL + '/api/chapters', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then(data => data.json())
      .then(data => {
        dispatch(apiSaveSuccess(data));
      })
      .catch(error => {
        console.error(error);
        dispatch(apiSaveError(error));
      });
  };
}
