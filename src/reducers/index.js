import { combineReducers } from 'redux';
import * as _ui from './ui';

export { default as chapterNames } from './chapterNames';
export { default as chapters } from './chapters';
export const ui = combineReducers(_ui);
