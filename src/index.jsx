import 'whatwg-fetch';

import './css/index.sass';
import './css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

import React from 'react';
import ReactDom from 'react-dom';
import App from './views/App';

const reactContainer = document.createElement('div');
document.body.appendChild(reactContainer);
ReactDom.render(<App/>, reactContainer);
